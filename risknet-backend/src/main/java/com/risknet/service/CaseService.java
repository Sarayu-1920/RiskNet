package com.risknet.service;

import com.risknet.entity.InvestigationCase;
import com.risknet.repository.InvestigationCaseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CaseService {

    private final InvestigationCaseRepository caseRepository;

    public CaseService(InvestigationCaseRepository caseRepository) {
        this.caseRepository = caseRepository;
    }

    // Create case
    public InvestigationCase saveCase(
            InvestigationCase investigationCase) {

        return caseRepository.save(investigationCase);
    }

    // Get all cases
    public List<InvestigationCase> getAllCases() {

        return caseRepository.findAll();
    }

    // Get case by ID
    public Optional<InvestigationCase> getCaseById(Long id) {

        return caseRepository.findById(id);
    }

    // Delete case
    public void deleteCase(Long id) {

        caseRepository.deleteById(id);
    }

    // Create investigation case from an alert
    public InvestigationCase createCaseFromAlert(
            Long alertId,
            String priority,
            String assignedTo,
            String remarks) {

        InvestigationCase investigationCase =
                new InvestigationCase();

        investigationCase.setAlertId(alertId);
        investigationCase.setCaseStatus("OPEN");
        investigationCase.setAssignedTo(assignedTo);
        investigationCase.setPriority(priority);
        investigationCase.setRemarks(remarks);

        return caseRepository.save(investigationCase);
    }
}