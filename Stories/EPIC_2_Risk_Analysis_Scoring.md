# EPIC 2: Risk Analysis & Scoring

**Status**: Open  
**Priority**: High  
**Project**: KAN (Risk Module)  

---

## Epic Description

Implement comprehensive risk analysis and scoring mechanisms to evaluate risk severity, likelihood, and impact. This epic enables quantitative risk assessment through impact scoring (1-5), likelihood scoring (1-5), and derived risk scoring. Includes impact analysis, likelihood analysis, threat modeling, and RCA (Root Cause Analysis) capabilities. Forms the basis for risk prioritization and treatment decisions.

---

## Epic Goals

1. ✅ Enable Risk Officers to score risks by impact (1-5) and likelihood (1-5)
2. ✅ Implement automatic risk score calculation (Impact × Likelihood)
3. ✅ Build comprehensive impact analysis documentation
4. ✅ Build likelihood analysis documentation
5. ✅ Implement threat analysis and RCA tracking
6. ✅ Enable risk severity determination based on inherent and residual scores

---

## Stories

### STORY 7: Impact Scoring with Qualitative Descriptions

**Status**: Open  
**Priority**: High  
**Acceptance Criteria**:

1. **AC 7.1**: Impact score is numeric 1-5
   - 1 = Minimal/Negligible
   - 2 = Minor/Limited
   - 3 = Moderate/Significant
   - 4 = Major/Critical
   - 5 = Catastrophic/Severe
   - HTTP 422 if outside 1-5 range

2. **AC 7.2**: Impact scoring affects multiple dimensions
   - Financial impact (revenue loss, costs)
   - Operational impact (downtime, efficiency)
   - Compliance impact (violations, fines)
   - Reputational impact (brand damage, trust)
   - Security impact (data breach, vulnerability)

3. **AC 7.3**: Predefined impact descriptions
   - Each score (1-5) has standardized description
   - Descriptions include quantitative examples
   - Examples: 1 = <$10K loss, 2 = $10-50K, 3 = $50-500K, etc.

4. **AC 7.4**: Impact score includes justification field
   - PATCH /api/v1/risks/{id}/impact
   - Requires impact_score (1-5)
   - Requires impact_justification (max 500 chars)
   - HTTP 422 if justification missing

5. **AC 7.5**: Impact analysis can be detailed
   - Separate endpoint: PATCH /api/v1/risks/{id}/impact-analysis
   - Includes financial_impact, operational_impact, compliance_impact, reputational_impact, security_impact
   - Each sub-field: value (1-5) + description (max 200 chars)

6. **AC 7.6**: Audit trail records impact score changes
   - Log action: "Impact Score Updated"
   - Include old and new scores
   - Include justification provided
   - Timestamp and actor captured

7. **AC 7.7**: Impact score is required to calculate risk score
   - Cannot calculate risk score without impact score
   - Cannot calculate risk score without likelihood score
   - GET /api/v1/risks/{id} shows impact_score if set

8. **AC 7.8**: Impact score can be updated anytime
   - PATCH /api/v1/risks/{id}/impact after risk creation
   - Overrides previous impact score
   - Audit trail shows all changes
   - Returns HTTP 200 with updated risk

9. **AC 7.9**: Response includes impact score history
   - GET /api/v1/risks/{id} includes: current impact_score and last updated
   - Admin view shows: all impact score changes with timestamps
   - Historical trend data available

10. **AC 7.10**: Impact scoring guidance available in UI
    - Tooltips explain each score level
    - Example scenarios for each level
    - Link to impact scoring guidelines document
    - Help text: "Choose based on worst-case impact"

---

#### STORY 7 Tasks

**Task 7.1.1**: Design impact scoring framework
- Define 5-level scale with financial, operational, compliance, reputational, security examples
- Create impact scoring guidelines document
- Get approval from Risk Steering Committee
- Acceptance: Guidelines document approved

**Task 7.1.2**: Add impact-related columns to Risk table
- ALTER TABLE risks ADD impact_score INT (NULL)
- ALTER TABLE risks ADD impact_justification VARCHAR(500)
- ALTER TABLE risks ADD financial_impact INT
- ALTER TABLE risks ADD operational_impact INT
- ALTER TABLE risks ADD compliance_impact INT
- ALTER TABLE risks ADD reputational_impact INT
- ALTER TABLE risks ADD security_impact INT
- Acceptance: Columns added, indexed

**Task 7.1.3**: Implement PATCH /api/v1/risks/{id}/impact endpoint
- Validate impact_score: 1-5
- Require impact_justification
- Update risk and set modified_at
- Audit log the change
- Return HTTP 200 with updated impact fields
- Acceptance: Endpoint tested with various scores

**Task 7.1.4**: Implement PATCH /api/v1/risks/{id}/impact-analysis endpoint
- Accept: financial_impact, operational_impact, compliance_impact, reputational_impact, security_impact
- Validate each: 1-5
- Calculate average as overall impact_score if not explicitly provided
- Audit log all changes
- Return HTTP 200 with complete analysis
- Acceptance: Endpoint validates all fields

**Task 7.1.5**: Build React impact scoring form
- Score selector: 1-5 with descriptions and examples
- Justification text area (max 500 chars)
- Show calculation preview
- Submit via PATCH /api/v1/risks/{id}/impact
- Acceptance: Form renders, validates, submits

**Task 7.1.6**: Build detailed impact analysis form
- 5 separate sliders/selectors (Financial, Operational, Compliance, Reputational, Security)
- Description field for each
- Preview of overall impact score
- Submit via PATCH endpoint
- Acceptance: Form works, calculates average

---

### STORY 8: Likelihood Scoring with Risk Factors

**Status**: Open  
**Priority**: High  
**Acceptance Criteria**:

1. **AC 8.1**: Likelihood score is numeric 1-5
   - 1 = Rare/Almost Never
   - 2 = Unlikely/Low Probability
   - 3 = Possible/Moderate Probability
   - 4 = Likely/High Probability
   - 5 = Almost Certain/Imminent
   - HTTP 422 if outside 1-5 range

2. **AC 8.2**: Likelihood scoring based on multiple factors
   - Threat landscape (industry, organization)
   - Control effectiveness (existing mitigations)
   - Historical incidents (past occurrences)
   - Attacker capability (sophistication)
   - Vulnerability status (exposure level)

3. **AC 8.3**: Likelihood score includes justification
   - PATCH /api/v1/risks/{id}/likelihood
   - Requires likelihood_score (1-5)
   - Requires likelihood_justification (max 500 chars)
   - HTTP 422 if justification missing

4. **AC 8.4**: Likelihood factors considered separately
   - PATCH /api/v1/risks/{id}/likelihood-analysis
   - Include: threat_landscape_score, control_effectiveness_score, incident_history_score, attacker_capability_score, vulnerability_status_score
   - Each 1-5 with justification (max 200 chars)

5. **AC 8.5**: Likelihood calculation considers control effectiveness
   - If strong controls exist → lower likelihood score
   - If weak controls exist → higher likelihood score
   - Formula: base_likelihood - (control_strength * 0.5)
   - Minimum score: 1, Maximum: 5

6. **AC 8.6**: Audit trail records likelihood score changes
   - Log action: "Likelihood Score Updated"
   - Include old and new scores
   - Include justification and factors
   - Timestamp and actor captured

7. **AC 8.7**: Likelihood score history available
   - GET /api/v1/risks/{id} shows current likelihood_score
   - Admin view shows all likelihood changes with timestamps
   - Show date of last update

8. **AC 8.8**: Likelihood score can be updated after creation
   - PATCH /api/v1/risks/{id}/likelihood
   - Triggers risk score recalculation
   - Notifies relevant stakeholders if score increases
   - Returns HTTP 200 with updated risk

9. **AC 8.9**: Predefined likelihood descriptions
   - 1 = Rare: <1% annual probability
   - 2 = Unlikely: 1-10% annual probability
   - 3 = Possible: 10-50% annual probability
   - 4 = Likely: 50-90% annual probability
   - 5 = Almost Certain: >90% annual probability

10. **AC 8.10**: Likelihood scoring guidance in UI
    - Tooltips explain each level with examples
    - Show risk factors to consider
    - Links to threat intelligence
    - Context-aware recommendations

---

#### STORY 8 Tasks

**Task 8.1.1**: Design likelihood scoring framework
- Create 5-level scale with probability ranges
- Define risk factors (threat landscape, control effectiveness, incident history, attacker capability, vulnerability status)
- Document scoring methodology
- Get approval from Risk Officer and Security Lead
- Acceptance: Framework document approved

**Task 8.1.2**: Add likelihood-related columns to Risk table
- ALTER TABLE risks ADD likelihood_score INT (NULL)
- ALTER TABLE risks ADD likelihood_justification VARCHAR(500)
- ALTER TABLE risks ADD threat_landscape_score INT
- ALTER TABLE risks ADD control_effectiveness_score INT
- ALTER TABLE risks ADD incident_history_score INT
- ALTER TABLE risks ADD attacker_capability_score INT
- ALTER TABLE risks ADD vulnerability_status_score INT
- Acceptance: Columns added, indexed

**Task 8.1.3**: Implement PATCH /api/v1/risks/{id}/likelihood endpoint
- Validate likelihood_score: 1-5
- Require likelihood_justification
- Update risk and set modified_at
- Trigger risk score recalculation
- Audit log the change
- Return HTTP 200 with updated likelihood fields
- Acceptance: Endpoint tested, recalculation works

**Task 8.1.4**: Implement PATCH /api/v1/risks/{id}/likelihood-analysis endpoint
- Accept all 5 factors (threat, control, incident, attacker, vulnerability)
- Validate each: 1-5
- Calculate overall likelihood_score (weighted average)
- Audit log all changes
- Return HTTP 200 with analysis
- Acceptance: Endpoint validates, calculates weight correctly

**Task 8.1.5**: Build React likelihood scoring form
- Score selector: 1-5 with probability examples
- Justification text area (max 500 chars)
- Show calculation preview
- Submit via PATCH /api/v1/risks/{id}/likelihood
- Acceptance: Form renders, validates, submits

**Task 8.1.6**: Build detailed likelihood analysis form
- 5 separate factor inputs (Threat, Control, Incident, Attacker, Vulnerability)
- Description field for each
- Preview of overall likelihood score
- Submit via PATCH endpoint
- Acceptance: Form works, calculates correctly

---

### STORY 9: Automatic Risk Score Calculation (Impact × Likelihood)

**Status**: Open  
**Priority**: Highest  
**Acceptance Criteria**:

1. **AC 9.1**: Risk score formula: Impact × Likelihood
   - risk_score = impact_score × likelihood_score
   - Calculated automatically when both scores are set
   - Range: 1 (1×1) to 25 (5×5)

2. **AC 9.2**: Risk score determines severity level
   - 1-5: Low Risk
   - 6-12: Medium Risk
   - 13-18: High Risk
   - 19-25: Critical Risk
   - Risk severity displayed as badge in UI

3. **AC 9.3**: Risk score cannot be manually set
   - PATCH /api/v1/risks/{id} with risk_score → HTTP 422
   - Message: "Risk score is automatically calculated"
   - Risk score is read-only

4. **AC 9.4**: Risk score recalculates on impact/likelihood change
   - Update impact_score → risk_score recalculates automatically
   - Update likelihood_score → risk_score recalculates automatically
   - Returns new risk_score in response

5. **AC 9.5**: Risk score null if impact or likelihood missing
   - If impact_score is NULL → risk_score is NULL
   - If likelihood_score is NULL → risk_score is NULL
   - GET /api/v1/risks/{id} shows NULL for risk_score if either missing

6. **AC 9.6**: Inherent vs. Residual risk scores
   - inherent_risk_score: Based on inherent (un-mitigated) risk
   - residual_risk_score: Based on residual (after mitigation) risk
   - Both calculated the same way: impact × likelihood
   - Residual uses after-treatment impact/likelihood scores

7. **AC 9.7**: Risk score history tracked
   - All changes to risk_score logged in AuditLog
   - Include calculation details (impact × likelihood = result)
   - Track inherent vs residual separately
   - Historical trend available in UI

8. **AC 9.8**: Risk score triggers notifications
   - If risk_score increases significantly (increases by 5+) → notify Risk Officer
   - If risk_score becomes Critical (19-25) → notify Department Head and Risk Officer
   - Email includes old and new scores with calculation

9. **AC 9.9**: Risk score available in list view
   - GET /api/v1/risks returns risk_score for each risk
   - Sortable by risk_score (descending)
   - Filterable by severity level (Low/Medium/High/Critical)

10. **AC 9.10**: Risk score color-coded in UI
    - Low (1-5): Green
    - Medium (6-12): Yellow
    - High (13-18): Orange
    - Critical (19-25): Red
    - Consistent coloring across all views

11. **AC 9.11**: Dashboard shows risk score distribution
    - Count of Low/Medium/High/Critical risks
    - Pie chart of distribution
    - Trend chart (score changes over time)
    - Filtered by department/owner (if applicable)

12. **AC 9.12**: Risk score appears in risk detail response
    - GET /api/v1/risks/{id} includes: risk_score, severity_level, inherent_score, residual_score
    - Shows calculation: "Risk Score = Impact (X) × Likelihood (Y) = Z"
    - Includes last updated timestamp

---

#### STORY 9 Tasks

**Task 9.1.1**: Add risk_score columns to Risk table
- ALTER TABLE risks ADD risk_score INT GENERATED ALWAYS AS (impact_score * likelihood_score) STORED
- ALTER TABLE risks ADD inherent_risk_score INT
- ALTER TABLE risks ADD residual_risk_score INT
- ALTER TABLE risks ADD severity_level VARCHAR(20)
- Acceptance: Columns added, calculated columns work

**Task 9.1.2**: Implement risk score calculation function
- Function: calculate_risk_score(impact INT, likelihood INT) RETURNS INT
- Formula: impact × likelihood
- Validate inputs (1-5)
- Return calculated score
- Acceptance: Function tested with various inputs

**Task 9.1.3**: Implement severity level determination function
- Function: get_severity_level(risk_score INT) RETURNS VARCHAR
- 1-5 → "Low"
- 6-12 → "Medium"
- 13-18 → "High"
- 19-25 → "Critical"
- Acceptance: Function tested for all ranges

**Task 9.1.4**: Implement risk score calculation on impact/likelihood update
- Trigger: after UPDATE on impact_score or likelihood_score
- Recalculate risk_score automatically
- Update severity_level
- Log change in AuditLog
- Acceptance: Trigger fires on updates, scores recalculate

**Task 9.1.5**: Implement risk score notifications
- Notify if risk_score increases by 5 or more
- Notify if severity changes to "Critical"
- Email to Risk Officer and Department Head
- Include calculation and comparison
- Acceptance: Notifications send correctly

**Task 9.1.6**: Build risk score visualization components
- Risk score card showing numeric score
- Severity badge (color-coded)
- Score breakdown showing Impact and Likelihood
- Mini progress bar showing risk in scale 1-25
- Acceptance: Component renders correctly

**Task 9.1.7**: Implement dashboard risk score charts
- Pie chart: Distribution of Low/Medium/High/Critical
- Bar chart: Top 10 highest risk scores
- Trend chart: Risk scores over last 90 days
- Filterable by department
- Acceptance: Charts render with live data

---

### STORY 10: Impact Analysis Documentation

**Status**: Open  
**Priority**: High  
**Acceptance Criteria**:

1. **AC 10.1**: Impact analysis structured format
   - PATCH /api/v1/risks/{id}/detailed-impact
   - Fields: financial_impact_desc, operational_impact_desc, compliance_impact_desc, reputational_impact_desc, security_impact_desc
   - Each field: max 1000 chars

2. **AC 10.2**: Financial impact analysis includes quantitative estimates
   - Estimated revenue loss (dollars)
   - Operational costs (investigation, remediation)
   - Insurance costs or deductibles
   - Regulatory fines
   - Total financial impact estimate

3. **AC 10.3**: Operational impact analysis
   - Service downtime estimate (hours)
   - Affected systems and services
   - Business unit impact
   - Customer impact (number of customers, severity)
   - Recovery time estimate (RTO)

4. **AC 10.4**: Compliance impact analysis
   - Applicable regulations (GDPR, HIPAA, SOC 2, PCI-DSS, etc.)
   - Potential violations
   - Regulatory fine estimates
   - Compliance report impact
   - Audit findings severity

5. **AC 10.5**: Reputational impact analysis
   - Customer trust impact
   - Brand damage assessment
   - Media/public relations impact
   - Partner/vendor relationship impact
   - Employee morale impact

6. **AC 10.6**: Security impact analysis
   - Data at risk (type, quantity)
   - Security control failures
   - Attack surface expansion
   - Vulnerability exposure
   - Breach/incident probability

7. **AC 10.7**: Impact analysis includes supporting evidence
   - Links to past incidents (if applicable)
   - References to similar risks in industry
   - Historical impact data
   - Expert assessments
   - Research or standards references

8. **AC 10.8**: Impact analysis available in detail view
   - GET /api/v1/risks/{id} includes all impact analysis fields
   - Formatted as structured object
   - Audit trail shows all changes to analysis

9. **AC 10.9**: Impact analysis comparison (before/after)
   - Show previous impact analysis in UI
   - Highlight changes between versions
   - Include who changed it and when
   - Version history available

10. **AC 10.10**: Impact analysis supports rich text
    - Format: markdown or HTML
    - Allow bold, italics, lists, links, tables
    - Sanitize input to prevent XSS
    - Render formatted in UI

---

#### STORY 10 Tasks

**Task 10.1.1**: Add impact analysis columns to Risk table
- ALTER TABLE risks ADD impact_analysis JSONB
- JSON structure with all impact categories
- Each category includes: description, estimated_amount, supporting_evidence
- Acceptance: Columns added, JSONB validated

**Task 10.1.2**: Implement PATCH /api/v1/risks/{id}/detailed-impact endpoint
- Accept JSONB impact_analysis object
- Validate structure and field sizes
- Update risk.impact_analysis
- Audit log the change
- Return HTTP 200 with updated risk
- Acceptance: Endpoint tested with various inputs

**Task 10.1.3**: Build impact analysis form in React
- Financial section: inputs for revenue loss, operational costs, fines
- Operational section: downtime estimate, affected systems
- Compliance section: regulations, potential violations
- Reputational section: trust, brand, media impact
- Security section: data at risk, control failures
- RichText editor for each section
- Submit via PATCH endpoint
- Acceptance: Form renders, all sections work

**Task 10.1.4**: Build impact analysis detail view
- Display all impact categories in structured format
- Show quantitative estimates prominently
- Include evidence/references links
- Show edit button
- Display version history
- Acceptance: Detail view renders correctly

---

### STORY 11: Likelihood Analysis Documentation

**Status**: Open  
**Priority**: High  
**Acceptance Criteria**:

1. **AC 11.1**: Likelihood analysis structured format
   - PATCH /api/v1/risks/{id}/detailed-likelihood
   - Fields: threat_landscape, control_effectiveness, incident_history, attacker_capability, vulnerability_status
   - Each field: score (1-5) + description (max 1000 chars)

2. **AC 11.2**: Threat landscape analysis
   - Current threat landscape in industry
   - Applicable threat actors
   - Known attack patterns
   - Prevalence in similar organizations
   - Trend (increasing/stable/decreasing)

3. **AC 11.3**: Control effectiveness assessment
   - Existing preventive controls
   - Effectiveness of each control (%)
   - Control gaps identified
   - Control implementation status (fully/partially/not implemented)
   - Improvement recommendations

4. **AC 11.4**: Incident history analysis
   - Past incidents in organization
   - Similar incidents in industry
   - Frequency analysis
   - Time since last incident
   - Patterns identified

5. **AC 11.5**: Attacker capability assessment
   - Attacker sophistication (low/moderate/high/advanced)
   - Tools and techniques available
   - Resource requirements
   - Time to exploit estimate
   - Insider threat consideration

6. **AC 11.6**: Vulnerability status assessment
   - Known vulnerabilities exist (yes/no)
   - Vulnerability severity (critical/high/medium/low)
   - Time to patch
   - Exploitability (easy/moderate/difficult)
   - Exploitation evidence (in-the-wild, PoC, etc.)

7. **AC 11.7**: Likelihood analysis includes threat intelligence
   - Links to CVE, CWE references
   - Threat actor profiles
   - Incident databases
   - Security research reports
   - Industry threat reports

8. **AC 11.8**: Likelihood factors weighted in calculation
   - Threat landscape: 20% weight
   - Control effectiveness: 30% weight
   - Incident history: 15% weight
   - Attacker capability: 20% weight
   - Vulnerability status: 15% weight
   - Overall formula shown in UI

9. **AC 11.9**: Likelihood analysis supports time-based updates
   - Analysis can include valid_from and valid_until dates
   - Automatic expiration after 90 days (warning in UI)
   - Prompts for review and re-assessment
   - Version history with dates

10. **AC 11.10**: Likelihood analysis comparison
    - Show previous analysis (side-by-side)
    - Highlight score changes
    - Show what factors changed
    - Track who updated and when

---

#### STORY 11 Tasks

**Task 11.1.1**: Add likelihood analysis columns to Risk table
- ALTER TABLE risks ADD likelihood_analysis JSONB
- JSON structure with all 5 factors
- Each factor includes: score, description, evidence, confidence_level
- Add analysis_updated_at TIMESTAMP
- Acceptance: Columns added, JSONB validated

**Task 11.1.2**: Implement PATCH /api/v1/risks/{id}/detailed-likelihood endpoint
- Accept JSONB likelihood_analysis object
- Validate structure, field sizes, scores (1-5)
- Update risk.likelihood_analysis
- Set analysis_updated_at
- Audit log the change
- Return HTTP 200 with updated risk
- Acceptance: Endpoint tested with various inputs

**Task 11.1.3**: Build likelihood analysis form in React
- 5 sections (Threat Landscape, Control Effectiveness, Incident History, Attacker Capability, Vulnerability Status)
- Each section: score selector (1-5) + RichText description
- Show weight percentage (20%, 30%, 15%, 20%, 15%)
- Preview overall calculated likelihood score
- Show threat intelligence links
- Submit via PATCH endpoint
- Acceptance: Form renders, calculation works

**Task 11.1.4**: Build likelihood analysis detail view
- Display all 5 factors in structured format
- Show individual scores and weights
- Calculated overall likelihood score
- Timeline showing analysis updates
- Version comparison (previous vs current)
- Show confidence level (Low/Medium/High)
- Acceptance: Detail view renders correctly

---

## Database Schema (Extended for Analysis)

```sql
-- Additional columns for Impact Analysis
ALTER TABLE risks ADD impact_analysis JSONB;
ALTER TABLE risks ADD detailed_impact_desc TEXT;
ALTER TABLE risks ADD financial_impact_estimate DECIMAL(15,2);
ALTER TABLE risks ADD operational_downtime_hours INT;
ALTER TABLE risks ADD affected_customers INT;

-- Additional columns for Likelihood Analysis
ALTER TABLE risks ADD likelihood_analysis JSONB;
ALTER TABLE risks ADD detailed_likelihood_desc TEXT;
ALTER TABLE risks ADD threat_landscape_score INT;
ALTER TABLE risks ADD control_effectiveness_score INT;
ALTER TABLE risks ADD incident_history_score INT;
ALTER TABLE risks ADD attacker_capability_score INT;
ALTER TABLE risks ADD vulnerability_status_score INT;
ALTER TABLE risks ADD likelihood_analysis_updated_at TIMESTAMP;

-- Risk Score Columns
ALTER TABLE risks ADD inherent_risk_score INT;
ALTER TABLE risks ADD residual_risk_score INT;
ALTER TABLE risks ADD severity_level VARCHAR(20);

-- Audit Materialized View for Risk Score History
CREATE MATERIALIZED VIEW risk_score_history AS
SELECT
  audit_logs.entity_id as risk_id,
  audit_logs.created_at,
  audit_logs.actor_email,
  (audit_logs.new_values->>'impact_score')::INT as new_impact,
  (audit_logs.old_values->>'impact_score')::INT as old_impact,
  (audit_logs.new_values->>'likelihood_score')::INT as new_likelihood,
  (audit_logs.old_values->>'likelihood_score')::INT as old_likelihood,
  ((audit_logs.new_values->>'impact_score')::INT * (audit_logs.new_values->>'likelihood_score')::INT) as new_risk_score,
  ((audit_logs.old_values->>'impact_score')::INT * (audit_logs.old_values->>'likelihood_score')::INT) as old_risk_score
FROM audit_logs
WHERE entity_type = 'risk' AND (audit_logs.changed_fields @> '{"impact_score","likelihood_score"}');
```

---

## API Endpoints Summary (Extended)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| PATCH | /api/v1/risks/{id}/impact | Update impact score | Risk Officer+ |
| PATCH | /api/v1/risks/{id}/impact-analysis | Update detailed impact analysis | Risk Officer+ |
| PATCH | /api/v1/risks/{id}/likelihood | Update likelihood score | Risk Officer+ |
| PATCH | /api/v1/risks/{id}/likelihood-analysis | Update detailed likelihood analysis | Risk Officer+ |
| PATCH | /api/v1/risks/{id}/detailed-impact | Update rich impact documentation | Risk Officer+ |
| PATCH | /api/v1/risks/{id}/detailed-likelihood | Update rich likelihood documentation | Risk Officer+ |
| GET | /api/v1/risks/{id}/score-history | Get risk score change history | All |

---

## Acceptance Criteria Count
- **Total AC**: 62
- **Stories**: 5
- **Tasks**: 14
- **API Endpoints**: 7

