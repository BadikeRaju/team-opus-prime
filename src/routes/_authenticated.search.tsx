import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { z } from "zod";
import { PageHeader } from "@/components/epms/page-header";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/epms/badges";
import { useAppSelector } from "@/redux/hooks";

export const Route = createFileRoute("/_authenticated/search")({
  validateSearch: z.object({ q: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Search — EPMS" },
      { name: "description", content: "Search across projects, tasks, employees and departments in one place." },
      { property: "og:title", content: "Search — EPMS" },
      { property: "og:description", content: "Unified search across projects, tasks, employees and departments." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const [query, setQuery] = useState(q ?? "");
  const { projects, tasks, employees, departments } = useAppSelector((s) => s.data);
  const term = query.trim().toLowerCase();

  const match = (v: string) => term.length > 0 && v.toLowerCase().includes(term);

  const projectHits = projects.filter((p) => match(p.name) || match(p.description));
  const taskHits = tasks.filter((t) => !t.deleted && (match(t.title) || match(t.key)));
  const peopleHits = employees.filter((e) => match(e.name) || match(e.email) || match(e.title));
  const deptHits = departments.filter((d) => match(d.name) || match(d.lead));

  return (
    <>
      <PageHeader title="Search" description="One query across projects, tasks, employees and departments." />

      <div className="relative max-w-xl">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try “billing”, “sprint”, “Priya”…" className="pl-9" />
      </div>

      {!term && <p className="text-sm text-muted-foreground">Start typing to search the workspace.</p>}

      {term && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Section title={`Projects (${projectHits.length})`}>
            {projectHits.map((p) => (
              <li key={p.id} className="py-2.5">
                <Link to="/projects/$projectId" params={{ projectId: p.id }} className="text-sm font-medium hover:text-accent">
                  {p.name}
                </Link>
                <p className="line-clamp-1 text-xs text-muted-foreground">{p.description}</p>
              </li>
            ))}
          </Section>

          <Section title={`Tasks (${taskHits.length})`}>
            {taskHits.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-2 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{t.title}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{t.key}</p>
                </div>
                <StatusBadge status={t.status} />
              </li>
            ))}
          </Section>

          <Section title={`Employees (${peopleHits.length})`}>
            {peopleHits.map((e) => (
              <li key={e.id} className="py-2.5">
                <p className="text-sm font-medium">{e.name}</p>
                <p className="text-xs text-muted-foreground">{e.title} · {e.department}</p>
              </li>
            ))}
          </Section>

          <Section title={`Departments (${deptHits.length})`}>
            {deptHits.map((d) => (
              <li key={d.id} className="py-2.5">
                <p className="text-sm font-medium">{d.name}</p>
                <p className="text-xs text-muted-foreground">Lead: {d.lead}</p>
              </li>
            ))}
          </Section>
        </div>
      )}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="surface p-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      <ul className="divide-y divide-border">{children}</ul>
    </section>
  );
}
