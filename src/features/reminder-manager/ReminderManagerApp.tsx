import { ShellHeader } from "@/app/shell-header";
import { ShellSidebar } from "@/app/shell-sidebar";
import { useState, useMemo } from "react";
import {
  Bell,
  Clock,
  MapPin,
  CheckCircle2,
  Plus,
  Send,
  History,
} from "lucide-react";
import { useReminderManager } from "./store";
import {
  ReminderViewMode,
  ReminderSourceApp,
  TriggerType,
} from "./types";

export function ReminderManagerApp() {
  const {
    state,
    dismissInstance,
    snoozeInstance,
    triggerManually,
    togglePauseRule,
    createRule,
  } = useReminderManager();

  const [viewMode, setViewMode] = useState<ReminderViewMode>("upcoming");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [filterSource, setFilterSource] = useState<string>("all");

  // Upcoming instances (pending)
  const upcomingInstances = useMemo(() => {
    return state.instances
      .filter((i) => i.status === "pending")
      .filter((i) => (filterSource === "all" ? true : i.sourceApp === filterSource))
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  }, [state.instances, filterSource]);

  // Snoozed instances
  const snoozedInstances = useMemo(() => {
    return state.instances.filter((i) => i.status === "snoozed");
  }, [state.instances]);

  // Delivered instances
  const deliveredInstances = useMemo(() => {
    return state.instances.filter((i) => i.status === "delivered");
  }, [state.instances]);

  // Source apps list
  const sourceApps: Array<{ id: ReminderSourceApp; label: string }> = [
    { id: "task_manager", label: "Task Manager (#01)" },
    { id: "calendar", label: "Calendar (#02)" },
    { id: "habit_tracker", label: "Habit Tracker (#06)" },
    { id: "custom", label: "Custom / Manual" },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-muted/40 text-foreground">
      {/* LEFT SIDEBAR: Source Filter & Delivery Stats */}
      <ShellSidebar>
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-xs font-bold text-foreground tracking-tight">Reminder Manager</h2>
              <p className="text-[10px] text-muted-foreground">Eksekusi Pengingat Terpusat (§0)</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors shadow-2xs"
            title="Tambah Aturan Pengingat"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Delivery Engine Metrics */}
        <div className="p-3 border-b border-border bg-muted/40/70 space-y-2">
          <span className="text-[11px] font-semibold text-foreground">Metrik Pengiriman Antrian</span>
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 bg-card border border-border rounded">
              <span className="text-base font-bold text-indigo-600">{upcomingInstances.length}</span>
              <p className="text-[10px] text-muted-foreground">Terjadwal</p>
            </div>
            <div className="p-2 bg-card border border-border rounded">
              <span className="text-base font-bold text-emerald-600">{deliveredInstances.length}</span>
              <p className="text-[10px] text-muted-foreground">Terkirim</p>
            </div>
          </div>
        </div>

        {/* Source App Filter */}
        <div className="p-3 border-b border-border flex-1 overflow-y-auto space-y-3">
          <span className="text-[11px] font-semibold text-foreground">Filter Sumber Aplikasi</span>
          <div className="space-y-1">
            <button
              onClick={() => setFilterSource("all")}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                filterSource === "all"
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <span>Semua Sumber</span>
              <span className="text-[10px] font-mono opacity-60">{state.instances.length}</span>
            </button>
            {sourceApps.map((src) => {
              const count = state.instances.filter((i) => i.sourceApp === src.id).length;
              return (
                <button
                  key={src.id}
                  onClick={() => setFilterSource(src.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                    filterSource === src.id
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <span className="truncate">{src.label}</span>
                  <span className="text-[10px] font-mono opacity-60">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Active Rules Mini List */}
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-foreground mb-2 block">
              Aturan Aktif ({state.rules.length})
            </span>
            <div className="space-y-1.5">
              {state.rules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-2 bg-muted/40 border border-border rounded text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground capitalize text-[11px]">
                      {rule.triggerType} Trigger
                    </span>
                    <button
                      onClick={() => togglePauseRule(rule.id)}
                      className="text-muted-foreground hover:text-foreground text-[10px] underline"
                    >
                      {rule.status === "active" ? "Pause" : "Resume"}
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">{rule.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footnote */}
        <div className="p-3 border-t border-border bg-muted/40 text-[10px] text-muted-foreground">
          <p className="font-semibold text-foreground">Standalone App #05</p>
          <p className="mt-0.5">Definisi pengingat tersebar, eksekusi pengiriman terpusat.</p>
        </div>
      </ShellSidebar>

      {/* MAIN VIEW CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        {/* Top Header */}
        <ShellHeader>
          <div className="flex items-center gap-1.5 shrink-0">
            {/* View Mode Switcher - Icon-Only */}
            <div className="flex items-center gap-0.5 border border-border/60 rounded-lg p-0.5 bg-muted/70 text-xs shrink-0">
              {[
                { id: "upcoming", label: "Mendatang", icon: Bell },
                { id: "snoozed", label: "Ditunda", icon: Clock },
                { id: "location", label: "Lokasi", icon: MapPin },
                { id: "logs", label: "Audit Log", icon: History },
              ].map((v) => {
                const Icon = v.icon;
                return (
                  <button
                    key={v.id}
                    onClick={() => setViewMode(v.id as ReminderViewMode)}
                    title={v.label}
                    aria-label={v.label}
                    className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                      viewMode === v.id
                        ? "bg-background text-foreground font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              title="Buat Pengingat Baru"
              aria-label="Buat Pengingat"
              className="p-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-xs flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </ShellHeader>

        {/* Reminder Title Subheader */}
        <div className="px-6 py-4 border-b border-border bg-background">
          <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight">Antrian Pengingat & Notifikasi</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Layanan scheduler & delivery terpusat untuk seluruh aplikasi ekosistem.
          </p>
        </div>

        {/* VIEW 1: UPCOMING REMINDERS */}
        {viewMode === "upcoming" && (
          <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-4">
            <div className="space-y-3">
              {upcomingInstances.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-card p-6 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <p className="text-xs font-medium text-foreground">Tidak ada pengingat tertunda saat ini.</p>
                  <p className="text-[11px] text-muted-foreground">Semua jadwal pengingat telah terkirim atau ditangguhkan.</p>
                </div>
              ) : (
                upcomingInstances.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-card border border-border rounded-lg shadow-xs hover:border-indigo-300 transition-all flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                          {item.sourceApp.replace("_", " ")}
                        </span>
                        <h3 className="text-xs font-bold text-foreground truncate">{item.title}</h3>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1 font-mono text-foreground">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          {new Date(item.scheduledAt).toLocaleString("id-ID", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span>Status: <strong className="text-amber-600 font-medium capitalize">{item.status}</strong></span>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Trigger Now (Debug/Test §3.2) */}
                      <button
                        onClick={() => triggerManually(item.ruleId)}
                        title="Kirim Sekarang (Test Trigger)"
                        className="px-2.5 py-1 text-[11px] font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded transition-colors flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        Kirim
                      </button>

                      {/* Snooze 15m (§7) */}
                      <button
                        onClick={() => snoozeInstance(item.id, 15)}
                        title="Tunda 15 Menit (Snooze)"
                        className="px-2.5 py-1 text-[11px] font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 rounded transition-colors"
                      >
                        Snooze 15m
                      </button>

                      {/* Dismiss */}
                      <button
                        onClick={() => dismissInstance(item.id)}
                        title="Tutup / Dismiss"
                        className="p-1.5 text-muted-foreground hover:text-foreground rounded hover:bg-muted"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: SNOOZED */}
        {viewMode === "snoozed" && (
          <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-4">
            <div className="p-4 bg-card border border-border rounded-lg shadow-xs">
              <h3 className="text-sm font-semibold text-foreground">Pengingat Ditunda (Snoozed §7)</h3>
              <p className="text-xs text-muted-foreground">
                Pengingat yang sengaja ditunda dan akan dijadwalkan ulang sesuai waktu tunda.
              </p>
            </div>

            <div className="space-y-3">
              {snoozedInstances.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground bg-card border border-border rounded-lg">
                  Tidak ada pengingat yang sedang ditunda.
                </div>
              ) : (
                snoozedInstances.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-card border border-border rounded-lg shadow-xs flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                      <p className="text-[11px] text-amber-700 mt-0.5">
                        Ditunda sampai: {item.snoozeUntil ? new Date(item.snoozeUntil).toLocaleTimeString("id-ID") : "-"}
                      </p>
                    </div>
                    <button
                      onClick={() => dismissInstance(item.id)}
                      className="px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted rounded"
                    >
                      Batalkan Penundaan
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: LOCATION-BASED */}
        {viewMode === "location" && (
          <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-4">
            <div className="p-4 bg-card border border-border rounded-lg shadow-xs">
              <h3 className="text-sm font-semibold text-foreground">Pengingat Berbasis Geofence / Lokasi (§4)</h3>
              <p className="text-xs text-muted-foreground">
                Notifikasi dipicu saat pengguna memasuki atau meninggalkan radius koordinat tertentu.
              </p>
            </div>

            <div className="space-y-3">
              {state.rules
                .filter((r) => r.triggerType === "location")
                .map((r) => (
                  <div
                    key={r.id}
                    className="p-4 bg-card border border-border rounded-lg shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose-500" />
                        <h4 className="text-xs font-bold text-foreground">
                          {r.triggerConfig.locationName || "Titik Koordinat Geofence"}
                        </h4>
                      </div>
                      <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                        Radius {r.triggerConfig.radiusMeters || 200}m
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground bg-muted/40 p-2.5 rounded border border-border">
                      {r.message}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Pemicu: Saat Memasuki Area (Enter)</span>
                      <button
                        onClick={() => triggerManually(r.id)}
                        className="text-xs text-indigo-600 hover:underline font-medium"
                      >
                        Simulasikan Masuk Lokasi
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* VIEW 4: AUDIT LOGS */}
        {viewMode === "logs" && (
          <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-4">
            <div className="p-4 bg-card border border-border rounded-lg shadow-xs">
              <h3 className="text-sm font-semibold text-foreground">Audit Trail Riwayat Pengiriman (§8)</h3>
              <p className="text-xs text-muted-foreground">
                Log append-only pelacakan pengiriman notifikasi, kegagalan channel, dan respon pengguna.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg divide-y divide-border">
              {state.logs.map((log) => (
                <div key={log.id} className="p-3 text-xs flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-foreground capitalize">{log.event}</span>
                    <p className="text-[10px] text-muted-foreground font-mono">ID: {log.instanceId}</p>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {new Date(log.timestamp).toLocaleTimeString("id-ID")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL: CREATE REMINDER RULE (§3.2) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-card rounded-lg shadow-xl border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Buat Pengingat Baru</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const message = formData.get("message") as string;
                const triggerType = formData.get("triggerType") as TriggerType;
                const time = formData.get("time") as string;
                const date = formData.get("date") as string;

                const triggerAt = date && time ? new Date(`${date}T${time}:00`).toISOString() : undefined;

                createRule({
                  sourceApp: "custom",
                  triggerType,
                  triggerConfig: { triggerAt },
                  channels: ["in_app", "push"],
                  message,
                });

                setShowAddModal(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Pesan Pengingat *</label>
                <textarea
                  name="message"
                  required
                  rows={2}
                  placeholder="mis. Jangan lupa kirim faktur pajak ke divisi keuangan"
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Jenis Pemicu (Trigger)</label>
                <select
                  name="triggerType"
                  defaultValue="absolute"
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="absolute">Waktu Spesifik (Absolute Time)</option>
                  <option value="relative">Relatif Terhadap Deadline</option>
                  <option value="location">Radius Lokasi (Geofence)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Tanggal</label>
                  <input
                    name="date"
                    type="date"
                    defaultValue={new Date().toISOString().slice(0, 10)}
                    required
                    className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Jam</label>
                  <input
                    name="time"
                    type="time"
                    defaultValue="14:00"
                    required
                    className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Simpan Pengingat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
