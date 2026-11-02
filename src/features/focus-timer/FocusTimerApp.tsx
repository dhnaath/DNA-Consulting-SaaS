import { ShellHeader } from "@/app/shell-header";
import { ShellSidebar } from "@/app/shell-sidebar";
import { useState, useEffect } from "react";
import {
  Timer,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  Link as LinkIcon,
  History,
  CheckSquare,
} from "lucide-react";
import { useFocusTimer } from "./store";
import { FocusMode, FocusTimerViewMode } from "./types";

export function FocusTimerApp() {
  const {
    state,
    tasks,
    activeSession,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    stopSessionEarly,
    logInterruption,
    extendSession,
  } = useFocusTimer();

  const [viewMode, setViewMode] = useState<FocusTimerViewMode>("timer");
  const [selectedMode, setSelectedMode] = useState<FocusMode>("pomodoro");
  const [targetMinutes, setTargetMinutes] = useState<number>(25);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);

  // Sync remaining seconds with active session
  useEffect(() => {
    if (!activeSession) {
      setSecondsRemaining(targetMinutes * 60);
      return;
    }

    if (activeSession.status === "running") {
      const interval = setInterval(() => {
        const start = new Date(activeSession.startedAt).getTime();
        const now = Date.now();
        const elapsed = Math.round((now - start) / 1000);
        const rem = Math.max(0, activeSession.plannedDuration - elapsed);
        setSecondsRemaining(rem);

        if (rem === 0 && activeSession.mode !== "stopwatch") {
          completeSession(activeSession.id);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [activeSession, targetMinutes, completeSession]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Metrics
  const totalCompleted = state.sessions.filter((s) => s.status === "completed").length;
  const totalAbandoned = state.sessions.filter((s) => s.status === "abandoned").length;
  const totalFocusSeconds = state.sessions
    .filter((s) => s.status === "completed")
    .reduce((acc, s) => acc + s.actualDuration, 0);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-muted/40 text-foreground">
      {/* LEFT SIDEBAR: Presets & Task Linking */}
      <ShellSidebar>
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-card border-2 border-border shadow-xs flex items-center justify-center text-foreground shrink-0">
            <Timer className="w-4 h-4 text-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-foreground tracking-tight">Focus Timer</h2>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-medium border border-border">
                Tanda Sementara
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">Eksekusi Sesi Fokus Real-Time (#07)</p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="p-4 border-b border-border space-y-3">
          <span className="text-[11px] font-semibold text-foreground">Pilih Mode Kerja</span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "pomodoro", label: "Pomodoro (25m)", min: 25 },
              { id: "deep_work", label: "Deep Work (90m)", min: 90 },
              { id: "countdown", label: "Sprint (15m)", min: 15 },
              { id: "stopwatch", label: "Stopwatch", min: 60 },
            ].map((m) => (
              <button
                key={m.id}
                disabled={!!activeSession}
                onClick={() => {
                  setSelectedMode(m.id as FocusMode);
                  setTargetMinutes(m.min);
                  setSecondsRemaining(m.min * 60);
                }}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                  selectedMode === m.id
                    ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 font-semibold shadow-2xs"
                    : "border-border hover:bg-muted/40 text-foreground"
                } ${activeSession ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <p className="font-semibold text-xs">{m.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">{m.id.replace("_", " ")}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Link to Task Manager (#01) */}
        <div className="p-4 border-b border-border space-y-2">
          <span className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-indigo-600" />
            Tautkan ke Task (#01)
          </span>
          <select
            disabled={!!activeSession}
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500 bg-muted/40"
          >
            <option value="">-- Fokus Umum (Tanpa Task) --</option>
            {tasks
              .filter((t) => t.status !== "completed")
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
          </select>
          <p className="text-[10px] text-muted-foreground">
            Durasi fokus akan dicatat dan status task dapat diperbarui otomatis setelah sesi.
          </p>
        </div>

        {/* Quick Stats Summary */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          <span className="text-[11px] font-semibold text-foreground">Performa Fokus Hari Ini</span>
          <div className="space-y-2">
            <div className="p-2.5 bg-muted/40 border border-border rounded flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total Waktu Selesai:</span>
              <span className="font-bold text-foreground font-mono">
                {Math.round(totalFocusSeconds / 60)} Menit
              </span>
            </div>
            <div className="p-2.5 bg-muted/40 border border-border rounded flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Selesai vs Batal:</span>
              <span className="font-bold text-emerald-600">
                {totalCompleted} / {totalCompleted + totalAbandoned}
              </span>
            </div>
          </div>
        </div>

        {/* Footnote */}
        <div className="p-3 border-t border-border bg-muted/40 text-[10px] text-muted-foreground">
          <p className="font-semibold text-foreground">Standalone App Ecosystem #07</p>
          <p className="mt-0.5">Eksekusi fokus real-time. Interupsi dicatat sebagai data kualitas fokus.</p>
        </div>
      </ShellSidebar>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        {/* Top Header Controls Portaled to Main Header */}
        <ShellHeader>
          <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted/60 text-xs">
            {[
              { id: "timer", label: "Timer Aktif", icon: Timer },
              { id: "history", label: "Riwayat Sesi", icon: History },
              { id: "by_linked", label: "Per Task", icon: CheckSquare },
              { id: "interruptions", label: "Log Interupsi", icon: AlertTriangle },
            ].map((v) => {
              const Icon = v.icon;
              return (
                <button
                  key={v.id}
                  onClick={() => setViewMode(v.id as FocusTimerViewMode)}
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
        </ShellHeader>

        {/* VIEW 1: ACTIVE TIMER */}
        {viewMode === "timer" && (
          <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center max-w-2xl mx-auto w-full space-y-6">
            {/* Target Task Banner if linked */}
            {activeSession?.linkedItem ? (
              <div className="px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full text-xs text-indigo-700 font-medium flex items-center gap-2 shadow-2xs">
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Target: <strong>{activeSession.linkedItem.title || "Tugas Tertaut"}</strong></span>
              </div>
            ) : selectedTaskId ? (
              <div className="px-4 py-2 bg-muted border border-border rounded-full text-xs text-muted-foreground font-medium flex items-center gap-2">
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Target Terpilih: {tasks.find((t) => t.id === selectedTaskId)?.title}</span>
              </div>
            ) : null}

            {/* Giant Clock Face */}
            <div className="w-72 h-72 rounded-full border-8 border-indigo-50 bg-gradient-to-b from-white to-border shadow-lg flex flex-col items-center justify-center relative">
              <span className="text-6xl font-bold font-mono tracking-tighter text-foreground">
                {formatTime(secondsRemaining)}
              </span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground mt-2 font-semibold">
                {activeSession ? activeSession.mode.replace("_", " ") : selectedMode.replace("_", " ")}
              </span>
              {activeSession && (
                <span className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {activeSession.status === "paused" ? "Dijeda (Paused)" : "Sedang Berjalan"}
                </span>
              )}
            </div>

            {/* Main Controls (§3.2) */}
            <div className="flex items-center gap-3">
              {!activeSession ? (
                <button
                  onClick={() => {
                    const task = tasks.find((t) => t.id === selectedTaskId);
                    startSession(
                      selectedMode,
                      targetMinutes,
                      task ? { sourceType: "task", sourceId: task.id, title: task.title } : undefined
                    );
                  }}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-md transition-all flex items-center gap-2"
                >
                  <Play className="w-5 h-5 fill-white" />
                  Mulai Sesi Fokus
                </button>
              ) : (
                <>
                  {activeSession.status === "running" ? (
                    <button
                      onClick={() => pauseSession(activeSession.id)}
                      className="px-5 py-2.5 bg-foreground hover:bg-foreground text-background rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Pause className="w-4 h-4 fill-white" />
                      Jeda
                    </button>
                  ) : (
                    <button
                      onClick={() => resumeSession(activeSession.id)}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      Lanjutkan
                    </button>
                  )}

                  {/* Complete */}
                  <button
                    onClick={() => {
                      const sync = confirm("Tandai Task tertaut sebagai SELESAI di Task Manager juga?");
                      completeSession(activeSession.id, undefined, sync);
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Selesai
                  </button>

                  {/* Stop Early (Abandoned §3.2) */}
                  <button
                    onClick={() => {
                      if (confirm("Hentikan sesi lebih awal? Sesi akan dicatat sebagai Abandoned.")) {
                        stopSessionEarly(activeSession.id);
                      }
                    }}
                    className="px-4 py-2.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 rounded-lg text-xs font-medium transition-all"
                  >
                    Hentikan Awal
                  </button>

                  {/* Log Interruption Button (§6) */}
                  <button
                    onClick={() => {
                      const reason = prompt("Apa alasan interupsi / gangguan?", "Notifikasi mendadak");
                      if (reason) logInterruption(activeSession.id, reason);
                    }}
                    className="p-2.5 text-amber-600 hover:bg-amber-50 rounded-lg border border-amber-200 text-xs flex items-center gap-1"
                    title="Catat Gangguan (Log Interruption)"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Interupsi
                  </button>

                  {/* Extend Session */}
                  <button
                    onClick={() => extendSession(activeSession.id, 5)}
                    className="px-3 py-2 text-muted-foreground hover:bg-muted rounded text-xs border border-border"
                    title="Tambah 5 Menit"
                  >
                    +5m
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: HISTORY */}
        {viewMode === "history" && (
          <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-4">
            <div className="p-4 bg-card border border-border rounded-lg shadow-xs">
              <h3 className="text-sm font-semibold text-foreground">Riwayat Sesi Fokus Lampau</h3>
              <p className="text-xs text-muted-foreground">
                Daftar rekaman durasi aktual, status keberhasilan, dan refleksi pasca sesi.
              </p>
            </div>

            <div className="space-y-3">
              {state.sessions.map((s) => (
                <div
                  key={s.id}
                  className="p-4 bg-card border border-border rounded-lg shadow-xs flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                          s.status === "completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {s.status}
                      </span>
                      <h4 className="text-xs font-bold text-foreground">
                        {s.linkedItem?.title || "Sesi Fokus Umum"}
                      </h4>
                    </div>

                    {s.note && (
                      <p className="text-xs text-muted-foreground italic bg-muted/40 p-2 rounded">
                        "{s.note}"
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span>Mulai: {new Date(s.startedAt).toLocaleTimeString("id-ID")}</span>
                      <span>Durasi: {Math.round(s.actualDuration / 60)} menit</span>
                      {s.interruptions.length > 0 && (
                        <span className="text-amber-600 font-medium">
                          {s.interruptions.length} Interupsi
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-foreground">
                    {s.mode.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: BY LINKED ITEM */}
        {viewMode === "by_linked" && (
          <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-4">
            <div className="p-4 bg-card border border-border rounded-lg shadow-xs">
              <h3 className="text-sm font-semibold text-foreground">Agregasi Waktu Fokus Per Task / Habit</h3>
              <p className="text-xs text-muted-foreground">
                Total alokasi waktu nyata yang dihabiskan untuk menyelesaikan masing-masing tugas.
              </p>
            </div>

            <div className="space-y-3">
              {tasks.map((t) => {
                const taskSessions = state.sessions.filter(
                  (s) => s.linkedItem?.sourceId === t.id && s.status === "completed"
                );
                const totalSeconds = taskSessions.reduce((acc, s) => acc + s.actualDuration, 0);

                if (taskSessions.length === 0) return null;

                return (
                  <div
                    key={t.id}
                    className="p-4 bg-card border border-border rounded-lg shadow-xs flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{t.title}</h4>
                      <p className="text-[11px] text-muted-foreground">
                        {taskSessions.length} sesi fokus terselesaikan
                      </p>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 font-mono">
                      {Math.round(totalSeconds / 60)} Menit
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 4: INTERRUPTION LOG */}
        {viewMode === "interruptions" && (
          <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-4">
            <div className="p-4 bg-card border border-border rounded-lg shadow-xs">
              <h3 className="text-sm font-semibold text-foreground">Daftar Gangguan & Interupsi (§6)</h3>
              <p className="text-xs text-muted-foreground">
                Pencatatan jeda untuk menganalisis dan mengeliminasi pola distraksi saat jam kerja fokus.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg divide-y divide-border">
              {state.sessions
                .flatMap((s) => s.interruptions)
                .map((int) => (
                  <div key={int.id} className="p-3 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-foreground">
                        {int.reason || "Interupsi tidak dijelaskan"}
                      </span>
                      <p className="text-[10px] text-muted-foreground">Sesi ID: {int.sessionId}</p>
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {new Date(int.startedAt).toLocaleTimeString("id-ID")}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
