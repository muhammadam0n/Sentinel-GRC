import React, { useState } from "react";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { Input, Label, Textarea } from "../../ui/Input";
import { Select } from "../../ui/Select";
import { Table, Td, Th } from "../../ui/Table";
import { useAppData } from "../providers/AppDataProvider";
import type { ActionTask, TaskStatus } from "../../domain/types";

export const ActionPlans = () => {
  const { tasks, risks, addTask, updateTask } = useAppData();
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState<Omit<ActionTask, "id">>({
    title: "",
    description: "",
    assignee: "",
    dueDate: new Date().toISOString().slice(0, 10),
    status: "Pending",
    linkedRiskId: ""
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    addTask(taskForm);
    setShowAddTaskForm(false);
    setTaskForm({
      title: "",
      description: "",
      assignee: "",
      dueDate: new Date().toISOString().slice(0, 10),
      status: "Pending",
      linkedRiskId: ""
    });
  };

  const getStatusTone = (status: TaskStatus) => {
    switch (status) {
      case "Completed": return "emerald";
      case "In Progress": return "blue";
      case "Pending": return "slate";
      default: return "slate";
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && tasks.some((t) => t.dueDate === dueDate && t.status !== "Completed");
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Action Plans</h2>
          <p className="text-slate-400">Track remediation tasks and security improvement projects.</p>
        </div>
        <Button onClick={() => setShowAddTaskForm(true)}>New Task</Button>
      </div>

      {showAddTaskForm && (
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader>
            <CardTitle>Create Remediation Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTask} className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    placeholder="e.g. Implement Multi-Factor Authentication"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Input
                    id="assignee"
                    value={taskForm.assignee}
                    onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })}
                    placeholder="e.g. Security Admin"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="linkedRisk">Linked Risk (Optional)</Label>
                  <Select
                    id="linkedRisk"
                    value={taskForm.linkedRiskId}
                    onChange={(e) => setTaskForm({ ...taskForm, linkedRiskId: e.target.value })}
                  >
                    <option value="">None</option>
                    {risks.map((risk) => (
                      <option key={risk.id} value={risk.id}>{risk.title}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="description">Task Description</Label>
                  <Textarea
                    id="description"
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    placeholder="Describe the remediation steps required..."
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 md:col-span-2">
                <Button variant="ghost" onClick={() => setShowAddTaskForm(false)}>Cancel</Button>
                <Button type="submit">Create Task</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Total Tasks" value={tasks.length} />
        <StatCard title="In Progress" value={tasks.filter((t) => t.status === "In Progress").length} />
        <StatCard title="Completed" value={tasks.filter((t) => t.status === "Completed").length} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <thead>
              <tr>
                <Th>Task Title</Th>
                <Th>Assignee</Th>
                <Th>Due Date</Th>
                <Th>Status</Th>
                <Th>Linked Risk</Th>
                <Th className="text-right">Action</Th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="group hover:bg-slate-900/40">
                  <Td>
                    <div className="font-medium text-slate-200">{task.title}</div>
                    <div className="mt-0.5 text-xs text-slate-400 line-clamp-1">{task.description}</div>
                  </Td>
                  <Td className="text-sm text-slate-400">{task.assignee}</Td>
                  <Td>
                    <div className={`text-xs ${isOverdue(task.dueDate) && task.status !== "Completed" ? "text-rose-500 font-bold" : "text-slate-400"}`}>
                      {task.dueDate}
                      {isOverdue(task.dueDate) && task.status !== "Completed" && " (Overdue)"}
                    </div>
                  </Td>
                  <Td>
                    <Badge tone={getStatusTone(task.status)}>{task.status}</Badge>
                  </Td>
                  <Td>
                    {task.linkedRiskId ? (
                      <div className="text-xs text-blue-400">
                        {risks.find((r) => r.id === task.linkedRiskId)?.title}
                      </div>
                    ) : (
                      <span className="text-[10px] italic text-slate-600">None</span>
                    )}
                  </Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-2">
                      {task.status !== "Completed" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => updateTask(task.id, { status: task.status === "Pending" ? "In Progress" : "Completed" })}
                        >
                          {task.status === "Pending" ? "Start" : "Complete"}
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const StatCard = ({ title, value }: { title: string; value: string | number }) => (
  <Card className="bg-slate-900/20">
    <CardContent className="pt-6">
      <div className="text-sm font-medium text-slate-400">{title}</div>
      <div className="mt-1 text-2xl font-bold text-white">{value}</div>
    </CardContent>
  </Card>
);
