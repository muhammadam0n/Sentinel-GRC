import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { Label, Input } from "../../ui/Input";
import { Select } from "../../ui/Select";
import { apiGet, apiSend } from "../../lib/api";
import type { ControlWithSubControls, Framework, FrameworkTree, Risk } from "../../domain/frameworks";

const flattenControls = (tree: FrameworkTree | null) => {
  if (!tree) return [];
  const out: Array<{ control: ControlWithSubControls; domainName: string; frameworkName: string }> = [];
  for (const d of tree.domains) {
    for (const c of d.controls) out.push({ control: c, domainName: d.name, frameworkName: tree.name });
  }
  return out;
};

export const RiskControlMapping = () => {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [selectedFrameworkId, setSelectedFrameworkId] = useState<number | null>(null);
  const [tree, setTree] = useState<FrameworkTree | null>(null);

  const [risks, setRisks] = useState<Risk[]>([]);
  const [selectedRiskId, setSelectedRiskId] = useState<number | null>(null);
  const [mappedControlIds, setMappedControlIds] = useState<Set<number>>(new Set());

  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setError("");
        const [fw, r] = await Promise.all([apiGet<Framework[]>("/frameworks"), apiGet<Risk[]>("/risks")]);
        if (!alive) return;
        setFrameworks(fw);
        setRisks(r);
        setSelectedFrameworkId(fw[0]?.id ?? null);
        setSelectedRiskId(r[0]?.id ?? null);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? "Failed to load data");
      } finally {
        if (!alive) return;
        setIsLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedFrameworkId) return;
    let alive = true;
    (async () => {
      try {
        const t = await apiGet<FrameworkTree>(`/frameworks/${selectedFrameworkId}/tree`);
        if (!alive) return;
        setTree(t);
      } catch (e: any) {
        if (!alive) return;
        setTree(null);
        setError(e?.message ?? "Failed to load framework hierarchy");
      }
    })();
    return () => {
      alive = false;
    };
  }, [selectedFrameworkId]);

  useEffect(() => {
    if (!selectedRiskId) return;
    let alive = true;
    (async () => {
      try {
        const mapped = await apiGet<Array<{ id: number }>>(`/risks/${selectedRiskId}/controls`);
        if (!alive) return;
        setMappedControlIds(new Set(mapped.map((c) => c.id)));
      } catch (e: any) {
        if (!alive) return;
        setMappedControlIds(new Set());
        setError(e?.message ?? "Failed to load mapped controls");
      }
    })();
    return () => {
      alive = false;
    };
  }, [selectedRiskId]);

  const controls = useMemo(() => flattenControls(tree), [tree]);

  const visibleControls = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return controls;
    return controls.filter(({ control, domainName }) => {
      const hay = `${control.control_code} ${control.title} ${domainName}`.toLowerCase();
      return hay.includes(q);
    });
  }, [controls, filter]);

  const selectedRisk = risks.find((r) => r.id === selectedRiskId) ?? null;

  const toggle = async (controlId: number, next: boolean) => {
    if (!selectedRiskId) return;
    setError("");
    try {
      if (next) {
        await apiSend(`/risks/${selectedRiskId}/controls/${controlId}`, "POST");
        setMappedControlIds((prev) => new Set(prev).add(controlId));
      } else {
        await apiSend(`/risks/${selectedRiskId}/controls/${controlId}`, "DELETE");
        setMappedControlIds((prev) => {
          const n = new Set(prev);
          n.delete(controlId);
          return n;
        });
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to update mapping");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Risk Mapping</h2>
          <p className="text-slate-400">Map risks to controls across any framework.</p>
        </div>
        <div className="grid w-full gap-4 lg:max-w-3xl lg:grid-cols-3">
          <div className="space-y-1.5">
            <Label>Framework</Label>
            <Select
              value={selectedFrameworkId ?? ""}
              onChange={(e) => setSelectedFrameworkId(e.target.value ? Number(e.target.value) : null)}
            >
              {frameworks.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.version})
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Risk</Label>
            <Select
              value={selectedRiskId ?? ""}
              onChange={(e) => setSelectedRiskId(e.target.value ? Number(e.target.value) : null)}
            >
              {risks.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Filter controls</Label>
            <Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search code/title..." />
          </div>
        </div>
      </div>

      {error && (
        <Card className="border-rose-500/20 bg-rose-500/10">
          <CardContent className="p-4 text-sm text-rose-200">{error}</CardContent>
        </Card>
      )}

      {isLoading ? (
        <Card className="border-slate-800 bg-slate-900/40">
          <CardHeader>
            <CardTitle>Loading</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-400">Fetching frameworks and risks…</CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-slate-800 bg-slate-900/40 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Controls</CardTitle>
              <Badge tone="slate" className="text-[10px]">
                {mappedControlIds.size} mapped
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              {visibleControls.map(({ control, domainName }) => {
                const checked = mappedControlIds.has(control.id);
                return (
                  <label
                    key={control.id}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-800/60 bg-slate-950/40 px-3 py-2 transition hover:border-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => toggle(control.id, e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-blue-300">{control.control_code}</span>
                        <span className="text-sm font-semibold text-slate-200">{control.title}</span>
                        <Badge tone="slate" className="text-[10px]">
                          {domainName}
                        </Badge>
                      </div>
                      {control.description && (
                        <div className="mt-1 text-xs text-slate-400 line-clamp-2">{control.description}</div>
                      )}
                      {control.sub_controls.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {control.sub_controls.slice(0, 2).map((s) => (
                            <div key={s.id} className="text-[11px] text-slate-500">
                              - {s.description}
                            </div>
                          ))}
                          {control.sub_controls.length > 2 && (
                            <div className="text-[11px] text-slate-600">{`+${control.sub_controls.length - 2} more`}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}

              {visibleControls.length === 0 && (
                <div className="text-sm italic text-slate-500">No controls match this filter.</div>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/40">
            <CardHeader>
              <CardTitle>Selected Risk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedRisk ? (
                <>
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{selectedRisk.title}</div>
                    {selectedRisk.category && <div className="text-xs text-slate-500">{selectedRisk.category}</div>}
                  </div>
                  {selectedRisk.description && (
                    <div className="text-sm text-slate-400">{selectedRisk.description}</div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {selectedRisk.score != null && (
                      <Badge tone="amber" className="text-[10px]">{`Score ${selectedRisk.score}`}</Badge>
                    )}
                    {selectedRisk.status && (
                      <Badge tone="slate" className="text-[10px]">{`${selectedRisk.status}`}</Badge>
                    )}
                  </div>
                  <div className="pt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setMappedControlIds(new Set())}
                      disabled
                    >
                      Clear all
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-sm text-slate-400">No risk selected.</div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

