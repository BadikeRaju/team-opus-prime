import { cn } from "@/lib/utils";
import type { Priority, TaskStatus } from "@/lib/epms-types";
import { priorityLabel, projectStatusLabel, statusLabel } from "@/lib/epms-utils";

const base =
  "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide";

const priorityTone: Record<Priority, string> = {
  low: "border-border bg-secondary text-muted-foreground",
  medium: "border-accent/25 bg-accent/10 text-accent",
  high: "border-warning/35 bg-warning/15 text-warning-foreground",
  critical: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <span className={cn(base, priorityTone[priority])}>{priorityLabel[priority]}</span>;
}

const statusTone: Record<TaskStatus, string> = {
  backlog: "border-border bg-secondary text-muted-foreground",
  todo: "border-primary/20 bg-primary/8 text-primary",
  in_progress: "border-accent/25 bg-accent/10 text-accent",
  testing: "border-warning/35 bg-warning/15 text-warning-foreground",
  completed: "border-success/30 bg-success/12 text-success",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <span className={cn(base, statusTone[status])}>{statusLabel[status]}</span>;
}

const projectTone: Record<string, string> = {
  planning: "border-primary/20 bg-primary/8 text-primary",
  active: "border-success/30 bg-success/12 text-success",
  on_hold: "border-warning/35 bg-warning/15 text-warning-foreground",
  completed: "border-border bg-secondary text-muted-foreground",
};

export function ProjectStatusBadge({ status }: { status: string }) {
  return <span className={cn(base, projectTone[status])}>{projectStatusLabel[status]}</span>;
}

export function LabelChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      {label}
    </span>
  );
}