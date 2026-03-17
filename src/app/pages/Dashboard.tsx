import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { DonutChart } from "../../ui/charts/DonutChart";
import { MiniBarChart } from "../../ui/charts/MiniBarChart";
import { useAppData } from "../providers/AppDataProvider";

export const Dashboard = () => {
  const { risks, audits, frameworks, activity } = useAppData();

  const totalRisks = risks.length;
  const highRisks = risks.filter((r) => r.score >= 15).length;
  const mediumRisks = risks.filter((r) => r.score >= 8 && r.score < 15).length;
  const lowRisks = risks.filter((r) => r.score < 8).length;

  const activeAudits = audits.filter((a) => a.status === "In Progress").length;
  const totalAudits = audits.length;

  const riskSlices = [
    { label: "High", value: highRisks, color: "#ef4444" },
    { label: "Medium", value: mediumRisks, color: "#f59e0b" },
    { label: "Low", value: lowRisks, color: "#10b981" }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Risks" value={totalRisks} trend="+2 this week" />
        <StatCard title="High Risks" value={highRisks} trend="Attention needed" trendColor="text-rose-500" />
        <StatCard title="Active Audits" value={activeAudits} trend={`${totalAudits} total`} />
        <StatCard title="Compliance" value="84%" trend="+5% vs last month" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Risk Distribution</CardTitle>
            <Link to="/risks" className="text-xs font-medium text-blue-500 hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-around gap-8 sm:flex-row">
            <div className="relative">
              <DonutChart slices={riskSlices} size={180} stroke={20} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{totalRisks}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Total</span>
              </div>
            </div>
            <div className="space-y-3">
              {riskSlices.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-sm text-slate-300">{s.label}</span>
                  <span className="ml-auto text-sm font-semibold">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Trend</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <MiniBarChart values={[12, 18, 15, 22, 14, 25, 19, 21]} height={80} />
            <div className="mt-4 text-xs text-slate-400">Weekly platform engagement</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activity.slice(0, 5).map((act) => (
                <div key={act.id} className="flex gap-4">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  <div>
                    <div className="text-sm font-medium text-slate-200">{act.title}</div>
                    <div className="text-xs text-slate-400">{act.detail}</div>
                    <div className="mt-1 text-[10px] text-slate-500">
                      {new Date(act.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Compliance Frameworks</CardTitle>
            <Link to="/compliance" className="text-xs font-medium text-blue-500 hover:underline">
              Manage
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {frameworks.map((f) => (
                <div key={f.id} className="flex items-center justify-between rounded-xl border border-slate-800/50 bg-slate-900/20 p-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{f.name}</div>
                    <div className="text-xs text-slate-400">{f.description}</div>
                  </div>
                  <Badge tone={f.id === "iso27001" ? "blue" : "purple"}>Active</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  trend,
  trendColor = "text-slate-400"
}: {
  title: string;
  value: string | number;
  trend: string;
  trendColor?: string;
}) => (
  <Card>
    <CardContent className="pt-6">
      <div className="text-sm font-medium text-slate-400">{title}</div>
      <div className="mt-2 text-3xl font-bold text-white">{value}</div>
      <div className={`mt-2 text-xs ${trendColor}`}>{trend}</div>
    </CardContent>
  </Card>
);
