package com.risknet.mapper;

import com.risknet.dto.AlertDTO;
import com.risknet.entity.Alert;
import org.springframework.stereotype.Component;

@Component
public class AlertMapper {

    public AlertDTO toDTO(Alert alert) {
        AlertDTO dto = new AlertDTO();

        dto.setId(alert.getId());
        dto.setApplicantId(alert.getApplicantId());
        dto.setRiskLevel(alert.getRiskLevel());
        dto.setRiskScore(alert.getRiskScore());
        dto.setStatus(alert.getStatus());
        dto.setReason(alert.getReason());

        return dto;
    }

    public Alert toEntity(AlertDTO dto) {
        Alert alert = new Alert();

        alert.setId(dto.getId());
        alert.setApplicantId(dto.getApplicantId());
        alert.setRiskLevel(dto.getRiskLevel());
        alert.setRiskScore(dto.getRiskScore());
        alert.setStatus(dto.getStatus());
        alert.setReason(dto.getReason());

        return alert;
    }
}