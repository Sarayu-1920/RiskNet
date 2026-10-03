/**
 * RiskNet API client.
 *
 * Every backend request goes through here and uses VITE_API_BASE_URL.
 * Endpoints are limited to the documented Spring Boot contract.
 *
 * When VITE_API_BASE_URL is not set, the client falls back to the isolated
 * mock module so the UI is developable. Set the variable and the mock path is
 * never touched.
 */
import type {
  Alert,
  AlertFilters,
  AlertStatus,
  Applicant,
  AuditLog,
  CreateCaseRequest,
  DecisionRequest,
  GraphData,
  InvestigationCase,
} from "@/types/risknet";
import {
  mockAlerts,
  mockApplicant,
  mockAudit,
  mockCases,
  mockGraph,
} from "./mock/mockData";

export const API_BASE_URL = import.meta.env["VITE_API_BASE_URL"] ?? "";

export const USING_MOCK_DATA = API_BASE_URL === "";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    throw new ApiError(`Request to ${path} failed (${res.status})`, res.status);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

const delay = (ms = 320) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------ Alerts ------------------------------ */

export async function getAlerts(filters: AlertFilters = {}): Promise<Alert[]> {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== "ALL") params.set("status", filters.status);
  if (filters.riskLevel && filters.riskLevel !== "ALL") params.set("riskLevel", filters.riskLevel);
  const query = params.toString();

  if (USING_MOCK_DATA) {
    await delay();
    return mockAlerts.filter(
      (a) =>
        (!filters.status || filters.status === "ALL" || a.status === filters.status) &&
        (!filters.riskLevel || filters.riskLevel === "ALL" || a.riskLevel === filters.riskLevel),
    );
  }
  return request<Alert[]>(`/api/alerts${query ? `?${query}` : ""}`);
}

export async function getAlert(alertId: string): Promise<Alert> {
  if (USING_MOCK_DATA) {
    await delay();
    const found = mockAlerts.find((a) => a.alertId === alertId);
    if (!found) throw new ApiError(`Alert ${alertId} not found`, 404);
    return found;
  }
  return request<Alert>(`/api/alerts/${encodeURIComponent(alertId)}`);
}

export async function updateAlertStatus(alertId: string, status: AlertStatus): Promise<Alert> {
  if (USING_MOCK_DATA) {
    await delay();
    const found = mockAlerts.find((a) => a.alertId === alertId);
    if (!found) throw new ApiError(`Alert ${alertId} not found`, 404);
    found.status = status;
    return found;
  }
  return request<Alert>(`/api/alerts/${encodeURIComponent(alertId)}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

/* ---------------------------- Applicants ---------------------------- */

export async function getApplicant(applicantId: string): Promise<Applicant> {
  if (USING_MOCK_DATA) {
    await delay();
    return mockApplicant(applicantId);
  }
  return request<Applicant>(`/api/applicants/${encodeURIComponent(applicantId)}`);
}

/* ------------------------------- Graph ------------------------------ */

export async function getGraph(applicantId: string): Promise<GraphData> {
  if (USING_MOCK_DATA) {
    await delay();
    return mockGraph(applicantId);
  }
  return request<GraphData>(`/api/graph/${encodeURIComponent(applicantId)}`);
}

/* ------------------------------- Cases ------------------------------ */

export async function createCase(payload: CreateCaseRequest): Promise<InvestigationCase> {
  if (USING_MOCK_DATA) {
    await delay();
    const created: InvestigationCase = {
      caseId: `CASE-${3300 + mockCases.length + 1}`,
      status: "OPEN",
      priority: "HIGH",
      openedAt: new Date().toISOString(),
      closedAt: null,
      remarks: null,
      ...payload,
    };
    mockCases.unshift(created);
    const alert = mockAlerts.find((a) => a.alertId === payload.alertId);
    mockAudit.unshift({
      auditId: `AUD-${Date.now()}`,
      applicantId: alert?.applicantId ?? "",
      alertId: payload.alertId,
      caseId: created.caseId,
      decisionId: "",
      action: "CASE_CREATED",
      performedBy: payload.assignedAnalyst,
      actionTimestamp: created.openedAt,
      details: `Case opened from alert ${payload.alertId}.`,
    });
    return created;
  }
  return request<InvestigationCase>("/api/cases", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCase(caseId: string): Promise<InvestigationCase> {
  if (USING_MOCK_DATA) {
    await delay();
    const found = mockCases.find((c) => c.caseId === caseId);
    if (!found) throw new ApiError(`Case ${caseId} not found`, 404);
    return found;
  }
  return request<InvestigationCase>(`/api/cases/${encodeURIComponent(caseId)}`);
}

export async function submitCaseDecision(
  caseId: string,
  payload: DecisionRequest,
): Promise<InvestigationCase> {
  if (USING_MOCK_DATA) {
    await delay();
    const found = mockCases.find((c) => c.caseId === caseId);
    if (!found) throw new ApiError(`Case ${caseId} not found`, 404);
    found.status = "CLOSED";
    found.closedAt = new Date().toISOString();
    if (payload.remarks) found.remarks = payload.remarks;
    const alert = mockAlerts.find((a) => a.alertId === found.alertId);
    mockAudit.unshift({
      auditId: `AUD-${Date.now()}`,
      applicantId: alert?.applicantId ?? "",
      alertId: found.alertId,
      caseId,
      decisionId: `DEC-${Date.now()}`,
      action: "DECISION_RECORDED",
      performedBy: payload.performedBy ?? found.assignedAnalyst,
      actionTimestamp: found.closedAt,
      details: `Decision ${payload.decision} recorded, case closed.`,
    });
    return found;
  }
  return request<InvestigationCase>(`/api/cases/${encodeURIComponent(caseId)}/decision`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/* ------------------------------- Audit ------------------------------ */

export async function getAudit(caseId: string): Promise<AuditLog[]> {
  if (USING_MOCK_DATA) {
    await delay();
    return mockAudit.filter((a) => a.caseId === caseId);
  }
  return request<AuditLog[]>(`/api/audit/${encodeURIComponent(caseId)}`);
}

/* ------------- Local helpers (no extra endpoints invented) ---------- */

/** Case list view is assembled client-side from cases already fetched. */
export async function listKnownCases(): Promise<InvestigationCase[]> {
  if (USING_MOCK_DATA) {
    await delay();
    return [...mockCases];
  }
  // No list endpoint exists in the contract: cases are looked up by id.
  return [];
}
