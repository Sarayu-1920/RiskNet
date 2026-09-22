package com.risknet.repository;

import com.risknet.entity.ApplicantIP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicantIPRepository
        extends JpaRepository<ApplicantIP, Long> {
}