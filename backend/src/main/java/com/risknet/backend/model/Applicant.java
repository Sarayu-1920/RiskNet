package com.risknet.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "applicant")
public class Applicant {

    @Id
    @Column(name = "applicant_id")
    private UUID applicantId;

    @Column(name = "applicant_external_id", unique = true, length = 50)
    private String applicantExternalId;

    @Column(length = 100)
    private String name;

    @Column(unique = true, length = 150)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "customer_age")
    private Integer customerAge;

    @Column(name = "employment_status", length = 30)
    private String employmentStatus;

    @Column(name = "housing_status", length = 30)
    private String housingStatus;

    @Column(precision = 12, scale = 2)
    private BigDecimal income;

    @Column(name = "credit_risk_score", precision = 5, scale = 2)
    private BigDecimal creditRiskScore;

    @Column(name = "account_created_at")
    private LocalDateTime accountCreatedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Applicant() {
    }

    // Getters and setters

    public UUID getApplicantId() {
        return applicantId;
    }

    public void setApplicantId(UUID applicantId) {
        this.applicantId = applicantId;
    }

    public String getApplicantExternalId() {
        return applicantExternalId;
    }

    public void setApplicantExternalId(String applicantExternalId) {
        this.applicantExternalId = applicantExternalId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Integer getCustomerAge() {
        return customerAge;
    }

    public void setCustomerAge(Integer customerAge) {
        this.customerAge = customerAge;
    }

    public String getEmploymentStatus() {
        return employmentStatus;
    }

    public void setEmploymentStatus(String employmentStatus) {
        this.employmentStatus = employmentStatus;
    }

    public String getHousingStatus() {
        return housingStatus;
    }

    public void setHousingStatus(String housingStatus) {
        this.housingStatus = housingStatus;
    }

    public BigDecimal getIncome() {
        return income;
    }

    public void setIncome(BigDecimal income) {
        this.income = income;
    }

    public BigDecimal getCreditRiskScore() {
        return creditRiskScore;
    }

    public void setCreditRiskScore(BigDecimal creditRiskScore) {
        this.creditRiskScore = creditRiskScore;
    }

    public LocalDateTime getAccountCreatedAt() {
        return accountCreatedAt;
    }

    public void setAccountCreatedAt(LocalDateTime accountCreatedAt) {
        this.accountCreatedAt = accountCreatedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}