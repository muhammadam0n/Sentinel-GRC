import React, { useState } from "react";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { Select } from "../../ui/Select";
import { Table, Td, Th } from "../../ui/Table";
import { useAppData } from "../providers/AppDataProvider";

type ReportType = "Risk" | "Audit" | "Compliance";

export const Reports = () => {
  const { risks, audits, controls, frameworks } = useAppData();
  const [reportType, setReportType] = useState<ReportType>("Risk");

  const handleExport = () => {
    alert(`Exporting ${reportType} Report as PDF...`);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Reports & Analytics</h2>
          <p className="text-slate-400">Generate and export detailed governance and compliance reports.</p>
        </div>
        <div className="flex gap-3">
          <div className="w-40">
            <Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
            >
              <option value="Risk">Risk Report</option>
              <option value="Audit">Audit Report</option>
              <option value="Compliance">Compliance Report</option>
            </Select>
          </div>
          <Button onClick={handleExport}>Export PDF</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Generated on:</span>
                <span className="text-sm font-medium text-slate-200">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Scope:</span>
                <span className="text-sm font-medium text-slate-200">Organization-wide</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Type:</span>
                <span className="text-sm font-medium text-slate-200">{reportType}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Overall Status</span>
                <Badge tone={reportType === "Risk" ? "rose" : "emerald"} className="px-3">
                  {reportType === "Risk" ? "High Alert" : "Good"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-slate-400 leading-relaxed">
                {reportType === "Risk" && "Risk levels have increased by 12% since the last quarter, primarily in the Data Protection category."}
                {reportType === "Audit" && "Audits are currently on schedule, with a 95% completion rate of findings from the previous cycle."}
                {reportType === "Compliance" && "Current compliance standing is at 84%, showing significant improvement in Access Control domains."}
              </div>
              <div className="text-xs text-blue-400 font-medium hover:underline cursor-pointer">
                Read full analytical breakdown →
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="min-h-[500px]">
            <CardHeader>
              <CardTitle>{reportType} Data Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {reportType === "Risk" && (
                <Table>
                  <thead>
                    <tr>
                      <Th>Risk</Th>
                      <Th>Score</Th>
                      <Th>Category</Th>
                      <Th>Status</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {risks.map((r) => (
                      <tr key={r.id}>
                        <Td className="text-slate-200">{r.title}</Td>
                        <Td>
                          <Badge tone={r.score >= 15 ? "rose" : r.score >= 8 ? "amber" : "emerald"}>
                            {r.score}
                          </Badge>
                        </Td>
                        <Td className="text-xs text-slate-400">{r.category}</Td>
                        <Td className="text-xs text-slate-400">{r.status}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              {reportType === "Audit" && (
                <Table>
                  <thead>
                    <tr>
                      <Th>Audit</Th>
                      <Th>Findings</Th>
                      <Th>Status</Th>
                      <Th>Start Date</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {audits.map((a) => (
                      <tr key={a.id}>
                        <Td className="text-slate-200">{a.title}</Td>
                        <Td className="text-xs text-slate-400">{a.findings.length} findings</Td>
                        <Td>
                          <Badge tone={a.status === "Completed" ? "emerald" : "blue"}>
                            {a.status}
                          </Badge>
                        </Td>
                        <Td className="text-xs text-slate-400">{a.startDate}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              {reportType === "Compliance" && (
                <Table>
                  <thead>
                    <tr>
                      <Th>Framework</Th>
                      <Th>Total Controls</Th>
                      <Th>Mapped Risks</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {frameworks.map((f) => {
                      const frameworkControls = controls.filter((c) => c.frameworkId === f.id);
                      const mappedRisksCount = frameworkControls.reduce((acc, c) => acc + c.mappedRiskIds.length, 0);
                      return (
                        <tr key={f.id}>
                          <Td className="text-slate-200 font-medium">{f.name}</Td>
                          <Td className="text-xs text-slate-400">{frameworkControls.length} controls</Td>
                          <Td className="text-xs text-slate-400">{mappedRisksCount} risks mapped</Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
