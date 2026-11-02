import { useState } from "react";
import {
  ArrowLeft,
  Search,
  LayoutGrid,
  CalendarDays,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
} from "lucide-react";
import { motion } from "motion/react";
import { useDeletedItems } from "../hooks/useDeletedItems";
import { useScrollRestore } from "../hooks/useScrollRestore";

export function TransactionsView({
  onNewTransaction,
  onUnavailable,
  onBack,
}: {
  onNewTransaction?: () => void;
  onUnavailable?: () => void;
  onBack?: () => void;
}) {
  const { ref, onScroll } = useScrollRestore("transactions_scroll");
  const { markDeleted } = useDeletedItems("deleted_transactions");
  const [transactions, setTransactions] = useState<any[]>(() => {
    try {
      const stored =
        typeof window !== "undefined" ? localStorage.getItem("transactions_list") : null;
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const removeTx = (id: number) => {
    markDeleted(id);
    setTransactions((t) => t.filter((x) => x.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 pb-2 shrink-0 z-10 bg-background">
        {onBack && (
          <div className="flex items-center gap-3 mb-4 pt-2">
            <button onClick={onBack} className="p-1 hover:bg-accent rounded-lg text-foreground transition-colors">
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-lg font-bold text-foreground">Buku Kas & Transaksi</h1>
          </div>
        )}
        {/* Search Bar */}
        <div className="bg-card rounded-full px-4 py-2.5 flex items-center gap-3 mb-6">
          <Search size={20} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Cari"
            className="bg-transparent border-none outline-none text-foreground w-full placeholder-muted-foreground text-sm"
          />
          <button onClick={onUnavailable}>
            <LayoutGrid
              size={20}
              className="text-muted-foreground shrink-0 hover:text-foreground cursor-pointer"
            />
          </button>
          <button onClick={onUnavailable}>
            <CalendarDays
              size={20}
              className="text-muted-foreground shrink-0 hover:text-foreground cursor-pointer"
            />
          </button>
        </div>

        {/* Date and Navigation */}
        <div className="flex justify-between items-center mb-4 px-1 text-foreground">
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <span className="font-medium text-sm">Juni 2026</span>
          </div>
          <div className="flex items-center gap-5 text-muted-foreground">
            <button onClick={onUnavailable}>
              <ChevronLeft size={18} className="hover:text-foreground" />
            </button>
            <button onClick={onUnavailable}>
              <ChevronRight size={18} className="hover:text-foreground" />
            </button>
            <button onClick={onUnavailable}>
              <Filter size={18} className="hover:text-foreground" />
            </button>
          </div>
        </div>

        {/* Summaries */}
        <div className="flex justify-between items-center px-1">
          <span className="text-sm font-medium text-[#4caf50]">Rp 0</span>
          <span className="text-sm font-medium text-[#f44336]">Rp 0</span>
          <span className="text-sm font-medium text-muted-foreground">∑ Rp 0</span>
        </div>
      </div>

      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto px-4 pb-24 pt-2 space-y-3"
      >
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-muted-foreground/70 pt-20">
            <p className="text-sm">Belum ada transaksi</p>
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.id}
              className="relative mb-3 bg-card/60 rounded-2xl overflow-hidden border border-border"
            >
              <div className="absolute inset-0 flex items-center justify-between px-6 z-0">
                <div className="flex items-center gap-2 text-blue-400">
                  <span className="text-xs font-medium uppercase tracking-widest">Arsip</span>
                </div>
                <div className="flex items-center gap-2 text-red-500">
                  <span className="text-xs font-medium uppercase tracking-widest">Hapus</span>
                </div>
              </div>
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -100) {
                    if (window.confirm("Hapus transaksi?")) {
                      removeTx(tx.id);
                    }
                  } else if (info.offset.x > 100) {
                    alert("Transaksi diarsipkan.");
                    removeTx(tx.id);
                  }
                }}
                className="bg-card border-y border-border p-4 rounded-2xl flex justify-between items-center relative z-10 hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="preserve-color w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: tx.color + "20", color: tx.color }}
                  >
                    {tx.icon}
                  </div>
                  <div>
                    <h4 className="text-foreground font-medium text-sm">{tx.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {tx.category} • {tx.date}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-medium ${tx.amount > 0 ? "text-[#4caf50]" : "text-foreground"}`}
                >
                  {tx.amount > 0 ? "+" : ""}Rp {Math.abs(tx.amount).toLocaleString("id-ID")}
                </span>
              </motion.div>
            </div>
          ))
        )}
      </div>

      {/* FAB */}
      <div className="absolute bottom-6 right-4 z-20">
        <button
          onClick={onNewTransaction}
          className="w-14 h-14 bg-[#5c8bfc] rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <Plus size={28} className="text-foreground" />
        </button>
      </div>
    </div>
  );
}
