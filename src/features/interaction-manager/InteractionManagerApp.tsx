import { ShellHeader } from "@/app/shell-header";
import React, { useState, useMemo } from "react";
import {
  MessageSquare,
  PhoneCall,
  Video,
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Search,
  Plus,
  CheckSquare,
  BarChart3,
  X,
  Smile,
  Meh,
  Frown,
  Zap,
} from "lucide-react";
import { useInteractionStore } from "./store";
import { usePeopleStore } from "../people-manager/store";
import {
  InteractionType,
  InteractionDirection,
  InteractionSentiment,
  InteractionViewMode,
  FollowUp,
} from "./types";

export function InteractionManagerApp() {
  const {
    interactions,
    followUps,
    selectedPersonId,
    logInteraction,
    updateFollowUpStatus,
    convertFollowUpToTask,
    setSelectedPersonId,
  } = useInteractionStore();

  const { people, organizations } = usePeopleStore();

  const [activeTab, setActiveTab] = useState<InteractionViewMode>("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Interaction Modal
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [targetPersonId, setTargetPersonId] = useState("");
  const [intType, setIntType] = useState<InteractionType>("call");
  const [intDirection, setIntDirection] = useState<InteractionDirection>("outbound");
  const [intDate, setIntDate] = useState(new Date().toISOString().split("T")[0]);
  const [intSummary, setIntSummary] = useState("");
  const [intSentiment, setIntSentiment] = useState<InteractionSentiment>("positive");
  const [intResult, setIntResult] = useState("");
  const [intNextSteps, setIntNextSteps] = useState("");
  const [fuDesc, setFuDesc] = useState("");
  const [fuDueDate, setFuDueDate] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const todayStr = new Date().toISOString().split("T")[0];

  const getTypeIcon = (type: InteractionType) => {
    switch (type) {
      case "call":
        return <PhoneCall className="w-4 h-4 text-cyan-400" />;
      case "meeting":
        return <Video className="w-4 h-4 text-purple-400" />;
      case "email":
        return <Mail className="w-4 h-4 text-blue-400" />;
      case "message":
        return <MessageCircle className="w-4 h-4 text-emerald-400" />;
      case "visit":
        return <MapPin className="w-4 h-4 text-amber-400" />;
      default:
        return <MessageSquare className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getSentimentBadge = (sentiment?: InteractionSentiment) => {
    switch (sentiment) {
      case "positive":
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <Smile className="w-3.5 h-3.5" /> Positif
          </span>
        );
      case "neutral":
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground bg-muted-foreground/30/10 px-2 py-0.5 rounded-full border border-border/20">
            <Meh className="w-3.5 h-3.5" /> Netral
          </span>
        );
      case "negative":
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
            <Frown className="w-3.5 h-3.5" /> Negatif
          </span>
        );
      default:
        return null;
    }
  };

  // Filtered Interactions
  const filteredInteractions = useMemo(() => {
    return interactions.filter((i) => {
      if (typeFilter !== "all" && i.type !== typeFilter) return false;
      if (sentimentFilter !== "all" && i.outcome?.sentiment !== sentimentFilter) return false;
      if (selectedPersonId && i.personId !== selectedPersonId) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = i.personName.toLowerCase().includes(q);
        const matchSummary = i.summary.toLowerCase().includes(q);
        const matchResult = (i.outcome?.result || "").toLowerCase().includes(q);
        if (!matchName && !matchSummary && !matchResult) return false;
      }
      return true;
    });
  }, [interactions, typeFilter, sentimentFilter, selectedPersonId, searchQuery]);

  // Statistics & Health
  const stats = useMemo(() => {
    const total = interactions.length;
    const pendingFu = followUps.filter((f) => f.status === "pending").length;
    const doneFu = followUps.filter((f) => f.status === "done").length;
    const totalFu = followUps.length;
    const fuRate = totalFu > 0 ? Math.round((doneFu / totalFu) * 100) : 100;

    const overdueCount = followUps.filter(
      (f) => f.status === "pending" && f.dueDate < todayStr
    ).length;

    // Days since last interaction per person
    const peopleHealth = people.map((p) => {
      const pInts = interactions
        .filter((i) => i.personId === p.id)
        .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));

      let daysSince = 999;
      let lastDate = "Belum pernah";
      if (pInts.length > 0) {
        const lastOccurred = new Date(pInts[0].occurredAt).getTime();
        const now = Date.now();
        daysSince = Math.max(0, Math.floor((now - lastOccurred) / (1000 * 3600 * 24)));
        lastDate = new Date(pInts[0].occurredAt).toLocaleDateString();
      }

      return {
        person: p,
        daysSince,
        lastDate,
        totalInteractions: pInts.length,
      };
    });

    return { total, pendingFu, doneFu, fuRate, overdueCount, peopleHealth };
  }, [interactions, followUps, people, todayStr]);

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPersonId || !intSummary.trim()) return;

    const targetPerson = people.find((p) => p.id === targetPersonId);
    const org = organizations.find((o) => o.id === targetPerson?.organizationId);

    logInteraction(
      {
        personId: targetPersonId,
        personName: targetPerson?.fullName || "Person",
        organizationName: org?.name,
        type: intType,
        direction: intDirection,
        occurredAt: new Date(intDate).toISOString(),
        summary: intSummary.trim(),
        outcome: {
          interactionId: "",
          sentiment: intSentiment,
          result: intResult.trim() || undefined,
          nextSteps: intNextSteps.trim() || undefined,
        },
        loggedBy: "Budi Santoso",
      },
      fuDesc.trim() ? { description: fuDesc.trim(), dueDate: fuDueDate || todayStr } : undefined
    );

    showToast("Interaksi berhasil dicatat ke Relationship Timeline!");
    setIsLogModalOpen(false);
    setIntSummary("");
    setIntResult("");
    setIntNextSteps("");
    setFuDesc("");
    setFuDueDate("");
  };

  const handleConvertToTask = (fu: FollowUp) => {
    const fakeTaskId = `task-${Date.now()}`;
    convertFollowUpToTask(fu.id, fakeTaskId);
    showToast(`Follow-up dikonversi menjadi Task (#01) [${fakeTaskId}]!`);
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
          {/* View Tab Switchers - Compact Segmented Icon Pills */}
          <div className="flex items-center gap-0.5 border border-border/60 rounded-lg p-0.5 bg-muted/70 text-xs shrink-0">
            {[
              { id: "recent", label: `Interaksi Terbaru (${interactions.length})`, icon: Clock },
              { id: "pending_followups", label: `Pending Follow-ups (${stats.pendingFu})`, icon: CheckSquare },
              { id: "overdue_followups", label: `Follow-up Terlambat (${stats.overdueCount})`, icon: AlertTriangle },
              { id: "relationship_health", label: "Kesehatan Relasi", icon: Flame },
              { id: "stats", label: "Statistik Komunikasi", icon: BarChart3 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id && (tab.id !== "recent" || !selectedPersonId);
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as InteractionViewMode);
                    if (tab.id === "recent") setSelectedPersonId(null);
                  }}
                  title={tab.label}
                  aria-label={tab.label}
                  className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-background text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsLogModalOpen(true)}
            title="Catat Interaksi Baru"
            aria-label="Catat Interaksi"
            className="p-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0 flex items-center justify-center"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </ShellHeader>

      {/* Page Header Banner */}
      <div className="px-6 py-4 border-b border-border bg-card/40 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-xl shadow-lg shadow-sky-500/20 shrink-0">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Interaction Manager</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-500/30">
                  App #36
                </span>
                <span className="text-xs text-muted-foreground">
                  Relationship Timeline • Histori Komunikasi & Follow-up Eksekutif
                </span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Menjawab "kapan terakhir saya menghubungi orang ini, tentang apa, dan apa tindak lanjutnya" (CRM Touchpoints).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 mt-4">
        {/* STATS VIEW */}
        {activeTab === "stats" && (
          <div className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Total Interaksi</div>
                <div className="text-3xl font-extrabold text-white mt-1">{stats.total}</div>
                <div className="text-xs text-muted-foreground mt-1">Touchpoint tercatat</div>
              </div>

              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Penyelesaian Follow-up</div>
                <div className="text-3xl font-extrabold text-emerald-400 mt-1">{stats.fuRate}%</div>
                <div className="text-xs text-muted-foreground mt-1">{stats.doneFu} komitmen selesai</div>
              </div>

              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Follow-up Terlambat</div>
                <div className="text-3xl font-extrabold text-rose-400 mt-1">{stats.overdueCount}</div>
                <div className="text-xs text-muted-foreground mt-1">Melewati due date</div>
              </div>

              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Relasi Dipantau</div>
                <div className="text-3xl font-extrabold text-sky-400 mt-1">{people.length}</div>
                <div className="text-xs text-muted-foreground mt-1">Kontak People Manager</div>
              </div>
            </div>
          </div>
        )}

        {/* RELATIONSHIP HEALTH VIEW */}
        {activeTab === "relationship_health" && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-4 bg-card/40 border border-border/60 rounded-xl text-xs text-muted-foreground">
              Sinyal relasi yang mulai "dingin" — menghitung berapa hari sejak interaksi terakhir dengan setiap individu.
            </div>

            <div className="space-y-3">
              {stats.peopleHealth.map(({ person, daysSince, lastDate }) => {
                let badgeClass = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
                let statusLabel = "Hangat (Aktif)";
                if (daysSince > 30) {
                  badgeClass = "bg-rose-500/20 text-rose-300 border-rose-500/30";
                  statusLabel = "Mulai Dingin (> 30 hari)";
                } else if (daysSince > 14) {
                  badgeClass = "bg-amber-500/20 text-amber-300 border-amber-500/30";
                  statusLabel = "Perlu Ditindaklanjuti";
                }

                return (
                  <div
                    key={person.id}
                    className="p-4 bg-card/80 border border-border rounded-xl flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-foreground">{person.fullName}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeClass}`}>
                          {statusLabel}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {person.jobTitle || "Independen"} • Interaksi terakhir: {lastDate} ({daysSince === 999 ? "N/A" : `${daysSince} hari lalu`})
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setTargetPersonId(person.id);
                          setIsLogModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold"
                      >
                        + Catat Kontak
                      </button>

                      <button
                        onClick={() => {
                          setSelectedPersonId(person.id);
                          setActiveTab("recent");
                        }}
                        className="px-3 py-1.5 bg-card hover:bg-muted-foreground/30 text-foreground rounded-lg text-xs font-medium"
                      >
                        Lihat Linimasa
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PENDING & OVERDUE FOLLOW-UPS VIEW */}
        {(activeTab === "pending_followups" || activeTab === "overdue_followups") && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-4 bg-card/40 border border-border/60 rounded-xl text-xs text-muted-foreground">
              Daftar janji dan komitmen tindak lanjut hasil interaksi. Dapat dikonversi langsung menjadi Task nyata (#01).
            </div>

            <div className="space-y-3">
              {followUps
                .filter((f) => {
                  if (activeTab === "overdue_followups") {
                    return f.status === "pending" && f.dueDate < todayStr;
                  }
                  return f.status === "pending";
                })
                .map((fu) => {
                  const int = interactions.find((i) => i.id === fu.interactionId);

                  return (
                    <div
                      key={fu.id}
                      className="p-4 bg-card/80 border border-border rounded-xl flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">{fu.description}</span>
                          {fu.dueDate < todayStr && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              TERLAMBAT
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Target: {fu.dueDate} • Hasil interaksi dengan:{" "}
                          <strong className="text-foreground">{int?.personName}</strong>
                        </div>
                        {fu.linkedTaskId && (
                          <div className="text-[11px] text-cyan-400 font-mono">
                            Terkonversi ke Task ID: {fu.linkedTaskId}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!fu.linkedTaskId && (
                          <button
                            onClick={() => handleConvertToTask(fu)}
                            className="px-3 py-1.5 bg-card hover:bg-muted-foreground/30 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold flex items-center gap-1"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            Konversi ke Task
                          </button>
                        )}

                        <button
                          onClick={() => {
                            updateFollowUpStatus(fu.id, "done");
                            showToast("Follow-up ditandai SELESAI!");
                          }}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                        >
                          Tandai Selesai
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* RECENT INTERACTIONS & TIMELINE PER PERSON */}
        {activeTab === "recent" && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-card/80 border border-border rounded-xl">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari ringkasan, kontak, hasil deal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs md:text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-sky-500"
                >
                  <option value="all">Semua Tipe Interaksi</option>
                  <option value="call">Call / Telepon</option>
                  <option value="meeting">Meeting / Rapat</option>
                  <option value="email">Email</option>
                  <option value="message">Message / Chat</option>
                  <option value="visit">Visit / On-site</option>
                </select>

                <select
                  value={sentimentFilter}
                  onChange={(e) => setSentimentFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-sky-500"
                >
                  <option value="all">Semua Sentimen</option>
                  <option value="positive">Positif</option>
                  <option value="neutral">Netral</option>
                  <option value="negative">Negatif</option>
                </select>

                {selectedPersonId && (
                  <button
                    onClick={() => setSelectedPersonId(null)}
                    className="px-2.5 py-1.5 bg-card hover:bg-muted-foreground/30 text-foreground rounded-lg text-xs flex items-center gap-1"
                  >
                    <span>Reset Filter Orang</span>
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* TIMELINE FEED */}
            <div className="relative border-l-2 border-border pl-6 ml-4 space-y-6 py-2">
              {filteredInteractions.map((item) => {
                const itemFollowUps = followUps.filter((f) => f.interactionId === item.id);

                return (
                  <div key={item.id} className="relative group">
                    {/* Circle marker */}
                    <div className="absolute -left-[31px] top-1 size-4 rounded-full bg-sky-500 border-4 border-border shadow" />

                    <div className="p-5 bg-card/80 border border-border rounded-xl space-y-3 hover:border-border transition">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded bg-card/60">{getTypeIcon(item.type)}</span>
                            <span className="font-bold text-base text-foreground hover:text-sky-400 cursor-pointer">
                              {item.personName}
                            </span>
                            {item.organizationName && (
                              <span className="text-xs text-muted-foreground">({item.organizationName})</span>
                            )}
                            <span className="text-[11px] text-muted-foreground font-mono">
                              {item.direction === "inbound" ? "← Masuk (Inbound)" : "→ Keluar (Outbound)"}
                            </span>
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Waktu: {new Date(item.occurredAt).toLocaleString()} • Dicatat oleh: {item.loggedBy}
                          </div>
                        </div>

                        {getSentimentBadge(item.outcome?.sentiment)}
                      </div>

                      {/* Summary Note */}
                      <p className="text-xs md:text-sm text-foreground leading-relaxed bg-background/60 p-3 rounded-lg border border-border">
                        "{item.summary}"
                      </p>

                      {/* Outcome Details */}
                      {item.outcome?.result && (
                        <div className="text-xs text-foreground space-y-1 pt-1">
                          <div>
                            <span className="font-semibold text-sky-400">Hasil & Kesepakatan:</span>{" "}
                            {item.outcome.result}
                          </div>
                          {item.outcome.nextSteps && (
                            <div>
                              <span className="font-semibold text-muted-foreground">Langkah Berikutnya:</span>{" "}
                              {item.outcome.nextSteps}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Attached Follow-ups */}
                      {itemFollowUps.length > 0 && (
                        <div className="pt-2 border-t border-border/60 space-y-1.5">
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Tindak Lanjut Terkait (Follow-up):
                          </div>
                          {itemFollowUps.map((fu) => (
                            <div
                              key={fu.id}
                              className="p-2 bg-background/80 rounded border border-border flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <span className={fu.status === "done" ? "line-through text-muted-foreground" : "text-foreground"}>
                                  {fu.description}
                                </span>
                                <span className="text-[10px] text-muted-foreground">(Batas: {fu.dueDate})</span>
                              </div>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                  fu.status === "done"
                                    ? "bg-emerald-500/20 text-emerald-300"
                                    : "bg-amber-500/20 text-amber-300"
                                }`}
                              >
                                {fu.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: LOG INTERACTION */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-white">Catat Interaksi / Touchpoint Baru</h3>
              <button onClick={() => setIsLogModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Orang yang Dihubungi <span className="text-rose-400">*</span>
                </label>
                <select
                  required
                  value={targetPersonId}
                  onChange={(e) => setTargetPersonId(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-sky-500"
                >
                  <option value="">Pilih Kontak dari People Manager (#35)...</option>
                  {people.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.jobTitle || "Independen"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Tipe Media</label>
                  <select
                    value={intType}
                    onChange={(e) => setIntType(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-sky-500"
                  >
                    <option value="call">Call / Telepon</option>
                    <option value="meeting">Meeting / Rapat</option>
                    <option value="email">Email</option>
                    <option value="message">WhatsApp / Chat</option>
                    <option value="visit">Visit / Tatap Muka</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Arah</label>
                  <select
                    value={intDirection}
                    onChange={(e) => setIntDirection(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-sky-500"
                  >
                    <option value="outbound">Outbound (Kita)</option>
                    <option value="inbound">Inbound (Masuk)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={intDate}
                    onChange={(e) => setIntDate(e.target.value)}
                    className="w-full px-2.5 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Ringkasan Percakapan / Notulen <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Apa poin-poin krusial yang dibahas?"
                  value={intSummary}
                  onChange={(e) => setIntSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-background border border-border rounded-lg">
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Sentimen Hasil</label>
                  <select
                    value={intSentiment}
                    onChange={(e) => setIntSentiment(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-background border border-border rounded text-xs text-foreground"
                  >
                    <option value="positive">Positif (Maju/Deal)</option>
                    <option value="neutral">Netral (Sedang Berjalan)</option>
                    <option value="negative">Negatif (Kendala/Tolak)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Hasil / Kesimpulan</label>
                  <input
                    type="text"
                    placeholder="mis. Deal disepakati"
                    value={intResult}
                    onChange={(e) => setIntResult(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-background border border-border rounded text-xs text-foreground"
                  />
                </div>
              </div>

              {/* Optional Inline Follow-up */}
              <div className="p-3 bg-background border border-border rounded-lg space-y-2">
                <div className="text-xs font-semibold text-sky-400">Rencana Tindak Lanjut (Follow-Up):</div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Deskripsi tindak lanjut..."
                    value={fuDesc}
                    onChange={(e) => setFuDesc(e.target.value)}
                    className="col-span-2 px-2.5 py-1.5 bg-background border border-border rounded text-xs text-foreground"
                  />
                  <input
                    type="date"
                    value={fuDueDate}
                    onChange={(e) => setFuDueDate(e.target.value)}
                    className="px-2.5 py-1.5 bg-background border border-border rounded text-xs text-foreground"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-3.5 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold"
                >
                  Simpan Interaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
