import React, { useState } from "react";
import {
  Calculator,
  TrendingUp,
  Briefcase,
  ShoppingCart,
  Save,
  Check,
  ArrowLeft,
  Sparkles,
  Percent,
  Receipt,
  ShieldCheck,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../../syariah/lib/AuthContext";
import { useSaveCalculation } from "../../syariah/lib/useSaveCalculation";

export type TaxAppType = "pph21" | "saham" | "properti" | "ppn";

export interface TaxDetailInfo {
  id: TaxAppType;
  title: string;
  badge: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  description: string;
  rumusUtama: {
    formula: string;
    description: string;
  };
  prinsipPenting: { title: string; desc: string }[];
  skemaAlur: { step: number; title: string; desc: string }[];
  panduanStrategi: string[];
}

export const TAX_APPS: Record<TaxAppType, TaxDetailInfo> = {
  pph21: {
    id: "pph21",
    title: "PPh 21 Personal",
    badge: "Pajak Penghasilan",
    category: "Pajak Personal",
    icon: Calculator,
    tagline:
      "Simulasi perhitungan Pajak Penghasilan (PPh 21) Wajib Pajak Orang Pribadi berdasar lapisan tarif progresif UU HPP & PTKP terbaru.",
    description:
      "PPh Pasal 21 adalah pajak atas penghasilan berupa gaji, upah, honorarium, tunjangan, dan pembayaran lain sehubungan dengan pekerjaan, jabatan, jasa, dan kegiatan yang dilakukan oleh orang pribadi subjek pajak dalam negeri. Perhitungan menggunakan skema Penghasilan Kena Pajak (PKP) setelah dikurangi Penghasilan Tidak Kena Pajak (PTKP).",
    rumusUtama: {
      formula: "PKP = Penghasilan Bruto - PTKP; Total Pajak = ∑ (Lapisan PKP × Tarif Progresif)",
      description:
        "Lapisan UU HPP: 5% (s/d Rp 60 Juta), 15% (> Rp 60 - 250 Juta), 25% (> Rp 250 - 500 Juta), 30% (> Rp 500 Juta - 5 Miliar), 35% (> Rp 5 Miliar).",
    },
    prinsipPenting: [
      {
        title: "Penghasilan Tidak Kena Pajak (PTKP)",
        desc: "Batas pengurang penghasilan dasar: Wajib Pajak Pribadi (Rp 54 Juta), status kawin (+Rp 4,5 Juta), dan tanggungan maksimal 3 orang (+Rp 4,5 Juta/orang).",
      },
      {
        title: "Tarif Progresif Multi-Lapisan",
        desc: "Penghasilan tidak dikenai satu tarif flat, melainkan dipecah berjenjang mengikuti braket bracket pajak untuk menjaga asas keadilan perpajakan.",
      },
      {
        title: "Bukti Potong 1721-A1 / A2",
        desc: "Bagi karyawan, PPh 21 dipotong pemberi kerja setiap bulan dan dikreditkan dalam SPT Tahunan Orang Pribadi Formulir 1770 S atau 1770 SS.",
      },
      {
        title: "Kewajiban Pelaporan SPT",
        desc: "Meskipun pajak telah dipotong perusahaan, pelaporan SPT Tahunan paling lambat tanggal 31 Maret tahun pajak berikutnya tetap bersifat wajib.",
      },
    ],
    skemaAlur: [
      {
        step: 1,
        title: "Hitung Penghasilan Bruto",
        desc: "Akumulasikan seluruh gaji pokok, tunjangan, bonus, dan premi asuransi yang dibayarkan pemberi kerja selama setahun.",
      },
      {
        step: 2,
        title: "Tentukan Status PTKP",
        desc: "Pilih status keluarga per 1 Januari tahun pajak (TK/0 sampai K/3) untuk memperoleh batas pengurang bebas pajak.",
      },
      {
        step: 3,
        title: "Dapatkan Nilai PKP",
        desc: "Kurangkan penghasilan bruto dengan PTKP. Jika hasilnya nol atau negatif, maka PPh 21 Terutang nihil.",
      },
      {
        step: 4,
        title: "Terapkan Tarif Progresif",
        desc: "Alokasikan PKP ke dalam tier tarif 5%, 15%, 25%, 30%, dan 35% hingga diperoleh estimasi total pajak terutang.",
      },
    ],
    panduanStrategi: [
      "Periksa rincian bukti potong 1721-A1 dari perusahaan untuk memastikan kesesuaian PTKP dan pemotongan bulanan.",
      "Manfaatkan pengurang yang diakui regulasi seperti iuran pensiun dan zakat/sumbangan keagamaan pada lembaga resmi yang disahkan pemerintah.",
      "Bagi pekerja lepas (freelancer) atau profesional, manfaatkan Norma Penghitungan Penghasilan Neto (NPPN) jika omzet bruto tahunan di bawah Rp 4,8 Miliar.",
      "Laporkan seluruh kepemilikan aset dan utang dalam SPT Tahunan agar tidak timbul surat teguran atau SP2DK dari DJP.",
    ],
  },
  saham: {
    id: "saham",
    title: "Pajak Saham & Dividen",
    badge: "PPh Final Pasar Modal",
    category: "Pajak Investasi",
    icon: TrendingUp,
    tagline:
      "Kalkulator PPh Final atas transaksi penjualan saham di Bursa Efek Indonesia (0.1%) dan penerimaan dividen (10%).",
    description:
      "Penghasilan dari transaksi penjualan saham di bursa efek dikenakan PPh Pasal 4 ayat (2) yang bersifat Final sebesar 0.1% dari nilai bruto penjualan. Sedangkan dividen yang diterima oleh investor perorangan dalam negeri dikenakan tarif PPh Final 10%, yang dapat dibebaskan dari pajak jika diinvestasikan kembali ke instrumen dalam negeri minimal 3 tahun.",
    rumusUtama: {
      formula: "PPh Final Saham = 0.1% × Nilai Jual; PPh Final Dividen = 10% × Total Dividen",
      description:
        "Pajak penjualan dipotong otomatis oleh broker/sekuritas saat transaksi settlement. Pajak dividen dipotong emiten/kustodian KSEI.",
    },
    prinsipPenting: [
      {
        title: "Sifat Pajak Final (Pasal 4 ayat 2)",
        desc: "Pajak yang telah dipotong tidak dapat dikreditkan pada SPT Tahunan dan keuntungan modal (capital gain) tidak dihitung ulang secara progresif.",
      },
      {
        title: "Insentif Reinvestasi Dividen UU Cipta Kerja",
        desc: "Dividen dari dalam negeri yang diterima Wajib Pajak Orang Pribadi dikecualikan dari objek PPh (0%) jika diinvestasikan kembali dalam kurun waktu 3 tahun.",
      },
      {
        title: "Pemotongan Otomatis Sekuritas",
        desc: "Setiap order jual (sell transaction) yang matched di BEI langsung dipotong 0.1% ditambah pungutan levy bursa dan PPN atas biaya broker.",
      },
      {
        title: "Kewajiban Pelaporan Portofolio",
        desc: "Portofolio saham per 31 Desember wajib dicantumkan pada daftar harta SPT Tahunan dengan nilai perolehan (historical cost).",
      },
    ],
    skemaAlur: [
      {
        step: 1,
        title: "Input Nilai Penjualan Saham",
        desc: "Masukkan total akumulasi nilai penjualan saham kotor (gross volume jual) yang telah dieksekusi di bursa efek.",
      },
      {
        step: 2,
        title: "Kalkulasi Pajak Transaksi Jual",
        desc: "Sistem menghitung otomatis PPh Final 0.1% yang menjadi hak kas negara dari transaksi bursa.",
      },
      {
        step: 3,
        title: "Input Penerimaan Dividen",
        desc: "Masukkan total dividen tunai yang diterima dari emiten selama tahun berjalan.",
      },
      {
        step: 4,
        title: "Evaluasi Pajak Dividen & Insentif",
        desc: "Tentukan apakah dividen ditarik konsumtif (terkena PPh 10%) atau diinvestasikan kembali (bebas pajak).",
      },
    ],
    panduanStrategi: [
      "Manfaatkan fasilitas bebas pajak dividen dengan menyalurkan kembali dividen ke instrumen saham, reksa dana, SBN, atau emas fisik.",
      "Unduh laporan tahunan (statement of account) dan rincian transaksi dari aplikasi sekuritas untuk lampiran SPT Tahunan.",
      "Saham pendiri (founder shares) dikenakan tambahan PPh Final 0.5% pada saat penawaran umum perdana (IPO).",
      "Catat nilai perolehan rata-rata (average cost) secara rapi sebagai dasar pengisian kolom Harta pada formulir SPT.",
    ],
  },
  properti: {
    id: "properti",
    title: "Pajak Properti",
    badge: "PPh Final & BPHTB",
    category: "Pajak Properti & Bisnis",
    icon: Briefcase,
    tagline:
      "Perhitungan komprehensif PPh Final Penjualan Properti (2.5%), BPHTB Pembeli (5%), dan PPh Sewa Properti (10%).",
    description:
      "Transaksi jual beli properti melibatkan dua sisi kewajiban: Penjual wajib melunasi PPh Final Pengalihan Hak atas Tanah dan/atau Bangunan sebesar 2.5%, sedangkan Pembeli membayar Bea Perolehan Hak atas Tanah dan Bangunan (BPHTB) sebesar 5% dari nilai perolehan setelah dikurangi NPOPTKP daerah. Sedangkan penghasilan sewa tanah/bangunan dikenakan PPh Final 10%.",
    rumusUtama: {
      formula: "PPh Jual = 2.5% × Nilai; BPHTB = 5% × (Nilai - NPOPTKP); PPh Sewa = 10% × Nilai Sewa",
      description:
        "Nilai transaksi yang dipakai adalah nilai tertinggi antara nilai kesepakatan riil akta jual beli (AJB) dengan NJOP PBB.",
    },
    prinsipPenting: [
      {
        title: "PPh Final Penjual 2.5%",
        desc: "Dikenakan kepada pihak yang mengalihkan hak atas tanah/bangunan sebelum penandatanganan AJB oleh Pejabat Pembuat Akta Tanah (PPAT).",
      },
      {
        title: "BPHTB Pembeli 5%",
        desc: "Pajak daerah yang dipungut pemerintah kabupaten/kota atas perolehan hak, dengan batas pengurang bebas pajak (NPOPTKP) lokal.",
      },
      {
        title: "PPh Final Sewa 10%",
        desc: "Penghasilan dari persewaan tanah dan/atau bangunan dikenakan tarif final 10% dipotong oleh penyewa berbadan hukum atau disetor sendiri.",
      },
      {
        title: "Validasi NTPN di Kantor Pajak",
        desc: "Bukti bayar PPh pengalihan hak wajib divalidasi oleh KPP setempat sebelum sertifikat hak milik/HGB dapat dibalik nama oleh BPN.",
      },
    ],
    skemaAlur: [
      {
        step: 1,
        title: "Tentukan Nilai Transaksi & NJOP",
        desc: "Bandingkan harga transaksi kesepakatan dengan Nilai Jual Objek Pajak (NJOP) SPPT PBB tahun berjalan.",
      },
      {
        step: 2,
        title: "Hitung Pajak Penjual (PPh 2.5%)",
        desc: "Kalikan 2.5% dari nilai transaksi untuk pembayaran SSP PPh Final pengalihan hak oleh penjual.",
      },
      {
        step: 3,
        title: "Hitung BPHTB Pembeli",
        desc: "Kurangkan nilai transaksi dengan NPOPTKP wilayah (standar Rp 60-80 Juta) lalu kalikan 5%.",
      },
      {
        step: 4,
        title: "Hitung PPh Sewa Properti",
        desc: "Jika transaksi berupa persewaan, kalikan 10% dari total nilai kontrak sewa bruto.",
      },
    ],
    panduanStrategi: [
      "Pastikan bukti pembayaran PPh dan BPHTB diverifikasi dan divalidasi secara online melalui e-PHTB DJP sebelum jadwal AJB di notaris/PPAT.",
      "Periksa besaran NPOPTKP di Dispenda/Bapenda kabupaten/kota domisili objek properti karena tiap daerah memiliki perda berbeda.",
      "Untuk waris atau hibah wasiat garis lurus satu derajat, NPOPTKP dapat mencapai Rp 300 Juta sesuai ketentuan daerah.",
      "Simpan seluruh kuitansi, bukti potong sewa, dan salinan akta jual beli sebagai bukti kepemilikan dan kepatuhan audit perpajakan.",
    ],
  },
  ppn: {
    id: "ppn",
    title: "Pajak Pertambahan Nilai (PPN)",
    badge: "PPN 11%",
    category: "Pajak Transaksi Bisnis",
    icon: ShoppingCart,
    tagline:
      "Kalkulator PPN 11% atas Dasar Pengenaan Pajak (DPP) transaksi barang/jasa kena pajak serta perhitungan nilai sebelum/sesudah PPN.",
    description:
      "Pajak Pertambahan Nilai (PPN) adalah pajak konsumsi barang dan jasa kena pajak di dalam daerah pabean Indonesia. Berdasarkan UU Harmonisasi Peraturan Perpajakan (UU HPP), tarif umum PPN yang berlaku saat ini adalah 11%. Aplikasi ini memudahkan simulasi penghitungan dari harga eksklusif maupun inklusif pajak.",
    rumusUtama: {
      formula: "PPN = 11% × DPP; Harga Inklusif = DPP + PPN; DPP dari Inklusif = Harga / 1.11",
      description:
        "DPP (Dasar Pengenaan Pajak) adalah nilai transaksi sebenarnya yang disepakati sebelum pengenaan pajak pertambahan nilai.",
    },
    prinsipPenting: [
      {
        title: "Tarif Berlaku 11% (UU HPP)",
        desc: "Tarif standar PPN saat ini adalah 11% dan dipungut oleh Pengusaha Kena Pajak (PKP) atas setiap penyerahan BKP dan JKP.",
      },
      {
        title: "Pajak Masukan vs Pajak Keluaran",
        desc: "Bagi entitas bisnis PKP, PPN Keluaran yang dipungut dari pembeli dapat dikreditkan dengan PPN Masukan yang dibayar ke supplier.",
      },
      {
        title: "Faktur Pajak Elektronik (e-Faktur)",
        desc: "Setiap pungutan PPN wajib dibuatkan Faktur Pajak resmi melalui aplikasi e-Faktur DJP dan diberikan nomor seri faktur pajak (NSFP).",
      },
      {
        title: "Batas Threshold PKP Rp 4.8 Miliar",
        desc: "Wajib Pajak yang omzet usahanya melampaui Rp 4,8 Miliar per tahun buku diwajibkan mengukuhkan diri sebagai Pengusaha Kena Pajak.",
      },
    ],
    skemaAlur: [
      {
        step: 1,
        title: "Pilih Mode Perhitungan",
        desc: "Tentukan apakah nilai transaksi yang diketahui adalah harga sebelum pajak (DPP) atau harga total tagihan (inklusif PPN).",
      },
      {
        step: 2,
        title: "Input Nilai Transaksi",
        desc: "Masukkan nominal transaksi jual beli atau tagihan jasa yang menjadi objek PPN.",
      },
      {
        step: 3,
        title: "Hitung PPN & DPP",
        desc: "Kalkulasi otomatis porsi PPN 11% dan nilai dasar pengenaan pajak yang harus tertera dalam faktur pajak.",
      },
      {
        step: 4,
        title: "Simpan & Rekap Tagihan",
        desc: "Gunakan ringkasan hasil untuk pembuatan invoice penagihan klien atau pelaporan SPT Masa PPN 1111.",
      },
    ],
    panduanStrategi: [
      "Cantumkan rincian DPP dan PPN secara terpisah pada invoice komersial agar memudahkan bendahara atau lawan transaksi membuat bukti potong/pungut.",
      "Pastikan validasi NPWP dan NIK pembeli saat pembuatan e-Faktur agar tidak ditolak sistem DJP (approval sukses).",
      "Laporkan SPT Masa PPN paling lambat pada akhir bulan berikutnya setelah berakhirnya masa pajak yang bersangkutan.",
      "Manfaatkan fasilitas PPN tidak dipungut atau dibebaskan jika bertransaksi di Kawasan Berikat atau Kawasan Ekonomi Khusus (KEK).",
    ],
  },
};

const formatIDR = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

interface StandaloneTaxAppProps {
  appId: TaxAppType;
  onNavigateApp: (appId: TaxAppType) => void;
}

export function StandaloneTaxApp({ appId, onNavigateApp }: StandaloneTaxAppProps) {
  const currentApp = TAX_APPS[appId] || TAX_APPS.pph21;
  const { user } = useAuth();

  // Save hooks
  const { save: savePPh21, status: statusPPh21 } = useSaveCalculation("pajak_pph21");
  const { save: saveSaham, status: statusSaham } = useSaveCalculation("pajak_saham");
  const { save: saveProperti, status: statusProperti } = useSaveCalculation("pajak_properti");
  const { save: savePpn, status: statusPpn } = useSaveCalculation("pajak_ppn");

  // Calculator states
  // 1. PPh 21
  const [annualIncome, setAnnualIncome] = useState<number>(120000000);
  const [ptkpStatus, setPtkpStatus] = useState<number>(54000000);

  // 2. Saham & Dividen
  const [stockTransaction, setStockTransaction] = useState<number>(50000000);
  const [dividendIncome, setDividendIncome] = useState<number>(10000000);
  const [reinvestDividend, setReinvestDividend] = useState<boolean>(false);

  // 3. Properti
  const [propertyTransactionValue, setPropertyTransactionValue] = useState<number>(1000000000);
  const [npoptkp, setNpoptkp] = useState<number>(60000000);
  const [propertyRentValue, setPropertyRentValue] = useState<number>(50000000);

  // 4. PPN
  const [vatTransaction, setVatTransaction] = useState<number>(100000000);
  const [isInclusive, setIsInclusive] = useState<boolean>(false);

  // PPh 21 Calculation
  const calculatePPh21 = (income: number, ptkp: number) => {
    let pkp = income - ptkp;
    if (pkp <= 0) return { tax: 0, ptkp, pkp: 0, tiers: [] };

    let remainingPkp = pkp;
    let tax = 0;
    const tiers: { label: string; rate: number; amount: number; tax: number }[] = [];

    // Tier 1: 5% up to 60M
    if (remainingPkp > 0) {
      const tier1Amount = Math.min(remainingPkp, 60000000);
      const tier1Tax = tier1Amount * 0.05;
      tax += tier1Tax;
      remainingPkp -= tier1Amount;
      tiers.push({ label: "Lapisan I (s/d Rp 60 Juta)", rate: 5, amount: tier1Amount, tax: tier1Tax });
    }
    // Tier 2: 15% 60M - 250M (190M span)
    if (remainingPkp > 0) {
      const tier2Amount = Math.min(remainingPkp, 190000000);
      const tier2Tax = tier2Amount * 0.15;
      tax += tier2Tax;
      remainingPkp -= tier2Amount;
      tiers.push({ label: "Lapisan II (> Rp 60 - 250 Juta)", rate: 15, amount: tier2Amount, tax: tier2Tax });
    }
    // Tier 3: 25% 250M - 500M (250M span)
    if (remainingPkp > 0) {
      const tier3Amount = Math.min(remainingPkp, 250000000);
      const tier3Tax = tier3Amount * 0.25;
      tax += tier3Tax;
      remainingPkp -= tier3Amount;
      tiers.push({ label: "Lapisan III (> Rp 250 - 500 Juta)", rate: 25, amount: tier3Amount, tax: tier3Tax });
    }
    // Tier 4: 30% 500M - 5B (4.5B span)
    if (remainingPkp > 0) {
      const tier4Amount = Math.min(remainingPkp, 4500000000);
      const tier4Tax = tier4Amount * 0.3;
      tax += tier4Tax;
      remainingPkp -= tier4Amount;
      tiers.push({ label: "Lapisan IV (> Rp 500 Juta - 5 Miliar)", rate: 30, amount: tier4Amount, tax: tier4Tax });
    }
    // Tier 5: 35% > 5B
    if (remainingPkp > 0) {
      const tier5Amount = remainingPkp;
      const tier5Tax = tier5Amount * 0.35;
      tax += tier5Tax;
      tiers.push({ label: "Lapisan V (> Rp 5 Miliar)", rate: 35, amount: tier5Amount, tax: tier5Tax });
    }

    return { tax, ptkp, pkp, tiers };
  };

  const incomeTaxResult = calculatePPh21(annualIncome, ptkpStatus);
  const monthlyTax = Math.round(incomeTaxResult.tax / 12);
  const monthlyTakeHome = Math.max(0, Math.round((annualIncome - incomeTaxResult.tax) / 12));

  // Saham & Dividen Calculation
  const stockTaxResult = stockTransaction * 0.001;
  const dividendTaxResult = reinvestDividend ? 0 : dividendIncome * 0.1;
  const totalStockTax = stockTaxResult + dividendTaxResult;

  // Properti Calculation
  const pphPenjualanProperti = propertyTransactionValue * 0.025;
  const bphtbBasis = Math.max(0, propertyTransactionValue - npoptkp);
  const bphtbProperti = bphtbBasis * 0.05;
  const pphSewaProperti = propertyRentValue * 0.1;
  const totalPropertiTax = pphPenjualanProperti + bphtbProperti + pphSewaProperti;

  // PPN Calculation
  let dppValue = vatTransaction;
  let ppnAmount = vatTransaction * 0.11;
  let grandTotal = vatTransaction + ppnAmount;

  if (isInclusive) {
    dppValue = Math.round(vatTransaction / 1.11);
    ppnAmount = vatTransaction - dppValue;
    grandTotal = vatTransaction;
  }

  const allTaxAppsList: TaxAppType[] = ["pph21", "saham", "properti", "ppn"];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Top Breadcrumb & Return to Launcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            search={{ tab: "financial-planning" } as any}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Financial Planning</span>
          </Link>
          <span className="text-muted-foreground/60">/</span>
          <span className="text-muted-foreground font-medium">Liability & Expense</span>
          <span className="text-muted-foreground/60">/</span>
          <span className="text-primary font-semibold">{currentApp.title}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/60 px-3 py-1 rounded-full text-[11px] font-medium">
          <Sparkles className="size-3 text-amber-500" />
          <span>Standalone App</span>
        </div>
      </div>

      {/* Standalone Apps Switcher Pills */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-muted/40 rounded-2xl border border-border/50">
        {allTaxAppsList.map((key) => {
          const item = TAX_APPS[key];
          const Icon = item.icon;
          const isActive = appId === key;
          return (
            <button
              key={key}
              onClick={() => onNavigateApp(key)}
              className={cn(
                "flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 text-center",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md scale-[1.01] font-bold"
                  : "bg-background/80 text-muted-foreground hover:bg-background hover:text-foreground hover:shadow-xs",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{item.title}</span>
            </button>
          );
        })}
      </div>

      {/* Hero Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-border/80 bg-linear-to-br from-card via-card/90 to-primary/5 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-primary/10 text-primary border border-primary/20">
              {currentApp.badge}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
              {currentApp.category}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            <currentApp.icon className="size-7 sm:size-8 text-primary" />
            <span>{currentApp.title}</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {currentApp.description}
          </p>
        </div>

        {/* Formula Box */}
        <div className="mt-6 p-4 sm:p-5 rounded-xl bg-muted/60 border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="space-y-1">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Percent className="size-4 text-primary" />
              Formula & Ketentuan Utama
            </span>
            <code className="text-xs font-mono bg-background/80 px-2.5 py-1 rounded-md text-primary font-semibold block sm:inline-block border border-border/60">
              {currentApp.rumusUtama.formula}
            </code>
          </div>
          <p className="text-xs text-muted-foreground max-w-sm sm:text-right">
            {currentApp.rumusUtama.description}
          </p>
        </div>
      </div>

      {/* SIMULATOR SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* INPUT PANEL (7 Cols) */}
        <div className="lg:col-span-7 bg-card rounded-2xl border border-border p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Parameter & Input Kalkulasi
              </h2>
              <p className="text-xs text-muted-foreground">
                Sesuaikan nilai variabel untuk menghitung estimasi pajak secara akurat.
              </p>
            </div>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Calculator className="size-5" />
            </div>
          </div>

          {/* APP 1: PPh 21 */}
          {appId === "pph21" && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground/90">
                  Penghasilan Bruto Setahun
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-sm font-semibold text-muted-foreground">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1000000"
                    value={annualIncome || ""}
                    onChange={(e) => setAnnualIncome(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Contoh: 120000000"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                  <span>Estimasi Bruto Bulanan:</span>
                  <span className="font-semibold text-foreground">
                    {formatIDR(Math.round(annualIncome / 12))} / bulan
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground/90">
                  Status PTKP (Penghasilan Tidak Kena Pajak)
                </label>
                <select
                  value={ptkpStatus}
                  onChange={(e) => setPtkpStatus(Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                >
                  <option value={54000000}>TK/0 — Tidak Kawin, 0 Tanggungan (Rp 54 Juta)</option>
                  <option value={58500000}>TK/1 atau K/0 — Kawin, 0 Tanggungan (Rp 58,5 Juta)</option>
                  <option value={63000000}>TK/2 atau K/1 — Kawin, 1 Tanggungan (Rp 63 Juta)</option>
                  <option value={67500000}>TK/3 atau K/2 — Kawin, 2 Tanggungan (Rp 67,5 Juta)</option>
                  <option value={72000000}>K/3 — Kawin, 3 Tanggungan (Rp 72 Juta)</option>
                </select>
                <p className="text-[11px] text-muted-foreground px-1">
                  PTKP ditentukan per tanggal 1 Januari tahun pajak yang bersangkutan.
                </p>
              </div>

              {/* Tier Breakdown Table */}
              <div className="pt-3 border-t border-border/60 space-y-2.5">
                <span className="text-xs font-bold text-foreground block">
                  Rincian Lapisan Tarif Progresif (UU HPP):
                </span>
                {incomeTaxResult.tiers.length === 0 ? (
                  <div className="p-3 bg-muted/40 rounded-xl text-xs text-muted-foreground italic text-center">
                    Penghasilan di bawah PTKP. Bebas pajak PPh 21 (Nihil).
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {incomeTaxResult.tiers.map((t, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-muted/30 border border-border/50"
                      >
                        <div className="space-y-0.5">
                          <span className="font-semibold text-foreground">{t.label}</span>
                          <span className="block text-[10px] text-muted-foreground">
                            Alokasi PKP: {formatIDR(t.amount)} × {t.rate}%
                          </span>
                        </div>
                        <span className="font-bold text-primary">{formatIDR(t.tax)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* APP 2: Saham & Dividen */}
          {appId === "saham" && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground/90">
                  Total Transaksi Penjualan Saham (Gross Sell Order)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-sm font-semibold text-muted-foreground">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1000000"
                    value={stockTransaction || ""}
                    onChange={(e) => setStockTransaction(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Contoh: 50000000"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                  <span>Tarif PPh Final Transaksi:</span>
                  <span className="font-semibold text-foreground">0.1% dari nilai jual bruto</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground/90">
                  Total Penerimaan Dividen Tunai
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-sm font-semibold text-muted-foreground">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="500000"
                    value={dividendIncome || ""}
                    onChange={(e) => setDividendIncome(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Contoh: 10000000"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="reinvestCheck"
                  checked={reinvestDividend}
                  onChange={(e) => setReinvestDividend(e.target.checked)}
                  className="mt-0.5 size-4 rounded text-primary focus:ring-primary/20 cursor-pointer"
                />
                <label htmlFor="reinvestCheck" className="text-xs space-y-0.5 cursor-pointer">
                  <span className="font-semibold text-foreground block">
                    Dividen Diinvestasikan Kembali di Dalam Negeri (Bebas PPh 0%)
                  </span>
                  <span className="text-muted-foreground block text-[11px]">
                    Sesuai UU Cipta Kerja/HPP, dividen yang diinvestasikan kembali minimal 3 tahun
                    dikecualikan dari objek pajak penghasilan.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* APP 3: Properti */}
          {appId === "properti" && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground/90">
                  Nilai Transaksi Jual Beli Properti (AJB / NJOP tertinggi)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-sm font-semibold text-muted-foreground">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="10000000"
                    value={propertyTransactionValue || ""}
                    onChange={(e) => setPropertyTransactionValue(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Contoh: 1000000000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground/90">
                  NPOPTKP Daerah (Nilai Perolehan Objek Pajak Tidak Kena Pajak)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-sm font-semibold text-muted-foreground">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="5000000"
                    value={npoptkp || ""}
                    onChange={(e) => setNpoptkp(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Standar DKI / Kota: 60000000"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground px-1">
                  Umumnya Rp 60 - 80 Juta tergantung Peraturan Daerah masing-masing kabupaten/kota.
                </p>
              </div>

              <div className="pt-2 border-t border-border/60 space-y-2">
                <label className="text-xs font-semibold text-foreground/90">
                  Nilai Sewa Keseluruhan (Jika Transaksi Persewaan)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-sm font-semibold text-muted-foreground">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="5000000"
                    value={propertyRentValue || ""}
                    onChange={(e) => setPropertyRentValue(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Contoh: 50000000"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                  <span>Tarif PPh Final Sewa:</span>
                  <span className="font-semibold text-foreground">10% dari nilai sewa</span>
                </div>
              </div>
            </div>
          )}

          {/* APP 4: PPN */}
          {appId === "ppn" && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 p-1 bg-muted/60 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIsInclusive(false)}
                  className={cn(
                    "flex-1 py-2 text-xs font-semibold rounded-lg transition-all",
                    !isInclusive
                      ? "bg-background text-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Harga Sebelum Pajak (Eksklusif)
                </button>
                <button
                  type="button"
                  onClick={() => setIsInclusive(true)}
                  className={cn(
                    "flex-1 py-2 text-xs font-semibold rounded-lg transition-all",
                    isInclusive
                      ? "bg-background text-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Harga Total Tagihan (Inklusif PPN)
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground/90">
                  {isInclusive
                    ? "Total Tagihan Transaksi (Termasuk PPN 11%)"
                    : "Dasar Pengenaan Pajak (DPP) / Nilai Transaksi Bersih"}
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-sm font-semibold text-muted-foreground">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1000000"
                    value={vatTransaction || ""}
                    onChange={(e) => setVatTransaction(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Contoh: 100000000"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* OUTPUT SUMMARY PANEL (5 Cols) */}
        <div className="lg:col-span-5 bg-card rounded-2xl border border-border p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Ringkasan Hasil Perhitungan
              </h2>
              <p className="text-xs text-muted-foreground">
                Estimasi kewajiban perpajakan real-time
              </p>
            </div>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Receipt className="size-5" />
            </div>
          </div>

          {/* Output PPh 21 */}
          {appId === "pph21" && (
            <div className="space-y-5">
              <div className="space-y-3 pb-5 border-b border-border/60 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Penghasilan Bruto Setahun</span>
                  <span className="font-semibold text-foreground">{formatIDR(annualIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PTKP Dasar</span>
                  <span className="font-semibold text-foreground">
                    {formatIDR(incomeTaxResult.ptkp)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Penghasilan Kena Pajak (PKP)</span>
                  <span className="font-semibold text-foreground">
                    {formatIDR(Math.max(0, incomeTaxResult.pkp))}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">
                  Total PPh 21 Setahun
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {formatIDR(incomeTaxResult.tax)}
                </div>
                <span className="text-[11px] text-muted-foreground block">
                  Estimasi cicilan / potongan:{" "}
                  <strong className="text-foreground">{formatIDR(monthlyTax)} / bulan</strong>
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Estimasi Take Home Pay:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatIDR(monthlyTakeHome)} / bln
                </span>
              </div>

              {user && annualIncome > 0 && (
                <button
                  onClick={() =>
                    savePPh21(
                      `PPh 21 — ${formatIDR(incomeTaxResult.tax)}`,
                      { annualIncome, ptkpStatus },
                      { tax: incomeTaxResult.tax, monthlyTax, monthlyTakeHome },
                    )
                  }
                  disabled={statusPPh21 !== "idle"}
                  className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {statusPPh21 === "idle" && (
                    <>
                      <Save className="size-4" /> Simpan Hasil PPh 21
                    </>
                  )}
                  {statusPPh21 === "saving" && "Menyimpan..."}
                  {statusPPh21 === "saved" && (
                    <>
                      <Check className="size-4" /> Tersimpan
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Output Saham & Dividen */}
          {appId === "saham" && (
            <div className="space-y-5">
              <div className="space-y-3 pb-5 border-b border-border/60 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaksi Jual Saham</span>
                  <span className="font-semibold text-foreground">
                    {formatIDR(stockTransaction)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PPh Final Jual Saham (0.1%)</span>
                  <span className="font-semibold text-foreground">
                    {formatIDR(stockTaxResult)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border/40">
                  <span className="text-muted-foreground">Penerimaan Dividen</span>
                  <span className="font-semibold text-foreground">
                    {formatIDR(dividendIncome)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    PPh Final Dividen {reinvestDividend ? "(Bebas Pajak)" : "(10%)"}
                  </span>
                  <span
                    className={cn(
                      "font-semibold",
                      reinvestDividend ? "text-emerald-500 font-bold" : "text-foreground",
                    )}
                  >
                    {reinvestDividend ? "Rp 0 (Bebas)" : formatIDR(dividendTaxResult)}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">
                  Total PPh Final Pasar Modal
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {formatIDR(totalStockTax)}
                </div>
              </div>

              {user && (stockTransaction > 0 || dividendIncome > 0) && (
                <button
                  onClick={() =>
                    saveSaham(
                      `Pajak Saham — ${formatIDR(totalStockTax)}`,
                      { stockTransaction, dividendIncome, reinvestDividend },
                      { stockTaxResult, dividendTaxResult, totalStockTax },
                    )
                  }
                  disabled={statusSaham !== "idle"}
                  className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {statusSaham === "idle" && (
                    <>
                      <Save className="size-4" /> Simpan Hasil PPh Saham
                    </>
                  )}
                  {statusSaham === "saving" && "Menyimpan..."}
                  {statusSaham === "saved" && (
                    <>
                      <Check className="size-4" /> Tersimpan
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Output Properti */}
          {appId === "properti" && (
            <div className="space-y-5">
              <div className="space-y-3 pb-5 border-b border-border/60 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PPh Final Penjual (2.5%)</span>
                  <span className="font-semibold text-foreground">
                    {formatIDR(pphPenjualanProperti)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">BPHTB Pembeli (5% netto)</span>
                  <span className="font-semibold text-foreground">
                    {formatIDR(bphtbProperti)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PPh Final Sewa (10%)</span>
                  <span className="font-semibold text-foreground">
                    {formatIDR(pphSewaProperti)}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">
                  Total Estimasi Pajak Properti
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {formatIDR(totalPropertiTax)}
                </div>
                <span className="text-[11px] text-muted-foreground block">
                  Termasuk sisi Penjual, Pembeli, & Sewa
                </span>
              </div>

              {user && (propertyTransactionValue > 0 || propertyRentValue > 0) && (
                <button
                  onClick={() =>
                    saveProperti(
                      `Pajak Properti — ${formatIDR(totalPropertiTax)}`,
                      { propertyTransactionValue, npoptkp, propertyRentValue },
                      { pphPenjualanProperti, bphtbProperti, pphSewaProperti, totalPropertiTax },
                    )
                  }
                  disabled={statusProperti !== "idle"}
                  className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {statusProperti === "idle" && (
                    <>
                      <Save className="size-4" /> Simpan Hasil Pajak Properti
                    </>
                  )}
                  {statusProperti === "saving" && "Menyimpan..."}
                  {statusProperti === "saved" && (
                    <>
                      <Check className="size-4" /> Tersimpan
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Output PPN */}
          {appId === "ppn" && (
            <div className="space-y-5">
              <div className="space-y-3 pb-5 border-b border-border/60 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dasar Pengenaan Pajak (DPP)</span>
                  <span className="font-semibold text-foreground">{formatIDR(dppValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tarif PPN Berlaku</span>
                  <span className="font-semibold text-primary">11%</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">
                  Nilai PPN Terutang (11%)
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {formatIDR(ppnAmount)}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Total Nilai Tagihan:</span>
                <span className="font-bold text-foreground text-sm">
                  {formatIDR(grandTotal)}
                </span>
              </div>

              {user && vatTransaction > 0 && (
                <button
                  onClick={() =>
                    savePpn(
                      `PPN 11% — ${formatIDR(ppnAmount)}`,
                      { vatTransaction, isInclusive },
                      { dppValue, ppnAmount, grandTotal },
                    )
                  }
                  disabled={statusPpn !== "idle"}
                  className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {statusPpn === "idle" && (
                    <>
                      <Save className="size-4" /> Simpan Hasil PPN
                    </>
                  )}
                  {statusPpn === "saving" && "Menyimpan..."}
                  {statusPpn === "saved" && (
                    <>
                      <Check className="size-4" /> Tersimpan
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* EDUCATIONAL & STRATEGY SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Prinsip Pokok Perpajakan */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-foreground font-bold">
            <ShieldCheck className="size-5 text-primary" />
            <h3 className="text-sm sm:text-base">Prinsip & Landasan Regulasi</h3>
          </div>
          <div className="space-y-3">
            {currentApp.prinsipPenting.map((p, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                <span className="text-xs font-semibold text-foreground block">{p.title}</span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skema Alur & Panduan */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-foreground font-bold">
            <Scale className="size-5 text-primary" />
            <h3 className="text-sm sm:text-base">Skema Alur & Langkah Eksekusi</h3>
          </div>
          <div className="space-y-3">
            {currentApp.skemaAlur.map((s) => (
              <div key={s.step} className="flex gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
                <span className="size-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                  {s.step}
                </span>
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-foreground block">{s.title}</span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-border/60">
            <span className="text-xs font-bold text-foreground block mb-2">Panduan Kepatuhan:</span>
            <ul className="space-y-1.5 text-[11px] text-muted-foreground list-disc pl-4">
              {currentApp.panduanStrategi.map((g, idx) => (
                <li key={idx} className="leading-relaxed">
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
