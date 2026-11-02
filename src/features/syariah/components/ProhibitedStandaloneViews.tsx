import React, { useState } from "react";
import {
  AlertOctagon,
  ShieldAlert,
  Dice5,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Sparkles,
  Calculator,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export type ProhibitedType = "riba" | "gharar" | "maysir";

export interface ProhibitedDetailInfo {
  id: ProhibitedType;
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
  klasifikasi: { name: string; desc: string }[];
  parameterBebas: string[];
  skemaAlur: { step: number; title: string; desc: string }[];
  contohPenerapan: string[];
}

export const PROHIBITED_DATA: Record<ProhibitedType, ProhibitedDetailInfo> = {
  riba: {
    id: "riba",
    title: "Riba",
    arabicName: "الربا",
    badge: "Usury / Bunga & Tambahan Batil",
    category: "Sharia Finance",
    icon: AlertOctagon,
    tagline: "Tambahan nilai tanpa imbalan riil dalam pinjaman dan pertukaran komoditas ribawi.",
    description:
      "Riba secara bahasa berarti bertambah atau tumbuh. Secara istilah syariat, riba adalah setiap tambahan yang disyaratkan dalam transaksi pinjaman utang-piutang tanpa adanya imbalan pengganti riil ('iwadh), atau pertukaran komoditas ribawi sejenis dengan kuantitas berbeda atau secara bertempo. Uang diposisikan murni sebagai alat tukar dan satuan hitung, bukan komoditas yang bisa diperjualbelikan dengan bunga waktu.",
    dalil: {
      text: "“...padahal Allah telah menghalalkan jual beli dan mengharamkan riba. Barangsiapa mendapat peringatan dari Tuhannya, lalu dia berhenti, maka apa yang telah diperolehnya dahulu menjadi miliknya dan urusannya (terserah) kepada Allah. Dan barangsiapa mengulangi, maka mereka itu penghuni neraka...”",
      source: "QS. Al-Baqarah (2): 275",
    },
    klasifikasi: [
      {
        name: "Riba Nasi'ah (Bunga Penangguhan)",
        desc: "Tambahan nilai yang disyaratkan karena adanya penangguhan waktu pembayaran utang atau pinjaman.",
      },
      {
        name: "Riba Fadhl (Pertukaran Berlebih)",
        desc: "Pertukaran barang ribawi yang sejenis dengan takaran atau timbangan yang berbeda (emas dg emas, perak dg perak, gandum dg gandum).",
      },
      {
        name: "Riba Qardh (Bunga Pinjaman)",
        desc: "Tambahan manfaat finansial atau materiil yang disyaratkan oleh pemberi pinjaman kepada peminjam sejak awal akad.",
      },
      {
        name: "Riba Jahiliyyah (Denda Berlipat)",
        desc: "Pelipatgandaan utang pokok karena debitur terlambat melunasi pinjaman pada waktu jatuh tempo.",
      },
    ],
    parameterBebas: [
      "Tidak ada klausul suku bunga tetap ataupun mengambang pada akad pinjaman",
      "Tidak mengenakan denda bunga keterlambatan yang dinikmati sebagai laba institusi",
      "Pertukaran komoditas ribawi sejenis wajib dilakukan secara tunai (yad bi yad) dan setara timbangan (sawa-an bi sawain)",
      "Hasil keuntungan diperoleh dari bagi hasil risiko riil (al-ghunmu bil ghurmi), bukan kepastian return atas pinjaman",
    ],
    skemaAlur: [
      {
        step: 1,
        title: "Identifikasi Sumber Bunga",
        desc: "Memeriksa rekening bank konvensional, obligasi bunga, atau deposito untuk mendeteksi pendapatan non-halal.",
      },
      {
        step: 2,
        title: "Pemisahan Rekening",
        desc: "Mengisolasi dana bunga dari modal pokok pribadi/usaha agar tidak bercampur.",
      },
      {
        step: 3,
        title: "Kalkulasi Purifikasi",
        desc: "Menghitung total bunga bersih yang telah terlanjur dikreditkan oleh institusi keuangan konvensional.",
      },
      {
        step: 4,
        title: "Penyaluran Maslahat Umum",
        desc: "Menyalurkan dana bunga untuk fasilitas sosial/umum (jalan, sanitasi, jembatan) tanpa niat mengharap pahala sedekah.",
      },
    ],
    contohPenerapan: [
      "Pemurnian Rekening Tabungan / Deposito Konvensional (Purifikasi)",
      "Migrasi Kredit Pemilikan Rumah (KPR Bunga) ke Murabahah / MMQ Syariah",
      "Audit Portofolio Saham Syariah (Batas Utang Berbasis Bunga Maksimal 45%)",
      "Skema Qardh al-Hasan untuk Pembiayaan Kebajikan Tanpa Bunga",
    ],
  },

  gharar: {
    id: "gharar",
    title: "Gharar",
    arabicName: "الغرر",
    badge: "Uncertainty / Ketidakpastian",
    category: "Sharia Finance",
    icon: ShieldAlert,
    tagline: "Ketidakjelasan dan risiko manipulatif pada objek, harga, atau penyerahan barang.",
    description:
      "Gharar adalah situasi di mana salah satu atau kedua belah pihak yang berakad berada dalam ketidaktahuan (jahalah) mengenai substansi esensial transaksi, baik menyangkut kualitas objek, takaran kuantitas, harga pasti, kepemilikan sah penjual, ataupun kesanggupan serah terima. Syariat mewajibkan transparansi penuh agar tidak terjadi sengketa dan eksploitasi di kemudian hari.",
    dalil: {
      text: "“Rasulullah shallallahu 'alaihi wa sallam melarang jual beli dengan lemparan batu (al-hashah) dan jual beli yang mengandung ketidakjelasan (gharar).”",
      source: "HR. Muslim no. 1513 & Abu Dawud",
    },
    klasifikasi: [
      {
        name: "Gharar Fahisy (Berat / Membatalkan)",
        desc: "Ketidakjelasan mayor pada unsur inti akad yang berpotensi tinggi memicu persengketaan, seperti menjual ikan di laut bebas atau janin dalam kandungan.",
      },
      {
        name: "Gharar Yasir (Ringan / Ditoleransi)",
        desc: "Ketidakjelasan minor yang lazim terjadi dan sulit dihindari tanpa merugikan para pihak, seperti membeli semangka atau pondasi bangunan tertimbun tanah.",
      },
      {
        name: "Gharar Mutawassith (Sedang)",
        desc: "Derajat ketidakjelasan tengah yang memerlukan mitigasi klausul deskriptif atau opsi khiyar (hak batal) bagi pembeli.",
      },
      {
        name: "Gharar Ash-Shifah (Spesifikasi)",
        desc: "Ketiadaan rincian jenis, dimensi, dan material barang yang dipesan secara online sehingga memicu penipuan ekspektasi.",
      },
    ],
    parameterBebas: [
      "Barang harus maujud (ada nyata) atau dapat dipastikan ketersediaannya sesuai standar akad salam/istishna'",
      "Harga disepakati secara pasti sejak awal penandatanganan akad tanpa klausul mengambang tak terduga",
      "Penjual telah memiliki hak kepemilikan sah atau wewenang keagenan resmi sebelum menjual barang",
      "Waktu penyerahan (delivery time) dan lokasi serah terima dapat dipastikan secara rasional",
    ],
    skemaAlur: [
      {
        step: 1,
        title: "Penetapan Spesifikasi Jelas",
        desc: "Mendokumentasikan kriteria teknis, dimensi, merek, dan standar mutu secara tertulis.",
      },
      {
        step: 2,
        title: "Kepastian Harga & Waktu",
        desc: "Menyepakati nominal harga final dan jadwal serah terima yang mengikat tanpa ambiguitas.",
      },
      {
        step: 3,
        title: "Verifikasi Kepemilikan (Qabdh)",
        desc: "Memastikan penjual memegang fisik atau dokumen kepemilikan yang sah atas aset yang diperjualbelikan.",
      },
      {
        step: 4,
        title: "Pemberian Hak Khiyar",
        desc: "Memberikan hak pemeriksaan barang kepada pembeli untuk membatalkan jika barang tidak sesuai spesifikasi.",
      },
    ],
    contohPenerapan: [
      "Audit Kontrak Jual Beli Online (E-Commerce & Dropship Berprinsip Syariah)",
      "Standardisasi Akad Pemesanan Barang Manufaktur (Istishna' & Salam)",
      "Penghapusan Klausul Asuransi Konvensional Mengambang Menjadi Takaful Tabarru'",
      "Klausul Khiyar Syarat & Khiyar Aib dalam Transaksi Properti / Kendaraan",
    ],
  },

  maysir: {
    id: "maysir",
    title: "Maysir",
    arabicName: "الميسر",
    badge: "Gambling / Zero-Sum Game",
    category: "Sharia Finance",
    icon: Dice5,
    tagline: "Pertaruhan untung-untungan di mana keuntungan satu pihak berakar dari kerugian mutlak pihak lain.",
    description:
      "Maysir (dan qimar) adalah setiap transaksi atau permainan yang menggantungkan hasil keuntungan materiil pada spekulasi acak, tebak-tebakan, atau kebetulan murni (untung-untungan). Dalam skema zero-sum game ini, tidak terjadi penciptaan nilai tambah ekonomi produktif; satu pihak meraup keuntungan semata-mata dengan cara menelan harta taruhan pihak lain yang dipaksa rugi secara mutlak.",
    dalil: {
      text: "“Wahai orang-orang yang beriman! Sesungguhnya minuman keras, berjudi, (berkorban untuk) berhala, dan mengundi nasib dengan anak panah, adalah perbuatan keji dan termasuk perbuatan setan. Maka jauhilah (perbuatan-perbuatan) itu agar kamu beruntung.”",
      source: "QS. Al-Ma'idah (5): 90",
    },
    klasifikasi: [
      {
        name: "Qimar (Perjudian Taruhan)",
        desc: "Setiap pertaruhan di mana seluruh pihak menyetorkan uang taruhan dan pemenang ditentukan oleh hasil tebakan atau permainan acak.",
      },
      {
        name: "Spekulasi Buta Finansial",
        desc: "Transaksi trading berisiko tinggi tanpa analisa fundamental atau underlying riil (seperti binary options atau derivatif tanpa aset riil).",
      },
      {
        name: "Undian Berbayar Tanpa Barang",
        desc: "Kupon undian yang dijual kepada publik semata-mata untuk mengundi hadiah uang tanpa adanya komoditas barang yang dibeli.",
      },
      {
        name: "Loot Box / Gacha Berbayar",
        desc: "Pembelian item digital acak di mana pembeli mempertaruhkan uang riil dengan harapan mendapatkan aset bernilai tinggi secara spekulatif.",
      },
    ],
    parameterBebas: [
      "Keuntungan didasarkan pada kerja produktif, bagi hasil usaha riil, atau pertukaran barang berharga",
      "Tidak ada uang taruhan yang hangus dan berpindah tangan semata-mata karena kalah tebak/undian acak",
      "Hadiah pada perlombaan/promosi tidak dipungut dari uang pendaftaran peserta yang saling memakan",
      "Instrumen investasi memiliki underlying aset halal yang dapat diverifikasi secara hukum dan fisik",
    ],
    skemaAlur: [
      {
        step: 1,
        title: "Pemeriksaan Model Bisnis",
        desc: "Mengevaluasi apakah terdapat mekanisme taruhan uang atau transfer kekayaan zero-sum.",
      },
      {
        step: 2,
        title: "Uji Underlying Asset Riil",
        desc: "Memastikan transaksi melibatkan komoditas, saham riil, atau jasa produktif yang diakui syariat.",
      },
      {
        step: 3,
        title: "Eliminasi Mekanisme Judi",
        desc: "Mengubah skema hadiah menjadi murni hibah promosi dari penyelenggara tanpa memungut uang taruhan.",
      },
      {
        step: 4,
        title: "Edukasi Risiko & Perlindungan Modal",
        desc: "Menghindari instrumen tebak harga tanpa lindung nilai halal (hedging syariah).",
      },
    ],
    contohPenerapan: [
      "Penyaringan Instrumen Derivatif Pasar Modal Syariah (Screening Efek Syariah)",
      "Penghindaran Binary Options, Judi Online & Game Berkedok Fintech",
      "Restrukturisasi Program Hadiah Promosi Bank Menjadi Hibah Murni Tabungan",
      "Trading Komoditas Fisik Terdaftar dengan Delivery Fisik Riil",
    ],
  },
};

export function StandaloneProhibitedApp({
  prohibitedId,
  onBack,
  onSelectProhibited,
}: {
  prohibitedId: ProhibitedType;
  onBack?: () => void;
  onSelectProhibited?: (id: ProhibitedType) => void;
}) {
  const data = PROHIBITED_DATA[prohibitedId];
  const Icon = data.icon;

  // 1. Riba Purifikasi Calculator state
  const [bungaDiterima, setBungaDiterima] = useState(2500000);
  const [pajakBunga, setPajakBunga] = useState(20);
  const [screenerAnswers, setScreenerAnswers] = useState({
    bungaPinjaman: false,
    dendaKeterlambatan: false,
    jaminanUntungModal: false,
  });

  // 2. Gharar Evaluator state
  const [ghararParams, setGhararParams] = useState({
    wujudBarang: true,
    hargaPasti: true,
    waktuKirim: true,
    kepemilikanSah: true,
    spesifikasiDetail: true,
  });

  // 3. Maysir Scanner state
  const [maysirType, setMaysirType] = useState<"riil" | "spekulasi">("riil");
  const [modalTransaksi, setModalTransaksi] = useState(10000000);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Math.max(0, val));
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div className="flex items-center gap-3">
          {onBack ? (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-card border border-border/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-xs"
              title="Kembali ke Semua Larangan"
            >
              <ArrowLeft size={18} />
            </button>
          ) : (
            <Link to="/"
              className="p-2 rounded-xl bg-card border border-border/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-xs"
              title="Kembali ke Semua Larangan"
            >
              <ArrowLeft size={18} />
            </Link>
          )}

          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span className="font-semibold text-rose-500">Sharia Finance</span>
              <span>•</span>
              <span>Larangan Muamalah</span>
              <span>•</span>
              <span className="font-medium text-foreground">{data.badge}</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {data.title}
              </h1>
              <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                {data.arabicName}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Switch Pills between Riba, Gharar, Maysir */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-hide">
          {(Object.keys(PROHIBITED_DATA) as ProhibitedType[]).map((key) => {
            const item = PROHIBITED_DATA[key];
            const isActive = key === prohibitedId;
            return (
              <button
                key={key}
                onClick={() => {
                  if (onSelectProhibited) onSelectProhibited(key);
                }}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer",
                  isActive
                    ? "bg-rose-500 text-white shadow-xs"
                    : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Explanations & Syariah Guidelines (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Card Overview */}
          <div className="bg-card border border-border/60 rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 shadow-xs">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-rose-500">
                  {data.badge}
                </span>
                <h2 className="text-lg font-bold text-foreground">{data.tagline}</h2>
              </div>
            </div>

            <p className="text-sm text-foreground/80 leading-relaxed mb-6">
              {data.description}
            </p>

            {/* Dalil Landasan Hukum */}
            <div className="bg-rose-500/5 border-l-4 border-l-rose-500 rounded-r-xl p-4 my-2">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                <BookOpen size={14} />
                <span>Landasan Dalil Pengharaman</span>
              </div>
              <p className="text-xs sm:text-sm italic text-foreground/90 leading-relaxed">
                {data.dalil.text}
              </p>
              <span className="block mt-2 text-[11px] font-semibold text-muted-foreground">
                {data.dalil.source}
              </span>
            </div>
          </div>

          {/* Klasifikasi & Bentuk Terlarang */}
          <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-500" />
              <span>Klasifikasi & Bentuk {data.title}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {data.klasifikasi.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-muted/40 border border-border/40 hover:border-rose-500/40 transition-colors"
                >
                  <h4 className="text-xs font-bold text-foreground mb-1">{item.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Parameter Bebas */}
          <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>Parameter Akad Bersih dari {data.title}</span>
            </h3>
            <ul className="space-y-2">
              {data.parameterBebas.map((param, idx) => (
                <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <span className="leading-snug text-foreground/90">{param}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skema Penanganan / Alur Solusi */}
          <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              <span>Langkah Penanganan & Mitigasi Syariah</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {data.skemaAlur.map((item) => (
                <div
                  key={item.step}
                  className="p-3.5 rounded-xl bg-secondary/40 border border-border/40"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-md bg-rose-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {item.step}
                    </span>
                    <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed pl-7">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Dedicated Interactive Tool & Screener (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-4">
          <div className="bg-card border-2 border-rose-500/20 rounded-2xl p-5 sm:p-6 shadow-md relative">
            <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-foreground text-sm sm:text-base">
                  Simulator & Audit {data.title}
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
                Interactive
              </span>
            </div>

            {/* RIBA TOOL: PURIFIKASI & SCREENER */}
            {prohibitedId === "riba" && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Kalkulator pembersihan (*purifikasi*) bunga bank konvensional dan deteksi klausul riba pada transaksi Anda.
                </p>

                {/* Input Bunga Bank */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Total Bunga Bank Diterima (Bruto)</span>
                      <span className="text-rose-500 font-bold">{formatRupiah(bungaDiterima)}</span>
                    </label>
                    <input
                      type="range"
                      min={100000}
                      max={50000000}
                      step={100000}
                      value={bungaDiterima}
                      onChange={(e) => setBungaDiterima(Number(e.target.value))}
                      className="w-full accent-rose-500 mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Potongan Pajak Bunga Bank</span>
                      <span className="text-primary font-bold">{pajakBunga}%</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={25}
                      step={5}
                      value={pajakBunga}
                      onChange={(e) => setPajakBunga(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>
                </div>

                {(() => {
                  const pajakNominal = (bungaDiterima * pajakBunga) / 100;
                  const bungaNettoWajibPurifikasi = bungaDiterima - pajakNominal;

                  return (
                    <div className="p-4 rounded-xl bg-muted/60 border border-border/60 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Bunga Bruto:</span>
                        <span className="font-semibold text-foreground">{formatRupiah(bungaDiterima)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Pajak Penghasilan Bunga ({pajakBunga}%):</span>
                        <span className="text-muted-foreground">-{formatRupiah(pajakNominal)}</span>
                      </div>
                      <div className="w-full h-px bg-border/80 my-1" />
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-bold text-foreground">Dana Wajib Dipurifikasi:</span>
                        <span className="font-extrabold text-rose-600 dark:text-rose-400">
                          {formatRupiah(bungaNettoWajibPurifikasi)}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                        Dana bunga ini wajib dikeluarkan seluruhnya untuk kepentingan fasilitas umum (jembatan, jalan, MCK) dan tidak boleh dimanfaatkan pribadi maupun dianggap sedekah berpahala.
                      </p>
                    </div>
                  );
                })()}

                {/* Checklist Cepat Riba Screener */}
                <div className="pt-2 border-t border-border/40">
                  <h4 className="text-xs font-bold text-foreground mb-2">Checklist Akad Bebas Riba:</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={screenerAnswers.bungaPinjaman}
                        onChange={(e) =>
                          setScreenerAnswers({ ...screenerAnswers, bungaPinjaman: e.target.checked })
                        }
                        className="rounded accent-rose-500"
                      />
                      <span>Terdapat bunga / persentase tambahan atas pokok utang</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={screenerAnswers.dendaKeterlambatan}
                        onChange={(e) =>
                          setScreenerAnswers({ ...screenerAnswers, dendaKeterlambatan: e.target.checked })
                        }
                        className="rounded accent-rose-500"
                      />
                      <span>Denda keterlambatan dinikmati sebagai pendapatan bank</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={screenerAnswers.jaminanUntungModal}
                        onChange={(e) =>
                          setScreenerAnswers({ ...screenerAnswers, jaminanUntungModal: e.target.checked })
                        }
                        className="rounded accent-rose-500"
                      />
                      <span>Pemilik modal dijamin untung tetap tanpa menanggung risiko</span>
                    </label>
                  </div>

                  {screenerAnswers.bungaPinjaman ||
                  screenerAnswers.dendaKeterlambatan ||
                  screenerAnswers.jaminanUntungModal ? (
                    <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                      <XCircle size={16} className="shrink-0" />
                      <span>Terindikasi Riba! Akad perlu direstrukturisasi sesuai syariah.</span>
                    </div>
                  ) : (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 size={16} className="shrink-0" />
                      <span>Bebas indikasi riba klausul utama.</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* GHARAR AUDITOR */}
            {prohibitedId === "gharar" && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Audit transparansi dan kejelasan akad untuk memastikan transaksi Anda bebas dari unsur ketidakpastian manipulatif.
                </p>

                <div className="space-y-2.5">
                  <label className="flex items-start gap-2 text-xs text-foreground cursor-pointer p-2 rounded-lg hover:bg-secondary/50">
                    <input
                      type="checkbox"
                      checked={ghararParams.wujudBarang}
                      onChange={(e) =>
                        setGhararParams({ ...ghararParams, wujudBarang: e.target.checked })
                      }
                      className="rounded accent-primary mt-0.5"
                    />
                    <div>
                      <span className="font-semibold block">Wujud Barang Nyata (Maujud)</span>
                      <span className="text-[11px] text-muted-foreground">Barang ada dan tidak spekulatif seperti menjual ikan yang belum tertangkap.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 text-xs text-foreground cursor-pointer p-2 rounded-lg hover:bg-secondary/50">
                    <input
                      type="checkbox"
                      checked={ghararParams.hargaPasti}
                      onChange={(e) =>
                        setGhararParams({ ...ghararParams, hargaPasti: e.target.checked })
                      }
                      className="rounded accent-primary mt-0.5"
                    />
                    <div>
                      <span className="font-semibold block">Harga Final Disepakati Sejak Awal</span>
                      <span className="text-[11px] text-muted-foreground">Harga tidak berubah secara sepihak atau menggantung di kemudian hari.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 text-xs text-foreground cursor-pointer p-2 rounded-lg hover:bg-secondary/50">
                    <input
                      type="checkbox"
                      checked={ghararParams.spesifikasiDetail}
                      onChange={(e) =>
                        setGhararParams({ ...ghararParams, spesifikasiDetail: e.target.checked })
                      }
                      className="rounded accent-primary mt-0.5"
                    />
                    <div>
                      <span className="font-semibold block">Deskripsi & Spesifikasi Terperinci</span>
                      <span className="text-[11px] text-muted-foreground">Ukuran, mutu, bahan, dan kondisi barang terdokumentasi jelas.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 text-xs text-foreground cursor-pointer p-2 rounded-lg hover:bg-secondary/50">
                    <input
                      type="checkbox"
                      checked={ghararParams.waktuKirim}
                      onChange={(e) =>
                        setGhararParams({ ...ghararParams, waktuKirim: e.target.checked })
                      }
                      className="rounded accent-primary mt-0.5"
                    />
                    <div>
                      <span className="font-semibold block">Kepastian Waktu & Tempat Serah Terima</span>
                      <span className="text-[11px] text-muted-foreground">Kedua pihak mengetahui kapan dan bagaimana barang diterima.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 text-xs text-foreground cursor-pointer p-2 rounded-lg hover:bg-secondary/50">
                    <input
                      type="checkbox"
                      checked={ghararParams.kepemilikanSah}
                      onChange={(e) =>
                        setGhararParams({ ...ghararParams, kepemilikanSah: e.target.checked })
                      }
                      className="rounded accent-primary mt-0.5"
                    />
                    <div>
                      <span className="font-semibold block">Penjual Memiliki Hak Sah (Qabdh)</span>
                      <span className="text-[11px] text-muted-foreground">Penjual bukan calo yang menjual barang orang lain tanpa izin sah.</span>
                    </div>
                  </label>
                </div>

                {(() => {
                  const score =
                    (Number(ghararParams.wujudBarang) +
                      Number(ghararParams.hargaPasti) +
                      Number(ghararParams.spesifikasiDetail) +
                      Number(ghararParams.waktuKirim) +
                      Number(ghararParams.kepemilikanSah)) *
                    20;

                  return (
                    <div className="mt-4 p-4 rounded-xl bg-muted/60 border border-border/60 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-foreground">Tingkat Transparansi Kontrak:</span>
                        <span
                          className={cn(
                            "font-extrabold text-sm",
                            score === 100
                              ? "text-emerald-600 dark:text-emerald-400"
                              : score >= 60
                              ? "text-amber-500"
                              : "text-rose-500",
                          )}
                        >
                          {score}%
                        </span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all duration-300",
                            score === 100
                              ? "bg-emerald-500"
                              : score >= 60
                              ? "bg-amber-500"
                              : "bg-rose-500",
                          )}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground pt-1">
                        {score === 100
                          ? "Status: Bebas Gharar Fahisy. Akad memenuhi syarat kejelasan muamalah."
                          : "Status: Masih terdapat poin ketidakjelasan yang wajib diperbaiki sebelum tanda tangan akad."}
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* MAYSIR SCANNER */}
            {prohibitedId === "maysir" && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Bandingkan perbedaan fundamental antara risiko bisnis produktif (*Tijarah*) dan pertaruhan judi / spekulasi buta (*Maysir*).
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMaysirType("riil")}
                    className={cn(
                      "p-2.5 rounded-xl text-xs font-semibold border cursor-pointer transition-all flex flex-col items-center gap-1",
                      maysirType === "riil"
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                        : "bg-secondary border-border/40 text-muted-foreground",
                    )}
                  >
                    <CheckCircle2 size={16} />
                    <span>Bisnis Riil (Halal)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMaysirType("spekulasi")}
                    className={cn(
                      "p-2.5 rounded-xl text-xs font-semibold border cursor-pointer transition-all flex flex-col items-center gap-1",
                      maysirType === "spekulasi"
                        ? "bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400"
                        : "bg-secondary border-border/40 text-muted-foreground",
                    )}
                  >
                    <Dice5 size={16} />
                    <span>Maysir / Judi (Haram)</span>
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground flex justify-between">
                    <span>Simulasi Alokasi Modal</span>
                    <span className="text-primary font-bold">{formatRupiah(modalTransaksi)}</span>
                  </label>
                  <input
                    type="range"
                    min={1000000}
                    max={50000000}
                    step={1000000}
                    value={modalTransaksi}
                    onChange={(e) => setModalTransaksi(Number(e.target.value))}
                    className="w-full accent-primary mt-1"
                  />
                </div>

                {maysirType === "riil" ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2 text-foreground/90">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block text-sm">
                      Karakteristik Usaha Riil (Tijarah):
                    </span>
                    <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
                      <li>Ada aset/jasa riil bernilai yang diperjualbelikan</li>
                      <li>Risiko wajar dihadapi bersama (Win-Win Solution)</li>
                      <li>Menciptakan perputaran uang dan lapangan kerja bagi umat</li>
                      <li>Jika rugi, aset sisa tetap memiliki nilai residu fisik</li>
                    </ul>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs space-y-2 text-foreground/90">
                    <span className="font-bold text-rose-600 dark:text-rose-400 block text-sm">
                      Karakteristik Maysir (Zero-Sum Game):
                    </span>
                    <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
                      <li>Uang taruhan hangus total 100% jika tebakan meleset</li>
                      <li>Satu pihak untung di atas penderitaan mutlak pihak lain</li>
                      <li>Tidak menghasilkan nilai tambah ekonomi apa pun (mandul)</li>
                      <li>Memicu kecanduan, kebangkrutan instan, dan kriminalitas</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
