import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { KeyRound, LayoutGrid, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { authActions } from "@/redux/store";
import { ROLE_LABELS, type Role } from "@/lib/epms-types";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — EPMS Enterprise Project Management" },
      {
        name: "description",
        content:
          "Sign in to EPMS to manage organizations, projects, sprints, Kanban delivery, timesheets and team analytics with role-based access.",
      },
      { property: "og:title", content: "Sign in — EPMS Enterprise Project Management" },
      {
        property: "og:description",
        content: "Role-based workspace for projects, sprints, tasks, time tracking and reporting.",
      },
    ],
  }),
  component: AuthPage,
});

const demoRoles: Role[] = ["super_admin", "org_admin", "manager", "developer", "viewer"];

function AuthPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const employees = useAppSelector((s) => s.data.employees);
  const user = useAppSelector((s) => s.auth.user);
  const [email, setEmail] = useState("samuel@northwind.io");
  const [password, setPassword] = useState("epms-demo");
  const [pending, setPending] = useState(false);
  const [mode, setMode] = useState("login");

  useEffect(() => {
    if (user) navigate({ to: "/dashboard", replace: true });
  }, [user, navigate]);

  const signIn = (role?: Role) => {
    const account = role
      ? employees.find((e) => e.role === role)
      : employees.find((e) => e.email.toLowerCase() === email.trim().toLowerCase());
    if (!account) {
      toast.error("No account matches that email in this organization.");
      return;
    }
    setPending(true);
    window.setTimeout(() => {
      dispatch(authActions.login(account));
      setPending(false);
      toast.success(`Signed in as ${account.name}`);
      navigate({ to: "/dashboard" });
    }, 450);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-md bg-accent">
            <LayoutGrid className="size-5" />
          </span>
          <div>
            <p className="font-display text-lg font-semibold">EPMS</p>
            <p className="text-xs text-primary-foreground/70">Enterprise Project Management System</p>
          </div>
        </div>

        <div className="max-w-lg">
          <h1 className="font-display text-4xl font-semibold leading-tight">
            One workspace for every project, sprint and hour your organization delivers.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/75">
            Multi-organization structure, role-based access control, sprint planning, Kanban delivery,
            timesheets, document sharing and productivity analytics.
          </p>
          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-primary-foreground/15 pt-6">
            {[
              ["5", "user roles"],
              ["14", "modules"],
              ["Real-time", "notifications"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-2xl font-semibold">{value}</dt>
                <dd className="text-xs text-primary-foreground/70">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="flex items-center gap-2 text-xs text-primary-foreground/60">
          <ShieldCheck className="size-4" /> JWT session handling with role-scoped permissions
        </p>
      </section>

      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <LayoutGrid className="size-5" />
            </span>
            <p className="font-display text-lg font-semibold">EPMS</p>
          </div>

          <Tabs value={mode} onValueChange={setMode}>
            <TabsList className="w-full">
              <TabsTrigger value="login" className="flex-1">Sign in</TabsTrigger>
              <TabsTrigger value="register" className="flex-1">Register</TabsTrigger>
              <TabsTrigger value="forgot" className="flex-1">Reset</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6 space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Welcome back</h2>
                <p className="mt-1 text-sm text-muted-foreground">Use a demo account below or any seeded email.</p>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="email">Work email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button className="w-full" disabled={pending} onClick={() => signIn()}>
                {pending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <KeyRound className="mr-2 size-4" />}
                Sign in
              </Button>

              <div className="rounded-lg border border-border bg-card p-3">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Sign in as a role
                </p>
                <div className="flex flex-wrap gap-2">
                  {demoRoles.map((role) => (
                    <Button key={role} variant="outline" size="sm" onClick={() => signIn(role)}>
                      {ROLE_LABELS[role]}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="register" className="mt-6 space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Create your account</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  New organizations start on a 14-day enterprise trial.
                </p>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="reg-name">Full name</Label>
                <Input id="reg-name" placeholder="Jordan Ellis" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="reg-org">Organization</Label>
                <Input id="reg-org" placeholder="Northwind Technologies" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="reg-email">Work email</Label>
                <Input id="reg-email" type="email" placeholder="jordan@company.com" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="reg-password">Password</Label>
                <Input id="reg-password" type="password" />
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  toast.success("Registration submitted — check your inbox to verify.");
                  setMode("login");
                }}
              >
                Register organization
              </Button>
            </TabsContent>

            <TabsContent value="forgot" className="mt-6 space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Reset your password</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  We'll email a signed reset link valid for 30 minutes.
                </p>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="forgot-email">Work email</Label>
                <Input id="forgot-email" type="email" placeholder="you@company.com" />
              </div>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => toast.success("Reset link sent if the account exists.")}
              >
                Send reset link
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
