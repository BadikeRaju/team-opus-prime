import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/epms/page-header";
import { useAppSelector } from "@/redux/hooks";
import { formatDate } from "@/lib/epms-utils";

export const Route = createFileRoute("/_authenticated/activity")({
  head: () => ({
    meta: [
      { title: "Activity log — EPMS" },
      { name: "description", content: "Audit trail of project, task, sprint, file and membership events." },
      { property: "og:title", content: "Activity log — EPMS" },
      { property: "og:description", content: "Audit trail of every workspace event." },
    ],
  }),
  component: ActivityPage,
});

function ActivityPage() {
  const { activity, employees } = useAppSelector((s) => s.data);

  return (
    <>
      <PageHeader title="Activity log" description="Immutable audit trail recorded for every state change in the workspace." />
      <ol className="surface divide-y divide-border">
        {activity.map((a) => (
          <li key={a.id} className="flex items-start gap-3 p-4">
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" />
            <div>
              <p className="text-sm">
                <span className="font-semibold">{employees.find((e) => e.id === a.actorId)?.name ?? "System"}</span>{" "}
                {a.action} <span className="font-medium">{a.target}</span>
              </p>
              <p className="text-xs text-muted-foreground">{formatDate(a.createdAt)} · {a.type}</p>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
