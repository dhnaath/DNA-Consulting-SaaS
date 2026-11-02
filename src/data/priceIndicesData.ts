export interface PriceIndexSubcomponent {
  name: string;
  score: string;
  changeYoY: string;
  weight?: string;
  notes?: string;
}

export interface MacroPriceIndexItem {
  id: string;
  number: number;
  code: string;
  name: string;
  singkatan: string;
  category: 'Inflasi & Konsumen' | 'Produsen & Grosir' | 'Daya Beli Riil' | 'Properti & Aset' | 'Konstruksi & Ekspor';
  skorTerkini: number;
  formatNilai: string;
  satuan: string;
  tren: 'naik' | 'turun' | 'stabil';
  perubahanYoY: string;
  perubahanMoM?: string;
  statusKategori: string;
  sumberResmi: string;
  frekuensiRilis: string;
  jadwalRilis: string;
  deskripsi: string;
  metodologi: string;
  subkomponen: PriceIndexSubcomponent[];
  historicalSeries: { period: string; value: number }[];
}

export const MACRO_PRICE_INDICES_DATA: MacroPriceIndexItem[] = [
  {
    id: 'ihk',
    number: 1,
    code: 'IHK-BPS',
    name: 'Indeks Harga Konsumen (IHK) & Inflasi Nasional',
    singkatan: 'IHK / CPI',
    category: 'Inflasi & Konsumen',
    skorTerkini: 106.85,
    formatNilai: '106.85 poin (Inflasi YoY +2.58%)',
    satuan: 'Poin Indeks (2022=100)',
    tren: 'naik',
    perubahanYoY: '+2.58% YoY',
    perubahanMoM: '+0.28% MoM',
    statusKategori: 'Dalam Koridor Sasaran BI (2.5% ± 1%)',
    sumberResmi: 'Badan Pusat Statistik (BPS) & Bank Indonesia',
    frekuensiRilis: 'Bulanan',
    jadwalRilis: 'Hari kerja pertama awal bulan',
    deskripsi: 'Indeks Harga Konsumen (IHK) mengukur perubahan rata-rata harga paket komoditas barang dan jasa yang dikonsumsi oleh rumah tangga di 90 kota Indonesia (Survei Biaya Hidup 2022). Merupakan indikator primer pengukuran laju inflasi nasional.',
    metodologi: 'Formula Laspeyres Termodifikasi mencakup 837-900 komoditas konsumsi rumah tangga yang dibagi menjadi 11 kelompok pengeluaran berdasarkan COICOP.',
    subkomponen: [
      { name: 'IHK Makanan, Minuman & Tembakau', score: '110.42 poin', changeYoY: '+3.42% YoY', weight: '27.4%', notes: 'Kelompok bobot terbesar pemicu inflasi pangan' },
      { name: 'IHK Inti (Core Inflation)', score: '105.10 poin', changeYoY: '+2.09% YoY', weight: '54.2%', notes: 'Komponen persisten non-volatile & non-administered' },
      { name: 'IHK Harga Bergejolak (Volatile Food)', score: '112.80 poin', changeYoY: '+4.10% YoY', weight: '16.8%', notes: 'Beras, cabai, bawang merah, daging ayam ras' },
      { name: 'IHK Harga Diatur Pemerintah (Administered)', score: '108.20 poin', changeYoY: '+1.75% YoY', weight: '18.6%', notes: 'BBM, tarif listrik, rokok, tiket pesawat' },
      { name: 'IHK Perumahan, Air, Listrik & Bahan Bakar', score: '104.90 poin', changeYoY: '+1.45% YoY', weight: '14.1%', notes: 'Sewa rumah, tarif air PDAM & listrik PLN' }
    ],
    historicalSeries: [
      { period: 'Jan 2024', value: 105.20 },
      { period: 'Apr 2024', value: 105.78 },
      { period: 'Jul 2024', value: 106.05 },
      { period: 'Okt 2024', value: 106.32 },
      { period: 'Jan 2025', value: 106.62 },
      { period: 'Terkini', value: 106.85 }
    ]
  },
  {
    id: 'ihpb',
    number: 2,
    code: 'IHPB-BPS',
    name: 'Indeks Harga Perdagangan Besar (IHPB / Wholesale Price Index)',
    singkatan: 'IHPB / WPI',
    category: 'Produsen & Grosir',
    skorTerkini: 117.40,
    formatNilai: '117.40 poin (+3.12% YoY)',
    satuan: 'Poin Indeks (2018=100)',
    tren: 'naik',
    perubahanYoY: '+3.12% YoY',
    perubahanMoM: '+0.35% MoM',
    statusKategori: 'Pertumbuhan Grosir Stabil Terkendali',
    sumberResmi: 'Badan Pusat Statistik (BPS)',
    frekuensiRilis: 'Bulanan',
    jadwalRilis: 'Awal bulan bersamaan dengan rilis IHK',
    deskripsi: 'IHPB mengukur perubahan harga transaksi pada tingkat grosir atau perdagangan besar di kota-kota besar nasional. Indikator ini mencerminkan tekanan biaya bahan baku dan perantara sebelum sampai ke konsumen akhir.',
    metodologi: 'Formula Laspeyres mencakup komoditas sektor Pertanian, Pertambangan & Penggalian, serta Industri Pengolahan, baik pasar domestik maupun ekspor/impor.',
    subkomponen: [
      { name: 'IHPB Sektor Pertanian', score: '124.80 poin', changeYoY: '+4.65% YoY', weight: '22.1%', notes: 'Hasil panen padi, jagung, hortikultura dan kelapa sawit' },
      { name: 'IHPB Sektor Industri Pengolahan', score: '115.20 poin', changeYoY: '+2.80% YoY', weight: '68.4%', notes: 'Bahan baku makanan industri, tekstil, kimia, logam' },
      { name: 'IHPB Sektor Pertambangan & Penggalian', score: '119.50 poin', changeYoY: '+1.95% YoY', weight: '9.5%', notes: 'Pasir, batu pecah, batubara dan bijih mineral' },
      { name: 'IHPB Komoditas Impor', score: '114.10 poin', changeYoY: '+2.10% YoY', weight: '15.3%', notes: 'Kedelai, gandum, mesin perantara dan petrokimia' },
      { name: 'IHPB Komoditas Ekspor', score: '122.30 poin', changeYoY: '+3.90% YoY', weight: '18.7%', notes: 'CPO, karet olahan, feronikel, tekstil ekspor' }
    ],
    historicalSeries: [
      { period: 'Jan 2024', value: 114.20 },
      { period: 'Apr 2024', value: 115.10 },
      { period: 'Jul 2024', value: 115.90 },
      { period: 'Okt 2024', value: 116.60 },
      { period: 'Jan 2025', value: 117.05 },
      { period: 'Terkini', value: 117.40 }
    ]
  },
  {
    id: 'ntp',
    number: 3,
    code: 'NTP-BPS',
    name: 'Nilai Tukar Petani (NTP) - Rasio Daya Beli Pertanian',
    singkatan: 'NTP',
    category: 'Daya Beli Riil',
    skorTerkini: 121.50,
    formatNilai: '121.50 poin (Surplus Daya Beli)',
    satuan: 'Rasio Indeks (2018=100)',
    tren: 'naik',
    perubahanYoY: '+3.85% YoY',
    perubahanMoM: '+0.42% MoM',
    statusKategori: 'Surplus Kesejahteraan Petani (>100)',
    sumberResmi: 'Badan Pusat Statistik (BPS) & Kementerian Pertanian',
    frekuensiRilis: 'Bulanan',
    jadwalRilis: 'Awal bulan',
    deskripsi: 'NTP adalah perbandingan antara indeks harga yang diterima petani (It) dengan indeks harga yang dibayar petani (Ib). Nilai NTP > 100 menunjukkan daya beli dan kemampuan tukar komoditas pertanian lebih tinggi dibanding kebutuhan konsumsi & biaya produksi.',
    metodologi: 'NTP = (It / Ib) x 100 dihitung dari 34 provinsi dengan sampel puluhan ribu rumah tangga petani pedesaan.',
    subkomponen: [
      { name: 'NTP Tanaman Pangan (NTPP)', score: '116.80 poin', changeYoY: '+2.10% YoY', weight: '42.0%', notes: 'Petani padi gabah kering panen (GKP) dan jagung' },
      { name: 'NTP Hortikultura (NTPH)', score: '128.40 poin', changeYoY: '+6.20% YoY', weight: '18.5%', notes: 'Petani cabai, bawang merah, tomat, dan sayuran' },
      { name: 'NTP Tanaman Perkebunan Rakyat (NTPR)', score: '135.60 poin', changeYoY: '+7.40% YoY', weight: '24.5%', notes: 'Petani kelapa sawit swadaya, kakao, karet, kopi' },
      { name: 'NTP Peternakan (NTPT)', score: '102.30 poin', changeYoY: '+0.45% YoY', weight: '15.0%', notes: 'Peternak sapi potong, ayam broiler, dan telur' },
      { name: 'Indeks Diterima (It) vs Dibayar (Ib)', score: 'It: 142.10 | Ib: 116.95', changeYoY: '+4.2% spread', weight: '100%', notes: 'Biaya pupuk & pakan menjadi pengurang utama margin' }
    ],
    historicalSeries: [
      { period: 'Jan 2024', value: 116.90 },
      { period: 'Apr 2024', value: 118.20 },
      { period: 'Jul 2024', value: 119.40 },
      { period: 'Okt 2024', value: 120.30 },
      { period: 'Jan 2025', value: 120.95 },
      { period: 'Terkini', value: 121.50 }
    ]
  },
  {
    id: 'ntn',
    number: 4,
    code: 'NTN-BPS',
    name: 'Nilai Tukar Nelayan (NTN) & Pembudidaya Ikan',
    singkatan: 'NTN',
    category: 'Daya Beli Riil',
    skorTerkini: 108.65,
    formatNilai: '108.65 poin (Surplus Moderat)',
    satuan: 'Rasio Indeks (2018=100)',
    tren: 'naik',
    perubahanYoY: '+1.15% YoY',
    perubahanMoM: '+0.18% MoM',
    statusKategori: 'Daya Beli Nelayan Positif (>100)',
    sumberResmi: 'Badan Pusat Statistik & Kementerian Kelautan dan Perikanan',
    frekuensiRilis: 'Bulanan',
    jadwalRilis: 'Awal bulan',
    deskripsi: 'NTN mengukur kemampuan tukar hasil tangkapan nelayan perikanan tangkap dan budidaya terhadap barang konsumsi rumah tangga serta biaya sarana produksi melaut (BBM solar, es balok, jaring, mesin kapal).',
    metodologi: 'Rasio harga hasil perikanan laut/darat terhadap indeks pengeluaran nelayan di wilayah pesisir kepulauan Indonesia.',
    subkomponen: [
      { name: 'NTN Nelayan Perikanan Tangkap Laut', score: '109.80 poin', changeYoY: '+1.30% YoY', weight: '65.0%', notes: 'Tuna, cakalang, tongkol, kembung, udang laut' },
      { name: 'NTN Pembudidaya Ikan (NTPi)', score: '106.90 poin', changeYoY: '+0.85% YoY', weight: '35.0%', notes: 'Tambak udang vaname, ikan bandeng, lele, nila' },
      { name: 'Indeks Biaya Sarana Melaut (Solar & Es)', score: '118.20 poin', changeYoY: '+2.10% YoY', weight: '45.0%', notes: 'Solar subsidi B35 dan es curah pengawet ikan' }
    ],
    historicalSeries: [
      { period: 'Jan 2024', value: 107.10 },
      { period: 'Apr 2024', value: 107.60 },
      { period: 'Jul 2024', value: 108.05 },
      { period: 'Okt 2024', value: 108.30 },
      { period: 'Jan 2025', value: 108.45 },
      { period: 'Terkini', value: 108.65 }
    ]
  },
  {
    id: 'ihpr',
    number: 5,
    code: 'IHPR-BI',
    name: 'Indeks Harga Properti Residensial (IHPR - Bank Indonesia)',
    singkatan: 'IHPR',
    category: 'Properti & Aset',
    skorTerkini: 221.80,
    formatNilai: '221.80 poin (+1.89% YoY)',
    satuan: 'Poin Indeks (2012=100)',
    tren: 'naik',
    perubahanYoY: '+1.89% YoY',
    perubahanMoM: '+0.45% QoQ',
    statusKategori: 'Pertumbuhan Properti Stabil Sehat',
    sumberResmi: 'Departemen Statistik Bank Indonesia (Survei SHPR)',
    frekuensiRilis: 'Triwulanan (Quarterly)',
    jadwalRilis: 'Februari, Mei, Agustus, November',
    deskripsi: 'Indeks yang mencatat perkembangan harga jual rumah tinggal di pasar primer pada 18 kota besar di Indonesia. Menjadi tolok ukur valuasi agunan perbankan dan risiko sektor properti riil.',
    metodologi: 'Survei berkala terhadap ribuan sampel pengembang proyek perumahan di 18 kota besar di Jawa dan luar Jawa.',
    subkomponen: [
      { name: 'Rumah Tipe Kecil (Luas s.d. 36 m²)', score: '230.15 poin', changeYoY: '+1.95% YoY', weight: '38.0%', notes: 'Permintaan tertinggi program subsidi FLPP & milenial' },
      { name: 'Rumah Tipe Menengah (36 - 70 m²)', score: '218.40 poin', changeYoY: '+1.62% YoY', weight: '37.0%', notes: 'Klaster perumahan suburban penyangga kota metropolitan' },
      { name: 'Rumah Tipe Besar (> 70 m²)', score: '214.20 poin', changeYoY: '+2.10% YoY', weight: '25.0%', notes: 'Segmen residensial premium kota mandiri & township' },
      { name: 'Indeks Kota Pertumbuhan Tertinggi', score: 'Batam & Surabaya (+2.8%)', changeYoY: '+2.80% YoY', weight: 'Regional', notes: 'Didorong pertumbuhan industri & infrastruktur jalan tol' }
    ],
    historicalSeries: [
      { period: 'Q1 2024', value: 217.40 },
      { period: 'Q2 2024', value: 218.60 },
      { period: 'Q3 2024', value: 219.80 },
      { period: 'Q4 2024', value: 220.70 },
      { period: 'Q1 2025', value: 221.30 },
      { period: 'Terkini', value: 221.80 }
    ]
  },
  {
    id: 'ibk',
    number: 6,
    code: 'IBK-PUPR',
    name: 'Indeks Biaya Konstruksi (IBK - BPS & Kementerian PUPR)',
    singkatan: 'IBK',
    category: 'Konstruksi & Ekspor',
    skorTerkini: 114.75,
    formatNilai: '114.75 poin (+2.45% YoY)',
    satuan: 'Poin Indeks Acuan Nasional (2020=100)',
    tren: 'naik',
    perubahanYoY: '+2.45% YoY',
    perubahanMoM: '+0.25% MoM',
    statusKategori: 'Eskalasi Material Konstruksi Wajar',
    sumberResmi: 'Badan Pusat Statistik & Kementerian Pekerjaan Umum dan Perumahan Rakyat',
    frekuensiRilis: 'Tahunan & Pemutakhiran Semesteran',
    jadwalRilis: 'September & Pemutakhiran APBN',
    deskripsi: 'Indeks yang mencerminkan tingkat kemahalan konstruksi suatu wilayah relatif terhadap kota acuan nasional. Merupakan variabel krusial perhitungan alokasi Dana Alokasi Umum (DAU) dan pagu tender konstruksi nasional.',
    metodologi: 'Survei harga material pokok konstruksi (semen, pasir, batu, besi beton, aspal, kayu) dan standar upah harian tukang/mandor.',
    subkomponen: [
      { name: 'Indeks Bahan Bangunan Logam & Semen', score: '112.30 poin', changeYoY: '+1.80% YoY', weight: '45.0%', notes: 'Besi beton SNI, semen portland, kawat bendrat' },
      { name: 'Indeks Upah Tenaga Kerja Konstruksi', score: '118.50 poin', changeYoY: '+2.90% YoY', weight: '35.0%', notes: 'Upah tukang batu, tukang kayu, mandor proyek' },
      { name: 'Indeks Sewa Alat Berat & Excavator', score: '115.10 poin', changeYoY: '+2.60% YoY', weight: '20.0%', notes: 'Tarif sewa per jam excavator, dump truck, roller' },
      { name: 'Disparitas Geografis (Papua & Maluku)', score: 'Indeks 180 - 240', changeYoY: 'Faktor Logistik', weight: 'Daerah 3T', notes: 'Ketergantungan pasokan jalur udara dan laut perintis' }
    ],
    historicalSeries: [
      { period: '2021', value: 104.20 },
      { period: '2022', value: 108.50 },
      { period: '2023', value: 111.40 },
      { period: '2024', value: 113.80 },
      { period: '2025', value: 114.40 },
      { period: 'Terkini', value: 114.75 }
    ]
  },
  {
    id: 'ihp_produsen',
    number: 7,
    code: 'IHP-MANUFAKTUR',
    name: 'Indeks Harga Produsen (IHP / PPI Manufaktur Nasional)',
    singkatan: 'IHP / PPI',
    category: 'Produsen & Grosir',
    skorTerkini: 112.30,
    formatNilai: '112.30 poin (+2.70% YoY)',
    satuan: 'Poin Indeks (2018=100)',
    tren: 'naik',
    perubahanYoY: '+2.70% YoY',
    perubahanMoM: '+0.22% MoM',
    statusKategori: 'Margin Produksi Manufaktur Sehat',
    sumberResmi: 'Badan Pusat Statistik & Kementerian Perindustrian',
    frekuensiRilis: 'Kuartalan',
    jadwalRilis: 'Pertengahan kuartal',
    deskripsi: 'IHP mengukur perubahan harga yang diterima oleh produsen domestik untuk output produksi barang manufaktur pada pintu gerbang pabrik (ex-factory price), sebelum biaya transportasi & margin perdagangan.',
    metodologi: 'Survei ribuan industri skala menengah dan besar di berbagai kawasan industri manufaktur Jawa dan luar Jawa.',
    subkomponen: [
      { name: 'IHP Industri Makanan & Minuman', score: '115.80 poin', changeYoY: '+3.10% YoY', weight: '36.0%', notes: 'Tepung terigu olahan, minyak goreng sawit, biskuit' },
      { name: 'IHP Industri Kimia, Farmasi & Kosmetik', score: '109.40 poin', changeYoY: '+1.65% YoY', weight: '24.0%', notes: 'Bahan polimer plastik, pupuk kimia, obat generik' },
      { name: 'IHP Industri Logam Dasar & Fabrikasi', score: '111.70 poin', changeYoY: '+2.30% YoY', weight: '22.0%', notes: 'Billet baja, pelat aluminium, pipa tembaga' },
      { name: 'IHP Industri Karet & Barang Plastik', score: '110.90 poin', changeYoY: '+2.10% YoY', weight: '18.0%', notes: 'Ban kendaraan bermotor, kemasan plastik industri' }
    ],
    historicalSeries: [
      { period: 'Q1 2024', value: 109.80 },
      { period: 'Q2 2024', value: 110.50 },
      { period: 'Q3 2024', value: 111.20 },
      { period: 'Q4 2024', value: 111.80 },
      { period: 'Q1 2025', value: 112.10 },
      { period: 'Terkini', value: 112.30 }
    ]
  },
  {
    id: 'ihke_ekspor',
    number: 8,
    code: 'IHKE-KEMENDAG',
    name: 'Indeks Harga Komoditas Ekspor Nonmigas Indonesia',
    singkatan: 'IHKE Ekspor',
    category: 'Konstruksi & Ekspor',
    skorTerkini: 134.20,
    formatNilai: '134.20 poin (+4.80% YoY)',
    satuan: 'Poin Indeks Acuan Valas (2018=100)',
    tren: 'naik',
    perubahanYoY: '+4.80% YoY',
    perubahanMoM: '+0.85% MoM',
    statusKategori: 'Surplus Neraca Perdagangan Kuat',
    sumberResmi: 'Kementerian Perdagangan & BPS',
    frekuensiRilis: 'Bulanan',
    jadwalRilis: 'Pertengahan bulan rilis Neraca Ekspor Impor',
    deskripsi: 'Indeks tertimbang harga komoditas ekspor andalan nonmigas Indonesia di pasar internasional. Mengukur nilai tukar perdagangan (terms of trade) komoditas strategis yang menopang cadangan devisa Bank Indonesia.',
    metodologi: 'Pembobotan berdasarkan pangsa devisa ekspor FOB (Free on Board) komoditas unggulan nasional.',
    subkomponen: [
      { name: 'Minyak Sawit Mentah (CPO) & Fraksi', score: '138.40 poin', changeYoY: '+8.20% YoY', weight: '34.0%', notes: 'Ekspor ke India, China, Uni Eropa & Timur Tengah' },
      { name: 'Logam Olahan Nikel (NPI & FeNi)', score: '132.10 poin', changeYoY: '+5.30% YoY', weight: '26.0%', notes: 'Hilirisasi smelter nikel Morowali & Weda Bay' },
      { name: 'Karet Alam & Kopi Robusta Nusantara', score: '141.20 poin', changeYoY: '+11.40% YoY', weight: '15.0%', notes: 'Harga kopi robusta global menyentuh rekor tertinggi' },
      { name: 'Batu Bara & Bahan Bakar Padat', score: '126.50 poin', changeYoY: '-2.10% YoY', weight: '25.0%', notes: 'Harga acuan HBA ESDM stabil di level moderat' }
    ],
    historicalSeries: [
      { period: 'Jan 2024', value: 127.80 },
      { period: 'Apr 2024', value: 129.40 },
      { period: 'Jul 2024', value: 131.20 },
      { period: 'Okt 2024', value: 132.80 },
      { period: 'Jan 2025', value: 133.60 },
      { period: 'Terkini', value: 134.20 }
    ]
  }
];
