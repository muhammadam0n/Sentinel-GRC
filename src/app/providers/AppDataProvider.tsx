import React, { createContext, useContext, useMemo, useState } from "react";
import {
  seedActivity,
  seedAudits,
  seedControls,
  seedEvidence,
  seedFrameworks,
  seedPolicies,
  seedRisks,
  seedTasks
} from "../../domain/mockData";
import type {
  ActionTask,
  ActivityItem,
  Audit,
  AuditFinding,
  Control,
  Evidence,
  Framework,
  Policy,
  Risk
} from "../../domain/types";
import { riskScore } from "../../lib/utils";

type AppData = {
  risks: Risk[];
  frameworks: Framework[];
  controls: Control[];
  audits: Audit[];
  evidence: Evidence[];
  policies: Policy[];
  tasks: ActionTask[];
  activity: ActivityItem[];
  addRisk: (input: Omit<Risk, "id" | "createdAt" | "updatedAt" | "score">) => Risk;
  updateRisk: (id: string, patch: Partial<Risk>) => void;
  mapRiskToControl: (controlId: string, riskId: string, mapped: boolean) => void;
  createAudit: (
    input: Omit<Audit, "id" | "findings" | "linkedEvidenceIds">
  ) => Audit;
  updateAudit: (id: string, patch: Partial<Audit>) => void;
  addFinding: (auditId: string, finding: Omit<AuditFinding, "id" | "createdAt">) => void;
  addEvidence: (file: File, linkedTo?: Evidence["linkedTo"]) => void;
  linkEvidence: (evidenceId: string, linkedTo?: Evidence["linkedTo"]) => void;
  addPolicy: (policy: Omit<Policy, "id">) => void;
  attachPolicyDocument: (policyId: string, file: File) => void;
  addTask: (task: Omit<ActionTask, "id">) => void;
  updateTask: (id: string, patch: Partial<ActionTask>) => void;
};

const AppDataContext = createContext<AppData | null>(null);

const id = (prefix: string) =>
  `${prefix}-${Math.random().toString(16).slice(2, 8)}-${Date.now().toString(16)}`;

export const AppDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [risks, setRisks] = useState<Risk[]>(seedRisks);
  const [frameworks] = useState<Framework[]>(seedFrameworks);
  const [controls, setControls] = useState<Control[]>(seedControls);
  const [audits, setAudits] = useState<Audit[]>(seedAudits);
  const [evidence, setEvidence] = useState<Evidence[]>(seedEvidence);
  const [policies, setPolicies] = useState<Policy[]>(seedPolicies);
  const [tasks, setTasks] = useState<ActionTask[]>(seedTasks);
  const [activity, setActivity] = useState<ActivityItem[]>(seedActivity());

  const api = useMemo<AppData>(
    () => ({
      risks,
      frameworks,
      controls,
      audits,
      evidence,
      policies,
      tasks,
      activity,
      addRisk: (input) => {
        const now = new Date().toISOString();
        const newRisk: Risk = {
          ...input,
          id: id("r"),
          createdAt: now,
          updatedAt: now,
          score: riskScore(input.likelihood, input.impact)
        };
        setRisks((prev) => [newRisk, ...prev]);
        const item: ActivityItem = {
          id: id("act"),
          timestamp: now,
          type: "RiskCreated",
          title: "Risk created",
          detail: newRisk.title
        };
        setActivity((prev) => [item, ...prev]);
        return newRisk;
      },
      updateRisk: (riskId, patch) => {
        const now = new Date().toISOString();
        setRisks((prev) =>
          prev.map((r) => {
            if (r.id !== riskId) return r;
            const next = {
              ...r,
              ...patch,
              updatedAt: now
            };
            const likelihood = next.likelihood ?? r.likelihood;
            const impact = next.impact ?? r.impact;
            return { ...next, score: riskScore(likelihood, impact) };
          })
        );
        const item: ActivityItem = {
          id: id("act"),
          timestamp: now,
          type: "RiskUpdated",
          title: "Risk updated",
          detail: riskId
        };
        setActivity((prev) => [item, ...prev]);
      },
      mapRiskToControl: (controlId, riskId, mapped) => {
        setControls((prev) =>
          prev.map((c) => {
            if (c.id !== controlId) return c;
            const exists = c.mappedRiskIds.includes(riskId);
            const mappedRiskIds = mapped
              ? exists
                ? c.mappedRiskIds
                : [...c.mappedRiskIds, riskId]
              : c.mappedRiskIds.filter((id) => id !== riskId);
            return { ...c, mappedRiskIds };
          })
        );
      },
      createAudit: (input) => {
        const newAudit: Audit = {
          ...input,
          id: id("a"),
          findings: [],
          linkedEvidenceIds: []
        };
        setAudits((prev) => [newAudit, ...prev]);
        const item: ActivityItem = {
          id: id("act"),
          timestamp: new Date().toISOString(),
          type: "AuditCreated",
          title: "Audit created",
          detail: newAudit.title
        };
        setActivity((prev) => [item, ...prev]);
        return newAudit;
      },
      updateAudit: (auditId, patch) => {
        setAudits((prev) => prev.map((a) => (a.id === auditId ? { ...a, ...patch } : a)));
      },
      addFinding: (auditId, finding) => {
        const createdAt = new Date().toISOString().slice(0, 10);
        const newFinding: AuditFinding = { ...finding, id: id("f"), createdAt };
        setAudits((prev) =>
          prev.map((a) =>
            a.id === auditId ? { ...a, findings: [newFinding, ...a.findings] } : a
          )
        );
        const item: ActivityItem = {
          id: id("act"),
          timestamp: new Date().toISOString(),
          type: "FindingAdded",
          title: "Audit finding added",
          detail: newFinding.title
        };
        setActivity((prev) => [item, ...prev]);
      },
      addEvidence: (file, linkedTo) => {
        const uploadedAt = new Date().toISOString();
        const newEvidence: Evidence = {
          id: id("e"),
          fileName: file.name,
          fileType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          uploadedAt,
          linkedTo
        };
        setEvidence((prev) => [newEvidence, ...prev]);
        if (linkedTo?.type === "Audit") {
          setAudits((prev) =>
            prev.map((a) =>
              a.id === linkedTo.id
                ? { ...a, linkedEvidenceIds: [newEvidence.id, ...a.linkedEvidenceIds] }
                : a
            )
          );
        }
        const item: ActivityItem = {
          id: id("act"),
          timestamp: uploadedAt,
          type: "EvidenceUploaded",
          title: "Evidence uploaded",
          detail: file.name
        };
        setActivity((prev) => [item, ...prev]);
      },
      linkEvidence: (evidenceId, linkedTo) => {
        setEvidence((prev) =>
          prev.map((e) => (e.id === evidenceId ? { ...e, linkedTo } : e))
        );
      },
      addPolicy: (policy) => {
        const newPolicy: Policy = { ...policy, id: id("p") };
        setPolicies((prev) => [newPolicy, ...prev]);
        const item: ActivityItem = {
          id: id("act"),
          timestamp: new Date().toISOString(),
          type: "PolicyCreated",
          title: "Policy created",
          detail: newPolicy.title
        };
        setActivity((prev) => [item, ...prev]);
      },
      attachPolicyDocument: (policyId, file) => {
        setPolicies((prev) =>
          prev.map((p) => (p.id === policyId ? { ...p, documentFileName: file.name } : p))
        );
      },
      addTask: (task) => {
        const newTask: ActionTask = { ...task, id: id("t") };
        setTasks((prev) => [newTask, ...prev]);
        const item: ActivityItem = {
          id: id("act"),
          timestamp: new Date().toISOString(),
          type: "TaskCreated",
          title: "Task created",
          detail: newTask.title
        };
        setActivity((prev) => [item, ...prev]);
      },
      updateTask: (taskId, patch) => {
        setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...patch } : t)));
        const item: ActivityItem = {
          id: id("act"),
          timestamp: new Date().toISOString(),
          type: "TaskUpdated",
          title: "Task updated",
          detail: taskId
        };
        setActivity((prev) => [item, ...prev]);
      }
    }),
    [activity, audits, controls, evidence, frameworks, policies, risks, tasks]
  );

  return <AppDataContext.Provider value={api}>{children}</AppDataContext.Provider>;
};

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
};
