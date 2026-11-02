import { useState } from "react";
import {
  ArrowLeft,
  AlertCircle,
  Tags,
  CalendarClock,
  ArrowRightLeft,
  ShieldAlert,
  Receipt,
  Search,
  Plus,
  BookOpen,
} from "lucide-react";
import { motion } from "motion/react";
import { useDeletedItems } from "../hooks/useDeletedItems";
import { useScrollRestore } from "../hooks/useScrollRestore";

export function EmergencyFundView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("EmergencyFundView_scroll");
  const [total, setTotal] = useState(0);

  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
          <AlertCircle size={20} className="text-muted-foreground" /> Dana Darurat
        </h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-6 rounded-2xl border border-blue-900/30 mb-8 text-center relative">
          <ShieldAlert size={32} className="text-blue-400 mx-auto mb-3" />
          <div className="text-muted-foreground text-sm mb-1">Total Tersedia</div>
          <div className="text-blue-400 text-2xl font-bold mb-3">Rp 0</div>
          <div className="text-xs text-muted-foreground/70 mb-6">
            Belum ada dana darurat disiapkan.
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExpenseCategoryView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("ExpenseCategoryView_scroll");
  const [categories, setCategories] = useState<{ name: string; active: boolean }[]>([]);

  const toggleStatus = (idx: number) => {
    setCategories((cats) => cats.map((c, i) => (i === idx ? { ...c, active: !c.active } : c)));
  };

  const addCategory = () => {
    const name = window.prompt("Nama kategori pengeluaran baru:");
    if (name) {
      setCategories((c) => [...c, { name, active: true }]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      <div className="p-4 flex items-center justify-between pt-6 shrink-0 bg-background">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-foreground p-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <Tags size={20} className="text-muted-foreground" /> Kategori Pengeluaran
          </h1>
        </div>
        <button
          onClick={addCategory}
          className="text-[#4caf50] p-1.5 rounded-full bg-card border border-border hover:bg-accent transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="space-y-3 w-full">
          {categories.map((cat, i) => (
            <div
              key={i}
              onClick={() => toggleStatus(i)}
              className={`bg-card p-4 rounded-xl border flex justify-between items-center cursor-pointer transition-colors ${cat.active ? "border-border hover:bg-accent " : "border-dashed border-[#555] opacity-50"}`}
            >
              <div className="flex items-center gap-3">
                <Tags
                  className={cat.active ? "text-emerald-400" : "text-muted-foreground/70"}
                  size={18}
                />
                <span className="text-foreground text-sm">{cat.name}</span>
              </div>
              <span className="text-muted-foreground/70 text-xs">
                {cat.active ? "Aktif" : "Nonaktif"}
              </span>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="text-center py-10">
              <Tags className="text-muted-foreground mx-auto mb-3" size={32} />
              <p className="text-muted-foreground text-sm">Belum ada kategori yang ditambahkan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function BillRemindersView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("BillRemindersView_scroll");
  const { markDeleted } = useDeletedItems("deleted_bills");
  const [bills, setBills] = useState<any[]>(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("bills_list") : null;
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const removeBill = (id: number) => {
    markDeleted(id);
    setBills((b) => b.filter((bill) => bill.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      <div className="p-4 flex items-center justify-between pt-6 shrink-0 bg-background">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-foreground p-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <CalendarClock size={20} className="text-muted-foreground" /> Pengingat Tagihan
          </h1>
        </div>
        <button
          onClick={() =>
            setBills((b) => [
              ...b,
              { id: Date.now(), name: "Asuransi", amount: 500000, date: "1 Juli" },
            ])
          }
          className="text-[#4caf50] p-1.5 rounded-full bg-card border border-border hover:bg-accent transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="space-y-4">
          {bills.map((bill) => (
            <div
              key={bill.id}
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
                    if (window.confirm("Apakah Anda yakin ingin menghapus tagihan ini?")) {
                      removeBill(bill.id);
                    }
                  } else if (info.offset.x > 100) {
                    alert("Tagihan diarsipkan.");
                    removeBill(bill.id);
                  }
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-card border-y border-border rounded-2xl p-4 flex flex-col justify-center relative z-10 hover:bg-accent transition-colors"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Receipt size={16} className="text-orange-400" />{" "}
                    <span className="text-foreground font-medium text-sm">{bill.name}</span>
                  </div>
                  <span className="text-orange-400 font-medium text-sm">
                    Rp {bill.amount.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                  <CalendarClock size={12} /> Jatuh Tempo: {bill.date}
                </div>
              </motion.div>
            </div>
          ))}
          {bills.length === 0 && (
            <div className="text-center py-10">
              <Receipt className="text-muted-foreground mx-auto mb-3" size={32} />
              <p className="text-muted-foreground/70 text-sm">Belum ada tagihan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function BankMutationsView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("BankMutationsView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
          <BookOpen size={20} className="text-muted-foreground" /> Mutasi Rekening
        </h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card rounded-xl border border-border p-4 mb-4 flex items-center gap-3">
          <Search className="text-muted-foreground/70" size={18} />
          <span className="text-muted-foreground/70 text-sm">
            Integrasi Bank (Open Banking) sedang sinkronisasi...
          </span>
        </div>
        <div className="text-center py-10">
          <ArrowRightLeft className="text-muted-foreground mx-auto mb-3" size={32} />
          <p className="text-muted-foreground/70 text-sm">Belum ada mutasi tersinkron.</p>
        </div>
      </div>
    </div>
  );
}
