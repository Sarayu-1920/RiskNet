package com.risknet.repository;

import com.risknet.entity.AnalystDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnalystDecisionRepository
        extends JpaRepository<AnalystDecision, Long> {
}