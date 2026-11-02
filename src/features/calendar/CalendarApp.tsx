import { ShellHeader } from "@/app/shell-header";
import { ShellSidebar } from "@/app/shell-sidebar";
import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Clock,
  MapPin,
  Users,
  Check,
  X,
  CheckSquare,
  Eye,
  EyeOff,
  Link as LinkIcon,
  CalendarDays,
  Columns,
  AlignLeft,
  Calendar,
  Grid,
  Sparkles,
} from "lucide-react";
import { useCalendar } from "./store";
import {
  CalendarEvent,
  CalendarViewMode,
} from "./types";

export function CalendarApp() {
  const {
    state,
    allDisplayEvents,
    toggleCalendarVisibility,
    createEvent,
    deleteEvent,
    convertEventToTask,
    respondRSVP,
  } = useCalendar();

  // Current anchor date for navigation
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [quickFilter, setQuickFilter] = useState<string>("all");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Selected event for detail/edit modal
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showNewEventModal, setShowNewEventModal] = useState<boolean>(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState<boolean>(false);

  // Quick state for new event target date
  const [newEventDefaultDate, setNewEventDefaultDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const handlePrev = () => {
    if (viewMode === "day") {
      setCurrentDate(new Date(year, month, currentDate.getDate() - 1));
    } else if (viewMode === "week") {
      setCurrentDate(new Date(year, month, currentDate.getDate() - 7));
    } else if (viewMode === "year") {
      setCurrentDate(new Date(year - 1, month, 1));
    } else {
      setCurrentDate(new Date(year, month - 1, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === "day") {
      setCurrentDate(new Date(year, month, currentDate.getDate() + 1));
    } else if (viewMode === "week") {
      setCurrentDate(new Date(year, month, currentDate.getDate() + 7));
    } else if (viewMode === "year") {
      setCurrentDate(new Date(year + 1, month, 1));
    } else {
      setCurrentDate(new Date(year, month + 1, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Visible calendar container IDs
  const activeCalendarIds = useMemo(() => {
    return new Set(
      state.calendars.filter((c) => c.visibility === "shown").map((c) => c.id)
    );
  }, [state.calendars]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    return allDisplayEvents.filter((ev) => {
      // 1. Calendar container visibility toggle
      if (!activeCalendarIds.has(ev.calendarId)) return false;

      // 2. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = ev.title.toLowerCase().includes(q);
        const matchDesc = ev.description && ev.description.toLowerCase().includes(q);
        const matchLoc = ev.location && ev.location.toLowerCase().includes(q);
        const matchPart = ev.participants.some((p) => p.name.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchLoc && !matchPart) return false;
      }

      // 3. Quick preset filter (§10.2)
      const evStart = new Date(ev.startAt);
      if (quickFilter === "today") {
        return evStart >= startOfToday && evStart <= endOfToday;
      }
      if (quickFilter === "upcoming") {
        return evStart >= now && ev.status !== "cancelled";
      }
      if (quickFilter === "past") {
        return evStart < now;
      }
      if (quickFilter === "cancelled") {
        return ev.status === "cancelled";
      }
      if (quickFilter === "all_day") {
        return !!ev.allDay;
      }

      return true;
    });
  }, [allDisplayEvents, activeCalendarIds, searchQuery, quickFilter]);

  // Calendar container map for color and name lookups

  // Days in month calculation for Month view
  const monthGridDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days: Array<{
      date: Date;
      isCurrentMonth: boolean;
      isToday: boolean;
      dateKey: string;
    }> = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthDays - i);
      days.push({
        date: d,
        isCurrentMonth: false,
        isToday: false,
        dateKey: d.toISOString().slice(0, 10),
      });
    }

    // Current month days
    const todayStr = new Date().toISOString().slice(0, 10);
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(year, month, i);
      const dStr = d.toISOString().slice(0, 10);
      days.push({
        date: d,
        isCurrentMonth: true,
        isToday: dStr === todayStr,
        dateKey: dStr,
      });
    }

    // Next month padding to fill 35 or 42 cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        date: d,
        isCurrentMonth: false,
        isToday: false,
        dateKey: d.toISOString().slice(0, 10),
      });
    }

    return days;
  }, [year, month]);

  // Hours for day / week view (07:00 - 21:00)
  const timeSlots = useMemo(() => {
    const slots: number[] = [];
    for (let h = 7; h <= 21; h++) {
      slots.push(h);
    }
    return slots;
  }, []);

  // Week days for week view
  const weekDays = useMemo(() => {
    const curr = new Date(currentDate);
    const day = curr.getDay();
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
    const monday = new Date(curr.setDate(diff));

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const next = new Date(monday);
      next.setDate(monday.getDate() + i);
      days.push(next);
    }
    return days;
  }, [currentDate]);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-muted/40 text-foreground">
      {/* LEFT SIDEBAR: Multi-Calendar & Availability */}
      <ShellSidebar>
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-600" />
            <h2 className="font-semibold text-foreground text-sm tracking-tight">Kalender & Waktu</h2>
          </div>
          <button
            onClick={() => {
              setNewEventDefaultDate(new Date().toISOString().slice(0, 10));
              setShowNewEventModal(true);
            }}
            title="Buat Jadwal Baru"
            className="p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Mini Calendar Navigator */}
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-2">
            <span>
              {monthNames[month]} {year}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                className="p-1 text-muted-foreground hover:text-foreground rounded hover:bg-muted"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNext}
                className="p-1 text-muted-foreground hover:text-foreground rounded hover:bg-muted"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground font-medium mb-1">
            {dayNames.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {monthGridDays.slice(0, 35).map((cell, idx) => {
              const isSelected =
                cell.date.toDateString() === currentDate.toDateString();
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentDate(cell.date)}
                  className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[11px] transition-colors ${
                    isSelected
                      ? "bg-indigo-600 text-white font-bold"
                      : cell.isToday
                      ? "border border-indigo-600 text-indigo-600 font-semibold"
                      : cell.isCurrentMonth
                      ? "text-foreground hover:bg-muted"
                      : "text-foreground"
                  }`}
                >
                  {cell.date.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Multi-Calendar Overlay Toggles (§4) */}
        <div className="p-4 border-b border-border flex-1 overflow-y-auto space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground tracking-tight">
                Multi-Kalender (§4)
              </span>
              <span className="text-[10px] text-muted-foreground">Overlay</span>
            </div>

            <div className="space-y-2">
              {state.calendars.map((cal) => {
                const isShown = cal.visibility === "shown";
                return (
                  <div
                    key={cal.id}
                    onClick={() => toggleCalendarVisibility(cal.id)}
                    className="flex items-center justify-between text-xs py-1 px-1.5 rounded hover:bg-muted/40 cursor-pointer select-none transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3 h-3 rounded-xs border transition-transform"
                        style={{
                          backgroundColor: isShown ? cal.color : "transparent",
                          borderColor: cal.color,
                        }}
                      />
                      <span className={`text-xs ${isShown ? "text-foreground font-medium" : "text-muted-foreground line-through"}`}>
                        {cal.name}
                      </span>
                    </div>
                    {isShown ? (
                      <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-foreground" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Presets Filter */}
          <div className="pt-2 border-t border-border">
            <span className="text-xs font-semibold text-foreground tracking-tight block mb-1.5">
              Filter Cepat Event
            </span>
            <div className="flex flex-wrap gap-1">
              {[
                { id: "all", label: "Semua" },
                { id: "today", label: "Hari Ini" },
                { id: "upcoming", label: "Mendatang" },
                { id: "past", label: "Lewat" },
                { id: "all_day", label: "Seharian" },
                { id: "cancelled", label: "Batal" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setQuickFilter(f.id)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                    quickFilter === f.id
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Availability / Find a Time button (§8) */}
          <div className="pt-2">
            <button
              onClick={() => setShowAvailabilityModal(true)}
              className="w-full py-2 px-3 border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 rounded-md text-xs font-medium text-indigo-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              Cek Ketersediaan Tim (Find a Time)
            </button>
          </div>
        </div>

        {/* Ecosystem Architecture Footnote (§0 & §14) */}
        <div className="p-3 border-t border-border bg-muted/40/70 text-[11px] text-muted-foreground">
          <p className="font-medium text-foreground">Standalone App #02</p>
          <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
            Source of truth untuk Event. Tugas & Milestone ditampilkan sebagai Linked Event terpadu.
          </p>
        </div>
      </ShellSidebar>

      {/* MAIN CALENDAR DISPLAY */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        {/* Top Control Bar (Portaled to ShellHeader) */}
        <ShellHeader>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleToday}
              title="Kembali ke Hari Ini"
              aria-label="Hari Ini"
              className="p-1.5 rounded-lg border border-border text-foreground hover:bg-accent transition-colors cursor-pointer shrink-0"
            >
              <Calendar className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center border border-border rounded-lg overflow-hidden shrink-0">
              <button
                onClick={handlePrev}
                className="p-1 hover:bg-accent text-muted-foreground transition-colors cursor-pointer border-r border-border/60"
                title="Sebelumnya"
                aria-label="Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-1 hover:bg-accent text-muted-foreground transition-colors cursor-pointer"
                title="Berikutnya"
                aria-label="Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <span className="text-xs font-bold text-foreground px-1 truncate max-w-[120px] hidden sm:inline-block">
              {monthNames[month]} {year}
            </span>

            {/* View Mode Segmented Controls (§9) - Icon-Only */}
            <div className="flex items-center gap-0.5 border border-border/60 rounded-lg p-0.5 bg-muted/70 text-xs shrink-0">
              {[
                { id: "month", label: "Bulan", icon: CalendarDays },
                { id: "week", label: "Minggu", icon: Columns },
                { id: "day", label: "Hari", icon: Clock },
                { id: "agenda", label: "Agenda", icon: AlignLeft },
                { id: "person", label: "Tim", icon: Users },
                { id: "year", label: "Tahun", icon: Grid },
              ].map((v) => {
                const Icon = v.icon;
                return (
                  <button
                    key={v.id}
                    onClick={() => setViewMode(v.id as CalendarViewMode)}
                    title={v.label}
                    aria-label={v.label}
                    className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                      viewMode === v.id
                        ? "bg-background text-foreground font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
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
                title="Cari Event"
                aria-label="Cari Event"
              >
                <Search className="w-3.5 h-3.5" />
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

            {/* Quick Add Event */}
            <button
              onClick={() => {
                setNewEventDefaultDate(new Date().toISOString().slice(0, 10));
                setShowNewEventModal(true);
              }}
              title="Tambah Jadwal"
              aria-label="Tambah Jadwal"
              className="p-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-xs flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </ShellHeader>

        {/* VIEW 1: MONTH VIEW (§9) */}
        {viewMode === "month" && (
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-border bg-muted/40/80 text-center py-2 text-xs font-semibold text-muted-foreground">
              {["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* Month Days Grid */}
            <div className="flex-1 grid grid-cols-7 grid-rows-5 md:grid-rows-6 divide-x divide-y divide-border overflow-y-auto bg-background">
              {monthGridDays.map((cell, idx) => {
                const dayEvents = filteredEvents.filter((ev) => {
                  const evDateStr = ev.startAt.slice(0, 10);
                  return evDateStr === cell.dateKey;
                });

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setNewEventDefaultDate(cell.dateKey);
                    }}
                    className={`min-h-[90px] p-1.5 transition-colors flex flex-col ${
                      cell.isCurrentMonth ? "bg-background" : "bg-muted/20 text-muted-foreground"
                    } hover:bg-accent/40`}
                  >
                    {/* Day number header */}
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full ${
                          cell.isToday
                            ? "bg-indigo-600 text-white font-bold"
                            : cell.isCurrentMonth
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {cell.date.getDate()}
                      </span>
                      {cell.isCurrentMonth && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setNewEventDefaultDate(cell.dateKey);
                            setShowNewEventModal(true);
                          }}
                          className="opacity-0 hover:opacity-100 p-0.5 text-muted-foreground hover:text-indigo-600"
                          title="Tambah jadwal pada tanggal ini"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Events on this day */}
                    <div className="space-y-1 flex-1 overflow-y-auto">
                      {dayEvents.slice(0, 3).map((ev) => {
                        const isLinked = !!ev.externalRef;
                        return (
                          <div
                            key={ev.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(ev);
                            }}
                            className="px-1.5 py-0.5 rounded text-[11px] font-medium truncate cursor-pointer transition-all hover:brightness-95 flex items-center gap-1 shadow-2xs"
                            style={{
                              backgroundColor: `${ev.color || "#2563eb"}15`,
                              color: ev.color || "#2563eb",
                              borderLeft: `2.5px solid ${ev.color || "#2563eb"}`,
                            }}
                          >
                            {isLinked && <LinkIcon className="w-2.5 h-2.5 flex-shrink-0" />}
                            <span className="truncate">{ev.title}</span>
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div className="text-[10px] text-muted-foreground font-medium pl-1">
                          +{dayEvents.length - 3} lainnya
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: WEEK VIEW (§9) */}
        {viewMode === "week" && (
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            {/* Week Days Header */}
            <div className="grid grid-cols-8 border-b border-border bg-muted/40 text-center py-2.5 text-xs font-semibold text-foreground sticky top-0 z-10">
              <div className="text-muted-foreground font-mono text-[11px]">Waktu (WIB)</div>
              {weekDays.map((d, i) => {
                const isToday = d.toDateString() === new Date().toDateString();
                return (
                  <div key={i} className={isToday ? "text-indigo-600 font-bold" : ""}>
                    <span>{["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"][i]}</span>{" "}
                    <span className="text-[11px] font-normal text-muted-foreground">{d.getDate()}</span>
                  </div>
                );
              })}
            </div>

            {/* Hourly Grid */}
            <div className="divide-y divide-border">
              {timeSlots.map((hour) => (
                <div key={hour} className="grid grid-cols-8 min-h-[50px] divide-x divide-border">
                  <div className="p-2 text-right text-[11px] font-mono text-muted-foreground select-none">
                    {String(hour).padStart(2, "0")}:00
                  </div>
                  {weekDays.map((d, dayIdx) => {
                    const dateStr = d.toISOString().slice(0, 10);
                    const matchingEvents = filteredEvents.filter((ev) => {
                      if (ev.startAt.slice(0, 10) !== dateStr) return false;
                      const evHour = new Date(ev.startAt).getHours();
                      return evHour === hour;
                    });

                    return (
                      <div
                        key={dayIdx}
                        onClick={() => {
                          setNewEventDefaultDate(dateStr);
                          setShowNewEventModal(true);
                        }}
                        className="p-1 hover:bg-indigo-50/20 transition-colors relative"
                      >
                        {matchingEvents.map((ev) => (
                          <div
                            key={ev.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(ev);
                            }}
                            className="p-1 rounded text-[10px] font-medium cursor-pointer transition-all hover:shadow-xs mb-1"
                            style={{
                              backgroundColor: `${ev.color || "#2563eb"}20`,
                              color: ev.color || "#2563eb",
                              borderLeft: `3px solid ${ev.color || "#2563eb"}`,
                            }}
                          >
                            <p className="font-semibold truncate">{ev.title}</p>
                            <p className="text-[9px] opacity-75">
                              {new Date(ev.startAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: DAY VIEW (§9) */}
        {viewMode === "day" && (
          <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full space-y-4">
            <div className="p-4 bg-card border border-border rounded-lg shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {currentDate.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {filteredEvents.filter((ev) => ev.startAt.slice(0, 10) === currentDate.toISOString().slice(0, 10)).length} Jadwal Terjadwal Hari Ini
                </p>
              </div>
              <button
                onClick={() => {
                  setNewEventDefaultDate(currentDate.toISOString().slice(0, 10));
                  setShowNewEventModal(true);
                }}
                className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah ke Hari Ini
              </button>
            </div>

            {/* Time Slot List */}
            <div className="bg-card border border-border rounded-lg divide-y divide-border">
              {timeSlots.map((h) => {
                const hourEvents = filteredEvents.filter((ev) => {
                  if (ev.startAt.slice(0, 10) !== currentDate.toISOString().slice(0, 10)) return false;
                  return new Date(ev.startAt).getHours() === h;
                });

                return (
                  <div key={h} className="p-3 flex items-start gap-4 hover:bg-muted/40/50">
                    <span className="w-14 font-mono text-xs text-muted-foreground font-medium pt-0.5">
                      {String(h).padStart(2, "0")}:00
                    </span>
                    <div className="flex-1 space-y-2">
                      {hourEvents.length === 0 ? (
                        <div
                          onClick={() => {
                            setNewEventDefaultDate(currentDate.toISOString().slice(0, 10));
                            setShowNewEventModal(true);
                          }}
                          className="h-6 flex items-center text-xs text-foreground hover:text-indigo-600 cursor-pointer"
                        >
                          + Tambah jadwal pada {String(h).padStart(2, "0")}:00
                        </div>
                      ) : (
                        hourEvents.map((ev) => (
                          <div
                            key={ev.id}
                            onClick={() => setSelectedEvent(ev)}
                            className="p-3 border rounded-lg cursor-pointer transition-all hover:shadow-xs space-y-1"
                            style={{
                              borderColor: `${ev.color || "#2563eb"}40`,
                              backgroundColor: `${ev.color || "#2563eb"}08`,
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-semibold text-foreground">{ev.title}</h4>
                              <span className="text-[11px] font-medium" style={{ color: ev.color || "#2563eb" }}>
                                {new Date(ev.startAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} -{" "}
                                {new Date(ev.endAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                            {ev.location && (
                              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-muted-foreground" />
                                {ev.location}
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 4: AGENDA / LIST VIEW (§9) */}
        {viewMode === "agenda" && (
          <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-4">
            <div className="p-4 bg-card border border-border rounded-lg shadow-xs">
              <h3 className="text-sm font-semibold text-foreground">Agenda Linear Mendatang</h3>
              <p className="text-xs text-muted-foreground">Daftar terurut seluruh pertemuan, checkpoint, dan kegiatan berbatas waktu.</p>
            </div>

            <div className="space-y-3">
              {filteredEvents.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground bg-card border border-border rounded-lg">
                  Tidak ada agenda yang cocok dengan pencarian / filter aktif.
                </div>
              ) : (
                filteredEvents
                  .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
                  .map((ev) => {
                    const isLinked = !!ev.externalRef;
                    return (
                      <div
                        key={ev.id}
                        onClick={() => setSelectedEvent(ev)}
                        className="p-4 bg-card border border-border rounded-lg shadow-xs hover:border-indigo-300 transition-all flex items-start justify-between gap-4 cursor-pointer"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: ev.color || "#2563eb" }}
                            />
                            <h4 className="text-xs font-semibold text-foreground truncate">
                              {ev.title}
                            </h4>
                            {isLinked && (
                              <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                                <LinkIcon className="w-2.5 h-2.5" />
                                Terhubung {ev.externalRef?.sourceApp === "task_manager" ? "Task Manager" : "Project Manager"}
                              </span>
                            )}
                          </div>
                          {ev.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">{ev.description}</p>
                          )}
                          {ev.location && (
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {ev.location}
                            </p>
                          )}
                        </div>

                        <div className="text-right flex-shrink-0 text-xs">
                          <p className="font-semibold text-foreground">
                            {new Date(ev.startAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {ev.allDay
                              ? "Sepanjang Hari"
                              : `${new Date(ev.startAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} - ${new Date(ev.endAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`}
                          </p>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        )}

        {/* VIEW 5: SCHEDULE BY PERSON (§9) */}
        {viewMode === "person" && (
          <div className="flex-1 overflow-x-auto p-6 flex gap-4">
            {["Partner Eksekutif", "Senior Auditor Budi", "Konsultan Hukum", "Dewan Direksi Klien"].map((personName) => {
              const personEvents = filteredEvents.filter((ev) =>
                ev.participants.some((p) => p.name.toLowerCase().includes(personName.toLowerCase()))
              );

              return (
                <div
                  key={personName}
                  className="w-80 flex-shrink-0 bg-card border border-border rounded-lg flex flex-col max-h-[calc(100vh-210px)]"
                >
                  <div className="p-3 border-b border-border bg-muted/40/70 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-semibold flex items-center justify-center text-xs">
                      {personName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-foreground">{personName}</h4>
                      <p className="text-[10px] text-muted-foreground">{personEvents.length} Jadwal Terlibat</p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {personEvents.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-6">Tidak ada agenda terkait.</p>
                    ) : (
                      personEvents.map((ev) => (
                        <div
                          key={ev.id}
                          onClick={() => setSelectedEvent(ev)}
                          className="p-2.5 border border-border rounded-md hover:border-indigo-400 cursor-pointer transition-all space-y-1 text-xs"
                        >
                          <h5 className="font-medium text-foreground line-clamp-1">{ev.title}</h5>
                          <p className="text-[11px] text-muted-foreground">
                            {new Date(ev.startAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })} ·{" "}
                            {new Date(ev.startAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 6: YEAR VIEW (§9) */}
        {viewMode === "year" && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {monthNames.map((mName, mIdx) => (
                <div key={mName} className="p-3 bg-card border border-border rounded-lg shadow-xs space-y-2">
                  <h4 className="text-xs font-bold text-foreground text-center">{mName}</h4>
                  <div className="grid grid-cols-7 gap-1 text-center text-[9px] text-muted-foreground">
                    {dayNames.map((d) => (
                      <span key={d}>{d[0]}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                    {Array.from({ length: new Date(year, mIdx + 1, 0).getDate() }, (_, i) => i + 1).map((dNum) => {
                      const dIso = `${year}-${String(mIdx + 1).padStart(2, "0")}-${String(dNum).padStart(2, "0")}`;
                      const hasEv = filteredEvents.some((ev) => ev.startAt.slice(0, 10) === dIso);

                      return (
                        <div
                          key={dNum}
                          className={`w-5 h-5 mx-auto rounded-full flex items-center justify-center ${
                            hasEv ? "bg-indigo-600 text-white font-bold" : "text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {dNum}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL: EVENT DETAIL & ACTIONS (§3.2, §3.3) */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-card rounded-lg shadow-xl border border-border p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: `${selectedEvent.color || "#2563eb"}15`,
                    color: selectedEvent.color || "#2563eb",
                  }}
                >
                  {selectedEvent.externalRef ? `Linked Event (${selectedEvent.externalRef.sourceApp})` : "Standalone Event (#02)"}
                </span>
                <h3 className="text-base font-bold text-foreground mt-1">{selectedEvent.title}</h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedEvent.description && (
              <p className="text-xs text-muted-foreground leading-relaxed bg-muted/40 p-3 rounded border border-border">
                {selectedEvent.description}
              </p>
            )}

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>
                  {new Date(selectedEvent.startAt).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} ·{" "}
                  {selectedEvent.allDay
                    ? "Sepanjang Hari"
                    : `${new Date(selectedEvent.startAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} - ${new Date(selectedEvent.endAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`}
                </span>
              </div>

              {selectedEvent.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedEvent.location}</span>
                </div>
              )}
            </div>

            {/* Participants & RSVP Section (§6) */}
            {selectedEvent.participants && selectedEvent.participants.length > 0 && (
              <div className="pt-2 border-t border-border space-y-2">
                <span className="text-xs font-semibold text-foreground">Peserta & Status RSVP (§6):</span>
                <div className="space-y-1.5">
                  {selectedEvent.participants.map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-xs p-1.5 bg-muted/40 rounded">
                      <div>
                        <span className="font-medium text-foreground">{p.name}</span>
                        <span className="text-[10px] text-muted-foreground ml-1.5 capitalize">({p.role})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`text-[10px] capitalize font-medium ${
                          p.rsvpStatus === "accepted" ? "text-emerald-700" : p.rsvpStatus === "declined" ? "text-red-700" : "text-amber-700"
                        }`}>
                          {p.rsvpStatus}
                        </span>
                        {/* Interactive RSVP switcher */}
                        <div className="flex items-center gap-0.5 ml-2">
                          <button
                            onClick={() => respondRSVP(selectedEvent.id, p.id, "accepted")}
                            title="Terima (Accepted)"
                            className="p-1 hover:bg-emerald-100 rounded text-emerald-600"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => respondRSVP(selectedEvent.id, p.id, "declined")}
                            title="Tolak (Declined)"
                            className="p-1 hover:bg-red-100 rounded text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions Bar (§3.3) */}
            <div className="pt-4 border-t border-border flex items-center justify-between gap-2 flex-wrap">
              {/* Convert to Task (§3.3: "event tanpa kejelasan penyelesaian diubah menjadi Task") */}
              {!selectedEvent.externalRef && (
                <button
                  onClick={() => {
                    convertEventToTask(selectedEvent);
                    setSelectedEvent(null);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors flex items-center gap-1.5"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  Ubah Menjadi Task Mandiri
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => {
                    deleteEvent(selectedEvent);
                    setSelectedEvent(null);
                  }}
                  className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  {selectedEvent.externalRef ? "Sembunyikan dari Kalender" : "Hapus Event"}
                </button>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-3 py-1.5 text-xs font-medium bg-foreground text-background rounded hover:bg-foreground transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW EVENT (§3.1 & §3.3) */}
      {showNewEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-card rounded-lg shadow-xl border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Buat Jadwal / Pertemuan Baru</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get("title") as string;
                const description = formData.get("description") as string;
                const calendarId = formData.get("calendarId") as string;
                const date = formData.get("date") as string;
                const startTime = formData.get("startTime") as string;
                const endTime = formData.get("endTime") as string;
                const location = formData.get("location") as string;
                const participantName = formData.get("participantName") as string;

                const startAt = new Date(`${date}T${startTime || "09:00"}:00`).toISOString();
                const endAt = new Date(`${date}T${endTime || "10:00"}:00`).toISOString();

                createEvent({
                  title,
                  description,
                  calendarId,
                  startAt,
                  endAt,
                  location,
                  participants: participantName ? [{ name: participantName, role: "required" }] : [],
                });

                setShowNewEventModal(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Nama Jadwal / Agenda *</label>
                <input
                  name="title"
                  type="text"
                  required
                  placeholder="mis. Rapat Koordinasi Audit Triwulan"
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Pilih Kalender</label>
                <select
                  name="calendarId"
                  defaultValue="cal-work"
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                >
                  {state.calendars.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Tanggal</label>
                  <input
                    name="date"
                    type="date"
                    defaultValue={newEventDefaultDate}
                    required
                    className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Mulai</label>
                  <input
                    name="startTime"
                    type="time"
                    defaultValue="09:00"
                    className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Selesai</label>
                  <input
                    name="endTime"
                    type="time"
                    defaultValue="10:30"
                    className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Lokasi / Tautan Virtual</label>
                <input
                  name="location"
                  type="text"
                  placeholder="mis. Google Meet / Ruang Rapat Lt 3"
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Undang Peserta (Nama)</label>
                <input
                  name="participantName"
                  type="text"
                  placeholder="mis. Senior Auditor Budi"
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Deskripsi Tambahan</label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Rincian topik bahasan..."
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewEventModal(false)}
                  className="px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AVAILABILITY & FIND A TIME (§8) */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-card rounded-lg shadow-xl border border-border p-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Cek Ketersediaan & Slot Waktu Tim (§8)
              </h3>
              <p className="text-xs text-muted-foreground">
                Informasi slot bebas/sibuk anggota tim untuk menjadwalkan rapat bersama tanpa bentrok.
              </p>
            </div>

            <div className="space-y-3">
              {state.availability.map((av) => (
                <div key={av.userId} className="p-3 border border-border rounded-lg bg-muted/40/50 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{av.userName}</span>
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                      Aktif: {av.startTime} - {av.endTime} WIB
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Hari kerja: Senin s/d Jumat · Zona waktu: {av.timezone}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-lg text-xs text-indigo-900 space-y-1">
              <span className="font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Rekomendasi Waktu Rapat Bersama
              </span>
              <p className="text-[11px] text-indigo-700">
                Slot ideal bebas bentrok: <strong>Senin - Kamis, pukul 10:00 - 11:30 WIB</strong> atau <strong>14:00 - 15:30 WIB</strong>.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAvailabilityModal(false)}
                className="px-3 py-1.5 text-xs font-medium bg-foreground text-background rounded hover:bg-foreground"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
