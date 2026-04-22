# GRC Administrator & Auditor Tool

## Project Overview

A comprehensive Governance, Risk, and Compliance (GRC) tool designed to help organizations manage security risks through log analysis, AI-powered risk assessment, and compliance monitoring.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (UI)                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Dashboard  │  │ Risk Viewer │  │  Audit Logs │  │ Architecture Viewer │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                           React / Next.js / TypeScript                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                     │
│                         (REST API / GraphQL)                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          ▼                           ▼                           ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────────────┐
│  Backend API    │       │   AI Engine     │       │   Log Processing        │
│  (Node.js/      │       │  (Claude/GPT)   │       │   Pipeline              │
│   Python)       │       │                 │       │                         │
└─────────────────┘       └─────────────────┘       └─────────────────────────┘
          │                           │                           │
          └───────────────────────────┼───────────────────────────┘
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATA & STORAGE LAYER                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────────────┐   │
│  │  AWS S3     │  │ AWS Athena  │  │  PostgreSQL │  │  Elasticsearch    │   │
│  │  (Raw Logs) │  │  (Queries)  │  │  (Metadata) │  │  (Search/Index)   │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Project Phases & Tasks

### Phase 1: Log Analysis & Data Ingestion

| Task | Log Type | Source Service | Security Value |
|------|----------|----------------|----------------|
| Analyze which logs to be pulled in | Management Events | AWS CloudTrail | Tracks "who did what" via API calls. Essential for detecting unauthorized configuration changes or root account usage |
| Analyze which logs to be pulled in | Network Traffic | VPC Flow Logs | Records IP traffic to/from network interfaces. Helps identify data exfiltration or communication with known malicious IPs |
| Analyze which logs to be pulled in | Data Access | S3 Access Logs | Tracks requests to S3 buckets. Vital for seeing who is reading or deleting sensitive data |
| Analyze which logs to be pulled in | DNS Queries | Route 53 Resolver Logs | Shows which domains your resources are connecting to (useful for spotting malware beaconing) |
| Analyze which logs to be pulled in | Web Traffic | WAF Logs | Records requests blocked or allowed by your Web Application Firewall, highlighting SQLi or XSS attempts |
| Analyze which logs to be pulled in | Compute Logs | CloudWatch Agent | Pulls OS-level logs (e.g., /var/log/auth.log or Windows Event Logs) from EC2 instances |
| Analyze which logs to be pulled in | Mongo, Aurora logs | DBs | DB instances storing sensitive information |
| Analyze which logs to be pulled in | Datadog logs | Datadog | Identify the log type we need for risk analysis |

### Phase 2: Normalization Layer

| Task | Scope | Description |
|------|-------|-------------|
| Confirm the Normalization layer | All scoped in logs | Work on a Normalization layer to keep all the logs in a particular format for risk analysis |

### Phase 3: Infrastructure Layer for Log Storage

| Task | Scope | Description |
|------|-------|-------------|
| Identify and configure Infrastructure Layer | All scoped in logs | Identify if we will be using AWS Athena or AWS S3 for log storage and analysis |
| Identify and configure Infrastructure Layer | All scoped in logs | Identify the technical constraints in pulling the logs from Wiz and Datadog |
| Identify and configure Infrastructure Layer | All scoped in logs | Identify the technical constraints and get support from CloudOps, SOC and Prod sec teams |

### Phase 4: AI Engine Integration

| Task | AI Engine | Description |
|------|-----------|-------------|
| Identify AI engine for the job | Claude / Tek GPT | Select and configure appropriate AI model |
| Help AI to learn security infrastructure | Claude / Tek GPT | Train AI on security patterns and infrastructure |
| Assist AI to draw out Architecture Analysis for a given risk | Claude / Tek GPT | Enable AI-driven architecture risk mapping |
| Train AI to draw architecture analysis, risk scoring, risk evaluation | Claude / Tek GPT | Implement risk scoring algorithms |

### Phase 5: Frontend UI & Infrastructure

| Task | AI Engine | Description |
|------|-----------|-------------|
| Identify R&D for front end UI and associated infrastructure needs | Claude / Tek GPT | Research and design UI components |
| Get the trained out data to be showed in UI | Claude / Tek GPT | Display AI analysis results in dashboard |

### Phase 6: Compliance Framework Integration

| Task | Scope | Description |
|------|-------|-------------|
| Map controls to compliance frameworks | All regulations | Map security controls to SOC 2, ISO 27001, NIST, GDPR, HIPAA, PCI-DSS |
| Implement compliance scoring | Per framework | Calculate compliance posture scores per framework |
| Generate compliance reports | Auditor workflow | Auto-generate audit-ready compliance reports |
| Evidence collection automation | All controls | Automate evidence gathering for audit requirements |

### Phase 7: Alerting & Incident Response

| Task | Scope | Description |
|------|-------|-------------|
| Configure real-time alerting | Critical risks | Set up alerts for critical/high severity risks via Slack, PagerDuty, Email |
| Implement incident workflows | SOC integration | Create automated incident response playbooks |
| Define escalation matrix | All severities | Configure escalation paths based on risk severity |
| Integrate with ticketing systems | JIRA/ServiceNow | Auto-create tickets for identified risks |

### Phase 8: Reporting & Analytics

| Task | Scope | Description |
|------|-------|-------------|
| Executive dashboard | Leadership | High-level risk posture and trends for executives |
| Trend analysis & historical reporting | All data | Track risk trends over time |
| Custom report builder | Auditors | Allow auditors to create custom compliance reports |
| Scheduled report generation | All stakeholders | Automated weekly/monthly risk reports |

### Phase 9: Risk Remediation Workflow

| Task | Scope | Description |
|------|-------|-------------|
| Risk acceptance workflow | All risks | Enable formal risk acceptance with approvals |
| Remediation tracking | Assigned risks | Track remediation progress and due dates |
| Risk owner assignment | All risks | Assign risk owners and accountability |
| SLA monitoring | Remediation | Monitor remediation SLAs and send reminders |

### Phase 10: Testing & Validation

| Task | Scope | Description |
|------|-------|-------------|
| Unit & integration testing | All modules | Comprehensive test coverage |
| Security testing (SAST/DAST) | Application | Vulnerability scanning of the GRC tool itself |
| Performance & load testing | Infrastructure | Ensure system handles log volume at scale |
| UAT with stakeholders | End-to-end | User acceptance testing with SOC, CloudOps, Auditors |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React / Next.js** | UI Framework |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Styling |
| **D3.js / Chart.js** | Data visualization |
| **React Query** | Data fetching & caching |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js / Express** | API Server |
| **Python (FastAPI)** | AI/ML Services |
| **GraphQL** | Flexible data queries |
| **Redis** | Caching & session management |

### Data & Storage
| Technology | Purpose |
|------------|---------|
| **AWS S3** | Raw log storage |
| **AWS Athena** | SQL queries on S3 data |
| **PostgreSQL** | Relational data (users, policies, metadata) |
| **Elasticsearch** | Full-text search & log indexing |
| **TimescaleDB** | Time-series data for metrics |

### AI/ML
| Technology | Purpose |
|------------|---------|
| **Claude API** | Risk analysis & natural language processing |
| **OpenAI GPT** | Alternative AI engine |
| **LangChain** | AI orchestration |
| **Vector DB (Pinecone/Weaviate)** | Semantic search for security patterns |

### DevOps & Infrastructure
| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Kubernetes** | Container orchestration |
| **Terraform** | Infrastructure as Code |
| **AWS CDK** | Cloud infrastructure |
| **GitHub Actions** | CI/CD pipeline |

---

## Data Flow Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           LOG SOURCES                                         │
├──────────────┬──────────────┬──────────────┬──────────────┬─────────────────┤
│  CloudTrail  │  VPC Flow    │  S3 Access   │  WAF Logs    │  Datadog/Wiz   │
│              │  Logs        │  Logs        │              │                 │
└──────┬───────┴──────┬───────┴──────┬───────┴──────┬───────┴────────┬────────┘
       │              │              │              │                │
       ▼              ▼              ▼              ▼                ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                     INGESTION LAYER (Lambda / Kinesis)                        │
└──────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                     NORMALIZATION LAYER                                       │
│  • Schema standardization          • Field mapping                            │
│  • Timestamp normalization         • Data enrichment                          │
│  • Event categorization            • Deduplication                            │
└──────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                     STORAGE LAYER                                             │
│  ┌─────────────────────┐       ┌─────────────────────────────────────────┐   │
│  │   AWS S3 (Raw)      │       │   Processed / Indexed Data              │   │
│  │   - Parquet format  │  ──►  │   - Elasticsearch (searchable)          │   │
│  │   - Partitioned     │       │   - Athena (queryable)                  │   │
│  └─────────────────────┘       └─────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                     AI ANALYSIS LAYER                                         │
│  ┌─────────────────────┐       ┌─────────────────────────────────────────┐   │
│  │   Risk Detection    │       │   Architecture Analysis                  │   │
│  │   • Anomaly detect  │       │   • Dependency mapping                   │   │
│  │   • Pattern match   │       │   • Vulnerability assessment             │   │
│  │   • Threat intel    │       │   • Compliance check                     │   │
│  └─────────────────────┘       └─────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER (UI)                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐  │
│  │ Dashboards │  │ Risk Scores│  │ Alerts     │  │ Architecture Diagrams │  │
│  └────────────┘  └────────────┘  └────────────┘  └────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema (PostgreSQL)

```sql
-- Users & Roles
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'admin', 'auditor', 'viewer'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Risk Assessments
CREATE TABLE risk_assessments (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    risk_score DECIMAL(3,2), -- 0.00 to 10.00
    severity VARCHAR(20), -- 'critical', 'high', 'medium', 'low'
    status VARCHAR(50),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Log Sources Configuration
CREATE TABLE log_sources (
    id UUID PRIMARY KEY,
    source_type VARCHAR(100) NOT NULL,
    source_name VARCHAR(255) NOT NULL,
    connection_config JSONB,
    is_active BOOLEAN DEFAULT true,
    last_sync TIMESTAMP
);

-- Audit Trail
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    details JSONB,
    ip_address INET,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Analysis Results
CREATE TABLE ai_analysis (
    id UUID PRIMARY KEY,
    analysis_type VARCHAR(100),
    input_data JSONB,
    output_result JSONB,
    confidence_score DECIMAL(3,2),
    model_used VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Compliance Frameworks
CREATE TABLE compliance_frameworks (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- 'SOC2', 'ISO27001', 'NIST', 'GDPR', 'HIPAA', 'PCI-DSS'
    version VARCHAR(50),
    description TEXT,
    is_active BOOLEAN DEFAULT true
);

-- Compliance Controls
CREATE TABLE compliance_controls (
    id UUID PRIMARY KEY,
    framework_id UUID REFERENCES compliance_frameworks(id),
    control_id VARCHAR(50) NOT NULL, -- e.g., 'CC6.1', 'A.9.1.1'
    control_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'not_assessed' -- 'compliant', 'non_compliant', 'partially_compliant', 'not_assessed'
);

-- Risk to Control Mapping
CREATE TABLE risk_control_mapping (
    id UUID PRIMARY KEY,
    risk_id UUID REFERENCES risk_assessments(id),
    control_id UUID REFERENCES compliance_controls(id),
    mapping_type VARCHAR(50), -- 'mitigating', 'detecting', 'preventive'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Incidents & Alerts
CREATE TABLE incidents (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(20) NOT NULL, -- 'critical', 'high', 'medium', 'low'
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'closed'
    source_log_id VARCHAR(255),
    assigned_to UUID REFERENCES users(id),
    escalation_level INT DEFAULT 0,
    detected_at TIMESTAMP,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Remediation Tasks
CREATE TABLE remediation_tasks (
    id UUID PRIMARY KEY,
    risk_id UUID REFERENCES risk_assessments(id),
    incident_id UUID REFERENCES incidents(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'overdue'
    priority VARCHAR(20),
    assigned_to UUID REFERENCES users(id),
    due_date DATE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Evidence Collection
CREATE TABLE evidence (
    id UUID PRIMARY KEY,
    control_id UUID REFERENCES compliance_controls(id),
    evidence_type VARCHAR(100), -- 'screenshot', 'log', 'document', 'config'
    file_path VARCHAR(500),
    description TEXT,
    collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    collected_by UUID REFERENCES users(id),
    valid_until DATE
);

-- Notification Rules
CREATE TABLE notification_rules (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    condition_type VARCHAR(100), -- 'risk_score_threshold', 'severity', 'compliance_gap'
    condition_value JSONB,
    notification_channels JSONB, -- ['email', 'slack', 'pagerduty']
    recipients JSONB,
    is_active BOOLEAN DEFAULT true
);

-- Scheduled Reports
CREATE TABLE scheduled_reports (
    id UUID PRIMARY KEY,
    report_name VARCHAR(255) NOT NULL,
    report_type VARCHAR(100), -- 'compliance', 'risk_summary', 'executive', 'audit'
    schedule_cron VARCHAR(100), -- cron expression
    recipients JSONB,
    last_generated TIMESTAMP,
    next_run TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user |

### Risk Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/risks` | List all risk assessments |
| POST | `/api/risks` | Create new risk assessment |
| GET | `/api/risks/:id` | Get risk details |
| PUT | `/api/risks/:id` | Update risk assessment |
| DELETE | `/api/risks/:id` | Delete risk assessment |

### Log Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/logs` | Query logs with filters |
| GET | `/api/logs/sources` | List log sources |
| POST | `/api/logs/sources` | Add new log source |
| GET | `/api/logs/analyze` | Trigger AI analysis |

### AI Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/analyze-risk` | AI risk analysis |
| POST | `/api/ai/architecture-review` | Architecture analysis |
| GET | `/api/ai/recommendations` | Get AI recommendations |

### Audit
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/audit/logs` | Get audit trail |
| GET | `/api/audit/reports` | Generate audit reports |

### Compliance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/compliance/frameworks` | List all compliance frameworks |
| GET | `/api/compliance/frameworks/:id/controls` | Get controls for a framework |
| PUT | `/api/compliance/controls/:id/status` | Update control compliance status |
| GET | `/api/compliance/score` | Get overall compliance score |
| GET | `/api/compliance/gaps` | Get compliance gaps |
| POST | `/api/compliance/evidence` | Upload evidence for a control |

### Incidents & Alerts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/incidents` | List all incidents |
| POST | `/api/incidents` | Create new incident |
| PUT | `/api/incidents/:id` | Update incident status |
| POST | `/api/incidents/:id/escalate` | Escalate incident |
| GET | `/api/alerts/rules` | Get alerting rules |
| POST | `/api/alerts/rules` | Create alerting rule |

### Remediation
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/remediation/tasks` | List remediation tasks |
| POST | `/api/remediation/tasks` | Create remediation task |
| PUT | `/api/remediation/tasks/:id` | Update task status |
| GET | `/api/remediation/sla-status` | Get SLA compliance status |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/executive` | Generate executive summary |
| GET | `/api/reports/compliance/:framework` | Generate compliance report |
| GET | `/api/reports/risk-trends` | Get risk trend analytics |
| POST | `/api/reports/schedule` | Schedule automated reports |
| GET | `/api/reports/custom` | Generate custom report |

### Integrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/integrations/jira/sync` | Sync with JIRA |
| POST | `/api/integrations/servicenow/ticket` | Create ServiceNow ticket |
| GET | `/api/integrations/wiz/findings` | Pull Wiz security findings |
| GET | `/api/integrations/datadog/logs` | Pull Datadog logs |

---

## Security Considerations

### Authentication & Authorization
- **OAuth 2.0 / OIDC** for authentication
- **RBAC (Role-Based Access Control)** with roles: Admin, Auditor, Viewer
- **JWT tokens** with short expiration
- **MFA** enforcement for admin users

### Data Security
- **Encryption at rest** (AES-256) for all stored data
- **Encryption in transit** (TLS 1.3)
- **Data masking** for sensitive fields in logs
- **Audit logging** for all data access

### Infrastructure Security
- **VPC isolation** for all services
- **WAF** protection for public endpoints
- **Security groups** with least privilege
- **Secrets management** via AWS Secrets Manager

### Compliance & Regulatory
- **Data retention policies** aligned with regulatory requirements
- **Right to be forgotten** (GDPR) data deletion capabilities
- **Audit trail immutability** for compliance evidence
- **Geographic data residency** considerations

---

## Compliance Frameworks Supported

| Framework | Description | Key Controls |
|-----------|-------------|--------------|
| **SOC 2 Type II** | Service organization controls | CC1-CC9 (Security, Availability, Processing Integrity, Confidentiality, Privacy) |
| **ISO 27001** | Information security management | Annex A controls (A.5 - A.18) |
| **NIST CSF** | Cybersecurity framework | Identify, Protect, Detect, Respond, Recover |
| **NIST 800-53** | Security and privacy controls | AC, AU, CA, CM, CP, IA, IR, MA, MP, PE, PL, PM, PS, RA, SA, SC, SI, SR |
| **GDPR** | EU data protection | Articles 5-49 (Data processing, rights, transfers) |
| **HIPAA** | Healthcare data protection | Administrative, Physical, Technical safeguards |
| **PCI-DSS** | Payment card security | Requirements 1-12 |
| **CIS Controls** | Critical security controls | 18 control categories |

---

## Alerting & Notification Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ALERTING ENGINE                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────────┐ │
│  │  Risk Triggers   │     │  Compliance      │     │  Anomaly Detection   │ │
│  │  • Score > 8.0   │     │  Triggers        │     │  • ML-based alerts   │ │
│  │  • Critical sev  │     │  • Control fail  │     │  • Baseline deviation│ │
│  │  • New vuln      │     │  • Gap detected  │     │  • Unusual patterns  │ │
│  └────────┬─────────┘     └────────┬─────────┘     └──────────┬───────────┘ │
│           │                        │                          │              │
│           └────────────────────────┼──────────────────────────┘              │
│                                    ▼                                         │
│                        ┌──────────────────────┐                              │
│                        │   Rule Engine        │                              │
│                        │   (Condition Match)  │                              │
│                        └──────────┬───────────┘                              │
│                                   │                                          │
│           ┌───────────────────────┼───────────────────────────┐              │
│           ▼                       ▼                           ▼              │
│  ┌──────────────┐       ┌──────────────┐            ┌──────────────┐        │
│  │    Slack     │       │    Email     │            │  PagerDuty   │        │
│  │   Webhook    │       │    SMTP      │            │    Alerts    │        │
│  └──────────────┘       └──────────────┘            └──────────────┘        │
│           │                       │                           │              │
│           └───────────────────────┼───────────────────────────┘              │
│                                   ▼                                          │
│                        ┌──────────────────────┐                              │
│                        │  JIRA / ServiceNow   │                              │
│                        │  Ticket Creation     │                              │
│                        └──────────────────────┘                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Alert Severity Matrix

| Severity | Response Time | Escalation | Notification Channel |
|----------|---------------|------------|----------------------|
| **Critical** | 15 minutes | Immediate to Security Lead | PagerDuty + Slack + Email |
| **High** | 1 hour | 2 hours to Manager | Slack + Email |
| **Medium** | 4 hours | 24 hours if unresolved | Email + JIRA ticket |
| **Low** | 24 hours | Weekly review | Email digest |

---

## Risk Scoring Methodology

### Risk Score Calculation

$$Risk\ Score = Impact \times Likelihood \times (1 - Control\ Effectiveness)$$

### Scoring Matrix

| Impact Level | Score | Description |
|--------------|-------|-------------|
| Critical | 10 | Business-ending, major data breach, regulatory action |
| High | 7-9 | Significant financial loss, service outage |
| Medium | 4-6 | Moderate impact, contained incident |
| Low | 1-3 | Minor impact, easily recoverable |

| Likelihood | Score | Description |
|------------|-------|-------------|
| Almost Certain | 5 | Expected to occur frequently |
| Likely | 4 | Will probably occur |
| Possible | 3 | Might occur |
| Unlikely | 2 | Could occur but not expected |
| Rare | 1 | May occur only in exceptional circumstances |

### AI-Enhanced Risk Scoring

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI RISK SCORING ENGINE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Inputs:                                                         │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────┐ │
│  │ Log Patterns   │  │ Historical     │  │ Threat Intel       │ │
│  │ & Anomalies    │  │ Incidents      │  │ Feeds              │ │
│  └───────┬────────┘  └───────┬────────┘  └─────────┬──────────┘ │
│          │                   │                     │             │
│          └───────────────────┼─────────────────────┘             │
│                              ▼                                   │
│                   ┌──────────────────────┐                       │
│                   │   Claude / GPT       │                       │
│                   │   Risk Analysis      │                       │
│                   │   • Context aware    │                       │
│                   │   • Pattern learning │                       │
│                   │   • Recommendation   │                       │
│                   └──────────┬───────────┘                       │
│                              │                                   │
│                              ▼                                   │
│  Outputs:                                                        │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────┐ │
│  │ Risk Score     │  │ Architecture   │  │ Remediation        │ │
│  │ (0-10)         │  │ Impact Map     │  │ Recommendations    │ │
│  └────────────────┘  └────────────────┘  └────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Third-Party Integrations

### Security Tools Integration

| Tool | Integration Type | Data Flow | Purpose |
|------|------------------|-----------|---------|
| **Wiz** | API Pull | Wiz → GRC Tool | Cloud security findings, vulnerability data |
| **Datadog** | API Pull | Datadog → GRC Tool | Application logs, APM data, security signals |
| **AWS Security Hub** | EventBridge | AWS → GRC Tool | Consolidated security findings |
| **Snyk** | Webhook | Snyk → GRC Tool | Code vulnerability findings |
| **Qualys/Tenable** | API Pull | Scanner → GRC Tool | Vulnerability scan results |

### ITSM & Workflow Integration

| Tool | Integration Type | Data Flow | Purpose |
|------|------------------|-----------|---------|
| **JIRA** | Bidirectional API | GRC ↔ JIRA | Risk/remediation task tracking |
| **ServiceNow** | Bidirectional API | GRC ↔ ServiceNow | Incident management, CMDB |
| **Slack** | Webhook | GRC → Slack | Real-time notifications |
| **PagerDuty** | API | GRC → PagerDuty | On-call alerting |
| **Microsoft Teams** | Webhook | GRC → Teams | Team notifications |

### Identity & Access

| Tool | Integration Type | Purpose |
|------|------------------|---------|
| **Okta** | SAML/OIDC | SSO authentication |
| **Azure AD** | SAML/OIDC | Enterprise SSO |
| **CyberArk** | API | Privileged access audit |

---

## Deployment Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                     DEPLOYMENT PIPELINE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────────┐  │
│  │  Code   │ -> │  Build  │ -> │  Test   │ -> │   Deploy    │  │
│  │  Push   │    │  & Lint │    │  Suite  │    │   (Staged)  │  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────────┘  │
│                                                                  │
│  Environments:                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │    DEV      │  │   STAGING   │  │      PRODUCTION         │  │
│  │ Auto-deploy │  │ QA Testing  │  │ Manual approval + Canary│  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Team Collaboration

### Key Stakeholders
- **CloudOps Team** - Infrastructure support & AWS access
- **SOC Team** - Security requirements & threat intelligence
- **Prod Sec Team** - Compliance & security reviews
- **Development Team** - Full-stack implementation

### Communication Channels
- Regular sync meetings with security teams
- Technical constraints documentation
- API integration discussions with Wiz and Datadog

---

## Timeline & Milestones

| Phase | Milestone | Target Date | Duration |
|-------|-----------|-------------|----------|
| Phase 1 | Log source identification complete | TBD | 2 weeks |
| Phase 2 | Normalization layer implemented | TBD | 3 weeks |
| Phase 3 | Infrastructure setup complete | TBD | 3 weeks |
| Phase 4 | AI engine integration | TBD | 4 weeks |
| Phase 5 | UI development complete | TBD | 4 weeks |
| Phase 6 | Compliance framework integration | TBD | 3 weeks |
| Phase 7 | Alerting & incident response | TBD | 2 weeks |
| Phase 8 | Reporting & analytics | TBD | 2 weeks |
| Phase 9 | Risk remediation workflow | TBD | 2 weeks |
| Phase 10 | Testing & validation | TBD | 3 weeks |
| Phase 11 | UAT & Production deployment | TBD | 2 weeks |

**Estimated Total Duration: 30 weeks (~7.5 months)**

---

## Risk Register (Project Risks)

| Risk ID | Risk Description | Impact | Likelihood | Mitigation |
|---------|------------------|--------|------------|------------|
| R001 | API rate limits from Wiz/Datadog | High | Medium | Implement caching, batch processing |
| R002 | AI model accuracy for risk scoring | High | Medium | Continuous training, human review workflow |
| R003 | Log volume exceeds storage capacity | Medium | High | Auto-scaling, data retention policies |
| R004 | Integration delays with SOC team | Medium | Medium | Early engagement, defined interfaces |
| R005 | Compliance framework changes | Low | Low | Modular control framework design |
| R006 | Data privacy concerns with AI processing | High | Low | Data anonymization, on-prem AI options |

---

## Success Metrics & KPIs

| Category | Metric | Target |
|----------|--------|--------|
| **Risk Detection** | Mean Time to Detect (MTTD) | < 15 minutes |
| **Risk Detection** | False positive rate | < 10% |
| **Compliance** | Compliance score accuracy | > 95% |
| **Compliance** | Evidence collection automation | > 80% automated |
| **Operations** | Log ingestion latency | < 5 minutes |
| **Operations** | System uptime | 99.9% |
| **Remediation** | Mean Time to Remediate (MTTR) | < 24 hours (critical) |
| **AI Accuracy** | Risk score correlation | > 85% accuracy |
| **User Adoption** | Active users | 100% of target users |

---

## Data Retention & Archival Policy

| Data Type | Hot Storage | Warm Storage | Cold/Archive | Total Retention |
|-----------|-------------|--------------|--------------|-----------------|
| Raw Logs | 30 days | 90 days | 1 year | 7 years |
| Processed Logs | 90 days | 1 year | 3 years | 7 years |
| Risk Assessments | Indefinite | - | - | Indefinite |
| Audit Trails | 1 year | 3 years | 7 years | 10 years |
| Compliance Evidence | 1 year | 3 years | 7 years | 10 years |
| AI Analysis Results | 90 days | 1 year | - | 2 years |

---

## Disaster Recovery & Business Continuity

### Recovery Objectives

| Metric | Target | Description |
|--------|--------|-------------|
| **RTO (Recovery Time Objective)** | 4 hours | Maximum acceptable downtime |
| **RPO (Recovery Point Objective)** | 1 hour | Maximum acceptable data loss |

### DR Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRIMARY REGION (us-east-1)                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   App Tier  │  │   DB Tier   │  │   Storage (S3)          │  │
│  │   (EKS)     │  │   (RDS)     │  │   (Cross-region repl)   │  │
│  └──────┬──────┘  └──────┬──────┘  └────────────┬────────────┘  │
│         │                │                      │               │
└─────────┼────────────────┼──────────────────────┼───────────────┘
          │                │                      │
          ▼                ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DR REGION (us-west-2)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   App Tier  │  │   DB Tier   │  │   Storage (S3)          │  │
│  │   (Standby) │  │   (Read     │  │   (Replicated)          │  │
│  │             │  │   Replica)  │  │                         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Getting Started (Development)

```bash
# Clone repository
git clone https://github.com/org/grc-admin-tool.git
cd grc-admin-tool

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start development server
npm run dev

# Run tests
npm test
```

---

## Environment Configuration

### Required Environment Variables

```env
# Application
NODE_ENV=development
APP_PORT=3000
APP_SECRET=your-secret-key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/grc_db
REDIS_URL=redis://localhost:6379

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=grc-logs-bucket
ATHENA_DATABASE=grc_logs

# AI Configuration
CLAUDE_API_KEY=your-claude-api-key
OPENAI_API_KEY=your-openai-api-key
AI_MODEL=claude-3-opus

# Elasticsearch
ELASTICSEARCH_URL=https://localhost:9200
ELASTICSEARCH_API_KEY=your-es-api-key

# Integrations
DATADOG_API_KEY=your-datadog-key
DATADOG_APP_KEY=your-datadog-app-key
WIZ_CLIENT_ID=your-wiz-client-id
WIZ_CLIENT_SECRET=your-wiz-secret
JIRA_BASE_URL=https://your-org.atlassian.net
JIRA_API_TOKEN=your-jira-token
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
PAGERDUTY_ROUTING_KEY=your-pagerduty-key

# Authentication
OKTA_DOMAIN=your-org.okta.com
OKTA_CLIENT_ID=your-okta-client-id
OKTA_CLIENT_SECRET=your-okta-secret
```

---

## User Roles & Permissions

| Permission | Admin | Auditor | Security Analyst | Viewer |
|------------|-------|---------|------------------|--------|
| View dashboards | ✅ | ✅ | ✅ | ✅ |
| View risk assessments | ✅ | ✅ | ✅ | ✅ |
| Create/edit risks | ✅ | ❌ | ✅ | ❌ |
| Delete risks | ✅ | ❌ | ❌ | ❌ |
| View logs | ✅ | ✅ | ✅ | ❌ |
| Configure log sources | ✅ | ❌ | ❌ | ❌ |
| Run AI analysis | ✅ | ✅ | ✅ | ❌ |
| View compliance reports | ✅ | ✅ | ✅ | ✅ |
| Update compliance status | ✅ | ✅ | ❌ | ❌ |
| Upload evidence | ✅ | ✅ | ✅ | ❌ |
| Manage users | ✅ | ❌ | ❌ | ❌ |
| Configure integrations | ✅ | ❌ | ❌ | ❌ |
| Configure alerts | ✅ | ❌ | ✅ | ❌ |
| Accept risks | ✅ | ❌ | ❌ | ❌ |
| Generate reports | ✅ | ✅ | ✅ | ✅ |

---

## UI Wireframes (Key Screens)

### 1. Executive Dashboard
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  GRC Admin Tool                                    [User] [Settings] [Logout]│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Risk Score  │  │ Open Risks  │  │ Compliance  │  │ Active Incidents   │ │
│  │    7.2      │  │     42      │  │    87%      │  │        8           │ │
│  │  ▲ +0.3     │  │  ▼ -5       │  │  ▲ +3%      │  │    ▲ +2            │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                                                                              │
│  ┌──────────────────────────────────┐  ┌────────────────────────────────┐   │
│  │   Risk Trend (30 days)          │  │   Compliance by Framework      │   │
│  │   📈 [Chart]                    │  │   🍩 [Donut Chart]             │   │
│  │                                 │  │   SOC2: 92%  ISO: 85%          │   │
│  └──────────────────────────────────┘  └────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │   Recent Alerts                                                       │   │
│  │   🔴 Critical: Unauthorized root account access - 5 min ago          │   │
│  │   🟠 High: S3 bucket policy changed - 15 min ago                     │   │
│  │   🟡 Medium: Failed login attempts spike - 1 hour ago                │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2. Risk Assessment View
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Risk Assessments                              [+ New Risk] [Export] [Filter]│
├─────────────────────────────────────────────────────────────────────────────┤
│  Filters: [All Severities ▼] [All Status ▼] [Date Range] [Search...]       │
├─────────────────────────────────────────────────────────────────────────────┤
│  │ ID    │ Risk Title              │ Score │ Severity │ Owner    │ Status  ││
│  ├───────┼─────────────────────────┼───────┼──────────┼──────────┼─────────┤│
│  │ R-042 │ Unencrypted S3 bucket   │  8.5  │ Critical │ J. Smith │ Open    ││
│  │ R-041 │ Exposed API keys        │  7.8  │ High     │ A. Jones │ In Prog ││
│  │ R-040 │ Outdated SSL certs      │  5.2  │ Medium   │ B. Lee   │ Open    ││
│  │ R-039 │ Missing MFA enforcement │  6.1  │ High     │ C. Chen  │ Closed  ││
│  └───────┴─────────────────────────┴───────┴──────────┴──────────┴─────────┘│
│                                                                              │
│  [◀ Prev] Page 1 of 5 [Next ▶]                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3. Architecture Analysis (AI-Generated)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  AI Architecture Analysis - Risk R-042                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │   [Interactive Architecture Diagram]                                  │   │
│  │                                                                       │   │
│  │      ┌─────────┐      ┌─────────┐      ┌─────────────────────────┐   │   │
│  │      │ User    │ ---> │ API GW  │ ---> │ Lambda (Affected) 🔴   │   │   │
│  │      └─────────┘      └─────────┘      └───────────┬─────────────┘   │   │
│  │                                                     │                 │   │
│  │                                                     ▼                 │   │
│  │                                        ┌─────────────────────────┐   │   │
│  │                                        │ S3 Bucket (RISK) 🔴     │   │   │
│  │                                        │ Public Access Enabled   │   │   │
│  │                                        └─────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  AI Analysis Summary:                                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ This S3 bucket stores sensitive customer PII and is accessible via  │   │
│  │ public internet. Immediate action required to:                        │   │
│  │ 1. Enable bucket encryption (AES-256)                                │   │
│  │ 2. Disable public access                                             │   │
│  │ 3. Enable access logging                                             │   │
│  │ Impact: 15 downstream services, 50K+ customer records                │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  [Generate Remediation Plan] [Export Report] [Create JIRA Ticket]            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Glossary

| Term | Definition |
|------|------------|
| **GRC** | Governance, Risk, and Compliance |
| **SOC** | Security Operations Center |
| **SIEM** | Security Information and Event Management |
| **MTTD** | Mean Time to Detect |
| **MTTR** | Mean Time to Remediate |
| **RTO** | Recovery Time Objective |
| **RPO** | Recovery Point Objective |
| **RBAC** | Role-Based Access Control |
| **PII** | Personally Identifiable Information |
| **CVE** | Common Vulnerabilities and Exposures |
| **CVSS** | Common Vulnerability Scoring System |

---

## License

Proprietary - Internal Use Only

---

## Appendix A: Log Schema (Normalized Format)

```json
{
  "event_id": "uuid",
  "timestamp": "ISO8601",
  "source": {
    "type": "cloudtrail|vpc_flow|s3_access|waf|datadog",
    "region": "us-east-1",
    "account_id": "123456789012"
  },
  "actor": {
    "type": "user|service|role",
    "identity": "arn:aws:iam::...",
    "ip_address": "192.168.1.1",
    "user_agent": "..."
  },
  "action": {
    "type": "api_call|network|data_access",
    "name": "PutObject",
    "result": "success|failure",
    "error_code": "AccessDenied"
  },
  "resource": {
    "type": "s3_bucket|ec2_instance|rds|...",
    "arn": "arn:aws:s3:::bucket-name",
    "name": "bucket-name"
  },
  "context": {
    "risk_indicators": ["unusual_time", "new_location"],
    "enrichment": {
      "geo_location": "...",
      "threat_intel_match": false
    }
  },
  "raw_event": "..."
}
```

---

## Appendix B: AI Prompt Templates

### Risk Analysis Prompt
```
You are a security analyst evaluating risks in a cloud infrastructure.

Given the following log data and context:
{log_data}

Analyze and provide:
1. Risk severity (critical/high/medium/low)
2. Risk score (0-10)
3. Affected assets and their dependencies
4. Potential impact assessment
5. Recommended remediation steps
6. Related compliance controls that may be affected

Format your response as JSON.
```

### Architecture Analysis Prompt
```
You are a cloud architecture analyst.

Given this risk assessment:
{risk_details}

And this infrastructure context:
{infrastructure_data}

Generate:
1. An architecture dependency map showing affected components
2. Blast radius analysis
3. Critical path identification
4. Recommended architecture improvements
```

---

## Appendix C: API Rate Limits

| Endpoint Category | Rate Limit | Burst Limit |
|-------------------|------------|-------------|
| Authentication | 10/min | 20 |
| Risk Management | 100/min | 200 |
| Log Queries | 50/min | 100 |
| AI Analysis | 20/min | 30 |
| Report Generation | 10/min | 20 |
| Webhooks (outbound) | 100/min | 200 |

---

## Appendix D: Keyboard Shortcuts (UI)

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Global search |
| `Ctrl + N` | New risk assessment |
| `Ctrl + R` | Refresh dashboard |
| `Ctrl + E` | Export current view |
| `Ctrl + /` | Open help |
| `Esc` | Close modal/panel |

---

*Document Version: 2.0*  
*Last Updated: April 22, 2026*  
*Authors: Development & Security Team*
