import type {
  ActivityLog,
  Attachment,
  Comment,
  Department,
  Employee,
  Notification,
  Organization,
  Project,
  Sprint,
  Task,
  TimeLog,
} from "./epms-types";

const day = (offset: number) => {
  const d = new Date(2026, 6, 20 + offset);
  return d.toISOString().slice(0, 10);
};

export const organizations: Organization[] = [
  { id: "org-1", name: "Raju Technologies", domain: "rajutech.in", plan: "Enterprise", employees: 148, projects: 12, createdAt: "2023-04-11" },
  { id: "org-2", name: "Helios Analytics", domain: "helios.dev", plan: "Business", employees: 64, projects: 7, createdAt: "2024-01-22" },
  { id: "org-3", name: "Verdant Logistics", domain: "verdant.co", plan: "Business", employees: 39, projects: 4, createdAt: "2024-09-03" },
];

export const departments: Department[] = [
  { id: "dep-1", name: "Platform Engineering", orgId: "org-1", lead: "Anika Rao", headcount: 24 },
  { id: "dep-2", name: "Product Design", orgId: "org-1", lead: "Manoj Singh", headcount: 9 },
  { id: "dep-3", name: "Quality Assurance", orgId: "org-1", lead: "Priya Nair", headcount: 11 },
  { id: "dep-4", name: "Data Science", orgId: "org-1", lead: "Vikram Reddy", headcount: 7 },
];

export const employees: Employee[] = [
  { id: "emp-1", name: "Divya Sharma", email: "divya@rajutech.in", role: "super_admin", department: "Platform Engineering", title: "VP Engineering", orgId: "org-1", status: "active", capacityHours: 40 },
  { id: "emp-2", name: "Anika Rao", email: "anika@rajutech.in", role: "org_admin", department: "Platform Engineering", title: "Engineering Director", orgId: "org-1", status: "active", capacityHours: 40 },
  { id: "emp-3", name: "Sanjay Kumar", email: "sanjay@rajutech.in", role: "manager", department: "Platform Engineering", title: "Project Manager", orgId: "org-1", status: "active", capacityHours: 40 },
  { id: "emp-4", name: "Priya Nair", email: "priya@rajutech.in", role: "manager", department: "Quality Assurance", title: "QA Lead", orgId: "org-1", status: "active", capacityHours: 40 },
  { id: "emp-5", name: "Rahul Gupta", email: "rahul@rajutech.in", role: "developer", department: "Platform Engineering", title: "Senior Backend Engineer", orgId: "org-1", status: "active", capacityHours: 40 },
  { id: "emp-6", name: "Sneha Patil", email: "sneha@rajutech.in", role: "developer", department: "Platform Engineering", title: "Frontend Engineer", orgId: "org-1", status: "active", capacityHours: 36 },
  { id: "emp-7", name: "Manoj Singh", email: "manoj@rajutech.in", role: "developer", department: "Product Design", title: "Product Designer", orgId: "org-1", status: "active", capacityHours: 40 },
  { id: "emp-8", name: "Vikram Reddy", email: "vikram@rajutech.in", role: "developer", department: "Data Science", title: "Data Engineer", orgId: "org-1", status: "active", capacityHours: 40 },
  { id: "emp-9", name: "Hema Desai", email: "hema@rajutech.in", role: "developer", department: "Quality Assurance", title: "QA Engineer", orgId: "org-1", status: "invited", capacityHours: 32 },
  { id: "emp-10", name: "Rohan Verma", email: "rohan@rajutech.in", role: "viewer", department: "Platform Engineering", title: "Stakeholder", orgId: "org-1", status: "active", capacityHours: 0 },
];

export const projects: Project[] = [
  { id: "prj-1", key: "APX", name: "Apex Billing Platform", description: "Migrate legacy invoicing to a metered billing service with audit trails and multi-currency support.", startDate: day(-58), endDate: day(42), priority: "critical", status: "active", managerId: "emp-3", memberIds: ["emp-5", "emp-6", "emp-7", "emp-9"], orgId: "org-1" },
  { id: "prj-2", key: "ATL", name: "Atlas Customer Portal", description: "Self-service portal with SSO, usage dashboards and in-app support ticketing.", startDate: day(-30), endDate: day(70), priority: "high", status: "active", managerId: "emp-3", memberIds: ["emp-6", "emp-7", "emp-8"], orgId: "org-1" },
  { id: "prj-3", key: "SEN", name: "Sentinel Access Control", description: "Central RBAC service issuing scoped tokens for all internal tooling.", startDate: day(-14), endDate: day(96), priority: "high", status: "planning", managerId: "emp-4", memberIds: ["emp-5", "emp-8"], orgId: "org-1" },
  { id: "prj-4", key: "ORB", name: "Orbit Data Warehouse", description: "Consolidate reporting pipelines into a single warehouse with nightly aggregation jobs.", startDate: day(-120), endDate: day(-6), priority: "medium", status: "completed", managerId: "emp-4", memberIds: ["emp-8", "emp-5"], orgId: "org-1" },
  { id: "prj-5", key: "HLM", name: "Helm Mobile Companion", description: "React Native companion app for field engineers with offline task sync.", startDate: day(-8), endDate: day(120), priority: "low", status: "on_hold", managerId: "emp-3", memberIds: ["emp-6", "emp-9"], orgId: "org-1" },
];

export const sprints: Sprint[] = [
  { id: "spr-1", name: "APX Sprint 14", projectId: "prj-1", goal: "Ship metered usage ingestion and reconciliation report.", startDate: day(-9), endDate: day(5), status: "active" },
  { id: "spr-2", name: "APX Sprint 13", projectId: "prj-1", goal: "Multi-currency tax rules engine.", startDate: day(-23), endDate: day(-10), status: "completed" },
  { id: "spr-3", name: "ATL Sprint 6", projectId: "prj-2", goal: "SSO handshake plus usage dashboard v1.", startDate: day(-6), endDate: day(8), status: "active" },
  { id: "spr-4", name: "SEN Sprint 1", projectId: "prj-3", goal: "Define permission model and token scopes.", startDate: day(3), endDate: day(17), status: "planned" },
];

const labelPool = ["backend", "frontend", "api", "infra", "bug", "design", "docs", "security"];

const seedTasks: Array<Partial<Task> & { title: string; projectId: string; status: Task["status"] }> = [
  { title: "Metered usage ingestion endpoint", projectId: "prj-1", status: "in_progress", assigneeId: "emp-5", priority: "critical", sprintId: "spr-1", estimatedHours: 16, actualHours: 11, labels: ["backend", "api"] },
  { title: "Invoice reconciliation report", projectId: "prj-1", status: "testing", assigneeId: "emp-8", priority: "high", sprintId: "spr-1", estimatedHours: 12, actualHours: 12, labels: ["backend"] },
  { title: "Currency selector on billing settings", projectId: "prj-1", status: "todo", assigneeId: "emp-6", priority: "medium", sprintId: "spr-1", estimatedHours: 6, actualHours: 0, labels: ["frontend"] },
  { title: "Proration edge cases on downgrade", projectId: "prj-1", status: "backlog", assigneeId: null, priority: "high", sprintId: null, estimatedHours: 10, actualHours: 0, labels: ["backend", "bug"] },
  { title: "Audit trail schema migration", projectId: "prj-1", status: "completed", assigneeId: "emp-5", priority: "high", sprintId: "spr-2", estimatedHours: 8, actualHours: 9, labels: ["infra"] },
  { title: "Tax rules engine unit tests", projectId: "prj-1", status: "completed", assigneeId: "emp-9", priority: "medium", sprintId: "spr-2", estimatedHours: 7, actualHours: 6, labels: ["backend", "docs"] },
  { title: "Dunning email templates", projectId: "prj-1", status: "in_progress", assigneeId: "emp-7", priority: "low", sprintId: "spr-1", estimatedHours: 5, actualHours: 2, labels: ["design"] },
  { title: "SSO handshake with Okta", projectId: "prj-2", status: "in_progress", assigneeId: "emp-6", priority: "critical", sprintId: "spr-3", estimatedHours: 14, actualHours: 8, labels: ["security", "api"] },
  { title: "Usage dashboard charts", projectId: "prj-2", status: "todo", assigneeId: "emp-7", priority: "high", sprintId: "spr-3", estimatedHours: 12, actualHours: 0, labels: ["frontend", "design"] },
  { title: "Support ticket submission form", projectId: "prj-2", status: "backlog", assigneeId: "emp-6", priority: "medium", sprintId: null, estimatedHours: 8, actualHours: 0, labels: ["frontend"] },
  { title: "Portal audit logging", projectId: "prj-2", status: "testing", assigneeId: "emp-8", priority: "medium", sprintId: "spr-3", estimatedHours: 6, actualHours: 5, labels: ["backend"] },
  { title: "Permission model draft", projectId: "prj-3", status: "todo", assigneeId: "emp-5", priority: "high", sprintId: "spr-4", estimatedHours: 9, actualHours: 0, labels: ["security", "docs"] },
  { title: "Token scope registry", projectId: "prj-3", status: "backlog", assigneeId: "emp-8", priority: "medium", sprintId: "spr-4", estimatedHours: 11, actualHours: 0, labels: ["backend"] },
  { title: "Nightly aggregation job hardening", projectId: "prj-4", status: "completed", assigneeId: "emp-8", priority: "medium", sprintId: null, estimatedHours: 10, actualHours: 12, labels: ["infra"] },
  { title: "Warehouse cost report", projectId: "prj-4", status: "completed", assigneeId: "emp-5", priority: "low", sprintId: null, estimatedHours: 4, actualHours: 4, labels: ["docs"] },
  { title: "Offline task sync spike", projectId: "prj-5", status: "backlog", assigneeId: "emp-6", priority: "medium", sprintId: null, estimatedHours: 13, actualHours: 0, labels: ["frontend", "infra"] },
  { title: "Field engineer onboarding flow", projectId: "prj-5", status: "backlog", assigneeId: null, priority: "low", sprintId: null, estimatedHours: 6, actualHours: 0, labels: ["design"] },
];

export const tasks: Task[] = seedTasks.map((t, i) => {
  const project = projects.find((p) => p.id === t.projectId)!;
  return {
    id: `tsk-${i + 1}`,
    key: `${project.key}-${100 + i}`,
    title: t.title,
    description:
      "Acceptance criteria captured in the linked spec. Coordinate with the reviewing manager before moving to Testing.",
    priority: t.priority ?? "medium",
    status: t.status,
    dueDate: day(-4 + i * 2),
    assigneeId: t.assigneeId ?? null,
    labels: t.labels ?? [labelPool[i % labelPool.length]!],
    estimatedHours: t.estimatedHours ?? 8,
    actualHours: t.actualHours ?? 0,
    projectId: t.projectId,
    sprintId: t.sprintId ?? null,
    createdAt: day(-20 + i),
  };
});

export const comments: Comment[] = [
  { id: "cmt-1", taskId: "tsk-1", authorId: "emp-3", body: "@Rahul Gupta please confirm the ingestion contract matches the billing spec v3.", createdAt: day(-2) },
  { id: "cmt-2", taskId: "tsk-1", authorId: "emp-5", body: "Confirmed. Batch size capped at 500 events per request.", createdAt: day(-1), parentId: "cmt-1" },
  { id: "cmt-3", taskId: "tsk-2", authorId: "emp-9", body: "Found a rounding mismatch on refunds — reopening for one more pass.", createdAt: day(-1) },
  { id: "cmt-4", taskId: "tsk-8", authorId: "emp-4", body: "Security review scheduled Thursday, keep the staging tenant untouched.", createdAt: day(0) },
];

export const attachments: Attachment[] = [
  { id: "att-1", name: "billing-spec-v3.pdf", size: "1.8 MB", type: "pdf", projectId: "prj-1", uploadedBy: "emp-3", uploadedAt: day(-12) },
  { id: "att-2", name: "usage-ingestion-diagram.png", size: "640 KB", type: "image", projectId: "prj-1", taskId: "tsk-1", uploadedBy: "emp-5", uploadedAt: day(-5) },
  { id: "att-3", name: "sso-integration-notes.docx", size: "220 KB", type: "doc", projectId: "prj-2", taskId: "tsk-8", uploadedBy: "emp-6", uploadedAt: day(-3) },
  { id: "att-4", name: "warehouse-cost-report.xlsx", size: "410 KB", type: "sheet", projectId: "prj-4", uploadedBy: "emp-8", uploadedAt: day(-9) },
  { id: "att-5", name: "permission-matrix.csv", size: "58 KB", type: "sheet", projectId: "prj-3", uploadedBy: "emp-5", uploadedAt: day(-1) },
];

export const timeLogs: TimeLog[] = [
  { id: "tl-1", taskId: "tsk-1", employeeId: "emp-5", date: day(-2), minutes: 225, note: "Ingestion batching + retries" },
  { id: "tl-2", taskId: "tsk-1", employeeId: "emp-5", date: day(-1), minutes: 180, note: "Contract tests" },
  { id: "tl-3", taskId: "tsk-2", employeeId: "emp-8", date: day(-1), minutes: 300, note: "Reconciliation query tuning" },
  { id: "tl-4", taskId: "tsk-8", employeeId: "emp-6", date: day(-1), minutes: 240, note: "Okta metadata exchange" },
  { id: "tl-5", taskId: "tsk-7", employeeId: "emp-7", date: day(0), minutes: 95, note: "Template layout pass" },
  { id: "tl-6", taskId: "tsk-9", employeeId: "emp-7", date: day(0), minutes: 140, note: "Chart spec review" },
];

export const activityLogs: ActivityLog[] = [
  { id: "act-1", actorId: "emp-3", action: "created project", target: "Sentinel Access Control", createdAt: day(-14), type: "project" },
  { id: "act-2", actorId: "emp-3", action: "assigned task", target: "APX-100 to Rahul Gupta", createdAt: day(-9), type: "task" },
  { id: "act-3", actorId: "emp-5", action: "updated status", target: "APX-104 → Completed", createdAt: day(-6), type: "task" },
  { id: "act-4", actorId: "emp-6", action: "uploaded file", target: "sso-integration-notes.docx", createdAt: day(-3), type: "file" },
  { id: "act-5", actorId: "emp-4", action: "started sprint", target: "ATL Sprint 6", createdAt: day(-6), type: "sprint" },
  { id: "act-6", actorId: "emp-2", action: "invited employee", target: "Hema Desai", createdAt: day(-2), type: "member" },
  { id: "act-7", actorId: "emp-8", action: "updated status", target: "ATL-110 → Testing", createdAt: day(-1), type: "task" },
];

export const notifications: Notification[] = [
  { id: "ntf-1", title: "Task assigned", body: "APX-102 “Currency selector on billing settings” was assigned to you.", createdAt: day(0), read: false, type: "task_assigned" },
  { id: "ntf-2", title: "Comment added", body: "Priya Nair commented on APX-101.", createdAt: day(0), read: false, type: "comment" },
  { id: "ntf-3", title: "Sprint started", body: "ATL Sprint 6 is now active until " + day(8) + ".", createdAt: day(-6), read: true, type: "sprint" },
  { id: "ntf-4", title: "Deadline reminder", body: "APX-100 is due in 2 days.", createdAt: day(-1), read: false, type: "deadline" },
  { id: "ntf-5", title: "Task completed", body: "Rahul Gupta completed APX-104.", createdAt: day(-6), read: true, type: "task_completed" },
];