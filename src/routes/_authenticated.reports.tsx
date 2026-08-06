import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/epms/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppSelector } from "@/redux/hooks";
import { completion, formatHm } from "@/lib/epms-utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [
      { title: "Reports — EPMS" },
      { name: "description", content: "Employee, project, sprint and productivity reports generated from live workspace data." },
      { property: "og:title", content: "Reports — EPMS" },
      { property: "og:description", content: "Employee, project, sprint and productivity reporting." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const { employees, projects, sprints, tasks, timeLogs } = useAppSelector((s) => s.data);
  const active = tasks.filter((t) => !t.deleted);

  const employeeRows = employees
    .filter((e) => e.role === "developer" || e.role === "manager")
    .map((e) => {
      const assigned = active.filter((t) => t.assigneeId === e.id);
      const minutes = timeLogs.filter((l) => l.employeeId === e.id).reduce((s, l) => s + l.minutes, 0);
      return {
        name: e.name,
        department: e.department,
        assigned: assigned.length,
        completed: assigned.filter((t) => t.status === "completed").length,
        logged: minutes,
        productivity: assigned.length ? Math.round((assigned.filter((t) => t.status === "completed").length / assigned.length) * 100) : 0,
      };
    });

  return (
    <>
      <PageHeader
        title="Reports"
        description="Exportable reporting across people, projects, sprints and productivity."
        actions={
          <Button size="sm" variant="outline" onClick={() => toast.success("Report queued for export")}>
            <Download className="mr-1.5 size-4" /> Export CSV
          </Button>
        }
      />

      <Tabs defaultValue="employee">
        <TabsList>
          <TabsTrigger value="employee">Employee</TabsTrigger>
          <TabsTrigger value="project">Project</TabsTrigger>
          <TabsTrigger value="sprint">Sprint</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
        </TabsList>

        <TabsContent value="employee" className="mt-4">
          <div className="surface overflow-x-auto scroll-slim">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Assigned</TableHead>
                  <TableHead className="text-right">Completed</TableHead>
                  <TableHead className="text-right">Logged</TableHead>
                  <TableHead className="text-right">Completion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeRows.map((r) => (
                  <TableRow key={r.name}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="text-xs">{r.department}</TableCell>
                    <TableCell className="text-right">{r.assigned}</TableCell>
                    <TableCell className="text-right">{r.completed}</TableCell>
                    <TableCell className="text-right text-xs">{formatHm(r.logged)}</TableCell>
                    <TableCell className="text-right font-semibold">{r.productivity}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="project" className="mt-4">
          <div className="surface overflow-x-auto scroll-slim">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Tasks</TableHead>
                  <TableHead className="text-right">Estimated</TableHead>
                  <TableHead className="text-right">Actual</TableHead>
                  <TableHead className="text-right">Completion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((p) => {
                  const list = active.filter((t) => t.projectId === p.id);
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-xs capitalize">{p.status.replace("_", " ")}</TableCell>
                      <TableCell className="text-right">{list.length}</TableCell>
                      <TableCell className="text-right">{list.reduce((s, t) => s + t.estimatedHours, 0)}h</TableCell>
                      <TableCell className="text-right">{list.reduce((s, t) => s + t.actualHours, 0)}h</TableCell>
                      <TableCell className="text-right font-semibold">{completion(list)}%</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="sprint" className="mt-4">
          <div className="surface p-4">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sprints.map((s) => {
                  const list = active.filter((t) => t.sprintId === s.id);
                  return { name: s.name, completion: completion(list), tasks: list.length };
                })}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)" }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="completion" name="Completion %" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="tasks" name="Tasks" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="productivity" className="mt-4">
          <div className="surface p-4">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={employeeRows.map((r) => ({ name: r.name.split(" ")[0], hours: Math.round(r.logged / 60), completed: r.completed }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)" }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="hours" name="Hours logged" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" name="Tasks completed" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
