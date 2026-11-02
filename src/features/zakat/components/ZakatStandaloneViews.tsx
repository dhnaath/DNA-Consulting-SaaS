import React, { useState } from "react";
import {
  Briefcase,
  Scale,
  Users,
  Save,
  Check,
  Calculator,
  Sparkles,
  BookOpen,
  ArrowLeft,
  Coins,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../../syariah/lib/AuthContext";
import { useSaveCalculation } from "../../syariah/lib/useSaveCalculation";

export type ZakatType = "penghasilan" | "maal" | "fitrah";

export interface ZakatDetailInfo {
  id: ZakatType;
  title: string;
  arabicName: string;
  badge: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  description: string;
  dalil: {
    text: string;
    source: string;
  };
  syaratWajib: string[];
  ketentuanNisab: {
    nisabTitle: string;
    nisabDesc: string;
    kadar: string;
    haul: string;
  };
  asnafPenerima: { name: string; desc: string }[];
  skemaAlur: { step: number; title: string; desc: string }[];
  panduanEdukasi: string[];
}

export const ZAKAT_DATA: Record<ZakatType, ZakatDetailInfo> = {
  penghasilan: {
    id: "penghasilan",
    title: "Zakat Penghasilan",
    arabicName: "زكاة الدخل والمهن",
    badge: "Zakat Profesi",
    category: "Zakat",
    icon: Briefcase,
    tagline: "Kewajiban zakat atas perolehan gaji, upah, honorarium, atau bonus kerja setelah mencapai nisab.",
    description:
      "Zakat Penghasilan atau Zakat Profesi adalah zakat yang dikeluarkan dari penghasilan yang diperoleh dari profesi, pekerjaan halal, atau keahlian tertentu secara rutin bulanan maupun insidental (seperti gaji, bonus, dividen aktif, honor narasumber). Landasan fatwa merujuk pada Fatwa MUI No. 3 Tahun 2003 dan SK BAZNAS RI, diqiyaskan pada zakat pertanian dalam hal waktu penunaian (setiap menerima pendapatan) dan diqiyaskan pada zakat emas untuk kadar zakat (2.5%) serta batas minimal nishab (setara 85 gram emas per tahun).",
    dalil: {
      text: "“Wahai orang-orang yang beriman! Infakkanlah sebagian dari hasil usahamu yang baik-baik dan sebagian dari apa yang Kami keluarkan dari bumi untuk kamu...”",
      source: "QS. Al-Baqarah (2): 267",
    },
    syaratWajib: [
      "Beragama Islam dan merdeka",
      "Harta diperoleh melalui profesi atau usaha halal yang sah",
      "Total penghasilan neto dalam 1 tahun mencapai nishab (setara 85 gram emas)",
      "Kepemilikan penuh (al-milk at-tamm) dan telah dipotong kebutuhan asasi keluarga",
    ],
    ketentuanNisab: {
      nisabTitle: "85 Gram Emas / Tahun",
      nisabDesc: "Setara ~7.08 gram emas / bulan (atau ~Rp 10.270.000 / bln dg asumsi emas Rp 1.450.000/g)",
      kadar: "2.5% dari Pendapatan",
      haul: "Ditunaikan setiap bulan saat menerima gaji atau per tahun akumulatif",
    },
    asnafPenerima: [
      { name: "Fakir & Miskin", desc: "Pemberdayaan ekonomi keluarga prasejahtera dan pemenuhan sembako." },
      { name: "Amil Zakat", desc: "Pengelola amanah resmi yang menghimpun dan mendistribusikan zakat." },
      { name: "Gharimin", desc: "Orang yang terlilit utang mendesak demi kebutuhan pokok bukan kemaksiatan." },
      { name: "Fisabilillah", desc: "Dakwah Islam, beasiswa pendidikan mustahik, dan kesehatan umat." },
    ],
    skemaAlur: [
      { step: 1, title: "Hitung Total Pemasukan", desc: "Jumlahkan gaji pokok bulanan, tunjangan, dan bonus tambahan yang diterima." },
      { step: 2, title: "Kurangi Kebutuhan Pokok", desc: "Hitung pendapatan neto setelah dikurangi kebutuhan primer pangan, tempat tinggal & utang jatuh tempo." },
      { step: 3, title: "Uji Nisab Bulanan", desc: "Bandingkan pendapatan neto dengan batas nisab bulanan (7.08 gram emas)." },
      { step: 4, title: "Tunaikan 2.5%", desc: "Bila mencapai nisab, tunaikan 2.5% melalui lembaga amil zakat resmi terpercaya." },
    ],
    panduanEdukasi: [
      "Metode Bruto: Menghitung 2.5% dari penghasilan kotor sebelum potongan (lebih afdhal dan ikhtiar kehati-hatian).",
      "Metode Neto: Menghitung 2.5% setelah dikurangi pengeluaran primer keluarga dan cicilan utang pokok.",
      "Jika penghasilan bulanan belum mencapai nisab, dianjurkan memperbanyak infak dan sedekah sukarela.",
    ],
  },
  maal: {
    id: "maal",
    title: "Zakat Maal",
    arabicName: "زكاة المال والمدخرات",
    badge: "Zakat Harta Simpanan",
    category: "Zakat",
    icon: Scale,
    tagline: "Zakat atas harta kekayaan likuid, tabungan, deposito, dan emas yang telah mengendap satu tahun (haul).",
    description:
      "Zakat Maal (harta) adalah kewajiban zakat atas segala jenis kekayaan yang dimiliki seseorang yang secara prinsip dapat berkembang atau bernilai simpanan tinggi. Objek zakat maal mencakup uang tunai, tabungan bank, deposito, logam mulia emas/perak murni, reksadana, surat berharga likuid, serta piutang lancar. Harta ini wajib dizakati apabila nilainya mencapai nishab 85 gram emas dan telah genap tersimpan selama 1 tahun hijriah (haul).",
    dalil: {
      text: "“Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan dan mensucikan mereka dan berdoalah untuk mereka...”",
      source: "QS. At-Taubah (9): 103",
    },
    syaratWajib: [
      "Milik penuh secara sah tanpa sengketa kepemilikan",
      "Harta berkembang (al-nama') atau berpotensi likuid",
      "Telah mencapai nishab setara harga 85 gram emas murni",
      "Telah melewati masa haul (tersimpan selama 1 tahun penuh di atas nisab)",
      "Bebas dari utang jatuh tempo yang menuntut pelunasan segera",
    ],
    ketentuanNisab: {
      nisabTitle: "85 Gram Emas Murni",
      nisabDesc: "Contoh: Rp 123.250.000 (jika harga emas Rp 1.450.000/gram)",
      kadar: "2.5% dari Total Aset Mengendap",
      haul: "Wajib mengendap selama 1 tahun (354 hari hijriah / 365 hari masehi)",
    },
    asnafPenerima: [
      { name: "Fakir & Miskin", desc: "Pengentasan kemiskinan ekstrem dan modal usaha mikro produktif." },
      { name: "Mualaf", desc: "Penguatan akidah dan integrasi ekonomi saudara baru muslim." },
      { name: "Ibnu Sabil", desc: "Musafir yang kehabisan bekal dalam perjalanan ketaatan atau studi." },
      { name: "Riqab & Amil", desc: "Pembebasan dari jerat ketidakadilan finansial dan operasional amil resmi." },
    ],
    skemaAlur: [
      { step: 1, title: "Inventarisasi Simpanan", desc: "Kumpulkan data saldo rekening, deposito, tabungan emas, dan aset kas lancar." },
      { step: 2, title: "Kurangi Utang Jatuh Tempo", desc: "Kurangkan dengan liabilitas/kewajiban utang yang harus dilunasi dalam tahun berjalan." },
      { step: 3, title: "Verifikasi Haul & Nisab", desc: "Pastikan saldo mengendap di atas nishab 85 gram emas selama 1 tahun berturut-turut." },
      { step: 4, title: "Keluarkan 2.5%", desc: "Tunaikan zakat maal sebesar 2.5% untuk disalurkan kepada 8 golongan mustahik." },
    ],
    panduanEdukasi: [
      "Perhiasan emas yang dipakai sehari-hari secara wajar oleh wanita muslimah tidak dikenakan zakat menurut jumhur ulama.",
      "Emas batangan atau perhiasan yang disimpan sebagai investasi cadangan wajib dizakati jika mencapai 85 gram.",
      "Zakat tabungan dihitung dari saldo akhir mengendap setelah genap masa haul 1 tahun.",
    ],
  },
  fitrah: {
    id: "fitrah",
    title: "Zakat Fitrah",
    arabicName: "زكاة الفطر المباركة",
    badge: "Zakat Jiwa",
    category: "Zakat",
    icon: Users,
    tagline: "Zakat penyuci jiwa bagi setiap muslim dan tanggungannya menjelang Hari Raya Idul Fitri.",
    description:
      "Zakat Fitrah adalah zakat jiwa yang diwajibkan atas setiap individu muslim (laki-laki, perempuan, dewasa, anak-anak, hingga bayi yang lahir sebelum terbenam matahari akhir Ramadhan) yang memiliki kelebihan makanan untuk sehari semalam pada Hari Raya Idul Fitri. Berfungsi menyucikan orang yang berpuasa dari perkataan sia-sia dan kotor, serta memberi kegembiraan makan bagi kaum fakir miskin di hari raya.",
    dalil: {
      text: "“Rasulullah ﷺ mewajibkan zakat fitrah sebanyak satu sha' kurma atau satu sha' gandum atas setiap orang muslim; hamba maupun merdeka, laki-laki maupun perempuan, kecil maupun besar...”",
      source: "HR. Bukhari no. 1503 & Muslim no. 984",
    },
    syaratWajib: [
      "Beragama Islam dan hidup pada saat matahari terbenam di malam Idul Fitri",
      "Mempunyai kelebihan makanan atau harta dari kebutuhan pokok diri dan tanggungannya untuk hari raya",
      "Kewajiban ditanggung oleh kepala keluarga untuk seluruh tanggungan nafkahnya",
    ],
    ketentuanNisab: {
      nisabTitle: "1 Sha' (2.5 Kg / 3.5 Liter Beras)",
      nisabDesc: "Setara makanan pokok yang biasa dikonsumsi sehari-hari oleh keluarga bersangkutan",
      kadar: "2.5 Kg / Jiwa (atau dikonversi uang tunai setara)",
      haul: "Tidak ada haul — wajib ditunaikan pada bulan Ramadhan hingga sebelum salat Idul Fitri",
    },
    asnafPenerima: [
      { name: "Fakir", desc: "Prioritas utama penerima zakat fitrah agar cukup makanan di hari raya." },
      { name: "Miskin", desc: "Keluarga yang penghasilannya tidak mencukupi kebutuhan pokok makanan." },
      { name: "Amil Fitrah", desc: "Panitia zakat masjid / musala yang mendistribusikan beras fitrah tepat waktu." },
    ],
    skemaAlur: [
      { step: 1, title: "Hitung Jumlah Jiwa", desc: "Data kepala keluarga, pasangan, anak-anak, dan orang tua/asisten yang menjadi tanggungan nafkah." },
      { step: 2, title: "Tentukan Jenis Pembayaran", desc: "Pilih pembayaran menggunakan beras fisik (2.5 kg/jiwa) atau dikonversi uang tunai." },
      { step: 3, title: "Niat Zakat Fitrah", desc: "Lafalkan niat zakat fitrah untuk diri sendiri atau mewakili anggota keluarga yang ditanggung." },
      { step: 4, title: "Serahkan Sebelum Salat Id", desc: "Serahkan kepada amil zakat sebelum pelaksanaan salat Idul Fitri agar sah sebagai zakat fitrah." },
    ],
    panduanEdukasi: [
      "Waktu Mubah: Sejak awal masuknya bulan Ramadhan.",
      "Waktu Wajib: Sejak terbenam matahari akhir Ramadhan sampai sebelum salat Idul Fitri.",
      "Waktu Haram: Membayar setelah selesai salat Idul Fitri tanpa uzur syar'i (terhitung sedekah biasa).",
    ],
  },
};

interface StandaloneZakatAppProps {
  zakatId: ZakatType;
  onNavigateZakat?: (id: ZakatType) => void;
}

export function StandaloneZakatApp({
  zakatId,
  onNavigateZakat,
}: StandaloneZakatAppProps) {
  const data = ZAKAT_DATA[zakatId] || ZAKAT_DATA.penghasilan;
  const { user } = useAuth();

  // Save calculation hooks
  const { save: savePenghasilan, status: statusPenghasilan } =
    useSaveCalculation("zakat_penghasilan");
  const { save: saveMaal, status: statusMaal } = useSaveCalculation("zakat_maal");
  const { save: saveFitrah, status: statusFitrah } = useSaveCalculation("zakat_fitrah");

  // Global Gold Price setting
  const [goldPrice, setGoldPrice] = useState<number>(1450000); // 1.45jt / gr
  const nisabGold85Tahunan = 85 * goldPrice; // Nisab tahunan 85 gram

  // 1. Zakat Penghasilan States
  const [monthlyIncome, setMonthlyIncome] = useState<number>(12000000);
  const [otherIncome, setOtherIncome] = useState<number>(2000000);
  const [pokokPengeluaran, setPokokPengeluaran] = useState<number>(0); // metode neto

  // 2. Zakat Maal States
  const [cashSavings, setCashSavings] = useState<number>(75000000);
  const [goldGrams, setGoldGrams] = useState<number>(35);
  const [investasiLikuid, setInvestasiLikuid] = useState<number>(40000000);
  const [utangJatuhTempo, setUtangJatuhTempo] = useState<number>(15000000);

  // 3. Zakat Fitrah States
  const [familyMembers, setFamilyMembers] = useState<number>(4);
  const [ricePricePerKg, setRicePricePerKg] = useState<number>(16000);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSwitchApp = (id: ZakatType) => {
    if (onNavigateZakat) {
      onNavigateZakat(id);
    }
  };

  const IconComponent = data.icon;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted/70 border border-border/40"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Launcher</span>
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <span className="text-xs font-semibold text-primary px-2.5 py-1 rounded-md bg-primary/10">
            Kategori: Zakat
          </span>
        </div>

        {/* Quick App Switcher */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60 self-start sm:self-auto overflow-x-auto">
          {(["penghasilan", "maal", "fitrah"] as ZakatType[]).map((typeKey) => {
            const item = ZAKAT_DATA[typeKey];
            const isActive = zakatId === typeKey;
            return (
              <button
                key={typeKey}
                onClick={() => handleSwitchApp(typeKey)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5",
                  isActive
                    ? "bg-background text-foreground shadow-sm font-semibold border border-border/80"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-secondary/30 border border-border/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/20">
                {data.badge}
              </span>
              <span className="text-xs text-muted-foreground">Kategori: {data.category}</span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {data.title}
              </h1>
              <span className="text-lg sm:text-xl font-serif text-primary/80 font-normal">
                {data.arabicName}
              </span>
            </div>

            <p className="text-sm font-medium text-foreground/80 leading-relaxed">
              {data.tagline}
            </p>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {data.description}
            </p>
          </div>

          {/* Right Icon Box & Nisab Badge */}
          <div className="shrink-0 flex md:flex-col items-center gap-4 bg-muted/40 p-4 rounded-xl border border-border/60">
            <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <IconComponent className="w-7 h-7" />
            </div>
            <div className="text-left md:text-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                Kadar Zakat
              </span>
              <span className="text-sm font-extrabold text-primary">
                {data.ketentuanNisab.kadar}
              </span>
            </div>
          </div>
        </div>

        {/* Dalil Box */}
        <div className="mt-6 pt-5 border-t border-border/60 flex flex-col sm:flex-row gap-3 items-start bg-primary/5 p-4 rounded-xl border border-primary/15">
          <BookOpen className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs sm:text-sm italic text-foreground/90 font-serif leading-relaxed">
              {data.dalil.text}
            </p>
            <span className="text-[11px] font-semibold text-primary block">
              — {data.dalil.source}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Info + Interactive Standalone Tool */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Ketentuan, Rukun, Asnaf (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card Ketentuan Nisab & Haul */}
          <div className="bg-card rounded-xl border border-border/60 p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Scale size={15} className="text-primary" />
              <span>Ketentuan Nisab & Haul</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/50 border border-border/40">
                <span className="text-[11px] text-muted-foreground block font-medium">Batas Minimal (Nisab):</span>
                <span className="text-sm font-bold text-foreground">{data.ketentuanNisab.nisabTitle}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{data.ketentuanNisab.nisabDesc}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-lg bg-muted/50 border border-border/40">
                  <span className="text-[11px] text-muted-foreground block font-medium">Kadar Zakat:</span>
                  <span className="text-xs font-bold text-primary">{data.ketentuanNisab.kadar}</span>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border border-border/40">
                  <span className="text-[11px] text-muted-foreground block font-medium">Masa Haul:</span>
                  <span className="text-xs font-bold text-foreground">{data.ketentuanNisab.haul}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Syarat Wajib */}
          <div className="bg-card rounded-xl border border-border/60 p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <CheckCircle2 size={15} className="text-primary" />
              <span>Syarat Sah & Wajib Zakat</span>
            </h3>
            <ul className="space-y-2">
              {data.syaratWajib.map((syarat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-foreground/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  <span>{syarat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Alur Pembayaran */}
          <div className="bg-card rounded-xl border border-border/60 p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Sparkles size={15} className="text-primary" />
              <span>Alur & Prosedur Penunaian</span>
            </h3>
            <div className="space-y-2.5">
              {data.skemaAlur.map((step) => (
                <div key={step.step} className="flex gap-3 items-start p-2.5 rounded-lg bg-muted/30 border border-border/30">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    {step.step}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-foreground block">{step.title}</span>
                    <span className="text-[11px] text-muted-foreground block leading-relaxed">{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 8 Asnaf Penerima Zakat */}
          <div className="bg-card rounded-xl border border-border/60 p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Users size={15} className="text-primary" />
              <span>Mustahik (Penerima Manfaat Zakat)</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {data.asnafPenerima.map((asnaf, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-muted/40 border border-border/30">
                  <span className="text-xs font-bold text-primary block">{asnaf.name}</span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5 leading-snug">{asnaf.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Standalone Simulator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card rounded-2xl border border-border/80 p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Calculator size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Kalkulator Standalone {data.title}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    Perhitungan otomatis & verifikasi nisab real-time
                  </span>
                </div>
              </div>

              {/* Harga Emas Setting */}
              {(zakatId === "penghasilan" || zakatId === "maal") && (
                <div className="flex items-center gap-2 bg-muted/60 px-3 py-1.5 rounded-lg border border-border/50 text-xs">
                  <Coins size={14} className="text-amber-500 shrink-0" />
                  <span className="text-muted-foreground">Harga Emas:</span>
                  <input
                    type="number"
                    value={goldPrice}
                    onChange={(e) => setGoldPrice(Number(e.target.value))}
                    className="w-24 bg-background border border-border/60 rounded px-1.5 py-0.5 text-xs text-right font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <span className="text-[10px] text-muted-foreground">/gr</span>
                </div>
              )}
            </div>

            {/* SIMULATOR: ZAKAT PENGHASILAN */}
            {zakatId === "penghasilan" && (() => {
              const totalBulananKotor = monthlyIncome + otherIncome;
              const totalBulananNeto = Math.max(0, totalBulananKotor - pokokPengeluaran);
              const totalTahunanNeto = totalBulananNeto * 12;
              const isWajib = totalTahunanNeto >= nisabGold85Tahunan;
              const zakatPerBulan = isWajib ? Math.round(totalBulananNeto * 0.025) : 0;
              const zakatPerTahun = zakatPerBulan * 12;

              return (
                <div className="space-y-5">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground flex justify-between">
                        <span>Gaji Pokok / Penghasilan Rutin Bulanan</span>
                        <span className="text-primary font-bold">{formatIDR(monthlyIncome)}</span>
                      </label>
                      <input
                        type="range"
                        min={3000000}
                        max={80000000}
                        step={500000}
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                        className="w-full accent-primary mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground flex justify-between">
                        <span>Tunjangan & Pendapatan Lain Bulanan</span>
                        <span className="text-primary font-bold">{formatIDR(otherIncome)}</span>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={30000000}
                        step={250000}
                        value={otherIncome}
                        onChange={(e) => setOtherIncome(Number(e.target.value))}
                        className="w-full accent-primary mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground flex justify-between">
                        <span>Kebutuhan Pokok Asasi & Utang Mendesak (Metode Neto)</span>
                        <span className="text-muted-foreground font-bold">{formatIDR(pokokPengeluaran)}</span>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={25000000}
                        step={250000}
                        value={pokokPengeluaran}
                        onChange={(e) => setPokokPengeluaran(Number(e.target.value))}
                        className="w-full accent-primary mt-1"
                      />
                      <span className="text-[11px] text-muted-foreground">
                        *Jika memilih metode bruto (tanpa potongan pengeluaran pokok), biarkan Rp 0.
                      </span>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-5 rounded-xl bg-muted/60 border border-border/60 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Total Pemasukan Bersih / Bulan:</span>
                      <span className="font-bold text-foreground">{formatIDR(totalBulananNeto)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Proyeksi Pemasukan 1 Tahun:</span>
                      <span className="font-semibold text-foreground">{formatIDR(totalTahunanNeto)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Batas Nisab Emas (85 gr / thn):</span>
                      <span className="font-semibold text-foreground">{formatIDR(nisabGold85Tahunan)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Status Kewajiban:</span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                          isWajib
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-muted text-muted-foreground border border-border"
                        )}
                      >
                        {isWajib ? "Wajib Zakat (2.5%)" : "Belum Wajib Zakat (Di bawah nisab)"}
                      </span>
                    </div>

                    <div className="w-full h-px bg-border/80 my-2" />

                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <span className="text-xs text-muted-foreground block">
                          Zakat Penghasilan Ditunaikan per Bulan:
                        </span>
                        <span className="text-2xl font-extrabold text-primary">
                          {formatIDR(zakatPerBulan)}
                        </span>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-[11px] text-muted-foreground block">
                          Setara per tahun:
                        </span>
                        <span className="text-xs font-bold text-foreground">
                          {formatIDR(zakatPerTahun)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {user && isWajib && (
                    <button
                      onClick={() =>
                        savePenghasilan(
                          `Zakat Penghasilan — ${formatIDR(zakatPerBulan)}/bln`,
                          { monthlyIncome, otherIncome, pokokPengeluaran, goldPrice },
                          { zakatPerBulan, zakatPerTahun }
                        )
                      }
                      disabled={statusPenghasilan !== "idle"}
                      className="w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-sm"
                    >
                      {statusPenghasilan === "idle" && (
                        <>
                          <Save size={15} /> Simpan ke Riwayat Zakat
                        </>
                      )}
                      {statusPenghasilan === "saving" && "Menyimpan ke akun..."}
                      {statusPenghasilan === "saved" && (
                        <>
                          <Check size={15} /> Berhasil Tersimpan
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })()}

            {/* SIMULATOR: ZAKAT MAAL */}
            {zakatId === "maal" && (() => {
              const goldValue = goldGrams * goldPrice;
              const totalAsetKotor = cashSavings + goldValue + investasiLikuid;
              const totalAsetNeto = Math.max(0, totalAsetKotor - utangJatuhTempo);
              const isWajibMaal = totalAsetNeto >= nisabGold85Tahunan;
              const zakatMaalWajib = isWajibMaal ? Math.round(totalAsetNeto * 0.025) : 0;

              return (
                <div className="space-y-5">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground flex justify-between">
                        <span>Saldo Tabungan, Deposito & Kas Tunai</span>
                        <span className="text-primary font-bold">{formatIDR(cashSavings)}</span>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={300000000}
                        step={2500000}
                        value={cashSavings}
                        onChange={(e) => setCashSavings(Number(e.target.value))}
                        className="w-full accent-primary mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground flex justify-between">
                        <span>Emas Batangan / Logam Mulia Simpanan</span>
                        <span className="text-primary font-bold">{goldGrams} Gram ({formatIDR(goldValue)})</span>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={200}
                        step={1}
                        value={goldGrams}
                        onChange={(e) => setGoldGrams(Number(e.target.value))}
                        className="w-full accent-primary mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground flex justify-between">
                        <span>Investasi Likuid & Piutang Lancar</span>
                        <span className="text-primary font-bold">{formatIDR(investasiLikuid)}</span>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={200000000}
                        step={2000000}
                        value={investasiLikuid}
                        onChange={(e) => setInvestasiLikuid(Number(e.target.value))}
                        className="w-full accent-primary mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground flex justify-between">
                        <span>Utang Jangka Pendek Jatuh Tempo</span>
                        <span className="text-rose-500 font-bold">{formatIDR(utangJatuhTempo)}</span>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={100000000}
                        step={1000000}
                        value={utangJatuhTempo}
                        onChange={(e) => setUtangJatuhTempo(Number(e.target.value))}
                        className="w-full accent-primary mt-1"
                      />
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-5 rounded-xl bg-muted/60 border border-border/60 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Total Nilai Harta Mengendap (Neto):</span>
                      <span className="font-bold text-foreground">{formatIDR(totalAsetNeto)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Batas Nisab Emas (85 Gram):</span>
                      <span className="font-semibold text-foreground">{formatIDR(nisabGold85Tahunan)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Syarat Haul (1 Tahun Tersimpan):</span>
                      <span className="font-semibold text-foreground">Wajib Terpenuhi</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Status Kewajiban:</span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                          isWajibMaal
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-muted text-muted-foreground border border-border"
                        )}
                      >
                        {isWajibMaal ? "Wajib Zakat Maal (2.5%)" : "Belum Wajib Zakat (Di bawah nisab)"}
                      </span>
                    </div>

                    <div className="w-full h-px bg-border/80 my-2" />

                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <span className="text-xs text-muted-foreground block">
                          Total Zakat Maal yang Wajib Dikeluarkan:
                        </span>
                        <span className="text-2xl font-extrabold text-primary">
                          {formatIDR(zakatMaalWajib)}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground italic sm:text-right">
                        *Dikeluarkan sekali setiap genap haul 1 tahun kepemilikan.
                      </span>
                    </div>
                  </div>

                  {user && isWajibMaal && (
                    <button
                      onClick={() =>
                        saveMaal(
                          `Zakat Maal — ${formatIDR(zakatMaalWajib)}`,
                          { cashSavings, goldGrams, investasiLikuid, utangJatuhTempo, goldPrice },
                          { totalAsetNeto, zakatMaalWajib }
                        )
                      }
                      disabled={statusMaal !== "idle"}
                      className="w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-sm"
                    >
                      {statusMaal === "idle" && (
                        <>
                          <Save size={15} /> Simpan ke Riwayat Zakat
                        </>
                      )}
                      {statusMaal === "saving" && "Menyimpan ke akun..."}
                      {statusMaal === "saved" && (
                        <>
                          <Check size={15} /> Berhasil Tersimpan
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })()}

            {/* SIMULATOR: ZAKAT FITRAH */}
            {zakatId === "fitrah" && (() => {
              const beratTotalBeras = familyMembers * 2.5; // 2.5 kg/jiwa
              const totalUangFitrah = beratTotalBeras * ricePricePerKg;

              return (
                <div className="space-y-5">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground flex justify-between">
                        <span>Jumlah Anggota Keluarga & Tanggungan Nafkah</span>
                        <span className="text-primary font-bold">{familyMembers} Jiwa</span>
                      </label>
                      <input
                        type="range"
                        min={1}
                        max={15}
                        step={1}
                        value={familyMembers}
                        onChange={(e) => setFamilyMembers(Number(e.target.value))}
                        className="w-full accent-primary mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground flex justify-between">
                        <span>Harga Beras Makanan Pokok per Kg</span>
                        <span className="text-primary font-bold">{formatIDR(ricePricePerKg)} / kg</span>
                      </label>
                      <input
                        type="range"
                        min={12000}
                        max={30000}
                        step={500}
                        value={ricePricePerKg}
                        onChange={(e) => setRicePricePerKg(Number(e.target.value))}
                        className="w-full accent-primary mt-1"
                      />
                      <div className="flex gap-2 mt-2">
                        {[
                          { label: "Medium (14.000)", val: 14000 },
                          { label: "Premium (16.500)", val: 16500 },
                          { label: "Super (20.000)", val: 20000 },
                        ].map((btn) => (
                          <button
                            key={btn.val}
                            type="button"
                            onClick={() => setRicePricePerKg(btn.val)}
                            className="px-2.5 py-1 rounded bg-muted text-[10px] font-medium hover:bg-muted/80 text-foreground border border-border/50"
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-5 rounded-xl bg-muted/60 border border-border/60 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Ketentuan Takaran per Jiwa:</span>
                      <span className="font-bold text-foreground">2.5 Kg (1 Sha') Beras</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Total Fisik Beras yang Diserahkan:</span>
                      <span className="font-bold text-primary">{beratTotalBeras} Kg Beras</span>
                    </div>
                    <div className="w-full h-px bg-border/80 my-2" />
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <span className="text-xs text-muted-foreground block">
                          Konversi Uang Tunai Total ({familyMembers} Jiwa):
                        </span>
                        <span className="text-2xl font-extrabold text-primary">
                          {formatIDR(totalUangFitrah)}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground italic sm:text-right">
                        Setara ~{formatIDR(2.5 * ricePricePerKg)} / jiwa
                      </span>
                    </div>
                  </div>

                  {user && (
                    <button
                      onClick={() =>
                        saveFitrah(
                          `Zakat Fitrah — ${familyMembers} Jiwa (${formatIDR(totalUangFitrah)})`,
                          { familyMembers, ricePricePerKg },
                          { beratTotalBeras, totalUangFitrah }
                        )
                      }
                      disabled={statusFitrah !== "idle"}
                      className="w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-sm"
                    >
                      {statusFitrah === "idle" && (
                        <>
                          <Save size={15} /> Simpan ke Riwayat Zakat
                        </>
                      )}
                      {statusFitrah === "saving" && "Menyimpan ke akun..."}
                      {statusFitrah === "saved" && (
                        <>
                          <Check size={15} /> Berhasil Tersimpan
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })()}

            {/* Bottom tips */}
            <div className="pt-3 border-t border-border/50 text-[11px] text-muted-foreground space-y-1">
              <span className="font-semibold text-foreground flex items-center gap-1">
                <HelpCircle size={13} className="text-primary" /> Catatan Fatwa:
              </span>
              <ul className="list-disc pl-4 space-y-0.5">
                {data.panduanEdukasi.map((panduan, idx) => (
                  <li key={idx}>{panduan}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
