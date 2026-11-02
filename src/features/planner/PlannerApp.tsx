import { ShellHeader } from "@/app/shell-header";
import { ShellSidebar } from "@/app/shell-sidebar";
import { useState, useMemo } from "react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Lock,
  RotateCcw,
  Zap,
  X,
  Trash2,
  MoveRight,
  Calendar,
  CalendarDays,
  Columns3,
} from "lucide-react";
import { usePlanner } from "./store";
import { TimeBlock, PlannerViewMode } from "./types";

export function PlannerApp() {
  const {
    state,
    workQueue,
    getCapacityForDate,
    createTimeBlock,
    updateTimeBlock,
    deleteTimeBlock,
    carryoverTimeBlock,
    commitDailyPlan,
    runAutoPlanning,
  } = usePlanner();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<PlannerViewMode>("daily");
  const [showAddBlockModal, setShowAddBlockModal] = useState<boolean>(false);
  const [selectedBlock, setSelectedBlock] = useState<TimeBlock | null>(null);

  const dateStr = currentDate.toISOString().slice(0, 10);
  const tomorrowStr = new Date(currentDate.getTime() + 86400000).toISOString().slice(0, 10);

  // Capacity calculation for selected date
  const capacity = useMemo(() => getCapacityForDate(dateStr), [getCapacityForDate, dateStr]);

  const isOverallocated = capacity.allocatedMinutes > capacity.availableMinutes;
  const overallocatedMinutes = Math.max(0, capacity.allocatedMinutes - capacity.availableMinutes);

  // TimeBlocks for selected date
  const dailyBlocks = useMemo(() => {
    return state.timeBlocks
      .filter((tb) => tb.startAt.slice(0, 10) === dateStr)
      .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  }, [state.timeBlocks, dateStr]);

  // Hourly slots (08:00 - 18:00)

  // Weekly days
  const weekDays = useMemo(() => {
    const curr = new Date(currentDate);
    const day = curr.getDay();
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(curr.setDate(diff));

    const list: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      list.push(d);
    }
    return list;
  }, [currentDate]);

  const handlePrevDay = () => {
    setCurrentDate(new Date(currentDate.getTime() - 86400000));
  };

  const handleNextDay = () => {
    setCurrentDate(new Date(currentDate.getTime() + 86400000));
  };

  const currentPlan = state.dailyPlans[dateStr];
  const isCommitted = currentPlan?.status === "committed";

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-muted/40 text-foreground">
      {/* LEFT SIDEBAR: WorkQueue (§5) */}
      <ShellSidebar>
        {/* WorkQueue Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <div>
              <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">WorkQueue (§5)</h2>
              <p className="text-[10px] text-muted-foreground">Tugas belum terjadwal dari Task Manager</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {workQueue.length}
          </span>
        </div>

        {/* Auto-Planning Trigger Banner (§10) */}
        <div className="p-3 border-b border-border bg-indigo-50/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-indigo-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Auto-Planning (Rule-Based)
            </span>
            <span className="text-[10px] text-indigo-600 font-mono">§10</span>
          </div>
          <p className="text-[11px] text-indigo-700 leading-snug mb-2">
            Tempatkan ritual tetap & urutkan tugas teratas ke slot kosong hari ini secara deterministik.
          </p>
          <button
            onClick={() => {
              const count = runAutoPlanning(dateStr);
              alert(`${count} TimeBlock berhasil dialokasikan secara otomatis ke jadwal hari ini!`);
            }}
            className="w-full py-1.5 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium transition-colors shadow-2xs flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            Jadwalkan Otomatis Hari Ini
          </button>
        </div>

        {/* WorkQueue Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {workQueue.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              Semua tugas aktif telah dialokasikan atau selesai.
            </div>
          ) : (
            workQueue.map((item) => (
              <div
                key={item.sourceId}
                className="p-3 bg-card border border-border rounded-lg hover:border-indigo-400 transition-all shadow-2xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-semibold text-foreground line-clamp-2">{item.title}</h4>
                  <span
                    className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded flex-shrink-0 ${
                      item.priority === "urgent"
                        ? "text-red-700 bg-red-50"
                        : item.priority === "high"
                        ? "text-orange-700 bg-orange-50"
                        : "text-muted-foreground bg-muted"
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.estimatedDuration} mnt
                  </span>
                  {item.dueAt && (
                    <span>Deadline: {new Date(item.dueAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                  )}
                </div>

                {/* Quick Allocate Button */}
                <button
                  onClick={() => {
                    const startH = 14;
                    const startIso = `${dateStr}T${String(startH).padStart(2, "0")}:00:00`;
                    const endIso = `${dateStr}T${String(startH + 1).padStart(2, "0")}:00:00`;
                    createTimeBlock({
                      sourceType: "task",
                      sourceId: item.sourceId,
                      title: item.title,
                      startAt: startIso,
                      endAt: endIso,
                      syncCompletion: true,
                    });
                  }}
                  className="w-full py-1 text-[11px] font-medium text-foreground bg-muted/40 hover:bg-muted border border-border rounded transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Alokasikan ke Hari Ini
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footnote */}
        <div className="p-3 border-t border-border bg-muted/40 text-[10px] text-muted-foreground">
          <p className="font-semibold text-foreground">Standalone App Ecosystem #04</p>
          <p className="mt-0.5">Time-first allocation layer. Mengorkestrasi Task & Calendar tanpa salinan data.</p>
        </div>
      </ShellSidebar>

      {/* MAIN PLANNER CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        {/* Top Header (Portaled to ShellHeader) */}
        <ShellHeader>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setCurrentDate(new Date())}
              title="Hari Ini"
              aria-label="Hari Ini"
              className="p-1.5 border border-border text-foreground rounded-lg hover:bg-accent transition-colors cursor-pointer shrink-0"
            >
              <Calendar className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center border border-border rounded-lg overflow-hidden shrink-0">
              <button
                onClick={handlePrevDay}
                title="Hari Sebelumnya"
                aria-label="Hari Sebelumnya"
                className="p-1.5 hover:bg-accent text-muted-foreground transition-colors cursor-pointer shrink-0"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNextDay}
                title="Hari Berikutnya"
                aria-label="Hari Berikutnya"
                className="p-1.5 hover:bg-accent text-muted-foreground transition-colors cursor-pointer shrink-0"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* View Tabs - Icon-Only Segmented Pills */}
            <div className="flex items-center gap-0.5 border border-border/60 rounded-lg p-0.5 bg-muted/70 text-xs shrink-0">
              {[
                { id: "daily", label: "Rencana Harian (Daily)", icon: CalendarDays },
                { id: "weekly", label: "Rencana Mingguan (Weekly)", icon: Columns3 },
                { id: "rituals", label: "Ritual Rutin", icon: Sparkles },
                { id: "carryover", label: "Carryover Tugas", icon: RotateCcw },
              ].map((v) => {
                const Icon = v.icon;
                return (
                  <button
                    key={v.id}
                    onClick={() => setViewMode(v.id as PlannerViewMode)}
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
              onClick={() => setShowAddBlockModal(true)}
              title="Tambah Blok Waktu"
              aria-label="Tambah Blok Waktu"
              className="p-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-xs flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </ShellHeader>

        {/* Planner Date Banner Subheader */}
        <div className="px-6 py-3.5 border-b border-border bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              {currentDate.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h1>
            {isCommitted ? (
              <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                <Lock className="w-3 h-3" />
                Terkunci
              </span>
            ) : (
              <button
                onClick={() => commitDailyPlan(dateStr)}
                className="px-2 py-0.5 text-[11px] font-medium border border-border rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                Kunci Rencana
              </button>
            )}
          </div>
        </div>

        {/* CAPACITY BAR & OVERALLOCATION WARNING (§4) */}
        <div className="px-6 py-3 border-b border-border bg-background/60">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-1.5">
            <span>Kapasitas Kerja Hari Ini (§4)</span>
            <span>
              {capacity.allocatedMinutes} mnt teralokasi / {capacity.availableMinutes} mnt tersedia
              {capacity.remainingMinutes >= 0 ? ` (sisa ${capacity.remainingMinutes} mnt)` : ""}
            </span>
          </div>

          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden flex">
            <div
              className={`h-full transition-all ${
                isOverallocated ? "bg-red-500" : "bg-indigo-600"
              }`}
              style={{
                width: `${Math.min(100, Math.round((capacity.allocatedMinutes / capacity.availableMinutes) * 100))}%`,
              }}
            />
          </div>

          {/* Overallocation Warning Alert */}
          {isOverallocated && (
            <div className="mt-2 p-2.5 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <p className="font-medium">
                Peringatan Kapasitas: Rencana hari ini melebihi kapasitas oleh {overallocatedMinutes} menit. Pertimbangkan carryover ke hari berikutnya.
              </p>
            </div>
          )}
        </div>

        {/* VIEW 1: DAILY PLAN */}
        {viewMode === "daily" && (
          <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-4">
            <div className="space-y-3">
              {dailyBlocks.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-card p-6 space-y-3">
                  <Clock className="w-10 h-10 text-foreground mx-auto" />
                  <p className="text-xs font-medium text-muted-foreground">Belum ada blok waktu yang dialokasikan untuk tanggal ini.</p>
                  <p className="text-[11px] text-muted-foreground">
                    Gunakan Auto-Planning di panel kiri atau buat TimeBlock secara manual.
                  </p>
                </div>
              ) : (
                dailyBlocks.map((block) => {
                  const isDone = block.status === "done";
                  const isSkipped = block.status === "skipped";
                  const isCarriedOver = block.status === "carried_over";

                  return (
                    <div
                      key={block.id}
                      className={`p-4 rounded-lg border transition-all shadow-xs flex items-start justify-between gap-4 ${
                        isDone
                          ? "bg-emerald-50/40 border-emerald-200"
                          : isSkipped
                          ? "bg-muted border-border opacity-60"
                          : isCarriedOver
                          ? "bg-amber-50/40 border-amber-200"
                          : "bg-card border-border hover:border-indigo-300"
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              block.sourceType === "ritual"
                                ? "bg-amber-500"
                                : block.sourceType === "task"
                                ? "bg-indigo-600"
                                : "bg-emerald-500"
                            }`}
                          />
                          <h3
                            className={`text-xs font-bold text-foreground truncate ${
                              isDone ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {block.title}
                          </h3>
                          <span className="text-[10px] uppercase font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {block.sourceType}
                          </span>
                        </div>

                        {block.notes && (
                          <p className="text-xs text-muted-foreground italic">{block.notes}</p>
                        )}

                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                          <span className="font-mono">
                            {new Date(block.startAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} -{" "}
                            {new Date(block.endAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <span>
                            (
                            {Math.round(
                              (new Date(block.endAt).getTime() - new Date(block.startAt).getTime()) / 60000
                            )}{" "}
                            mnt)
                          </span>
                          {block.syncCompletion && (
                            <span className="text-[10px] text-indigo-600">Sync: Task Manager</span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons (§3.2) */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {!isDone && (
                          <button
                            onClick={() => updateTimeBlock(block.id, { status: "done" })}
                            title="Tandai Selesai"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {isDone && (
                          <button
                            onClick={() => updateTimeBlock(block.id, { status: "planned" })}
                            title="Batal Selesai"
                            className="p-1.5 text-muted-foreground hover:bg-muted rounded"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}

                        {/* Carryover (§8) */}
                        <button
                          onClick={() => carryoverTimeBlock(block, tomorrowStr, "deprioritized")}
                          title="Pindahkan ke Besok (Carryover §8)"
                          className="p-1.5 text-amber-600 hover:bg-amber-100 rounded"
                        >
                          <MoveRight className="w-4 h-4" />
                        </button>

                        {/* Skip */}
                        <button
                          onClick={() => updateTimeBlock(block.id, { status: "skipped" })}
                          title="Lewati Hari Ini"
                          className="p-1.5 text-muted-foreground hover:bg-muted rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => deleteTimeBlock(block.id)}
                          title="Hapus TimeBlock"
                          className="p-1.5 text-red-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: WEEKLY PLAN */}
        {viewMode === "weekly" && (
          <div className="flex-1 overflow-x-auto p-6 flex gap-4">
            {weekDays.map((d, i) => {
              const dKey = d.toISOString().slice(0, 10);
              const dayBlocks = state.timeBlocks.filter((tb) => tb.startAt.slice(0, 10) === dKey);
              const isToday = d.toDateString() === new Date().toDateString();

              return (
                <div
                  key={dKey}
                  className="w-72 flex-shrink-0 bg-card border border-border rounded-lg flex flex-col max-h-[calc(100vh-250px)]"
                >
                  <div className="p-3 border-b border-border bg-muted/40 flex items-center justify-between">
                    <div>
                      <span className={`text-xs font-semibold ${isToday ? "text-indigo-600" : "text-foreground"}`}>
                        {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"][i]}
                      </span>
                      <p className="text-[10px] text-muted-foreground">{d.getDate()} {d.toLocaleString("id-ID", { month: "short" })}</p>
                    </div>
                    <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                      {dayBlocks.length} blok
                    </span>
                  </div>

                  <div className="p-2 space-y-2 flex-1 overflow-y-auto">
                    {dayBlocks.length === 0 ? (
                      <p className="text-[11px] text-foreground text-center py-6">Kosong</p>
                    ) : (
                      dayBlocks.map((b) => (
                        <div
                          key={b.id}
                          className="p-2 bg-muted/40 border border-border rounded text-xs space-y-1"
                        >
                          <p className="font-semibold text-foreground line-clamp-1">{b.title}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {new Date(b.startAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 3: RITUALS (§6) */}
        {viewMode === "rituals" && (
          <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-4">
            <div className="p-4 bg-card border border-border rounded-lg shadow-xs">
              <h3 className="text-sm font-semibold text-foreground">Ritual Tetap Berulang (§6)</h3>
              <p className="text-xs text-muted-foreground">
                Blok waktu tetap yang mengisi jadwal terlebih dahulu sebelum pekerjaan lain dialokasikan.
              </p>
            </div>

            <div className="space-y-3">
              {state.rituals.map((r) => (
                <div
                  key={r.id}
                  className="p-4 bg-card border border-border rounded-lg shadow-xs flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-foreground">{r.title}</h4>
                    <p className="text-[11px] text-muted-foreground">
                      Pukul {r.preferredStartTime} · Durasi {r.duration} menit · Pola: {r.recurrence.type}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      r.isFixed ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {r.isFixed ? "Fixed (Tidak Boleh Digeser)" : "Flexible"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: CARRYOVER AUDIT (§8) */}
        {viewMode === "carryover" && (
          <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-4">
            <div className="p-4 bg-card border border-border rounded-lg shadow-xs">
              <h3 className="text-sm font-semibold text-foreground">Riwayat Carryover Pekerjaan (§8)</h3>
              <p className="text-xs text-muted-foreground">
                Item yang belum selesai di akhir hari dan dialihkan ke tanggal berikutnya.
              </p>
            </div>

            <div className="space-y-3">
              {state.carryovers.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground bg-card border border-border rounded-lg">
                  Belum ada carryover yang tercatat.
                </div>
              ) : (
                state.carryovers.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 bg-card border border-border rounded-lg shadow-xs flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{c.title}</h4>
                      <p className="text-[11px] text-muted-foreground">
                        Dari tanggal {c.fromDate} ke {c.toDate} · Alasan: {c.reason}
                      </p>
                    </div>
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                      Carried Over
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ADD TIMEBLOCK */}
      {showAddBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-card rounded-lg shadow-xl border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Tambah Blok Waktu Manual</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get("title") as string;
                const startTime = formData.get("startTime") as string;
                const endTime = formData.get("endTime") as string;
                const notes = formData.get("notes") as string;

                createTimeBlock({
                  sourceType: "custom",
                  title,
                  startAt: `${dateStr}T${startTime}:00`,
                  endAt: `${dateStr}T${endTime}:00`,
                  notes,
                });

                setShowAddBlockModal(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Judul Pekerjaan *</label>
                <input
                  name="title"
                  type="text"
                  required
                  placeholder="mis. Review Kontrak Hukum"
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Mulai</label>
                  <input
                    name="startTime"
                    type="time"
                    defaultValue="10:00"
                    required
                    className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Selesai</label>
                  <input
                    name="endTime"
                    type="time"
                    defaultValue="11:30"
                    required
                    className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Catatan Konteks</label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Catatan pengerjaan..."
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBlockModal(false)}
                  className="px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Simpan Blok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
