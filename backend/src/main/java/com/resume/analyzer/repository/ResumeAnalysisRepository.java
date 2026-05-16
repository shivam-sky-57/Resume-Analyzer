package com.resume.analyzer.repository;

import com.resume.analyzer.entity.ResumeAnalysis;
import com.resume.analyzer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis, Long> {
    List<ResumeAnalysis> findByUserOrderByCreatedAtDesc(User user);
    java.util.Optional<ResumeAnalysis> findFirstByUserOrderByCreatedAtDesc(User user);
}
