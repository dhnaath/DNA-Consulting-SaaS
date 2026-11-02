import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWorkspaceStorage } from "../../core/persistStorage";
import {
  AppNotification,
  NotificationCategoryType,
  NotificationPreference,
  DeliveryChannel,
} from "./types";

interface NotificationStore {
  notifications: AppNotification[];
  preferences: NotificationPreference[];
  selectedCategory: NotificationCategoryType | "all";
  selectedSourceApp: string | "all";
  performedActionCount: number;

  // Actions
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  markAllAsRead: () => void;
  archiveNotification: (id: string) => void;
  unarchiveNotification: (id: string) => void;
  deleteNotification: (id: string) => void;
  performQuickAction: (notificationId: string, actionId: string) => { success: boolean; message: string };
  updatePreference: (type: NotificationCategoryType, channels: DeliveryChannel[], isMuted: boolean) => void;
  addNotification: (data: Omit<AppNotification, "id" | "createdAt" | "status">) => void;
  setSelectedCategory: (cat: NotificationCategoryType | "all") => void;
  setSelectedSourceApp: (app: string | "all") => void;
  clearAll: () => void;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-01",
    recipientId: "current_user",
    type: "approval_request",
    title: "Permintaan Approval: Deliverable Final UI Kit v2",
    body: "Andi Pratama mengajukan Submission #04 untuk ditinjau sebelum rilis sprint. Mohon validasi kesesuaian WCAG.",
    sourceApp: "deliverable_manager",
    sourceId: "deliv-04",
    status: "unread",
    createdAt: "2026-09-24T02:40:00Z",
    readAt: null,
    quickActions: [
      {
        id: "qa-01-appr",
        notificationId: "notif-01",
        label: "Setujui",
        actionType: "approve",
        targetApp: "deliverable_manager",
        targetId: "deliv-04",
      },
      {
        id: "qa-01-rej",
        notificationId: "notif-01",
        label: "Minta Revisi",
        actionType: "reject",
        targetApp: "deliverable_manager",
        targetId: "deliv-04",
      },
    ],
  },
  {
    id: "notif-02",
    recipientId: "current_user",
    type: "reminder",
    title: "Waktunya: Persiapan Bahan Presentasi Klien PT Sentosa",
    body: "Reminder otomatis dari Reminder Manager (#05): Tenggat waktu tersisa 3 jam sebelum rapat koordinasi.",
    sourceApp: "reminder_manager",
    sourceId: "rem-109",
    status: "unread",
    createdAt: "2026-09-24T02:15:00Z",
    readAt: null,
    quickActions: [
      {
        id: "qa-02-done",
        notificationId: "notif-02",
        label: "Tandai Selesai",
        actionType: "complete",
        targetApp: "task_manager",
        targetId: "task-88",
      },
    ],
  },
  {
    id: "notif-03",
    recipientId: "current_user",
    type: "mention",
    title: "Siti Rahma menyebut Anda di komentar Task #104",
    body: '"@user tolong cek kembali format JSON Schema untuk integration test backend sebelum deploy."',
    sourceApp: "collaboration",
    sourceId: "comment-552",
    status: "unread",
    createdAt: "2026-09-24T01:30:00Z",
    readAt: null,
    quickActions: [
      {
        id: "qa-03-reply",
        notificationId: "notif-03",
        label: "Balas Komentar",
        actionType: "reply",
        targetApp: "collaboration",
        targetId: "comment-552",
      },
    ],
  },
  {
    id: "notif-04",
    recipientId: "current_user",
    type: "assignment",
    title: "Ditugaskan ke Task: Audit Keamanan ISO 27001",
    body: "Budi Santoso menugaskan Anda sebagai Primary Assignee untuk audit modul autentikasi.",
    sourceApp: "task_manager",
    sourceId: "task-99",
    status: "read",
    createdAt: "2026-09-23T18:00:00Z",
    readAt: "2026-09-23T19:10:00Z",
  },
  {
    id: "notif-05",
    recipientId: "current_user",
    type: "system",
    title: "Pembaruan Ekosistem: Modul #26-#29 Aktif",
    body: "Modul Bookmark Manager, Notification Center, Approval Manager, dan Asset Manager kini terhubung ke router utama.",
    sourceApp: "system",
    sourceId: "sys-v8",
    status: "read",
    createdAt: "2026-09-23T10:00:00Z",
    readAt: "2026-09-23T10:05:00Z",
  },
  {
    id: "notif-06",
    recipientId: "current_user",
    type: "comment",
    title: "Balasan baru pada Meeting Minutes 'Sprint 42 Retrospective'",
    body: "Rina Kusuma menambahkan catatan tindak lanjut action item untuk arsitektur database.",
    sourceApp: "meeting_manager",
    sourceId: "mtg-42",
    status: "archived",
    createdAt: "2026-09-22T14:20:00Z",
    readAt: "2026-09-22T14:40:00Z",
  },
];

const INITIAL_PREFERENCES: NotificationPreference[] = [
  { userId: "current_user", type: "approval_request", channels: ["in_app", "push", "email"], isMuted: false },
  { userId: "current_user", type: "reminder", channels: ["in_app", "push"], isMuted: false },
  { userId: "current_user", type: "mention", channels: ["in_app", "push"], isMuted: false },
  { userId: "current_user", type: "assignment", channels: ["in_app", "email"], isMuted: false },
  { userId: "current_user", type: "comment", channels: ["in_app"], isMuted: false },
  { userId: "current_user", type: "system", channels: ["in_app"], isMuted: false },
];

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: INITIAL_NOTIFICATIONS,
      preferences: INITIAL_PREFERENCES,
      selectedCategory: "all",
      selectedSourceApp: "all",
      performedActionCount: 14,

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, status: "read", readAt: new Date().toISOString() } : n
          ),
        }));
      },

      markAsUnread: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, status: "unread", readAt: null } : n
          ),
        }));
      },

      markAllAsRead: () => {
        const now = new Date().toISOString();
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.status === "unread" ? { ...n, status: "read", readAt: now } : n
          ),
        }));
      },

      archiveNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, status: "archived" } : n
          ),
        }));
      },

      unarchiveNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, status: "read" } : n
          ),
        }));
      },

      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      performQuickAction: (notificationId, actionId) => {
        const notif = get().notifications.find((n) => n.id === notificationId);
        if (!notif || !notif.quickActions) {
          return { success: false, message: "Aksi tidak ditemukan." };
        }

        const action = notif.quickActions.find((a) => a.id === actionId);
        if (!action) {
          return { success: false, message: "Aksi tidak valid." };
        }

        // Mark quick action as performed and auto-mark notification as read
        set((state) => ({
          performedActionCount: state.performedActionCount + 1,
          notifications: state.notifications.map((n) =>
            n.id === notificationId
              ? {
                  ...n,
                  status: "read",
                  readAt: new Date().toISOString(),
                  quickActions: n.quickActions?.map((qa) =>
                    qa.id === actionId ? { ...qa, performed: true } : qa
                  ),
                }
              : n
          ),
        }));

        let msg = `Aksi "${action.label}" berhasil dieksekusi ke ${action.targetApp}!`;
        if (action.actionType === "approve") {
          msg = `Disetujui! Status entity ${action.targetId} di ${action.targetApp} telah diperbarui.`;
        } else if (action.actionType === "complete") {
          msg = `Tugas ${action.targetId} telah ditandai Selesai.`;
        }

        return { success: true, message: msg };
      },

      updatePreference: (type, channels, isMuted) => {
        set((state) => ({
          preferences: state.preferences.map((p) =>
            p.type === type ? { ...p, channels, isMuted } : p
          ),
        }));
      },

      addNotification: (data) => {
        const newNotif: AppNotification = {
          ...data,
          id: `notif-${Date.now()}`,
          createdAt: new Date().toISOString(),
          status: "unread",
          readAt: null,
        };
        set((state) => ({
          notifications: [newNotif, ...state.notifications],
        }));
      },

      setSelectedCategory: (cat) => set({ selectedCategory: cat }),
      setSelectedSourceApp: (app) => set({ selectedSourceApp: app }),

      clearAll: () => set({ notifications: [] }),
    }),
    {
      name: "ecosystem-notification-center-storage",
      storage: createWorkspaceStorage(),
    }
  )
);
