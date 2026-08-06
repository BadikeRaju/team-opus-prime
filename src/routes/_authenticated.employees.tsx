import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/epms/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { dataActions } from "@/redux/store";
import { ROLE_LABELS, type Role } from "@/lib/epms-types";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/employees")({
  head: () => ({
    meta: [
      { title: "Employee directory — EPMS" },
      { name: "description", content: "Employee directory with departments, titles, roles and invitation status." },
      { property: "og:title", content: "Employee directory — EPMS" },
      { property: "og:description", content: "Departments, titles, roles and invitation status." },
    ],
  }),
  component: EmployeesPage,
});

function EmployeesPage() {
  const dispatch = useAppDispatch();
  const { employees, departments } = useAppSelector((s) => s.data);
  const user = useAppSelector((s) => s.auth.user)!;
  const canManage = user.role === "org_admin" || user.role === "super_admin";
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("all");

  const rows = employees.filter(
    (e) =>
      (dept === "all" || e.department === dept) &&
      (e.name.toLowerCase().includes(query.toLowerCase()) || e.email.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <>
      <PageHeader
        title="Employee directory"
        description="People across departments and teams, with the role that governs their permissions."
        actions={
          canManage ? (
            <Button
              size="sm"
              onClick={() => {
                dispatch(dataActions.inviteEmployee({ name: "New Teammate", email: `invite${employees.length + 1}@rajutech.in`, role: "developer", department: departments[0]?.name ?? "Platform Engineering", title: "Engineer", orgId: "org-1", status: "invited", capacityHours: 40 }));
                toast.success("Invitation sent");
              }}
            >
              <UserPlus className="mr-1.5 size-4" /> Invite employee
            </Button>
          ) : undefined
        }
      />

      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search employees…" className="pl-9" />
        </div>
        <Select value={dept} onValueChange={setDept}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>
            {departments.map((d) => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="surface overflow-x-auto scroll-slim">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">{e.name}</TableCell>
                <TableCell className="text-xs">{e.email}</TableCell>
                <TableCell className="text-xs">{e.department}</TableCell>
                <TableCell className="text-xs">{e.title}</TableCell>
                <TableCell>
                  {canManage ? (
                    <Select value={e.role} onValueChange={(v) => { dispatch(dataActions.updateEmployee({ id: e.id, changes: { role: v as Role } })); toast.success("Role updated"); }}>
                      <SelectTrigger className="h-8 w-44 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(Object.keys(ROLE_LABELS) as Role[]).map((r) => <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-xs">{ROLE_LABELS[e.role]}</span>
                  )}
                </TableCell>
                <TableCell className="text-xs capitalize">{e.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
