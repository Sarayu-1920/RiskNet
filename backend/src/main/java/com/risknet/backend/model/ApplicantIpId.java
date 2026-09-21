package com.risknet.backend.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class ApplicantIpId implements Serializable {

    private UUID applicantId;
    private String ipAddress;

    public ApplicantIpId() {
    }

    // Getters and setters

    public UUID getApplicantId() {
        return applicantId;
    }

    public void setApplicantId(UUID applicantId) {
        this.applicantId = applicantId;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ApplicantIpId)) return false;
        ApplicantIpId that = (ApplicantIpId) o;
        return Objects.equals(applicantId, that.applicantId)
                && Objects.equals(ipAddress, that.ipAddress);
    }

    @Override
    public int hashCode() {
        return Objects.hash(applicantId, ipAddress);
    }
}