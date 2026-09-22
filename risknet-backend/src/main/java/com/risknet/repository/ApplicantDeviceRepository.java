package com.risknet.repository;

import com.risknet.entity.ApplicantDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicantDeviceRepository
        extends JpaRepository<ApplicantDevice, Long> {
}