import { useState } from "react";
import {
  ArrowLeft,
  Lock,
  FileCheck,
} from "lucide-react";

// ==========================================
// 1. Document Vault & Compliance Checklist
// ==========================================
export function DocumentVaultView({ onBack }: { onBack: () => void }) {
  const [docs, setDocs] = useState([
    { id: 1, name: "KTP Elektronik & Kartu Keluarga", category: "Kependudukan", expiry: "Seumur Hidup", status: "Valid", safe: true },
    { id: 2, name: "NPWP Pribadi & EFIN Pajak", category: "Perpajakan", expiry: "Seumur Hidup", status: "Valid", safe: true },
    { id: 3, name: "Polis Asuransi Kesehatan Keluarga", category: "Asuransi", expiry: "12 Des 2026", status: "Aktif", safe: true },
    { id: 4, name: "Sertifikat Hak Milik (SHM) Rumah", category: "Properti", expiry: "Permanen", status: "Aman", safe: true },
    { id: 5, name: "Paspor Internasional", category: "Perjalanan", expiry: "18 Ags 2027", status: "Aktif", safe: true },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-accent rounded-xl text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Document Vault Terenkripsi & Kepatuhan</h1>
            <p className="text-xs text-muted-foreground">Arsip Dokumen Legal, Polis & Reminder Masa Berlaku</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        <div className="p-4 rounded-2xl border border-border bg-primary/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Lock className="size-6 text-primary" />
            <div>
              <h4 className="text-sm font-bold text-foreground">Enkripsi Berkas Tingkat Bank</h4>
              <p className="text-xs text-muted-foreground">Seluruh metadata disimpan secara aman di local device storage.</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
            {docs.length} Dokumen Terproteksi
          </span>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <FileCheck size={18} className="text-primary" /> Daftar Dokumen Hukum & Identitas
            </h3>
          </div>
          <div className="divide-y divide-border">
            {docs.map((d) => (
              <div key={d.id} className="p-4 flex items-center justify-between gap-3 text-sm">
                <div>
                  <h4 className="font-semibold text-foreground">{d.name}</h4>
                  <span className="text-xs text-muted-foreground">{d.category} · Kadaluarsa: {d.expiry}</span>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. Asuransi Kendaraan & Properti Tracker
// ==========================================
export function VehiclePropertyInsuranceTrackerView({ onBack }: { onBack: () => void }) {
  const [policies] = useState([
    { id: 1, asset: "Toyota Kijang Innova Zenix", type: "All Risk + TPL", insurer: "Garda Oto", period: "15 Mei 2026 - 15 Mei 2027", premium: 4500000, value: 430000000 },
    { id: 2, asset: "Rumah Tinggal BSD City", type: "Fire & Flexas + Earthquake", insurer: "Sinarmas", period: "01 Jan 2026 - 01 Jan 2027", premium: 2800000, value: 1800000000 },
  ]);

  const formatRupiah = (val: number) => "Rp " + val.toLocaleString("id-ID");

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-accent rounded-xl text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Asuransi Kendaraan & Properti</h1>
            <p className="text-xs text-muted-foreground">Monitoring Masa Aktif, Premi & Uang Pertanggungan Aset Fisik</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policies.map((p) => (
            <div key={p.id} className="p-5 rounded-2xl border border-border bg-card space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-foreground">{p.asset}</h4>
                  <p className="text-xs text-muted-foreground">{p.insurer} · {p.type}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                  Polis Aktif
                </span>
              </div>
              <div className="border-t border-border pt-3 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Masa Perlindungan:</span>
                  <span className="font-medium text-foreground">{p.period}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nilai Pertanggungan:</span>
                  <span className="font-bold text-foreground">{formatRupiah(p.value)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Premi Tahunan:</span>
                  <span className="font-bold text-primary">{formatRupiah(p.premium)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. Sinking Fund Manager
// ==========================================
export function SinkingFundView({ onBack }: { onBack: () => void }) {
  const [funds, setFunds] = useState([
    { id: 1, name: "Pajak Bumi & Bangunan (PBB) + STNK", target: 6000000, current: 4000000, deadline: "Okt 2026" },
    { id: 2, name: "Liburan Keluarga Akhir Tahun", target: 20000000, current: 11500000, deadline: "Des 2026" },
    { id: 3, name: "Kurban Idul Adha", target: 4500000, current: 3000000, deadline: "Jun 2026" },
    { id: 4, name: "Renovasi Rumah & Servis AC", target: 15000000, current: 8000000, deadline: "Nov 2026" },
  ]);

  const formatRupiah = (val: number) => "Rp " + val.toLocaleString("id-ID");

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-accent rounded-xl text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Sinking Fund Manager</h1>
            <p className="text-xs text-muted-foreground">Pos Dana Pengeluaran Besar Terjadwal Tanpa Mengganggu Kas Rutin</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {funds.map((f) => {
            const pct = Math.min(100, Math.round((f.current / f.target) * 100));
            return (
              <div key={f.id} className="p-5 rounded-2xl border border-border bg-card space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-foreground">{f.name}</h4>
                    <span className="text-xs text-muted-foreground">Target: {f.deadline}</span>
                  </div>
                  <span className="text-xs font-bold text-primary">{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Terkumpul: <strong className="text-foreground">{formatRupiah(f.current)}</strong></span>
                  <span>Target: <strong className="text-foreground">{formatRupiah(f.target)}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. Tax-Loss Harvesting Simulator
// ==========================================
export function TaxLossHarvestingView({ onBack }: { onBack: () => void }) {
  const [capitalGains, setCapitalGains] = useState(45000000);
  const [unrealizedLosses, setUnrealizedLosses] = useState(18000000);
  const [effectiveTaxRate, setEffectiveTaxRate] = useState(10); // 10% estimasi

  const originalTax = (capitalGains * effectiveTaxRate) / 100;
  const netGainsAfterHarvest = Math.max(0, capitalGains - unrealizedLosses);
  const newTax = (netGainsAfterHarvest * effectiveTaxRate) / 100;
  const taxSavings = originalTax - newTax;

  const formatRupiah = (val: number) => "Rp " + val.toLocaleString("id-ID");

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-accent rounded-xl text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Tax-Loss Harvesting Simulator</h1>
            <p className="text-xs text-muted-foreground">Optimasi Beban Pajak Keuntungan Modal dengan Mengimbangi Posisi Merugi</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-border bg-card">
            <span className="text-xs text-muted-foreground">Potensi Penghematan Pajak</span>
            <div className="text-2xl font-black text-emerald-500 mt-1">{formatRupiah(taxSavings)}</div>
            <span className="text-[11px] text-muted-foreground">Efisiensi kas yang dipertahankan</span>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-card">
            <span className="text-xs text-muted-foreground">Pajak Awal (Tanpa Harvesting)</span>
            <div className="text-xl font-bold text-rose-500 mt-1">{formatRupiah(originalTax)}</div>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-card">
            <span className="text-xs text-muted-foreground">Pajak Setelah Harvesting</span>
            <div className="text-xl font-bold text-primary mt-1">{formatRupiah(newTax)}</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-foreground text-sm">Parameter Portofolio</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Keuntungan Terealisasi (Capital Gains)</label>
              <input
                type="number"
                value={capitalGains}
                onChange={(e) => setCapitalGains(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Kerugian Belum Terealisasi (Unrealized Loss)</label>
              <input
                type="number"
                value={unrealizedLosses}
                onChange={(e) => setUnrealizedLosses(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm font-bold text-rose-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. Cap Table Pribadi & Kepemilikan Usaha
// ==========================================
export function PersonalCapTableView({ onBack }: { onBack: () => void }) {
  const [holdings] = useState([
    { id: 1, company: "PT Solusi Niaga Digital", role: "Co-Founder", shares: 450000, totalShares: 1000000, valuation: 12000000000 },
    { id: 2, company: "PT Kopi Kreasi Nusantara", role: "Angel Investor", shares: 80000, totalShares: 1000000, valuation: 3500000000 },
  ]);

  const formatRupiah = (val: number) => "Rp " + val.toLocaleString("id-ID");

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-accent rounded-xl text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Cap Table Pribadi (Equity Holdings)</h1>
            <p className="text-xs text-muted-foreground">Pencatatan Kepemilikan Saham Startup & Entitas Bisnis Keluarga</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {holdings.map((h) => {
            const pct = ((h.shares / h.totalShares) * 100).toFixed(1);
            const holdingValue = (h.valuation * Number(pct)) / 100;
            return (
              <div key={h.id} className="p-5 rounded-2xl border border-border bg-card space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-foreground">{h.company}</h4>
                    <span className="text-xs text-muted-foreground">{h.role}</span>
                  </div>
                  <span className="text-sm font-black text-primary px-2.5 py-1 rounded-xl bg-primary/10">
                    {pct}%
                  </span>
                </div>
                <div className="border-t border-border pt-3 space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Valuasi Perusahaan:</span>
                    <span className="font-semibold text-foreground">{formatRupiah(h.valuation)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nilai Ekuitas Pribadi:</span>
                    <span className="font-black text-emerald-600">{formatRupiah(holdingValue)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. Benchmark Net Worth Demografi & Liquidity Monitor
// ==========================================
export function DemographicBenchmarkView({ onBack }: { onBack: () => void }) {
  const [ageGroup, setAgeGroup] = useState("30-39");
  const benchmarks: Record<string, { median: number; top10: number }> = {
    "20-29": { median: 150000000, top10: 750000000 },
    "30-39": { median: 650000000, top10: 2800000000 },
    "40-49": { median: 1800000000, top10: 7500000000 },
    "50+": { median: 3200000000, top10: 15000000000 },
  };

  const currentNetWorth = 920000000;
  const currentMedian = benchmarks[ageGroup].median;
  const currentTop10 = benchmarks[ageGroup].top10;

  const formatRupiah = (val: number) => "Rp " + val.toLocaleString("id-ID");

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-accent rounded-xl text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Benchmark Net Worth vs Demografi</h1>
            <p className="text-xs text-muted-foreground">Posisi Kekayaan Bersih Anda Dibandingkan Rata-rata Kelompok Usia</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        <div className="flex items-center gap-3 bg-card border border-border p-4 rounded-2xl">
          <span className="text-xs text-muted-foreground font-semibold">Pilih Rentang Usia:</span>
          <div className="flex gap-2">
            {["20-29", "30-39", "40-49", "50+"].map((grp) => (
              <button
                key={grp}
                onClick={() => setAgeGroup(grp)}
                className={"px-3 py-1.5 rounded-xl text-xs font-bold transition-all " + (ageGroup === grp ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}
              >
                {grp} Tahun
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-border bg-card">
            <span className="text-xs text-muted-foreground">Net Worth Anda Saat Ini</span>
            <div className="text-2xl font-black text-primary mt-1">{formatRupiah(currentNetWorth)}</div>
            <span className="text-[11px] text-emerald-600 font-semibold">&gt; Di atas median demografi</span>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-card">
            <span className="text-xs text-muted-foreground">Median Kelompok Usia {ageGroup}</span>
            <div className="text-xl font-bold text-foreground mt-1">{formatRupiah(currentMedian)}</div>
            <span className="text-[11px] text-muted-foreground">Standar 50% populasi</span>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-card">
            <span className="text-xs text-muted-foreground">Batas Top 10% Usia {ageGroup}</span>
            <div className="text-xl font-bold text-amber-500 mt-1">{formatRupiah(currentTop10)}</div>
            <span className="text-[11px] text-muted-foreground">High Net Worth Tier</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 7. Family Constitution & Charter Builder
// ==========================================
export function FamilyConstitutionBuilderView({ onBack }: { onBack: () => void }) {
  const [sections] = useState([
    { title: "Nilai Inti & Filosofi Keluarga", desc: "Integritas moral, etos kerja, kedermawanan sosial, dan keterbukaan komunikasi antar generasi." },
    { title: "Aturan Kepemilikan Bisnis & Saham", desc: "Saham bisnis keluarga hanya boleh dialihkan kepada keturunan sedarah atau buyback oleh trust fund." },
    { title: "Pendidikan & Dana Beasiswa Generasi", desc: "Penyediaan dukungan pembiayaan pendidikan tinggi hingga jenjang S2 untuk seluruh cucu yang berprestasi." },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-accent rounded-xl text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Family Constitution & Charter Builder</h1>
            <p className="text-xs text-muted-foreground">Pedoman Tata Kelola Aset Keluarga & Suksesi Antar Generasi</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        <div className="space-y-4">
          {sections.map((s, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <div className="flex items-center gap-2">
                <span className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <h4 className="font-bold text-foreground text-sm">{s.title}</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-8">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 8. Digital Asset Inheritance (Akses Akun/Kripto)
// ==========================================
export function DigitalInheritanceManagerView({ onBack }: { onBack: () => void }) {
  const [keys] = useState([
    { id: 1, label: "Cold Storage Ledger Kripto", type: "Hardware Wallet", custodian: "Safe Deposit Box Bank Mandiri", status: "Terdokumentasi" },
    { id: 2, label: "Akun Email Master & Cloud 2FA", type: "Master Credentials", custodian: "Notaris Keluarga", status: "Terkunci Wasiat" },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-accent rounded-xl text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Digital Asset Inheritance</h1>
            <p className="text-xs text-muted-foreground">Protokol Penyerahan Kunci Aset Kripto & Kredensial Digital Kepada Ahli Waris</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-xs text-muted-foreground">
          ⚠️ <strong>Catatan Keamanan:</strong> Jangan pernah menyimpan seed phrase atau password mentah di aplikasi ini. Simpan hanya instruksi lokasi fisik (SDB/Notaris).
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {keys.map((k) => (
            <div key={k.id} className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-foreground text-sm">{k.label}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                  {k.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Tipe: {k.type}</p>
              <div className="text-xs font-semibold text-primary pt-2 border-t border-border">
                Penyimpanan: {k.custodian}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
