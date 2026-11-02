export interface CurriculumCategoryGroup {
  id: number;
  categoryNumber: number;
  name: string;
  items: string[];
}

export const DISCIPLINE_CATEGORIES: Record<
  string,
  Record<number, { name: string; itemsCount: number }[]>
> = {
  ekonomi: {
    3: [
      { name: "Pelaku & Alur Sirkular", itemsCount: 3 },
      { name: "Peran Negara & Konsumsi", itemsCount: 3 },
      { name: "Produksi & Mekanisme Pasar", itemsCount: 3 },
    ],
    4: [
      { name: "Mekanisme & Keseimbangan Pasar", itemsCount: 4 },
      { name: "Elastisitas & Surplus Konsumen", itemsCount: 4 },
      { name: "Kebijakan & Intervensi Pemerintah", itemsCount: 4 },
      { name: "Struktur Biaya & Bentuk Pasar", itemsCount: 4 },
    ],
    5: [
      { name: "Kebijakan Fiskal & Moneter", itemsCount: 5 },
      { name: "Dinamika Siklus & Valas", itemsCount: 5 },
      { name: "Perdagangan Global & Krisis", itemsCount: 5 },
      { name: "Ekonomi Digital & Sektor Riil", itemsCount: 5 },
      { name: "Pembangunan & Pemerataan Daerah", itemsCount: 5 },
    ],
    6: [
      { name: "Behavioral & Platform Economy", itemsCount: 6 },
      { name: "Fintech & Sirkularitas Nilai", itemsCount: 6 },
      { name: "Green Economy & Game Theory", itemsCount: 6 },
      { name: "Kebijakan Makro & Krisis", itemsCount: 6 },
      { name: "Perdagangan Global & Hilirisasi", itemsCount: 6 },
      { name: "Studi Kasus Riil & Krisis Global", itemsCount: 6 },
    ],
  },
  statistik: {
    3: [
      { name: "Jenis & Skala Data", itemsCount: 3 },
      { name: "Variabel & Kualitas Data", itemsCount: 3 },
      { name: "Pengumpulan & Sumber Data", itemsCount: 3 },
    ],
    4: [
      { name: "Ukuran Pemusatan Data", itemsCount: 4 },
      { name: "Ukuran Penyebaran (Dispersi)", itemsCount: 4 },
      { name: "Posisi Data & Visualisasi", itemsCount: 4 },
      { name: "Distribusi & Standarisasi Skor", itemsCount: 4 },
    ],
    5: [
      { name: "Korelasi & Regresi Linear", itemsCount: 5 },
      { name: "Metode Sampling & Margin Error", itemsCount: 5 },
      { name: "Pemodelan & Analisis Skenario", itemsCount: 5 },
      { name: "Pengujian Hipotesis Statistik", itemsCount: 5 },
      { name: "Deret Waktu & Peramalan Tren", itemsCount: 5 },
    ],
    6: [
      { name: "Big Data & Analitik Prediktif", itemsCount: 6 },
      { name: "Machine Learning & Etika Data", itemsCount: 6 },
      { name: "Visualisasi & Data Storytelling", itemsCount: 6 },
      { name: "Operasi Data & Deteksi Anomali", itemsCount: 6 },
      { name: "Aplikasi Analitik Fungsional", itemsCount: 6 },
      { name: "Studi Kasus Bisnis & Pasar", itemsCount: 6 },
    ],
  },
  manajemen: {
    3: [
      { name: "Fungsi Fundamental POAC", itemsCount: 3 },
      { name: "Pengendalian & Budaya Kerja", itemsCount: 3 },
      { name: "Struktur & Kepemimpinan", itemsCount: 3 },
    ],
    4: [
      { name: "Kerangka Analisis Lingkungan", itemsCount: 4 },
      { name: "Strategi Pertumbuhan & Inovasi", itemsCount: 4 },
      { name: "Eksekusi Nilai & Metrik Kinerja", itemsCount: 4 },
      { name: "Operasional & Tata Kelola Risiko", itemsCount: 4 },
    ],
    5: [
      { name: "Kepemimpinan & Manajemen Krisis", itemsCount: 5 },
      { name: "Manajemen Talenta & SDM", itemsCount: 5 },
      { name: "Metodologi Agile & Inovasi", itemsCount: 5 },
      { name: "Tata Kelola Proyek & Sumber Daya", itemsCount: 5 },
      { name: "Kualitas & Good Corporate Governance", itemsCount: 5 },
    ],
    6: [
      { name: "Studi Kasus Ekosistem Inovasi", itemsCount: 6 },
      { name: "Studi Kasus Transformasi Global", itemsCount: 6 },
      { name: "Studi Kasus Korporasi & FMCG", itemsCount: 6 },
      { name: "Simulasi Krisis & Restrukturisasi", itemsCount: 6 },
      { name: "Simulasi Transformasi Organisasi", itemsCount: 6 },
      { name: "Simulasi Keputusan Eksekutif", itemsCount: 6 },
    ],
  },
  komunikasi: {
    3: [
      { name: "Unsur Pokok Komunikasi", itemsCount: 3 },
      { name: "Penerimaan, Gangguan & Dampak", itemsCount: 3 },
      { name: "Bentuk & Keterampilan Relasi", itemsCount: 3 },
    ],
    4: [
      { name: "Dasar Retorika & Kredibilitas", itemsCount: 4 },
      { name: "Narasi Bisnis & Eksekutif", itemsCount: 4 },
      { name: "Public Speaking & Bahasa Tubuh", itemsCount: 4 },
      { name: "Tanya Jawab & Persuasi", itemsCount: 4 },
    ],
    5: [
      { name: "Negosiasi Strategis & Solusi", itemsCount: 5 },
      { name: "Manajemen Komunikasi Krisis", itemsCount: 5 },
      { name: "Komunikasi Korporat & Budaya", itemsCount: 5 },
      { name: "Advokasi & Reputasi Stakeholder", itemsCount: 5 },
      { name: "Tata Kelola Konten & Brand Voice", itemsCount: 5 },
    ],
    6: [
      { name: "Studi Kasus Krisis Reputasi", itemsCount: 6 },
      { name: "Studi Kasus Kampanye Global", itemsCount: 6 },
      { name: "Simulasi Negosiasi & Kontrak", itemsCount: 6 },
      { name: "Simulasi Peluncuran & Tender", itemsCount: 6 },
      { name: "Simulasi Forum Resmi & RUPS", itemsCount: 6 },
      { name: "Simulasi Krisis Siber & ESG", itemsCount: 6 },
    ],
  },
  logistik: {
    3: [
      { name: "Arus Barang & Pergudangan", itemsCount: 3 },
      { name: "Inventori, Armada & Pelacakan", itemsCount: 3 },
      { name: "Pemenuhan Pesanan & Retur", itemsCount: 3 },
    ],
    4: [
      { name: "Manajemen Inventori & Stok", itemsCount: 4 },
      { name: "Pergudangan & Otomasi Sistem", itemsCount: 4 },
      { name: "Penanganan Muatan & Distribusi", itemsCount: 4 },
      { name: "Rantai Dingin & Pengukuran Kinerja", itemsCount: 4 },
    ],
    5: [
      { name: "Sinkronisasi Pasokan Terintegrasi", itemsCount: 5 },
      { name: "Jaringan Distribusi Multimoda", itemsCount: 5 },
      { name: "Moda Transportasi Kargo", itemsCount: 5 },
      { name: "Pengadaan & Logistik Khusus", itemsCount: 5 },
      { name: "Logistik Cerdas & Ketahanan Pasok", itemsCount: 5 },
    ],
    6: [
      { name: "Studi Kasus Raksasa Logistik", itemsCount: 6 },
      { name: "Studi Kasus Distribusi Domestik", itemsCount: 6 },
      { name: "Simulasi Tata Letak & Inventori", itemsCount: 6 },
      { name: "Simulasi Disrupsi Pasokan", itemsCount: 6 },
      { name: "Simulasi Perdagangan & Ekspor", itemsCount: 6 },
      { name: "Simulasi Kinerja & Audit Pasok", itemsCount: 6 },
    ],
  },
  bisnis: {
    3: [
      { name: "Proposisi Nilai & Sasaran Pasar", itemsCount: 3 },
      { name: "Posisi Kompetitif & Brand", itemsCount: 3 },
      { name: "Perilaku Konsumen & Retensi", itemsCount: 3 },
    ],
    4: [
      { name: "Model Transaksi Pasar", itemsCount: 4 },
      { name: "Model Monetisasi & Pendapatan", itemsCount: 4 },
      { name: "Strategi Pasar & Persona", itemsCount: 4 },
      { name: "Format & Model Skala Bisnis", itemsCount: 4 },
    ],
    5: [
      { name: "Perdagangan Global & Ekspor", itemsCount: 5 },
      { name: "Ekspansi & Aliansi Internasional", itemsCount: 5 },
      { name: "Tata Kelola Aset & Saluran", itemsCount: 5 },
      { name: "Resiliensi & Model Platform", itemsCount: 5 },
      { name: "Metrik Skalabilitas & Unit Ekonomi", itemsCount: 5 },
    ],
    6: [
      { name: "Studi Kasus Model Ritel & D2C", itemsCount: 6 },
      { name: "Studi Kasus Waralaba & SaaS", itemsCount: 6 },
      { name: "Simulasi Monetisasi & Funnel", itemsCount: 6 },
      { name: "Simulasi Keuangan & Pitching", itemsCount: 6 },
      { name: "Simulasi Manajemen Cabang & Krisis", itemsCount: 6 },
      { name: "Simulasi Pertumbuhan & Skala", itemsCount: 6 },
    ],
  },
  administrasi: {
    3: [
      { name: "Persuratan & Legalitas Usaha", itemsCount: 3 },
      { name: "Identitas Resmi & Keabsahan", itemsCount: 3 },
      { name: "Tata Kelola Dokumen & Agenda", itemsCount: 3 },
    ],
    4: [
      { name: "Desain Alur Prosedur Kerja", itemsCount: 4 },
      { name: "Tata Kelola Arsip Digital", itemsCount: 4 },
      { name: "Retensi & Pemusnahan Dokumen", itemsCount: 4 },
      { name: "Dokumen Legal & Perjanjian", itemsCount: 4 },
    ],
    5: [
      { name: "Audit Mutu & Kepatuhan Kerja", itemsCount: 5 },
      { name: "Regulasi Hubungan Kerja & Upah", itemsCount: 5 },
      { name: "Administrasi Fasilitas & Kantor", itemsCount: 5 },
      { name: "Kepatuhan Korporat & Rahasia Data", itemsCount: 5 },
      { name: "Manajemen Risiko & Izin Operasional", itemsCount: 5 },
    ],
    6: [
      { name: "Studi Kasus Audit & Sengketa", itemsCount: 6 },
      { name: "Simulasi Dokumen Perjanjian", itemsCount: 6 },
      { name: "Simulasi Perizinan & Regulasi", itemsCount: 6 },
      { name: "Simulasi Kontrak & K3 Pabrik", itemsCount: 6 },
      { name: "Simulasi Ketenagakerjaan & Pajak", itemsCount: 6 },
      { name: "Simulasi Tata Kelola Siber & ERP", itemsCount: 6 },
    ],
  },
  akuntansi: {
    3: [
      { name: "Struktur Neraca Keuangan", itemsCount: 3 },
      { name: "Pendapatan & Klasifikasi Akun", itemsCount: 3 },
      { name: "Akun Nominal & Bukti Transaksi", itemsCount: 3 },
    ],
    4: [
      { name: "Siklus Pencatatan Transaksi", itemsCount: 4 },
      { name: "Penyesuaian & Kertas Kerja", itemsCount: 4 },
      { name: "Laporan Keuangan Pokok", itemsCount: 4 },
      { name: "Penutupan Buku & Depresiasi", itemsCount: 4 },
    ],
    5: [
      { name: "Amortisasi & Pengelolaan Kas", itemsCount: 5 },
      { name: "Piutang & Penilaian Persediaan", itemsCount: 5 },
      { name: "Analisis Rasio Finansial", itemsCount: 5 },
      { name: "Standar Pelaporan & Sewa", itemsCount: 5 },
      { name: "Audit & Standar Akuntansi", itemsCount: 5 },
    ],
    6: [
      { name: "Studi Kasus Skandal Akuntansi", itemsCount: 6 },
      { name: "Simulasi Penjurnalan & Rekonsiliasi", itemsCount: 6 },
      { name: "Simulasi Arus Kas & Biaya Produksi", itemsCount: 6 },
      { name: "Simulasi Audit & Titik Impas", itemsCount: 6 },
      { name: "Simulasi Tutup Buku & Proyeksi", itemsCount: 6 },
      { name: "Simulasi Evaluasi Aset & Investor", itemsCount: 6 },
    ],
  },
  asuransi: {
    3: [
      { name: "Subjek & Syarat Risiko", itemsCount: 3 },
      { name: "Objek & Nilai Pertanggungan", itemsCount: 3 },
      { name: "Ketentuan Polis & Klaim", itemsCount: 3 },
    ],
    4: [
      { name: "Prinsip Pokok Asuransi", itemsCount: 4 },
      { name: "Prinsip Pertanggungan Hukum", itemsCount: 4 },
      { name: "Asuransi Komersial & Tanggung Gugat", itemsCount: 4 },
      { name: "Proteksi Jiwa & Manajemen", itemsCount: 4 },
    ],
    5: [
      { name: "Pemodelan Aktuaria & Rasio", itemsCount: 5 },
      { name: "Seleksi Risiko Underwriting", itemsCount: 5 },
      { name: "Manajemen Reasuransi", itemsCount: 5 },
      { name: "Investigasi & Kesehatan Finansial", itemsCount: 5 },
      { name: "Asuransi Syariah & Mikro", itemsCount: 5 },
    ],
    6: [
      { name: "Studi Kasus Klaim Katastropik", itemsCount: 6 },
      { name: "Simulasi Penanganan Klaim Toko", itemsCount: 6 },
      { name: "Simulasi Ganti Rugi & Cadangan", itemsCount: 6 },
      { name: "Simulasi Mitigasi Bahaya & RBC", itemsCount: 6 },
      { name: "Simulasi Fraud & Sengketa OJK", itemsCount: 6 },
      { name: "Simulasi Risiko Siber & Takaful", itemsCount: 6 },
    ],
  },
  investasi: {
    3: [
      { name: "Pokok Modal & Imbal Hasil", itemsCount: 3 },
      { name: "Karakteristik Aset & Horizon", itemsCount: 3 },
      { name: "Kelas Aset Investasi", itemsCount: 3 },
    ],
    4: [
      { name: "Matematika Nilai Waktu Uang", itemsCount: 4 },
      { name: "Manajemen Profil & Toleransi", itemsCount: 4 },
      { name: "Alokasi Aset & Diversifikasi", itemsCount: 4 },
      { name: "Strategi Eksekusi & Hasil Modal", itemsCount: 4 },
    ],
    5: [
      { name: "Valuasi Saham & Profitabilitas", itemsCount: 5 },
      { name: "Instrumen Pendapatan Tetap", itemsCount: 5 },
      { name: "Aset Riil & Komoditas", itemsCount: 5 },
      { name: "Modal Ventura & Ekuitas Privat", itemsCount: 5 },
      { name: "Efisiensi Pajak & Perilaku", itemsCount: 5 },
    ],
    6: [
      { name: "Studi Kasus Tokoh Investor", itemsCount: 6 },
      { name: "Simulasi Pertumbuhan & Portofolio", itemsCount: 6 },
      { name: "Simulasi Stres Uji & Laporan", itemsCount: 6 },
      { name: "Simulasi Psikologi & Waralaba", itemsCount: 6 },
      { name: "Simulasi Manajemen Kas & Lindung Nilai", itemsCount: 6 },
      { name: "Simulasi Biaya Modal & Peta Kebebasan", itemsCount: 6 },
    ],
  },
};

/**
 * Splits features into structured category groups for:
 * 1 SKS (3 groups of 3),
 * 2 SKS (4 groups of 4),
 * 3 SKS (5 groups of 5),
 * + Praktikum (6 groups of 6).
 */
export function getCurriculumCategoryGroups(
  disciplineSlug: string,
  levelId: number,
  features: string[]
): CurriculumCategoryGroup[] {
  const disciplineMap = DISCIPLINE_CATEGORIES[disciplineSlug];
  const levelCategories = disciplineMap ? disciplineMap[levelId] : null;

  if (!levelCategories || levelCategories.length === 0) {
    // Fallback: chunk dynamically by 3, 4, 5, or 6
    const chunkSize = levelId === 3 ? 3 : levelId === 4 ? 4 : levelId === 5 ? 5 : 6;
    const groups: CurriculumCategoryGroup[] = [];
    for (let i = 0; i < features.length; i += chunkSize) {
      const catNum = Math.floor(i / chunkSize) + 1;
      groups.push({
        id: catNum,
        categoryNumber: catNum,
        name: `Kategori ${catNum}`,
        items: features.slice(i, i + chunkSize),
      });
    }
    return groups;
  }

  let offset = 0;
  return levelCategories.map((cat, idx) => {
    const items = features.slice(offset, offset + cat.itemsCount);
    offset += cat.itemsCount;
    return {
      id: idx + 1,
      categoryNumber: idx + 1,
      name: cat.name,
      items,
    };
  });
}
