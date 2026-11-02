import {
  Coins,
  LineChart,
  Briefcase,
  MessageCircle,
  Truck,
  Store,
  FileText,
  Calculator,
  Shield,
  TrendingUp,
  LucideIcon,
} from "lucide-react";

export interface JenjangLevel {
  id: number;
  name: string;
  count: number;
  tagline: string;
  badge: string;
  desc: string;
}

export const JENJANG_LEVELS: JenjangLevel[] = [
  {
    id: 2,
    name: "Matrikulasi",
    count: 4,
    tagline: "4 Fondasi & Instrumen Nilai Dasar",
    badge: "Level 1: Matrikulasi",
    desc: "Pemetaan 4 konsep dan instrumen pokok paling mendasar untuk membangun pola pikir nilai.",
  },
  {
    id: 3,
    name: "1 SKS",
    count: 9,
    tagline: "9 Kompetensi Pokok & Arsitektur Alur",
    badge: "Level 2: 1 SKS",
    desc: "Penguasaan 9 alur mekanisme pertukaran nilai dan pengenalan ekosistem operasional.",
  },
  {
    id: 4,
    name: "2 SKS",
    count: 16,
    tagline: "16 Instrumen Terapan & Mekanisme Pasar",
    badge: "Level 3: 2 SKS",
    desc: "Pendalaman 16 instrumen teknis terapan, elastisitas, biaya, dan tata kelola transaksi.",
  },
  {
    id: 5,
    name: "3 SKS",
    count: 25,
    tagline: "25 Analisis Strategis & Rekayasa Nilai",
    badge: "Level 4: 3 SKS",
    desc: "25 kerangka analisis makro, mitigasi risiko, perencanaan strategis, dan optimasi profit.",
  },
  {
    id: 6,
    name: "+ Praktikum",
    count: 36,
    tagline: "36 Studi Kasus & Simulasi Praktikum Nyata",
    badge: "Level 5: Praktikum",
    desc: "36 skenario studi kasus riil, problem solving di lapangan, dan simulasi pengambilan keputusan bisnis.",
  },
];

export interface DisciplineCurriculum {
  id: number;
  slug: string;
  title: string;
  categoryLabel: string;
  subtitle: string;
  icon: LucideIcon;
  gradient: string;
  featuresByLevel: Record<number, string[]>;
}

export const CURRICULUM_DISCIPLINES: DisciplineCurriculum[] = [
  {
    id: 1,
    slug: "ekonomi",
    title: "Ekonomi",
    categoryLabel: "Perputaran Nilai",
    subtitle: "Teori nilai ekonomi, inflasi, mekanisme pasar, dan dinamika kebijakan fiskal & moneter.",
    icon: Coins,
    gradient: "bg-linear-to-br from-amber-500 to-amber-700",
    featuresByLevel: {
      2: ["Uang", "Barter", "Perputaran", "Kelangkaan"],
      3: ["Pelaku Ekonomi", "Pasar", "Circular Flow", "Alur", "Pemerintah", "Konsumsi", "Produksi", "Mekanisme Pasar", "Harga"],
      4: ["Permintaan", "Penawaran", "Keseimbangan", "Elastisitas", "Elastisitas Penawaran", "Substitusi", "Surplus", "Floor & Ceiling", "Intervensi", "Pajak", "Subsidi", "Utilitas", "Biaya Jangka Pendek", "Biaya Jangka Panjang", "Persaingan Sempurna", "Monopoli"],
      5: ["Fiskal", "Belanja Negara", "Moneter", "Inflasi", "Deflasi", "Siklus Bisnis", "Pengangguran", "Pertumbuhan", "Neraca Pembayaran", "Kurs", "Tarif", "Organisasi Internasional", "Ekonomi Terbuka", "Krisis Ekonomi", "Ekonomi Indonesia", "Digital", "BUMN", "UMKM", "Industri 4.0", "Ekonomi Kreatif", "Pariwisata", "Ketimpangan", "Pemerataan", "Dana Desa", "Masa Depan Ekonomi"],
      6: ["Perilaku", "Mental Accounting", "Overconfidence", "Herding", "Nudge", "Platform", "Fintech", "Cryptocurrency", "Gelembung Aset", "Ekonomi Sirkular", "Perlindungan Sosial", "Ekonomi Digital", "Green Economy", "Blue Economy", "Sharing Economy", "Game Theory", "SDM", "Asimetri Informasi", "Pertumbuhan", "Inovasi", "Kontra-Siklus", "Quantitative Easing", "Ekonomi Perang", "Pasca-Pandemi", "Ekonomi Global", "Subsidi", "Investasi Asing", "Hilirisasi", "Ekonomi Kreatif", "CBDC", "Studi Kasus Pandemi", "Studi Kasus Kripto", "Studi Kasus The Fed", "Studi Kasus Nikel", "Studi Kasus El Nino", "Studi Kasus Argentina"],
    },
  },
  {
    id: 2,
    slug: "statistik",
    title: "Statistik",
    categoryLabel: "Pendataan Nilai",
    subtitle: "Pemodelan data kuantitatif, probabilitas, korelasi variabel, dan inferensi keputusan bisnis.",
    icon: LineChart,
    gradient: "bg-linear-to-br from-indigo-500 to-indigo-700",
    featuresByLevel: {
      2: ["Data", "Big Data", "Kegagalan Data", "Populasi"],
      3: ["Kualitatif", "Kuantitatif", "Nominal", "Interval", "Dummy", "Validitas", "Reliabilitas", "Primer", "Pengumpulan Data"],
      4: ["Mean", "Median", "Modus", "Pemusatan", "Range", "Varians", "Standar Deviasi", "Koefisien Variasi", "Kuartil", "Outlier", "Boxplot", "Histogram", "Diagram Sebar", "Distribusi Normal", "Z-Score", "Skor Baku"],
      5: ["Korelasi Pearson", "Regresi Linear", "R-Squared", "P-Value", "Interval Keyakinan", "Margin of Error", "Ukuran Sampel", "Sampling Acak", "Stratifikasi", "Prediksi", "Prediksi Penjualan", "Prediksi Biaya", "Tren", "Sensitivitas", "Skenario", "Uji t", "Uji Proporsi", "Chi-Square", "T-Test", "ANOVA", "Time Series", "Moving Average", "Exponential Smoothing", "Regresi Time Series", "MAPE"],
      6: ["Big Data", "Data Mining", "Regresi", "Prediktif", "Churn", "Sentimen", "Rekomendasi", "Clustering", "Analitik Lanjutan", "Etika Data", "Bias", "Transparansi", "Data Scientist", "Dashboard", "Storytelling", "Real-Time", "Cloud", "Data Warehouse", "ETL", "Optimasi", "Personalisasi", "Fraud", "Risiko", "Rantai Pasok", "Pemasaran", "Segmentasi", "Harga", "Produk", "Kualitas", "Sumber Daya", "Studi Kasus E-commerce", "Studi Kasus Musiman", "Studi Kasus Segmentasi", "Studi Kasus Kredit", "Studi Kasus Sentimen", "Studi Kasus Saham"],
    },
  },
  {
    id: 3,
    slug: "manajemen",
    title: "Manajemen",
    categoryLabel: "Pengelolaan Nilai",
    subtitle: "Orkestrasi sumber daya, perencanaan strategis, efisiensi operasional, dan kepemimpinan sistem.",
    icon: Briefcase,
    gradient: "bg-linear-to-br from-blue-600 to-blue-800",
    featuresByLevel: {
      2: ["Manajemen Diri", "Eisenhower", "Time Management", "SMART"],
      3: ["Planning", "Organizing", "Actuating", "Controlling", "Visi Misi", "Budaya Kerja", "Struktur Organisasi", "Delegasi", "Kepemimpinan"],
      4: ["SWOT", "TOWS", "Porter 5 Forces", "BCG Matrix", "Ansoff Matrix", "GE McKinsey", "Blue Ocean", "VRIO", "Value Chain", "Balanced Scorecard", "OKR", "KPI", "SOP Manajemen", "Kaizen PDCA", "Lean Six Sigma", "Risk Management"],
      5: ["Manajemen Perubahan", "Kepemimpinan Transformasional", "Manajemen Krisis", "Komunikasi Manajemen", "Manajemen Konflik", "Negosiasi Manajemen", "Talent Management", "Kompensasi & Benefit", "Evaluasi Kinerja", "Succession Planning", "Agile Management", "Scrum Sprint", "Kanban Operasional", "Manajemen Inovasi", "Desain Organisasi", "Manajemen Proyek", "Critical Path Method", "Gantt Chart", "Alokasi Resource", "Manajemen Biaya", "Manajemen Kualitas", "Audit Manajemen", "Tata Kelola Perusahaan", "Etika Bisnis", "Keberlanjutan"],
      6: ["Studi Kasus Apple", "Studi Kasus Toyota Kaizen", "Studi Kasus Netflix Pivot", "Studi Kasus Nokia Failure", "Studi Kasus Amazon Flywheel", "Studi Kasus Google OKR", "Studi Kasus Tesla Disrupsi", "Studi Kasus Starbucks CX", "Studi Kasus Zara Fast Fashion", "Studi Kasus IKEA Logistik", "Studi Kasus Airbnb Platform", "Studi Kasus Microsoft Cloud", "Studi Kasus Samsung Chaebol", "Studi Kasus Disney IP", "Studi Kasus McDonald Franchising", "Studi Kasus Unilever FMCG", "Studi Kasus Indofood Supply", "Studi Kasus Gojek SuperApp", "Studi Kasus BCA Digital Banking", "Studi Kasus Telkomsel Telco", "Simulasi Krisis PR", "Simulasi Merger Akuisisi", "Simulasi Restrukturisasi", "Simulasi Negosiasi Serikat", "Simulasi Pivot Produk", "Simulasi Ekspansi Global", "Simulasi Turnaround Perusahaan", "Simulasi Suksesi CEO", "Simulasi Audit ISO", "Simulasi Efisiensi 30%", "Simulasi Disrupsi Teknologi", "Simulasi Rapat Direksi", "Simulasi Townhall Karyawan", "Simulasi Exit Strategy", "Simulasi IPO Saham", "Simulasi Business Continuity"],
    },
  },
  {
    id: 4,
    slug: "komunikasi",
    title: "Komunikasi",
    categoryLabel: "Penyampaian Nilai",
    subtitle: "Artikulasi narasi strategis, negosiasi tingkat tinggi, retorika publik, dan harmonisasi relasi.",
    icon: MessageCircle,
    gradient: "bg-linear-to-br from-cyan-600 to-teal-700",
    featuresByLevel: {
      2: ["Komunikasi", "Shannon-Weaver", "Encoding", "Feedback"],
      3: ["Komunikator", "Pesan", "Saluran", "Komunikan", "Noise", "Efek", "Verbal", "Non-Verbal", "Mendengar Aktif"],
      4: ["Retorika", "Ethos", "Pathos", "Logos", "Struktur Narasi", "Storytelling Bisnis", "Pitch Deck", "Presentasi Eksekutif", "Public Speaking", "Body Language", "Intonasi Vokal", "Visual Aid", "Q&A Handling", "Teknik Menjawab", "Framing Pesan", "Persuasi"],
      5: ["Negosiasi Harvard", "BATNA", "ZOPA", "Win-Win Solution", "Taktik Konsesi", "Komunikasi Krisis", "Press Release", "Konferensi Pers", "Media Relations", "Internal Comms", "Townhall Meeting", "Memo Direksi", "Feedback 360", "Komunikasi Lintas Budaya", "Diplomasi Bisnis", "Lobi Regulasi", "Advokasi Stakeholder", "Komunikasi Perubahan", "Employer Branding", "Social Media Comms", "Crisis PR Online", "Copywriting Strategis", "Brand Voice", "Content Governance", "Reputasi Korporat"],
      6: ["Studi Kasus Krisis Tylenol", "Studi Kasus Steve Jobs Keynote", "Studi Kasus Boeing PR", "Studi Kasus Pepsi Ad Gagal", "Studi Kasus Domino Turnaround", "Studi Kasus Airbnb Crisis", "Studi Kasus Uber PR Repair", "Studi Kasus Nike Just Do It", "Studi Kasus Kampanye Dove", "Studi Kasus Red Bull Content", "Simulasi Negosiasi Gaji", "Simulasi Negosiasi Vendor", "Simulasi Negosiasi Kontrak", "Simulasi Negosiasi Investor", "Simulasi Konferensi Pers", "Simulasi Rapat Dewan", "Simulasi Wawancara Media", "Simulasi Penanganan Hoax", "Simulasi Pemutusan Hubungan", "Simulasi Launching Produk", "Simulasi Pitching Tender", "Simulasi Debat Kebijakan", "Simulasi Mediasi Konflik", "Simulasi Crisis Control Room", "Simulasi Pidato Tahunan", "Simulasi Q&A RUPS", "Simulasi Podcast Brand", "Simulasi Kolaborasi Influencer", "Simulasi Penulisan Whitepaper", "Simulasi Newsletter Pelanggan", "Simulasi Komunikasi Phygital", "Simulasi Krisis Data Breach", "Simulasi Komunikasi Merger", "Simulasi Kampanye ESG", "Simulasi Klarifikasi Publik", "Simulasi Edukasi Pasar"],
    },
  },
  {
    id: 5,
    slug: "logistik",
    title: "Logistik",
    categoryLabel: "Perpindahan Nilai",
    subtitle: "Rekayasa rantai pasok (supply chain), tata kelola pergudangan, optimasi rute, dan distribusi barang.",
    icon: Truck,
    gradient: "bg-linear-to-br from-orange-500 to-amber-700",
    featuresByLevel: {
      2: ["5T", "Rantai Pasok", "Pengemasan", "Transportasi"],
      3: ["Inbound", "Outbound", "Gudang", "Inventori", "Tracking", "Fleet", "Lead Time", "Order Fullfillment", "Reverse Logistics"],
      4: ["FIFO/LIFO", "Safety Stock", "EOQ", "Reorder Point", "Cross Docking", "Slotting Gudang", "WMS Software", "Barcode & RFID", "Palletizing", "Konsolidasi Muatan", "Routing Optimization", "Last Mile Delivery", "Cold Chain", "Material Handling", "KPI Logistik", "Biaya Logistik"],
      5: ["S&OP (Sales & Ops)", "VMI (Vendor Managed)", "JIT (Just In Time)", "Bullwhip Effect", "Multi-Echelon Supply", "Pusat Distribusi Hub", "Multimoda Transport", "Incoterms 2020", "Kepabeanan & Bea Cukai", "Freight Forwarding", "Kargo Udara", "Kargo Laut Kontainer", "Kargo Darat Truk", "Third Party Logistics", "Fourth Party Logistics", "Pengadaan Strategis", "Manajemen Kontrak Vendor", "Green Logistics", "Logistik Halal", "Logistik Bencana", "Logistik Farmasi", "Logistik E-commerce", "Smart Logistics IoT", "Autonomous Drone", "Ketahanan Rantai Pasok"],
      6: ["Studi Kasus Rantai Amazon", "Studi Kasus Zara JIT", "Studi Kasus Walmart Hub", "Studi Kasus Maersk Kontainer", "Studi Kasus DHL Express", "Studi Kasus FedEx Overnight", "Studi Kasus Logistik Vaksin", "Studi Kasus Rantai Apple", "Studi Kasus Logistik Indomaret", "Studi Kasus J&T E-commerce", "Studi Kasus Pelindo Pelabuhan", "Studi Kasus KAI Logistik", "Simulasi Optimasi Rute 50 Titik", "Simulasi Perhitungan EOQ Pabrik", "Simulasi Audit Stok Gudang 10k SKU", "Simulasi Tata Letak Warehouse", "Simulasi Penanganan Barang Pecah", "Simulasi Manajemen Suhu Cold Storage", "Simulasi Keterlambatan Kapal Kontainer", "Simulasi Kenaikan Tarif Bahan Bakar", "Simulasi Pemilihan Vendor Ekspedisi", "Simulasi Penurunan Lead Time 40%", "Simulasi Tracking Real-time IoT", "Simulasi Reverse Logistik Retur", "Simulasi Lonjakan Pesanan Harbolnas", "Simulasi Distribusi Pangan Nasional", "Simulasi Impor Komoditas Gandum", "Simulasi Ekspor Kontainer CPO", "Simulasi Pengurusan Bea Cukai", "Simulasi Pergudangan Otomatis AS/RS", "Simulasi Pemilihan Armada Truk", "Simulasi Biaya Total Logistik", "Simulasi Mitigasi Bencana Alam", "Simulasi Standar Keselamatan K3 Gudang", "Simulasi KPI Vendor On-Time 99%", "Simulasi Audit ISO Rantai Pasok"],
    },
  },
  {
    id: 6,
    slug: "bisnis",
    title: "Bisnis",
    categoryLabel: "Pertukaran Nilai",
    subtitle: "Validasi kelayakan pasar, perancangan proposisi nilai, saluran penjualan, dan monetisasi berkelanjutan.",
    icon: Store,
    gradient: "bg-linear-to-br from-emerald-600 to-green-800",
    featuresByLevel: {
      2: ["Jual-Beli", "Produk & Jasa", "Siklus", "Profit"],
      3: ["Value Proposition", "Jobs to be Done", "Segmentasi", "Pesaing", "Keunggulan", "Merek", "Perilaku", "Customer Journey", "Retensi"],
      4: ["B2B", "B2C", "C2C", "B2G", "Penjualan Langsung", "Subscription", "Iklan", "Freemium", "Fee & Komisi", "STP Pasar", "Buyer Persona", "Analisis Pesaing", "Franchise", "E-commerce", "Bisnis Internasional", "Startup"],
      5: ["Ekspor Komoditas", "Incoterms Dagang", "Dokumen Ekspor", "Sertifikasi Produk", "Bea Cukai Dagang", "Strategi Masuk Pasar", "Joint Venture", "Penetapan Harga Global", "Hedging Valas", "Budaya Bisnis Global", "Jaringan Distributor", "Model Kemitraan", "HKI & Paten", "Talenta Kunci", "Keberlanjutan Usaha", "Navigasi VUCA", "Resiliensi Iklim", "Ekosistem Digital", "Model Platform", "Jejaring Nilai", "Customer Lifetime Value", "Biaya Akuisisi CAC", "Churn Prevention", "Unit Economics", "Skalabilitas Bisnis"],
      6: ["Studi Kasus Bisnis Kuliner", "Studi Kasus Bisnis Garmen", "Studi Kasus Thrifting", "Studi Kasus Marketplace", "Studi Kasus Model Langganan", "Studi Kasus Ekspansi Daerah", "Studi Kasus Waralaba Kopi", "Studi Kasus Warung Madura", "Studi Kasus D2C Brand", "Studi Kasus SaaS B2B", "Simulasi Validasi Ide 100 User", "Simulasi Pembuatan BMC Lengkap", "Simulasi Perhitungan BEP Usaha", "Simulasi Penetapan Harga 3 Tingkat", "Simulasi Funnel Penjualan Online", "Simulasi Kampanye Peluncuran", "Simulasi Negosiasi Suplier Utama", "Simulasi Desain Paket Bundling", "Simulasi Program Loyalitas Member", "Simulasi Analisis Kelemahan Pesaing", "Simulasi Perhitungan Margin Bersih", "Simulasi Uji Coba Landing Page", "Simulasi Perizinan Legal Usaha", "Simulasi Presentasi Pitching Modal", "Simulasi Pembukaan Cabang Kedua", "Simulasi Rekrutmen Karyawan Pertama", "Simulasi Pengelolaan Kas Bulanan", "Simulasi Menghadapi Perang Harga", "Simulasi Rebranding Logo & Nama", "Simulasi Penanganan Komplain Viral", "Simulasi Kerjasama Co-Branding", "Simulasi Masuk Pasar Modern Ritel", "Simulasi Ekspor Perdana Kontainer", "Simulasi Audit Kesehatan Bisnis", "Simulasi Efisiensi Pengeluaran 20%", "Simulasi Rencana Bisnis 5 Tahun"],
    },
  },
  {
    id: 7,
    slug: "administrasi",
    title: "Administrasi",
    categoryLabel: "Pembukuan Nilai",
    subtitle: "Standard Operating Procedures (SOP), ketertiban dokumentasi, arsip legal, dan kepatuhan sistem regulasi.",
    icon: FileText,
    gradient: "bg-linear-to-br from-slate-600 to-slate-800",
    featuresByLevel: {
      2: ["Dokumen", "SOP", "Arsip", "Kepatuhan"],
      3: ["Format Surat", "Penomoran", "Perizinan", "NIB", "NPWP", "Stempel", "Surat Masuk", "Surat Keluar", "Buku Agenda"],
      4: ["Flowchart SOP", "Instruksi Kerja", "Checklist Harian", "Formulir Standar", "Arsip Digital", "Sistem Folder", "Hak Akses", "Backup Dokumen", "Periode Retensi", "Pemusnahan Berkas", "Legalisasi", "Notaris", "Akta Perusahaan", "PKS & MOU", "NDA Kerahasiaan", "Surat Kuasa"],
      5: ["Audit Internal SOP", "ISO 9001 Mutu", "Dokumentasi K3", "Kepatuhan BPJS", "Pajak Usaha PPh/PPN", "Faktur Pajak Elektronik", "Regulasi Ketenagakerjaan", "Peraturan Perusahaan", "Perjanjian Kerja PKWT", "Struktur Upah Skala", "Tata Tertib Kantor", "Manajemen Fasilitas", "Inventaris Kantor", "Pengadaan ATK", "Surat Keputusan Direksi", "Notula Rapat RUPS", "Daftar Pemegang Saham", "Rahasia Dagang", "Perlindungan Data Pribadi", "Audit Kepatuhan Hukum", "Izin Operasional Khusus", "AMDAL & Lingkungan", "Sertifikasi Standar", "Manajemen Risiko Legal", "Good Corporate Governance"],
      6: ["Studi Kasus Audit ISO 9001", "Studi Kasus Digitalisasi Arsip Bank", "Studi Kasus Sengketa Perjanjian Kontrak", "Studi Kasus Kepatuhan Pajak Korporat", "Studi Kasus Audit Ketenagakerjaan", "Studi Kasus Pembuatan SOP Gudang", "Simulasi Penyusunan Draft MOU Bisnis", "Simulasi Pembuatan SOP Pembelian Barang", "Simulasi Pengarsipan Cloud Berjenjang", "Simulasi Penanganan Surat Somasi Hukum", "Simulasi Pendaftaran Hak Merek HKI", "Simulasi Perhitungan Pajak Badan Tahunan", "Simulasi Registrasi Izin Edar BPOM", "Simulasi Pembuatan Notula RUPS Tahunan", "Simulasi Penyusunan Buku Pedoman Karyawan", "Simulasi Pengelolaan Arsip Rahasia Direksi", "Simulasi Uji Kepatuhan UU Perlindungan Data", "Simulasi Pengadaan Barang & Jasa Kantor", "Simulasi Manajemen Kontrak Sewa Gedung", "Simulasi Standarisasi Dokumen ISO", "Simulasi Pembuatan Checklist K3 Pabrik", "Simulasi Verifikasi Keaslian Tanda Tangan", "Simulasi Prosedur Pemusnahan Arsip Lama", "Simulasi Pengurusan Perpanjangan Izin NIB", "Simulasi Audit Sistem Administrasi Cabang", "Simulasi Penyusunan Struktur Gaji PP", "Simulasi Pendaftaran BPJS Tenaga Kerja", "Simulasi Penanganan Audit Pajak BPK", "Simulasi Evaluasi Kinerja Vendor Kantor", "Simulasi Penyusunan Dokumen Tender Lelang", "Simulasi Alur Disposisi Surat Direktur", "Simulasi Pembagian Hak Akses ERP", "Simulasi Pengamanan Data Fisik & Siber", "Simulasi Standardisasi Email Korporat", "Simulasi Pembentukan Komite Kepatuhan", "Simulasi Laporan Akuntabilitas Tahunan"],
    },
  },
  {
    id: 8,
    slug: "akuntansi",
    title: "Akuntansi",
    categoryLabel: "Pencatatan Nilai",
    subtitle: "Pembukuan berpasangan (double-entry), neraca, laporan laba rugi, arus kas, dan audit transparansi finansial.",
    icon: Calculator,
    gradient: "bg-linear-to-br from-violet-600 to-purple-800",
    featuresByLevel: {
      2: ["Persamaan Dasar", "Debit-Kredit", "Jurnal", "Laporan"],
      3: ["Aset", "Liabilitas", "Ekuitas", "Pendapatan", "Beban", "Akun Riil", "Akun Nominal", "Bukti Transaksi", "Kuitansi & Nota"],
      4: ["Jurnal Umum", "Jurnal Khusus", "Buku Besar", "Buku Pembantu", "Neraca Saldo", "Jurnal Penyesuaian", "Kertas Kerja (Worksheet)", "Laporan Laba Rugi", "Laporan Perubahan Modal", "Neraca", "Arus Kas Langsung", "Arus Kas Tak Langsung", "Jurnal Penutup", "Neraca Saldo Penutup", "Jurnal Pembalik", "Penyusutan Aset"],
      5: ["Metode Garis Lurus", "Metode Saldo Menurun", "Amortisasi Tak Berwujud", "Rekonsiliasi Bank", "Kas Kecil (Petty Cash)", "Imprest Fund System", "Pencadangan Piutang Ragu", "Penilaian Persediaan FIFO", "Average Persediaan", "Harga Pokok Produksi", "Harga Pokok Penjualan", "Analisis Rasio Likuiditas", "Analisis Rasio Solvabilitas", "Analisis Rasio Profitabilitas", "Analisis Du-Pont", "Pajak Tangguhan", "Sewa Operasi vs Pembiayaan", "Konsolidasi Laporan Keuangan", "Mata Uang Fungsional", "Audit Sampling Akuntansi", "Materialitas Audit", "Opini Auditor Independen", "Standar SAK EMTM", "Standar SAK IFRS", "Fraud Examination"],
      6: ["Studi Kasus Enron Accounting Scandal", "Studi Kasus Toshiba Profit Overstatement", "Studi Kasus Garuda Indonesia Restatement", "Studi Kasus Audit Forensik Kasus Fraud", "Studi Kasus Valuasi Startup Unicorn", "Studi Kasus Penerapan IFRS 16 Sewa", "Simulasi Pencatatan 50 Transaksi Harian", "Simulasi Posting Buku Besar Otomatis", "Simulasi Rekonsiliasi Rekening Koran Bank", "Simulasi Penyesuaian Persediaan Opname", "Simulasi Pembuatan Laporan Laba Rugi", "Simulasi Penyusunan Neraca Komparatif", "Simulasi Analisis Arus Kas 3 Bulan", "Simulasi Perhitungan HPP Pabrik Makanan", "Simulasi Manajemen Kas Kecil Toko", "Simulasi Pencadangan Piutang Macet", "Simulasi Perhitungan Beban Penyusutan", "Simulasi Pelaporan Pajak SPT Badan", "Simulasi Analisis Rasio Keuangan Bank", "Simulasi Audit Kepatuhan Dokumen Kasir", "Simulasi Deteksi Transaksi Ganda Fiktif", "Simulasi Perhitungan Titik Impas Multi-Produk", "Simulasi Penyusunan Anggaran Biaya Modal", "Simulasi Laporan Keuangan Konsolidasi", "Simulasi Perhitungan Pajak Penghasilan PPh", "Simulasi Penutupan Buku Akhir Tahun", "Simulasi Pembuatan Dashboard Finansial", "Simulasi Proyeksi Laba Rugi 12 Bulan", "Simulasi Analisis Varians Anggaran vs Riil", "Simulasi Perhitungan Nilai Buku Per Lembar", "Simulasi Perlakuan Aset Tidak Berwujud", "Simulasi Penyesuaian Selisih Kurs Valas", "Simulasi Penyusunan Catatan Atas Lapkeu", "Simulasi Uji Penurunan Nilai Aset Tetap", "Simulasi Review Kertas Kerja Akuntan", "Simulasi Presentasi Keuangan ke Investor"],
    },
  },
  {
    id: 9,
    slug: "asuransi",
    title: "Asuransi",
    categoryLabel: "Pelindung Nilai",
    subtitle: "Pemodelan aktuaria, proteksi aset dari bahaya, mitigasi kerugian finansial, dan pemindahan risiko terencana.",
    icon: Shield,
    gradient: "bg-linear-to-br from-rose-600 to-red-800",
    featuresByLevel: {
      2: ["Risiko Murni", "Polis", "Premi", "Klaim"],
      3: ["Insurable Risk", "Tertanggung", "Penanggung", "Objek Pertanggungan", "Uang Pertanggungan", "Masa Asuransi", "Masa Tunggu", "Pengecualian", "Deduktibel"],
      4: ["Asas Insurable Interest", "Asas Utmost Good Faith", "Asas Indemnitas", "Asas Subrogasi", "Asas Kontribusi", "Asas Proximate Cause", "Asuransi Properti", "Asuransi Kendaraan", "Asuransi Maritim Kargo", "Asuransi Tanggung Gugat", "Asuransi Rekayasa Mesin", "Asuransi Kredit Usaha", "Asuransi Jiwa Berjangka", "Asuransi Kesehatan Karyawan", "Asuransi Direksi D&O", "Klausul All Risks"],
      5: ["Tabel Mortalita", "Pemodelan Aktuaria", "Penetapan Tarif Premi", "Rasio Klaim (Loss Ratio)", "Rasio Kombinasi", "Underwriting Medis", "Underwriting Finansial", "Survey Risiko Lapangan", "Inspeksi Proteksi Kebakaran", "Risk Engineering", "Manajemen Reasuransi", "Reasuransi Fakultatif", "Reasuransi Treaty", "Kapasitas Retensi Sendiri", "Tata Kelola Klaim Kompleks", "Loss Adjuster Independen", "Investigasi Klaim Fiktif", "Solvabilitas RBC (Risk Based Capital)", "Portofolio Investasi Asuransi", "Regulasi OJK Perasuransian", "Asuransi Mikro UMKM", "Asuransi Syariah Takaful", "Tabarru & Ujrah", "Bancassurance", "Insurtech Digital"],
      6: ["Studi Kasus Klaim Gempa Palu", "Studi Kasus Asuransi Kargo Selat Malaka", "Studi Kasus Kebakaran Kilang Balongan", "Studi Kasus Asuransi Jiwasraya Restrukturisasi", "Studi Kasus Klaim Pandemi Bisnis", "Studi Kasus Asuransi Satelit Roket", "Simulasi Pengajuan Klaim Kebakaran Toko", "Simulasi Perhitungan Premi Armada Truk", "Simulasi Pemilihan Polis Kesehatan Karyawan", "Simulasi Audit Polis Proteksi Gudang", "Simulasi Negosiasi Deduktibel Sendiri", "Simulasi Investigasi Kecelakaan Kerja Pabrik", "Simulasi Penggantian Ganti Rugi Subrogasi", "Simulasi Klaim Kerusakan Mesin Produksi", "Simulasi Kalkulasi Cadangan Klaim IBNR", "Simulasi Pemeriksaan Klausul Pengecualian", "Simulasi Pembagian Risiko Reasuransi", "Simulasi Penanganan Klaim Kargo Basah", "Simulasi Penetapan Uang Pertanggungan Bangunan", "Simulasi Mitigasi Bahaya Instalasi Listrik", "Simulasi Penerapan Asuransi Kredit Macet", "Simulasi Perhitungan RBC Perusahaan", "Simulasi Penyusunan Polis Custom Industri", "Simulasi Penilaian Risiko Bencana Banjir", "Simulasi Penolakan Klaim Akibat Fraud", "Simulasi Mediasi Sengketa Klaim di OJK", "Simulasi Alokasi Premi Asuransi Tahunan", "Simulasi Proteksi Tanggung Jawab Hukum Pihak 3", "Simulasi Evaluasi Reputasi Asuransi Mitra", "Simulasi Implementasi Asuransi Parametrik", "Simulasi Pemodelan Risiko Siber Data Korporat", "Simulasi Penerapan Asuransi Syariah Wakalah", "Simulasi Pengelolaan Dana Tabarru Peserta", "Simulasi Pembayaran Santunan Ahli Waris", "Simulasi Penilaian Risiko Kontraktor Proyek", "Simulasi Audit Sistem Klaim Cepat Digital"],
    },
  },
  {
    id: 10,
    slug: "investasi",
    title: "Investasi",
    categoryLabel: "Penambah Nilai",
    subtitle: "Multiplikasi modal melalui alokasi aset cerdas, compounding interest, diversifikasi, dan penciptaan dividen jangka panjang.",
    icon: TrendingUp,
    gradient: "bg-linear-to-br from-teal-600 to-emerald-800",
    featuresByLevel: {
      2: ["Nilai Waktu Uang", "Bunga Majemuk", "Profil Risiko", "Portofolio"],
      3: ["Modal Awal", "Imbal Hasil (Return)", "Inflasi & Real Return", "Likuiditas Aset", "Jangka Waktu", "Pasar Uang", "Pendapatan Tetap", "Ekuitas Saham", "Aset Riil Properti"],
      4: ["Present Value", "Future Value", "Anuitas", "Suku Bunga Efektif", "Rule of 72", "Toleransi Risiko", "Konservatif", "Moderat", "Agresif", "Diversifikasi Markowitz", "Korelasi Antar Aset", "Rebalancing Portofolio", "Dollar Cost Averaging", "Lump Sum", "Dividen Yield", "Capital Gain"],
      5: ["Valuasi Saham DCF", "Price to Earnings (PER)", "Price to Book (PBV)", "ROE & ROIC", "Free Cash Flow to Firm", "Obligasi Pemerintah & Yield", "Durasi Obligasi", "Kurva Imbal Hasil (Yield Curve)", "Credit Rating Obligasi", "Reksadana Indeks", "ETF Pasar Modal", "Properti Sewa (Rental Yield)", "Kapitalisasi Properti (Cap Rate)", "Komoditas Emas Fisik", "Kripto & Aset Digital", "Private Equity", "Venture Capital", "Angel Investment", "Term Sheet & Valuasi Pre/Post", "Dilusi Saham Sahabat", "Efisiensi Pajak Investasi", "Dividen Bebas Pajak", "Hedging Opsi & Futures", "Behavioral Finance", "Rencana Pensiun Mandiri"],
      6: ["Studi Kasus Warren Buffett Bershire", "Studi Kasus Peter Lynch Tenbagger", "Studi Kasus Ray Dalio All Weather", "Studi Kasus Krisis Subprime Mortgage 2008", "Studi Kasus Gelembung Dotcom 2000", "Studi Kasus Investasi Emas saat Inflasi", "Simulasi Perhitungan Pertumbuhan Modal 20 Thn", "Simulasi Alokasi Portofolio Gaji Bulanan", "Simulasi Valuasi Wajar Saham Konsumer", "Simulasi Rebalancing Portofolio 6 Bulanan", "Simulasi DCA Reksadana vs Lump Sum", "Simulasi Perhitungan Rental Yield Properti", "Simulasi Pengujian Stres Pasar Jatuh 30%", "Simulasi Evaluasi Lembar Fakta Reksadana", "Simulasi Analisis Laporan Keuangan Emiten", "Simulasi Pengelolaan Dividen Masuk", "Simulasi Pembelian Surat Berharga Negara SBN", "Simulasi Penentuan Exit Target Investasi", "Simulasi Mitigasi FOMO & Panic Selling", "Simulasi Menghitung Return Riil Pasca Pajak", "Simulasi Investasi Bisnis Franchise Mitra", "Simulasi Negosiasi Kepemilikan Startup 10%", "Simulasi Kalkulasi Dana Pensiun Target 5 Miliar", "Simulasi Pengelolaan Warisan Multi-Generasi", "Simulasi Portofolio Pendapatan Pasif Kas", "Simulasi Analisis Rasio Utang Emiten DER", "Simulasi Penggunaan Stop Loss Terencana", "Simulasi Hedging Portofolio dengan Emas", "Simulasi Audit Portofolio Investasi Tahunan", "Simulasi Pemilihan Sektor Tahan Resesi", "Simulasi Perhitungan WACC Biaya Modal", "Simulasi Penilaian Prospektus IPO Saham", "Simulasi Strategi Compound Reinvest 100%", "Simulasi Pemisahan Akun Investasi vs Spekulasi", "Simulasi Menghadapi Volatilitas Pasar Saham", "Simulasi Peta Jalan Kebebasan Finansial"],
    },
  },
];
