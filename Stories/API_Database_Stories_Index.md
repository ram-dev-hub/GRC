# API & Database Stories Index

**Project**: GRC Risk Module  
**Status**: Complete Specification  
**Date**: 2026-05-02  

---

## Overview

This document consolidates all REST API endpoints and database schema specifications for the GRC Risk Module across all three epics (EPIC 1: CRUD, EPIC 2: Analysis & Scoring, EPIC 3: Workflows & Approvals).

---

## REST API Endpoints

### Authentication & Authorization

All endpoints require:
- **Authorization Header**: Bearer token or Basic Auth
- **Content-Type**: application/json
- **User Role**: Must have appropriate role (Risk Officer, Risk Manager, Admin, Auditor, etc.)

HTTP Status Codes:
- **200 OK**: Successful GET, PATCH, PUT
- **201 Created**: Successful POST
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Validation error or missing required fields
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Concurrent modification or business rule violation
- **422 Unprocessable Entity**: Invalid data (e.g., invalid state transition, out-of-range score)

---

## Risk CRUD Endpoints (EPIC 1)

### Create Risk
**POST** `/api/v1/risks`

**Request Body**:
```json
{
  "description": "Payment system vulnerability in legacy module",
  "owner_id": 123,
  "department": "IT GRC",
  "priority": "High",
  "risk_type": "Technical"
}
```

**Response** (HTTP 201):
```json
{
  "risk_id": "ITG-GRC01",
  "description": "Payment system vulnerability in legacy module",
  "owner": { "id": 123, "name": "John Doe", "email": "john@company.com" },
  "department": "IT GRC",
  "priority": "High",
  "status": "Open",
  "created_at": "2026-05-02T10:30:00Z",
  "created_by": "alice@company.com",
  "links": {
    "self": "/api/v1/risks/ITG-GRC01",
    "update": "/api/v1/risks/ITG-GRC01",
    "delete": "/api/v1/risks/ITG-GRC01"
  }
}
```

**Validation**:
- description: required, max 500 chars
- owner_id: required, must exist in risk_owners table
- department: required, must be in (IT GRC, Finance, Customer Support, Learning & Development)
- priority: required, must be in (Highest, High, Medium, Low)
- risk_type: optional

**Errors**:
- 400: Missing required field
- 422: Invalid department or owner_id doesn't exist

---

### List Risks with Filters
**GET** `/api/v1/risks?limit=20&offset=0&department=ITG&status=Open&priority=High&sort=created_at&order=desc&search=payment`

**Query Parameters**:
- `limit`: 10-100, default 20
- `offset`: Pagination offset, default 0
- `department`: Filter by department (can repeat: ?department=ITG&department=FIN)
- `status`: Filter by status (Open/Closed)
- `priority`: Filter by priority (Highest/High/Medium/Low, can repeat)
- `owner`: Filter by owner email
- `sort`: Sort field (risk_id, description, created_at, modified_at, priority), default created_at
- `order`: Sort order (asc/desc), default desc
- `search`: Search in description and risk_id

**Response** (HTTP 200):
```json
{
  "data": [
    {
      "risk_id": "ITG-GRC01",
      "description": "Payment system vulnerability...",
      "department": "IT GRC",
      "owner": "John Doe",
      "status": "Open",
      "priority": "High",
      "created_at": "2026-05-02T10:30:00Z",
      "modified_at": "2026-05-02T10:30:00Z",
      "risk_score": 12,
      "severity_level": "Medium"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total_count": 45,
    "total_pages": 3,
    "current_page": 1
  },
  "links": {
    "self": "/api/v1/risks?limit=20&offset=0",
    "next": "/api/v1/risks?limit=20&offset=20"
  }
}
```

---

### Get Risk Details
**GET** `/api/v1/risks/{riskId}`

**Response** (HTTP 200):
```json
{
  "risk_id": "ITG-GRC01",
  "description": "Payment system vulnerability in legacy module",
  "owner": {
    "id": 123,
    "name": "John Doe",
    "email": "john@company.com",
    "phone": "+1-555-0123",
    "department": "IT GRC"
  },
  "department": "IT GRC",
  "priority": "High",
  "status": "Open",
  "workflow_state": "UnderReview",
  "risk_type": "Technical",
  "created_at": "2026-05-02T10:30:00Z",
  "modified_at": "2026-05-02T10:30:00Z",
  "created_by": "alice@company.com",
  "modified_by": "bob@company.com",
  
  "impact_score": 4,
  "likelihood_score": 3,
  "risk_score": 12,
  "severity_level": "Medium",
  "inherent_risk_score": 12,
  "residual_risk_score": 8,
  
  "impact_analysis": {
    "financial_impact": "Potential data loss worth $500K",
    "operational_impact": "System downtime of 4-8 hours",
    "compliance_impact": "PCI-DSS compliance violation",
    "reputational_impact": "Customer trust impact",
    "security_impact": "Payment data exposure"
  },
  
  "likelihood_analysis": {
    "threat_landscape_score": 4,
    "control_effectiveness_score": 2,
    "incident_history_score": 3,
    "attacker_capability_score": 4,
    "vulnerability_status_score": 5
  },
  
  "treatment_strategy": "MITIGATE",
  "treatment_justification": "Implement additional input validation and encryption",
  
  "approval_status": "Pending",
  "pending_approvers": [
    { "name": "Risk Manager", "email": "manager@company.com", "sent_date": "2026-05-02T10:30:00Z" }
  ],
  
  "remediation_tasks": [
    {
      "id": 1,
      "task_name": "Implement input validation",
      "assigned_to": "dev@company.com",
      "due_date": "2026-05-15",
      "status": "In Progress",
      "percent_complete": 60
    }
  ],
  
  "audit_history": [
    {
      "action": "Risk Created",
      "actor": "alice@company.com",
      "timestamp": "2026-05-02T10:30:00Z",
      "changed_fields": { "impact_score": "4", "likelihood_score": "3" }
    }
  ],
  
  "related_risks": [
    { "risk_id": "ITG-GRC02", "description": "Database encryption gap...", "similarity": 0.85 }
  ],
  
  "eTag": "W/\"abc123def456\"",
  "links": {
    "self": "/api/v1/risks/ITG-GRC01",
    "update": "/api/v1/risks/ITG-GRC01",
    "delete": "/api/v1/risks/ITG-GRC01",
    "tasks": "/api/v1/risks/ITG-GRC01/remediation-tasks",
    "assessments": "/api/v1/risks/ITG-GRC01/assessments"
  }
}
```

**Headers**:
- `ETag: W/"abc123def456"` (for caching)

---

### Update Risk (Partial)
**PATCH** `/api/v1/risks/{riskId}`

**Request Body** (only include fields to update):
```json
{
  "description": "Updated payment system vulnerability description",
  "priority": "Critical",
  "owner_id": 125
}
```

**Response** (HTTP 200):
```json
{
  "risk_id": "ITG-GRC01",
  "description": "Updated payment system vulnerability description",
  "priority": "Critical",
  "owner_id": 125,
  "modified_at": "2026-05-02T11:00:00Z",
  "modified_by": "bob@company.com"
}
```

**Immutable Fields** (cannot be updated):
- risk_id
- created_at
- created_by
- department

**Errors**:
- 400: Cannot update immutable field
- 404: Risk not found
- 422: Invalid value for field

---

### Replace Risk (Full)
**PUT** `/api/v1/risks/{riskId}`

**Request Body** (must include all required fields):
```json
{
  "description": "Complete payment system risk",
  "owner_id": 123,
  "department": "IT GRC",
  "priority": "High",
  "risk_type": "Technical"
}
```

**Response** (HTTP 200):
- Returns complete risk object with all fields

---

### Delete Risk (Soft Delete)
**DELETE** `/api/v1/risks/{riskId}`

**Response** (HTTP 204 No Content)
- Empty body
- Risk marked as deleted (soft delete)
- Can be restored with restore endpoint

**Errors**:
- 403: Insufficient permissions
- 404: Risk not found
- 422: Risk has dependencies (open tasks)

---

### Restore Deleted Risk
**PATCH** `/api/v1/risks/{riskId}/restore`

**Request Body**:
```json
{
  "reason": "Incorrectly deleted"
}
```

**Response** (HTTP 200):
- Returns restored risk object

**Auth**: Admin only

---

## Risk Analysis & Scoring Endpoints (EPIC 2)

### Update Impact Score
**PATCH** `/api/v1/risks/{riskId}/impact`

**Request Body**:
```json
{
  "impact_score": 4,
  "impact_justification": "Significant financial impact if payment system compromised. Estimated $500K revenue impact."
}
```

**Response** (HTTP 200):
```json
{
  "risk_id": "ITG-GRC01",
  "impact_score": 4,
  "impact_justification": "...",
  "risk_score": 12,
  "severity_level": "Medium",
  "modified_at": "2026-05-02T11:00:00Z"
}
```

**Validation**:
- impact_score: required, must be 1-5
- impact_justification: required, max 500 chars

**Triggers**:
- Risk score recalculation
- Notification if score increases significantly

---

### Update Detailed Impact Analysis
**PATCH** `/api/v1/risks/{riskId}/impact-analysis`

**Request Body**:
```json
{
  "financial_impact": 4,
  "operational_impact": 3,
  "compliance_impact": 5,
  "reputational_impact": 4,
  "security_impact": 5
}
```

**Response** (HTTP 200):
- Returns impact_analysis object with all dimensions
- Calculates overall impact_score (weighted average)

---

### Update Likelihood Score
**PATCH** `/api/v1/risks/{riskId}/likelihood`

**Request Body**:
```json
{
  "likelihood_score": 3,
  "likelihood_justification": "Moderate probability given existing controls."
}
```

**Response** (HTTP 200):
- Returns updated likelihood_score and recalculated risk_score

---

### Update Detailed Likelihood Analysis
**PATCH** `/api/v1/risks/{riskId}/likelihood-analysis`

**Request Body**:
```json
{
  "threat_landscape_score": 4,
  "control_effectiveness_score": 2,
  "incident_history_score": 3,
  "attacker_capability_score": 4,
  "vulnerability_status_score": 5
}
```

**Response** (HTTP 200):
- Returns likelihood_analysis with all factors
- Calculates overall likelihood_score (weighted by: threat 20%, control 30%, incident 15%, attacker 20%, vuln 15%)

---

### Get Risk Score History
**GET** `/api/v1/risks/{riskId}/score-history?days=90`

**Query Parameters**:
- `days`: Show history for last N days (default 90)
- `type`: inherent or residual (default both)

**Response** (HTTP 200):
```json
{
  "risk_id": "ITG-GRC01",
  "history": [
    {
      "timestamp": "2026-05-02T11:00:00Z",
      "impact_score": 4,
      "likelihood_score": 3,
      "risk_score": 12,
      "severity_level": "Medium",
      "changed_by": "bob@company.com",
      "change_type": "impact_score_updated"
    }
  ]
}
```

---

## Risk Workflow & Approval Endpoints (EPIC 3)

### Update Workflow State
**PATCH** `/api/v1/risks/{riskId}/workflow-state`

**Request Body**:
```json
{
  "workflow_state": "ReadyForReview",
  "transition_reason": "Impact and likelihood analysis complete"
}
```

**Response** (HTTP 200):
```json
{
  "risk_id": "ITG-GRC01",
  "workflow_state": "ReadyForReview",
  "state_changed_at": "2026-05-02T11:00:00Z",
  "transition_reason": "..."
}
```

**Valid Transitions**:
- Open → UnderReview, FinalClosed
- UnderReview → ReadyForReview, Open
- ReadyForReview → Approved, UnderReview
- Approved → FinalClosed, UnderReview
- FinalClosed → Archived

**Validation**:
- Verify user has permission for transition
- Verify business rules (e.g., treatment strategy selected before Approved)

---

### Select Treatment Strategy
**PATCH** `/api/v1/risks/{riskId}/treatment-strategy`

**Request Body** (Example: MITIGATE):
```json
{
  "treatment_strategy": "MITIGATE",
  "treatment_justification": "Implement additional security controls",
  "mitigation_tasks": [
    {
      "task_name": "Implement input validation",
      "description": "Add comprehensive input validation layer",
      "assigned_to": "dev@company.com",
      "due_date": "2026-05-15",
      "priority": "High"
    }
  ]
}
```

**Request Body** (Example: ACCEPT):
```json
{
  "treatment_strategy": "ACCEPT",
  "accepted_by": "executive@company.com",
  "acceptance_deadline": "2026-12-31",
  "acceptance_justification": "Risk acceptable given business value"
}
```

**Response** (HTTP 200):
- Returns updated risk with treatment_strategy

**Valid Strategies**: ACCEPT, MITIGATE, AVOID, TRANSFER

---

### Create Remediation Task
**POST** `/api/v1/risks/{riskId}/remediation-tasks`

**Request Body**:
```json
{
  "task_name": "Implement input validation",
  "description": "Add comprehensive input validation to payment module",
  "assigned_to": "dev@company.com",
  "due_date": "2026-05-15",
  "priority": "High"
}
```

**Response** (HTTP 201):
```json
{
  "id": 1,
  "risk_id": "ITG-GRC01",
  "task_name": "Implement input validation",
  "assigned_to": "dev@company.com",
  "due_date": "2026-05-15",
  "priority": "High",
  "status": "Not Started",
  "percent_complete": 0,
  "created_at": "2026-05-02T11:00:00Z"
}
```

---

### Update Task Status
**PATCH** `/api/v1/remediation-tasks/{taskId}/status`

**Request Body**:
```json
{
  "status": "In Progress",
  "percent_complete": 50,
  "comments": "Started implementation, 50% complete"
}
```

**Response** (HTTP 200):
- Returns updated task with new status and timestamp

---

### Mark Task Complete
**PATCH** `/api/v1/remediation-tasks/{taskId}/complete`

**Request Body**:
```json
{
  "completion_comments": "Implementation complete and tested",
  "evidence_link": "https://github.com/org/repo/pulls/1234"
}
```

**Response** (HTTP 200):
- Returns task with status = "Pending Verification"
- Risk Officer receives notification to verify

---

### Verify Task Completion
**PATCH** `/api/v1/remediation-tasks/{taskId}/verify`

**Request Body**:
```json
{
  "verified": true,
  "verification_comments": "Code review and testing confirmed"
}
```

**Response** (HTTP 200):
- Returns task with status = "Complete"
- verified_at and verified_by recorded

**Auth**: Risk Officer or higher

---

### Request Risk Approval
**PATCH** `/api/v1/risks/{riskId}/request-approval`

**Request Body**:
```json
{
  "requested_by": "risk_officer@company.com"
}
```

**Response** (HTTP 200):
- Creates approval_requests for required approvers
- Sends approval request emails
- Returns approval_status and pending_approvers

---

### Approve or Reject Risk
**PATCH** `/api/v1/risks/{riskId}/approval`

**Request Body**:
```json
{
  "approval_action": "APPROVE",
  "approver_comments": "Risk assessment looks good. Approve proceeding to mitigation."
}
```

**Response** (HTTP 200):
```json
{
  "risk_id": "ITG-GRC01",
  "approval_status": "Approved",
  "approved_by": [
    {
      "approver": "manager@company.com",
      "role": "Risk Manager",
      "approval_date": "2026-05-02T11:00:00Z",
      "comments": "..."
    }
  ]
}
```

**Valid Actions**: APPROVE, REJECT

**Validation**:
- Verify user is authorized approver for this risk
- If all required approvers approve → transition to "Approved" state
- If any reject → transition back to "UnderReview", send rework notification

---

## Complete Database Schema

### Core Risk Table
```sql
CREATE TABLE risks (
  id SERIAL PRIMARY KEY,
  risk_id VARCHAR(20) UNIQUE NOT NULL,
  description VARCHAR(500) NOT NULL,
  owner_id INTEGER NOT NULL REFERENCES risk_owners(id),
  department VARCHAR(50) NOT NULL,
  priority VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'Open',
  risk_type VARCHAR(50),
  workflow_state VARCHAR(50) DEFAULT 'Open',
  state_changed_at TIMESTAMP,
  
  -- Scoring
  impact_score INT,
  likelihood_score INT,
  risk_score INT GENERATED ALWAYS AS (impact_score * likelihood_score) STORED,
  inherent_risk_score INT,
  residual_risk_score INT,
  severity_level VARCHAR(20),
  
  -- Analysis
  impact_justification VARCHAR(500),
  likelihood_justification VARCHAR(500),
  impact_analysis JSONB,
  likelihood_analysis JSONB,
  detailed_impact_desc TEXT,
  detailed_likelihood_desc TEXT,
  financial_impact_estimate DECIMAL(15,2),
  operational_downtime_hours INT,
  affected_customers INT,
  
  -- Treatment
  treatment_strategy VARCHAR(20),
  treatment_strategy_created_at TIMESTAMP,
  treatment_justification VARCHAR(500),
  closure_reason VARCHAR(500),
  reopen_reason VARCHAR(500),
  
  -- Audit
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_by VARCHAR(255),
  modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  
  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('Open', 'Closed')),
  CONSTRAINT valid_priority CHECK (priority IN ('Highest', 'High', 'Medium', 'Low')),
  CONSTRAINT valid_workflow CHECK (workflow_state IN ('Open', 'UnderReview', 'ReadyForReview', 'Approved', 'FinalClosed', 'Archived')),
  CONSTRAINT valid_treatment CHECK (treatment_strategy IN ('ACCEPT', 'MITIGATE', 'AVOID', 'TRANSFER', NULL))
);

CREATE INDEX idx_risks_owner ON risks(owner_id);
CREATE INDEX idx_risks_department ON risks(department);
CREATE INDEX idx_risks_status ON risks(status);
CREATE INDEX idx_risks_workflow ON risks(workflow_state);
CREATE INDEX idx_risks_created ON risks(created_at DESC);
CREATE INDEX idx_risks_risk_score ON risks(risk_score DESC);
```

### Related Tables
```sql
CREATE TABLE risk_owners (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  department VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR(50),
  entity_id VARCHAR(20),
  action VARCHAR(50),
  actor_email VARCHAR(255),
  old_values JSONB,
  new_values JSONB,
  changed_fields TEXT[],
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

CREATE TABLE remediation_tasks (
  id SERIAL PRIMARY KEY,
  risk_id VARCHAR(20) NOT NULL REFERENCES risks(risk_id),
  task_name VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to_id INTEGER REFERENCES users(id),
  created_by_id INTEGER REFERENCES users(id),
  due_date DATE NOT NULL,
  priority VARCHAR(20),
  status VARCHAR(50) DEFAULT 'Not Started',
  percent_complete INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  verified_at TIMESTAMP,
  verified_by_id INTEGER REFERENCES users(id),
  CONSTRAINT valid_status CHECK (status IN ('Not Started', 'In Progress', 'Complete', 'Overdue', 'Pending Verification'))
);

CREATE TABLE approval_requests (
  id SERIAL PRIMARY KEY,
  risk_id VARCHAR(20) NOT NULL REFERENCES risks(risk_id),
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  requested_by_id INTEGER NOT NULL REFERENCES users(id),
  due_date DATE,
  status VARCHAR(50) DEFAULT 'Pending',
  CONSTRAINT valid_approval_status CHECK (status IN ('Pending', 'Approved', 'Rejected'))
);

CREATE TABLE approvals (
  id SERIAL PRIMARY KEY,
  approval_request_id INTEGER NOT NULL REFERENCES approval_requests(id),
  approver_id INTEGER NOT NULL REFERENCES users(id),
  approver_role VARCHAR(50),
  approval_date TIMESTAMP,
  approval_action VARCHAR(20),
  comments VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_action CHECK (approval_action IN ('APPROVE', 'REJECT'))
);
```

---

## Error Response Format

All errors follow standard format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "impact_score",
        "message": "must be between 1 and 5"
      },
      {
        "field": "owner_id",
        "message": "owner with id 999 not found"
      }
    ]
  }
}
```

---

## API Security

- **Authentication**: Bearer token (JWT) or Basic Auth
- **Authorization**: Role-based (Risk Officer, Risk Manager, Admin, Auditor)
- **Rate Limiting**: 1000 requests per hour per user
- **Timeout**: 30 seconds per request
- **CORS**: Allowed from registered domains only
- **HTTPS**: All endpoints require HTTPS
- **Data Encryption**: Sensitive fields encrypted at rest

---

## Pagination Details

Default: `limit=20, offset=0`

Example: `/api/v1/risks?limit=50&offset=100`

Response includes:
- `total_count`: Total number of matching records
- `total_pages`: Number of pages
- `current_page`: Current page (calculated from limit+offset)
- `limit`: Items per page
- `offset`: Starting position
- `links.next`: URL to next page (if applicable)
- `links.prev`: URL to previous page (if applicable)

---

## Complete API Endpoint Summary

| Method | Endpoint | Description | HTTP Status |
|--------|----------|-------------|------------|
| POST | /api/v1/risks | Create risk | 201 |
| GET | /api/v1/risks | List risks | 200 |
| GET | /api/v1/risks/{id} | Get risk | 200 |
| PATCH | /api/v1/risks/{id} | Partial update | 200 |
| PUT | /api/v1/risks/{id} | Full replace | 200 |
| DELETE | /api/v1/risks/{id} | Soft delete | 204 |
| PATCH | /api/v1/risks/{id}/restore | Restore deleted | 200 |
| PATCH | /api/v1/risks/{id}/impact | Update impact score | 200 |
| PATCH | /api/v1/risks/{id}/impact-analysis | Detailed impact | 200 |
| PATCH | /api/v1/risks/{id}/likelihood | Update likelihood | 200 |
| PATCH | /api/v1/risks/{id}/likelihood-analysis | Detailed likelihood | 200 |
| GET | /api/v1/risks/{id}/score-history | Score history | 200 |
| PATCH | /api/v1/risks/{id}/workflow-state | Change workflow | 200 |
| PATCH | /api/v1/risks/{id}/treatment-strategy | Select treatment | 200 |
| POST | /api/v1/risks/{id}/remediation-tasks | Create task | 201 |
| PATCH | /api/v1/remediation-tasks/{id}/status | Update task | 200 |
| PATCH | /api/v1/remediation-tasks/{id}/complete | Mark complete | 200 |
| PATCH | /api/v1/remediation-tasks/{id}/verify | Verify completion | 200 |
| PATCH | /api/v1/risks/{id}/request-approval | Request approval | 200 |
| PATCH | /api/v1/risks/{id}/approval | Approve/reject | 200 |

