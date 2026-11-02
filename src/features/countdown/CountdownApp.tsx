import { ShellHeader } from "@/app/shell-header";
import React, { useState, useEffect, useMemo } from "react";
import {
  Timer,
  Plus,
  Search,
  Pin,
  Copy,
  Archive,
  ArchiveRestore,
  Trash2,
  Edit2,
  ExternalLink,
  RefreshCw,
  LayoutGrid,
  List as ListIcon,
  Columns3,
  Layers,
  Sparkles,
  X,
  ArrowRight,
  History,
  BarChart3,
  Calendar,
  Clock,
  CheckCircle2,
  Repeat,
} from "lucide-react";
import {
  useCountdownStore,
} from "./store";
import {
  CountdownItem,
  TargetType,
  CountdownDirection,
  RecurrenceType,
  EntityType,
  CountdownTemplate,
  ViewMode,
  FilterTab,
  Reminder,
} from "./types";

// Real-time calculation helper
function calculateTimeRemaining(targetAt: string, direction: CountdownDirection) {
  const targetTime = new Date(targetAt).getTime();
  const now = Date.now();
  let diff = targetTime - now;

  const isPast = diff <= 0;
  if (direction === "count_up" && isPast) {
    diff = Math.abs(diff);
  } else if (diff < 0) {
    diff = 0;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isPast, totalMs: diff };
}

export function CountdownApp() {
  const {
    countdowns,
    categories,
    activities,
    externalEntities,
    statistics,
    templates,
    addCountdown,
    updateCountdown,
    duplicateCountdown,
    togglePin,
    archiveCountdown,
    restoreCountdown,
    deleteCountdown,
    convertDirection,
  } = useCountdownStore();

  // State
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [nowTick, setNowTick] = useState<number>(Date.now());

  // Modals & Panels
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CountdownItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State for Create/Edit
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formTargetDate, setFormTargetDate] = useState("");
  const [formTargetTime, setFormTargetTime] = useState("09:00");
  const [formTargetType, setFormTargetType] = useState<TargetType>("exact_time");
  const [formDirection, setFormDirection] = useState<CountdownDirection>("count_down");
  const [formAutoSwitch, setFormAutoSwitch] = useState(false);
  const [formCategoryId, setFormCategoryId] = useState("cat-kerja");
  const [formTags, setFormTags] = useState<string[]>([]);
  const [formCoverUrl, setFormCoverUrl] = useState("");
  const [formPinned, setFormPinned] = useState(false);

  // Recurrence & Link Entity
  const [formIsRecurring, setFormIsRecurring] = useState(false);
  const [formRecurrenceType, setFormRecurrenceType] = useState<RecurrenceType>("yearly");
  const [formLinkedType, setFormLinkedType] = useState<EntityType | "none">("none");
  const [formLinkedId, setFormLinkedId] = useState("");
  const [formReminders, setFormReminders] = useState<string[]>(["P7D", "P1D"]);

  // 1-second real-time tick interval
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTick(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filtered Countdowns
  const filteredItems = useMemo(() => {
    return countdowns.filter((item) => {
      // Tab filter
      if (filterTab === "all" && item.status === "Archived") return false;
      if (filterTab === "upcoming") {
        if (item.status !== "Active" || item.direction === "count_up") return false;
        const targetTime = new Date(item.targetAt).getTime();
        const in30d = nowTick + 30 * 86400000;
        if (targetTime < nowTick || targetTime > in30d) return false;
      }
      if (filterTab === "reached" && item.status !== "Reached") return false;
      if (filterTab === "pinned" && (!item.pinned || item.status === "Archived")) return false;
      if (filterTab === "recurring" && (!item.recurrence || item.status === "Archived")) return false;
      if (filterTab === "archived" && item.status !== "Archived") return false;

      // Category filter
      if (selectedCategory !== "all" && item.categoryId !== selectedCategory) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const cat = categories.find((c) => c.id === item.categoryId)?.name.toLowerCase() || "";
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q) || false;
        const matchCat = cat.includes(q);
        const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchCat && !matchTags) return false;
      }

      return true;
    });
  }, [countdowns, filterTab, selectedCategory, searchQuery, nowTick, categories]);

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormTitle("");
    setFormDesc("");
    const future = new Date(Date.now() + 14 * 86400000);
    setFormTargetDate(future.toISOString().split("T")[0]);
    setFormTargetTime("10:00");
    setFormTargetType("exact_time");
    setFormDirection("count_down");
    setFormAutoSwitch(false);
    setFormCategoryId(categories[0]?.id || "cat-kerja");
    setFormTags(["Milestone"]);
    setFormCoverUrl("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80");
    setFormPinned(false);
    setFormIsRecurring(false);
    setFormRecurrenceType("yearly");
    setFormLinkedType("none");
    setFormLinkedId("");
    setFormReminders(["P7D", "P1D"]);
    setIsCreateModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (item: CountdownItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormDesc(item.description || "");
    const d = new Date(item.targetAt);
    setFormTargetDate(d.toISOString().split("T")[0]);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    setFormTargetTime(`${hh}:${mm}`);
    setFormTargetType(item.targetType);
    setFormDirection(item.direction);
    setFormAutoSwitch(!!item.autoSwitchCountUp);
    setFormCategoryId(item.categoryId || "cat-kerja");
    setFormTags(item.tags || []);
    setFormCoverUrl(item.coverImage?.url || "");
    setFormPinned(item.pinned);
    setFormIsRecurring(!!item.recurrence);
    setFormRecurrenceType(item.recurrence?.type === "monthly" ? "monthly" : item.recurrence?.type === "weekly" ? "weekly" : "yearly");
    setFormLinkedType(item.linkedEntity ? item.linkedEntity.entityType : "none");
    setFormLinkedId(item.linkedEntity ? item.linkedEntity.entityId : "");
    setFormReminders(item.reminders?.map((r) => r.triggerOffset) || ["P7D", "P1D"]);
    setIsCreateModalOpen(true);
  };

  // Apply template
  const handleApplyTemplate = (tpl: CountdownTemplate) => {
    setIsTemplateModalOpen(false);
    setEditingItem(null);
    setFormTitle(tpl.defaultTitle);
    setFormDesc(tpl.description);
    const cat = categories.find((c) => c.name.toLowerCase().includes(tpl.categoryName.toLowerCase())) || categories[0];
    setFormCategoryId(cat ? cat.id : "cat-kerja");
    const future = new Date(Date.now() + 30 * 86400000);
    setFormTargetDate(future.toISOString().split("T")[0]);
    setFormTargetTime("09:00");
    setFormTargetType(tpl.targetType);
    setFormDirection(tpl.direction);
    setFormAutoSwitch(!!tpl.autoSwitchCountUp);
    setFormTags([tpl.badge]);
    setFormCoverUrl(tpl.suggestedCover);
    setFormPinned(true);
    setFormIsRecurring(!!tpl.recurrence);
    setFormRecurrenceType(tpl.recurrence?.type || "yearly");
    setFormLinkedType(tpl.linkedEntityType || "none");
    setFormLinkedId("");
    setFormReminders(tpl.defaultReminderOffsets);
    setIsCreateModalOpen(true);
  };

  // Submit form
  const handleSaveCountdown = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formTargetDate) return;

    let targetIso: string;
    if (formTargetType === "date_only" || formTargetType === "all_day") {
      targetIso = new Date(`${formTargetDate}T00:00:00`).toISOString();
    } else {
      targetIso = new Date(`${formTargetDate}T${formTargetTime || "00:00"}:00`).toISOString();
    }

    const reminderItems: Reminder[] = formReminders.map((offset, i) => ({
      id: `rem-${Date.now()}-${i}`,
      countdownId: editingItem?.id || `cd-temp`,
      triggerOffset: offset,
      triggerAt: new Date(new Date(targetIso).getTime() - 86400000).toISOString(),
      status: "pending",
    }));

    const linked =
      formLinkedType !== "none" && formLinkedId
        ? {
            entityType: formLinkedType,
            entityId: formLinkedId,
            entityTitle:
              externalEntities.find((e) => e.id === formLinkedId)?.title || formLinkedId,
            isBroken: false,
          }
        : undefined;

    const cover = formCoverUrl
      ? {
          id: `cov-${Date.now()}`,
          countdownId: editingItem?.id || `cd-temp`,
          name: formTitle,
          type: "image" as const,
          url: formCoverUrl,
          createdAt: new Date().toISOString(),
        }
      : undefined;

    const payload = {
      title: formTitle,
      description: formDesc,
      targetAt: targetIso,
      targetType: formTargetType,
      direction: formDirection,
      autoSwitchCountUp: formAutoSwitch,
      categoryId: formCategoryId,
      tags: formTags,
      coverImage: cover,
      pinned: formPinned,
      recurrence: formIsRecurring
        ? {
            type: formRecurrenceType,
            interval: 1,
          }
        : undefined,
      linkedEntity: linked,
      reminders: reminderItems,
    };

    if (editingItem) {
      updateCountdown(editingItem.id, payload);
    } else {
      addCountdown(payload);
    }

    setIsCreateModalOpen(false);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-muted/40/60 dark:bg-background flex flex-col font-sans">
      {/* 1. TOP HEADER - Standalone Ecosystem #11 Portaled to Main Header */}
      <ShellHeader>
        <div className="flex items-center gap-1 shrink-0">
          {/* View Mode Segmented Controls - Icon-Only */}
          <div className="flex items-center gap-0.5 border border-border/60 rounded-lg p-0.5 bg-muted/70 text-xs shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer shrink-0 ${
                viewMode === "grid"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Tampilan Kartu / Grid"
              aria-label="Grid"
            >
              <LayoutGrid className="size-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer shrink-0 ${
                viewMode === "list"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Tampilan Tabel / List"
              aria-label="List"
            >
              <ListIcon className="size-3.5" />
            </button>
            <button
              onClick={() => setViewMode("category")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer shrink-0 ${
                viewMode === "category"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Tampilan Berdasarkan Kategori"
              aria-label="Kategori"
            >
              <Columns3 className="size-3.5" />
            </button>
            <button
              onClick={() => setViewMode("widget")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer shrink-0 ${
                viewMode === "widget"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Tampilan Widget Homescreen"
              aria-label="Widget"
            >
              <Layers className="size-3.5" />
            </button>
          </div>

          {/* Filter Tab Quick Switcher (Icon-Only) */}
          <div className="flex items-center gap-0.5 border border-border/60 rounded-lg p-0.5 bg-muted/70 text-xs shrink-0">
            {[
              { id: "all", label: "Semua", icon: Timer },
              { id: "upcoming", label: "Mendatang", icon: Clock },
              { id: "reached", label: "Tercapai", icon: CheckCircle2 },
              { id: "pinned", label: "Dipasangi Pin", icon: Pin },
              { id: "recurring", label: "Berulang", icon: Repeat },
              { id: "archived", label: "Arsip", icon: Archive },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterTab(tab.id as any)}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer shrink-0 ${
                    filterTab === tab.id
                      ? "bg-background text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title={tab.label}
                  aria-label={tab.label}
                >
                  <TabIcon className="size-3.5" />
                </button>
              );
            })}
          </div>

          {/* Search Toggle & Compact Input */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsSearchOpen((prev) => !prev)}
              className={`p-1.5 rounded-lg border border-border transition-colors cursor-pointer shrink-0 ${
                isSearchOpen || searchQuery ? "bg-primary text-primary-foreground font-bold shadow-xs" : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
              title="Cari Countdown"
              aria-label="Cari Countdown"
            >
              <Search className="size-3.5" />
            </button>
            {(isSearchOpen || searchQuery) && (
              <input
                type="text"
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-24 sm:w-32 px-2 py-0.5 text-xs bg-muted/70 border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
            )}
          </div>

          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="p-1.5 rounded-lg border border-border bg-background hover:bg-accent text-xs font-medium text-foreground transition-colors cursor-pointer shrink-0 flex items-center justify-center"
            title="Gunakan template siap pakai"
            aria-label="Template"
          >
            <Sparkles className="size-3.5 text-amber-500" />
          </button>

          <button
            onClick={() => setIsStatsModalOpen(true)}
            className="p-1.5 rounded-lg border border-border bg-background hover:bg-accent text-xs font-medium text-foreground transition-colors cursor-pointer shrink-0 flex items-center justify-center"
            title="Metrik & Statistik Ecosystem"
            aria-label="Statistik"
          >
            <BarChart3 className="size-3.5 text-indigo-500" />
          </button>

          <button
            onClick={() => setIsHistoryDrawerOpen(true)}
            className="p-1.5 rounded-lg border border-border bg-background hover:bg-accent text-xs font-medium text-foreground transition-colors cursor-pointer shrink-0 flex items-center justify-center"
            title="Audit trail & histori perubahan"
            aria-label="Audit Trail"
          >
            <History className="size-3.5 text-muted-foreground" />
          </button>

          <button
            onClick={handleOpenCreate}
            title="Buat Countdown Baru"
            aria-label="Countdown Baru"
            className="p-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-xs hover:opacity-90 transition-opacity cursor-pointer shrink-0 flex items-center justify-center"
          >
            <Plus className="size-3.5" strokeWidth={2.5} />
          </button>
        </div>
      </ShellHeader>

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {filteredItems.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center max-w-md mx-auto my-12 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <Timer className="size-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">Tidak Ada Countdown</h3>
              <p className="text-xs text-muted-foreground">
                {searchQuery || selectedCategory !== "all"
                  ? "Tidak ada target waktu yang sesuai dengan filter pencarian Anda."
                  : "Mulai buat hitung mundur baru untuk momen peluncuran, event, atau milestone penting."}
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold cursor-pointer"
              >
                Buat Countdown Baru
              </button>
              <button
                onClick={() => setIsTemplateModalOpen(true)}
                className="px-4 py-2 rounded-xl border border-border bg-background hover:bg-accent text-xs font-medium text-foreground cursor-pointer"
              >
                Pilih Template
              </button>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => {
              const cat = categories.find((c) => c.id === item.categoryId);
              const remaining = calculateTimeRemaining(item.targetAt, item.direction);
              return (
                <CountdownCard
                  key={item.id}
                  item={item}
                  category={cat}
                  remaining={remaining}
                  onTogglePin={() => togglePin(item.id)}
                  onEdit={() => handleOpenEdit(item)}
                  onDuplicate={() => duplicateCountdown(item.id)}
                  onArchive={() => archiveCountdown(item.id)}
                  onRestore={() => restoreCountdown(item.id)}
                  onDelete={() => setDeleteConfirmId(item.id)}
                  onConvertDirection={() => convertDirection(item.id)}
                />
              );
            })}
          </div>
        ) : viewMode === "list" ? (
          /* LIST VIEW */
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                    <th className="p-3.5 pl-4">Judul & Kategori</th>
                    <th className="p-3.5">Arah & Tipe</th>
                    <th className="p-3.5">Target Waktu</th>
                    <th className="p-3.5">Sisa Waktu Real-Time</th>
                    <th className="p-3.5">Tautan Eksternal</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right pr-4">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredItems.map((item) => {
                    const cat = categories.find((c) => c.id === item.categoryId);
                    const rem = calculateTimeRemaining(item.targetAt, item.direction);
                    return (
                      <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                        <td className="p-3.5 pl-4">
                          <div className="flex items-center gap-2.5">
                            <button
                              onClick={() => togglePin(item.id)}
                              className={`p-1 rounded hover:bg-accent cursor-pointer ${
                                item.pinned ? "text-amber-500" : "text-muted-foreground/40"
                              }`}
                              title={item.pinned ? "Lepas Pin" : "Pasang Pin"}
                            >
                              <Pin className="size-3.5" />
                            </button>
                            <div>
                              <div className="font-semibold text-foreground flex items-center gap-1.5">
                                <span>{item.title}</span>
                                {item.recurrence && (
                                  <span title="Berulang berkala">
                                    <RefreshCw className="size-3 text-indigo-500" />
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span
                                  className="size-2 rounded-full"
                                  style={{ backgroundColor: cat?.color || "#94a3b8" }}
                                />
                                <span className="text-[11px] text-muted-foreground">
                                  {cat?.name || "Umum"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                              item.direction === "count_up"
                                ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200"
                                : "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200"
                            }`}
                          >
                            {item.direction === "count_up" ? "Count Up" : "Count Down"}
                          </span>
                        </td>
                        <td className="p-3.5 text-muted-foreground">
                          {new Date(item.targetAt).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: item.targetType === "exact_time" ? "short" : undefined,
                          })}
                        </td>
                        <td className="p-3.5">
                          <span className="font-mono font-bold text-foreground">
                            {rem.days}h {rem.hours}j {rem.minutes}m {rem.seconds}d
                          </span>
                        </td>
                        <td className="p-3.5">
                          {item.linkedEntity ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-muted dark:bg-card text-foreground dark:text-foreground">
                              <ExternalLink className="size-2.5" />
                              <span className="truncate max-w-[120px]">
                                {item.linkedEntity.entityTitle || item.linkedEntity.entityId}
                              </span>
                            </span>
                          ) : (
                            <span className="text-muted-foreground/60">—</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.status === "Active"
                                ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300"
                                : item.status === "Reached"
                                ? "bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300"
                                : "bg-muted dark:bg-card text-muted-foreground dark:text-muted-foreground"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right pr-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="size-3.5" />
                            </button>
                            <button
                              onClick={() => duplicateCountdown(item.id)}
                              className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer"
                              title="Duplikasi"
                            >
                              <Copy className="size-3.5" />
                            </button>
                            {item.status === "Archived" ? (
                              <button
                                onClick={() => restoreCountdown(item.id)}
                                className="p-1 rounded hover:bg-accent text-emerald-600 cursor-pointer"
                                title="Kembalikan dari Arsip"
                              >
                                <ArchiveRestore className="size-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => archiveCountdown(item.id)}
                                className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer"
                                title="Arsipkan"
                              >
                                <Archive className="size-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => setDeleteConfirmId(item.id)}
                              className="p-1 rounded hover:bg-accent text-rose-500 cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : viewMode === "category" ? (
          /* CATEGORY SWIMLANE VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const catItems = filteredItems.filter((i) => i.categoryId === cat.id);
              return (
                <div
                  key={cat.id}
                  className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <h4 className="text-xs font-bold text-foreground">{cat.name}</h4>
                    </div>
                    <span className="text-[11px] font-semibold text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
                      {catItems.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {catItems.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground italic py-6 text-center">
                        Belum ada countdown dalam kategori ini.
                      </p>
                    ) : (
                      catItems.map((item) => {
                        const rem = calculateTimeRemaining(item.targetAt, item.direction);
                        return (
                          <div
                            key={item.id}
                            className="p-3 rounded-xl border border-border bg-background hover:border-primary/40 transition-colors space-y-2 group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="text-xs font-bold text-foreground line-clamp-1">
                                {item.title}
                              </h5>
                              <button
                                onClick={() => handleOpenEdit(item)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-foreground"
                              >
                                <Edit2 className="size-3" />
                              </button>
                            </div>

                            <div className="grid grid-cols-4 gap-1 text-center bg-muted/30 p-1.5 rounded-lg font-mono">
                              <div>
                                <span className="text-xs font-bold text-foreground block">
                                  {rem.days}
                                </span>
                                <span className="text-[8px] text-muted-foreground uppercase">H</span>
                              </div>
                              <div>
                                <span className="text-xs font-bold text-foreground block">
                                  {rem.hours}
                                </span>
                                <span className="text-[8px] text-muted-foreground uppercase">J</span>
                              </div>
                              <div>
                                <span className="text-xs font-bold text-foreground block">
                                  {rem.minutes}
                                </span>
                                <span className="text-[8px] text-muted-foreground uppercase">M</span>
                              </div>
                              <div>
                                <span className="text-xs font-bold text-primary block">
                                  {rem.seconds}
                                </span>
                                <span className="text-[8px] text-muted-foreground uppercase">D</span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* WIDGET HOMESCREEN PREVIEW VIEW (§11) */
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 dark:border-indigo-900/50 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Layers className="size-4 text-indigo-500" />
                  Pratinjau Widget Homescreen & Dashboard
                </h3>
                <p className="text-xs text-muted-foreground">
                  Simulasi bagaimana modul Countdown mengalirkan data ringkas ke homescreen atau app lain tanpa duplikasi objek.
                </p>
              </div>
            </div>

            {/* Spotlight Hero Widget */}
            {countdowns.find((c) => c.pinned && c.status === "Active") ? (
              (() => {
                const hero = countdowns.find((c) => c.pinned && c.status === "Active")!;
                const rem = calculateTimeRemaining(hero.targetAt, hero.direction);
                return (
                  <div className="relative rounded-3xl overflow-hidden border border-border shadow-lg bg-foreground text-background p-6 sm:p-8">
                    {hero.coverImage?.url && (
                      <img
                        src={hero.coverImage.url}
                        alt={hero.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-xs"
                      />
                    )}
                    <div className="relative z-10 space-y-4 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-card/20 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase">
                          Spotlight Countdown
                        </span>
                        <span className="text-xs text-white/70">
                          {hero.direction === "count_up" ? "Dihitung sejak" : "Target"}:{" "}
                          {new Date(hero.targetAt).toLocaleDateString("id-ID", { dateStyle: "long" })}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                        {hero.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-white/80 line-clamp-2">
                        {hero.description}
                      </p>

                      <div className="grid grid-cols-4 gap-2 sm:gap-4 pt-2 max-w-md">
                        <div className="bg-card/10 backdrop-blur-md rounded-2xl p-3 text-center border border-border/15">
                          <span className="text-2xl sm:text-4xl font-mono font-black block">
                            {rem.days}
                          </span>
                          <span className="text-[10px] sm:text-xs text-white/70 font-semibold uppercase">
                            Hari
                          </span>
                        </div>
                        <div className="bg-card/10 backdrop-blur-md rounded-2xl p-3 text-center border border-border/15">
                          <span className="text-2xl sm:text-4xl font-mono font-black block">
                            {rem.hours}
                          </span>
                          <span className="text-[10px] sm:text-xs text-white/70 font-semibold uppercase">
                            Jam
                          </span>
                        </div>
                        <div className="bg-card/10 backdrop-blur-md rounded-2xl p-3 text-center border border-border/15">
                          <span className="text-2xl sm:text-4xl font-mono font-black block">
                            {rem.minutes}
                          </span>
                          <span className="text-[10px] sm:text-xs text-white/70 font-semibold uppercase">
                            Menit
                          </span>
                        </div>
                        <div className="bg-card/10 backdrop-blur-md rounded-2xl p-3 text-center border border-border/15">
                          <span className="text-2xl sm:text-4xl font-mono font-black block text-amber-300">
                            {rem.seconds}
                          </span>
                          <span className="text-[10px] sm:text-xs text-white/70 font-semibold uppercase">
                            Detik
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : null}

            {/* 2x2 Mini Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {countdowns
                .filter((c) => c.status === "Active")
                .slice(0, 4)
                .map((item) => {
                  const rem = calculateTimeRemaining(item.targetAt, item.direction);
                  return (
                    <div
                      key={item.id}
                      className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-xs hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground uppercase">
                          {item.direction === "count_up" ? "Maju" : "Mundur"}
                        </span>
                        {item.pinned && <Pin className="size-3 text-amber-500 fill-amber-500" />}
                      </div>
                      <h4 className="text-xs font-bold text-foreground line-clamp-1">{item.title}</h4>
                      <div className="flex items-baseline gap-1 font-mono">
                        <span className="text-2xl font-black text-foreground">{rem.days}</span>
                        <span className="text-xs text-muted-foreground">hari tersisa</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {rem.hours} jam {rem.minutes} menit {rem.seconds} dtk
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </main>

      {/* 4. MODAL: CREATE / EDIT COUNTDOWN */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <Timer className="size-5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">
                  {editingItem ? "Edit Countdown" : "Buat Countdown Baru"}
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCountdown} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Title & Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Judul Countdown <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Peluncuran Produk Enterprise v2.0"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Deskripsi / Catatan Tambahan</label>
                <textarea
                  rows={2}
                  placeholder="Keterangan singkat tentang event atau milestone ini..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                />
              </div>

              {/* Target Date, Time & Target Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-semibold text-foreground">Tanggal Target *</label>
                  <input
                    type="date"
                    required
                    value={formTargetDate}
                    onChange={(e) => setFormTargetDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-semibold text-foreground">Waktu (Jam)</label>
                  <input
                    type="time"
                    disabled={formTargetType !== "exact_time"}
                    value={formTargetTime}
                    onChange={(e) => setFormTargetTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-1 focus:ring-primary focus:outline-none disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-semibold text-foreground">Tipe Target</label>
                  <select
                    value={formTargetType}
                    onChange={(e) => setFormTargetType(e.target.value as TargetType)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="exact_time">Waktu Pasti (Exact)</option>
                    <option value="all_day">Sepanjang Hari (All Day)</option>
                    <option value="date_only">Hanya Tanggal (Date Only)</option>
                  </select>
                </div>
              </div>

              {/* Direction & Auto Switch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Arah Hitung</label>
                  <select
                    value={formDirection}
                    onChange={(e) => setFormDirection(e.target.value as CountdownDirection)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="count_down">Count Down (Menuju Target)</option>
                    <option value="count_up">Count Up (Menghitung Sejak Momen)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Kategori</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Auto Switch Checkbox (§5) */}
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-accent/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formAutoSwitch}
                  onChange={(e) => setFormAutoSwitch(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-xs text-foreground">
                  <strong>Otomatis beralih ke Count Up</strong> saat target terlewati (alih-alih langsung Reached).
                </span>
              </label>

              {/* Recurrence (§8) */}
              <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsRecurring}
                    onChange={(e) => setFormIsRecurring(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <RefreshCw className="size-3.5 text-indigo-500" />
                    Ulangi Countdown Ini Secara Berkala (Recurrence)
                  </span>
                </label>

                {formIsRecurring && (
                  <div className="pt-2 pl-6 flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">Pola Pengulangan:</span>
                    <select
                      value={formRecurrenceType}
                      onChange={(e) => setFormRecurrenceType(e.target.value as any)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-border bg-background text-foreground"
                    >
                      <option value="yearly">Tahunan (Yearly - misal Ulang Tahun)</option>
                      <option value="monthly">Bulanan (Monthly)</option>
                      <option value="weekly">Mingguan (Weekly)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Linked Entity (§10) */}
              <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <ExternalLink className="size-3.5 text-muted-foreground" />
                    Tautkan ke Entitas Eksternal (Ecosystem)
                  </label>
                  <span className="text-[10px] text-muted-foreground">Opsional</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={formLinkedType}
                    onChange={(e) => {
                      setFormLinkedType(e.target.value as any);
                      if (e.target.value === "none") setFormLinkedId("");
                    }}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground"
                  >
                    <option value="none">Tidak Ada Tautan</option>
                    <option value="milestone">Milestone Manager (#02)</option>
                    <option value="event">Event Manager / Calendar (#03)</option>
                    <option value="project">Project Manager (#02)</option>
                    <option value="trip">Trip Planner</option>
                    <option value="goal">Goal Manager</option>
                  </select>

                  <select
                    disabled={formLinkedType === "none"}
                    value={formLinkedId}
                    onChange={(e) => setFormLinkedId(e.target.value)}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground disabled:opacity-50"
                  >
                    <option value="">Pilih Entitas...</option>
                    {externalEntities
                      .filter((e) => formLinkedType === "none" || e.type === formLinkedType)
                      .map((ent) => (
                        <option key={ent.id} value={ent.id}>
                          {ent.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Cover Image Presets */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Sampul Visual (Cover Image)</label>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {[
                    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
                    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80",
                    "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=80",
                    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80",
                    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80",
                  ].map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormCoverUrl(url)}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        formCoverUrl === url ? "border-primary scale-105" : "border-transparent opacity-70"
                      }`}
                    >
                      <img src={url} alt="preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Pin switch */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formPinned}
                    onChange={(e) => setFormPinned(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-xs text-foreground font-medium">
                    Pasang Pin (Prioritas Tampil di Widget / Dashboard)
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border bg-background hover:bg-accent text-xs font-medium text-foreground cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-sm hover:opacity-95 cursor-pointer"
                >
                  {editingItem ? "Simpan Perubahan" : "Buat Countdown"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: TEMPLATE PICKER (§15) */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-amber-500" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">Template Siap Pakai</h3>
                  <p className="text-xs text-muted-foreground">
                    Pilih pola countdown pra-konfigurasi untuk langsung mulai dengan pengaturan optimal.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => handleApplyTemplate(tpl)}
                  className="group relative rounded-2xl border border-border bg-background hover:border-primary/50 overflow-hidden p-4 space-y-3 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {tpl.badge}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {tpl.categoryName}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {tpl.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-primary font-medium">
                    <span>Gunakan Pola Ini</span>
                    <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: ECOSYSTEM STATISTICS (§17) */}
      {isStatsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <BarChart3 className="size-5 text-indigo-500" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">Metrik & Statistik Ecosystem (#11)</h3>
                  <p className="text-xs text-muted-foreground">
                    Kalkulasi analitik deterministik dihitung on-demand (§17).
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsStatsModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-muted/40 p-3 rounded-xl border border-border text-center">
                  <span className="text-xs text-muted-foreground block">Aktif Berjalan</span>
                  <span className="text-2xl font-black text-foreground">{statistics.active}</span>
                </div>
                <div className="bg-muted/40 p-3 rounded-xl border border-border text-center">
                  <span className="text-xs text-muted-foreground block">Target Tercapai</span>
                  <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
                    {statistics.reached}
                  </span>
                </div>
                <div className="bg-muted/40 p-3 rounded-xl border border-border text-center">
                  <span className="text-xs text-muted-foreground block">Upcoming (7 Hari)</span>
                  <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                    {statistics.upcoming7Days}
                  </span>
                </div>
                <div className="bg-muted/40 p-3 rounded-xl border border-border text-center">
                  <span className="text-xs text-muted-foreground block">Success Rate</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {statistics.reachedRate}%
                  </span>
                </div>
              </div>

              {/* Lead Time & Recurrence Info */}
              <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Average Lead Time (Rata-rata Durasi Perencanaan):</span>
                  <span className="font-bold text-foreground">{statistics.avgLeadTimeDays} Hari</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Formula: <code>AVG(targetAt - createdAt)</code> untuk semua countdown yang terdaftar.
                </p>
                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Distribusi Berulang vs Sekali Pakai:</span>
                  <span className="font-bold text-foreground">
                    {statistics.recurringCount} Berulang / {statistics.oneTimeCount} Standalone
                  </span>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Distribusi Countdown Berdasarkan Kategori
                </h4>
                <div className="space-y-2">
                  {Object.entries(statistics.categoryDistribution).map(([catId, data]) => {
                    const pct = statistics.total > 0 ? Math.round((data.count / statistics.total) * 100) : 0;
                    return (
                      <div key={catId} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-foreground font-medium flex items-center gap-1.5">
                            <span className="size-2.5 rounded-full" style={{ backgroundColor: data.color }} />
                            {data.name}
                          </span>
                          <span className="text-muted-foreground">
                            {data.count} item ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${pct}%`, backgroundColor: data.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. DRAWER: ACTIVITY AUDIT TRAIL (§16) */}
      {isHistoryDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-card border-l border-border w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <History className="size-5 text-primary" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">Activity History (Audit Trail)</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Log historis append-only tanpa manipulasi (§16).
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsHistoryDrawerOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {activities.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-12">Belum ada riwayat tercatat.</p>
              ) : (
                activities.map((act) => (
                  <div key={act.id} className="relative pl-5 border-l-2 border-border space-y-1 py-1">
                    <span className="absolute -left-[5px] top-2 size-2 rounded-full bg-primary" />
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="uppercase font-semibold tracking-wider">{act.type}</span>
                      <span>{new Date(act.createdAt).toLocaleString("id-ID")}</span>
                    </div>
                    <p className="text-xs text-foreground font-medium">{act.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 8. DELETE CONFIRMATION DIALOG (§3.2) */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="size-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-foreground">Hapus Countdown?</h4>
              <p className="text-xs text-muted-foreground">
                Tindakan ini bersifat permanen dan tidak dapat dibatalkan. Jika Anda hanya ingin menyimpannya, gunakan fitur Arsip.
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-border bg-background hover:bg-accent text-xs font-medium text-foreground cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteCountdown(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Countdown Card (Hero / Visual Grid Item)
// -------------------------------------------------------------
interface CountdownCardProps {
  item: CountdownItem;
  category?: { name: string; color: string };
  remaining: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  };
  onTogglePin: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onRestore: () => void;
  onDelete: () => void;
  onConvertDirection: () => void;
}

function CountdownCard({
  item,
  category,
  remaining,
  onTogglePin,
  onEdit,
  onDuplicate,
  onArchive,
  onRestore,
  onDelete,
  onConvertDirection,
}: CountdownCardProps) {
  const isArchived = item.status === "Archived";
  const isCountUp = item.direction === "count_up";

  return (
    <div
      className={`group relative rounded-3xl border border-border bg-card overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
        item.pinned ? "ring-2 ring-amber-400/30" : ""
      }`}
    >
      {/* Cover Image Background Banner */}
      <div className="relative h-32 sm:h-36 w-full bg-background overflow-hidden">
        {item.coverImage?.url ? (
          <img
            src={item.coverImage.url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-border via-indigo-950 to-border" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-border/90 via-border/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white backdrop-blur-md shadow-xs"
              style={{ backgroundColor: category?.color ? `${category.color}cc` : "rgba(0,0,0,0.5)" }}
            >
              {category?.name || "Umum"}
            </span>

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md text-white border border-border/20 ${
                isCountUp ? "bg-amber-600/80" : "bg-blue-600/80"
              }`}
            >
              {isCountUp ? "Count Up" : "Count Down"}
            </span>

            {item.recurrence && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600/80 backdrop-blur-md text-white flex items-center gap-1">
                <RefreshCw className="size-2.5" />
                {item.recurrence.type === "yearly" ? "Tahunan" : "Berulang"}
              </span>
            )}
          </div>

          {/* Quick Pin & Menu */}
          <div className="flex items-center gap-1">
            <button
              onClick={onTogglePin}
              className={`p-1.5 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                item.pinned
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-black/40 text-white/80 hover:bg-black/60"
              }`}
              title={item.pinned ? "Lepas Pin" : "Pasang Pin"}
            >
              <Pin className="size-3" fill={item.pinned ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Bottom Banner Title */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight line-clamp-1 drop-shadow-sm">
            {item.title}
          </h3>
          <p className="text-[11px] text-white/70 flex items-center gap-1 mt-0.5">
            <Calendar className="size-3" />
            <span>
              {new Date(item.targetAt).toLocaleDateString("id-ID", {
                dateStyle: "medium",
              })}
            </span>
          </p>
        </div>
      </div>

      {/* Middle Card: Real-time Digits Display */}
      <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
        {/* Flip-style Digits Grid */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-muted/40 dark:bg-background border border-border/70 rounded-xl p-2">
            <span className="text-xl sm:text-2xl font-mono font-black text-foreground block">
              {remaining.days}
            </span>
            <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">
              Hari
            </span>
          </div>

          <div className="bg-muted/40 dark:bg-background border border-border/70 rounded-xl p-2">
            <span className="text-xl sm:text-2xl font-mono font-black text-foreground block">
              {String(remaining.hours).padStart(2, "0")}
            </span>
            <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">
              Jam
            </span>
          </div>

          <div className="bg-muted/40 dark:bg-background border border-border/70 rounded-xl p-2">
            <span className="text-xl sm:text-2xl font-mono font-black text-foreground block">
              {String(remaining.minutes).padStart(2, "0")}
            </span>
            <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">
              Menit
            </span>
          </div>

          <div className="bg-muted/40 dark:bg-background border border-border/70 rounded-xl p-2">
            <span className="text-xl sm:text-2xl font-mono font-black text-primary block">
              {String(remaining.seconds).padStart(2, "0")}
            </span>
            <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">
              Detik
            </span>
          </div>
        </div>

        {/* Description & Linked Entity */}
        <div className="space-y-2">
          {item.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Linked entity pill (§10) */}
          {item.linkedEntity && (
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-muted/40 border border-border/60 text-[11px] text-muted-foreground">
              <ExternalLink className="size-3 text-muted-foreground" />
              <span className="truncate">
                {item.linkedEntity.entityType.toUpperCase()}:{" "}
                <strong>{item.linkedEntity.entityTitle || item.linkedEntity.entityId}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                item.status === "Active"
                  ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300"
                  : item.status === "Reached"
                  ? "bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300"
                  : "bg-muted dark:bg-card text-muted-foreground dark:text-muted-foreground"
              }`}
            >
              {item.status}
            </span>

            <button
              onClick={onConvertDirection}
              className="text-[10px] text-muted-foreground hover:text-foreground p-1 rounded hover:bg-accent"
              title="Balik Arah (Count Down <-> Count Up)"
            >
              <RefreshCw className="size-3" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer"
              title="Edit Detail"
            >
              <Edit2 className="size-3.5" />
            </button>
            <button
              onClick={onDuplicate}
              className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer"
              title="Duplikasi"
            >
              <Copy className="size-3.5" />
            </button>
            {isArchived ? (
              <button
                onClick={onRestore}
                className="p-1.5 rounded-lg hover:bg-accent text-emerald-600 cursor-pointer"
                title="Pulihkan dari Arsip"
              >
                <ArchiveRestore className="size-3.5" />
              </button>
            ) : (
              <button
                onClick={onArchive}
                className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer"
                title="Arsipkan"
              >
                <Archive className="size-3.5" />
              </button>
            )}
            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg hover:bg-accent text-rose-500 cursor-pointer"
              title="Hapus Permanen"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
