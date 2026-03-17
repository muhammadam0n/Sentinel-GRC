export type RiskStatus = "Open" | "Mitigated" | "Accepted" | "Closed";
export type AuditStatus = "Planned" | "In Progress" | "Completed";
export type TaskStatus = "Pending" | "In Progress" | "Completed";

export type RiskCategory =
  | "Access Control"
  | "Network Security"
  | "Data Protection"
  | "Third-Party"
  | "Human Factors"
  | "Incident Response";

export type Likelihood = 1 | 2 | 3 | 4 | 5;
export type Impact = 1 | 2 | 3 | 4 | 5;

export type Risk = {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;
  owner: string;
  likelihood: Likelihood;
  impact: Impact;
  score: number;
  status: RiskStatus;
  createdAt: string;
  updatedAt: string;
};

export type FrameworkId = "iso27001" | "nistcsf";

export type Framework = {
  id: FrameworkId;
  name: string;
  description: string;
};

export type Control = {
  id: string;
  frameworkId: FrameworkId;
  code: string;
  title: string;
  description: string;
  mappedRiskIds: string[];
};

export type AuditFindingSeverity = "Low" | "Medium" | "High";

export type AuditFinding = {
  id: string;
  title: string;
  description: string;
  severity: AuditFindingSeverity;
  status: "Open" | "Resolved";
  createdAt: string;
};

export type Audit = {
  id: string;
  title: string;
  scope: string;
  auditors: string[];
  status: AuditStatus;
  startDate: string;
  endDate?: string;
  findings: AuditFinding[];
  linkedEvidenceIds: string[];
};

export type EvidenceLinkType = "Audit" | "Control";

export type Evidence = {
  id: string;
  fileName: string;
  fileType: string;
  sizeBytes: number;
  uploadedAt: string;
  linkedTo?: { type: EvidenceLinkType; id: string };
};

export type PolicyStatus = "Draft" | "Active" | "Retired";

export type Policy = {
  id: string;
  title: string;
  owner: string;
  status: PolicyStatus;
  lastReviewedAt: string;
  documentFileName?: string;
};

export type ActionTask = {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: TaskStatus;
  linkedRiskId?: string;
};

export type ActivityItem = {
  id: string;
  timestamp: string;
  type:
    | "RiskCreated"
    | "RiskUpdated"
    | "AuditCreated"
    | "FindingAdded"
    | "EvidenceUploaded"
    | "PolicyCreated"
    | "TaskCreated"
    | "TaskUpdated";
  title: string;
  detail?: string;
};
