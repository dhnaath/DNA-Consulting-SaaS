export type Term = {
  code: string;
  name: string;
  description: string;
};

export type Group = {
  id: string;
  title: string;
  subtitle: string;
  terms: Term[];
  colorHint: string;
};

export const incotermData: Group[] = [
  {
    id: "E",
    title: "Grup E Incoterms®",
    subtitle: "Keberangkatan",
    colorHint: "bg-emerald-50 text-emerald-700 border-emerald-200",
    terms: [
      {
        code: "EXW",
        name: "Ex Works",
        description:
          "Penjual menyediakan barang di tempat mereka (pabrik, gudang, dll.). Pembeli menanggung semua biaya dan risiko transportasi sejak saat itu hingga barang tiba di tujuan akhir.",
      },
    ],
  },
  {
    id: "F",
    title: "Grup F Incoterms®",
    subtitle: "Bawaan Utama Tidak Dibayar",
    colorHint: "bg-blue-50 text-blue-700 border-blue-200",
    terms: [
      {
        code: "FCA",
        name: "Carrier Free",
        description:
          "Penjual menyerahkan barang yang telah diurus izin ekspornya kepada pengangkut yang ditunjuk oleh pembeli di lokasi yang disepakati.",
      },
      {
        code: "FAS",
        name: "Free Alongside Ship",
        description:
          "Penjual menempatkan barang di samping kapal yang ditunjuk pembeli di pelabuhan pengapalan yang ditentukan. Risiko dan biaya beralih ke pembeli sejak saat itu.",
      },
      {
        code: "FOB",
        name: "Free on Board",
        description:
          "Penjual bertanggung jawab memuat barang ke atas kapal yang ditunjuk pembeli di pelabuhan keberangkatan.",
      },
    ],
  },
  {
    id: "C",
    title: "Grup C Incoterms®",
    subtitle: "Bawaan Utama Dibayar",
    colorHint: "bg-amber-50 text-amber-700 border-amber-200",
    terms: [
      {
        code: "CFR",
        name: "Cost and Freight",
        description:
          "Penjual membayar biaya pengiriman hingga pelabuhan tujuan, namun risiko beralih kepada pembeli saat barang dimuat di kapal di pelabuhan asal.",
      },
      {
        code: "CIF",
        name: "Cost and Freight Insurance",
        description:
          "Sama dengan CFR, namun penjual juga wajib membeli asuransi untuk menutupi risiko kehilangan atau kerusakan barang selama perjalanan.",
      },
      {
        code: "CPT",
        name: "Carriage Paid To",
        description:
          "Penjual membayar biaya transportasi ke tempat tujuan yang disebutkan. Risiko beralih ke pembeli saat barang diserahkan kepada pengangkut pertama.",
      },
      {
        code: "CIP",
        name: "Carriage and Insurance Paid to",
        description:
          "Mirip dengan CPT, namun penjual juga bertanggung jawab untuk mengurus dan membayar asuransi pengangkutan barang.",
      },
    ],
  },
  {
    id: "D",
    title: "Grup D Incoterms®",
    subtitle: "Kedatangan",
    colorHint: "bg-indigo-50 text-indigo-700 border-indigo-200",
    terms: [
      {
        code: "DAP",
        name: "Delivered at Place",
        description:
          "Penjual bertanggung jawab mengirimkan barang hingga siap dibongkar dari sarana angkutan yang tiba di lokasi tujuan yang ditentukan.",
      },
      {
        code: "DPU",
        name: "Delivered at Place Unloaded",
        description:
          "Penjual menanggung semua biaya dan risiko hingga barang dibongkar (diturunkan) di terminal atau tempat tujuan yang disepakati.",
      },
      {
        code: "DDP",
        name: "Delivery Duty Paid",
        description:
          "Tanggung jawab maksimal penjual: menyerahkan barang ke tempat tujuan pembeli, termasuk menanggung semua biaya, risiko, dan mengurus izin masuk, bea cukai, serta pajak impor.",
      },
    ],
  },
];
