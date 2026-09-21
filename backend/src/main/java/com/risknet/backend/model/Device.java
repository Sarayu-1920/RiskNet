package com.risknet.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "device")
public class Device {

    @Id
    @Column(name = "device_id", length = 50)
    private String deviceId;

    public Device() {
    }

    // Getters and setters

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }
}