import { decisionAndProductFrameworks } from "@/data/frameworksDecisionProduct";
import { innovationQualityOrgFrameworks } from "@/data/frameworksInnovationQuality";
import { operationsAndFinanceFrameworks } from "@/data/frameworksOperations";
import { salesTechPRFrameworks } from "@/data/frameworksSalesTechPR";
import { sustainabilityAndHRFrameworks } from "@/data/frameworksSustainabilityHR";

export interface FrameworkContent {
  teori: {
    deskripsi: string;
    manfaat: string;
  };
  layout: {
    tipe: string;
    elemen: string[];
    visualType?: string;
  };
  draft: Array<{
    bagian: string;
    hint: string;
  }>;
  tutorial: Array<{
    step: string;
    desc: string;
  }>;
  actionPlan: string[];
}

export interface FrameworkCategory {
  name: string;
  pillar: string;
  frameworks: string[];
}

export interface MBAPillar {
  id: string;
  name: string;
  description: string;
  categories: string[];
}

export const MBA_PILLARS: MBAPillar[] = [
  {
    id: "strategy",
    name: "Strategy",
    description: "Analisis posisi kompetitif, formulasi arah strategis korporat, model bisnis, dan pengambilan keputusan berbasis data.",
    categories: ["Strategic Analysis", "Business Design", "Decision Analysis"],
  },
  {
    id: "commercial",
    name: "Commercial",
    description: "Pertumbuhan komersial, bauran pemasaran, customer experience, manajemen siklus produk, dan akselerasi revenue penjualan.",
    categories: ["Marketing Management", "Customer Experience", "Product Management", "Sales Revenue"],
  },
  {
    id: "finance",
    name: "Finance",
    description: "Kesehatan finansial, rasio profitabilitas, kelayakan penganggaran modal (capital budgeting), dan titik impas (BEP).",
    categories: ["Financial Analysis"],
  },
  {
    id: "operations",
    name: "Operations",
    description: "Keunggulan operasional, efisiensi proses Six Sigma, manajemen alur kerja proyek, dan penjaminan kualitas berkesinambungan.",
    categories: ["Operations Management", "Project Management", "Quality Management"],
  },
  {
    id: "organization",
    name: "Organization",
    description: "Manajemen modal manusia, budaya kerja, transformasi perubahan organisasi, dan pelacakan kinerja terukur.",
    categories: ["People Management", "Change Management", "Performance Management"],
  },
  {
    id: "innovation",
    name: "Innovation",
    description: "Penciptaan nilai terobosan, akselerasi inovasi lean, perancangan masa depan teknologi, dan keberlanjutan ESG.",
    categories: ["Innovation Management", "Technology Futures", "Sustainability"],
  },
  {
    id: "governance",
    name: "Governance",
    description: "Tata kelola perusahaan, manajemen risiko, analisis kebijakan publik, dan komunikasi krisis serta reputasi korporat.",
    categories: ["Risk Management", "Policy Management", "Corporate Communications"],
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "Pemodelan kuantitatif, analisis keseimbangan ekonomi mikro-makro, input-output multisektor, dan visualisasi data multi-sumbu.",
    categories: ["Quantitative Analysis"],
  },
];

export const CATEGORIES: FrameworkCategory[] = [
  // 1. Strategy
  {
    "name": "Strategic Analysis",
    "pillar": "Strategy",
    "frameworks": [
      "SWOT Analysis",
      "TOWS Matrix",
      "PESTEL Analysis",
      "Porter's Five Forces",
      "VRIO Framework",
      "Value Chain Analysis",
      "BCG Matrix",
      "GE-McKinsey Matrix",
      "Ansoff Matrix",
      "Blue Ocean Strategy (ERRC)",
      "Value Disciplines Model"
    ]
  },
  {
    "name": "Business Design",
    "pillar": "Strategy",
    "frameworks": [
      "Business Model Canvas (BMC)",
      "Lean Canvas",
      "Value Proposition Canvas",
      "Empathy Map"
    ]
  },
  {
    "name": "Decision Analysis",
    "pillar": "Strategy",
    "frameworks": [
      "Cost-Benefit Analysis (CBA)",
      "Business Case Analysis",
      "Decision Tree Analysis",
      "Decision Matrix (Pugh)",
      "Analytical Hierarchy Process (AHP)",
      "Six Thinking Hats",
      "Eisenhower Matrix",
      "Pareto Analysis (80/20)"
    ]
  },

  // 2. Commercial
  {
    "name": "Marketing Management",
    "pillar": "Commercial",
    "frameworks": [
      "STP Framework",
      "4P/7P Marketing Mix",
      "Product Life Cycle (PLC)"
    ]
  },
  {
    "name": "Customer Experience",
    "pillar": "Commercial",
    "frameworks": [
      "Customer Journey Map (CJM)",
      "Kano Model"
    ]
  },
  {
    "name": "Product Management",
    "pillar": "Commercial",
    "frameworks": [
      "Product Vision Board",
      "Kano Feature Prioritization",
      "Scrum / Kanban Board",
      "RICE Scoring Model",
      "MoSCoW Prioritization",
      "User Story Mapping",
      "Opportunity Solution Tree",
      "Dual-Track Agile Framework"
    ]
  },
  {
    "name": "Sales Revenue",
    "pillar": "Commercial",
    "frameworks": [
      "MEDDPICC Framework",
      "Pricing Matrix",
      "Unit Economics (CLV/CAC)",
      "SPIN Selling Framework",
      "BANT Framework",
      "Revenue Engine (Flywheel)",
      "Value-Based Pricing Canvas",
      "Churn Analysis Matrix"
    ]
  },

  // 3. Finance
  {
    "name": "Financial Analysis",
    "pillar": "Finance",
    "frameworks": [
      "Analisis Rasio Keuangan",
      "Capital Budgeting (ROI, NPV, IRR)",
      "Break-Even Analysis (BEP)"
    ]
  },

  // 4. Operations
  {
    "name": "Operations Management",
    "pillar": "Operations",
    "frameworks": [
      "Six Sigma (DMAIC)",
      "SIPOC Diagram"
    ]
  },
  {
    "name": "Project Management",
    "pillar": "Operations",
    "frameworks": [
      "RACI Matrix",
      "Gantt Chart"
    ]
  },
  {
    "name": "Quality Management",
    "pillar": "Operations",
    "frameworks": [
      "Fishbone Diagram (Ishikawa)",
      "PDCA Cycle",
      "House of Quality (HOQ / QFD)"
    ]
  },

  // 5. Organization
  {
    "name": "People Management",
    "pillar": "Organization",
    "frameworks": [
      "9-Box Talent Grid",
      "Situational Leadership",
      "Johari Window",
      "Culture Map",
      "Lencioni's 5 Dysfunctions",
      "EVP Canvas",
      "360-Degree Feedback",
      "Kirkpatrick 4-Level Model"
    ]
  },
  {
    "name": "Change Management",
    "pillar": "Organization",
    "frameworks": [
      "McKinsey 7S Framework",
      "Kotter's 8-Step Change",
      "Force Field Analysis"
    ]
  },
  {
    "name": "Performance Management",
    "pillar": "Organization",
    "frameworks": [
      "Balanced Scorecard (BSC)",
      "OKR Framework",
      "SMART Criteria"
    ]
  },

  // 6. Innovation
  {
    "name": "Innovation Management",
    "pillar": "Innovation",
    "frameworks": [
      "Lean Startup Loop",
      "Design Thinking",
      "Doblin's 10 Types Innovation",
      "SCAMPER Ideation Canvas",
      "MVP Canvas",
      "Open Innovation Model",
      "Value Proposition Testing"
    ]
  },
  {
    "name": "Technology Futures",
    "pillar": "Innovation",
    "frameworks": [
      "Technology Readiness (TRL)",
      "Horizon Scanning (Futures)",
      "Gartner Hype Cycle"
    ]
  },
  {
    "name": "Sustainability",
    "pillar": "Innovation",
    "frameworks": [
      "ESG Materiality Matrix",
      "Triple Bottom Line (TBL)",
      "Circular Economy (Butterfly)",
      "Carbon Footprint (Scope 1-3)"
    ]
  },

  // 7. Governance
  {
    "name": "Risk Management",
    "pillar": "Governance",
    "frameworks": [
      "Risk Assessment Matrix",
      "FMEA Framework",
      "ISO 31000 Risk Management",
      "Business Continuity Plan (BCP)"
    ]
  },
  {
    "name": "Policy Management",
    "pillar": "Governance",
    "frameworks": [
      "Logical Framework Analysis",
      "Stakeholder Power-Interest",
      "Analisis Kebijakan Public (Dunn)"
    ]
  },
  {
    "name": "Corporate Communications",
    "pillar": "Governance",
    "frameworks": [
      "SCR Framework (Minto)",
      "Crisis Communication (SCCT)",
      "Brand Archetypes",
      "PESO Model",
      "Carroll's CSR Pyramid",
      "Issue Life Cycle",
      "Stakeholder Engagement",
      "Press Release Canvas"
    ]
  },

  // 8. Analytics
  {
    "name": "Quantitative Analysis",
    "pillar": "Analytics",
    "frameworks": [
      "Supply-Demand Analysis",
      "Input-Output Analysis",
      "Radar / Spider Chart"
    ]
  }
];

export const baseFrameworks: Record<string, FrameworkContent> = {
  "Eisenhower Matrix": {
    "teori": {
      "deskripsi": "Kerangka kerja manajemen waktu dan prioritisasi tugas yang membagi aktivitas ke dalam 4 kuadran berdasarkan tingkat kepentingan (Importance) dan kegentingan (Urgency).",
      "manfaat": "Membantu para eksekutif dan manajer membedakan antara tugas yang benar-benar bernilai strategis tinggi dengan distraksi mendesak yang dapat didelegasikan atau dieliminasi."
    },
    "layout": {
      "tipe": "Matriks 2x2 Prioritas (Urgent vs Important)",
      "elemen": [
        "Q1: Do First (Mendesak & Penting)",
        "Q2: Schedule (Penting & Tidak Mendesak)",
        "Q3: Delegate (Mendesak & Tidak Penting)",
        "Q4: Eliminate (Tidak Mendesak & Tidak Penting)"
      ],
      "visualType": "matrix2x2"
    },
    "draft": [
      {
        "bagian": "Q1 - Do First",
        "hint": "Krisis, batas waktu kritis, masalah mendesak yang butuh penanganan langsung hari ini."
      },
      {
        "bagian": "Q2 - Schedule",
        "hint": "Perencanaan strategis, inovasi, self-development, relasi - kunci sukses jangka panjang."
      },
      {
        "bagian": "Q3 - Delegate",
        "hint": "Interupsi, meeting administratif rutin, tugas operasional yang bisa dikerjakan tim."
      },
      {
        "bagian": "Q4 - Eliminate",
        "hint": "Distraksi, aktivitas buang waktu, tugas usang yang tidak bernilai tambah."
      }
    ],
    "tutorial": [
      {
        "step": "Inventarisasi Seluruh Tugas",
        "desc": "Kumpulkan daftar semua to-do item dan komitmen kerja minggu ini."
      },
      {
        "step": "Plot ke 4 Kuadran",
        "desc": "Uji setiap tugas: Apakah ini penting bagi tujuan jangka panjang? Apakah batas waktunya mendesak?"
      },
      {
        "step": "Fokus pada Kuadran 2",
        "desc": "Alokasikan 60-70% waktu mingguan Anda pada Kuadran 2 (Penting tapi tidak mendesak) untuk mencegah krisis di Kuadran 1."
      }
    ],
    "actionPlan": [
      "Jadwalkan blok waktu 2 jam per hari khusus untuk tugas Kuadran 2 tanpa gangguan notifikasi.",
      "Delegasikan minimal 2 tugas di Kuadran 3 kepada tim minggu ini.",
      "Hapus atau tolak minimal 1 permintaan kerja yang masuk ke kategori Kuadran 4."
    ]
  },
  "SWOT Analysis": {
    "teori": {
      "deskripsi": "Kerangka evaluasi strategis untuk mengidentifikasi Kekuatan (Strengths), Kelemahan (Weaknesses), Peluang (Opportunities), dan Ancaman (Threats).",
      "manfaat": "Membantu pengambilan keputusan taktis berdasarkan realita kapasitas internal dan kondisi pasar eksternal secara objektif."
    },
    "layout": {
      "tipe": "Matriks 2x2 (4 Kuadran)",
      "elemen": [
        "Strengths (Kekuatan)",
        "Weaknesses (Kelemahan)",
        "Opportunities (Peluang)",
        "Threats (Ancaman)"
      ],
      "visualType": "matrix2x2"
    },
    "draft": [
      {
        "bagian": "Strengths",
        "hint": "Apa keunggulan unik produk/layanan Anda? (Misal: Brand kuat, HPP rendah)"
      },
      {
        "bagian": "Weaknesses",
        "hint": "Apa yang kurang efisien? (Misal: Modal terbatas, sistem manual)"
      },
      {
        "bagian": "Opportunities",
        "hint": "Tren pasar apa yang bisa dimanfaatkan? (Misal: Digitalisasi)"
      },
      {
        "bagian": "Threats",
        "hint": "Apa hambatan eksternal? (Misal: Kompetitor, regulasi)"
      }
    ],
    "tutorial": [
      {
        "step": "Persiapan Data",
        "desc": "Kumpulkan feedback pelanggan dan riset kompetitor."
      },
      {
        "step": "Sesi Brainstorming",
        "desc": "Petakan kondisi internal (S&W), lalu eksternal (O&T)."
      },
      {
        "step": "Tarik Kesimpulan",
        "desc": "Gunakan S untuk memaksimalkan O, dan hindari T."
      }
    ],
    "actionPlan": [
      "Jadwalkan meeting 60 menit dengan tim inti minggu ini.",
      "Pilih 1 'Peluang' paling potensial sebagai prioritas.",
      "Buat 1 rencana mitigasi untuk 'Ancaman' terbesar."
    ]
  },
  "TOWS Matrix": {
    "teori": {
      "deskripsi": "Evolusi dari SWOT yang secara langsung memasangkan faktor internal dan eksternal untuk merumuskan strategi yang dapat dieksekusi (Actionable Strategies).",
      "manfaat": "Mengubah analisis SWOT yang pasif menjadi 4 opsi strategi agresif, defensif, adaptif, atau bertahan."
    },
    "layout": {
      "tipe": "Matriks Silang 2x2 Strategi",
      "elemen": [
        "SO (Maxi-Maxi)",
        "ST (Maxi-Mini)",
        "WO (Mini-Maxi)",
        "WT (Mini-Mini)"
      ],
      "visualType": "matrix2x2"
    },
    "draft": [
      {
        "bagian": "SO Strategy",
        "hint": "Bagaimana menggunakan kekuatan untuk merebut peluang?"
      },
      {
        "bagian": "ST Strategy",
        "hint": "Bagaimana menggunakan kekuatan untuk menghindari ancaman?"
      },
      {
        "bagian": "WO Strategy",
        "hint": "Langkah apa untuk meminimalkan kelemahan agar bisa ambil peluang?"
      },
      {
        "bagian": "WT Strategy",
        "hint": "Taktik bertahan untuk meminimalkan kelemahan & menghindari ancaman."
      }
    ],
    "tutorial": [
      {
        "step": "Selesaikan SWOT",
        "desc": "Pastikan Anda sudah memiliki data S, W, O, dan T yang valid."
      },
      {
        "step": "Lakukan Cross-Matching",
        "desc": "Pasangkan poin S1 dengan O2, atau W1 dengan T1."
      },
      {
        "step": "Rumuskan Taktik",
        "desc": "Tulis tindakan spesifik dari hasil persilangan tersebut."
      }
    ],
    "actionPlan": [
      "Pilih 1 Strategi SO untuk dieksekusi sebagai kampanye marketing bulan ini.",
      "Buat SOP baru berdasarkan Strategi WT untuk efisiensi.",
      "Tugaskan 1 manager untuk memantau implementasi."
    ]
  },
  "PESTEL Analysis": {
    "teori": {
      "deskripsi": "Alat makro-ekonomi untuk menganalisis lanskap eksternal: Political, Economic, Social, Technological, Environmental, dan Legal.",
      "manfaat": "Mendeteksi risiko sistemik dan tren makro sebelum berdampak langsung pada operasional bisnis."
    },
    "layout": {
      "tipe": "Daftar 6 Kategori (List)",
      "elemen": [
        "Political",
        "Economic",
        "Social",
        "Technological",
        "Environmental",
        "Legal"
      ],
      "visualType": "list"
    },
    "draft": [
      {
        "bagian": "Political",
        "hint": "Kebijakan pemerintah, stabilitas politik, tarif pajak?"
      },
      {
        "bagian": "Economic",
        "hint": "Daya beli, inflasi, nilai tukar mata uang, suku bunga?"
      },
      {
        "bagian": "Social",
        "hint": "Perubahan gaya hidup, tren demografi, kesadaran kesehatan?"
      },
      {
        "bagian": "Technological",
        "hint": "Inovasi teknologi, otomatisasi, pergeseran platform digital?"
      },
      {
        "bagian": "Environmental",
        "hint": "Isu cuaca, carbon footprint, keberlanjutan bahan baku?"
      },
      {
        "bagian": "Legal",
        "hint": "UU Ketenagakerjaan, sertifikasi Halal/BPOM, perlindungan data?"
      }
    ],
    "tutorial": [
      {
        "step": "Riset Makro",
        "desc": "Tugaskan tim untuk membaca berita industri terkini."
      },
      {
        "step": "Filter Relevansi",
        "desc": "Hapus faktor yang tidak berdampak langsung pada bisnis Anda."
      },
      {
        "step": "Asesmen Dampak",
        "desc": "Beri nilai Tinggi/Sedang/Rendah untuk ancaman dari tiap faktor."
      }
    ],
    "actionPlan": [
      "Identifikasi 1 regulasi (Legal) yang paling mengancam tahun ini.",
      "Adaptasi 1 tren teknologi yang mulai dipakai kompetitor.",
      "Sesuaikan budget marketing berdasarkan daya beli (Economic) kuartal ini."
    ]
  },
  "Porter's Five Forces": {
    "teori": {
      "deskripsi": "Model untuk mengukur tingkat intensitas persaingan dan profitabilitas dalam suatu industri berdasarkan 5 kekuatan tawar-menawar.",
      "manfaat": "Mengetahui seberapa 'berdarah' industri Anda dan mencari posisi aman untuk mempertahankan margin keuntungan."
    },
    "layout": {
      "tipe": "Model Sentral (Cross)",
      "elemen": [
        "Rivalry (Pusat)",
        "New Entrants (Atas)",
        "Buyers (Kiri)",
        "Suppliers (Kanan)",
        "Substitutes (Bawah)"
      ],
      "visualType": "cross"
    },
    "draft": [
      {
        "bagian": "Competitive Rivalry",
        "hint": "Seberapa banyak dan agresif kompetitor saat ini?"
      },
      {
        "bagian": "Threat of New Entrants",
        "hint": "Seberapa mudah pemain baru masuk ke bisnis ini? (Barrier to entry)"
      },
      {
        "bagian": "Bargaining Power of Buyers",
        "hint": "Apakah pembeli mudah pindah ke brand lain? (Switching cost)"
      },
      {
        "bagian": "Bargaining Power of Suppliers",
        "hint": "Apakah supplier memonopoli bahan baku Anda?"
      },
      {
        "bagian": "Threat of Substitutes",
        "hint": "Apakah ada produk alternatif di luar industri Anda? (Misal: Kopi vs Teh)"
      }
    ],
    "tutorial": [
      {
        "step": "Petakan Pemain",
        "desc": "List siapa saja pembeli dominan, supplier kunci, dan rival utama."
      },
      {
        "step": "Evaluasi Kekuatan",
        "desc": "Tentukan siapa yang paling mendikte harga."
      },
      {
        "step": "Cari Keunggulan",
        "desc": "Tingkatkan loyalitas pelanggan atau kunci kontrak eksklusif dengan supplier."
      }
    ],
    "actionPlan": [
      "Buat program loyalitas untuk mengurangi kekuatan tawar pembeli.",
      "Cari 1 supplier cadangan untuk mengamankan rantai pasok.",
      "Lakukan audit fitur produk vs kompetitor terdekat."
    ]
  },
  "VRIO Framework": {
    "teori": {
      "deskripsi": "Alat evaluasi internal untuk menentukan apakah sumber daya/aset perusahaan memiliki keunggulan kompetitif jangka panjang.",
      "manfaat": "Menghindari buang-buang uang pada aset yang mudah ditiru kompetitor."
    },
    "layout": {
      "tipe": "Alur Keputusan 4 Tahap (Flow)",
      "elemen": [
        "Value",
        "Rarity",
        "Imitability",
        "Organization"
      ],
      "visualType": "flow"
    },
    "draft": [
      {
        "bagian": "Value",
        "hint": "Apakah aset ini menambah nilai atau menekan biaya?"
      },
      {
        "bagian": "Rarity",
        "hint": "Apakah aset ini langka dan tidak dimiliki banyak pesaing?"
      },
      {
        "bagian": "Imitability",
        "hint": "Apakah mahal atau sulit bagi pesaing untuk menirunya?"
      },
      {
        "bagian": "Organization",
        "hint": "Apakah perusahaan terorganisir untuk mengeksploitasi aset ini?"
      }
    ],
    "tutorial": [
      {
        "step": "Inventarisasi Aset",
        "desc": "List paten, teknologi, brand, dan tim ahli Anda."
      },
      {
        "step": "Uji dengan V-R-I-O",
        "desc": "Lewati setiap aset melalui 4 pertanyaan secara berurutan."
      },
      {
        "step": "Kategorikan Hasil",
        "desc": "Tentukan apakah aset itu Paritas, Keunggulan Sementara, atau Keunggulan Berkelanjutan."
      }
    ],
    "actionPlan": [
      "Identifikasi 1 aset yang paling VRIO di perusahaan.",
      "Lindungi aset tersebut secara hukum (HAKI, NDA).",
      "Perbaiki sistem internal jika gagal di tahap 'Organization'."
    ]
  },
  "Value Chain Analysis": {
    "teori": {
      "deskripsi": "Memecah proses operasional perusahaan dari bahan baku hingga purna-jual untuk melihat di mana nilai tambah (margin) tercipta.",
      "manfaat": "Mengidentifikasi area pemborosan yang bisa dipotong, atau area layanan yang bisa dinaikkan harganya."
    },
    "layout": {
      "tipe": "Alur Proses Berantai (Flow)",
      "elemen": [
        "Inbound Logistics",
        "Operations",
        "Outbound Logistics",
        "Marketing & Sales",
        "Service"
      ],
      "visualType": "flow"
    },
    "draft": [
      {
        "bagian": "Inbound Logistics",
        "hint": "Efisiensi penerimaan dan penyimpanan bahan baku."
      },
      {
        "bagian": "Operations",
        "hint": "Proses mengubah bahan baku menjadi produk jadi (QC, Mesin)."
      },
      {
        "bagian": "Outbound Logistics",
        "hint": "Sistem pengiriman dan distribusi ke pelanggan."
      },
      {
        "bagian": "Marketing & Sales",
        "hint": "Akuisisi pelanggan dan biaya iklan."
      },
      {
        "bagian": "Support Activities",
        "hint": "Fungsi HR, IT, dan Procurement yang mendukung 4 hal di atas."
      }
    ],
    "tutorial": [
      {
        "step": "Petakan Proses As-Is",
        "desc": "Gambarkan alur kerja saat ini secara jujur."
      },
      {
        "step": "Hitung Biaya & Waktu",
        "desc": "Berapa lama dan mahal setiap tahapan?"
      },
      {
        "step": "Optimasi/Outsource",
        "desc": "Putuskan mana yang bisa diotomatisasi atau diserahkan ke vendor pihak ketiga."
      }
    ],
    "actionPlan": [
      "Temukan 1 proses operasi (bottleneck) yang memperlambat produksi.",
      "Audit biaya logistik pengiriman bulan lalu.",
      "Sederhanakan alur CS (Service) dengan template balasan otomatis."
    ]
  },
  "BCG Matrix": {
    "teori": {
      "deskripsi": "Matriks portofolio produk berdasarkan pangsa pasar (Market Share) dan pertumbuhan pasar (Market Growth).",
      "manfaat": "Memutuskan produk mana yang harus didanai, dipertahankan, atau disuntik mati."
    },
    "layout": {
      "tipe": "Matriks 2x2 Portofolio",
      "elemen": [
        "Stars (Bintang)",
        "Question Marks (Tanda Tanya)",
        "Cash Cows (Sapi Perah)",
        "Dogs (Anjing)"
      ],
      "visualType": "matrix2x2"
    },
    "draft": [
      {
        "bagian": "Stars",
        "hint": "Produk laris di pasar yang sedang tren. Butuh modal besar untuk mendominasi."
      },
      {
        "bagian": "Cash Cows",
        "hint": "Produk stabil, untung besar, tapi pasarnya stagnan. Sumber uang tunai perusahaan."
      },
      {
        "bagian": "Question Marks",
        "hint": "Produk baru di pasar tren, tapi belum laku. Perlu evaluasi apakah mau dibakar uang atau ditutup."
      },
      {
        "bagian": "Dogs",
        "hint": "Produk tidak laku di pasar yang sepi. Harus segera dihentikan."
      }
    ],
    "tutorial": [
      {
        "step": "List Semua Produk/Layanan",
        "desc": "Kumpulkan data penjualan dari setiap SKU atau divisi."
      },
      {
        "step": "Plot ke Matriks",
        "desc": "Bandingkan pertumbuhan vs dominasi pasar."
      },
      {
        "step": "Realokasi Budget",
        "desc": "Ambil uang dari Cash Cows untuk mendanai Stars atau Question Marks."
      }
    ],
    "actionPlan": [
      "Hentikan promosi untuk 1 produk kategori 'Dogs'.",
      "Ambil keuntungan dari 'Cash Cow' untuk budget R&D bulan ini.",
      "Review data 1 'Question Mark', beri deadline 3 bulan untuk naik jadi Star atau ditutup."
    ]
  },
  "GE-McKinsey Matrix": {
    "teori": {
      "deskripsi": "Versi lebih kompleks dari BCG Matrix, menggunakan grid 3x3 untuk menilai daya tarik industri vs kekuatan unit bisnis.",
      "manfaat": "Lebih akurat untuk korporasi/grup usaha dengan banyak unit bisnis yang kompleks."
    },
    "layout": {
      "tipe": "Matriks 3x3 (9 Sel)",
      "elemen": [
        "Invest/Grow (High)",
        "Selectivity (Medium)",
        "Harvest/Divest (Low)"
      ],
      "visualType": "matrix3x3"
    },
    "draft": [
      {
        "bagian": "Industry Attractiveness",
        "hint": "Seberapa menguntungkan industrinya? (Ukuran pasar, margin, regulasi)"
      },
      {
        "bagian": "Competitive Strength",
        "hint": "Seberapa kuat posisi kita di sana? (Pangsa pasar, loyalitas brand)"
      },
      {
        "bagian": "Invest/Grow",
        "hint": "Unit bisnis di sel hijau: prioritaskan modal dan SDM ke sini."
      },
      {
        "bagian": "Harvest/Divest",
        "hint": "Unit bisnis di sel merah: jual aset atau tutup perlahan."
      }
    ],
    "tutorial": [
      {
        "step": "Tentukan Bobot",
        "desc": "Beri bobot pada faktor daya tarik dan kekuatan kompetitif."
      },
      {
        "step": "Skoring",
        "desc": "Beri nilai 1-5 untuk setiap unit bisnis."
      },
      {
        "step": "Plotting & Strategi",
        "desc": "Letakkan di matriks 3x3 dan putuskan arah investasinya."
      }
    ],
    "actionPlan": [
      "Fokuskan 80% budget CAPEX pada unit bisnis kategori 'Invest'.",
      "Mulai kurangi biaya operasional pada unit bisnis 'Harvest'.",
      "Lakukan audit performa untuk unit yang berada di area 'Selectivity'."
    ]
  },
  "Ansoff Matrix": {
    "teori": {
      "deskripsi": "Alat perencanaan strategis untuk mencari arah pertumbuhan bisnis berbasis produk dan pasar (Baru vs Lama).",
      "manfaat": "Menilai risiko pertumbuhan. Semakin menjauh dari produk/pasar saat ini, risiko makin tinggi."
    },
    "layout": {
      "tipe": "Matriks Pertumbuhan 2x2",
      "elemen": [
        "Market Penetration",
        "Product Development",
        "Market Development",
        "Diversification"
      ],
      "visualType": "matrix2x2"
    },
    "draft": [
      {
        "bagian": "Market Penetration",
        "hint": "Jual produk saat ini ke pasar saat ini. (Misal: Diskon, promo bundling, loyalty program)"
      },
      {
        "bagian": "Product Development",
        "hint": "Bikin produk baru untuk pelanggan yang sudah ada. (Misal: Jual case HP ke pembeli HP)"
      },
      {
        "bagian": "Market Development",
        "hint": "Jual produk saat ini ke wilayah/segmen baru. (Misal: Buka cabang di kota lain)"
      },
      {
        "bagian": "Diversification",
        "hint": "Produk baru di pasar yang sama sekali baru. Risiko tertinggi."
      }
    ],
    "tutorial": [
      {
        "step": "Evaluasi Target Sales",
        "desc": "Berapa banyak pertumbuhan yang ingin dicapai?"
      },
      {
        "step": "Pilih Kuadran",
        "desc": "Pilih rute dengan risiko yang paling sanggup ditanggung modal Anda."
      },
      {
        "step": "Susun Taktik",
        "desc": "Siapkan budget marketing atau R&D sesuai pilihan kuadran."
      }
    ],
    "actionPlan": [
      "Buat 1 promo referral (Market Penetration) minggu ini.",
      "Riset 1 kota baru untuk target ekspansi bulan depan.",
      "Survey pelanggan loyal untuk ide produk baru."
    ]
  },
  "Blue Ocean Strategy (ERRC)": {
    "teori": {
      "deskripsi": "Strategi keluar dari persaingan berdarah (Red Ocean) dengan menciptakan ruang pasar baru melalui kerangka ERRC (Eliminate, Reduce, Raise, Create).",
      "manfaat": "Mencapai inovasi nilai (Value Innovation): menekan biaya sekaligus meningkatkan nilai bagi pembeli."
    },
    "layout": {
      "tipe": "Grid ERRC (4 Blok)",
      "elemen": [
        "Eliminate (Hapus)",
        "Reduce (Kurangi)",
        "Raise (Tingkatkan)",
        "Create (Ciptakan)"
      ],
      "visualType": "matrix2x2"
    },
    "draft": [
      {
        "bagian": "Eliminate",
        "hint": "Fitur/proses apa yang dianggap standar industri tapi sebenarnya tidak dipedulikan pelanggan?"
      },
      {
        "bagian": "Reduce",
        "hint": "Apa yang bisa dikurangi jauh di bawah standar industri untuk hemat biaya?"
      },
      {
        "bagian": "Raise",
        "hint": "Apa yang harus ditingkatkan jauh di atas standar industri?"
      },
      {
        "bagian": "Create",
        "hint": "Apa nilai baru yang belum pernah ditawarkan oleh industri ini sama sekali?"
      }
    ],
    "tutorial": [
      {
        "step": "Analisis Pesaing",
        "desc": "Buat kurva nilai (Value Curve) dari kompetitor."
      },
      {
        "step": "Terapkan ERRC",
        "desc": "Tantang setiap asumsi standar industri."
      },
      {
        "step": "Bentuk Pasar Baru",
        "desc": "Targetkan 'Non-Customers' (orang yang belum pernah pakai produk di industri ini)."
      }
    ],
    "actionPlan": [
      "Coret 1 fitur/layanan yang paling banyak memakan biaya namun jarang dipakai pelanggan.",
      "Brainstorming 1 layanan baru (Create) yang tidak dimiliki saingan mana pun.",
      "Wawancara 3 orang yang BUKAN pelanggan Anda untuk tahu alasan mereka."
    ]
  },
  "Value Disciplines Model": {
    "teori": {
      "deskripsi": "Fokus strategis perusahaan dalam 1 dari 3 disiplin utama agar tidak menjadi 'medioker' di segala hal.",
      "manfaat": "Memperjelas identitas brand dan memfokuskan alokasi sumber daya."
    },
    "layout": {
      "tipe": "Tiga Pilar / Segitiga Fokus",
      "elemen": [
        "Operational Excellence",
        "Product Leadership",
        "Customer Intimacy"
      ],
      "visualType": "list"
    },
    "draft": [
      {
        "bagian": "Operational Excellence",
        "hint": "Fokus pada harga murah, kecepatan, dan efisiensi. (Contoh: McDonald's, AirAsia)"
      },
      {
        "bagian": "Product Leadership",
        "hint": "Fokus pada inovasi, desain, dan fitur terbaik. (Contoh: Apple, Tesla)"
      },
      {
        "bagian": "Customer Intimacy",
        "hint": "Fokus pada kustomisasi, layanan personal, dan relasi. (Contoh: Hotel Butik, Private Banking)"
      }
    ],
    "tutorial": [
      {
        "step": "Evaluasi DNA Bisnis",
        "desc": "Di mana kekuatan utama tim Anda saat ini?"
      },
      {
        "step": "Pilih SATU Disiplin",
        "desc": "Anda tidak bisa menjadi yang termurah, terbaik, sekaligus paling personal. Pilih satu."
      },
      {
        "step": "Selaraskan Operasional",
        "desc": "Pastikan SOP, KPI, dan struktur organisasi mendukung disiplin yang dipilih."
      }
    ],
    "actionPlan": [
      "Deklarasikan 1 disiplin utama ke seluruh tim minggu ini.",
      "Ubah 1 KPI karyawan agar sejalan dengan disiplin tersebut.",
      "Hentikan proyek yang berlawanan dengan disiplin utama."
    ]
  },
  "Business Model Canvas (BMC)": {
    "teori": {
      "deskripsi": "Alat visual yang memetakan elemen logika bagaimana bisnis menciptakan, memberikan, dan menangkap nilai (uang).",
      "manfaat": "Memberikan pandangan helikopter tentang fundamental bisnis dalam 1 halaman ringkas."
    },
    "layout": {
      "tipe": "Kanvas 9 Blok",
      "elemen": [
        "Customer Segments",
        "Value Proposition",
        "Channels",
        "Customer Relationships",
        "Revenue Streams",
        "Key Resources",
        "Key Activities",
        "Key Partnerships",
        "Cost Structure"
      ],
      "visualType": "canvas9"
    },
    "draft": [
      {
        "bagian": "Customer Segments",
        "hint": "Siapa spesifik demografi & psikografi audiens Anda?"
      },
      {
        "bagian": "Value Proposition",
        "hint": "Apa 'pain points' pelanggan yang Anda selesaikan?"
      },
      {
        "bagian": "Channels",
        "hint": "Bagaimana cara produk sampai ke pelanggan? (Sosmed, Toko Fisik)"
      },
      {
        "bagian": "Revenue Streams",
        "hint": "Dari mana arus kas masuk? (Jual putus, langganan)"
      },
      {
        "bagian": "Key Activities & Resources",
        "hint": "Apa aset dan kegiatan harian yang wajib ada?"
      }
    ],
    "tutorial": [
      {
        "step": "Mulai dari Kanan",
        "desc": "Isi Segmen Pelanggan dan Proposisi Nilai terlebih dahulu."
      },
      {
        "step": "Geser ke Kiri",
        "desc": "Petakan operasional (Aktivitas, Aset, Partner)."
      },
      {
        "step": "Validasi Finansial",
        "desc": "Pastikan Struktur Biaya lebih kecil dari Arus Pendapatan."
      }
    ],
    "actionPlan": [
      "Cetak BMC ukuran A3 dan isi menggunakan post-it notes.",
      "Validasi 1 asumsi di 'Value Proposition' kepada pelanggan langsung.",
      "Cari 1 'Key Partner' baru untuk menekan biaya operasional."
    ]
  },
  "Lean Canvas": {
    "teori": {
      "deskripsi": "Adaptasi BMC berfokus pada startup oleh Ash Maurya, menggantikan blok operasional dengan Problem, Solution, Key Metrics, dan Unfair Advantage.",
      "manfaat": "Memvalidasi ide bisnis baru dengan cepat dan memitigasi risiko terbesar sebelum modal terlanjur dihabiskan."
    },
    "layout": {
      "tipe": "Kanvas 9 Blok Startup",
      "elemen": [
        "Problem",
        "Solution",
        "Unique Value Proposition",
        "Unfair Advantage",
        "Customer Segments",
        "Key Metrics",
        "Channels",
        "Cost Structure",
        "Revenue Streams"
      ],
      "visualType": "canvas9"
    },
    "draft": [
      {
        "bagian": "Problem",
        "hint": "3 masalah terbesar yang dihadapi target pelanggan saat ini."
      },
      {
        "bagian": "Solution",
        "hint": "3 fitur/solusi utama untuk menyelesaikan masing-masing masalah."
      },
      {
        "bagian": "Unique Value Proposition",
        "hint": "Pesan jelas, menarik, dan berbeda mengapa produk Anda layak dibeli."
      },
      {
        "bagian": "Unfair Advantage",
        "hint": "Keunggulan yang tidak bisa dibeli atau ditiru oleh kompetitor (misal: paten, orang dalam)."
      },
      {
        "bagian": "Key Metrics",
        "hint": "Angka kuantitatif utama (North Star Metric) penentu sukses bisnis."
      }
    ],
    "tutorial": [
      {
        "step": "Identifikasi Problem & Segmen",
        "desc": "Tentukan siapa yang punya masalah paling akut (Early Adopters)."
      },
      {
        "step": "Rumuskan UVP & Solusi",
        "desc": "Buat penawaran spesifik yang mengatasi masalah tersebut."
      },
      {
        "step": "Uji Metrik & Keunggulan",
        "desc": "Tentukan metrik keberhasilan dan identifikasi keunggulan tak adil Anda."
      }
    ],
    "actionPlan": [
      "Wawancarai 5 target pelanggan mengenai 3 masalah utama mereka.",
      "Tentukan 1 Unfair Advantage yang paling sulit ditiru kompetitor.",
      "Tetapkan 1 Key Metric (North Star Metric) bulanan tim."
    ]
  },
  "Value Proposition Canvas": {
    "teori": {
      "deskripsi": "Kerangka karya Strategyzer untuk memastikan kecocokan antara produk (Value Map) dan pasar (Customer Profile).",
      "manfaat": "Mencapai Product-Market Fit (PMF) dengan memetakan Pains & Gains pelanggan terhadap Pain Relievers & Gain Creators produk."
    },
    "layout": {
      "tipe": "Dual Canvas (Customer Profile & Value Map)",
      "elemen": [
        "Customer Jobs",
        "Customer Pains",
        "Customer Gains",
        "Products & Services",
        "Pain Relievers",
        "Gain Creators"
      ],
      "visualType": "matrix2x2"
    },
    "draft": [
      {
        "bagian": "Customer Jobs",
        "hint": "Tugas fungsional, sosial, atau emosional apa yang ingin diselesaikan pelanggan?"
      },
      {
        "bagian": "Customer Pains",
        "hint": "Hal apa yang mengganggu atau merugikan pelanggan sebelum/saat menyelesaikan tugas?"
      },
      {
        "bagian": "Customer Gains",
        "hint": "Hasil positif, keuntungan, atau ekspektasi yang diidamkan pelanggan?"
      },
      {
        "bagian": "Pain Relievers",
        "hint": "Bagaimana spesifik produk Anda meredakan rasa sakit pelanggan?"
      },
      {
        "bagian": "Gain Creators",
        "hint": "Bagaimana produk Anda menciptakan nilai tambah ekstra yang mengejutkan?"
      }
    ],
    "tutorial": [
      {
        "step": "Lengkapi Profil Pelanggan",
        "desc": "Mulai dari sisi kanan: Petakan Jobs, Pains, dan Gains pelanggan secara faktual."
      },
      {
        "step": "Petakan Peta Nilai",
        "desc": "Di sisi kiri, tulis bagaimana produk dan fitur Anda meredakan pain dan menambah gain."
      },
      {
        "step": "Cek Kesesuaian (Fit)",
        "desc": "Tarik garis kecocokan antara poin kiri dan kanan untuk memastikan fit."
      }
    ],
    "actionPlan": [
      "Identifikasi 3 pain points terberat yang belum terselesaikan di pasar.",
      "Ubah 1 fitur produk menjadi 'Pain Reliever' yang lebih solutif.",
      "Uji pesan value proposition baru dalam iklan/landing page minggu ini."
    ]
  },
  "Empathy Map": {
    "teori": {
      "deskripsi": "Alat visual kolaboratif untuk membangun empati mendalam terhadap pengguna atau pembeli sasaran.",
      "manfaat": "Memahami dunia dari sudut pandang pengguna (Apa yang mereka katakan, pikirkan, lakukan, dan rasakan) untuk mendesain solusi yang tepat."
    },
    "layout": {
      "tipe": "Kuadran Empati (Says, Thinks, Does, Feels)",
      "elemen": [
        "Says (Berkata)",
        "Thinks (Berpikir)",
        "Does (Melakukan)",
        "Feels (Merasakan)",
        "Pains",
        "Gains"
      ],
      "visualType": "matrix2x2"
    },
    "draft": [
      {
        "bagian": "Says",
        "hint": "Apa kutipan langsung atau pernyataan yang sering diucapkan pelanggan?"
      },
      {
        "bagian": "Thinks",
        "hint": "Apa kekhawatiran atau pertimbangan yang ada di kepala mereka namun tidak mereka ucapkan?"
      },
      {
        "bagian": "Does",
        "hint": "Tindakan fisik dan kebiasaan nyata apa yang mereka lakukan sehari-hari?"
      },
      {
        "bagian": "Feels",
        "hint": "Emosi apa yang mereka rasakan? (Cemas, bingung, senang, tertekan)"
      },
      {
        "bagian": "Pains & Gains",
        "hint": "Hambatan terbesar dan harapan tertinggi mereka."
      }
    ],
    "tutorial": [
      {
        "step": "Tentukan Persona Target",
        "desc": "Fokus pada satu profil pengguna spesifik (misal: Pemilik toko online usia 25-35)."
      },
      {
        "step": "Isi 4 Kuadran Empati",
        "desc": "Kumpulkan kutipan nyata (Says), amati perilaku (Does), dan telaah motivasi internal (Thinks & Feels)."
      },
      {
        "step": "Tarik Sintesis Kebutuhan",
        "desc": "Petakan ke pain & gain untuk menyusun strategi komunikasi dan produk."
      }
    ],
    "actionPlan": [
      "Lakukan observasi langsung atau dengarkan 3 rekaman panggilan CS minggu ini.",
      "Isi 1 Empathy Map untuk persona pembeli prioritas nomor satu.",
      "Bagikan hasil temuan empati ke tim marketing dan produk."
    ]
  },
  "STP Framework": {
    "teori": {
      "deskripsi": "Kerangka kerja pemasaran klasik (Segmentation, Targeting, Positioning) untuk memilih segmen audiens yang paling menguntungkan dan memposisikan brand di benak mereka.",
      "manfaat": "Menghindari pemborosan budget marketing dengan fokus melayani segmen yang paling membutuhkan dan menghargai produk Anda."
    },
    "layout": {
      "tipe": "Tiga Tahap Corong Pemasaran (STP)",
      "elemen": [
        "Segmentation (Segmentasi)",
        "Targeting (Target Pasar)",
        "Positioning (Diferensiasi & Posisi)"
      ],
      "visualType": "flow"
    },
    "draft": [
      {
        "bagian": "Segmentation",
        "hint": "Bagi pasar berdasarkan geografis, demografis, psikografis, atau perilaku."
      },
      {
        "bagian": "Targeting",
        "hint": "Pilih segmen mana yang paling menarik (ukuran pasar, daya beli, potensi pertumbuhan)."
      },
      {
        "bagian": "Positioning",
        "hint": "Bagaimana Anda ingin brand Anda diingat dibandingkan kompetitor di segmen terpilih?"
      }
    ],
    "tutorial": [
      {
        "step": "Segmentasikan Pasar",
        "desc": "Bagi audiens menjadi beberapa kelompok dengan kebutuhan homogen."
      },
      {
        "step": "Evaluasi & Pilih Target",
        "desc": "Gunakan kriteria profitabilitas dan kapasitas untuk memilih 1-2 target utama."
      },
      {
        "step": "Tentukan Positioning Statement",
        "desc": "Rumuskan kalimat positioning: 'Bagi [Target], [Brand] adalah [Kategori] yang [Manfaat Unik] karena [Alasan Percaya]'."
      }
    ],
    "actionPlan": [
      "Finalisasi 1 positioning statement resmi perusahaan.",
      "Hentikan penargetan audiens yang terbukti memiliki konversi dan retensi rendah.",
      "Sesuaikan pesan promosi agar fokus berbicara pada segmen utama."
    ]
  },
  "4P/7P Marketing Mix": {
    "teori": {
      "deskripsi": "Kombinasi taktis instrumen pemasaran (Product, Price, Place, Promotion + People, Process, Physical Evidence) untuk mempengaruhi permintaan pasar.",
      "manfaat": "Memastikan konsistensi eksekusi bauran pemasaran dari kualitas produk hingga penetapan harga dan saluran distribusi."
    },
    "layout": {
      "tipe": "Matriks Bauran Pemasaran (7 Elemen)",
      "elemen": [
        "Product",
        "Price",
        "Place",
        "Promotion",
        "People",
        "Process",
        "Physical Evidence"
      ],
      "visualType": "list"
    },
    "draft": [
      {
        "bagian": "Product",
        "hint": "Kualitas fitur, kemasan, varian, dan garansi yang ditawarkan."
      },
      {
        "bagian": "Price",
        "hint": "Strategi harga (penetration, skimming, value-based), diskon, dan skema pembayaran."
      },
      {
        "bagian": "Place",
        "hint": "Saluran distribusi dan ketersediaan stok fisik maupun digital."
      },
      {
        "bagian": "Promotion",
        "hint": "Kanal promosi (iklan digital, PR, influencer, promo penjualan)."
      },
      {
        "bagian": "People & Process",
        "hint": "Kualitas SDM garda depan dan kecepatan proses pelayanan transaksi."
      }
    ],
    "tutorial": [
      {
        "step": "Audit Kondisi Saat Ini",
        "desc": "Periksa konsistensi antara Product, Price, Place, dan Promotion."
      },
      {
        "step": "Sesuaikan dengan Target STP",
        "desc": "Pastikan harga dan kanal cocok dengan daya beli target segmen."
      },
      {
        "step": "Pantau ROI Tiap P",
        "desc": "Uji efektivitas masing-masing instrumen pemasaran secara periodik."
      }
    ],
    "actionPlan": [
      "Review struktur harga (Price) dibandingkan 3 kompetitor terdekat.",
      "Optimalkan kecepatan alur transaksi/pembayaran (Process) untuk memangkas drop-off.",
      "Perbaiki tampilan kemasan atau landing page (Physical Evidence)."
    ]
  },
  "Customer Journey Map (CJM)": {
    "teori": {
      "deskripsi": "Visualisasi kronologis setiap titik sentuh (touchpoint) yang dialami pelanggan dari pertama kali mengenal brand hingga menjadi pembeli loyal.",
      "manfaat": "Mendeteksi friction/hambatan di setiap tahap interaksi sehingga konversi dan kepuasan pelanggan melonjak."
    },
    "layout": {
      "tipe": "Peta Garis Waktu Interaksi (Timeline Journey)",
      "elemen": [
        "Awareness",
        "Consideration",
        "Purchase",
        "Retention",
        "Advocacy"
      ],
      "visualType": "flow"
    },
    "draft": [
      {
        "bagian": "Awareness",
        "hint": "Dari mana pelanggan pertama kali tahu tentang Anda? Apa impresi awal mereka?"
      },
      {
        "bagian": "Consideration",
        "hint": "Informasi apa yang mereka cari saat membandingkan produk Anda dengan saingan?"
      },
      {
        "bagian": "Purchase",
        "hint": "Seberapa mudah proses checkout/pembayaran dan penerimaan produk?"
      },
      {
        "bagian": "Retention",
        "hint": "Bagaimana pengalaman onboarding dan layanan purna-jual yang mereka dapatkan?"
      },
      {
        "bagian": "Advocacy",
        "hint": "Apa yang membuat mereka sukarela merekomendasikan produk Anda ke rekan mereka?"
      }
    ],
    "tutorial": [
      {
        "step": "Tetapkan Tahapan Journey",
        "desc": "Urutkan tahapan utama mulai dari tahu, menimbang, membeli, hingga setia."
      },
      {
        "step": "Petakan Tindakan & Titik Gesekan",
        "desc": "Tulis apa yang dilakukan pembeli, titik sentuhnya (website, WhatsApp, CS), dan kendalanya."
      },
      {
        "step": "Prioritaskan Peluang Perbaikan",
        "desc": "Fokus memperbaiki titik sentuh dengan friction terbesar."
      }
    ],
    "actionPlan": [
      "Jajal alur pembelian Anda sendiri sebagai pelanggan misteri (mystery shopper).",
      "Hilangkan 1 langkah birokrasi/input data berlebih di tahap checkout.",
      "Buat follow-up otomatis 3 hari setelah barang diterima untuk memicu retensi."
    ]
  },
  "Kano Model": {
    "teori": {
      "deskripsi": "Kerangka klasifikasi fitur produk karya Noriaki Kano berdasarkan pengaruhnya terhadap kepuasan pelanggan.",
      "manfaat": "Menentukan prioritas pengembangan fitur: mana yang wajib ada (Must-be), pembeda performa (Performance), dan pemicu kejutan menyenangkan (Delighters)."
    },
    "layout": {
      "tipe": "Diagram Kepuasan vs Implementasi (Kano Grid)",
      "elemen": [
        "Must-Be (Wajib)",
        "Performance (Linear)",
        "Attractive (Delighters)",
        "Indifferent (Acuh)",
        "Reverse (Mengganggu)"
      ],
      "visualType": "matrix2x2"
    },
    "draft": [
      {
        "bagian": "Must-Be",
        "hint": "Fitur dasar yang jika tidak ada membuat pelanggan marah, tapi jika ada tidak menambah pujian."
      },
      {
        "bagian": "Performance",
        "hint": "Fitur yang semakin baik semakin membuat pelanggan senang (kecepatan, daya tahan)."
      },
      {
        "bagian": "Attractive (Delighters)",
        "hint": "Fitur kejutan yang tidak diminta tetapi membuat pelanggan takjub."
      },
      {
        "bagian": "Indifferent",
        "hint": "Fitur yang pelanggan tidak peduli ada atau tidak (segera eliminasi jika memakan biaya)."
      }
    ],
    "tutorial": [
      {
        "step": "Survei Kano 2 Arah",
        "desc": "Tanyakan respon pengguna jika fitur ada (fungsional) dan jika fitur tidak ada (disfungsional)."
      },
      {
        "step": "Kategorisasikan ke Matriks",
        "desc": "Petakan setiap fitur ke kategori Must-Be, Performance, Attractive, atau Indifferent."
      },
      {
        "step": "Susun Roadmap",
        "desc": "Penuhi semua Must-be, bersaing di Performance, dan tawarkan 1-2 Delighters."
      }
    ],
    "actionPlan": [
      "Audit fitur produk: hapus 1 fitur kategori 'Indifferent' yang membebani tim.",
      "Sempurnakan fitur 'Must-be' utama agar tidak ada komplain pelanggan.",
      "Eksperimen dengan 1 fitur 'Delighter' berbiaya rendah bulan ini."
    ]
  },
  "Product Life Cycle (PLC)": {
    "teori": {
      "deskripsi": "Siklus hidup produk di pasar yang terdiri dari 4 fase: Pengenalan (Introduction), Pertumbuhan (Growth), Kematangan (Maturity), dan Penurunan (Decline).",
      "manfaat": "Mengarahkan strategi harga, promosi, dan investasi riset sesuai fase kedewasaan produk di pasar."
    },
    "layout": {
      "tipe": "Kurva Siklus Hidup Produk (S-Curve)",
      "elemen": [
        "Introduction (Pengenalan)",
        "Growth (Pertumbuhan)",
        "Maturity (Kematangan)",
        "Decline (Penurunan)"
      ],
      "visualType": "flow"
    },
    "draft": [
      {
        "bagian": "Introduction",
        "hint": "Fase edukasi pasar: biaya tinggi, penjualan awal lambat, perlu promosi intensif."
      },
      {
        "bagian": "Growth",
        "hint": "Fase ekspansi: adopsi massal, penjualan melonjak, kompetitor baru mulai bermunculan."
      },
      {
        "bagian": "Maturity",
        "hint": "Fase stabil: penjualan puncak, persaingan harga ketat, fokus efisiensi dan retensi."
      },
      {
        "bagian": "Decline",
        "hint": "Fase penurunan: pasar beralih ke solusi alternatif baru, margin menipis."
      }
    ],
    "tutorial": [
      {
        "step": "Tentukan Fase Produk",
        "desc": "Analisis data pertumbuhan volume penjualan dan margin laba produk Anda 2 tahun terakhir."
      },
      {
        "step": "Pilih Strategi Sesuai Fase",
        "desc": "Introduction butuh edukasi; Growth butuh ekspansi; Maturity butuh efisiensi; Decline butuh pivot."
      },
      {
        "step": "Siapkan Produk Generasi Berikutnya",
        "desc": "Mulai riset produk baru sebelum produk utama memasuki masa decline."
      }
    ],
    "actionPlan": [
      "Petakan seluruh lini SKU produk Anda ke kurva PLC saat ini.",
      "Kurangi alokasi pemasaran pada produk yang sudah berada di fase 'Decline'.",
      "Persiapkan inovasi/varian baru untuk produk yang mulai jenuh di fase 'Maturity'."
    ]
  }
};

export const allFrameworks: Record<string, FrameworkContent> = {
  ...baseFrameworks,
  ...decisionAndProductFrameworks,
  ...innovationQualityOrgFrameworks,
  ...operationsAndFinanceFrameworks,
  ...salesTechPRFrameworks,
  ...sustainabilityAndHRFrameworks,
};

// Aliases for name variations (curly/straight apostrophes, extended names)
const aliasPairs: [string, string][] = [
  ["Pricing Matrix", "Pricing Matrix & Elasticity"],
  ["Doblin's 10 Types Innovation", "Doblin’s 10 Types Innovation"],
  ["Lencioni's 5 Dysfunctions", "Lencioni’s 5 Dysfunctions"],
  ["Kotter's 8-Step Change", "Kotter’s 8-Step Change"],
  ["Carroll's CSR Pyramid", "Carroll’s CSR Pyramid"],
];

for (const [a, b] of aliasPairs) {
  if (allFrameworks[a] && !allFrameworks[b]) allFrameworks[b] = allFrameworks[a];
  if (allFrameworks[b] && !allFrameworks[a]) allFrameworks[a] = allFrameworks[b];
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[()\/&,]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .trim();
}

export const slugToFrameworkMap: Record<string, string> = {};
export const SLUG_TO_FRAMEWORK_NAME = slugToFrameworkMap;
for (const name of Object.keys(allFrameworks)) {
  slugToFrameworkMap[slugify(name)] = name;
}
for (const cat of CATEGORIES) {
  for (const name of cat.frameworks) {
    slugToFrameworkMap[slugify(name)] = name;
  }
}

export function getFramework(nameOrSlug: string): FrameworkContent {
  if (allFrameworks[nameOrSlug]) return allFrameworks[nameOrSlug];
  const bySlug = slugToFrameworkMap[slugify(nameOrSlug)];
  if (bySlug && allFrameworks[bySlug]) return allFrameworks[bySlug];
  return allFrameworks["SWOT Analysis"] || baseFrameworks["SWOT Analysis"];
}

export const getFrameworkData = getFramework;

export const CATEGORY_TO_PILLAR: Record<string, string> = {};
for (const cat of CATEGORIES) {
  CATEGORY_TO_PILLAR[cat.name] = cat.pillar;
}

export function getPillarByCategory(categoryName: string): MBAPillar | undefined {
  const pillarName = CATEGORY_TO_PILLAR[categoryName];
  if (!pillarName) return undefined;
  return MBA_PILLARS.find((p) => p.name === pillarName);
}
