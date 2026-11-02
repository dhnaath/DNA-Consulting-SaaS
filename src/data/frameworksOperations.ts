import { FrameworkContent } from "@/frameworkData";

export const operationsAndFinanceFrameworks: Record<string, FrameworkContent> = {
  "Six Sigma (DMAIC)": {
    teori: {
      deskripsi: "Metodologi berbasis data untuk menghilangkan cacat (defects) dan variasi proses operasional melalui 5 fase: Define, Measure, Analyze, Improve, Control.",
      manfaat: "Meningkatkan efisiensi proses hingga 99.99966% bebas cacat, menekan pemborosan (waste), dan meningkatkan kepuasan pelanggan."
    },
    layout: {
      tipe: "DMAIC Sequential 5-Stage Funnel",
      elemen: ["1. Define (Definisikan Masalah)", "2. Measure (Ukur Baseline Data)", "3. Analyze (Analisis Akar Masalah)", "4. Improve (Optimasi Solusi)", "5. Control (Standarisasi & Kontrol)"],
      visualType: 'stepper-linear'
    },
    draft: [
      { bagian: "Define", hint: "Apa problem operasional utama, siapa customer yang terdampak, dan apa target spesifiknya?" },
      { bagian: "Measure", hint: "Metrik apa yang diukur sekarang? Berapa defect rate saat ini dan apa baseline datanya?" },
      { bagian: "Analyze", hint: "Gunakan 5-Whys atau Fishbone. Apa akar penyebab variasi atau inefisiensi terbesar?" },
      { bagian: "Improve", hint: "Solusi apa yang diuji coba? Bagaimana hasil perbandingan sebelum vs sesudah pilot?" },
      { bagian: "Control", hint: "SOP apa yang dibuat agar perbaikan bertahan lama? Siapa monitoring champion-nya?" }
    ],
    tutorial: [
      { step: "Buat Project Charter", desc: "Tentukan masalah, ruang lingkup, KPI keberhasilan, dan tim inti proyek perbaikan." },
      { step: "Kumpulkan Data Lapangan", desc: "Ukur performa aktual minimal selama 2-4 minggu untuk mendapatkan baseline yang valid." },
      { step: "Uji Akar Masalah & Standarisasi", desc: "Identifikasi root cause utama, luncurkan perbaikan, dan kunci dengan SOP serta kontrol visual." }
    ],
    actionPlan: [
      "Petakan 1 proses operasional yang paling sering menghasilkan komplain atau revisi.",
      "Kumpulkan data waktu pengerjaan (lead time) dan tingkat cacat harian selama 7 hari.",
      "Jalankan sesi Root Cause Analysis (RCA) bersama tim lapangan minggu ini."
    ]
  },
  "SIPOC Diagram": {
    teori: {
      deskripsi: "Alat visual level makro untuk memetakan alur Supplier, Input, Process, Output, Customer sebelum memulai perbaikan proses detail.",
      manfaat: "Membantu seluruh stakeholder menyepakati batasan proses, ekspektasi kualitas input, dan standar output yang diinginkan konsumen."
    },
    layout: {
      tipe: "SIPOC 5-Column High-Level Table",
      elemen: ["Suppliers (Pemasok)", "Inputs (Masukan)", "Process (Proses Inti)", "Outputs (Hasil)", "Customers (Penerima)"],
      visualType: 'table-5col'
    },
    draft: [
      { bagian: "Suppliers", hint: "Siapa pihak yang menyediakan bahan baku, data, izin, atau layanan awal?" },
      { bagian: "Inputs", hint: "Apa saja dokumen, material mentah, spesifikasi, atau data yang dimasukkan ke proses?" },
      { bagian: "Process", hint: "Tuliskan 4 hingga 7 langkah proses utama level tinggi (gunakan kata kerja)." },
      { bagian: "Outputs", hint: "Apa produk akhir, laporan, layanan terkirim, atau deliverables yang dihasilkan?" },
      { bagian: "Customers", hint: "Siapa konsumen akhir, user internal, atau pihak berikutnya yang menerima output?" }
    ],
    tutorial: [
      { step: "Tentukan Batas Awal & Akhir", desc: "Sepakati di mana proses resmi dimulai (start trigger) dan di mana proses berakhir." },
      { step: "Petakan Output & Customer Dulu", desc: "Praktik terbaik SIPOC adalah mendefinisikan Output dan Customer terlebih dahulu, baru mundur ke Input & Supplier." },
      { step: "Validasi Langkah Inti Proses", desc: "Pastikan tahapan proses inti ringkas (maksimal 7 langkah) agar tetap berada di level makro." }
    ],
    actionPlan: [
      "Buat diagram SIPOC untuk alur fulfillment / delivery order produk utama.",
      "Identifikasi 1 input dari supplier yang paling sering terlambat atau tidak sesuai spesifikasi.",
      "Wawancarai customer internal untuk memverifikasi apakah output memenuhi ekspektasi mereka."
    ]
  },
  "RACI Matrix": {
    teori: {
      deskripsi: "Matriks pembagian peran dan akuntabilitas proyek: Responsible (Pelaksana), Accountable (Penanggung Jawab Mutlak), Consulted (Konsultan), Informed (Penerima Info).",
      manfaat: "Menghilangkan kebingungan wewenang, mencegah lempar tanggung jawab, dan memastikan hanya ada 1 penanggung jawab mutlak per tugas."
    },
    layout: {
      tipe: "Matriks Tanggung Jawab RACI",
      elemen: ["Responsible (R - Siapa mengerjakan)", "Accountable (A - Siapa penanggung jawab)", "Consulted (C - Siapa diajak diskusi)", "Informed (I - Siapa diinfokan)"],
      visualType: 'raci-matrix'
    },
    draft: [
      { bagian: "Responsible (R)", hint: "Siapa orang yang benar-benar mengerjakan dan menyelesaikan tugas teknis ini?" },
      { bagian: "Accountable (A)", hint: "Siapa 1 orang yang memiliki wewenang keputusan akhir dan bertanggung jawab jika gagal? (Hanya 1 A per baris!)" },
      { bagian: "Consulted (C)", hint: "Pakar/spesialis mana yang wajib dimintai masukan sebelum keputusan diambil?" },
      { bagian: "Informed (I)", hint: "Siapa stakeholder yang cukup diberikan laporan update status setelah keputusan selesai?" }
    ],
    tutorial: [
      { step: "Daftar Aktivitas Utama", desc: "Tuliskan milestone atau tugas kritis dalam proyek pada baris vertikal." },
      { step: "Tentukan Peran Kolom", desc: "Tuliskan nama peran/posisi (bukan nama orang) pada kolom horizontal." },
      { step: "Terapkan Golden Rule", desc: "Setiap baris tugas WAJIB memiliki tepat 1 'A'. Terlalu banyak 'A' = konflik, tanpa 'A' = proyek terlantar." }
    ],
    actionPlan: [
      "Terapkan matriks RACI pada proyek peluncuran produk atau kampanye kuartal ini.",
      "Pastikan setiap tugas kritis hanya memiliki satu orang yang bertindak sebagai 'Accountable'.",
      "Kirimkan ringkasan matriks kepada seluruh tim yang terlibat agar tidak ada keraguan peran."
    ]
  },
  "Gantt Chart": {
    teori: {
      deskripsi: "Representasi visual jadwal proyek berbentuk diagram batang horizontal yang menunjukkan urutan, durasi, ketergantungan (dependencies), dan milestone aktivitas.",
      manfaat: "Memudahkan pemantauan progres jadwal, identifikasi jalur kritis (critical path), dan alokasi kapasitas sumber daya secara terukur."
    },
    layout: {
      tipe: "Timeline Gantt Chart & Milestone",
      elemen: ["Task Name (Nama Tugas)", "Start Date (Mulai)", "End Date (Selesai)", "Dependencies (Keterkaitan)", "Progress % (Pencapaian)"],
      visualType: 'gantt-chart'
    },
    draft: [
      { bagian: "Task Breakdown (WBS)", hint: "Pecah proyek besar menjadi paket kerja mingguan/harian yang terdefinisi jelas." },
      { bagian: "Durasi & Timeline", hint: "Berapa lama estimasi realistis tiap tugas dan tanggal target penyelesaian?" },
      { bagian: "Dependencies", hint: "Tugas mana yang harus selesai 100% sebelum tugas berikutnya bisa dimulai?" },
      { bagian: "Milestones", hint: "Titik evaluasi penting apa yang menjadi penanda keberhasilan fase proyek?" }
    ],
    tutorial: [
      { step: "Identifikasi Work Breakdown", desc: "Pecah tujuan proyek menjadi fase, deliverable, dan task granular." },
      { step: "Hubungkan Ketergantungan", desc: "Petakan hubungan finish-to-start untuk menemukan critical path yang tidak boleh terlambat." },
      { step: "Review Rutin Mingguan", desc: "Perbarui persentase progres dan geser alokasi jika terjadi bottleneck." }
    ],
    actionPlan: [
      "Buat jadwal Gantt untuk inisiatif bisnis 3 bulan ke depan.",
      "Tandai tugas yang berada di Critical Path (tugas yang jika terlambat akan memundurkan seluruh proyek).",
      "Jadwalkan rapat evaluasi standup mingguan untuk memperbarui persentase penyelesaian."
    ]
  },
  "Balanced Scorecard (BSC)": {
    teori: {
      deskripsi: "Sistem manajemen strategis yang mengukur performa organisasi dari 4 perspektif seimbang: Financial, Customer, Internal Business Processes, dan Learning & Growth.",
      manfaat: "Mencegah perusahaan hanya berfokus pada laba jangka pendek, dengan membangun kapasitas jangka panjang dan keunggulan proses internal."
    },
    layout: {
      tipe: "BSC 4-Perspective Balanced Matrix",
      elemen: ["1. Financial (Keuangan)", "2. Customer (Pelanggan)", "3. Internal Process (Proses Internal)", "4. Learning & Growth (SDM & Budaya)"],
      visualType: 'bsc-matrix'
    },
    draft: [
      { bagian: "Financial Perspective", hint: "Apa tujuan finansial pemegang saham? (Misal: Pertumbuhan omzet 25%, margin laba bersih 18%)" },
      { bagian: "Customer Perspective", hint: "Bagaimana kita ingin dipandang pelanggan? (Misal: CSAT 90%, NPS > 60, retensi 80%)" },
      { bagian: "Internal Processes", hint: "Proses operasional apa yang harus unggul? (Misal: Waktu produksi -30%, defect rate < 1%)" },
      { bagian: "Learning & Growth", hint: "Keahlian, teknologi, dan budaya apa yang harus dibangun? (Misal: Pelatihan digital, adopsi CRM)" }
    ],
    tutorial: [
      { step: "Petakan Hubungan Sebab-Akibat", desc: "Pahami bahwa SDM yang kompeten (Learning) menghasilkan Proses Unggul, yang memuaskan Pelanggan, lalu menciptakan Kinerja Finansial." },
      { step: "Tetapkan KPI & Target", desc: "Tentukan 1-2 indikator kuantitatif terukur untuk masing-masing dari 4 perspektif." },
      { step: "Rumuskan Inisiatif Strategis", desc: "Buat program aksi nyata yang didanai untuk mencapai target KPI tersebut." }
    ],
    actionPlan: [
      "Pilih 2 metrik kunci untuk masing-masing dari 4 perspektif Balanced Scorecard.",
      "Verifikasi apakah target finansial didukung oleh inisiatif peningkatan SDM yang memadai.",
      "Gunakan matriks ini sebagai agenda utama rapat tinjauan manajemen triwulanan."
    ]
  },
  "OKR Framework": {
    teori: {
      deskripsi: "Kerangka penetapan sasaran terukur: Objective (Tujuan ambisius & kualitatif) dan Key Results (2-4 tolok ukur kuantitatif penentu keberhasilan).",
      manfaat: "Menyelaraskan fokus seluruh tim, meningkatkan transparansi target, dan mendorong inovasi melalui sasaran peregangan (stretch goals)."
    },
    layout: {
      tipe: "Pohon Sasaran OKR (Objectives & Key Results)",
      elemen: ["Objective (Sasaran Utama)", "Key Result 1 (Metrik Kunci)", "Key Result 2 (Metrik Kunci)", "Key Result 3 (Metrik Kunci)", "Initiatives (Aksi Nyata)"],
      visualType: 'okr-tree'
    },
    draft: [
      { bagian: "Objective", hint: "Tuliskan tujuan yang inspiratif, berorientasi dampak, dan memotivasi tim (Kualitatif, tanpa angka)." },
      { bagian: "Key Result 1", hint: "Tingkatkan [metrik] dari [baseline X] menjadi [target Y] (Wajib kuantitatif)." },
      { bagian: "Key Result 2", hint: "Turunkan [metrik biaya/waktu] dari [A] menjadi [B]." },
      { bagian: "Key Result 3", hint: "Capai pencapaian [deliverable terukur dengan persentase/skor]." },
      { bagian: "Initiatives", hint: "Proyek atau eksperimen apa yang akan dikerjakan tim untuk menggerakkan angka KR tersebut?" }
    ],
    tutorial: [
      { step: "Buat Objective yang Menggugah", desc: "Fokus pada 'Apa yang ingin dicapai' dalam 1 kuartal ke depan." },
      { step: "Rancang Key Results Berbasis Hasil", desc: "Pastikan KR mengukur 'dampak bisnis' (outcome), BUKAN sekadar daftar tugas (output)." },
      { step: "Check-in Rutin Mingguan", desc: "Update skor KR (skala 0.0 - 1.0) setiap minggu untuk mengecek kesehatan progres." }
    ],
    actionPlan: [
      "Rumuskan 1 Objective perusahaan dan 3 Key Results terukur untuk kuartal ini.",
      "Minta setiap departemen menyusun OKR yang selaras (aligned) dengan OKR utama.",
      "Lakukan ritual weekly check-in 15 menit setiap hari Senin."
    ]
  },
  "Analisis Rasio Keuangan": {
    teori: {
      deskripsi: "Evaluasi kesehatan finansial bisnis melalui 4 klaster rasio: Likuiditas, Solvabilitas/Leverage, Aktivitas/Efisiensi, dan Profitabilitas.",
      manfaat: "Mendeteksi risiko kebangkrutan sedini mungkin, mengukur efisiensi perputaran modal kerja, dan menjadi rujukan utama bagi investor/bankir."
    },
    layout: {
      tipe: "Dashboard 4 Klaster Rasio Finansial",
      elemen: ["Rasio Likuiditas (Current / Quick)", "Rasio Solvabilitas (DER / DAR)", "Rasio Aktivitas (Inventory / Asset Turnover)", "Rasio Profitabilitas (GPM / NPM / ROE)"],
      visualType: 'dashboard-widgets'
    },
    draft: [
      { bagian: "Rasio Likuiditas", hint: "Current Ratio = Aset Lancar / Liabilitas Lancar (Ideal > 1.5 - 2.0x agar aman membayar kewajiban jangka pendek)." },
      { bagian: "Rasio Solvabilitas", hint: "Debt to Equity Ratio (DER) = Total Utang / Ekuitas (Apakah bisnis terlalu terbebani bunga pinjaman?)." },
      { bagian: "Rasio Aktivitas", hint: "Perputaran Persediaan = HPP / Rata-rata Stok (Berapa kali stok berputar dalam setahun? Apakah ada barang mati?)." },
      { bagian: "Rasio Profitabilitas", hint: "Net Profit Margin = Laba Bersih / Omzet x 100%. Return on Equity (ROE) = Laba Bersih / Modal Sendiri." }
    ],
    tutorial: [
      { step: "Siapkan Neraca & Laba Rugi", desc: "Gunakan laporan keuangan auditan atau data pembukuan resmi 2 periode terakhir." },
      { step: "Hitung Angka Rasio Kunci", desc: "Kalkulasikan Current Ratio, DER, ITO, dan NPM menggunakan rumus standar." },
      { step: "Bandingkan dengan Benchmark Industri", desc: "Rasio hanya bermakna jika dibandingkan dengan rata-rata industri sejenis atau tren historis." }
    ],
    actionPlan: [
      "Hitung Current Ratio dan Quick Ratio bisnis Anda saat ini.",
      "Analisis perputaran piutang (Days Sales Outstanding) untuk mempercepat arus kas masuk.",
      "Bandingkan Net Profit Margin produk Anda dengan standar rata-rata industri."
    ]
  },
  "Capital Budgeting (ROI, NPV, IRR)": {
    teori: {
      deskripsi: "Metode evaluasi kelayakan investasi modal jangka panjang menggunakan Return on Investment (ROI), Net Present Value (NPV), Internal Rate of Return (IRR), dan Payback Period.",
      manfaat: "Memastikan modal diinvestasikan pada proyek yang memberikan nilai tambah riil di atas biaya modal (Cost of Capital/WACC)."
    },
    layout: {
      tipe: "Kalkulator Kelayakan Investasi Finansial",
      elemen: ["Initial Outlay (Modal Awal)", "Cash Flow Tahunan (Arus Kas)", "Discount Rate (WACC %)", "NPV & IRR Score", "Payback Period"],
      visualType: 'calculator-form'
    },
    draft: [
      { bagian: "Initial Investment", hint: "Berapa total belanja modal (Capex) yang dibutuhkan di tahun ke-0 untuk memulai proyek?" },
      { bagian: "Proyeksi Arus Kas Bersih", hint: "Estimasi arus kas masuk operasional bersih per tahun selama umur ekonomis proyek." },
      { bagian: "Discount Rate (WACC)", hint: "Berapa suku bunga acuan atau ekspektasi return minimum yang disyaratkan pemodal/bank?" },
      { bagian: "Kriteria Keputusan", hint: "Proyek diterima jika: NPV > 0, IRR > WACC, dan Payback Period lebih cepat dari batas toleransi." }
    ],
    tutorial: [
      { step: "Hitung Arus Kas Inkremental", desc: "Hanya masukkan kas riil tambahan yang dihasilkan langsung oleh proyek investasi." },
      { step: "Diskontokan Arus Kas Masa Depan", desc: "Gunakan rumus Net Present Value untuk memperhitungkan penurunan nilai uang terhadap waktu." },
      { step: "Uji Sensitivitas Skenario", desc: "Uji apakah NPV tetap positif jika penjualan turun 20% atau biaya operasional naik 15%." }
    ],
    actionPlan: [
      "Hitung perkiraan Payback Period untuk pembelian mesin/cabang baru yang direncanakan.",
      "Hitung NPV investasi dengan menggunakan tingkat diskonto konservatif (misal 12-14%).",
      "Bandingkan opsi investasi A vs B berdasarkan nilai NPV tertinggi."
    ]
  },
  "Break-Even Analysis (BEP)": {
    teori: {
      deskripsi: "Analisis titik impas di mana total pendapatan sama persis dengan total biaya (biaya tetap + biaya variabel), sehingga laba sama dengan nol.",
      manfaat: "Menentukan volume penjualan minimum agar bisnis tidak merugi dan menghitung batas aman penurunan omzet (Margin of Safety)."
    },
    layout: {
      tipe: "Grafik & Formula Titik Impas (BEP)",
      elemen: ["Fixed Costs (Biaya Tetap)", "Variable Cost per Unit (Biaya Variabel)", "Selling Price per Unit (Harga Jual)", "BEP Unit = FC / (P - VC)", "BEP Rupiah = FC / CMR"],
      visualType: 'bep-chart'
    },
    draft: [
      { bagian: "Biaya Tetap (Fixed Costs)", hint: "Total biaya yang tetap harus dibayar meski produksi 0: Sewa tempat, gaji tetap, internet, penyusutan." },
      { bagian: "Biaya Variabel per Unit", hint: "Biaya yang bertambah seiring jumlah produksi: Bahan baku, komisi per unit, ongkir, kemasan." },
      { bagian: "Harga Jual per Unit", hint: "Berapa harga jual rata-rata per satuan produk/jasa ke pelanggan?" },
      { bagian: "Margin Kontribusi per Unit", hint: "Harga Jual dikurangi Biaya Variabel per unit. Berapa kontribusi tiap unit untuk menutup Biaya Tetap?" }
    ],
    tutorial: [
      { step: "Pisahkan Biaya Tetap & Variabel", desc: "Kategorikan seluruh pos pengeluaran bulanan bisnis Anda secara tegas." },
      { step: "Hitung Rasio Margin Kontribusi", desc: "CMR = (Harga - Biaya Variabel) / Harga. Semakin tinggi persentase ini, semakin cepat titik impas tercapai." },
      { step: "Hitung Target Unit & Omzet", desc: "Bagi Total Biaya Tetap dengan Margin Kontribusi untuk mendapatkan angka BEP." }
    ],
    actionPlan: [
      "Kalkulasikan total biaya tetap bulanan operasional bisnis Anda hari ini.",
      "Hitung berapa porsi unit produk yang harus terjual setiap hari untuk mencapai BEP.",
      "Tetapkan target omzet bulanan minimal 1.5x dari angka BEP Rupiah untuk mengamankan laba."
    ]
  },
  "Cost-Benefit Analysis (CBA)": {
    teori: {
      deskripsi: "Pendekatan kuantitatif untuk membandingkan total manfaat moneter dan non-moneter yang diharapkan dari suatu keputusan dengan total biaya yang dikeluarkan.",
      manfaat: "Memberikan justifikasi objektif untuk memilih inisiatif strategis dengan rasio Benefit-Cost (BCR > 1.0) tertinggi."
    },
    layout: {
      tipe: "Tabel Perbandingan Biaya vs Manfaat",
      elemen: ["Direct & Indirect Costs (Biaya)", "Tangible & Intangible Benefits (Manfaat)", "Net Benefit = Total Manfaat - Total Biaya", "Benefit-Cost Ratio (BCR)"],
      visualType: 'cba-table'
    },
    draft: [
      { bagian: "Total Biaya (Costs)", hint: "Identifikasi biaya modal awal, biaya operasional tahunan, biaya pelatihan, dan risiko potensial." },
      { bagian: "Total Manfaat (Benefits)", hint: "Hitung penghematan biaya, tambahan omzet, efisiensi waktu staf, dan peningkatan reputasi brand." },
      { bagian: "Net Benefit (Selisih Bersih)", hint: "Apakah Manfaat Bersih bernilai positif signifikan jika dihitung dalam horizon 3 tahun?" },
      { bagian: "Faktor Non-Kuantitatif", hint: "Catat dampak sosial, kepuasan karyawan, dan kepatuhan regulasi yang sulit dinilai dengan uang." }
    ],
    tutorial: [
      { step: "Daftar Semua Konsekuensi Proyek", desc: "Tuliskan seluruh biaya yang mungkin timbul dan manfaat yang bisa dirasakan." },
      { step: "Monetisasi Manfaat Non-Kas", desc: "Ubah penghematan jam kerja staf menjadi nilai rupiah dengan mengalikannya pada upah per jam." },
      { step: "Kalkulasi Rasio BCR", desc: "Bagi Total Manfaat Sekarang dengan Total Biaya Sekarang. Proyek layak jika rasio > 1." }
    ],
    actionPlan: [
      "Lakukan analisis CBA sebelum menyetujui pengadaan software atau mesin baru.",
      "Kuantifikasi waktu kerja manual yang bisa dihemat tim per bulan jika inovasi diterapkan.",
      "Pilih proyek yang memiliki rasio BCR tertinggi dari beberapa opsi yang diajukan."
    ]
  },
  "Business Case Analysis": {
    teori: {
      deskripsi: "Dokumen komprehensif yang menjabarkan justifikasi bisnis, keselarasan strategis, analisis risiko, dan kalkulasi finansial untuk sebuah inisiatif besar.",
      manfaat: "Mendapatkan persetujuan dewan direksi/investor melalui narasi logis yang kuat dan rencana mitigasi risiko yang matang."
    },
    layout: {
      tipe: "Struktur Dokumen Business Case 5 Bagian",
      elemen: ["Executive Summary", "Strategic Context & Problem", "Options Appraisal (Opsi Pilihan)", "Commercial & Financial Model", "Management & Delivery Plan"],
      visualType: 'multi-tab-doc'
    },
    draft: [
      { bagian: "Strategic Context", hint: "Mengapa inisiatif ini penting sekarang? Masalah apa yang dipecahkan dan apa resikonya jika 'Do Nothing'?" },
      { bagian: "Pilihan Solusi (Options)", hint: "Tawarkan minimal 3 opsi: Opsi 1 (Status Quo), Opsi 2 (Solusi Minimum), Opsi 3 (Solusi Komprehensif)." },
      { bagian: "Model Keuangan", hint: "Berapa anggaran yang diminta, proyeksi ROI, dan kapan arus kas positif tercapai?" },
      { bagian: "Rencana Manajemen", hint: "Siapa tim pelaksana, apa milestone 90 hari pertama, dan bagaimana mitigasi risiko terbesarnya?" }
    ],
    tutorial: [
      { step: "Mulai dari Masalah Bisnis Nyata", desc: "Tunjukkan bukti data tentang kerugian saat ini atau peluang pasar yang sedang hilang." },
      { step: "Bandingkan Berbagai Opsi", desc: "Tunjukkan bahwa Anda telah mengevaluasi beberapa alternatif sebelum merekomendasikan opsi terbaik." },
      { step: "Tulis Ringkasan Eksekutif 1 Halaman", desc: "Buat ringkasan padat yang menjawab: Kenapa harus sekarang, butuh berapa dana, dan apa hasilnya." }
    ],
    actionPlan: [
      "Tuliskan satu halaman Executive Summary untuk inisiatif ekspansi bisnis terbaru.",
      "Uraikan skenario 'Do Nothing' untuk menggambarkan potensi kerugian jika tidak ada tindakan.",
      "Presentasikan proposal ke pengambil keputusan dengan fokus pada mitigasi risiko."
    ]
  }
};
