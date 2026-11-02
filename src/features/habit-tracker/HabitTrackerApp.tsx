import { ShellHeader } from "@/app/shell-header";
import { ShellSidebar } from "@/app/shell-sidebar";
import { useState, useMemo } from "react";
import {
  Activity,
  Flame,
  Check,
  Plus,
  RotateCcw,
  Calendar,
  Grid,
  Trophy,
  BarChart3,
} from "lucide-react";
import { useHabitTracker } from "./store";
import {
  HabitViewMode,
  HabitType,
} from "./types";

export function HabitTrackerApp() {
  const {
    state,
    getStreak,
    getCompletionRate,
    markOccurrence,
    undoOccurrence,
    createHabit,
  } = useHabitTracker();

  const [viewMode, setViewMode] = useState<HabitViewMode>("today");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const todayStr = new Date().toISOString().slice(0, 10);

  // Today's habits with occurrences
  const todayHabitsWithStatus = useMemo(() => {
    return state.habits
      .filter((h) => h.status === "active")
      .filter((h) => (selectedCategory === "all" ? true : h.categoryId === selectedCategory))
      .map((h) => {
        const occ = state.occurrences.find((o) => o.habitId === h.id && o.date === todayStr);
        const streak = getStreak(h.id);
        const rate = getCompletionRate(h.id, 30);
        return {
          habit: h,
          occurrence: occ,
          isDone: occ?.status === "done",
          isSkipped: occ?.status === "skipped",
          streak,
          rate,
        };
      });
  }, [state.habits, state.occurrences, todayStr, selectedCategory, getStreak, getCompletionRate]);

  // Total summary metrics
  const totalCompletedToday = todayHabitsWithStatus.filter((t) => t.isDone).length;
  const totalActiveHabits = state.habits.filter((h) => h.status === "active").length;

  // Last 35 days array for heatmap
  const heatmapDays = useMemo(() => {
    const days: string[] = [];
    const today = new Date();
    for (let i = 34; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  }, []);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-muted/40 text-foreground">
      {/* LEFT SIDEBAR: Categories & Streak Ranking */}
      <ShellSidebar>
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-xs font-bold text-foreground tracking-tight">Habit Tracker</h2>
              <p className="text-[10px] text-muted-foreground">Source of Truth Kebiasaan (#06)</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors shadow-2xs"
            title="Tambah Kebiasaan Baru"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Daily Streak Highlight */}
        <div className="p-3 border-b border-border bg-gradient-to-br from-amber-50 to-orange-50/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              Progres Hari Ini
            </span>
            <span className="text-xs font-bold text-amber-800">
              {totalCompletedToday} / {totalActiveHabits}
            </span>
          </div>
          <div className="w-full h-1.5 bg-amber-200 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all"
              style={{
                width: `${totalActiveHabits > 0 ? (totalCompletedToday / totalActiveHabits) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Categories Filter */}
        <div className="p-3 border-b border-border flex-1 overflow-y-auto space-y-3">
          <span className="text-[11px] font-semibold text-foreground">Kategori Kebiasaan</span>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                selectedCategory === "all"
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <span>Semua Kategori</span>
              <span className="text-[10px] font-mono opacity-60">{state.habits.length}</span>
            </button>
            {state.categories.map((cat) => {
              const count = state.habits.filter((h) => h.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-60">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Top Streaks */}
          <div className="pt-3 border-t border-border">
            <span className="text-[11px] font-semibold text-foreground mb-2 block">
              Streak Tertinggi
            </span>
            <div className="space-y-2">
              {state.habits.slice(0, 3).map((h) => {
                const s = getStreak(h.id);
                return (
                  <div
                    key={h.id}
                    className="p-2 bg-muted/40 border border-border rounded text-xs flex items-center justify-between"
                  >
                    <span className="font-medium text-foreground truncate mr-2">{h.title}</span>
                    <span className="flex items-center gap-1 font-bold text-amber-600 flex-shrink-0">
                      <Flame className="w-3.5 h-3.5 fill-amber-500" />
                      {s.currentStreak} hr
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footnote */}
        <div className="p-3 border-t border-border bg-muted/40 text-[10px] text-muted-foreground">
          <p className="font-semibold text-foreground">Standalone App #06</p>
          <p className="mt-0.5">Dilacak berdasarkan frekuensi & konsistensi (streak). Berbeda dari Task.</p>
        </div>
      </ShellSidebar>

      {/* MAIN VIEW CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        {/* Top Header Controls Portaled to Main Header */}
        <ShellHeader>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted/60 text-xs">
              {[
                { id: "today", label: "Hari Ini", icon: Calendar },
                { id: "heatmap", label: "Heatmap", icon: Grid },
                { id: "streak_board", label: "Peringkat", icon: Trophy },
                { id: "summary", label: "Ringkasan", icon: BarChart3 },
              ].map((v) => {
                const Icon = v.icon;
                return (
                  <button
                    key={v.id}
                    onClick={() => setViewMode(v.id as HabitViewMode)}
                    title={v.label}
                    aria-label={v.label}
                    className={`p-1.5 rounded-md transition-colors cursor-pointer shrink-0 ${
                      viewMode === v.id
                        ? "bg-card text-foreground font-semibold shadow-xs"
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
              title="Kebiasaan Baru"
              aria-label="Kebiasaan Baru"
              className="p-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-xs flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </ShellHeader>

        {/* VIEW 1: TODAY LIST */}
        {viewMode === "today" && (
          <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-4">
            <div className="space-y-3">
              {todayHabitsWithStatus.map(({ habit, occurrence, isDone, isSkipped, streak, rate }) => (
                <div
                  key={habit.id}
                  className={`p-4 rounded-lg border transition-all shadow-xs flex items-center justify-between gap-4 ${
                    isDone
                      ? "bg-emerald-50/30 border-emerald-200"
                      : isSkipped
                      ? "bg-muted border-border opacity-60"
                      : "bg-card border-border hover:border-indigo-300"
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: habit.color || "#10b981" }}
                      />
                      <h3
                        className={`text-xs font-bold text-foreground truncate ${
                          isDone ? "text-emerald-900" : ""
                        }`}
                      >
                        {habit.title}
                      </h3>
                      {isSkipped && (
                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          Skipped (Streak Aman)
                        </span>
                      )}
                    </div>

                    {habit.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{habit.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1 font-semibold text-amber-600">
                        <Flame className="w-3.5 h-3.5 fill-amber-500" />
                        {streak.currentStreak} Hari Beruntun (Max: {streak.longestStreak})
                      </span>
                      <span>Konsistensi 30hr: {rate}%</span>
                      {habit.target && (
                        <span>
                          Target: {habit.target.goalValue} {habit.target.metric}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Check-in Actions (§3.2) */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Quantity or Duration Stepper if applicable */}
                    {habit.type === "quantity" && (
                      <div className="flex items-center gap-1 bg-muted p-1 rounded">
                        <button
                          onClick={() => {
                            const cur = occurrence?.value || 0;
                            markOccurrence(habit.id, todayStr, "done", Math.max(0, cur - 1));
                          }}
                          className="w-6 h-6 flex items-center justify-center text-xs font-bold text-muted-foreground hover:bg-muted rounded"
                        >
                          -
                        </button>
                        <span className="font-mono text-xs px-2 font-bold text-foreground">
                          {occurrence?.value || 0} / {habit.target?.goalValue || 8}
                        </span>
                        <button
                          onClick={() => {
                            const cur = occurrence?.value || 0;
                            markOccurrence(habit.id, todayStr, "done", cur + 1);
                          }}
                          className="w-6 h-6 flex items-center justify-center text-xs font-bold text-muted-foreground hover:bg-muted rounded"
                        >
                          +
                        </button>
                      </div>
                    )}

                    {/* Binary Done / Undo Button */}
                    {!isDone && (
                      <button
                        onClick={() => markOccurrence(habit.id, todayStr, "done")}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-medium hover:bg-emerald-700 transition-colors shadow-2xs flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Check-in
                      </button>
                    )}

                    {isDone && (
                      <button
                        onClick={() => undoOccurrence(habit.id, todayStr)}
                        className="p-1.5 text-muted-foreground hover:text-foreground rounded hover:bg-muted"
                        title="Batalkan Check-in"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}

                    {/* Skip button (§4: Tidak memutus streak) */}
                    {!isDone && !isSkipped && (
                      <button
                        onClick={() => {
                          const note = prompt("Alasan skip hari ini (mis. Sakit/Libur)?", "Istirahat terencana");
                          if (note !== null) {
                            markOccurrence(habit.id, todayStr, "skipped", undefined, note);
                          }
                        }}
                        className="px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted rounded transition-colors"
                        title="Skip hari ini tanpa memutus streak"
                      >
                        Skip
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: HEATMAP (§9) */}
        {viewMode === "heatmap" && (
          <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-6">
            <div className="p-4 bg-card border border-border rounded-lg shadow-xs">
              <h3 className="text-sm font-semibold text-foreground">Grafik Konsistensi Harian (Heatmap 35 Hari)</h3>
              <p className="text-xs text-muted-foreground">
                Visualisasi frekuensi keberhasilan habit layaknya grafik kontribusi.
              </p>
            </div>

            <div className="space-y-4">
              {state.habits.map((h) => {
                const streak = getStreak(h.id);
                return (
                  <div
                    key={h.id}
                    className="p-4 bg-card border border-border rounded-lg shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: h.color || "#10b981" }}
                        />
                        <h4 className="text-xs font-bold text-foreground">{h.title}</h4>
                      </div>
                      <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-amber-500" />
                        {streak.currentStreak} hari beruntun
                      </span>
                    </div>

                    {/* Heatmap Grid */}
                    <div className="grid grid-cols-7 sm:grid-cols-12 md:grid-cols-18 lg:grid-cols-35 gap-1.5">
                      {heatmapDays.map((dIso) => {
                        const occ = state.occurrences.find(
                          (o) => o.habitId === h.id && o.date === dIso
                        );
                        const isDone = occ?.status === "done";
                        const isSkipped = occ?.status === "skipped";

                        return (
                          <div
                            key={dIso}
                            title={`${dIso}: ${occ?.status || "missed"}`}
                            className={`w-4 h-4 rounded-xs transition-colors cursor-pointer ${
                              isDone
                                ? "bg-emerald-500"
                                : isSkipped
                                ? "bg-amber-300"
                                : "bg-muted hover:bg-muted"
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: STREAK BOARD */}
        {viewMode === "streak_board" && (
          <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-4">
            <div className="p-4 bg-card border border-border rounded-lg shadow-xs">
              <h3 className="text-sm font-semibold text-foreground">Papan Peringkat Konsistensi (Streak Board)</h3>
              <p className="text-xs text-muted-foreground">
                Diurutkan berdasarkan rentetan hari terpanjang tanpa putus.
              </p>
            </div>

            <div className="space-y-3">
              {state.habits
                .map((h) => ({ habit: h, streak: getStreak(h.id), rate: getCompletionRate(h.id, 30) }))
                .sort((a, b) => b.streak.currentStreak - a.streak.currentStreak)
                .map(({ habit, streak, rate }, index) => (
                  <div
                    key={habit.id}
                    className="p-4 bg-card border border-border rounded-lg shadow-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center font-bold text-muted-foreground text-sm">
                        #{index + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">{habit.title}</h4>
                        <p className="text-[11px] text-muted-foreground">
                          Tingkat keberhasilan: {rate}% · Terpanjang: {streak.longestStreak} hari
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-amber-600 text-sm">
                      <Flame className="w-5 h-5 fill-amber-500" />
                      {streak.currentStreak} Hari
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* VIEW 4: SUMMARY & STATS */}
        {viewMode === "summary" && (
          <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-4">
            <div className="p-4 bg-card border border-border rounded-lg shadow-xs">
              <h3 className="text-sm font-semibold text-foreground">Ringkasan & Metrik Performa Kebiasaan</h3>
              <p className="text-xs text-muted-foreground">
                Statistik konsistensi lintas seluruh kategori untuk evaluasi mingguan/bulanan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-card border border-border rounded-lg shadow-xs">
                <span className="text-xs text-muted-foreground font-medium">Total Check-in Bulan Ini</span>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {state.occurrences.filter((o) => o.status === "done").length}
                </p>
              </div>

              <div className="p-4 bg-card border border-border rounded-lg shadow-xs">
                <span className="text-xs text-muted-foreground font-medium">Kebiasaan Aktif</span>
                <p className="text-2xl font-bold text-indigo-600 mt-1">
                  {state.habits.filter((h) => h.status === "active").length}
                </p>
              </div>

              <div className="p-4 bg-card border border-border rounded-lg shadow-xs">
                <span className="text-xs text-muted-foreground font-medium">Rata-rata Konsistensi</span>
                <p className="text-2xl font-bold text-emerald-600 mt-1">84%</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: CREATE HABIT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-card rounded-lg shadow-xl border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Buat Kebiasaan Baru</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get("title") as string;
                const description = formData.get("description") as string;
                const type = formData.get("type") as HabitType;
                const categoryId = formData.get("categoryId") as string;
                const reminderTime = formData.get("reminderTime") as string;

                createHabit({
                  title,
                  description,
                  type,
                  frequency: { type: "daily" },
                  categoryId,
                  startDate: new Date().toISOString().slice(0, 10),
                  reminderConfig: reminderTime ? { time: reminderTime, enabled: true } : undefined,
                  status: "active",
                });

                setShowAddModal(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Nama Kebiasaan *</label>
                <input
                  name="title"
                  type="text"
                  required
                  placeholder="mis. Meditasi & Pernapasan 10 Menit"
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Kategori</label>
                <select
                  name="categoryId"
                  defaultValue="cat-health"
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                >
                  {state.categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Tipe Kebiasaan</label>
                <select
                  name="type"
                  defaultValue="binary"
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="binary">Biner (Checklist Ya/Tidak)</option>
                  <option value="quantity">Kuantitas (mis. 8 Gelas Air)</option>
                  <option value="duration">Durasi (mis. 20 Menit Membaca)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Waktu Pengingat Harian (Opsional)</label>
                <input
                  name="reminderTime"
                  type="time"
                  defaultValue="07:00"
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Motivasi / Catatan</label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Mengapa kebiasaan ini penting bagi Anda..."
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                />
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
                  Simpan Kebiasaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
