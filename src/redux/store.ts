import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  activityLogs as seedActivity,
  attachments as seedAttachments,
  comments as seedComments,
  departments as seedDepartments,
  employees as seedEmployees,
  notifications as seedNotifications,
  organizations as seedOrganizations,
  projects as seedProjects,
  sprints as seedSprints,
  tasks as seedTasks,
  timeLogs as seedTimeLogs,
} from "@/lib/mock-data";
import type {
  ActivityLog,
  Attachment,
  Comment,
  Employee,
  Notification,
  Project,
  Role,
  Sprint,
  Task,
  TaskStatus,
  TimeLog,
} from "@/lib/epms-types";

const nowIso = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0, 10);
const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 9)}`;

interface AuthState {
  user: Employee | null;
  token: string | null;
}

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: null } as AuthState,
  reducers: {
    login(state, action: PayloadAction<Employee>) {
      state.user = action.payload;
      state.token = `jwt.${btoa(action.payload.email)}.mock`;
    },
    logout(state) {
      state.user = null;
      state.token = null;
    },
    updateProfile(state, action: PayloadAction<Partial<Employee>>) {
      if (state.user) state.user = { ...state.user, ...action.payload };
    },
    switchRole(state, action: PayloadAction<Role>) {
      if (state.user) state.user.role = action.payload;
    },
  },
});

interface DataState {
  organizations: typeof seedOrganizations;
  departments: typeof seedDepartments;
  employees: Employee[];
  projects: Project[];
  sprints: Sprint[];
  tasks: Task[];
  comments: Comment[];
  attachments: Attachment[];
  timeLogs: TimeLog[];
  activity: ActivityLog[];
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    organizations: seedOrganizations,
    departments: seedDepartments,
    employees: seedEmployees,
    projects: seedProjects,
    sprints: seedSprints,
    tasks: seedTasks,
    comments: seedComments,
    attachments: seedAttachments,
    timeLogs: seedTimeLogs,
    activity: seedActivity,
  } as DataState,
  reducers: {
    logActivity(state, action: PayloadAction<Omit<ActivityLog, "id" | "createdAt">>) {
      state.activity.unshift({ ...action.payload, id: uid("act"), createdAt: today() });
    },
    createProject(state, action: PayloadAction<Omit<Project, "id">>) {
      state.projects.unshift({ ...action.payload, id: uid("prj") });
    },
    updateProject(state, action: PayloadAction<{ id: string; changes: Partial<Project> }>) {
      const p = state.projects.find((x) => x.id === action.payload.id);
      if (p) Object.assign(p, action.payload.changes);
    },
    deleteProject(state, action: PayloadAction<string>) {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
    },
    createTask(state, action: PayloadAction<Omit<Task, "id" | "key" | "createdAt">>) {
      const project = state.projects.find((p) => p.id === action.payload.projectId);
      const count = state.tasks.filter((t) => t.projectId === action.payload.projectId).length;
      state.tasks.unshift({
        ...action.payload,
        id: uid("tsk"),
        key: `${project?.key ?? "GEN"}-${200 + count}`,
        createdAt: today(),
      });
    },
    updateTask(state, action: PayloadAction<{ id: string; changes: Partial<Task> }>) {
      const t = state.tasks.find((x) => x.id === action.payload.id);
      if (t) Object.assign(t, action.payload.changes);
    },
    moveTask(state, action: PayloadAction<{ id: string; status: TaskStatus }>) {
      const t = state.tasks.find((x) => x.id === action.payload.id);
      if (t) t.status = action.payload.status;
    },
    softDeleteTask(state, action: PayloadAction<string>) {
      const t = state.tasks.find((x) => x.id === action.payload);
      if (t) t.deleted = true;
    },
    restoreTask(state, action: PayloadAction<string>) {
      const t = state.tasks.find((x) => x.id === action.payload);
      if (t) t.deleted = false;
    },
    addComment(state, action: PayloadAction<Omit<Comment, "id" | "createdAt">>) {
      state.comments.push({ ...action.payload, id: uid("cmt"), createdAt: today() });
    },
    addAttachment(state, action: PayloadAction<Omit<Attachment, "id" | "uploadedAt">>) {
      state.attachments.unshift({ ...action.payload, id: uid("att"), uploadedAt: today() });
    },
    removeAttachment(state, action: PayloadAction<string>) {
      state.attachments = state.attachments.filter((a) => a.id !== action.payload);
    },
    addTimeLog(state, action: PayloadAction<Omit<TimeLog, "id">>) {
      state.timeLogs.unshift({ ...action.payload, id: uid("tl") });
      const t = state.tasks.find((x) => x.id === action.payload.taskId);
      if (t) t.actualHours = Math.round((t.actualHours + action.payload.minutes / 60) * 10) / 10;
    },
    createSprint(state, action: PayloadAction<Omit<Sprint, "id">>) {
      state.sprints.unshift({ ...action.payload, id: uid("spr") });
    },
    updateSprint(state, action: PayloadAction<{ id: string; changes: Partial<Sprint> }>) {
      const s = state.sprints.find((x) => x.id === action.payload.id);
      if (s) Object.assign(s, action.payload.changes);
    },
    inviteEmployee(state, action: PayloadAction<Omit<Employee, "id">>) {
      state.employees.unshift({ ...action.payload, id: uid("emp") });
    },
    updateEmployee(state, action: PayloadAction<{ id: string; changes: Partial<Employee> }>) {
      const e = state.employees.find((x) => x.id === action.payload.id);
      if (e) Object.assign(e, action.payload.changes);
    },
    removeEmployee(state, action: PayloadAction<string>) {
      state.employees = state.employees.filter((e) => e.id !== action.payload);
    },
  },
});

interface NotificationState {
  items: Notification[];
}

const notificationSlice = createSlice({
  name: "notifications",
  initialState: { items: seedNotifications } as NotificationState,
  reducers: {
    push(state, action: PayloadAction<Omit<Notification, "id" | "createdAt" | "read">>) {
      state.items.unshift({ ...action.payload, id: uid("ntf"), createdAt: today(), read: false });
    },
    markRead(state, action: PayloadAction<string>) {
      const n = state.items.find((x) => x.id === action.payload);
      if (n) n.read = true;
    },
    markAllRead(state) {
      state.items.forEach((n) => (n.read = true));
    },
  },
});

interface TimerState {
  taskId: string | null;
  startedAt: string | null;
  elapsedSeconds: number;
  running: boolean;
}

const timerSlice = createSlice({
  name: "timer",
  initialState: { taskId: null, startedAt: null, elapsedSeconds: 0, running: false } as TimerState,
  reducers: {
    start(state, action: PayloadAction<string>) {
      if (state.taskId !== action.payload) state.elapsedSeconds = 0;
      state.taskId = action.payload;
      state.startedAt = nowIso();
      state.running = true;
    },
    pause(state) {
      state.running = false;
    },
    resume(state) {
      if (state.taskId) state.running = true;
    },
    tick(state) {
      if (state.running) state.elapsedSeconds += 1;
    },
    stop(state) {
      state.taskId = null;
      state.startedAt = null;
      state.elapsedSeconds = 0;
      state.running = false;
    },
  },
});

export const authActions = authSlice.actions;
export const dataActions = dataSlice.actions;
export const notificationActions = notificationSlice.actions;
export const timerActions = timerSlice.actions;

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authSlice.reducer,
      data: dataSlice.reducer,
      notifications: notificationSlice.reducer,
      timer: timerSlice.reducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];