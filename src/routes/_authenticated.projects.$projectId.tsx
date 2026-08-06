import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download, Upload } from "lucide-react";
import { PageHeader } from "@/components/epms/page-header";
import { PriorityBadge, ProjectStatusBadge, StatusBadge } from "@/components/epms/badges";
import { KanbanBoard } from "@/components/epms/kanban";
import { CreateTaskDialog } from "@/components/epms/create-task-dialog";
import { TaskDetailSheet } from "@/components/epms/task-detail-sheet";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { dataActions } from "@/redux/store";
import { completion, formatDate, initials } from "@/lib/epms-utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/projects/$projectId")({
  head: () => ({
    meta: [
      { title: "Project workspace — EPMS" },
      { name: "description", content: "Project overview with board, sprints, team, documents and task backlog." },
      { property: "og:title", content: "Project workspace — EPMS" },
      { property: "og:description", content: "Board, sprints, team, documents and backlog for a single project." },
    ],
  }),
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { projectId } = Route.useParams();
  const dispatch = useAppDispatch();
  const project = useAppSelector((s) => s.data.projects.find((p) => p.id === projectId));
  const tasks = useAppSelector((s) => s.data.tasks.filter((t) => t.projectId === projectId && !t.deleted));
  const employees = useAppSelector((s) => s.data.employees);
  const sprints = useAppSelector((s) => s.data.sprints.filter((s2) => s2.projectId === projectId));
  const files = useAppSelector((s) => s.data.attachments.filter((a) => a.projectId === projectId));
  const user = useAppSelector((s) => s.auth.user)!;
  const [openTask, setOpenTask] = useState<string | null>(null);

  if (!project) {
    return (
      <div className="surface p-8 text-center">
        <p className="text-sm text-muted-foreground">This project no longer exists.</p>
        <Button asChild className="mt-4" variant="outline"><Link to="/projects">Back to projects</Link></Button>
      </div>
    );
  }

  const manager = employees.find((e) => e.id === project.managerId);
  const members = employees.filter((e) => project.memberIds.includes(e.id));

  return (
    <>
      <Link to="/projects" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> All projects
      </Link>

      <PageHeader
        title={project.name}
        description={project.description}
        actions={
          <>
            <ProjectStatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
            <CreateTaskDialog defaultProjectId={project.id} />
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Info label="Project key" value={project.key} />
        <Info label="Timeline" value={`${formatDate(project.startDate)} – ${formatDate(project.endDate)}`} />
        <Info label="Project manager" value={manager?.name ?? "—"} />
        <div className="surface p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Completion</p>
          <div className="mt-3 flex items-center gap-3">
            <Progress value={completion(tasks)} className="h-1.5" />
            <span className="text-sm font-semibold">{completion(tasks)}%</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="board">
        <TabsList>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="sprints">Sprints</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="files">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="mt-4">
          <KanbanBoard tasks={tasks} onOpenTask={setOpenTask} />
        </TabsContent>

        <TabsContent value="tasks" className="mt-4">
          <div className="surface overflow-x-auto scroll-slim">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead>Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((t) => (
                  <TableRow key={t.id} className="cursor-pointer" onClick={() => setOpenTask(t.id)}>
                    <TableCell className="font-mono text-xs">{t.key}</TableCell>
                    <TableCell className="font-medium">{t.title}</TableCell>
                    <TableCell>{employees.find((e) => e.id === t.assigneeId)?.name ?? "Unassigned"}</TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                    <TableCell><PriorityBadge priority={t.priority} /></TableCell>
                    <TableCell className="text-right text-xs">{t.actualHours}/{t.estimatedHours}h</TableCell>
                    <TableCell className="text-xs">{formatDate(t.dueDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="sprints" className="mt-4 space-y-3">
          {sprints.map((s) => {
            const list = tasks.filter((t) => t.sprintId === s.id);
            return (
              <div key={s.id} className="surface p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.goal}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(s.startDate)} – {formatDate(s.endDate)}</span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Progress value={completion(list)} className="h-1.5" />
                  <span className="text-xs font-semibold">{completion(list)}%</span>
                </div>
              </div>
            );
          })}
          {!sprints.length && <p className="text-sm text-muted-foreground">No sprints planned for this project yet.</p>}
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[manager, ...members].filter(Boolean).map((m) => (
              <div key={m!.id} className="surface flex items-center gap-3 p-4">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-primary text-xs text-primary-foreground">{initials(m!.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{m!.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{m!.title} · {m!.department}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="files" className="mt-4 space-y-3">
          {user.role !== "viewer" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                dispatch(
                  dataActions.addAttachment({
                    name: `${project.key.toLowerCase()}-requirements.pdf`,
                    size: "1.1 MB",
                    type: "pdf",
                    projectId: project.id,
                    uploadedBy: user.id,
                  }),
                );
                dispatch(dataActions.logActivity({ actorId: user.id, action: "uploaded file", target: `${project.key} requirements`, type: "file" }));
                toast.success("Document uploaded");
              }}
            >
              <Upload className="mr-1.5 size-4" /> Upload document
            </Button>
          )}
          <ul className="space-y-2">
            {files.map((f) => (
              <li key={f.id} className="surface flex items-center justify-between p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{f.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {f.size} · uploaded by {employees.find((e) => e.id === f.uploadedBy)?.name} · {formatDate(f.uploadedAt)}
                  </p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => toast.success(`Downloading ${f.name}`)}>
                  <Download className="size-4" />
                </Button>
              </li>
            ))}
            {!files.length && <p className="text-sm text-muted-foreground">No documents attached yet.</p>}
          </ul>
        </TabsContent>
      </Tabs>

      <TaskDetailSheet taskId={openTask} onOpenChange={(open) => !open && setOpenTask(null)} />
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-medium">{value}</p>
    </div>
  );
}