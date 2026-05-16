package com.resume.analyzer.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_suggestions")
public class JobSuggestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "analysis_id")
    private ResumeAnalysis analysis;

    @Column(name = "job_title")
    private String jobTitle;

    @Column(name = "company")
    private String company;

    @Column(name = "location")
    private String location;

    @Column(name = "job_url", columnDefinition = "TEXT")
    private String jobUrl;

    @Column(name = "match_percent")
    private Integer matchPercent;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public JobSuggestion() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public ResumeAnalysis getAnalysis() { return analysis; }
    public void setAnalysis(ResumeAnalysis analysis) { this.analysis = analysis; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getJobUrl() { return jobUrl; }
    public void setJobUrl(String jobUrl) { this.jobUrl = jobUrl; }
    public Integer getMatchPercent() { return matchPercent; }
    public void setMatchPercent(Integer matchPercent) { this.matchPercent = matchPercent; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
