import React, { useState } from "react";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { Input, Label } from "../../ui/Input";
import { Select } from "../../ui/Select";
import { Table, Td, Th } from "../../ui/Table";
import { useAppData } from "../providers/AppDataProvider";
import type { Policy, PolicyStatus } from "../../domain/types";

export const Policies = () => {
  const { policies, addPolicy, attachPolicyDocument } = useAppData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [policyForm, setPolicyForm] = useState<Omit<Policy, "id">>({
    title: "",
    owner: "",
    status: "Draft",
    lastReviewedAt: new Date().toISOString().slice(0, 10)
  });

  const handleAddPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    addPolicy(policyForm);
    setShowAddForm(false);
    setPolicyForm({
      title: "",
      owner: "",
      status: "Draft",
      lastReviewedAt: new Date().toISOString().slice(0, 10)
    });
  };

  const handleDocumentUpload = (policyId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      attachPolicyDocument(policyId, file);
    }
  };

  const getStatusTone = (status: PolicyStatus) => {
    switch (status) {
      case "Active": return "emerald";
      case "Draft": return "amber";
      case "Retired": return "slate";
      default: return "slate";
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Policy Management</h2>
          <p className="text-slate-400">Create, review, and maintain organizational security policies.</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>New Policy</Button>
      </div>

      {showAddForm && (
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader>
            <CardTitle>Create New Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddPolicy} className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title">Policy Title</Label>
                  <Input
                    id="title"
                    value={policyForm.title}
                    onChange={(e) => setPolicyForm({ ...policyForm, title: e.target.value })}
                    placeholder="e.g. Information Security Policy"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="owner">Policy Owner</Label>
                  <Input
                    id="owner"
                    value={policyForm.owner}
                    onChange={(e) => setPolicyForm({ ...policyForm, owner: e.target.value })}
                    placeholder="e.g. CISO"
                    required
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="status">Initial Status</Label>
                  <Select
                    id="status"
                    value={policyForm.status}
                    onChange={(e) => setPolicyForm({ ...policyForm, status: e.target.value as PolicyStatus })}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Retired">Retired</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastReviewed">Last Reviewed At</Label>
                  <Input
                    id="lastReviewed"
                    type="date"
                    value={policyForm.lastReviewedAt}
                    onChange={(e) => setPolicyForm({ ...policyForm, lastReviewedAt: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 md:col-span-2">
                <Button variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button type="submit">Create Policy</Button>
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
                <Th>Owner</Th>
                <Th>Status</Th>
                <Th>Last Reviewed</Th>
                <Th>Document</Th>
                <Th className="text-right">Action</Th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy.id} className="group hover:bg-slate-900/40">
                  <Td className="font-medium text-slate-200">{policy.title}</Td>
                  <Td className="text-slate-400">{policy.owner}</Td>
                  <Td>
                    <Badge tone={getStatusTone(policy.status)}>{policy.status}</Badge>
                  </Td>
                  <Td className="text-xs text-slate-400">{policy.lastReviewedAt}</Td>
                  <Td>
                    {policy.documentFileName ? (
                      <div className="flex items-center gap-2 text-xs text-blue-400">
                        📄 {policy.documentFileName}
                      </div>
                    ) : (
                      <span className="text-[10px] italic text-slate-600">No document attached</span>
                    )}
                  </Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-2">
                      <input
                        type="file"
                        id={`policy-doc-${policy.id}`}
                        className="hidden"
                        onChange={(e) => handleDocumentUpload(policy.id, e)}
                      />
                      <Button
                        as="label"
                        htmlFor={`policy-doc-${policy.id}`}
                        variant="secondary"
                        size="sm"
                        className="cursor-pointer"
                      >
                        Upload
                      </Button>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
