import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCheck } from "lucide-react";
import { PageHeader } from "@/components/epms/page-header";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { notificationActions } from "@/redux/store";
import { formatDate } from "@/lib/epms-utils";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — EPMS" },
      { name: "description", content: "Live notifications for task assignments, completions, comments, sprints and deadlines." },
      { property: "og:title", content: "Notifications — EPMS" },
      { property: "og:description", content: "Assignments, completions, comments, sprints and deadline reminders." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.notifications.items);

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Pushed over a live channel as work changes: assignments, completions, comments, sprint starts and deadline reminders."
        actions={
          <Button size="sm" variant="outline" onClick={() => dispatch(notificationActions.markAllRead())}>
            <CheckCheck className="mr-1.5 size-4" /> Mark all read
          </Button>
        }
      />
      <ul className="space-y-2">
        {items.map((n) => (
          <li
            key={n.id}
            className={cn("surface flex items-start gap-3 p-4", !n.read && "border-accent/40 bg-accent/5")}
          >
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
              <Bell className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{n.title}</p>
              <p className="text-sm text-muted-foreground">{n.body}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{formatDate(n.createdAt)}</p>
            </div>
            {!n.read && (
              <Button size="sm" variant="ghost" onClick={() => dispatch(notificationActions.markRead(n.id))}>
                Mark read
              </Button>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
