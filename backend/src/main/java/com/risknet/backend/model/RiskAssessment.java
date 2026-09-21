package com.risknet.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "risk_assessment")
public class RiskAssessment {

    @Id
    @Column(name = "assessment_id")
    private UUID assessmentId;

    @ManyToOne
    @JoinColumn(name = "applicant_id")
    private Applicant applicant;

    @Column(name = "isolation_forest_score", precision = 6, scale = 4)
    private BigDecimal isolationForestScore;

    @Column(name = "risk_score", precision = 5, scale = 2)
    private BigDecimal riskScore;

    @Column(name = "risk_level", length = 20)
    private String riskLevel;

    @Column(name = "degree_centrality", precision = 8, scale = 6)
    private BigDecimal degreeCentrality;

    @Column(name = "community_id")
    private Integer communityId;

    @Column(name = "connected_applicants")
    private Integer connectedApplicants;

    @Column(name = "assessed_at")
    private LocalDateTime assessedAt;

    public RiskAssessment() {
    }

    // Getters and setters

    public UUID getAssessmentId() {
        return assessmentId;
    }

    public void setAssessmentId(UUID assessmentId) {
        this.assessmentId = assessmentId;
    }

    public Applicant getApplicant() {
        return applicant;
    }

    public void setApplicant(Applicant applicant) {
        this.applicant = applicant;
    }

    public BigDecimal getIsolationForestScore() {
        return isolationForestScore;
    }

    public void setIsolationForestScore(BigDecimal isolationForestScore) {
        this.isolationForestScore = isolationForestScore;
    }

    public BigDecimal getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(BigDecimal riskScore) {
        this.riskScore = riskScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public BigDecimal getDegreeCentrality() {
        return degreeCentrality;
    }

    public void setDegreeCentrality(BigDecimal degreeCentrality) {
        this.degreeCentrality = degreeCentrality;
    }

    public Integer getCommunityId() {
        return communityId;
    }

    public void setCommunityId(Integer communityId) {
        this.communityId = communityId;
    }

    public Integer getConnectedApplicants() {
        return connectedApplicants;
    }

    public void setConnectedApplicants(Integer connectedApplicants) {
        this.connectedApplicants = connectedApplicants;
    }

    public LocalDateTime getAssessedAt() {
        return assessedAt;
    }

    public void setAssessedAt(LocalDateTime assessedAt) {
        this.assessedAt = assessedAt;
    }
}