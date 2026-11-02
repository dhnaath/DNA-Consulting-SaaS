import React, { useState, useMemo, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { 
  Search, Download, TrendingUp, TrendingDown, 
  ShieldAlert, Database, Copy, X, 
  Building2, CheckCircle2, Table as TableIcon, LayoutGrid,
  ArrowUpRight, ArrowDownRight, Briefcase, CalendarClock, Package, 
  Layers, ExternalLink, Coins, ArrowRight, Globe, Vault, Wallet, Key, Landmark,
  Wheat, Flame, Trees, ShoppingBag, HeartPulse, HardHat, Droplets,
  BarChart3, Award, Sparkles, Scale, Shield, Lightbulb, ChevronDown, ArrowUpDown
} from 'lucide-react';
import { AppShell } from '@/app/app-shell';
import { ShellHeader } from '@/app/shell-header';
import { Panel, Pill, Kosong } from '@/app/ui-bits';
import { cn } from '@/lib/utils';
import { MOCK_COMMODITIES, INDICES_DATA, IndexKey } from '@/features/syariah/lib/data';
import { Commodity } from '@/features/syariah/types';
import { 
  COMMODITY_DATA, 
  COMMODITY_SOURCES, 
  UPDATE_CADENCES, 
  PRICING_TYPES,
  CommodityItem,
  UpdateCadence,
  PricingType
} from '../commodityData';
import { NationalIndicesSection } from '@/features/launcher/NationalIndicesSection';
import { NATIONAL_INDICES_DATA } from '@/data/nationalIndicesData';
import { 
  MACRO_PRICE_INDICES_DATA, 
  MacroPriceIndexItem 
} from '@/data/priceIndicesData';

interface CategoryMeta {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
  bgLight: string;
  desc: string;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  'Semua': {
    icon: Layers,
    color: 'text-primary',
    bgLight: 'bg-primary/10',
    desc: 'Seluruh 100 komoditas acuan nasional lintas sektor'
  },
  'Pasar Keuangan & Global': {
    icon: Coins,
    color: 'text-amber-500',
    bgLight: 'bg-amber-500/10',
    desc: 'Spot emas, perak, crude oil & bursa komoditas internasional'
  },
  'Pangan Pokok Lokal': {
    icon: Wheat,
    color: 'text-emerald-500',
    bgLight: 'bg-emerald-500/10',
    desc: 'Beras premium, beras medium, jagung pipil, cabai & bawang'
  },
  'Sembako & HET Kemendag': {
    icon: ShoppingBag,
    color: 'text-blue-500',
    bgLight: 'bg-blue-500/10',
    desc: 'Minyakita, minyak goreng kemasan, gula konsumsi, daging sapi & telur'
  },
  'Energi & Bahan Bakar': {
    icon: Flame,
    color: 'text-rose-500',
    bgLight: 'bg-rose-500/10',
    desc: 'Pertalite, Solar subsidi, LPG 3kg, Pertamax, Dex & avtur'
  },
  'Pertanian & Properti Rakyat': {
    icon: Trees,
    color: 'text-lime-600 dark:text-lime-400',
    bgLight: 'bg-lime-500/10',
    desc: 'CPO, karet alam, kopi robusta, kakao, cengkeh & pupuk subsidi'
  },
  'IHK, Sandang & Material Bangunan': {
    icon: Package,
    color: 'text-zinc-500 dark:text-zinc-400',
    bgLight: 'bg-zinc-500/10',
    desc: 'Semen, besi beton SNI, aspal, kayu lapis, keramik & bahan bangunan'
  },
  'Kesehatan & Obat Generik': {
    icon: HeartPulse,
    color: 'text-red-500',
    bgLight: 'bg-red-500/10',
    desc: 'Paracetamol, Amoxicillin, vitamin, obat esensial & plafon e-Katalog'
  },
  'Konsumen & Otomotif': {
    icon: Briefcase,
    color: 'text-purple-500',
    bgLight: 'bg-purple-500/10',
    desc: 'Pakan unggas, garam konsumsi, sabun cuci, ban motor & suku cadang'
  },
  'Fasilitas Utilitas Publik': {
    icon: Droplets,
    color: 'text-cyan-500',
    bgLight: 'bg-cyan-500/10',
    desc: 'Tarif listrik PLN, air PDAM, gas bumi PGN & tarif tol Trans Jawa'
  },
  'Tenaga Kerja & Jasa Konstruksi': {
    icon: HardHat,
    color: 'text-orange-500',
    bgLight: 'bg-orange-500/10',
    desc: 'Standar upah tukang, mandor & indeks biaya konstruksi KemenPUPR'
  }
};

interface NavigatorCardItem {
  id: string;
  label: string;
  badge: string;
  subtext: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
  bgLight: string;
  borderActive: string;
  ringActive: string;
}

export interface DirectLinkItem {
  id: string;
  title: string;
  category: 'Portal Resmi' | 'Aplikasi Terkait';
  url: string;
  isExternal: boolean;
  desc: string;
  badge: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
  bgLight: string;
}

export const LOGAM_MULIA_DIRECT_LINKS: DirectLinkItem[] = [
  {
    id: 'antam-logammulia',
    title: 'Antam Logam Mulia (UBPP Official)',
    category: 'Portal Resmi',
    url: 'https://www.logammulia.com/id',
    isExternal: true,
    desc: 'Katalog resmi pecahan emas batangan Antam, update harga buyback harian, dan butik LM se-Indonesia.',
    badge: 'Produsen Resmi BUMN',
    icon: Coins,
    color: 'text-amber-500',
    bgLight: 'bg-amber-500/10',
  },
  {
    id: 'pegadaian-emas',
    title: 'Pegadaian Tabungan Emas',
    category: 'Portal Resmi',
    url: 'https://www.pegadaian.co.id/produk/tabungan-emas',
    isExternal: true,
    desc: 'Investasi dan titipan emas batangan terjamin pemerintah, cetak fisik pecahan 1g hingga 100g.',
    badge: 'BUMN Pembiayaan & Emas',
    icon: Building2,
    color: 'text-emerald-500',
    bgLight: 'bg-emerald-500/10',
  },
  {
    id: 'lbma-spot',
    title: 'LBMA Precious Metals (London)',
    category: 'Portal Resmi',
    url: 'https://www.lbma.org.uk/prices-and-data/precious-metal-prices',
    isExternal: true,
    desc: 'London Bullion Market Association: patokan harga spot emas (XAU) dan perak (XAG) acuan dunia.',
    badge: 'Benchmark Global',
    icon: Scale,
    color: 'text-blue-500',
    bgLight: 'bg-blue-500/10',
  },
  {
    id: 'icdx-komoditi',
    title: 'ICDX Pasar Fisik Emas',
    category: 'Portal Resmi',
    url: 'https://www.icdx.co.id',
    isExternal: true,
    desc: 'Bursa komoditi berjangka Indonesia untuk transaksi perdagangan emas fisik & digital terdaftar Bappebti.',
    badge: 'Bursa Komoditi RI',
    icon: TrendingUp,
    color: 'text-indigo-500',
    bgLight: 'bg-indigo-500/10',
  },
  {
    id: 'tradingview-xau',
    title: 'TradingView XAU/USD (Spot Gold)',
    category: 'Portal Resmi',
    url: 'https://www.tradingview.com/symbols/XAUUSD/',
    isExternal: true,
    desc: 'Grafik candlestick live pergerakan harga emas dunia terhadap USD real-time 24 jam interaktif.',
    badge: 'Spot Emas Live',
    icon: BarChart3,
    color: 'text-amber-500',
    bgLight: 'bg-amber-500/10',
  },
  {
    id: 'tradingview-xag',
    title: 'TradingView XAG/USD (Spot Silver)',
    category: 'Portal Resmi',
    url: 'https://www.tradingview.com/symbols/XAGUSD/',
    isExternal: true,
    desc: 'Grafik teknikal live spot perak murni internasional terhadap USD dengan indikator teknikal lengkap.',
    badge: 'Spot Perak Live',
    icon: Sparkles,
    color: 'text-zinc-500',
    bgLight: 'bg-zinc-500/10',
  },
  {
    id: 'bappebti-ri',
    title: 'Bappebti Kemendag RI',
    category: 'Portal Resmi',
    url: 'https://bappebti.go.id',
    isExternal: true,
    desc: 'Badan Pengawas Perdagangan Berjangka Komoditi: regulasi resmi bursa fisik emas dan aset digital nasional.',
    badge: 'Regulator Pemerintah',
    icon: Shield,
    color: 'text-rose-500',
    bgLight: 'bg-rose-500/10',
  },
  {
    id: 'liquid-reserves-app',
    title: 'Cadangan Dana & Kas Likuid (Liquid Reserves)',
    category: 'Aplikasi Terkait',
    url: '/liquid-reserves',
    isExternal: false,
    desc: 'Modul alokasi cadangan likuiditas darurat, pemeliharaan simpanan emas fisik, dan kas siap pakai.',
    badge: 'Aplikasi Internal',
    icon: Vault,
    color: 'text-emerald-500',
    bgLight: 'bg-emerald-500/10',
  },
  {
    id: 'syariah-wadiah-app',
    title: 'Akad Wadiah Emas & Dinar (Penitipan Amanah)',
    category: 'Aplikasi Terkait',
    url: '/syariah/akad?app=wadiah',
    isExternal: false,
    desc: 'Protokol penitipan syariah murni aset dinar, dirham, dan batangan emas (Amanah/Dhamanah) bebas riba.',
    badge: 'Akad Muamalah',
    icon: Shield,
    color: 'text-violet-500',
    bgLight: 'bg-violet-500/10',
  },
  {
    id: 'zakat-maal-app',
    title: 'Kalkulator Zakat Maal & Nisab Emas',
    category: 'Aplikasi Terkait',
    url: '/zakat?app=maal',
    isExternal: false,
    desc: 'Perhitungan presisi zakat 2.5% simpanan batangan emas dan perak yang mencapai nisab 85g haul 1 tahun.',
    badge: 'Kalkulator Zakat',
    icon: Award,
    color: 'text-rose-500',
    bgLight: 'bg-rose-500/10',
  },
  {
    id: 'investasi-app',
    title: 'Portofolio Investasi & Multi-Aset',
    category: 'Aplikasi Terkait',
    url: '/investasi',
    isExternal: false,
    desc: 'Konsolidasi portofolio kepemilikan aset riil fisik, surat berharga, dan diversifikasi kekayaan.',
    badge: 'Portofolio Aset',
    icon: Briefcase,
    color: 'text-blue-500',
    bgLight: 'bg-blue-500/10',
  },
  {
    id: 'multi-wallet-app',
    title: 'Kas, Dompet & Multi-Wallet',
    category: 'Aplikasi Terkait',
    url: '/flow?tab=cat_kredit',
    isExternal: false,
    desc: 'Buku kas harian multi-wallet, saldo rekening fisik perbankan, dan pengawasan utang piutang.',
    badge: 'Buku Kas & Saldo',
    icon: Wallet,
    color: 'text-cyan-500',
    bgLight: 'bg-cyan-500/10',
  },
];

export const QUOTE_COMMODITY_DIRECT_LINKS: Record<string, {
  externalUrl: string;
  externalLabel: string;
  internalPath?: string;
  internalLabel?: string;
}> = {
  dinar: {
    externalUrl: 'https://www.logammulia.com/id',
    externalLabel: 'Antam Emas',
    internalPath: '/syariah/akad?app=wadiah',
    internalLabel: 'Akad Wadiah',
  },
  dirham: {
    externalUrl: 'https://www.pegadaian.co.id/produk/tabungan-emas',
    externalLabel: 'Pegadaian Emas',
    internalPath: '/liquid-reserves',
    internalLabel: 'Reserves',
  },
  gold_gram: {
    externalUrl: 'https://www.logammulia.com/id/harga-emas-hari-ini',
    externalLabel: 'Antam UBPP',
    internalPath: '/zakat?app=maal',
    internalLabel: 'Zakat Emas',
  },
  silver_gram: {
    externalUrl: 'https://www.lbma.org.uk/prices-and-data/precious-metal-prices',
    externalLabel: 'LBMA Spot',
    internalPath: '/liquid-reserves',
    internalLabel: 'Reserves',
  },
  issi: {
    externalUrl: 'https://www.idx.co.id/id/produk/indeks/indeks-syariah',
    externalLabel: 'IDX ISSI',
    internalPath: '/investasi',
    internalLabel: 'Investasi',
  },
  jii: {
    externalUrl: 'https://www.idx.co.id/id/produk/indeks/jii',
    externalLabel: 'IDX JII',
    internalPath: '/investasi',
    internalLabel: 'Investasi',
  },
  jii70: {
    externalUrl: 'https://www.idx.co.id/id/produk/indeks/jii70',
    externalLabel: 'IDX JII70',
    internalPath: '/investasi',
    internalLabel: 'Investasi',
  },
  djimi: {
    externalUrl: 'https://www.spglobal.com/spdji/en/indices/equity/dow-jones-islamic-market-index/',
    externalLabel: 'S&P DJIMI',
    internalPath: '/paper-securities',
    internalLabel: 'Securities',
  },
  msci: {
    externalUrl: 'https://www.msci.com/our-solutions/indexes/islamic-indexes',
    externalLabel: 'MSCI Islamic',
    internalPath: '/paper-securities',
    internalLabel: 'Securities',
  },
  sp500sh: {
    externalUrl: 'https://www.spglobal.com/spdji/en/indices/equity/sp-500-shariah-index/',
    externalLabel: 'S&P 500 Shariah',
    internalPath: '/paper-securities',
    internalLabel: 'Securities',
  },
  ihsg: {
    externalUrl: 'https://www.idx.co.id',
    externalLabel: 'IDX Composite',
    internalPath: '/paper-securities',
    internalLabel: 'Securities',
  },
  lq45: {
    externalUrl: 'https://www.idx.co.id/id/produk/indeks/lq45',
    externalLabel: 'IDX LQ45',
    internalPath: '/paper-securities',
    internalLabel: 'Securities',
  },
  idx30: {
    externalUrl: 'https://www.idx.co.id/id/produk/indeks/idx30',
    externalLabel: 'IDX 30',
    internalPath: '/paper-securities',
    internalLabel: 'Securities',
  },
};

const NAVIGATOR_CARDS: NavigatorCardItem[] = [
  {
    id: 'commodity_all',
    label: '100 Komoditas',
    badge: '100 Item',
    subtext: '10 Sektor Lengkap',
    icon: Layers,
    color: 'text-primary',
    bgLight: 'bg-primary/10',
    borderActive: 'border-primary',
    ringActive: 'ring-primary/20',
  },
  {
    id: 'national_indices',
    label: '10 Indeks Pembangunan',
    badge: '10 Indikator',
    subtext: 'Sosial, Ekonomi & RPJMN',
    icon: BarChart3,
    color: 'text-emerald-500',
    bgLight: 'bg-emerald-500/10',
    borderActive: 'border-emerald-500',
    ringActive: 'ring-emerald-500/20',
  },
  {
    id: 'indeks_harga_makro',
    label: 'Indeks Harga Makro',
    badge: '8 Indeks BPS & BI',
    subtext: 'IHK Inflasi, IHPB, NTP, IHPR, IBK',
    icon: Scale,
    color: 'text-violet-500',
    bgLight: 'bg-violet-500/10',
    borderActive: 'border-violet-500',
    ringActive: 'ring-violet-500/20',
  },
  {
    id: 'logam_mulia',
    label: 'Logam Mulia',
    badge: '12 Direct Link',
    subtext: 'Antam, LBMA, Reserves, Wadiah',
    icon: Coins,
    color: 'text-amber-500',
    bgLight: 'bg-amber-500/10',
    borderActive: 'border-amber-500',
    ringActive: 'ring-amber-500/20',
  },
  {
    id: 'indeks_global',
    label: 'Indeks Global & BEI',
    badge: 'IHSG & Global Link',
    subtext: 'IHSG, LQ45, IDX30, S&P 500',
    icon: TrendingUp,
    color: 'text-blue-500',
    bgLight: 'bg-blue-500/10',
    borderActive: 'border-blue-500',
    ringActive: 'ring-blue-500/20',
  },
  {
    id: 'saham_syariah',
    label: 'Saham Syariah (BEI)',
    badge: 'IDX Direct Link',
    subtext: 'Konstituen Saham Syariah IDX',
    icon: Building2,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgLight: 'bg-emerald-500/10',
    borderActive: 'border-emerald-500',
    ringActive: 'ring-emerald-500/20',
  },
  {
    id: 'Pangan Pokok Lokal',
    label: 'Pangan Pokok Lokal',
    badge: '10 Item',
    subtext: 'Beras, Jagung, Cabai, Bawang',
    icon: Wheat,
    color: 'text-emerald-500',
    bgLight: 'bg-emerald-500/10',
    borderActive: 'border-emerald-500',
    ringActive: 'ring-emerald-500/20',
  },
  {
    id: 'Sembako & HET Kemendag',
    label: 'Sembako & HET Gov',
    badge: '10 Item',
    subtext: 'Minyakita, Gula, Daging, Telur',
    icon: ShoppingBag,
    color: 'text-blue-500',
    bgLight: 'bg-blue-500/10',
    borderActive: 'border-blue-500',
    ringActive: 'ring-blue-500/20',
  },
  {
    id: 'Energi & Bahan Bakar',
    label: 'Energi & Bahan Bakar',
    badge: '10 Item',
    subtext: 'Pertalite, Solar, LPG 3kg, Dex',
    icon: Flame,
    color: 'text-rose-500',
    bgLight: 'bg-rose-500/10',
    borderActive: 'border-rose-500',
    ringActive: 'ring-rose-500/20',
  },
  {
    id: 'Pertanian & Properti Rakyat',
    label: 'Pertanian & Perkebunan',
    badge: '10 Item',
    subtext: 'CPO, Karet, Kopi, Kakao, Pupuk',
    icon: Trees,
    color: 'text-lime-600 dark:text-lime-400',
    bgLight: 'bg-lime-500/10',
    borderActive: 'border-lime-500',
    ringActive: 'ring-lime-500/20',
  },
  {
    id: 'IHK, Sandang & Material Bangunan',
    label: 'IHK & Material Bangunan',
    badge: '10 Item',
    subtext: 'Semen, Besi SNI, Keramik, Kayu',
    icon: Package,
    color: 'text-zinc-500 dark:text-zinc-400',
    bgLight: 'bg-zinc-500/10',
    borderActive: 'border-zinc-500',
    ringActive: 'ring-zinc-500/20',
  },
  {
    id: 'Kesehatan & Obat Generik',
    label: 'Kesehatan & Obat Generik',
    badge: '10 Item',
    subtext: 'Paracetamol, e-Katalog',
    icon: HeartPulse,
    color: 'text-red-500',
    bgLight: 'bg-red-500/10',
    borderActive: 'border-red-500',
    ringActive: 'ring-red-500/20',
  },
  {
    id: 'Konsumen & Otomotif',
    label: 'Konsumen & Otomotif',
    badge: '10 Item',
    subtext: 'Pakan, Garam, Ban, Sparepart',
    icon: Briefcase,
    color: 'text-purple-500',
    bgLight: 'bg-purple-500/10',
    borderActive: 'border-purple-500',
    ringActive: 'ring-purple-500/20',
  },
  {
    id: 'Fasilitas Utilitas Publik',
    label: 'Fasilitas Utilitas Publik',
    badge: '10 Item',
    subtext: 'Listrik PLN, PDAM, Gas, Tol',
    icon: Droplets,
    color: 'text-cyan-500',
    bgLight: 'bg-cyan-500/10',
    borderActive: 'border-cyan-500',
    ringActive: 'ring-cyan-500/20',
  },
  {
    id: 'Tenaga Kerja & Jasa Konstruksi',
    label: 'Tenaga Kerja & Konstruksi',
    badge: '10 Item',
    subtext: 'Upah Tukang, Mandor, IBK PUPR',
    icon: HardHat,
    color: 'text-orange-500',
    bgLight: 'bg-orange-500/10',
    borderActive: 'border-orange-500',
    ringActive: 'ring-orange-500/20',
  },
];

export const MACRO_INDEX_DIRECT_LINKS: Record<string, string> = {
  ihk: 'https://www.bps.go.id/id/statistics/subject/ihk-inflasi',
  ihpb: 'https://www.bps.go.id/id/statistics/subject/harga-perdagangan-besar',
  ntp: 'https://www.bps.go.id/id/statistics/subject/nilai-tukar-petani',
  ntn: 'https://www.bps.go.id/id/statistics/subject/nilai-tukar-nelayan',
  ihpr: 'https://www.bi.go.id/id/statistik/indikator/survei-harga-properti-residensial.aspx',
  ibk: 'https://pu.go.id',
  ihp: 'https://www.bps.go.id/id/statistics/subject/indeks-harga-produsen',
  ihke: 'https://www.bps.go.id/id/statistics/subject/indeks-harga-perdagangan-luar-negeri',
};

function MetrikCard({
  ikon,
  label,
  nilai,
  catatan,
}: {
  ikon: React.ReactNode;
  label: string;
  nilai: string;
  catatan: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-2xs">
      <div className="flex items-center justify-between">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {ikon}
        </span>
        <ArrowUpRight className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{nilai}</p>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{catatan}</p>
    </div>
  );
}

export function CommodityDashboardSection({ 
  isEmbedded = false,
  defaultNavTab
}: { 
  isEmbedded?: boolean;
  defaultNavTab?: string;
}) {
  const [activeNavigatorTab, setActiveNavigatorTab] = useState<string>(() => {
    if (defaultNavTab) return defaultNavTab;
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const sec = p.get('section') || p.get('view') || p.get('tab');
      if (sec === 'indeks' || sec === '10-indeks' || sec === 'national_indices') return 'national_indices';
      if (sec === 'makro' || sec === 'indeks_harga' || sec === 'indeks_harga_makro' || sec === 'ihk') return 'indeks_harga_makro';
      if (sec === 'spot' || sec === 'realtime') return 'spot_realtime';
      if (sec === 'both' || sec === 'keduanya') return 'both';
    }
    return 'commodity_all';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedCadence, setSelectedCadence] = useState<UpdateCadence | 'Semua'>('Semua');
  const [selectedSource, setSelectedSource] = useState<string>('Semua');
  const [selectedPricingType, setSelectedPricingType] = useState<PricingType | 'Semua'>('Semua');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [sortBy, setSortBy] = useState<'id' | 'nama' | 'harga' | 'cadence'>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const [selectedItem, setSelectedItem] = useState<CommodityItem | null>(null);
  const [showJsonSchemaModal, setShowJsonSchemaModal] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Indeks Harga Makro (BPS & BI)
  const [macroCategory, setMacroCategory] = useState<string>('Semua');
  const [macroSearchQuery, setMacroSearchQuery] = useState('');
  const [macroViewMode, setMacroViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedMacroItem, setSelectedMacroItem] = useState<MacroPriceIndexItem | null>(null);

  const filteredMacroIndices = useMemo(() => {
    const q = macroSearchQuery.toLowerCase().trim();
    return MACRO_PRICE_INDICES_DATA.filter((item) => {
      if (macroCategory !== 'Semua' && item.category !== macroCategory) return false;
      if (q) {
        return (
          item.name.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.singkatan.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.sumberResmi.toLowerCase().includes(q) ||
          item.deskripsi.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [macroCategory, macroSearchQuery]);

  // Kutipan Harga Real-Time (Logam Mulia & Indeks Global)
  const [quoteCommodities, setQuoteCommodities] = useState<Commodity[]>([]);
  const [quoteCurrency, setQuoteCurrency] = useState<'IDR' | 'USD'>('IDR');
  const [weightUnit, setWeightUnit] = useState<'GRAM' | 'OZ'>('GRAM');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');
  const [exchangeRate, setExchangeRate] = useState<number>(15850);
  const [logamMuliaLinkCategory, setLogamMuliaLinkCategory] = useState<'all' | 'Portal Resmi' | 'Aplikasi Terkait'>('all');

  const filteredLogamMuliaLinks = useMemo(() => {
    return LOGAM_MULIA_DIRECT_LINKS.filter((item) => {
      if (logamMuliaLinkCategory !== 'all' && item.category !== logamMuliaLinkCategory) return false;
      return true;
    });
  }, [logamMuliaLinkCategory]);

  const TIME_RANGE_OPTIONS: { id: '1D' | '1W' | '1M' | '1Y'; label: string; desc: string }[] = [
    { id: '1D', label: '1 Hari', desc: 'Rentang 24 Jam' },
    { id: '1W', label: '1 Minggu', desc: 'Rentang 7 Hari' },
    { id: '1M', label: '1 Bulan', desc: 'Rentang 30 Hari' },
    { id: '1Y', label: '1 Tahun', desc: 'Rentang 1 Tahun' },
  ];

  // Saham Indeks Syariah BEI (JII / JII70 / ISSI)
  const [selectedStockIndex, setSelectedStockIndex] = useState<IndexKey>('JII');
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const currentStockIndexData = INDICES_DATA[selectedStockIndex];
  const filteredStockCompanies = useMemo(() => {
    const q = stockSearchQuery.toLowerCase().trim();
    return currentStockIndexData.companies.filter(
      (c) =>
        !q ||
        c.ticker.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.sector.toLowerCase().includes(q),
    );
  }, [currentStockIndexData, stockSearchQuery]);

  useEffect(() => {
    const fetchLiveQuotes = () => {
      setQuoteCommodities(
        MOCK_COMMODITIES.map((c) => {
          const noise = 1 + (Math.random() * 0.01 - 0.005);
          return {
            ...c,
            currentPrice: c.currentPrice * noise,
          };
        }),
      );
    };

    fetchLiveQuotes();
    const interval = setInterval(fetchLiveQuotes, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatQuoteCurrency = (val: number, isIndex: boolean = false, curr: 'IDR' | 'USD' = 'IDR') => {
    if (isIndex) {
      return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(val);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: curr === 'USD' ? 2 : 0,
      maximumFractionDigits: curr === 'USD' ? 2 : 0,
    }).format(val);
  };

  const getCommodityChange = (item: Commodity, range: '1D' | '1W' | '1M' | '1Y') => {
    if (range === '1D') {
      return {
        percent: item.changePercent24h,
        label: '1 Hari',
      };
    }
    if (range === '1W') {
      const history = item.history;
      if (history && history.length >= 8) {
        const pastPrice = history[history.length - 8].price;
        const pct = pastPrice ? ((item.currentPrice - pastPrice) / pastPrice) * 100 : item.changePercent24h * 2.8;
        return {
          percent: pct,
          label: '1 Minggu',
        };
      }
      return {
        percent: item.changePercent24h * 2.8,
        label: '1 Minggu',
      };
    }
    if (range === '1M') {
      const history = item.history;
      if (history && history.length > 0) {
        const pastPrice = history[0].price;
        const pct = pastPrice ? ((item.currentPrice - pastPrice) / pastPrice) * 100 : item.changePercent24h * 4.6;
        return {
          percent: pct,
          label: '1 Bulan',
        };
      }
      return {
        percent: item.changePercent24h * 4.6,
        label: '1 Bulan',
      };
    }
    // 1Y (1 Tahun)
    const annualEstimates: Record<string, number> = {
      dinar: 18.4,
      dirham: 22.8,
      gold_gram: 18.4,
      silver_gram: 22.8,
      issi: 6.8,
      jii: 4.5,
      jii70: 5.2,
      ihsg: 8.2,
      lq45: 7.5,
      idx30: 7.1,
      djimi: 19.4,
      msci: 16.7,
      sp500sh: 22.3,
    };
    const pct = annualEstimates[item.id] ?? (item.changePercent24h >= 0 ? 14.2 : -5.4);
    return {
      percent: pct,
      label: '1 Tahun',
    };
  };

  const renderCommodityQuoteCard = (item: Commodity) => {
    const changeInfo = getCommodityChange(item, selectedTimeRange);
    const isUp = changeInfo.percent >= 0;
    const TROY_OUNCE_TO_GRAM = 31.1034768;

    let displayPrice = item.currentPrice;
    const displaySymbol = item.symbol;
    let displayWeightInfo = '';

    if (!item.isIndex) {
      if (quoteCurrency === 'IDR') {
        displayPrice = item.currentPrice * exchangeRate;
      }
      if (weightUnit === 'GRAM') {
        displayPrice = displayPrice / TROY_OUNCE_TO_GRAM;
        if (quoteCurrency === 'IDR') {
          displayWeightInfo = '• 1 g';
        }
      }
    }

    const links = QUOTE_COMMODITY_DIRECT_LINKS[item.id] || {
      externalUrl: 'https://www.tradingview.com/markets/commodities/prices/',
      externalLabel: 'Market Data',
      internalPath: '/100-komoditas',
      internalLabel: 'Komoditas',
    };

    return (
      <div
        key={item.id}
        className="bg-card p-4 sm:p-5 rounded-2xl shadow-2xs border border-border/70 flex flex-col justify-between min-h-[162px] transition-all hover:shadow-md hover:border-border group"
      >
        <div className="flex justify-between items-start w-full">
          <div>
            <h4 className="font-semibold text-foreground text-sm sm:text-base group-hover:text-primary transition-colors">{item.name}</h4>
            <span className="text-xs text-muted-foreground font-medium mt-0.5 block truncate max-w-[150px]">
              {displaySymbol} {displayWeightInfo}
            </span>
          </div>
          <div
            className={cn(
              'p-1.5 rounded-lg shrink-0',
              isUp ? 'bg-primary/10 text-primary' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
            )}
          >
            {isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          </div>
        </div>

        <div className="my-2.5">
          <div className="text-base sm:text-lg font-bold text-foreground">
            {formatQuoteCurrency(displayPrice, item.isIndex, item.isIndex ? 'USD' : quoteCurrency)}
          </div>
          <div
            className={cn(
              'text-[11px] font-semibold flex items-center mt-0.5',
              isUp ? 'text-primary' : 'text-rose-600 dark:text-rose-400',
            )}
          >
            {isUp ? '+' : ''}
            {changeInfo.percent.toFixed(2)}%
            <span className="text-muted-foreground ml-1.5 font-medium">{changeInfo.label}</span>
          </div>
        </div>

        {/* Direct Link Action Footer */}
        <div className="pt-2.5 border-t border-border/60 flex items-center justify-between gap-2 mt-auto text-xs">
          {links.internalPath ? (
            <Link
              to={links.internalPath as any}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors truncate max-w-[120px]"
              title={`Buka Aplikasi Terkait: ${links.internalLabel}`}
            >
              <span>{links.internalLabel}</span>
              <ArrowRight size={10} />
            </Link>
          ) : (
            <span className="text-[10px] text-muted-foreground font-mono">Spot Acuan</span>
          )}

          <a
            href={links.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted hover:bg-primary hover:text-primary-foreground text-foreground text-[11px] font-semibold transition-colors shrink-0 ml-auto"
            title={`Direct Link Portal Resmi: ${links.externalLabel}`}
          >
            <span>{links.externalLabel}</span>
            <ExternalLink size={10} />
          </a>
        </div>
      </div>
    );
  };

  const categories = useMemo(() => {
    const list = Array.from(new Set(COMMODITY_DATA.map((item) => item.kategori)));
    return ['Semua', ...list];
  }, []);

  const triggerNotify = (msg: string) => {
    setCopiedNotification(msg);
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return COMMODITY_DATA.filter((item) => {
      if (selectedCategory !== 'Semua' && item.kategori !== selectedCategory) return false;
      if (selectedCadence !== 'Semua' && item.updateCadence !== selectedCadence) return false;
      if (selectedSource !== 'Semua' && item.sumberData !== selectedSource) return false;
      if (selectedPricingType !== 'Semua' && item.jenisBatas !== selectedPricingType) return false;
      if (q) {
        const matchName = item.nama.toLowerCase().includes(q);
        const matchSource = item.sumberData.toLowerCase().includes(q);
        const matchCat = item.kategori.toLowerCase().includes(q);
        const matchReg = item.statusRegulasi.toLowerCase().includes(q);
        const matchSpec = item.deskripsiSpesifikasi.toLowerCase().includes(q);
        return matchName || matchSource || matchCat || matchReg || matchSpec;
      }
      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'id') {
        comparison = a.id - b.id;
      } else if (sortBy === 'nama') {
        comparison = a.nama.localeCompare(b.nama);
      } else if (sortBy === 'harga') {
        const priceA = a.mataUang === 'USD' ? a.hargaTerbaru * 15800 : a.hargaTerbaru;
        const priceB = b.mataUang === 'USD' ? b.hargaTerbaru * 15800 : b.hargaTerbaru;
        comparison = priceA - priceB;
      } else if (sortBy === 'cadence') {
        comparison = a.updateCadence.localeCompare(b.updateCadence);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [searchQuery, selectedCategory, selectedCadence, selectedSource, selectedPricingType, sortBy, sortDirection]);

  const groupedCategories = useMemo(() => {
    if (selectedCategory !== 'Semua') {
      return [{
        category: selectedCategory,
        items: filteredData,
      }];
    }

    const map = new Map<string, CommodityItem[]>();
    for (const item of filteredData) {
      const list = map.get(item.kategori) || [];
      list.push(item);
      map.set(item.kategori, list);
    }

    const groups: { category: string; items: CommodityItem[] }[] = [];
    for (const cat of categories) {
      if (cat === 'Semua') continue;
      const items = map.get(cat);
      if (items && items.length > 0) {
        groups.push({ category: cat, items });
      }
    }
    return groups;
  }, [filteredData, selectedCategory, categories]);

  const renderCommodityCard = (item: CommodityItem) => {
    const tagColor = 
      item.jenisBatas === 'Subsidi' ? 'prospek' : 
      item.jenisBatas === 'HET Pemerintah' ? 'berjalan' : 
      item.jenisBatas === 'Spot Global' ? 'aktif' : 'todo';
      
    return (
      <div 
        key={item.id}
        onClick={() => setSelectedItem(item)}
        className="bg-card rounded-2xl border border-border/80 p-4 hover:border-primary/60 hover:shadow-2xs transition-all cursor-pointer flex flex-col justify-between group h-full"
      >
        <div>
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <span className="font-mono text-[11px] text-muted-foreground px-2 py-0.5 rounded-md bg-muted">
              #{item.id.toString().padStart(3, '0')}
            </span>
            <Pill value={tagColor} label={item.jenisBatas} />
          </div>
          <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-1">
            {item.nama}
          </h3>
          <p className="text-xs text-muted-foreground mb-3">{item.kategori}</p>
          
          <div className="bg-muted/30 p-2.5 rounded-xl border border-border/70 mb-3">
            <div className="text-[11px] text-muted-foreground mb-0.5">Harga Terkini</div>
            <div className="text-base font-bold text-foreground">
              {formatPrice(item.hargaTerbaru, item.mataUang, item.satuan)}
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
            {item.deskripsiSpesifikasi}
          </p>
        </div>
        
        <div className="pt-3 border-t border-border/70 flex items-center justify-between text-xs mt-auto">
          <div className="flex items-center gap-1.5 text-muted-foreground truncate mr-2 text-[11px]">
            <Building2 size={13} className="shrink-0" />
            <span className="truncate">{item.sumberData.split('/')[0]}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {item.linkSumber && (
              <a
                href={item.linkSumber}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted hover:bg-primary hover:text-primary-foreground text-foreground text-[11px] font-semibold transition-colors"
                title={`Direct Link Sumber Resmi: ${item.sumberData}`}
              >
                <span>Direct Link</span>
                <ExternalLink size={10} />
              </a>
            )}
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
              Rincian
            </span>
          </div>
        </div>
      </div>
    );
  };

  const formatPrice = (harga: number, currency: 'IDR' | 'USD', satuan: string) => {
    if (currency === 'USD') {
      return (
        <span className="tabular-nums">
          <span className="font-semibold text-foreground">${harga.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className="text-muted-foreground text-xs ml-1 font-normal">/ {satuan}</span>
        </span>
      );
    }
    return (
      <span className="tabular-nums">
        <span className="font-semibold text-foreground">Rp {harga.toLocaleString('id-ID')}</span>
        <span className="text-muted-foreground text-xs ml-1 font-normal">/ {satuan}</span>
      </span>
    );
  };

  const stats = useMemo(() => {
    const total = COMMODITY_DATA.length;
    const subsidiCount = COMMODITY_DATA.filter(i => i.jenisBatas === 'Subsidi').length;
    const hetCount = COMMODITY_DATA.filter(i => i.jenisBatas === 'HET Pemerintah').length;
    const harianCount = COMMODITY_DATA.filter(i => i.updateCadence === 'Harian').length;
    return { total, subsidiCount, hetCount, harianCount };
  }, []);

  const handleExportCSV = () => {
    if (activeNavigatorTab === 'national_indices') {
      const headers = [
        'No', 'Nama Indeks', 'Singkatan', 'Kategori', 'Skor Terkini',
        'Skala', 'Status Kategori', 'Tren', 'Perubahan YoY',
        'Frekuensi Rilis', 'Jadwal Rilis', 'Sumber Resmi', 'Target RPJMN'
      ];
      const rows = NATIONAL_INDICES_DATA.map((d) => [
        d.number, `"${d.nama}"`, `"${d.singkatan}"`, `"${d.kategori}"`,
        `"${d.formatNilai}"`, `"${d.skala}"`, `"${d.statusKategori}"`,
        `"${d.tren.toUpperCase()}"`, `"${d.perubahanYoY}"`,
        `"${d.frekuensiRilis}"`, `"${d.jadwalBulanRilis}"`,
        `"${d.sumberResmi}"`, `"${d.targetRPJMN}"`
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `10_Indeks_Pembangunan_Nasional_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerNotify("File CSV 10 Indeks Pembangunan berhasil diunduh!");
      return;
    }

    if (activeNavigatorTab === 'indeks_harga_makro') {
      const headers = [
        'No', 'Kode', 'Nama Indeks', 'Singkatan', 'Kategori', 'Skor Terkini',
        'Satuan', 'Tren', 'Perubahan YoY', 'Perubahan MoM',
        'Status Kategori', 'Frekuensi Rilis', 'Jadwal Rilis', 'Sumber Resmi'
      ];
      const rows = MACRO_PRICE_INDICES_DATA.map((d) => [
        d.number, `"${d.code}"`, `"${d.name}"`, `"${d.singkatan}"`, `"${d.category}"`,
        `"${d.formatNilai}"`, `"${d.satuan}"`, `"${d.tren.toUpperCase()}"`,
        `"${d.perubahanYoY}"`, `"${d.perubahanMoM || '-'}"`,
        `"${d.statusKategori}"`, `"${d.frekuensiRilis}"`, `"${d.jadwalRilis}"`,
        `"${d.sumberResmi}"`
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `8_Indeks_Harga_Makro_BPS_BI_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerNotify("File CSV 8 Indeks Harga Makro BPS & BI berhasil diunduh!");
      return;
    }

    const headers = ["ID", "Nama Komoditas", "Kategori", "Harga", "Mata Uang", "Satuan", "Jenis Batas", "Sumber Data", "Rentang Update", "Regulasi"];
    const rows = filteredData.map(i => [
      i.id,
      `"${i.nama.replace(/"/g, '""')}"`,
      `"${i.kategori.replace(/"/g, '""')}"`,
      i.hargaTerbaru,
      i.mataUang,
      `"${i.satuan.replace(/"/g, '""')}"`,
      `"${i.jenisBatas.replace(/"/g, '""')}"`,
      `"${i.sumberData.replace(/"/g, '""')}"`,
      i.updateCadence,
      `"${i.statusRegulasi.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `100_Komoditas_${selectedCategory !== 'Semua' ? selectedCategory : 'Lengkap'}_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    triggerNotify("File CSV 100 Komoditas berhasil diunduh!");
  };

  const handleNavigatorClick = (cardId: string) => {
    setActiveNavigatorTab(cardId);
    if (cardId === 'commodity_all') {
      setSelectedCategory('Semua');
    } else if (
      cardId === 'national_indices' ||
      cardId === 'indeks_harga_makro' ||
      cardId === 'logam_mulia' ||
      cardId === 'indeks_global' ||
      cardId === 'saham_syariah' ||
      cardId === 'spot_realtime' ||
      cardId === 'both'
    ) {
      // Direct section switch
    } else {
      setSelectedCategory(cardId);
    }
  };

  const isCardActive = (cardId: string) => {
    if (activeNavigatorTab === 'both') return false;
    if (cardId === activeNavigatorTab) return true;
    if (cardId === 'commodity_all') {
      return (
        activeNavigatorTab === 'commodity_all' ||
        (selectedCategory === 'Semua' &&
          activeNavigatorTab !== 'national_indices' &&
          activeNavigatorTab !== 'indeks_harga_makro' &&
          activeNavigatorTab !== 'logam_mulia' &&
          activeNavigatorTab !== 'indeks_global' &&
          activeNavigatorTab !== 'saham_syariah' &&
          activeNavigatorTab !== 'spot_realtime')
      );
    }
    return (
      (activeNavigatorTab === cardId || selectedCategory === cardId) &&
      activeNavigatorTab !== 'national_indices' &&
      activeNavigatorTab !== 'indeks_harga_makro' &&
      activeNavigatorTab !== 'logam_mulia' &&
      activeNavigatorTab !== 'indeks_global' &&
      activeNavigatorTab !== 'saham_syariah' &&
      activeNavigatorTab !== 'spot_realtime'
    );
  };

  const handleCopyJson = () => {
    if (activeNavigatorTab === 'national_indices') {
      navigator.clipboard.writeText(JSON.stringify(NATIONAL_INDICES_DATA, null, 2));
      triggerNotify("Seluruh data 10 Indeks Pembangunan disalin ke clipboard!");
      return;
    }
    if (activeNavigatorTab === 'indeks_harga_makro') {
      navigator.clipboard.writeText(JSON.stringify(MACRO_PRICE_INDICES_DATA, null, 2));
      triggerNotify("Seluruh data 8 Indeks Harga Makro disalin ke clipboard!");
      return;
    }
    navigator.clipboard.writeText(JSON.stringify(COMMODITY_DATA, null, 2));
    triggerNotify("Seluruh data 100 Komoditas disalin ke clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Portaled ShellHeader: Clean & Seamless Toolbar di Bar Atas */}
      <ShellHeader>
        <div className="flex items-center gap-1.5 h-full py-0 shrink-0">
          {/* Selector Jenis Batas / Regulasi */}
          <div className="relative flex items-center gap-1.5 px-2.5 h-[36px] rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 transition-all text-xs shrink-0 cursor-pointer border border-black/5 dark:border-white/10">
            <ShieldAlert size={20} className="text-amber-500 shrink-0 pointer-events-none" />
            <select
              value={selectedPricingType}
              onChange={(e) => setSelectedPricingType(e.target.value as any)}
              className="bg-transparent border-0 text-xs font-semibold text-foreground focus:outline-none cursor-pointer pr-4 appearance-none py-0 leading-tight"
              title="Pilih Jenis Batas Harga / Regulasi"
            >
              <option value="Semua" className="bg-popover text-popover-foreground">Regulasi</option>
              {PRICING_TYPES.map(p => (
                <option key={p} value={p} className="bg-popover text-popover-foreground">{p}</option>
              ))}
            </select>
            <ChevronDown size={11} className="text-muted-foreground pointer-events-none absolute right-2 shrink-0" />
          </div>

          {/* Selector Ritme Pembaruan */}
          <div className="relative flex items-center gap-1.5 px-2.5 h-[36px] rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 transition-all text-xs shrink-0 cursor-pointer border border-black/5 dark:border-white/10">
            <CalendarClock size={20} className="text-primary shrink-0 pointer-events-none" />
            <select
              value={selectedCadence}
              onChange={(e) => setSelectedCadence(e.target.value as any)}
              className="bg-transparent border-0 text-xs font-semibold text-foreground focus:outline-none cursor-pointer pr-4 appearance-none py-0 leading-tight"
              title="Pilih Ritme Pembaruan Komoditas"
            >
              <option value="Semua" className="bg-popover text-popover-foreground">Ritme</option>
              {UPDATE_CADENCES.map(cadence => (
                <option key={cadence} value={cadence} className="bg-popover text-popover-foreground">
                  Ritme: {cadence}
                </option>
              ))}
            </select>
            <ChevronDown size={11} className="text-muted-foreground pointer-events-none absolute right-2 shrink-0" />
          </div>

          {/* Selector Sumber Data Resmi */}
          <div className="relative flex items-center gap-1.5 px-2.5 h-[36px] rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 transition-all text-xs shrink-0 cursor-pointer border border-black/5 dark:border-white/10 max-w-[170px]">
            <Building2 size={20} className="text-emerald-500 shrink-0 pointer-events-none" />
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="bg-transparent border-0 text-xs font-semibold text-foreground focus:outline-none cursor-pointer pr-4 appearance-none py-0 leading-tight truncate"
              title="Pilih Sumber Data Resmi"
            >
              <option value="Semua" className="bg-popover text-popover-foreground">Sumber</option>
              {COMMODITY_SOURCES.map(source => (
                <option key={source} value={source} className="bg-popover text-popover-foreground">
                  {source}
                </option>
              ))}
            </select>
            <ChevronDown size={11} className="text-muted-foreground pointer-events-none absolute right-2 shrink-0" />
          </div>

          {/* Selector Urutan & Arah Sort */}
          <div className="relative flex items-center gap-1 pl-2.5 pr-1 h-[36px] rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 transition-all text-xs shrink-0 cursor-pointer border border-black/5 dark:border-white/10">
            <ArrowUpDown size={20} className="text-violet-500 shrink-0 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-0 text-xs font-semibold text-foreground focus:outline-none cursor-pointer pr-3 appearance-none py-0 leading-tight"
              title="Pilih Kriteria Pengurutan"
            >
              <option value="id" className="bg-popover text-popover-foreground">Urut: ID</option>
              <option value="nama" className="bg-popover text-popover-foreground">Urut: Nama</option>
              <option value="harga" className="bg-popover text-popover-foreground">Urut: Harga</option>
              <option value="cadence" className="bg-popover text-popover-foreground">Urut: Ritme</option>
            </select>
            <button
              type="button"
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="commodity-header-icon-btn size-9 rounded-full flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/20 transition-all text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
              title={sortDirection === 'asc' ? 'Urutan Naik (A-Z / Rendah ke Tinggi)' : 'Urutan Turun (Z-A / Tinggi ke Rendah)'}
            >
              <TrendingUp size={20} className={cn("shrink-0", sortDirection === 'desc' ? 'rotate-180 text-amber-500' : 'text-emerald-500')} />
            </button>
          </div>

          {/* Tombol Reset Cepat (Tampil jika ada filter/sort non-default) */}
          {(searchQuery || selectedCadence !== 'Semua' || selectedPricingType !== 'Semua' || selectedSource !== 'Semua' || sortBy !== 'id') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCadence('Semua');
                setSelectedPricingType('Semua');
                setSelectedSource('Semua');
                setSortBy('id');
                setSortDirection('asc');
              }}
              className="inline-flex items-center gap-1 px-2.5 h-[36px] rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold shrink-0 cursor-pointer border border-rose-500/20 active:scale-95 transition-all"
              title="Reset seluruh filter dan pengurutan ke awal"
            >
              <X size={16} className="shrink-0" />
              <span>Reset</span>
            </button>
          )}

          {/* Divider pemisah halus */}
          <div className="h-4 w-px bg-border/60 shrink-0" />

          {/* Toggle View Mode: Grid Kartu vs Tabel (Clean Pill Menyatu) */}
          <div className="flex items-center gap-0.5 p-0.5 bg-black/5 dark:bg-white/5 rounded-full shrink-0 border border-black/5 dark:border-white/10">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={cn(
                "commodity-header-icon-btn size-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95",
                viewMode === 'cards'
                  ? "bg-background dark:bg-zinc-700 text-foreground shadow-2xs font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
              )}
              title="Tampilan Kartu Grid"
            >
              <LayoutGrid size={20} className="shrink-0" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={cn(
                "commodity-header-icon-btn size-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95",
                viewMode === 'table'
                  ? "bg-background dark:bg-zinc-700 text-foreground shadow-2xs font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
              )}
              title="Tampilan Tabel Data"
            >
              <TableIcon size={20} className="shrink-0" />
            </button>
          </div>

          {/* Divider pemisah halus */}
          <div className="h-4 w-px bg-border/60 shrink-0" />

          {/* Tombol Icon Cari di Sisi Kanan (Minimalis & Menyatu) */}
          {isSearchExpanded ? (
            <div className="relative flex items-center min-w-[140px] max-w-[200px] sm:max-w-[220px] animate-in fade-in zoom-in-95 duration-150 shrink-0">
              <Search size={20} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground shrink-0 pointer-events-none" />
              <input
                type="text"
                autoFocus
                placeholder="Cari komoditas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    if (!searchQuery) setIsSearchExpanded(false);
                    else setSearchQuery('');
                  }
                }}
                className="w-full pl-9 pr-7 py-1 h-[36px] text-xs bg-black/5 dark:bg-white/10 border-0 rounded-full focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground transition-all"
              />
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchExpanded(false);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded-full"
                title="Tutup pencarian"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsSearchExpanded(true)}
              className={cn(
                "commodity-header-icon-btn size-9 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95",
                searchQuery
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10"
              )}
              title={searchQuery ? `Pencarian aktif: "${searchQuery}" (klik untuk ubah)` : "Cari 100 komoditas"}
            >
              <Search size={20} className="shrink-0" />
            </button>
          )}
        </div>
      </ShellHeader>

      {copiedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-foreground text-background px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-sm font-medium animate-in fade-in duration-200">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* Header Bar 1 Halaman Terpadu */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="size-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              100 Komoditas, 10 Indeks Pembangunan & Indeks Harga Makro
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl leading-relaxed">
            Pusat intelijen terpadu harga pasar spot fisik, pagu subsidi pangan & energi pemerintah, bursa efek & syariah BEI, serta 10 indikator makro-sosial dan 8 indeks harga resmi BPS & Bank Indonesia (IHK Inflasi, IHPB, NTP, NTN, IHPR, IBK, IHP, IHKE).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveNavigatorTab(activeNavigatorTab === 'both' ? 'commodity_all' : 'both')}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border shadow-2xs",
              activeNavigatorTab === 'both'
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background hover:bg-accent border-border text-foreground"
            )}
            title="Tampilkan 10 Indeks, Spot Real-time & 100 Komoditas sekaligus"
          >
            <LayoutGrid size={14} />
            <span>{activeNavigatorTab === 'both' ? 'Mode Terpadu Aktif' : 'Tampilkan Keduanya'}</span>
          </button>
          <button
            onClick={() => setShowJsonSchemaModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-background hover:bg-accent border border-border text-foreground transition-colors cursor-pointer shadow-2xs"
            title="Lihat Struktur Skema JSON"
          >
            <Database size={14} className="text-primary" />
            <span>Skema JSON</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer shadow-2xs"
            title="Unduh seluruh data komoditas / indeks ke format CSV"
          >
            <Download size={14} />
            <span>Unduh CSV</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          NAVIGATOR UTAMA: 100 KOMODITAS, 10 INDEKS PEMBANGUNAN & INDEKS HARGA MAKRO
          (DITARUH DI UTAMA DI ATAS SEBAGAI NAVIGATOR UTAMA 1 HALAMAN)
         ========================================================================= */}
      <div className="space-y-3 p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-primary/10 text-primary">
              <Layers className="size-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Navigator Utama: 100 Komoditas, 10 Indeks Pembangunan & Indeks Harga Makro
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Pilih modul di bawah untuk beralih instan antara 100 Komoditas, 10 Indeks Pembangunan, 8 Indeks Harga Makro (BPS/BI), Spot Emas/BEI, atau sektor spesifik.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeNavigatorTab !== 'commodity_all' && activeNavigatorTab !== 'both' && (
              <button
                type="button"
                onClick={() => {
                  setActiveNavigatorTab('commodity_all');
                  setSelectedCategory('Semua');
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer"
              >
                <span>Reset ke 100 Komoditas</span>
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* 15 Kotak Grid Cards Navigator Rapi (3 Baris x 5 Kolom) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {NAVIGATOR_CARDS.map((card) => {
            const active = isCardActive(card.id);
            const IconComp = card.icon;

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handleNavigatorClick(card.id)}
                className={cn(
                  "p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[96px] relative group",
                  active
                    ? cn("bg-card shadow-xs ring-2", card.borderActive, card.ringActive)
                    : "bg-card/75 border-border/80 hover:bg-card hover:border-border hover:shadow-2xs"
                )}
                title={`${card.label} - ${card.subtext}`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={cn("size-7 rounded-xl flex items-center justify-center shrink-0 transition-colors", card.bgLight, card.color)}>
                    <IconComp size={15} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums",
                    active ? "bg-primary text-primary-foreground font-black" : "bg-muted text-muted-foreground group-hover:text-foreground"
                  )}>
                    {card.badge}
                  </span>
                </div>
                <div className="mt-2">
                  <div className={cn(
                    "text-xs font-bold truncate leading-tight transition-colors",
                    active ? "text-primary" : "text-foreground group-hover:text-primary"
                  )}>
                    {card.label}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate font-normal mt-0.5">
                    {card.subtext}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          BAGIAN 1: 10 INDEKS PEMBANGUNAN & KESEJAHTERAAN NASIONAL
         ========================================================================= */}
      {(activeNavigatorTab === 'national_indices' || activeNavigatorTab === 'both') && (
        <div className="space-y-4">
          {activeNavigatorTab === 'both' && (
            <div className="flex items-center gap-2 pt-2 border-t border-border/60">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <BarChart3 className="size-4" />
              </span>
              <h3 className="text-base font-bold text-foreground">
                Bagian 1: 10 Indeks Pembangunan & Kesejahteraan Nasional
              </h3>
            </div>
          )}
          <NationalIndicesSection isEmbedded={true} hideHeaderBanner={true} />
        </div>
      )}

      {/* =========================================================================
          BAGIAN INDEKS HARGA MAKROEKONOMI & SEKTORAL RESMI (BPS & BANK INDONESIA)
         ========================================================================= */}
      {(activeNavigatorTab === 'indeks_harga_makro' || activeNavigatorTab === 'both') && (
        <div className="space-y-5">
          {activeNavigatorTab === 'both' && (
            <div className="flex items-center gap-2 pt-2 border-t border-border/60">
              <span className="p-1.5 rounded-lg bg-violet-500/10 text-violet-500">
                <Scale className="size-4" />
              </span>
              <h3 className="text-base font-bold text-foreground">
                Bagian: 8 Indeks Harga Makroekonomi & Sektoral Resmi (BPS & BI)
              </h3>
            </div>
          )}

          {/* Banner Intelijen Indeks Harga Makro */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xs space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-violet-500/10 text-violet-500">
                    <Scale className="size-5" />
                  </span>
                  <h3 className="text-lg font-bold text-foreground">
                    Indeks Harga Makroekonomi & Sektoral Resmi (BPS & Bank Indonesia)
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mt-1 max-w-3xl leading-relaxed">
                  Pantauan 8 tolok ukur resmi perubahan tingkat harga nasional: inflasi konsumen (IHK), harga produsen & grosir (IHPB/IHP), nilai tukar riil petani & nelayan (NTP/NTN), indeks properti residensial (IHPR - BI), indeks biaya konstruksi (IBK), dan komoditas ekspor.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border">
                  <button
                    type="button"
                    onClick={() => setMacroViewMode('grid')}
                    className={cn(
                      "p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                      macroViewMode === 'grid'
                        ? "bg-primary text-primary-foreground shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    title="Tampilan Grid Kartu"
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMacroViewMode('table')}
                    className={cn(
                      "p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                      macroViewMode === 'table'
                        ? "bg-primary text-primary-foreground shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    title="Tampilan Tabel Rinci"
                  >
                    <TableIcon size={15} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20 transition-colors cursor-pointer"
                >
                  <Download size={13} />
                  <span>CSV 8 Indeks</span>
                </button>
              </div>
            </div>

            {/* 4 KPI Ringkasan Indeks Harga Makro */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-xl border border-border/80 bg-background/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>IHK Inflasi Nasional</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-500 font-bold">BPS</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">106.85</div>
                  <div className="text-xs font-semibold text-emerald-500 flex items-center gap-1 mt-0.5">
                    <TrendingUp size={12} />
                    <span>+2.58% YoY</span>
                    <span className="text-muted-foreground font-normal">(+0.28% MoM)</span>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground border-t border-border/40 pt-1.5">
                  Dalam koridor sasaran BI 2.5% ± 1%
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border/80 bg-background/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>IHPB Perdagangan Besar</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold">WPI</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">117.40</div>
                  <div className="text-xs font-semibold text-emerald-500 flex items-center gap-1 mt-0.5">
                    <TrendingUp size={12} />
                    <span>+3.12% YoY</span>
                    <span className="text-muted-foreground font-normal">(Grosir Stabil)</span>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground border-t border-border/40 pt-1.5">
                  Pertanian & industri manufaktur lancar
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border/80 bg-background/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>NTP Nilai Tukar Petani</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">Riil</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">121.50</div>
                  <div className="text-xs font-semibold text-emerald-500 flex items-center gap-1 mt-0.5">
                    <TrendingUp size={12} />
                    <span>+3.85% YoY</span>
                    <span className="text-muted-foreground font-normal">(Surplus &gt;100)</span>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground border-t border-border/40 pt-1.5">
                  Daya beli komoditas tani di atas biaya hidup
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border/80 bg-background/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>IHPR Properti Residensial</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold">BI</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">221.80</div>
                  <div className="text-xs font-semibold text-emerald-500 flex items-center gap-1 mt-0.5">
                    <TrendingUp size={12} />
                    <span>+1.89% YoY</span>
                    <span className="text-muted-foreground font-normal">(Survei SHPR)</span>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground border-t border-border/40 pt-1.5">
                  Tipe kecil dan menengah tumbuh konsisten
                </div>
              </div>
            </div>

            {/* Filter Kategori & Pencarian */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                {[
                  'Semua',
                  'Inflasi & Konsumen',
                  'Produsen & Grosir',
                  'Daya Beli Riil',
                  'Properti & Aset',
                  'Konstruksi & Ekspor'
                ].map((cat) => {
                  const count = cat === 'Semua' 
                    ? MACRO_PRICE_INDICES_DATA.length 
                    : MACRO_PRICE_INDICES_DATA.filter(i => i.category === cat).length;
                  const isActive = macroCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setMacroCategory(cat)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 flex items-center gap-1.5",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                          : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <span>{cat}</span>
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.2 rounded-full",
                        isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-background text-muted-foreground"
                      )}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari indeks (IHK, NTP, IBK, BI...)"
                  value={macroSearchQuery}
                  onChange={(e) => setMacroSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-7 py-1.5 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                />
                {macroSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setMacroSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Konten: Grid vs Table */}
            {macroViewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                {filteredMacroIndices.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedMacroItem(item)}
                    className="p-4 rounded-2xl border border-border/80 bg-card hover:border-violet-500/60 hover:shadow-2xs transition-all cursor-pointer flex flex-col justify-between group h-full relative"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] font-bold text-muted-foreground px-2 py-0.5 rounded-md bg-muted">
                            #{item.number.toString().padStart(2, '0')}
                          </span>
                          <span className="font-mono text-[11px] font-bold text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-md bg-violet-500/10">
                            {item.code}
                          </span>
                        </div>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground truncate max-w-[120px]">
                          {item.category}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-foreground group-hover:text-violet-500 transition-colors line-clamp-2 leading-snug mb-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                        {item.deskripsi}
                      </p>

                      <div className="bg-muted/30 p-2.5 rounded-xl border border-border/70 mb-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">Skor Terkini</span>
                          <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
                            <TrendingUp size={11} />
                            {item.perubahanYoY}
                          </span>
                        </div>
                        <div className="text-base font-bold text-foreground">
                          {item.formatNilai}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono truncate">
                          Basis: {item.satuan}
                        </div>
                      </div>

                      {/* Preview 2 Subkomponen */}
                      <div className="space-y-1.5 mb-3 bg-background/50 p-2 rounded-xl border border-border/50 text-[11px]">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Subkomponen Utama:</div>
                        {item.subkomponen.slice(0, 2).map((sub, sIdx) => (
                          <div key={sIdx} className="flex items-center justify-between text-muted-foreground gap-2">
                            <span className="truncate">{sub.name}</span>
                            <span className="font-semibold text-foreground shrink-0">{sub.changeYoY}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-border/70 flex items-center justify-between text-xs mt-auto">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] truncate mr-2">
                        <Building2 size={13} className="shrink-0 text-violet-500" />
                        <span className="truncate">{item.sumberResmi.split('(')[0].split('&')[0]}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {MACRO_INDEX_DIRECT_LINKS[item.id] && (
                          <a
                            href={MACRO_INDEX_DIRECT_LINKS[item.id]}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted hover:bg-violet-600 hover:text-white text-foreground text-[11px] font-semibold transition-colors"
                            title={`Direct Link Portal Resmi: ${item.sumberResmi}`}
                          >
                            <span>Portal</span>
                            <ExternalLink size={10} />
                          </a>
                        )}
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-colors shrink-0">
                          Rincian
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto border border-border/70 rounded-xl bg-background/50">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-muted/80 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="py-2.5 px-3">Kode / No</th>
                      <th className="py-2.5 px-3">Nama Indeks Harga</th>
                      <th className="py-2.5 px-3">Kategori</th>
                      <th className="py-2.5 px-3">Skor & Perubahan</th>
                      <th className="py-2.5 px-3">Status Evaluasi</th>
                      <th className="py-2.5 px-3">Sumber Resmi</th>
                      <th className="py-2.5 px-3 text-right">Aksi & Direct Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredMacroIndices.map((item) => (
                      <tr 
                        key={item.id} 
                        onClick={() => setSelectedMacroItem(item)}
                        className="hover:bg-muted/40 transition-colors cursor-pointer"
                      >
                        <td className="py-2.5 px-3 font-mono font-bold text-violet-600 dark:text-violet-400 whitespace-nowrap">
                          #{item.number.toString().padStart(2, '0')} · {item.code}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-foreground">{item.name}</div>
                          <div className="text-[10px] text-muted-foreground">{item.frekuensiRilis} · {item.jadwalRilis}</div>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-muted-foreground">
                          <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="font-bold text-foreground">{item.formatNilai}</div>
                          <div className="text-[10px] text-emerald-500 font-semibold">{item.perubahanYoY}</div>
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-muted-foreground max-w-[200px]">
                          {item.statusKategori}
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-muted-foreground max-w-[160px] truncate">
                          {item.sumberResmi}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {MACRO_INDEX_DIRECT_LINKS[item.id] && (
                              <a
                                href={MACRO_INDEX_DIRECT_LINKS[item.id]}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-muted hover:bg-violet-600 hover:text-white text-foreground transition-colors inline-flex items-center gap-1"
                                title={`Direct Link Portal Resmi: ${item.sumberResmi}`}
                              >
                                <span>Portal</span>
                                <ExternalLink size={10} />
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMacroItem(item);
                              }}
                              className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-600 hover:text-white transition-colors cursor-pointer"
                            >
                              Rincian
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          BAGIAN 2: KUTIPAN HARGA PASAR REAL-TIME (LOGAM MULIA, INDEKS GLOBAL & BEI)
         ========================================================================= */}
      {(activeNavigatorTab === 'logam_mulia' ||
        activeNavigatorTab === 'indeks_global' ||
        activeNavigatorTab === 'saham_syariah' ||
        activeNavigatorTab === 'spot_realtime' ||
        activeNavigatorTab === 'both') && (
        <div className="space-y-4">
          {activeNavigatorTab === 'both' && (
            <div className="flex items-center gap-2 pt-4 border-t border-border/60">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                <Coins className="size-4" />
              </span>
              <h3 className="text-base font-bold text-foreground">
                Bagian 2: Kutipan Pasar Real-Time (Logam Mulia, Indeks Global & BEI Syariah)
              </h3>
            </div>
          )}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-500">
                <Coins className="size-4" />
              </span>
              <h3 className="text-lg font-bold text-foreground">
                {activeNavigatorTab === 'logam_mulia'
                  ? 'Kutipan Logam Mulia & Komoditas Fisik'
                  : activeNavigatorTab === 'indeks_global'
                  ? 'Pantauan Indeks Pasar Global'
                  : activeNavigatorTab === 'saham_syariah'
                  ? 'Daftar Saham Indeks Syariah (BEI / IDX)'
                  : 'Kutipan Harga Pasar Real-Time'}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activeNavigatorTab === 'logam_mulia'
                ? 'Pantauan pergerakan spot Emas Antam, Spot Gold, Silver & Crude Oil internasional.'
                : activeNavigatorTab === 'indeks_global'
                ? 'Benchmark pasar modal global: S&P 500, Nasdaq, Dow Jones, FTSE 100 & Nikkei 225.'
                : activeNavigatorTab === 'saham_syariah'
                ? 'Konstituen saham syariah unggulan BEI dalam indeks JII, JII70, dan ISSI.'
                : 'Pantauan pergerakan spot Logam Mulia, Indeks Pasar Global, dan Saham Syariah BEI.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-muted/60 p-1 rounded-xl border border-border/60 shadow-2xs">
            {/* Rentang Waktu (1 Hari, 1 Minggu, 1 Bulan, 1 Tahun) */}
            <div className="flex items-center gap-1 p-1 bg-background rounded-lg shadow-2xs">
              {TIME_RANGE_OPTIONS.map((range) => (
                <button
                  key={range.id}
                  type="button"
                  onClick={() => setSelectedTimeRange(range.id)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
                    selectedTimeRange === range.id
                      ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  title={`Rentang Waktu: ${range.label} (${range.desc})`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-border hidden sm:block"></div>

            <div className="flex items-center gap-1 p-1 bg-background rounded-lg shadow-2xs">
              <button
                type="button"
                onClick={() => setQuoteCurrency("IDR")}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
                  quoteCurrency === "IDR"
                    ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                IDR
              </button>
              <button
                type="button"
                onClick={() => setQuoteCurrency("USD")}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
                  quoteCurrency === "USD"
                    ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                USD
              </button>
            </div>
            <div className="w-px h-5 bg-border"></div>
            <div className="flex items-center gap-1 p-1 bg-background rounded-lg shadow-2xs">
              <button
                type="button"
                onClick={() => setWeightUnit("GRAM")}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
                  weightUnit === "GRAM"
                    ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                GRAM
              </button>
              <button
                type="button"
                onClick={() => setWeightUnit("OZ")}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
                  weightUnit === "OZ"
                    ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                OZ
              </button>
            </div>
          </div>
        </div>

        {/* 1. KATEGORI: LOGAM MULIA */}
        {(activeNavigatorTab === 'logam_mulia' || activeNavigatorTab === 'spot_realtime' || activeNavigatorTab === 'both') && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm sm:text-base">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                <span>Logam Mulia & Cadangan Fisik</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-600 dark:text-amber-400 font-bold">
                  Physical Commodities & Precious Metals
                </span>
              </h3>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                <Coins size={14} className="text-amber-500" />
                <span>Pusat Intelijen Terpadu & 12 Direct Link</span>
              </div>
            </div>

            {/* Kotak-Kotak Harga Spot Fisik (Dinar, Dirham, Emas Antam, Perak) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
              {quoteCommodities.filter((item) => !item.isIndex).map(renderCommodityQuoteCard)}
            </div>

            {/* =========================================================================
                SUITE DIRECT LINKS: PORTAL RESMI & APLIKASI TERKAIT LOGAM MULIA (12 ITEMS)
               ========================================================================= */}
            <div className="p-4 sm:p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <ExternalLink size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      Pusat Direct Link: Portal Resmi & Aplikasi Terkait Logam Mulia
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Seluruh tautan langsung portal cetak fisik Antam, Pegadaian, bursa berjangka LBMA/ICDX, dan modul aplikasi syariah internal terpadu di satu tempat.
                    </p>
                  </div>
                </div>

                {/* Filter Kategori Direct Link */}
                <div className="flex items-center gap-1.5 p-1 bg-background/80 rounded-xl border border-border/60 shrink-0">
                  <button
                    type="button"
                    onClick={() => setLogamMuliaLinkCategory('all')}
                    className={cn(
                      "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer",
                      logamMuliaLinkCategory === 'all'
                        ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Semua ({LOGAM_MULIA_DIRECT_LINKS.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogamMuliaLinkCategory('Portal Resmi')}
                    className={cn(
                      "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer",
                      logamMuliaLinkCategory === 'Portal Resmi'
                        ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Portal Resmi (7)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogamMuliaLinkCategory('Aplikasi Terkait')}
                    className={cn(
                      "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer",
                      logamMuliaLinkCategory === 'Aplikasi Terkait'
                        ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Aplikasi Terkait (5)
                  </button>
                </div>
              </div>

              {/* Grid 12 Direct Link Cards (MBA Style) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredLogamMuliaLinks.map((item) => {
                  const IconComp = item.icon;
                  const isExt = item.isExternal;

                  const CardContent = (
                    <div className="p-3.5 rounded-xl border border-border/80 bg-card hover:bg-card/90 hover:border-amber-500/50 hover:shadow-sm transition-all flex flex-col justify-between h-full group">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className={cn("size-7 rounded-lg flex items-center justify-center shrink-0", item.bgLight, item.color)}>
                            <IconComp size={15} />
                          </div>
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full",
                            isExt ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          )}>
                            {item.badge}
                          </span>
                        </div>
                        <h5 className="font-bold text-xs text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {item.title}
                        </h5>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      <div className="pt-2.5 mt-3 border-t border-border/60 flex items-center justify-between text-[11px]">
                        <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[140px]">
                          {isExt ? new URL(item.url).hostname : item.url}
                        </span>
                        <span className="inline-flex items-center gap-1 font-semibold text-primary group-hover:underline">
                          <span>Buka</span>
                          {isExt ? <ExternalLink size={11} /> : <ArrowRight size={11} />}
                        </span>
                      </div>
                    </div>
                  );

                  return isExt ? (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block cursor-pointer"
                    >
                      {CardContent}
                    </a>
                  ) : (
                    <Link
                      key={item.id}
                      to={item.url as any}
                      className="block cursor-pointer"
                    >
                      {CardContent}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 2. KATEGORI: INDEKS GLOBAL */}
        {(activeNavigatorTab === 'indeks_global' || activeNavigatorTab === 'spot_realtime' || activeNavigatorTab === 'both') && (
          <div className={activeNavigatorTab === 'indeks_global' ? '' : 'pt-4 border-t border-border/40'}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm sm:text-base">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <span>Indeks Global</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
                  Market Indices & Benchmarks
                </span>
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              {quoteCommodities.filter((item) => item.isIndex).map(renderCommodityQuoteCard)}
            </div>
          </div>
        )}

        {/* 3. KATEGORI: DAFTAR SAHAM INDEKS SYARIAH (JII / JII70 / ISSI) */}
        {(activeNavigatorTab === 'saham_syariah' || activeNavigatorTab === 'spot_realtime' || activeNavigatorTab === 'both') && (
          <div className={activeNavigatorTab === 'saham_syariah' ? 'space-y-3' : 'pt-5 border-t border-border/40 space-y-3'}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm sm:text-base">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <span>Saham Indeks Syariah (BEI / IDX)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                  Konstituen Saham Syariah Terpilih
                </span>
              </h3>

              {/* Category tabs: JII, JII70, ISSI */}
              <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border/60">
                {(Object.keys(INDICES_DATA) as IndexKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedStockIndex(key)}
                    className={cn(
                      "px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer",
                      selectedStockIndex === key
                        ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">{currentStockIndexData.description}</p>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={`Cari kode, nama emiten, atau sektor ${selectedStockIndex}...`}
                  value={stockSearchQuery}
                  onChange={(e) => setStockSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <span className="text-[11px] text-muted-foreground">
                Menampilkan <strong>{filteredStockCompanies.length}</strong> konstituen {selectedStockIndex}
              </span>
            </div>

            <div className="overflow-x-auto max-h-[300px] border border-border/60 rounded-xl bg-background/50">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-muted/90 backdrop-blur-xs z-10 border-b border-border/60">
                  <tr>
                    <th className="py-2.5 px-3.5 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Kode</th>
                    <th className="py-2.5 px-3.5 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Nama Perusahaan</th>
                    <th className="py-2.5 px-3.5 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Sektor</th>
                    <th className="py-2.5 px-3.5 font-bold uppercase tracking-wider text-[10px] text-muted-foreground text-right">Direct Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredStockCompanies.length > 0 ? (
                    filteredStockCompanies.map((c) => (
                      <tr key={c.ticker} className="hover:bg-muted/40 transition-colors">
                        <td className="py-2 px-3.5 font-mono font-bold text-primary">{c.ticker}</td>
                        <td className="py-2 px-3.5 font-medium text-foreground">{c.name}</td>
                        <td className="py-2 px-3.5 text-muted-foreground">
                          <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-semibold text-foreground/80">
                            {c.sector}
                          </span>
                        </td>
                        <td className="py-2 px-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`https://www.google.com/finance/quote/${c.ticker}:IDX`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted hover:bg-primary hover:text-primary-foreground text-foreground text-[10px] font-semibold transition-colors shrink-0"
                              title={`Buka Google Finance ${c.ticker}`}
                            >
                              <span>Finance</span>
                              <ExternalLink size={9} />
                            </a>
                            <a
                              href={`https://www.idx.co.id/id/perusahaan-tercatat/profil-perusahaan-tercatat/?kodeEmiten=${c.ticker}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-[10px] font-semibold transition-colors shrink-0"
                              title={`Buka Profil Emiten BEI ${c.ticker}`}
                            >
                              <span>IDX</span>
                              <ExternalLink size={9} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-muted-foreground">
                        Tidak ada saham ditemukan untuk pencarian "{stockSearchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-muted-foreground italic text-right">
              {selectedStockIndex === "JII"
                ? "* Daftar 30 konstituen JII adalah data evaluasi berkala BEI"
                : "* Menampilkan emiten syariah unggulan konstituen BEI"}
            </p>
          </div>
        )}
      </div>
    </div>
  )}

      {/* =========================================================================
          BAGIAN 3: 100 KOMODITAS UNGGULAN NASIONAL (KATALOG & INTELIJEN HARGA)
         ========================================================================= */}
      {(activeNavigatorTab !== 'national_indices' &&
        activeNavigatorTab !== 'indeks_harga_makro' &&
        activeNavigatorTab !== 'logam_mulia' &&
        activeNavigatorTab !== 'indeks_global' &&
        activeNavigatorTab !== 'saham_syariah' &&
        activeNavigatorTab !== 'spot_realtime') && (
        <div className="space-y-6">
          {activeNavigatorTab === 'both' && (
            <div className="flex items-center gap-2 pt-4 border-t border-border/60">
              <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="size-4" />
              </span>
              <h3 className="text-base font-bold text-foreground">
                Bagian 3: Katalog 100 Komoditas Unggulan Nasional
              </h3>
            </div>
          )}

          {/* Metrik KPI 100 Komoditas */}
          <div className="grid gap-3.5 grid-cols-2 lg:grid-cols-4">
            <MetrikCard
              ikon={<Package className="size-4" />}
              label="Total Terpantau"
              nilai={`${stats.total}`}
              catatan="100 komoditas acuan nasional"
            />
            <MetrikCard
              ikon={<ShieldAlert className="size-4" />}
              label="Subsidi & HET Gov"
              nilai={`${stats.subsidiCount + stats.hetCount}`}
              catatan="Pagu subsidi & regulasi HET"
            />
            <MetrikCard
              ikon={<CalendarClock className="size-4" />}
              label="Update Harian"
              nilai={`${stats.harianCount}`}
              catatan="Data spot & bursa komoditas"
            />
            <MetrikCard
              ikon={<Building2 className="size-4" />}
              label="Koneksi Sumber"
              nilai={`${COMMODITY_SOURCES.length}`}
              catatan="Kanal data instansi resmi"
            />
          </div>

          {/* Status Strip & Indikator Filter Aktif Komoditas */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-1 py-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">
                Menampilkan <strong className="text-foreground font-bold">{filteredData.length}</strong> dari {COMMODITY_DATA.length} komoditas acuan nasional
              </span>

              {/* Chips Filter Aktif */}
              {selectedPricingType !== 'Semua' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <ShieldAlert size={11} />
                  <span>Regulasi: {selectedPricingType}</span>
                  <button 
                    type="button" 
                    onClick={() => setSelectedPricingType('Semua')}
                    className="hover:opacity-80 p-0.5 rounded-full cursor-pointer"
                    title="Hapus filter regulasi"
                  >
                    <X size={10} />
                  </button>
                </span>
              )}

              {selectedCadence !== 'Semua' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                  <CalendarClock size={11} />
                  <span>Ritme: {selectedCadence}</span>
                  <button 
                    type="button" 
                    onClick={() => setSelectedCadence('Semua')}
                    className="hover:opacity-80 p-0.5 rounded-full cursor-pointer"
                    title="Hapus filter ritme"
                  >
                    <X size={10} />
                  </button>
                </span>
              )}

              {selectedSource !== 'Semua' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Building2 size={11} />
                  <span>Sumber: {selectedSource}</span>
                  <button 
                    type="button" 
                    onClick={() => setSelectedSource('Semua')}
                    className="hover:opacity-80 p-0.5 rounded-full cursor-pointer"
                    title="Hapus filter sumber"
                  >
                    <X size={10} />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                  <Search size={11} />
                  <span>Cari: &ldquo;{searchQuery}&rdquo;</span>
                  <button 
                    type="button" 
                    onClick={() => setSearchQuery('')}
                    className="hover:opacity-80 p-0.5 rounded-full cursor-pointer"
                    title="Hapus filter pencarian"
                  >
                    <X size={10} />
                  </button>
                </span>
              )}

              {sortBy !== 'id' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                  <ArrowUpDown size={11} />
                  <span>Urut: {sortBy === 'nama' ? 'Nama' : sortBy === 'harga' ? 'Harga' : 'Ritme'} ({sortDirection.toUpperCase()})</span>
                  <button 
                    type="button" 
                    onClick={() => { setSortBy('id'); setSortDirection('asc'); }}
                    className="hover:opacity-80 p-0.5 rounded-full cursor-pointer"
                    title="Kembalikan urutan default"
                  >
                    <X size={10} />
                  </button>
                </span>
              )}
            </div>

            {(searchQuery || selectedCadence !== 'Semua' || selectedPricingType !== 'Semua' || selectedSource !== 'Semua' || sortBy !== 'id') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCadence('Semua');
                  setSelectedPricingType('Semua');
                  setSelectedSource('Semua');
                  setSortBy('id');
                  setSortDirection('asc');
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <span>Reset Semua Filter</span>
                <X size={12} />
              </button>
            )}
          </div>


      {/* Area Daftar Komoditas (1 Halaman Lengkap) */}
      {filteredData.length === 0 ? (
        <Panel className="py-12">
          <Kosong pesan="Tidak ada komoditas yang sesuai filter pencarian." />
          <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                setSelectedCategory('Semua');
                setSelectedCadence('Semua');
                setSelectedSource('Semua');
                setSelectedPricingType('Semua');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-xl text-xs font-semibold hover:bg-secondary/80 transition-colors cursor-pointer"
            >
              Reset Seluruh Filter
            </button>
          </div>
        </Panel>
      ) : viewMode === 'table' ? (
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground">
                  <th className="py-3 px-4 font-semibold w-14 text-center">ID</th>
                  <th className="py-3 px-4 font-semibold">Komoditas & Kategori</th>
                  <th className="py-3 px-4 font-semibold">Harga Terkini</th>
                  <th className="py-3 px-4 font-semibold">Regulasi & Batas</th>
                  <th className="py-3 px-4 font-semibold">Sumber Resmi</th>
                  <th className="py-3 px-4 font-semibold text-right">Rincian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {filteredData.map((item) => {
                  const tagColor = 
                    item.jenisBatas === 'Subsidi' ? 'prospek' : 
                    item.jenisBatas === 'HET Pemerintah' ? 'berjalan' : 
                    item.jenisBatas === 'Spot Global' ? 'aktif' : 'todo';
                    
                  return (
                    <tr 
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="hover:bg-muted/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 text-center font-mono text-xs text-muted-foreground">
                        #{item.id.toString().padStart(3, '0')}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {item.nama}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {item.kategori}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {formatPrice(item.hargaTerbaru, item.mataUang, item.satuan)}
                        {item.perubahan24h !== 0 && (
                          <div className={`text-xs mt-0.5 flex items-center gap-1 ${
                            item.perubahan24h > 0 ? 'text-rose-500' : 'text-emerald-500'
                          }`}>
                            {item.perubahan24h > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            <span>{Math.abs(item.perubahan24h)}%</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <Pill value={tagColor} label={item.jenisBatas} />
                        <div className="text-xs text-muted-foreground truncate max-w-[240px] mt-1" title={item.statusRegulasi}>
                          {item.statusRegulasi}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-xs text-foreground font-medium truncate max-w-[170px]">
                          {item.sumberData}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          Update: {item.updateCadence}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.linkSumber && (
                            <a
                              href={item.linkSumber}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-2 py-1 text-xs font-semibold rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground text-foreground transition-colors inline-flex items-center gap-1"
                              title={`Direct Link Sumber Resmi: ${item.sumberData}`}
                            >
                              <span>Link</span>
                              <ExternalLink size={10} />
                            </a>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(item);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            Lihat
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
      ) : (
        /* Bentuk Gaya Kotak-Kotak Masing-Masing Kategori */
        <div className="space-y-6">
          {groupedCategories.map(({ category, items }) => {
            const meta = CATEGORY_META[category] || {
              icon: Package,
              color: 'text-primary',
              bgLight: 'bg-primary/10',
              desc: 'Kelompok komoditas'
            };
            const IconComp = meta.icon;

            return (
              <div
                key={category}
                className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xs space-y-4"
              >
                {/* Header Kotak Kategori */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <span className={cn("size-10 rounded-xl flex items-center justify-center shrink-0", meta.bgLight, meta.color)}>
                      <IconComp size={20} />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base sm:text-lg text-foreground">
                          {category}
                        </h3>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {items.length} Komoditas
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {meta.desc}
                      </p>
                    </div>
                  </div>

                  {selectedCategory === 'Semua' ? (
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-background hover:bg-muted border border-border text-foreground transition-all cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
                      title={`Fokus hanya pada kategori ${category}`}
                    >
                      <span>Fokus Kategori</span>
                      <ArrowUpRight size={13} className="text-muted-foreground" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('Semua')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      <span>Lihat Semua Kategori</span>
                    </button>
                  )}
                </div>

                {/* Grid Kotak-Kotak Kartu Komoditas dalam Kategori */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                  {items.map((item) => renderCommodityCard(item))}
                </div>
              </div>
            );
          })}
        </div>
      )}
        </div>
      )}

      {/* Modal Detail Komoditas Terpadu */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-card rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-border animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-border p-5 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">
                    #{selectedItem.id.toString().padStart(3, '0')}
                  </span>
                  <Pill 
                    value={
                      selectedItem.jenisBatas === 'Subsidi' ? 'prospek' : 
                      selectedItem.jenisBatas === 'HET Pemerintah' ? 'berjalan' : 
                      selectedItem.jenisBatas === 'Spot Global' ? 'aktif' : 'todo'
                    } 
                    label={selectedItem.jenisBatas} 
                  />
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  {selectedItem.nama}
                </h2>
                <p className="text-muted-foreground text-xs mt-0.5">{selectedItem.kategori}</p>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">Nilai Acuan</div>
                  <div className="text-xl font-bold text-foreground">
                    {formatPrice(selectedItem.hargaTerbaru, selectedItem.mataUang, selectedItem.satuan)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">Pembaruan</div>
                  <div className="text-xs font-semibold text-foreground">{selectedItem.tanggalUpdate}</div>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Spesifikasi Komoditas</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedItem.deskripsiSpesifikasi}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-1">Regulasi & Ketetapan</h4>
                  <div className="flex items-start gap-2 text-foreground p-2.5 rounded-lg bg-muted/40 border border-border">
                    <ShieldAlert size={15} className="text-amber-500 shrink-0 mt-0.5" />
                    <span className="leading-snug">{selectedItem.statusRegulasi}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 rounded-lg bg-muted/30 border border-border/60">
                    <span className="text-muted-foreground block text-[11px] mb-0.5">Sumber Data</span>
                    <span className="font-semibold text-foreground">{selectedItem.sumberData}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-muted/30 border border-border/60">
                    <span className="text-muted-foreground block text-[11px] mb-0.5">Frekuensi Update</span>
                    <span className="font-semibold text-foreground">{selectedItem.updateCadence}</span>
                  </div>
                </div>

                {selectedItem.linkSumber && (
                  <div className="pt-1">
                    <a
                      href={selectedItem.linkSumber}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between w-full p-2.5 rounded-xl border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors font-medium"
                    >
                      <span className="flex items-center gap-1.5">
                        <ExternalLink size={14} />
                        Kunjungi Portal Resmi Sumber
                      </span>
                      <span>&rarr;</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  const text = `${selectedItem.nama}: ${selectedItem.mataUang === 'USD' ? '$' : 'Rp '}${selectedItem.hargaTerbaru.toLocaleString()} / ${selectedItem.satuan} (${selectedItem.sumberData})`;
                  navigator.clipboard.writeText(text);
                  triggerNotify("Ringkasan komoditas disalin ke clipboard!");
                }}
                className="px-3.5 py-2 rounded-xl border border-border bg-background text-foreground text-xs font-semibold hover:bg-muted transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Copy size={14} />
                Salin Data
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer shadow-2xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Indeks Harga Makro (BPS & BI) */}
      {selectedMacroItem && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedMacroItem(null)}
        >
          <div
            className="bg-card rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-border flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-border p-5 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                    #{selectedMacroItem.number.toString().padStart(2, '0')}
                  </span>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400">
                    {selectedMacroItem.code}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                    {selectedMacroItem.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground leading-snug">
                  {selectedMacroItem.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tolok ukur resmi dirilis oleh {selectedMacroItem.sumberResmi} ({selectedMacroItem.frekuensiRilis})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMacroItem(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Highlight Skor Terkini */}
              <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-medium text-muted-foreground mb-0.5">Nilai Terkini & Tolok Ukur</div>
                  <div className="text-xl font-bold text-foreground">
                    {selectedMacroItem.formatNilai}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                    Basis: {selectedMacroItem.satuan}
                  </div>
                </div>
                <div className="sm:text-right flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                  <div className="text-xs font-bold text-emerald-500 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    <TrendingUp size={13} />
                    <span>{selectedMacroItem.perubahanYoY}</span>
                  </div>
                  {selectedMacroItem.perubahanMoM && (
                    <div className="text-[11px] text-muted-foreground font-medium">
                      {selectedMacroItem.perubahanMoM}
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Evaluasi */}
              <div>
                <h4 className="font-bold text-foreground mb-1.5">Status & Kondisi Terkini</h4>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/40 border border-border">
                  <Sparkles size={16} className="text-violet-500 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground leading-relaxed">
                    {selectedMacroItem.statusKategori}
                  </span>
                </div>
              </div>

              {/* Deskripsi & Metodologi BPS / BI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-muted/30 border border-border/70 space-y-1">
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <Layers size={13} className="text-violet-500" />
                    <span>Cakupan & Definisi</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    {selectedMacroItem.deskripsi}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-muted/30 border border-border/70 space-y-1">
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <Scale size={13} className="text-violet-500" />
                    <span>Metodologi Perhitungan</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    {selectedMacroItem.metodologi}
                  </p>
                </div>
              </div>

              {/* Tabel Subkomponen & Bobot */}
              <div>
                <h4 className="font-bold text-foreground mb-2 flex items-center justify-between">
                  <span>Rincian Subkomponen & Bobot</span>
                  <span className="text-[11px] font-normal text-muted-foreground">
                    {selectedMacroItem.subkomponen.length} Komponen Terdaftar
                  </span>
                </h4>
                <div className="overflow-x-auto border border-border/70 rounded-xl bg-background/50">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead className="bg-muted/80 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="py-2 px-3">Subkomponen</th>
                        <th className="py-2 px-3">Bobot</th>
                        <th className="py-2 px-3">Skor / Nilai</th>
                        <th className="py-2 px-3">Perubahan YoY</th>
                        <th className="py-2 px-3">Catatan Komoditas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {selectedMacroItem.subkomponen.map((sub, idx) => (
                        <tr key={idx} className="hover:bg-muted/30 transition-colors">
                          <td className="py-2 px-3 font-semibold text-foreground">{sub.name}</td>
                          <td className="py-2 px-3 font-mono text-muted-foreground">{sub.weight || '-'}</td>
                          <td className="py-2 px-3 font-bold text-foreground">{sub.score}</td>
                          <td className="py-2 px-3 font-semibold text-emerald-500">{sub.changeYoY}</td>
                          <td className="py-2 px-3 text-muted-foreground">{sub.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Riwayat Historis Periode */}
              <div>
                <h4 className="font-bold text-foreground mb-2">Riwayat Tren Periode Terakhir</h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {selectedMacroItem.historicalSeries.map((h, hIdx) => (
                    <div key={hIdx} className="p-2 rounded-xl bg-muted/40 border border-border text-center">
                      <div className="text-[10px] text-muted-foreground font-mono">{h.period}</div>
                      <div className="text-xs font-bold text-foreground mt-0.5">{h.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rilis & Sumber */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 rounded-lg bg-muted/30 border border-border/60">
                  <span className="text-muted-foreground block text-[10px] mb-0.5">Sumber Data Resmi</span>
                  <span className="font-semibold text-foreground text-[11px]">{selectedMacroItem.sumberResmi}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/30 border border-border/60">
                  <span className="text-muted-foreground block text-[10px] mb-0.5">Jadwal Publikasi</span>
                  <span className="font-semibold text-foreground text-[11px]">{selectedMacroItem.jadwalRilis}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  const text = `${selectedMacroItem.name} (${selectedMacroItem.code}): ${selectedMacroItem.formatNilai} | ${selectedMacroItem.perubahanYoY} | Sumber: ${selectedMacroItem.sumberResmi}`;
                  navigator.clipboard.writeText(text);
                  triggerNotify("Ringkasan indeks makro disalin ke clipboard!");
                }}
                className="px-3.5 py-2 rounded-xl border border-border bg-background text-foreground text-xs font-semibold hover:bg-muted transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Copy size={14} />
                Salin Ringkasan
              </button>
              <button
                type="button"
                onClick={() => setSelectedMacroItem(null)}
                className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer shadow-2xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Skema JSON */}
      {showJsonSchemaModal && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowJsonSchemaModal(false)}
        >
          <div 
            className="bg-card rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-border flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-border p-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Database size={16} className="text-primary" />
                  Struktur Skema JSON (100 Komoditas)
                </h3>
              </div>
              <button 
                onClick={() => setShowJsonSchemaModal(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 bg-muted/30 text-foreground font-mono text-xs overflow-y-auto flex-1">
              <pre>{JSON.stringify(COMMODITY_DATA.slice(0, 4), null, 2)}</pre>
              <div className="text-muted-foreground text-center py-3 italic font-sans text-xs">
                ... 96 item lainnya siap diekspor dalam format JSON lengkap.
              </div>
            </div>

            <div className="p-4 border-t border-border bg-card flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">
                Total: 100 entitas komoditas
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyJson}
                  className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Copy size={14} />
                  Salin Seluruh JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CommodityDashboard() {
  return (
    <AppShell 
      title="100 Komoditas & 10 Indeks Pembangunan" 
      subtitle="Pusat Intelijen Pasar Spot Komoditas Fisik, HET Pemerintah, Pagu Subsidi & 10 Indikator Kesejahteraan Nasional"
    >
      <div className="w-full max-w-[1720px] mx-auto p-4 sm:p-6 space-y-6">
        <CommodityDashboardSection />
      </div>
    </AppShell>
  );
}
