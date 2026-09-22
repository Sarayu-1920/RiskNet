package com.risknet.mapper;

import com.risknet.dto.CaseDTO;
import com.risknet.entity.InvestigationCase;
import org.springframework.stereotype.Component;

@Component
public class CaseMapper {

    public CaseDTO toDTO(InvestigationCase investigationCase) {
        CaseDTO dto = new CaseDTO();

        dto.setId(investigationCase.getId());
        dto.setAlertId(investigationCase.getAlertId());
        dto.setCaseStatus(investigationCase.getCaseStatus());
        dto.setAssignedTo(investigationCase.getAssignedTo());
        dto.setPriority(investigationCase.getPriority());
        dto.setRemarks(investigationCase.getRemarks());

        return dto;
    }

    public InvestigationCase toEntity(CaseDTO dto) {
        InvestigationCase investigationCase = new InvestigationCase();

        investigationCase.setId(dto.getId());
        investigationCase.setAlertId(dto.getAlertId());
        investigationCase.setCaseStatus(dto.getCaseStatus());
        investigationCase.setAssignedTo(dto.getAssignedTo());
        investigationCase.setPriority(dto.getPriority());
        investigationCase.setRemarks(dto.getRemarks());

        return investigationCase;
    }
}