/**
 * ISOLATED MOCK DATA — UI development only.
 *
 * This file is the ONLY place fake data lives. It is used exclusively by
 * `src/services/api.ts` when no `VITE_API_BASE_URL` is configured.
 * Set VITE_API_BASE_URL=http://localhost:8080 to talk to the real RiskNet
 * Spring Boot API, then this file can be deleted.
 */
import type {
  Alert,
  Applicant,
  AuditLog,
  GraphData,
  InvestigationCase,
  RiskLevel,
} from "@/types/risknet";

export const mockAlerts: Alert[] = [
  {
    alertId: "ALR-10241",
    applicantId: "APP-5512",
    riskScore: 92,
    riskLevel: "CRITICAL",
    alertType: "DEVICE_SHARING",
    isFalsePositive: false,
    status: "OPEN",
    generatedAt: "2026-09-28T09:14:00Z",
  },
  {
    alertId: "ALR-10240",
    applicantId: "APP-5488",
    riskScore: 81,
    riskLevel: "HIGH",
    alertType: "VELOCITY_ANOMALY",
    isFalsePositive: false,
    status: "IN_PROGRESS",
    generatedAt: "2026-09-28T07:02:00Z",
  },
  {
    alertId: "ALR-10238",
    applicantId: "APP-5470",
    riskScore: 77,
    riskLevel: "HIGH",
    alertType: "IP_CLUSTER",
    isFalsePositive: false,
    status: "ESCALATED",
    generatedAt: "2026-09-27T21:45:00Z",
  },
  {
    alertId: "ALR-10235",
    applicantId: "APP-5431",
    riskScore: 54,
    riskLevel: "MEDIUM",
    alertType: "IDENTITY_MISMATCH",
    isFalsePositive: false,
    status: "OPEN",
    generatedAt: "2026-09-27T16:30:00Z",
  },
  {
    alertId: "ALR-10229",
    applicantId: "APP-5402",
    riskScore: 41,
    riskLevel: "MEDIUM",
    alertType: "SYNTHETIC_IDENTITY",
    isFalsePositive: false,
    status: "IN_PROGRESS",
    generatedAt: "2026-09-26T11:12:00Z",
  },
  {
    alertId: "ALR-10221",
    applicantId: "APP-5377",
    riskScore: 22,
    riskLevel: "LOW",
    alertType: "ADDRESS_REUSE",
    isFalsePositive: true,
    status: "CLOSED",
    generatedAt: "2026-09-25T08:05:00Z",
  },
  {
    alertId: "ALR-10218",
    applicantId: "APP-5355",
    riskScore: 88,
    riskLevel: "CRITICAL",
    alertType: "DEVICE_SHARING",
    isFalsePositive: false,
    status: "OPEN",
    generatedAt: "2026-09-24T19:41:00Z",
  },
  {
    alertId: "ALR-10212",
    applicantId: "APP-5310",
    riskScore: 35,
    riskLevel: "LOW",
    alertType: "VELOCITY_ANOMALY",
    isFalsePositive: true,
    status: "CLOSED",
    generatedAt: "2026-09-24T10:20:00Z",
  },
];

const applicantSeeds: Array<Partial<Applicant> & { applicantId: string; name: string }> = [
  {
    applicantId: "APP-5512",
    name: "Dana Whitfield",
    email: "dana.whitfield@mailhaven.io",
    phone: "+1 415 555 0199",
    dateOfBirth: "1991-04-17",
    customerAge: 35,
    employmentStatus: "SELF_EMPLOYED",
    housingStatus: "RENTED",
    income: 74000,
    creditRiskScore: 611,
    accountCreatedAt: "2026-09-12T13:22:00Z",
    applicantExternalId: "EXT-DW-91442",
  },
  {
    applicantId: "APP-5488",
    name: "Marcus Ellery",
    email: "m.ellery@northbridge.com",
    phone: "+44 20 7946 0820",
    dateOfBirth: "1987-11-02",
    customerAge: 38,
    employmentStatus: "FULL_TIME",
    housingStatus: "MORTGAGE",
    income: 96500,
    creditRiskScore: 688,
    accountCreatedAt: "2025-02-08T09:10:00Z",
    applicantExternalId: "EXT-ME-88301",
  },
];

export function mockApplicant(applicantId: string): Applicant {
  const seed = applicantSeeds.find((a) => a.applicantId === applicantId);
  return {
    applicantId,
    applicantExternalId: seed?.applicantExternalId ?? `EXT-${applicantId.replace("APP-", "")}`,
    name: seed?.name ?? "Unnamed Applicant",
    email: seed?.email ?? "applicant@example.com",
    phone: seed?.phone ?? "+1 202 555 0143",
    dateOfBirth: seed?.dateOfBirth ?? "1990-06-21",
    customerAge: seed?.customerAge ?? 36,
    employmentStatus: seed?.employmentStatus ?? "FULL_TIME",
    housingStatus: seed?.housingStatus ?? "RENTED",
    income: seed?.income ?? 58000,
    creditRiskScore: seed?.creditRiskScore ?? 642,
    accountCreatedAt: seed?.accountCreatedAt ?? "2025-07-19T15:40:00Z",
    updatedAt: seed?.updatedAt ?? "2026-09-28T09:00:00Z",
  };
}

export function mockGraph(applicantId: string): GraphData {
  const applicant = mockApplicant(applicantId);
  const related = mockAlerts.filter((a) => a.applicantId === applicantId);
  const nodes: GraphData["nodes"] = [
    {
      id: applicantId,
      label: applicant.name,
      type: "APPLICANT",
      riskLevel: (related[0]?.riskLevel ?? "MEDIUM") as RiskLevel,
      properties: {
        applicantExternalId: applicant.applicantExternalId,
        creditRiskScore: applicant.creditRiskScore,
      },
    },
    // Device table contains only device_id — no extra properties.
    { id: `DEV-${applicantId}-1`, label: `DEV-${applicantId}-1`, type: "DEVICE" },
    { id: `DEV-${applicantId}-2`, label: `DEV-${applicantId}-2`, type: "DEVICE" },
    { id: `IP-${applicantId}-1`, label: "82.14.221.9", type: "IP_ADDRESS" },
    { id: `IP-${applicantId}-2`, label: "203.0.113.44", type: "IP_ADDRESS" },
  ];

  const edges: GraphData["edges"] = [
    { id: `e1-${applicantId}`, source: applicantId, target: `DEV-${applicantId}-1`, label: "USES_DEVICE" },
    { id: `e2-${applicantId}`, source: applicantId, target: `DEV-${applicantId}-2`, label: "USES_DEVICE" },
    { id: `e3-${applicantId}`, source: applicantId, target: `IP-${applicantId}-1`, label: "USES_IP" },
    { id: `e4-${applicantId}`, source: applicantId, target: `IP-${applicantId}-2`, label: "USES_IP" },
  ];

  const alertsForGraph = related.length ? related : mockAlerts.slice(0, 1);
  alertsForGraph.forEach((alert) => {
    nodes.push({
      id: alert.alertId,
      label: `${alert.alertId} · ${alert.alertType}`,
      type: "ALERT",
      riskLevel: alert.riskLevel as RiskLevel,
      properties: { riskScore: alert.riskScore, status: alert.status },
    });
    edges.push({
      id: `ea-${alert.alertId}`,
      source: alert.alertId,
      target: applicantId,
      label: "TRIGGERED_FOR",
    });
  });

  return { nodes, edges };
}

export const mockCases: InvestigationCase[] = [
  {
    caseId: "CASE-3301",
    alertId: "ALR-10240",
    status: "IN_PROGRESS",
    assignedAnalyst: "n.arvidsson",
    priority: "HIGH",
    openedAt: "2026-09-28T08:00:00Z",
    closedAt: null,
    remarks: "Awaiting payroll verification callback.",
  },
  {
    caseId: "CASE-3298",
    alertId: "ALR-10238",
    status: "OPEN",
    assignedAnalyst: "j.okafor",
    priority: "URGENT",
    openedAt: "2026-09-27T22:10:00Z",
    closedAt: null,
    remarks: "Proxy cluster overlaps with case CASE-3244.",
  },
  {
    caseId: "CASE-3277",
    alertId: "ALR-10221",
    status: "CLOSED",
    assignedAnalyst: "r.mehta",
    priority: "LOW",
    openedAt: "2026-09-25T08:30:00Z",
    closedAt: "2026-09-25T14:05:00Z",
    remarks: "Address reuse explained by family household.",
  },
];

export const mockAudit: AuditLog[] = [
  {
    auditId: "AUD-9001",
    applicantId: "APP-5488",
    alertId: "ALR-10240",
    caseId: "CASE-3301",
    decisionId: "",
    action: "CASE_CREATED",
    performedBy: "n.arvidsson",
    actionTimestamp: "2026-09-28T08:00:00Z",
    details: "Case opened from alert ALR-10240.",
  },
  {
    auditId: "AUD-9002",
    applicantId: "APP-5488",
    alertId: "ALR-10240",
    caseId: "CASE-3301",
    decisionId: "",
    action: "ALERT_STATUS_CHANGED",
    performedBy: "n.arvidsson",
    actionTimestamp: "2026-09-28T08:04:00Z",
    details: "Alert status OPEN -> IN_PROGRESS.",
  },
  {
    auditId: "AUD-9003",
    applicantId: "APP-5488",
    alertId: "ALR-10240",
    caseId: "CASE-3301",
    decisionId: "",
    action: "GRAPH_REVIEWED",
    performedBy: "n.arvidsson",
    actionTimestamp: "2026-09-28T08:26:00Z",
    details: "Reviewed 2 shared devices and 1 proxy IP.",
  },
  {
    auditId: "AUD-9004",
    applicantId: "APP-5377",
    alertId: "ALR-10221",
    caseId: "CASE-3277",
    decisionId: "DEC-501",
    action: "DECISION_RECORDED",
    performedBy: "r.mehta",
    actionTimestamp: "2026-09-25T14:05:00Z",
    details: "Decision FALSE_POSITIVE recorded, case closed.",
  },
];
