import React, { useState } from "react";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { Input, Label, Textarea } from "../../ui/Input";
import { Select } from "../../ui/Select";
import { Table, Td, Th } from "../../ui/Table";
import { useAppData } from "../providers/AppDataProvider";
import type { Impact, Likelihood, Risk, RiskCategory, RiskStatus } from "../../domain/types";

export const RiskManagement = () => {
  const { risks, addRisk, updateRisk } = useAppData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);

  const [formData, setFormData] = useState<Omit<Risk, "id" | "createdAt" | "updatedAt" | "score">>({
    title: "",
    description: "",
    category: "Data Protection",
    owner: "",
    likelihood: 3,
    impact: 3,
    status: "Open"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRisk(formData);
    setShowAddForm(false);
    setFormData({
      title: "",
      description: "",
      category: "Data Protection",
      owner: "",
      likelihood: 3,
      impact: 3,
      status: "Open"
    });
  };

  const getStatusTone = (status: RiskStatus) => {
    switch (status) {
      case "Open": return "rose";
      case "Mitigated": return "blue";
      case "Accepted": return "amber";
      case "Closed": return "slate";
      default: return "slate";
    }
  };

  const getScoreTone = (score: number) => {
    if (score >= 15) return "rose";
    if (score >= 8) return "amber";
    return "emerald";
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Risk Management</h2>
          <p className="text-slate-400">Identify, assess, and monitor organizational risks.</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>Add New Risk</Button>
      </div>

      {showAddForm && (
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader>
            <CardTitle>Add New Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title">Risk Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Unauthorized Database Access"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as RiskCategory })}
                  >
                    <option value="Access Control">Access Control</option>
                    <option value="Network Security">Network Security</option>
                    <option value="Data Protection">Data Protection</option>
                    <option value="Third-Party">Third-Party</option>
                    <option value="Human Factors">Human Factors</option>
                    <option value="Incident Response">Incident Response</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="owner">Risk Owner</Label>
                  <Input
                    id="owner"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    placeholder="e.g. IT Security Team"
                    required
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="likelihood">Likelihood (1-5)</Label>
                    <Select
                      id="likelihood"
                      value={formData.likelihood}
                      onChange={(e) => setFormData({ ...formData, likelihood: parseInt(e.target.value) as Likelihood })}
                    >
                      {[1, 2, 3, 4, 5].map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="impact">Impact (1-5)</Label>
                    <Select
                      id="impact"
                      value={formData.impact}
                      onChange={(e) => setFormData({ ...formData, impact: parseInt(e.target.value) as Impact })}
                    >
                      {[1, 2, 3, 4, 5].map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the risk and potential impact..."
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 md:col-span-2">
                <Button variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button type="submit">Create Risk</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <thead>
              <tr>
                <Th>Title</Th>
                <Th>Category</Th>
                <Th>Owner</Th>
                <Th>Score</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {risks.map((risk) => (
                <tr key={risk.id} className="group hover:bg-slate-900/40">
                  <Td className="font-medium text-slate-200">{risk.title}</Td>
                  <Td className="text-slate-400">{risk.category}</Td>
                  <Td className="text-slate-400">{risk.owner}</Td>
                  <Td>
                    <Badge tone={getScoreTone(risk.score)}>{risk.score}</Badge>
                  </Td>
                  <Td>
                    <Badge tone={getStatusTone(risk.status)}>{risk.status}</Badge>
                  </Td>
                  <Td className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedRisk(risk)}>
                      Details
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>

      {selectedRisk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-2xl border-slate-800 bg-slate-900 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Risk Detail: {selectedRisk.title}</CardTitle>
              <button onClick={() => setSelectedRisk(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</div>
                  <div className="mt-1">
                    <Badge tone={getStatusTone(selectedRisk.status)}>{selectedRisk.status}</Badge>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Risk Score</div>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge tone={getScoreTone(selectedRisk.score)}>{selectedRisk.score}</Badge>
                    <span className="text-xs text-slate-400">
                      (Likelihood: {selectedRisk.likelihood} × Impact: {selectedRisk.impact})
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category</div>
                  <div className="mt-1 text-sm text-slate-200">{selectedRisk.category}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Owner</div>
                  <div className="mt-1 text-sm text-slate-200">{selectedRisk.owner}</div>
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Description</div>
                <div className="mt-1 text-sm text-slate-300 leading-relaxed">{selectedRisk.description}</div>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800 pt-6">
                <div className="text-[10px] text-slate-500">
                  Last updated: {new Date(selectedRisk.updatedAt).toLocaleString()}
                </div>
                <div className="flex gap-2">
                  {selectedRisk.status === "Open" && (
                    <Button variant="secondary" size="sm" onClick={() => { updateRisk(selectedRisk.id, { status: "Mitigated" }); setSelectedRisk(null); }}>
                      Mitigate
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setSelectedRisk(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
