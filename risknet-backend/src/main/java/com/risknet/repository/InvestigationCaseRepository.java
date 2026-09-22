package com.risknet.repository;

import com.risknet.entity.InvestigationCase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvestigationCaseRepository
        extends JpaRepository<InvestigationCase, Long> {
}