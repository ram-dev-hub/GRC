# GRC Risk Module - Stories for Jira Import

This folder contains the complete specification hierarchy for the GRC Risk Module, structured for import into Jira.

## 📁 Files Overview

### Specification Files
- **`EPIC_1_Risk_CRUD_Core_Management.md`** - Core risk CRUD operations (6 stories, 62 ACs)
- **`EPIC_2_Risk_Analysis_Scoring.md`** - Risk scoring and analysis (5 stories, 62 ACs)
- **`EPIC_3_Risk_Workflows_Approvals.md`** - Workflows and approvals (4 stories, 45 ACs)
- **`API_Database_Stories_Index.md`** - Complete API and database reference

### Jira Import Files
- **`jira-structure.json`** - Hierarchical structure for Jira bulk import
- **`../jira-mcp-server/import-clean.js`** - Bulk import script

## 🎯 Epic Structure

### EPIC-1: Risk CRUD & Core Management
**6 Stories | 36 Tasks**
- STORY-1: Create Risk with Automatic ID Generation
- STORY-2: List & Filter Risks with Sorting & Pagination
- STORY-3: Update Risk with Partial & Full Updates
- STORY-4: Delete Risk with Soft-Delete & Audit Trail
- STORY-5: Retrieve Risk by ID with Full Details
- STORY-6: Risk Status Lifecycle Management

### EPIC-2: Risk Analysis & Scoring
**5 Stories | 30 Tasks**
- STORY-7: Impact Scoring with Qualitative Descriptions
- STORY-8: Likelihood Scoring with Risk Factors
- STORY-9: Automatic Risk Score Calculation
- STORY-10: Impact Analysis Documentation
- STORY-11: Likelihood Analysis Documentation

### EPIC-3: Risk Workflows & Approvals
**4 Stories | 24 Tasks**
- STORY-12: Kanban Workflow State Transitions
- STORY-13: Treatment Strategy Selection & Execution
- STORY-14: Risk Approval Workflows with Multiple Stakeholders
- STORY-15: Risk Remediation Task Management

## 🚀 Importing to Jira

### Prerequisites
1. Jira MCP Server configured with valid credentials
2. Access to GRC project in ARKSGRC spaces
3. Node.js and dependencies installed

### Steps
1. **Verify Configuration**
   ```bash
   cd jira-mcp-server
   node -e "require('./src/index.ts').testConnection()"
   ```

2. **Run Bulk Import**
   ```bash
   cd jira-mcp-server
   node import-clean.js
   ```

3. **Monitor Progress**
   - Script will create 3 epics, 15 stories, and 90+ tasks
   - Each issue includes proper descriptions and relationships
   - Progress logged to console

## 📊 Import Results

After successful import, Jira will contain:
- **3 Epics** - High-level feature areas
- **15 Stories** - Individual user stories with acceptance criteria
- **90+ Tasks** - Implementation tasks with specific deliverables

## 🔗 Jira Hierarchy

```
GRC Project (ARKSGRC)
├── EPIC-1: Risk CRUD & Core Management
│   ├── STORY-1: Create Risk with Automatic ID Generation
│   │   ├── Task: Design risk ID generation algorithm
│   │   ├── Task: Implement database unique constraint
│   │   └── ... (5 more tasks)
│   ├── STORY-2: List & Filter Risks...
│   └── ... (4 more stories)
├── EPIC-2: Risk Analysis & Scoring
│   └── ... (5 stories with tasks)
└── EPIC-3: Risk Workflows & Approvals
    └── ... (4 stories with tasks)
```

## 📋 Quality Assurance

All specifications meet these standards:
- ✅ **10+ Acceptance Criteria** per story
- ✅ **4-7 Tasks** per story with specific deliverables
- ✅ Complete API endpoints documented
- ✅ Database schema with constraints
- ✅ Error handling and validation specified
- ✅ Audit trails and authorization documented
- ✅ Realistic examples and test scenarios

## 🔄 Maintenance

When updating specifications:
1. Modify the corresponding `.md` file
2. Update `jira-structure.json` to reflect changes
3. Re-run import script to sync with Jira
4. Commit changes to version control

## 📞 Support

For questions about specifications or import process, refer to:
- `../.instructions.md` - Domain conventions
- `../.prompt.md` - Specification guidelines
- `../AGENTS.md` - Agent capabilities