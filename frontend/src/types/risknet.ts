// Domain types mirroring the RiskNet Spring Boot REST API contract.
// Field names match the backend entities exactly — do not rename or add fields.

/* --------------------------- Backend entities --------------------------- */

export interface Alert {
  alertId: string;
  applicantId: string;
  riskScore: number;
  riskLevel: string;
  alertType: string;
  isFalsePositive: boolean;
  status: string;
  generatedAt: string;
}

export interface Applicant {
  applicantId: string;
  applicantExternalId: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  customerAge: number;
  employmentStatus: string;
  housingStatus: string;
  income: number;
  creditRiskScore: number;
  accountCreatedAt: string;
  updatedAt: string;
}

export interface Device {
  deviceId: string;
}

export interface IpAddress {
  ipAddress: string;
}

export interface InvestigationCase {
  caseId: string;
  alertId: string;
  assignedAnalyst: string;
  priority: string;
  status: string;
  openedAt: string;
  closedAt: string | null;
  remarks: string | null;
}

export interface AnalystDecision {
  decisionId: string;
  caseId: string;
  analystName: string;
  decision: string;
  decisionReason: string;
  decidedAt: string;
}

export interface AuditLog {
  auditId: string;
  applicantId: string;
  alertId: string;
  caseId: string;
  decisionId: string;
  action: string;
  performedBy: string;
  actionTimestamp: string;
  details: string;
}

export interface RiskAssessment {
  assessmentId: string;
  applicantId: string;
  isolationForestScore: number;
  riskScore: number;
  riskLevel: string;
  degreeCentrality: number;
  communityId: number;
  connectedApplicants: number;
  assessedAt: string;
}

/* ------------------------- UI-constrained literals ---------------------- */

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type AlertStatus = "OPEN" | "IN_PROGRESS" | "CLOSED" | "ESCALATED";

export type CaseStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";

export type CasePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type Decision = "CLEAR" | "ESCALATE" | "REPORT_SUSPICIOUS" | "FALSE_POSITIVE";

/* ----------------------------- API payloads ----------------------------- */

/** POST /api/cases accepts exactly these two fields. */
export interface CreateCaseRequest {
  alertId: string;
  assignedAnalyst: string;
}

export interface DecisionRequest {
  decision: Decision;
  remarks?: string;
  performedBy?: string;
}

export interface AlertFilters {
  status?: AlertStatus | "ALL";
  riskLevel?: RiskLevel | "ALL";
}

/* --------------------------- Graph view models -------------------------- */

export type GraphNodeType = "APPLICANT" | "DEVICE" | "IP_ADDRESS" | "ALERT";

export interface GraphNode {
  id: string;
  label: string;
  type: GraphNodeType;
  riskLevel?: RiskLevel;
  properties?: Record<string, string | number>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
