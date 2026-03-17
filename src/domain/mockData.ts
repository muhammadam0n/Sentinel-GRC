import type {
  ActionTask,
  Audit,
  Control,
  Evidence,
  Framework,
  Policy,
  Risk
} from "./types";

const nowIso = () => new Date().toISOString();

export const seedRisks: Risk[] = [
  {
    id: "r-001",
    title: "Phishing susceptibility among staff",
    description:
      "Users may fall for targeted phishing emails leading to credential compromise.",
    category: "Human Factors",
    owner: "IT Security Office",
    likelihood: 4,
    impact: 4,
    score: 16,
    status: "Open",
    createdAt: "2026-02-10T09:00:00.000Z",
    updatedAt: "2026-02-10T09:00:00.000Z"
  },
  {
    id: "r-002",
    title: "Unpatched endpoints in computer labs",
    description:
      "Delayed patching could expose known vulnerabilities across shared lab devices.",
    category: "Network Security",
    owner: "Desktop Support",
    likelihood: 3,
    impact: 5,
    score: 15,
    status: "Mitigated",
    createdAt: "2026-02-05T11:20:00.000Z",
    updatedAt: "2026-02-20T08:10:00.000Z"
  },
  {
    id: "r-003",
    title: "Inadequate backups for research data",
    description:
      "Some research groups use unmanaged storage without validated backups.",
    category: "Data Protection",
    owner: "Research Computing",
    likelihood: 3,
    impact: 4,
    score: 12,
    status: "Open",
    createdAt: "2026-01-18T12:00:00.000Z",
    updatedAt: "2026-02-01T12:00:00.000Z"
  },
  {
    id: "r-004",
    title: "Third-party SaaS contract lacks security clauses",
    description:
      "A vendor contract may not include breach notification and audit rights.",
    category: "Third-Party",
    owner: "Procurement",
    likelihood: 2,
    impact: 4,
    score: 8,
    status: "Accepted",
    createdAt: "2026-01-12T09:00:00.000Z",
    updatedAt: "2026-01-22T09:00:00.000Z"
  }
];

export const seedFrameworks: Framework[] = [
  {
    id: "iso27001",
    name: "ISO 27001",
    description:
      "Information security management system (ISMS) requirements and controls."
  },
  {
    id: "nistcsf",
    name: "NIST CSF",
    description:
      "Cybersecurity Framework functions: Identify, Protect, Detect, Respond, Recover."
  }
];

export const seedControls: Control[] = [
  {
    id: "c-iso-a5-1",
    frameworkId: "iso27001",
    code: "A.5.1",
    title: "Policies for information security",
    description: "Establish and maintain information security policies.",
    mappedRiskIds: ["r-001"]
  },
  {
    id: "c-iso-a8-12",
    frameworkId: "iso27001",
    code: "A.8.12",
    title: "Data backup",
    description: "Implement backup controls and verify backup restoration.",
    mappedRiskIds: ["r-003"]
  },
  {
    id: "c-nist-pr-at",
    frameworkId: "nistcsf",
    code: "PR.AT",
    title: "Awareness and Training",
    description: "Ensure users are trained and aware of cybersecurity risks.",
    mappedRiskIds: ["r-001"]
  },
  {
    id: "c-nist-id-sc",
    frameworkId: "nistcsf",
    code: "ID.SC",
    title: "Supply Chain Risk Management",
    description: "Identify and manage third-party/supply chain risks.",
    mappedRiskIds: ["r-004"]
  }
];

export const seedAudits: Audit[] = [
  {
    id: "a-001",
    title: "ISO 27001 Internal Audit (Q1)",
    scope: "Access control, incident response, awareness training",
    auditors: ["Aisha Bello", "Samuel Okafor"],
    status: "In Progress",
    startDate: "2026-03-01",
    findings: [
      {
        id: "f-001",
        title: "MFA not enforced for some staff accounts",
        description:
          "Several privileged accounts were identified without MFA enabled.",
        severity: "High",
        status: "Open",
        createdAt: "2026-03-10"
      }
    ],
    linkedEvidenceIds: ["e-001"]
  },
  {
    id: "a-002",
    title: "NIST CSF Readiness Review",
    scope: "Baseline mapping for university departments",
    auditors: ["Grace Udo"],
    status: "Planned",
    startDate: "2026-04-01",
    findings: [],
    linkedEvidenceIds: []
  }
];

export const seedEvidence: Evidence[] = [
  {
    id: "e-001",
    fileName: "mfa-access-review.xlsx",
    fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    sizeBytes: 248_120,
    uploadedAt: "2026-03-10T11:12:00.000Z",
    linkedTo: { type: "Audit", id: "a-001" }
  },
  {
    id: "e-002",
    fileName: "backup-restore-test.pdf",
    fileType: "application/pdf",
    sizeBytes: 1_104_901,
    uploadedAt: "2026-02-18T08:40:00.000Z",
    linkedTo: { type: "Control", id: "c-iso-a8-12" }
  }
];

export const seedPolicies: Policy[] = [
  {
    id: "p-001",
    title: "Information Security Policy",
    owner: "CISO Office",
    status: "Active",
    lastReviewedAt: "2026-01-10",
    documentFileName: "info-sec-policy.pdf"
  },
  {
    id: "p-002",
    title: "Acceptable Use Policy",
    owner: "IT Governance",
    status: "Draft",
    lastReviewedAt: "2025-12-20"
  }
];

export const seedTasks: ActionTask[] = [
  {
    id: "t-001",
    title: "Run phishing simulation and training refresh",
    description: "Conduct a simulated phishing campaign and targeted training.",
    assignee: "Security Awareness Lead",
    dueDate: "2026-04-05",
    status: "In Progress",
    linkedRiskId: "r-001"
  },
  {
    id: "t-002",
    title: "Validate backup restoration for research shares",
    description: "Perform restoration test and document results.",
    assignee: "Research Computing",
    dueDate: "2026-03-28",
    status: "Pending",
    linkedRiskId: "r-003"
  }
];

export const seedActivity = () => [
  {
    id: "act-001",
    timestamp: nowIso(),
    type: "AuditCreated",
    title: "Audit created",
    detail: "ISO 27001 Internal Audit (Q1)"
  },
  {
    id: "act-002",
    timestamp: nowIso(),
    type: "EvidenceUploaded",
    title: "Evidence uploaded",
    detail: "backup-restore-test.pdf"
  }
];

