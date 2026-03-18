import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Sidebar } from "./layout/Sidebar";
import { Topbar } from "./layout/Topbar";
import { AppDataProvider } from "./providers/AppDataProvider";
import { AuthProvider, useAuth } from "./providers/AuthProvider";

import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { RiskManagement } from "./pages/RiskManagement";
import { Compliance } from "./pages/Compliance";
import { Audits } from "./pages/Audits";
import { Policies } from "./pages/Policies";
import { Evidence } from "./pages/Evidence";
import { ActionPlans } from "./pages/ActionPlans";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { FrameworksList } from "./pages/FrameworksList";
import { FrameworkDetail } from "./pages/FrameworkDetail";
import { RiskControlMapping } from "./pages/RiskControlMapping";

const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppDataProvider>
      <div className="flex min-h-screen bg-slate-950 text-slate-100">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar onOpenMobileNav={() => setMobileOpen(true)} />
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mx-auto max-w-7xl">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/risks" element={<RiskManagement />} />
                <Route path="/compliance" element={<Compliance />} />
                <Route path="/audits" element={<Audits />} />
                <Route path="/policies" element={<Policies />} />
                <Route path="/evidence" element={<Evidence />} />
                <Route path="/action-plans" element={<ActionPlans />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/frameworks" element={<FrameworksList />} />
                <Route path="/frameworks/risk-mapping" element={<RiskControlMapping />} />
                <Route path="/frameworks/:frameworkId" element={<FrameworkDetail />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </AppDataProvider>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </AuthProvider>
  );
};
