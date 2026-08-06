import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/epms/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { authActions, dataActions } from "@/redux/store";
import { ROLE_LABELS } from "@/lib/epms-types";
import { initials } from "@/lib/epms-utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile & security — EPMS" },
      { name: "description", content: "Update your profile details and change your account password." },
      { property: "og:title", content: "Profile & security — EPMS" },
      { property: "og:description", content: "Profile details and password management." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user)!;
  const [form, setForm] = useState({ name: user.name, email: user.email, title: user.title });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });

  return (
    <>
      <PageHeader title="Profile & security" description="Your identity, department assignment and account password." />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="surface p-5">
          <div className="flex items-center gap-3">
            <Avatar className="size-14">
              <AvatarFallback className="bg-primary text-primary-foreground">{initials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base font-semibold">{user.name}</p>
              <p className="text-xs text-muted-foreground">{ROLE_LABELS[user.role]} · {user.department}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="pf-name">Full name</Label>
              <Input id="pf-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="pf-email">Email</Label>
              <Input id="pf-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="pf-title">Job title</Label>
              <Input id="pf-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <Button
              onClick={() => {
                dispatch(authActions.updateProfile(form));
                dispatch(dataActions.updateEmployee({ id: user.id, changes: form }));
                toast.success("Profile updated");
              }}
            >
              Save profile
            </Button>
          </div>
        </section>

        <section className="surface p-5">
          <h2 className="text-sm font-semibold">Change password</h2>
          <p className="mt-1 text-xs text-muted-foreground">Passwords must be at least 8 characters.</p>
          <div className="mt-5 grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="pw-current">Current password</Label>
              <Input id="pw-current" type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="pw-next">New password</Label>
              <Input id="pw-next" type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="pw-confirm">Confirm new password</Label>
              <Input id="pw-confirm" type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                if (pw.next.length < 8) {
                  toast.error("New password is too short.");
                  return;
                }
                if (pw.next !== pw.confirm) {
                  toast.error("Passwords do not match.");
                  return;
                }
                setPw({ current: "", next: "", confirm: "" });
                toast.success("Password changed");
              }}
            >
              Update password
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
