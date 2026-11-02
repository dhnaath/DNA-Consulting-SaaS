import React, { useState, useMemo } from 'react';
import { usePEH } from '../../context/PEHContext';
import { StandaloneAppId, WorkspaceId } from '../../types';
import { Icon } from '../common/Icon';

export interface InnovationFeature {
  id: number;
  title: string;
  ecosystem: WorkspaceId;
  category: string;
  targetApp: StandaloneAppId;
  targetAppName: string;
  targetSubMenu: string;
  urgency: string;
  mechanism: string;
  outputValue: string;
  interactiveType?:
    | 'chronotype'
    | 'habit-elasticity'
    | 'emergency-will'
    | 'sub-phantom'
    | 'runway'
    | 'insurance-gap'
    | 'pantry-waste'
    | 'vehicle-tco'
    | 'dunbar-decay'
    | 'family-medical'
    | 'family-fund'
    | 'zakat-calc'
    | 'critical-path'
    | 'deep-work-ratio'
    | 'meeting-roi'
    | 'capex-opex'
    | 'cap-table'
    | 'rebalance'
    | 'dividend-snowball'
    | 'real-estate-yield';
}

export const INNOVATION_FEATURES: InnovationFeature[] = [
  // --- PEH: 17 Fitur ---
  {
    id: 1,
    title: 'Chronotype & Circadian Energy Alignment Engine',
    ecosystem: 'peh',
    category: 'Personal',
    targetApp: 'sleep',
    targetAppName: 'Tidur & Pemulihan',
    targetSubMenu: 'recovery-calc',
    urgency: 'Kebiasaan sulit konsisten karena dijadwalkan saat energi biologis harian berada di titik terendah.',
    mechanism: 'Menghitung waktu puncak fokus (Deep Focus), waktu olahraga ideal, dan jendela wind-down berdasarkan jam bangun dan tipe kronotipe.',
    outputValue: 'Circadian Fit Score (0-100%) dan peta jadwal produktivitas biologis harian.',
    interactiveType: 'chronotype',
  },
  {
    id: 2,
    title: 'Habit Elasticity & Resistance Matrix',
    ecosystem: 'peh',
    category: 'Personal',
    targetApp: 'habits',
    targetAppName: 'Habit & Rutinitas',
    targetSubMenu: 'streak-recovery',
    urgency: 'Streak kebiasaan mudah hancur saat hari sibuk karena target aktivitas harian terlalu kaku.',
    mechanism: 'Membagi 1 kebiasaan menjadi 3 tingkat fleksibilitas: Versi 2 Menit (MVH saat lelah), Versi Standar, dan Versi Puncak.',
    outputValue: 'Habit Elasticity Index yang menjaga momentum tanpa rasa bersalah.',
    interactiveType: 'habit-elasticity',
  },
  {
    id: 3,
    title: 'Cognitive Distraction & Doomscroll Sentinel',
    ecosystem: 'peh',
    category: 'Personal',
    targetApp: 'journal',
    targetAppName: 'Jurnal & Mood',
    targetSubMenu: 'mood-map',
    urgency: 'Refleksi harian sering luput mendeteksi pemicu mental drain akibat konsumsi media sosial berlebih.',
    mechanism: 'Logging cepat saat terdistraksi: catat emosi pemicu (bosan/cemas), aplikasi pemicu, dan 1 aksi jeda sadar (grounding).',
    outputValue: 'Peta korelasi antara suasana hati dengan jam rawan distraksi digital.',
  },
  {
    id: 4,
    title: 'Micro-Habit Stacking Matrix (Atomic Anchors)',
    ecosystem: 'peh',
    category: 'Personal',
    targetApp: 'habits',
    targetAppName: 'Habit & Rutinitas',
    targetSubMenu: 'all-habits',
    urgency: 'Memulai rutinitas baru dari nol tanpa jangkar kegiatan lama sering kali terlupakan.',
    mechanism: 'Memetakan formula: "Setelah saya [Aktivitas Rutin Lama], saya akan segera [Aktivitas Baru 60 Detik]".',
    outputValue: 'Visual rantai loop kebiasaan yang otomatis memicu konsistensi.',
  },
  {
    id: 5,
    title: 'Nutrition Macro-to-Energy Correlation Tracker',
    ecosystem: 'peh',
    category: 'Personal',
    targetApp: 'fitness',
    targetAppName: 'Latihan & Olahraga',
    targetSubMenu: 'calculator',
    urgency: 'Kantuk berat di sore hari (afternoon slump) sering terjadi tanpa disadari akibat rasio makan siang yang keliru.',
    mechanism: 'Mencatat porsi makronutrisi (karbohidrat, protein, serat) dan menghubungkannya dengan tingkat kesegaran sore.',
    outputValue: 'Rekomendasi rasio makanan pra-latihan dan pencegah lonjakan gula darah.',
  },
  {
    id: 6,
    title: 'Injury Prevention & Recovery Readiness Index',
    ecosystem: 'peh',
    category: 'Personal',
    targetApp: 'fitness',
    targetAppName: 'Latihan & Olahraga',
    targetSubMenu: 'history',
    urgency: 'Latihan berlebihan (overtraining) berisiko memicu cedera otot yang menghentikan progres kebugaran.',
    mechanism: 'Audit 4 metrik subjektif pagi: Nyeri Otot, Stres Pikiran, Kualitas Tidur, dan Fleksibilitas Sendi.',
    outputValue: 'Status harian: Push Hard, Steady State, atau Deload / Active Recovery Day.',
  },
  {
    id: 7,
    title: 'Bibliotherapy & Reading Insight Action Synthesizer',
    ecosystem: 'peh',
    category: 'Personal',
    targetApp: 'reading',
    targetAppName: 'Buku & Bacaan',
    targetSubMenu: 'quotes',
    urgency: 'Banyak buku selesai dibaca namun saripati ilmunya tidak pernah dieksekusi menjadi tindakan nyata.',
    mechanism: 'Wajib mengekstrak minimal 1 aturan praktis (Rule of Life) dari setiap buku dan menjadikannya item aksi terukur.',
    outputValue: 'Knowledge Return on Investment (K-ROI) dari daftar bacaan pengguna.',
  },
  {
    id: 8,
    title: 'Digital Will & Emergency Access Protocol',
    ecosystem: 'peh',
    category: 'Essentials',
    targetApp: 'vault',
    targetAppName: 'Brankas Sandi & Kunci',
    targetSubMenu: 'security-audit',
    urgency: 'Ketika musibah terjadi, keluarga terdekat tidak tahu cara mengakses dokumen penting dan akun finansial.',
    mechanism: 'Daftar periksa kontak darurat tepercaya (Trusted Guardians), lokasi master-key fisik, dan instruksi penyerahan akses legal.',
    outputValue: 'Executive Summary Protokol Darurat Terenkripsi yang siap dicetak di brankas fisik.',
    interactiveType: 'emergency-will',
  },
  {
    id: 9,
    title: 'Zero-Knowledge Credential Expiry Watchdog',
    ecosystem: 'peh',
    category: 'Essentials',
    targetApp: 'vault',
    targetAppName: 'Brankas Sandi & Kunci',
    targetSubMenu: 'all-keys',
    urgency: 'Kata sandi dan token API yang tidak pernah diganti rentan terhadap kebocoran bertingkat.',
    mechanism: 'Menandai kata sandi yang berumur > 90 hari, duplikasi pola sandi, dan menyarankan pembaruan otomatis.',
    outputValue: 'Skor Vault Security Hygiene (A, B, C, D) dengan filter cepat akun berisiko tinggi.',
  },
  {
    id: 10,
    title: 'Tax-Deductible Receipt & Proof Vault',
    ecosystem: 'peh',
    category: 'Essentials',
    targetApp: 'documents',
    targetAppName: 'Dokumen & Garansi',
    targetSubMenu: 'active-docs',
    urgency: 'Bukti pembayaran biaya pengurang pajak resmi sering tercecer menjelang pelaporan SPT tahunan.',
    mechanism: 'Kategorisasi berkas dengan tanda Bukti Pajak Sah, tahun pajak, nilai nominal kuitansi, dan nomor referensi potong.',
    outputValue: 'Laporan agregasi pengurang pajak tahun berjalan siap lampir formulir SPT.',
  },
  {
    id: 11,
    title: 'Subscription Phantom Cost & Price Hike Detector',
    ecosystem: 'peh',
    category: 'Essentials',
    targetApp: 'subscriptions',
    targetAppName: 'Langganan & Tagihan',
    targetSubMenu: 'active-subs',
    urgency: 'Layanan berlangganan menaikkan biaya diam-diam atau terus memotong rekening tanpa pernah dipakai.',
    mechanism: 'Menghitung Biaya Riil per Pemakaian (Cost per Use = Biaya Bulanan / Frekuensi Penggunaan Riil).',
    outputValue: 'Peringatan Zombie Subscription untuk layanan dengan rasio biaya pemakaian tidak wajar.',
    interactiveType: 'sub-phantom',
  },
  {
    id: 12,
    title: 'Runway Simulator & Emergency Buffer Health Score',
    ecosystem: 'peh',
    category: 'Essentials',
    targetApp: 'budget',
    targetAppName: 'Anggaran & Kas',
    targetSubMenu: 'envelopes',
    urgency: 'Banyak orang tidak tahu pasti berapa bulan mereka bisa bertahan hidup bila sumber pemasukan mendadak terhenti.',
    mechanism: 'Membagi total saldo tabungan likuid dengan estimasi burn rate pengeluaran pokok bulanan.',
    outputValue: 'Indikator Financial Runway (misal: "7,5 Bulan Aman") dan simulasi pemangkasan biaya.',
    interactiveType: 'runway',
  },
  {
    id: 13,
    title: 'Insurance Policy Coverage Gap & Deductible Analyzer',
    ecosystem: 'peh',
    category: 'Essentials',
    targetApp: 'insurance',
    targetAppName: 'Asuransi & Polis',
    targetSubMenu: 'policies',
    urgency: 'Terdapat jurang besar antara total tanggungan utang & nafkah keluarga dengan plafon proteksi asuransi yang ada.',
    mechanism: 'Membandingkan total liabilitas finansial + 10x pengeluaran tahunan keluarga terhadap total uang pertanggungan polis.',
    outputValue: 'Diagram kelengkapan proteksi (Jiwa, Sakit Kritis, Kesehatan, Aset) dan peringatan defisit pertanggungan.',
    interactiveType: 'insurance-gap',
  },
  {
    id: 14,
    title: 'Smart Pantry Meal Inspiration & Waste Minimizer',
    ecosystem: 'peh',
    category: 'Household',
    targetApp: 'pantry',
    targetAppName: 'Dapur & Logistik',
    targetSubMenu: 'inventory',
    urgency: 'Bahan masakan sering membusuk di pojok kulkas karena luput dari pantauan tanggal kedaluwarsa.',
    mechanism: 'Mendeteksi 3 bahan teratas dengan sisa umur < 3 hari dan menghasilkan ide olahan masakan penyelamat (Rescue Meal).',
    outputValue: 'Estimasi nominal uang rupiah yang berhasil diselamatkan dari pemborosan makanan.',
    interactiveType: 'pantry-waste',
  },
  {
    id: 15,
    title: 'Home Preventive Maintenance Lifecycle & Cost Estimator',
    ecosystem: 'peh',
    category: 'Household',
    targetApp: 'maintenance',
    targetAppName: 'Pemeliharaan Rumah',
    targetSubMenu: 'upcoming',
    urgency: 'Kerusakan rumah (AC bocor, pipa mampet, genteng pecah) datang tiba-tiba dengan biaya darurat membengkak.',
    mechanism: 'Jadwal servis preventif siklis berkala (AC tiap 3 bulan, toren tiap 6 bulan, filter air tiap bulan) beserta tabungan sinking fund.',
    outputValue: 'Kalender servis rumah tangga otomatis dan proyeksi bujet perawatan preventif tahunan.',
  },
  {
    id: 16,
    title: 'Chore Equity & Household Burnout Balancing Matrix',
    ecosystem: 'peh',
    category: 'Household',
    targetApp: 'chores',
    targetAppName: 'Tugas Domestik',
    targetSubMenu: 'assignment',
    urgency: 'Ketimpangan beban kerja domestik di rumah memicu kelelahan emosional dan konflik antar-penghuni rumah.',
    mechanism: 'Setiap tugas memiliki bobot tingkat kesulitan (Effort Weight 1-5) dan melacak proporsi penyelesaian per orang.',
    outputValue: 'Diagram keadilan beban domestik mingguan yang transparan dan setara.',
  },
  {
    id: 17,
    title: 'Vehicle Total Cost of Ownership (TCO) & Depletion Engine',
    ecosystem: 'peh',
    category: 'Household',
    targetApp: 'vehicles',
    targetAppName: 'Kendaraan & Garasi',
    targetSubMenu: 'service-schedule',
    urgency: 'Pemilik mobil/motor sering mengabaikan biaya penyusutan nilai, aus ban, pajak, dan servis berkala per kilometer.',
    mechanism: 'Menghitung Biaya Riil per Kilometer dengan menggabungkan akumulasi bensin, servis, asuransi, depresiasi, dan jarak tempuh.',
    outputValue: 'Metrik efisiensi operasional kendaraan riil (Rp / km).',
    interactiveType: 'vehicle-tco',
  },

  // --- PFS: 17 Fitur ---
  {
    id: 18,
    title: "Dunbar's Number & Relationship Decay Sentinel",
    ecosystem: 'pfs',
    category: 'People',
    targetApp: 'contacts',
    targetAppName: 'Kontak & Jejaring',
    targetSubMenu: 'all',
    urgency: 'Hubungan persahabatan berharga kerap merenggang tanpa disengaja karena berbulan-bulan terlewat saling menyapa.',
    mechanism: 'Mengelompokkan kontak ke 4 lingkaran Dunbar (Intimate 5, Close 15, Active 50, Casual 150) dan memicu alarm kontak pudar.',
    outputValue: 'Daftar rekomendasi mingguan "Sapa Kembali Minggu Ini" beserta sisa hari tenggat kontak.',
    interactiveType: 'dunbar-decay',
  },
  {
    id: 19,
    title: 'Conversational Context & Life Milestone Recall',
    ecosystem: 'pfs',
    category: 'People',
    targetApp: 'contacts',
    targetAppName: 'Kontak & Jejaring',
    targetSubMenu: 'favorites',
    urgency: 'Kerap lupa nama pasangan/anak teman atau update proyek penting mereka saat bertemu kembali di acara sosial.',
    mechanism: 'Kartu pengingat konteks cepat berisi topik obrolan terakhir dan hal-hal yang pantang dibahas.',
    outputValue: 'Profil ringkas relasi yang siap dibaca dalam 30 detik sebelum panggilan telepon atau pertemuan tatap muka.',
  },
  {
    id: 20,
    title: 'Gift Preference Profile & Anti-Duplicate Exchange Log',
    ecosystem: 'pfs',
    category: 'People',
    targetApp: 'gifts',
    targetAppName: 'Hadiah & Apresiasi',
    targetSubMenu: 'ideas',
    urgency: 'Bingung mencari hadiah yang berkesan atau tidak sengaja membelikan kado yang mirip dengan tahun lalu.',
    mechanism: 'Pencatatan ukuran, alergi, hal favorit/pantangan, dan riwayat kado yang pernah diberikan secara kronologis.',
    outputValue: 'Wishlist Repository kado per relasi dengan status Ide Baru vs Sudah Pernah Diberikan.',
  },
  {
    id: 21,
    title: 'Reverse Mentorship & Dual-Direction Goal Tracker',
    ecosystem: 'pfs',
    category: 'People',
    targetApp: 'mentorship',
    targetAppName: 'Mentorship & Bimbingan',
    targetSubMenu: 'active-programs',
    urgency: 'Mentorship sering kali satu arah dan kaku tanpa komitmen tindak lanjut terukur dari kedua belah pihak.',
    mechanism: 'Melacak komitmen timbal balik: aksi apa yang wajib dieksekusi mentee dan wawasan segar apa yang dipetik mentor.',
    outputValue: 'Laporan evaluasi kompetensi bilateral per siklus 6 bulan.',
  },
  {
    id: 22,
    title: 'Warm Introduction Pathway & Trust Brokerage Matrix',
    ecosystem: 'pfs',
    category: 'People',
    targetApp: 'introductions',
    targetAppName: 'Pengenalan & Relasi',
    targetSubMenu: 'pending',
    urgency: 'Mengenalkan dua rekan tanpa izin dan konteks yang jelas (cold introduction) sering kali canggung dan merusak reputasi.',
    mechanism: 'Alur Double Opt-In Introduction: konfirmasi ketertarikan kedua pihak, draf perkenalan nilai tambah, dan pelacakan pasca-pertemuan.',
    outputValue: 'Skor reputasi konektor (Successful Connects Rate).',
  },
  {
    id: 23,
    title: 'Cross-Generational Medical Genealogy & Hereditary Risk Tree',
    ecosystem: 'pfs',
    category: 'Family',
    targetApp: 'family_health',
    targetAppName: 'Kesehatan Keluarga',
    targetSubMenu: 'profiles',
    urgency: 'Riwayat penyakit genetik kakek-nenek (diabetes, hipertensi, jantung) sering tidak terdata terstruktur bagi anak-cucu.',
    mechanism: 'Pemetaan silsilah medis keluarga lengkap dengan penanda risiko genetik dan jadwal skrining berkala.',
    outputValue: 'Ringkasan diagram silsilah medis yang siap ditunjukkan kepada dokter keluarga.',
    interactiveType: 'family-medical',
  },
  {
    id: 24,
    title: 'Family Living Will & Emergency Power of Attorney Registry',
    ecosystem: 'pfs',
    category: 'Family',
    targetApp: 'family_health',
    targetAppName: 'Kesehatan Keluarga',
    targetSubMenu: 'appointments',
    urgency: 'Dalam kondisi kritis medis, keluarga bingung mengambil keputusan medis darurat karena tidak ada panduan kehendak pasien.',
    mechanism: 'Dokumentasi arahan medis di muka (Advance Directive) dan penunjukan perwakilan sah keluarga saat darurat.',
    outputValue: 'Kartu instruksi darurat medis keluarga sah yang tersinkronisasi.',
  },
  {
    id: 25,
    title: 'Tradition Continuity Score & Recipe Heritage Archivist',
    ecosystem: 'pfs',
    category: 'Family',
    targetApp: 'traditions',
    targetAppName: 'Tradisi & Ritual',
    targetSubMenu: 'annual',
    urgency: 'Resep bumbu rahasia keluarga dan tradisi sakral sering punah karena hanya diingat secara lisan antar-generasi.',
    mechanism: 'Pencatatan takaran gramatur bumbu, tips rahasia leluhur, foto langkah masak, dan kalender peringatan tradisi tahunan.',
    outputValue: 'Buku resep digital pusaka keluarga (Legacy Cookbook) yang siap diwariskan.',
  },
  {
    id: 26,
    title: 'Parental Aging Caregiver Schedule & Task Handoff',
    ecosystem: 'pfs',
    category: 'Family',
    targetApp: 'family_health',
    targetAppName: 'Kesehatan Keluarga',
    targetSubMenu: 'allergies',
    urgency: 'Mendampingi orang tua lanjut usia menimbulkan caregiver burnout jika tidak ada koordinasi giliran antar-saudara kandung.',
    mechanism: 'Jadwal pembagian giliran kontrol ke rumah sakit, pembelian obat resep bulanan, dan log tensi/gula darah harian orang tua.',
    outputValue: 'Papan koordinasi pendampingan orang tua yang terkoordinasi antar-saudara.',
  },
  {
    id: 27,
    title: 'Shared Family Wealth Milestone & Collective Goal Pool',
    ecosystem: 'pfs',
    category: 'Family',
    targetApp: 'family_budget',
    targetAppName: 'Anggaran Keluarga',
    targetSubMenu: 'savings-goals',
    urgency: 'Rencana liburan keluarga besar atau renovasi rumah orang tua sering macet karena urun-dana tidak transparan.',
    mechanism: 'Kantong tabungan bersama (Shared Pool) dengan persentase komitmen per anggota dan target waktu penyelesaian.',
    outputValue: 'Dashboard transparansi target tabungan bersama keluarga besar.',
    interactiveType: 'family-fund',
  },
  {
    id: 28,
    title: 'Pet Symptom Journal & Veterinary Triage Protocol',
    ecosystem: 'pfs',
    category: 'Family',
    targetApp: 'pet_care',
    targetAppName: 'Hewan Peliharaan',
    targetSubMenu: 'medical-log',
    urgency: 'Gejala sakit anabul (kucing/anjing) sering terlambat ditangani karena perubahan perilaku awal tidak dicatat.',
    mechanism: 'Pencatatan nafsu makan, keaktifan, feses, siklus vaksinasi, dan protokol cek mandiri sebelum ke dokter hewan.',
    outputValue: 'Buku rekam medis klinis anabul siap konsultasi klinik hewan.',
  },
  {
    id: 29,
    title: 'Neighborhood Disaster Preparedness & Mutual Aid Roster',
    ecosystem: 'pfs',
    category: 'Society',
    targetApp: 'civic',
    targetAppName: 'Kewargaan & RT/RW',
    targetSubMenu: 'contacts',
    urgency: 'Saat musibah banjir atau gempa, warga lingkungan tidak tahu siapa warga lansia yang butuh evakuasi darurat atau siapa yang punya APAR.',
    mechanism: 'Inventarisasi darurat lingkungan warga: identifikasi warga prioritas evakuasi, pemilik genset, dan tenaga medis warga.',
    outputValue: 'Peta Kontinjensi Evakuasi Tanggap Bencana RT/RW.',
  },
  {
    id: 30,
    title: 'Civic Obligation Timeline & Local Regulation Tracker',
    ecosystem: 'pfs',
    category: 'Society',
    targetApp: 'civic',
    targetAppName: 'Kewargaan & RT/RW',
    targetSubMenu: 'regulations',
    urgency: 'Terkena denda atau sanksi administratif akibat terlambat membayar PBB, iuran sampah, atau perpanjangan identitas.',
    mechanism: 'Jadwal jatuh tempo PBB, retribusi daerah, jadwal ronda siskamling, dan repositori kuitansi iuran sah lingkungan.',
    outputValue: 'Status kepatuhan warga negara tanpa tunggakan.',
  },
  {
    id: 31,
    title: 'Volunteer Skills Matching & Social Impact Portfolio',
    ecosystem: 'pfs',
    category: 'Society',
    targetApp: 'volunteering',
    targetAppName: 'Aktivitas Relawan',
    targetSubMenu: 'programs',
    urgency: 'Jam relawan sering terbuang untuk tenaga umum, padahal kontribusi keahlian profesional (desain, hukum, web) bernilai ratusan kali lipat.',
    mechanism: 'Mencatat jam relawan berbasis keahlian (Skill-based Volunteering) dan mengonversinya menjadi valuasi ekonomi riil sumbangsih.',
    outputValue: 'Portofolio Pengabdian Masyarakat terverifikasi (siap lampir profil profesional).',
  },
  {
    id: 32,
    title: 'Zakat, Infaq & Philanthropic Allocation Optimization',
    ecosystem: 'pfs',
    category: 'Society',
    targetApp: 'charity',
    targetAppName: 'Donasi & Amal',
    targetSubMenu: 'recurring',
    urgency: 'Penyaluran zakat mal dan infaq sering kali dilakukan mendadak tanpa perencanaan nisab dan diversifikasi penerima manfaat.',
    mechanism: 'Kalkulator otomatis nisab zakat mal (setara 85 gram emas) dengan hitungan 2,5% serta pembagian proporsional asnaf mustahik.',
    outputValue: 'Buku kas zakat/donasi tahunan lengkap dengan bukti tanda terima amil sah.',
    interactiveType: 'zakat-calc',
  },
  {
    id: 33,
    title: 'Community Event Resource Sharing & Logistics Ledger',
    ecosystem: 'pfs',
    category: 'Society',
    targetApp: 'community_events',
    targetAppName: 'Kegiatan Komunitas',
    targetSubMenu: 'events',
    urgency: 'Kepanitiaan acara 17-an atau buka bersama warga kerap nombok biaya karena logistik pinjam alat dan pengeluaran tidak tercatat.',
    mechanism: 'Pencatatan inventaris pinjam alat warga, daftar tugas panitia seksi, dan pembukuan bujet penerimaan/pengeluaran acara.',
    outputValue: 'Laporan Pertanggungjawaban (LPJ) keuangan acara warga otomatis.',
  },
  {
    id: 34,
    title: 'Grassroots Petition & Civic Initiative Milestone Tracker',
    ecosystem: 'pfs',
    category: 'Society',
    targetApp: 'advocacy',
    targetAppName: 'Advokasi & Inisiatif',
    targetSubMenu: 'campaigns',
    urgency: 'Laporan warga tentang jalan rusak atau lampu mati sering mandek tanpa kepastian tindak lanjut dinas terkait.',
    mechanism: 'Pencatatan nomor tiket aduan dinas, foto bukti kondisi lapangan, eskalasi kontak lurah/camat, dan tenggat tindak lanjut.',
    outputValue: 'Audit trail pengaduan pelayanan publik hingga tuntas.',
  },

  // --- POO: 16 Fitur ---
  {
    id: 35,
    title: 'Project Critical Path & Dependency Bottleneck Forecaster',
    ecosystem: 'poo',
    category: 'Productivity',
    targetApp: 'projects',
    targetAppName: 'Manajemen Proyek',
    targetSubMenu: 'kanban',
    urgency: 'Keterlambatan proyek biasanya dipicu oleh satu tugas kunci pada jalur kritis yang tertahan tugas lain.',
    mechanism: 'Menghitung secara otomatis rangkaian tugas terpanjang (Critical Path) yang tidak memiliki toleransi keterlambatan (zero slack).',
    outputValue: 'Indikator Bottleneck Alert pada tugas penentu tanggal peluncuran.',
    interactiveType: 'critical-path',
  },
  {
    id: 36,
    title: 'Cognitive Load & Deep Work vs. Shallow Work Ratio Engine',
    ecosystem: 'poo',
    category: 'Productivity',
    targetApp: 'time_audit',
    targetAppName: 'Audit Efisiensi Waktu',
    targetSubMenu: 'categories',
    urgency: 'Banyak orang merasa sibuk seharian namun tidak menghasilkan output bernilai tinggi akibat waktu terkuras oleh tugas remeh.',
    mechanism: 'Mengelompokkan jam kerja ke dalam Deep Work (analisis, coding, strategi) vs Shallow Work (chat, koordinasi singkat, email).',
    outputValue: 'Rasio Fokus Bernilai Tinggi (Target: > 60% Deep Work) dan indeks kelelahan kognitif harian.',
    interactiveType: 'deep-work-ratio',
  },
  {
    id: 37,
    title: 'Actionable Meeting ROI & Post-Meeting Decision Tracker',
    ecosystem: 'poo',
    category: 'Productivity',
    targetApp: 'meetings',
    targetAppName: 'Notula & Rapat',
    targetSubMenu: 'upcoming',
    urgency: 'Rapat sering membuang waktu dan biaya besar tanpa menghasilkan keputusan nyata atau tindak lanjut yang jelas.',
    mechanism: 'Menghitung Biaya Riil Rapat (Jumlah Peserta × Durasi Jam × Rata-rata Honor per Jam) dan mewajibkan 1 Action Item dengan PIC tunggal.',
    outputValue: 'Metrik Meeting Efficiency Score dan ringkasan keputusan rapat.',
    interactiveType: 'meeting-roi',
  },
  {
    id: 38,
    title: 'Second Brain Spaced Repetition & Idea Collision Studio',
    ecosystem: 'poo',
    category: 'Productivity',
    targetApp: 'knowledge',
    targetAppName: 'Basis Pengetahuan',
    targetSubMenu: 'articles',
    urgency: 'Catatan wawasan di masa lalu sering terkubur selamanya dan tidak pernah memicu ide-ide inovatif baru.',
    mechanism: 'Algoritma Spaced Repetition yang memunculkan kembali 3 catatan lama secara acak setiap minggu untuk dipadukan dengan proyek aktif.',
    outputValue: 'Studio tabrakan ide kreatif (Idea Collision) antar-disiplin ilmu.',
  },
  {
    id: 39,
    title: 'Context-Switching Cost Minimizer & Batch Planner',
    ecosystem: 'poo',
    category: 'Productivity',
    targetApp: 'tasks',
    targetAppName: 'Tugas & Prioritas',
    targetSubMenu: 'matrix',
    urgency: 'Berpindah konteks kerja secara acak menguras energi otak hingga 40% efisiensi harian.',
    mechanism: 'Mengelompokkan tugas berdasarkan tema energi dan konteks (Telepon Cepat, Tinjauan Keuangan, Fokus Berat, Menulis).',
    outputValue: 'Blok eksekusi tugas borongan (Batch Execution) tanpa guncangan konsentrasi.',
  },
  {
    id: 40,
    title: 'SOP Version Control & Compliance Drill Tracker',
    ecosystem: 'poo',
    category: 'Operations',
    targetApp: 'workflows',
    targetAppName: 'Alur Kerja & SOP',
    targetSubMenu: 'active-sop',
    urgency: 'SOP operasional sering usang sehingga tim bekerja dengan cara lama yang menyalahi standar terbaru.',
    mechanism: 'Pelacakan nomor revisi SOP (v1.0, v1.1), catatan alasan perubahan, dan tanggal simulasi uji berkala (compliance drill).',
    outputValue: 'Audit trail kepatuhan prosedur operasional standar siap sertifikasi ISO.',
  },
  {
    id: 41,
    title: 'Vendor Risk Concentration & SLA Performance Scorecard',
    ecosystem: 'poo',
    category: 'Operations',
    targetApp: 'vendors',
    targetAppName: 'Pemasok & Vendor',
    targetSubMenu: 'active-vendors',
    urgency: 'Ketergantungan berlebih pada satu pemasok tunggal mengancam kelangsungan operasional bisnis saat mereka bermasalah.',
    mechanism: 'Menghitung persentase alokasi pengeluaran per vendor (Concentration Risk) dan skor kepatuhan SLA pengiriman barang.',
    outputValue: 'Kartu rapor berkala vendor (Vendor Tiering: Platinum, Gold, On Probation).',
  },
  {
    id: 42,
    title: 'Incident Root Cause Analysis (5 Whys) & Post-Mortem Log',
    ecosystem: 'poo',
    category: 'Operations',
    targetApp: 'incidents',
    targetAppName: 'Insiden & Masalah',
    targetSubMenu: 'open-tickets',
    urgency: 'Masalah operasional yang sama sering terulang kembali karena investigasi hanya berhenti di penyelesaian gejala luar.',
    mechanism: 'Template terstruktur metode 5-Whys dan analisis sebab-akibat untuk menetapkan tindakan pencegahan permanen (CAPA).',
    outputValue: 'Repositori pembelajaran insiden (Lessons Learned Archive) yang mencegah kesalahan serupa.',
  },
  {
    id: 43,
    title: 'CapEx vs. OpEx Procurement Evaluation Matrix',
    ecosystem: 'poo',
    category: 'Operations',
    targetApp: 'procurement',
    targetAppName: 'Pengadaan & Pembelian',
    targetSubMenu: 'requests',
    urgency: 'Keputusan membeli aset langsung (CapEx) vs menyewa berkala (OpEx) sering diambil tanpa analisis nilai waktu uang.',
    mechanism: 'Membandingkan total biaya 3 tahun antara beli putus vs sewa/langganan, memperhitungkan servis, inflasi, dan fleksibilitas kas.',
    outputValue: 'Rekomendasi kuantitatif keputusan pengadaan yang paling ramah arus kas.',
    interactiveType: 'capex-opex',
  },
  {
    id: 44,
    title: 'Regulatory Audit Readiness Index & Statutory Renewal Watch',
    ecosystem: 'poo',
    category: 'Operations',
    targetApp: 'compliance',
    targetAppName: 'Kepatuhan & Regulasi',
    targetSubMenu: 'audits',
    urgency: 'Izin usaha, NIB, sertifikasi halal/ISO, atau uji kelayakan bisa kedaluwarsa diam-diam dan menghentikan operasi.',
    mechanism: 'Kalender kepatuhan statuter dengan toleransi hitung mundur (H-60, H-30, H-7) sebelum izin habis serta berkas persyaratannya.',
    outputValue: 'Indikator status kepatuhan: 100% Audit Ready, Action Needed, atau Critical Non-Compliance.',
  },
  {
    id: 45,
    title: 'Physical Asset Depreciation & Salvage Value Timeline',
    ecosystem: 'poo',
    category: 'Ownership',
    targetApp: 'assets',
    targetAppName: 'Aset Fisik & Depresiasi',
    targetSubMenu: 'active-assets',
    urgency: 'Nilai buku aset sering tidak akurat karena penyusutan garis lurus tidak diperhitungkan secara konsisten.',
    mechanism: 'Otomasi perhitungan amortisasi penyusutan berdasarkan masa manfaat ekonomis dan estimasi nilai sisa (salvage value).',
    outputValue: 'Tabel nilai buku aset terkini (Current Book Value) dan rekomendasi waktu disposal aset terbaik.',
  },
  {
    id: 46,
    title: 'IP Royalty Flow & Patent Maintenance Fee Calendar',
    ecosystem: 'poo',
    category: 'Ownership',
    targetApp: 'ip_licenses',
    targetAppName: 'Kekayaan Intelektual',
    targetSubMenu: 'registered-ip',
    urgency: 'Hak paten atau merek dagang terdaftar bisa gugur demi hukum bila biaya pemeliharaan tahunan terlambat dibayarkan ke DJKI.',
    mechanism: 'Kalender jatuh tempo biaya tahunan paten/merek, serta pencatatan pendapatan royalti dari lisensi pihak ketiga.',
    outputValue: 'Dashboard kapitalisasi portofolio aset tak berwujud (Intangible Assets).',
  },
  {
    id: 47,
    title: 'Cap Table Dilution & Waterfall Scenario Simulator',
    ecosystem: 'poo',
    category: 'Ownership',
    targetApp: 'cap_table',
    targetAppName: 'Tabel Permodalan Saham',
    targetSubMenu: 'shareholders',
    urgency: 'Founder terkejut oleh besarnya penurunan persentase saham (dilusi) saat putaran investasi baru atau pembagian ESOP.',
    mechanism: 'Simulator valuasi: masukkan target pre-money valuation, suntikan dana baru, dan alokasi ESOP untuk melihat struktur pasca-investasi.',
    outputValue: 'Tabel dan persentase kepemilikan saham sebelum vs sesudah pendanaan baru.',
    interactiveType: 'cap-table',
  },
  {
    id: 48,
    title: 'Portfolio Rebalancing & Asset Allocation Deviation Sentinel',
    ecosystem: 'poo',
    category: 'Ownership',
    targetApp: 'investments',
    targetAppName: 'Investasi & Portofolio',
    targetSubMenu: 'portfolio',
    urgency: 'Reli pasar saham membuat profil risiko portofolio melenceng jauh dari alokasi awal tanpa disadari.',
    mechanism: 'Menetapkan alokasi target (misal: 60% Saham, 30% Obligasi, 10% Kas) dan membunyikan peringatan deviasi jika melenceng > 5%.',
    outputValue: 'Instruksi rebalancing spesifik: instrumen mana yang harus dicairkan dan mana yang harus dibeli.',
    interactiveType: 'rebalance',
  },
  {
    id: 49,
    title: 'Dividend Snowball & Financial Freedom Milestone Tracker',
    ecosystem: 'poo',
    category: 'Ownership',
    targetApp: 'investments',
    targetAppName: 'Investasi & Portofolio',
    targetSubMenu: 'dividend-calendar',
    urgency: 'Investor pasif butuh gambaran bertahap kapan dividen mampu menutup pengeluaran kebutuhan esensial hidup.',
    mechanism: 'Menghitung dividen tahunan dan membaginya ke dalam 3 level kebebasan finansial (Level 1: Tagihan Listrik/Net, Level 2: Belanja Makan, Level 3: Beban Hidup Pokok).',
    outputValue: 'Grafik kurva bola salju dividen dan proyeksi tanggal tercapainya kemandirian finansial.',
    interactiveType: 'dividend-snowball',
  },
  {
    id: 50,
    title: 'Real Estate Yield (Cap Rate, NOI, Cash-on-Cash) Auditor',
    ecosystem: 'poo',
    category: 'Ownership',
    targetApp: 'real_estate',
    targetAppName: 'Properti & Real Estat',
    targetSubMenu: 'properties',
    urgency: 'Banyak pemilik sewa properti mengira untung besar tanpa menghitung biaya PBB, agen, kekosongan (vacancy), dan renovasi.',
    mechanism: 'Kalkulator otomatis imbal hasil sewa: menghitung Net Operating Income (NOI), Capitalization Rate (Cap Rate), dan Cash-on-Cash Return riil.',
    outputValue: 'Skor kelayakan investasi sewa properti dan perbandingan yield antar-unit bangunan.',
    interactiveType: 'real-estate-yield',
  },
];

export const InnovationsHub: React.FC = () => {
  const { navigateTo, activeWorkspace, setActiveWorkspace } = usePEH();

  // State filters
  const [selectedEcosystem, setSelectedEcosystem] = useState<WorkspaceId | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeInteractiveId, setActiveInteractiveId] = useState<number | null>(null);

  // Interactive Sandbox states
  // Chronotype Sandbox
  const [chronoWake, setChronoWake] = useState('06:00');
  const [chronoType, setChronoType] = useState<'lark' | 'third' | 'owl'>('third');

  // Habit Elasticity Sandbox
  const [habitName, setHabitName] = useState('Membaca Buku Bisnis');
  const [habitMvh, setHabitMvh] = useState('1 Halaman (2 Menit)');
  const [habitStd, setHabitStd] = useState('15 Menit');
  const [habitStretch, setHabitStretch] = useState('1 Bab Penuh');

  // Emergency Will Sandbox
  const [guardianName, setGuardianName] = useState('Budi Santoso (Adik Kandung)');
  const [keyLocation, setKeyLocation] = useState('Brankas Baja Rumah, Laci 2');
  const [hasNotarizedDoc, setHasNotarizedDoc] = useState(true);

  // Sub Phantom Sandbox
  const [subFeeMonthly, setSubFeeMonthly] = useState(189000);
  const [subUsagePerMonth, setSubUsagePerMonth] = useState(2);

  // Runway Sandbox
  const [liquidCash, setLiquidCash] = useState(75000000);
  const [monthlyBurn, setMonthlyBurn] = useState(12500000);

  // Insurance Gap Sandbox
  const [annualExpense, setAnnualExpense] = useState(150000000);
  const [existingDebts, setExistingDebts] = useState(200000000);
  const [currentCoverage, setCurrentCoverage] = useState(800000000);

  // Pantry Waste Sandbox
  const [expiringFood1, setExpiringFood1] = useState('Tahu Putih');
  const [expiringFood2, setExpiringFood2] = useState('Telur Ayam');
  const [expiringFood3, setExpiringFood3] = useState('Sawi Hijau');

  // Vehicle TCO Sandbox
  const [annualFuel, setAnnualFuel] = useState(14000000);
  const [annualService, setAnnualService] = useState(4500000);
  const [annualDepreciation, setAnnualDepreciation] = useState(18000000);
  const [annualKm, setAnnualKm] = useState(15000);

  // Dunbar Decay Sandbox
  const [dunbarFriend, setDunbarFriend] = useState('Rian Pratama');
  const [dunbarCircle, setDunbarCircle] = useState<'close' | 'active' | 'casual'>('close');
  const [daysSinceContact, setDaysSinceContact] = useState(45);

  // Family Fund Sandbox
  const [fundTarget, setFundTarget] = useState(50000000);
  const [monthlyContribution, setMonthlyContribution] = useState(3500000);
  const [currentSaved, setCurrentSaved] = useState(18000000);

  // Zakat Sandbox
  const [goldPricePerGram, setGoldPricePerGram] = useState(1450000);
  const [totalAssetZakat, setTotalAssetZakat] = useState(210000000);

  // Deep Work Ratio Sandbox
  const [deepWorkHours, setDeepWorkHours] = useState(4.5);
  const [shallowWorkHours, setShallowWorkHours] = useState(3.5);

  // Meeting ROI Sandbox
  const [attendeeCount, setAttendeeCount] = useState(5);
  const [meetingHours, setMeetingHours] = useState(1.5);
  const [avgHourlyRate, setAvgHourlyRate] = useState(150000);

  // Cap Table Sandbox
  const [preMoneyValuation, setPreMoneyValuation] = useState(10000000000); // 10M
  const [newInvestment, setNewInvestment] = useState(2500000000); // 2.5M

  // Rebalancing Sandbox
  const [stocksVal, setStocksVal] = useState(140000000);
  const [bondsVal, setBondsVal] = useState(30000000);
  const [cashVal, setCashVal] = useState(30000000);

  // Dividend Snowball Sandbox
  const [monthlyLivingCost, setMonthlyLivingCost] = useState(10000000);
  const [annualDividend, setAnnualDividend] = useState(42000000);

  // Real Estate Yield Sandbox
  const [propertyPrice, setPropertyPrice] = useState(850000000);
  const [annualRentalGross, setAnnualRentalGross] = useState(55000000);
  const [annualExpensesProperty, setAnnualExpensesProperty] = useState(9000000);

  // Available categories based on filtered ecosystem
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    INNOVATION_FEATURES.forEach((f) => {
      if (selectedEcosystem === 'all' || f.ecosystem === selectedEcosystem) {
        set.add(f.category);
      }
    });
    return Array.from(set);
  }, [selectedEcosystem]);

  // Filtered features
  const filteredFeatures = useMemo(() => {
    return INNOVATION_FEATURES.filter((f) => {
      const matchEco = selectedEcosystem === 'all' || f.ecosystem === selectedEcosystem;
      const matchCat = selectedCategory === 'all' || f.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        f.title.toLowerCase().includes(q) ||
        f.urgency.toLowerCase().includes(q) ||
        f.mechanism.toLowerCase().includes(q) ||
        f.targetAppName.toLowerCase().includes(q);
      return matchEco && matchCat && matchSearch;
    });
  }, [selectedEcosystem, selectedCategory, searchQuery]);

  // Counts
  const countPEH = INNOVATION_FEATURES.filter((f) => f.ecosystem === 'peh').length;
  const countPFS = INNOVATION_FEATURES.filter((f) => f.ecosystem === 'pfs').length;
  const countPOO = INNOVATION_FEATURES.filter((f) => f.ecosystem === 'poo').length;

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Hero Banner */}
      <div className="p-6 md:p-8 bg-linear-to-r from-neutral-900 via-neutral-850 to-neutral-950 text-white rounded-2xl shadow-xl border border-neutral-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 bottom-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-emerald-300 mb-3 border border-white/10">
              <Icon name="Sparkles" size={14} />
              <span>Direktori Terintegrasi & Laboratorium Modul</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Katalog 50 Fitur & Inovasi 3 Ekosistem
            </h1>
            <p className="text-sm text-neutral-300 mt-2 max-w-2xl leading-relaxed">
              Seluruh 50 modul dan fitur canggih telah dirancang dan disebar ke dalam 47 standalone app di 3 pilar utama:
              <strong className="text-white"> PEH (17)</strong>, <strong className="text-emerald-300">PFS (17)</strong>, dan{' '}
              <strong className="text-amber-300">POO (16)</strong>. Anda dapat menguji instrumen interaktif di sini atau langsung melompat ke aplikasinya.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <div className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xs flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <div className="text-[11px] text-neutral-400">Total Fitur Baru</div>
                <div className="text-lg font-bold font-mono">50 Modul Siap Pakai</div>
              </div>
            </div>
            <div className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xs flex items-center gap-3">
              <Icon name="Layers" size={16} className="text-amber-400" />
              <div>
                <div className="text-[11px] text-neutral-400">Cakupan Ekosistem</div>
                <div className="text-xs font-semibold text-neutral-200">100% Terintegrasi</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Ecosystem Filters, Category Tabs, & Search */}
      <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-xs space-y-4">
        {/* Ecosystem Segmented Control */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="inline-flex p-1 bg-neutral-100 rounded-lg text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => {
                setSelectedEcosystem('all');
                setSelectedCategory('all');
              }}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                selectedEcosystem === 'all'
                  ? 'bg-white text-neutral-900 shadow-xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Semua Ekosistem (50)
            </button>
            <button
              onClick={() => {
                setSelectedEcosystem('peh');
                setSelectedCategory('all');
              }}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                selectedEcosystem === 'peh'
                  ? 'bg-neutral-900 text-white shadow-xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              PEH: Personal, Essentials & Household ({countPEH})
            </button>
            <button
              onClick={() => {
                setSelectedEcosystem('pfs');
                setSelectedCategory('all');
              }}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                selectedEcosystem === 'pfs'
                  ? 'bg-emerald-900 text-white shadow-xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              PFS: People, Family & Society ({countPFS})
            </button>
            <button
              onClick={() => {
                setSelectedEcosystem('poo');
                setSelectedCategory('all');
              }}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                selectedEcosystem === 'poo'
                  ? 'bg-amber-950 text-white shadow-xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              POO: Productivity, Operations & Ownership ({countPOO})
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative sm:w-72">
            <Icon name="Search" size={14} className="absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Cari dari 50 nama fitur / modul..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-700 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-neutral-100 text-xs">
          <span className="text-neutral-400 font-medium mr-1 text-[11px] uppercase tracking-wider">Kategori:</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs ${
              selectedCategory === 'all'
                ? 'bg-neutral-900 text-white font-medium'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Semua
          </button>
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white font-medium'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-neutral-500 font-mono">
            Menampilkan {filteredFeatures.length} dari 50 fitur
          </span>
        </div>
      </div>

      {/* Grid of 50 Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFeatures.map((item) => {
          const isInteractiveOpen = activeInteractiveId === item.id;
          const ecoBadgeColor =
            item.ecosystem === 'peh'
              ? 'bg-neutral-100 text-neutral-800 border-neutral-200'
              : item.ecosystem === 'pfs'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-900 border-amber-200';

          return (
            <div
              key={item.id}
              className={`bg-white border rounded-xl flex flex-col justify-between transition-all hover:shadow-md ${
                isInteractiveOpen ? 'ring-2 ring-neutral-900 border-transparent' : 'border-neutral-200'
              }`}
            >
              {/* Header Card */}
              <div className="p-4.5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-mono font-bold">
                      {item.id}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ecoBadgeColor}`}>
                      {item.ecosystem.toUpperCase()} · {item.category}
                    </span>
                  </div>

                  <span className="text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                    {item.targetAppName}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-neutral-900 leading-snug">{item.title}</h3>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">
                      Masalah / Urgensi:
                    </div>
                    <p className="text-neutral-700 leading-relaxed">{item.urgency}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-neutral-100">
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">
                      Mekanisme Kerja:
                    </div>
                    <p className="text-neutral-700 leading-relaxed">{item.mechanism}</p>
                  </div>

                  <div className="flex items-start gap-1.5 text-neutral-600 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100/60">
                    <Icon name="CheckCircle2" size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-emerald-950">Output Nyata: </span>
                      <span className="text-emerald-900">{item.outputValue}</span>
                    </div>
                  </div>
                </div>

                {/* Embedded Interactive Sandbox (If Available) */}
                {item.interactiveType && (
                  <div className="mt-3 pt-3 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={() => setActiveInteractiveId(isInteractiveOpen ? null : item.id)}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                        isInteractiveOpen
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border-neutral-200'
                      }`}
                    >
                      <Icon name={isInteractiveOpen ? 'ChevronUp' : 'Cpu'} size={13} />
                      <span>{isInteractiveOpen ? 'Tutup Simulator Mini' : 'Uji Alat Interaktif Ini'}</span>
                    </button>

                    {isInteractiveOpen && (
                      <div className="mt-3 p-3.5 bg-neutral-900 text-white rounded-xl space-y-3 text-xs shadow-inner">
                        <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800">
                          <span className="font-semibold text-emerald-400 flex items-center gap-1">
                            <Icon name="Sparkles" size={12} />
                            Simulator Interaktif
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">Real-time Logic</span>
                        </div>

                        {/* Interactive 1: Chronotype */}
                        {item.interactiveType === 'chronotype' && (
                          <div className="space-y-2.5">
                            <div>
                              <label className="text-[10px] text-neutral-300 block mb-1">Jam Bangun Pagi:</label>
                              <input
                                type="time"
                                value={chronoWake}
                                onChange={(e) => setChronoWake(e.target.value)}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-neutral-300 block mb-1">Tipe Kronotipe:</label>
                              <div className="grid grid-cols-3 gap-1">
                                {[
                                  { id: 'lark', label: 'Early Lark' },
                                  { id: 'third', label: 'Balanced' },
                                  { id: 'owl', label: 'Night Owl' },
                                ].map((c) => (
                                  <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => setChronoType(c.id as any)}
                                    className={`py-1 text-[11px] rounded ${
                                      chronoType === c.id ? 'bg-emerald-600 font-bold text-white' : 'bg-neutral-800 text-neutral-300'
                                    }`}
                                  >
                                    {c.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="p-2.5 bg-neutral-800/80 rounded border border-neutral-700 space-y-1 text-[11px]">
                              <div className="text-emerald-300 font-semibold">Rekomendasi Ritme Sirkadian:</div>
                              <div>
                                • <strong>Deep Work / Analisis:</strong>{' '}
                                {chronoType === 'lark' ? '08:00 - 11:30' : chronoType === 'owl' ? '15:00 - 18:30' : '09:30 - 12:30'}
                              </div>
                              <div>
                                • <strong>Latihan Fisik:</strong>{' '}
                                {chronoType === 'lark' ? '16:00 - 17:30' : '17:00 - 19:00'}
                              </div>
                              <div>
                                • <strong>Jendela Tidur Pulas:</strong>{' '}
                                {chronoType === 'lark' ? '21:30 - 05:30' : chronoType === 'owl' ? '23:30 - 07:30' : '22:30 - 06:30'}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Interactive 2: Habit Elasticity */}
                        {item.interactiveType === 'habit-elasticity' && (
                          <div className="space-y-2">
                            <div>
                              <label className="text-[10px] text-neutral-400 block">Nama Kebiasaan:</label>
                              <input
                                type="text"
                                value={habitName}
                                onChange={(e) => setHabitName(e.target.value)}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white text-xs"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                              <div className="p-1.5 bg-emerald-950/60 border border-emerald-800 rounded">
                                <span className="text-emerald-400 block font-bold">1. MVH (2 Menit)</span>
                                <input
                                  type="text"
                                  value={habitMvh}
                                  onChange={(e) => setHabitMvh(e.target.value)}
                                  className="w-full bg-transparent text-neutral-200 mt-1 focus:outline-hidden"
                                />
                              </div>
                              <div className="p-1.5 bg-neutral-800 border border-neutral-700 rounded">
                                <span className="text-neutral-400 block font-bold">2. Standar</span>
                                <input
                                  type="text"
                                  value={habitStd}
                                  onChange={(e) => setHabitStd(e.target.value)}
                                  className="w-full bg-transparent text-neutral-200 mt-1 focus:outline-hidden"
                                />
                              </div>
                              <div className="p-1.5 bg-neutral-800 border border-neutral-700 rounded">
                                <span className="text-amber-400 block font-bold">3. Stretch Target</span>
                                <input
                                  type="text"
                                  value={habitStretch}
                                  onChange={(e) => setHabitStretch(e.target.value)}
                                  className="w-full bg-transparent text-neutral-200 mt-1 focus:outline-hidden"
                                />
                              </div>
                            </div>
                            <p className="text-[11px] text-emerald-300">
                              ✓ Jika hari sedang lelah atau krisis, selesaikan <strong>"{habitMvh}"</strong> dan streak Anda tetap utuh!
                            </p>
                          </div>
                        )}

                        {/* Interactive 8: Emergency Will */}
                        {item.interactiveType === 'emergency-will' && (
                          <div className="space-y-2">
                            <div>
                              <label className="text-[10px] text-neutral-400 block">Wali Terpercaya (Guardian):</label>
                              <input
                                type="text"
                                value={guardianName}
                                onChange={(e) => setGuardianName(e.target.value)}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-neutral-400 block">Lokasi Master-Key Fisik:</label>
                              <input
                                type="text"
                                value={keyLocation}
                                onChange={(e) => setKeyLocation(e.target.value)}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white text-xs"
                              />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer pt-1">
                              <input
                                type="checkbox"
                                checked={hasNotarizedDoc}
                                onChange={(e) => setHasNotarizedDoc(e.target.checked)}
                                className="rounded text-emerald-600"
                              />
                              <span className="text-[11px] text-neutral-300">Telah memiliki surat wasiat sah</span>
                            </label>
                            <div className="p-2 bg-emerald-950/70 border border-emerald-700 rounded text-[11px] text-emerald-200">
                              Protokol darurat siap dieksekusi dengan jaminan privasi enkripsi zero-knowledge.
                            </div>
                          </div>
                        )}

                        {/* Interactive 11: Subscription Phantom */}
                        {item.interactiveType === 'sub-phantom' && (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] text-neutral-400 block">Biaya / Bulan (Rp):</label>
                                <input
                                  type="number"
                                  value={subFeeMonthly}
                                  onChange={(e) => setSubFeeMonthly(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white text-xs"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-neutral-400 block">Kali Pakai / Bulan:</label>
                                <input
                                  type="number"
                                  value={subUsagePerMonth}
                                  onChange={(e) => setSubUsagePerMonth(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white text-xs"
                                />
                              </div>
                            </div>
                            {(() => {
                              const costPerUse = subUsagePerMonth > 0 ? Math.round(subFeeMonthly / subUsagePerMonth) : subFeeMonthly;
                              const isZombie = costPerUse > 60000;
                              return (
                                <div
                                  className={`p-2 rounded border text-[11px] ${
                                    isZombie
                                      ? 'bg-rose-950/70 border-rose-700 text-rose-200'
                                      : 'bg-emerald-950/70 border-emerald-700 text-emerald-200'
                                  }`}
                                >
                                  <div>
                                    Biaya Riil: <strong>Rp {costPerUse.toLocaleString('id-ID')} / pemakaian</strong>
                                  </div>
                                  {isZombie ? (
                                    <div className="font-semibold text-rose-300 mt-0.5">
                                      ⚠️ Peringatan: Layanan ini termasuk "Zombie Subscription", pertimbangkan batalkan!
                                    </div>
                                  ) : (
                                    <div className="text-emerald-300 mt-0.5">✓ Efisiensi langganan optimal.</div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* Interactive 12: Runway Simulator */}
                        {item.interactiveType === 'runway' && (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] text-neutral-400 block">Kas Likuid (Rp):</label>
                                <input
                                  type="number"
                                  value={liquidCash}
                                  onChange={(e) => setLiquidCash(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white text-xs"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-neutral-400 block">Beban Pokok / Bln (Rp):</label>
                                <input
                                  type="number"
                                  value={monthlyBurn}
                                  onChange={(e) => setMonthlyBurn(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white text-xs"
                                />
                              </div>
                            </div>
                            {(() => {
                              const runwayMonths = monthlyBurn > 0 ? (liquidCash / monthlyBurn).toFixed(1) : '0';
                              const numRunway = parseFloat(runwayMonths);
                              return (
                                <div className="p-2.5 bg-neutral-800 rounded border border-neutral-700 text-center">
                                  <div className="text-[10px] text-neutral-400">Daya Tahan Finansial (Runway):</div>
                                  <div
                                    className={`text-xl font-black font-mono mt-0.5 ${
                                      numRunway < 3 ? 'text-rose-400' : numRunway < 6 ? 'text-amber-400' : 'text-emerald-400'
                                    }`}
                                  >
                                    {runwayMonths} Bulan
                                  </div>
                                  <div className="text-[10px] text-neutral-400 mt-1">
                                    {numRunway >= 6
                                      ? '✅ Ideal untuk proteksi dana darurat keluarga.'
                                      : '⚠️ Disarankan menambah tabungan likuid hingga minimal 6 bulan.'}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* Interactive 13: Insurance Gap */}
                        {item.interactiveType === 'insurance-gap' && (
                          <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                              <div>
                                <span className="text-neutral-400 block">Pengeluaran Thn:</span>
                                <input
                                  type="number"
                                  value={annualExpense}
                                  onChange={(e) => setAnnualExpense(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-1 text-white"
                                />
                              </div>
                              <div>
                                <span className="text-neutral-400 block">Total Utang:</span>
                                <input
                                  type="number"
                                  value={existingDebts}
                                  onChange={(e) => setExistingDebts(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-1 text-white"
                                />
                              </div>
                              <div>
                                <span className="text-neutral-400 block">Uang Polis:</span>
                                <input
                                  type="number"
                                  value={currentCoverage}
                                  onChange={(e) => setCurrentCoverage(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-1 text-white"
                                />
                              </div>
                            </div>
                            {(() => {
                              const idealCoverage = annualExpense * 10 + existingDebts;
                              const gap = idealCoverage - currentCoverage;
                              return (
                                <div className="p-2 bg-neutral-800 rounded border border-neutral-700 text-[11px]">
                                  <div>Kebutuhan Ideal: Rp {(idealCoverage / 1000000).toFixed(0)} Juta</div>
                                  {gap > 0 ? (
                                    <div className="text-amber-400 font-semibold mt-0.5">
                                      Defisit Proteksi: Rp {(gap / 1000000).toFixed(0)} Juta
                                    </div>
                                  ) : (
                                    <div className="text-emerald-400 font-semibold mt-0.5">
                                      ✓ Plafon asuransi telah melampaui kebutuhan minimal!
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* Interactive 14: Pantry Waste */}
                        {item.interactiveType === 'pantry-waste' && (
                          <div className="space-y-2">
                            <div className="text-[10px] text-neutral-400">3 Bahan Segera Kedaluwarsa:</div>
                            <div className="grid grid-cols-3 gap-1">
                              <input
                                type="text"
                                value={expiringFood1}
                                onChange={(e) => setExpiringFood1(e.target.value)}
                                className="bg-neutral-800 border border-neutral-700 rounded px-1.5 py-1 text-white text-[11px]"
                              />
                              <input
                                type="text"
                                value={expiringFood2}
                                onChange={(e) => setExpiringFood2(e.target.value)}
                                className="bg-neutral-800 border border-neutral-700 rounded px-1.5 py-1 text-white text-[11px]"
                              />
                              <input
                                type="text"
                                value={expiringFood3}
                                onChange={(e) => setExpiringFood3(e.target.value)}
                                className="bg-neutral-800 border border-neutral-700 rounded px-1.5 py-1 text-white text-[11px]"
                              />
                            </div>
                            <div className="p-2 bg-emerald-950/70 border border-emerald-800 rounded text-[11px] text-emerald-200">
                              🍽️ <strong>Ide Olahan Rescue Hari Ini:</strong> "Tumis {expiringFood1} & {expiringFood3} dengan Orak-Arik {expiringFood2}".
                              Menghemat estimasi Rp 45.000 dari bahan basi.
                            </div>
                          </div>
                        )}

                        {/* Interactive 17: Vehicle TCO */}
                        {item.interactiveType === 'vehicle-tco' && (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                              <div>
                                <span className="text-neutral-400 block">Total Biaya Thn (Rp):</span>
                                <div className="text-white font-mono font-bold mt-0.5">
                                  Rp {(annualFuel + annualService + annualDepreciation).toLocaleString('id-ID')}
                                </div>
                              </div>
                              <div>
                                <span className="text-neutral-400 block">Odometer Thn (Km):</span>
                                <input
                                  type="number"
                                  value={annualKm}
                                  onChange={(e) => setAnnualKm(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-1 text-white"
                                />
                              </div>
                            </div>
                            {(() => {
                              const totalCost = annualFuel + annualService + annualDepreciation;
                              const costPerKm = annualKm > 0 ? Math.round(totalCost / annualKm) : 0;
                              return (
                                <div className="p-2 bg-neutral-800 rounded text-center border border-neutral-700">
                                  <div className="text-[10px] text-neutral-400">Biaya Riil Kendaraan:</div>
                                  <div className="text-lg font-bold font-mono text-emerald-400">
                                    Rp {costPerKm.toLocaleString('id-ID')} / km
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* Interactive 18: Dunbar Decay */}
                        {item.interactiveType === 'dunbar-decay' && (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] text-neutral-400 block">Nama Teman:</label>
                                <input
                                  type="text"
                                  value={dunbarFriend}
                                  onChange={(e) => setDunbarFriend(e.target.value)}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white text-xs"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-neutral-400 block">Hari Sejak Sapa Terakhir:</label>
                                <input
                                  type="number"
                                  value={daysSinceContact}
                                  onChange={(e) => setDaysSinceContact(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white text-xs"
                                />
                              </div>
                            </div>
                            {(() => {
                              const isFading = daysSinceContact > 30;
                              return (
                                <div
                                  className={`p-2 rounded border text-[11px] ${
                                    isFading ? 'bg-amber-950/70 border-amber-700 text-amber-200' : 'bg-emerald-950/70 border-emerald-700 text-emerald-200'
                                  }`}
                                >
                                  {isFading ? (
                                    <div>
                                      ⚠️ Hubungan dengan <strong>{dunbarFriend}</strong> mulai memudar ({daysSinceContact} hari tanpa kabar). Kirimkan pesan santai hari ini!
                                    </div>
                                  ) : (
                                    <div>✓ Hubungan dengan {dunbarFriend} masih dalam ritme sehat.</div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* Interactive 27: Family Fund */}
                        {item.interactiveType === 'family-fund' && (
                          <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-1 text-[10px]">
                              <div>
                                <span className="text-neutral-400 block">Target Bersama:</span>
                                <input
                                  type="number"
                                  value={fundTarget}
                                  onChange={(e) => setFundTarget(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-1 text-white"
                                />
                              </div>
                              <div>
                                <span className="text-neutral-400 block">Terkumpul:</span>
                                <input
                                  type="number"
                                  value={currentSaved}
                                  onChange={(e) => setCurrentSaved(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-1 text-white"
                                />
                              </div>
                              <div>
                                <span className="text-neutral-400 block">Iuran/Bulan:</span>
                                <input
                                  type="number"
                                  value={monthlyContribution}
                                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-1 text-white"
                                />
                              </div>
                            </div>
                            {(() => {
                              const remaining = Math.max(0, fundTarget - currentSaved);
                              const monthsToGoal = monthlyContribution > 0 ? (remaining / monthlyContribution).toFixed(1) : '0';
                              const progressPct = fundTarget > 0 ? Math.min(100, Math.round((currentSaved / fundTarget) * 100)) : 0;
                              return (
                                <div className="p-2 bg-neutral-800 rounded border border-neutral-700 text-[11px] space-y-1">
                                  <div className="flex justify-between">
                                    <span>Kemajuan Tabungan:</span>
                                    <span className="font-bold text-emerald-400">{progressPct}%</span>
                                  </div>
                                  <div className="w-full bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${progressPct}%` }} />
                                  </div>
                                  <div className="text-neutral-400 text-[10px]">
                                    Sisa {monthsToGoal} bulan lagi untuk mencapai target keluarga.
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* Interactive 32: Zakat Calculator */}
                        {item.interactiveType === 'zakat-calc' && (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                              <div>
                                <span className="text-neutral-400 block">Harga Emas / Gram (Rp):</span>
                                <input
                                  type="number"
                                  value={goldPricePerGram}
                                  onChange={(e) => setGoldPricePerGram(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-1 text-white"
                                />
                              </div>
                              <div>
                                <span className="text-neutral-400 block">Total Aset Mengendap 1 Thn:</span>
                                <input
                                  type="number"
                                  value={totalAssetZakat}
                                  onChange={(e) => setTotalAssetZakat(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-1 text-white"
                                />
                              </div>
                            </div>
                            {(() => {
                              const nisab = goldPricePerGram * 85;
                              const isObligated = totalAssetZakat >= nisab;
                              const zakatPayable = isObligated ? totalAssetZakat * 0.025 : 0;
                              return (
                                <div className="p-2 bg-neutral-800 rounded border border-neutral-700 text-[11px]">
                                  <div className="text-[10px] text-neutral-400">
                                    Nisab 85g Emas: Rp {nisab.toLocaleString('id-ID')}
                                  </div>
                                  {isObligated ? (
                                    <div className="text-emerald-400 font-bold mt-0.5">
                                      Wajib Zakat Mal: Rp {zakatPayable.toLocaleString('id-ID')} (2,5%)
                                    </div>
                                  ) : (
                                    <div className="text-neutral-300 mt-0.5">Belum mencapai nisab zakat mal tahun ini.</div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* Interactive 36: Deep Work Ratio */}
                        {item.interactiveType === 'deep-work-ratio' && (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] text-neutral-400 block">Jam Deep Work:</label>
                                <input
                                  type="number"
                                  step="0.5"
                                  value={deepWorkHours}
                                  onChange={(e) => setDeepWorkHours(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white text-xs"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-neutral-400 block">Jam Shallow Work:</label>
                                <input
                                  type="number"
                                  step="0.5"
                                  value={shallowWorkHours}
                                  onChange={(e) => setShallowWorkHours(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white text-xs"
                                />
                              </div>
                            </div>
                            {(() => {
                              const total = deepWorkHours + shallowWorkHours;
                              const deepPct = total > 0 ? Math.round((deepWorkHours / total) * 100) : 0;
                              return (
                                <div className="p-2 bg-neutral-800 rounded border border-neutral-700 text-center">
                                  <div className="text-[10px] text-neutral-400">Rasio Fokus Kognitif Hari Ini:</div>
                                  <div
                                    className={`text-lg font-bold font-mono mt-0.5 ${
                                      deepPct >= 60 ? 'text-emerald-400' : 'text-amber-400'
                                    }`}
                                  >
                                    {deepPct}% Deep Work
                                  </div>
                                  <div className="text-[10px] text-neutral-400 mt-0.5">
                                    {deepPct >= 60 ? '✅ Standar produktivitas tinggi tercapai.' : 'Perbanyak blok waktu tanpa notifikasi.'}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* Interactive 37: Meeting ROI */}
                        {item.interactiveType === 'meeting-roi' && (
                          <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-1 text-[10px]">
                              <div>
                                <span className="text-neutral-400 block">Peserta:</span>
                                <input
                                  type="number"
                                  value={attendeeCount}
                                  onChange={(e) => setAttendeeCount(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-1 text-white"
                                />
                              </div>
                              <div>
                                <span className="text-neutral-400 block">Durasi (Jam):</span>
                                <input
                                  type="number"
                                  step="0.5"
                                  value={meetingHours}
                                  onChange={(e) => setMeetingHours(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-1 text-white"
                                />
                              </div>
                              <div>
                                <span className="text-neutral-400 block">Gaji/Jam (Rp):</span>
                                <input
                                  type="number"
                                  value={avgHourlyRate}
                                  onChange={(e) => setAvgHourlyRate(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-1 text-white"
                                />
                              </div>
                            </div>
                            {(() => {
                              const meetingCost = attendeeCount * meetingHours * avgHourlyRate;
                              return (
                                <div className="p-2 bg-neutral-800 rounded border border-neutral-700 text-center">
                                  <div className="text-[10px] text-neutral-400">Biaya Investasi Rapat Ini:</div>
                                  <div className="text-base font-bold font-mono text-amber-400">
                                    Rp {meetingCost.toLocaleString('id-ID')}
                                  </div>
                                  <div className="text-[10px] text-neutral-300 mt-0.5">
                                    Pastikan rapat menghasilkan minimal 1 keputusan bernilai di atas angka ini!
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* Interactive 47: Cap Table Simulator */}
                        {item.interactiveType === 'cap-table' && (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                              <div>
                                <span className="text-neutral-400 block">Pre-Money Val (Rp):</span>
                                <input
                                  type="number"
                                  value={preMoneyValuation}
                                  onChange={(e) => setPreMoneyValuation(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-1 text-white"
                                />
                              </div>
                              <div>
                                <span className="text-neutral-400 block">Dana Masuk (Rp):</span>
                                <input
                                  type="number"
                                  value={newInvestment}
                                  onChange={(e) => setNewInvestment(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-1 text-white"
                                />
                              </div>
                            </div>
                            {(() => {
                              const postMoney = preMoneyValuation + newInvestment;
                              const investorPct = postMoney > 0 ? ((newInvestment / postMoney) * 100).toFixed(1) : '0';
                              const founderPct = postMoney > 0 ? ((preMoneyValuation / postMoney) * 100).toFixed(1) : '100';
                              return (
                                <div className="p-2 bg-neutral-800 rounded border border-neutral-700 text-[11px] space-y-1">
                                  <div>Post-Money Valuation: Rp {(postMoney / 1000000000).toFixed(2)} Miliar</div>
                                  <div className="text-emerald-400 font-semibold">
                                    Struktur Baru: Founder ({founderPct}%) · Investor Baru ({investorPct}%)
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* Interactive 48: Portfolio Rebalancing */}
                        {item.interactiveType === 'rebalance' && (
                          <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-1 text-[10px]">
                              <div>
                                <span className="text-neutral-400 block">Saham (Rp):</span>
                                <input
                                  type="number"
                                  value={stocksVal}
                                  onChange={(e) => setStocksVal(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-1 text-white"
                                />
                              </div>
                              <div>
                                <span className="text-neutral-400 block">Obligasi (Rp):</span>
                                <input
                                  type="number"
                                  value={bondsVal}
                                  onChange={(e) => setBondsVal(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-1 text-white"
                                />
                              </div>
                              <div>
                                <span className="text-neutral-400 block">Kas (Rp):</span>
                                <input
                                  type="number"
                                  value={cashVal}
                                  onChange={(e) => setCashVal(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-1 text-white"
                                />
                              </div>
                            </div>
                            {(() => {
                              const total = stocksVal + bondsVal + cashVal;
                              const stockPct = total > 0 ? Math.round((stocksVal / total) * 100) : 0;
                              return (
                                <div className="p-2 bg-neutral-800 rounded border border-neutral-700 text-[11px]">
                                  <div>Alokasi Saham Saat Ini: <strong>{stockPct}%</strong> (Target: 60%)</div>
                                  {stockPct > 65 ? (
                                    <div className="text-amber-400 font-semibold mt-0.5">
                                      ⚠️ Portofolio kelebihan risiko saham (+{stockPct - 60}%). Disarankan take-profit sebagian ke obligasi.
                                    </div>
                                  ) : (
                                    <div className="text-emerald-400 mt-0.5">✓ Portofolio dalam toleransi seimbang.</div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* Interactive 49: Dividend Snowball */}
                        {item.interactiveType === 'dividend-snowball' && (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                              <div>
                                <span className="text-neutral-400 block">Beban Hidup / Bln:</span>
                                <input
                                  type="number"
                                  value={monthlyLivingCost}
                                  onChange={(e) => setMonthlyLivingCost(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-1 text-white"
                                />
                              </div>
                              <div>
                                <span className="text-neutral-400 block">Dividen / Tahun:</span>
                                <input
                                  type="number"
                                  value={annualDividend}
                                  onChange={(e) => setAnnualDividend(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-1 text-white"
                                />
                              </div>
                            </div>
                            {(() => {
                              const monthlyDiv = annualDividend / 12;
                              const coveragePct = monthlyLivingCost > 0 ? Math.round((monthlyDiv / monthlyLivingCost) * 100) : 0;
                              return (
                                <div className="p-2 bg-neutral-800 rounded border border-neutral-700 text-[11px] space-y-1">
                                  <div>Dividen Bulanan Pasif: Rp {Math.round(monthlyDiv).toLocaleString('id-ID')} / bulan</div>
                                  <div className="text-emerald-400 font-bold">
                                    Tingkat Kebebasan Finansial: {coveragePct}%
                                  </div>
                                  <div className="text-[10px] text-neutral-400">
                                    {coveragePct >= 100
                                      ? '🎉 Freedom Level 3 Tercapai: Seluruh pengeluaran hidup tertutup pasif!'
                                      : coveragePct >= 35
                                      ? '🚀 Freedom Level 2: Tagihan utilitas dan belanja pokok berhasil dicover!'
                                      : '🌱 Freedom Level 1: Melangkah menuju kemandirian pasif.'}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* Interactive 50: Real Estate Yield */}
                        {item.interactiveType === 'real-estate-yield' && (
                          <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-1 text-[10px]">
                              <div>
                                <span className="text-neutral-400 block">Harga Beli:</span>
                                <input
                                  type="number"
                                  value={propertyPrice}
                                  onChange={(e) => setPropertyPrice(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-1 text-white"
                                />
                              </div>
                              <div>
                                <span className="text-neutral-400 block">Sewa Kotor Thn:</span>
                                <input
                                  type="number"
                                  value={annualRentalGross}
                                  onChange={(e) => setAnnualRentalGross(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-1 text-white"
                                />
                              </div>
                              <div>
                                <span className="text-neutral-400 block">Biaya & PBB:</span>
                                <input
                                  type="number"
                                  value={annualExpensesProperty}
                                  onChange={(e) => setAnnualExpensesProperty(Number(e.target.value))}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-1 text-white"
                                />
                              </div>
                            </div>
                            {(() => {
                              const noi = annualRentalGross - annualExpensesProperty;
                              const capRate = propertyPrice > 0 ? ((noi / propertyPrice) * 100).toFixed(2) : '0';
                              return (
                                <div className="p-2 bg-neutral-800 rounded border border-neutral-700 text-center">
                                  <div className="text-[10px] text-neutral-400">Net Operating Income (NOI):</div>
                                  <div className="text-sm font-bold text-white">Rp {noi.toLocaleString('id-ID')} / tahun</div>
                                  <div className="text-base font-extrabold font-mono text-emerald-400 mt-0.5">
                                    Cap Rate: {capRate}%
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Footer: Jump to standalone app */}
              <div className="p-3 bg-neutral-50/80 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[10px] text-neutral-500 font-mono">
                  Sub-menu: #{item.targetSubMenu}
                </span>

                <button
                  type="button"
                  onClick={() => navigateTo(item.targetApp, item.targetSubMenu)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-900 hover:text-white border border-neutral-300 hover:border-neutral-900 rounded-lg text-xs font-semibold text-neutral-800 transition-all cursor-pointer shadow-2xs"
                >
                  <span>Buka di {item.targetAppName}</span>
                  <Icon name="ArrowRight" size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
