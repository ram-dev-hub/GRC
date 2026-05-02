# EPIC 1: Risk CRUD & Core Management

**Status**: Open  
**Priority**: Highest  
**Project**: KAN (Risk Module)  

---

## Epic Description

Establish the foundational risk management capability enabling risk creation, updates, retrieval, and lifecycle management. This epic focuses on core CRUD operations, data validation, automatic ID generation, and comprehensive risk tracking with department and ownership workflows. Forms the critical baseline for all downstream risk analysis and compliance features.

---

## Epic Goals

1. ✅ Enable Risk Officers to create, retrieve, update, and delete risks with automatic ID generation
2. ✅ Implement comprehensive risk property tracking (description, owner, department, status, dates)
3. ✅ Build searchable, filterable risk inventory with pagination and sorting
4. ✅ Establish risk lifecycle management with status workflows (Open → Closed)
5. ✅ Create audit trail for all risk modifications
6. ✅ Implement role-based access control (Risk Officer, Admin, Auditor)

---

## Stories

### STORY 1: Create Risk with Automatic ID Generation

**Status**: Open  
**Priority**: Highest  
**Acceptance Criteria**:

1. **AC 1.1**: Risk ID format matches company standard (ABC-DEPT##)
   - ABC = Department code (ITG, FIN, CSU, LAD)
   - DEPT = Department identifier
   - ## = Sequential number (auto-increment)
   - Example: ITG-GRC01, FIN-001, CSU-042

2. **AC 1.2**: Risk ID is auto-generated without user input
   - User submits risk creation form without ID field
   - System automatically generates unique ID per department
   - ID is immediately returned in response

3. **AC 1.3**: Risk ID is guaranteed unique across the system
   - Database implements unique constraint on Risk ID
   - Duplicate ID creation is impossible
   - Concurrent requests don't create duplicate IDs

4. **AC 1.4**: Minimum required fields for risk creation
   - Risk Description (required, max 500 chars)
   - Risk Owner (required, selected from dropdown)
   - Department (required, selected from predefined list)
   - Risk Type (optional, e.g., Technical, Compliance, Operational)
   - Priority (required, Highest/High/Medium/Low)

5. **AC 1.5**: Risk creation returns HTTP 201 with complete risk object
   - Response includes auto-generated Risk ID
   - Response includes creation timestamp (UTC)
   - Response includes auto-generated status ("Open")
   - Location header points to GET endpoint for created risk

6. **AC 1.6**: Risk creation fails gracefully with validation errors
   - Missing required fields → HTTP 400 with field-level errors
   - Invalid department → HTTP 422 with specific error message
   - Duplicate risk description (within same owner) → Warning but allow creation
   - Request over size limit → HTTP 413 Payload Too Large

7. **AC 1.7**: Risk owner must exist in system
   - Owner field validates against Risk Owners table
   - System returns dropdown list of available owners
   - Invalid owner selection → HTTP 422 Unprocessable Entity

8. **AC 1.8**: Department list is standardized and consistent
   - Predefined departments: IT GRC, Finance, Customer Support, Learning & Development
   - Department selection is from dropdown (no free text)
   - Department changes require admin approval for existing risks

9. **AC 1.9**: Audit trail records risk creation
   - Action: "Risk Created"
   - Actor: Authenticated user email
   - Timestamp: UTC creation time
   - Changes: All initial field values
   - IP Address: Source IP of creating user

10. **AC 1.10**: Risk creation notification sent to department stakeholders
    - Email sent to Risk Owner
    - Email sent to Department Head
    - Slack notification posted to #risk-notifications
    - Notification includes Risk ID and description snippet

---

#### STORY 1 Tasks

**Task 1.1.1**: Design Risk ID format specification and sequence logic
- Create detailed specification document
- Define Department→Code mapping (ITG→GRC, FIN→FIN, CSU→SUP, LAD→DEV)
- Design PostgreSQL sequence (department-specific or global with prefix?)
- Acceptance: Specification reviewed and approved by Risk Officer

**Task 1.1.2**: Implement PostgreSQL sequences and auto-increment mechanism
- Create sequences per department: seq_itg_grc, seq_fin, seq_csu, seq_lad
- Implement trigger to auto-generate Risk ID on insert
- Handle sequence reset/reset on new fiscal year (if needed)
- Acceptance: Sequences created, tested with concurrent inserts

**Task 1.1.3**: Build React form component for risk creation
- Text input: Risk Description (max 500 chars, with counter)
- Dropdown: Risk Owner (populated from API)
- Dropdown: Department (IT GRC, Finance, CSU, LAD)
- Dropdown: Priority (Highest, High, Medium, Low)
- Dropdown: Risk Type (optional, pre-defined values)
- Button: Create Risk
- Validation: Real-time validation on blur, error messages on submit
- Acceptance: Form renders, validates, submits with proper error handling

**Task 1.1.4**: Implement POST /api/v1/risks endpoint
- Validate request against schema (required fields, types)
- Generate unique Risk ID using PostgreSQL sequence
- Create risk record in database
- Set status to "Open" and created_at to current timestamp
- Return HTTP 201 with complete risk object
- Acceptance: Endpoint tested with Postman, returns correct status codes

**Task 1.1.5**: Implement request/response schema validation (Zod)
- Define Zod schema for CreateRiskRequest
- Define Zod schema for RiskResponse
- Validate all inputs before database operations
- Return HTTP 400 with validation errors for invalid input
- Acceptance: Schema validates all edge cases (null, undefined, wrong types)

**Task 1.1.6**: Create audit logging for risk creation
- Implement AuditLog table
- Log risk creation with actor, timestamp, action type
- Include IP address, user agent
- Acceptance: Audit records appear in database for all creations

**Task 1.1.7**: Set up notification pipeline
- Implement email notification service
- Implement Slack integration
- Send notifications on risk creation to Owner and Department Head
- Acceptance: Notifications sent within 5 seconds of risk creation

---

### STORY 2: List & Filter Risks with Sorting & Pagination

**Status**: Open  
**Priority**: High  
**Acceptance Criteria**:

1. **AC 2.1**: Risk list endpoint returns all risks for authenticated user
   - GET /api/v1/risks returns HTTP 200
   - Response includes array of risk objects
   - Default pagination: 20 risks per page

2. **AC 2.2**: Pagination supports limit and offset parameters
   - Limit parameter: 10-100 (default 20)
   - Offset parameter: start from Nth risk
   - Response includes total_count, total_pages, current_page
   - Example: GET /api/v1/risks?limit=50&offset=100

3. **AC 2.3**: Filter by department
   - GET /api/v1/risks?department=ITG returns only ITG risks
   - Accepts multiple departments: ?department=ITG&department=FIN
   - Department filter validates against predefined list
   - Returns empty array if no matching risks

4. **AC 2.4**: Filter by status (Open/Closed)
   - GET /api/v1/risks?status=Open
   - GET /api/v1/risks?status=Closed
   - Default shows both statuses (no filter)
   - Returns HTTP 422 if invalid status provided

5. **AC 2.5**: Filter by priority (Highest/High/Medium/Low)
   - GET /api/v1/risks?priority=High
   - Multiple priorities supported: ?priority=High&priority=Medium
   - Returns empty array if no matching risks

6. **AC 2.6**: Filter by risk owner (email or owner ID)
   - GET /api/v1/risks?owner=john.doe@company.com
   - Validates owner exists in system
   - Returns HTTP 400 if owner not found

7. **AC 2.7**: Sort by various fields
   - Sort by: risk_id, description, created_at, modified_at, priority
   - Sort order: asc or desc
   - Example: GET /api/v1/risks?sort=created_at&order=desc
   - Default sort: created_at desc (newest first)

8. **AC 2.8**: Search across risk description and ID
   - GET /api/v1/risks?search=payment
   - Searches in Risk Description and Risk ID
   - Case-insensitive substring match
   - Returns matching risks in score-weighted order

9. **AC 2.9**: Combine multiple filters in single request
   - GET /api/v1/risks?department=FIN&status=Open&priority=High&sort=created_at&order=desc&limit=50
   - All filters applied with AND logic
   - Search and filters combined with AND logic

10. **AC 2.10**: Response includes searchable list view
    - Risk ID (link to detail view)
    - Risk Description (first 8 words)
    - Department
    - Risk Owner name
    - Status badge (Open/Closed)
    - Priority badge (color-coded)
    - Created date
    - Last modified date

11. **AC 2.11**: UI provides filter controls
    - Department dropdown with checkboxes
    - Status toggle (Open/Closed/Both)
    - Priority multi-select dropdown
    - Risk Owner dropdown (searchable)
    - Search text input (real-time as you type)
    - Clear all filters button

12. **AC 2.12**: List view includes quick actions
    - Edit Risk (inline or modal form)
    - View Details (expand/navigate to detail page)
    - Delete Risk (with confirmation)
    - Change Status (Open ↔ Closed dropdown)
    - Assign Owner (dropdown change)

---

#### STORY 2 Tasks

**Task 2.1.1**: Implement GET /api/v1/risks with pagination
- Query builder support for limit, offset
- Return total_count, total_pages, current_page
- Default sort: created_at DESC
- Acceptance: Endpoint returns paginated results with metadata

**Task 2.1.2**: Implement filter parameters for department, status, priority, owner
- Parse filter parameters from query string
- Validate filters against allowed values
- Apply filters with SQL WHERE clauses
- Acceptance: Each filter works independently and in combination

**Task 2.1.3**: Implement search functionality across description and ID
- Implement full-text search or LIKE queries
- Case-insensitive matching
- Search and filters work together
- Acceptance: Search returns relevant results ranked by relevance

**Task 2.1.4**: Build React list component with filter controls
- Department dropdown filter
- Status toggle filter
- Priority multi-select filter
- Risk Owner searchable dropdown
- Search input (real-time)
- Clear filters button
- Acceptance: All filters render and update results

**Task 2.1.5**: Build table/card view for risk list
- Display: Risk ID, Description, Department, Owner, Status, Priority, Dates
- Columns sortable by clicking header
- Row click navigates to risk detail
- Hover shows quick actions (Edit, Delete, Change Status)
- Acceptance: Table responsive, works on mobile

**Task 2.1.6**: Implement sorting by multiple fields
- Support sort parameter with field name
- Support order parameter (asc/desc)
- Default: created_at DESC
- Allow multi-column sorting in UI (Shift+Click)
- Acceptance: Sorting works for all fields

---

### STORY 3: Update Risk with Partial & Full Updates

**Status**: Open  
**Priority**: High  
**Acceptance Criteria**:

1. **AC 3.1**: PATCH endpoint for partial risk updates
   - PATCH /api/v1/risks/{riskId}
   - Only provided fields are updated
   - Omitted fields remain unchanged
   - Returns HTTP 200 with updated risk object

2. **AC 3.2**: PUT endpoint for full risk replacement
   - PUT /api/v1/risks/{riskId}
   - All fields must be provided
   - Missing required fields → HTTP 400
   - Returns HTTP 200 with updated risk object

3. **AC 3.3**: Update risk description
   - Description field is updatable
   - Max 500 characters
   - Validation: Not empty, not null
   - Audit log records old and new values

4. **AC 3.4**: Update risk owner
   - Owner field is updatable
   - Owner must exist in system
   - Notification sent to new and old owner
   - Audit log records ownership change

5. **AC 3.5**: Update risk status (Open → Closed transition)
   - Status field is updatable via patch
   - Valid transitions: Open ↔ Closed
   - Status change requires timestamp update (modified_at)
   - Audit log records status change with timestamp

6. **AC 3.6**: Update risk priority
   - Priority field is updatable
   - Valid values: Highest, High, Medium, Low
   - No validation dependencies on other fields
   - Audit log records priority change

7. **AC 3.7**: Prevent updates to auto-generated fields
   - Risk ID cannot be updated
   - Created_at cannot be updated
   - HTTP 400 if attempted, with message "Field is immutable"

8. **AC 3.8**: Department field is read-only after creation
   - Cannot change department via PATCH or PUT
   - Attempting to change department → HTTP 422
   - Message: "Department cannot be changed after risk creation"

9. **AC 3.9**: Conditional update with ETag (optimistic locking)
   - Include If-Match header with previous ETag
   - Mismatch → HTTP 412 Precondition Failed
   - Prevents lost updates in concurrent scenarios

10. **AC 3.10**: Audit trail records all updates
    - Action: "Risk Updated"
    - Actor: User email
    - Changed fields: old_value → new_value for each field
    - Timestamp: UTC update time
    - IP Address: Source IP

11. **AC 3.11**: Partial update returns only changed fields in response
    - PATCH response includes: risk_id, updated fields, modified_at
    - PUT response includes: complete risk object
    - Both return HTTP 200

12. **AC 3.12**: Non-existent risk ID returns HTTP 404
    - PATCH /api/v1/risks/nonexistent → HTTP 404
    - PUT /api/v1/risks/nonexistent → HTTP 404
    - Message: "Risk with ID {id} not found"

---

#### STORY 3 Tasks

**Task 3.1.1**: Implement PATCH /api/v1/risks/{riskId} endpoint
- Parse request body for partial updates
- Validate provided fields only
- Prevent updates to immutable fields
- Return HTTP 200 with updated object
- Acceptance: Endpoint tested with various partial update scenarios

**Task 3.1.2**: Implement PUT /api/v1/risks/{riskId} endpoint
- Require all fields in request body
- Validate complete object
- Return HTTP 400 if missing required fields
- Return HTTP 200 with full updated object
- Acceptance: Endpoint tested with full and partial payloads

**Task 3.1.3**: Implement field-level validation for updates
- Description: 1-500 characters, not null
- Owner: must exist in Risk Owners table
- Priority: enum validation (Highest/High/Medium/Low)
- Status: only Open or Closed
- Acceptance: Validation catches all invalid inputs

**Task 3.1.4**: Implement ETag-based optimistic locking
- Generate ETag on risk retrieval (hash of risk object)
- Validate If-Match header on updates
- Return HTTP 412 if ETag mismatch
- Acceptance: Concurrent updates detected and prevented

**Task 3.1.5**: Build React edit form for risk updates
- Prefill form with current risk values
- Submit via PATCH (partial) or PUT (full)
- Show validation errors on submit
- Optimistic UI updates on success
- Show error message if 409 conflict/412 precondition failed
- Acceptance: Form renders correctly, updates work

**Task 3.1.6**: Implement update audit logging
- Log all field changes with old and new values
- Capture actor, timestamp, IP address
- Store in AuditLog table
- Acceptance: Audit trail shows all risk modifications

---

### STORY 4: Delete Risk with Soft-Delete & Audit Trail

**Status**: Open  
**Priority**: Medium  
**Acceptance Criteria**:

1. **AC 4.1**: Soft-delete (logical delete) mechanism
   - DELETE /api/v1/risks/{riskId} marks risk as deleted
   - Row remains in database with deleted_at timestamp
   - Risk appears in list only if filter includes deleted=true
   - Soft-deleted risks can be permanently deleted by admin

2. **AC 4.2**: Soft-deleted risks excluded from normal queries
   - GET /api/v1/risks does not include deleted risks by default
   - GET /api/v1/risks?include_deleted=true shows deleted risks
   - GET /api/v1/risks/{riskId} returns HTTP 404 if deleted

3. **AC 4.3**: Risk can only be deleted by authorized users
   - Risk Officer can delete own risks
   - Admin can delete any risk
   - Auditor can only view, cannot delete
   - HTTP 403 Forbidden if user lacks delete permission

4. **AC 4.4**: Soft-delete records deletion in audit trail
   - Action: "Risk Deleted"
   - Actor: User email
   - Timestamp: UTC deletion time
   - Reason: Optional user-provided reason (max 200 chars)
   - IP Address: Source IP

5. **AC 4.5**: Permanent delete restricted to admin + manager approval
   - Admin can request permanent delete
   - Requires secondary approval from Manager
   - Confirmation email sent to stakeholders
   - Permanent deletion is logged with reasons

6. **AC 4.6**: Risk with dependencies cannot be soft-deleted
   - If risk has open remediation tasks → HTTP 422
   - If risk has pending approvals → HTTP 422
   - Message: "Risk cannot be deleted. Reason: {reason}"
   - User must resolve dependencies first

7. **AC 4.7**: Delete returns HTTP 204 No Content on success
   - Response body is empty
   - Subsequent GET returns HTTP 404

8. **AC 4.8**: Non-existent risk delete returns HTTP 404
   - DELETE /api/v1/risks/nonexistent → HTTP 404
   - Message: "Risk with ID {id} not found"

9. **AC 4.9**: Restore (undelete) functionality for admins
   - Admin can restore soft-deleted risk
   - PATCH /api/v1/risks/{riskId}/restore
   - Sets deleted_at = NULL
   - Audit log records restoration

10. **AC 4.10**: Delete confirmation dialog in UI
    - Show risk details before deletion
    - Require user to confirm deletion
    - Optional reason text field
    - Warn if risk has dependencies

---

#### STORY 4 Tasks

**Task 4.1.1**: Add deleted_at column to Risk table
- Migration: ALTER TABLE risks ADD deleted_at TIMESTAMP NULL
- Index on deleted_at for query performance
- Acceptance: Column added, indexed, nullable

**Task 4.1.2**: Implement soft-delete logic in DELETE endpoint
- Set deleted_at = NOW() instead of actually deleting
- Return HTTP 204
- Audit log deletion
- Acceptance: Risk marked as deleted, can be queried with filter

**Task 4.1.3**: Update all GET queries to exclude soft-deleted risks
- Add WHERE deleted_at IS NULL to all list queries
- Allow ?include_deleted=true parameter
- Validate authorization for deleted=true queries
- Acceptance: Soft-deleted risks hidden by default

**Task 4.1.4**: Implement restore endpoint (PATCH /api/v1/risks/{id}/restore)
- Set deleted_at = NULL
- Require admin role
- Audit log restoration
- Return HTTP 200 with restored risk
- Acceptance: Soft-deleted risks can be restored

**Task 4.1.5**: Build delete confirmation dialog in React
- Show risk summary (ID, Description, Owner)
- Confirm deletion with checkbox "I confirm deletion"
- Optional reason text field
- Show warning if risk has dependencies
- Submit via DELETE endpoint
- Acceptance: Dialog renders, prevents accidental deletes

---

### STORY 5: Retrieve Risk by ID with Full Details

**Status**: Open  
**Priority**: High  
**Acceptance Criteria**:

1. **AC 5.1**: Get risk details endpoint
   - GET /api/v1/risks/{riskId}
   - Returns HTTP 200 with complete risk object
   - 404 if risk not found or soft-deleted

2. **AC 5.2**: Response includes all risk properties
   - Risk ID, Description, Owner name & email
   - Department, Priority, Status
   - Created_at, Modified_at, Created_by, Modified_by
   - Risk Type, Risk Severity (if set)
   - Audit trail (last 5 modifications)

3. **AC 5.3**: Related data included in response
   - Risk Owner details (name, email, phone)
   - Department details (name, head, team size)
   - Count of open remediation tasks
   - Count of approvals pending
   - Link to assessment details (if risk assessed)

4. **AC 5.4**: Audit history included in response
   - Last 5 audit entries for this risk
   - Each entry: action, actor, timestamp, changed_fields
   - Sorted by timestamp descending

5. **AC 5.5**: Navigation links in response
   - Link to self (/api/v1/risks/{id})
   - Link to update (/api/v1/risks/{id} via PATCH/PUT)
   - Link to delete (/api/v1/risks/{id} via DELETE)
   - Link to remediation tasks (/api/v1/risks/{id}/tasks)
   - Link to assessments (/api/v1/risks/{id}/assessments)

6. **AC 5.6**: ETag header for caching
   - Response includes ETag header
   - Client can use If-None-Match to skip download
   - 304 Not Modified if ETag matches

7. **AC 5.7**: Access control validation
   - User can view own department risks
   - Admin can view all risks
   - Auditor can view all risks (read-only)
   - HTTP 403 if user lacks view permission

8. **AC 5.8**: Response format matches API schema
   - JSON response validates against RiskDetailResponse schema
   - All required fields present
   - All field types match schema definition

9. **AC 5.9**: Timestamps in ISO 8601 format
   - created_at, modified_at in format: 2024-05-02T14:30:00Z
   - Timezone: UTC
   - Include millisecond precision

10. **AC 5.10**: Related risks recommendations
    - Same department risks (similar risks)
    - Same owner's other risks
    - Similar risk descriptions (AI-powered)
    - Up to 5 recommendations

---

#### STORY 5 Tasks

**Task 5.1.1**: Implement GET /api/v1/risks/{riskId} endpoint
- Query risk from database
- Include related owner and department data
- Include audit history (last 5 entries)
- Return HTTP 200 with RiskDetailResponse
- Acceptance: Endpoint returns complete risk details

**Task 5.1.2**: Implement RiskDetailResponse schema with Zod
- Define complete schema for detail response
- Include all properties and related data
- Validate response before sending
- Acceptance: Schema validates all fields

**Task 5.1.3**: Implement ETag generation and caching headers
- Generate ETag hash from risk object
- Include ETag in response headers
- Handle If-None-Match header
- Return HTTP 304 if ETag matches
- Acceptance: Caching works correctly

**Task 5.1.4**: Implement related risks recommendations
- Query similar risks in same department
- Query other risks by same owner
- Use similarity search (description matching)
- Return up to 5 recommendations
- Acceptance: Recommendations appear in response

**Task 5.1.5**: Build React detail component for risk
- Display all risk properties
- Show audit history table
- Show related risks
- Include edit/delete/status change actions
- Responsive layout for mobile
- Acceptance: Detail view renders correctly

---

### STORY 6: Risk Status Lifecycle Management (Open → Closed)

**Status**: Open  
**Priority**: High  
**Acceptance Criteria**:

1. **AC 6.1**: Initial risk status is "Open"
   - New risk automatically created with status = "Open"
   - Status cannot be set manually on creation
   - Audit log shows initial status

2. **AC 6.2**: Close risk requires justification
   - PATCH /api/v1/risks/{id} with status: "Closed"
   - Requires closure_reason field (max 500 chars)
   - HTTP 422 if closure_reason not provided

3. **AC 6.3**: Reopen closed risk is possible
   - PATCH /api/v1/risks/{id} with status: "Open"
   - Requires reopen_reason field (max 500 chars)
   - HTTP 422 if reopen_reason not provided

4. **AC 6.4**: Status change requires audit trail
   - Audit log records status change
   - Includes actor, timestamp, old status, new status
   - Includes closure/reopen reason
   - IP Address captured

5. **AC 6.5**: Status change triggers notifications
   - Open → Closed: Email to Risk Owner and Department Head
   - Closed → Open: Email to Risk Owner and Department Head
   - Notification includes reason and timestamp

6. **AC 6.6**: Closed risk shows "At Risk" badge
   - UI displays differently for Open vs Closed risks
   - Visual indicator (color, icon) for status

7. **AC 6.7**: Cannot delete risk with specific status combinations
   - Cannot delete while open and in remediation
   - Can delete if closed and no pending approvals

8. **AC 6.8**: Status field is case-sensitive
   - Valid values: "Open", "Closed" (exact case)
   - Invalid: "open", "OPEN", "closed"
   - HTTP 422 for case mismatch

9. **AC 6.9**: Closed risks can be filtered separately
   - GET /api/v1/risks?status=Open
   - GET /api/v1/risks?status=Closed
   - GET /api/v1/risks (shows both)

10. **AC 6.10**: Status history available in audit trail
    - Show all status changes over time
    - Include reasons for each change
    - Timeline view available in UI

---

#### STORY 6 Tasks

**Task 6.1.1**: Implement status update validation logic
- Validate status field: must be "Open" or "Closed"
- Require closure_reason if changing to "Closed"
- Require reopen_reason if changing to "Open"
- HTTP 422 if validation fails
- Acceptance: Validation catches all invalid transitions

**Task 6.1.2**: Implement status change in PATCH endpoint
- Update risk status and corresponding reason
- Set modified_at = NOW()
- Audit log the change
- Return HTTP 200 with updated risk
- Acceptance: Status updates work correctly

**Task 6.1.3**: Implement notification on status change
- Send email to Risk Owner on status change
- Send email to Department Head on status change
- Include risk details and reason in email
- Acceptance: Notifications sent within 5 seconds

**Task 6.1.4**: Build status change dialog in React
- Show current status
- Show status toggle (Open ↔ Closed)
- Require reason text field
- Character count for reason (max 500)
- Submit via PATCH endpoint
- Acceptance: Dialog works, validatesreason

**Task 6.1.5**: Build status timeline component
- Show all status changes
- Include timestamp, actor, reason for each
- Timeline view in risk detail
- Acceptance: Timeline displays correctly

---

## Database Schema (Core)

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
  created_by VARCHAR(255),
  modified_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  closure_reason VARCHAR(500),
  reopen_reason VARCHAR(500),
  CONSTRAINT valid_status CHECK (status IN ('Open', 'Closed')),
  CONSTRAINT valid_priority CHECK (priority IN ('Highest', 'High', 'Medium', 'Low'))
);

CREATE TABLE risk_owners (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  department VARCHAR(50)
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
```

---

## API Endpoints Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/v1/risks | Create risk | Risk Officer+ |
| GET | /api/v1/risks | List risks with filters | All |
| GET | /api/v1/risks/{id} | Get risk details | All |
| PATCH | /api/v1/risks/{id} | Update risk (partial) | Risk Officer+ |
| PUT | /api/v1/risks/{id} | Replace risk (full) | Risk Officer+ |
| DELETE | /api/v1/risks/{id} | Soft-delete risk | Risk Officer+ |
| PATCH | /api/v1/risks/{id}/restore | Restore deleted risk | Admin |
| PATCH | /api/v1/risks/{id}/status | Change status | Risk Officer+ |

---

## Acceptance Criteria Count
- **Total AC**: 62
- **Stories**: 6
- **Tasks**: 16
- **Database Tables**: 3
- **API Endpoints**: 8

