import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlarmClock,
  CheckCircle2,
  Clock3,
  FolderKanban,
  ListChecks,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/epms/page-header";
import { StatCard } from "@/components/epms/stat-card";
import { PriorityBadge, ProjectStatusBadge, StatusBadge } from "@/components/epms/badges";
import { Progress } from "@/components/ui/progress";
import { useAppSelector } from "@/redux/hooks";
import { ROLE_LABELS, TASK_STATUSES } from "@/lib/epms-types";
import { completion, daysUntil, formatDate, formatHm } from "@/lib/epms-utils";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — EPMS" },
      { name: "description", content: "Role-aware EPMS dashboard: project health, sprint progress, workload and personal task queue." },
      { property: "og:title", content: "Dashboard — EPMS" },
      { property: "og:description", content: "Project health, sprint progress, workload and personal task queue." },
    ],
  }),
  component: DashboardPage,
});

const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user)!;
  const { projects, tasks, employees, sprints, timeLogs } = useAppSelector((s) => s.data);
  const activeTasks = tasks.filter((t) => !t.deleted);

  const isAdmin = user.role === "super_admin" || user.role === "org_admin";
  const isManager = user.role === "manager";

  const statusData = TASK_STATUSES.map((s) => ({
    name: s.label,
    value: activeTasks.filter((t) => t.status === s.id).length,
  }));

  const workload = employees
    .filter((e) => e.role === "developer")
    .map((e) => ({
      name: e.name.split(" ")[0]!,
      assigned: activeTasks.filter((t) => t.assigneeId === e.id && t.status !== "completed").length,
      done: activeTasks.filter((t) => t.assigneeId === e.id && t.status === "completed").length,
    }));

  const burnup = sprints
    .filter((s) => s.projectId)
    .slice(0, 4)
    .map((s) => {
      const list = activeTasks.filter((t) => t.sprintId === s.id);
      return { name: s.name.replace(/^[A-Z]+ /, ""), completion: completion(list) };
    });

  const myTasks = activeTasks.filter((t) => t.assigneeId === user.id);
  const todayMinutes = timeLogs
    .filter((l) => l.employeeId === user.id)
    .reduce((sum, l) => sum + l.minutes, 0);

  const upcoming = [...activeTasks]
    .filter((t) => t.status !== "completed")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 6);

  return (
    <>
      <PageHeader
        title={`${ROLE_LABELS[user.role]} dashboard`}
        description={`Welcome back, ${user.name.split(" ")[0]}. Everything below is scoped to your role and organization.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isAdmin || isManager ? (
          <>
            <StatCard label="Total projects" value={projects.length} hint={`${projects.filter((p) => p.status === "active").length} active`} icon={FolderKanban} />
            <StatCard label="Active employees" value={employees.filter((e) => e.status === "active").length} hint={`${employees.filter((e) => e.status === "invited").length} pending invites`} icon={Users} />
            <StatCard label="Pending tasks" value={activeTasks.filter((t) => t.status !== "completed").length} hint="Across all workflows" icon={ListChecks} />
            <StatCard label="Completed tasks" value={activeTasks.filter((t) => t.status === "completed").length} hint={`${completion(activeTasks)}% overall completion`} icon={CheckCircle2} />
          </>
        ) : (
          <>
            <StatCard label="Assigned tasks" value={myTasks.filter((t) => t.status !== "completed").length} hint="Open in your queue" icon={ListChecks} />
            <StatCard label="Completed" value={myTasks.filter((t) => t.status === "completed").length} hint="Lifetime" icon={CheckCircle2} />
            <StatCard label="Logged time" value={formatHm(todayMinutes)} hint="Recent work logs" icon={Clock3} />
            <StatCard label="Pending reviews" value={myTasks.filter((t) => t.status === "testing").length} hint="Awaiting manager review" icon={AlarmClock} />
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="surface p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold">Sprint completion</h2>
          <p className="mb-4 text-xs text-muted-foreground">Percentage of sprint scope moved to Completed.</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={burnup}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <YAxis unit="%" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)" }} />
                <Line type="monotone" dataKey="completion" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface p-4">
          <h2 className="text-sm font-semibold">Workflow distribution</h2>
          <p className="mb-4 text-xs text-muted-foreground">Tasks per workflow stage.</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {(isAdmin || isManager) && (
        <div className="surface p-4">
          <h2 className="text-sm font-semibold">Team workload</h2>
          <p className="mb-4 text-xs text-muted-foreground">Open vs. completed tasks per developer.</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workload}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="assigned" name="Open" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="done" name="Completed" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="surface p-4">
          <h2 className="text-sm font-semibold">Project health</h2>
          <ul className="mt-4 space-y-4">
            {projects.slice(0, 4).map((p) => {
              const list = activeTasks.filter((t) => t.projectId === p.id);
              const pct = completion(list);
              return (
                <li key={p.id}>
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      to="/projects/$projectId"
                      params={{ projectId: p.id }}
                      className="truncate text-sm font-medium hover:text-accent"
                    >
                      {p.name}
                    </Link>
                    <ProjectStatusBadge status={p.status} />
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <Progress value={pct} className="h-1.5" />
                    <span className="w-10 text-right text-xs font-semibold text-muted-foreground">{pct}%</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="surface p-4">
          <h2 className="text-sm font-semibold">Upcoming deadlines</h2>
          <ul className="mt-3 divide-y divide-border">
            {upcoming.map((t) => {
              const days = daysUntil(t.dueDate);
              return (
                <li key={t.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.key} · {formatDate(t.dueDate)} ·{" "}
                      <span className={days < 0 ? "text-destructive" : days <= 3 ? "text-warning-foreground" : ""}>
                        {days < 0 ? `${Math.abs(days)}d overdue` : `in ${days}d`}
                      </span>
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <PriorityBadge priority={t.priority} />
                    <StatusBadge status={t.status} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}