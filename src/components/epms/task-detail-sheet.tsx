import { useState } from "react";
import { Paperclip, Play, Send } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LabelChip, PriorityBadge } from "./badges";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { dataActions, notificationActions, timerActions } from "@/redux/store";
import { TASK_STATUSES, type TaskStatus } from "@/lib/epms-types";
import { formatDate, initials } from "@/lib/epms-utils";
import { toast } from "sonner";

export function TaskDetailSheet({
  taskId,
  onOpenChange,
}: {
  taskId: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  const dispatch = useAppDispatch();
  const task = useAppSelector((s) => s.data.tasks.find((t) => t.id === taskId));
  const employees = useAppSelector((s) => s.data.employees);
  const attachments = useAppSelector((s) => s.data.attachments.filter((a) => a.taskId === taskId));
  const comments = useAppSelector((s) => s.data.comments.filter((c) => c.taskId === taskId));
  const user = useAppSelector((s) => s.auth.user);
  const canEdit = user ? user.role !== "viewer" : false;
  const [draft, setDraft] = useState("");

  const name = (id: string) => employees.find((e) => e.id === id)?.name ?? "Unknown";

  return (
    <Sheet open={Boolean(task)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto scroll-slim sm:max-w-xl">
        {task && (
          <>
            <SheetHeader>
              <SheetDescription className="font-mono text-xs uppercase">{task.key}</SheetDescription>
              <SheetTitle className="text-xl">{task.title}</SheetTitle>
            </SheetHeader>

            <div className="space-y-6 px-4 pb-8">
              <div className="flex flex-wrap items-center gap-2">
                <PriorityBadge priority={task.priority} />
                {task.labels.map((l) => (
                  <LabelChip key={l} label={l} />
                ))}
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">{task.description}</p>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Status">
                  <Select
                    value={task.status}
                    disabled={!canEdit}
                    onValueChange={(v) => {
                      dispatch(dataActions.updateTask({ id: task.id, changes: { status: v as TaskStatus } }));
                      dispatch(dataActions.logActivity({ actorId: user!.id, action: "updated status", target: `${task.key} → ${v}`, type: "task" }));
                      if (v === "completed")
                        dispatch(notificationActions.push({ title: "Task completed", body: `${task.key} moved to Completed.`, type: "task_completed" }));
                    }}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TASK_STATUSES.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Assignee">
                  <Select
                    value={task.assigneeId ?? "unassigned"}
                    disabled={!canEdit}
                    onValueChange={(v) => {
                      dispatch(dataActions.updateTask({ id: task.id, changes: { assigneeId: v === "unassigned" ? null : v } }));
                      if (v !== "unassigned")
                        dispatch(notificationActions.push({ title: "Task assigned", body: `${task.key} assigned to ${name(v)}.`, type: "task_assigned" }));
                    }}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {employees.map((e) => (
                        <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Due date"><p className="text-sm">{formatDate(task.dueDate)}</p></Field>
                <Field label="Hours">
                  <p className="text-sm">
                    {task.actualHours}h logged / {task.estimatedHours}h estimated
                  </p>
                </Field>
              </div>

              {canEdit && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      dispatch(timerActions.start(task.id));
                      toast.success(`Timer started on ${task.key}`);
                    }}
                  >
                    <Play className="mr-1.5 size-3.5" /> Start timer
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      dispatch(
                        dataActions.addAttachment({
                          name: `${task.key.toLowerCase()}-attachment.pdf`,
                          size: "312 KB",
                          type: "pdf",
                          projectId: task.projectId,
                          taskId: task.id,
                          uploadedBy: user!.id,
                        }),
                      );
                      toast.success("File attached to task");
                    }}
                  >
                    <Paperclip className="mr-1.5 size-3.5" /> Attach file
                  </Button>
                </div>
              )}

              {attachments.length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Attachments</h3>
                  <ul className="space-y-1.5">
                    {attachments.map((a) => (
                      <li key={a.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                        <span className="truncate">{a.name}</span>
                        <span className="text-xs text-muted-foreground">{a.size}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Comments ({comments.length})
                </h3>
                <ul className="space-y-3">
                  {comments.map((c) => (
                    <li key={c.id} className={c.parentId ? "ml-8" : ""}>
                      <div className="flex gap-2.5">
                        <Avatar className="size-7">
                          <AvatarFallback className="bg-secondary text-[10px]">{initials(name(c.authorId))}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1 rounded-md border border-border bg-secondary/60 px-3 py-2">
                          <p className="text-xs font-semibold">{name(c.authorId)} <span className="font-normal text-muted-foreground">· {formatDate(c.createdAt)}</span></p>
                          <p className="mt-1 text-sm text-foreground">{c.body}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {canEdit && (
                  <div className="mt-3 space-y-2">
                    <Textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Write a comment. Use @ to mention a teammate…"
                      rows={3}
                    />
                    <Button
                      size="sm"
                      disabled={!draft.trim()}
                      onClick={() => {
                        dispatch(dataActions.addComment({ taskId: task.id, authorId: user!.id, body: draft.trim() }));
                        dispatch(notificationActions.push({ title: "Comment added", body: `${user!.name} commented on ${task.key}.`, type: "comment" }));
                        setDraft("");
                      }}
                    >
                      <Send className="mr-1.5 size-3.5" /> Comment
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border p-3">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}