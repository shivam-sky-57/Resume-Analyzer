package com.resume.analyzer.service;

import com.resume.analyzer.entity.JobSuggestion;
import com.resume.analyzer.entity.ResumeAnalysis;
import com.resume.analyzer.entity.User;
import com.resume.analyzer.repository.JobSuggestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class JobService {

    @Autowired
    private JobSuggestionRepository repository;

    @Autowired
    private AuthService authService;

    @Value("${adzuna.app.id}")
    private String adzunaAppId;

    @Value("${adzuna.api.key}")
    private String adzunaApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<JobSuggestion> suggestJobs(String skills, Long analysisId) {
        String encodedSkills = java.net.URLEncoder.encode(skills, java.nio.charset.StandardCharsets.UTF_8);
        // Using adzuna.in for Indian jobs as verified in curl
        String url = String.format(
            "https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=%s&app_key=%s&what=%s&results_per_page=6&content-type=application/json",
            adzunaAppId, adzunaApiKey, encodedSkills
        );

        User user = authService.getCurrentUser();
        List<JobSuggestion> suggestions = new ArrayList<>();

        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response == null || !response.containsKey("results")) {
                return suggestions;
            }
            List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");

            for (Map<String, Object> res : results) {
                JobSuggestion suggestion = new JobSuggestion();
                suggestion.setUser(user);
                suggestion.setJobTitle((String) res.get("title"));
                
                // Safe extraction for company and location
                Map<String, Object> companyMap = (Map<String, Object>) res.get("company");
                suggestion.setCompany(companyMap != null ? (String) companyMap.get("display_name") : "Hiring Company");
                
                Map<String, Object> locationMap = (Map<String, Object>) res.get("location");
                suggestion.setLocation(locationMap != null ? (String) locationMap.get("display_name") : "Remote / India");
                
                suggestion.setJobUrl((String) res.get("redirect_url"));
                suggestion.setMatchPercent(80 + (int)(Math.random() * 15)); // Simulated match %
                
                // We return them to the UI directly without saving every single search to DB
                suggestions.add(suggestion);
            }
        } catch (Exception e) {
            System.err.println("Job Suggestion Error: " + e.getMessage());
        }

        return suggestions;
    }
}
