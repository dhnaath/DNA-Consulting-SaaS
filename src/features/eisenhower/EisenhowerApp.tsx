import { ShellHeader } from "@/app/shell-header";
import { ShellSidebar } from "@/app/shell-sidebar";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Grid2X2,
  AlertOctagon,
  CheckCircle2,
  ChevronRight,
  List,
} from "lucide-react";
import { useEisenhowerMatrix, QUADRANT_DEFS } from "./store";
import { QuadrantKey, EisenhowerViewMode } from "./types";

export function EisenhowerApp() {
  const {
    state,
    classifiedTasks,
    setOverride,
    clearOverride,
    scheduleToPlanner,
    delegateTask,
    eliminateTask,
  } = useEisenhowerMatrix();

  const [viewMode, setViewMode] = useState<EisenhowerViewMode>("grid");
  const [selectedQuadrant, setSelectedQuadrant] = useState<QuadrantKey>("q1_do");

  // Ratios (§8)
  const totalClassified =
    classifiedTasks.q1_do.length +
    classifiedTasks.q2_schedule.length +
    classifiedTasks.q3_delegate.length +
    classifiedTasks.q4_eliminate.length;

  const q1Ratio = totalClassified > 0 ? Math.round((classifiedTasks.q1_do.length / totalClassified) * 100) : 0;
  const q2Ratio = totalClassified > 0 ? Math.round((classifiedTasks.q2_schedule.length / totalClassified) * 100) : 0;

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-muted/40 text-foreground">
      {/* LEFT SIDEBAR: Matrix Analytics & Health Indicators */}
      <ShellSidebar>
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-card border-2 border-border shadow-xs flex items-center justify-center text-foreground shrink-0">
            <Grid2X2 className="w-4 h-4 text-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-foreground tracking-tight">Eisenhower Matrix</h2>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-medium border border-border">
                Tanda Sementara
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">Lapisan Klasifikasi Urgensi & Kepentingan (#08)</p>
          </div>
        </div>

        {/* Matrix Health Indicator (§8) */}
        <div className="p-4 border-b border-border space-y-3 bg-muted/40/70">
          <span className="text-[11px] font-semibold text-foreground">Indikator Kesehatan Waktu</span>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground font-medium">Q1 (Pemadam Kebakaran):</span>
                <span className="font-bold text-red-600">{q1Ratio}% ({classifiedTasks.q1_do.length})</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-red-500 transition-all" style={{ width: `${q1Ratio}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground font-medium">Q2 (Kerja Terencana):</span>
                <span className="font-bold text-blue-600">{q2Ratio}% ({classifiedTasks.q2_schedule.length})</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all" style={{ width: `${q2Ratio}%` }} />
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-card border border-border rounded text-[11px] text-muted-foreground leading-snug">
            {q2Ratio >= q1Ratio ? (
              <p className="text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                Manajemen Sehat: Proporsi waktu Anda lebih banyak untuk perencanaan jangka panjang (Q2) daripada krisis mendesak.
              </p>
            ) : (
              <p className="text-amber-700 font-medium flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                Peringatan: Q1 terlalu tinggi. Banyak tugas ditunda hingga menjadi krisis mendesak.
              </p>
            )}
          </div>
        </div>

        {/* Rule Configurations (§3.3) */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          <span className="text-[11px] font-semibold text-foreground">Aturan Ambang Urgensi</span>
          <div className="p-3 bg-muted/40 border border-border rounded-lg text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Ambang Mendesak:</span>
              <span className="font-bold text-foreground font-mono">
                {state.rule.urgencyThresholdDays} Hari
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Tugas dengan batas waktu $\le 2$ hari otomatis dikategorikan Mendesak (Urgent).
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-foreground">Navigasi Kuadran Detail</span>
            {(Object.keys(QUADRANT_DEFS) as QuadrantKey[]).map((key) => {
              const def = QUADRANT_DEFS[key];
              const count = classifiedTasks[key].length;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedQuadrant(key);
                    setViewMode("detail");
                  }}
                  className="w-full p-2 text-left rounded border border-border hover:border-indigo-300 text-xs flex items-center justify-between transition-colors bg-card"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: def.color }} />
                    <span className="font-semibold text-foreground">{def.label}</span>
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footnote */}
        <div className="p-3 border-t border-border bg-muted/40 text-[10px] text-muted-foreground space-y-2">
          <div>
            <p className="font-semibold text-foreground">Standalone App #08</p>
            <p className="mt-0.5">Klasifikasi terstruktur tanpa mengubah data Task asli.</p>
          </div>
          <Link
            to="/framework/$slug"
            params={{ slug: "eisenhower-matrix" }}
            className="flex items-center justify-between p-2 rounded-lg bg-card border border-border text-[11px] font-medium text-foreground hover:bg-accent transition-colors"
          >
            <span>Teori & Worksheet Mini MBA</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          </Link>
        </div>
      </ShellSidebar>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        {/* Top Header View Switcher Portaled to Main Header */}
        <ShellHeader>
          <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted/60 text-xs shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              title="2x2 Grid View"
              aria-label="Grid View"
              className={`p-1.5 rounded-md transition-colors cursor-pointer shrink-0 ${
                viewMode === "grid"
                  ? "bg-card text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid2X2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("detail")}
              title="Detail Kuadran"
              aria-label="Detail Kuadran"
              className={`p-1.5 rounded-md transition-colors cursor-pointer shrink-0 ${
                viewMode === "detail"
                  ? "bg-card text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </ShellHeader>

        {/* VIEW 1: 2x2 GRID VIEW */}
        {viewMode === "grid" && (
          <div className="flex-1 p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(QUADRANT_DEFS) as QuadrantKey[]).map((key) => {
              const def = QUADRANT_DEFS[key];
              const taskList = classifiedTasks[key];

              return (
                <div
                  key={key}
                  className="bg-card border rounded-xl flex flex-col min-h-[300px] shadow-2xs overflow-hidden"
                  style={{ borderColor: `${def.color}40` }}
                >
                  {/* Quadrant Header */}
                  <div
                    className="p-3 border-b flex items-center justify-between"
                    style={{ backgroundColor: `${def.color}08`, borderColor: `${def.color}25` }}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: def.color }} />
                        <h3 className="text-xs font-bold text-foreground">{def.label}</h3>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{def.recommendedAction}</p>
                    </div>
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-card border border-border text-foreground">
                      {taskList.length}
                    </span>
                  </div>

                  {/* Task Cards Inside Quadrant */}
                  <div className="p-3 flex-1 overflow-y-auto space-y-2.5">
                    {taskList.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-10">Tidak ada tugas pada kuadran ini.</p>
                    ) : (
                      taskList.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 bg-card border border-border rounded-lg hover:border-indigo-300 transition-all shadow-2xs space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-semibold text-foreground line-clamp-2">{task.title}</h4>
                            <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground flex-shrink-0">
                              {task.priority}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>Deadline: {task.dueAt ? new Date(task.dueAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "Tidak Ada"}</span>
                            {task.assigneeName && <span>PJ: {task.assigneeName}</span>}
                          </div>

                          {/* Quick Actions (§11 & §12) */}
                          <div className="pt-1.5 border-t border-border flex items-center justify-between gap-1 text-[11px]">
                            {key === "q1_do" && (
                              <button
                                onClick={() => scheduleToPlanner(task)}
                                className="text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded font-medium transition-colors"
                              >
                                Kerjakan Sekarang
                              </button>
                            )}
                            {key === "q2_schedule" && (
                              <button
                                onClick={() => {
                                  scheduleToPlanner(task);
                                  alert(`Tugas "${task.title}" berhasil dialokasikan ke Planner (#04)!`);
                                }}
                                className="text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded font-medium transition-colors"
                              >
                                Jadwalkan ke Planner
                              </button>
                            )}
                            {key === "q3_delegate" && (
                              <button
                                onClick={() => {
                                  const assignee = prompt("Delegasikan tugas ini kepada:", "Junior Associate");
                                  if (assignee) delegateTask(task.id, assignee);
                                }}
                                className="text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded font-medium transition-colors"
                              >
                                Delegasikan
                              </button>
                            )}
                            {key === "q4_eliminate" && (
                              <button
                                onClick={() => {
                                  if (confirm("Batalkan / eliminasi tugas ini?")) eliminateTask(task.id);
                                }}
                                className="text-muted-foreground bg-muted hover:bg-red-50 hover:text-red-700 px-2 py-0.5 rounded font-medium transition-colors"
                              >
                                Eliminasi
                              </button>
                            )}

                            {/* Move manual override switcher */}
                            <select
                              defaultValue=""
                              onChange={(e) => {
                                if (e.target.value) setOverride(task.id, e.target.value as QuadrantKey);
                              }}
                              className="text-[10px] p-0.5 bg-muted/40 border border-border rounded text-muted-foreground"
                            >
                              <option value="">Pindah...</option>
                              <option value="q1_do">Ke Q1 (Do)</option>
                              <option value="q2_schedule">Ke Q2 (Schedule)</option>
                              <option value="q3_delegate">Ke Q3 (Delegate)</option>
                              <option value="q4_eliminate">Ke Q4 (Eliminate)</option>
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 2: QUADRANT DETAIL */}
        {viewMode === "detail" && (
          <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-4">
            <div className="p-4 bg-card border border-border rounded-lg shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{QUADRANT_DEFS[selectedQuadrant].label}</h3>
                <p className="text-xs text-muted-foreground">{QUADRANT_DEFS[selectedQuadrant].recommendedAction}</p>
              </div>
              <span className="text-xs font-bold font-mono px-3 py-1 bg-muted rounded text-foreground">
                {classifiedTasks[selectedQuadrant].length} Tugas
              </span>
            </div>

            <div className="space-y-2">
              {classifiedTasks[selectedQuadrant].map((task) => (
                <div
                  key={task.id}
                  className="p-4 bg-card border border-border rounded-lg shadow-xs flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-foreground">{task.title}</h4>
                    <p className="text-[11px] text-muted-foreground">
                      Prioritas: {task.priority} · Deadline: {task.dueAt || "Tidak ada"}
                    </p>
                  </div>
                  <button
                    onClick={() => clearOverride(task.id)}
                    className="text-[11px] text-muted-foreground hover:text-foreground underline"
                  >
                    Reset ke Otomatis
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
