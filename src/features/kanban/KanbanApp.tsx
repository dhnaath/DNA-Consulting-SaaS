import { ShellHeader } from "@/app/shell-header";
import { ShellSidebar } from "@/app/shell-sidebar";
import { useState } from "react";
import {
  LayoutGrid,
  AlertTriangle,
  Inbox,
  Columns,
  List,
} from "lucide-react";
import { useKanbanBoard } from "./store";
import { KanbanViewMode, SwimlaneBy } from "./types";

export function KanbanApp() {
  const {
    activeBoard,
    columnTaskMap,
    moveCard,
    setSwimlane,
  } = useKanbanBoard();

  const [viewMode, setViewMode] = useState<KanbanViewMode>("board");

  // Swimlane groups

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background text-foreground">
      {/* LEFT SIDEBAR: Board Controls & WIP Summary */}
      <ShellSidebar>
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl gradient-primary shadow-md shadow-indigo-500/25 flex items-center justify-center text-white shrink-0">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-foreground tracking-tight">Kanban Board</h2>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-medium border border-border">
                Tanda Sementara
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">Lapisan Alur Kerja & WIP Limit (#09)</p>
          </div>
        </div>

        {/* Swimlane Selector (§6) */}
        <div className="p-4 border-b border-border space-y-2">
          <span className="text-[11px] font-semibold text-muted-foreground">Pengelompokan Swimlane</span>
          <select
            value={activeBoard.swimlaneBy}
            onChange={(e) => setSwimlane(e.target.value as SwimlaneBy)}
            className="w-full text-xs p-2 border border-border rounded-lg focus:ring-1 focus:ring-ring bg-muted text-foreground"
          >
            <option value="none">Tanpa Swimlane (Standar)</option>
            <option value="priority">Berdasarkan Prioritas</option>
            <option value="assignee">Berdasarkan Penanggung Jawab</option>
          </select>
        </div>

        {/* WIP Limit Overview (§4.2 & §9) */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          <span className="text-[11px] font-semibold text-muted-foreground">Utilisasi Batas WIP Kolom</span>
          <div className="space-y-2.5">
            {activeBoard.columns.map((col) => {
              const current = (columnTaskMap[col.id] || []).length;
              const max = col.wipLimit;
              const pct = max ? Math.min(100, Math.round((current / max) * 100)) : null;
              const isBottleneck = max !== null && current >= max;

              return (
                <div key={col.id} className="p-2.5 bg-muted/50 border border-border rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{col.name}</span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {current} {max ? `/ ${max}` : "(Bebas)"}
                    </span>
                  </div>

                  {max && (
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          isBottleneck ? "bg-destructive" : pct! > 70 ? "bg-amber-500" : "bg-primary"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}

                  {isBottleneck && (
                    <p className="text-[10px] text-destructive font-semibold flex items-center gap-1 mt-0.5">
                      <AlertTriangle className="w-3 h-3" />
                      Potensi Bottleneck Aliran
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footnote */}
        <div className="p-3 border-t border-border bg-muted/40 text-[10px] text-muted-foreground">
          <p className="font-semibold text-foreground">Standalone App #09</p>
          <p className="mt-0.5">Perpindahan card menulis balik ke Task Manager secara otomatis.</p>
        </div>
      </ShellSidebar>

      {/* MAIN KANBAN BOARD */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        {/* Top Header Actions */}
        <ShellHeader>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center border border-border/80 rounded-lg p-0.5 bg-muted/60 text-xs">
              {[
                { id: "board", label: "Papan Kolom", icon: Columns },
                { id: "compact", label: "Ringkas", icon: List },
              ].map((v) => {
                const Icon = v.icon;
                return (
                  <button
                    key={v.id}
                    onClick={() => setViewMode(v.id as KanbanViewMode)}
                    title={v.label}
                    aria-label={v.label}
                    className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
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
          </div>
        </ShellHeader>

        {/* Board Subheader */}
        <div className="px-6 py-3 border-b border-border bg-card/40 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-foreground tracking-tight">{activeBoard.name}</h1>
            <p className="text-xs text-muted-foreground">
              Visualisasi tahapan kerja dinamis dengan kendali aliran WIP limit.
            </p>
          </div>
        </div>

        {/* COLUMNS AREA */}
        <div className="flex-1 overflow-x-auto p-4 flex gap-4 items-start bg-muted/40">
          {activeBoard.columns.map((col) => {
            const colTasks = columnTaskMap[col.id] || [];
            const isFull = col.wipLimit !== null && colTasks.length >= col.wipLimit;

            return (
              <div
                key={col.id}
                className="w-72 flex-shrink-0 bg-card border border-border rounded-2xl shadow-sm flex flex-col max-h-[calc(100vh-145px)]"
              >
                {/* Column Header */}
                <div className="p-3 border-b border-border flex items-center justify-between bg-muted/50 rounded-t-2xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                    <h3 className="text-xs font-bold text-foreground">{col.name}</h3>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                      isFull
                        ? "bg-destructive/10 text-destructive border-destructive/30"
                        : "bg-card text-muted-foreground border-border"
                    }`}
                  >
                    {colTasks.length} {col.wipLimit ? `/${col.wipLimit}` : ""}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="p-2.5 flex-1 overflow-y-auto space-y-2">
                  {colTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
                      <Inbox className="w-6 h-6 opacity-40" />
                      <p className="text-xs italic">Kosong</p>
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-3 bg-card border border-border rounded-xl shadow-2xs hover:border-primary/50 transition-all space-y-2 ${
                          viewMode === "compact" ? "py-2" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-foreground line-clamp-2">{task.title}</h4>
                          <span className="text-[9px] font-bold uppercase px-1 py-0.5 rounded bg-muted text-muted-foreground flex-shrink-0">
                            {task.priority}
                          </span>
                        </div>

                        {viewMode !== "compact" && (
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>{task.dueAt ? new Date(task.dueAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "Tanpa Batas"}</span>
                            <span>{task.assigneeName || "Unassigned"}</span>
                          </div>
                        )}

                        {/* Column Relocator Controls (§13) */}
                        <div className="pt-1.5 border-t border-border flex items-center justify-between text-[10px]">
                          <span className="text-muted-foreground">Pindah ke:</span>
                          <div className="flex items-center gap-1">
                            {activeBoard.columns
                              .filter((c) => c.id !== col.id)
                              .map((c) => (
                                <button
                                  key={c.id}
                                  onClick={() => moveCard(task.id, c.id)}
                                  className="px-1.5 py-0.5 bg-muted hover:bg-accent hover:text-accent-foreground rounded text-muted-foreground font-medium transition-colors"
                                  title={`Pindahkan ke ${c.name}`}
                                >
                                  {c.name.slice(0, 3)}
                                </button>
                              ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
