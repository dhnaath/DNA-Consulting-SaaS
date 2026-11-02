import { FrameworkContent } from "@/frameworkData";

export const salesTechPRFrameworks: Record<string, FrameworkContent> = {
  "MEDDPICC Framework": {
    teori: {
      deskripsi: "Metodologi kualifikasi penjualan B2B bernilai tinggi (enterprise sales): Metrics, Economic Buyer, Decision Criteria, Decision Process, Paper Process, Identify Pain, Champion, Competition.",
      manfaat: "Mencegah deal besar macet di tengah jalan, meningkatkan akurasi sales forecasting hingga 90%, dan memastikan tim penjualan hanya berfokus pada prospek yang pasti closing."
    },
    layout: {
      tipe: "Checklist 8 Kriteria Kualifikasi Penjualan MEDDPICC",
      elemen: ["M - Metrics (ROI Finansial Pelanggan)", "E - Economic Buyer (Pengambil Keputusan Anggaran)", "D - Decision Criteria (Spesifikasi Teknis & Bisnis)", "D - Decision Process (Alur Persetujuan Internal)", "P - Paper Process (Legal, Procurement, Kontrak)", "I - Identify Pain (Akar Masalah Mendesak)", "C - Champion (Orang Dalam Pendukung Anda)", "C - Competition (Ancaman Kompetitor)"],
      visualType: 'checklist-8card'
    },
    draft: [
      { bagian: "Metrics & Economic Buyer", hint: "Berapa ratus juta rupiah yang bisa dihemat/dihasilkan klien jika membeli solusi ini? Siapa satu orang pemilik anggaran yang punya hak tanda tangan final?" },
      { bagian: "Decision & Paper Process", hint: "Kriteria apa yang mereka pakai untuk membandingkan vendor? Bagaimana tahapan legal, procurement, dan penandatanganan kontraknya?" },
      { bagian: "Identify Pain & Champion", hint: "Apa derita bisnis terbesar yang akan meledak jika masalah ini tidak diselesaikan sekarang? Siapa staf internal klien yang sangat ingin produk Anda menang?" },
      { bagian: "Competition", hint: "Siapa vendor lain yang sedang dipertimbangkan klien? Apa keunggulan unik Anda yang tidak bisa ditandingi kompetitor?" }
    ],
    tutorial: [
      { step: "Identifikasi Champion Sejak Awal", desc: "Temukan orang internal klien yang memiliki pengaruh dan mendapatkan keuntungan reputasi jika proyek Anda berhasil." },
      { step: "Kuantifikasikan Pain Jadi Uang (Metrics)", desc: "Ubah keluhan klien menjadi angka kerugian finansial konkret agar proposal mudah disetujui Economic Buyer." },
      { step: "Kawal Paper Process Lebih Dini", desc: "Banyak deal tertunda berbulan-bulan karena tim sales tidak memahami birokrasi legal dan procurement klien." }
    ],
    actionPlan: [
      "Audit 3 prospek B2B terbesar di pipeline penjualan Anda menggunakan kriteria MEDDPICC.",
      "Identifikasi apakah Anda sudah berbicara langsung dengan 'Economic Buyer' atau baru staf teknis.",
      "Petakan 'Champion' internal untuk mengawal proposal Anda lolos dari dewan direksi klien."
    ]
  },
  "Pricing Matrix & Elasticity": {
    teori: {
      deskripsi: "Matriks strategi penetapan harga berdasarkan nilai yang dirasakan (Perceived Value) dan sensitivitas harga pasar (Price Elasticity of Demand: Ed = % Perubahan Permintaan / % Perubahan Harga).",
      manfaat: "Menemukan 'sweet spot' harga yang memaksimalkan total margin keuntungan tanpa mengorbankan volume penjualan pasar secara drastis."
    },
    layout: {
      tipe: "Matriks Strategi Harga & Kurva Elastisitas",
      elemen: ["Strategi Premium / Skimming (Nilai Tinggi, Harga Tinggi)", "Strategi Penetrasi (Nilai Tinggi, Harga Rendah)", "Strategi Ekonomis (Nilai Rendah, Harga Rendah)", "Overpriced (Nilai Rendah, Harga Tinggi - Bahaya)", "Koefisien Elastisitas (|Ed| > 1: Elastis, |Ed| < 1: Inelastis)"],
      visualType: 'dual-view-elasticity'
    },
    draft: [
      { bagian: "Persepsi Nilai Pelanggan", hint: "Seberapa berharga produk Anda di mata pembeli dibanding alternatif kompetitor? Apa fitur premium yang mereka rela bayar lebih mahal?" },
      { bagian: "Uji Elastisitas Permintaan", hint: "Jika harga naik 10%, apakah penjualan turun lebih dari 10% (Elastis) atau hampir tidak berubah (Inelastis)?" },
      { bagian: "Struktur Biaya Dasar (Floor Price)", hint: "Berapa harga batas bawah (Cost-Plus) yang menjamin seluruh biaya tertutup dan margin laba kotor minimum aman?" },
      { bagian: "Strategi Paket / Tiering", hint: "Rancang 3 paket harga (Basic, Pro, Enterprise) untuk menangkap berbagai segmen daya beli konsumen yang berbeda." }
    ],
    tutorial: [
      { step: "Gunakan Van Westendorp Price Sensitivity Meter", desc: "Tanyakan 4 pertanyaan: Terlalu murah (curiga kualitas), Murah (penawaran bagus), Mahal (mulai mikir), Terlalu mahal (tidak akan beli)." },
      { step: "Terapkan Anchor Pricing", desc: "Tampilkan paket paling mahal terlebih dahulu untuk membuat paket kelas menengah terlihat sangat terjangkau (efek jangkar psikologis)." },
      { step: "Pantau Margin Kontribusi Total", desc: "Kenaikan harga yang menurunkan volume sedikit sering kali justru menghasilkan total laba bersih yang jauh lebih besar." }
    ],
    actionPlan: [
      "Lakukan survei sensitivitas harga Van Westendorp kepada 30 calon pelanggan potensial.",
      "Buat 3 tingkatan paket harga (Good, Better, Best) dengan paket tengah sebagai target penjualan utama.",
      "Uji coba kenaikan harga 5-8% pada segmen pelanggan korporat yang inelastis."
    ]
  },
  "Unit Economics (CLV/CAC)": {
    teori: {
      deskripsi: "Fondasi kelayakan ekonomi bisnis: Customer Lifetime Value (CLV - Total laba kotor dari 1 pelanggan seumur hidup) dibanding Customer Acquisition Cost (CAC - Biaya pemasaran & sales untuk mendapatkan 1 pelanggan).",
      manfaat: "Rasio emas CLV : CAC > 3x dan Waktu Pemulihan CAC (CAC Payback Period) < 12 bulan membuktikan model bisnis siap untuk di-scale up secara agresif tanpa membakar uang sia-sia."
    },
    layout: {
      tipe: "Dashboard Metrik Kelayakan Unit Ekonomi",
      elemen: ["CAC = Total Biaya Marketing & Sales / Jumlah Pelanggan Baru", "CLV = (Rata-rata Transaksi x Frekuensi Beli x Margin %) / Churn Rate %", "Rasio Kesehatan: CLV : CAC (Target > 3:1)", "CAC Payback Period (Target < 12 Bulan)"],
      visualType: 'metric-dashboard'
    },
    draft: [
      { bagian: "Kalkulasi Biaya Akuisisi (CAC)", hint: "Jumlahkan seluruh biaya iklan Meta/Google, gaji tim sales, komisi, dan software CRM dalam sebulan, lalu bagi dengan jumlah pembeli baru yang didapat." },
      { bagian: "Kalkulasi Nilai Seumur Hidup (CLV)", hint: "Berapa rata-rata rupiah yang dibelanjakan pelanggan dalam setahun? Berapa tahun mereka setia berlangganan (retensi) sebelum pergi (churn)?" },
      { bagian: "Rasio Kelayakan Bisnis", hint: "Jika rasio < 1:1, bisnis membakar uang dan menuju bangkrut. Jika rasio 3:1, bisnis sangat sehat. Jika > 5:1, bisnis kurang agresif berinvestasi di pemasaran!" },
      { bagian: "CAC Payback Period", hint: "Berapa bulan margin laba dari pelanggan tersebut mampu menutupi kembali biaya awal yang dihabiskan untuk mengakuisisinya?" }
    ],
    tutorial: [
      { step: "Pisahkan CAC Berdasarkan Kanal", desc: "Hitung CAC secara granular: bandingkan CAC dari iklan berbayar (paid ads), referral organik, dan outbound sales B2B." },
      { step: "Turunkan Churn untuk Naikkan CLV", desc: "Menaikkan retensi pelanggan sebesar 5% dapat meningkatkan CLV hingga 25-95% secara eksponensial." },
      { step: "Tingkatkan Nilai Belanja (Upselling)", desc: "Tawarkan add-on atau langganan tahunan di muka untuk mempercepat pemulihan biaya akuisisi modal kerja." }
    ],
    actionPlan: [
      "Hitung angka CAC riil bisnis Anda untuk bulan lalu (Total biaya promosi / Pembeli baru).",
      "Kalkulasikan estimasi CLV pelanggan rata-rata menggunakan data margin laba kotor saat ini.",
      "Verifikasi apakah rasio CLV:CAC bisnis Anda sudah melampaui angka aman minimal 3x."
    ]
  },
  "SPIN Selling Framework": {
    teori: {
      deskripsi: "Metode wawancara penjualan konsultatif karya Neil Rackham melalui 4 urutan pertanyaan strategis: Situation (Konteks), Problem (Masalah), Implication (Dampak Buruk), dan Need-Payoff (Nilai Solusi).",
      manfaat: "Membuat calon pembeli menyadari sendiri besarnya bahaya masalah mereka dan meminta solusi, tanpa kesan memaksa (hard selling)."
    },
    layout: {
      tipe: "Alur 4 Tingkat Pertanyaan Konsultatif SPIN",
      elemen: ["1. Situation Questions (Fakta & Latar Belakang)", "2. Problem Questions (Kesulitan & Friksi)", "3. Implication Questions (Dampak Negatif & Kerugian Berantai)", "4. Need-Payoff Questions (Manfaat & Keuntungan Solusi)"],
      visualType: 'sequential-4step'
    },
    draft: [
      { bagian: "1. Pertanyaan Situasi (Situation)", hint: "Pertanyaan fakta ringkas untuk memahami kondisi operasional klien saat ini (Jangan tanyakan apa yang sudah bisa Anda cari di Google/LinkedIn!)." },
      { bagian: "2. Pertanyaan Masalah (Problem)", hint: "Eksplorasi titik frustrasi: 'Seberapa sering sistem Anda mengalami gangguan? Bagian mana yang prosesnya paling lambat?'" },
      { bagian: "3. Pertanyaan Implikasi (Implication - KUNCI!)", hint: "Eskalasi dampak: 'Jika gangguan itu terjadi 2 jam, berapa pesanan yang hilang? Bagaimana dampaknya terhadap target bonus akhir tahun tim Anda?'" },
      { bagian: "4. Pertanyaan Need-Payoff (Solusi)", hint: "Bimbing klien membayangkan hasil manis: 'Jika waktu tunggu itu bisa dipangkas 50%, bagaimana hal itu membantu Anda memenuhi deadline klien?'" }
    ],
    tutorial: [
      { step: "Jangan Terjebak Terlalu Banyak Situation Questions", desc: "Maksimal 2-3 pertanyaan situasi; pembeli eksekutif cepat bosan diwawancarai hal-hal dasar." },
      { step: "Habiskan Waktu di Implication Questions", desc: "Pertanyaan implikasi adalah senjata terkuat SPIN. Ubah masalah kecil menjadi 'kebakaran darurat' yang wajib segera dipadamkan." },
      { step: "Biarkan Klien Menyebutkan Solusinya", desc: "Gunakan Need-Payoff agar klien sendiri yang mendeskripsikan betapa berharganya fitur produk Anda." }
    ],
    actionPlan: [
      "Susun skrip 4 pertanyaan Implikasi untuk produk unggulan yang membongkar kerugian jika klien tidak membeli.",
      "Latih tim sales agar menahan diri dari presentasi fitur produk sebelum melewati tahap Implication.",
      "Gunakan pertanyaan Need-Payoff di akhir sesi untuk mengunci komitmen uji coba gratis (pilot)."
    ]
  },
  "BANT Framework": {
    teori: {
      deskripsi: "Kerangka kualifikasi prospek klasik dari IBM: Budget (Ketersediaan Anggaran), Authority (Wewenang Pengambilan Keputusan), Need (Tingkat Kebutuhan Riil), dan Timeline (Jadwal Implementasi).",
      manfaat: "Menyaring prospek mentah (lead) dengan cepat agar tenaga penjual tidak membuang-buang waktu memprospek pihak yang tidak punya uang atau tidak punya wewenang."
    },
    layout: {
      tipe: "Matriks 4 Kriteria Kelayakan Prospek BANT",
      elemen: ["Budget (Apakah ada dana yang dialokasikan?)", "Authority (Apakah kita bicara dengan pembuat keputusan?)", "Need (Apakah ada masalah nyata yang mendesak?)", "Timeline (Kapan mereka berencana membeli? 1-3 bulan?)"],
      visualType: 'matrix2x2'
    },
    draft: [
      { bagian: "Budget (Anggaran Dana)", hint: "Apakah sudah ada pos anggaran khusus untuk proyek ini, atau harus mengajukan revisi anggaran ke direksi? Berapa kisaran alokasi yang disiapkan?" },
      { bagian: "Authority (Pengambil Keputusan)", hint: "Siapa saja yang akan menandatangani kontrak? Siapa selain Anda yang terlibat dalam evaluasi kelayakan vendor ini?" },
      { bagian: "Need (Urgensi Kebutuhan)", hint: "Apakah masalah ini masuk dalam 3 prioritas teratas perusahaan mereka tahun ini, atau sekadar proyek sampingan yang bisa dibatalkan kapan saja?" },
      { bagian: "Timeline (Tenggat Waktu Beli)", hint: "Kapan solusi ini harus sudah aktif terpasang? Kapan keputusan final pemilihan vendor akan diketok palu?" }
    ],
    tutorial: [
      { step: "Tanyakan Wewenang Secara Halus", desc: "Tanyakan: 'Bagaimana proses pengambilan keputusan untuk pengadaan serupa di perusahaan Bapak sebelumnya?'" },
      { step: "Verifikasi Timeline yang Realistis", desc: "Prospek dengan timeline > 6 bulan masuk ke kategori 'Nurturing' (jangan buang waktu pertemuan mingguan)." },
      { step: "Kualifikasi Ulang Secara Berkala", desc: "Anggaran dan wewenang klien bisa berubah jika terjadi pergantian pimpinan atau efisiensi biaya kuartalan." }
    ],
    actionPlan: [
      "Terapkan form kualifikasi BANT pada form pendaftaran demo di website perusahaan.",
      "Tandai lead sebagai 'Hot Prospect' hanya jika memenuhi keempat kriteria BANT secara lengkap.",
      "Alihkan prospek tanpa Budget atau Timeline ke newsletter email otomatis untuk diedukasi lebih lanjut."
    ]
  },
  "Revenue Engine (Flywheel)": {
    teori: {
      deskripsi: "Model pertumbuhan roda gila (Flywheel) karya Jim Collins & HubSpot yang menggantikan corong linier (Funnel): Attract (Tarik), Engage (Kaitkan), Delight (Puaskan), di mana pelanggan puas menjadi tenaga pendorong pertumbuhan baru.",
      manfaat: "Menghilangkan friksi antar-departemen (Marketing, Sales, Customer Success) dan memanfaatkan efek rekomendasi getok tular (Word-of-Mouth) untuk menurunkan CAC secara drastis."
    },
    layout: {
      tipe: "Roda Gila Pendapatan Berputar 3 Tahap (Flywheel)",
      elemen: ["Attract (Konten Berkualitas & Brand Awareness)", "Engage (Pengalaman Beli Mulus & Solusi Tepat)", "Delight (Layanan Purna Jual & Pelanggan Setia)", "Pusat Roda: Customer Experience (Pengalaman Pelanggan)", "Friction Reducers (Penghilang Hambatan)"],
      visualType: 'circular-wheel-3'
    },
    draft: [
      { bagian: "Fase Attract (Menarik)", hint: "Bagaimana calon pelanggan menemukan Anda tanpa iklan mengganggu? (Konten edukatif, SEO, kehadiran pimpinan di podcast industri)." },
      { bagian: "Fase Engage (Mengaitkan)", hint: "Seberapa mudah bagi calon pembeli untuk mencoba, mendaftar, dan membeli? Apakah ada sales berbelit-belit yang memperlambat transaksi?" },
      { bagian: "Fase Delight (Memuaskan)", hint: "Bagaimana memastikan pelanggan sukses mencapai tujuannya setelah membayar? Program pendampingan onboarding apa yang diberikan?" },
      { bagian: "Menghilangkan Friksi (Friction)", hint: "Titik mana yang memperlambat putaran roda? (Misal: Alur klaim refund yang rumit, customer service lambat merespon)." }
    ],
    tutorial: [
      { step: "Ukur Kecepatan Putaran Roda", desc: "Semakin banyak pelanggan puas yang mempromosikan produk Anda ke rekan mereka, semakin kencang roda berputar menghasilkan omzet tanpa biaya iklan." },
      { step: "Identifikasi Titik Friksi Terbesar", desc: "Cari keluhan terbanyak di ulasan Google Review atau tiket komplain CS; setiap friksi yang dihilangkan melipatgandakan momentum." },
      { step: "Satukan Insentif Marketing & Support", desc: "Beri tim Customer Success insentif dari angka retensi dan ekspansi akun, bukan hanya tim Sales akuisisi baru." }
    ],
    actionPlan: [
      "Identifikasi 2 titik hambatan (friksi) terbesar dalam proses pembayaran atau pengiriman produk Anda.",
      "Rancang program referral otomatis yang memberikan hadiah bagi pelanggan yang mengajak temannya.",
      "Ukur skor kepuasan CSAT mingguan untuk memastikan putaran roda fase 'Delight' tetap kencang."
    ]
  },
  "Value-Based Pricing Canvas": {
    teori: {
      deskripsi: "Kanvas penetapan harga berbasis nilai diferensiasi: Harga ditentukan berdasarkan nilai ekonomi yang diterima pelanggan (Economic Value to Customer / EVC) relatif terhadap alternatif terbaik kompetitor, BUKAN berdasarkan biaya produksi (Cost-Plus).",
      manfaat: "Menghindari jebakan perang harga murah, menangkap margin laba maksimal, dan membuktikan justifikasi harga premium di mata konsumen rasional."
    },
    layout: {
      tipe: "Struktur Nilai Ekonomi Pelanggan (EVC Canvas)",
      elemen: ["Harga Alternatif Referensi Kompetitor", "Positive Differentiation Value (+ Nilai Tambah Unik)", "Negative Differentiation Value (- Kekurangan Relatif)", "Total Economic Value (EVC)", "Titik Harga Optimal (Price Sharing)"],
      visualType: 'stacked-form'
    },
    draft: [
      { bagian: "Harga Referensi Alternatif (Reference Price)", hint: "Berapa rupiah yang harus dibayar konsumen jika mereka membeli produk pesaing terdekat atau menggunakan cara lama saat ini?" },
      { bagian: "Nilai Pembeda Positif (Positive Drivers)", hint: "Berapa rupiah penghematan waktu, tenaga, listrik, atau tambahan penjualan yang dihasilkan secara unik HANYA oleh produk Anda?" },
      { bagian: "Nilai Pembeda Negatif (Negative Drivers)", hint: "Apakah ada biaya pelatihan tambahan, instalasi rumit, atau risiko software baru yang membebani pembeli?" },
      { bagian: "Bagi-Bagi Nilai (Value Sharing)", hint: "Bagilah nilai tambah ekonomi: Misal produk Anda memberi untung Rp 100 juta, jual dengan harga Rp 30 juta agar klien merasa untung bersih Rp 70 juta." }
    ],
    tutorial: [
      { step: "Kuantifikasikan Nilai ke Satuan Moneter", desc: "Jangan katakan 'software kami lebih cepat'; katakan 'software kami menghemat 40 jam kerja staf per bulan = setara Rp 15 juta'." },
      { step: "Bandingkan Head-to-Head", desc: "Gunakan alternatif acuan yang benar-benar dipertimbangkan oleh pelanggan saat meminta penawaran." },
      { step: "Tinggalkan Cara Lama Cost-Plus", desc: "Jika biaya produksi Anda Rp 10 ribu tapi menghemat masalah bernilai Rp 10 juta, jangan jual Rp 15 ribu; juallah di kisaran Rp 2 juta!" }
    ],
    actionPlan: [
      "Hitung nilai ekonomi penghematan riil (dalam Rupiah) yang dinikmati klien dari produk Anda.",
      "Bandingkan dengan harga produk alternatif kompetitor nomor satu di pasar.",
      "Susun proposal penawaran baru yang menonjolkan perhitungan Return on Investment (ROI) bagi pembeli."
    ]
  },
  "Churn Analysis Matrix": {
    teori: {
      deskripsi: "Analisis retensi pelanggan menggunakan analisis kohort (Cohort Analysis) dan matriks penyebab hilangnya pelanggan (Voluntary vs Involuntary Churn).",
      manfaat: "Mendeteksi sinyal awal pelanggan yang akan kabur, menambal kebocoran 'ember bisnis', dan memperpanjang umur keanggotaan pelanggan aktif."
    },
    layout: {
      tipe: "Tabel Analisis Kohort Retensi & Matriks Churn",
      elemen: ["Kohort Pelanggan Bulanan", "Tingkat Retensi Bulan 1, 2, 3... 12", "Voluntary Churn (Kecewa, Beralih ke Kompetitor, Tidak Butuh Lagi)", "Involuntary Churn (Kartu Kredit Kedaluwarsa, Gagal Bayar Teknis)", "Tindakan Intervensi Penyelamatan"],
      visualType: 'cohort-table'
    },
    draft: [
      { bagian: "Analisis Kohort Retensi", hint: "Dari 100 pelanggan yang mendaftar di bulan Januari, berapa persen yang masih aktif bertransaksi di bulan ke-3 dan bulan ke-6?" },
      { bagian: "Involuntary Churn (Gagal Bayar Teknis)", hint: "Berapa banyak pelanggan yang churn hanya karena autodebet gagal atau lupa isi saldo? (Bisa diselesaikan dengan dunning system otomatis!)." },
      { bagian: "Voluntary Churn (Keputusan Sadar)", hint: "Mengapa pelanggan sengaja membatalkan langganan? Masalah produk, harga kemahalan, atau onboarding awal yang membingungkan?" },
      { bagian: "Early Warning Signals (Sinyal Dini)", hint: "Perilaku apa yang menjadi pertanda klien akan kabur? (Misal: Tidak login selama 14 hari, frekuensi order turun 50%)." }
    ],
    tutorial: [
      { step: "Lakukan Wawancara Pembatalan (Exit Interview)", desc: "Telepon setiap klien yang berhenti untuk menanyakan alasan jujur mereka; data ini adalah tambang emas perbaikan produk." },
      { step: "Perbaiki Onboarding 14 Hari Pertama", desc: "Sebagian besar churn terjadi karena pengguna gagal merasakan manfaat utama (Aha! Moment) di minggu pertama pendaftaran." },
      { step: "Pasang Otomasi Pemulihan Kartu", desc: "Terapkan email pengingat sebelum masa kartu habis dan coba tagih ulang secara terjadwal untuk menyelamatkan pendapatan pasif." }
    ],
    actionPlan: [
      "Petakan grafik retensi kohort pengguna bisnis Anda selama 6 bulan terakhir.",
      "Siapkan email otomasi penyelamatan untuk pengguna yang tidak aktif bertransaksi selama 21 hari.",
      "Hubungi 5 pelanggan yang baru saja membatalkan layanan untuk menggali masukan jujur."
    ]
  },
  "Technology Readiness (TRL)": {
    teori: {
      deskripsi: "Skala 9 tingkat NASA untuk mengukur tingkat kesiapan dan kematangan teknologi: TRL 1-3 (Riset Dasar di Lab), TRL 4-6 (Pengujian Prototipe Lingkungan Relevan), TRL 7-9 (Komersialisasi & Terbukti di Operasional Riil).",
      manfaat: "Mencegah kegagalan komersialisasi akibat memaksakan riset yang masih mentah langsung dijual ke pasar massal, serta menjadi syarat baku pendanaan riset inovasi."
    },
    layout: {
      tipe: "Pengukur 9 Tingkat Kematangan Teknologi TRL",
      elemen: ["TRL 1-3: Research (Prinsip Dasar & Konsep Lab)", "TRL 4-6: Development (Validasi Komponen & Prototipe Sistem)", "TRL 7-9: Deployment (Uji Coba Lapangan & Produksi Penuh)", "Milestone Pembuktian Kelayakan"],
      visualType: 'gauge-meter-9'
    },
    draft: [
      { bagian: "Fase Riset (TRL 1-3)", hint: "Prinsip dasar teknologi telah dipublikasikan, konsep aplikasi telah dirumuskan, dan pembuktian konsep (PoC) analitis telah tuntas di laboratorium." },
      { bagian: "Fase Pengembangan (TRL 4-6)", hint: "Komponen dasar telah diintegrasikan menjadi prototipe yang berfungsi dan diuji di lingkungan yang menyerupai kondisi operasional sebenarnya." },
      { bagian: "Fase Komersialisasi (TRL 7-9)", hint: "Prototipe skala penuh telah lulus sertifikasi regulasi, terbukti handal dalam operasi nyata berulang kali, dan siap diproduksi massal." },
      { bagian: "Bottleneck Validasi Teknologi", hint: "Uji sertifikasi atau pengujian daya tahan apa yang saat ini menghambat transisi ke level TRL berikutnya?" }
    ],
    tutorial: [
      { step: "Nilai Berdasarkan Bukti Uji Nyata", desc: "Jangan naikkan skor TRL hanya berdasarkan presentasi teori; wajib didukung data laporan uji laboratorium atau sertifikat resmi." },
      { step: "Waspadai 'Lembah Kematian' (TRL 4-6)", desc: "Transisi dari lab ke prototipe lapangan adalah fase paling kritis di mana banyak startup teknologi kehabisan modal (Valley of Death)." },
      { step: "Sesuaikan Sumber Pendanaan", desc: "TRL 1-3 cocok dengan dana hibah riset; TRL 4-6 butuh Angel Investor/Venture Capital; TRL 7-9 didanai oleh pendapatan komersial dan bank." }
    ],
    actionPlan: [
      "Tetapkan skor TRL objektif untuk produk teknologi atau inovasi formula baru Anda saat ini.",
      "Identifikasi data pengujian apa yang masih kurang untuk naik ke tingkat TRL berikutnya.",
      "Susun proposal pendanaan yang sesuai dengan tingkat maturitas TRL teknologi Anda."
    ]
  },
  "Horizon Scanning (Futures)": {
    teori: {
      deskripsi: "Metode peramalan masa depan strategis untuk mendeteksi sinyal lemah (Weak Signals), tren baru (Emerging Trends), dan potensi disrupsi teknologi dalam 3 horizon waktu (H1: Sekarang, H2: 2-5 tahun, H3: > 5 tahun).",
      manfaat: "Mencegah 'Kebutaan Kodak' di mana perusahaan raksasa tumbang mendadak karena gagal melihat ancaman teknologi baru yang awalnya dianggap mainan remeh."
    },
    layout: {
      tipe: "Kerucut Peramalan Masa Depan 3 Horizon",
      elemen: ["Horizon 1: Core Business (Pertahankan & Lindungi - 1-2 Tahun)", "Horizon 2: Emerging Opportunities (Kembangkan & Skalakan - 2-4 Tahun)", "Horizon 3: Transformational Futures (Eksperimen & Riset Masa Depan - >5 Tahun)", "Weak Signals & Wildcards"],
      visualType: 'diverging-cone'
    },
    draft: [
      { bagian: "Horizon 1 (Operasional Saat Ini)", hint: "Inovasi inkremental untuk memperkuat produk andalan saat ini, menaikkan margin, dan mempertahankan pangsa pasar." },
      { bagian: "Horizon 2 (Peluang Pertumbuhan Baru)", hint: "Lini bisnis baru atau segmen pasar yang sedang tumbuh pesat dan siap menjadi penopang omzet dalam 3 tahun ke depan." },
      { bagian: "Horizon 3 (Disrupsi Masa Depan)", hint: "Teknologi radikal baru (bioteknologi, kuantum, energi baru, material baru) yang berpotensi memusnahkan model bisnis saat ini dalam 5-10 tahun." },
      { bagian: "Weak Signals (Sinyal Lemah Hari Ini)", hint: "Perilaku aneh apa yang mulai dilakukan oleh generasi muda atau komunitas peretas (hacker) yang belum dipedulikan pasar massal?" }
    ],
    tutorial: [
      { step: "Gunakan Kerangka PESTEL untuk Scanning", desc: "Pindai sinyal perubahan di bidang Politik, Ekonomi, Sosial, Teknologi, Lingkungan, dan Hukum secara luas." },
      { step: "Alokasikan Anggaran Seimbang (70-20-10)", desc: "Alokasikan 70% sumber daya untuk Horizon 1, 20% untuk Horizon 2, dan 10% untuk eksperimen spekulatif di Horizon 3." },
      { step: "Jangan Hakimi Sinyal Lemah dengan Metrik H1", desc: "Proyek Horizon 3 tidak akan menghasilkan laba dalam 1 tahun; jangan bunuh ide masa depan dengan tolok ukur ROI jangka pendek." }
    ],
    actionPlan: [
      "Jadwalkan sesi brainstorming Horizon Scanning triwulanan bersama pimpinan lintas generasi.",
      "Petakan 3 'Weak Signals' teknologi atau kebiasaan konsumen baru yang berpotensi mendisrupsi bisnis Anda.",
      "Alokasikan 5-10% dari anggaran litbang untuk proyek eksplorasi Horizon 3."
    ]
  },
  "Gartner Hype Cycle": {
    teori: {
      deskripsi: "Representasi grafis kurva kedewasaan dan adopsi teknologi baru Gartner: 1. Innovation Trigger, 2. Peak of Inflated Expectations, 3. Trough of Disillusionment, 4. Slope of Enlightenment, 5. Plateau of Productivity.",
      manfaat: "Membantu pimpinan membedakan antara sensasi tren sesaat (hype) dengan nilai bisnis nyata, sehingga terhindar dari investasi mahal di puncak kurva yang berujung kekecewaan."
    },
    layout: {
      tipe: "Kurva Siklus Sensasi Teknologi (Gartner Hype Cycle)",
      elemen: ["1. Pemicu Inovasi (Innovation Trigger)", "2. Puncak Ekspektasi Semu (Peak of Inflated Expectations)", "3. Lembah Kekecewaan (Trough of Disillusionment)", "4. Tanjakan Pencerahan (Slope of Enlightenment)", "5. Dataran Produktivitas Riil (Plateau of Productivity)"],
      visualType: 'wave-curve'
    },
    draft: [
      { bagian: "Innovation Trigger", hint: "Teknologi terobosan baru diperkenalkan; banyak liputan media heboh meskipun belum ada produk komersial yang teruji handal." },
      { bagian: "Peak of Inflated Expectations", hint: "Masa sensasi liar di mana semua orang mengklaim teknologi ini akan mengubah segalanya; valuasi perusahaan melonjak tidak masuk akal." },
      { bagian: "Trough of Disillusionment", hint: "Masa kegagalan publik: eksperimen banyak yang gagal, media mulai mencemooh, dan investor spekulatif kabur." },
      { bagian: "Slope of Enlightenment & Plateau", hint: "Manfaat riil mulai terbukti secara metodologis; perusahaan pragmatis mulai memetik hasil produktivitas nyata yang stabil." }
    ],
    tutorial: [
      { step: "Jangan Berinvestasi Besar di Puncak Hype", desc: "Tahan godaan membeli solusi mahal di puncak kurva ekspektasi; tunggu hingga teknologi memasuki tahap Slope of Enlightenment." },
      { step: "Manfaatkan Masa Lembah Kekecewaan", desc: "Saat orang lain patah semangat di Trough of Disillusionment, itulah saat terbaik untuk merekrut talenta cerdas dan mengakuisisi aset dengan harga diskon." },
      { step: "Fokus pada Kasus Penggunaan Riil (Use Cases)", desc: "Abaikan jargon teknologi; tanyakan: Masalah bisnis spesifik apa yang bisa diselesaikan secara terukur hari ini?" }
    ],
    actionPlan: [
      "Petakan seluruh teknologi baru yang sedang diadopsi perusahaan ke dalam posisi kurva Hype Cycle.",
      "Hindari komitmen vendor jangka panjang untuk teknologi yang masih berada di 'Peak of Inflated Expectations'.",
      "Uji coba solusi otomasi yang sudah mulai memasuki 'Slope of Enlightenment' untuk efisiensi kantor."
    ]
  },
  "Doblin’s 10 Types Innovation": {
    teori: {
      deskripsi: "Kerangka taksonomi inovasi Larry Keeley (Doblin) yang melampaui sekadar inovasi produk, terbagi dalam 3 klaster: Configuration (Profit Model, Network, Structure, Process), Offering (Product Performance, Product System), dan Experience (Service, Channel, Brand, Customer Engagement).",
      manfaat: "Perusahaan yang menggabungkan 5 atau lebih tipe inovasi secara bersamaan terbukti menghasilkan return pasar modal jauh melampaui rata-rata industri dan sulit ditiru pesaing."
    },
    layout: {
      tipe: "Matriks 10 Tipe Inovasi Doblin (3 Kategori Besar)",
      elemen: ["Configuration: Profit Model, Network, Structure, Process", "Offering: Product Performance, Product System", "Experience: Service, Channel, Brand, Customer Engagement", "Inovasi Multi-Dimensi"],
      visualType: 'matrix-10col'
    },
    draft: [
      { bagian: "Klaster Konfigurasi (Internal)", hint: "Profit Model (Cara baru cari uang), Network (Kolaborasi mitra luar), Structure (Organisasi aset/bakat), Process (Cara kerja rahasia yang unggul)." },
      { bagian: "Klaster Penawaran (Offering)", hint: "Product Performance (Kualitas/fitur unik produk), Product System (Ekosistem produk dan aksesori yang saling mengunci)." },
      { bagian: "Klaster Pengalaman (Experience)", hint: "Service (Pelayanan purna jual memukau), Channel (Saluran distribusi baru), Brand (Identitas kuat), Customer Engagement (Interaksi emosional pelanggan)." },
      { bagian: "Kombinasi Inovasi Pemenang", hint: "Pilihlah minimal 1 elemen dari tiap klaster untuk menciptakan benteng pertahanan bisnis (moat) yang kokoh." }
    ],
    tutorial: [
      { step: "Hindari Terjebak Hanya di Product Performance", desc: "Inovasi fitur produk adalah tipe inovasi yang paling mudah dan paling cepat disalin oleh kompetitor dalam hitungan bulan." },
      { step: "Eksplorasi Inovasi Model Profit & Channel", desc: "Mengubah model bisnis jual putus menjadi sewa bulanan atau membuka kanal penjualan baru sering kali melipatgandakan valuasi perusahaan." },
      { step: "Bongkar Cara Kerja Pemimpin Industri", desc: "Analisis Apple atau Michelin: mereka sukses bukan hanya karena produknya bagus, tetapi karena ekosistem sistem produk dan branding pengalamannya." }
    ],
    actionPlan: [
      "Audit produk unggulan Anda: jenis inovasi apa saja dari 10 tipe Doblin yang sudah diterapkan?",
      "Pilih 2 tipe inovasi di klaster 'Experience' (misal Service dan Channel) untuk dikembangkan tahun ini.",
      "Rancang inovasi 'Profit Model' baru (misal skema bagi hasil atau keanggotaan VIP) untuk mengunci loyalitas pembeli."
    ]
  },
  "SCAMPER Ideation Canvas": {
    teori: {
      deskripsi: "Teknik pemantik kreativitas Bob Eberle untuk memodifikasi produk atau layanan eksisting menggunakan 7 pemicu aksi: Substitute (Ganti), Combine (Gabungkan), Adapt (Sesuaikan), Modify/Magnify (Ubah/Perbesar), Put to another use (Gunakan fungsi lain), Eliminate (Hapus), Reverse (Balikkan).",
      manfaat: "Membantu tim keluar dari kebuntuan ide (creative block) dan menemukan sudut pandang perbaikan inovatif secara sistematis."
    },
    layout: {
      tipe: "Papan 7 Pemicu Kreativitas SCAMPER",
      elemen: ["S - Substitute (Ganti bahan/proses)", "C - Combine (Gabungkan fungsi/layanan)", "A - Adapt (Adaptasi dari industri lain)", "M - Modify / Magnify (Perbesar/Perkecil)", "P - Put to another use (Alih fungsi target pasar)", "E - Eliminate (Hapus bagian mubazir)", "R - Reverse (Balikkan alur/urutan kerja)"],
      visualType: 'modular-7cards'
    },
    draft: [
      { bagian: "Substitute & Combine", hint: "Bahan, komponen, atau langkah apa yang bisa diganti dengan alternatif lebih murah/ramah lingkungan? Layanan apa yang bisa digabungkan jadi satu paket terpadu?" },
      { bagian: "Adapt & Modify", hint: "Ide sukses apa dari industri perhotelan/game yang bisa diadaptasi ke bisnis Anda? Apa elemen yang bisa diperbesar ukurannya atau dipercepat kecepatannya?" },
      { bagian: "Put to Another Use", hint: "Limbah produksi atau data internal apa yang bisa dijual atau dimanfaatkan untuk kelompok target konsumen yang sama sekali berbeda?" },
      { bagian: "Eliminate & Reverse", hint: "Fitur atau birokrasi apa yang bisa dihapus tanpa mengurangi kepuasan pengguna? Bagaimana jika alur kerja dibalik dari belakang ke depan?" }
    ],
    tutorial: [
      { step: "Terapkan Satu Per Satu", desc: "Fokuskan sesi tim pada satu huruf pemicu selama 10 menit sebelum berpindah ke huruf berikutnya." },
      { step: "Tunda Penghakiman (No Bad Ideas)", desc: "Biarkan ide-ide gila dan absurd tertulis terlebih dahulu; ide radikal sering kali menjadi cikal bakal inovasi brilian." },
      { step: "Pilih 3 Ide Paling Layak", desc: "Gunakan kriteria dampak dan kemudahan implementasi untuk menyaring ide terbaik hasil SCAMPER." }
    ],
    actionPlan: [
      "Jalankan sesi SCAMPER 30 menit bersama tim desain untuk merombak kemasan produk lama.",
      "Gunakan pemicu 'Eliminate' untuk memangkas 2 langkah proses pelayanan yang selama ini dikeluhkan lambat.",
      "Gunakan pemicu 'Combine' untuk menciptakan paket bundling produk dan layanan bernilai tinggi."
    ]
  },
  "MVP Canvas": {
    teori: {
      deskripsi: "Kanvas satu halaman untuk merancang Minimum Viable Product: Masalah, Persona Pengguna, Proposisi Nilai, Bentuk MVP, Asumsi Paling Berisiko, Kriteria Keberhasilan, dan Rencana Pembelajaran.",
      manfaat: "Memastikan tim tidak berlebihan membangun fitur (over-engineering) dan tetap fokus pada versi produk terkecil yang mampu menghasilkan pembelajaran pasar tervalidasi."
    },
    layout: {
      tipe: "Kanvas Perancangan Minimum Viable Product (MVP)",
      elemen: ["Target Persona & Problem Utama", "Value Proposition MVP", "Format Bentuk MVP (Landing Page, Concierge, Wizard of Oz)", "Asumsi Paling Kritis (Riskiest Assumption)", "Kriteria Sukses & Metrik Batas Lulus", "Anggaran & Jadwal Uji Coba"],
      visualType: 'canvas9'
    },
    draft: [
      { bagian: "Problem & Target Persona", hint: "Siapa kelompok pengguna awal (early adopters) yang paling putus asa membutuhkan solusi ini sekarang juga?" },
      { bagian: "Format MVP Terpilih", hint: "Pilih jenis MVP: Landing Page (uji minat beli), Concierge (layanan manual tangan pimpinan), atau Wizard of Oz (tampilan otomatis padahal proses manual)." },
      { bagian: "Asumsi Kritis (Riskiest Assumption)", hint: "Asumsi apa yang jika terbukti salah, seluruh ide bisnis akan langsung gugur? (Misal: 'Orang bersedia bayar Rp 50 ribu per bulan untuk fitur ini')." },
      { bagian: "Kriteria Sukses Kuantitatif", hint: "Angka minimal apa yang menyatakan MVP berhasil? (Contoh: Minimal 15% dari 100 pengunjung melakukan pre-order)." }
    ],
    tutorial: [
      { step: "Definisikan 'Minimum' Secara Ketat", desc: "Potong semua fitur dekoratif; sisakan HANYA satu alur fungsi utama yang memecahkan masalah inti pengguna." },
      { step: "Tetapkan Batas Waktu Cepat", desc: "MVP yang baik harus bisa diluncurkan dan diuji ke publik dalam waktu kurang dari 2 minggu." },
      { step: "Evaluasi Data Objektif", desc: "Jangan puas dengan pujian teman; jadikan komitmen uang muka atau registrasi data sebagai satu-satunya bukti validasi." }
    ],
    actionPlan: [
      "Isi MVP Canvas untuk ide produk digital atau varian menu baru dalam 1 halaman.",
      "Pilih bentuk MVP 'Concierge' untuk melayani 5 klien pertama secara manual sebelum membuat software.",
      "Tetapkan metrik kelulusan: minimal 3 dari 5 klien bersedia membayar harga komersial penuh."
    ]
  },
  "Open Innovation Model": {
    teori: {
      deskripsi: "Paradigma Henry Chesbrough yang menyatakan bahwa perusahaan tidak boleh hanya mengandalkan riset internal; perusahaan harus memanfaatkan ide dan jalur pasar eksternal (Inbound & Outbound Innovation).",
      manfaat: "Mempercepat waktu ke pasar (time-to-market), memangkas biaya litbang hingga separuh, dan memanfaatkan ekosistem startup serta universitas luar."
    },
    layout: {
      tipe: "Corong Inovasi Terbuka Chesbrough (Inbound vs Outbound)",
      elemen: ["Dinding Batas Perusahaan yang Berpori (Porous Boundary)", "Inbound Innovation (Lisensi luar, akuisisi startup, crowdsourcing ide)", "Outbound Innovation (Spin-off usaha, lisensi paten internal ke pihak lain)", "Jalur Pasar Eksternal & Internal"],
      visualType: 'pervasive-funnel'
    },
    draft: [
      { bagian: "Inbound Innovation (Masuk ke Dalam)", hint: "Teknologi atau paten dari universitas/startup mana yang bisa kita beli atau lisensikan daripada membuat dari nol di dalam kantor?" },
      { bagian: "Outbound Innovation (Keluar)", hint: "Paten atau teknologi internal apa yang tidak terpakai oleh bisnis utama kita, namun bisa dijual atau dilisensikan ke industri lain untuk menghasilkan royalti?" },
      { bagian: "Ekosistem Kolaborasi & Co-creation", hint: "Program hackathon, inkubator startup, atau kemitraan riset kampus apa yang bisa dibangun secara berkesinambungan?" },
      { bagian: "Tata Kelola Hak Kekayaan Intelektual (HAKI)", hint: "Bagaimana pembagian kepemilikan paten dan royalti disepakati secara adil dengan mitra luar?" }
    ],
    tutorial: [
      { step: "Hilangkan Sindrom 'Not Invented Here'", desc: "Hapus arogansi internal yang menolak ide luar; akui bahwa mayoritas orang pintar di dunia bekerja di luar perusahaan Anda." },
      { step: "Buka API & Sandbox Kemitraan", desc: "Sediakan antarmuka digital yang memudahkan pengembang aplikasi pihak ketiga membangun solusi di atas platform Anda." },
      { step: "Bentuk Tim Corporate Venture Capital (CVC)", desc: "Investasikan dana minoritas pada startup-startup potensial yang relevan dengan masa depan bisnis Anda." }
    ],
    actionPlan: [
      "Identifikasi 1 teknologi pelengkap yang lebih murah dibeli lisensinya dibanding dibangun sendiri.",
      "Buat program kemitraan riset magang bersama fakultas teknik/bisnis universitas terkemuka.",
      "Buka forum saran inovasi terbuka untuk menampung ide perbaikan produk langsung dari komunitas pelanggan."
    ]
  },
  "Value Proposition Testing": {
    teori: {
      deskripsi: "Metode eksperimen sistematis Strategyzer untuk memvalidasi hipotesis Value Proposition Canvas: Uji Masalah (Problem Test), Uji Solusi (Solution Test), dan Uji Model Bisnis (Price/Willingness-to-Pay Test).",
      manfaat: "Menghindari kegagalan produk dengan menguji kesediaan membayar konsumen sebelum satu baris kode pun ditulis atau pabrik mulai berproduksi."
    },
    layout: {
      tipe: "Papan Matriks Eksperimen Validasi Nilai",
      elemen: ["Hipotesis yang Diuji", "Jenis Eksperimen (Wawancara, Smoke Test, Fake Door, Prototype)", "Kriteria Bukti / Kuantitas", "Target Metrik / Ambang Kelulusan", "Keputusan: Validated vs Invalidated"],
      visualType: 'experiment-matrix'
    },
    draft: [
      { bagian: "Hipotesis Nilai yang Diuji", hint: "Rumuskan dengan tegas: 'Kami percaya bahwa [kelompok pembeli] mengalami masalah [X] dan bersedia membayar [Y] untuk solusi [Z]'." },
      { bagian: "Desain Eksperimen 'Fake Door'", hint: "Buat tombol 'Beli Sekarang' pada website mockup; ukur persentase pengunjung yang mengklik tombol tersebut sebelum produk fisik benar-benar ada." },
      { bagian: "Bukti Komitmen Uang (Skin in the Game)", hint: "Ukur komitmen nyata: pre-order uang muka Rp 50 ribu jauh lebih berharga daripada 1000 orang yang menjawab 'suka' di kuesioner gratis." },
      { bagian: "Keputusan Lanjut / Pivot", hint: "Jika hasil eksperimen di bawah ambang batas (misal klik < 5%), ubah penawaran proposisi nilai atau target segmen pasarnya." }
    ],
    tutorial: [
      { step: "Uji dari Asumsi Paling Murah ke Mahal", desc: "Mulai dari riset meja (gratis) -> wawancara pelanggan -> iklan uji landing page -> prototipe fungsional." },
      { step: "Hindari Pertanyaan Membujuk (Leading Questions)", desc: "Jangan tanyakan 'Apakah Anda suka ide saya?'; tanyakan 'Kapan terakhir kali Anda mengalami masalah ini dan berapa biaya yang Anda keluarkan untuk mengatasinya?'" },
      { step: "Dokumentasikan Bukti di Lembar Uji", desc: "Gunakan Test Card dan Learning Card untuk mencatat hasil eksperimen secara transparan kepada dewan komisaris." }
    ],
    actionPlan: [
      "Buat 1 halaman penawaran 'Landing Page Smoke Test' untuk menguji minat produk baru sebelum produksi massal.",
      "Alokasikan anggaran iklan digital Rp 300 ribu untuk mendatangkan 200 calon pembeli terarah.",
      "Evaluasi persentase calon pembeli yang menekan tombol pre-order WhatsApp."
    ]
  },
  "SCR Framework (Minto)": {
    teori: {
      deskripsi: "Struktur komunikasi eksekutif Barbara Minto (Prinsip Piramida): Situation (Situasi yang disepakati bersama), Complication (Komplikasi/Masalah pemicu), dan Resolution (Resolusi/Rekomendasi solusi Anda).",
      manfaat: "Menangkap perhatian direksi dan pimpinan sibuk dalam 30 detik pertama presentasi dengan narasi cerita yang logis, tajam, dan langsung ke inti solusi."
    },
    layout: {
      tipe: "Struktur Alur Presentasi Eksekutif SCR (Minto Pyramid)",
      elemen: ["1. Situation (Konteks Status Quo yang Tidak Diperdebatkan)", "2. Complication (Masalah Kritis / Kejadian Pemicu)", "3. Question (Pertanyaan Inti yang Muncul)", "4. Resolution (Jawaban / Rekomendasi Solusi Strategis Anda)"],
      visualType: 'pyramid-3tier'
    },
    draft: [
      { bagian: "1. Situation (Situasi Awal)", hint: "Mulai dengan fakta bisnis yang disetujui semua orang: 'Selama 3 tahun terakhir, bisnis kita berhasil tumbuh rata-rata 20% per tahun...'" },
      { bagian: "2. Complication (Komplikasi Masalah)", hint: "Hadirkan konflik: 'Namun, dalam kuartal terakhir, biaya logistik melonjak 45% dan 2 kompetitor baru memangkas harga jual...'" },
      { bagian: "3. The Core Question (Pertanyaan Kunci)", hint: "Pertanyaan logis di benak audiens: 'Bagaimana kita bisa melindungi margin laba tanpa kehilangan pangsa pasar pelanggan setia?'" },
      { bagian: "4. Resolution (Rekomendasi Aksi Anda)", hint: "Berikan jawaban tegas di depan: 'Kita harus mengotomasi alur fulfillment gudang dan meluncurkan program keanggotaan VIP bulan depan'." }
    ],
    tutorial: [
      { step: "Selalu Gunakan Prinsip Jawaban di Awal (BLUF)", desc: "Bottom Line Up Front: Sampaikan kesimpulan dan rekomendasi Anda di slide pertama, bukan di slide penutup." },
      { step: "Pastikan Situasi Bersifat Netral", desc: "Jangan masukkan opini kontroversial di tahap Situation; jadikan Situation sebagai jembatan kesepakatan awal dengan audiens." },
      { step: "Kelompokkan Argumen Pendukung Secara MECE", desc: "Dukung Resolusi dengan 3 pilar alasan yang Mutually Exclusive & Collectively Exhaustive (saling lepas dan tuntas menyeluruh)." }
    ],
    actionPlan: [
      "Susun ulang slide pembuka presentasi manajemen Anda menggunakan format teks SCR 1 halaman.",
      "Pastikan durasi penyampaian Situation dan Complication tidak melebihi 2 menit pertama rapat.",
      "Dukung rekomendasi Resolution dengan perhitungan proyeksi penghematan biaya konkret."
    ]
  },
  "Crisis Communication (SCCT)": {
    teori: {
      deskripsi: "Situational Crisis Communication Theory (SCCT) Timothy Coombs: Panduan memilih strategi respon krisis (Deny, Diminish, Rebuild, Bolster) berdasarkan tingkat atribusi tanggung jawab publik terhadap krisis yang terjadi.",
      manfaat: "Melindungi reputasi brand dari kehancuran pasca-insiden fatal, meredam kemarahan publik di media sosial, dan mengembalikan kepercayaan pelanggan secara terhormat."
    },
    layout: {
      tipe: "Pohon Keputusan Respon Krisis Komunikasi SCCT",
      elemen: ["Tipe Klaster Krisis (Korban Bencana, Kecelakaan Tak Sengaja, atau Kesalahan Internal)", "Tingkat Tanggung Jawab yang Dituduhkan Publik", "Strategi Primer: Rebuild (Minta Maaf Penuh & Kompensasi) vs Diminish (Klarifikasi Konteks)", "Strategi Sekunder: Bolster (Pujian Reputasi Masa Lalu)"],
      visualType: 'decision-table'
    },
    draft: [
      { bagian: "Penilaian Tanggung Jawab Krisis", hint: "Apakah perusahaan murni korban fitnah (Victim), insiden kecelakaan sistem di luar kuasa (Accident), atau kelalaian fatal manajemen sendiri (Preventable)?" },
      { bagian: "Informasi Instruksional & Penyesuaian", hint: "Hal pertama yang WAJIB diumumkan: Bagaimana cara korban mengamankan diri, ke mana melapor, dan langkah apa yang diambil untuk menghentikan bahaya?" },
      { bagian: "Strategi Rebuild (Jika Bersalah Penuh)", hint: "Akui kesalahan secara tulus tanpa alasan pembenaran, minta maaf di depan publik, dan berikan ganti rugi materiil penuh kepada pihak yang dirugikan." },
      { bagian: "Kanal Komunikasi & Juru Bicara Tunggal", hint: "Tunjuk tepat 1 juru bicara resmi (CEO/PR Head); larang karyawan lain memberikan komentar spekulatif di media sosial." }
    ],
    tutorial: [
      { step: "Bicara Cepat dalam Waktu Emas (Golden Hour)", desc: "Keluarkan pernyataan pertama dalam 60 menit pertama sebelum rumor liar dan hoaks menguasai ruang opini publik." },
      { step: "Tunjukkan Empati Sebelum Fakta Hukum", desc: "Ungkapkan rasa duka dan kepedulian mendalam kepada korban terlebih dahulu sebelum menjelaskan kronologi teknis." },
      { step: "Jangan Pernah Berbohong atau Menutupi Bukti", desc: "Kebohongan yang terbongkar di kemudian hari akan menghancurkan reputasi perusahaan 10 kali lipat lebih parah dibanding krisis awalnya." }
    ],
    actionPlan: [
      "Susun buku pedoman Standar Operasional Tanggap Krisis Komunikasi (SOP PR Crisis).",
      "Siapkan draf template 'Pernyataan Pertama Menahan Isu' (Holding Statement) untuk skenario kebocoran data atau kecelakaan produk.",
      "Lakukan simulasi media interview krisis untuk juru bicara resmi perusahaan."
    ]
  },
  "Brand Archetypes": {
    teori: {
      deskripsi: "Model psikologi Carl Jung & Margaret Mark yang membagi kepribadian brand ke dalam 12 arketipe universal: Hero, Outlaw, Magician, Innocent, Explorer, Sage, Citizen/Everyman, Lover, Jester, Caregiver, Creator, Ruler.",
      manfaat: "Membangun identitas brand yang konsisten, berkarakter kuat, dan memiliki ikatan emosional mendalam dengan konsumen sehingga tidak mudah dilupakan."
    },
    layout: {
      tipe: "Roda 12 Arketipe Kepribadian Brand (Jungian Archetypes)",
      elemen: ["12 Arketipe Karakter (Hero, Outlaw, Magician, Sage, Explorer, Innocent, Creator, Ruler, Caregiver, Everyman, Lover, Jester)", "4 Motivasi Dasar (Kebebasan, Penguasaan, Hubungan Sosial, Stabilitas)"],
      visualType: 'wheel-12segment'
    },
    draft: [
      { bagian: "Arketipe Primer Brand Anda", hint: "Pilih 1 arketipe dominan yang mencerminkan jiwa brand: Apakah pembela yang berani (Hero seperti Nike), pemberontak aturan (Outlaw seperti Harley-Davidson), atau perawat hangat (Caregiver seperti Johnson & Johnson)?" },
      { bagian: "Arketipe Sekunder (Nuansa Tambahan)", hint: "Pilih 1 arketipe pelengkap (maksimal 30% porsi) untuk memberikan sentuhan keunikan kepribadian tanpa membingungkan audiens." },
      { bagian: "Tone of Voice & Gaya Bahasa", hint: "Bagaimana gaya tulisan di copywriting dan media sosial? (Hero = bersemangat & memotivasi; Sage = bijak & berbasis data; Jester = humoris & santai)." },
      { bagian: "Musuh Bersama Brand (The Nemesis)", hint: "Apa musuh yang dilawan bersama oleh brand dan pelanggan Anda? (Misal: Kebosanan, ketidakadilan birokrasi, rasa minder, pemborosan waktu)." }
    ],
    tutorial: [
      { step: "Pilih Arketipe Berdasarkan Jiwa Konsumen", desc: "Bukan tentang apa yang Anda sukai, tetapi cerminan kepribadian ideal yang ingin dirasakan pelanggan saat memakai produk Anda." },
      { step: "Jaga Konsistensi di Semua Titik Sentuh", desc: "Mulai dari seragam staf, desain packaging, balasan pesan CS, hingga gaya iklan wajib mencerminkan arketipe yang sama." },
      { step: "Hindari Kepribadian Ganda", desc: "Jangan mencoba menjadi 'Semua Hal untuk Semua Orang'; brand tanpa ketegasan arketipe akan menjadi brand hambar yang mudah dilupakan." }
    ],
    actionPlan: [
      "Pilih 1 arketipe utama dari 12 arketipe Jung yang paling sesuai dengan visi brand Anda.",
      "Susun pedoman gaya bahasa (Brand Voice Guidelines) 1 halaman untuk tim media sosial dan copywriter.",
      "Audit konten Instagram dan website untuk memastikan nada bicara sudah selaras dengan arketipe tersebut."
    ]
  },
  "PESO Model": {
    teori: {
      deskripsi: "Model strategi komunikasi pemasaran terintegrasi karya Gini Dietrich: Paid (Iklan berbayar), Earned (Liputan media massa & PR organik), Shared (Media sosial & interaksi komunitas), Owned (Website, blog, dan aset konten milik sendiri).",
      manfaat: "Mengintegrasikan seluruh kanal pemasaran digital dan kehumasan dalam satu strategi terpadu yang memaksimalkan jangkauan kredibilitas dan konversi penjualan."
    },
    layout: {
      tipe: "Diagram Venn 4 Pilar Komunikasi Terpadu PESO",
      elemen: ["Paid Media (Iklan Meta, Google Ads, Sponsor Influencer)", "Earned Media (Liputan Berita Media Massa, Wawancara Pers)", "Shared Media (Akun Media Sosial Resmi & Viralitas Netizen)", "Owned Media (Website Resmi, Buletin Email, Dokumen Whitepaper)", "Pusat Irisan: Authority & Trust"],
      visualType: 'venn-4circle'
    },
    draft: [
      { bagian: "Paid Media (Dorongan Berbayar)", hint: "Iklan berbayar untuk mempercepat jangkauan konten penting: Boosted post media sosial, Google Search Ads, advertorial portal berita ternama." },
      { bagian: "Earned Media (Kredibilitas Pihak Ketiga)", hint: "Liputan organik oleh jurnalis, ulasan produk jujur dari reviewer independen, rilis pers yang dikutip media nasional tanpa membayar." },
      { bagian: "Shared Media (Percakapan Komunitas)", hint: "Interaksi dua arah di Twitter/X, TikTok, LinkedIn, dan grup komunitas pengguna tempat konten Anda dibagikan secara sukarela." },
      { bagian: "Owned Media (Aset Milik Sendiri - FONDASI!)", hint: "Rumah digital yang sepenuhnya Anda kendalikan: Website toko online, artikel blog edukasi, podcast internal, dan daftar email pelanggan." }
    ],
    tutorial: [
      { step: "Mulai dari Membangun Owned Media", desc: "Jangan bangun istana di tanah sewaan; selalu arahkan trafik dari Paid, Earned, dan Shared ke Owned Media (website & email list Anda)." },
      { step: "Manfaatkan Earned Media untuk Kredibilitas", desc: "Iklan berbayar (Paid) mendatangkan pengunjung cepat, namun liputan media independen (Earned) adalah yang menumbuhkan rasa percaya." },
      { step: "Daur Ulang Konten Lintas Pilar", desc: "Ubah liputan berita PR (Earned) menjadi materi postingan media sosial (Shared) dan iklankan dengan targeted ads (Paid)." }
    ],
    actionPlan: [
      "Petakan seluruh anggaran pemasaran dan publikasi saat ini ke dalam 4 pilar PESO.",
      "Pastikan setiap kampanye iklan berbayar (Paid) diarahkan ke halaman website milik sendiri (Owned) yang memiliki form penangkap prospek.",
      "Kirimkan 1 siaran pers bernilai berita tinggi ke 10 jurnalis industri untuk memperkuat pilar Earned Media."
    ]
  },
  "Carroll’s CSR Pyramid": {
    teori: {
      deskripsi: "Piramida Tanggung Jawab Sosial Perusahaan Archie Carroll yang terdiri dari 4 lapisan hierarki: 1. Economic (Harus Untung - Fondasi), 2. Legal (Patuhi Hukum), 3. Ethical (Berlaku Adil & Etis), 4. Philanthropic (Menjadi Warga Korporat yang Baik).",
      manfaat: "Mencegah 'CSR-Washing' dengan mengingatkan bahwa perusahaan tidak bisa dianggap beretika jika rajin menyumbang donasi filantropi namun melanggar hukum perburuhan atau tidak membayar pajak."
    },
    layout: {
      tipe: "Piramida 4 Tingkat Tanggung Jawab Sosial Carroll",
      elemen: ["Puncak: 4. Philanthropic Responsibility (Dikehendaki Masyarakat - Donasi & Kontribusi Sosial)", "Tingkat 3: 3. Ethical Responsibility (Diharapkan Masyarakat - Bertindak Adil & Menjaga Moral)", "Tingkat 2: 2. Legal Responsibility (Diharuskan Hukum - Kepatuhan Regulasi & Pajak)", "Dasar Piramida: 1. Economic Responsibility (Mutlak Diperlukan - Wajib Profitabel & Berkelanjutan)"],
      visualType: 'pyramid-4tier'
    },
    draft: [
      { bagian: "1. Tanggung Jawab Ekonomi (Fondasi)", hint: "Perusahaan wajib menghasilkan laba yang sehat, efisien, dan memberi nilai ekonomi bagi pemegang saham. Tanpa laba, CSR tidak mungkin ada." },
      { bagian: "2. Tanggung Jawab Hukum (Legal)", hint: "Mematuhi seluruh hukum ketenagakerjaan, membayar upah minimum, menyetorkan pajak negara, dan mematuhi standar keselamatan lingkungan hidup." },
      { bagian: "3. Tanggung Jawab Etika (Ethical)", hint: "Berbuat adil melampaui aturan tertulis hukum: tidak mendiskriminasi staf, transparansi bahan baku, dan menjaga etika bisnis terhadap kompetitor." },
      { bagian: "4. Tanggung Jawab Filantropi (Philanthropic)", hint: "Kontribusi sukarela untuk meningkatkan kualitas hidup masyarakat sekitar: beasiswa pendidikan, donasi kesehatan, dan aksi pelestarian alam." }
    ],
    tutorial: [
      { step: "Kuatkan Fondasi Ekonomi Terlebih Dahulu", desc: "Perusahaan yang merugi tidak akan bisa mensejahterakan karyawannya; pastikan bisnis sehat secara operasional sebelum membagikan dividen sosial." },
      { step: "Jangan Lompat Langsung ke Filantropi", desc: "Masyarakat cerdas akan mengecam perusahaan yang giat berdonasi miliaran rupiah sementara gaji buruh pabriknya di bawah UMR." },
      { step: "Selaraskan Filantropi dengan Kompetensi Inti", desc: "Program CSR terbaik adalah yang memanfaatkan keahlian unik bisnis Anda (misal perusahaan IT memberikan pelatihan coding gratis bagi anak panti asuhan)." }
    ],
    actionPlan: [
      "Audit kepatuhan hukum (Legal Responsibility) seluruh izin operasional dan ketenagakerjaan perusahaan.",
      "Rumuskan kode etik perilaku bisnis tertulis yang mengikat seluruh level manajemen dan karyawan.",
      "Rancang program CSR berbasis kompetensi inti perusahaan yang memberikan dampak sosial jangka panjang."
    ]
  },
  "Issue Life Cycle": {
    teori: {
      deskripsi: "Siklus hidup perkembangan isu sosial/publik menjadi krisis melalui 4 fase: 1. Potential (Sinyal Awal), 2. Emerging (Mulai Membesar di Media Sosial), 3. Current / Crisis (Meledak Jadi Sorotan Utama), 4. Dormant / Regulatory (Mereda atau Berubah Menjadi Undang-Undang Baru).",
      manfaat: "Memungkinkan tim public affairs menyelesaikan isu sensitif saat masih berada di fase awal dengan biaya murah, sebelum isu meledak menjadi krisis nasional yang mematikan bisnis."
    },
    layout: {
      tipe: "Kurva 4 Fase Perkembangan Isu Menjadi Regulasi",
      elemen: ["1. Potential Issue (Muncul di Komunitas Kecil / Riset Akademis)", "2. Emerging Issue (Diliput Influencer & Forum Online)", "3. Current / Crisis Stage (Puncak Tekanan Media & Publik)", "4. Dormant / Resolution (Lahir Regulasi Resmi / Undang-Undang Baru)"],
      visualType: 'curve-4stage'
    },
    draft: [
      { bagian: "1. Fase Potensial (Potential)", hint: "Isu baru terdeteksi di forum diskusi akademis atau keluhan sporadis di kolom komentar. Sangat mudah diselesaikan dengan tindakan internal cepat." },
      { bagian: "2. Fase Berkembang (Emerging)", hint: "Kelompok LSM atau influencer mulai menyoroti isu tersebut. Manajemen harus segera membuka dialog proaktif sebelum menjadi viral." },
      { bagian: "3. Fase Puncak / Krisis (Current)", hint: "Isu menjadi headline berita nasional; politisi mulai berkomentar dan menyerukan boikot. Biaya manajemen krisis melambung sangat tinggi." },
      { bagian: "4. Fase Resolusi & Regulasi (Dormant)", hint: "Tekanan publik menghasilkan undang-undang atau peraturan menteri baru yang membatasi ruang gerak industri secara permanen." }
    ],
    tutorial: [
      { step: "Pasang Alat Pemantau Percakapan (Social Listening)", desc: "Pantau kata kunci nama brand dan isu industri di Twitter/X dan TikTok setiap hari untuk menangkap fase 1." },
      { step: "Selesaikan di Fase Emerging", desc: "Jauh lebih murah mengundang aktivis LSM untuk berdiskusi kopi di fase 2 daripada menyewa firma hukum mahal di fase 3." },
      { step: "Antisipasi Perubahan Regulasi", desc: "Pahami bahwa isu publik yang tidak ditangani industri secara mandiri pada akhirnya akan berujung pada intervensi undang-undang pemerintah." }
    ],
    actionPlan: [
      "Identifikasi 3 isu sosial/lingkungan di industri Anda yang saat ini sedang berada di fase 'Emerging'.",
      "Siapkan strategi mitigasi dini sebelum isu tersebut naik ke panggung politik atau media arus utama.",
      "Bangun hubungan komunikasi proaktif dengan asosiasi industri dan regulator terkait."
    ]
  },
  "Stakeholder Engagement": {
    teori: {
      deskripsi: "Kerangka keterlibatan pemangku kepentingan bertingkat karya AA1000SES: Inform (Satu Arah), Consult (Mendengarkan Masukan), Involve (Diskusi Interaktif), Collaborate (Bermitra Bersama), hingga Empower (Pemberdayaan Penuh).",
      manfaat: "Membangun 'Izin Sosial untuk Beroperasi' (Social License to Operate) dari warga dan komunitas sekitar, serta mencegah demonstrasi penolakan proyek investasi baru."
    },
    layout: {
      tipe: "Tangga 5 Tingkat Keterlibatan Stakeholder (AA1000)",
      elemen: ["1. Inform (Penyampaian Fakta Satu Arah)", "2. Consult (Jajak Pendapat & Dengar Aspirasi)", "3. Involve (Bekerja Sama Mengatasi Kekhawatiran)", "4. Collaborate (Kemitraan Pengambilan Keputusan)", "5. Empower (Wewenang Penuh di Tangan Komunitas)"],
      visualType: 'comparison-matrix'
    },
    draft: [
      { bagian: "Tingkat 1: Inform (Menginfokan)", hint: "Tujuan: Memberikan informasi yang objektif, jelas, dan transparan mengenai rencana proyek. Alat: Brosur, website, papan pengumuman desa." },
      { bagian: "Tingkat 2: Consult (Konsultasi Publik)", hint: "Tujuan: Mendapatkan umpan balik mengenai analisis dampak lingkungan. Alat: Forum dengar pendapat publik, kuesioner warga." },
      { bagian: "Tingkat 3 & 4: Involve & Collaborate", hint: "Tujuan: Bekerja sama secara langsung untuk merancang mitigasi debu/kebisingan dan bermitra dalam program rekrutmen warga lokal." },
      { bagian: "Tingkat 5: Empower (Pemberdayaan)", hint: "Tujuan: Menyerahkan wewenang pengelolaan dana CSR desa kepada komite warga independen terpilih." }
    ],
    tutorial: [
      { step: "Jangan Samakan Semua Stakeholder", desc: "Pilih tingkat keterlibatan yang tepat: warga terdampak langsung butuh Collaborate, sementara masyarakat umum cukup Inform." },
      { step: "Tutup Lingkaran Komunikasi (Closing the Loop)", desc: "Setelah mendengarkan masukan warga di sesi konsultasi, selalu umumkan kembali keputusan apa yang diubah berdasarkan aspirasi mereka." },
      { step: "Dokumentasikan Bukti Kesepakatan", desc: "Buat berita acara tertulis yang ditandatangani tokoh masyarakat untuk mencegah sengketa hukum di masa depan." }
    ],
    actionPlan: [
      "Petakan kelompok masyarakat di sekitar lokasi fasilitas operasional bisnis Anda.",
      "Adakan forum silaturahmi berkala dengan tokoh masyarakat setempat di level 'Consult' dan 'Involve'.",
      "Buka saluran pengaduan keluhan warga (Grievance Mechanism) yang direspon maksimal dalam 2x24 jam."
    ]
  },
  "Press Release Canvas": {
    teori: {
      deskripsi: "Kanvas struktur penulisan siaran pers jurnalistik standar baku: Piramida Terbalik (Headline Memikat, Dateline, Lead 5W+1H, Kutipan Eksekutif Berbobot, Body Data Pendukung, Boilerplate Perusahaan, Kontak Media).",
      manfaat: "Meningkatkan peluang siaran pers Anda dimuat oleh redaksi media massa ternama hingga 80% karena formatnya siap tayang dan ramah jurnalis."
    },
    layout: {
      tipe: "Struktur Siaran Pers Piramida Terbalik (Press Release Canvas)",
      elemen: ["Headline & Sub-headline Bernilai Berita", "Dateline Resmi (Kota, Tanggal)", "Lead Paragraph (5W + 1H Padat)", "Executive Quotes (Kutipan Direktur / Stakeholder)", "Body Paragraph (Data & Fakta Pendukung)", "Boilerplate (Profil 'Tentang Perusahaan')", "Media Relations Contact"],
      visualType: 'article-blueprint'
    },
    draft: [
      { bagian: "Headline yang Bernilai Berita (Newsworthy)", hint: "Tuliskan judul berita objektif yang menarik bagi pembaca umum, BUKAN slogan promosi jualan yang terkesan iklan komersial!" },
      { bagian: "Lead Paragraph (Paragraf Pertama)", hint: "Jawab dalam 2 kalimat: Siapa, Melakukan apa, Kapan, Di mana, Mengapa, dan Bagaimana dampaknya bagi masyarakat?" },
      { bagian: "Kutipan Eksekutif (Quotes)", hint: "Kutipan dari CEO yang bernada inspiratif dan berwawasan industri (Hindari kutipan hambar seperti 'Kami sangat senang meluncurkan ini...')." },
      { bagian: "Boilerplate & Kontak Media", hint: "Paragraf ringkas 'Tentang Perusahaan Anda' disertai nama jelas, nomor WhatsApp aktif, dan email tim PR untuk wawancara lanjutan." }
    ],
    tutorial: [
      { step: "Gunakan Pola Piramida Terbalik", desc: "Informasi paling krusial wajib berada di bagian atas, sehingga jika editor media memotong paragraf bawah karena keterbatasan ruang, berita tetap utuh." },
      { step: "Sertakan Aset Foto Resolusi Tinggi", desc: "Lampirkan link Google Drive berisi foto dokumentasi landscape berkualitas tinggi dengan caption nama orang yang ada di foto." },
      { step: "Kirimkan di Pagi Hari Kerja", desc: "Waktu terbaik mengirimkan siaran pers ke meja redaksi jurnalis adalah hari Selasa atau Rabu pukul 08.30 - 10.00 pagi." }
    ],
    actionPlan: [
      "Susun draf siaran pers peluncuran produk atau pencapaian bisnis terbaru menggunakan kanvas ini.",
      "Pastikan lead paragraph sudah menjawab seluruh unsur 5W+1H dalam 35 kata pertama.",
      "Kirimkan rilis pers beserta foto resolusi tinggi ke daftar media jurnalis terpercaya."
    ]
  }
};
