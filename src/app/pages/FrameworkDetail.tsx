import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { apiGet } from "../../lib/api";
import type { FrameworkTree } from "../../domain/frameworks";

const Details = ({
  title,
  right,
  defaultOpen,
  children
}: {
  title: React.ReactNode;
  right?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) => (
  <details
    className="group rounded-xl border border-slate-800/70 bg-slate-950/40"
    open={defaultOpen}
  >
    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-200">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        {right}
        <span className="text-slate-500 transition group-open:rotate-90">›</span>
      </div>
    </summary>
    <div className="border-t border-slate-800/70 px-4 py-3">{children}</div>
  </details>
);

export const FrameworkDetail = () => {
  const params = useParams();
  const frameworkId = Number(params.frameworkId);
  const [tree, setTree] = useState<FrameworkTree | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!Number.isFinite(frameworkId)) {
      setIsLoading(false);
      setError("Invalid framework id");
      return;
    }

    let alive = true;
    (async () => {
      try {
        setError("");
        const data = await apiGet<FrameworkTree>(`/frameworks/${frameworkId}/tree`);
        if (!alive) return;
        setTree(data);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? "Failed to load framework");
      } finally {
        if (!alive) return;
        setIsLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [frameworkId]);

  const summary = useMemo(() => {
    if (!tree) return null;
    const domains = tree.domains.length;
    const controls = tree.domains.reduce((sum, d) => sum + d.controls.length, 0);
    const subControls = tree.domains.reduce(
      (sum, d) => sum + d.controls.reduce((s2, c) => s2 + c.sub_controls.length, 0),
      0
    );
    return { domains, controls, subControls };
  }, [tree]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link to="/frameworks" className="text-sm text-blue-400 hover:underline">
              Frameworks
            </Link>
            <span className="text-xs text-slate-600">/</span>
            <span className="text-sm text-slate-300">Detail</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
            {tree?.name ?? (isLoading ? "Loading..." : "Framework")}
          </h2>
          {tree?.description && <p className="mt-1 text-slate-400">{tree.description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {tree && (
            <Badge tone="slate" className="text-[10px]">
              Version {tree.version}
            </Badge>
          )}
          <Link to="/frameworks/risk-mapping">
            <Button variant="secondary" size="sm">
              Risk Mapping
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <Card className="border-rose-500/20 bg-rose-500/10">
          <CardContent className="p-4 text-sm text-rose-200">{error}</CardContent>
        </Card>
      )}

      {tree && summary && (
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue" className="text-[10px]">{`${summary.domains} domains`}</Badge>
          <Badge tone="amber" className="text-[10px]">{`${summary.controls} controls`}</Badge>
          <Badge tone="emerald" className="text-[10px]">{`${summary.subControls} sub-controls`}</Badge>
        </div>
      )}

      {isLoading && (
        <Card className="border-slate-800 bg-slate-900/40">
          <CardHeader>
            <CardTitle>Loading hierarchy</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-400">Fetching domains and controls…</CardContent>
        </Card>
      )}

      {tree && (
        <div className="space-y-4">
          {tree.domains.map((d, domainIdx) => (
            <Details
              key={d.id}
              title={d.name}
              right={<Badge tone="slate" className="text-[10px]">{`${d.controls.length} controls`}</Badge>}
              defaultOpen={domainIdx === 0}
            >
              {d.description && <div className="mb-3 text-sm text-slate-400">{d.description}</div>}
              <div className="space-y-3">
                {d.controls.map((c) => (
                  <Details
                    key={c.id}
                    title={
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-blue-300">{c.control_code}</span>
                        <span className="text-sm font-semibold text-slate-200">{c.title}</span>
                      </div>
                    }
                    right={
                      <Badge tone="slate" className="text-[10px]">{`${c.sub_controls.length} sub`}</Badge>
                    }
                  >
                    {c.description && <div className="mb-3 text-sm text-slate-400">{c.description}</div>}
                    {c.sub_controls.length > 0 ? (
                      <ul className="space-y-2">
                        {c.sub_controls.map((s) => (
                          <li
                            key={s.id}
                            className="rounded-lg border border-slate-800/70 bg-slate-950/40 px-3 py-2 text-sm text-slate-300"
                          >
                            {s.description}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm italic text-slate-500">No sub-controls defined.</div>
                    )}
                  </Details>
                ))}
                {d.controls.length === 0 && (
                  <div className="text-sm italic text-slate-500">No controls defined.</div>
                )}
              </div>
            </Details>
          ))}
          {tree.domains.length === 0 && (
            <div className="text-sm italic text-slate-500">No domains defined.</div>
          )}
        </div>
      )}
    </div>
  );
};

