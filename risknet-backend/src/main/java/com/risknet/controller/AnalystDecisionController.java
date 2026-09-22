package com.risknet.controller;

import com.risknet.entity.AnalystDecision;
import com.risknet.service.AnalystDecisionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/decisions")
public class AnalystDecisionController {

    private final AnalystDecisionService decisionService;

    public AnalystDecisionController(
            AnalystDecisionService decisionService) {
        this.decisionService = decisionService;
    }

    @PostMapping
    public AnalystDecision createDecision(
            @RequestBody AnalystDecision decision) {

        return decisionService.saveDecision(decision);
    }

    @GetMapping
    public List<AnalystDecision> getAllDecisions() {
        return decisionService.getAllDecisions();
    }

    @GetMapping("/{id}")
    public AnalystDecision getDecisionById(
            @PathVariable Long id) {

        return decisionService
                .getDecisionById(id)
                .orElse(null);
    }

    @DeleteMapping("/{id}")
    public String deleteDecision(
            @PathVariable Long id) {

        decisionService.deleteDecision(id);

        return "Analyst decision deleted successfully";
    }
}