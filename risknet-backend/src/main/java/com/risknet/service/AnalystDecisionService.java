package com.risknet.service;

import com.risknet.entity.AnalystDecision;
import com.risknet.repository.AnalystDecisionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnalystDecisionService {

    private final AnalystDecisionRepository decisionRepository;
    private final AuditService auditService;

    public AnalystDecisionService(
            AnalystDecisionRepository decisionRepository,
            AuditService auditService) {

        this.decisionRepository = decisionRepository;
        this.auditService = auditService;
    }

    public AnalystDecision saveDecision(AnalystDecision decision) {

        AnalystDecision savedDecision =
                decisionRepository.save(decision);

        auditService.createAudit(
                "DECISION_RECORDED",
                decision.getAnalystName(),
                "Decision " + decision.getDecision()
                        + " recorded for case "
                        + decision.getCaseId()
        );

        return savedDecision;
    }

    public List<AnalystDecision> getAllDecisions() {
        return decisionRepository.findAll();
    }

    public Optional<AnalystDecision> getDecisionById(Long id) {
        return decisionRepository.findById(id);
    }

    public void deleteDecision(Long id) {
        decisionRepository.deleteById(id);
    }
}