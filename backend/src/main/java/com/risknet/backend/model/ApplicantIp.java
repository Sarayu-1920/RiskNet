package com.risknet.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "applicant_ip")
public class ApplicantIp {

    @EmbeddedId
    private ApplicantIpId id;

    @ManyToOne
    @MapsId("applicantId")
    @JoinColumn(name = "applicant_id")
    private Applicant applicant;

    @ManyToOne
    @MapsId("ipAddress")
    @JoinColumn(name = "ip_address")
    private IpAddress ipAddress;

    public ApplicantIp() {
    }

    // Getters and setters

    public ApplicantIpId getId() {
        return id;
    }

    public void setId(ApplicantIpId id) {
        this.id = id;
    }

    public Applicant getApplicant() {
        return applicant;
    }

    public void setApplicant(Applicant applicant) {
        this.applicant = applicant;
    }

    public IpAddress getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(IpAddress ipAddress) {
        this.ipAddress = ipAddress;
    }
}