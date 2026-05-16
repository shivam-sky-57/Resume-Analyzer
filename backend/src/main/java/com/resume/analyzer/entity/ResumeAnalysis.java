package com.resume.analyzer.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "resume_analyses")
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "resume_filename")
    private String resumeFilename;

    @Column(name = "resume_text", columnDefinition = "TEXT")
    private String resumeText;

    @Column(name = "overall_score")
    private Integer overallScore;

    @Column(name = "analysis_json", columnDefinition = "TEXT")
    private String analysisJson;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public ResumeAnalysis() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getResumeFilename() { return resumeFilename; }
    public void setResumeFilename(String resumeFilename) { this.resumeFilename = resumeFilename; }
    public String getResumeText() { return resumeText; }
    public void setResumeText(String resumeText) { this.resumeText = resumeText; }
    public Integer getOverallScore() { return overallScore; }
    public void setOverallScore(Integer overallScore) { this.overallScore = overallScore; }
    public String getAnalysisJson() { return analysisJson; }
    public void setAnalysisJson(String analysisJson) { this.analysisJson = analysisJson; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
