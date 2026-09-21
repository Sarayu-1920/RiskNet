package com.risknet.backend.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class ApplicantDeviceId implements Serializable {

    private UUID applicantId;
    private String deviceId;

    public ApplicantDeviceId() {
    }

    // Getters and setters


    public UUID getApplicantId() {
        return applicantId;
    }

    public void setApplicantId(UUID applicantId) {
        this.applicantId = applicantId;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ApplicantDeviceId)) return false;
        ApplicantDeviceId that = (ApplicantDeviceId) o;
        return Objects.equals(applicantId, that.applicantId)
                && Objects.equals(deviceId, that.deviceId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(applicantId, deviceId);
    }
}