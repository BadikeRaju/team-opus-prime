import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { dataActions, notificationActions } from "@/redux/store";
import { TASK_STATUSES, type Priority, type TaskStatus } from "@/lib/epms-types";
import { toast } from "sonner";

export function CreateTaskDialog({ defaultProjectId }: { defaultProjectId?: string }) {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((s) => s.data.projects);
  const employees = useAppSelector((s) => s.data.employees);
  const sprints = useAppSelector((s) => s.data.sprints);
  const user = useAppSelector((s) => s.auth.user);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: defaultProjectId ?? projects[0]?.id ?? "",
    assigneeId: "unassigned",
    priority: "medium" as Priority,
    status: "todo" as TaskStatus,
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    estimatedHours: 8,
    labels: "",
    sprintId: "none",
  });

  if (!user || user.role === "viewer" || user.role === "developer") return null;

  const submit = () => {
    if (!form.title.trim()) return;
    dispatch(
      dataActions.createTask({
        title: form.title.trim(),
        description: form.description.trim() || "No description provided.",
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate,
        assigneeId: form.assigneeId === "unassigned" ? null : form.assigneeId,
        labels: form.labels.split(",").map((l) => l.trim()).filter(Boolean),
        estimatedHours: Number(form.estimatedHours) || 0,
        actualHours: 0,
        projectId: form.projectId,
        sprintId: form.sprintId === "none" ? null : form.sprintId,
      }),
    );
    dispatch(dataActions.logActivity({ actorId: user.id, action: "created task", target: form.title.trim(), type: "task" }));
    if (form.assigneeId !== "unassigned")
      dispatch(notificationActions.push({ title: "Task assigned", body: `${form.title.trim()} assigned to ${employees.find((e) => e.id === form.assigneeId)?.name}.`, type: "task_assigned" }));
    toast.success("Task created");
    setOpen(false);
    setForm({ ...form, title: "", description: "", labels: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1.5 size-4" /> New task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto scroll-slim sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
          <DialogDescription>Tasks enter the workflow at the status you choose.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="task-title">Title</Label>
            <Input id="task-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Implement invoice retry policy" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="task-desc">Description</Label>
            <Textarea id="task-desc" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Project</Label>
              <Select value={form.projectId} onValueChange={(v) => setForm({ ...form, projectId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Sprint</Label>
              <Select value={form.sprintId} onValueChange={(v) => setForm({ ...form, sprintId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Backlog (no sprint)</SelectItem>
                  {sprints.filter((s) => s.projectId === form.projectId).map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Assignee</Label>
              <Select value={form.assigneeId} onValueChange={(v) => setForm({ ...form, assigneeId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Priority })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["low", "medium", "high", "critical"] as Priority[]).map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as TaskStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TASK_STATUSES.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="task-due">Due date</Label>
              <Input id="task-due" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="task-est">Estimated hours</Label>
              <Input id="task-est" type="number" min={0} value={form.estimatedHours} onChange={(e) => setForm({ ...form, estimatedHours: Number(e.target.value) })} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="task-labels">Labels</Label>
              <Input id="task-labels" value={form.labels} onChange={(e) => setForm({ ...form, labels: e.target.value })} placeholder="backend, api" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit}>Create task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}