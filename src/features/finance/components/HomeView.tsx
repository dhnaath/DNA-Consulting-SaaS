import { useState } from "react";
import {
  CreditCard,
  Banknote,
  Home,
  Car,
  Settings,
  ArrowLeft,
  Smartphone,
  Plus,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { motion } from "motion/react";
import { useDebts } from "../hooks/useDebts";
import { useScrollRestore } from "../hooks/useScrollRestore";

export function HomeView({
  onNavigate,
  onBack,
  onEditDebt,
  fixedTab,
  customTitle,
}: {
  onNavigate: (view: string) => void;
  onBack?: () => void;
  onEditDebt: (id: string) => void;
  fixedTab?: "kredit" | "debit";
  customTitle?: string;
}) {
  const { ref, onScroll } = useScrollRestore("HomeView_scroll");
  const { debts, removeDebt, moveDebt } = useDebts();
  const [sortMethod, setSortMethod] = useState("custom");
  const [activeTab, setActiveTab] = useState<"kredit" | "debit">(fixedTab || "kredit");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const filteredDebts = debts.filter((d) => (d.accountClass || "kredit") === activeTab);

  const sortedDebts = [...filteredDebts].sort((a, b) => {
    if (sortMethod === "amount-desc") return b.amount - a.amount;
    if (sortMethod === "amount-asc") return a.amount - b.amount;
    return 0; // 'custom' keeps original order
  });

  const totalAmount = filteredDebts.reduce((sum, debt) => sum + debt.amount, 0);

  let bebanBulanan = totalAmount * 0.05;
  filteredDebts.forEach((debt) => {
    if (debt.fees) {
      debt.fees.forEach((fee) => {
        if (fee.frequency === "bulanan") bebanBulanan += fee.amount;
        else if (fee.frequency === "tahunan") bebanBulanan += fee.amount / 12;
      });
    }
  });

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);
  };

  const getIconForType = (type: string) => {
    if (type.includes("KPR") || type.includes("Properti") || type.includes("Rumah"))
      return <Home size={20} className="text-[#9c27b0]" />;
    if (type.includes("KKB") || type.includes("Kendaraan"))
      return <Car size={20} className="text-[#1976d2]" />;
    if (type.includes("Paylater") || type.includes("KTA") || type.includes("Online"))
      return <Smartphone size={20} className="text-[#e91e63]" />;
    if (
      type.includes("Tabungan") ||
      type.includes("Bank") ||
      type.includes("Uang") ||
      type.includes("Dompet")
    )
      return <Banknote size={20} className="text-[#4caf50]" />;
    return <CreditCard size={20} className="text-[#ff9800]" />;
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus akun/pinjaman ini secara permanen?")) {
      removeDebt(id);
      setActiveMenu(null);
    }
  };

  const handleArchive = (id: string) => {
    alert("Data berhasil diarsipkan.");
    removeDebt(id);
    setActiveMenu(null);
  };

  return (
    <div
      ref={ref}
      onScroll={onScroll}
      className="min-h-screen bg-background relative overflow-y-auto font-sans pb-20 p-4"
    >
      <div className="relative z-10" onClick={() => setActiveMenu(null)}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pt-2">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="text-foreground p-1 hover:text-foreground transition-colors"
              >
                <ArrowLeft size={28} strokeWidth={2} />
              </button>
            )}
            <h1 className="text-lg font-normal text-foreground tracking-wide flex items-center gap-2">
              <CreditCard size={20} className="text-muted-foreground" />{" "}
              {customTitle || "Manajemen Akun"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === "kredit" && (
              <button
                onClick={() => onNavigate("cardSettings")}
                className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground"
              >
                <Settings size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Tab Toggle */}
        {!fixedTab && (
          <div className="flex bg-card p-1 rounded-xl mb-6">
            <button
              onClick={() => setActiveTab("debit")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "debit" ? "bg-[#2a2a2a] text-foreground shadow-sm" : "text-muted-foreground/70 hover:text-muted-foreground"}`}
            >
              Aset Lancar (Debit)
            </button>
            <button
              onClick={() => setActiveTab("kredit")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "kredit" ? "bg-[#2a2a2a] text-foreground shadow-sm" : "text-muted-foreground/70 hover:text-muted-foreground"}`}
            >
              Liabilitas (Kredit)
            </button>
          </div>
        )}

        <div className="space-y-3 ">
          {sortedDebts.map((debt, i) => (
            <div
              key={debt.id}
              className="relative w-full mb-3 rounded-2xl bg-card/60 border border-border overflow-hidden"
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
                    handleDelete(debt.id);
                  } else if (info.offset.x > 100) {
                    handleArchive(debt.id);
                  }
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="w-full bg-card border-y border-border rounded-2xl p-4 flex items-center gap-2 lg:gap-3 hover:bg-accent transition-colors relative z-10"
              >
                {sortMethod === "custom" && (
                  <div className="flex flex-col gap-1 items-center justify-center mr-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveDebt(debt.id, "up");
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
                      disabled={i === 0}
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveDebt(debt.id, "down");
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
                      disabled={i === sortedDebts.length - 1}
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                )}
                <div
                  className="preserve-color w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${debt.color || "#333"}20` }}
                >
                  {getIconForType(debt.type)}
                </div>
                <div className="flex-1 cursor-pointer" onClick={() => onEditDebt(debt.id)}>
                  <h3 className="text-sm font-medium text-foreground mb-0.5">{debt.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{debt.type}</p>
                  {debt.limit > 0 && activeTab === "kredit" && (
                    <div className="w-full bg-bg-primary rounded-full h-1.5 mt-1 overflow-hidden">
                      <div
                        className="preserve-color h-1.5 rounded-full"
                        style={{
                          width: `${Math.min((debt.amount / debt.limit) * 100, 100)}%`,
                          backgroundColor:
                            debt.amount / debt.limit > 0.8 ? "#f44336" : debt.color || "#e91e63",
                        }}
                      ></div>
                    </div>
                  )}
                </div>
                <div className="text-right cursor-pointer mr-1" onClick={() => onEditDebt(debt.id)}>
                  <p className="text-sm font-medium text-foreground">{formatIDR(debt.amount)}</p>
                  {debt.limit && activeTab === "kredit" ? (
                    <p className="text-xs text-muted-foreground/70">
                      Plafon: {formatIDR(debt.limit)}
                    </p>
                  ) : null}
                  {!debt.limit && activeTab === "kredit" ? (
                    <p className="text-xs text-muted-foreground/70">Sisa Pokok</p>
                  ) : null}
                  {activeTab === "debit" ? (
                    <p className="text-xs text-muted-foreground/70">Saldo Identifikasi</p>
                  ) : null}
                  {debt.remainingInstallments ? (
                    <p className="text-xs text-orange-400 mt-1">
                      Sisa {debt.remainingInstallments}x Tenor
                    </p>
                  ) : null}
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-24 left-0 right-0 flex justify-center z-40 pointer-events-none">
          <button
            onClick={() => onNavigate("addCard")}
            className="pointer-events-auto flex items-center gap-2 text-[#4caf50] px-6 py-3 rounded-full bg-card border border-border hover:bg-accent shadow-xl transition-colors"
          >
            <Plus size={20} />
            <span className="text-sm font-medium uppercase tracking-wider">Tambah</span>
          </button>
        </div>
      </div>
    </div>
  );
}
