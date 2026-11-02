import React, { useState, useEffect } from "react";
import {
  Droplet,
  FileHeart,
  Activity,
  Scale,
  Moon,
  Sparkles,
  Plus,
  Trash2,
} from "lucide-react";
import { WorkoutsView } from "./WorkoutsView";

// 1. WORKOUTS SUB-VIEW (Embeds WorkoutsView)
export function HealthWorkoutsView() {
  return (
    <div className="space-y-4">
      <WorkoutsView />
    </div>
  );
}

// 2. WATER SUB-VIEW
export function HealthWaterView() {
  const [glasses, setGlasses] = useState(() => {
    try {
      const s = localStorage.getItem("aio_water_glasses");
      if (s) return Number(s);
    } catch {}
    return 8;
  });

  const [logs, setLogs] = useState(() => {
    try {
      const s = localStorage.getItem("aio_water_history");
      if (s) return JSON.parse(s);
    } catch {}
    return [
      { id: "w-1", time: "07:30", amount: 500, label: "Air Hangat Bangun Tidur" },
      { id: "w-2", time: "10:15", amount: 350, label: "Rehidrasi Kerja Pagi" },
      { id: "w-3", time: "13:00", amount: 500, label: "Air Pasca Makan Siang" },
      { id: "w-4", time: "16:00", amount: 400, label: "Hidrasi Sore Hari" },
      { id: "w-5", time: "19:30", amount: 450, label: "Makan Malam & Elektrolit" },
    ];
  });

  const targetMl = 3000;
  const currentMl = logs.reduce((acc: number, cur: any) => acc + cur.amount, 0);
  const percentage = Math.min(Math.round((currentMl / targetMl) * 100), 100);

  useEffect(() => {
    try {
      localStorage.setItem("aio_water_history", JSON.stringify(logs));
    } catch {}
  }, [logs]);

  const addGlass = (amount: number, label: string) => {
    const time = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    setLogs([
      { id: `w-${Date.now()}`, time, amount, label },
      ...logs,
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-card via-card to-blue-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Droplet size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400">
                Fitur Terintegrasi
              </span>
              <span className="text-xs text-muted-foreground">Hydration & Electrolyte Balance</span>
            </div>
            <h3 className="text-xl font-bold text-foreground mt-0.5">Water Tracker & Hidrasi Presisi</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Target harian: 3.0 Liter (3,000 mL) untuk mencegah brain-fog dan menjaga fungsi ginjal.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => addGlass(250, "Gelas Air (250 ml)")}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
          >
            <Plus size={14} />
            <span>+250 ml (Gelas)</span>
          </button>
          <button
            onClick={() => addGlass(500, "Tumbler (500 ml)")}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
          >
            <Plus size={14} />
            <span>+500 ml (Tumbler)</span>
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-foreground">
            Tercapai: <strong className="text-blue-600 dark:text-blue-400 font-mono text-sm">{currentMl} mL</strong> / 3,000 mL
          </span>
          <span className="font-mono text-primary">{percentage}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Log list */}
      <div className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden shadow-xs">
        {logs.map((log: any) => (
          <div key={log.id} className="p-3.5 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono text-muted-foreground">{log.time}</span>
              <span className="font-semibold text-foreground">{log.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">+{log.amount} ml</span>
              <button
                onClick={() => setLogs(logs.filter((x: any) => x.id !== log.id))}
                className="text-muted-foreground hover:text-rose-500 p-1"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. RIWAYAT REKAM MEDIS SUB-VIEW
export function HealthMedicalRecordsView() {
  const [records, setRecords] = useState(() => {
    try {
      const s = localStorage.getItem("aio_medical_records");
      if (s) return JSON.parse(s);
    } catch {}
    return [
      { id: "mr-1", title: "Medical Check-Up Tahunan 2026", clinic: "RS Pondok Indah (Dr. Hartono, Sp.PD)", date: "2026-08-14", diagnosis: "Kondisi kardiovaskular sangat sehat, fungsi ginjal & hati optimal.", prescription: "Lanjutkan suplemen D3 & EPA/DHA" },
      { id: "mr-2", title: "Pemeriksaan Gigi & Scaling 6 Bulanan", clinic: "Klinik Gigi Spesialis", date: "2026-06-10", diagnosis: "Kavitas nol, karang gigi bersih sempurna.", prescription: "Flossing rutin harian" },
      { id: "mr-3", title: "Vaksinasi Booster Influenza", clinic: "Klinik Pratama Sehat", date: "2026-04-05", diagnosis: "Imunisasi preventif perjalanan dinas internasional.", prescription: "-" },
    ];
  });

  const [title, setTitle] = useState("");
  const [clinic, setClinic] = useState("");
  const [date, setDate] = useState("");
  const [diag, setDiag] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("aio_medical_records", JSON.stringify(records));
    } catch {}
  }, [records]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clinic.trim()) return;
    setRecords([
      {
        id: `mr-${Date.now()}`,
        title: title.trim(),
        clinic: clinic.trim(),
        date: date || new Date().toISOString().split("T")[0],
        diagnosis: diag.trim() || "Pemeriksaan berkala.",
        prescription: "-",
      },
      ...records,
    ]);
    setTitle("");
    setClinic("");
    setDiag("");
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-border bg-gradient-to-r from-card to-rose-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <FileHeart size={22} />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">Medical Records</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Catatan kunjungan rumah sakit, konsultasi spesialis, resep obat, dan riwayat imunisasi.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleAdd} className="p-4 rounded-xl border border-border bg-card grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Nama pemeriksaan (contoh: Konsultasi Kardio)..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="Nama Dokter / Rumah Sakit..."
          value={clinic}
          onChange={(e) => setClinic(e.target.value)}
          className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
        />
        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs cursor-pointer">
          Catat Riwayat
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {records.map((r: any) => (
          <div key={r.id} className="p-4 rounded-xl border border-border bg-card flex flex-col justify-between gap-3 shadow-xs">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
                Pemeriksaan Resmi
              </span>
              <h4 className="font-bold text-sm text-foreground mt-2">{r.title}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">🏥 {r.clinic}</p>
              <div className="mt-2.5 p-2 rounded-lg bg-muted/30 text-xs text-foreground">
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Diagnosis / Hasil:</span>
                <p className="mt-0.5 leading-relaxed">{r.diagnosis}</p>
              </div>
            </div>

            <div className="border-t border-border pt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{r.date}</span>
              <button onClick={() => setRecords(records.filter((x: any) => x.id !== r.id))} className="hover:text-rose-500 p-1">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. TEKANAN & GULA DARAH SUB-VIEW
export function HealthVitalsView() {
  const [vitals, setVitals] = useState(() => {
    try {
      const s = localStorage.getItem("aio_vitals_logs");
      if (s) return JSON.parse(s);
    } catch {}
    return [
      { id: "vt-1", date: "2026-09-24", systolic: 118, diastolic: 76, pulse: 60, glucoseFasting: 88, status: "Optimal" },
      { id: "vt-2", date: "2026-09-20", systolic: 120, diastolic: 78, pulse: 62, glucoseFasting: 90, status: "Optimal" },
      { id: "vt-3", date: "2026-09-15", systolic: 122, diastolic: 80, pulse: 64, glucoseFasting: 92, status: "Normal" },
    ];
  });

  const [sys, setSys] = useState("120");
  const [dia, setDia] = useState("80");
  const [pulse, setPulse] = useState("62");
  const [glucose, setGlucose] = useState("90");

  useEffect(() => {
    try {
      localStorage.setItem("aio_vitals_logs", JSON.stringify(vitals));
    } catch {}
  }, [vitals]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setVitals([
      {
        id: `vt-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        systolic: Number(sys),
        diastolic: Number(dia),
        pulse: Number(pulse),
        glucoseFasting: Number(glucose),
        status: Number(sys) < 120 && Number(dia) < 80 ? "Optimal" : "Normal",
      },
      ...vitals,
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-border bg-gradient-to-r from-card to-emerald-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Activity size={22} />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">Vitals Tracker</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Deteksi dini beban vaskular dan kestabilan glukosa puasa untuk menjaga metabolisme energi otak.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleAdd} className="p-4 rounded-xl border border-border bg-card grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div>
          <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Sistolik (mmHg)</label>
          <input
            type="number"
            value={sys}
            onChange={(e) => setSys(e.target.value)}
            className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Diastolik (mmHg)</label>
          <input
            type="number"
            value={dia}
            onChange={(e) => setDia(e.target.value)}
            className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Detak Nadi (bpm)</label>
          <input
            type="number"
            value={pulse}
            onChange={(e) => setPulse(e.target.value)}
            className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Gula Darah Puasa</label>
          <input
            type="number"
            value={glucose}
            onChange={(e) => setGlucose(e.target.value)}
            className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
            required
          />
        </div>
        <div className="flex items-end col-span-2 sm:col-span-1">
          <button type="submit" className="w-full px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs cursor-pointer">
            Simpan Vital
          </button>
        </div>
      </form>

      <div className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden shadow-xs">
        {vitals.map((vt: any) => (
          <div key={vt.id} className="p-4 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4">
              <span className="font-bold text-foreground">{vt.date}</span>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold font-mono">
                  Tensi: {vt.systolic}/{vt.diastolic} mmHg
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold font-mono">
                  Nadi: {vt.pulse} bpm
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                  Gula: {vt.glucoseFasting} mg/dL
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{vt.status}</span>
              <button onClick={() => setVitals(vitals.filter((x: any) => x.id !== vt.id))} className="hover:text-rose-500 p-1">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. PENGUKURAN TUBUH & BERAT SUB-VIEW
export function HealthBodyMetricsView() {
  const [metrics, setMetrics] = useState(() => {
    try {
      const s = localStorage.getItem("aio_body_metrics");
      if (s) return JSON.parse(s);
    } catch {}
    return [
      { id: "bm-1", date: "2026-09-22", weight: 71.4, bodyFat: 18.2, muscleMass: 55.4, waistline: 81.5 },
      { id: "bm-2", date: "2026-09-15", weight: 71.8, bodyFat: 18.4, muscleMass: 55.2, waistline: 82.0 },
      { id: "bm-3", date: "2026-09-08", weight: 72.1, bodyFat: 18.6, muscleMass: 55.0, waistline: 82.5 },
    ];
  });

  const [weight, setWeight] = useState("71.5");
  const [bodyFat, setBodyFat] = useState("18.2");
  const [waist, setWaist] = useState("81.5");

  useEffect(() => {
    try {
      localStorage.setItem("aio_body_metrics", JSON.stringify(metrics));
    } catch {}
  }, [metrics]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setMetrics([
      {
        id: `bm-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        weight: Number(weight),
        bodyFat: Number(bodyFat),
        muscleMass: 55.3,
        waistline: Number(waist),
      },
      ...metrics,
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-border bg-gradient-to-r from-card to-teal-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Scale size={22} />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">Body Metrics</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pelacak massa otot, lingkar pinggang, dan persentase lemak tubuh untuk kebugaran fungsional.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleAdd} className="p-4 rounded-xl border border-border bg-card grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input
          type="number"
          step="0.1"
          placeholder="Berat Badan (kg)..."
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
          required
        />
        <input
          type="number"
          step="0.1"
          placeholder="Lemak Tubuh (%)..."
          value={bodyFat}
          onChange={(e) => setBodyFat(e.target.value)}
          className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
        />
        <input
          type="number"
          step="0.1"
          placeholder="Lingkar Pinggang (cm)..."
          value={waist}
          onChange={(e) => setWaist(e.target.value)}
          className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
        />
        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs cursor-pointer">
          Catat Timbangan
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((m: any) => (
          <div key={m.id} className="p-4 rounded-xl border border-border bg-card shadow-xs flex flex-col justify-between gap-3">
            <div>
              <span className="text-xs text-muted-foreground">{m.date}</span>
              <div className="text-2xl font-bold font-mono text-foreground mt-1">{m.weight} kg</div>
              <div className="mt-2 text-xs text-muted-foreground space-y-1">
                <p>Lemak Tubuh: <strong className="text-foreground">{m.bodyFat}%</strong></p>
                <p>Lingkar Pinggang: <strong className="text-foreground">{m.waistline} cm</strong></p>
              </div>
            </div>

            <div className="border-t border-border pt-2 flex justify-end">
              <button onClick={() => setMetrics(metrics.filter((x: any) => x.id !== m.id))} className="hover:text-rose-500 p-1">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. KUALITAS TIDUR & ISTIRAHAT SUB-VIEW
export function HealthSleepView() {
  const [sleepLogs, setSleepLogs] = useState(() => {
    try {
      const s = localStorage.getItem("aio_sleep_logs");
      if (s) return JSON.parse(s);
    } catch {}
    return [
      { id: "sl-1", date: "2026-09-24", duration: "7 Jam 40 Menit", score: 88, bedTime: "22:45", wakeTime: "06:25", quality: "Sangat Segar", disturbances: "Nol gangguan" },
      { id: "sl-2", date: "2026-09-23", duration: "7 Jam 15 Menit", score: 82, bedTime: "23:15", wakeTime: "06:30", quality: "Segar", disturbances: "Bangun 1x minum" },
      { id: "sl-3", date: "2026-09-22", duration: "6 Jam 45 Menit", score: 76, bedTime: "23:45", wakeTime: "06:30", quality: "Cukup", disturbances: "Membaca ponsel larut malam" },
    ];
  });

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-border bg-gradient-to-r from-card to-indigo-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Moon size={22} />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">Sleep Quality</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pantau durasi tidur nyenyak, skor istirahat, dan waktu pemulihan energi mental setiap malam.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sleepLogs.map((s: any) => (
          <div key={s.id} className="p-4 rounded-xl border border-border bg-card shadow-xs flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{s.date}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                  Skor: {s.score}/100
                </span>
              </div>
              <h4 className="font-bold text-lg text-foreground mt-2">{s.duration}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">⏰ {s.bedTime} - {s.wakeTime}</p>
              <p className="text-xs text-muted-foreground mt-2">Kondisi: <strong className="text-foreground">{s.quality}</strong></p>
              <p className="text-[11px] text-muted-foreground/80 mt-1">Catatan: {s.disturbances}</p>
            </div>

            <div className="border-t border-border pt-2 flex justify-end">
              <button onClick={() => setSleepLogs(sleepLogs.filter((x: any) => x.id !== s.id))} className="hover:text-rose-500 p-1">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 7. SKINCARE & GROOMING SUB-VIEW
export function HealthSkincareView() {
  const [routines, setRoutines] = useState(() => {
    try {
      const s = localStorage.getItem("aio_skincare_routines");
      if (s) return JSON.parse(s);
    } catch {}
    return [
      { id: "sk-1", step: "Langkah 1 (Pagi & Malam)", product: "Gentle Foaming Cleanser pH 5.5", ingredients: "Ceramides & Chamomile", expiry: "2027-08-15", time: "Pagi & Malam" },
      { id: "sk-2", step: "Langkah 2 (Pagi)", product: "Vitamin C 15% + Ferulic Acid Serum", ingredients: "L-Ascorbic Acid & Vitamin E", expiry: "2026-12-30", time: "Pagi" },
      { id: "sk-3", step: "Langkah 3 (Pagi)", product: "Broad Spectrum Sunscreen Gel SPF 50+ PA++++", ingredients: "Hyaluronic Acid & Zinc Oxide", expiry: "2027-05-30", time: "Pagi" },
      { id: "sk-4", step: "Langkah 2 (Malam)", product: "Retinol 0.2% Micro-Encapsulated Night Cream", ingredients: "Retinoid & Niacinamide", expiry: "2027-03-20", time: "Malam" },
    ];
  });

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-border bg-gradient-to-r from-card to-pink-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400">
            <Sparkles size={22} />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">Skincare Log</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Jadwal tahapan skincare pagi & malam, inventaris bahan aktif ramah kulit, dan tanggal kadaluarsa produk.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {routines.map((item: any) => (
          <div key={item.id} className="p-4 rounded-xl border border-border bg-card shadow-xs flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-600 dark:text-pink-400">
                  {item.time}
                </span>
                <span className="text-xs text-muted-foreground font-mono">Exp: {item.expiry}</span>
              </div>
              <h4 className="font-bold text-sm text-foreground mt-2">{item.product}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{item.step}</p>
              <div className="mt-2.5 p-2 rounded-lg bg-muted/40 text-xs text-muted-foreground">
                <span className="text-[10px] uppercase font-bold block text-foreground">Bahan Aktif:</span>
                <p className="mt-0.5">{item.ingredients}</p>
              </div>
            </div>

            <div className="border-t border-border pt-2 flex justify-end">
              <button onClick={() => setRoutines(routines.filter((x: any) => x.id !== item.id))} className="hover:text-rose-500 p-1">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
