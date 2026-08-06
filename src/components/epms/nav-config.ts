import {
  Activity,
  Bell,
  Building2,
  FileText,
  FolderKanban,
  Gauge,
  KanbanSquare,
  ListChecks,
  Search,
  Timer,
  Users,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Role } from "@/lib/epms-types";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  roles: Role[];
  group: "Workspace" | "Delivery" | "Administration";
}

const ALL: Role[] = ["super_admin", "org_admin", "manager", "developer", "viewer"];

export const navItems: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: Gauge, roles: ALL, group: "Workspace" },
  { title: "Projects", url: "/projects", icon: FolderKanban, roles: ALL, group: "Workspace" },
  { title: "My Tasks", url: "/tasks", icon: ListChecks, roles: ALL, group: "Workspace" },
  { title: "Search", url: "/search", icon: Search, roles: ALL, group: "Workspace" },
  { title: "Kanban Board", url: "/board", icon: KanbanSquare, roles: ALL, group: "Delivery" },
  { title: "Sprints", url: "/sprints", icon: Zap, roles: ["super_admin", "org_admin", "manager", "developer", "viewer"], group: "Delivery" },
  { title: "Time Tracking", url: "/timesheet", icon: Timer, roles: ["super_admin", "org_admin", "manager", "developer"], group: "Delivery" },
  { title: "Files", url: "/files", icon: FileText, roles: ALL, group: "Delivery" },
  { title: "Reports", url: "/reports", icon: Activity, roles: ["super_admin", "org_admin", "manager"], group: "Administration" },
  { title: "Employees", url: "/employees", icon: Users, roles: ["super_admin", "org_admin", "manager"], group: "Administration" },
  { title: "Organizations", url: "/organizations", icon: Building2, roles: ["super_admin", "org_admin"], group: "Administration" },
  { title: "Activity Log", url: "/activity", icon: Activity, roles: ["super_admin", "org_admin", "manager"], group: "Administration" },
  { title: "Notifications", url: "/notifications", icon: Bell, roles: ALL, group: "Administration" },
];