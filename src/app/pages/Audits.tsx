import React, { useState } from "react";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { Input, Label, Textarea } from "../../ui/Input";
import { Select } from "../../ui/Select";
import { Table, Td, Th } from "../../ui/Table";
import { useAppData } from "../providers/AppDataProvider";
import type { Audit, AuditFinding, AuditFindingSeverity, AuditStatus } from "../../domain/types";

export const Audits = () => {
  const { audits, createAudit, addFinding } = useAppData();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
  const [showFindingForm, setShowFindingForm] = useState(false);

  const [auditForm, setAuditForm] = useState<Omit<Audit, "id" | "findings" | "linkedEvidenceIds">>({
    title: "",
    scope: "",
    auditors: [],
    status: "Planned",
    startDate: new Date().toISOString().slice(0, 10)
  });

  const [findingForm, setFindingForm] = useState<Omit<AuditFinding, "id" | "createdAt">>({
    title: "",
    description: "",
    severity: "Medium",
    status: "Open"
  });

  const handleCreateAudit = (e: React.FormEvent) => {
    e.preventDefault();
    createAudit(auditForm);
    setShowCreateForm(false);
    setAuditForm({
      title: "",
      scope: "",
      auditors: [],
      status: "Planned",
      startDate: new Date().toISOString().slice(0, 10)
    });
  };

  const handleAddFinding = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAuditId) {
      addFinding(selectedAuditId, findingForm);
      setShowFindingForm(false);
      setFindingForm({
        title: "",
        description: "",
        severity: "Medium",
        status: "Open"
      });
    }
  };

  const getStatusTone = (status: AuditStatus) => {
    switch (status) {
      case "Planned": return "slate";
      case "In Progress": return "blue";
      case "Completed": return "emerald";
      default: return "slate";
    }
  };

  const getSeverityTone = (severity: AuditFindingSeverity) => {
    switch (severity) {
      case "High": return "rose";
      case "Medium": return "amber";
      case "Low": return "blue";
      default: return "slate";
    }
  };

  const selectedAudit = audits.find((a) => a.id === selectedAuditId);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Audit Management</h2>
          <p className="text-slate-400">Plan and execute cybersecurity audits across the organization.</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>New Audit</Button>
      </div>

      {showCreateForm && (
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader>
            <CardTitle>Plan New Audit</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAudit} className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title">Audit Title</Label>
                  <Input
                    id="title"
                    value={auditForm.title}
                    onChange={(e) => setAuditForm({ ...auditForm, title: e.target.value })}
                    placeholder="e.g. Annual IT Infrastructure Audit"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={auditForm.startDate}
                    onChange={(e) => setAuditForm({ ...auditForm, startDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="scope">Audit Scope</Label>
                  <Textarea
                    id="scope"
                    value={auditForm.scope}
                    onChange={(e) => setAuditForm({ ...auditForm, scope: e.target.value })}
                    placeholder="Describe the systems, policies, and departments included in this audit..."
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 md:col-span-2">
                <Button variant="ghost" onClick={() => setShowCreateForm(false)}>Cancel</Button>
                <Button type="submit">Create Audit</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Audits</h3>
          {audits.map((audit) => (
            <button
              key={audit.id}
              onClick={() => setSelectedAuditId(audit.id)}
              className={`w-full text-left rounded-xl border p-4 transition ${
                selectedAuditId === audit.id
                  ? "border-blue-500/40 bg-blue-500/10"
                  : "border-slate-800 bg-slate-900/40 hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge tone={getStatusTone(audit.status)} className="text-[10px]">
                  {audit.status}
                </Badge>
                <span className="text-[10px] text-slate-500">{audit.startDate}</span>
              </div>
              <div className="font-semibold text-slate-100">{audit.title}</div>
              <div className="mt-1 text-xs text-slate-400 line-clamp-2">{audit.scope}</div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedAudit ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedAudit.title}</CardTitle>
                    <div className="text-xs text-slate-400">ID: {selectedAudit.id}</div>
                  </div>
                  <Badge tone={getStatusTone(selectedAudit.status)}>{selectedAudit.status}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Scope</div>
                    <div className="mt-1 text-sm text-slate-300 leading-relaxed">{selectedAudit.scope}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Auditors</div>
                      <div className="mt-1 text-sm text-slate-300">
                        {selectedAudit.auditors.length > 0 ? selectedAudit.auditors.join(", ") : "No auditors assigned"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Dates</div>
                      <div className="mt-1 text-sm text-slate-300">
                        Starts: {selectedAudit.startDate}
                        {selectedAudit.endDate && ` — Ends: ${selectedAudit.endDate}`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Findings</h3>
                  <Button variant="secondary" size="sm" onClick={() => setShowFindingForm(true)}>
                    Add Finding
                  </Button>
                </div>

                {showFindingForm && (
                  <Card className="border-amber-500/20 bg-amber-500/5">
                    <CardHeader>
                      <CardTitle>Record Finding</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddFinding} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1.5">
                            <Label htmlFor="findingTitle">Finding Title</Label>
                            <Input
                              id="findingTitle"
                              value={findingForm.title}
                              onChange={(e) => setFindingForm({ ...findingForm, title: e.target.value })}
                              placeholder="e.g. Password complexity not enforced"
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="severity">Severity</Label>
                            <Select
                              id="severity"
                              value={findingForm.severity}
                              onChange={(e) => setFindingForm({ ...findingForm, severity: e.target.value as AuditFindingSeverity })}
                            >
                              <option value="High">High</option>
                              <option value="Medium">Medium</option>
                              <option value="Low">Low</option>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="findingDesc">Description</Label>
                          <Textarea
                            id="findingDesc"
                            value={findingForm.description}
                            onChange={(e) => setFindingForm({ ...findingForm, description: e.target.value })}
                            placeholder="Detail the discovery and associated risks..."
                            required
                          />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                          <Button variant="ghost" size="sm" onClick={() => setShowFindingForm(false)}>Cancel</Button>
                          <Button type="submit" size="sm">Save Finding</Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-3">
                  {selectedAudit.findings.length > 0 ? (
                    selectedAudit.findings.map((finding) => (
                      <Card key={finding.id} className="border-slate-800/50">
                        <CardContent className="flex items-start gap-4 p-4">
                          <div className="mt-1">
                            <Badge tone={getSeverityTone(finding.severity)}>{finding.severity}</Badge>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-semibold text-slate-200">{finding.title}</div>
                              <div className="text-[10px] text-slate-500">{finding.createdAt}</div>
                            </div>
                            <div className="mt-1 text-sm text-slate-400">{finding.description}</div>
                            <div className="mt-2 flex items-center gap-2">
                              <Badge tone={finding.status === "Resolved" ? "emerald" : "amber"} className="text-[10px]">
                                {finding.status}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-slate-500">
                      No findings recorded for this audit yet.
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-800 text-slate-500">
              Select an audit from the list to view details and findings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
