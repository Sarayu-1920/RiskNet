package com.risknet.mapper;

import com.risknet.dto.ApplicantDTO;
import com.risknet.entity.Applicant;
import org.springframework.stereotype.Component;

@Component
public class ApplicantMapper {

    public ApplicantDTO toDTO(Applicant applicant) {
        ApplicantDTO dto = new ApplicantDTO();

        dto.setId(applicant.getId());
        dto.setName(applicant.getName());
        dto.setAge(applicant.getAge());
        dto.setGender(applicant.getGender());
        dto.setPhone(applicant.getPhone());
        dto.setEmail(applicant.getEmail());

        return dto;
    }

    public Applicant toEntity(ApplicantDTO dto) {
        Applicant applicant = new Applicant();

        applicant.setId(dto.getId());
        applicant.setName(dto.getName());
        applicant.setAge(dto.getAge());
        applicant.setGender(dto.getGender());
        applicant.setPhone(dto.getPhone());
        applicant.setEmail(dto.getEmail());

        return applicant;
    }
}