import { createFileRoute } from "@tanstack/react-router";
import { Building2, Users } from "lucide-react";
import { PageHeader } from "@/components/epms/page-header";
import { useAppSelector } from "@/redux/hooks";
import { formatDate } from "@/lib/epms-utils";

export const Route = createFileRoute("/_authenticated/organizations")({
  head: () => ({
    meta: [
      { title: "Organizations — EPMS" },
      { name: "description", content: "Manage organizations, departments and team structure across the platform." },
      { property: "og:title", content: "Organizations — EPMS" },
      { property: "og:description", content: "Organizations, departments and team structure." },
    ],
  }),
  component: OrganizationsPage,
});

function OrganizationsPage() {
  const { organizations, departments, employees } = useAppSelector((s) => s.data);

  return (
    <>
      <PageHeader title="Organizations" description="Multi-tenant structure: each organization owns its departments, teams and projects." />

      <div className="grid gap-4 md:grid-cols-3">
        {organizations.map((o) => (
          <article key={o.id} className="surface p-4">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary"><Building2 className="size-5" /></span>
            <h2 className="mt-3 text-base font-semibold">{o.name}</h2>
            <p className="text-xs text-muted-foreground">{o.domain} · {o.plan}</p>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div><dt className="text-muted-foreground">Employees</dt><dd className="font-semibold">{o.employees}</dd></div>
              <div><dt className="text-muted-foreground">Projects</dt><dd className="font-semibold">{o.projects}</dd></div>
            </dl>
            <p className="mt-3 text-[11px] text-muted-foreground">Created {formatDate(o.createdAt)}</p>
          </article>
        ))}
      </div>

      <div className="surface p-4">
        <h2 className="text-sm font-semibold">Departments & teams</h2>
        <ul className="mt-3 divide-y divide-border">
          {departments.map((d) => (
            <li key={d.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">{d.name}</p>
                <p className="text-xs text-muted-foreground">Lead: {d.lead}</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="size-3.5" /> {employees.filter((e) => e.department === d.name).length} on platform / {d.headcount} total
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
