import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Pause, Play, Search, Square, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { authActions, dataActions, timerActions } from "@/redux/store";
import { ROLE_LABELS, type Role } from "@/lib/epms-types";
import { formatClock, initials } from "@/lib/epms-utils";
import { toast } from "sonner";

const ROLES: Role[] = ["super_admin", "org_admin", "manager", "developer", "viewer"];

export function TopBar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const timer = useAppSelector((s) => s.timer);
  const task = useAppSelector((s) => s.data.tasks.find((t) => t.id === s.timer.taskId));
  const unread = useAppSelector((s) => s.notifications.items.filter((n) => !n.read).length);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!timer.running) return;
    const id = window.setInterval(() => dispatch(timerActions.tick()), 1000);
    return () => window.clearInterval(id);
  }, [timer.running, dispatch]);

  const stopTimer = () => {
    if (task && user) {
      dispatch(
        dataActions.addTimeLog({
          taskId: task.id,
          employeeId: user.id,
          date: new Date().toISOString().slice(0, 10),
          minutes: Math.max(1, Math.round(timer.elapsedSeconds / 60)),
          note: `Timer session on ${task.key}`,
        }),
      );
      toast.success(`Logged ${Math.max(1, Math.round(timer.elapsedSeconds / 60))}m to ${task.key}`);
    }
    dispatch(timerActions.stop());
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/95 px-3 backdrop-blur md:px-5">
      <SidebarTrigger className="text-muted-foreground" />

      <form
        className="relative hidden max-w-sm flex-1 md:block"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/search", search: { q: query } });
        }}
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects, tasks, people…"
          className="h-9 pl-9"
        />
      </form>

      <div className="flex flex-1 items-center justify-end gap-2">
        {task && (
          <div className="hidden items-center gap-2 rounded-md border border-border bg-secondary px-2.5 py-1.5 sm:flex">
            <span className="font-mono text-xs font-semibold text-primary">{formatClock(timer.elapsedSeconds)}</span>
            <span className="max-w-32 truncate text-xs text-muted-foreground">{task.key}</span>
            <button
              type="button"
              aria-label={timer.running ? "Pause timer" : "Resume timer"}
              onClick={() => dispatch(timer.running ? timerActions.pause() : timerActions.resume())}
              className="text-muted-foreground hover:text-foreground"
            >
              {timer.running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            </button>
            <button
              type="button"
              aria-label="Stop timer and log time"
              onClick={stopTimer}
              className="text-muted-foreground hover:text-destructive"
            >
              <Square className="size-3.5" />
            </button>
          </div>
        )}

        <Button asChild variant="ghost" size="icon" className="relative">
          <Link to="/notifications" aria-label="Notifications">
            <Bell className="size-4" />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
            )}
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5 text-left hover:bg-secondary">
              <Avatar className="size-7">
                <AvatarFallback className="bg-primary text-[11px] text-primary-foreground">
                  {user ? initials(user.name) : "?"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden leading-tight sm:block">
                <span className="block text-xs font-semibold text-foreground">{user?.name}</span>
                <span className="block text-[11px] text-muted-foreground">
                  {user ? ROLE_LABELS[user.role] : ""}
                </span>
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile">
                <User className="mr-2 size-4" /> Profile & password
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Preview role (RBAC demo)
            </DropdownMenuLabel>
            {ROLES.map((role) => (
              <DropdownMenuItem
                key={role}
                onClick={() => {
                  dispatch(authActions.switchRole(role));
                  toast.success(`Viewing as ${ROLE_LABELS[role]}`);
                }}
              >
                {ROLE_LABELS[role]}
                {user?.role === role && <span className="ml-auto text-xs text-accent">current</span>}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                dispatch(authActions.logout());
                navigate({ to: "/", replace: true });
              }}
            >
              <LogOut className="mr-2 size-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}