import { createFileRoute } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { PageHeader } from "@/components/epms/page-header";
import { StatCard } from "@/components/epms/stat-card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { timerActions } from "@/redux/store";
import { formatClock, formatDate, formatHm } from "@/lib/epms-utils";
import { Clock3, Timer, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/timesheet")({
  head: () => ({
    meta: [
      { title: "Time tracking — EPMS" },
      { name: "description", content: "Start, pause and stop task timers and review daily work logs per employee." },
      { property: "og:title", content: "Time tracking — EPMS" },
      { property: "og:description", content: "Task timers and daily work logs." },
    ],
  }),
  component: TimesheetPage,
});

function TimesheetPage() {
  const dispatch = useAppDispatch();
  const { timeLogs, tasks, employees } = useAppSelector((s) => s.data);
  const timer = useAppSelector((s) => s.timer);
  const user = useAppSelector((s) => s.auth.user)!;
  const mine = timeLogs.filter((l) => l.employeeId === user.id);
  const totalAll = timeLogs.reduce((sum, l) => sum + l.minutes, 0);
  const myTasks = tasks.filter((t) => t.assigneeId === user.id && t.status !== "completed" && !t.deleted);

  return (
    <>
      <PageHeader
        title="Time tracking"
        description="One running timer per user. Stopping the timer writes a work log against the task and updates actual hours."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active timer" value={formatClock(timer.elapsedSeconds)} hint={timer.taskId ? (timer.running ? "Running" : "Paused") : "No timer running"} icon={Timer} />
        <StatCard label="My logged time" value={formatHm(mine.reduce((s, l) => s + l.minutes, 0))} hint={`${mine.length} work logs`} icon={Clock3} />
        <StatCard label="Team logged time" value={formatHm(totalAll)} hint="All employees" icon={TrendingUp} />
      </div>

      <div className="surface p-4">
        <h2 className="text-sm font-semibold">Start a timer</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {myTasks.map((t) => (
            <Button key={t.id} size="sm" variant="outline" onClick={() => { dispatch(timerActions.start(t.id)); toast.success(`Timer started on ${t.key}`); }}>
              <Play className="mr-1.5 size-3.5" /> {t.key}
            </Button>
          ))}
          {!myTasks.length && <p className="text-sm text-muted-foreground">No open tasks assigned to you.</p>}
        </div>
      </div>

      <div className="surface overflow-x-auto scroll-slim">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Note</TableHead>
              <TableHead className="text-right">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeLogs.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="text-xs">{formatDate(l.date)}</TableCell>
                <TableCell className="text-xs">{employees.find((e) => e.id === l.employeeId)?.name}</TableCell>
                <TableCell className="font-mono text-xs">{tasks.find((t) => t.id === l.taskId)?.key}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{l.note}</TableCell>
                <TableCell className="text-right text-xs font-semibold">{formatHm(l.minutes)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
