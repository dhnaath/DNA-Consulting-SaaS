import { Commodity } from "../types";

const generateHistory = (basePrice: number, volatility: number, days: number = 30) => {
  const data = [];
  let currentPrice = basePrice;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toLocaleDateString("id-ID", { month: "short", day: "numeric" }),
      price: Math.round(currentPrice),
    });

    const change = currentPrice * volatility * (Math.random() - 0.48);
    currentPrice += change;
  }

  return data;
};

// Asumsi Harga Saat Ini (IDR)
const GOLD_PRICE_PER_GRAM = 1350000;
const SILVER_PRICE_PER_GRAM = 16000;

const DINAR_WEIGHT = 4.25;
const DIRHAM_WEIGHT = 2.975;

const goldHistory = generateHistory(GOLD_PRICE_PER_GRAM, 0.005);
const silverHistory = generateHistory(SILVER_PRICE_PER_GRAM, 0.01);

const issiHistory = generateHistory(210.5, 0.015);
const jiiHistory = generateHistory(520.3, 0.015);
const jii70History = generateHistory(215.8, 0.015);
const ihsgHistory = generateHistory(7285.4, 0.012);
const lq45History = generateHistory(982.1, 0.014);
const idx30History = generateHistory(504.6, 0.014);
const djimiHistory = generateHistory(9580.0, 0.015);
const msciHistory = generateHistory(2600.0, 0.015);
const sp500shHistory = generateHistory(7900.0, 0.015);

const dinarHistory = goldHistory.map((p) => ({ ...p, price: Math.round(p.price * DINAR_WEIGHT) }));
const dirhamHistory = silverHistory.map((p) => ({
  ...p,
  price: Math.round(p.price * DIRHAM_WEIGHT),
}));

export const MOCK_COMMODITIES: Commodity[] = [
  {
    id: "dinar",
    symbol: "DNR",
    name: "Dinar (Emas)",
    unit: "1 Dinar (4,25g)",
    currentPrice: 0,
    change24h: 0,
    changePercent24h: 0,
    history: dinarHistory,
    weight: DINAR_WEIGHT,
    baseCommodity: "Emas",
    currentBasePrice: 0,
  },
  {
    id: "dirham",
    symbol: "DRM",
    name: "Dirham (Perak)",
    unit: "1 Dirham (2,975g)",
    currentPrice: 0,
    change24h: 0,
    changePercent24h: 0,
    history: dirhamHistory,
    weight: DIRHAM_WEIGHT,
    baseCommodity: "Perak",
    currentBasePrice: 0,
  },
  {
    id: "gold_gram",
    symbol: "XAU/IDR",
    name: "Emas",
    unit: "1 Gram",
    currentPrice: 0,
    change24h: 0,
    changePercent24h: 0,
    history: goldHistory,
    weight: 1,
    baseCommodity: "Emas",
    currentBasePrice: 0,
  },
  {
    id: "silver_gram",
    symbol: "XAG/IDR",
    name: "Perak",
    unit: "1 Gram",
    currentPrice: 0,
    change24h: 0,
    changePercent24h: 0,
    history: silverHistory,
    weight: 1,
    baseCommodity: "Perak",
    currentBasePrice: 0,
  },
  {
    id: "issi",
    symbol: "ISSI",
    name: "Indeks Saham Syariah",
    unit: "Poin",
    currentPrice: 0,
    change24h: 0,
    changePercent24h: 0,
    history: issiHistory,
    isIndex: true,
  },
  {
    id: "jii",
    symbol: "JII",
    name: "Jakarta Islamic Index",
    unit: "Poin",
    currentPrice: 0,
    change24h: 0,
    changePercent24h: 0,
    history: jiiHistory,
    isIndex: true,
  },
  {
    id: "jii70",
    symbol: "JII70",
    name: "Jakarta Islamic Index 70",
    unit: "Poin",
    currentPrice: 0,
    change24h: 0,
    changePercent24h: 0,
    history: jii70History,
    isIndex: true,
  },
  {
    id: "djimi",
    symbol: "DJIMI",
    name: "Dow Jones Islamic",
    unit: "Poin",
    currentPrice: 0,
    change24h: 0,
    changePercent24h: 0,
    history: djimiHistory,
    isIndex: true,
  },
  {
    id: "msci",
    symbol: "MSCI",
    name: "MSCI ACWI Islamic",
    unit: "Poin",
    currentPrice: 0,
    change24h: 0,
    changePercent24h: 0,
    history: msciHistory,
    isIndex: true,
  },
  {
    id: "sp500sh",
    symbol: "SP500SH",
    name: "S&P 500 Shariah",
    unit: "Poin",
    currentPrice: 0,
    change24h: 0,
    changePercent24h: 0,
    history: sp500shHistory,
    isIndex: true,
  },
  {
    id: "ihsg",
    symbol: "IHSG",
    name: "IHSG (IDX Composite)",
    unit: "Poin",
    currentPrice: 0,
    change24h: 0,
    changePercent24h: 0,
    history: ihsgHistory,
    isIndex: true,
  },
  {
    id: "lq45",
    symbol: "LQ45",
    name: "Indeks LQ45 BEI",
    unit: "Poin",
    currentPrice: 0,
    change24h: 0,
    changePercent24h: 0,
    history: lq45History,
    isIndex: true,
  },
  {
    id: "idx30",
    symbol: "IDX30",
    name: "Indeks IDX30 BEI",
    unit: "Poin",
    currentPrice: 0,
    change24h: 0,
    changePercent24h: 0,
    history: idx30History,
    isIndex: true,
  },
];

// Menyelaraskan harga saat ini dengan titik data historis terakhir
MOCK_COMMODITIES.forEach((c) => {
  const last = c.history[c.history.length - 1];
  const prev = c.history[c.history.length - 2];
  c.currentPrice = last.price;
  c.change24h = last.price - prev.price;
  c.changePercent24h = (c.change24h / prev.price) * 100;

  if (c.baseCommodity === "Emas") {
    c.currentBasePrice = goldHistory[goldHistory.length - 1].price;
  } else if (c.baseCommodity === "Perak") {
    c.currentBasePrice = silverHistory[silverHistory.length - 1].price;
  }
});

export const INDICES_DATA = {
  JII: {
    name: "Jakarta Islamic Index (JII)",
    description:
      "30 saham syariah paling likuid dan berkapitalisasi besar di Bursa Efek Indonesia (Periode 2024).",
    companies: [
      { ticker: "ACES", name: "Aspirasi Hidup Indonesia Tbk.", sector: "Consumer Cyclicals" },
      { ticker: "ADRO", name: "Adaro Energy Indonesia Tbk.", sector: "Energy" },
      { ticker: "AKRA", name: "AKR Corporindo Tbk.", sector: "Energy" },
      { ticker: "AMMN", name: "Amman Mineral Internasional Tbk.", sector: "Basic Materials" },
      { ticker: "ANTM", name: "Aneka Tambang Tbk.", sector: "Basic Materials" },
      { ticker: "BRIS", name: "Bank Syariah Indonesia Tbk.", sector: "Financials" },
      { ticker: "BRPT", name: "Barito Pacific Tbk.", sector: "Basic Materials" },
      { ticker: "CPIN", name: "Charoen Pokphand Indonesia Tbk.", sector: "Consumer Non-Cyclicals" },
      { ticker: "EXCL", name: "XL Axiata Tbk.", sector: "Infrastructures" },
      { ticker: "GOTO", name: "GoTo Gojek Tokopedia Tbk.", sector: "Technology" },
      { ticker: "HRUM", name: "Harum Energy Tbk.", sector: "Energy" },
      { ticker: "ICBP", name: "Indofood CBP Sukses Makmur Tbk.", sector: "Consumer Non-Cyclicals" },
      { ticker: "INCO", name: "Vale Indonesia Tbk.", sector: "Basic Materials" },
      { ticker: "INDF", name: "Indofood Sukses Makmur Tbk.", sector: "Consumer Non-Cyclicals" },
      { ticker: "INKP", name: "Indah Kiat Pulp & Paper Tbk.", sector: "Basic Materials" },
      { ticker: "INTP", name: "Indocement Tunggal Prakarsa Tbk.", sector: "Basic Materials" },
      { ticker: "ITMG", name: "Indo Tambangraya Megah Tbk.", sector: "Energy" },
      { ticker: "KLBF", name: "Kalbe Farma Tbk.", sector: "Healthcare" },
      { ticker: "MAPI", name: "Mitra Adiperkasa Tbk.", sector: "Consumer Cyclicals" },
      { ticker: "MDKA", name: "Merdeka Copper Gold Tbk.", sector: "Basic Materials" },
      { ticker: "MEDC", name: "Medco Energi Internasional Tbk.", sector: "Energy" },
      { ticker: "PGAS", name: "Perusahaan Gas Negara Tbk.", sector: "Infrastructures" },
      { ticker: "PTBA", name: "Bukit Asam Tbk.", sector: "Energy" },
      { ticker: "SCMA", name: "Surya Citra Media Tbk.", sector: "Consumer Cyclicals" },
      { ticker: "SMGR", name: "Semen Indonesia (Persero) Tbk.", sector: "Basic Materials" },
      { ticker: "TKIM", name: "Pabrik Kertas Tjiwi Kimia Tbk.", sector: "Basic Materials" },
      { ticker: "TLKM", name: "Telkom Indonesia (Persero) Tbk.", sector: "Infrastructures" },
      { ticker: "TPIA", name: "Chandra Asri Pacific Tbk.", sector: "Basic Materials" },
      { ticker: "UNTR", name: "United Tractors Tbk.", sector: "Industrials" },
      { ticker: "UNVR", name: "Unilever Indonesia Tbk.", sector: "Consumer Non-Cyclicals" },
    ],
  },
  JII70: {
    name: "Jakarta Islamic Index 70 (JII70)",
    description:
      "70 saham syariah paling likuid di Bursa Efek Indonesia (Menampilkan konstituen utama).",
    companies: [
      { ticker: "ACES", name: "Aspirasi Hidup Indonesia Tbk.", sector: "Consumer Cyclicals" },
      { ticker: "ADRO", name: "Adaro Energy Indonesia Tbk.", sector: "Energy" },
      { ticker: "AKRA", name: "AKR Corporindo Tbk.", sector: "Energy" },
      { ticker: "AMMN", name: "Amman Mineral Internasional Tbk.", sector: "Basic Materials" },
      { ticker: "ANTM", name: "Aneka Tambang Tbk.", sector: "Basic Materials" },
      { ticker: "BRIS", name: "Bank Syariah Indonesia Tbk.", sector: "Financials" },
      { ticker: "BRPT", name: "Barito Pacific Tbk.", sector: "Basic Materials" },
      { ticker: "BTPS", name: "Bank BTPN Syariah Tbk.", sector: "Financials" },
      { ticker: "CPIN", name: "Charoen Pokphand Indonesia Tbk.", sector: "Consumer Non-Cyclicals" },
      { ticker: "CTRA", name: "Ciputra Development Tbk.", sector: "Properties & Real Estate" },
      { ticker: "DSNG", name: "Dharma Satya Nusantara Tbk.", sector: "Consumer Non-Cyclicals" },
      { ticker: "ERAA", name: "Erajaya Swasembada Tbk.", sector: "Consumer Cyclicals" },
      { ticker: "EXCL", name: "XL Axiata Tbk.", sector: "Infrastructures" },
      { ticker: "GOTO", name: "GoTo Gojek Tokopedia Tbk.", sector: "Technology" },
      { ticker: "HEAL", name: "Medikaloka Hermina Tbk.", sector: "Healthcare" },
      { ticker: "HRUM", name: "Harum Energy Tbk.", sector: "Energy" },
      { ticker: "ICBP", name: "Indofood CBP Sukses Makmur Tbk.", sector: "Consumer Non-Cyclicals" },
      { ticker: "INCO", name: "Vale Indonesia Tbk.", sector: "Basic Materials" },
      { ticker: "INDF", name: "Indofood Sukses Makmur Tbk.", sector: "Consumer Non-Cyclicals" },
      { ticker: "INKP", name: "Indah Kiat Pulp & Paper Tbk.", sector: "Basic Materials" },
      { ticker: "INTP", name: "Indocement Tunggal Prakarsa Tbk.", sector: "Basic Materials" },
      { ticker: "ITMG", name: "Indo Tambangraya Megah Tbk.", sector: "Energy" },
      { ticker: "JPFA", name: "Japfa Comfeed Indonesia Tbk.", sector: "Consumer Non-Cyclicals" },
      { ticker: "KLBF", name: "Kalbe Farma Tbk.", sector: "Healthcare" },
      {
        ticker: "LSIP",
        name: "PP London Sumatra Indonesia Tbk.",
        sector: "Consumer Non-Cyclicals",
      },
      { ticker: "MAPI", name: "Mitra Adiperkasa Tbk.", sector: "Consumer Cyclicals" },
      { ticker: "MDKA", name: "Merdeka Copper Gold Tbk.", sector: "Basic Materials" },
      { ticker: "MEDC", name: "Medco Energi Internasional Tbk.", sector: "Energy" },
      { ticker: "MIKA", name: "Mitra Keluarga Karyasehat Tbk.", sector: "Healthcare" },
      { ticker: "MTEL", name: "Dayamitra Telekomunikasi Tbk.", sector: "Infrastructures" },
      { ticker: "MYOR", name: "Mayora Indah Tbk.", sector: "Consumer Non-Cyclicals" },
      { ticker: "PGAS", name: "Perusahaan Gas Negara Tbk.", sector: "Infrastructures" },
      { ticker: "PNLF", name: "Panin Financial Tbk.", sector: "Financials" },
      { ticker: "PTBA", name: "Bukit Asam Tbk.", sector: "Energy" },
      { ticker: "SCMA", name: "Surya Citra Media Tbk.", sector: "Consumer Cyclicals" },
      { ticker: "SIDO", name: "Industri Jamu Dan Farmasi Sido Muncul Tbk.", sector: "Healthcare" },
      { ticker: "SILO", name: "Siloam International Hospitals Tbk.", sector: "Healthcare" },
      { ticker: "SMGR", name: "Semen Indonesia (Persero) Tbk.", sector: "Basic Materials" },
      { ticker: "SMRA", name: "Summarecon Agung Tbk.", sector: "Properties & Real Estate" },
      { ticker: "TAPG", name: "Triputra Agro Persada Tbk.", sector: "Consumer Non-Cyclicals" },
      { ticker: "TKIM", name: "Pabrik Kertas Tjiwi Kimia Tbk.", sector: "Basic Materials" },
      { ticker: "TLKM", name: "Telkom Indonesia (Persero) Tbk.", sector: "Infrastructures" },
      { ticker: "TPIA", name: "Chandra Asri Pacific Tbk.", sector: "Basic Materials" },
      { ticker: "UNTR", name: "United Tractors Tbk.", sector: "Industrials" },
      { ticker: "UNVR", name: "Unilever Indonesia Tbk.", sector: "Consumer Non-Cyclicals" },
      { ticker: "WIKA", name: "Wijaya Karya (Persero) Tbk.", sector: "Infrastructures" },
    ],
  },
  ISSI: {
    name: "Indeks Saham Syariah Indonesia (ISSI)",
    description:
      "Seluruh saham syariah yang tercatat di Bursa Efek Indonesia (Menampilkan konstituen unggulan).",
    companies: [
      { ticker: "GOTO", name: "GoTo Gojek Tokopedia Tbk.", sector: "Technology" },
      { ticker: "AMMN", name: "Amman Mineral Internasional Tbk.", sector: "Basic Materials" },
      { ticker: "BREN", name: "Barito Renewables Energy Tbk.", sector: "Infrastructures" },
      { ticker: "CUAN", name: "Petrindo Semesta Kreasi Tbk.", sector: "Energy" },
      { ticker: "NISP", name: "Bank OCBC NISP Tbk.", sector: "Financials" },
      { ticker: "SILO", name: "Siloam International Hospitals Tbk.", sector: "Healthcare" },
      { ticker: "MAPA", name: "MAP Aktif Adiperkasa Tbk.", sector: "Consumer Cyclicals" },
      { ticker: "PGEO", name: "Pertamina Geothermal Energy Tbk.", sector: "Infrastructures" },
      { ticker: "FILM", name: "MD Pictures Tbk.", sector: "Consumer Cyclicals" },
      { ticker: "CMRY", name: "Cisarua Mountain Dairy Tbk.", sector: "Consumer Non-Cyclicals" },
      { ticker: "BRIS", name: "Bank Syariah Indonesia Tbk.", sector: "Financials" },
      { ticker: "TLKM", name: "Telkom Indonesia Tbk.", sector: "Infrastructures" },
    ],
  },
};

export type IndexKey = keyof typeof INDICES_DATA;

