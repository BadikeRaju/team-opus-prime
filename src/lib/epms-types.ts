export type Role = "super_admin" | "org_admin" | "manager" | "developer" | "viewer";

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  org_admin: "Organization Admin",
  manager: "Project Manager",
  developer: "Developer",
  viewer: "Viewer",
};

export type TaskStatus = "backlog" | "todo" | "in_progress" | "testing" | "completed";

export const TASK_STATUSES: { id: TaskStatus; label: string }[] = [
  { id: "backlog", label: "Backlog" },
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "testing", label: "Testing" },
  { id: "completed", label: "Completed" },
];

export type Priority = "low" | "medium" | "high" | "critical";

export interface Organization {
  id: string;
  name: string;
  domain: string;
  plan: string;
  employees: number;
  projects: number;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  orgId: string;
  lead: string;
  headcount: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  title: string;
  orgId: string;
  status: "active" | "invited" | "inactive";
  capacityHours: number;
}

export interface Project {
  id: string;
  key: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: Priority;
  status: "planning" | "active" | "on_hold" | "completed";
  managerId: string;
  memberIds: string[];
  orgId: string;
}

export interface Sprint {
  id: string;
  name: string;
  projectId: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: "planned" | "active" | "completed";
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  body: string;
  createdAt: string;
  parentId?: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  projectId: string;
  taskId?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Task {
  id: string;
  key: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  assigneeId: string | null;
  labels: string[];
  estimatedHours: number;
  actualHours: number;
  projectId: string;
  sprintId: string | null;
  createdAt: string;
  deleted?: boolean;
}

export interface TimeLog {
  id: string;
  taskId: string;
  employeeId: string;
  date: string;
  minutes: number;
  note: string;
}

export interface ActivityLog {
  id: string;
  actorId: string;
  action: string;
  target: string;
  createdAt: string;
  type: "project" | "task" | "file" | "sprint" | "member";
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  type: "task_assigned" | "task_completed" | "comment" | "sprint" | "deadline";
}