import { useState } from "react";
import {
  Compass,
  Filter,
} from "lucide-react";

interface OutwardSignal {
  id: string;
  domain: "Makro Ekonomi" | "Industri & Regulasi" | "Kompetisi" | "Sentimen Pasar";
  title: string;
  impactLevel: "Signifikan" | "Moderat" | "Rendah";
  sentiment: "Positif" | "Netral" | "Waspada";
  source: string;
  summary: string;
}

export function OutwardView() {
  const [selectedDomain, setSelectedDomain] = useState<string>("Semua");
  const [signals] = useState<OutwardSignal[]>([
    {
      id: "out-1",
      domain: "Industri & Regulasi",
      title: "Kebijakan Harmonisasi Pajak & Kepatuhan Transaksi Digital",
      impactLevel: "Signifikan",
      sentiment: "Netral",
      source: "Kementerian Keuangan",
      summary: "Pemberlakuan regulasi pelaporan pajak real-time untuk transaksi e-commerce dan korporasi jasa.",
    },
    {
      id: "out-2",
      domain: "Makro Ekonomi",
      title: "Tren Suku Bunga Acuan & Likuiditas Pembiayaan Komersial",
      impactLevel: "Signifikan",
      sentiment: "Positif",
      source: "Bank Sentral",
      summary: "Stabilitas nilai tukar dan suku bunga akomodatif mendorong minat ekspansi belanja modal korporasi.",
    },
    {
      id: "out-3",
      domain: "Sentimen Pasar",
      title: "Peningkatan Minat Instrumen Investasi Syariah & ESG",
      impactLevel: "Moderat",
      sentiment: "Positif",
      source: "Otoritas Jasa Keuangan",
      summary: "Permintaan advisory keuangan berbasis syariah dan tata kelola berkelanjutan melonjak 40% YoY.",
    },
    {
      id: "out-4",
      domain: "Kompetisi",
      title: "Konsolidasi Firma Advisory & Adopsi Solusi Otomasi",
      impactLevel: "Moderat",
      sentiment: "Waspada",
      source: "Market Intelligence",
      summary: "Pemain global mulai meluncurkan konsultasi virtual mandiri untuk segmen UMKM.",
    },
    {
      id: "out-5",
      domain: "Makro Ekonomi",
      title: "Perubahan Rantai Pasok Global & Logistik Maritim Regional",
      impactLevel: "Rendah",
      sentiment: "Netral",
      source: "Trade Logistics Council",
      summary: "Penyesuaian biaya kontainer internasional berdampak minim terhadap portofolio klien lokal.",
    },
  ]);

  const filtered =
    selectedDomain === "Semua"
      ? signals
      : signals.filter((s) => s.domain === selectedDomain);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-[20px] bg-card border border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <Compass className="size-4 text-foreground" />
            <span>Organization-Optimizing · Pemantauan Dinamika Eksternal</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Outward Radar
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Menangkap sinyal pasar eksternal, perubahan regulasi industri, iklim ekonomi makro, serta pergerakan lanskap kompetitif di luar organisasi.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-[20px] bg-muted/60 border border-border text-center">
            <span className="text-xs text-muted-foreground block">Sentimen Eksternal</span>
            <span className="text-xl font-bold text-foreground">82.4%</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Sinyal Radar Aktif</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">12 Sinyal</span>
            <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full font-medium">
              Aktif
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">5 sinyal prioritas tinggi</span>
        </div>

        <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Iklim Makro Ekonomi</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">Kondusif</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-medium">
              Ekspansif
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">Dukungan likuiditas pasar</span>
        </div>

        <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Paparan Risiko Regulasi</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">Terkendali</span>
            <span className="text-xs text-foreground bg-muted px-2.5 py-1 rounded-full font-medium">
              Mitigasi Siap
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">Adaptasi kepatuhan tepat waktu</span>
        </div>

        <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Peluang Kolaborasi Luar</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">7 Kemitraan</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-medium">
              Terbuka
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">Pipelines ekspansi eksternal</span>
        </div>
      </div>

      {/* Signals List */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Domain Radar Luar:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["Semua", "Makro Ekonomi", "Industri & Regulasi", "Kompetisi", "Sentimen Pasar"].map(
              (dom) => (
                <button
                  key={dom}
                  onClick={() => setSelectedDomain(dom)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    selectedDomain === dom
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {dom}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-[20px] bg-card border border-border hover:border-foreground/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-muted text-foreground">
                    {s.domain}
                  </span>
                  <span className="text-xs text-muted-foreground">Sumber: {s.source}</span>
                </div>
                <h4 className="text-sm font-semibold text-foreground">{s.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.summary}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                    Dampak
                  </span>
                  <span className="text-xs font-semibold text-foreground">{s.impactLevel}</span>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    s.sentiment === "Positif"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : s.sentiment === "Waspada"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  Sentimen: {s.sentiment}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
