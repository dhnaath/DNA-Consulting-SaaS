export interface TranslationItem {
  id: string;
  en: string;
  ms?: string;
  zh?: string;
  [key: string]: string | undefined;
}

export interface TabItem {
  id: string;
  en: string;
  desc: TranslationItem;
  [key: string]: any;
}

export interface CategoryInfo {
  title: string;
  desc: TranslationItem;
  long: TranslationItem;
}

export interface TranslationsSchema {
  landing: {
    greeting: TranslationItem;
    summary: TranslationItem;
    categories: {
      surety: CategoryInfo;
      flow: CategoryInfo;
      build: CategoryInfo;
      grow: CategoryInfo;
      legacy: CategoryInfo;
    };
  };
  settings: {
    title: TranslationItem;
    appLock: TranslationItem;
    currency: TranslationItem;
    notifications: TranslationItem;
    export: TranslationItem;
    more: TranslationItem;
  };
  surety: {
    viewTitle: TranslationItem;
    tabs: TabItem[];
  };
  flow: {
    viewTitle: TranslationItem;
    tabs: TabItem[];
  };
  build: {
    viewTitle: TranslationItem;
    tabs: TabItem[];
  };
  grow: {
    viewTitle: TranslationItem;
    tabs: TabItem[];
  };
  legacy: {
    viewTitle: TranslationItem;
    tabs: TabItem[];
  };
  [key: string]: any;
}

export const translations: TranslationsSchema = {
  landing: {
    greeting: {
      id: "Selamat",
      en: "Good",
      ms: "Selamat",
      zh: "你好",
    },
    summary: {
      id: "Ikhtisar keuangan dan manajemen kekayaan pribadi Anda.",
      en: "Your personal financial overview and wealth management.",
      ms: "Gambaran keseluruhan kewangan dan pengurusan kekayaan peribadi anda.",
      zh: "您的个人财务概览与财富管理。",
    },
    categories: {
      surety: {
        title: "Surety",
        desc: {
          id: "Jaminan Keuangan & Perlindungan Dasar",
          en: "Financial Surety & Basic Protection",
          ms: "Jaminan Kewangan & Perlindungan Asas",
          zh: "财务保障与基础防护",
        },
        long: {
          id: "Fondasi ketahanan finansial, dana darurat, proteksi risiko, dan likuiditas dasar.",
          en: "Foundations of financial resilience, emergency funds, risk protection, and liquid reserves.",
          ms: "Asas ketahanan kewangan, dana kecemasan, perlindungan risiko, dan rizab cair.",
          zh: "财务韧性基础、应急基金、风险防护与基础流动资金。",
        },
      },
      flow: {
        title: "Flow",
        desc: {
          id: "Arus Kas & Pengelolaan Pendapatan",
          en: "Cash Flow & Income Management",
          ms: "Aliran Tunai & Pengurusan Pendapatan",
          zh: "现金流与收入管理",
        },
        long: {
          id: "Manajemen arus masuk dan keluar, pengeluaran terukur, dan optimalisasi likuiditas.",
          en: "Managing inflows and outflows, measured expenditures, and liquidity optimization.",
          ms: "Mengurus aliran masuk dan keluar, perbelanjaan terukur, dan pengoptimuman kecairan.",
          zh: "管理收支现金流、精细化开支管控与流动性优化。",
        },
      },
      build: {
        title: "Build",
        desc: {
          id: "Pembangunan Aset Produktif & Investasi",
          en: "Productive Asset Building & Investment",
          ms: "Pembinaan Aset Produktif & Pelaburan",
          zh: "生产性资产建设与投资",
        },
        long: {
          id: "Akumulasi aset modal, instrumen investasi, dan peningkatan nilai kekayaan bersih.",
          en: "Capital asset accumulation, investment vehicles, and net worth value expansion.",
          ms: "Pengumpulan aset modal, instrumen pelaburan, dan peningkatan nilai kekayaan bersih.",
          zh: "资本资产积累、投资工具配置与净资产稳健增长。",
        },
      },
      grow: {
        title: "Grow",
        desc: {
          id: "Pertumbuhan & Skalabilitas Usaha",
          en: "Business Growth & Scalability",
          ms: "Pertumbuhan & Skala Perniagaan",
          zh: "企业成长与商业规模化",
        },
        long: {
          id: "Ekspansi bisnis, diversifikasi portofolio, dan penggandaan nilai tambah ekonomi.",
          en: "Business expansion, portfolio diversification, and economic value compounding.",
          ms: "Peluasan perniagaan, kepelbagaian portfolio, dan penggandaan nilai ekonomi.",
          zh: "商业版图拓展、多元化投资组合与经济复利倍增。",
        },
      },
      legacy: {
        title: "Legacy",
        desc: {
          id: "Warisan, Filantropi & Dampak Berkelanjutan",
          en: "Legacy, Philanthropy & Lasting Impact",
          ms: "Warisan, Filantropi & Impak Berkekalan",
          zh: "财富传承、公益慈善与持续影响",
        },
        long: {
          id: "Perencanaan suksesi aset, wakaf, zakat, dan dampak generasi mendatang.",
          en: "Asset succession planning, endowment, zakat, and multi-generational impact.",
          ms: "Perancangan pewarisan aset, wakaf, zakat, dan impak generasi akan datang.",
          zh: "资产传承规划、家族信托、慈善公益与跨代影响力。",
        },
      },
    },
  },
  settings: {
    title: { id: "Pengaturan", en: "Settings", ms: "Tetapan", zh: "设置" },
    appLock: { id: "Kunci Aplikasi", en: "App Lock", ms: "Kunci Aplikasi", zh: "应用锁" },
    currency: { id: "Mata Uang", en: "Currency", ms: "Mata Wang", zh: "货币" },
    notifications: { id: "Notifikasi", en: "Notifications", ms: "Pemberitahuan", zh: "通知" },
    export: { id: "Ekspor Data", en: "Export Data", ms: "Eksport Data", zh: "导出数据" },
    more: { id: "Pengaturan Lainnya", en: "More Settings", ms: "Tetapan Lain", zh: "更多设置" },
  },
  surety: {
    viewTitle: { id: "Jaminan & Proteksi", en: "Surety & Protection", ms: "Jaminan & Perlindungan", zh: "保障与防护" },
    tabs: [
      {
        id: "Kepatuhan Hukum",
        en: "Legal Compliance",
        desc: {
          id: "Tata kelola, kontrak, dan kepatuhan regulasi finansial",
          en: "Governance, contracts, and financial regulatory compliance",
        },
      },
      {
        id: "Catatan Publik",
        en: "Public Records",
        desc: {
          id: "Pencatatan aset, hak cipta, dan kepemilikan terverifikasi",
          en: "Asset records, copyrights, and verified ownership",
        },
      },
      {
        id: "Asuransi & Proteksi",
        en: "Insurance & Protection",
        desc: {
          id: "Manajemen polis perlindungan jiwa, kesehatan, dan aset",
          en: "Life, health, and property insurance policy management",
        },
      },
      {
        id: "Dana Darurat",
        en: "Emergency Fund",
        desc: {
          id: "Alokasi likuiditas cadangan untuk kontinjensi darurat",
          en: "Liquid reserve allocations for unexpected contingencies",
        },
      },
      {
        id: "Proteksi Aset",
        en: "Asset Protection",
        desc: {
          id: "Perlindungan kepemilikan dan mitigasi risiko kebangkrutan",
          en: "Ownership safeguards and bankruptcy risk mitigation",
        },
      },
    ],
  },
  flow: {
    viewTitle: { id: "Arus Kas & Pengeluaran", en: "Cash Flow & Expenses", ms: "Aliran Tunai & Perbelanjaan", zh: "现金流与开支" },
    tabs: [
      {
        id: "Liabilitas & Hutang",
        en: "Liabilities & Debt",
        desc: {
          id: "Pelacakan pinjaman, amortisasi, dan strategi pelunasan",
          en: "Loan tracking, amortization, and payoff strategies",
        },
      },
      {
        id: "Pengeluaran & Anggaran",
        en: "Expenses & Budget",
        desc: {
          id: "Monitoring alokasi pengeluaran bulanan dan efisiensi biaya",
          en: "Monthly budget tracking and expenditure efficiency",
        },
      },
      {
        id: "Kredit & Pinjaman",
        en: "Credit & Borrowing",
        desc: {
          id: "Manajemen kartu kredit, skor kredit, dan limit pinjaman",
          en: "Credit card, score, and borrowing limits management",
        },
      },
      {
        id: "Perencanaan Pajak",
        en: "Tax Planning",
        desc: {
          id: "Optimasi kewajiban pajak, potongan legal, dan pelaporan",
          en: "Tax liability optimization, deductions, and reporting",
        },
      },
      {
        id: "Otomatisasi Kas",
        en: "Cash Automation",
        desc: {
          id: "Penyusunan auto-debit, sweep account, dan transfer berkala",
          en: "Automated debits, sweep accounts, and scheduled transfers",
        },
      },
    ],
  },
  build: {
    viewTitle: { id: "Pembangunan Aset", en: "Asset Building", ms: "Pembinaan Aset", zh: "资产构建" },
    tabs: [
      {
        id: "Aset Intelektual",
        en: "Intellectual Property",
        desc: {
          id: "Monetisasi keahlian, paten, dan hak kekayaan intelektual",
          en: "Expertise monetization, patents, and IP assets",
        },
      },
      {
        id: "Jejaring & Modal Sosial",
        en: "Social Capital & Network",
        desc: {
          id: "Kemitraan strategis, aliansi bisnis, dan reputasi modal",
          en: "Strategic partnerships, alliances, and reputational capital",
        },
      },
      {
        id: "Bisnis & Ekuitas",
        en: "Business & Equity",
        desc: {
          id: "Investasi bisnis langsung, kemitraan operasi, dan dividen",
          en: "Direct business investments, operating partnerships, dividends",
        },
      },
      {
        id: "Properti & Real Estate",
        en: "Real Estate & Land",
        desc: {
          id: "Portofolio properti produktif, sewa, dan apresiasi nilai",
          en: "Productive real estate, rental yield, capital appreciation",
        },
      },
      {
        id: "Investasi & Portofolio",
        en: "Portfolio Investments",
        desc: {
          id: "Instrumen pasar modal, obligasi, dan reksadana pilihan",
          en: "Capital markets, bonds, and curated mutual funds",
        },
      },
    ],
  },
  grow: {
    viewTitle: { id: "Pertumbuhan & Skalabilitas", en: "Growth & Scale", ms: "Pertumbuhan & Skala", zh: "成长与规模" },
    tabs: [
      {
        id: "Profil Risiko",
        en: "Risk Profile",
        desc: {
          id: "Evaluasi toleransi risiko dan kalkulasi imbal hasil investasi",
          en: "Risk tolerance assessment and expected return modelling",
        },
      },
      {
        id: "Alokasi Aset",
        en: "Asset Allocation",
        desc: {
          id: "Diversifikasi portofolio lintas kelas aset secara optimal",
          en: "Optimal multi-asset class portfolio diversification",
        },
      },
      {
        id: "Efisiensi Modal",
        en: "Capital Efficiency",
        desc: {
          id: "Pengukuran ROI, ROE, dan pemanfaatan modal optimal",
          en: "ROI, ROE metrics, and optimal capital utilization",
        },
      },
      {
        id: "Bunga Majemuk",
        en: "Compound Growth",
        desc: {
          id: "Simulasi proyeksi efek bunga majemuk jangka panjang",
          en: "Long-term compounding projection simulations",
        },
      },
      {
        id: "Rebalancing Otomatis",
        en: "Portfolio Rebalancing",
        desc: {
          id: "Penyesuaian bobot portofolio berkala menuju target",
          en: "Periodic portfolio rebalancing towards target weights",
        },
      },
    ],
  },
  legacy: {
    viewTitle: { id: "Warisan & Filantropi", en: "Legacy & Philanthropy", ms: "Warisan & Filantropi", zh: "财富传承" },
    tabs: [
      {
        id: "Pembelajaran & Edukasi",
        en: "Education & Learning",
        desc: {
          id: "Dana pendidikan keluarga dan pengembangan kapasitas generasi",
          en: "Family education trusts and generational capacity building",
        },
      },
      {
        id: "Tata Kelola & Suksesi",
        en: "Governance & Succession",
        desc: {
          id: "Struktur kepemilikan keluarga dan perencanaan suksesi",
          en: "Family governance structure and succession planning",
        },
      },
      {
        id: "Amal & Zakat",
        en: "Charity & Zakat",
        desc: {
          id: "Penyaluran zakat, infak, sedekah, dan wakaf produktif",
          en: "Zakat, endowment, and productive charitable contributions",
        },
      },
      {
        id: "Likuidasi & Exit",
        en: "Liquidation & Exit",
        desc: {
          id: "Strategi exit bisnis, likuidasi bertahap, dan monetisasi",
          en: "Business exit strategies, phased liquidation, and monetization",
        },
      },
      {
        id: "Transfer Kekayaan",
        en: "Wealth Transfer",
        desc: {
          id: "Pewarisan terstruktur dan perlindungan warisan antar generasi",
          en: "Structured inheritance and generational wealth preservation",
        },
      },
    ],
  },
};
