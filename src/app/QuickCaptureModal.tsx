import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressiveBlur } from "@/components/ProgressiveBlur";
import { useProgressiveBlurSetting } from "@/hooks/useProgressiveBlurSetting";
import { getRaw, setRaw } from "../core/rawStorage";
import {
  CheckSquare,
  DollarSign,
  FileText,
  Heart,
  X,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

type CaptureTab = "task" | "transaction" | "note" | "habit";

export function QuickCaptureModal({
  isOpen,
  onClose,
  onSuccess,
}: QuickCaptureModalProps) {
  const { config: blurConfig, blurLevels } = useProgressiveBlurSetting();
  const [tab, setTab] = useState<CaptureTab>("task");

  // Task form state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState<"Tinggi" | "Sedang" | "Rendah">("Sedang");
  const [taskCategory, setTaskCategory] = useState("Strategi");

  // Transaction form state
  const [txType, setTxType] = useState<"earning" | "expense">("expense");
  const [txTitle, setTxTitle] = useState("");
  const [txAmount, setTxAmount] = useState("");
  const [txCategory, setTxCategory] = useState("Operasional");

  // Note form state
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  // Habit form state
  const [habitName, setHabitName] = useState("");

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (tab === "task") {
        if (!taskTitle.trim()) return;
        const currentTasks = JSON.parse(getRaw("aio_quick_tasks") || "[]");
        const newTask = {
          id: crypto.randomUUID(),
          title: taskTitle.trim(),
          priority: taskPriority,
          category: taskCategory,
          completed: false,
          createdAt: new Date().toISOString(),
        };
        setRaw("aio_quick_tasks", JSON.stringify([newTask, ...currentTasks]));
        window.dispatchEvent(new Event("aio_data_updated"));
        onSuccess?.("Tugas berhasil ditambahkan!");
        setTaskTitle("");
      } else if (tab === "transaction") {
        if (!txTitle.trim() || !txAmount) return;
        const currentTxs = JSON.parse(getRaw("aio_quick_transactions") || "[]");
        const newTx = {
          id: crypto.randomUUID(),
          title: txTitle.trim(),
          amount: parseFloat(txAmount.replace(/[^0-9]/g, "")) || 0,
          type: txType,
          category: txCategory,
          date: new Date().toISOString().split("T")[0],
        };
        setRaw("aio_quick_transactions", JSON.stringify([newTx, ...currentTxs]));
        window.dispatchEvent(new Event("aio_data_updated"));
        onSuccess?.("Transaksi berhasil dicatat!");
        setTxTitle("");
        setTxAmount("");
      } else if (tab === "note") {
        if (!noteTitle.trim()) return;
        const currentNotes = JSON.parse(getRaw("aio_quick_notes") || "[]");
        const newNote = {
          id: crypto.randomUUID(),
          title: noteTitle.trim(),
          content: noteContent.trim(),
          updatedAt: new Date().toISOString(),
        };
        setRaw("aio_quick_notes", JSON.stringify([newNote, ...currentNotes]));
        window.dispatchEvent(new Event("aio_data_updated"));
        onSuccess?.("Catatan kilat tersimpan!");
        setNoteTitle("");
        setNoteContent("");
      } else if (tab === "habit") {
        if (!habitName.trim()) return;
        const currentHabits = JSON.parse(getRaw("aio_quick_habits") || "[]");
        const newHabit = {
          id: crypto.randomUUID(),
          name: habitName.trim(),
          streak: 1,
          doneToday: true,
        };
        setRaw("aio_quick_habits", JSON.stringify([newHabit, ...currentHabits]));
        window.dispatchEvent(new Event("aio_data_updated"));
        onSuccess?.("Kebiasaan baru ditambahkan!");
        setHabitName("");
      }
      onClose();
    } catch (err) {
      console.error(err);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Click outside overlay to dismiss - no blur or black overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Floating Stack anchored directly above dock */}
          <div className="fixed bottom-[82px] left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="w-80 sm:w-96 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 shadow-2xl p-2.5 flex flex-col overflow-hidden cursor-default text-left select-none max-h-[75vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with segmented tabs */}
              <div className="px-2 pt-1 pb-2 border-b border-neutral-200/60 dark:border-zinc-800/60">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                      <Plus className="size-3.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 tracking-tight">
                        Quick Capture
                      </h3>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                        Catat tugas, kas, catatan & habit
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-1 p-0.5 bg-neutral-100 dark:bg-zinc-800 rounded-xl border border-neutral-200/60 dark:border-zinc-700/60">
                  <button
                    type="button"
                    onClick={() => setTab("task")}
                    className={`flex items-center justify-center gap-1 py-1 rounded-lg text-[10.5px] font-medium transition-all ${
                      tab === "task"
                        ? "bg-white dark:bg-zinc-700 text-neutral-900 dark:text-white shadow-2xs font-semibold"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    <CheckSquare className="size-3" />
                    <span>Tugas</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("transaction")}
                    className={`flex items-center justify-center gap-1 py-1 rounded-lg text-[10.5px] font-medium transition-all ${
                      tab === "transaction"
                        ? "bg-white dark:bg-zinc-700 text-neutral-900 dark:text-white shadow-2xs font-semibold"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    <DollarSign className="size-3" />
                    <span>Uang</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("note")}
                    className={`flex items-center justify-center gap-1 py-1 rounded-lg text-[10.5px] font-medium transition-all ${
                      tab === "note"
                        ? "bg-white dark:bg-zinc-700 text-neutral-900 dark:text-white shadow-2xs font-semibold"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    <FileText className="size-3" />
                    <span>Catatan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("habit")}
                    className={`flex items-center justify-center gap-1 py-1 rounded-lg text-[10.5px] font-medium transition-all ${
                      tab === "habit"
                        ? "bg-white dark:bg-zinc-700 text-neutral-900 dark:text-white shadow-2xs font-semibold"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    <Heart className="size-3" />
                    <span>Habit</span>
                  </button>
                </div>
              </div>

        {/* Form Body */}
        <div className="relative flex-1 min-h-0">
          <form onSubmit={handleSubmit} className="p-3.5 space-y-3 overflow-y-auto no-scrollbar max-h-[60vh]">
          {tab === "task" && (
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Nama Tugas / Deliverable
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Misal: Review presentasi klien Q4..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-neutral-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-800/80 focus:outline-none focus:ring-1.5 focus:ring-primary/40 text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                    Prioritas
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-neutral-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-800/80 text-foreground focus:outline-none focus:ring-1.5 focus:ring-primary/40"
                  >
                    <option value="Tinggi">Tinggi (Urgent)</option>
                    <option value="Sedang">Sedang (Normal)</option>
                    <option value="Rendah">Rendah (Backlog)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                    Kategori
                  </label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-neutral-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-800/80 text-foreground focus:outline-none focus:ring-1.5 focus:ring-primary/40"
                  >
                    <option value="Strategi">Strategi Bisnis</option>
                    <option value="Klien">Klien & Proyek</option>
                    <option value="Keuangan">Finansial</option>
                    <option value="Pribadi">Personal</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {tab === "transaction" && (
            <div className="space-y-2.5">
              <div className="flex rounded-xl border border-neutral-200/60 dark:border-zinc-700/60 p-0.5 bg-neutral-100/70 dark:bg-zinc-800/70">
                <button
                  type="button"
                  onClick={() => setTxType("expense")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    txType === "expense"
                      ? "bg-rose-500 text-white shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ArrowDownRight className="size-3.5" />
                  <span>Pengeluaran</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTxType("earning")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    txType === "earning"
                      ? "bg-emerald-600 text-white shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ArrowUpRight className="size-3.5" />
                  <span>Pendapatan</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Keterangan Transaksi
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  placeholder="Misal: Retainer konsultasi, langganan cloud..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-neutral-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-800/80 focus:outline-none focus:ring-1.5 focus:ring-primary/40 text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                    Nominal (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    placeholder="1500000"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-neutral-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-800/80 focus:outline-none focus:ring-1.5 focus:ring-primary/40 text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                    Kategori
                  </label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-neutral-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-800/80 text-foreground focus:outline-none focus:ring-1.5 focus:ring-primary/40"
                  >
                    <option value="Operasional">Operasional</option>
                    <option value="Honor Konsultan">Honor Konsultan</option>
                    <option value="Investasi">Investasi</option>
                    <option value="Gaya Hidup">Gaya Hidup</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {tab === "note" && (
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Judul Catatan
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Ide cepat, poin rapat, insight..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-neutral-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-800/80 focus:outline-none focus:ring-1.5 focus:ring-primary/40 text-foreground"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Isi Catatan
                </label>
                <textarea
                  rows={3}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Tuliskan detail poin atau aksi lanjutan..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-neutral-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-800/80 focus:outline-none focus:ring-1.5 focus:ring-primary/40 text-foreground resize-none"
                />
              </div>
            </div>
          )}

          {tab === "habit" && (
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Aktivitas / Habit Harian
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  placeholder="Misal: Baca riset industri 20 menit, meditasi..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-neutral-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-800/80 focus:outline-none focus:ring-1.5 focus:ring-primary/40 text-foreground"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-xs hover:opacity-95 transition-opacity"
            >
              Simpan & Catat
            </button>
          </div>
        </form>
        {blurConfig.enabled && (
          <ProgressiveBlur
            direction="bottom"
            height={24}
            blurLevels={blurLevels.length > 0 ? blurLevels.slice(0, 4) : [0.5, 1, 2, 4]}
            tint={blurConfig.tint ? "linear-gradient(to bottom, transparent, hsl(var(--card) / 0.8))" : false}
            className="absolute bottom-[48px] inset-x-0 pointer-events-none"
          />
        )}
        </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
