package com.risknet.repository;

import com.risknet.entity.IPAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IPAddressRepository extends JpaRepository<IPAddress, Long> {
}