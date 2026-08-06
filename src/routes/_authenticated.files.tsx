import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, Trash2, Upload } from "lucide-react";
import { PageHeader } from "@/components/epms/page-header";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { dataActions } from "@/redux/store";
import { formatDate } from "@/lib/epms-utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/files")({
  head: () => ({
    meta: [
      { title: "Files — EPMS" },
      { name: "description", content: "Upload, download and manage project documents and task attachments." },
      { property: "og:title", content: "Files — EPMS" },
      { property: "og:description", content: "Project documents and task attachments in one library." },
    ],
  }),
  component: FilesPage,
});

function FilesPage() {
  const dispatch = useAppDispatch();
  const { attachments, projects, employees } = useAppSelector((s) => s.data);
  const user = useAppSelector((s) => s.auth.user)!;
  const canWrite = user.role !== "viewer";

  return (
    <>
      <PageHeader
        title="File management"
        description="Shared document library scoped by project, with task-level attachments."
        actions={
          canWrite ? (
            <Button
              size="sm"
              onClick={() => {
                dispatch(dataActions.addAttachment({ name: "team-upload.pdf", size: "742 KB", type: "pdf", projectId: projects[0]?.id ?? "prj-1", uploadedBy: user.id }));
                dispatch(dataActions.logActivity({ actorId: user.id, action: "uploaded file", target: "team-upload.pdf", type: "file" }));
                toast.success("File uploaded");
              }}
            >
              <Upload className="mr-1.5 size-4" /> Upload file
            </Button>
          ) : undefined
        }
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {attachments.map((a) => (
          <article key={a.id} className="surface flex items-start gap-3 p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
              <FileText className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{a.name}</p>
              <p className="text-xs text-muted-foreground">{projects.find((p) => p.id === a.projectId)?.name ?? "Unassigned project"}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {a.size} · {employees.find((e) => e.id === a.uploadedBy)?.name} · {formatDate(a.uploadedAt)}
              </p>
              <div className="mt-2 flex gap-1">
                <Button size="sm" variant="outline" onClick={() => toast.success(`Downloading ${a.name}`)}>
                  <Download className="mr-1.5 size-3.5" /> Download
                </Button>
                {canWrite && (
                  <Button size="icon" variant="ghost" aria-label="Delete file" onClick={() => { dispatch(dataActions.removeAttachment(a.id)); toast.success("File deleted"); }}>
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
