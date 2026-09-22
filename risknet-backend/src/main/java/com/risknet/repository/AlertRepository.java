package com.risknet.repository;

import com.risknet.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    Optional<Alert> findByApplicantIdAndStatus(
            Long applicantId,
            String status
    );
}