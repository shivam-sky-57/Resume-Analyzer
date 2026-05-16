package com.resume.analyzer.repository;

import com.resume.analyzer.entity.JobSuggestion;
import com.resume.analyzer.entity.ResumeAnalysis;
import com.resume.analyzer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobSuggestionRepository extends JpaRepository<JobSuggestion, Long> {
    List<JobSuggestion> findByAnalysis(ResumeAnalysis analysis);
    List<JobSuggestion> findByUserOrderByCreatedAtDesc(User user);
}
