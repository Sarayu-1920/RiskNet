package com.risknet.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "applicant_device")
public class ApplicantDevice {

    @EmbeddedId
    private ApplicantDeviceId id;

    @ManyToOne
    @MapsId("applicantId")
    @JoinColumn(name = "applicant_id")
    private Applicant applicant;

    @ManyToOne
    @MapsId("deviceId")
    @JoinColumn(name = "device_id")
    private Device device;

    public ApplicantDevice() {
    }

    // Getters and setters

    public ApplicantDeviceId getId() {
        return id;
    }

    public void setId(ApplicantDeviceId id) {
        this.id = id;
    }

    public Applicant getApplicant() {
        return applicant;
    }

    public void setApplicant(Applicant applicant) {
        this.applicant = applicant;
    }

    public Device getDevice() {
        return device;
    }

    public void setDevice(Device device) {
        this.device = device;
    }
}