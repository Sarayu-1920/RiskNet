package com.risknet.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "analyst_decision")
public class AnalystDecision {

    @Id
    @Column(name = "decision_id")
    private UUID decisionId;

    @ManyToOne
    @JoinColumn(name = "case_id", nullable = false)
    private InvestigationCase investigationCase;

    @Column(name = "analyst_name", nullable = false, length = 100)
    private String analystName;

    @Column(nullable = false, length = 20)
    private String decision;

    @Column(name = "decision_reason", columnDefinition = "TEXT")
    private String decisionReason;

    @Column(name = "decided_at")
    private LocalDateTime decidedAt;

    public AnalystDecision() {
    }

    // Getters and setters

    public UUID getDecisionId() {
        return decisionId;
    }

    public void setDecisionId(UUID decisionId) {
        this.decisionId = decisionId;
    }

    public InvestigationCase getInvestigationCase() {
        return investigationCase;
    }

    public void setInvestigationCase(InvestigationCase investigationCase) {
        this.investigationCase = investigationCase;
    }

    public String getAnalystName() {
        return analystName;
    }

    public void setAnalystName(String analystName) {
        this.analystName = analystName;
    }

    public String getDecision() {
        return decision;
    }

    public void setDecision(String decision) {
        this.decision = decision;
    }

    public String getDecisionReason() {
        return decisionReason;
    }

    public void setDecisionReason(String decisionReason) {
        this.decisionReason = decisionReason;
    }

    public LocalDateTime getDecidedAt() {
        return decidedAt;
    }

    public void setDecidedAt(LocalDateTime decidedAt) {
        this.decidedAt = decidedAt;
    }
}