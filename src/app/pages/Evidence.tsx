import React, { useState } from "react";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { Select } from "../../ui/Select";
import { Table, Td, Th } from "../../ui/Table";
import { useAppData } from "../providers/AppDataProvider";
import type { Evidence, EvidenceLinkType } from "../../domain/types";

export const Evidence = () => {
  const { evidence, audits, controls, addEvidence, linkEvidence } = useAppData();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        addEvidence(file);
        setIsUploading(false);
      }, 1000);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileTypeIcon = (type: string) => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("image")) return "🖼️";
    if (type.includes("word") || type.includes("text")) return "📝";
    if (type.includes("excel") || type.includes("spreadsheet")) return "📊";
    return "📁";
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Evidence Management</h2>
          <p className="text-slate-400">Collect, store, and link evidence for audits and compliance controls.</p>
        </div>
        <div className="relative">
          <input
            type="file"
            id="evidence-upload"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <Button
            as="label"
            htmlFor="evidence-upload"
            className="cursor-pointer"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Evidence"}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <thead>
              <tr>
                <Th>File Name</Th>
                <Th>Type</Th>
                <Th>Size</Th>
                <Th>Uploaded At</Th>
                <Th>Linked To</Th>
                <Th className="text-right">Action</Th>
              </tr>
            </thead>
            <tbody>
              {evidence.map((ev) => (
                <tr key={ev.id} className="group hover:bg-slate-900/40">
                  <Td>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getFileTypeIcon(ev.fileType)}</span>
                      <div className="font-medium text-slate-200">{ev.fileName}</div>
                    </div>
                  </Td>
                  <Td className="text-xs text-slate-400">{ev.fileType}</Td>
                  <Td className="text-xs text-slate-400">{formatSize(ev.sizeBytes)}</Td>
                  <Td className="text-xs text-slate-400">{new Date(ev.uploadedAt).toLocaleString()}</Td>
                  <Td>
                    {ev.linkedTo ? (
                      <Badge tone={ev.linkedTo.type === "Audit" ? "blue" : "purple"} className="text-[10px]">
                        {ev.linkedTo.type}: {ev.linkedTo.id}
                      </Badge>
                    ) : (
                      <span className="text-[10px] italic text-slate-600">Not linked</span>
                    )}
                  </Td>
                  <Td className="text-right">
                    <button
                      onClick={() => setSelectedEvidenceId(ev.id)}
                      className="text-xs font-medium text-blue-500 hover:underline"
                    >
                      Manage Link
                    </button>
                  </Td>
                </tr>
              ))}
              {evidence.length === 0 && (
                <tr>
                  <Td colSpan={6} className="py-12 text-center text-slate-500">
                    No evidence uploaded yet. Click "Upload Evidence" to get started.
                  </Td>
                </tr>
              )}
            </tbody>
          </Table>
        </CardContent>
      </Card>

      {selectedEvidenceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md border-slate-800 bg-slate-900 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Link Evidence</CardTitle>
              <button onClick={() => setSelectedEvidenceId(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-xs text-slate-400">
                File: {evidence.find((e) => e.id === selectedEvidenceId)?.fileName}
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Link Type</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => linkEvidence(selectedEvidenceId, { type: "Audit", id: audits[0]?.id })}
                    >
                      Audit
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => linkEvidence(selectedEvidenceId, { type: "Control", id: controls[0]?.id })}
                    >
                      Control
                    </Button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Select Target</Label>
                  <Select
                    onChange={(e) => {
                      const [type, id] = e.target.value.split(":");
                      linkEvidence(selectedEvidenceId, { type: type as EvidenceLinkType, id });
                    }}
                  >
                    <option value="">Select target...</option>
                    <optgroup label="Audits">
                      {audits.map((a) => (
                        <option key={a.id} value={`Audit:${a.id}`}>{a.title}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Controls">
                      {controls.map((c) => (
                        <option key={c.id} value={`Control:${c.id}`}>{c.code}: {c.title}</option>
                      ))}
                    </optgroup>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedEvidenceId(null)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
                >
                  Done
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
