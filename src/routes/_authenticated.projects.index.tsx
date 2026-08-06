import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpDown, Plus, Search, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/epms/page-header";
import { PriorityBadge, ProjectStatusBadge } from "@/components/epms/badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { dataActions } from "@/redux/store";
import type { Priority, Project } from "@/lib/epms-types";
import { completion, formatDate, initials } from "@/lib/epms-utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — EPMS" },
      { name: "description", content: "Browse, filter and sort every project with owners, timelines, priority and completion." },
      { property: "og:title", content: "Projects — EPMS" },
      { property: "og:description", content: "Project portfolio with owners, timelines, priority and completion." },
    ],
  }),
  component: ProjectsPage,
});

const PAGE_SIZE = 4;

function ProjectsPage() {
  const dispatch = useAppDispatch();
  const { projects, tasks, employees } = useAppSelector((s) => s.data);
  const user = useAppSelector((s) => s.auth.user)!;
  const canManage = user.role === "super_admin" || user.role === "org_admin";

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<"name" | "endDate" | "priority">("endDate");
  const [page, setPage] = useState(1);

  const priorityRank: Record<Priority, number> = { critical: 0, high: 1, medium: 2, low: 3 };

  const filtered = useMemo(() => {
    const list = projects.filter(
      (p) =>
        (status === "all" || p.status === status) &&
        (p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())),
    );
    return [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "priority") return priorityRank[a.priority] - priorityRank[b.priority];
      return a.endDate.localeCompare(b.endDate);
    });
  }, [projects, query, status, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <PageHeader
        title="Projects"
        description="Every project in the organization with its manager, team, schedule and delivery progress."
        actions={canManage ? <CreateProjectDialog /> : undefined}
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Filter projects…"
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on_hold">On hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
          <SelectTrigger className="w-44">
            <ArrowUpDown className="mr-1.5 size-3.5 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="endDate">Sort: end date</SelectItem>
            <SelectItem value="name">Sort: name</SelectItem>
            <SelectItem value="priority">Sort: priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {visible.map((project) => {
          const list = tasks.filter((t) => t.projectId === project.id && !t.deleted);
          const manager = employees.find((e) => e.id === project.managerId);
          const members = employees.filter((e) => project.memberIds.includes(e.id));
          return (
            <article key={project.id} className="surface flex flex-col p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[11px] font-semibold text-muted-foreground">{project.key}</p>
                  <Link
                    to="/projects/$projectId"
                    params={{ projectId: project.id }}
                    className="block truncate text-base font-semibold hover:text-accent"
                  >
                    {project.name}
                  </Link>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <ProjectStatusBadge status={project.status} />
                  <PriorityBadge priority={project.priority} />
                </div>
              </div>

              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <dt className="text-muted-foreground">Manager</dt>
                  <dd className="font-medium">{manager?.name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Timeline</dt>
                  <dd className="font-medium">{formatDate(project.startDate)} – {formatDate(project.endDate)}</dd>
                </div>
              </dl>

              <div className="mt-4 flex items-center gap-3">
                <Progress value={completion(list)} className="h-1.5" />
                <span className="w-10 text-right text-xs font-semibold text-muted-foreground">{completion(list)}%</span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <div className="flex -space-x-2">
                  {members.slice(0, 5).map((m) => (
                    <Avatar key={m.id} className="size-7 border-2 border-card">
                      <AvatarFallback className="bg-secondary text-[10px]">{initials(m.name)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{list.length} tasks</span>
                  {canManage && (
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Delete ${project.name}`}
                      onClick={() => {
                        dispatch(dataActions.deleteProject(project.id));
                        toast.success("Project archived");
                      }}
                    >
                      <Trash2 className="size-4 text-muted-foreground" />
                    </Button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing {visible.length} of {filtered.length} projects
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span className="text-xs text-muted-foreground">Page {page} / {pageCount}</span>
          <Button variant="outline" size="sm" disabled={page >= pageCount} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>
    </>
  );
}

function CreateProjectDialog() {
  const dispatch = useAppDispatch();
  const employees = useAppSelector((s) => s.data.employees);
  const user = useAppSelector((s) => s.auth.user)!;
  const managers = employees.filter((e) => e.role === "manager");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<Project, "id">>({
    key: "NEW",
    name: "",
    description: "",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10),
    priority: "medium",
    status: "planning",
    managerId: managers[0]?.id ?? "",
    memberIds: [],
    orgId: "org-1",
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="mr-1.5 size-4" /> New project</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto scroll-slim sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>Assign a project manager and delivery window.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="p-name">Name</Label>
            <Input id="p-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nimbus Reporting Service" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="p-key">Project key</Label>
            <Input id="p-key" value={form.key} maxLength={4} onChange={(e) => setForm({ ...form, key: e.target.value.toUpperCase() })} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="p-desc">Description</Label>
            <Textarea id="p-desc" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="p-start">Start date</Label>
              <Input id="p-start" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="p-end">End date</Label>
              <Input id="p-end" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
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
              <Label>Project manager</Label>
              <Select value={form.managerId} onValueChange={(v) => setForm({ ...form, managerId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {managers.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (!form.name.trim()) return;
              dispatch(dataActions.createProject(form));
              dispatch(dataActions.logActivity({ actorId: user.id, action: "created project", target: form.name, type: "project" }));
              toast.success("Project created");
              setOpen(false);
            }}
          >
            Create project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}