package com.risknet.dto;

import java.util.List;

public class GraphDTO {

    private Long applicantId;
    private List<Long> connectedApplicantIds;
    private List<String> deviceIds;
    private List<String> ipAddresses;
    private Double riskScore;
    private String riskLevel;

    public GraphDTO() {
    }

    public Long getApplicantId() {
        return applicantId;
    }

    public void setApplicantId(Long applicantId) {
        this.applicantId = applicantId;
    }

    public List<Long> getConnectedApplicantIds() {
        return connectedApplicantIds;
    }

    public void setConnectedApplicantIds(List<Long> connectedApplicantIds) {
        this.connectedApplicantIds = connectedApplicantIds;
    }

    public List<String> getDeviceIds() {
        return deviceIds;
    }

    public void setDeviceIds(List<String> deviceIds) {
        this.deviceIds = deviceIds;
    }

    public List<String> getIpAddresses() {
        return ipAddresses;
    }

    public void setIpAddresses(List<String> ipAddresses) {
        this.ipAddresses = ipAddresses;
    }

    public Double getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Double riskScore) {
        this.riskScore = riskScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }
}