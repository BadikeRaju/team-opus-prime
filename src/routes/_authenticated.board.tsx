import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/epms/page-header";
import { KanbanBoard } from "@/components/epms/kanban";
import { CreateTaskDialog } from "@/components/epms/create-task-dialog";
import { TaskDetailSheet } from "@/components/epms/task-detail-sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppSelector } from "@/redux/hooks";

export const Route = createFileRoute("/_authenticated/board")({
  head: () => ({
    meta: [
      { title: "Kanban board — EPMS" },
      { name: "description", content: "Drag-and-drop Kanban board moving tasks from Backlog through To Do, In Progress, Testing and Completed." },
      { property: "og:title", content: "Kanban board — EPMS" },
      { property: "og:description", content: "Drag tasks across the delivery workflow with live progress tracking." },
    ],
  }),
  component: BoardPage,
});

function BoardPage() {
  const { projects, tasks, sprints } = useAppSelector((s) => s.data);
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [sprintId, setSprintId] = useState("all");
  const [openTask, setOpenTask] = useState<string | null>(null);

  const projectSprints = sprints.filter((s) => s.projectId === projectId);
  const visible = tasks.filter(
    (t) => !t.deleted && t.projectId === projectId && (sprintId === "all" || t.sprintId === sprintId),
  );

  return (
    <>
      <PageHeader
        title="Kanban board"
        description="Drag cards between columns to move work through the delivery workflow. Status changes notify the team instantly."
        actions={
          <>
            <Select value={projectId} onValueChange={(v) => { setProjectId(v); setSprintId("all"); }}>
              <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sprintId} onValueChange={setSprintId}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sprints</SelectItem>
                {projectSprints.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <CreateTaskDialog defaultProjectId={projectId} />
          </>
        }
      />
      <KanbanBoard tasks={visible} onOpenTask={setOpenTask} />
      <TaskDetailSheet taskId={openTask} onOpenChange={(open) => !open && setOpenTask(null)} />
    </>
  );
}