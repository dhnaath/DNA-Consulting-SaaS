import { useState, useEffect, useCallback } from "react";
import { getRaw, setRaw } from "../../core/rawStorage";
import {
  ReminderRule,
  ReminderInstance,
  SnoozeRecord,
  NotificationLog,
  ReminderSourceApp,
  TriggerType,
} from "./types";

const REMINDER_STORAGE_KEY = "aio_reminder_manager_data_v1";

interface ReminderState {
  rules: ReminderRule[];
  instances: ReminderInstance[];
  snoozes: SnoozeRecord[];
  logs: NotificationLog[];
}

const DEFAULT_RULES: ReminderRule[] = [
  {
    id: "rule-seed-1",
    sourceApp: "calendar",
    sourceId: "ev-1",
    triggerType: "relative",
    triggerConfig: {
      anchorField: "eventStart",
      offsetMinutes: -15,
    },
    channels: ["in_app", "push"],
    status: "active",
    message: "Pengingat: Weekly Alignment & Status Konsultan dimulai dalam 15 menit.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "rule-seed-2",
    sourceApp: "task_manager",
    sourceId: "task-seed-1",
    triggerType: "relative",
    triggerConfig: {
      anchorField: "dueAt",
      offsetMinutes: -60,
    },
    channels: ["in_app", "email"],
    status: "active",
    message: "Batas Waktu: Penyusunan Risalah Opini Hukum jatuh tempo dalam 1 jam.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "rule-seed-3",
    sourceApp: "custom",
    sourceId: "loc-office",
    triggerType: "location",
    triggerConfig: {
      latitude: -6.2241,
      longitude: 106.8097,
      radiusMeters: 200,
      event: "enter",
      locationName: "Kantor Pusat / Sudirman Central",
    },
    channels: ["push", "in_app"],
    status: "active",
    message: "Selamat tiba di Menara Sudirman. Jangan lupa serahkan dokumen audit fisik ke meja arsip.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_INSTANCES: ReminderInstance[] = [
  {
    id: "inst-1",
    ruleId: "rule-seed-1",
    title: "Weekly Alignment & Status Konsultan Partner",
    sourceApp: "calendar",
    scheduledAt: new Date(Date.now() + 15 * 60000).toISOString(),
    status: "pending",
  },
  {
    id: "inst-2",
    ruleId: "rule-seed-2",
    title: "Penyusunan Risalah Opini Hukum Klien",
    sourceApp: "task_manager",
    scheduledAt: new Date(Date.now() + 60 * 60000).toISOString(),
    status: "pending",
  },
  {
    id: "inst-3",
    ruleId: "rule-seed-3",
    title: "Serahkan dokumen audit fisik ke meja arsip",
    sourceApp: "custom",
    scheduledAt: new Date(Date.now() - 30 * 60000).toISOString(),
    status: "delivered",
    sentAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
];

const DEFAULT_LOGS: NotificationLog[] = [
  {
    id: "log-1",
    instanceId: "inst-3",
    event: "delivered",
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    metadata: { channel: "in_app", status: "success" },
  },
];

export function useReminderManager() {
  const [state, setState] = useState<ReminderState>(() => {
    try {
      const saved = getRaw(REMINDER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load reminder state", e);
    }
    return {
      rules: DEFAULT_RULES,
      instances: DEFAULT_INSTANCES,
      snoozes: [],
      logs: DEFAULT_LOGS,
    };
  });

  useEffect(() => {
    try {
      setRaw(REMINDER_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to persist reminder state", e);
    }
  }, [state]);

  const notifyChange = useCallback(() => {
    window.dispatchEvent(new Event("aio_data_updated"));
  }, []);

  // DISMISS INSTANCE (§13)
  const dismissInstance = useCallback((instanceId: string) => {
    setState((prev) => {
      const now = new Date().toISOString();
      const updatedInstances = prev.instances.map((i) =>
        i.id === instanceId ? { ...i, status: "dismissed" as const, dismissedAt: now } : i
      );
      const newLog: NotificationLog = {
        id: "log-" + Date.now().toString(36),
        instanceId,
        event: "dismissed",
        timestamp: now,
      };
      return {
        ...prev,
        instances: updatedInstances,
        logs: [newLog, ...prev.logs],
      };
    });
    notifyChange();
  }, [notifyChange]);

  // SNOOZE INSTANCE (§7)
  const snoozeInstance = useCallback((instanceId: string, durationMinutes: number) => {
    setState((prev) => {
      const original = prev.instances.find((i) => i.id === instanceId);
      if (!original) return prev;

      const now = new Date();
      const snoozeUntil = new Date(now.getTime() + durationMinutes * 60000).toISOString();

      const snoozeRec: SnoozeRecord = {
        id: "snz-" + Date.now().toString(36),
        instanceId,
        snoozedAt: now.toISOString(),
        snoozeUntil,
        snoozeDurationMinutes: durationMinutes,
      };

      // Create new instance for snoozeUntil (§7: "Snooze membuat ReminderInstance baru")
      const newInstance: ReminderInstance = {
        id: "inst-" + Date.now().toString(36),
        ruleId: original.ruleId,
        title: original.title,
        sourceApp: original.sourceApp,
        scheduledAt: snoozeUntil,
        status: "pending",
      };

      const newLog: NotificationLog = {
        id: "log-" + Date.now().toString(36),
        instanceId,
        event: "snoozed",
        timestamp: now.toISOString(),
        metadata: { snoozeDurationMinutes: durationMinutes },
      };

      return {
        ...prev,
        instances: [
          ...prev.instances.map((i) =>
            i.id === instanceId ? { ...i, status: "snoozed" as const, snoozeUntil } : i
          ),
          newInstance,
        ],
        snoozes: [snoozeRec, ...prev.snoozes],
        logs: [newLog, ...prev.logs],
      };
    });
    notifyChange();
  }, [notifyChange]);

  // TRIGGER MANUALLY (§3.2 - Uji coba pengiriman)
  const triggerManually = useCallback((ruleId: string) => {
    setState((prev) => {
      const rule = prev.rules.find((r) => r.id === ruleId);
      if (!rule) return prev;

      const now = new Date().toISOString();
      const newInstance: ReminderInstance = {
        id: "inst-manual-" + Date.now().toString(36),
        ruleId: rule.id,
        title: rule.message || "Manual Trigger Test",
        sourceApp: rule.sourceApp,
        scheduledAt: now,
        status: "delivered",
        sentAt: now,
      };

      const newLog: NotificationLog = {
        id: "log-" + Date.now().toString(36),
        instanceId: newInstance.id,
        event: "delivered",
        timestamp: now,
        metadata: { triggeredManually: true, channels: rule.channels },
      };

      return {
        ...prev,
        instances: [newInstance, ...prev.instances],
        logs: [newLog, ...prev.logs],
      };
    });
    notifyChange();
  }, [notifyChange]);

  // TOGGLE PAUSE RULE (§3.2)
  const togglePauseRule = useCallback((ruleId: string) => {
    setState((prev) => ({
      ...prev,
      rules: prev.rules.map((r) =>
        r.id === ruleId
          ? { ...r, status: r.status === "active" ? ("paused" as const) : ("active" as const) }
          : r
      ),
    }));
    notifyChange();
  }, [notifyChange]);

  // CREATE NEW RULE (§3.2)
  const createRule = useCallback(
    (data: {
      sourceApp: ReminderSourceApp;
      sourceId?: string;
      triggerType: TriggerType;
      triggerConfig: ReminderRule["triggerConfig"];
      channels: ReminderRule["channels"];
      message: string;
    }) => {
      const ruleId = "rule-" + Date.now().toString(36);
      const newRule: ReminderRule = {
        id: ruleId,
        sourceApp: data.sourceApp,
        sourceId: data.sourceId || "manual-" + Date.now().toString(36),
        triggerType: data.triggerType,
        triggerConfig: data.triggerConfig,
        channels: data.channels.length > 0 ? data.channels : ["in_app"],
        status: "active",
        message: data.message.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const scheduledAt =
        data.triggerConfig.triggerAt || new Date(Date.now() + 30 * 60000).toISOString();

      const newInstance: ReminderInstance = {
        id: "inst-" + Date.now().toString(36),
        ruleId,
        title: data.message,
        sourceApp: data.sourceApp,
        scheduledAt,
        status: "pending",
      };

      setState((prev) => ({
        ...prev,
        rules: [newRule, ...prev.rules],
        instances: [newInstance, ...prev.instances],
      }));

      notifyChange();
      return newRule;
    },
    [notifyChange]
  );

  return {
    state,
    dismissInstance,
    snoozeInstance,
    triggerManually,
    togglePauseRule,
    createRule,
  };
}
