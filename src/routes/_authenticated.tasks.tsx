import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Play, RotateCcw, Search, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/epms/page-header";
import { PriorityBadge, StatusBadge } from "@/components/epms/badges";
import { CreateTaskDialog } from "@/components/epms/create-task-dialog";
import { TaskDetailSheet } from "@/components/epms/task-detail-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { dataActions, timerActions } from "@/redux/store";
import { TASK_STATUSES } from "@/lib/epms-types";
import { formatDate } from "@/lib/epms-utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/tasks")({
  head: () => ({
    meta: [
      { title: "My tasks — EPMS" },
      { name: "description", content: "Filter, sort and update your assigned tasks, log time and restore soft-deleted items." },
      { property: "og:title", content: "My tasks — EPMS" },
      { property: "og:description", content: "Your task queue with status updates, timers and soft delete." },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const dispatch = useAppDispatch();
  const { tasks, projects, employees } = useAppSelector((s) => s.data);
  const user = useAppSelector((s) => s.auth.user)!;
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [scope, setScope] = useState(user.role === "developer" ? "mine" : "all");
  const [showDeleted, setShowDeleted] = useState(false);
  const [openTask, setOpenTask] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      tasks.filter(
        (t) =>
          Boolean(t.deleted) === showDeleted &&
          (status === "all" || t.status === status) &&
          (scope === "all" || t.assigneeId === user.id) &&
          (t.title.toLowerCase().includes(query.toLowerCase()) ||
            t.key.toLowerCase().includes(query.toLowerCase())),
      ),
    [tasks, status, scope, query, showDeleted, user.id],
  );

  return (
    <>
      <PageHeader
        title={scope === "mine" ? "My tasks" : "All tasks"}
        description="Every task carries priority, labels, estimates and actual hours. Deleting is reversible — soft-deleted tasks stay recoverable."
        actions={<CreateTaskDialog />}
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title or key…" className="pl-9" />
        </div>
        <Select value={scope} onValueChange={setScope}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="mine">Assigned to me</SelectItem>
            <SelectItem value="all">All assignees</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {TASK_STATUSES.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
          <Switch id="deleted" checked={showDeleted} onCheckedChange={setShowDeleted} />
          <Label htmlFor="deleted" className="text-xs">Recycle bin</Label>
        </div>
      </div>

      <div className="surface overflow-x-auto scroll-slim">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-mono text-xs">{t.key}</TableCell>
                <TableCell>
                  <button className="text-left font-medium hover:text-accent" onClick={() => setOpenTask(t.id)}>
                    {t.title}
                  </button>
                </TableCell>
                <TableCell className="text-xs">{projects.find((p) => p.id === t.projectId)?.name}</TableCell>
                <TableCell className="text-xs">{employees.find((e) => e.id === t.assigneeId)?.name ?? "Unassigned"}</TableCell>
                <TableCell><StatusBadge status={t.status} /></TableCell>
                <TableCell><PriorityBadge priority={t.priority} /></TableCell>
                <TableCell className="text-xs">{formatDate(t.dueDate)}</TableCell>
                <TableCell className="text-right">
                  {showDeleted ? (
                    <Button size="sm" variant="ghost" onClick={() => { dispatch(dataActions.restoreTask(t.id)); toast.success("Task restored"); }}>
                      <RotateCcw className="size-4" />
                    </Button>
                  ) : (
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" aria-label="Start timer" onClick={() => { dispatch(timerActions.start(t.id)); toast.success(`Timer started on ${t.key}`); }}>
                        <Play className="size-4" />
                      </Button>
                      {user.role !== "viewer" && user.role !== "developer" && (
                        <Button size="icon" variant="ghost" aria-label="Delete task" onClick={() => { dispatch(dataActions.softDeleteTask(t.id)); toast.success("Task moved to recycle bin"); }}>
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {!rows.length && (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                  No tasks match these filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TaskDetailSheet taskId={openTask} onOpenChange={(open) => !open && setOpenTask(null)} />
    </>
  );
}