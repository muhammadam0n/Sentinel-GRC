import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { Input, Label } from "../../ui/Input";
import { apiGet } from "../../lib/api";
import type { Framework } from "../../domain/frameworks";

export const FrameworksList = () => {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setError("");
        const data = await apiGet<Framework[]>("/frameworks");
        if (!alive) return;
        setFrameworks(data);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? "Failed to load frameworks");
      } finally {
        if (!alive) return;
        setIsLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return frameworks;
    return frameworks.filter((f) => `${f.name} ${f.version}`.toLowerCase().includes(q));
  }, [frameworks, query]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Frameworks</h2>
          <p className="text-slate-400">Browse and expand compliance frameworks dynamically.</p>
        </div>
        <div className="w-full max-w-md space-y-1.5">
          <Label>Search</Label>
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ISO, NIST, GDPR..." />
        </div>
      </div>

      {error && (
        <Card className="border-rose-500/20 bg-rose-500/10">
          <CardContent className="p-4 text-sm text-rose-200">{error}</CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <Card key={idx} className="border-slate-800 bg-slate-900/40">
                <CardHeader>
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-800/70" />
                  <div className="mt-2 h-3 w-24 animate-pulse rounded bg-slate-800/50" />
                </CardHeader>
                <CardContent>
                  <div className="h-3 w-full animate-pulse rounded bg-slate-800/40" />
                </CardContent>
              </Card>
            ))
          : filtered.map((f) => (
              <Link key={f.id} to={`/frameworks/${f.id}`} className="block">
                <Card className="h-full border-slate-800 bg-slate-900/40 transition hover:border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-3">
                      <span>{f.name}</span>
                      <span className="rounded-full border border-slate-800 bg-slate-950 px-2 py-0.5 text-xs font-medium text-slate-300">
                        {f.version}
                      </span>
                    </CardTitle>
                    {f.description && <div className="text-sm text-slate-400">{f.description}</div>}
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-slate-400">Open to view domains, controls, and sub-controls.</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>

      {!isLoading && filtered.length === 0 && (
        <div className="text-sm text-slate-400">No frameworks found.</div>
      )}
    </div>
  );
};

