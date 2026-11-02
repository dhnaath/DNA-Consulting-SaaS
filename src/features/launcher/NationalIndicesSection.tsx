import React, { useState, useMemo } from 'react';
import {
  Download,
  Copy,
  X,
  CheckCircle2,
  Table as TableIcon,
  LayoutGrid,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  HeartPulse,
  Scale,
  Shield,
  Lightbulb,
  Award,
  Layers,
  BarChart3,
  CalendarClock,
  Globe2,
  Info,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  NATIONAL_INDICES_DATA,
  NationalIndexItem,
} from '@/data/nationalIndicesData';

export const NATIONAL_INDEX_PORTAL_LINKS: Record<string, string> = {
  ipm: 'https://www.bps.go.id/id/statistics/subject/indeks-pembangunan-manusia',
  gini: 'https://www.bps.go.id/id/statistics/subject/gini-ratio',
  kemiskinan: 'https://www.bps.go.id/id/statistics/subject/kemiskinan-dan-ketimpangan',
  cpi: 'https://www.ti.or.id',
  wgi: 'https://info.worldbank.org/governance/wgi/',
  gii: 'https://www.wipo.int/global_innovation_index/en/',
  gci: 'https://www.weforum.org/reports/global-competitiveness-report-2019',
  sdg: 'https://dashboards.sdgindex.org/profiles/indonesia',
  idu: 'https://kemenpppa.go.id',
  ikp: 'https://badanpangan.go.id',
};

interface NationalIndicesSectionProps {
  isEmbedded?: boolean;
  hideHeaderBanner?: boolean;
}

export function NationalIndicesSection({ isEmbedded = false, hideHeaderBanner = false }: NationalIndicesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedItem, setSelectedItem] = useState<NationalIndexItem | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const categories = useMemo(() => {
    return [
      'Semua',
      'Kesejahteraan & Kualitas Hidup',
      'Keadilan & Kesetaraan',
      'Tata Kelola & Keamanan',
      'Inovasi & Daya Saing',
    ];
  }, []);

  const filteredData = useMemo(() => {
    return NATIONAL_INDICES_DATA.filter((item) => {
      const matchCat =
        selectedCategory === 'Semua' || item.kategori === selectedCategory;
      return matchCat;
    });
  }, [selectedCategory]);

  const triggerNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 2800);
  };

  const handleDownloadCsv = () => {
    const headers = [
      'No',
      'Nama Indeks',
      'Singkatan',
      'Kategori',
      'Skor Terkini',
      'Skala',
      'Status Kategori',
      'Tren',
      'Perubahan YoY',
      'Frekuensi Rilis',
      'Jadwal Rilis',
      'Sumber Resmi',
      'Target RPJMN',
    ];

    const rows = filteredData.map((d) => [
      d.number,
      `"${d.nama}"`,
      `"${d.singkatan}"`,
      `"${d.kategori}"`,
      `"${d.formatNilai}"`,
      `"${d.skala}"`,
      `"${d.statusKategori}"`,
      `"${d.tren.toUpperCase()}"`,
      `"${d.perubahanYoY}"`,
      `"${d.frekuensiRilis}"`,
      `"${d.jadwalBulanRilis}"`,
      `"${d.sumberResmi}"`,
      `"${d.targetRPJMN}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `10_Indeks_Pembangunan_Nasional_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotify('File CSV 10 Indeks Pembangunan berhasil diunduh!');
  };

  const handleCopySummary = () => {
    const lines = filteredData.map(
      (item) =>
        `${item.number}. ${item.nama}: ${item.formatNilai} (${item.statusKategori}) [Rentang: ${item.frekuensiRilis}] - Sumber: ${item.sumberResmi}`
    );
    const summaryText =
      `RINGKASAN 10 INDEKS PEMBANGUNAN & SOSIAL EKONOMI INDONESIA\n` +
      `Diperbarui: 2025/2026\n\n` +
      lines.join('\n');
    navigator.clipboard.writeText(summaryText);
    triggerNotify('Ringkasan 10 Indeks disalin ke clipboard!');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Kesejahteraan & Kualitas Hidup':
        return <HeartPulse className="size-4 text-emerald-500" />;
      case 'Keadilan & Kesetaraan':
        return <Scale className="size-4 text-blue-500" />;
      case 'Tata Kelola & Keamanan':
        return <Shield className="size-4 text-amber-500" />;
      case 'Inovasi & Daya Saing':
        return <Lightbulb className="size-4 text-purple-500" />;
      default:
        return <Layers className="size-4 text-primary" />;
    }
  };

  const getScoreColor = (tren: 'naik' | 'turun' | 'stabil') => {
    if (tren === 'naik') return 'text-emerald-600 dark:text-emerald-400';
    if (tren === 'turun') return 'text-rose-600 dark:text-rose-400';
    return 'text-amber-600 dark:text-amber-400';
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-xl border border-primary/20 animate-in slide-in-from-top-3 fade-in duration-200">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Banner atau KPI Langsung */}
      {hideHeaderBanner ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="rounded-2xl border border-border/80 bg-card p-3.5 sm:p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Total Indeks</span>
              <Award className="size-4 text-primary" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground mt-1.5">10 Indikator</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Sosial, ekonomi & institusi</p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-3.5 sm:p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">IPM Indonesia</span>
              <TrendingUp className="size-4 text-emerald-500" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1.5">
              74.39
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Status Tinggi (+0.84% YoY)</p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-3.5 sm:p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Inovasi Global (GII)</span>
              <Sparkles className="size-4 text-purple-500" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1.5">
              #54 Dunia
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Naik +7 tingkat (WIPO)</p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-3.5 sm:p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Tantangan Kritis</span>
              <ShieldAlert className="size-4 text-rose-500" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1.5">
              CPI: 34 / 100
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Perlu akselerasi penegakan hukum</p>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/95 to-primary/5 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-primary/10 text-primary border border-primary/20">
                  <BarChart3 className="size-3.5" />
                  DASHBOARD SOSIAL-EKONOMI MAKRO
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  <Globe2 className="size-3" />
                  Benchmark Global & Regional ASEAN
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                10 Indeks Pembangunan & Kesejahteraan Nasional
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pemantauan komprehensif 10 indikator strategis kualitas hidup, keadilan sosial, tata kelola, inovasi, dan modal manusia Indonesia menuju Indonesia Emas 2045.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={handleCopySummary}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <Copy className="size-3.5" />
                Salin Ringkasan
              </button>
              <button
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <Download className="size-3.5" />
                Unduh CSV
              </button>
            </div>
          </div>

          {/* 4 Kartu KPI Ringkas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-border/60">
            <div className="rounded-2xl border border-border/60 bg-background/60 backdrop-blur-xs p-3.5 sm:p-4">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Total Indeks</span>
                <Award className="size-4 text-primary" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-foreground mt-1.5">10 Indikator</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Sosial, ekonomi & institusi</p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/60 backdrop-blur-xs p-3.5 sm:p-4">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">IPM Indonesia</span>
                <TrendingUp className="size-4 text-emerald-500" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1.5">
                74.39
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Status Tinggi (+0.84% YoY)</p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/60 backdrop-blur-xs p-3.5 sm:p-4">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Inovasi Global (GII)</span>
                <Sparkles className="size-4 text-purple-500" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1.5">
                #54 Dunia
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Naik +7 tingkat (WIPO)</p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/60 backdrop-blur-xs p-3.5 sm:p-4">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Tantangan Kritis</span>
                <ShieldAlert className="size-4 text-rose-500" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1.5">
                CPI: 34 / 100
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Perlu akselerasi penegakan hukum</p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Kategori & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count =
              cat === 'Semua'
                ? NATIONAL_INDICES_DATA.length
                : NATIONAL_INDICES_DATA.filter((i) => i.kategori === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 border',
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary shadow-xs font-semibold'
                    : 'bg-card border-border/80 text-muted-foreground hover:text-foreground hover:border-border'
                )}
              >
                {cat !== 'Semua' && getCategoryIcon(cat)}
                <span>{cat}</span>
                <span
                  className={cn(
                    'px-1.5 py-0.2 rounded-full text-[10px] font-bold',
                    isSelected
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Switcher */}
        <div className="flex items-center self-end sm:self-auto gap-1 p-1 bg-muted/60 rounded-xl border border-border/60 shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer',
              viewMode === 'grid'
                ? 'bg-card text-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
            title="Tampilan Grid Kartu"
          >
            <LayoutGrid className="size-3.5" />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer',
              viewMode === 'table'
                ? 'bg-card text-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
            title="Tampilan Tabel Analitis"
          >
            <TableIcon className="size-3.5" />
            <span>Tabel</span>
          </button>
        </div>
      </div>

      {/* Main View: Grid vs Table */}
      {filteredData.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card/50">
          <Layers className="size-8 mx-auto text-muted-foreground/60 mb-3" />
          <p className="text-sm font-semibold text-foreground">Tidak ada indeks yang cocok</p>
          <p className="text-xs text-muted-foreground mt-1">
            Pilih kategori &quot;Semua&quot; untuk menampilkan seluruh indeks.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {filteredData.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden p-5"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-4">
                {/* Header row: Number badge, category & trend */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-xl bg-primary/10 text-primary text-xs font-extrabold shrink-0">
                      #{item.number}
                    </span>
                    <div>
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                        {item.kategori}
                      </span>
                    </div>
                  </div>

                  <span
                    className={cn(
                      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border shrink-0',
                      item.tren === 'naik'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : item.tren === 'turun'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    )}
                  >
                    {item.tren === 'naik' && <TrendingUp className="size-3" />}
                    {item.tren === 'turun' && <TrendingDown className="size-3" />}
                    {item.tren === 'stabil' && <Minus className="size-3" />}
                    {item.perubahanYoY}
                  </span>
                </div>

                {/* Title & Acronym */}
                <div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {item.nama}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                    {item.namaInternasional}
                  </p>
                </div>

                {/* Score Big Display */}
                <div className="rounded-xl bg-muted/40 p-3.5 border border-border/50 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-muted-foreground font-medium block">
                      Capaian Terkini ({item.tahunRilis})
                    </span>
                    <span className="text-2xl font-black tracking-tight text-foreground">
                      {item.formatNilai}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-muted-foreground font-medium block">
                      Status Klasifikasi
                    </span>
                    <span className="text-xs font-bold text-primary">
                      {item.statusKategori}
                    </span>
                  </div>
                </div>

                {/* Release Cadence & Schedule Pill */}
                <div className="flex items-center justify-between text-[11px] px-3 py-1.5 rounded-xl bg-muted/40 border border-border/50 text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-semibold text-foreground">
                    <CalendarClock className="size-3 text-primary shrink-0" />
                    {item.frekuensiRilis}
                  </span>
                  <span className="truncate max-w-[140px] text-[10px] text-muted-foreground">
                    {item.jadwalBulanRilis.split('(')[0]}
                  </span>
                </div>

                {/* Brief Summary */}
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {item.ringkasan}
                </p>

                {/* Preview 2 Pillars */}
                <div className="space-y-1.5 pt-2 border-t border-border/40">
                  <span className="text-[11px] font-semibold text-foreground/80 block">
                    Pilar & Komponen Kunci:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {item.pilarPenyusun.slice(0, 2).map((p, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg bg-background p-2 border border-border/50 text-[11px]"
                      >
                        <span className="text-muted-foreground font-medium truncate block">
                          {p.name.split('(')[0]}
                        </span>
                        <span className="font-bold text-foreground truncate block">
                          {p.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Source & Button */}
              <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between gap-2">
                <span className="text-[11px] text-muted-foreground truncate max-w-[55%]">
                  Sumber: {item.sumberResmi}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {NATIONAL_INDEX_PORTAL_LINKS[item.id] && (
                    <a
                      href={NATIONAL_INDEX_PORTAL_LINKS[item.id]}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground text-foreground text-[11px] font-semibold transition-colors"
                      title={`Direct Link Portal Resmi: ${item.sumberResmi}`}
                    >
                      <span>Portal</span>
                      <ExternalLink className="size-3" />
                    </a>
                  )}
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground text-xs font-bold transition-colors">
                    Detail <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Indeks & Nama Internasional</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Skor / Nilai Terkini</th>
                  <th className="py-3 px-4">Status & Skala</th>
                  <th className="py-3 px-4">Tren YoY</th>
                  <th className="py-3 px-4">Rentang Waktu / Rilis</th>
                  <th className="py-3 px-4">Sumber Lembaga</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredData.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="hover:bg-muted/30 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 text-center font-bold text-primary">
                      #{item.number}
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {item.nama}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {item.namaInternasional} ({item.singkatan})
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted text-foreground text-[11px] font-medium">
                        {getCategoryIcon(item.kategori)}
                        {item.kategori}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-sm text-foreground">
                      {item.formatNilai}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-primary block">
                        {item.statusKategori}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Skala: {item.skala}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 font-semibold text-[11px]',
                          getScoreColor(item.tren)
                        )}
                      >
                        {item.tren === 'naik' && <TrendingUp className="size-3" />}
                        {item.tren === 'turun' && <TrendingDown className="size-3" />}
                        {item.tren === 'stabil' && <Minus className="size-3" />}
                        {item.perubahanYoY}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-foreground text-[11px] block">
                        {item.frekuensiRilis}
                      </span>
                      <span className="text-[10px] text-muted-foreground block truncate max-w-[160px]">
                        {item.jadwalBulanRilis}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground text-[11px] max-w-[200px] truncate">
                      {item.sumberResmi}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {NATIONAL_INDEX_PORTAL_LINKS[item.id] && (
                          <a
                            href={NATIONAL_INDEX_PORTAL_LINKS[item.id]}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-2 py-1 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground text-foreground text-[10px] font-semibold transition-colors inline-flex items-center gap-1"
                            title={`Direct Link Portal Resmi: ${item.sumberResmi}`}
                          >
                            <span>Portal</span>
                            <ExternalLink className="size-3" />
                          </a>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                          }}
                          className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground transition-all cursor-pointer"
                          title="Buka Detail"
                        >
                          <ArrowUpRight className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Detail Interaktif */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-card rounded-3xl max-w-3xl w-full shadow-2xl border border-border flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-border bg-gradient-to-r from-muted/40 via-card to-card flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-xl bg-primary text-primary-foreground text-xs font-black">
                    #{selectedItem.number}
                  </span>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    {selectedItem.kategori}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                  {selectedItem.nama}
                </h2>
                <p className="text-xs text-muted-foreground font-medium">
                  {selectedItem.namaInternasional} • Sumber: {selectedItem.sumberResmi} ({selectedItem.tahunRilis})
                </p>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer shrink-0"
                aria-label="Tutup"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              {/* Capaian & Target Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
                  <span className="text-[11px] text-muted-foreground font-medium block">
                    Capaian Terkini ({selectedItem.tahunRilis})
                  </span>
                  <p className="text-2xl font-black text-foreground mt-1">
                    {selectedItem.formatNilai}
                  </p>
                  <p className="text-[11px] text-primary font-semibold mt-0.5">
                    {selectedItem.statusKategori}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
                  <span className="text-[11px] text-muted-foreground font-medium block">
                    Tren & Perubahan YoY
                  </span>
                  <p className={cn('text-lg font-bold mt-1 flex items-center gap-1.5', getScoreColor(selectedItem.tren))}>
                    {selectedItem.tren === 'naik' && <TrendingUp className="size-4" />}
                    {selectedItem.tren === 'turun' && <TrendingDown className="size-4" />}
                    {selectedItem.tren === 'stabil' && <Minus className="size-4" />}
                    {selectedItem.perubahanYoY}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Rentang Skala: {selectedItem.skala}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
                  <span className="text-[11px] text-primary font-bold block">
                    Target RPJMN / Visi 2045
                  </span>
                  <p className="text-xs font-bold text-foreground mt-1 leading-snug">
                    {selectedItem.targetRPJMN}
                  </p>
                </div>
              </div>

              {/* Informasi Rentang Waktu / Frekuensi Pembaruan */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-primary font-bold text-xs uppercase tracking-wider">
                    <CalendarClock className="size-3.5" />
                    Frekuensi & Rentang Waktu Rilis
                  </div>
                  <p className="text-sm font-extrabold text-foreground">
                    {selectedItem.frekuensiRilis}
                  </p>
                </div>
                <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-border/50">
                  <span className="text-[11px] text-muted-foreground block font-medium">Jadwal Siklus Pembaruan Resmi</span>
                  <span className="text-xs font-semibold text-foreground/90">{selectedItem.jadwalBulanRilis}</span>
                </div>
              </div>

              {/* Deskripsi Lengkap */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="size-3.5 text-primary" />
                  Konsep & Deskripsi Indeks
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed bg-card p-4 rounded-2xl border border-border">
                  {selectedItem.deskripsiLengkap}
                </p>
              </div>

              {/* Pilar & Komponen Penyusun */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="size-3.5 text-primary" />
                  Pilar & Komponen Metodologi Penyusun
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedItem.pilarPenyusun.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-muted/30 border border-border/60 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground text-xs">{p.name}</span>
                        {p.weight && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                            {p.weight}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-extrabold text-primary">{p.value}</p>
                      <p className="text-[11px] text-muted-foreground">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benchmark Regional ASEAN */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Globe2 className="size-3.5 text-primary" />
                  Benchmark Komparasi Regional ASEAN
                </h4>
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                        <th className="py-2.5 px-4 font-semibold">Negara</th>
                        <th className="py-2.5 px-4 font-semibold">Nilai / Skor</th>
                        <th className="py-2.5 px-4 font-semibold">Peringkat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {selectedItem.benchmarkASEAN.map((bm, idx) => {
                        const isIndo = bm.country === 'Indonesia';
                        return (
                          <tr
                            key={idx}
                            className={cn(
                              'transition-colors',
                              isIndo ? 'bg-primary/10 font-bold' : 'hover:bg-muted/20'
                            )}
                          >
                            <td className="py-2.5 px-4 flex items-center gap-2">
                              <span>{bm.flag}</span>
                              <span className={isIndo ? 'text-primary' : 'text-foreground'}>
                                {bm.country} {isIndo && '(Nasional)'}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-foreground">{bm.value}</td>
                            <td className="py-2.5 px-4 text-muted-foreground">
                              {bm.rank ? `#${bm.rank} Dunia` : '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tantangan & Rekomendasi Kebijakan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2">
                  <h5 className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert className="size-3.5" />
                    Tantangan & Hambatan Utama
                  </h5>
                  <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
                    {selectedItem.tantanganUtama.map((t, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                  <h5 className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5" />
                    Rekomendasi Kebijakan Strategis
                  </h5>
                  <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
                    {selectedItem.rekomendasiStrategis.map((r, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between gap-3">
              <span className="text-[11px] text-muted-foreground">
                Data resmi dihimpun dari publikasi BPS, UNDP, WHO, Transparency Intl & WIPO
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const text = `${selectedItem.nama} (${selectedItem.singkatan}): ${selectedItem.formatNilai} [${selectedItem.statusKategori}]. Target RPJMN: ${selectedItem.targetRPJMN}. Sumber: ${selectedItem.sumberResmi}`;
                    navigator.clipboard.writeText(text);
                    triggerNotify('Rincian indeks disalin ke clipboard!');
                  }}
                  className="px-3.5 py-2 rounded-xl border border-border bg-background text-foreground text-xs font-semibold hover:bg-muted transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Copy className="size-3.5" />
                  Salin Rincian
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer shadow-2xs"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
