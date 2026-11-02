import { useState } from "react";
import {
  ArrowLeft,
  Briefcase,
} from "lucide-react";

// ==========================================
// 1. Split Bill & Pengeluaran Bersama
// ==========================================
export function SplitBillView({ onBack }: { onBack: () => void }) {
  const [totalBill, setTotalBill] = useState(750000);
  const [tipTaxPct, setTipTaxPct] = useState(15);
  const [members, setMembers] = useState(["Saya", "Budi", "Siti", "Dimas"]);

  const grandTotal = totalBill * (1 + tipTaxPct / 100);
  const perPerson = Math.round(grandTotal / (members.length || 1));

  const formatRupiah = (val: number) => "Rp " + val.toLocaleString("id-ID");

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-accent rounded-xl text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Split Bill & Pengeluaran Bersama</h1>
            <p className="text-xs text-muted-foreground">Kalkulator Pembagian Tagihan Rombongan / Keluarga</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-card border border-border p-5 rounded-2xl">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Total Tagihan Awal</label>
            <input
              type="number"
              value={totalBill}
              onChange={(e) => setTotalBill(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm font-bold"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Pajak + Service (%)</label>
            <input
              type="number"
              value={tipTaxPct}
              onChange={(e) => setTipTaxPct(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm font-bold"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Jumlah Orang</label>
            <input
              type="number"
              value={members.length}
              onChange={(e) => {
                const count = Math.max(1, Number(e.target.value));
                setMembers(Array.from({ length: count }, (_, i) => i === 0 ? "Saya" : "Teman " + i));
              }}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm font-bold"
            />
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card shadow-xs text-center space-y-2">
          <span className="text-xs text-muted-foreground">Bagian yang Harus Dibayar per Orang</span>
          <div className="text-3xl font-black text-primary">{formatRupiah(perPerson)}</div>
          <p className="text-xs text-muted-foreground">Total Keseluruhan: {formatRupiah(Math.round(grandTotal))}</p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. Financial Literacy Hub
// ==========================================
export function FinancialLiteracyHubView({ onBack }: { onBack: () => void }) {
  const [courses] = useState([
    { id: 1, title: "Dasar Pengelolaan Arus Kas Pribadi", duration: "15 Menit", level: "Pemula", progress: "100%", tag: "Flow" },
    { id: 2, title: "Memahami Instrumen SBN & Obligasi Negara", duration: "25 Menit", level: "Menengah", progress: "60%", tag: "Grow" },
    { id: 3, title: "Struktur Hukum Waris & Wasiat di Indonesia", duration: "30 Menit", level: "Lanjutan", progress: "20%", tag: "Legacy" },
    { id: 4, title: "Strategi Proteksi Asuransi Murni vs Unit Link", duration: "20 Menit", level: "Pemula", progress: "80%", tag: "Surety" },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-accent rounded-xl text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Financial Literacy Hub</h1>
            <p className="text-xs text-muted-foreground">Modul & Kurikulum Edukasi Keuangan Personal Menyeluruh</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((c) => (
            <div key={c.id} className="p-5 rounded-2xl border border-border bg-card space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {c.tag} · {c.level}
                </span>
                <span className="text-xs text-muted-foreground">{c.duration}</span>
              </div>
              <h4 className="font-bold text-foreground text-sm">{c.title}</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progres Belajar</span>
                  <span className="font-bold text-foreground">{c.progress}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: c.progress }} />
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
// 3. Allowance & Edukasi Finansial Anak
// ==========================================
export function KidsAllowanceEduView({ onBack }: { onBack: () => void }) {
  const [kids] = useState([
    { id: 1, name: "Ali (10 Tahun)", allowance: 100000, spend: 50000, save: 40000, give: 10000, choresDone: 8 },
    { id: 2, name: "Zahra (7 Tahun)", allowance: 50000, spend: 25000, save: 20000, give: 5000, choresDone: 6 },
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
            <h1 className="text-lg font-bold text-foreground">Allowance & Edukasi Finansial Anak</h1>
            <p className="text-xs text-muted-foreground">Metode 3 Toples (Spend, Save, Give) & Tugas Mandiri Anak</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kids.map((k) => (
            <div key={k.id} className="p-5 rounded-2xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-foreground">{k.name}</h4>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                  Uang Saku: {formatRupiah(k.allowance)}/mgg
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-accent/40">
                  <span className="text-muted-foreground block text-[10px]">Spend (Jajan)</span>
                  <span className="font-bold text-foreground mt-0.5 block">{formatRupiah(k.spend)}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-accent/40">
                  <span className="text-muted-foreground block text-[10px]">Save (Nabung)</span>
                  <span className="font-bold text-emerald-600 mt-0.5 block">{formatRupiah(k.save)}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-accent/40">
                  <span className="text-muted-foreground block text-[10px]">Give (Amal)</span>
                  <span className="font-bold text-primary mt-0.5 block">{formatRupiah(k.give)}</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground flex justify-between items-center border-t border-border pt-3">
                <span>Tugas Rumah Terselesaikan:</span>
                <span className="font-bold text-foreground">{k.choresDone} Tugas Minggu Ini</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. Second Opinion & Konsultasi Advisor Warisan
// ==========================================
export function AdvisorConsultationGuideView({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-accent rounded-xl text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Konsultasi Advisor & Second Opinion</h1>
            <p className="text-xs text-muted-foreground">Panduan Persiapan Diskusi dengan Certified Financial Planner (CFP) & Notaris</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-4">
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Briefcase size={18} className="text-primary" /> Checklist Dokumen Pra-Konsultasi
          </h3>
          <ul className="text-xs text-muted-foreground space-y-2.5 list-disc list-inside">
            <li>Rekapitulasi Neraca Aset & Liabilitas yang telah diexport dari menu Laporan Keuangan.</li>
            <li>Salinan polis asuransi jiwa aktif beserta nama penerima manfaat yang tercantum.</li>
            <li>Daftar seluruh ahli waris sah berdasarkan hukum perdata atau hukum syariah.</li>
            <li>Draft surat wasiat digital dan inventaris barang berharga keluarga.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
