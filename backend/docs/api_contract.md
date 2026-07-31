# RiskNet Backend API Contract

**Version:** 1.0

**Base URL:** `/api`

---

# Architecture

RiskNet uses **Neo4j** as its graph database to store applicants, devices, IP addresses, alerts, and their relationships.

The frontend uses **Cytoscape.js** to visualize graph data inside the React dashboard. Spring Boot retrieves graph data from Neo4j using Cypher queries and transforms it into nodes-and-edges JSON consumed by Cytoscape.js.

---

# Alert Status Enum

| Value | Description |
|--------|-------------|
| OPEN | Newly generated alert awaiting investigation |
| IN_PROGRESS | Analyst has started investigation |
| CLOSED | Investigation completed |

---

# Decision Enum

| Value | Description |
|--------|-------------|
| CLEAR | Applicant determined to be legitimate |
| ESCALATE | Requires further investigation |
| REPORT_SUSPICIOUS | Confirmed suspicious activity |
| FALSE_POSITIVE | Alert incorrectly generated |

---

# 1. Get Alert Queue

### Endpoint

```http
GET /api/alerts
```

### Optional Query Parameters

| Parameter | Type | Description |
|------------|------|-------------|
| status | String | OPEN, IN_PROGRESS, CLOSED |
| riskLevel | String | LOW, MEDIUM, HIGH |

### Example

```http
GET /api/alerts?status=OPEN&riskLevel=HIGH
```

### Response

```json
[
  {
    "alertId": "ALT000123",
    "applicantId": "APP00122916",
    "riskScore": 82.7,
    "riskLevel": "HIGH",
    "status": "OPEN",
    "registrationTimestamp": "2025-03-18T14:26:35Z"
  }
]
```

---

# 2. Get Alert Details

### Endpoint

```http
GET /api/alerts/{alertId}
```

### Response

```json
{
  "alertId": "ALT000123",
  "applicantId": "APP00122916",
  "riskScore": 82.7,
  "riskLevel": "HIGH",
  "status": "OPEN",
  "registrationTimestamp": "2025-03-18T14:26:35Z",
  "isFalsePositive": false
}
```

---

# 3. Update Alert Status

### Endpoint

```http
PUT /api/alerts/{alertId}/status
```

### Request

```json
{
  "status": "IN_PROGRESS"
}
```

### Response

```json
{
  "alertId": "ALT000123",
  "status": "IN_PROGRESS",
  "updatedAt": "2025-03-18T15:20:18Z"
}
```

---

# 4. Get Applicant Profile

### Endpoint

```http
GET /api/applicants/{applicantId}
```

### Response

```json
{
  "applicantId": "APP00122916",
  "creditRiskScore": 712,
  "employmentStatus": "EMPLOYED",
  "housingStatus": "OWN",
  "customerAge": 34,
  "income": 82000,
  "deviceId": "LDEV298523",
  "ipAddress": "172.16.48.103"
}
```

---

# 5. Get Applicant Graph

### Endpoint

```http
GET /api/graph/{applicantId}
```

### Description

Returns graph data retrieved from Neo4j and formatted for Cytoscape.js.

### Response

```json
{
  "nodes": [
    {
      "data": {
        "id": "APP00122916",
        "label": "Applicant"
      }
    },
    {
      "data": {
        "id": "APP00154128",
        "label": "Applicant"
      }
    },
    {
      "data": {
        "id": "APP00187653",
        "label": "Applicant"
      }
    },
    {
      "data": {
        "id": "LDEV298523",
        "label": "Device"
      }
    },
    {
      "data": {
        "id": "172.16.48.103",
        "label": "IPAddress"
      }
    }
  ],
  "edges": [
    {
      "data": {
        "source": "APP00122916",
        "target": "LDEV298523",
        "relationship": "USES_DEVICE"
      }
    },
    {
      "data": {
        "source": "APP00154128",
        "target": "LDEV298523",
        "relationship": "USES_DEVICE"
      }
    },
    {
      "data": {
        "source": "APP00122916",
        "target": "172.16.48.103",
        "relationship": "USES_IP"
      }
    },
    {
      "data": {
        "source": "APP00187653",
        "target": "172.16.48.103",
        "relationship": "USES_IP"
      }
    }
  ]
}
```

---

# 6. Create Investigation Case

### Endpoint

```http
POST /api/cases
```

### Request

```json
{
  "alertId": "ALT000123",
  "assignedAnalyst": "analyst01"
}
```

### Response

```json
{
  "caseId": "CASE000031",
  "status": "OPEN",
  "createdAt": "2025-03-18T15:12:04Z"
}
```

---

# 7. Get Investigation Case

### Endpoint

```http
GET /api/cases/{caseId}
```

### Response

```json
{
  "caseId": "CASE000031",
  "alertId": "ALT000123",
  "applicantId": "APP00122916",
  "assignedAnalyst": "analyst01",
  "status": "OPEN",
  "decision": null,
  "comments": null,
  "createdAt": "2025-03-18T15:12:04Z"
}
```

---

# 8. Submit Analyst Decision

### Endpoint

```http
PUT /api/cases/{caseId}/decision
```

### Request

```json
{
  "decision": "FALSE_POSITIVE",
  "comments": "Shared device belongs to family member."
}
```

### Response

```json
{
  "caseId": "CASE000031",
  "decision": "FALSE_POSITIVE",
  "updatedAt": "2025-03-18T16:05:17Z"
}
```

---

# 9. Get Audit Log

### Endpoint

```http
GET /api/audit/{caseId}
```

### Response

```json
[
  {
    "timestamp": "2025-03-18T15:12:04Z",
    "action": "CASE_CREATED",
    "performedBy": "analyst01"
  },
  {
    "timestamp": "2025-03-18T16:05:17Z",
    "action": "DECISION_SUBMITTED",
    "performedBy": "analyst01"
  }
]
```

---

# HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Resource Created |
| 400 | Bad Request |
| 404 | Resource Not Found |
| 500 | Internal Server Error |
