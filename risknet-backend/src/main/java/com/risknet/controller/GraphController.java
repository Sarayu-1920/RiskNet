package com.risknet.controller;

import com.risknet.dto.GraphApplicantRequest;
import com.risknet.dto.GraphDTO;
import com.risknet.entity.Alert;
import com.risknet.service.GraphService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/graph")
public class GraphController {

    private final GraphService graphService;

    public GraphController(GraphService graphService) {
        this.graphService = graphService;
    }

    @GetMapping("/status")
    public String getGraphStatus() {
        return graphService.getGraphStatus();
    }

    @PostMapping("/applicant")
    public String createApplicantGraph(
            @RequestBody GraphApplicantRequest request) {

        return graphService.createApplicantGraph(request);
    }

    @GetMapping("/applicant/{applicantId}")
    public GraphDTO getApplicantConnections(
            @PathVariable Long applicantId) {

        return graphService.getApplicantConnections(applicantId);
    }

    @PostMapping("/applicant/{applicantId}/alert")
    public Alert createRiskAlert(
            @PathVariable Long applicantId) {

        return graphService.createRiskAlert(applicantId);
    }
}