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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ResumeService {

    @Autowired
    private ResumeAnalysisRepository repository;

    @Autowired
    private AuthService authService;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

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

        String lockKey = user.getId() + "_" + file.getOriginalFilename();
        long now = System.currentTimeMillis();
        
        // If this exact file is already being processed by this user in the last 15 seconds, block it
        Long lastProcessed = processingLocks.get(lockKey);
        if (lastProcessed != null && (now - lastProcessed) < 15000) {
            System.out.println("SIMULTANEOUS UPLOAD BLOCKED IN-MEMORY: " + file.getOriginalFilename());
            // Try to find the last one from DB as fallback
            return repository.findFirstByUserOrderByCreatedAtDesc(user).orElse(null);
        }
        
        processingLocks.put(lockKey, now);
        
        try {
            String text = extractTextFromPdf(file);
            String analysisJson = analyzeWithGemini(text);
            
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
                System.err.println("Failed to parse overallScore from Gemini: " + e.getMessage());
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
            // Processing done, but we keep the lock in the map for 15s expiration check
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

    private String analyzeWithGemini(String text) {
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty() || geminiApiKey.contains("YOUR_API_KEY")) {
            throw new RuntimeException("Configuration error: Gemini API Key is missing or invalid.");
        }

        String prompt = "Analyse the following resume and return a JSON object with these fields:\n" +
                "- overallScore (int 0–100)\n" +
                "- sectionScores: { skills, experience, education, summary, formatting } (each int 0–100)\n" +
                "- atsScore (int 0–100)\n" +
                "- keywordsFound (array of strings)\n" +
                "- keywordsMissing (array of strings)\n" +
                "- strengths (array of strings, max 5)\n" +
                "- improvements (array of strings, max 5)\n" +
                "- label (string: \"Excellent\" | \"Good\" | \"Needs work\")\n" +
                "\n" +
                "Resume text:\n" + text + "\n" +
                "\nIMPORTANT: Return ONLY valid JSON. No markdown backticks.";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> contents = new HashMap<>();
        Map<String, Object> parts = new HashMap<>();
        parts.put("text", prompt);
        contents.put("parts", new Object[]{parts});

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", new Object[]{contents});

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            String url = geminiApiUrl + "?key=" + geminiApiKey;
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            
            Map<String, Object> responseMap = objectMapper.readValue(response.getBody(), Map.class);
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseMap.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> resParts = (List<Map<String, Object>>) content.get("parts");
            return (String) resParts.get(0).get("text");
        } catch (Exception e) {
            System.err.println("Gemini Analysis failed: " + e.getMessage());
            throw new RuntimeException("Gemini Analysis failed: " + e.getMessage());
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
