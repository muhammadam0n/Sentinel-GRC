import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { Button } from "../../ui/Button";
import { Logo } from "../../ui/Logo";

const titleFromPath = (path: string) => {
  if (path === "/") return "Dashboard";
  const map: Record<string, string> = {
    "/risks": "Risk Management",
    "/compliance": "Compliance",
    "/audits": "Audits",
    "/policies": "Policies",
    "/evidence": "Evidence",
    "/action-plans": "Action Plans",
    "/reports": "Reports",
    "/settings": "Settings"
  };
  const base = `/${path.split("/").filter(Boolean)[0] ?? ""}`;
  return map[base] ?? "Sentinel GRC";
};

export const Topbar = ({ onOpenMobileNav }: { onOpenMobileNav: () => void }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const title = titleFromPath(location.pathname);

  return (
    <div className="sticky top-0 z-20 border-b border-slate-900/70 bg-slate-950/50 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800/70 bg-slate-950 text-slate-200 md:hidden"
            onClick={onOpenMobileNav}
            aria-label="Open navigation"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <Logo height={40} maxWidth={260} className="hidden md:block" />
          <div>
            <div className="text-sm text-slate-400">University Cybersecurity GRC</div>
            <div className="text-base font-semibold text-slate-100">{title}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-end text-right sm:block">
            <div className="text-sm font-medium text-slate-200">{user?.name ?? "User"}</div>
            <div className="text-xs text-slate-400">{user?.email}</div>
          </div>
          <Link to="/settings" className="hidden md:block">
            <Button variant="secondary" size="sm">
              Settings
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={logout}>
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
};
