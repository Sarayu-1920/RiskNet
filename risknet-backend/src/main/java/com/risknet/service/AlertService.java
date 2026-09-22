package com.risknet.service;

import com.risknet.entity.Alert;
import com.risknet.entity.InvestigationCase;
import com.risknet.repository.AlertRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlertService {

    private final AlertRepository alertRepository;
    private final CaseService caseService;

    public AlertService(
            AlertRepository alertRepository,
            CaseService caseService) {

        this.alertRepository = alertRepository;
        this.caseService = caseService;
    }

    // Create a new alert
    public Alert saveAlert(Alert alert) {
        return alertRepository.save(alert);
    }

    // Get all alerts
    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }

    // Get alert by ID
    public Optional<Alert> getAlertById(Long id) {
        return alertRepository.findById(id);
    }

    // Delete alert
    public void deleteAlert(Long id) {
        alertRepository.deleteById(id);
    }

    // Create risk alert without duplicates
    public Alert createRiskAlert(
            Long applicantId,
            double riskScore,
            String riskLevel,
            String reason) {

        Optional<Alert> existingAlert =
                alertRepository.findByApplicantIdAndStatus(
                        applicantId,
                        "OPEN"
                );

        // If an OPEN alert already exists, reuse it
        if (existingAlert.isPresent()) {
            return existingAlert.get();
        }

        // Create new alert
        Alert alert = new Alert();

        alert.setApplicantId(applicantId);
        alert.setRiskScore(riskScore);
        alert.setRiskLevel(riskLevel);
        alert.setStatus("OPEN");
        alert.setReason(reason);

        Alert savedAlert = alertRepository.save(alert);

        // Create investigation case automatically
        String priority = riskLevel;

        String assignedTo = "Analyst1";

        String remarks =
                "Automatically created from graph-based risk alert.";

        InvestigationCase investigationCase =
                caseService.createCaseFromAlert(
                        savedAlert.getId(),
                        priority,
                        assignedTo,
                        remarks
                );

        System.out.println(
                "Investigation case created with ID: "
                        + investigationCase.getId()
        );

        return savedAlert;
    }
}