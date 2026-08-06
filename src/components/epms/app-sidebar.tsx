import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutGrid } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { navItems } from "./nav-config";
import { useAppSelector } from "@/redux/hooks";
import { ROLE_LABELS } from "@/lib/epms-types";

const groups = ["Workspace", "Delivery", "Administration"] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const user = useAppSelector((s) => s.auth.user);
  const unread = useAppSelector((s) => s.notifications.items.filter((n) => !n.read).length);

  const visible = navItems.filter((item) => !user || item.roles.includes(user.role));

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <LayoutGrid className="size-5" />
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-sidebar-accent-foreground">EPMS</p>
              <p className="truncate text-[11px] text-sidebar-foreground">Raju Technologies</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="scroll-slim">
        {groups.map((group) => {
          const items = visible.filter((i) => i.group === group);
          if (!items.length) return null;
          return (
            <SidebarGroup key={group}>
              <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-sidebar-foreground/70">
                {group}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => {
                    const active = pathname === item.url || pathname.startsWith(item.url + "/");
                    return (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                          <Link to={item.url} className="flex items-center gap-2">
                            <item.icon className="size-4" />
                            {!collapsed && <span className="flex-1 truncate">{item.title}</span>}
                            {!collapsed && item.url === "/notifications" && unread > 0 && (
                              <span className="rounded-full bg-sidebar-primary px-1.5 text-[10px] font-bold text-sidebar-primary-foreground">
                                {unread}
                              </span>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      {!collapsed && user && (
        <SidebarFooter className="border-t border-sidebar-border px-3 py-3">
          <p className="text-[11px] uppercase tracking-widest text-sidebar-foreground/60">Signed in as</p>
          <p className="truncate text-sm font-medium text-sidebar-accent-foreground">{user.name}</p>
          <p className="truncate text-[11px] text-sidebar-foreground">{ROLE_LABELS[user.role]}</p>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}