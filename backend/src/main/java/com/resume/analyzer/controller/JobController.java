package com.resume.analyzer.controller;

import com.resume.analyzer.entity.JobSuggestion;
import com.resume.analyzer.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping("/suggest")
    public ResponseEntity<List<JobSuggestion>> suggest(@RequestParam(name = "query") String skills, @RequestParam(required = false) Long analysisId) {
        return ResponseEntity.ok(jobService.suggestJobs(skills, analysisId));
    }
}
