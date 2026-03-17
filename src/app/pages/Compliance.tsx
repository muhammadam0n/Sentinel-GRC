import React, { useState } from "react";
import { Badge } from "../../ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { Select } from "../../ui/Select";
import { Table, Td, Th } from "../../ui/Table";
import { useAppData } from "../providers/AppDataProvider";
import type { FrameworkId, Risk } from "../../domain/types";

export const Compliance = () => {
  const { frameworks, controls, risks, mapRiskToControl } = useAppData();
  const [selectedFrameworkId, setSelectedFrameworkId] = useState<FrameworkId>("iso27001");
  const [mappingRiskForControlId, setMappingRiskForControlId] = useState<string | null>(null);

  const selectedFramework = frameworks.find((f) => f.id === selectedFrameworkId);
  const frameworkControls = controls.filter((c) => c.frameworkId === selectedFrameworkId);

  const handleMapRisk = (controlId: string, riskId: string, mapped: boolean) => {
    mapRiskToControl(controlId, riskId, mapped);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Compliance Frameworks</h2>
          <p className="text-slate-400">Manage security controls and map them to risks.</p>
        </div>
        <div className="w-full max-w-xs">
          <Select
            value={selectedFrameworkId}
            onChange={(e) => setSelectedFrameworkId(e.target.value as FrameworkId)}
          >
            {frameworks.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </Select>
        </div>
      </div>

      {selectedFramework && (
        <Card className="border-slate-800 bg-slate-900/40">
          <CardHeader>
            <CardTitle>{selectedFramework.name}</CardTitle>
            <div className="mt-1 text-sm text-slate-400">{selectedFramework.description}</div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <thead>
                <tr>
                  <Th className="w-24">Code</Th>
                  <Th>Control Title</Th>
                  <Th>Mapped Risks</Th>
                  <Th className="text-right">Action</Th>
                </tr>
              </thead>
              <tbody>
                {frameworkControls.map((control) => (
                  <tr key={control.id} className="group hover:bg-slate-900/40">
                    <Td className="font-mono text-xs text-blue-400">{control.code}</Td>
                    <Td>
                      <div className="font-medium text-slate-200">{control.title}</div>
                      <div className="mt-0.5 text-xs text-slate-400 line-clamp-1">{control.description}</div>
                    </Td>
                    <Td>
                      <div className="flex flex-wrap gap-1.5">
                        {control.mappedRiskIds.length > 0 ? (
                          control.mappedRiskIds.map((riskId) => {
                            const risk = risks.find((r) => r.id === riskId);
                            return (
                              <Badge key={riskId} tone="blue" className="text-[10px]">
                                {risk?.title || "Unknown Risk"}
                              </Badge>
                            );
                          })
                        ) : (
                          <span className="text-xs italic text-slate-500">No risks mapped</span>
                        )}
                      </div>
                    </Td>
                    <Td className="text-right">
                      <button
                        onClick={() => setMappingRiskForControlId(control.id)}
                        className="text-xs font-medium text-blue-500 hover:underline"
                      >
                        Manage Mapping
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardContent>
        </Card>
      )}

      {mappingRiskForControlId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg border-slate-800 bg-slate-900 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Map Risks to Control</CardTitle>
              <button onClick={() => setMappingRiskForControlId(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-xs text-slate-400">
                Control: {controls.find((c) => c.id === mappingRiskForControlId)?.title}
              </div>
              <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-2 space-y-1">
                {risks.map((risk) => {
                  const isMapped = controls
                    .find((c) => c.id === mappingRiskForControlId)
                    ?.mappedRiskIds.includes(risk.id);
                  return (
                    <label
                      key={risk.id}
                      className="flex items-center gap-3 rounded-md px-3 py-2 transition hover:bg-slate-900 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isMapped}
                        onChange={(e) => handleMapRisk(mappingRiskForControlId, risk.id, e.target.checked)}
                        className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-200">{risk.title}</div>
                        <div className="text-[10px] text-slate-500">{risk.category}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setMappingRiskForControlId(null)}
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
