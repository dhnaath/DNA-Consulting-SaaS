import { ShellHeader } from "@/app/shell-header";
import React, { useState, useEffect, useMemo } from "react";
import {
  Timer,
  Play,
  Square,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FolderKanban,
  BarChart3,
  Search,
  X,
  UserCheck,
  Zap,
  Trash2,
} from "lucide-react";
import { useTimeTrackerStore } from "./store";
import {
  TimeTrackerViewMode,
  LinkedItemType,
} from "./types";

export function TimeTrackerApp() {
  const {
    entries,
    timesheets,
    rateCards,
    isTimerRunning,
    timerStartTimestamp,
    timerNote,
    timerIsBillable,
    startTimer,
    stopTimer,
    logManualEntry,
    importFromFocusSession,
    deleteEntry,
    createWeeklyTimesheet,
    submitTimesheet,
    reviewTimesheet,
    addRateCard,
  } = useTimeTrackerStore();

  const [activeTab, setActiveTab] = useState<TimeTrackerViewMode>("timer");
  const [searchQuery, setSearchQuery] = useState("");
  const [billableFilter, setBillableFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live timer tick
  const [liveElapsedSeconds, setLiveElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerStartTimestamp) {
      interval = setInterval(() => {
        setLiveElapsedSeconds(Math.floor((Date.now() - timerStartTimestamp) / 1000));
      }, 1000);
    } else {
      setLiveElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerStartTimestamp]);

  // Timer inline form
  const [timerFormNote, setTimerFormNote] = useState("");
  const [timerFormType, setTimerFormType] = useState<LinkedItemType>("project");
  const [timerFormTitle, setTimerFormTitle] = useState("Project Enterprise v3");
  const [timerFormBillable, setTimerFormBillable] = useState(true);

  // Manual Log Modal
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualDuration, setManualDuration] = useState("60");
  const [manualNote, setManualNote] = useState("");
  const [manualType, setManualType] = useState<LinkedItemType>("project");
  const [manualTitle, setManualTitle] = useState("Project Enterprise v3");
  const [manualBillable, setManualBillable] = useState(true);
  const [manualDate, setManualDate] = useState(new Date().toISOString().split("T")[0]);

  // Focus Session Simulator Modal
  const [focusModalOpen, setFocusModalOpen] = useState(false);
  const [focusTaskTitle, setFocusTaskTitle] = useState("Audit Algoritma Cache & DB Index");
  const [focusMinutes, setFocusMinutes] = useState(90);

  // RateCard Modal
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [newRateRole, setNewRateRole] = useState("");
  const [newRateHourly, setNewRateHourly] = useState("750000");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const formatSeconds = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartTimer = (e: React.FormEvent) => {
    e.preventDefault();
    startTimer(
      timerFormNote.trim() || "Pekerjaan Tanpa Catatan",
      {
        sourceType: timerFormType,
        sourceId: `src-${Date.now()}`,
        title: timerFormTitle.trim(),
      },
      timerFormBillable
    );
    showToast("Timer resmi mulai berjalan!");
  };

  const handleStopTimer = () => {
    stopTimer();
    showToast("Timer dihentikan. TimeEntry tersimpan!");
  };

  const handleSaveManualLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualDuration || !manualNote.trim()) return;

    logManualEntry({
      durationMinutes: parseInt(manualDuration, 10),
      note: manualNote.trim(),
      linkedItem: {
        sourceType: manualType,
        sourceId: `src-${Date.now()}`,
        title: manualTitle.trim(),
      },
      isBillable: manualBillable,
      date: manualDate,
    });

    showToast("Entri waktu manual berhasil dicatat!");
    setManualModalOpen(false);
    setManualNote("");
  };

  const handleImportFocus = (e: React.FormEvent) => {
    e.preventDefault();
    importFromFocusSession(focusTaskTitle, Number(focusMinutes));
    showToast(`Focus session "${focusTaskTitle}" (${focusMinutes}m) berhasil diimpor!`);
    setFocusModalOpen(false);
  };

  const handleAddRateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRateRole.trim() || !newRateHourly) return;

    addRateCard({
      appliesTo: newRateRole.trim(),
      hourlyRate: parseInt(newRateHourly, 10),
      currency: "IDR",
      effectiveFrom: new Date().toISOString().split("T")[0],
    });

    showToast("RateCard baru tersimpan!");
    setRateModalOpen(false);
    setNewRateRole("");
  };

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      if (billableFilter === "billable" && !e.isBillable) return false;
      if (billableFilter === "non_billable" && e.isBillable) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNote = (e.note || "").toLowerCase().includes(q);
        const matchTitle = (e.linkedItem?.title || "").toLowerCase().includes(q);
        if (!matchNote && !matchTitle) return false;
      }
      return true;
    });
  }, [entries, billableFilter, searchQuery]);

  // Aggregation Statistics
  const stats = useMemo(() => {
    const totalMinutes = entries.reduce((acc, e) => acc + e.durationMinutes, 0);
    const billableMinutes = entries
      .filter((e) => e.isBillable)
      .reduce((acc, e) => acc + e.durationMinutes, 0);
    const billableRatio = totalMinutes > 0 ? Math.round((billableMinutes / totalMinutes) * 100) : 0;

    // By Project breakdown
    const projectMinutes: Record<string, number> = {};
    entries.forEach((e) => {
      const name = e.linkedItem?.title || "Umum / Non-Project";
      projectMinutes[name] = (projectMinutes[name] || 0) + e.durationMinutes;
    });

    // Billing estimate (using fallback rate of 750,000 IDR / hr)
    const primaryRate = rateCards[0]?.hourlyRate || 750000;
    const totalBillingIDR = Math.round((billableMinutes / 60) * primaryRate);

    return {
      totalHours: (totalMinutes / 60).toFixed(1),
      billableHours: (billableMinutes / 60).toFixed(1),
      billableRatio,
      projectMinutes,
      totalBillingIDR,
    };
  }, [entries, rateCards]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-400 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Actions Portaled to Main Header */}
      <ShellHeader>
        <div className="flex items-center gap-1 shrink-0">
          {/* Tab Switchers (Icon-Only) */}
          <div className="flex items-center gap-0.5 border border-border/60 rounded-lg p-0.5 bg-muted/70 text-xs shrink-0">
            <button
              onClick={() => setActiveTab("timer")}
              title={`Timer & Riwayat (${entries.length})`}
              aria-label="Timer & Riwayat"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "timer"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab("weekly_timesheet")}
              title="Timesheet Mingguan"
              aria-label="Timesheet Mingguan"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "weekly_timesheet"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            </button>
            <button
              onClick={() => setActiveTab("pending_approvals")}
              title={`Antrean Persetujuan (${timesheets.filter((t) => t.status === "submitted").length})`}
              aria-label="Antrean Persetujuan"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "pending_approvals"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            </button>
            <button
              onClick={() => setActiveTab("billing_summary")}
              title="Ringkasan Billing & Tarif"
              aria-label="Billing"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "billing_summary"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              title="Statistik Utilisasi"
              aria-label="Statistik"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "stats"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>

          <button
            onClick={() => setFocusModalOpen(true)}
            className="p-1.5 bg-card hover:bg-accent text-cyan-500 border border-border rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 flex items-center justify-center"
            title="Tarik sesi selesai dari Focus Timer #07"
            aria-label="Impor Sesi Focus Timer"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          <button
            onClick={() => setManualModalOpen(true)}
            title="Log Waktu Manual"
            aria-label="Log Waktu Manual"
            className="p-1.5 bg-primary text-primary-foreground hover:opacity-90 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer shrink-0 flex items-center justify-center"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </ShellHeader>

      {/* Main Content Area */}
      <div className="flex-1 mt-4">
        {/* STATS VIEW */}
        {activeTab === "stats" && (
          <div className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Total Jam Kerja</div>
                <div className="text-3xl font-extrabold text-white mt-1">{stats.totalHours} jam</div>
                <div className="text-xs text-muted-foreground mt-1">Dicatat resmi di sistem</div>
              </div>
              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Rasio Billable</div>
                <div className="text-3xl font-extrabold text-emerald-400 mt-1">{stats.billableRatio}%</div>
                <div className="text-xs text-muted-foreground mt-1">{stats.billableHours} jam dapat ditagihkan</div>
              </div>
              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Estimasi Billing</div>
                <div className="text-2xl font-extrabold text-cyan-400 mt-1">
                  Rp {(stats.totalBillingIDR / 1000000).toFixed(1)} Juta
                </div>
                <div className="text-xs text-muted-foreground mt-1">Berdasarkan RateCard resmi</div>
              </div>
              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Timesheet Terkirim</div>
                <div className="text-3xl font-extrabold text-amber-400 mt-1">{timesheets.length}</div>
                <div className="text-xs text-muted-foreground mt-1">Rekap periode mingguan</div>
              </div>
            </div>

            <div className="p-5 bg-card/60 border border-border rounded-xl">
              <h4 className="font-semibold text-foreground mb-3 text-sm flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-cyan-400" />
                Alokasi Waktu per Project / Entitas
              </h4>
              <div className="space-y-2">
                {Object.entries(stats.projectMinutes).map(([proj, mins]) => (
                  <div key={proj} className="flex items-center justify-between text-xs py-1 border-b border-border/40">
                    <span className="text-foreground">{proj}</span>
                    <span className="px-2 py-0.5 bg-card rounded text-foreground font-semibold">
                      {(mins / 60).toFixed(1)} jam ({mins} menit)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BILLING SUMMARY VIEW */}
        {activeTab === "billing_summary" && (
          <div className="space-y-6 max-w-4xl">
            <div className="p-5 bg-card/80 border border-border rounded-xl flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Daftar Tarif per Jam (RateCard)</h3>
                <p className="text-xs text-muted-foreground">
                  Tarif resmi yang dikalikan dengan jam billable untuk menghasilkan draf invoice ke klien.
                </p>
              </div>
              <button
                onClick={() => setRateModalOpen(true)}
                className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold"
              >
                + Tambah RateCard
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {rateCards.map((rc) => (
                <div key={rc.id} className="p-4 bg-card/60 border border-border rounded-xl space-y-2">
                  <div className="text-xs text-muted-foreground font-semibold">{rc.appliesTo}</div>
                  <div className="text-2xl font-black text-emerald-400">
                    Rp {rc.hourlyRate.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">/ jam</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">Berlaku sejak: {rc.effectiveFrom}</div>
                </div>
              ))}
            </div>

            <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <DollarSign className="w-5 h-5" />
                Total Nilai Billable yang Siap Ditagihkan (Ready to Bill)
              </div>
              <p className="text-xs text-foreground leading-relaxed">
                Seluruh <strong>{stats.billableHours} jam kerja billable</strong> setara dengan estimasi tagihan <strong>Rp {stats.totalBillingIDR.toLocaleString()}</strong>. Data ini dapat ditarik langsung oleh <em>Invoice Manager (#44)</em>.
              </p>
            </div>
          </div>
        )}

        {/* PENDING APPROVALS VIEW */}
        {activeTab === "pending_approvals" && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-4 bg-card/40 border border-border/60 rounded-xl text-xs text-muted-foreground">
              Review timesheet resmi sebelum difinalisasi untuk payroll dan penagihan klien.
            </div>

            {timesheets.length === 0 ? (
              <div className="p-12 text-center bg-card/40 border border-border/60 rounded-xl">
                <UserCheck className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Tidak ada timesheet dalam antrean.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {timesheets.map((ts) => (
                  <div key={ts.id} className="p-5 bg-card/80 border border-border rounded-xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-foreground">{ts.userName}</span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                              ts.status === "approved"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : ts.status === "rejected"
                                ? "bg-rose-500/20 text-rose-300"
                                : "bg-amber-500/20 text-amber-300"
                            }`}
                          >
                            {ts.status}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Periode: {ts.periodStart} s/d {ts.periodEnd} • {ts.entryIds.length} entri waktu
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xl font-black text-cyan-400">
                          {(ts.totalMinutes / 60).toFixed(1)} Jam
                        </span>
                        <div className="text-[11px] text-muted-foreground">{ts.totalMinutes} menit</div>
                      </div>
                    </div>

                    {ts.status === "submitted" && (
                      <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
                        <button
                          onClick={() => {
                            reviewTimesheet(ts.id, "rejected", "Manager", "Perlu revisi entri non-billable.");
                            showToast("Timesheet ditolak / diminta revisi.");
                          }}
                          className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold"
                        >
                          Tolak
                        </button>
                        <button
                          onClick={() => {
                            reviewTimesheet(ts.id, "approved", "Manager", "Disetujui untuk billing.");
                            showToast("Timesheet berhasil DISETUJUI!");
                          }}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                        >
                          Setujui Timesheet
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* WEEKLY TIMESHEET VIEW */}
        {activeTab === "weekly_timesheet" && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-4 bg-card/80 border border-border rounded-xl flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Timesheet Mingguan (Grid)</h3>
                <p className="text-xs text-muted-foreground">Rekap entri waktu per hari sepanjang minggu berjalan.</p>
              </div>
              <button
                onClick={() => {
                  const id = createWeeklyTimesheet(
                    "usr-01",
                    "Bambang Pamungkas",
                    "2026-09-18",
                    "2026-09-24"
                  );
                  submitTimesheet(id);
                  showToast("Timesheet mingguan berhasil di-compile & disubmit!");
                }}
                className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold shadow-md shadow-cyan-600/30"
              >
                Compile & Submit Minggu Ini
              </button>
            </div>

            <div className="overflow-x-auto bg-card/80 border border-border rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-background/60 border-b border-border text-muted-foreground">
                  <tr>
                    <th className="p-3">Project / Aktivitas</th>
                    <th className="p-3">Sen</th>
                    <th className="p-3">Sel</th>
                    <th className="p-3">Rab</th>
                    <th className="p-3">Kam</th>
                    <th className="p-3">Jum</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Tipe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {entries.map((e) => (
                    <tr key={e.id} className="hover:bg-card/30">
                      <td className="p-3 font-semibold text-foreground">
                        {e.linkedItem?.title || "Aktivitas Bebas"}
                        <div className="text-[10px] text-muted-foreground font-normal">{e.note}</div>
                      </td>
                      <td className="p-3 text-foreground">-</td>
                      <td className="p-3 text-foreground">{(e.durationMinutes / 60).toFixed(1)}h</td>
                      <td className="p-3 text-foreground">-</td>
                      <td className="p-3 text-foreground">-</td>
                      <td className="p-3 text-foreground">-</td>
                      <td className="p-3 font-bold text-cyan-400">{(e.durationMinutes / 60).toFixed(1)}h</td>
                      <td className="p-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            e.isBillable ? "bg-emerald-500/20 text-emerald-300" : "bg-card text-muted-foreground"
                          }`}
                        >
                          {e.isBillable ? "Billable" : "Internal"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TIMER & ENTRIES VIEW */}
        {activeTab === "timer" && (
          <div className="space-y-6">
            {/* ACTIVE TIMER WIDGET */}
            <div className="p-6 bg-gradient-to-r from-border to-border border border-border rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="size-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Clock className={`w-10 h-10 ${isTimerRunning ? "animate-pulse text-cyan-300" : ""}`} />
                </div>

                <div>
                  <div className="text-xs uppercase font-mono tracking-widest text-muted-foreground">
                    {isTimerRunning ? "Pencatatan Waktu Sedang Berjalan..." : "Timer Tidak Aktif"}
                  </div>
                  <div className="text-4xl md:text-5xl font-black font-mono tracking-tight text-white mt-1">
                    {formatSeconds(liveElapsedSeconds)}
                  </div>
                  {isTimerRunning && (
                    <div className="text-xs text-cyan-300 mt-1 flex items-center gap-2">
                      <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>{timerNote}</span>
                      <span className="text-muted-foreground">• {timerIsBillable ? "Billable" : "Non-billable"}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
                {!isTimerRunning ? (
                  <form onSubmit={handleStartTimer} className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <input
                      type="text"
                      placeholder="Apa yang sedang dikerjakan?"
                      value={timerFormNote}
                      onChange={(e) => setTimerFormNote(e.target.value)}
                      className="px-3 py-2 bg-background border border-border rounded-xl text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-cyan-500 flex-1 md:w-60"
                    />

                    <select
                      value={timerFormType}
                      onChange={(e) => setTimerFormType(e.target.value as any)}
                      className="px-2.5 py-2 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-cyan-500"
                    >
                      <option value="project">Project (#03)</option>
                      <option value="task">Task (#01)</option>
                      <option value="activity">Aktivitas Bebas</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setTimerFormBillable(!timerFormBillable)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border ${
                        timerFormBillable
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-card text-muted-foreground border-border"
                      }`}
                    >
                      {timerFormBillable ? "$ Billable" : "Internal"}
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-600/30"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Mulai Timer
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={handleStopTimer}
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    Hentikan & Simpan Jam
                  </button>
                )}
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-card/80 border border-border rounded-xl">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari entri waktu, task, project..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs md:text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <select
                  value={billableFilter}
                  onChange={(e) => setBillableFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">Semua Entri</option>
                  <option value="billable">Hanya Billable ($)</option>
                  <option value="non_billable">Hanya Non-billable</option>
                </select>
              </div>
            </div>

            {/* ENTRIES LIST */}
            <div className="space-y-3">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 bg-card/80 border border-border hover:border-border rounded-xl flex items-center justify-between gap-4 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">
                        {entry.linkedItem?.title || "Aktivitas Bebas"}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          entry.isBillable
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-card text-muted-foreground"
                        }`}
                      >
                        {entry.isBillable ? "Billable" : "Non-billable"}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-card/60 text-foreground text-[10px] capitalize">
                        {entry.source.replace("_", " ")}
                      </span>
                    </div>

                    <p className="text-xs text-foreground">{entry.note}</p>
                    <div className="text-[11px] text-muted-foreground">
                      Oleh {entry.userName} • {new Date(entry.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-lg font-black text-cyan-400">
                        {(entry.durationMinutes / 60).toFixed(1)} Jam
                      </div>
                      <div className="text-[11px] text-muted-foreground">{entry.durationMinutes} menit</div>
                    </div>

                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="p-2 text-muted-foreground hover:text-rose-400 rounded-lg hover:bg-card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: MANUAL TIME LOG */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-white">Log Entri Waktu Manual</h3>
              <button onClick={() => setManualModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualLog} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Durasi (Menit) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={manualDuration}
                  onChange={(e) => setManualDuration(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Deskripsi Pekerjaan <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="mis. Review arsitektur & code review PR #42"
                  value={manualNote}
                  onChange={(e) => setManualNote(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Tipe Entitas</label>
                  <select
                    value={manualType}
                    onChange={(e) => setManualType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-cyan-500"
                  >
                    <option value="project">Project (#03)</option>
                    <option value="task">Task (#01)</option>
                    <option value="activity">Aktivitas Bebas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Nama Project / Task</label>
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="manualBillableCheck"
                  checked={manualBillable}
                  onChange={(e) => setManualBillable(e.target.checked)}
                  className="size-4 accent-cyan-500 rounded"
                />
                <label htmlFor="manualBillableCheck" className="text-xs text-foreground font-medium">
                  Tandai sebagai waktu Billable (dapat ditagihkan ke klien)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setManualModalOpen(false)}
                  className="px-3.5 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold"
                >
                  Simpan Jam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: FOCUS SESSION SIMULATOR */}
      {focusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Zap className="w-4 h-4" />
                <span>Simulator Integrasi Focus Timer (#07)</span>
              </div>
              <button onClick={() => setFocusModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Mensimulasikan satu Focus Session yang baru saja selesai di Focus Timer (#07) untuk otomatis dikonversi menjadi entri resmi Time Tracker (legal-grade).
            </p>

            <form onSubmit={handleImportFocus} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Nama Task / Sesi</label>
                <input
                  type="text"
                  required
                  value={focusTaskTitle}
                  onChange={(e) => setFocusTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Durasi Bersih (Menit)</label>
                <input
                  type="number"
                  required
                  value={focusMinutes}
                  onChange={(e) => setFocusMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setFocusModalOpen(false)}
                  className="px-3.5 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold"
                >
                  Impor ke Time Tracker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RATE CARD */}
      {rateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-white">Tambah RateCard Baru</h3>
              <button onClick={() => setRateModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRateCard} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Role / Target Entitas <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="mis. Lead DevOps Engineer atau Klien Spesifik"
                  value={newRateRole}
                  onChange={(e) => setNewRateRole(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Tarif per Jam (IDR) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={newRateHourly}
                  onChange={(e) => setNewRateHourly(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setRateModalOpen(false)}
                  className="px-3.5 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold"
                >
                  Simpan RateCard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
