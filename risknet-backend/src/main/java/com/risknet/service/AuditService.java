package com.risknet.service;

import com.risknet.entity.AuditLog;
import com.risknet.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public AuditLog saveAuditLog(AuditLog auditLog) {
        return auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAll();
    }

    public Optional<AuditLog> getAuditLogById(Long id) {
        return auditLogRepository.findById(id);
    }

    public AuditLog createAudit(
        String action,
        String performedBy,
        String details) {

    AuditLog auditLog = new AuditLog();

    auditLog.setAction(action);
    auditLog.setPerformedBy(performedBy);
    auditLog.setDetails(details);
    auditLog.setTimestamp(java.time.LocalDateTime.now());

    return auditLogRepository.save(auditLog);
}
}