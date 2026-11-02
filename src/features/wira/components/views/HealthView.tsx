import React, { useState, useEffect } from "react";
import {
  Heart,
  Activity,
  Moon,
  Droplet,
  Pill,
  ShieldCheck,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Zap,
  CheckCircle2,
  Circle,
  FileText,
  X,
  Scale,
  Dumbbell,
  FileHeart,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useRouterState } from "@tanstack/react-router";
import {
  HealthWorkoutsView,
  HealthWaterView,
  HealthMedicalRecordsView,
  HealthVitalsView,
  HealthBodyMetricsView,
  HealthSleepView,
  HealthSkincareView,
} from "./HealthSubViews";

export type HealthTab =
  | "overview"
  | "workouts"
  | "water"
  | "medical-records"
  | "vitals"
  | "body-metrics"
  | "sleep"
  | "skincare"
  | "supplements"
  | "mcu";

export interface DailyHealthLog {
  id: string;
  date: string;
  sleepHours: number;
  sleepScore: number; // 0 - 100
  restingHeartRate: number; // bpm
  bloodPressure: string; // e.g. "118/76"
  weightKg: number;
  energyLevel: number; // 1 - 10
  stressLevel: number; // 1 - 10
  notes: string;
}

export interface SupplementItem {
  id: string;
  name: string;
  dosage: string;
  timing: "Pagi (Fokus & Otak)" | "Siang (Mitokondria & Energi)" | "Malam (Sleep & Recovery)";
  purpose: string;
  takenToday: boolean;
}

export interface BiomarkerLabRecord {
  id: string;
  testName: string;
  category: "Profil Lipid" | "Metabolik & Gula" | "Hormon & Vitamin" | "Fungsi Organ & Ginjal";
  resultValue: string;
  unit: string;
  referenceRange: string;
  status: "Optimal" | "Normal" | "Perhatian";
  testDate: string;
  labLocation: string;
  doctorNote: string;
}

const INITIAL_SUPPLEMENTS: SupplementItem[] = [
  // Pagi
  {
    id: "sup-1",
    name: "Omega-3 Ultra EPA/DHA",
    dosage: "2,000 mg (1200mg EPA / 600mg DHA)",
    timing: "Pagi (Fokus & Otak)",
    purpose: "Fluiditas membran neuron, fokus eksekutif, dan regulasi inflamasi vaskular.",
    takenToday: true,
  },
  {
    id: "sup-2",
    name: "Vitamin D3 (5000 IU) + K2 (MK-7 100mcg)",
    dosage: "1 Kapsul Softgel",
    timing: "Pagi (Fokus & Otak)",
    purpose: "Kekebalan imun, modulasi suasana hati, dan penyerapan kalsium ke jaringan tulang.",
    takenToday: true,
  },
  {
    id: "sup-3",
    name: "Organic Lion's Mane Extract (Hericium erinaceus)",
    dosage: "1,000 mg (Standar 30% Polisakarida)",
    timing: "Pagi (Fokus & Otak)",
    purpose: "Merangsang NGF (Nerve Growth Factor) untuk retensi memori dan kejernihan berpikir.",
    takenToday: true,
  },
  // Siang
  {
    id: "sup-4",
    name: "CoQ10 Ubiquinol High-Bioavailability",
    dosage: "100 mg",
    timing: "Siang (Mitokondria & Energi)",
    purpose: "Dukungan sintesis energi seluler (ATP) di jantung dan pencegahan brain fog siang hari.",
    takenToday: false,
  },
  {
    id: "sup-5",
    name: "Magnesium Malate",
    dosage: "200 mg Elemental",
    timing: "Siang (Mitokondria & Energi)",
    purpose: "Mengurangi rasa tegang otot dan membantu siklus asam sitrat penghasil tenaga.",
    takenToday: false,
  },
  // Malam
  {
    id: "sup-6",
    name: "Magnesium Bisglycinate Chelate",
    dosage: "300 mg",
    timing: "Malam (Sleep & Recovery)",
    purpose: "Mengaktifkan reseptor parasimpatik (GABA) untuk memicu deep slow-wave sleep.",
    takenToday: false,
  },
  {
    id: "sup-7",
    name: "Suntheanine® L-Theanine",
    dosage: "200 mg",
    timing: "Malam (Sleep & Recovery)",
    purpose: "Menurunkan detak jantung istirahat dan menenangkan gelombang pikiran sebelum tidur.",
    takenToday: false,
  },
];

const INITIAL_HEALTH_LOGS: DailyHealthLog[] = [
  {
    id: "log-1",
    date: "19 Sep 2026",
    sleepHours: 7.7,
    sleepScore: 89,
    restingHeartRate: 57,
    bloodPressure: "118/76",
    weightKg: 71.4,
    energyLevel: 9,
    stressLevel: 3,
    notes: "Tidur sangat nyenyak setelah peregangan malam. Bangun segar tanpa alarm, fokus siap negosiasi.",
  },
  {
    id: "log-2",
    date: "18 Sep 2026",
    sleepHours: 7.2,
    sleepScore: 84,
    restingHeartRate: 59,
    bloodPressure: "120/78",
    weightKg: 71.6,
    energyLevel: 8,
    stressLevel: 4,
    notes: "Rapat maraton sampai sore. Konsumsi air tercukupi 3 liter, tidak ada sakit kepala.",
  },
  {
    id: "log-3",
    date: "17 Sep 2026",
    sleepHours: 6.8,
    sleepScore: 78,
    restingHeartRate: 62,
    bloodPressure: "122/80",
    weightKg: 71.8,
    energyLevel: 7,
    stressLevel: 6,
    notes: "Sedikit jetlag pasca perjalanan dinas singkat. Mengambil sesi Zone 2 cardio untuk detoks.",
  },
];

const INITIAL_LAB_RECORDS: BiomarkerLabRecord[] = [
  {
    id: "mcu-1",
    testName: "Glukosa Darah Puasa (Fasting Glucose)",
    category: "Metabolik & Gula",
    resultValue: "84",
    unit: "mg/dL",
    referenceRange: "70 - 99",
    status: "Optimal",
    testDate: "10 Agustus 2026",
    labLocation: "Prodia Executive Health Centre Jakarta",
    doctorNote: "Sensitivitas insulin sangat tinggi, pertahankan pola makan rendah gula olahan.",
  },
  {
    id: "mcu-2",
    testName: "Hemoglobin A1c (HbA1c)",
    category: "Metabolik & Gula",
    resultValue: "5.1",
    unit: "%",
    referenceRange: "< 5.7",
    status: "Optimal",
    testDate: "10 Agustus 2026",
    labLocation: "Prodia Executive Health Centre Jakarta",
    doctorNote: "Kontrol glikemik jangka panjang sangat prima.",
  },
  {
    id: "mcu-3",
    testName: "Kolesterol LDL (Direk)",
    category: "Profil Lipid",
    resultValue: "88",
    unit: "mg/dL",
    referenceRange: "< 100",
    status: "Optimal",
    testDate: "10 Agustus 2026",
    labLocation: "Prodia Executive Health Centre Jakarta",
    doctorNote: "Rasio vaskular sehat, partikel plak kardiovaskular rendah.",
  },
  {
    id: "mcu-4",
    testName: "Kolesterol HDL",
    category: "Profil Lipid",
    resultValue: "68",
    unit: "mg/dL",
    referenceRange: "> 50",
    status: "Optimal",
    testDate: "10 Agustus 2026",
    labLocation: "Prodia Executive Health Centre Jakarta",
    doctorNote: "Proteksi kardiopulmoner tinggi berkat rutin kardio Zone 2.",
  },
  {
    id: "mcu-5",
    testName: "Trigliserida",
    category: "Profil Lipid",
    resultValue: "76",
    unit: "mg/dL",
    referenceRange: "< 150",
    status: "Optimal",
    testDate: "10 Agustus 2026",
    labLocation: "Prodia Executive Health Centre Jakarta",
    doctorNote: "Profil metabolisme lemak sangat bersih.",
  },
  {
    id: "mcu-6",
    testName: "25-Hydroxy Vitamin D",
    category: "Hormon & Vitamin",
    resultValue: "64",
    unit: "ng/mL",
    referenceRange: "40 - 80 (Optimal)",
    status: "Optimal",
    testDate: "10 Agustus 2026",
    labLocation: "Prodia Executive Health Centre Jakarta",
    doctorNote: "Tingkat vitamin D dalam rentang longevity optimal berkat suplemen D3+K2.",
  },
  {
    id: "mcu-7",
    testName: "hs-CRP (High-Sensitivity C-Reactive Protein)",
    category: "Hormon & Vitamin",
    resultValue: "0.38",
    unit: "mg/L",
    referenceRange: "< 1.0 (Risiko Rendah)",
    status: "Optimal",
    testDate: "10 Agustus 2026",
    labLocation: "Prodia Executive Health Centre Jakarta",
    doctorNote: "Inflamasi sistemik tubuh sangat minim.",
  },
  {
    id: "mcu-8",
    testName: "Estimasi GFR (eGFR) Ginjal",
    category: "Fungsi Organ & Ginjal",
    resultValue: "104",
    unit: "mL/min/1.73m²",
    referenceRange: "> 90",
    status: "Optimal",
    testDate: "10 Agustus 2026",
    labLocation: "Prodia Executive Health Centre Jakarta",
    doctorNote: "Filtrasi ginjal sangat baik didukung hidrasi 3 liter per hari.",
  },
];

export function HealthView() {
  const routerState = useRouterState();
  const searchStr = routerState.location.searchStr;

  const [activeTab, setActiveTab] = useState<HealthTab>(() => {
    const param = new URLSearchParams(searchStr || "").get("tab");
    if (
      param &&
      [
        "overview",
        "workouts",
        "water",
        "medical-records",
        "vitals",
        "body-metrics",
        "sleep",
        "skincare",
        "supplements",
        "mcu",
      ].includes(param)
    ) {
      return param as HealthTab;
    }
    return "overview";
  });

  useEffect(() => {
    const param = new URLSearchParams(searchStr || "").get("tab");
    if (
      param &&
      [
        "overview",
        "workouts",
        "water",
        "medical-records",
        "vitals",
        "body-metrics",
        "sleep",
        "skincare",
        "supplements",
        "mcu",
      ].includes(param) &&
      param !== activeTab
    ) {
      setActiveTab(param as HealthTab);
    }
  }, [searchStr]);

  const handleTabChange = (t: HealthTab) => {
    setActiveTab(t);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", t);
      window.history.replaceState(window.history.state, "", url.toString());
    } catch {}
  };

  // Daily Logs State
  const [logs, setLogs] = useState<DailyHealthLog[]>(() => {
    try {
      const saved = localStorage.getItem("aio_executive_health_logs");
      return saved ? JSON.parse(saved) : INITIAL_HEALTH_LOGS;
    } catch {
      return INITIAL_HEALTH_LOGS;
    }
  });

  // Supplements State
  const [supplements, setSupplements] = useState<SupplementItem[]>(() => {
    try {
      const saved = localStorage.getItem("aio_executive_supplements");
      return saved ? JSON.parse(saved) : INITIAL_SUPPLEMENTS;
    } catch {
      return INITIAL_SUPPLEMENTS;
    }
  });

  // Biomarkers State
  const [labRecords, setLabRecords] = useState<BiomarkerLabRecord[]>(() => {
    try {
      const saved = localStorage.getItem("aio_executive_mcu_records");
      return saved ? JSON.parse(saved) : INITIAL_LAB_RECORDS;
    } catch {
      return INITIAL_LAB_RECORDS;
    }
  });

  // Hydration State (stored in ml, target 3000ml)
  const [hydrationMl, setHydrationMl] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("aio_executive_hydration_today");
      return saved ? Number(saved) : 2250;
    } catch {
      return 2250;
    }
  });

  // Modal: Add Log Form
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [newSleepHours, setNewSleepHours] = useState(7.5);
  const [newSleepScore, setNewSleepScore] = useState(85);
  const [newRHR, setNewRHR] = useState(58);
  const [newBP, setNewBP] = useState("118/76");
  const [newWeight, setNewWeight] = useState(71.5);
  const [newEnergy, setNewEnergy] = useState(8);
  const [newStress, setNewStress] = useState(3);
  const [newNotes, setNewNotes] = useState("");

  // Modal: Add Supplement Form
  const [isSupplementModalOpen, setIsSupplementModalOpen] = useState(false);
  const [newSupName, setNewSupName] = useState("");
  const [newSupDosage, setNewSupDosage] = useState("");
  const [newSupTiming, setNewSupTiming] = useState<
    "Pagi (Fokus & Otak)" | "Siang (Mitokondria & Energi)" | "Malam (Sleep & Recovery)"
  >("Pagi (Fokus & Otak)");
  const [newSupPurpose, setNewSupPurpose] = useState("");

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("aio_executive_health_logs", JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem("aio_executive_supplements", JSON.stringify(supplements));
    } catch (e) {
      console.error(e);
    }
  }, [supplements]);

  useEffect(() => {
    try {
      localStorage.setItem("aio_executive_hydration_today", hydrationMl.toString());
    } catch (e) {
      console.error(e);
    }
  }, [hydrationMl]);

  // Hydration helpers
  const targetHydration = 3000;
  const hydrationPct = Math.min(Math.round((hydrationMl / targetHydration) * 100), 100);

  const addHydration = (amount: number) => {
    setHydrationMl((prev) => Math.min(prev + amount, 5000));
  };

  const resetHydration = () => {
    if (confirm("Reset catatan hidrasi hari ini ke 0 ml?")) {
      setHydrationMl(0);
    }
  };

  // Supplement toggler
  const toggleSupplement = (id: string) => {
    setSupplements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, takenToday: !item.takenToday } : item))
    );
  };

  const deleteSupplement = (id: string) => {
    if (confirm("Hapus suplemen ini dari protokol?")) {
      setSupplements((prev) => prev.filter((s) => s.id !== id));
    }
  };

  // Add Log Handler
  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: DailyHealthLog = {
      id: "log-" + Date.now(),
      date: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      sleepHours: Number(newSleepHours),
      sleepScore: Number(newSleepScore),
      restingHeartRate: Number(newRHR),
      bloodPressure: newBP.trim() || "120/80",
      weightKg: Number(newWeight),
      energyLevel: Number(newEnergy),
      stressLevel: Number(newStress),
      notes: newNotes.trim() || "Kondisi fisik dan kognitif stabil.",
    };

    setLogs([newEntry, ...logs]);
    setIsLogModalOpen(false);
    setNewNotes("");
  };

  // Add Supplement Handler
  const handleSaveSupplement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName.trim()) return;

    const newSup: SupplementItem = {
      id: "sup-" + Date.now(),
      name: newSupName.trim(),
      dosage: newSupDosage.trim() || "1 Kapsul",
      timing: newSupTiming,
      purpose: newSupPurpose.trim() || "Penunjang performa & kebugaran",
      takenToday: false,
    };

    setSupplements([...supplements, newSup]);
    setIsSupplementModalOpen(false);
    setNewSupName("");
    setNewSupDosage("");
    setNewSupPurpose("");
  };

  const handleDeleteLog = (id: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
  };

  // Latest log data
  const latestLog = logs[0] || {
    sleepHours: 7.5,
    sleepScore: 85,
    restingHeartRate: 58,
    bloodPressure: "118/76",
    weightKg: 71.5,
    energyLevel: 8,
    stressLevel: 3,
  };

  // Supplement completion stats
  const takenSupplementsCount = supplements.filter((s) => s.takenToday).length;
  const supplementsPct =
    supplements.length > 0 ? Math.round((takenSupplementsCount / supplements.length) * 100) : 100;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-16">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Longevity & Bio-Optimization Matrix
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <ShieldCheck size={12} className="text-blue-500" />
              Executive Health Operating System
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mt-2 tracking-tight">
            Health & Executive Vitality
          </h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Pemantauan biomarker metabolik, kualitas tidur sirkadian, protokol suplemen nootropik, dan hidrasi presisi untuk menjaga ketahanan fisik serta imunitas konsultan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
          >
            <Plus size={16} />
            <span>Catat Biomarker Hari Ini</span>
          </button>
        </div>
      </div>

      {/* KPI Biometric Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Sleep Quality */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Kualitas Tidur Semalam
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-foreground">{latestLog.sleepScore}/100</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                {latestLog.sleepHours} jam
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Moon size={20} />
          </div>
        </div>

        {/* Resting Heart Rate */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Resting Heart Rate (RHR)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-foreground">{latestLog.restingHeartRate}</span>
              <span className="text-xs text-muted-foreground">bpm (Optimal)</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Heart size={20} />
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Tekanan Darah (BP)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-foreground">{latestLog.bloodPressure}</span>
              <span className="text-xs text-muted-foreground">mmHg</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Activity size={20} />
          </div>
        </div>

        {/* Energy Readiness */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Cognitive Energy Score
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-foreground">{latestLog.energyLevel}/10</span>
              <span className="text-xs text-muted-foreground">Stres: {latestLog.stressLevel}/10</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Zap size={20} />
          </div>
        </div>
      </div>

      {/* Interactive Hydration Widget */}
      <div className="bg-card border border-blue-500/20 bg-gradient-to-r from-blue-500/5 via-sky-500/5 to-cyan-500/5 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
              <Droplet size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">
                  Hidrasi Harian Presisi
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  Target: 3.0 Liter (3,000 mL)
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Cairan optimal mencegah penurunan fungsi kognitif dan menjaga sirkulasi darah otak saat bekerja.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => addHydration(250)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all hover:scale-105"
            >
              <Plus size={14} />
              <span>+250 ml (Gelas)</span>
            </button>
            <button
              onClick={() => addHydration(500)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition-all hover:scale-105"
            >
              <Plus size={14} />
              <span>+500 ml (Tumbler)</span>
            </button>
            <button
              onClick={resetHydration}
              className="p-1.5 rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              title="Reset Hidrasi"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-foreground">
              Tercatat: <strong className="text-blue-600 dark:text-blue-400 font-mono text-sm">{hydrationMl} mL</strong> ({hydrationPct}%)
            </span>
            <span className="text-muted-foreground">
              {hydrationMl >= targetHydration
                ? "🎉 Target hidrasi harian tercapai!"
                : `Sisa ${targetHydration - hydrationMl} mL lagi`}
            </span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${hydrationPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-border/80 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => handleTabChange("overview")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer",
              activeTab === "overview"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Activity size={15} />
            <span>Ringkasan Vital</span>
          </button>

          <button
            onClick={() => handleTabChange("workouts")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer",
              activeTab === "workouts"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Dumbbell size={15} />
            <span>Workouts</span>
          </button>

          <button
            onClick={() => handleTabChange("water")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer",
              activeTab === "water"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Droplet size={15} />
            <span>Water</span>
          </button>

          <button
            onClick={() => handleTabChange("medical-records")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer",
              activeTab === "medical-records"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <FileHeart size={15} />
            <span>Medical Records</span>
          </button>

          <button
            onClick={() => handleTabChange("vitals")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer",
              activeTab === "vitals"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Activity size={15} />
            <span>Vitals Tracker</span>
          </button>

          <button
            onClick={() => handleTabChange("body-metrics")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer",
              activeTab === "body-metrics"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Scale size={15} />
            <span>Body Metrics</span>
          </button>

          <button
            onClick={() => handleTabChange("sleep")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer",
              activeTab === "sleep"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Moon size={15} />
            <span>Sleep Quality</span>
          </button>

          <button
            onClick={() => handleTabChange("skincare")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer",
              activeTab === "skincare"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Sparkles size={15} />
            <span>Skincare Log</span>
          </button>

          <button
            onClick={() => handleTabChange("supplements")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer",
              activeTab === "supplements"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Pill size={15} />
            <span>Suplemen ({takenSupplementsCount}/{supplements.length})</span>
          </button>

          <button
            onClick={() => handleTabChange("mcu")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer",
              activeTab === "mcu"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <FileText size={15} />
            <span>Biomarker MCU ({labRecords.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & DAILY LOGS */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Calendar size={18} className="text-emerald-500" />
                  Riwayat Log Biometrik Harian
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Catatan harian untuk mendeteksi kelelahan kumulatif (allostatic load) dan menjaga stamina.
                </p>
              </div>

              <button
                onClick={() => setIsLogModalOpen(true)}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Plus size={14} /> Tambah Log Baru
              </button>
            </div>

            <div className="divide-y divide-border/60">
              {logs.map((entry) => (
                <div key={entry.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-foreground">{entry.date}</span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        Tidur: {entry.sleepHours}j (Score: {entry.sleepScore})
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                        RHR: {entry.restingHeartRate} bpm
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        BP: {entry.bloodPressure}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-muted text-foreground">
                        Berat: {entry.weightKg} kg
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {entry.notes}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <span className="text-muted-foreground block text-[10px] uppercase">Energi / Stres</span>
                      <span className="font-semibold text-foreground">
                        ⚡ {entry.energyLevel}/10 • 🧘 {entry.stressLevel}/10
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteLog(entry.id)}
                      className="p-1.5 text-muted-foreground hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Hapus Entri"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUPPLEMENTS & NOOTROPICS PROTOCOL */}
      {activeTab === "supplements" && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Pill size={18} className="text-amber-500" />
                  Protokol Suplemen & Nootropik Berwaktu
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Disinkronkan dengan ritme sirkadian tubuh untuk mengoptimalkan fokus di siang hari dan relaksasi di malam hari.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Progres Hari Ini: {supplementsPct}% Terpenuhi
                </span>
                <button
                  onClick={() => setIsSupplementModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                >
                  <Plus size={14} />
                  <span>Tambah Suplemen</span>
                </button>
              </div>
            </div>

            {/* Supplements Split By Timing */}
            <div className="space-y-6">
              {(
                [
                  "Pagi (Fokus & Otak)",
                  "Siang (Mitokondria & Energi)",
                  "Malam (Sleep & Recovery)",
                ] as const
              ).map((timingGroup) => {
                const groupItems = supplements.filter((s) => s.timing === timingGroup);

                return (
                  <div key={timingGroup} className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-1.5">
                      {timingGroup.includes("Pagi") ? (
                        <Sparkles size={14} className="text-amber-500" />
                      ) : timingGroup.includes("Siang") ? (
                        <Zap size={14} className="text-blue-500" />
                      ) : (
                        <Moon size={14} className="text-indigo-500" />
                      )}
                      <span>{timingGroup}</span>
                      <span className="text-[11px] font-mono text-muted-foreground/70 lowercase">
                        ({groupItems.filter((i) => i.takenToday).length}/{groupItems.length} diminum)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {groupItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => toggleSupplement(item.id)}
                          className={cn(
                            "p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3",
                            item.takenToday
                              ? "bg-emerald-500/5 border-emerald-500/30"
                              : "bg-card border-border hover:border-blue-500/30"
                          )}
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <button
                              type="button"
                              className="mt-0.5 text-muted-foreground focus:outline-none"
                            >
                              {item.takenToday ? (
                                <CheckCircle2 size={18} className="text-emerald-500" />
                              ) : (
                                <Circle size={18} />
                              )}
                            </button>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4
                                  className={cn(
                                    "text-sm font-bold",
                                    item.takenToday
                                      ? "text-muted-foreground line-through"
                                      : "text-foreground"
                                  )}
                                >
                                  {item.name}
                                </h4>
                              </div>
                              <span className="text-xs font-mono text-blue-600 dark:text-blue-400 block mt-0.5">
                                Dosis: {item.dosage}
                              </span>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                {item.purpose}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSupplement(item.id);
                            }}
                            className="p-1.5 text-muted-foreground hover:text-rose-500 rounded-lg transition-colors"
                            title="Hapus Suplemen"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BIOMARKERS LAB & MCU ARCHIVE */}
      {activeTab === "mcu" && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-500" />
                  Arsip Biomarker Klinis & Medical Check-Up (MCU)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Rujukan uji laboratorium rutin untuk memvalidasi efektivitas protokol nutrisi dan kebugaran.
                </p>
              </div>

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 self-start sm:self-auto">
                Terakhir Diperiksa: Agustus 2026
              </span>
            </div>

            {/* Biomarkers Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-3">Nama Biomarker</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-3">Hasil Uji</th>
                    <th className="py-3 px-3">Rentang Acuan</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Catatan Dokter</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs">
                  {labRecords.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-3 font-bold text-foreground">{item.testName}</td>
                      <td className="py-3 px-3 text-muted-foreground">{item.category}</td>
                      <td className="py-3 px-3 font-mono font-bold text-foreground">
                        {item.resultValue} <span className="text-muted-foreground text-[10px] font-normal">{item.unit}</span>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground font-mono">{item.referenceRange}</td>
                      <td className="py-3 px-3">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                            item.status === "Optimal"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                              : item.status === "Normal"
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                          )}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground max-w-xs truncate" title={item.doctorNote}>
                        {item.doctorNote}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* INTEGRATED HEALTH SUB-FEATURES */}
      {activeTab === "workouts" && <HealthWorkoutsView />}
      {activeTab === "water" && <HealthWaterView />}
      {activeTab === "medical-records" && <HealthMedicalRecordsView />}
      {activeTab === "vitals" && <HealthVitalsView />}
      {activeTab === "body-metrics" && <HealthBodyMetricsView />}
      {activeTab === "sleep" && <HealthSleepView />}
      {activeTab === "skincare" && <HealthSkincareView />}

      {/* MODAL: ADD DAILY LOG */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Heart size={18} className="text-emerald-500" />
                Catat Biomarker Hari Ini
              </h3>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveLog} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">
                    Durasi Tidur (Jam)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newSleepHours}
                    onChange={(e) => setNewSleepHours(Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">
                    Skor Tidur (0-100)
                  </label>
                  <input
                    type="number"
                    value={newSleepScore}
                    onChange={(e) => setNewSleepScore(Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">
                    Resting Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    value={newRHR}
                    onChange={(e) => setNewRHR(Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">
                    Tekanan Darah (mmHg)
                  </label>
                  <input
                    type="text"
                    value={newBP}
                    onChange={(e) => setNewBP(e.target.value)}
                    placeholder="118/76"
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">
                    Berat Badan (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">
                    Tingkat Energi Kognitif (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newEnergy}
                    onChange={(e) => setNewEnergy(Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">
                  Level Stres Subjektif (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newStress}
                  onChange={(e) => setNewStress(Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">
                  Catatan Harian / Gejala Fisik
                </label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Kondisi leher, kejernihan fokus, ketahanan meeting, dsb..."
                  className="w-full bg-background border border-border rounded-xl p-3 text-xs text-foreground"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  Simpan Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SUPPLEMENT */}
      {isSupplementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Pill size={18} className="text-blue-500" />
                Tambah Suplemen / Nootropik
              </h3>
              <button
                onClick={() => setIsSupplementModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSupplement} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">
                  Nama Suplemen / Zat Aktif *
                </label>
                <input
                  type="text"
                  required
                  value={newSupName}
                  onChange={(e) => setNewSupName(e.target.value)}
                  placeholder="Contoh: Ashwagandha KSM-66"
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">
                    Dosis
                  </label>
                  <input
                    type="text"
                    value={newSupDosage}
                    onChange={(e) => setNewSupDosage(e.target.value)}
                    placeholder="Contoh: 600 mg"
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">
                    Waktu Konsumsi
                  </label>
                  <select
                    value={newSupTiming}
                    onChange={(e) =>
                      setNewSupTiming(
                        e.target.value as
                          | "Pagi (Fokus & Otak)"
                          | "Siang (Mitokondria & Energi)"
                          | "Malam (Sleep & Recovery)"
                      )
                    }
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground"
                  >
                    <option value="Pagi (Fokus & Otak)">Pagi (Fokus & Otak)</option>
                    <option value="Siang (Mitokondria & Energi)">Siang (Mitokondria & Energi)</option>
                    <option value="Malam (Sleep & Recovery)">Malam (Sleep & Recovery)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">
                  Tujuan / Manfaat Fungsional
                </label>
                <textarea
                  rows={2}
                  value={newSupPurpose}
                  onChange={(e) => setNewSupPurpose(e.target.value)}
                  placeholder="Contoh: Menurunkan kortisol dan menstabilkan respon terhadap tekanan kerja..."
                  className="w-full bg-background border border-border rounded-xl p-3 text-xs text-foreground"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsSupplementModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-600/20"
                >
                  Simpan Suplemen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
