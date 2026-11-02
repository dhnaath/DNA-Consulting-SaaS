import { FrameworkContent } from "@/frameworkData";

export const sustainabilityAndHRFrameworks: Record<string, FrameworkContent> = {
  "ESG Materiality Matrix": {
    teori: {
      deskripsi: "Matriks prioritas isu Environmental, Social, and Governance (ESG) berdasarkan dua sumbu: Signifikansi bagi Stakeholder Eksternal vs Dampak terhadap Kesuksesan Bisnis.",
      manfaat: "Memastikan laporan keberlanjutan dan program CSR perusahaan fokus pada isu-isu krusial yang berdampak langsung pada kelangsungan bisnis dan ekspektasi investor."
    },
    layout: {
      tipe: "Matriks 2x2 Materialitas Isu ESG (GRI Standards)",
      elemen: ["Sumbu Y: Pengaruh Terhadap Penilaian & Keputusan Stakeholder", "Sumbu X: Signifikansi Dampak Ekonomi, Lingkungan & Sosial", "Kuadran Prioritas Tinggi (Isu Material Utama)", "Kuadran Isu Sekunder"],
      visualType: 'matrix2x2'
    },
    draft: [
      { bagian: "Isu Lingkungan (Environmental)", hint: "Efisiensi energi, emisi karbon, pengelolaan limbah berbahaya, konservasi air, dan kemasan ramah lingkungan." },
      { bagian: "Isu Sosial (Social)", hint: "Kesehatan & keselamatan kerja (K3), hak asasi pekerja, diversitas gender, hubungan komunitas lokal, dan perlindungan data pelanggan." },
      { bagian: "Isu Tata Kelola (Governance)", hint: "Etika bisnis, anti-korupsi, transparansi remunerasi direksi, kepatuhan hukum, dan manajemen risiko rantai pasok." },
      { bagian: "Isu Sangat Material (Prioritas 1)", hint: "Isu yang berada di pojok kanan atas: Wajib dilaporkan sesuai standar GRI dan memiliki program aksi terukur." }
    ],
    tutorial: [
      { step: "Identifikasi Isu Relevan", desc: "Kumpulkan daftar 15-20 topik keberlanjutan yang relevan dengan sektor industri bisnis Anda." },
      { step: "Survei Stakeholder Eksternal & Internal", desc: "Minta investor, pelanggan, regulator, dan karyawan memberi skor tingkat urgensi tiap isu." },
      { step: "Petakan dan Tetapkan Ambang Batas", desc: "Tarik garis batas (materiality threshold) untuk menetapkan 5-8 topik paling mendesak yang wajib dikelola secara aktif." }
    ],
    actionPlan: [
      "Petakan 10 isu ESG yang paling sering dipertanyakan oleh mitra perbankan atau investor.",
      "Identifikasi 3 isu prioritas tertinggi yang masuk kuadran kanan atas matriks.",
      "Tetapkan target penurunan jejak karbon atau perbaikan K3 untuk 3 isu material tersebut."
    ]
  },
  "Risk Assessment Matrix": {
    teori: {
      deskripsi: "Matriks 5x5 evaluasi risiko yang memetakan Tingkat Kemungkinan Kejadian (Likelihood) dengan Tingkat Keparahan Dampak (Severity/Impact) untuk menghasilkan Skor Risiko (Risk Score).",
      manfaat: "Memberikan panduan visual tingkat bahaya (Merah = Kritis, Kuning = Sedang, Hijau = Rendah) agar manajemen memprioritaskan anggaran mitigasi secara terarah."
    },
    layout: {
      tipe: "Matriks Heatmap 5x5 Tingkat Risiko",
      elemen: ["Sumbu Y: Kemungkinan Kejadian (1-Sangat Jarang s/d 5-Hampir Pasti)", "Sumbu X: Keparahan Dampak (1-Dapat Diabaikan s/d 5-Katastropik)", "Zona Merah (Risiko Tinggi - Wajib Mitigasi Segera)", "Zona Kuning (Risiko Sedang)", "Zona Hijau (Risiko Rendah/Diterima)"],
      visualType: 'heatmap-5x5'
    },
    draft: [
      { bagian: "Identifikasi Ancaman / Risiko", hint: "Daftar potensi bencana alam, kebocoran data, kecurangan keuangan, mogok kerja, atau perubahan regulasi mendadak." },
      { bagian: "Skor Likelihood & Severity", hint: "Beri nilai 1-5 untuk kemungkinan terjadi dan 1-5 untuk dampak kerugian finansial/reputasi jika terjadi. Skor = L x S." },
      { bagian: "Rencana Aksi Mitigasi", hint: "Strategi 4T: Treat (Mitigasi/Reduksi), Transfer (Asuransi), Tolerate (Diterima), atau Terminate (Hentikan aktivitas)." },
      { bagian: "Residual Risk (Risiko Sisa)", hint: "Berapa skor risiko setelah tindakan mitigasi dan SOP pencegahan dijalankan secara efektif?" }
    ],
    tutorial: [
      { step: "Adakan Workshop Risk Register", desc: "Ajak perwakilan setiap divisi menyusun daftar 10 risiko operasional terbesar di unitnya." },
      { step: "Plotting ke Dalam Heatmap 5x5", desc: "Kelompokkan risiko ke dalam kategori warna untuk menentukan wewenang eskalasi ke Dewan Komisaris." },
      { step: "Tunjuk Risk Owner", desc: "Setiap risiko di zona merah WAJIB memiliki satu orang pejabat penanggung jawab (Risk Owner) yang memantau indikator peringatan dini (KRI)." }
    ],
    actionPlan: [
      "Susun Risk Register terbaru berisi 10 risiko bisnis terbesar tahun ini.",
      "Tetapkan mitigasi darurat untuk setiap risiko yang berada di skor zona Merah (skor 15-25).",
      "Tunjuk Risk Owner untuk masing-masing risiko kritis tersebut."
    ]
  },
  "Triple Bottom Line (TBL)": {
    teori: {
      deskripsi: "Kerangka keberlanjutan John Elkington yang memperluas tolok ukur kesuksesan bisnis menjadi 3P yang seimbang: Profit (Kemakmuran Ekonomi), People (Keadilan Sosial), dan Planet (Kelestarian Lingkungan).",
      manfaat: "Menghindarkan bisnis dari paradigma eksploitatif jangka pendek, membangun loyalitas komunitas konsumen, dan menciptakan ketahanan bisnis berkelanjutan puluhan tahun."
    },
    layout: {
      tipe: "Diagram Venn 3 Pilar Berkelanjutan (3P)",
      elemen: ["Profit (Keberlanjutan Finansial & Laba Bersih)", "People (Kesejahteraan Karyawan & Komunitas)", "Planet (Jejak Ekologis & Konservasi Alam)", "Irisan Pusat: True Sustainability (Bisnis Lestari)"],
      visualType: 'venn-3circle'
    },
    draft: [
      { bagian: "Pilar Profit (Ekonomi)", hint: "Bagaimana bisnis menciptakan nilai ekonomi yang sehat, membayar upah layak, dan memberikan dividen wajar tanpa merusak etika?" },
      { bagian: "Pilar People (Sosial)", hint: "Bagaimana perusahaan memperlakukan pekerja, menjamin kesetaraan, mencegah kerja paksa di rantai pasok, dan memberdayakan warga sekitar?" },
      { bagian: "Pilar Planet (Lingkungan)", hint: "Berapa banyak bahan daur ulang yang digunakan? Bagaimana strategi pengurangan limbah plastik, air, dan energi kotor?" },
      { bagian: "Sinergi 3P", hint: "Inovasi produk apa yang secara bersamaan menghasilkan laba tinggi sekaligus memecahkan masalah sosial/lingkungan?" }
    ],
    tutorial: [
      { step: "Tetapkan Metrik Selain Keuangan", desc: "Jangan hanya mengukur ROI finansial; tetapkan metrik jam pelatihan karyawan (People) dan ton sampah terdaur ulang (Planet)." },
      { step: "Audit Seluruh Rantai Pasok", desc: "Pastikan pemasok dan vendor Anda juga mematuhi prinsip keadilan kerja dan perlindungan lingkungan." },
      { step: "Komunikasikan Dampak Nyata", desc: "Publikasikan laporan dampak tahunan untuk membangun kepercayaan konsumen sadar lingkungan." }
    ],
    actionPlan: [
      "Evaluasi kebijakan pengelolaan limbah operasional kantor dan fasilitas produksi Anda.",
      "Buat program peningkatan kesejahteraan atau pelatihan keterampilan untuk karyawan lini depan.",
      "Tinjau apakah ada peluang efisiensi biaya yang berasal dari penghematan energi (green savings)."
    ]
  },
  "Circular Economy (Butterfly)": {
    teori: {
      deskripsi: "Model ekonomi sirkular Ellen MacArthur berbentuk diagram kupu-kupu yang memisahkan dua siklus: Siklus Biologis (bahan alami terurai kembali ke biosfer) dan Siklus Teknis (material diperbaiki, dipakai ulang, diproduksi ulang, dan didaur ulang).",
      manfaat: "Menghilangkan konsep 'sampah' dari model bisnis, menekan biaya bahan baku hingga 40%, dan membuka aliran pendapatan baru dari layanan perbaikan dan daur ulang (Product-as-a-Service)."
    },
    layout: {
      tipe: "Diagram Kupu-kupu Sirkular Ellen MacArthur",
      elemen: ["Sayap Kiri: Siklus Biologis (Regenerasi Alami, Kompos, Ekstraksi Biokimia)", "Sayap Kanan: Siklus Teknis (Maintain/Prolong, Reuse/Redistribute, Refurbish/Remanufacture, Recycle)", "Pusat: Manufaktur & Pengguna"],
      visualType: 'butterfly-flowchart'
    },
    draft: [
      { bagian: "Desain Bebas Limbah (Design Out Waste)", hint: "Bagaimana merancang produk agar mudah dibongkar pasang dan tidak mencampurkan material yang sulit dipisahkan?" },
      { bagian: "Siklus Dalam (Maintain & Reuse)", hint: "Layanan apa yang bisa memperpanjang umur pakai produk (garansi servis, penjualan suku cadang resmi)?" },
      { bagian: "Remanufacturing & Refurbishment", hint: "Bisakah produk bekas dibeli kembali dari pelanggan (buy-back), diperbaiki standarnya, dan dijual kembali sebagai unit second bersertifikat?" },
      { bagian: "Daur Ulang Bahan Mentah (Recycle)", hint: "Jika produk sudah rusak total, bagaimana material logam/plastiknya diolah kembali menjadi bahan baku tanpa terbuang ke TPA?" }
    ],
    tutorial: [
      { step: "Prioritaskan Loop Terdalam", desc: "Siklus perbaikan (repair) dan penggunaan kembali selalu lebih hemat energi dan bernilai ekonomi lebih tinggi daripada daur ulang peleburan (recycling)." },
      { step: "Eksplorasi Model Product-as-a-Service", desc: "Ubah model jual putus menjadi sistem sewa/langganan di mana perusahaan tetap menjadi pemilik barang dan bertanggung jawab atas perawatannya." },
      { step: "Kemitraan Pengumpulan Kembali (Take-Back)", desc: "Bangun saluran logistik balik untuk memudahkan pelanggan mengembalikan kemasan atau perangkat usang." }
    ],
    actionPlan: [
      "Identifikasi 1 komponen produk Anda yang paling sering rusak dan buat versi suku cadang penggantinya.",
      "Rancang program 'Tukar Tambah' (Trade-in) untuk mengumpulkan produk generasi lama dari pelanggan.",
      "Ganti kemasan sekali pakai dengan kemasan ramah lingkungan yang bisa diisi ulang (refillable)."
    ]
  },
  "FMEA Framework": {
    teori: {
      deskripsi: "Failure Mode and Effects Analysis (FMEA): Metode rekayasa sistematis untuk mengidentifikasi potensi modus kegagalan dan menghitung Risk Priority Number (RPN = Severity x Occurrence x Detection).",
      manfaat: "Mencegah kecelakaan produk dan cacat produksi sebelum produk sampai ke tangan konsumen, serta menstandarisasi langkah kontrol kualitas pencegahan."
    },
    layout: {
      tipe: "Tabel Standar Analisis Modus Kegagalan FMEA",
      elemen: ["Proses / Fungsi Komponen", "Potensi Modus Kegagalan", "Potensi Efek & Dampak", "Severity (S: 1-10)", "Occurrence (O: 1-10)", "Detection (D: 1-10)", "RPN = S x O x D", "Tindakan Korektif"],
      visualType: 'fmea-table'
    },
    draft: [
      { bagian: "Fungsi & Modus Kegagalan", hint: "Fungsi apa yang sedang diuji? Dengan cara apa proses/komponen tersebut bisa mengalami kegagalan (patah, macet, bocor, salah data)?" },
      { bagian: "Severity (Tingkat Keparahan 1-10)", hint: "Seberapa fatal dampaknya bagi keselamatan pengguna atau kelangsungan operasional jika kegagalan terjadi? (10 = Bahaya maut tanpa peringatan)." },
      { bagian: "Occurrence (Tingkat Frekuensi 1-10)", hint: "Seberapa sering kegagalan ini diprediksi muncul berdasarkan data historis atau uji coba? (1 = Sangat langka, 10 = Terjadi setiap hari)." },
      { bagian: "Detection (Tingkat Pendeteksian 1-10)", hint: "Seberapa efektif sistem sensor/inspeksi saat ini dalam menangkap cacat SEBELUM barang keluar pabrik? (1 = Pasti terdeteksi, 10 = Mustahil terdeteksi)." }
    ],
    tutorial: [
      { step: "Hitung Angka RPN", desc: "Kalikan nilai S x O x D. Nilai RPN berkisar antara 1 hingga 1000." },
      { step: "Tentukan Batas Tindakan (Cut-off)", desc: "Setiap item dengan RPN > 100 atau dengan nilai Severity > 8 WAJIB segera dibuatkan tindakan pencegahan desain atau perbaikan sensor." },
      { step: "Hitung Ulang RPN Pasca-Tindakan", desc: "Verifikasi bahwa modifikasi desain berhasil menurunkan nilai RPN secara signifikan." }
    ],
    actionPlan: [
      "Pilih 1 tahapan proses manufaktur atau alur transaksi digital yang paling rawan error.",
      "Lakukan kalkulasi skor FMEA (Severity, Occurrence, Detection) bersama tim teknis lapangan.",
      "Buat sistem pencegah kesalahan otomatis (Poka-Yoke) untuk item dengan nilai RPN tertinggi."
    ]
  },
  "ISO 31000 Risk Management": {
    teori: {
      deskripsi: "Standar internasional manajemen risiko yang mencakup Prinsip (Principles), Kerangka Kerja (Framework), dan Proses (Process) yang terintegrasi di seluruh tata kelola organisasi.",
      manfaat: "Menjadikan pengelolaan risiko sebagai bagian tak terpisahkan dari pengambilan keputusan strategis harian, bukan sekadar kewajiban kepatuhan administratif."
    },
    layout: {
      tipe: "Siklus Proses ISO 31000 Manajemen Risiko",
      elemen: ["Komunikasi & Konsultasi", "Ruang Lingkup, Konteks & Kriteria", "Penilaian Risiko (Identifikasi, Analisis, Evaluasi)", "Perlakuan Risiko (Risk Treatment)", "Pemantauan & Tinjauan", "Pencatatan & Pelaporan"],
      visualType: 'concentric-loops'
    },
    draft: [
      { bagian: "Penetapan Konteks", hint: "Tentukan batasan internal dan eksternal organisasi, selera risiko (risk appetite), serta regulasi hukum yang berlaku." },
      { bagian: "Identifikasi Risiko", hint: "Kenali sumber risiko, area dampak, peristiwa, penyebab, dan potensi konsekuensi bisnis secara komprehensif." },
      { bagian: "Analisis & Evaluasi Risiko", hint: "Tentukan tingkat risiko dengan mempertimbangkan efektivitas kontrol yang sudah terpasang saat ini." },
      { bagian: "Perlakuan Risiko (Treatment)", hint: "Pilih opsi perlakuan: hindari, ambil risiko untuk mengejar peluang, hilangkan sumber, ubah kemungkinan, ubah konsekuensi, bagi risiko, atau pertahankan." }
    ],
    tutorial: [
      { step: "Integrasikan ke Budaya Perusahaan", desc: "Manajemen risiko harus menjadi tanggung jawab setiap manajer unit, bukan hanya departemen kepatuhan." },
      { step: "Definisikan Risk Appetite", desc: "Sepakati batas kerugian maksimal yang bersedia ditoleransi oleh direksi dalam mengejar pertumbuhan." },
      { step: "Lakukan Tinjauan Berkala", desc: "Tinjau efektivitas langkah perlakuan risiko setiap kali terjadi perubahan regulasi atau kondisi makroekonomi." }
    ],
    actionPlan: [
      "Dokumentasikan selera risiko (Risk Appetite Statement) resmi perusahaan untuk tahun berjalan.",
      "Jadwalkan review pemantauan risiko triwulanan bersama komite audit.",
      "Latih seluruh kepala bagian mengenai prosedur eskalasi dini insiden risiko operasional."
    ]
  },
  "Carbon Footprint (Scope 1-3)": {
    teori: {
      deskripsi: "Standar protokol gas rumah kaca (GHG Protocol) untuk mengukur total emisi karbon perusahaan: Scope 1 (Emisi langsung), Scope 2 (Emisi listrik tidak langsung), dan Scope 3 (Emisi seluruh rantai nilai hulu dan hilir).",
      manfaat: "Memenuhi tuntutan audit keberlanjutan investor global, mengantisipasi pajak karbon, dan menemukan peluang efisiensi biaya bahan bakar/energi."
    },
    layout: {
      tipe: "Struktur 3 Lapisan Emisi Gas Rumah Kaca",
      elemen: ["Scope 1: Direct Emissions (Bahan bakar genset, kendaraan operasional, emisi pabrik)", "Scope 2: Indirect Emissions (Pembelian daya listrik PLN, pendingin ruangan)", "Scope 3: Value Chain (Perjalanan dinas, rantai pasok supplier, penggunaan produk oleh konsumen, limbah akhir)"],
      visualType: 'layered-3tier'
    },
    draft: [
      { bagian: "Scope 1 (Emisi Langsung)", hint: "Berapa liter bensin/solar yang dikonsumsi armada kendaraan perusahaan dan genset dalam sebulan?" },
      { bagian: "Scope 2 (Emisi Energi Listrik)", hint: "Berapa total tagihan kWh listrik gedung kantor dan fasilitas gudang? Hitung menggunakan faktor emisi grid PLN." },
      { bagian: "Scope 3 (Rantai Pasok & Distribusi)", hint: "Emisi dari pengiriman kurir pihak ketiga, perjalanan dinas pesawat karyawan, dan pengolahan limbah produk di akhir hayat." },
      { bagian: "Target Dekarbonisasi (Net Zero Roadmap)", hint: "Target persentase penurunan emisi per tahun dan rencana transisi ke energi terbarukan (panel surya, sertifikat REC)." }
    ],
    tutorial: [
      { step: "Kumpulkan Data Aktivitas", desc: "Kumpulkan bukti kuitansi pembelian BBM, struk tagihan listrik PLN, dan manifes kargo logistik." },
      { step: "Konversikan Menggunakan Faktor Emisi", desc: "Kalikan data pemakaian fisik dengan faktor emisi resmi GHG Protocol untuk mendapatkan angka Ton CO2e." },
      { step: "Fokus pada Pengurangan Scope 3", desc: "Bagi sebagian besar perusahaan non-manufaktur, lebih dari 70% jejak karbon berada pada Scope 3 rantai pasok." }
    ],
    actionPlan: [
      "Hitung total konsumsi listrik bulanan seluruh cabang dan konversikan ke ekuivalen Ton CO2.",
      "Terapkan kebijakan efisiensi energi di gedung operasional (sensor lampu otomatis, AC hemat energi).",
      "Pilih vendor logistik yang memiliki armada kendaraan listrik atau komitmen penurunan emisi."
    ]
  },
  "Business Continuity Plan (BCP)": {
    teori: {
      deskripsi: "Rencana strategis dan operasional untuk memastikan kelangsungan fungsi bisnis kritis saat terjadi bencana, krisis siber, pandemi, atau disrupsi ekstrim lainnya.",
      manfaat: "Meminimalkan waktu henti (downtime), mencegah kebangkrutan pasca-bencana, dan melindungi keselamatan jiwa serta reputasi perusahaan."
    },
    layout: {
      tipe: "Matriks Perencanaan Kontinjensi & Kelangsungan Bisnis",
      elemen: ["Business Impact Analysis (BIA)", "RTO (Recovery Time Objective)", "RPO (Recovery Point Objective)", "Crisis Response Team & Escalation", "Disaster Recovery (DR) Alternate Site"],
      visualType: 'modular-cards'
    },
    draft: [
      { bagian: "Business Impact Analysis (BIA)", hint: "Proses operasional mana yang jika mati selama 24 jam akan langsung menyebabkan kerugian finansial atau tuntutan hukum fatal?" },
      { bagian: "Target Waktu Pemulihan (RTO & RPO)", hint: "RTO: Berapa jam maksimal sistem boleh down sebelum operasional pulih? RPO: Berapa jam data transaksi yang boleh hilang dari backup terakhir?" },
      { bagian: "Prosedur Evakuasi & Tim Komando Krisis", hint: "Siapa juru bicara resmi krisis? Siapa penanggung jawab keselamatan personel dan koordinasi dengan kepolisian/damkar?" },
      { bagian: "Infrastruktur Cadangan (Failover)", hint: "Apakah ada server cadangan di cloud terpisah? Apakah ada lokasi kantor sementara jika gedung utama tidak bisa diakses?" }
    ],
    tutorial: [
      { step: "Tentukan Fungsi Kritis", desc: "Jangan mencoba memulihkan semua hal sekaligus; prioritaskan hanya sistem transaksi pembayaran dan layanan konsumen inti." },
      { step: "Dokumentasikan SOP Tertulis Offline", desc: "Pastikan buku panduan darurat tersimpan dalam bentuk fisik dan dapat diakses saat internet dan listrik mati total." },
      { step: "Lakukan Simulasi Gladi Resik (Drill)", desc: "Uji coba skenario pemadaman mendadak minimal 1 kali dalam setahun untuk melatih kesiapan tim." }
    ],
    actionPlan: [
      "Tentukan batas RTO (maksimal jam pemulihan) untuk sistem kasir/transaksi utama bisnis Anda.",
      "Lakukan simulasi pemulihan data (restore backup) dari cloud untuk menguji keandalan backup mingguan.",
      "Susun daftar kontak darurat seluruh pimpinan dan sebarkan ke tim inti."
    ]
  },
  "9-Box Talent Grid": {
    teori: {
      deskripsi: "Alat evaluasi manajemen bakat karya McKinsey & GE yang memetakan karyawan ke dalam matriks 3x3 berdasarkan dua dimensi: Kinerja Masa Lalu (Performance) dan Potensi Pertumbuhan Masa Depan (Potential).",
      manfaat: "Mengidentifikasi calon penerus kepemimpinan (Star/High Potential), menentukan program retensi khusus, serta mengambil keputusan objektif terkait restrukturisasi atau pelatihan."
    },
    layout: {
      tipe: "Matriks 3x3 Evaluasi Bakat 9-Box Grid",
      elemen: ["Sumbu Y: Potensial (Rendah, Sedang, Tinggi)", "Sumbu X: Kinerja (Rendah, Sedang, Tinggi)", "Kotak Kanan Atas: Bintang (Stars / High Potential & High Performance)", "Kotak Tengah: Inti Organisasi (Core Players)", "Kotak Kiri Bawah: Risiko Kinerja (Bad Hires / Risk)"],
      visualType: 'matrix3x3'
    },
    draft: [
      { bagian: "Stars (Kinerja Tinggi / Potensi Tinggi)", hint: "Aset masa depan perusahaan. Butuh program akselerasi karir, kompensasi retensi kompetitif, dan proyek strategis menantang." },
      { bagian: "High Professionals (Kinerja Tinggi / Potensi Sedang)", hint: "Pekerja spesialis andal yang menjaga roda operasional berjalan sempurna. Hargai keahlian teknis mereka tanpa memaksakan jadi manajer." },
      { bagian: "Enigmas / Rough Diamonds (Kinerja Rendah / Potensi Tinggi)", hint: "Karyawan cerdas yang salah penempatan posisi atau terkendala masalah motivasi/atasan. Butuh coaching dan reposisi." },
      { bagian: "Underperformers (Kinerja Rendah / Potensi Rendah)", hint: "Butuh Performance Improvement Plan (PIP) tegas selama 30-60 hari, atau pemutusan hubungan kerja jika tidak ada kemajuan." }
    ],
    tutorial: [
      { step: "Kumpulkan Data Objektif Sebelum Sesi", desc: "Gunakan pencapaian KPI kuantitatif untuk sumbu Kinerja, dan penilaian kompetensi kepemimpinan/kemauan belajar untuk sumbu Potensi." },
      { step: "Gelar Sesi Kalibrasi Antar-Manajer", desc: "Hindari manajer memberi nilai terlalu murah hati; tantang persepsi secara sehat antar sesama kepala divisi." },
      { step: "Rancang Individual Development Plan (IDP)", desc: "Setiap kotak membutuhkan perlakuan pengembangan yang berbeda secara terpersonalisasi." }
    ],
    actionPlan: [
      "Petakan 10 staf kunci di divisi Anda ke dalam matriks 9-Box.",
      "Identifikasi siapa saja yang masuk ke kotak 'Stars' dan rancang rencana suksesi mereka.",
      "Buat program pendampingan khusus (PIP) untuk staf yang berada di kotak risiko kiri bawah."
    ]
  },
  "Situational Leadership": {
    teori: {
      deskripsi: "Model kepemimpinan Hersey & Blanchard yang menyatakan bahwa tidak ada gaya kepemimpinan terbaik tunggal; pemimpin harus menyesuaikan gayanya dengan tingkat Kematangan/Kesiapan Tim (Development Levels D1 s/d D4).",
      manfaat: "Mencegah micromanagement pada staf senior yang sudah ahli, sekaligus mencegah lepas tangan (under-delegating) pada staf baru yang masih bingung."
    },
    layout: {
      tipe: "Matriks 4 Gaya Kepemimpinan Situasional",
      elemen: ["S1: Directing / Telling (Pengarahan Tinggi, Dukungan Rendah - untuk D1)", "S2: Coaching / Selling (Pengarahan Tinggi, Dukungan Tinggi - untuk D2)", "S3: Supporting / Participating (Pengarahan Rendah, Dukungan Tinggi - untuk D3)", "S4: Delegating (Pengarahan Rendah, Dukungan Rendah - untuk D4)"],
      visualType: 'matrix2x2'
    },
    draft: [
      { bagian: "S1 - Directing (Untuk D1: Antusias tapi Kurang Kompeten)", hint: "Karyawan baru bersemangat tinggi tapi belum tahu teknis. Berikan instruksi langkah-demi-langkah yang sangat spesifik dan awasi ketat." },
      { bagian: "S2 - Coaching (Untuk D2: Kompetensi Rendah, Motivasi Menurun)", hint: "Staf yang mulai frustrasi menghadapi kesulitan kerja. Berikan bimbingan teknis intensif disertai dukungan moril dan apresiasi." },
      { bagian: "S3 - Supporting (Untuk D3: Kompetensi Tinggi, Percaya Diri Goyah)", hint: "Staf yang sudah mampu secara teknis tapi ragu mengambil keputusan. Berperanlah sebagai teman diskusi fasilitatif." },
      { bagian: "S4 - Delegating (Untuk D4: Sangat Mampu & Sangat Berkomitmen)", hint: "Karyawan bintang yang berkinerja luar biasa. Serahkan wewenang keputusan penuh dan cukup pantau hasil akhir." }
    ],
    tutorial: [
      { step: "Diagnosis Kesiapan per Tugas", desc: "Seseorang bisa berada di level D4 untuk tugas coding, namun berada di level D1 saat harus presentasi ke klien; sesuaikan gaya kepemimpinan per tugas." },
      { step: "Transisi Bertahap", desc: "Tujuan pemimpin adalah mematangkan staf dari D1 perlahan menuju D4 agar organisasi mandiri." },
      { step: "Komunikasikan Alasan Perlakuan", desc: "Jelaskan kepada staf mengapa Anda memberikan instruksi rinci (S1) atau memberikan kebebasan penuh (S4)." }
    ],
    actionPlan: [
      "Petakan tingkat kematangan (D1-D4) dari masing-masing anggota tim langsung Anda.",
      "Identifikasi apakah Anda terlalu sering micromanage staf yang sebenarnya sudah berada di level D4.",
      "Tingkatkan sesi coaching (S2) untuk staf berbakat yang motivasinya terlihat sedang meredup."
    ]
  },
  "Johari Window": {
    teori: {
      deskripsi: "Alat psikologi komunikasi Joseph Luft & Harrington Ingham untuk meningkatkan kesadaran diri (self-awareness) dan kepercayaan tim melalui 4 kuadran: Open Area, Blind Spot, Hidden Area, dan Unknown Area.",
      manfaat: "Membangun budaya transparansi, mengurangi friksi komunikasi internal, dan membuka potensi bakat terpendam karyawan yang belum disadari."
    },
    layout: {
      tipe: "Matriks 2x2 Jendela Komunikasi Johari",
      elemen: ["Open Area (Diketahui Diri & Orang Lain)", "Blind Spot (Tidak Diketahui Diri, Diketahui Orang Lain)", "Hidden / Facade (Diketahui Diri, Disembunyikan)", "Unknown Area (Misteri / Belum Terungkap)"],
      visualType: 'matrix2x2'
    },
    draft: [
      { bagian: "Open Area (Arena Terbuka)", hint: "Keahlian, kepribadian, dan informasi yang diketahui secara terbuka oleh diri Anda dan rekan kerja. Semakin lebar kuadran ini, semakin efektif kerja sama tim." },
      { bagian: "Blind Spot (Titik Buta)", hint: "Kebiasaan buruk atau potensi kelemahan yang dilihat orang lain pada diri Anda namun tidak Anda sadari. Perkecil area ini dengan aktif meminta umpan balik jujur." },
      { bagian: "Hidden Area (Topeng / Rahasia)", hint: "Ketakutan, ambisi, atau opini yang Anda simpan rapat karena takut dihakimi. Perkecil area ini dengan membangun rasa aman psikologis (psychological safety)." },
      { bagian: "Unknown Area (Potensi Terpendam)", hint: "Kapasitas atau talenta yang belum pernah diuji. Buka area ini melalui tantangan proyek baru dan eksplorasi di luar zona nyaman." }
    ],
    tutorial: [
      { step: "Minta Umpan Balik Terbuka", desc: "Kurangi Blind Spot dengan bertanya kepada bawahan dan rekan: 'Apa satu hal yang bisa saya perbaiki dari gaya komunikasi saya?'" },
      { step: "Tingkatkan Self-Disclosure yang Tepat", desc: "Kurangi Hidden Area dengan membagikan nilai pribadi dan mengakui kerentanan secara profesional kepada tim." },
      { step: "Perluas Open Area Tim", desc: "Tim berkinerja tinggi memiliki Open Area yang sangat luas sehingga tidak ada energi yang terbuang untuk saling mencurigai motif tersembunyi." }
    ],
    actionPlan: [
      "Jadwalkan sesi umpan balik anonim 360 derajat untuk mengungkap Blind Spot kepemimpinan Anda.",
      "Buka forum rapat tim untuk saling berbagi kendala kerja tanpa takut disalahkan.",
      "Beri penugasan proyek lintas divisi untuk menguji bakat di kuadran Unknown Area staf."
    ]
  },
  "Culture Map": {
    teori: {
      deskripsi: "Model Erin Meyer untuk menavigasi perbedaan lintas budaya dalam 8 skala perilaku: Communicating, Evaluating, Persuading, Leading, Deciding, Trusting, Disagreeing, dan Scheduling.",
      manfaat: "Mencegah kesalahpahaman fatal dalam tim multinasional atau merger perusahaan, serta mempercepat integrasi cara kerja yang harmonis."
    },
    layout: {
      tipe: "Peta 8 Skala Perilaku Budaya Kerja",
      elemen: ["Communicating (Low vs High Context)", "Evaluating (Direct vs Indirect Negative Feedback)", "Leading (Egalitarian vs Hierarchical)", "Deciding (Consensual vs Top-Down)", "Trusting (Task vs Relationship-based)", "Disagreeing (Confrontational vs Avoids)", "Scheduling (Linear vs Flexible Time)"],
      visualType: 'grid-6block'
    },
    draft: [
      { bagian: "Komunikasi & Evaluasi", hint: "Apakah tim Anda terbiasa bicara to-the-point tanpa basa-basi (Low Context) atau membaca makna tersirat di balik keheningan (High Context)? Bagaimana cara menyampaikan kritik?" },
      { bagian: "Kepemimpinan & Keputusan", hint: "Apakah bawahan bebas mendebat bos di depan umum (Egalitarian) atau wajib tunduk pada hierarki gelar dan usia (Hierarchical)? Siapa yang mengambil keputusan akhir?" },
      { bagian: "Kepercayaan & Perselisihan", hint: "Apakah kepercayaan dibangun murni atas kualitas hasil kerja (Task-based) atau harus makan bersama dan membangun relasi personal dulu (Relationship-based)?" },
      { bagian: "Penjadwalan (Scheduling)", hint: "Apakah batas waktu (deadline) adalah janji suci yang kaku (Linear Time) atau fleksibel sesuai dinamika situasi lapangan (Flexible Time)?" }
    ],
    tutorial: [
      { step: "Petakan Profil Budaya Kantor", desc: "Petakan posisi mayoritas tim Anda pada masing-masing dari 8 garis kontinum." },
      { step: "Pahami Posisi Relatif", desc: "Bukan posisi absolut yang memicu konflik, melainkan jarak relatif antara budaya asal dua orang yang sedang berinteraksi." },
      { step: "Buat Kesepakatan Tim (Team Norms)", desc: "Rancang pedoman cara kerja bersama yang secara eksplisit disepakati oleh seluruh anggota tim multikultural." }
    ],
    actionPlan: [
      "Identifikasi titik gesekan terbesar dalam gaya komunikasi tim cabang vs kantor pusat.",
      "Sepakati aturan baku cara penyampaian kritik/revisi agar tidak menyinggung perasaan staf dari budaya high-context.",
      "Terapkan protokol ketepatan waktu rapat yang disepakati bersama seluruh divisi."
    ]
  },
  "Lencioni’s 5 Dysfunctions": {
    teori: {
      deskripsi: "Model piramida Patrick Lencioni tentang 5 disfungsi pembunuh tim: 1. Absence of Trust (Ketiadaan Rasa Percaya), 2. Fear of Conflict (Takut Berkonflik), 3. Lack of Commitment (Kurang Komitmen), 4. Avoidance of Accountability (Menghindar Tanggung Jawab), 5. Inattention to Results (Abai pada Hasil Bersama).",
      manfaat: "Mendiagnosis akar keretakan tim kerja dan membangun kembali kekompakan tim dari fondasi kepercayaan paling mendasar."
    },
    layout: {
      tipe: "Piramida 5 Tingkat Disfungsi Tim Lencioni",
      elemen: ["Puncak: 5. Inattention to Results (Ego Pribadi di Atas Kemenangan Tim)", "Tingkat 4: 4. Avoidance of Accountability (Toleransi pada Standar Buruk)", "Tingkat 3: 3. Lack of Commitment (Kepatuhan Semu Tanpa Pembelian)", "Tingkat 2: 2. Fear of Conflict (Harmoni Palsu & Politik Kantor)", "Dasar Piramida: 1. Absence of Trust (Ketakutan Membuka Kerentanan)"],
      visualType: 'pyramid-5tier'
    },
    draft: [
      { bagian: "1. Kepercayaan (Trust - Fondasi)", hint: "Apakah anggota tim berani mengakui kesalahan dan kelemahan mereka di depan rekan kerja tanpa takut dihakimi?" },
      { bagian: "2. Konflik Sehat (Conflict)", hint: "Apakah terjadi debat gagasan yang sengit dan jujur saat rapat, atau sekadar mengangguk setuju di depan lalu menggerutu di belakang (harmoni palsu)?" },
      { bagian: "3. Komitmen Nyata (Commitment)", hint: "Apakah setelah keputusan diambil, seluruh anggota tim mendukung 100% meski awalnya ada yang berbeda pendapat (Agree and Commit)?" },
      { bagian: "4. Saling Mengingatkan & Hasil", hint: "Apakah sesama rekan kerja berani menegur jika ada yang malas? Apakah semua orang lebih peduli pada target tim daripada ego divisi sendiri?" }
    ],
    tutorial: [
      { step: "Bangun Kerentanan dari Pimpinan", desc: "Pemimpin harus menjadi orang pertama yang berani meminta maaf dan mengakui ketidaktahuannya di depan tim." },
      { step: "Gali Konflik Produktif", desc: "Jangan hentikan perbedaan pendapat; fasilitasi debat ide yang fokus pada data dan masalah bisnis, bukan serangan personal." },
      { step: "Buat Kejelasan Keputusan di Akhir Rapat", desc: "Luangkan 5 menit di akhir rapat untuk memastikan semua orang menyepakati apa keputusan resmi yang diambil dan siapa yang mengerjakannya." }
    ],
    actionPlan: [
      "Jalankan sesi refleksi tim untuk menilai skor kesehatan tim pada 5 level piramida Lencioni.",
      "Gantikan budaya 'harmoni palsu' dengan mewajibkan setiap peserta rapat memberikan sudut pandang kritis sebelum keputusan final.",
      "Gantung papan indikator target bersama di tempat yang terlihat oleh semua anggota tim."
    ]
  },
  "EVP Canvas": {
    teori: {
      deskripsi: "Employee Value Proposition (EVP) Canvas untuk memetakan proposisi nilai perusahaan sebagai tempat kerja: Kompensasi, Tunjangan, Jenjang Karir, Lingkungan Kerja, dan Makna/Budaya Kerja.",
      manfaat: "Menarik talenta terbaik di pasar kerja dan menekan tingkat pergantian karyawan (turnover rate) tanpa harus selalu perang gaji."
    },
    layout: {
      tipe: "Kanvas Proposisi Nilai Karyawan (EVP)",
      elemen: ["Rewards & Kompensasi Finansial", "Opportunities & Jalur Karir", "Organization & Reputasi Brand", "Work Environment & Fasilitas", "People & Gaya Rekan Kerja", "Purpose & Makna Pekerjaan"],
      visualType: 'container-5block'
    },
    draft: [
      { bagian: "Rewards & Tunjangan", hint: "Gaji pokok kompetitif, bonus kinerja, asuransi kesehatan keluarga, opsi saham (ESOP), dan fleksibilitas tunjangan." },
      { bagian: "Opportunities & Jenjang Karir", hint: "Program mentoring, anggaran pelatihan tahunan, jalur promosi berbasis prestasi objektif, dan kesempatan memimpin proyek." },
      { bagian: "Work Environment & Fleksibilitas", hint: "Kebijakan kerja hybrid/remote, peralatan kerja ergonomis, budaya apresiasi, dan keseimbangan hidup-kerja (work-life integration)." },
      { bagian: "Purpose & Budaya Kerja", hint: "Dampak sosial dari misi perusahaan, integritas pimpinan, dan kebanggaan menjadi bagian dari organisasi tersebut." }
    ],
    tutorial: [
      { step: "Dengarkan Alasan Bertahan Karyawan Bintang", desc: "Lakukan wawancara 'Stay Interview' untuk mengetahui apa yang membuat karyawan terbaik Anda betah bertahan." },
      { step: "Temukan Pembeda Unik", desc: "Apa 1 hal yang ditawarkan perusahaan Anda yang tidak bisa ditiru oleh raksasa korporasi kompetitor?" },
      { step: "Selaraskan Pesan Rekrutmen", desc: "Gunakan narasi EVP yang jujur dan autentik dalam iklan lowongan kerja dan halaman karir website Anda." }
    ],
    actionPlan: [
      "Wawancarai 5 karyawan senior yang paling loyal mengenai alasan utama mereka setia bekerja di perusahaan.",
      "Rancang 1 benefit non-finansial baru (misal hari kerja fleksibel atau cuti ultah) berdasarkan masukan staf.",
      "Perbarui deskripsi halaman karir perusahaan dengan menonjolkan pilar Purpose dan Budaya kerja."
    ]
  },
  "360-Degree Feedback": {
    teori: {
      deskripsi: "Metode evaluasi kinerja multi-sumber di mana seorang individu dinilai secara anonim oleh Atasan, Rekan Sejawat (Peers), Bawahan Langsung, dan Evaluasi Diri Sendiri.",
      manfaat: "Memberikan gambaran komprehensif tentang kompetensi kepemimpinan dan perilaku kerja seseorang yang sering kali luput dari pandangan atasan langsung semata."
    },
    layout: {
      tipe: "Diagram Evaluasi Lingkaran Penuh 360 Derajat",
      elemen: ["Self-Evaluation (Penilaian Diri)", "Manager / Atasan Langsung", "Peers (Rekan Sejawat Sepantaran)", "Direct Reports (Bawahan / Anggota Tim)", "Analisis Gap Persepsi"],
      visualType: 'radar-chart'
    },
    draft: [
      { bagian: "Dimensi Kompetensi Kepemimpinan", hint: "Kemampuan komunikasi, integritas, pendelegasian wewenang, penyelesaian masalah, dan empati terhadap tim." },
      { bagian: "Kekuatan Terbesar (Strengths)", hint: "Perilaku positif apa yang paling dihargai dan dirasakan dampaknya oleh bawahan dan rekan kerja?" },
      { bagian: "Area Pengembangan (Blind Spots)", hint: "Di mana letak perbedaan persepsi terbesar antara penilaian diri sendiri yang tinggi vs penilaian bawahan yang rendah?" },
      { bagian: "Rencana Aksi Personal (IDP)", hint: "2 komitmen perubahan perilaku nyata apa yang akan dijalankan dalam 90 hari ke depan pasca evaluasi?" }
    ],
    tutorial: [
      { step: "Jamin Kerahasiaan Identitas (Anonimitas)", desc: "Umpan balik dari bawahan dan rekan kerja wajib dianonimkan agar mereka berani berkata jujur tanpa takut pembalasan." },
      { step: "Gunakan untuk Pengembangan, Bukan Hukuman", desc: "Praktik terbaik 360 derajat adalah untuk rencana pengembangan diri (developmental), bukan langsung menentukan potongan bonus." },
      { step: "Fasilitasi Sesi Debriefing Positif", desc: "Gunakan coach atau HR profesional untuk membantu manajer membaca hasil evaluasi tanpa defensif atau tersinggung." }
    ],
    actionPlan: [
      "Rancang kuesioner evaluasi 360 derajat singkat (10 pertanyaan perilaku) untuk para manajer cabang.",
      "Jamin anonimitas responden bawahan agar masukan yang masuk murni dan objektif.",
      "Jadwalkan sesi coaching 1-on-1 untuk membahas rencana perbaikan kepemimpinan pasca survei."
    ]
  },
  "Kirkpatrick 4-Level Model": {
    teori: {
      deskripsi: "Standar emas evaluasi efektivitas pelatihan Donald Kirkpatrick melalui 4 level bertingkat: Level 1 - Reaction (Kepuasan), Level 2 - Learning (Peningkatan Ilmu), Level 3 - Behavior (Penerapan di Tempat Kerja), Level 4 - Results (Dampak Bisnis & ROI).",
      manfaat: "Membuktikan laba atas investasi (ROI) anggaran pelatihan dan memastikan materi training benar-benar mengubah cara kerja staf di lapangan, bukan sekadar acara senang-senang."
    },
    layout: {
      tipe: "Piramida 4 Tingkat Evaluasi Pelatihan Kirkpatrick",
      elemen: ["Level 4: Results (Dampak Bisnis, Laba, Penurunan Biaya)", "Level 3: Behavior (Perubahan Perilaku Nyata di Kantor)", "Level 2: Learning (Peningkatan Skor Ujian Pre vs Post Test)", "Level 1: Reaction (Kepuasan Peserta terhadap Fasilitator/Materi)"],
      visualType: 'vertical-4tier'
    },
    draft: [
      { bagian: "Level 1: Reaksi (Reaction)", hint: "Apakah peserta merasa pelatihan menyenangkan, relevan, dan fasilitasnya memuaskan? (Diukur via form kuesioner di akhir acara)." },
      { bagian: "Level 2: Pembelajaran (Learning)", hint: "Apakah peserta benar-benar menyerap pengetahuan baru? (Diukur via perbandingan nilai Pre-Test vs Post-Test)." },
      { bagian: "Level 3: Perilaku (Behavior)", hint: "Apakah peserta mempraktikkan keterampilan baru tersebut dalam pekerjaan harian 30 hari pasca training? (Diukur via observasi atasan)." },
      { bagian: "Level 4: Hasil Bisnis (Results)", hint: "Apakah ada kenaikan penjualan, penurunan komplain, atau peningkatan efisiensi waktu setelah pelatihan selesai?" }
    ],
    tutorial: [
      { step: "Mulai Merancang dari Level 4", desc: "Sebelum membuat silabus, tanyakan: Masalah bisnis apa yang ingin diselesaikan? Metrik apa yang harus berubah?" },
      { step: "Fokus Evaluasi di Level 3", desc: "Tingkat 3 adalah jembatan paling kritis. Pelatihan terbaik sekalipun gagal jika atasan tidak memberi ruang bagi karyawan untuk mempraktikkan ilmunya." },
      { step: "Hitung ROI Pelatihan", desc: "Bandingkan total biaya training dengan nilai keuntungan finansial riil yang dihasilkan pada Level 4." }
    ],
    actionPlan: [
      "Terapkan Pre-Test dan Post-Test untuk pelatihan staf berikutnya guna mengukur Level 2 (Learning).",
      "Lakukan survei tindak lanjut ke atasan 60 hari pasca pelatihan untuk memverifikasi Level 3 (Behavior).",
      "Hitung kontribusi pelatihan penjualan terhadap kenaikan omzet kuartalan (Level 4 Results)."
    ]
  }
};
