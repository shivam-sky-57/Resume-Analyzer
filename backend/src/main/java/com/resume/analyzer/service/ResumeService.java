package com.resume.analyzer.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resume.analyzer.entity.ResumeAnalysis;
import com.resume.analyzer.entity.User;
import com.resume.analyzer.repository.ResumeAnalysisRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ResumeService {

    @Autowired
    private ResumeAnalysisRepository repository;

    @Autowired
    private AuthService authService;

    @Value("${groq.api.key}")
    private String groqApiKey;

    @Value("${groq.api.url:https://api.groq.com/openai/v1/chat/completions}")
    private String groqApiUrl;

    @Value("${groq.model:openai/gpt-oss-120b}")
    private String groqModel;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // In-memory lock to handle simultaneous requests from the same user for the same file
    private static final java.util.concurrent.ConcurrentHashMap<String, Long> processingLocks = new java.util.concurrent.ConcurrentHashMap<>();

    @org.springframework.transaction.annotation.Transactional
    public ResumeAnalysis processResume(MultipartFile file) throws IOException {
        User user = authService.getCurrentUser();
        if (user == null) {
            throw new RuntimeException("User not authenticated");
        }

        String lockKey = (user.getId() + "_" + file.getOriginalFilename()).intern();
        synchronized (lockKey) {
            long now = System.currentTimeMillis();
            
            // If this exact file was processed by this user in the last 10 seconds, block duplicate
            Long lastProcessed = processingLocks.get(lockKey);
            if (lastProcessed != null && (now - lastProcessed) < 10000) {
                System.out.println("SIMULTANEOUS UPLOAD BLOCKED IN-MEMORY: " + file.getOriginalFilename());
                ResumeAnalysis existing = repository.findFirstByUserOrderByCreatedAtDesc(user).orElse(null);
                if (existing != null) {
                    return existing;
                }
            }
            
            processingLocks.put(lockKey, now);
            
            try {
                String text = extractTextFromPdf(file);
                String analysisJson = analyzeWithGroq(text);
                
                int score = 0;
                try {
                    Map<String, Object> map = objectMapper.readValue(analysisJson, Map.class);
                    Object scoreObj = map.get("overallScore");
                    if (scoreObj instanceof Number) {
                        score = ((Number) scoreObj).intValue();
                    } else if (scoreObj instanceof String) {
                        score = Integer.parseInt((String) scoreObj);
                    }
                } catch (Exception e) {
                    System.err.println("Failed to parse overallScore from Groq: " + e.getMessage());
                    score = 75; // Fallback score
                }

                ResumeAnalysis analysis = new ResumeAnalysis();
                analysis.setUser(user);
                analysis.setResumeFilename(file.getOriginalFilename());
                analysis.setResumeText(text);
                analysis.setOverallScore(score);
                analysis.setAnalysisJson(analysisJson);

                try {
                    return repository.save(analysis);
                } catch (Exception e) {
                    throw new RuntimeException("Database error: Failed to save analysis results. " + e.getMessage());
                }
            } finally {
                // Processing done
            }
        }
    }

    public void deleteAnalysis(Long id) {
        repository.deleteById(id);
    }

    private String extractTextFromPdf(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            if (text == null || text.trim().isEmpty()) {
                throw new RuntimeException("Empty PDF: Could not extract any text from the uploaded file.");
            }
            return text;
        } catch (Exception e) {
            throw new IOException("PDF Parsing error: " + e.getMessage());
        }
    }

    private String analyzeWithGroq(String text) {
        if (groqApiKey == null || groqApiKey.trim().isEmpty() || 
            groqApiKey.toLowerCase().contains("your_") || groqApiKey.toLowerCase().contains("placeholder")) {
            throw new RuntimeException("Configuration error: Groq API Key is not set in backend/.env. Please replace 'your_groq_api_key_here' with your real key from console.groq.com (starts with 'gsk_').");
        }

        String systemPrompt = "You are an expert ATS (Applicant Tracking System) and professional technical resume analyst. " +
                "You must analyze the provided resume text and return a JSON object with EXACTLY the following structure:\n" +
                "{\n" +
                "  \"overallScore\": <integer between 0 and 100>,\n" +
                "  \"sectionScores\": {\n" +
                "    \"skills\": <integer 0-100>,\n" +
                "    \"experience\": <integer 0-100>,\n" +
                "    \"education\": <integer 0-100>,\n" +
                "    \"summary\": <integer 0-100>,\n" +
                "    \"formatting\": <integer 0-100>\n" +
                "  },\n" +
                "  \"atsScore\": <integer 0-100>,\n" +
                "  \"keywordsFound\": [<string>, ...],\n" +
                "  \"keywordsMissing\": [<string>, ...],\n" +
                "  \"strengths\": [<string>, ... (max 5 items)],\n" +
                "  \"improvements\": [<string>, ... (max 5 items)],\n" +
                "  \"label\": <string: \"Excellent\" | \"Good\" | \"Needs work\">\n" +
                "}\n" +
                "Output ONLY valid JSON. Do NOT include any explanations, markdown code blocks, or text outside the JSON object.";

        String userPrompt = "Analyze this resume text:\n\n" + text;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey.trim());

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", groqModel != null && !groqModel.isEmpty() ? groqModel : "openai/gpt-oss-120b");
        requestBody.put("temperature", 0.2);

        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> sysMsg = new HashMap<>();
        sysMsg.put("role", "system");
        sysMsg.put("content", systemPrompt);
        messages.add(sysMsg);

        Map<String, String> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", userPrompt);
        messages.add(userMsg);

        requestBody.put("messages", messages);

        // Request JSON mode from Groq
        Map<String, String> responseFormat = new HashMap<>();
        responseFormat.put("type", "json_object");
        requestBody.put("response_format", responseFormat);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(groqApiUrl, entity, String.class);
            
            Map<String, Object> responseMap = objectMapper.readValue(response.getBody(), Map.class);
            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseMap.get("choices");
            if (choices == null || choices.isEmpty()) {
                throw new RuntimeException("No response generated by Groq API.");
            }
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            String content = (String) message.get("content");
            if (content == null || content.trim().isEmpty()) {
                throw new RuntimeException("Empty response content received from Groq API.");
            }

            // Strip any wrapping markdown formatting if present
            String cleaned = content.trim();
            if (cleaned.startsWith("```json")) {
                cleaned = cleaned.substring(7);
            } else if (cleaned.startsWith("```")) {
                cleaned = cleaned.substring(3);
            }
            if (cleaned.endsWith("```")) {
                cleaned = cleaned.substring(0, cleaned.length() - 3);
            }
            return cleaned.trim();
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            String errorBody = e.getResponseBodyAsString();
            System.err.println("Groq API HTTP Error " + e.getStatusCode() + ": " + errorBody);
            throw new RuntimeException("Groq API error (" + e.getStatusCode() + "): " + (errorBody.isEmpty() ? e.getMessage() : errorBody));
        } catch (Exception e) {
            System.err.println("Groq Analysis failed: " + e.getMessage());
            throw new RuntimeException("Groq Analysis failed: " + e.getMessage());
        }
    }

    public List<ResumeAnalysis> getHistory(User user) {
        return repository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<ResumeAnalysis> getHistoryForCurrentUser() {
        User user = authService.getCurrentUser();
        return repository.findByUserOrderByCreatedAtDesc(user);
    }

    public ResumeAnalysis getAnalysisById(Long id) {
        return repository.findById(id).orElse(null);
    }
}
