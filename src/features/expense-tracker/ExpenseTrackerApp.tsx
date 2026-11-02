import { ShellHeader } from "@/app/shell-header";
import React, { useState, useMemo } from "react";
import {
  Receipt,
  CheckCircle2,
  Plus,
  Search,
  X,
  Trash2,
  FileCheck2,
  Store,
  TrendingDown,
  ShieldCheck,
  PieChart,
  ArrowDownRight,
} from "lucide-react";
import { useExpenseStore } from "./store";
import { ExpenseCategoryKey, ExpenseViewMode } from "./types";

export function ExpenseTrackerApp() {
  const { expenses, addExpense, deleteExpense } = useExpenseStore();

  const [activeTab, setActiveTab] = useState<ExpenseViewMode>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [accountFilter, setAccountFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Expense Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expTitle, setExpTitle] = useState("");
  const [expAmount, setExpAmount] = useState("250000");
  const [expCategory, setExpCategory] = useState<ExpenseCategoryKey>("food_beverage");
  const [expDate, setExpDate] = useState(new Date().toISOString().split("T")[0]);
  const [expAccount, setExpAccount] = useState("Kas Kecil (Petty Cash)");
  const [expMerchant, setExpMerchant] = useState("");
  const [expHasReceipt, setExpHasReceipt] = useState(true);
  const [expIsTaxDeductible, setExpIsTaxDeductible] = useState(true);
  const [expTags, setExpTags] = useState("Operasional");
  const [expNotes, setExpNotes] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const formatIDR = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  // Metrics
  const metrics = useMemo(() => {
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    const taxDeductibleTotal = expenses
      .filter((e) => e.isTaxDeductible)
      .reduce((sum, e) => sum + e.amount, 0);
    const receiptCount = expenses.filter((e) => e.hasReceipt).length;
    const avgExpense = expenses.length > 0 ? Math.round(totalAmount / expenses.length) : 0;
    const receiptCompliance =
      expenses.length > 0 ? Math.round((receiptCount / expenses.length) * 100) : 0;

    // Category breakdown
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    // Merchant breakdown
    const merchantTotals: Record<string, { total: number; count: number }> = {};
    expenses.forEach((e) => {
      if (!merchantTotals[e.merchant]) {
        merchantTotals[e.merchant] = { total: 0, count: 0 };
      }
      merchantTotals[e.merchant].total += e.amount;
      merchantTotals[e.merchant].count += 1;
    });

    return {
      totalAmount,
      taxDeductibleTotal,
      avgExpense,
      receiptCompliance,
      categoryTotals,
      merchantTotals,
    };
  }, [expenses]);

  // Unique Accounts for filter
  const accountsList = useMemo(() => {
    return Array.from(new Set(expenses.map((e) => e.paymentAccount)));
  }, [expenses]);

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (activeTab === "tax_deductible" && !e.isTaxDeductible) return false;
      if (categoryFilter !== "all" && e.category !== categoryFilter) return false;
      if (accountFilter !== "all" && e.paymentAccount !== accountFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          e.merchant.toLowerCase().includes(q) ||
          e.paymentAccount.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q)) ||
          (e.notes || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [expenses, activeTab, categoryFilter, accountFilter, searchQuery]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim() || !expAmount) return;

    addExpense({
      title: expTitle.trim(),
      amount: parseFloat(expAmount) || 0,
      currency: "IDR",
      category: expCategory,
      date: expDate,
      paymentAccount: expAccount.trim() || "Kas Kecil (Petty Cash)",
      merchant: expMerchant.trim() || "Merchant Umum",
      hasReceipt: expHasReceipt,
      isTaxDeductible: expIsTaxDeductible,
      status: "cleared",
      tags: expTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      notes: expNotes.trim() || undefined,
    });

    showToast(`Pengeluaran "${expTitle}" sebesar ${formatIDR(parseFloat(expAmount))} berhasil dicatat!`);
    setIsModalOpen(false);
    setExpTitle("");
    setExpMerchant("");
    setExpNotes("");
  };

  const getCategoryLabel = (cat: ExpenseCategoryKey) => {
    switch (cat) {
      case "food_beverage":
        return "Makanan & Minuman";
      case "transportation":
        return "Transportasi & Bensin";
      case "office_supplies":
        return "ATK & Perlengkapan";
      case "software_tech":
        return "Software & Teknologi";
      case "marketing":
        return "Pemasaran & Iklan";
      case "utilities":
        return "Utilitas (Listrik/Internet)";
      case "entertainment":
        return "Entertainment & Relasi";
      case "travel":
        return "Perjalanan Dinas";
      case "medical":
        return "Kesehatan & Medis";
      case "taxes_fees":
        return "Pajak & Administrasi";
      default:
        return "Lain-lain";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-400 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Actions in Floating Pill */}
      <ShellHeader>
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Tab Switchers (Icon-Only Segmented Pill) */}
          <div className="flex items-center gap-1 border border-border/70 rounded-full p-1 bg-muted/60 dark:bg-zinc-800/80 backdrop-blur-xs text-xs shrink-0 shadow-2xs h-[36px]">
            <button
              onClick={() => setActiveTab("all")}
              title={`Semua Pengeluaran (${expenses.length})`}
              aria-label="Semua Pengeluaran"
              className={`size-7 rounded-full text-xs transition-all cursor-pointer shrink-0 flex items-center justify-center ${
                activeTab === "all"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab("by_category")}
              title="Kategori Biaya"
              aria-label="Kategori Biaya"
              className={`size-7 rounded-full text-xs transition-all cursor-pointer shrink-0 flex items-center justify-center ${
                activeTab === "by_category"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
              }`}
            >
              <PieChart className="w-3.5 h-3.5 text-purple-400" />
            </button>
            <button
              onClick={() => setActiveTab("merchants")}
              title="Direktori Merchant & Vendor"
              aria-label="Merchant & Vendor"
              className={`size-7 rounded-full text-xs transition-all cursor-pointer shrink-0 flex items-center justify-center ${
                activeTab === "merchants"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
              }`}
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
            </button>
            <button
              onClick={() => setActiveTab("tax_deductible")}
              title={`Pajak & Deductible (${expenses.filter((e) => e.isTaxDeductible).length})`}
              aria-label="Tax-Deductible"
              className={`size-7 rounded-full text-xs transition-all cursor-pointer shrink-0 flex items-center justify-center ${
                activeTab === "tax_deductible"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            title="Catat Pengeluaran Baru"
            aria-label="Catat Pengeluaran"
            className="size-9 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0 flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </ShellHeader>

      {/* Page Header Banner */}
      <div className="px-6 py-4 border-b border-border bg-card/40 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-gradient-to-tr from-rose-500 to-pink-600 rounded-xl shadow-lg shadow-rose-500/20 shrink-0">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Expense Tracker</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30">
                  App #39
                </span>
                <span className="text-xs text-muted-foreground">
                  Pencatatan Biaya, Akun, Merchant & Kepatuhan Bukti Struk
                </span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Mencatat pengeluaran operasional berdasarkan kategori, akun kas/bank, merchant, struk bukti, dan validasi pajak.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="p-4 bg-card/80 border border-border/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Total Pengeluaran</span>
            <ArrowDownRight className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-white">
            {formatIDR(metrics.totalAmount)}
          </div>
          <div className="text-[11px] text-muted-foreground">{expenses.length} transaksi tercatat</div>
        </div>

        <div className="p-4 bg-card/80 border border-border/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Tax-Deductible</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-emerald-400">
            {formatIDR(metrics.taxDeductibleTotal)}
          </div>
          <div className="text-[11px] text-muted-foreground">Biaya fiskal pengurang pajak</div>
        </div>

        <div className="p-4 bg-card/80 border border-border/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Rata-Rata Transaksi</span>
            <TrendingDown className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-sky-400">
            {formatIDR(metrics.avgExpense)}
          </div>
          <div className="text-[11px] text-muted-foreground">Per pengeluaran rata-rata</div>
        </div>

        <div className="p-4 bg-card/80 border border-border/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Kepatuhan Struk (Receipt)</span>
            <FileCheck2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-amber-400">
            {metrics.receiptCompliance}%
          </div>
          <div className="text-[11px] text-muted-foreground">Memiliki bukti pembayaran valid</div>
        </div>
      </div>



      {/* Main Content Area */}
      <div className="flex-1 mt-4">
        {/* CATEGORY BREAKDOWN VIEW */}
        {activeTab === "by_category" && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-5 bg-card/80 border border-border rounded-xl space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-rose-400" />
                Alokasi Pengeluaran per Kategori
              </h3>

              <div className="space-y-3">
                {Object.entries(metrics.categoryTotals).map(([cat, total]) => {
                  const percentage =
                    metrics.totalAmount > 0 ? Math.round((total / metrics.totalAmount) * 100) : 0;

                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-foreground">
                          {getCategoryLabel(cat as ExpenseCategoryKey)}
                        </span>
                        <span className="text-foreground">
                          {formatIDR(total)} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-background h-2 rounded-full overflow-hidden border border-border">
                        <div
                          className="h-full bg-rose-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MERCHANTS VIEW */}
        {activeTab === "merchants" && (
          <div className="space-y-4 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(metrics.merchantTotals).map(([merchant, data]) => (
                <div
                  key={merchant}
                  className="p-4 bg-card/80 border border-border rounded-xl flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-foreground flex items-center gap-2">
                      <Store className="w-4 h-4 text-amber-400" />
                      {merchant}
                    </div>
                    <div className="text-xs text-muted-foreground">{data.count} transaksi pembelian</div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-rose-400">{formatIDR(data.total)}</div>
                    <div className="text-[10px] text-muted-foreground">Total Akumulasi</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ALL & TAX DEDUCTIBLE TRANSACTIONS VIEW */}
        {(activeTab === "all" || activeTab === "tax_deductible") && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-card/80 border border-border rounded-xl">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari deskripsi, merchant, tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs md:text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-rose-500"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="food_beverage">Makanan & Minuman</option>
                  <option value="transportation">Transportasi</option>
                  <option value="office_supplies">ATK & Kantor</option>
                  <option value="software_tech">Software & Tech</option>
                  <option value="travel">Perjalanan Dinas</option>
                  <option value="utilities">Utilitas</option>
                </select>

                <select
                  value={accountFilter}
                  onChange={(e) => setAccountFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-rose-500"
                >
                  <option value="all">Semua Akun / Sumber</option>
                  {accountsList.map((acc) => (
                    <option key={acc} value={acc}>
                      {acc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Expenses List */}
            <div className="space-y-2.5">
              {filteredExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 bg-card/80 border border-border rounded-xl flex items-center justify-between gap-4 hover:border-border transition"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-foreground">{exp.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-card text-foreground">
                        {getCategoryLabel(exp.category)}
                      </span>
                      {exp.isTaxDeductible && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          DEDUCTIBLE
                        </span>
                      )}
                      {exp.hasReceipt ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> STRUK OK
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          TANPA STRUK
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground flex items-center gap-3 flex-wrap">
                      <span>
                        Merchant: <strong className="text-foreground">{exp.merchant}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Akun: <strong className="text-foreground">{exp.paymentAccount}</strong>
                      </span>
                      <span>•</span>
                      <span className="font-mono text-foreground">{exp.date}</span>
                    </div>

                    {exp.notes && (
                      <p className="text-[11px] text-muted-foreground italic">"{exp.notes}"</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-base font-extrabold text-rose-400">
                        -{formatIDR(exp.amount)}
                      </div>
                      <div className="text-[10px] text-muted-foreground capitalize">{exp.status}</div>
                    </div>

                    <button
                      onClick={() => {
                        deleteExpense(exp.id);
                        showToast("Pengeluaran dihapus.");
                      }}
                      className="p-1.5 text-muted-foreground hover:text-rose-400 rounded hover:bg-card"
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

      {/* MODAL: ADD EXPENSE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-white">Catat Pengeluaran Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Deskripsi Pengeluaran <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="mis. Makan Siang Klien, Bensin Operasional"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Jumlah Biaya (Rp) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Kategori</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-rose-500"
                  >
                    <option value="food_beverage">Makanan & Minuman</option>
                    <option value="transportation">Transportasi & Bensin</option>
                    <option value="office_supplies">ATK & Kantor</option>
                    <option value="software_tech">Software & Teknologi</option>
                    <option value="travel">Perjalanan Dinas</option>
                    <option value="utilities">Utilitas</option>
                    <option value="other">Lain-lain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Merchant / Vendor</label>
                  <input
                    type="text"
                    placeholder="mis. Pertamina, Tokopedia"
                    value={expMerchant}
                    onChange={(e) => setExpMerchant(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Akun Sumber Pembayaran
                </label>
                <select
                  value={expAccount}
                  onChange={(e) => setExpAccount(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-rose-500"
                >
                  <option value="Kas Kecil (Petty Cash)">Kas Kecil (Petty Cash)</option>
                  <option value="Bank Mandiri Operasional">Bank Mandiri Operasional</option>
                  <option value="BCA Giro Operasional">BCA Giro Operasional</option>
                  <option value="Kartu Kredit Mandiri Corporate">Kartu Kredit Mandiri Corporate</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-card/80 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasReceipt"
                    checked={expHasReceipt}
                    onChange={(e) => setExpHasReceipt(e.target.checked)}
                    className="rounded bg-card border-border text-rose-500 focus:ring-0"
                  />
                  <label htmlFor="hasReceipt" className="text-xs text-foreground font-medium">
                    Ada Struk / Bukti Bayar
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="taxDeduct"
                    checked={expIsTaxDeductible}
                    onChange={(e) => setExpIsTaxDeductible(e.target.checked)}
                    className="rounded bg-card border-border text-emerald-500 focus:ring-0"
                  />
                  <label htmlFor="taxDeduct" className="text-xs text-foreground font-medium">
                    Tax-Deductible
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Catatan / Keterangan
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan tambahan keperluan bisnis..."
                  value={expNotes}
                  onChange={(e) => setExpNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
                >
                  Simpan Pengeluaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
