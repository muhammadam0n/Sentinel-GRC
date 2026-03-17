import React from "react";
import { Button } from "../../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { Input, Label } from "../../ui/Input";
import { useAuth } from "../providers/AuthProvider";

export const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Settings</h2>
        <p className="text-slate-400">Manage your account and platform preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input value={user?.name || ""} readOnly disabled />
            </div>
            <div className="space-y-1.5">
              <Label>Email Address</Label>
              <Input value={user?.email || ""} readOnly disabled />
            </div>
            <Button variant="secondary" size="sm">Update Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-200">Email Notifications</div>
                <div className="text-xs text-slate-400">Receive alerts about new risks and audits.</div>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-blue-600" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-200">System Logs</div>
                <div className="text-xs text-slate-400">Keep detailed logs of user activities.</div>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-blue-600" />
            </div>
            <div className="pt-2">
              <Button variant="danger" size="sm">Reset Data</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
