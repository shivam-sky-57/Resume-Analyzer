package com.resume.analyzer.controller;

import com.resume.analyzer.entity.ResumeAnalysis;
import com.resume.analyzer.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(resumeService.processResume(file));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(java.util.Map.of(
                "error", e.getMessage(),
                "type", e.getClass().getSimpleName()
            ));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<ResumeAnalysis>> getHistory() {
        return ResponseEntity.ok(resumeService.getHistoryForCurrentUser());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAnalysis(@PathVariable Long id) {
        ResumeAnalysis ra = resumeService.getAnalysisById(id);
        if (ra == null) return ResponseEntity.status(404).body("Not found");
        
        return ResponseEntity.ok(java.util.Map.of(
            "id", ra.getId(),
            "resumeFilename", ra.getResumeFilename(),
            "overallScore", ra.getOverallScore(),
            "analysisJson", ra.getAnalysisJson(),
            "createdAt", ra.getCreatedAt()
        ));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnalysis(@PathVariable Long id) {
        resumeService.deleteAnalysis(id);
        return ResponseEntity.ok(java.util.Map.of("message", "Deleted successfully"));
    }
}
