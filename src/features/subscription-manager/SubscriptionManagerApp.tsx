import { ShellHeader } from "@/app/shell-header";
import React, { useState, useMemo } from "react";
import {
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  BarChart3,
  X,
  Trash2,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Pause,
  Play,
  History,
} from "lucide-react";
import { useSubscriptionStore, getMonthlyEquivalent } from "./store";
import {
  SubscriptionCategory,
  BillingCycle,
  SubscriptionViewMode,
} from "./types";

export function SubscriptionManagerApp() {
  const {
    subscriptions,
    billingHistory,
    createSubscription,
    deleteSubscription,
    setStatus,
    recordRenewalPayment,
  } = useSubscriptionStore();

  const [activeTab, setActiveTab] = useState<SubscriptionViewMode>("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [cycleFilter, setCycleFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Subscription Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subName, setSubName] = useState("");
  const [subCategory, setSubCategory] = useState<SubscriptionCategory>("work_software");
  const [subPrice, setSubPrice] = useState("350000");
  const [subCurrency, setSubCurrency] = useState("IDR");
  const [subCycle, setSubCycle] = useState<BillingCycle>("monthly");
  const [subStartDate, setSubStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [subNextRenewal, setSubNextRenewal] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]
  );
  const [subAutoRenew, setSubAutoRenew] = useState(true);
  const [subPaymentMethod, setSubPaymentMethod] = useState("Kartu Kredit BCA");
  const [subIsTrial, setSubIsTrial] = useState(false);
  const [subTrialEndDate, setSubTrialEndDate] = useState("");
  const [subWebsiteUrl, setSubWebsiteUrl] = useState("");
  const [subNotes, setSubNotes] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calculations & Analytics
  const metrics = useMemo(() => {
    const activeSubs = subscriptions.filter((s) => s.status === "active" || s.status === "trial");
    const totalMonthlyCost = activeSubs.reduce(
      (sum, s) => sum + getMonthlyEquivalent(s.price, s.billingCycle),
      0
    );
    const annualizedCost = totalMonthlyCost * 12;

    // Upcoming renewals in next 7 days
    const now = new Date();
    const in7Days = new Date(Date.now() + 7 * 86400000);
    const upcomingRenewals = activeSubs.filter((s) => {
      const ren = new Date(s.nextRenewalDate);
      return ren >= now && ren <= in7Days;
    });

    // Trials active
    const activeTrials = subscriptions.filter((s) => s.status === "trial");

    // Category breakdown
    const categoryTotals: Record<string, number> = {};
    activeSubs.forEach((s) => {
      const mec = getMonthlyEquivalent(s.price, s.billingCycle);
      categoryTotals[s.category] = (categoryTotals[s.category] || 0) + mec;
    });

    return {
      activeCount: activeSubs.length,
      totalCount: subscriptions.length,
      totalMonthlyCost,
      annualizedCost,
      upcomingRenewals,
      activeTrials,
      categoryTotals,
    };
  }, [subscriptions]);

  // Filtered Subscriptions
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((s) => {
      // Tab filter
      if (activeTab === "active" && s.status !== "active" && s.status !== "trial") return false;
      if (activeTab === "trials" && s.status !== "trial") return false;
      if (activeTab === "renewals") {
        const ren = new Date(s.nextRenewalDate);
        const in14Days = new Date(Date.now() + 14 * 86400000);
        if (ren > in14Days) return false;
      }

      // Dropdown filters
      if (categoryFilter !== "all" && s.category !== categoryFilter) return false;
      if (cycleFilter !== "all" && s.billingCycle !== cycleFilter) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.paymentMethod.toLowerCase().includes(q) ||
          (s.notes || "").toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [subscriptions, activeTab, categoryFilter, cycleFilter, searchQuery]);

  const handleCreateSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !subPrice) return;

    createSubscription({
      name: subName.trim(),
      category: subCategory,
      price: parseFloat(subPrice) || 0,
      currency: subCurrency,
      billingCycle: subCycle,
      startDate: subStartDate,
      nextRenewalDate: subNextRenewal,
      autoRenew: subAutoRenew,
      status: subIsTrial ? "trial" : "active",
      trialEndDate: subIsTrial ? subTrialEndDate || undefined : undefined,
      paymentMethod: subPaymentMethod.trim() || "Kartu Kredit",
      reminderDaysBefore: 3,
      websiteUrl: subWebsiteUrl.trim() || undefined,
      notes: subNotes.trim() || undefined,
    });

    showToast(`Langganan "${subName}" berhasil ditambahkan ke pemantauan!`);
    setIsModalOpen(false);
    setSubName("");
    setSubNotes("");
  };

  const formatIDR = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  const getCategoryBadge = (cat: SubscriptionCategory) => {
    switch (cat) {
      case "cloud_infrastructure":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">Cloud & Server</span>;
      case "work_software":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">Work Software</span>;
      case "entertainment":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">Hiburan & Media</span>;
      case "fitness":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Kesehatan & Gym</span>;
      case "finance":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Finance & Tools</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-card text-foreground">Lainnya</span>;
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
        <div className="flex items-center gap-1 shrink-0">
          {/* Tab Switchers (Icon-Only) */}
          <div className="flex items-center gap-0.5 border border-border/60 rounded-lg p-0.5 bg-muted/70 text-xs shrink-0">
            <button
              onClick={() => setActiveTab("active")}
              title={`Langganan Aktif (${metrics.activeCount})`}
              aria-label="Langganan Aktif"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "active"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab("renewals")}
              title="Jadwal Renewal"
              aria-label="Renewal"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "renewals"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
            </button>
            <button
              onClick={() => setActiveTab("trials")}
              title={`Masa Trial (${metrics.activeTrials.length})`}
              aria-label="Trial"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "trials"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              title="Analisis Beban Biaya"
              aria-label="Analisis Biaya"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "analytics"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            </button>
            <button
              onClick={() => setActiveTab("history")}
              title={`Riwayat Tagihan (${billingHistory.length})`}
              aria-label="Riwayat Tagihan"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "history"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <History className="w-3.5 h-3.5 text-sky-400" />
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            title="Tambah Langganan Baru"
            aria-label="Tambah Langganan"
            className="p-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0 flex items-center justify-center"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </ShellHeader>

      {/* Page Header Banner */}
      <div className="px-6 py-4 border-b border-border bg-card/40 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/20 shrink-0">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Subscription Manager</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
                  App #38
                </span>
                <span className="text-xs text-muted-foreground">
                  Recurring Cost & Billing Lifecycle Manager
                </span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Layanan berlangganan software, cloud, membership, recurring billing cycle, serta pengingat renewal otomatis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="p-4 bg-card/80 border border-border/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Monthly Burn Rate</span>
            <DollarSign className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-white">
            {formatIDR(metrics.totalMonthlyCost)}
          </div>
          <div className="text-[11px] text-muted-foreground">Beban tetap bulanan (MEC)</div>
        </div>

        <div className="p-4 bg-card/80 border border-border/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Annual Run Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-emerald-400">
            {formatIDR(metrics.annualizedCost)}
          </div>
          <div className="text-[11px] text-muted-foreground">Proyeksi tahunan total</div>
        </div>

        <div className="p-4 bg-card/80 border border-border/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Langganan Aktif</span>
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-sky-400">
            {metrics.activeCount} <span className="text-xs text-muted-foreground font-normal">layanan</span>
          </div>
          <div className="text-[11px] text-muted-foreground">
            {metrics.activeTrials.length > 0 ? `${metrics.activeTrials.length} dalam uji coba (trial)` : "Semua berbayar"}
          </div>
        </div>

        <div className="p-4 bg-card/80 border border-border/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Renewal Minggu Ini</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-amber-400">
            {metrics.upcomingRenewals.length} <span className="text-xs text-muted-foreground font-normal">perlu dibayar</span>
          </div>
          <div className="text-[11px] text-muted-foreground">Jatuh tempo dlm 7 hari ke depan</div>
        </div>
      </div>



      {/* Main Content Area */}
      <div className="flex-1 mt-4">
        {/* ANALYTICS VIEW */}
        {activeTab === "analytics" && (
          <div className="space-y-6 max-w-4xl">
            <div className="p-5 bg-card/80 border border-border rounded-xl space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                Distribusi Pengeluaran Bulanan per Kategori
              </h3>

              <div className="space-y-3">
                {Object.entries(metrics.categoryTotals).map(([cat, total]) => {
                  const percentage =
                    metrics.totalMonthlyCost > 0
                      ? Math.round((total / metrics.totalMonthlyCost) * 100)
                      : 0;

                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-foreground capitalize">
                          {cat.replace("_", " ")}
                        </span>
                        <span className="text-foreground">
                          {formatIDR(total)} / bln ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-background h-2 rounded-full overflow-hidden border border-border">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-5 bg-card/60 border border-border rounded-xl text-xs text-muted-foreground leading-relaxed">
              <strong>Tips Efisiensi Ekosistem:</strong> Langganan bertipe tahunan (*annually*) umumnya menghemat 15–25% dibandingkan pembayaran bulanan. Periksa layanan dengan penggunaan rendah (*low frequency*) untuk dijeda atau dibatalkan sebelum tanggal renewal berikutnya.
            </div>
          </div>
        )}

        {/* BILLING HISTORY VIEW */}
        {activeTab === "history" && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-4 bg-card/40 border border-border/60 rounded-xl text-xs text-muted-foreground">
              Log pembayaran tagihan perpanjangan yang telah dicatat atau diproses auto-debit.
            </div>

            <div className="space-y-2">
              {billingHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-card/80 border border-border rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{item.subscriptionName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                        {item.status}
                      </span>
                    </div>
                    <div className="text-muted-foreground">
                      Metode: <strong className="text-foreground">{item.paymentMethod}</strong> • Tanggal:{" "}
                      <span className="font-mono text-foreground">{item.billingDate}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-400">{formatIDR(item.amount)}</div>
                    <div className="text-[11px] text-muted-foreground">{item.notes}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVE & RENEWALS & TRIALS VIEW */}
        {(activeTab === "active" || activeTab === "renewals" || activeTab === "trials" || activeTab === "all") && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-card/80 border border-border rounded-xl">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari layanan, kartu pembayaran, catatan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs md:text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="work_software">Work Software</option>
                  <option value="cloud_infrastructure">Cloud & Server</option>
                  <option value="entertainment">Hiburan & Media</option>
                  <option value="fitness">Kesehatan & Gym</option>
                  <option value="finance">Finance</option>
                </select>

                <select
                  value={cycleFilter}
                  onChange={(e) => setCycleFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">Semua Siklus</option>
                  <option value="monthly">Bulanan</option>
                  <option value="annually">Tahunan</option>
                  <option value="quarterly">Tiga Bulanan</option>
                  <option value="weekly">Mingguan</option>
                </select>
              </div>
            </div>

            {/* Subscriptions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubscriptions.map((sub) => {
                const daysUntilRenewal = Math.ceil(
                  (new Date(sub.nextRenewalDate).getTime() - Date.now()) / (1000 * 3600 * 24)
                );
                const isUrgent = daysUntilRenewal <= 3 && daysUntilRenewal >= 0;

                return (
                  <div
                    key={sub.id}
                    className={`p-5 bg-card/80 border rounded-xl flex flex-col justify-between space-y-4 transition ${
                      sub.status === "trial"
                        ? "border-rose-500/50 shadow-lg shadow-rose-500/5"
                        : isUrgent
                        ? "border-amber-500/50 shadow-lg shadow-amber-500/5"
                        : "border-border"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getCategoryBadge(sub.category)}
                          <span className="text-[10px] font-mono text-muted-foreground uppercase">
                            {sub.billingCycle}
                          </span>
                        </div>

                        {sub.status === "trial" ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                            TRIAL ENDS SOON
                          </span>
                        ) : sub.status === "paused" ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-card text-muted-foreground">
                            Dijeda
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Aktif
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
                            {sub.name}
                            {sub.websiteUrl && (
                              <a
                                href={sub.websiteUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-muted-foreground hover:text-indigo-400"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </h3>
                        </div>

                        <div className="text-lg font-extrabold text-white mt-1">
                          {formatIDR(sub.price)}{" "}
                          <span className="text-xs font-normal text-muted-foreground">
                            / {sub.billingCycle}
                          </span>
                        </div>
                      </div>

                      {/* Renewal Warning / Info */}
                      <div className="p-3 bg-background/80 rounded-lg border border-border/60 text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Jatuh Tempo:</span>
                          <span
                            className={`font-semibold font-mono ${
                              isUrgent ? "text-amber-400 font-bold" : "text-foreground"
                            }`}
                          >
                            {sub.nextRenewalDate} ({daysUntilRenewal > 0 ? `${daysUntilRenewal} hari lagi` : "Hari ini"})
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-[11px] text-muted-foreground">
                          <span>Metode Pembayaran:</span>
                          <span className="text-foreground truncate max-w-[140px]">{sub.paymentMethod}</span>
                        </div>
                      </div>

                      {sub.notes && (
                        <p className="text-xs text-muted-foreground line-clamp-1 italic">
                          "{sub.notes}"
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            recordRenewalPayment(sub.id);
                            showToast(`Pembayaran renewal ${sub.name} dicatat!`);
                          }}
                          className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1 shadow-sm"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Bayar / Renew</span>
                        </button>

                        <button
                          onClick={() => {
                            const newStatus = sub.status === "paused" ? "active" : "paused";
                            setStatus(sub.id, newStatus);
                            showToast(
                              newStatus === "paused"
                                ? `Langganan ${sub.name} dijeda.`
                                : `Langganan ${sub.name} diaktifkan kembali.`
                            );
                          }}
                          className="p-1.5 text-muted-foreground hover:text-foreground rounded hover:bg-card"
                          title={sub.status === "paused" ? "Lanjutkan" : "Jeda"}
                        >
                          {sub.status === "paused" ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          deleteSubscription(sub.id);
                          showToast(`Langganan ${sub.name} dihapus.`);
                        }}
                        className="p-1.5 text-muted-foreground hover:text-rose-400 rounded hover:bg-card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: NEW SUBSCRIPTION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-white">Tambah Layanan Berlangganan Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubscription} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Nama Layanan / Software <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="mis. GitHub Team, Zoom Pro, AWS Cloud"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Kategori</label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-indigo-500"
                  >
                    <option value="work_software">Work Software</option>
                    <option value="cloud_infrastructure">Cloud Infrastructure</option>
                    <option value="entertainment">Hiburan & Media</option>
                    <option value="fitness">Kesehatan / Gym</option>
                    <option value="finance">Finance / Tools</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Siklus Penagihan</label>
                  <select
                    value={subCycle}
                    onChange={(e) => setSubCycle(e.target.value as any)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-indigo-500"
                  >
                    <option value="monthly">Bulanan (Monthly)</option>
                    <option value="annually">Tahunan (Annually)</option>
                    <option value="quarterly">Tiga Bulanan (Quarterly)</option>
                    <option value="weekly">Mingguan (Weekly)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Biaya per Siklus (Rp) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={subPrice}
                    onChange={(e) => setSubPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Next Renewal Date</label>
                  <input
                    type="date"
                    required
                    value={subNextRenewal}
                    onChange={(e) => setSubNextRenewal(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Metode Pembayaran
                </label>
                <input
                  type="text"
                  placeholder="mis. Kartu Kredit Mandiri Corporate, GoPay, BCA VA"
                  value={subPaymentMethod}
                  onChange={(e) => setSubPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="trialCheck"
                  checked={subIsTrial}
                  onChange={(e) => setSubIsTrial(e.target.checked)}
                  className="rounded bg-card border-border text-indigo-500 focus:ring-0"
                />
                <label htmlFor="trialCheck" className="text-xs text-foreground">
                  Sedang dalam Masa Uji Coba Gratis (Free Trial)
                </label>
              </div>

              {subIsTrial && (
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Batas Akhir Trial (Sebelum Dikenakan Biaya)
                  </label>
                  <input
                    type="date"
                    value={subTrialEndDate}
                    onChange={(e) => setSubTrialEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Catatan / Keterangan Tambahan
                </label>
                <textarea
                  rows={2}
                  placeholder="mis. Akun tim pengembang sprint 4 orang"
                  value={subNotes}
                  onChange={(e) => setSubNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-indigo-500"
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
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
                >
                  Simpan Langganan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
