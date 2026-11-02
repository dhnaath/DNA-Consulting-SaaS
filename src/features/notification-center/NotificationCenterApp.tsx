import { ShellHeader } from "@/app/shell-header";
import React, { useState, useMemo } from "react";
import {
  Bell,
  CheckCircle2,
  Clock,
  MessageSquare,
  FileCheck2,
  Users,
  Settings,
  Archive,
  Trash2,
  Check,
  Search,
  Filter,
  BarChart3,
  ShieldAlert,
  Sparkles,
  Inbox,
  VolumeX,
  Volume2,
  Mail,
  Smartphone,
  CheckCheck,
  RotateCcw,
  PackageCheck,
  X,
} from "lucide-react";
import { useNotificationStore } from "./store";
import {
  DeliveryChannel,
  NotificationCategoryType,
  NotificationViewMode,
} from "./types";

export function NotificationCenterApp() {
  const {
    notifications,
    preferences,
    selectedCategory,
    selectedSourceApp,
    performedActionCount,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    archiveNotification,
    unarchiveNotification,
    deleteNotification,
    performQuickAction,
    updatePreference,
    addNotification,
    setSelectedCategory,
    setSelectedSourceApp,
  } = useNotificationStore();

  const [activeTab, setActiveTab] = useState<NotificationViewMode>("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "week">("all");
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Simulation modal
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [simType, setSimType] = useState<NotificationCategoryType>("approval_request");
  const [simTitle, setSimTitle] = useState("");
  const [simBody, setSimBody] = useState("");
  const [simApp, setSimApp] = useState("deliverable_manager");

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  const handlePerformAction = (notifId: string, actionId: string) => {
    const res = performQuickAction(notifId, actionId);
    showToast(res.message);
  };

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simTitle.trim()) return;

    let quickActions = undefined;
    if (simType === "approval_request") {
      quickActions = [
        {
          id: `qa-${Date.now()}-1`,
          notificationId: "",
          label: "Approve",
          actionType: "approve" as const,
          targetApp: simApp,
          targetId: "req-sim",
        },
        {
          id: `qa-${Date.now()}-2`,
          notificationId: "",
          label: "Reject",
          actionType: "reject" as const,
          targetApp: simApp,
          targetId: "req-sim",
        },
      ];
    } else if (simType === "reminder") {
      quickActions = [
        {
          id: `qa-${Date.now()}-3`,
          notificationId: "",
          label: "Tandai Selesai",
          actionType: "complete" as const,
          targetApp: "task_manager",
          targetId: "task-sim",
        },
      ];
    }

    addNotification({
      recipientId: "current_user",
      type: simType,
      title: simTitle.trim(),
      body: simBody.trim(),
      sourceApp: simApp,
      sourceId: `src-${Date.now()}`,
      quickActions,
    });

    showToast(`Notifikasi baru dari ${simApp} berhasil masuk ke Inbox!`);
    setIsSimulateOpen(false);
    setSimTitle("");
    setSimBody("");
  };

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      // Tab View Filter
      if (activeTab === "inbox") {
        if (notif.status === "archived") return false;
      } else if (activeTab === "unread") {
        if (notif.status !== "unread") return false;
      } else if (activeTab === "archived") {
        if (notif.status !== "archived") return false;
      } else if (activeTab === "by_type") {
        if (selectedCategory !== "all" && notif.type !== selectedCategory) return false;
        if (notif.status === "archived") return false;
      } else if (activeTab === "by_app") {
        if (selectedSourceApp !== "all" && notif.sourceApp !== selectedSourceApp) return false;
        if (notif.status === "archived") return false;
      }

      // Time Filter
      if (timeFilter !== "all") {
        const notifDate = new Date(notif.createdAt).getTime();
        const now = Date.now();
        const dayMs = 24 * 60 * 60 * 1000;
        if (timeFilter === "today" && now - notifDate > dayMs) return false;
        if (timeFilter === "week" && now - notifDate > 7 * dayMs) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = notif.title.toLowerCase().includes(q);
        const matchBody = (notif.body || "").toLowerCase().includes(q);
        const matchApp = notif.sourceApp.toLowerCase().includes(q);
        if (!matchTitle && !matchBody && !matchApp) return false;
      }

      return true;
    });
  }, [notifications, activeTab, selectedCategory, selectedSourceApp, timeFilter, searchQuery]);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((n) => n.status === "unread").length;
    const read = notifications.filter((n) => n.status === "read").length;
    const archived = notifications.filter((n) => n.status === "archived").length;
    const readRate = total > 0 ? (((read + archived) / total) * 100).toFixed(1) : "0";

    const typeBreakdown: Record<string, number> = {};
    const appBreakdown: Record<string, number> = {};

    notifications.forEach((n) => {
      typeBreakdown[n.type] = (typeBreakdown[n.type] || 0) + 1;
      appBreakdown[n.sourceApp] = (appBreakdown[n.sourceApp] || 0) + 1;
    });

    const totalActionsAvailable = notifications.reduce(
      (acc, n) => acc + (n.quickActions ? n.quickActions.length : 0),
      0
    );
    const actionUsageRate =
      totalActionsAvailable > 0
        ? ((performedActionCount / (performedActionCount + totalActionsAvailable)) * 100).toFixed(1)
        : "78.4";

    return { total, unread, read, archived, readRate, typeBreakdown, appBreakdown, actionUsageRate };
  }, [notifications, performedActionCount]);

  // Helper icons and colors by type
  const getTypeMeta = (type: NotificationCategoryType) => {
    switch (type) {
      case "approval_request":
        return {
          label: "Approval",
          icon: FileCheck2,
          color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
        };
      case "reminder":
        return {
          label: "Reminder",
          icon: Clock,
          color: "text-sky-400 bg-sky-500/10 border-sky-500/30",
        };
      case "mention":
        return {
          label: "Mention",
          icon: MessageSquare,
          color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
        };
      case "assignment":
        return {
          label: "Assignment",
          icon: Users,
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        };
      case "comment":
        return {
          label: "Comment",
          icon: MessageSquare,
          color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
        };
      case "system":
        return {
          label: "System",
          icon: ShieldAlert,
          color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
        };
      default:
        return {
          label: "General",
          icon: Bell,
          color: "text-muted-foreground bg-muted-foreground/30/10 border-border/30",
        };
    }
  };

  const getSourceAppLabel = (app: string) => {
    switch (app) {
      case "task_manager":
        return "Task Manager (#01)";
      case "reminder_manager":
        return "Reminder Manager (#05)";
      case "meeting_manager":
        return "Meeting Manager (#19)";
      case "deliverable_manager":
        return "Deliverable Manager (#20)";
      case "workflow_manager":
        return "Workflow Manager (#21)";
      case "forms":
        return "Forms (#22)";
      case "collaboration":
        return "Collaboration (#23)";
      case "approval_manager":
        return "Approval Manager (#28)";
      case "system":
        return "System Core";
      default:
        return app.replace("_", " ");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8">
      {/* Toast Notification */}
      {notificationToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-indigo-400 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-sm font-medium">{notificationToast}</span>
        </div>
      )}

      {/* Header Actions Portaled to Main Header */}
      <ShellHeader>
        <div className="flex items-center gap-1 shrink-0">
          {/* Tab Switchers (Icon-Only) */}
          <div className="flex items-center gap-0.5 border border-border/60 rounded-lg p-0.5 bg-muted/70 text-xs shrink-0">
            <button
              onClick={() => setActiveTab("inbox")}
              title={`Inbox (${notifications.filter((n) => n.status !== "archived").length})`}
              aria-label="Inbox"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "inbox"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab("unread")}
              title={`Unread (${stats.unread})`}
              aria-label="Unread"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "unread"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
            </button>
            <button
              onClick={() => setActiveTab("by_type")}
              title="By Type"
              aria-label="By Type"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "by_type"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Filter className="w-3.5 h-3.5 text-sky-400" />
            </button>
            <button
              onClick={() => setActiveTab("by_app")}
              title="By Source App"
              aria-label="By App"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "by_app"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
            </button>
            <button
              onClick={() => setActiveTab("archived")}
              title={`Archived (${stats.archived})`}
              aria-label="Archived"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "archived"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Archive className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              title="Preferences"
              aria-label="Preferences"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "preferences"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-indigo-400" />
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              title="Statistik & Analisis"
              aria-label="Statistik"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "stats"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
            </button>
          </div>

          <button
            onClick={() => {
              markAllAsRead();
              showToast("Seluruh notifikasi telah ditandai sudah dibaca.");
            }}
            title="Tandai Semua Sudah Dibaca"
            aria-label="Tandai Semua Dibaca"
            className="p-1.5 bg-card hover:bg-accent text-foreground border border-border rounded-lg text-xs font-medium transition cursor-pointer shrink-0 flex items-center justify-center"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          <button
            onClick={() => setIsSimulateOpen(true)}
            title="Simulasi Event Notifikasi Masuk"
            aria-label="Simulasi Notifikasi"
            className="p-1.5 bg-primary text-primary-foreground hover:opacity-90 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer shrink-0 flex items-center justify-center"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </ShellHeader>

      {/* Main Content */}
      <div className="flex-1 mt-4">
        {/* STATS VIEW */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Total Notifikasi</div>
                <div className="text-3xl font-extrabold text-white mt-1">{stats.total}</div>
                <div className="text-xs text-muted-foreground mt-1">Diterima di seluruh channel</div>
              </div>
              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Read Rate</div>
                <div className="text-3xl font-extrabold text-emerald-400 mt-1">{stats.readRate}%</div>
                <div className="text-xs text-muted-foreground mt-1">Rasio dibaca & diarsip</div>
              </div>
              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Quick Action Rate</div>
                <div className="text-3xl font-extrabold text-sky-400 mt-1">{stats.actionUsageRate}%</div>
                <div className="text-xs text-muted-foreground mt-1">{performedActionCount} aksi cepat dieksekusi</div>
              </div>
              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Avg Time to Read</div>
                <div className="text-3xl font-extrabold text-purple-400 mt-1">12 mnt</div>
                <div className="text-xs text-muted-foreground mt-1">Kecepatan respons pengguna</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-card/60 border border-border rounded-xl">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-rose-400" />
                  Notifications by Type
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.typeBreakdown).map(([t, count]) => {
                    const meta = getTypeMeta(t as any);
                    return (
                      <div key={t} className="flex items-center justify-between text-sm py-1 border-b border-border/40">
                        <span className="capitalize text-foreground">{meta.label}</span>
                        <span className="px-2 py-0.5 bg-card text-foreground rounded text-xs font-medium">{count} pesan</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-5 bg-card/60 border border-border rounded-xl">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-amber-400" />
                  Notifications by Source App
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.appBreakdown).map(([app, count]) => (
                    <div key={app} className="flex items-center justify-between text-sm py-1 border-b border-border/40">
                      <span className="text-foreground">{getSourceAppLabel(app)}</span>
                      <span className="px-2 py-0.5 bg-card text-foreground rounded text-xs font-medium">{count} event</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PREFERENCES VIEW */}
        {activeTab === "preferences" && (
          <div className="max-w-3xl space-y-6">
            <div className="p-5 bg-card/80 border border-border rounded-xl">
              <h2 className="text-lg font-bold text-white mb-1">Pengaturan Channel & Mute Notifikasi</h2>
              <p className="text-xs text-muted-foreground mb-4">
                Atur jalur pengiriman untuk setiap tipe notifikasi (In-App, Push Browser, atau Email), atau bisukan tipe tertentu.
              </p>

              <div className="space-y-3">
                {preferences.map((pref) => {
                  const meta = getTypeMeta(pref.type);
                  const Icon = meta.icon;

                  const toggleChannel = (ch: DeliveryChannel) => {
                    const has = pref.channels.includes(ch);
                    const newChannels = has
                      ? pref.channels.filter((c) => c !== ch)
                      : [...pref.channels, ch];
                    updatePreference(pref.type, newChannels, pref.isMuted);
                    showToast(`Channel ${ch} untuk ${meta.label} diperbarui.`);
                  };

                  const toggleMute = () => {
                    updatePreference(pref.type, pref.channels, !pref.isMuted);
                    showToast(`${meta.label} ${!pref.isMuted ? "dibisukan (muted)" : "diaktifkan kembali"}.`);
                  };

                  return (
                    <div
                      key={pref.type}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        pref.isMuted
                          ? "bg-background/60 border-border opacity-60"
                          : "bg-card border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border ${meta.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-foreground">{meta.label}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {pref.isMuted ? "Dibisukan (Tidak ada alert)" : "Alert aktif sesuai channel pilihan"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* In-app toggle */}
                        <button
                          onClick={() => toggleChannel("in_app")}
                          className={`px-2.5 py-1 rounded text-xs font-medium border transition flex items-center gap-1 ${
                            pref.channels.includes("in_app")
                              ? "bg-indigo-600/30 text-indigo-300 border-indigo-500/50"
                              : "bg-card/40 text-muted-foreground border-border"
                          }`}
                        >
                          <Inbox className="w-3 h-3" />
                          In-App
                        </button>

                        {/* Push toggle */}
                        <button
                          onClick={() => toggleChannel("push")}
                          className={`px-2.5 py-1 rounded text-xs font-medium border transition flex items-center gap-1 ${
                            pref.channels.includes("push")
                              ? "bg-sky-600/30 text-sky-300 border-sky-500/50"
                              : "bg-card/40 text-muted-foreground border-border"
                          }`}
                        >
                          <Smartphone className="w-3 h-3" />
                          Push
                        </button>

                        {/* Email toggle */}
                        <button
                          onClick={() => toggleChannel("email")}
                          className={`px-2.5 py-1 rounded text-xs font-medium border transition flex items-center gap-1 ${
                            pref.channels.includes("email")
                              ? "bg-amber-600/30 text-amber-300 border-amber-500/50"
                              : "bg-card/40 text-muted-foreground border-border"
                          }`}
                        >
                          <Mail className="w-3 h-3" />
                          Email
                        </button>

                        {/* Mute button */}
                        <button
                          onClick={toggleMute}
                          className={`p-1.5 rounded transition ${
                            pref.isMuted ? "text-rose-400 bg-rose-500/20" : "text-muted-foreground hover:text-foreground"
                          }`}
                          title={pref.isMuted ? "Bunyikan Kembali" : "Bisukan Tipe Ini"}
                        >
                          {pref.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* INBOX / UNREAD / BY_TYPE / BY_APP / ARCHIVED */}
        {activeTab !== "stats" && activeTab !== "preferences" && (
          <div className="space-y-4">
            {/* Search & Subfilters */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-card/80 border border-border rounded-xl">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari notifikasi, pengirim, aplikasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs md:text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-rose-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* By Type Subselector */}
              {activeTab === "by_type" && (
                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
                  {(["all", "approval_request", "reminder", "mention", "assignment", "comment", "system"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded text-xs font-medium capitalize shrink-0 ${
                        selectedCategory === cat ? "bg-rose-600 text-background font-bold" : "bg-foreground/60 text-foreground hover:bg-foreground"
                      }`}
                    >
                      {cat.replace("_", " ")}
                    </button>
                  ))}
                </div>
              )}

              {/* By Source App Subselector */}
              {activeTab === "by_app" && (
                <select
                  value={selectedSourceApp}
                  onChange={(e) => setSelectedSourceApp(e.target.value)}
                  className="px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-rose-500"
                >
                  <option value="all">Semua Aplikasi</option>
                  <option value="task_manager">Task Manager (#01)</option>
                  <option value="reminder_manager">Reminder Manager (#05)</option>
                  <option value="meeting_manager">Meeting Manager (#19)</option>
                  <option value="deliverable_manager">Deliverable Manager (#20)</option>
                  <option value="collaboration">Collaboration (#23)</option>
                  <option value="system">System Core</option>
                </select>
              )}

              {/* Time filter */}
              <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                <button
                  onClick={() => setTimeFilter("all")}
                  className={`px-2.5 py-1 text-xs rounded font-medium ${timeFilter === "all" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setTimeFilter("today")}
                  className={`px-2.5 py-1 text-xs rounded font-medium ${timeFilter === "today" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Hari Ini
                </button>
                <button
                  onClick={() => setTimeFilter("week")}
                  className={`px-2.5 py-1 text-xs rounded font-medium ${timeFilter === "week" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Minggu Ini
                </button>
              </div>
            </div>

            {/* Notification Cards */}
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center bg-card/40 border border-border/60 rounded-xl">
                <Inbox className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-base font-semibold text-foreground">Tidak ada notifikasi</h3>
                <p className="text-xs text-muted-foreground mt-1">Inbox Anda bersih atau filter tidak menemukan hasil.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notif) => {
                  const meta = getTypeMeta(notif.type);
                  const Icon = meta.icon;
                  const isUnread = notif.status === "unread";

                  return (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-xl border transition duration-150 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isUnread
                          ? "bg-card/95 border-rose-500/40 shadow-sm"
                          : "bg-card/60 border-border/70 opacity-90"
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Type Icon */}
                        <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${meta.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-foreground">{notif.title}</span>
                            {isUnread && (
                              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                            )}
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-card/70 text-foreground font-medium">
                              {getSourceAppLabel(notif.sourceApp)}
                            </span>
                          </div>

                          {notif.body && (
                            <p className="text-xs text-foreground leading-relaxed line-clamp-2">
                              {notif.body}
                            </p>
                          )}

                          <div className="text-[11px] text-muted-foreground pt-0.5">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} •{" "}
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </div>

                          {/* Actionable Quick Actions Buttons */}
                          {notif.quickActions && notif.quickActions.length > 0 && (
                            <div className="flex items-center gap-2 pt-2 flex-wrap">
                              {notif.quickActions.map((qa) => (
                                <button
                                  key={qa.id}
                                  onClick={() => handlePerformAction(notif.id, qa.id)}
                                  disabled={qa.performed}
                                  className={`px-3 py-1 rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5 ${
                                    qa.performed
                                      ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default"
                                      : qa.actionType === "approve"
                                      ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                                      : qa.actionType === "reject"
                                      ? "bg-rose-600 hover:bg-rose-500 text-white"
                                      : "bg-indigo-600 hover:bg-indigo-500 text-white"
                                  }`}
                                >
                                  {qa.performed ? (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      Tereksekusi
                                    </>
                                  ) : (
                                    qa.label
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Operations */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                        {isUnread ? (
                          <button
                            onClick={() => {
                              markAsRead(notif.id);
                              showToast("Ditandai sudah dibaca.");
                            }}
                            className="p-1.5 text-muted-foreground hover:text-emerald-400 hover:bg-card/60 rounded"
                            title="Tandai Sudah Dibaca"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              markAsUnread(notif.id);
                              showToast("Ditandai belum dibaca.");
                            }}
                            className="p-1.5 text-muted-foreground hover:text-rose-400 hover:bg-card/60 rounded"
                            title="Tandai Belum Dibaca"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {notif.status === "archived" ? (
                          <button
                            onClick={() => {
                              unarchiveNotification(notif.id);
                              showToast("Notifikasi dipindahkan kembali ke Inbox.");
                            }}
                            className="p-1.5 text-muted-foreground hover:text-sky-400 hover:bg-card/60 rounded"
                            title="Batal Arsip (Kembalikan ke Inbox)"
                          >
                            <Inbox className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              archiveNotification(notif.id);
                              showToast("Notifikasi diarsipkan.");
                            }}
                            className="p-1.5 text-muted-foreground hover:text-amber-400 hover:bg-card/60 rounded"
                            title="Arsipkan"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            deleteNotification(notif.id);
                            showToast("Notifikasi dihapus permanen.");
                          }}
                          className="p-1.5 text-muted-foreground hover:text-rose-400 hover:bg-card/60 rounded"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: SIMULASI EVENT NOTIFIKASI MASUK */}
      {isSimulateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Simulasi Inbound Notification
              </h3>
              <button
                onClick={() => setIsSimulateOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSimulateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Aplikasi Pengirim
                </label>
                <select
                  value={simApp}
                  onChange={(e) => setSimApp(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-rose-500"
                >
                  <option value="deliverable_manager">Deliverable Manager (#20)</option>
                  <option value="reminder_manager">Reminder Manager (#05)</option>
                  <option value="collaboration">Collaboration (#23)</option>
                  <option value="task_manager">Task Manager (#01)</option>
                  <option value="approval_manager">Approval Manager (#28)</option>
                  <option value="system">System Event</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Tipe Notifikasi
                </label>
                <select
                  value={simType}
                  onChange={(e) => setSimType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-rose-500"
                >
                  <option value="approval_request">Approval Request (dengan QuickAction)</option>
                  <option value="reminder">Reminder Trigger (dengan Complete Action)</option>
                  <option value="mention">Mention (@mention Comment)</option>
                  <option value="assignment">Assignment</option>
                  <option value="comment">Comment</option>
                  <option value="system">System Notification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Judul Notifikasi <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="mis. Permintaan Approval Proposal Biaya"
                  value={simTitle}
                  onChange={(e) => setSimTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Pesan / Detail
                </label>
                <textarea
                  rows={2}
                  placeholder="Detail isi notifikasi..."
                  value={simBody}
                  onChange={(e) => setSimBody(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsSimulateOpen(false)}
                  className="px-3.5 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white rounded-lg text-xs font-bold"
                >
                  Kirim ke Inbox
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
