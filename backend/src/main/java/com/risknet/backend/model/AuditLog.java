package com.risknet.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_log")
public class AuditLog {

    @Id
    @Column(name = "audit_id")
    private UUID auditId;

    @ManyToOne
    @JoinColumn(name = "applicant_id")
    private Applicant applicant;

    @ManyToOne
    @JoinColumn(name = "alert_id")
    private Alert alert;

    @ManyToOne
    @JoinColumn(name = "case_id")
    private InvestigationCase investigationCase;

    @ManyToOne
    @JoinColumn(name = "decision_id")
    private AnalystDecision decision;

    @Column(nullable = false, length = 100)
    private String action;

    @Column(name = "performed_by", nullable = false, length = 100)
    private String performedBy;

    @Column(name = "action_timestamp")
    private LocalDateTime actionTimestamp;

    @Column(columnDefinition = "TEXT")
    private String details;

    public AuditLog() {
    }

    // Getters and setters

    public UUID getAuditId() {
        return auditId;
    }

    public void setAuditId(UUID auditId) {
        this.auditId = auditId;
    }

    public Applicant getApplicant() {
        return applicant;
    }

    public void setApplicant(Applicant applicant) {
        this.applicant = applicant;
    }

    public Alert getAlert() {
        return alert;
    }

    public void setAlert(Alert alert) {
        this.alert = alert;
    }

    public InvestigationCase getInvestigationCase() {
        return investigationCase;
    }

    public void setInvestigationCase(InvestigationCase investigationCase) {
        this.investigationCase = investigationCase;
    }

    public AnalystDecision getDecision() {
        return decision;
    }

    public void setDecision(AnalystDecision decision) {
        this.decision = decision;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }

    public LocalDateTime getActionTimestamp() {
        return actionTimestamp;
    }

    public void setActionTimestamp(LocalDateTime actionTimestamp) {
        this.actionTimestamp = actionTimestamp;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}