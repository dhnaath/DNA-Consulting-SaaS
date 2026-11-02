import { ShellHeader } from "@/app/shell-header";
import { ShellSidebar } from "@/app/shell-sidebar";
import React, { useState, useMemo } from "react";
import {
  CalendarDays,
  Clock,
  Users,
  CheckCircle2,
  Calendar,
  Layers,
  BarChart3,
  Plus,
  X,
  FileCheck2,
  Trash2,
} from "lucide-react";
import { useScheduleStore } from "./store";
import { usePeopleStore } from "../people-manager/store";
import {
  ScheduleViewMode,
  ExceptionType,
} from "./types";

export function ScheduleManagerApp() {
  const {
    schedules,
    shifts,
    shiftAssignments,
    exceptions,
    holidays,
    assignShift,
    updateShiftStatus,
    requestException,
    reviewException,
    addHoliday,
    deleteHoliday,
    calculateAvailability,
  } = useScheduleStore();

  const { people } = usePeopleStore();

  const [activeTab, setActiveTab] = useState<ScheduleViewMode>("team_schedule");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Request Exception Modal
  const [isExcModalOpen, setIsExcModalOpen] = useState(false);
  const [excPersonId, setExcPersonId] = useState("per-01");
  const [excType, setExcType] = useState<ExceptionType>("leave");
  const [excDate, setExcDate] = useState(new Date().toISOString().split("T")[0]);
  const [excNote, setExcNote] = useState("");

  // Assign Shift Modal
  const [isShiftAssignOpen, setIsShiftAssignOpen] = useState(false);
  const [assignPersonId, setAssignPersonId] = useState("per-dhia");
  const [assignShiftId, setAssignShiftId] = useState("shift-pagi");
  const [assignDate, setAssignDate] = useState(new Date().toISOString().split("T")[0]);

  // Create Shift Modal
  const [isNewShiftOpen, setIsNewShiftOpen] = useState(false);
  const [shiftName, setShiftName] = useState("");
  const [shiftStart, setShiftStart] = useState("08:00");
  const [shiftEnd, setShiftEnd] = useState("16:00");
  const [shiftBreak, setShiftBreak] = useState("60");

  // Create Holiday Modal
  const [isNewHolidayOpen, setIsNewHolidayOpen] = useState(false);
  const [holName, setHolName] = useState("");
  const [holDate, setHolDate] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 7 days of this week for Team Schedule Grid
  const weekDays = useMemo(() => {
    const list: string[] = [];
    const base = new Date();
    // Monday of current week
    const day = base.getDay();
    const diff = base.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(base.setDate(diff));

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      list.push(d.toISOString().split("T")[0]);
    }
    return list;
  }, []);

  // Statistics
  const stats = useMemo(() => {
    const totalWorkingDays = schedules.length * 20; // estimate 20 working days/month
    const approvedLeaves = exceptions.filter(
      (e) => (e.type === "leave" || e.type === "sick") && e.status === "approved"
    ).length;

    const absenceRate =
      totalWorkingDays > 0 ? ((approvedLeaves / totalWorkingDays) * 100).toFixed(1) : "0.0";

    const pendingRequests = exceptions.filter((e) => e.status === "pending").length;

    // Shift coverage rate
    const totalShiftsRequired = weekDays.length * 3; // 3 shifts a day
    const assignedCount = shiftAssignments.length;
    const shiftCoverage = Math.min(
      100,
      Math.round((assignedCount / Math.max(1, totalShiftsRequired)) * 100)
    );

    return { totalSchedules: schedules.length, pendingRequests, absenceRate, shiftCoverage };
  }, [schedules, exceptions, shiftAssignments, weekDays]);

  const handleRequestException = (e: React.FormEvent) => {
    e.preventDefault();
    if (!excDate || !excNote.trim()) return;

    const person = people.find((p) => p.id === excPersonId);

    requestException({
      ownerType: "person",
      ownerId: excPersonId,
      ownerName: person?.fullName || "Budi Santoso",
      date: excDate,
      type: excType,
      note: excNote.trim(),
    });

    showToast("Permintaan pengecualian jadwal (Exception) berhasil diajukan!");
    setIsExcModalOpen(false);
    setExcNote("");
  };

  const handleAssignShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignDate) return;

    const person = people.find((p) => p.id === assignPersonId);
    const shift = shifts.find((s) => s.id === assignShiftId);

    assignShift({
      personId: assignPersonId,
      personName: person?.fullName || "Dhia Pratama",
      shiftId: assignShiftId,
      shiftName: shift?.name || "Shift Pagi",
      date: assignDate,
      status: "scheduled",
    });

    showToast("Penetapan shift (Shift Assignment) berhasil dicatat!");
    setIsShiftAssignOpen(false);
  };


  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holName.trim() || !holDate) return;

    addHoliday({
      name: holName.trim(),
      date: holDate,
      appliesTo: "all",
    });

    showToast("Hari libur berhasil ditambahkan ke kalender!");
    setIsNewHolidayOpen(false);
    setHolName("");
    setHolDate("");
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

      {/* LEFT SIDEBAR: Navigasi Menu & Tab Fitur Schedule Manager */}
      <ShellSidebar>
        {/* Header Modul Schedule Manager */}
        <div className="p-3.5 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 shadow-md shadow-teal-500/25 flex items-center justify-center text-white shrink-0">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-bold text-foreground tracking-tight">Schedule Manager</h2>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-500/15 text-teal-600 dark:text-teal-300 font-semibold border border-teal-500/30">
                  #37
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">WorkSchedule & Shift</p>
            </div>
          </div>
        </div>

        {/* Menu Tab Fitur Utama */}
        <div className="p-2 space-y-1">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Menu Navigasi Fitur
          </div>

          <button
            onClick={() => setActiveTab("team_schedule")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "team_schedule"
                ? "bg-teal-600 text-white font-semibold shadow-xs"
                : "text-foreground/80 hover:text-foreground hover:bg-accent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 shrink-0" />
              <span>Jadwal Tim</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("shift_roster")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "shift_roster"
                ? "bg-teal-600 text-white font-semibold shadow-xs"
                : "text-foreground/80 hover:text-foreground hover:bg-accent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Shift Roster</span>
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                activeTab === "shift_roster"
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {shiftAssignments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("exceptions")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "exceptions"
                ? "bg-teal-600 text-white font-semibold shadow-xs"
                : "text-foreground/80 hover:text-foreground hover:bg-accent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileCheck2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Cuti & WFH</span>
            </div>
            {exceptions.filter((e) => e.status === "pending").length > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  activeTab === "exceptions"
                    ? "bg-white/25 text-white"
                    : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                }`}
              >
                {exceptions.filter((e) => e.status === "pending").length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("holidays")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "holidays"
                ? "bg-teal-600 text-white font-semibold shadow-xs"
                : "text-foreground/80 hover:text-foreground hover:bg-accent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Kalender Libur</span>
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                activeTab === "holidays"
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {holidays.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "stats"
                ? "bg-teal-600 text-white font-semibold shadow-xs"
                : "text-foreground/80 hover:text-foreground hover:bg-accent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Kapasitas & Statistik</span>
            </div>
          </button>
        </div>
      </ShellSidebar>

      {/* Header Actions in Floating Pill */}
      <ShellHeader>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsShiftAssignOpen(true)}
            title="Tetapkan Shift"
            aria-label="Tetapkan Shift"
            className="p-1.5 bg-card hover:bg-accent text-foreground border border-border/80 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0 flex items-center justify-center"
          >
            <Clock className="w-3.5 h-3.5 text-teal-500" />
          </button>

          <button
            onClick={() => setIsExcModalOpen(true)}
            title="Ajukan Cuti / WFH"
            aria-label="Ajukan Cuti / WFH"
            className="p-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0 flex items-center justify-center"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </ShellHeader>

      {/* Page Header Banner */}
      <div className="px-6 py-4 border-b border-border bg-card/40 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-gradient-to-tr from-teal-500 to-emerald-600 rounded-xl shadow-lg shadow-teal-500/20 shrink-0">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Schedule Manager</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-300 border border-teal-500/30">
                  App #37
                </span>
                <span className="text-xs text-muted-foreground">
                  Source of Truth WorkSchedule • Pola Jam Kerja, Shift & Ketersediaan
                </span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Fondasi kapasitas formal organisasi (Working Hours, Shift, Cuti, WFH) yang dikonsumsi oleh Planner (#04) dan Resource Manager (#34).
              </p>
            </div>
          </div>

          {/* Quick Active Tab Chip */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-muted-foreground">Menu Tab:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 text-xs font-semibold">
              {activeTab === "team_schedule" && <Users className="w-3.5 h-3.5" />}
              {activeTab === "shift_roster" && <Layers className="w-3.5 h-3.5" />}
              {activeTab === "exceptions" && <FileCheck2 className="w-3.5 h-3.5" />}
              {activeTab === "holidays" && <Calendar className="w-3.5 h-3.5" />}
              {activeTab === "stats" && <BarChart3 className="w-3.5 h-3.5" />}
              {activeTab === "team_schedule" && "Jadwal Tim"}
              {activeTab === "shift_roster" && "Shift Roster"}
              {activeTab === "exceptions" && "Cuti & WFH"}
              {activeTab === "holidays" && "Kalender Libur"}
              {activeTab === "stats" && "Kapasitas & Statistik"}
            </span>
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
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Jadwal Formal Aktif</div>
                <div className="text-3xl font-extrabold text-white mt-1">{stats.totalSchedules}</div>
                <div className="text-xs text-muted-foreground mt-1">Pola kerja terdaftar</div>
              </div>

              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Absence Rate</div>
                <div className="text-3xl font-extrabold text-emerald-400 mt-1">{stats.absenceRate}%</div>
                <div className="text-xs text-muted-foreground mt-1">Tingkat cuti & izin sakit</div>
              </div>

              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Shift Coverage</div>
                <div className="text-3xl font-extrabold text-teal-400 mt-1">{stats.shiftCoverage}%</div>
                <div className="text-xs text-muted-foreground mt-1">Keterisian giliran kerja</div>
              </div>

              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Antrean Approval</div>
                <div className="text-3xl font-extrabold text-amber-400 mt-1">{stats.pendingRequests}</div>
                <div className="text-xs text-muted-foreground mt-1">Menunggu persetujuan</div>
              </div>
            </div>

            <div className="p-5 bg-card/60 border border-border rounded-xl space-y-2">
              <h4 className="font-semibold text-foreground text-sm">Prinsip Integrasi Kapasitas Lintas-Aplikasi</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Setiap kali seseorang disetujui cuti atau libur di sini, <strong>Planner (#04)</strong> secara otomatis memotong kapasitas harian orang tersebut menjadi 0 jam, mencegah penjadwalan TimeBlock yang berbenturan. <strong>Resource Manager (#34)</strong> juga menyinkronkan <code>totalCapacity</code> personil dari pola jam kerja ini.
              </p>
            </div>
          </div>
        )}

        {/* HOLIDAYS VIEW */}
        {activeTab === "holidays" && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-4 bg-card/80 border border-border rounded-xl flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Hari Libur Nasional & Perusahaan</h3>
                <p className="text-xs text-muted-foreground">
                  Hari libur berlaku otomatis untuk seluruh WorkSchedule tanpa perlu dicatat manual oleh tiap individu.
                </p>
              </div>

              <button
                onClick={() => setIsNewHolidayOpen(true)}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold"
              >
                + Tambah Hari Libur
              </button>
            </div>

            <div className="space-y-2">
              {holidays.map((h) => (
                <div
                  key={h.id}
                  className="p-4 bg-card/80 border border-border rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <div>
                      <div className="font-bold text-foreground">{h.name}</div>
                      <div className="text-muted-foreground font-mono text-[11px]">{h.date}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteHoliday(h.id)}
                    className="p-1.5 text-muted-foreground hover:text-rose-400 rounded hover:bg-card"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EXCEPTION REQUESTS VIEW */}
        {activeTab === "exceptions" && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-4 bg-card/40 border border-border/60 rounded-xl text-xs text-muted-foreground">
              Pengecualian terhadap pola jam kerja dasar (Cuti, Sakit, WFH, Lembur) yang diverifikasi oleh manajer.
            </div>

            <div className="space-y-3">
              {exceptions.map((exc) => (
                <div
                  key={exc.id}
                  className="p-5 bg-card/80 border border-border rounded-xl flex items-start justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-foreground">{exc.ownerName}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          exc.type === "leave"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : exc.type === "wfh"
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {exc.type}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          exc.status === "approved"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : exc.status === "rejected"
                            ? "bg-card text-muted-foreground"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        {exc.status}
                      </span>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Tanggal: <span className="font-mono text-foreground">{exc.date}</span> • Alasan: "{exc.note}"
                    </div>
                  </div>

                  {exc.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          reviewException(exc.id, "rejected");
                          showToast("Permintaan ditolak.");
                        }}
                        className="px-3 py-1.5 bg-card hover:bg-card text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold"
                      >
                        Tolak
                      </button>
                      <button
                        onClick={() => {
                          reviewException(exc.id, "approved");
                          showToast("Permintaan cuti/WFH DISETUJUI! Kapasitas di Planner otomatis diperbarui.");
                        }}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                      >
                        Setujui
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SHIFT ROSTER VIEW */}
        {activeTab === "shift_roster" && (
          <div className="space-y-6 max-w-4xl">
            {/* Shifts Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {shifts.map((s) => (
                <div key={s.id} className="p-4 bg-card/80 border border-border rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground">{s.name}</span>
                    <Clock className="w-3.5 h-3.5 text-teal-400" />
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {s.startTime} - {s.endTime} ({s.breakMinutes}m istirahat)
                  </div>
                </div>
              ))}
            </div>

            {/* Assignments Table */}
            <div className="p-4 bg-card/80 border border-border rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white">Penetapan Roster Giliran Kerja</h4>
                <button
                  onClick={() => setIsShiftAssignOpen(true)}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold"
                >
                  + Jadwalkan Giliran
                </button>
              </div>

              <div className="space-y-2">
                {shiftAssignments.map((sa) => (
                  <div
                    key={sa.id}
                    className="p-3 bg-background/80 border border-border rounded-lg flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-foreground">{sa.personName}</span>
                      <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono text-[11px]">
                        {sa.shiftName}
                      </span>
                      <span className="text-muted-foreground font-mono">{sa.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={sa.status}
                        onChange={(e) => updateShiftStatus(sa.id, e.target.value as any)}
                        className="px-2 py-1 bg-card border border-border rounded text-xs text-foreground"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="swapped">Swapped</option>
                        <option value="absent">Absent</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TEAM SCHEDULE GRID VIEW */}
        {activeTab === "team_schedule" && (
          <div className="space-y-4">
            <div className="p-4 bg-card/80 border border-border rounded-xl flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Ketersediaan Tim Mingguan (Availability Matrix)</h3>
                <p className="text-xs text-muted-foreground">
                  Membaca jam kerja dasar dikurangi Hari Libur dan Cuti yang disetujui.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto bg-card/80 border border-border rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-background/60 border-b border-border text-muted-foreground">
                  <tr>
                    <th className="p-3">Anggota Tim</th>
                    <th className="p-3">Pola Dasar</th>
                    {weekDays.map((d) => (
                      <th key={d} className="p-3">
                        {new Date(d).toLocaleDateString("id-ID", { weekday: "short", day: "numeric" })}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {schedules.map((s) => (
                    <tr key={s.id} className="hover:bg-card/30">
                      <td className="p-3 font-semibold text-foreground">
                        {s.ownerName}
                        <div className="text-[10px] text-muted-foreground font-normal">{s.timezone}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-card text-foreground text-[10px] capitalize">
                          {s.pattern.type.replace("_", " ")}
                        </span>
                      </td>

                      {weekDays.map((date) => {
                        const { availableHours, reason } = calculateAvailability(s.ownerId, date);

                        let badgeColor = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
                        if (availableHours === 0) {
                          badgeColor = "bg-card text-muted-foreground border-border";
                        } else if (availableHours > 8) {
                          badgeColor = "bg-purple-500/20 text-purple-300 border-purple-500/30";
                        }

                        return (
                          <td key={date} className="p-3">
                            <div
                              className={`p-1.5 rounded border text-center font-bold ${badgeColor}`}
                              title={reason}
                            >
                              <div>{availableHours}h</div>
                              <div className="text-[9px] font-normal truncate max-w-[80px]">{reason}</div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: REQUEST EXCEPTION */}
      {isExcModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-white">Ajukan Pengecualian Jadwal (Exception)</h3>
              <button onClick={() => setIsExcModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestException} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Nama Personil <span className="text-rose-400">*</span>
                </label>
                <select
                  value={excPersonId}
                  onChange={(e) => setExcPersonId(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-teal-500"
                >
                  {people.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.jobTitle || "Person"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Jenis Pengecualian</label>
                  <select
                    value={excType}
                    onChange={(e) => setExcType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-teal-500"
                  >
                    <option value="leave">Cuti Tahunan (Leave)</option>
                    <option value="sick">Izin Sakit (Sick)</option>
                    <option value="wfh">Bekerja dari Rumah (WFH)</option>
                    <option value="overtime">Lembur (Overtime)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={excDate}
                    onChange={(e) => setExcDate(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Alasan / Keterangan <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="mis. Cuti tahunan urusan keluarga"
                  value={excNote}
                  onChange={(e) => setExcNote(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsExcModalOpen(false)}
                  className="px-3.5 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold"
                >
                  Ajukan Permintaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN SHIFT */}
      {isShiftAssignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-white">Tetapkan Shift (Shift Assignment)</h3>
              <button onClick={() => setIsShiftAssignOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignShift} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Personil</label>
                <select
                  value={assignPersonId}
                  onChange={(e) => setAssignPersonId(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-teal-500"
                >
                  {people.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Shift</label>
                  <select
                    value={assignShiftId}
                    onChange={(e) => setAssignShiftId(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-teal-500"
                  >
                    {shifts.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.startTime}-{s.endTime})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={assignDate}
                    onChange={(e) => setAssignDate(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsShiftAssignOpen(false)}
                  className="px-3.5 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold"
                >
                  Simpan Jadwal Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW HOLIDAY */}
      {isNewHolidayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-white">Tambah Hari Libur Baru</h3>
              <button onClick={() => setIsNewHolidayOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddHoliday} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Nama Hari Libur <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="mis. Cuti Bersama Idul Fitri"
                  value={holName}
                  onChange={(e) => setHolName(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Tanggal <span className="text-rose-400">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={holDate}
                  onChange={(e) => setHolDate(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsNewHolidayOpen(false)}
                  className="px-3.5 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold"
                >
                  Simpan Hari Libur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
