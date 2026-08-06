import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Zap } from "lucide-react";
import { PageHeader } from "@/components/epms/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { dataActions, notificationActions } from "@/redux/store";
import { completion, formatDate } from "@/lib/epms-utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/sprints")({
  head: () => ({
    meta: [
      { title: "Sprints — EPMS" },
      { name: "description", content: "Plan sprints with goals, durations and live completion percentages per project." },
      { property: "og:title", content: "Sprints — EPMS" },
      { property: "og:description", content: "Sprint goals, durations and completion tracking." },
    ],
  }),
  component: SprintsPage,
});

function SprintsPage() {
  const dispatch = useAppDispatch();
  const { sprints, projects, tasks } = useAppSelector((s) => s.data);
  const user = useAppSelector((s) => s.auth.user)!;
  const canManage = user.role === "manager" || user.role === "org_admin" || user.role === "super_admin";

  return (
    <>
      <PageHeader
        title="Sprint management"
        description="Time-boxed delivery cycles with a goal, a duration and a measured completion rate."
        actions={canManage ? <CreateSprintDialog /> : undefined}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {sprints.map((s) => {
          const list = tasks.filter((t) => t.sprintId === s.id && !t.deleted);
          const project = projects.find((p) => p.id === s.projectId);
          return (
            <article key={s.id} className="surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{project?.name}</p>
                  <h2 className="text-base font-semibold">{s.name}</h2>
                </div>
                <span className="rounded-md border border-border bg-secondary px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {s.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{s.goal}</p>
              <p className="mt-3 text-xs text-muted-foreground">{formatDate(s.startDate)} – {formatDate(s.endDate)} · {list.length} tasks</p>
              <div className="mt-3 flex items-center gap-3">
                <Progress value={completion(list)} className="h-1.5" />
                <span className="text-xs font-semibold">{completion(list)}%</span>
              </div>
              {canManage && s.status === "planned" && (
                <Button
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    dispatch(dataActions.updateSprint({ id: s.id, changes: { status: "active" } }));
                    dispatch(dataActions.logActivity({ actorId: user.id, action: "started sprint", target: s.name, type: "sprint" }));
                    dispatch(notificationActions.push({ title: "Sprint started", body: `${s.name} is now active.`, type: "sprint" }));
                    toast.success("Sprint started");
                  }}
                >
                  <Zap className="mr-1.5 size-4" /> Start sprint
                </Button>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}

function CreateSprintDialog() {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((s) => s.data.projects);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    goal: "",
    projectId: projects[0]?.id ?? "",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="mr-1.5 size-4" /> New sprint</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>Create sprint</DialogTitle></DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="s-name">Sprint name</Label>
            <Input id="s-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="APX Sprint 15" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="s-goal">Sprint goal</Label>
            <Textarea id="s-goal" rows={2} value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} />
          </div>
          <div className="grid gap-1.5">
            <Label>Project</Label>
            <Select value={form.projectId} onValueChange={(v) => setForm({ ...form, projectId: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="s-start">Start</Label>
              <Input id="s-start" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="s-end">End</Label>
              <Input id="s-end" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (!form.name.trim()) return;
              dispatch(dataActions.createSprint({ ...form, status: "planned" }));
              toast.success("Sprint created");
              setOpen(false);
            }}
          >
            Create sprint
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
