import { useState } from "react";
import { GripVertical } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LabelChip, PriorityBadge } from "./badges";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { dataActions, notificationActions } from "@/redux/store";
import { TASK_STATUSES, type Task, type TaskStatus } from "@/lib/epms-types";
import { formatDate, initials } from "@/lib/epms-utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function KanbanBoard({
  tasks,
  onOpenTask,
}: {
  tasks: Task[];
  onOpenTask: (id: string) => void;
}) {
  const dispatch = useAppDispatch();
  const employees = useAppSelector((s) => s.data.employees);
  const user = useAppSelector((s) => s.auth.user);
  const canDrag = user ? user.role !== "viewer" : false;
  const [dragId, setDragId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<TaskStatus | null>(null);

  const drop = (status: TaskStatus) => {
    setOverColumn(null);
    if (!dragId) return;
    const task = tasks.find((t) => t.id === dragId);
    setDragId(null);
    if (!task || task.status === status) return;
    dispatch(dataActions.moveTask({ id: task.id, status }));
    dispatch(dataActions.logActivity({ actorId: user!.id, action: "updated status", target: `${task.key} → ${status}`, type: "task" }));
    if (status === "completed")
      dispatch(notificationActions.push({ title: "Task completed", body: `${task.key} moved to Completed.`, type: "task_completed" }));
    toast.success(`${task.key} moved to ${TASK_STATUSES.find((s) => s.id === status)?.label}`);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scroll-slim">
      {TASK_STATUSES.map((column) => {
        const items = tasks.filter((t) => t.status === column.id);
        return (
          <section
            key={column.id}
            onDragOver={(e) => {
              if (!canDrag) return;
              e.preventDefault();
              setOverColumn(column.id);
            }}
            onDragLeave={() => setOverColumn((c) => (c === column.id ? null : c))}
            onDrop={() => drop(column.id)}
            className={cn(
              "flex w-72 shrink-0 flex-col rounded-lg border border-border bg-secondary/50 transition-colors",
              overColumn === column.id && "border-accent bg-accent/5",
            )}
          >
            <header className="flex items-center justify-between border-b border-border px-3 py-2.5">
              <h3 className="text-sm font-semibold text-foreground">{column.label}</h3>
              <span className="rounded-full bg-card px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                {items.length}
              </span>
            </header>
            <div className="flex-1 space-y-2 p-2">
              {items.map((task) => {
                const assignee = employees.find((e) => e.id === task.assigneeId);
                return (
                  <article
                    key={task.id}
                    draggable={canDrag}
                    onDragStart={() => setDragId(task.id)}
                    onClick={() => onOpenTask(task.id)}
                    className={cn(
                      "group cursor-pointer rounded-md border border-border bg-card p-3 shadow-card transition-shadow hover:shadow-pop",
                      dragId === task.id && "opacity-50",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-mono text-[11px] font-semibold text-muted-foreground">{task.key}</p>
                      {canDrag && <GripVertical className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />}
                    </div>
                    <p className="mt-1 text-sm font-medium leading-snug text-foreground">{task.title}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <PriorityBadge priority={task.priority} />
                      {task.labels.slice(0, 2).map((l) => (
                        <LabelChip key={l} label={l} />
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">{formatDate(task.dueDate)}</span>
                      <Avatar className="size-6">
                        <AvatarFallback className="bg-primary text-[9px] text-primary-foreground">
                          {assignee ? initials(assignee.name) : "–"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </article>
                );
              })}
              {!items.length && (
                <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                  Drop tasks here
                </p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}