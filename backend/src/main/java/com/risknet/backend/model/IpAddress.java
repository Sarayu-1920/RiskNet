package com.risknet.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ip_address")
public class IpAddress {

    @Id
    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    public IpAddress() {
    }

    // Getters and setters
    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

}