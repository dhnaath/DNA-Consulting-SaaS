import { FrameworkContent } from "@/frameworkData";

export const decisionAndProductFrameworks: Record<string, FrameworkContent> = {
  "Decision Tree Analysis": {
    teori: {
      deskripsi: "Model visual grafis berbentuk pohon percabangan untuk memetakan alternatif keputusan, probabilitas ketidakpastian, dan Expected Monetary Value (EMV).",
      manfaat: "Membantu mengambil keputusan berisiko tinggi secara matematis objektif dengan mengalikan probabilitas kejadian dengan potensi hasil finansial."
    },
    layout: {
      tipe: "Diagram Pohon Keputusan Probabilistik",
      elemen: ["Decision Node (Titik Keputusan)", "Chance Node (Titik Peluang/Risiko)", "Probabilitas %", "Payoff Nilai Finansial", "Expected Monetary Value (EMV)"],
      visualType: 'decision-tree'
    },
    draft: [
      { bagian: "Titik Keputusan Awal", hint: "Pilihan strategis apa yang sedang dipertimbangkan? (Misal: Opsi A: Bangun Pabrik Sendiri vs Opsi B: Maklon Outsourcing)." },
      { bagian: "Skenario Peluang & Risiko", hint: "Kondisi pasar apa yang mungkin terjadi di masa depan? (Misal: Permintaan Tinggi 60%, Permintaan Rendah 40%)." },
      { bagian: "Hasil Finansial (Payoff)", hint: "Berapa estimasi laba atau rugi bersih untuk tiap kombinasi pilihan dan skenario pasar?" },
      { bagian: "Perhitungan EMV", hint: "Kalikan probabilitas dengan payoff: EMV = (P1 x Payoff1) + (P2 x Payoff2). Pilih opsi dengan EMV tertinggi." }
    ],
    tutorial: [
      { step: "Gambarkan Cabang dari Kiri ke Kanan", desc: "Mulai dari kotak keputusan, lalu tarik cabang kemungkinan kejadian (lingkaran peluang)." },
      { step: "Tentukan Probabilitas yang Masuk Akal", desc: "Pastikan total probabilitas dari setiap titik peluang berjumlah tepat 100% (1.0)." },
      { step: "Hitung Mundur (Rollback Method)", desc: "Kalkulasikan nilai EMV dari ujung kanan kembali ke titik awal untuk menemukan jalur keputusan terbaik." }
    ],
    actionPlan: [
      "Petakan 2 opsi investasi besar yang sedang membingungkan manajemen ke dalam pohon keputusan.",
      "Gali data historis atau riset pasar untuk menetapkan angka probabilitas skenario terbaik dan terburuk.",
      "Pilih alternatif yang menghasilkan Expected Monetary Value tertinggi dengan risiko terkelola."
    ]
  },
  "Decision Matrix (Pugh)": {
    teori: {
      deskripsi: "Matriks Pugh untuk membandingkan beberapa konsep/ide desain terhadap kriteria terbobot relatif terhadap satu solusi acuan (Baseline).",
      manfaat: "Menghindari bias personal atau debat opini tak berujung dalam memilih alternatif konsep terbaik dengan sistem skoring kriteria terstandarisasi."
    },
    layout: {
      tipe: "Matriks Skoring Multikriteria Pugh",
      elemen: ["Evaluation Criteria (Kriteria Evaluasi)", "Weight / Bobot (1-5)", "Baseline Option (0)", "Alternative A (+ / - / S)", "Alternative B (+ / - / S)", "Total Weighted Score"],
      visualType: 'scoring-table'
    },
    draft: [
      { bagian: "Kriteria Evaluasi & Bobot", hint: "Tentukan 5-8 kriteria penting (Misal: Biaya produksi, kemudahan pakai, keawetan, kecepatan). Beri bobot kepentingan 1-5." },
      { bagian: "Baseline (Solusi Saat Ini)", hint: "Tetapkan satu produk/solusi eksisting sebagai standar acuan (diberi nilai netral / skor 0)." },
      { bagian: "Skoring Alternatif", hint: "Bandingkan alternatif baru terhadap baseline: Lebih Baik (+1), Sama (0), Lebih Buruk (-1)." },
      { bagian: "Sintesis & Peningkatan Konsep", hint: "Kombinasikan keunggulan konsep A dan konsep B untuk menciptakan konsep hibrida yang jauh lebih unggul." }
    ],
    tutorial: [
      { step: "Sepakati Kriteria Bersama Tim", desc: "Pastikan seluruh stakeholder kunci menyetujui kriteria dan bobot sebelum memberi nilai." },
      { step: "Bandingkan Secara Berpasangan", desc: "Fokus pada perbandingan objektif relatif terhadap baseline, bukan penilaian absolut." },
      { step: "Lakukan Iterasi Desain", desc: "Gunakan kelemahan yang terungkap dalam matriks untuk menyempurnakan konsep pemenang." }
    ],
    actionPlan: [
      "Buat matriks Pugh untuk memilih vendor software atau penyedia layanan logistik baru.",
      "Tetapkan solusi saat ini sebagai Baseline dengan skor dasar 0.",
      "Pilih alternatif dengan skor tertimbang tertinggi dan diskusikan hasil bersama tim."
    ]
  },
  "Pareto Analysis (80/20)": {
    teori: {
      deskripsi: "Prinsip Pareto yang menyatakan bahwa 80% hasil (atau masalah) berasal dari 20% penyebab penting (the vital few vs the trivial many).",
      manfaat: "Memungkinkan tim memusatkan 80% energi dan sumber daya pada 20% pemicu utama untuk mencapai dampak perbaikan paling spektakuler."
    },
    layout: {
      tipe: "Diagram Pareto (Bar Frekuensi + Garis Kumulatif %)",
      elemen: ["Kategori Masalah / Faktor", "Frekuensi Kejadian / Biaya", "Persentase Kontribusi", "Persentase Kumulatif (80% Cut-off line)"],
      visualType: 'pareto-chart'
    },
    draft: [
      { bagian: "Data Masalah / Defect", hint: "Kumpulkan data komplain, penyebab keterlambatan, atau sumber kerugian selama minimal 1-3 bulan terakhir." },
      { bagian: "Urutkan dari Terbesar ke Terkecil", hint: "Susun kategori faktor pemicu berdasarkan jumlah kejadian atau nilai kerugian moneter tertinggi." },
      { bagian: "Garis Kumulatif 80%", hint: "Hitung persentase kumulatif. Faktor-faktor mana yang jika dijumlahkan langsung mencapai 80% dari total masalah?" },
      { bagian: "Fokus Tindakan Prioritas", hint: "Abaikan sementara faktor-faktor kecil di buntut; rancang rencana aksi khusus hanya untuk 20% faktor teratas." }
    ],
    tutorial: [
      { step: "Kumpulkan Data Lapangan Akurat", desc: "Pastikan data klasifikasi masalah objektif dan tercatat dalam lembar periksa (check sheet)." },
      { step: "Plot Diagram Pareto", desc: "Gambarkan batang frekuensi menurun dari kiri ke kanan dan tarik kurva kumulatif hingga 100%." },
      { step: "Serang 20% Masalah Kunci", desc: "Fokuskan inisiatif perbaikan pada 2-3 kategori batang tertinggi yang menopang 80% masalah." }
    ],
    actionPlan: [
      "Analisis 100 komplain pelanggan terakhir dan kelompokkan ke dalam 5 kategori pemicu.",
      "Identifikasi 2 kategori komplain teratas yang menyumbang 80% dari total keluhan.",
      "Bentuk gugus tugas khusus untuk memberantas 2 masalah kunci tersebut bulan ini."
    ]
  },
  "Analytical Hierarchy Process (AHP)": {
    teori: {
      deskripsi: "Metode pengambilan keputusan multikriteria Thomas Saaty dengan memecah masalah kompleks menjadi hierarki dan menggunakan perbandingan berpasangan (pairwise comparison) serta rasio konsistensi (CR < 0.1).",
      manfaat: "Menggabungkan pertimbangan kualitatif intuitif dengan kalkulasi matematis yang konsisten dan bebas kontradiksi logika."
    },
    layout: {
      tipe: "Struktur Hierarki AHP & Matriks Berpasangan",
      elemen: ["Tujuan Utama (Goal)", "Kriteria & Sub-kriteria", "Alternatif Pilihan", "Skala Saaty 1-9", "Nilai Eigenvector / Bobot Prioritas", "Consistency Ratio (CR < 0.1)"],
      visualType: 'ahp-tree-matrix'
    },
    draft: [
      { bagian: "Goal & Kriteria", hint: "Tuliskan tujuan keputusan utama dan 3-5 kriteria penentu (Misal: Biaya, Kualitas, Reputasi, Fleksibilitas)." },
      { bagian: "Perbandingan Berpasangan Kriteria", hint: "Gunakan skala 1 (sama penting) hingga 9 (mutlak lebih penting) untuk membandingkan kriteria A vs B." },
      { bagian: "Perbandingan Alternatif per Kriteria", hint: "Bandingkan alternatif solusi terhadap masing-masing kriteria yang telah dibobot." },
      { bagian: "Uji Konsistensi (CR)", hint: "Apakah penilaian konsisten? Jika Rasio Konsistensi > 0.1, lakukan evaluasi ulang perbandingan berpasangan." }
    ],
    tutorial: [
      { step: "Bangun Pohon Hierarki", desc: "Letakkan Tujuan di puncak, Kriteria di tingkat tengah, dan Alternatif di tingkat paling dasar." },
      { step: "Lakukan Pairwise Comparison", desc: "Isi matriks bujur sangkar dengan membandingkan seberapa penting kriteria baris dibanding kolom." },
      { step: "Hitung Vektor Prioritas Global", desc: "Kalikan bobot kriteria dengan skor alternatif untuk mendapatkan perangkingan final." }
    ],
    actionPlan: [
      "Gunakan metode AHP untuk memilih lokasi kantor/cabang baru dari 3 kandidat kota.",
      "Lakukan perbandingan berpasangan kriteria bersama para pemegang saham kunci.",
      "Verifikasi bahwa Consistency Ratio di bawah 10% sebelum menetapkan keputusan akhir."
    ]
  },
  "Six Thinking Hats": {
    teori: {
      deskripsi: "Teknik berpikir paralel Edward de Bono menggunakan 6 topi warna metaforis: Putih (Fakta/Data), Merah (Emosi/Intuisi), Hitam (Kritik/Risiko), Kuning (Optimisme/Manfaat), Hijau (Kreativitas/Ide), Biru (Manajemen Proses).",
      manfaat: "Menghilangkan perdebatan egoistik dalam rapat dan memaksa seluruh peserta melihat suatu masalah dari sudut pandang yang sama secara serentak."
    },
    layout: {
      tipe: "Papan 6 Topi Berpikir Paralel De Bono",
      elemen: ["Topi Putih (Fakta & Angka)", "Topi Merah (Intuisi & Perasaan)", "Topi Hitam (Risiko & Kelemahan)", "Topi Kuning (Manfaat & Peluang)", "Topi Hijau (Ide Kreatif Baru)", "Topi Biru (Agenda & Kesimpulan)"],
      visualType: 'six-hats-cards'
    },
    draft: [
      { bagian: "Topi Putih (Data Murni)", hint: "Informasi objektif apa yang kita miliki? Data apa yang masih belum lengkap dan perlu dicari?" },
      { bagian: "Topi Merah (Perasaan Tanpa Alasan)", hint: "Bagaimana firasat awal tim tentang ide ini? (Boleh emosional tanpa perlu pembenaran logika)." },
      { bagian: "Topi Hitam (Paling Kritis)", hint: "Apa potensi bahaya, risiko hukum, biaya membengkak, atau skenario kegagalan terburuk?" },
      { bagian: "Topi Kuning & Hijau", hint: "Kuning: Mengapa ide ini luar biasa dan apa keuntungan terbesarnya? Hijau: Alternatif kreatif gila apa yang bisa dicoba?" }
    ],
    tutorial: [
      { step: "Gunakan Topi Biru di Awal & Akhir", desc: "Fasilitator memimpin dengan Topi Biru untuk menetapkan agenda rapat dan merangkum hasil akhir." },
      { step: "Pakai Topi yang Sama Serentak", desc: "Semua peserta wajib memakai Topi Hitam bersamaan, lalu berganti ke Topi Kuning bersamaan (bukan saling mendebat)." },
      { step: "Disiplin Waktu per Topi", desc: "Alokasikan 2-5 menit per warna topi agar diskusi tetap fokus, padat, dan produktif." }
    ],
    actionPlan: [
      "Pimpin rapat evaluasi produk baru menggunakan metode 6 Thinking Hats.",
      "Beri waktu khusus 10 menit untuk 'Topi Hitam' guna membedah semua risiko secara jujur tanpa rasa sungkan.",
      "Gunakan 'Topi Hijau' untuk mencari jalan keluar cerdas atas risiko yang ditemukan."
    ]
  },
  "Supply-Demand Analysis": {
    teori: {
      deskripsi: "Analisis mikroekonomi tentang interaksi antara kurva penawaran (produsen) dan permintaan (konsumen) dalam menentukan harga ekuilibrium pasar dan elastisitas kuantitas.",
      manfaat: "Memandu kebijakan penetapan harga yang optimal dan memprediksi fluktuasi omzet akibat pergeseran tren pasar atau kenaikan biaya pasokan."
    },
    layout: {
      tipe: "Grafik Ekuilibrium Kurva Permintaan & Penawaran",
      elemen: ["Demand Curve (Kurva Permintaan Negatif)", "Supply Curve (Kurva Penawaran Positif)", "Titik Ekuilibrium (P*, Q*)", "Surplus Konsumen & Produsen", "Elastisitas Harga (Ed)"],
      visualType: 'cartesian-chart'
    },
    draft: [
      { bagian: "Kondisi Permintaan (Demand)", hint: "Bagaimana sensitivitas pembeli jika harga naik 10%? Apakah produk bersifat elastis (banyak substitusi) atau inelastis (kebutuhan pokok)?" },
      { bagian: "Kondisi Pasokan (Supply)", hint: "Apakah kapasitas produksi mudah ditingkatkan jika permintaan melonjak? Apa hambatan rantai pasok bahan baku?" },
      { bagian: "Harga Keseimbangan Pasar", hint: "Berapa titik harga pasar yang membuat volume persediaan habis terjual tanpa penumpukan stok atau kehabisan barang?" },
      { bagian: "Faktor Penggeser Kurva", hint: "Tren apa yang sedang menggeser kurva permintaan ke kanan? (Misal: Kampanye viral, perubahan gaya hidup konsumen)." }
    ],
    tutorial: [
      { step: "Identifikasi Barang Substitusi", desc: "Petakan alternatif produk lain yang akan dibeli konsumen jika harga produk Anda dinaikkan." },
      { step: "Uji Elastisitas Harga", desc: "Kalkulasikan perubahan persentase penjualan historis saat Anda memberikan diskon atau menaikkan harga." },
      { step: "Antisipasi Musiman (Seasonality)", desc: "Sesuaikan proyeksi pasokan dengan pergeseran kurva permintaan pada musim liburan atau hari raya." }
    ],
    actionPlan: [
      "Lakukan uji coba kenaikan harga sebesar 5% pada 1 segmen produk inelastis.",
      "Petakan kapasitas penawaran maksimum harian bisnis Anda sebelum terjadi bottlenecks.",
      "Analisis dampak promosi kompetitor terhadap posisi kurva permintaan produk Anda."
    ]
  },
  "Input-Output Analysis": {
    teori: {
      deskripsi: "Model ekonomi kuantitatif Wassily Leontief yang memetakan keterkaitan saling ketergantungan (interdependencies) transaksi antar-sektor industri dalam suatu perekonomian atau rantai pasok perusahaan.",
      manfaat: "Mengukur dampak multiplier effect (efek pengganda) dari investasi baru dan mengidentifikasi sektor hulu/hilir yang paling rentan terhadap guncangan pasokan."
    },
    layout: {
      tipe: "Matriks Transaksi Antar-Sektor Input-Output",
      elemen: ["Permintaan Antara (Intermediate Demand)", "Permintaan Akhir (Final Demand)", "Input Primer (Nilai Tambah / Upah / Pajak)", "Output Total", "Koefisien Teknis Leontief Matrix"],
      visualType: 'heatmap-nxn'
    },
    draft: [
      { bagian: "Sektor Hulu (Input Primer)", hint: "Dari sektor industri apa saja bahan baku, energi, dan tenaga kerja diserap? Berapa persen porsi terhadap biaya total?" },
      { bagian: "Proses Pengolahan & Nilai Tambah", hint: "Berapa nilai tambah (gaji karyawan, penyusutan alat, laba usaha) yang diciptakan dalam proses internal perusahaan?" },
      { bagian: "Sektor Hilir (Output & Pengguna)", hint: "Siapa pengguna output produk Anda: apakah industri lain sebagai bahan baku lanjutan atau konsumen akhir?" },
      { bagian: "Multiplier Effect & Kerentanan", hint: "Jika sektor hulu pemasok mengalami krisis, seberapa besar rantai pasok Anda terganggu?" }
    ],
    tutorial: [
      { step: "Susun Tabel Arus Barang/Jasa", desc: "Petakan aliran transaksi moneter dari produsen hulu ke pengguna akhir dalam format tabel matriks." },
      { step: "Hitung Koefisien Input", desc: "Bagi nilai input setiap sektor dengan total output untuk melihat rasio ketergantungan bahan." },
      { step: "Simulasikan Efek Guncangan Pasokan", desc: "Hitung dampak penurunan pasokan 20% pada satu sektor terhadap output seluruh lini bisnis." }
    ],
    actionPlan: [
      "Petakan 3 sektor industri pemasok utama bahan baku bisnis Anda.",
      "Hitung rasio nilai tambah lokal yang dihasilkan dalam operasi bisnis Anda.",
      "Siapkan alternatif pemasok sekunder untuk memitigasi ketergantungan pada 1 industri hulu tertentu."
    ]
  },
  "Radar / Spider Chart": {
    teori: {
      deskripsi: "Grafik visualisasi data dua dimensi multi-variabel untuk membandingkan performa atau profil kompetensi pada 5 hingga 8 dimensi metrik secara simultan.",
      manfaat: "Memudahkan identifikasi ketimpangan kapabilitas, keunggulan kompetitif, dan gap analisis antara performa aktual vs target ideal dalam satu tampilan grafis holistik."
    },
    layout: {
      tipe: "Grafik Jaring Laba-laba Multi-Aksis (Radar Chart)",
      elemen: ["Dimensi Aksis 1-6 (Skala 1-10)", "Polygon Performa Aktual (Garis Biru)", "Polygon Target / Benchmark (Garis Abu-abu)", "Area Gap & Ketimpangan"],
      visualType: 'radar-chart'
    },
    draft: [
      { bagian: "Definisi 6 Dimensi Kunci", hint: "Tentukan 5-8 parameter terukur (Misal: Kecepatan, Kualitas, Harga, Inovasi, Pelayanan, Brand)." },
      { bagian: "Skor Aktual Organisasi", hint: "Beri nilai objektif 1-10 berdasarkan data survei atau audit internal untuk tiap sumbu." },
      { bagian: "Skor Kompetitor / Target Ideal", hint: "Plotkan skor rata-rata kompetitor utama pada sumbu yang sama untuk melihat perbandingan langsung." },
      { bagian: "Analisis Gap & Prioritas Perbaikan", hint: "Sumbu mana yang menunjukkan defisit terjauh dibanding target dan membutuhkan intervensi segera?" }
    ],
    tutorial: [
      { step: "Standarisasi Skala Pengukuran", desc: "Pastikan seluruh sumbu menggunakan skala yang seragam (misal 1-10 atau 1-100) agar bentuk poligon proporsional." },
      { step: "Overlay Dua Lapisan Data", desc: "Tumpuk poligon performa internal di atas poligon target industri untuk mempertegas area gap." },
      { step: "Tafsirkan Pola Bentuk", desc: "Bentuk yang condong tajam ke satu sisi menandakan spesialisasi, sedangkan poligon seimbang menandakan kapabilitas serba merata." }
    ],
    actionPlan: [
      "Tentukan 6 dimensi keunggulan bisnis Anda (misal: Rasa, Kecepatan, Harga, Suasana, Higienitas, Pelayanan).",
      "Kumpulkan skor dari 20 responden pelanggan setia untuk menggambarkan Radar Chart aktual.",
      "Buat program perbaikan untuk dimensi dengan skor terendah dalam 3 bulan ke depan."
    ]
  },
  "Product Vision Board": {
    teori: {
      deskripsi: "Alat visual Roman Pichler untuk merangkum visi produk jangka panjang, target kelompok pengguna, kebutuhan mendalam, fitur pembeda, dan tujuan bisnis perusahaan.",
      manfaat: "Menjadi kompas pemersatu antara tim bisnis, desainer UX, dan developer teknis agar tidak menyimpang dari tujuan esensial produk."
    },
    layout: {
      tipe: "Papan Visi Produk Roman Pichler",
      elemen: ["Vision (Visi Mulia Jangka Panjang)", "Target Group (Kelompok Pengguna)", "Needs (Kebutuhan & Masalah)", "Product (Fitur Unggulan)", "Business Goals (Tujuan Bisnis)"],
      visualType: 'split-header-4col'
    },
    draft: [
      { bagian: "Vision (Paling Atas)", hint: "Perubahan positif apa yang ingin dihadirkan produk ini bagi kehidupan pengguna dalam 3-5 tahun ke depan?" },
      { bagian: "Target Group", hint: "Siapa pengguna spesifik yang paling membutuhkan produk ini? (Persona pembeli utama)." },
      { bagian: "Needs", hint: "Masalah nyata apa yang ingin dipecahkan? Kebutuhan emosional atau fungsional apa yang dipenuhi?" },
      { bagian: "Product & Business Goals", hint: "Fitur pembeda apa yang membuat produk ini dicintai? Apa manfaat finansial atau strategis bagi perusahaan?" }
    ],
    tutorial: [
      { step: "Pisahkan Visi dari Solusi", desc: "Visi adalah 'Mengapa produk ini ada', bukan fitur teknisnya. Visi harus bertahan meski fitur berubah." },
      { step: "Pastikan Kebutuhan Teruji", desc: "Validasi apakah kebutuhan yang ditulis benar-benar masalah nyata, bukan asumsi sepihak pembuat produk." },
      { step: "Tinjau Berkala Setiap Kuartal", desc: "Perbarui Product Vision Board jika terjadi pergeseran tren pasar atau pivot strategi." }
    ],
    actionPlan: [
      "Susun satu lembar Product Vision Board untuk produk unggulan atau aplikasi baru.",
      "Lakukan alignment session 30 menit bersama tim teknologi dan tim marketing.",
      "Pajang ringkasan visi di ruang kerja atau ruang kerja digital tim."
    ]
  },
  "Kano Feature Prioritization": {
    teori: {
      deskripsi: "Metode kuantitatif Noriaki Kano untuk memprioritaskan fitur produk berdasarkan kepuasan pelanggan: Basic/Must-be, Performance/One-dimensional, Attractive/Delighter, dan Indifferent.",
      manfaat: "Mencegah pemborosan biaya developer pada fitur yang tidak diapresiasi konsumen, dan memastikan fitur 'Must-be' tidak pernah cacat."
    },
    layout: {
      tipe: "Kuadran Skoring Kepuasan Fitur Kano Model",
      elemen: ["Must-be (Wajib Ada / Higienis)", "Performance (Makin Banyak Makin Bagus)", "Delighter (Kejutan Wow / Diferensiasi)", "Indifferent (Tidak Peduli / Singkirkan)", "Reverse (Malah Bikin Kesal)"],
      visualType: 'kano-chart'
    },
    draft: [
      { bagian: "Fitur Wajib (Must-be)", hint: "Fitur apa yang dianggap standar oleh konsumen? Jika tidak ada mereka akan kabur, namun jika ada mereka tidak akan memuji." },
      { bagian: "Fitur Performa (Performance)", hint: "Fitur di mana kepuasan berbanding lurus dengan kuantitas: misal kecepatan respon, kapasitas baterai, kuota penyimpanan." },
      { bagian: "Fitur Pemikat (Delighters)", hint: "Inovasi tak terduga yang belum diminta pelanggan, namun memberikan efek 'WOW' luar biasa saat digunakan." },
      { bagian: "Fitur Netral (Indifferent)", hint: "Fitur yang keberadaannya sama sekali tidak mempengaruhi keputusan beli konsumen. Wajib dihentikan pengembangannya!" }
    ],
    tutorial: [
      { step: "Ajukan Dua Pasang Pertanyaan", desc: "Tanyakan: 'Bagaimana perasaan Anda jika fitur ini ADA?' dan 'Bagaimana perasaan Anda jika fitur ini TIDAK ADA?'" },
      { step: "Petakan ke Matriks Evaluasi", desc: "Kombinasi jawaban (Suka, Harap, Netral, Tahan, Tidak Suka) akan mengkategorikan tipe fitur secara otomatis." },
      { step: "Prioritaskan Pembangunan", desc: "1. Tuntaskan Must-be -> 2. Bersaing di Performance -> 3. Sertakan 1-2 Delighters pembeda." }
    ],
    actionPlan: [
      "Buat survei Kano singkat untuk 5 fitur baru yang sedang diusulkan tim teknis.",
      "Hapus atau tunda pengembangan fitur yang masuk ke kategori 'Indifferent'.",
      "Pastikan seluruh fitur 'Must-be' berfungsi 100% tanpa celah bug sebelum peluncuran."
    ]
  },
  "Scrum / Kanban Board": {
    teori: {
      deskripsi: "Sistem manajemen kerja visual Agile untuk melacak alur tugas: Backlog -> To Do -> In Progress -> Code Review/Testing -> Done, dengan batasan Work-In-Progress (WIP).",
      manfaat: "Meningkatkan kecepatan rilis, mengungkap kemacetan (bottleneck) secara visual, dan mencegah tim mengerjakan terlalu banyak hal sekaligus yang berujung tidak selesai."
    },
    layout: {
      tipe: "Papan Kolom Alur Kerja Visual Kanban / Scrum",
      elemen: ["Product Backlog", "Sprint Backlog / To Do", "In Progress (WIP Limit: 3)", "Review / Testing", "Done (Definition of Done Terpenuhi)"],
      visualType: 'kanban-board'
    },
    draft: [
      { bagian: "Backlog & Prioritisasi", hint: "Daftar semua ide fitur, bug fix, dan perbaikan teknis yang telah diurutkan berdasarkan nilai bisnis." },
      { bagian: "WIP Limit (Batas Kerja Sedang Jalan)", hint: "Berapa kapasitas maksimal kartu tugas yang boleh berada di kolom 'In Progress' secara bersamaan agar tim fokus menuntaskan?" },
      { bagian: "Bottleneck Indicator", hint: "Kolom mana yang paling sering menumpuk kartu antrean? (Misal: Kolom Review staf senior yang kewalahan)." },
      { bagian: "Definition of Done (DoD)", hint: "Kriteria baku apa yang harus dipenuhi sebelum kartu boleh digeser ke kolom 'Done'?" }
    ],
    tutorial: [
      { step: "Visualisasikan Alur Kerja Nyata", desc: "Buat kolom yang mencerminkan tahapan kerja tim sehari-hari dari awal hingga penyerahan." },
      { step: "Terapkan Aturan Stop Starting, Start Finishing", desc: "Jangan ambil tugas baru sebelum tugas di tangan digeser ke kolom berikutnya." },
      { step: "Adakan Daily Standup 15 Menit", desc: "Jawab 3 pertanyaan: Apa yang selesai kemarin, apa yang dikerjakan hari ini, dan apa yang menghambat?" }
    ],
    actionPlan: [
      "Terapkan WIP Limit maksimal 2 tugas per orang di tim operasional.",
      "Buat checklist tertulis 'Definition of Done' untuk memastikan kualitas seragam.",
      "Jalankan sesi retrospective dua mingguan untuk mengevaluasi kecepatan siklus kerja."
    ]
  },
  "RICE Scoring Model": {
    teori: {
      deskripsi: "Metode kuantitatif prioritas proyek karya Intercom: RICE Score = (Reach x Impact x Confidence) / Effort.",
      manfaat: "Menghilangkan subjektivitas 'ide siapa yang paling nyaring' di ruang rapat, dan mengarahkan sumber daya pada inisiatif dengan rasio hasil per biaya tertinggi."
    },
    layout: {
      tipe: "Kalkulator Skoring Prioritas RICE",
      elemen: ["Reach (Jangkauan User per Kuartal)", "Impact (Dampak: 0.25 - 3x)", "Confidence (Tingkat Keyakinan %)", "Effort (Bulan-Orang Tenaga Kerja)", "RICE Score Final"],
      visualType: 'scoring-table'
    },
    draft: [
      { bagian: "Reach (R)", hint: "Berapa banyak pengguna/klien yang akan merasakan dampak fitur ini dalam periode 3 bulan ke depan?" },
      { bagian: "Impact (I)", hint: "Seberapa besar dampaknya bagi tiap individu? (3 = Masif, 2 = Tinggi, 1 = Sedang, 0.5 = Rendah, 0.25 = Sangat Rendah)." },
      { bagian: "Confidence (C)", hint: "Seberapa yakin tim dengan estimasi ini? (100% = Didukung data riset solid, 80% = Data menengah, 50% = Spekulasi/Firasat)." },
      { bagian: "Effort (E)", hint: "Berapa total orang-bulan (person-months) yang dibutuhkan seluruh tim teknis untuk menyelesaikannya?" }
    ],
    tutorial: [
      { step: "Gunakan Skala Baku Seragam", desc: "Pastikan semua anggota tim menggunakan definisi angka Reach dan Impact yang sama." },
      { step: "Turunkan Skor Jika Tanpa Data", desc: "Jika sebuah ide tidak memiliki data riset pendukung, turunkan skor Confidence menjadi 50%." },
      { step: "Urutkan Berdasarkan RICE Score", desc: "Inisiatif dengan skor tertinggi adalah yang wajib masuk ke daftar pengerjaan kuartal ini." }
    ],
    actionPlan: [
      "Nilai 5 inisiatif perbaikan produk kuartal ini menggunakan rumus RICE.",
      "Bandingkan ide ber-effort besar vs 'quick win' dengan reach luas.",
      "Pilih 2 proyek dengan skor RICE teratas untuk segera dieksekusi tim."
    ]
  },
  "MoSCoW Prioritization": {
    teori: {
      deskripsi: "Teknik kategorisasi kebutuhan proyek ke dalam 4 kotak: Must Have (Kritis mutlak), Should Have (Penting tapi ada alternatif), Could Have (Bagus jika ada), Won't Have (Tidak sekarang).",
      manfaat: "Menjaga batas anggaran dan batas waktu proyek (Time-boxing) agar tidak terjadi scope creep tanpa mengorbankan fungsi paling esensial."
    },
    layout: {
      tipe: "Matriks 4 Kuadran Prioritas MoSCoW",
      elemen: ["Must Have (Wajib Ada - Tidak bisa ditawar)", "Should Have (Harus Ada - Prioritas tinggi)", "Could Have (Boleh Ada - Jika ada sisa waktu)", "Won't Have (Ditiadakan - Untuk fase rilis saat ini)"],
      visualType: 'matrix2x2'
    },
    draft: [
      { bagian: "Must Have (M)", hint: "Kebutuhan vital yang jika ditiadakan, peluncuran proyek otomatis batal atau melanggar hukum/keamanan." },
      { bagian: "Should Have (S)", hint: "Kebutuhan bernilai tinggi yang sangat diharapkan, tetapi masih bisa menggunakan solusi manual alternatif jika waktu mepet." },
      { bagian: "Could Have (C)", hint: "Fitur 'nice-to-have' berdampak kecil yang hanya dikerjakan jika seluruh Must & Should selesai lebih awal." },
      { bagian: "Won't Have (W)", hint: "Ide-ide yang disepakati secara sadar untuk TIDAK dikerjakan pada rilis kali ini, disimpan untuk masa depan." }
    ],
    tutorial: [
      { step: "Batasi Kuota Must Have (Maksimal 60%)", desc: "Jika lebih dari 60% daftar tugas adalah Must Have, maka prioritisasi Anda gagal; pecah lagi." },
      { step: "Sepakati Kriteria 'Won't Have'", desc: "Menolak fitur secara resmi sama pentingnya dengan menyetujui fitur agar tim tidak terbebani janji palsu." },
      { step: "Gunakan Saat Menghadapi Deadline Ketat", desc: "Jika tanggal rilis tidak bisa mundur, segera potong semua item 'Could Have' dan sebagian 'Should Have'." }
    ],
    actionPlan: [
      "Kategorikan seluruh fitur pada rilis produk berikutnya ke dalam 4 kelompok MoSCoW.",
      "Pastikan proporsi 'Must Have' tidak melebihi 50% dari total estimasi jam kerja.",
      "Dapatkan tanda tangan persetujuan dari klien atau sponsor proyek atas daftar 'Won't Have'."
    ]
  },
  "User Story Mapping": {
    teori: {
      deskripsi: "Alat visualisasi Jeff Patton untuk menyusun backlog produk berdasarkan perjalanan pengguna (User Backbone) secara horizontal dan prioritas rilis (Walking Skeleton / MVP) secara vertikal.",
      manfaat: "Mencegah hilangnya konteks alur kerja pengguna utuh saat tim sibuk mengerjakan tiket-tiket teknis individual."
    },
    layout: {
      tipe: "Peta Cerita Pengguna (Backbone vs Releases)",
      elemen: ["Horizontal: Tahapan Perjalanan User (Backbone)", "Sub-aktivitas Spesifik", "Vertikal Slice 1: MVP / Rilis 1", "Vertikal Slice 2: Rilis 2 (Enhancement)", "Vertikal Slice 3: Rilis Mendatang"],
      visualType: 'modular-cards'
    },
    draft: [
      { bagian: "User Backbone (Tulang Punggung)", hint: "Urutan kronologis langkah yang dilalui pengguna dari awal hingga akhir (Misal: Cari -> Pilih -> Beli -> Terima -> Ulas)." },
      { bagian: "Walking Skeleton (Rilis MVP)", hint: "Potongan paling tipis dari cerita pengguna yang tetap menghasilkan alur fungsional utuh yang bisa dicoba langsung." },
      { bagian: "Irisan Rilis Berikutnya", hint: "Fitur kenyamanan, otomasi, dan variasi pembayaran yang akan ditambahkan setelah MVP terbukti diminati." },
      { bagian: "Eksplorasi Edge Cases", hint: "Bagaimana alur jika pengguna lupa password, kehabisan stok barang, atau membatalkan pesanan?" }
    ],
    tutorial: [
      { step: "Mulai dari Alur Horizontal Kiri ke Kanan", desc: "Tuliskan aktivitas besar pengguna menggunakan kartu sticky note horizontal." },
      { step: "Turunkan Kartu Detail ke Bawah", desc: "Tuliskan user stories detail di bawah aktivitas terkait, urutkan dari yang paling penting di atas." },
      { step: "Tarik Garis Pita Rilis (Release Slices)", desc: "Tarik garis horizontal untuk memotong backlog menjadi rilis MVP, rilis v1.1, dan v2.0." }
    ],
    actionPlan: [
      "Petakan perjalanan digital pengguna aplikasi Anda dari registrasi hingga transaksi pertama.",
      "Identifikasi fungsi minimum (Walking Skeleton) yang membuat transaksi dapat terjadi secara utuh.",
      "Fokuskan sprint developer berikutnya hanya pada potongan horizontal MVP tersebut."
    ]
  },
  "Opportunity Solution Tree": {
    teori: {
      deskripsi: "Visualisasi Teresa Torres untuk menghubungkan Desired Outcome (Hasil Bisnis yang Diinginkan) dengan Opportunities (Masalah Pengguna), Solutions (Solusi Alternatif), dan Assumption Tests (Uji Asumsi).",
      manfaat: "Mencegah tim langsung jatuh cinta pada solusi pertama mereka, dan membiasakan eksplorasi banyak solusi untuk satu masalah sebelum menulis kode."
    },
    layout: {
      tipe: "Pohon Peluang & Solusi Teresa Torres",
      elemen: ["Desired Outcome (Target Metrik Bisnis)", "Opportunities (Kebutuhan & Pain Points Konsumen)", "Potential Solutions (Alternatif Solusi A, B, C)", "Assumption Tests (Eksperimen Validasi Ringan)"],
      visualType: 'multi-tier-tree'
    },
    draft: [
      { bagian: "Desired Outcome", hint: "Metrik bisnis spesifik apa yang ingin ditingkatkan? (Misal: Naikkan retensi pengguna bulan ke-2 dari 15% ke 30%)." },
      { bagian: "Opportunities (Peluang Nyata)", hint: "Masalah atau hambatan apa yang dialami pengguna yang menghalangi tercapainya outcome tersebut?" },
      { bagian: "Solusi Alternatif (Bandingkan!)", hint: "Ajukan minimal 3 solusi berbeda untuk 1 masalah peluang yang sama (Jangan cuma 1 solusi tunggal!)." },
      { bagian: "Assumption Tests", hint: "Uji asumsi kelayakan, keinginan, dan kegunaan dari masing-masing solusi dengan eksperimen kecil murah." }
    ],
    tutorial: [
      { step: "Mulai dari Outcome Terukur", desc: "Sepakati metrik tunggal yang menjadi tolok ukur kesuksesan bersama tim manajemen." },
      { step: "Gali Peluang dari Riset Konsumen", desc: "Hanya masukkan problem yang benar-benar diucapkan oleh pengguna dalam sesi wawancara rutin." },
      { step: "Bandingkan Solusi Head-to-Head", desc: "Bandingkan solusi A, B, dan C sebelum memutuskan mana yang akan dibangun secara permanen." }
    ],
    actionPlan: [
      "Pilih 1 metrik bisnis (Outcome) yang sedang mandek di kuartal ini.",
      "Identifikasi 3 keluhan utama pelanggan yang berhubungan dengan metrik tersebut.",
      "Rancang 3 ide solusi kreatif untuk keluhan teratas dan buat eksperimen uji asumsinya."
    ]
  },
  "Dual-Track Agile Framework": {
    teori: {
      deskripsi: "Model kerja produk yang menjalankan dua jalur paralel secara simultan: Discovery Track (Eksplorasi & Validasi apa yang harus dibuat) dan Delivery Track (Rekayasa software berkualitas produksi).",
      manfaat: "Memastikan developer hanya membangun fitur yang telah terbukti diinginkan pengguna dan layak secara bisnis, menekan risiko 'waste' kode program hingga 70%."
    },
    layout: {
      tipe: "Dua Jalur Paralel Discovery & Delivery",
      elemen: ["Discovery Track (Product Manager & Designer: Riset, Prototipe, Wawancara)", "Hand-off / Validation Gate", "Delivery Track (Engineers & QA: Sprint, Code, Testing, Deploy)"],
      visualType: 'dual-track-swimlane'
    },
    draft: [
      { bagian: "Discovery Activities", hint: "Wawancara mingguan, pengujian prototipe Figma, validasi kelayakan teknis bersama tech lead." },
      { bagian: "Backlog Produk Tervalidasi", hint: "Hanya tiket fitur yang lolos uji hipotesis dan bernilai tinggi yang boleh diteruskan ke tim engineering." },
      { bagian: "Delivery Activities", hint: "Sprint 2 mingguan: penulisan kode bersih, integrasi API, automated testing, dan deployment stabil." },
      { bagian: "Umpan Balik Produksi", hint: "Data penggunaan fitur di lingkungan rilis langsung dialirkan kembali ke tim Discovery untuk iterasi selanjutnya." }
    ],
    tutorial: [
      { step: "Discovery 1-2 Sprint Lebih Awal", desc: "Tim Discovery harus selalu berada 1 hingga 2 sprint di depan tim Delivery agar backlog selalu siap." },
      { step: "Libatkan Engineer dalam Discovery", desc: "Ajak 1 perwakilan developer saat pengujian prototipe agar mereka paham konteks bisnis dan kelayakan teknis." },
      { step: "Ukur Dampak, Bukan Velocity Saja", desc: "Keberhasilan tim bukan dinilai dari berapa banyak poin cerita yang dirilis, tapi berapa dampak metrik yang berubah." }
    ],
    actionPlan: [
      "Jadwalkan 2 sesi wawancara pengguna setiap minggu untuk tim produk (Discovery).",
      "Buat aturan bahwa tidak ada tiket fitur yang masuk ke sprint developer tanpa prototipe tervalidasi.",
      "Tinjau metrik penggunaan fitur baru 14 hari pasca deployment ke produksi."
    ]
  }
};
