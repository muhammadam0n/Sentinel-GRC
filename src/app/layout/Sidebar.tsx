import React from "react";
import { NavLink } from "react-router-dom";
import { cx } from "../../lib/utils";
import { Logo } from "../../ui/Logo";

type NavItem = { label: string; to: string };

const items: NavItem[] = [
  { label: "Dashboard", to: "/" },
  { label: "Risk Management", to: "/risks" },
  { label: "Compliance", to: "/compliance" },
  { label: "Frameworks", to: "/frameworks" },
  { label: "Risk Mapping", to: "/frameworks/risk-mapping" },
  { label: "Audits", to: "/audits" },
  { label: "Policies", to: "/policies" },
  { label: "Evidence", to: "/evidence" },
  { label: "Action Plans", to: "/action-plans" },
  { label: "Reports", to: "/reports" },
  { label: "Settings", to: "/settings" }
];

export const Sidebar = ({
  mobileOpen,
  onClose
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cx(
      "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition",
      isActive
        ? "bg-blue-600/15 text-blue-200 ring-1 ring-blue-500/20"
        : "text-slate-300 hover:bg-slate-900 hover:text-slate-100"
    );

  return (
    <>
      <div className="hidden h-screen w-64 shrink-0 border-r border-slate-900/70 bg-slate-950/40 md:block">
        <div className="flex h-full flex-col px-4 py-5">
          <div className="flex items-center justify-between">
            <Logo height={56} maxWidth={260} />
            <div className="rounded-md border border-slate-800/70 bg-slate-950 px-2 py-1 text-xs text-slate-400">
              Phase 1
            </div>
          </div>
          <div className="mt-6 space-y-1">
            {items.map((it) => (
              <NavLink key={it.to} to={it.to} className={navLinkClass} end={it.to === "/"}>
                <span>{it.label}</span>
              </NavLink>
            ))}
          </div>
          <div className="mt-auto rounded-xl border border-slate-800/70 bg-slate-950/70 p-3 text-xs text-slate-400">
            Centralize risks, compliance, audits, policies, and evidence.
          </div>
        </div>
      </div>

      <div
        className={cx(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        role="presentation"
      />
      <div
        className={cx(
          "fixed left-0 top-0 z-50 h-full w-72 border-r border-slate-900/70 bg-slate-950/95 p-4 transition md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <Logo height={56} maxWidth={260} />
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-800/70 bg-slate-950 px-2 py-1 text-xs text-slate-300"
          >
            Close
          </button>
        </div>
        <div className="mt-5 space-y-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={navLinkClass}
              end={it.to === "/"}
              onClick={onClose}
            >
              <span>{it.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};
