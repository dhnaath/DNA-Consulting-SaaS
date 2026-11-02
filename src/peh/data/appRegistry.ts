import { CategoryDefinition, WorkspaceId } from '../types';

export const CATEGORIES_CONFIG_PEH: CategoryDefinition[] = [
  {
    id: 'personal',
    name: 'Personal',
    description: 'Pengembangan diri, rutinitas kebiasaan, catatan refleksi, dan target capaian hidup.',
    iconName: 'User',
    apps: [
      {
        id: 'habits',
        categoryId: 'personal',
        name: 'Habit & Rutinitas',
        shortDesc: 'Pelacak kebiasaan harian, konsistensi ritme hidup, dan evaluasi berkala.',
        iconName: 'CheckSquare',
        subMenus: [
          { id: 'today', label: 'Agenda Hari Ini', iconName: 'CalendarCheck' },
          { id: 'all-habits', label: 'Daftar Kebiasaan', iconName: 'ListOrdered' },
          { id: 'analytics', label: 'Statistik & Konsistensi', iconName: 'BarChart2' },
        ],
      },
      {
        id: 'journal',
        categoryId: 'personal',
        name: 'Jurnal & Mood',
        shortDesc: 'Ruang refleksi privat, pencatatan suasana hati, dan jurnal berkala.',
        iconName: 'BookOpen',
        subMenus: [
          { id: 'timeline', label: 'Lini Masa Entri', iconName: 'Feather' },
          { id: 'mood-map', label: 'Peta Suasana Hati', iconName: 'Smile' },
          { id: 'topics', label: 'Tag & Topik', iconName: 'Hash' },
        ],
      },
      {
        id: 'goals',
        categoryId: 'personal',
        name: 'Target & Milestone',
        shortDesc: 'Peta jalan sasaran jangka pendek & panjang dengan tahapan checkpoint.',
        iconName: 'Target',
        subMenus: [
          { id: 'active', label: 'Sasaran Aktif', iconName: 'Compass' },
          { id: 'milestones', label: 'Tahapan Milestone', iconName: 'CheckCircle2' },
          { id: 'archive', label: 'Arsip Target', iconName: 'Archive' },
        ],
      },
      {
        id: 'reading',
        categoryId: 'personal',
        name: 'Buku & Bahan Bacaan',
        shortDesc: 'Pelacak target membaca buku, progress halaman, kutipan inspiratif, dan rak bacaan.',
        iconName: 'BookMarked',
        subMenus: [
          { id: 'shelf', label: 'Rak Buku Saya', iconName: 'Book' },
          { id: 'currently-reading', label: 'Sedang Dibaca', iconName: 'Glasses' },
          { id: 'quotes', label: 'Kutipan & Catatan', iconName: 'Quote' },
        ],
      },
      {
        id: 'fitness',
        categoryId: 'personal',
        name: 'Latihan & Olahraga',
        shortDesc: 'Log sesi latihan fisik, kalori, intensitas detak, dan kalkulator kekuatan 1RM.',
        iconName: 'Dumbbell',
        subMenus: [
          { id: 'workouts', label: 'Log Latihan', iconName: 'Flame' },
          { id: 'calculator', label: 'Kalkulator 1RM & Kekuatan', iconName: 'Calculator' },
          { id: 'history', label: 'Riwayat & Konsistensi', iconName: 'Activity' },
        ],
      },
      {
        id: 'sleep',
        categoryId: 'personal',
        name: 'Tidur & Pemulihan',
        shortDesc: 'Kualitas tidur, jam istirahat malam, penghitung sleep debt, dan evaluasi kesegaran tubuh.',
        iconName: 'Moon',
        subMenus: [
          { id: 'sleep-log', label: 'Log Tidur Harian', iconName: 'Bed' },
          { id: 'recovery-calc', label: 'Kalkulator Hutang Tidur', iconName: 'Brain' },
          { id: 'trends', label: 'Tren & Gangguan Tidur', iconName: 'LineChart' },
        ],
      },
    ],
  },
  {
    id: 'essentials',
    name: 'Essentials',
    description: 'Manajemen berkas penting, brankas sandi rahasia, dan radar langganan berkala.',
    iconName: 'ShieldCheck',
    apps: [
      {
        id: 'vault',
        categoryId: 'essentials',
        name: 'Brankas Sandi & Kunci',
        shortDesc: 'Penyimpanan aman kredensial, kunci akses, PIN, dan catatan sensitif.',
        iconName: 'KeyRound',
        subMenus: [
          { id: 'all-keys', label: 'Kredensial Tersimpan', iconName: 'Lock' },
          { id: 'generator', label: 'Generator Sandi', iconName: 'Cpu' },
          { id: 'security-audit', label: 'Audit Keamanan', iconName: 'ShieldAlert' },
        ],
      },
      {
        id: 'documents',
        categoryId: 'essentials',
        name: 'Dokumen & Garansi',
        shortDesc: 'Sentralisasi berkas legal, kartu garansi fisik, polis, dan masa berlaku.',
        iconName: 'FolderArchive',
        subMenus: [
          { id: 'active-docs', label: 'Berkas Tersimpan', iconName: 'FileText' },
          { id: 'expiry-watch', label: 'Radar Kedaluwarsa', iconName: 'Clock' },
          { id: 'locations', label: 'Lokasi Simpan Fisik', iconName: 'MapPin' },
        ],
      },
      {
        id: 'subscriptions',
        categoryId: 'essentials',
        name: 'Langganan & Tagihan',
        shortDesc: 'Pantau biaya berulang, siklus tagihan, dan proyeksi anggaran tahunan.',
        iconName: 'CreditCard',
        subMenus: [
          { id: 'active-subs', label: 'Daftar Langganan', iconName: 'Receipt' },
          { id: 'forecast', label: 'Kalender & Proyeksi', iconName: 'Calendar' },
          { id: 'breakdown', label: 'Distribusi Anggaran', iconName: 'PieChart' },
        ],
      },
      {
        id: 'budget',
        categoryId: 'essentials',
        name: 'Anggaran & Kas Harian',
        shortDesc: 'Sistem amplop anggaran, alokasi pos belanja pokok, dan kalkulator dana darurat.',
        iconName: 'Wallet',
        subMenus: [
          { id: 'envelopes', label: 'Amplop Anggaran', iconName: 'FolderCheck' },
          { id: 'emergency-calc', label: 'Kalkulator Runway Darurat', iconName: 'ShieldAlert' },
          { id: 'allocation', label: 'Alokasi Pengeluaran', iconName: 'PieChart' },
        ],
      },
      {
        id: 'insurance',
        categoryId: 'essentials',
        name: 'Polis Asuransi & Proteksi',
        shortDesc: 'Pusat data polis kesehatan, jiwa, kendaraan, plafon pertanggungan, dan premi.',
        iconName: 'ShieldCheck',
        subMenus: [
          { id: 'policies', label: 'Daftar Polis Aktif', iconName: 'FileCheck' },
          { id: 'gap-checker', label: 'Cek Celah Proteksi (Gap)', iconName: 'CheckSquare' },
          { id: 'claims', label: 'Riwayat Klaim & Status', iconName: 'FileText' },
        ],
      },
    ],
  },
  {
    id: 'household',
    name: 'Household',
    description: 'Koordinasi rumah tangga, inventaris bahan makanan, jadwal servis, dan iuran bersama.',
    iconName: 'Home',
    apps: [
      {
        id: 'pantry',
        categoryId: 'household',
        name: 'Dapur & Inventaris',
        shortDesc: 'Stok bahan pangan, pantauan stok menipis, dan daftar belanja terpadu.',
        iconName: 'ShoppingBag',
        subMenus: [
          { id: 'stock', label: 'Stok Bahan', iconName: 'Layers' },
          { id: 'restock', label: 'Daftar Belanja', iconName: 'ShoppingCart' },
          { id: 'zones', label: 'Zona Penyimpanan', iconName: 'Grid' },
        ],
      },
      {
        id: 'maintenance',
        categoryId: 'household',
        name: 'Perawatan & Servis',
        shortDesc: 'Jadwal servis berkala perabotan rumah, catatan teknisi, dan riwayat perbaikan.',
        iconName: 'Wrench',
        subMenus: [
          { id: 'appliances', label: 'Daftar Peralatan', iconName: 'Cpu' },
          { id: 'schedule', label: 'Jadwal Servis Berkala', iconName: 'CalendarDays' },
          { id: 'contacts', label: 'Kontak Teknisi & Bengkel', iconName: 'Phone' },
        ],
      },
      {
        id: 'chores',
        categoryId: 'household',
        name: 'Tugas & Iuran Rumah',
        shortDesc: 'Pembagian piket harian rumah dan pencatatan split tagihan utilitas keluarga.',
        iconName: 'Sparkles',
        subMenus: [
          { id: 'chore-board', label: 'Piket Rumah', iconName: 'CheckSquare' },
          { id: 'utilities', label: 'Tagihan & Utilitas', iconName: 'DollarSign' },
          { id: 'summary', label: 'Rekap Kas & Pelunasan', iconName: 'FileSpreadsheet' },
        ],
      },
      {
        id: 'plants',
        categoryId: 'household',
        name: 'Tanaman & Kebun Rumah',
        shortDesc: 'Jadwal penyiraman tanaman hias/kebun, kebutuhan sinar matahari, dan repotting media.',
        iconName: 'Flower2',
        subMenus: [
          { id: 'my-plants', label: 'Koleksi Tanaman', iconName: 'Leaf' },
          { id: 'watering-due', label: 'Radar Jadwal Siram', iconName: 'Droplets' },
          { id: 'care-guide', label: 'Kondisi & Pemupukan', iconName: 'Sparkles' },
        ],
      },
      {
        id: 'vehicles',
        categoryId: 'household',
        name: 'Kendaraan & BBM',
        shortDesc: 'Pajak STNK tahunan, odometer ganti oli, dan kalkulator efisiensi bahan bakar (KM/L).',
        iconName: 'Car',
        subMenus: [
          { id: 'garage', label: 'Garasi Kendaraan', iconName: 'Key' },
          { id: 'fuel-efficiency', label: 'Kalkulator KM/Liter BBM', iconName: 'Fuel' },
          { id: 'service-schedule', label: 'Pajak & Servis Berkala', iconName: 'Wrench' },
        ],
      },
    ],
  },
];

export const CATEGORIES_CONFIG = CATEGORIES_CONFIG_PEH;

export const CATEGORIES_CONFIG_PFS: CategoryDefinition[] = [

  {
    id: 'people',
    name: 'People',
    description: 'Jejaring relasi pertemanan, profesional, riwayat sapaan berkala, dan momen spesial.',
    iconName: 'Users',
    apps: [
      {
        id: 'contacts',
        categoryId: 'people',
        name: 'Jejaring & Relasi (Personal CRM)',
        shortDesc: 'Buku kontak relasi personal, frekuensi sapa, dan catatan interaksi penting.',
        iconName: 'Contact',
        subMenus: [
          { id: 'all-contacts', label: 'Daftar Kontak Relasi', iconName: 'BookUser' },
          { id: 'cadence', label: 'Radar Sapaan Berkala', iconName: 'Timer' },
          { id: 'circles', label: 'Lingkaran & Kategori', iconName: 'Shapes' },
        ],
      },
      {
        id: 'milestones',
        categoryId: 'people',
        name: 'Momen & Ulang Tahun',
        shortDesc: 'Kalender hari jadi, ulang tahun sahabat/rekan, dan tanggal penting bersama.',
        iconName: 'Cake',
        subMenus: [
          { id: 'upcoming', label: 'Momen Terdekat', iconName: 'Sparkles' },
          { id: 'calendar', label: 'Kalender Tahunan', iconName: 'Calendar' },
          { id: 'archive', label: 'Semua Momen Spesial', iconName: 'List' },
        ],
      },
      {
        id: 'gifts',
        categoryId: 'people',
        name: 'Inspirasi Hadiah & Budi',
        shortDesc: 'Catatan ide kado bermakna, riwayat hadiah diterima/diberikan, serta saling bantu.',
        iconName: 'Gift',
        subMenus: [
          { id: 'ideas', label: 'Ide Hadiah Terencana', iconName: 'Bookmark' },
          { id: 'history', label: 'Riwayat Kado Masuk/Keluar', iconName: 'ArrowLeftRight' },
          { id: 'favors', label: 'Catatan Saling Bantu', iconName: 'HeartHandshake' },
        ],
      },
      {
        id: 'mentorship',
        categoryId: 'people',
        name: 'Mentor & Bimbingan',
        shortDesc: 'Sesi bimbingan 1-on-1, intisari nasihat penting, dan komitmen aksi tindak lanjut.',
        iconName: 'Compass',
        subMenus: [
          { id: 'mentors', label: 'Daftar Mentor', iconName: 'UserCheck' },
          { id: 'sessions', label: 'Catatan Sesi & Nasihat', iconName: 'FileText' },
          { id: 'commitments', label: 'Komitmen & Action Items', iconName: 'CheckSquare' },
        ],
      },
      {
        id: 'introductions',
        categoryId: 'people',
        name: 'Mak Comblang & Sambung Relasi',
        shortDesc: 'Log menjembatani relasi antar-kolega, peluang kerja sama, dan hasil kemitraan.',
        iconName: 'Share2',
        subMenus: [
          { id: 'network-bridge', label: 'Koneksi Dijembatani', iconName: 'GitPullRequest' },
          { id: 'status-tracker', label: 'Progres Kolaborasi', iconName: 'Activity' },
          { id: 'outcomes', label: 'Hasil & Nilai Tambah', iconName: 'Trophy' },
        ],
      },
    ],
  },
  {
    id: 'family',
    name: 'Family',
    description: 'Dinasti dan silsilah keluarga besar, rekam medis anggota, serta tradisi bersama.',
    iconName: 'HeartHandshake',
    apps: [
      {
        id: 'family_tree',
        categoryId: 'family',
        name: 'Silsilah & Anggota Keluarga',
        shortDesc: 'Profil anggota keluarga lintas generasi, kota domisili, dan silsilah.',
        iconName: 'GitMerge',
        subMenus: [
          { id: 'members', label: 'Daftar Anggota', iconName: 'Users' },
          { id: 'generations', label: 'Tingkatan Generasi', iconName: 'GitBranch' },
          { id: 'directory', label: 'Buku Alamat Domisili', iconName: 'MapPin' },
        ],
      },
      {
        id: 'family_health',
        categoryId: 'family',
        name: 'Kesehatan & Rekam Medis',
        shortDesc: 'Catatan golongan darah, alergi obat, riwayat medis, dan kontak darurat keluarga.',
        iconName: 'Activity',
        subMenus: [
          { id: 'profiles', label: 'Profil Darah & Alergi', iconName: 'FileHeart' },
          { id: 'emergency', label: 'Kartu Kontak Darurat', iconName: 'PhoneCall' },
          { id: 'meds', label: 'Pengobatan Rutin', iconName: 'Pill' },
        ],
      },
      {
        id: 'traditions',
        categoryId: 'family',
        name: 'Acara & Tradisi Bersama',
        shortDesc: 'Arisan keluarga, mudik hari raya, reuni akbar, dan resep warisan turun-temurun.',
        iconName: 'CalendarHeart',
        subMenus: [
          { id: 'events', label: 'Jadwal Acara & Reuni', iconName: 'Calendar' },
          { id: 'rituals', label: 'Tradisi & Resep Warisan', iconName: 'Flame' },
          { id: 'treasury', label: 'Anggaran & Kas Acara', iconName: 'Coins' },
        ],
      },
      {
        id: 'family_recipes',
        categoryId: 'family',
        name: 'Resep Warisan Keluarga',
        shortDesc: 'Buku resep rahasia leluhur, takaran bahan, dan pengubah porsi masak otomatis.',
        iconName: 'Utensils',
        subMenus: [
          { id: 'recipes', label: 'Buku Resep Leluhur', iconName: 'Book' },
          { id: 'portion-scaler', label: 'Kalkulator Porsi Masak', iconName: 'Scale' },
          { id: 'secret-tips', label: 'Bumbu Khas & Tips', iconName: 'Sparkles' },
        ],
      },
      {
        id: 'family_budget',
        categoryId: 'family',
        name: 'Tabungan & Dana Keluarga',
        shortDesc: 'Sinking fund pendidikan anak, dana darurat keluarga, dan kalkulator inflasi biaya sekolah.',
        iconName: 'PiggyBank',
        subMenus: [
          { id: 'sinking-funds', label: 'Pos Dana Terarah', iconName: 'Coins' },
          { id: 'education-calc', label: 'Kalkulator Dana Pendidikan', iconName: 'GraduationCap' },
          { id: 'contributions', label: 'Rencana Tabungan Bulanan', iconName: 'CalendarCheck' },
        ],
      },
      {
        id: 'pet_care',
        categoryId: 'family',
        name: 'Hewan Peliharaan & Anabul',
        shortDesc: 'Profil kucing/anjing keluarga, jadwal vaksinasi, berat badan, dan kartu rekam dokter hewan.',
        iconName: 'Heart',
        subMenus: [
          { id: 'pets', label: 'Profil Anabul', iconName: 'Heart' },
          { id: 'vaccination', label: 'Jadwal Vaksin & Vet', iconName: 'ShieldAlert' },
          { id: 'weight-log', label: 'Kondisi & Berat Badan', iconName: 'Activity' },
        ],
      },
    ],
  },
  {
    id: 'society',
    name: 'Society',
    description: 'Keterlibatan warga di lingkungan RT/RW, aksi sukarelawan, dan kontribusi sosial.',
    iconName: 'Globe',
    apps: [
      {
        id: 'civic',
        categoryId: 'society',
        name: 'Warga & Lingkungan RT/RW',
        shortDesc: 'Direktori pengurus RT/RW, ronda malam, posyandu, dan kontak darurat warga.',
        iconName: 'Building2',
        subMenus: [
          { id: 'directory', label: 'Pengurus & Kontak Sipil', iconName: 'Contact' },
          { id: 'emergency-hotline', label: 'Kontak Darurat Lingkungan', iconName: 'Siren' },
          { id: 'area-zones', label: 'Zona & Fasilitas Publik', iconName: 'Landmark' },
        ],
      },
      {
        id: 'volunteering',
        categoryId: 'society',
        name: 'Sukarelawan & Aksi Sosial',
        shortDesc: 'Catatan jam keterlibatan bakti sosial, pengajaran sukarela, dan peduli lingkungan.',
        iconName: 'HandHeart',
        subMenus: [
          { id: 'initiatives', label: 'Aksi & Organisasi', iconName: 'Smile' },
          { id: 'hour-log', label: 'Log Jam Kontribusi', iconName: 'Hourglass' },
          { id: 'causes', label: 'Bidang Kepedulian', iconName: 'Compass' },
        ],
      },
      {
        id: 'charity',
        categoryId: 'society',
        name: 'Filantropi & Donasi',
        shortDesc: 'Pencatatan zakat, infak, santunan yatim, dan donasi tanggap bencana.',
        iconName: 'Coins',
        subMenus: [
          { id: 'donations', label: 'Catatan Donasi Nyata', iconName: 'Receipt' },
          { id: 'pledges', label: 'Komitmen Rutin / Zakat', iconName: 'Repeat' },
          { id: 'impact', label: 'Rekapitulasi Dampak', iconName: 'TrendingUp' },
        ],
      },
      {
        id: 'community_events',
        categoryId: 'society',
        name: 'Acara & Agenda Warga',
        shortDesc: 'Papan agenda rapat RW, kerja bakti, peringatan 17-an, dan absensi relawan.',
        iconName: 'CalendarCheck',
        subMenus: [
          { id: 'event-board', label: 'Papan Agenda Warga', iconName: 'Calendar' },
          { id: 'rsvp-roster', label: 'Daftar Kehadiran & Peran', iconName: 'Users' },
          { id: 'budget', label: 'Alokasi Kas Panitia', iconName: 'DollarSign' },
        ],
      },
      {
        id: 'advocacy',
        categoryId: 'society',
        name: 'Aspirasi & Laporan Fasum',
        shortDesc: 'Pelaporan jalan rusak, lampu PJU, surat ke dinas, serta matriks urgensi aspirasi publik.',
        iconName: 'Megaphone',
        subMenus: [
          { id: 'issues', label: 'Daftar Laporan Aspirasi', iconName: 'AlertCircle' },
          { id: 'urgency-matrix', label: 'Matriks Urgensi Publik', iconName: 'Grid' },
          { id: 'progress', label: 'Tindak Lanjut Dinas/RT', iconName: 'CheckCircle2' },
        ],
      },
    ],
  },
];

export const CATEGORIES_CONFIG_POO: CategoryDefinition[] = [
  {
    id: 'productivity',
    name: 'Productivity',
    description: 'Manajemen proyek, eksekusi tugas mendalam (Deep Work), dan perpustakaan SOP kerja.',
    iconName: 'Zap',
    apps: [
      {
        id: 'projects',
        categoryId: 'productivity',
        name: 'Proyek & Inisiatif',
        shortDesc: 'Pencapaian milestone, tenggat waktu, dan persentase kemajuan deliverable.',
        iconName: 'Briefcase',
        subMenus: [
          { id: 'all-projects', label: 'Semua Proyek', iconName: 'Layers' },
          { id: 'in-progress', label: 'Sedang Berjalan', iconName: 'PlayCircle' },
          { id: 'milestones', label: 'Evaluasi & Selesai', iconName: 'CheckCircle2' },
        ],
      },
      {
        id: 'tasks',
        categoryId: 'productivity',
        name: 'Tugas & Deep Work',
        shortDesc: 'Matriks Eisenhower (urgensi vs kepentingan), estimasi jam, dan prioritas eksekusi.',
        iconName: 'CheckSquare',
        subMenus: [
          { id: 'eisenhower', label: 'Matriks Eisenhower', iconName: 'Grid' },
          { id: 'todo-list', label: 'Daftar Tugas Harian', iconName: 'ListTodo' },
          { id: 'completed', label: 'Riwayat Selesai', iconName: 'Check' },
        ],
      },
      {
        id: 'knowledge',
        categoryId: 'productivity',
        name: 'Pustaka SOP & Playbook',
        shortDesc: 'Dokumentasi prosedur kerja standar, panduan teknis, dan cetak biru strategi.',
        iconName: 'BookOpen',
        subMenus: [
          { id: 'articles', label: 'Pustaka SOP', iconName: 'FileText' },
          { id: 'sops', label: 'Standar Operasional', iconName: 'ClipboardCheck' },
          { id: 'templates', label: 'Format & Playbook', iconName: 'Bookmark' },
        ],
      },
      {
        id: 'time_audit',
        categoryId: 'productivity',
        name: 'Audit Waktu & Deep Work',
        shortDesc: 'Pelacak blok fokus kerja mendalam, rasio distraksi, dan analisis jam puncak energi.',
        iconName: 'Timer',
        subMenus: [
          { id: 'blocks', label: 'Blok Sesi Fokus', iconName: 'Clock' },
          { id: 'focus-ratio', label: 'Rasio Fokus vs Distraksi', iconName: 'PieChart' },
          { id: 'energy-peaks', label: 'Puncak Energi & Output', iconName: 'Zap' },
        ],
      },
      {
        id: 'meetings',
        categoryId: 'productivity',
        name: 'Notulensi & Keputusan Rapat',
        shortDesc: 'Ringkasan objektif pertemuan, poin kesepakatan final, dan pelacak komitmen PIC.',
        iconName: 'FileCheck',
        subMenus: [
          { id: 'meeting-list', label: 'Daftar Notulensi', iconName: 'FileText' },
          { id: 'decisions', label: 'Log Keputusan Final', iconName: 'CheckCircle' },
          { id: 'action-items', label: 'Action Items & PIC', iconName: 'ListTodo' },
        ],
      },
    ],
  },
  {
    id: 'operations',
    name: 'Operations',
    description: 'Alur kerja berulang, direktori rekanan vendor / SaaS, dan pelacakan insiden kerja.',
    iconName: 'Cpu',
    apps: [
      {
        id: 'workflows',
        categoryId: 'operations',
        name: 'Alur Kerja & Pipeline',
        shortDesc: 'Proses bertahap (onboarding, approval, delivery) dengan pemantauan siklus.',
        iconName: 'GitBranch',
        subMenus: [
          { id: 'pipelines', label: 'Pipeline Aktif', iconName: 'GitCommit' },
          { id: 'active-runs', label: 'Tahapan Proses', iconName: 'Activity' },
          { id: 'templates', label: 'Alur Standar', iconName: 'Sliders' },
        ],
      },
      {
        id: 'vendors',
        categoryId: 'operations',
        name: 'Vendor & Mitra Layanan',
        shortDesc: 'Kontrak penyedia layanan, komitmen SLA, nilai kontrak, dan jatuh tempo perpanjangan.',
        iconName: 'Building',
        subMenus: [
          { id: 'directory', label: 'Direktori Vendor', iconName: 'Users' },
          { id: 'contracts', label: 'Jatuh Tempo Kontrak', iconName: 'Calendar' },
          { id: 'slas', label: 'Evaluasi Rating SLA', iconName: 'Star' },
        ],
      },
      {
        id: 'incidents',
        categoryId: 'operations',
        name: 'Log Insiden & Masalah',
        shortDesc: 'Pencatatan gangguan operasional, level urgensi, akar masalah, dan evaluasi.',
        iconName: 'AlertOctagon',
        subMenus: [
          { id: 'active-issues', label: 'Insiden Terbuka', iconName: 'AlertTriangle' },
          { id: 'resolved', label: 'Terselesaikan', iconName: 'CheckCircle' },
          { id: 'post-mortem', label: 'Akar Masalah (RCA)', iconName: 'FileSearch' },
        ],
      },
      {
        id: 'procurement',
        categoryId: 'operations',
        name: 'Pengadaan & Purchase Orders',
        shortDesc: 'Alur permintaan barang kantor, ambang persetujuan anggaran, dan status kiriman PO.',
        iconName: 'ShoppingBag',
        subMenus: [
          { id: 'po-requests', label: 'Daftar Permintaan (PO)', iconName: 'Receipt' },
          { id: 'threshold-matrix', label: 'Matriks Otorisasi Belanja', iconName: 'Sliders' },
          { id: 'deliveries', label: 'Penerimaan & Status Lunas', iconName: 'Truck' },
        ],
      },
      {
        id: 'compliance',
        categoryId: 'operations',
        name: 'Audit Kepatuhan & Regulasi',
        shortDesc: 'Matriks kepatuhan hukum, audit ISO/K3/Pajak, dan skor kesiapan inspeksi eksternal.',
        iconName: 'CheckCircle2',
        subMenus: [
          { id: 'compliance-matrix', label: 'Matriks Kepatuhan', iconName: 'Shield' },
          { id: 'readiness-score', label: 'Skor Kesiapan Audit', iconName: 'Award' },
          { id: 'expiry-radar', label: 'Radar Jatuh Tempo Izin', iconName: 'Clock' },
        ],
      },
    ],
  },
  {
    id: 'ownership',
    name: 'Ownership',
    description: 'Inventaris aset modal berharga, hak kekayaan intelektual / domain, dan tabel ekuitas.',
    iconName: 'ShieldCheck',
    apps: [
      {
        id: 'assets',
        categoryId: 'ownership',
        name: 'Aset Modal & Portofolio',
        shortDesc: 'Pencatatan inventaris berharga tinggi, depresiasi nilai, dan lokasi penempatan.',
        iconName: 'Boxes',
        subMenus: [
          { id: 'inventory', label: 'Daftar Aset Modal', iconName: 'Box' },
          { id: 'valuation', label: 'Valuasi & Nilai', iconName: 'DollarSign' },
          { id: 'maintenance-cost', label: 'Status Penempatan', iconName: 'MapPin' },
        ],
      },
      {
        id: 'ip_licenses',
        categoryId: 'ownership',
        name: 'Hak Cipta, Lisensi & IP',
        shortDesc: 'Merek dagang, kepemilikan domain web, hak paten, dan perpanjangan lisensi komersial.',
        iconName: 'Award',
        subMenus: [
          { id: 'all-licenses', label: 'Semua Lisensi & IP', iconName: 'FileCheck' },
          { id: 'domains', label: 'Domain & Hosting', iconName: 'Globe' },
          { id: 'expiring-soon', label: 'Segera Kedaluwarsa', iconName: 'Clock' },
        ],
      },
      {
        id: 'cap_table',
        categoryId: 'ownership',
        name: 'Struktur Saham & Ekuitas',
        shortDesc: 'Tabel permodalan (cap table), persentase pemegang saham, dan jadwal vesting.',
        iconName: 'PieChart',
        subMenus: [
          { id: 'stakeholders', label: 'Pemegang Saham', iconName: 'Users' },
          { id: 'classes', label: 'Alokasi Porsi (%)', iconName: 'Percent' },
          { id: 'vesting', label: 'Perjanjian & Vesting', iconName: 'FileSignature' },
        ],
      },
      {
        id: 'investments',
        categoryId: 'ownership',
        name: 'Portofolio Investasi & Treasury',
        shortDesc: 'Pelacak instrumen SBN, saham publik, reksadana, dan kalkulator estimasi dividen.',
        iconName: 'TrendingUp',
        subMenus: [
          { id: 'portfolio', label: 'Portofolio Aset', iconName: 'Briefcase' },
          { id: 'dividend-calc', label: 'Kalkulator Imbal Hasil (Yield)', iconName: 'Calculator' },
          { id: 'allocation', label: 'Alokasi Kelas Aset', iconName: 'PieChart' },
        ],
      },
      {
        id: 'real_estate',
        categoryId: 'ownership',
        name: 'Properti & Lahan Komersial',
        shortDesc: 'Sertifikat tanah SHM/HGB, nilai appraisal pasar, dan kalkulator cap rate sewa tahunan.',
        iconName: 'Landmark',
        subMenus: [
          { id: 'properties', label: 'Daftar Properti & Ruko', iconName: 'Building' },
          { id: 'cap-rate-calc', label: 'Kalkulator Rental Yield & Cap Rate', iconName: 'Coins' },
          { id: 'tenants', label: 'Status Kontrak Sewa', iconName: 'Users' },
        ],
      },
    ],
  },
];

// Helper to get active categories based on workspace
export const getCategoriesConfig = (workspace: WorkspaceId): CategoryDefinition[] => {
  if (workspace === 'pfs') return CATEGORIES_CONFIG_PFS;
  if (workspace === 'poo') return CATEGORIES_CONFIG_POO;
  return CATEGORIES_CONFIG_PEH;
};

// Ecosystem Comparison Matrix
export interface EcosystemDifference {
  aspect: string;
  peh: {
    title: string;
    focus: string;
    question: string;
    scope: string;
    modules: string[];
    exampleData: string;
  };
  pfs: {
    title: string;
    focus: string;
    question: string;
    scope: string;
    modules: string[];
    exampleData: string;
  };
  poo: {
    title: string;
    focus: string;
    question: string;
    scope: string;
    modules: string[];
    exampleData: string;
  };
}

export const ECOSYSTEM_COMPARISON: EcosystemDifference[] = [
  {
    aspect: 'Fokus Utama (Core Philosophy)',
    peh: {
      title: 'Personal, Essentials, and Household (PEH)',
      focus: 'Logistik Internal, Produktivitas Diri, & Aset Fisik Mandiri',
      question: 'Bagaimana saya menata rutinitas hidup, melindungi aset/berkas penting, dan merawat rumah tangga harian saya?',
      scope: 'Privat & Domestik Internal (Mikro)',
      modules: ['Habit & Jurnal', 'Brankas Sandi & Polis Berkas', 'Dapur, Servis AC & Piket'],
      exampleData: 'Target lari 5k, sandi WiFi rumah, polis asuransi, stok beras di kulkas, jadwal cuci AC.',
    },
    pfs: {
      title: 'People, Family, and Society (PFS)',
      focus: 'Relasi Interpersonal, Ikatan Kekerabatan, & Kontribusi Sosial',
      question: 'Bagaimana saya memelihara silaturahmi dengan orang lain, mengayomi keluarga besar, dan memberi dampak bagi lingkungan?',
      scope: 'Relasional & Kemasyarakatan Eksternal (Makro)',
      modules: ['CRM Relasi & Ulang Tahun', 'Silsilah & Rekam Medis Keluarga', 'Pengurus RT/RW, Relawan & Donasi'],
      exampleData: 'Frekuensi sapa mentor, ulang tahun sahabat, riwayat alergi anak, nomor darurat satpam komplek, log donasi zakat.',
    },
    poo: {
      title: 'Productivity, Operations, and Ownership (POO)',
      focus: 'Eksekusi Profesional, Tata Kelola Bisnis & Akumulasi Aset Modal',
      question: 'Bagaimana saya menghasilkan karya berdampak, mengotomasi alur operasional, dan membangun kepemilikan aset bernilai jangka panjang?',
      scope: 'Profesional, Kelembagaan & Permodalan (Strategis)',
      modules: ['Proyek, Tugas Deep Work & SOP', 'Pipeline Alur, Vendor & Log Insiden', 'Aset Modal, Lisensi IP & Cap Table'],
      exampleData: 'Milestone rilis v2.0, matriks Q1 Eisenhower, playbook onboarding, SLA vendor cloud 99.9%, kepemilikan saham 40%.',
    },
  },
  {
    aspect: 'Sifat Data & Orientasi Nilai',
    peh: {
      title: 'Eksklusif & Fungsional',
      focus: 'Data operasional harian yang bersifat langsung dikerjakan oleh individu atau penghuni satu atap.',
      question: 'Apakah tugas domestik dan kewajiban tagihan saya sudah selesai?',
      scope: 'Satu unit hunian / ruang pribadi',
      modules: ['Operasional Dapur', 'Tagihan PLN/WiFi', 'Piket Kamar Mandi'],
      exampleData: 'Stok telur 10 butir, tagihan listrik Rp 450.000.',
    },
    pfs: {
      title: 'Kolektif & Empati',
      focus: 'Data sosial, jejaring empati, dan sejarah kekerabatan lintas keluarga & masyarakat.',
      question: 'Kapan terakhir kali saya menanyakan kabar kerabat, dan apa kontribusi saya di lingkungan warga?',
      scope: 'Komunitas, trah keluarga besar, warga RT/RW',
      modules: ['Silsilah Generasi', 'Resep Warisan Nenek', 'Bakti Sosial & Donor'],
      exampleData: 'Ulang tahun pernikahan paman, arisan trah Idul Fitri, nomor ronda malam RT 04.',
    },
    poo: {
      title: 'Strategis & Kuantitatif',
      focus: 'Data eksekusi bernilai tambah komersial, akuntabilitas alur proses, dan kepemilikan legal.',
      question: 'Berapa efisiensi alur kerja tim, kepatuhan SLA pihak ketiga, dan berapa valuasi aset bersih perusahaan?',
      scope: 'Unit usaha, kemitraan bisnis, instrumen legalitas',
      modules: ['Tenggat Deliverable', 'Audit Masalah Sistem', 'Alokasi Porsi Saham'],
      exampleData: 'Valuasi server Rp 45jt, SLA vendor Grade A, hak paten merk terdaftar IDM00982.',
    },
  },
  {
    aspect: 'Sinergi & Integrasi Antar-Ekosistem',
    peh: {
      title: 'Sinergi Fondasi (PEH)',
      focus: 'Menyediakan fondasi stabilitas hidup pribadi agar siap berinteraksi sosial dan berkarya profesional tanpa burn-out.',
      question: 'Kesehatan fisik, ketenangan batin, dan rumah yang rapi membuat fokus kerja maksimal.',
      scope: 'Pondasi dasar stabilitas',
      modules: ['Rutinitas Habit', 'Kerapian Rumah', 'Kesehatan Diri'],
      exampleData: 'Menyelesaikan habit tidur cukup agar siap memimpin sprint proyek di POO.',
    },
    pfs: {
      title: 'Sinergi Makna (PFS)',
      focus: 'Memberikan tujuan moral, jaringan dukungan sosial, dan kehangatan keluarga bagi perjalanan karier.',
      question: 'Keberhasilan kerja dan bisnis pada akhirnya didedikasikan untuk membahagiakan keluarga dan memberi manfaat bagi sesama.',
      scope: 'Pemaknaan nilai hidup & relasi',
      modules: ['Dukungan Keluarga', 'Jejaring Kolega', 'Donasi Sosial'],
      exampleData: 'Keberhasilan laba bisnis di POO dialokasikan sebagian ke zakat dan bakti sosial di PFS.',
    },
    poo: {
      title: 'Sinergi Penciptaan Nilai (POO)',
      focus: 'Menghasilkan arus kas (cashflow), modal mandiri, dan kemakmuran finansial untuk menopang kehidupan.',
      question: 'Eksekusi kerja unggul dan kepemilikan aset menyediakan sumber daya finansial bagi rumah tangga dan kontribusi sosial.',
      scope: 'Mesin pertumbuhan & aset',
      modules: ['Eksekusi Proyek', 'SOP Efisiensi', 'Ekuitas & Portofolio'],
      exampleData: 'Pendapatan dari proyek di POO mendanai kebutuhan rumah tangga PEH dan filantropi PFS.',
    },
  },
];

