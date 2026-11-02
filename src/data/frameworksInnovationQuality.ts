import { FrameworkContent } from "@/frameworkData";

export const innovationQualityOrgFrameworks: Record<string, FrameworkContent> = {
  "Lean Startup Loop": {
    teori: {
      deskripsi: "Siklus iteratif Build-Measure-Learn untuk memvalidasi ide bisnis baru dengan cepat dan meminimalkan pemborosan modal melalui Minimum Viable Product (MVP).",
      manfaat: "Mencegah kegagalan fatal akibat membangun produk yang tidak diinginkan siapa pun, dengan menguji hipotesis langsung ke pasar sesegera mungkin."
    },
    layout: {
      tipe: "Siklus Loop Berulang Build-Measure-Learn",
      elemen: ["Ideas (Ide)", "BUILD -> Code/Product", "MEASURE -> Data/Metrik", "LEARN -> Insight/Pivot or Persevere"],
      visualType: 'circular-loop'
    },
    draft: [
      { bagian: "Ideas & Hipotesis", hint: "Apa asumsi paling berisiko tentang masalah pelanggan dan proposisi nilai Anda?" },
      { bagian: "Build (MVP)", hint: "Apa versi produk paling sederhana yang dapat dibuat untuk menguji hipotesis tersebut?" },
      { bagian: "Measure (Metrik Riil)", hint: "Data perilaku apa yang dikumpulkan? (Bukan survei opini, melainkan tindakan nyata seperti pre-order atau klik)" },
      { bagian: "Learn (Pivot/Persevere)", hint: "Apakah data membuktikan hipotesis? Apakah kita harus bertahan, menyempurnakan, atau berputar haluan (pivot)?" }
    ],
    tutorial: [
      { step: "Identifikasi Leap-of-Faith Assumption", desc: "Tentukan 1 asumsi terpenting yang jika salah, seluruh model bisnis akan runtuh." },
      { step: "Rancang Eksperimen Cepat", desc: "Bangun landing page, mockup fungsional, atau demo Concierge dalam hitungan hari." },
      { step: "Ukur Aksi Nyata Konsumen", desc: "Fokus pada metrik aksi terukur: pendaftaran email, komitmen bayar, atau referral." }
    ],
    actionPlan: [
      "Tuliskan 1 asumsi paling krusial mengenai calon pembeli produk baru Anda.",
      "Buat eksperimen MVP tanpa kode (misal halaman penawaran WhatsApp atau pre-order) dalam 48 jam.",
      "Tinjau hasil konversi setelah 50 calon pelanggan melihat penawaran tersebut."
    ]
  },
  "Design Thinking": {
    teori: {
      deskripsi: "Proses pemecahan masalah berpusat pada manusia (human-centered) melalui 5 tahap: Empathize, Define, Ideate, Prototype, dan Test.",
      manfaat: "Melahirkan inovasi produk dan layanan yang benar-benar menjawab kebutuhan laten pelanggan yang tidak terungkap melalui survei konvensional."
    },
    layout: {
      tipe: "Proses 5 Tahap Design Thinking",
      elemen: ["1. Empathize (Empati Mendalam)", "2. Define (Rumuskan Problem Statement)", "3. Ideate (Eksplorasi Ide Kreatif)", "4. Prototype (Buat Prototipe Cepat)", "5. Test (Uji ke Pengguna Nyata)"],
      visualType: 'pipeline-5stage'
    },
    draft: [
      { bagian: "Empathize", hint: "Apa keluhan emosional, frustrasi tersembunyi, dan harapan terdalam pengguna saat berinteraksi dengan solusi saat ini?" },
      { bagian: "Define (Point of View)", hint: "Rumuskan POV: [Pengguna spesifik] membutuhkan [kebutuhan mendalam] karena [wawasan mengejutkan / insight]." },
      { bagian: "Ideate (How Might We)", hint: "Gunakan pertanyaan pemantik 'Bagaimana kita bisa...' untuk menghasilkan puluhan ide tanpa sensor." },
      { bagian: "Prototype & Test", hint: "Buat prototipe fisik/digital murah untuk mendapatkan umpan balik jujur dari pengguna." }
    ],
    tutorial: [
      { step: "Lakukan Wawancara Empati", desc: "Amati perilaku pengguna nyata dan tanyakan 'Mengapa' untuk menggali motif emosional." },
      { step: "Rumuskan How Might We (HMW)", desc: "Ubah masalah menjadi tantangan desain yang membuka berbagai kemungkinan solusi baru." },
      { step: "Uji dan Iterasi Cepat", desc: "Jangan membela ide Anda saat pengujian; dengarkan kritik pengguna untuk menyempurnakan solusi." }
    ],
    actionPlan: [
      "Lakukan wawancara mendalam dengan 3 pelanggan setia untuk mendengarkan friksi terbesar mereka.",
      "Rumuskan 3 pertanyaan 'How Might We' untuk mengatasi komplain terbanyak.",
      "Buat prototipe visual sederhana dan uji langsung ke calon pembeli baru."
    ]
  },
  "Fishbone Diagram (Ishikawa)": {
    teori: {
      deskripsi: "Diagram sebab-akibat berbentuk tulang ikan untuk mengurai seluruh potensi akar penyebab masalah operasional ke dalam kategori 6M (Man, Machine, Method, Material, Measurement, Milieu/Environment).",
      manfaat: "Mencegah perbaikan hanya di tingkat gejala (symptom) dan memastikan akar masalah terdalam (root cause) ditangani secara permanen."
    },
    layout: {
      tipe: "Diagram Tulang Ikan Sebab-Akibat (6M)",
      elemen: ["Head: Problem Utama", "Man (SDM/Karyawan)", "Machine (Alat/Mesin)", "Method (Metode/SOP)", "Material (Bahan Baku)", "Measurement (Pengukuran)", "Environment (Lingkungan Kerja)"],
      visualType: 'fishbone-diagram'
    },
    draft: [
      { bagian: "Problem Utama (Head)", hint: "Tuliskan masalah kualitas atau kegagalan yang terjadi secara spesifik di kepala ikan." },
      { bagian: "Man (Faktor Manusia)", hint: "Apakah ada kurangnya pelatihan, kelelahan, kurang komunikasi, atau motivasi rendah?" },
      { bagian: "Method (Metode & SOP)", hint: "Apakah SOP sudah usang, terlalu rumit, tidak jelas, atau tidak diawasi?" },
      { bagian: "Machine & Material", hint: "Apakah mesin rusak, perkakas aus, software bug, atau spesifikasi bahan baku tidak seragam?" },
      { bagian: "Measurement & Milieu", hint: "Apakah alat ukur kalibrasinya salah? Bagaimana suhu, kebisingan, atau pencahayaan ruangan?" }
    ],
    tutorial: [
      { step: "Sepakati Masalah Utama", desc: "Pastikan masalah dinyatakan dalam bentuk terukur, misal: 'Tingkat retur produk mencapai 8% di Q3'." },
      { step: "Brainstorming dengan 5-Whys", desc: "Untuk tiap tulang cabang, tanyakan 'Mengapa hal itu terjadi?' minimal 5 kali hingga menemukan akar terdalam." },
      { step: "Pilih 3 Penyebab Paling Berpengaruh", desc: "Lakukan voting tim untuk memprioritaskan 3 akar penyebab yang harus segera dibuatkan rencana aksi penanggulangan." }
    ],
    actionPlan: [
      "Gambarkan diagram Fishbone untuk mengatasi kendala keterlambatan pengiriman pesanan.",
      "Lakukan sesi 5-Whys bersama operator lapangan untuk cabang 'Man' dan 'Method'.",
      "Buat tindakan korektif untuk 2 akar masalah paling dominan."
    ]
  },
  "PDCA Cycle": {
    teori: {
      deskripsi: "Siklus perbaikan berkelanjutan (Kaizen) 4 langkah berulang: Plan (Rencanakan), Do (Jalankan skala kecil), Check (Evaluasi hasil), Act (Standarisasi dan teruskan).",
      manfaat: "Menjadikan perbaikan mutu sebagai kebiasaan organisasi yang sistematis dan berbasis data empiris, bukan coba-coba sporadis."
    },
    layout: {
      tipe: "Roda Berputar PDCA (Deming Wheel)",
      elemen: ["Plan (Tentukan Target & Rencana)", "Do (Uji Coba Skala Terbatas)", "Check (Ukur Perbedaan Data)", "Act (Standarisasi & Replikasi)"],
      visualType: 'pdca-wheel'
    },
    draft: [
      { bagian: "Plan", hint: "Apa target perbaikan spesifik, kapan jadwalnya, dan hipotesis solusi apa yang ingin diuji?" },
      { bagian: "Do", hint: "Jalankan rencana dalam skala kecil / pilot project untuk menguji efektivitasnya tanpa mengganggu operasional besar." },
      { bagian: "Check", hint: "Bandingkan data sebelum vs sesudah uji coba. Apakah target tercapai? Apa kendala yang muncul?" },
      { bagian: "Act", hint: "Jika berhasil: Jadikan SOP resmi dan latih seluruh staf. Jika belum berhasil: Modifikasi rencana dan ulangi siklus." }
    ],
    tutorial: [
      { step: "Fokus pada Pilot Terbatas", desc: "Jangan langsung terapkan ke seluruh divisi; uji coba pada 1 outlet, 1 lini mesin, atau 1 tim." },
      { step: "Ukur Secara Objektif", desc: "Pastikan ada indikator kuantitatif yang jelas sebelum dan sesudah tahap Do." },
      { step: "Kunci dengan Standarisasi", desc: "Tahap Act adalah kunci agar tim tidak kembali ke cara kerja lama yang tidak efisien." }
    ],
    actionPlan: [
      "Pilih 1 alur kerja yang ingin diefisiensikan minggu ini.",
      "Tuliskan rencana eksperimen 1 minggu di tahap Plan dan Do.",
      "Jadwalkan review hari Jumat untuk fase Check dan Act bersama supervisor."
    ]
  },
  "House of Quality (HOQ / QFD)": {
    teori: {
      deskripsi: "Matriks inti Quality Function Deployment (QFD) yang menerjemahkan Voice of Customer (keinginan pelanggan) menjadi karakteristik teknis dan spesifikasi rekayasa produk.",
      manfaat: "Menghubungkan ekspektasi pasar dengan kemampuan teknis manufaktur/desain, serta mengungkap korelasi antar-fitur produk."
    },
    layout: {
      tipe: "Matriks Rumah Kualitas (House of Quality)",
      elemen: ["Voice of Customer (WHATs)", "Engineering Characteristics (HOWs)", "Relationship Matrix (Korelasi)", "Roof: Trade-off / Interrelationships", "Customer Competitive Assessment", "Technical Targets & Priority"],
      visualType: 'hoq-matrix'
    },
    draft: [
      { bagian: "Voice of Customer (WHATs)", hint: "Apa saja kriteria produk yang paling penting bagi pembeli? Berikan bobot kepentingan 1-5." },
      { bagian: "Karakteristik Teknis (HOWs)", hint: "Parameter teknis apa yang bisa diukur dan dikontrol oleh tim produksi/desain?" },
      { bagian: "Matriks Hubungan", hint: "Korelasi antara kebutuhan konsumen dengan fitur teknis: Kuat (9), Sedang (3), Lemah (1), atau Tidak Ada (0)." },
      { bagian: "Analisis Atap (Trade-offs)", hint: "Apakah peningkatan satu fitur teknis mengorbankan fitur lain? (Misal: Daya baterai vs Bobot perangkat)." }
    ],
    tutorial: [
      { step: "Kumpulkan Kebutuhan Riil Konsumen", desc: "Gunakan survei atau wawancara untuk menetapkan bobot kepentingan masing-masing kriteria." },
      { step: "Tentukan Parameter Rekayasa Terukur", desc: "Ganti istilah abstrak menjadi angka spesifik (misal: 'cepat' -> 'waktu booting < 5 detik')." },
      { step: "Kalkulasi Bobot Kepentingan Teknis", desc: "Kalikan bobot konsumen dengan nilai korelasi untuk menentukan prioritas riset dan pengembangan." }
    ],
    actionPlan: [
      "Identifikasi 5 fitur yang paling sering ditanyakan atau dikeluhkan oleh pengguna produk Anda.",
      "Petakan masing-masing fitur ke metrik teknis spesifik yang dapat diuji di lab/operasional.",
      "Tentukan trade-off teknis terbesar dalam pengembangan versi produk berikutnya."
    ]
  },
  "McKinsey 7S Framework": {
    teori: {
      deskripsi: "Model penyelarasan organisasi holistik yang menghubungkan 7 elemen: Tiga elemen keras/Hard (Strategy, Structure, Systems) dan empat elemen lunak/Soft (Shared Values, Style, Staff, Skills).",
      manfaat: "Mendiagnosis kelemahan organisasi dan memastikan perubahan strategi selalu diimbangi penyesuaian struktur, kompetensi staf, dan budaya kepemimpinan."
    },
    layout: {
      tipe: "Jaringan Terhubung 7 Elemen Organisasi (McKinsey 7S)",
      elemen: ["Shared Values (Nilai Inti)", "Strategy (Strategi)", "Structure (Struktur Organisasi)", "Systems (Sistem & Alur Kerja)", "Style (Gaya Kepemimpinan)", "Staff (Komposisi SDM)", "Skills (Kompetensi Inti)"],
      visualType: 'network-7s'
    },
    draft: [
      { bagian: "Shared Values (Pusat)", hint: "Nilai moral dan prinsip dasar apa yang menjadi jangkar budaya kerja seluruh organisasi?" },
      { bagian: "Hard S (Strategy, Structure, Systems)", hint: "Apakah strategi bisnis selaras dengan pembagian departemen dan sistem software/SOP yang ada?" },
      { bagian: "Soft S (Style, Staff, Skills)", hint: "Apakah gaya kepemimpinan mendukung inovasi? Apakah karyawan memiliki keahlian teknis yang dibutuhkan untuk mengeksekusi strategi baru?" },
      { bagian: "Analisis Ketidakselarasan (Misalignment)", hint: "Di mana titik friksi utama? (Misal: Strategi baru ingin cepat, tetapi sistem approval bertingkat 5 level)." }
    ],
    tutorial: [
      { step: "Evaluasi Kondisi Saat Ini (Current State)", desc: "Petakan kondisi riil ke-7 elemen di perusahaan Anda hari ini." },
      { step: "Tentukan Kondisi Masa Depan (Proposed State)", desc: "Bagaimana ke-7 elemen harus beradaptasi agar strategi baru berhasil?" },
      { step: "Rancang Roadmap Integrasi", desc: "Sinkronkan perubahan sistem dan peningkatan keahlian staf sebelum merombak struktur secara drastis." }
    ],
    actionPlan: [
      "Lakukan audit keselarasan antara strategi ekspansi digital dengan keterampilan (Skills) staf saat ini.",
      "Evaluasi apakah sistem (Systems) pelaporan manual menghambat kecepatan eksekusi tim cabang.",
      "Rumuskan program penyelarasan budaya (Shared Values) untuk menyatukan visi pasca restrukturisasi."
    ]
  },
  "Kotter's 8-Step Change": {
    teori: {
      deskripsi: "Proses 8 langkah transformasi organisasi karya John Kotter untuk memimpin perubahan besar dan mengatasi resistensi internal secara bertahap.",
      manfaat: "Menjamin inisiatif transformasi tidak layu sebelum berkembang, dengan membangun rasa urgensi yang nyata dan mengunci kemenangan cepat (quick wins)."
    },
    layout: {
      tipe: "Tangga Transformasi 8 Langkah Kotter",
      elemen: ["1. Urgensi (Sense of Urgency)", "2. Koalisi Pemandu (Guiding Coalition)", "3. Visi Strategis (Strategic Vision)", "4. Komunikasi Masif (Enlist Army)", "5. Singkirkan Rintangan (Remove Barriers)", "6. Quick Wins (Kemenangan Cepat)", "7. Akselerasi (Sustain Acceleration)", "8. Budayakan Perubahan (Anchor in Culture)"],
      visualType: 'staircase-8step'
    },
    draft: [
      { bagian: "Create Urgency", hint: "Krisis atau peluang pasar besar apa yang membuat perubahan menjadi mutlak dan tidak bisa ditunda?" },
      { bagian: "Build Coalition & Vision", hint: "Siapa saja pimpinan lintas divisi yang disegani yang menjadi pelopor? Apa gambaran masa depan 3 tahun ke depan?" },
      { bagian: "Communicate & Empower", hint: "Bagaimana visi dikomunikasikan secara berulang? Kebijakan atau birokrasi apa yang harus dicabut agar staf leluasa bergerak?" },
      { bagian: "Quick Wins & Anchoring", hint: "Pencapaian nyata apa yang bisa dirayakan dalam 60 hari pertama untuk membuktikan bahwa perubahan ini berhasil?" }
    ],
    tutorial: [
      { step: "Jangan Lewati Langkah 1 (Urgensi)", desc: "Lebih dari 50% inisiatif perubahan gagal karena manajemen gagal meyakinkan tim mengapa situasi saat ini berbahaya." },
      { step: "Rencanakan Quick Wins yang Kelihatan", desc: "Pilih target mudah yang dampaknya jelas terlihat dalam 2 bulan pertama untuk membungkam skeptisisme." },
      { step: "Lembagakan ke Budaya Perusahaan", desc: "Jadikan cara kerja baru sebagai syarat penilaian promosi dan insentif tahunan agar tidak revert ke kebiasaan lama." }
    ],
    actionPlan: [
      "Susun pesan narasi 'Urgensi Perubahan' berisi data ancaman bisnis yang akan dibagikan ke seluruh staf.",
      "Bentuk tim koalisi perubahan beranggotakan 5 perwakilan departemen kunci.",
      "Tetapkan 1 proyek 'Quick Win' yang harus tuntas dalam 30 hari ke depan."
    ]
  },
  "Force Field Analysis": {
    teori: {
      deskripsi: "Alat analisis Kurt Lewin untuk menimbang keseimbangan antara Kekuatan Pendorong (Driving Forces yang mendukung perubahan) dan Kekuatan Penghambat (Restraining Forces yang menentang perubahan).",
      manfaat: "Menemukan strategi perubahan yang paling efektif: bukan dengan memaksakan kekuatan pendorong, melainkan dengan melemahkan kekuatan penghambat."
    },
    layout: {
      tipe: "T-Chart Keseimbangan Gaya Kekuatan",
      elemen: ["Status Quo / Proposed Change", "Driving Forces (Skor 1-5)", "Restraining Forces (Skor 1-5)", "Total Score & Net Impact"],
      visualType: 't-chart-forcefield'
    },
    draft: [
      { bagian: "Proposed Change", hint: "Tuliskan keputusan atau perubahan spesifik yang sedang direncanakan (Misal: Beralih ke sistem ERP baru)." },
      { bagian: "Driving Forces", hint: "Daftar faktor pendorong perubahan (Teknologi baru, komplain klien, efisiensi biaya) dan beri bobot skor 1-5." },
      { bagian: "Restraining Forces", hint: "Daftar faktor penghambat/ketakutan tim (Biaya mahal, staf takut gaptek, birokrasi lama) dan beri bobot skor 1-5." },
      { bagian: "Rencana Pengurangan Hambatan", hint: "Strategi apa yang bisa menurunkan skor faktor penghambat terbesar? (Misal: Berikan pelatihan gratis dan jaminan tidak ada PHK)." }
    ],
    tutorial: [
      { step: "Petakan Kedua Sisi Kekuatan", desc: "Ajak perwakilan tim berdiskusi jujur untuk mendata seluruh kekhawatiran dan harapan." },
      { step: "Beri Nilai Bobot Pengaruh", desc: "Jumlahkan skor kedua sisi. Jika skor penghambat lebih besar, perubahan pasti ditolak di lapangan." },
      { step: "Fokus Kurangi Gaya Penghambat", desc: "Menekan driving force lebih keras sering memicu resistensi; menghilangkan rasa takut adalah cara termulus meloloskan perubahan." }
    ],
    actionPlan: [
      "Buat diagram Force Field untuk usulan perombakan jam kerja atau sistem komisi baru.",
      "Identifikasi 2 faktor penolakan terbesar dari staf lapangan.",
      "Susun program sosialisasi untuk menurunkan kekhawatiran tersebut sebelum pengumuman resmi."
    ]
  },
  "Logical Framework Analysis": {
    teori: {
      deskripsi: "Logframe / Matriks Logis adalah alat perencanaan dan manajemen proyek terstruktur yang merangkum Goal (Tujuan Jangka Panjang), Purpose (Hasil Langsung), Outputs (Keluaran), dan Activities (Aktivitas).",
      manfaat: "Standar baku proposal donor internasional dan lembaga publik untuk memastikan akuntabilitas, indikator terukur (OVI), dan manajemen asumsi risiko proyek."
    },
    layout: {
      tipe: "Matriks Logframe 4x4 (Logika Intervensi)",
      elemen: ["Project Structure (Goal/Purpose/Outputs/Activities)", "Objectively Verifiable Indicators (OVI)", "Means of Verification (MoV)", "Assumptions & Risks (Asumsi Risiko)"],
      visualType: 'logframe-matrix'
    },
    draft: [
      { bagian: "Goal & Purpose", hint: "Apa dampak sosial/ekonomi jangka panjang, dan apa perubahan perilaku/kondisi spesifik yang dihasilkan proyek ini?" },
      { bagian: "Outputs & Activities", hint: "Apa produk/layanan nyata yang diserahkan? Rangkaian kegiatan apa yang harus dilakukan untuk menghasilkan output tersebut?" },
      { bagian: "Indikator (OVI)", hint: "Bagaimana mengukur keberhasilan secara kuantitas, kualitas, dan waktu? (Target angka yang jelas)." },
      { bagian: "Means of Verification & Asumsi", hint: "Di mana bukti data keberhasilan diperoleh (laporan audit/survei)? Asumsi eksternal apa yang harus terpenuhi agar proyek sukses?" }
    ],
    tutorial: [
      { step: "Bangun Hubungan 'If-Then'", desc: "Jika Aktivitas terlaksana & Asumsi benar, MAKA Output tercapai. Jika Output tercapai, MAKA Purpose terwujud." },
      { step: "Kunci Sumber Verifikasi", desc: "Pastikan setiap indikator memiliki sumber bukti data dokumen yang dapat diaudit secara independen." },
      { step: "Identifikasi Risiko Kritis", desc: "Asumsi di kolom kanan adalah faktor eksternal di luar kendali langsung manajer proyek yang wajib dimitigasi." }
    ],
    actionPlan: [
      "Susun kerangka Logframe untuk program CSR atau hibah komunitas tahun berjalan.",
      "Pastikan setiap Output memiliki indikator terukur (OVI) yang jelas.",
      "Tinjau kolom Asumsi dan buat rencana kontinjensi untuk risiko politik atau cuaca."
    ]
  },
  "Stakeholder Power-Interest": {
    teori: {
      deskripsi: "Matriks 2x2 karya Mendelow untuk memetakan pemangku kepentingan berdasarkan tingkat Kekuatan/Pengaruh (Power) dan Kepentingan (Interest) mereka terhadap proyek.",
      manfaat: "Menentukan strategi komunikasi yang proporsional: Kelola Erat (Manage Closely), Jaga Kepuasan (Keep Satisfied), Berikan Info (Keep Informed), atau Monitor pasif."
    },
    layout: {
      tipe: "Matriks 2x2 Mendelow Power vs Interest",
      elemen: ["High Power / High Interest (Manage Closely)", "High Power / Low Interest (Keep Satisfied)", "Low Power / High Interest (Keep Informed)", "Low Power / Low Interest (Monitor)"],
      visualType: 'scatter-2x2'
    },
    draft: [
      { bagian: "Manage Closely (Kuadran Prioritas 1)", hint: "Pihak berkekuasaan tinggi & sangat berkepentingan (Investor utama, regulator penentu izin). Wajib dilibatkan intensif!" },
      { bagian: "Keep Satisfied (Kuadran 2)", hint: "Kekuasaan tinggi tapi kepentingan rendah (Dewan direksi umum, bankir peminjam). Penuhi syarat mereka agar tidak memveto proyek." },
      { bagian: "Keep Informed (Kuadran 3)", hint: "Kekuasaan rendah tapi sangat berkepentingan (Pengguna akhir, komunitas lokal, staf pelaksana). Berikan update berkala dan dengarkan aspirasi mereka." },
      { bagian: "Monitor (Kuadran 4)", hint: "Kekuasaan & kepentingan rendah (Masyarakat umum). Pantau berkala tanpa menghabiskan terlalu banyak waktu komunikasi." }
    ],
    tutorial: [
      { step: "Daftar Seluruh Stakeholder", desc: "Tuliskan semua individu, organisasi, atau kelompok yang terpengaruh atau bisa mempengaruhi proyek Anda." },
      { step: "Plot ke Dalam Kuadran", desc: "Nilai tingkat pengaruh aktual dan minat masing-masing pihak secara objektif." },
      { step: "Rancang Rencana Komunikasi", desc: "Tentukan frekuensi dan kanal interaksi (rapat privat, email buletin, atau pengumuman resmi)." }
    ],
    actionPlan: [
      "Petakan 10 stakeholder kunci untuk peluncuran produk atau kebijakan baru.",
      "Jadwalkan rapat tatap muka personal dengan pihak di kuadran 'Manage Closely'.",
      "Kirimkan laporan bulanan ringkas untuk kelompok 'Keep Informed'."
    ]
  },
  "Analisis Kebijakan Public (Dunn)": {
    teori: {
      deskripsi: "Metodologi analisis kebijakan William N. Dunn melalui 5 fase terintegrasi: Agenda Setting, Formulasi Kebijakan, Adopsi Kebijakan, Implementasi, dan Evaluasi Dampak.",
      manfaat: "Membantu analis dan pembuat kebijakan merumuskan regulasi berbasis bukti (evidence-based policy) yang efektif, efisien, adil, dan responsif."
    },
    layout: {
      tipe: "Siklus Analisis Kebijakan Publik Terstruktur",
      elemen: ["1. Perumusan Masalah (Problem Structuring)", "2. Peramalan Masa Depan (Forecasting)", "3. Rekomendasi Aksi (Recommendation)", "4. Pemantauan Implementasi (Monitoring)", "5. Evaluasi Kinerja (Evaluation)"],
      visualType: 'policy-cycle'
    },
    draft: [
      { bagian: "Problem Structuring", hint: "Apa akar permasalahan publik yang sebenarnya? Hindari memecahkan masalah yang salah (Type III error)." },
      { bagian: "Forecasting & Alternatif", hint: "Apa konsekuensi logis dari setiap opsi kebijakan dalam 3-5 tahun ke depan jika diterapkan?" },
      { bagian: "Kriteria Rekomendasi", hint: "Evaluasi opsi berdasarkan: Efektivitas, Efisiensi biaya, Ekuitas (Keadilan sosial), Kelayakan politik, dan Kemudahan administrasi." },
      { bagian: "Monitoring & Evaluasi", hint: "Data apa yang dikumpulkan untuk mengukur apakah kebijakan berjalan sesuai target dan tidak memicu efek samping?" }
    ],
    tutorial: [
      { step: "Definisikan Masalah Kebijakan", desc: "Bedakan antara gejala sosial permukaan dengan struktur masalah sistemik yang sesungguhnya." },
      { step: "Bandingkan Minimal 3 Opsi", desc: "Sertakan opsi 'Status Quo', 'Regulasi Baru', dan 'Pendekatan Pasar/Insentif'." },
      { step: "Buat Policy Brief Ringkas", desc: "Tulis ringkasan 2 halaman yang mudah dipahami pembuat keputusan politik non-teknis." }
    ],
    actionPlan: [
      "Tuliskan rumusan masalah (Problem Statement) untuk 1 isu regulasi yang sedang dihadapi bisnis/lembaga Anda.",
      "Uji opsi kebijakan menggunakan kriteria Efisiensi dan Ekuitas (keadilan bagi pihak kecil).",
      "Susun draf Policy Brief 2 halaman untuk diajukan ke jajaran manajemen senior."
    ]
  },
  "SMART Criteria": {
    teori: {
      deskripsi: "Metode perumusan target sasaran yang efektif: Specific (Spesifik), Measurable (Terukur), Achievable (Dapat Dicapai), Relevant (Relevan), Time-bound (Batas Waktu Jelas).",
      manfaat: "Mengubah angan-angan abstrak menjadi komitmen terukur yang dapat dieksekusi dan dievaluasi secara transparan oleh seluruh tim."
    },
    layout: {
      tipe: "Kartu 5 Kriteria SMART Goals",
      elemen: ["S - Specific (Apa, siapa, di mana, kenapa)", "M - Measurable (Berapa banyak, angka metrik)", "A - Achievable (Realistis dengan sumber daya)", "R - Relevant (Sesuai tujuan besar)", "T - Time-bound (Kapan batas tanggal akhir)"],
      visualType: 'checklist-5card'
    },
    draft: [
      { bagian: "Specific (S)", hint: "Apakah sasarannya sudah sangat jelas dan tidak multitafsir? Siapa yang bertanggung jawab?" },
      { bagian: "Measurable (M)", hint: "Angka atau metrik apa yang menjadi bukti tuntas? (Contoh: Menambah 500 klien aktif, bukan sekadar 'meningkatkan klien')." },
      { bagian: "Achievable (A)", hint: "Apakah target ini menantang namun tetap masuk akal dengan kapasitas tim dan anggaran yang tersedia?" },
      { bagian: "Relevant (R)", hint: "Apakah target ini berkontribusi langsung pada visi dan strategi jangka panjang perusahaan?" },
      { bagian: "Time-bound (T)", hint: "Kapan tepatnya tenggat waktu pencapaian? (Cantumkan tanggal, bulan, dan tahun yang pasti)." }
    ],
    tutorial: [
      { step: "Tinjau Target Lama", desc: "Ubah target yang samar (misal: 'Tingkatkan sales') menjadi format SMART." },
      { step: "Masukkan Angka & Batas Waktu", desc: "Ubah menjadi: 'Mencapai penjualan produk X sebesar Rp 200 juta per bulan sebelum 31 Desember'." },
      { step: "Validasi dengan Tim Eksekutor", desc: "Pastikan tim yang akan mengerjakan sepakat bahwa target tersebut Achievable." }
    ],
    actionPlan: [
      "Audit 3 target kerja kuartalan tim Anda saat ini menggunakan panduan SMART.",
      "Tambahkan batas waktu (deadline) yang pasti pada setiap tugas yang belum memiliki tanggal target.",
      "Tinjau ulang angka target jika dirasa tidak realistis untuk menghindari demotivasi karyawan."
    ]
  }
};
