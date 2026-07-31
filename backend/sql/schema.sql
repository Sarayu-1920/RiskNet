---------------------Table 1: applicant---------------------
CREATE TABLE applicant (
    applicant_id UUID PRIMARY KEY,
    applicant_external_id VARCHAR(50) UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    date_of_birth DATE,
    customer_age INTEGER,
    employment_status VARCHAR(30),
    housing_status VARCHAR(30),
    income NUMERIC(12,2),
    credit_risk_score NUMERIC(5,2),
    account_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


---------------------  Table 2: alert -------------------------

CREATE TABLE alert (
    alert_id UUID PRIMARY KEY,
    applicant_id UUID NOT NULL,
    risk_score NUMERIC(5,2) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    alert_type VARCHAR(50),
    is_false_positive BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'OPEN',
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_alert_applicant
        FOREIGN KEY (applicant_id)
        REFERENCES applicant(applicant_id)
        ON DELETE CASCADE
);


-----------------------Table 3: device------------------------

CREATE TABLE device (
    device_id UUID PRIMARY KEY,
    device_fingerprint VARCHAR(255) UNIQUE NOT NULL,
    device_type VARCHAR(50),
    operating_system VARCHAR(50),
    browser VARCHAR(50),
    first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



----------------------- Table 4: ip_address -----------------------

CREATE TABLE ip_address (
    ip_id UUID PRIMARY KEY,
    ip_address VARCHAR(45) UNIQUE NOT NULL,
    ip_version VARCHAR(10),
    country VARCHAR(100),
    region VARCHAR(100),
    city VARCHAR(100),
    is_vpn BOOLEAN DEFAULT FALSE,
    first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




------------------------Table 5: investigation_case---------------------

CREATE TABLE investigation_case (
    case_id UUID PRIMARY KEY,
    alert_id UUID NOT NULL,
    assigned_analyst VARCHAR(100),
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    status VARCHAR(20) DEFAULT 'OPEN',
    opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    remarks TEXT,

    CONSTRAINT fk_case_alert
        FOREIGN KEY (alert_id)
        REFERENCES alert(alert_id)
        ON DELETE CASCADE
);





------------------------ Table 6: analyst_decision  -----------------------

CREATE TABLE analyst_decision (
    decision_id UUID PRIMARY KEY,
    case_id UUID NOT NULL,
    analyst_name VARCHAR(100) NOT NULL,
    decision VARCHAR(20) NOT NULL,
    decision_reason TEXT,
    decided_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_decision_case
        FOREIGN KEY (case_id)
        REFERENCES investigation_case(case_id)
        ON DELETE CASCADE
);
  



------------------------ Table 7: audit_log  -----------------------
   
CREATE TABLE audit_log (
    audit_id UUID PRIMARY KEY,
    applicant_id UUID,
    alert_id UUID,
    case_id UUID,
    decision_id UUID,
    action VARCHAR(100) NOT NULL,
    performed_by VARCHAR(100) NOT NULL,
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT,

    CONSTRAINT fk_audit_applicant
        FOREIGN KEY (applicant_id)
        REFERENCES applicant(applicant_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_audit_alert
        FOREIGN KEY (alert_id)
        REFERENCES alert(alert_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_audit_case
        FOREIGN KEY (case_id)
        REFERENCES investigation_case(case_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_audit_decision
        FOREIGN KEY (decision_id)
        REFERENCES analyst_decision(decision_id)
        ON DELETE SET NULL
);




------------------------ Table 8:applicant_device -----------------------

CREATE TABLE applicant_device (
    applicant_id UUID NOT NULL,
    device_id UUID NOT NULL,

    PRIMARY KEY (applicant_id, device_id),

    CONSTRAINT fk_applicant_device_applicant
        FOREIGN KEY (applicant_id)
        REFERENCES applicant(applicant_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_applicant_device_device
        FOREIGN KEY (device_id)
        REFERENCES device(device_id)
        ON DELETE CASCADE
);




------------------------ Table 9: applicant_ip  -----------------------

CREATE TABLE applicant_ip (
    applicant_id UUID NOT NULL,
    ip_id UUID NOT NULL,

    PRIMARY KEY (applicant_id, ip_id),

    CONSTRAINT fk_applicant_ip_applicant
        FOREIGN KEY (applicant_id)
        REFERENCES applicant(applicant_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_applicant_ip_ip
        FOREIGN KEY (ip_id)
        REFERENCES ip_address(ip_id)
        ON DELETE CASCADE
);
