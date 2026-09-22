package com.risknet.service;

import com.risknet.dto.GraphApplicantRequest;
import com.risknet.dto.GraphDTO;
import com.risknet.entity.Alert;
import com.risknet.util.Constants;
import com.risknet.util.RiskLevelUtil;
import com.risknet.util.RiskScoreUtil;

import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Service;

@Service
public class GraphService {

    private final Neo4jClient neo4jClient;
    private final AlertService alertService;

    public GraphService(
            Neo4jClient neo4jClient,
            AlertService alertService) {

        this.neo4jClient = neo4jClient;
        this.alertService = alertService;
    }

    // Check Neo4j connection
    public String getGraphStatus() {

        return neo4jClient.query(
                "RETURN 'Neo4j connection successful' AS status"
        )
        .fetch()
        .one()
        .map(row -> row.get("status").toString())
        .orElse("Neo4j connection failed");
    }

    // Create applicant graph
    public String createApplicantGraph(GraphApplicantRequest request) {

        neo4jClient.query("""
                MERGE (a:Applicant {applicantId: $applicantId})
                SET a.name = $name

                MERGE (d:Device {deviceId: $deviceId})

                MERGE (ip:IPAddress {address: $ipAddress})

                MERGE (a)-[:USES_DEVICE]->(d)

                MERGE (a)-[:CONNECTS_FROM]->(ip)

                RETURN a
                """)
                .bind(request.getApplicantId()).to("applicantId")
                .bind(request.getName()).to("name")
                .bind(request.getDeviceId()).to("deviceId")
                .bind(request.getIpAddress()).to("ipAddress")
                .run();

        return "Applicant graph created successfully";
    }

    // Get graph connections and calculate risk
    public GraphDTO getApplicantConnections(Long applicantId) {

        return neo4jClient.query("""
                MATCH (a:Applicant {applicantId: $applicantId})

                OPTIONAL MATCH (a)-[:USES_DEVICE]->(d:Device)
                OPTIONAL MATCH (a)-[:CONNECTS_FROM]->(ip:IPAddress)

                OPTIONAL MATCH (other:Applicant)-[:USES_DEVICE]->(d)
                WHERE other.applicantId <> $applicantId

                OPTIONAL MATCH (otherIp:Applicant)-[:CONNECTS_FROM]->(ip)
                WHERE otherIp.applicantId <> $applicantId

                RETURN
                    collect(DISTINCT other.applicantId) AS connectedByDevice,
                    collect(DISTINCT otherIp.applicantId) AS connectedByIp,
                    collect(DISTINCT d.deviceId) AS deviceIds,
                    collect(DISTINCT ip.address) AS ipAddresses
                """)
                .bind(applicantId).to("applicantId")
                .fetch()
                .one()
                .map(row -> {

                    GraphDTO dto = new GraphDTO();
                    dto.setApplicantId(applicantId);

                    java.util.List<Long> connectedApplicants =
                            new java.util.ArrayList<>();

                    Object deviceConnections =
                            row.get("connectedByDevice");

                    Object ipConnections =
                            row.get("connectedByIp");

                    if (deviceConnections instanceof java.util.List<?> list) {
                        for (Object id : list) {
                            if (id instanceof Number number
                                    && number.longValue() != applicantId
                                    && !connectedApplicants.contains(number.longValue())) {

                                connectedApplicants.add(number.longValue());
                            }
                        }
                    }

                    if (ipConnections instanceof java.util.List<?> list) {
                        for (Object id : list) {
                            if (id instanceof Number number
                                    && number.longValue() != applicantId
                                    && !connectedApplicants.contains(number.longValue())) {

                                connectedApplicants.add(number.longValue());
                            }
                        }
                    }

                    dto.setConnectedApplicantIds(connectedApplicants);

                    java.util.List<String> deviceIds =
                            new java.util.ArrayList<>();

                    java.util.List<String> ipAddresses =
                            new java.util.ArrayList<>();

                    Object devices = row.get("deviceIds");
                    Object ips = row.get("ipAddresses");

                    if (devices instanceof java.util.List<?> list) {
                        for (Object device : list) {
                            if (device != null) {
                                deviceIds.add(device.toString());
                            }
                        }
                    }

                    if (ips instanceof java.util.List<?> list) {
                        for (Object ip : list) {
                            if (ip != null) {
                                ipAddresses.add(ip.toString());
                            }
                        }
                    }

                    dto.setDeviceIds(deviceIds);
                    dto.setIpAddresses(ipAddresses);

                    int sharedDeviceCount = 0;
                    int sharedIpCount = 0;

                    if (!deviceIds.isEmpty()
                            && !connectedApplicants.isEmpty()) {
                        sharedDeviceCount = 1;
                    }

                    if (!ipAddresses.isEmpty()
                            && !connectedApplicants.isEmpty()) {
                        sharedIpCount = 1;
                    }

                    int connectedApplicantCount =
                            connectedApplicants.size();

                    double riskScore =
                            RiskScoreUtil.calculateRiskScore(
                                    sharedDeviceCount,
                                    sharedIpCount,
                                    connectedApplicantCount
                            );

                    dto.setRiskScore(riskScore);

                    String riskLevel =
                            RiskLevelUtil.getRiskLevel(riskScore);

                    dto.setRiskLevel(riskLevel);

                    return dto;
                })
                .orElse(null);
    }

    // Explicitly create an alert and investigation case
    public Alert createRiskAlert(Long applicantId) {

        GraphDTO graphData =
                getApplicantConnections(applicantId);

        if (graphData == null) {
            return null;
        }

        if (Constants.LOW_RISK.equals(graphData.getRiskLevel())) {
            return null;
        }

        String reason =
                "Graph-based risk detected: "
                + graphData.getConnectedApplicantIds().size()
                + " connected applicant(s), "
                + getSharedDeviceCount(graphData)
                + " shared device(s), "
                + getSharedIpCount(graphData)
                + " shared IP address(es).";

        return alertService.createRiskAlert(
                applicantId,
                graphData.getRiskScore(),
                graphData.getRiskLevel(),
                reason
        );
    }

    private int getSharedDeviceCount(GraphDTO graphData) {

        if (graphData.getDeviceIds() != null
                && !graphData.getDeviceIds().isEmpty()
                && graphData.getConnectedApplicantIds() != null
                && !graphData.getConnectedApplicantIds().isEmpty()) {

            return 1;
        }

        return 0;
    }

    private int getSharedIpCount(GraphDTO graphData) {

        if (graphData.getIpAddresses() != null
                && !graphData.getIpAddresses().isEmpty()
                && graphData.getConnectedApplicantIds() != null
                && !graphData.getConnectedApplicantIds().isEmpty()) {

            return 1;
        }

        return 0;
    }
}