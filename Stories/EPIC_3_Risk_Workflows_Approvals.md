# EPIC 3: Risk Workflows & Approvals

**Status**: Open  
**Priority**: High  
**Project**: KAN (Risk Module)  

---

## Epic Description

Implement comprehensive risk workflow and approval mechanisms to enable governed risk management with stakeholder approvals, treatment decisions, and lifecycle progression. Includes Kanban-style workflow states (Open → Under Review → Ready for Review → Approved → Closed), treatment strategy workflows (Accept/Avoid/Transfer/Mitigate), and formal approval chains. Enables multi-level governance for risk decisions.

---

## Epic Goals

1. ✅ Enable risk progression through 7-state Kanban workflow
2. ✅ Implement treatment strategy selection (Accept/Avoid/Transfer/Mitigate)
3. ✅ Build formal risk approval workflows with multiple stakeholders
4. ✅ Implement risk remediation task assignment and tracking
5. ✅ Enable risk exception handling and override workflows
6. ✅ Provide risk council decision tracking and approval audit trails

---

## Kanban Workflow States

```
┌──────────────────────────────────────────────────────────────────┐
│                     KANBAN RISK WORKFLOW (7 States)               │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Open          Under Review    Ready for      Approved    Final   │
│   (New)        (Analysis)      Review         (Decision)  Closed  │
│                                (Ready)                     (Archived)
│   ↓              ↓              ↓               ↓           ↓      │
│  [1]   ──→    [2]    ──→     [3]    ──→    [4]   ──→   [5]      │
│                  ↑                     ↑                           │
│                  └─────────────────────┘ (Reject & Rework)       │
│                                                                    │
│  Alternative Paths:                                               │
│  · Can move from [1] Open → [5] Closed (Quick Close)             │
│  · Can move from [2] → [1] (Request Rework)                      │
│  · Can move from [3] → [2] (Request Additional Analysis)         │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## Treatment Strategy Workflows

```
Treatment Decisions (Can be taken at any state):
├─ ACCEPT: Acknowledge and accept the risk
│  └─ Move to "Approved" state
│  └─ Set acceptance deadline
│  └─ Requires executive-level approval
│
├─ MITIGATE: Implement controls to reduce risk
│  └─ Create remediation tasks
│  └─ Assign owners and deadlines
│  └─ Track progress toward residual score target
│
├─ AVOID: Eliminate activity causing the risk
│  └─ Document why activity being eliminated
│  └─ Requires business unit approval
│  └─ Archive risk after avoidance
│
└─ TRANSFER: Shift risk to third party (insurance, outsourcing)
   └─ Document transfer mechanism
   └─ Track insurance policy details
   └─ Monitor third-party compliance
```

---

## Stories

### STORY 12: Kanban Workflow State Transitions

**Status**: Open  
**Priority**: High  
**Acceptance Criteria**:

1. **AC 12.1**: Risk has workflow state field
   - PATCH /api/v1/risks/{id}/workflow-state
   - Valid states: Open, UnderReview, ReadyForReview, Approved, FinalClosed, Archived
   - HTTP 422 for invalid state

2. **AC 12.2**: Initial state is "Open"
   - New risks created with state = "Open"
   - Cannot be manually set on creation
   - Audit log shows initial state

3. **AC 12.3**: Open state (Entry point)
   - Risk created and awaiting analysis
   - Risk Officer performs impact/likelihood scoring
   - Risk Officer can transition to "UnderReview"
   - Can also transition directly to "FinalClosed" (quick close)

4. **AC 12.4**: UnderReview state (Analysis phase)
   - Risk Officer/Analyst performing detailed analysis
   - Completing impact analysis, likelihood analysis, threat modeling
   - RCA (Root Cause Analysis) work happening
   - Transition to "ReadyForReview" when analysis complete
   - Can transition back to "Open" if more data needed

5. **AC 12.5**: ReadyForReview state (Review gate)
   - Risk ready for stakeholder review and approval
   - Risk Council reviewing the risk assessment
   - Requires stakeholder feedback and sign-off
   - Transition to "Approved" after review approval
   - Can transition to "UnderReview" if additional analysis requested

6. **AC 12.6**: Approved state (Approved for treatment)
   - Risk approved by Risk Council/Management
   - Treatment strategy selected (Accept/Mitigate/Avoid/Transfer)
   - Remediation tasks created (if Mitigate)
   - Transition to "FinalClosed" when treatment complete
   - Can revert to "UnderReview" if major changes needed

7. **AC 12.7**: FinalClosed state (Closure)
   - Risk treatment complete
   - Risk residual score at acceptable level
   - All remediation tasks completed
   - Transition to "Archived" for historical tracking
   - Cannot revert from FinalClosed without manager override

8. **AC 12.8**: Archived state (Historical record)
   - Final state for closed and resolved risks
   - Remains in system for compliance/audit purposes
   - Read-only state (no updates allowed)
   - Available for historical reporting and trend analysis

9. **AC 12.9**: State transitions are logged
   - Audit log captures each state transition
   - Include: actor, timestamp, from_state, to_state
   - Include: transition_reason (optional, max 500 chars)
   - Audit log stores all transitions for compliance

10. **AC 12.10**: State transition permissions enforced
    - Risk Officer: Can transition between most states
    - Risk Manager: Can approve transitions to "Approved"
    - Department Head: Can approve "FinalClosed"
    - Admin: Can override transitions
    - HTTP 403 Forbidden if unauthorized

11. **AC 12.11**: Each state displays relevant UI
    - Open: Show analysis form
    - UnderReview: Show analysis progress
    - ReadyForReview: Show review request form
    - Approved: Show treatment selection form
    - FinalClosed: Show completion summary
    - Archived: Show read-only summary

12. **AC 12.12**: Workflow state visible in list view
    - GET /api/v1/risks shows workflow_state for each risk
    - Color-coded by state in UI
    - Filterable by state: ?state=Open&state=Approved
    - Sortable by state

---

#### STORY 12 Tasks

**Task 12.1.1**: Design detailed workflow state machine
- Define valid transitions between all states
- Specify permissions required for each transition
- Document business rules for state progression
- Get approval from Risk Steering Committee
- Acceptance: State machine diagram approved

**Task 12.1.2**: Add workflow_state column to Risk table
- ALTER TABLE risks ADD workflow_state VARCHAR(50) DEFAULT 'Open'
- ADD CONSTRAINT valid_workflow_state CHECK (workflow_state IN ('Open', 'UnderReview', 'ReadyForReview', 'Approved', 'FinalClosed', 'Archived'))
- Index on workflow_state for filtering
- Acceptance: Column added, constraint enforced

**Task 12.1.3**: Implement state transition validation
- Function: can_transition(current_state, next_state, user_role) RETURNS BOOLEAN
- Check permissions based on user role
- Check business rules (e.g., can't close without treatment)
- Return error message if invalid
- Acceptance: Function tested for all transitions

**Task 12.1.4**: Implement PATCH /api/v1/risks/{id}/workflow-state endpoint
- Validate transition is allowed
- Update workflow_state and modified_at
- Set state_changed_at timestamp
- Optional: Accept transition_reason (max 500 chars)
- Audit log the transition
- Trigger notifications (if appropriate)
- Return HTTP 200 with updated risk
- Acceptance: Endpoint tested with valid and invalid transitions

**Task 12.1.5**: Build workflow state selection UI
- Show current state with visual indicator
- Show available next states (based on current + role)
- For each available state: show name, description, prerequisites
- Optional: transition_reason text field
- Submit button for state change
- Acceptance: UI renders correctly, validates transitions

**Task 12.1.6**: Build workflow progress visualization
- Show all 7 states with current state highlighted
- Show path through states taken so far
- Show available next states
- Timeline view showing state change dates
- Link to each state change audit log entry
- Acceptance: Visualization renders correctly

**Task 12.1.7**: Implement workflow state transition notifications
- Email to Risk Officer when state changes
- Email to Department Head when state = ReadyForReview
- Email to Risk Manager when state = ReadyForReview (for approval)
- Email to Risk Officer when state = Approved (move to next phase)
- Include reason for transition, timestamp, next steps
- Acceptance: Notifications sent to correct recipients

---

### STORY 13: Treatment Strategy Selection & Execution

**Status**: Open  
**Priority**: High  
**Acceptance Criteria**:

1. **AC 13.1**: Treatment strategy field on risk
   - PATCH /api/v1/risks/{id}/treatment-strategy
   - Valid strategies: ACCEPT, MITIGATE, AVOID, TRANSFER
   - HTTP 422 for invalid strategy
   - Optional: treatment_justification field (max 500 chars)

2. **AC 13.2**: ACCEPT treatment strategy
   - Acknowledge and accept the risk
   - Requires executive-level approval
   - Field: acceptance_deadline (date)
   - Field: accepted_by (name, title)
   - Field: acceptance_justification (max 500 chars)
   - HTTP 201 creates treatment record

3. **AC 13.3**: MITIGATE treatment strategy
   - Implement controls to reduce risk
   - Create one or more remediation tasks
   - Each task: name, description, assigned_to, due_date, priority
   - Target: Reduce residual_risk_score to acceptable level
   - Track progress (% complete)

4. **AC 13.4**: AVOID treatment strategy
   - Eliminate activity causing the risk
   - Requires business unit approval
   - Field: activity_description (what activity eliminated)
   - Field: alternative_approach (how business continues)
   - Field: approval_from (name, title)
   - Field: avoidance_date (when activity eliminated)

5. **AC 13.5**: TRANSFER treatment strategy
   - Shift risk to third party
   - Applicable for: insurance, outsourcing, partnership
   - Field: transfer_method (insurance/outsourcing/partnership)
   - Field: third_party_name
   - Field: transfer_deadline
   - Field: insurance_policy (if insurance)

6. **AC 13.6**: Treatment strategy is required before closure
   - Cannot transition to "Approved" without treatment strategy
   - HTTP 422 if trying to approve without treatment
   - Message: "Treatment strategy must be selected before approval"

7. **AC 13.7**: Treatment strategy audit trail
   - Log action: "Treatment Strategy Selected"
   - Include strategy type, justification, actor, timestamp
   - Log any treatment details (acceptance, task assignment, etc.)
   - Audit log available in risk detail view

8. **AC 13.8**: Multiple treatment strategies can coexist (for complex risks)
   - Risk can have both MITIGATE + TRANSFER
   - Risk can have MITIGATE for one aspect + AVOID for another
   - Each strategy tracked separately with different justifications

9. **AC 13.9**: Treatment strategy visible in risk list
   - GET /api/v1/risks includes treatment_strategy for each risk
   - Filterable by strategy: ?treatment_strategy=MITIGATE
   - Sortable by strategy

10. **AC 13.10**: Treatment status dashboard
    - Count of risks by treatment strategy
    - Pie chart: ACCEPT vs MITIGATE vs AVOID vs TRANSFER
    - Treatment effectiveness metrics (residual score improvement for MITIGATE)
    - Completion rate (% tasks complete for MITIGATE)

---

#### STORY 13 Tasks

**Task 13.1.1**: Add treatment strategy columns to Risk table
- ALTER TABLE risks ADD treatment_strategy VARCHAR(20)
- ALTER TABLE risks ADD treatment_strategy_created_at TIMESTAMP
- ALTER TABLE risks ADD treatment_justification VARCHAR(500)
- CONSTRAINT valid_treatment_strategy CHECK (treatment_strategy IN ('ACCEPT', 'MITIGATE', 'AVOID', 'TRANSFER', NULL))
- Acceptance: Columns added, constraint enforced

**Task 13.1.2**: Create TreatmentStrategy tables for detailed tracking
- CreateTable: acceptance_treatments (risk_id, accepted_by, acceptance_deadline, acceptance_justification, created_at)
- CreateTable: mitigation_tasks (id, risk_id, task_name, description, assigned_to, due_date, priority, status, created_at)
- CreateTable: avoidance_decisions (risk_id, activity_description, alternative_approach, approved_by, avoidance_date, created_at)
- CreateTable: transfer_details (risk_id, transfer_method, third_party_name, policy_number, transfer_deadline, created_at)
- Acceptance: All tables created with proper indexes

**Task 13.1.3**: Implement PATCH /api/v1/risks/{id}/treatment-strategy endpoint
- Parse treatment_strategy from request
- Validate: ACCEPT/MITIGATE/AVOID/TRANSFER
- For MITIGATE: Accept mitigation_tasks array
- For ACCEPT: Accept acceptance fields
- For AVOID: Accept avoidance fields
- For TRANSFER: Accept transfer fields
- Update risk.treatment_strategy
- Create appropriate detail record
- Audit log the selection
- Return HTTP 200 with updated risk
- Acceptance: Endpoint handles all strategies

**Task 13.1.4**: Implement MITIGATE treatment workflow (task creation)
- POST /api/v1/risks/{id}/mitigation-tasks
- Create one or more remediation tasks
- Each task: name, description, assigned_to, due_date, priority
- Tasks appear in risk detail view
- Task progress tracked (% complete)
- Acceptance: Tasks created, tracked, displayed

**Task 13.1.5**: Build treatment strategy selection form in React
- Radio buttons: ACCEPT / MITIGATE / AVOID / TRANSFER
- Conditional sections based on selected strategy
- ACCEPT section: deadline date, justification
- MITIGATE section: task list (name, assignee, due date)
- AVOID section: activity description, alternative approach, approval
- TRANSFER section: method, third party, policy, deadline
- Submit via PATCH endpoint
- Acceptance: Form renders, all strategies work

**Task 13.1.6**: Build treatment status dashboard
- Pie chart: Treatment strategy distribution
- Bar chart: Tasks by status (Not Started / In Progress / Complete)
- Metrics: Average residual score reduction (for MITIGATE)
- Task completion rate (% complete)
- Treatment adherence (on-time execution)
- Filterable by department, owner
- Acceptance: Dashboard renders with live data

---

### STORY 14: Risk Approval Workflows with Multiple Stakeholders

**Status**: Open  
**Priority**: High  
**Acceptance Criteria**:

1. **AC 14.1**: Risk Council approval workflow
   - When risk transitions to "ReadyForReview" → notification sent to Risk Council
   - Risk Council members can approve or reject
   - PATCH /api/v1/risks/{id}/approval
   - Request body: approval_action (APPROVE/REJECT), reviewer_comments (max 500 chars)

2. **AC 14.2**: Multi-reviewer approval
   - Risk can require approval from multiple reviewers
   - Minimum reviewers determined by risk severity (Critical = 3, High = 2, Medium = 1)
   - All reviewers must approve before risk moves to "Approved" state
   - Single rejection blocks approval (with comments)

3. **AC 14.3**: Department Head sign-off required
   - For any risk in own department, Department Head must approve
   - For cross-department risks, all affected Department Heads must approve
   - Approval includes: comments, sign-off timestamp
   - Rejection blocks approval with documented reasons

4. **AC 14.4**: Security Lead approval for security risks
   - Risks with security_impact_score ≥ 4 require Security Lead approval
   - Security Lead reviews threat analysis, vulnerability assessment
   - Approval gates movement to "Approved" state
   - Can request additional security analysis

5. **AC 14.5**: Compliance Officer approval for compliance risks
   - Risks with compliance_impact_score ≥ 4 require Compliance Officer approval
   - Compliance Officer reviews regulatory requirements
   - Approval gates movement to "Approved" state
   - Can request regulatory assessment

6. **AC 14.6**: Approval workflow shows pending approvals
   - GET /api/v1/risks/{id} shows: approval_status, pending_approvers, approved_by
   - Each approver: name, role, approval_date, comments
   - Rejections shown with reasons
   - Timeline of approvals

7. **AC 14.7**: Approval reminders sent automatically
   - Reminders sent 3 days after request
   - Reminders sent 1 day before escalation deadline
   - Escalation after 7 days (escalate to manager)
   - Max 2 reminders per approver

8. **AC 14.8**: Approval comments stored in audit trail
   - Each approval/rejection logged
   - Comments preserved in AuditLog
   - Available for compliance reporting
   - Email sent to Risk Officer with approval decision

9. **AC 14.9**: Approval delegation
   - Approver can delegate to another authorized user (same role)
   - Original approver remains accountable
   - Delegation logged in audit trail
   - Approval still required from authorized user

10. **AC 14.10**: Bulk approval for non-critical risks
    - Risk Council can approve multiple non-critical risks in single request
    - POST /api/v1/approvals/bulk with risk IDs array
    - Reduces approver workload for routine risks
    - Each risk still logged individually

11. **AC 14.11**: Approval bypass for emergency risks
    - Highest risk severity (19-25) can use "Emergency Approval" workflow
    - Requires CRO (Chief Risk Officer) signature only
    - Retrospective approval from Risk Council within 5 days
    - Email notification to all Risk Council members

12. **AC 14.12**: Dashboard shows approvals pending
    - List of risks awaiting my approval
    - Sorted by: priority (Critical first), created_date (oldest first)
    - Quick approve/reject buttons
    - Link to full risk detail for review

---

#### STORY 14 Tasks

**Task 14.1.1**: Design approval workflow by risk severity
- Critical (19-25): CRO + 2 Risk Council members
- High (13-18): Risk Manager + Department Head
- Medium (6-12): Department Head only
- Low (1-5): Risk Officer (auto-approve)
- Document approval matrix
- Acceptance: Matrix approved

**Task 14.1.2**: Create approval-related tables
- CreateTable: approval_requests (id, risk_id, requested_at, requested_by, due_date, status)
- CreateTable: approvals (id, approval_request_id, approver_id, approver_role, approval_date, approval_action, comments, created_at)
- CreateTable: approval_reminders (id, approval_request_id, reminder_number, sent_at, approver_email)
- Index: risk_id, approval_action, approver_id
- Acceptance: Tables created, indexed

**Task 14.1.3**: Implement approval request creation
- When risk transitions to "ReadyForReview" → create approval_requests
- Determine required approvers based on risk severity and type
- Create approval records for each required approver
- Set due_date (e.g., 7 days from request)
- Send initial approval request emails
- Acceptance: Approval requests created, emails sent

**Task 14.1.4**: Implement PATCH /api/v1/risks/{id}/approval endpoint
- Accept: approval_action (APPROVE/REJECT), comments (max 500 chars)
- Validate user is approved reviewer for this risk
- Update approval record with decision and timestamp
- Check if all required approvals received
- If all approved: transition risk state to "Approved", send notification
- If any rejected: notify Risk Officer, request rework
- Acceptance: Endpoint tested with approve/reject

**Task 14.1.5**: Implement approval reminder job
- Scheduled job runs daily
- Query approval_requests where status = pending and created_at > 3 days ago
- Check if approver already sent reminders (max 2)
- Send reminder email to approver
- Log reminder in approval_reminders table
- Acceptance: Job runs successfully, reminders sent

**Task 14.1.6**: Build risk approval dashboard for reviewers
- List of risks pending my approval
- Sorted by priority (Critical first), created date (oldest first)
- Each risk shows: ID, description, severity, created_date, days_pending
- Quick view link and Approve/Reject buttons
- Modal form for approve/reject with comments
- After action: close modal, refresh list, show confirmation
- Acceptance: Dashboard renders, approve/reject works

**Task 14.1.7**: Build approval history in risk detail
- Show approval_status (Pending / Approved / Rejected)
- Timeline of all approval actions
- For each approver: name, role, action (Approved/Rejected), timestamp, comments
- Show who is still pending (with reminder status)
- Show rejection reasons if rejected
- Acceptance: History renders correctly

---

### STORY 15: Risk Remediation Task Management

**Status**: Open  
**Priority**: High  
**Acceptance Criteria**:

1. **AC 15.1**: Remediation tasks linked to risks
   - POST /api/v1/risks/{id}/remediation-tasks
   - Each task has: name, description, assigned_to, due_date, priority
   - Tasks appear in risk detail view
   - Tasks have status: Not Started / In Progress / Complete / Overdue

2. **AC 15.2**: Task assignment and ownership
   - Task assigned to specific person or team
   - Assignee receives notification
   - Can accept or decline task
   - Can reassign to other qualified person
   - Audit trail tracks assignments

3. **AC 15.3**: Task progress tracking
   - Status update: %complete (0-100%)
   - Assignee can post progress comments
   - Milestone updates: "50% complete", "90% complete"
   - Email to Risk Officer when status changes

4. **AC 15.4**: Task due date and escalation
   - Each task has due_date (date field)
   - Overdue detection: status = "Overdue" when due_date < today
   - Escalation: Email to task owner's manager if overdue by 3+ days
   - Email to Risk Officer and Department Head if >1 week overdue

5. **AC 15.5**: Task completion and verification
   - Assignee marks task "Complete"
   - Status remains "Pending Verification" until verified
   - Risk Officer verifies completion (reviews evidence)
   - PATCH /api/v1/remediation-tasks/{id}/complete with evidence_link (optional)
   - Verified_by and verified_at recorded

6. **AC 15.6**: Task completion affects residual risk score
   - When all mitigation tasks completed:
   - Risk residual_score should reflect post-mitigation state
   - Residual score compared to target score
   - If residual ≤ target → Risk ready for closure
   - Email to Risk Council if residual score not at target

7. **AC 15.7**: Task list in risk detail view
   - Table: Task ID, Name, Assigned To, Status, Due Date, %Complete
   - Color-coded by status (On-Track/At-Risk/Overdue)
   - Sort by: due_date (ascending), status, priority
   - Quick action buttons: Edit, Mark Complete, Reassign, Close

8. **AC 15.8**: Dashboard shows remediation progress
   - Total remediation tasks by status
   - % complete by risk
   - Overdue task count and list
   - Task completion trend chart (last 90 days)
   - By assignee: their pending and completed tasks

9. **AC 15.9**: Remediation task dependencies (optional)
   - Task can depend on another task
   - Dependent task blocked until dependency completed
   - UI shows dependency chain
   - Gantt chart view for complex remediations

10. **AC 15.10**: Task completion audit trail
    - Log: task_created, task_assigned, status_updated, task_completed
    - Include: actor, timestamp, change details
    - Audit trail available in task detail view
    - Historical record for compliance

---

#### STORY 15 Tasks

**Task 15.1.1**: Create remediation task tables
- CreateTable: remediation_tasks (id, risk_id, task_name, description, assigned_to_id, created_by_id, due_date, priority, status, percent_complete, created_at, completed_at, verified_at, verified_by_id)
- CreateTable: task_comments (id, task_id, comment_text, actor_id, created_at)
- CreateTable: task_assignments (id, task_id, assigned_to_id, assigned_by_id, assignment_date, status)
- CreateTable: task_dependencies (id, task_id, depends_on_task_id)
- Index: risk_id, assigned_to_id, due_date, status
- Acceptance: Tables created with relationships

**Task 15.1.2**: Implement POST /api/v1/risks/{id}/remediation-tasks endpoint
- Create new remediation task
- Accept: task_name, description, assigned_to, due_date, priority
- Default status: "Not Started"
- Set percent_complete: 0
- Audit log task creation
- Send assignment notification to assignee
- Return HTTP 201 with task details
- Acceptance: Endpoint creates tasks, sends notifications

**Task 15.1.3**: Implement task status update endpoints
- PATCH /api/v1/remediation-tasks/{id}/status
- Accept: status, percent_complete, comments
- Update task status and percent
- If status = "Complete" → notify Risk Officer for verification
- If status = "Overdue" → notify assignee's manager
- Audit log status change
- Return HTTP 200
- Acceptance: Status updates work, notifications sent

**Task 15.1.4**: Implement task completion and verification
- PATCH /api/v1/remediation-tasks/{id}/complete
- Accept: evidence_link (optional), completion_comments
- Set status = "Pending Verification"
- Risk Officer can verify: PATCH /api/v1/remediation-tasks/{id}/verify
- Verified_by and verified_at recorded
- If all tasks verified: Check if residual risk ≤ target
- Return HTTP 200
- Acceptance: Completion and verification work

**Task 15.1.5**: Implement overdue task detection and escalation
- Scheduled job runs daily
- Query remediation_tasks where due_date < today and status != "Complete"
- Set status = "Overdue"
- Send escalation email to assignee's manager
- Send escalation email to Risk Officer
- Escalation limit: Send max once per week per task
- Acceptance: Job runs, escalations sent

**Task 15.1.6**: Build remediation task list in risk detail
- Table: Task Name, Assigned To, Status, Due Date, %Complete
- Color-code: On-Track (green), At-Risk (yellow), Overdue (red)
- Sort by: due_date, status, priority
- Add Task button (for Risk Officer)
- Edit, Mark Complete, Reassign, Close buttons per row
- Show task dependencies (if any)
- Acceptance: List renders, quick actions work

**Task 15.1.7**: Build remediation progress dashboard
- Total tasks by status: Not Started / In Progress / Complete / Overdue
- % complete by risk (progress bar)
- Overdue task count and priority list
- Trend chart: task completion rate (last 90 days)
- By assignee: their pending and completed tasks
- Filterable by department, priority, due date
- Acceptance: Dashboard renders with live data

---

## Database Schema (Complete Workflow)

```sql
-- Workflow States
ALTER TABLE risks ADD workflow_state VARCHAR(50) DEFAULT 'Open';
ALTER TABLE risks ADD state_changed_at TIMESTAMP;
ALTER TABLE risks ADD treatment_strategy VARCHAR(20);
ALTER TABLE risks ADD treatment_strategy_created_at TIMESTAMP;
ALTER TABLE risks ADD treatment_justification VARCHAR(500);

-- Treatment Details
CREATE TABLE acceptance_treatments (
  id SERIAL PRIMARY KEY,
  risk_id VARCHAR(20) NOT NULL REFERENCES risks(risk_id),
  accepted_by VARCHAR(255),
  acceptance_deadline DATE,
  acceptance_justification VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mitigation_tasks (
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

-- Approvals
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

## API Endpoints Summary (Workflow)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| PATCH | /api/v1/risks/{id}/workflow-state | Change workflow state | Risk Officer+ |
| PATCH | /api/v1/risks/{id}/treatment-strategy | Select treatment strategy | Risk Officer+ |
| POST | /api/v1/risks/{id}/mitigation-tasks | Create remediation task | Risk Officer+ |
| PATCH | /api/v1/remediation-tasks/{id}/status | Update task status | Assignee+ |
| PATCH | /api/v1/remediation-tasks/{id}/complete | Mark task complete | Assignee |
| PATCH | /api/v1/remediation-tasks/{id}/verify | Verify task completion | Risk Officer+ |
| PATCH | /api/v1/risks/{id}/approval | Approve or reject risk | Risk Council |

---

## Acceptance Criteria Count
- **Total AC**: 45
- **Stories**: 4
- **Tasks**: 13
- **Database Tables**: 5
- **API Endpoints**: 7

