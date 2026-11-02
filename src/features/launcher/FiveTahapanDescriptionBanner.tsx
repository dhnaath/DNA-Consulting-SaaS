import { ShieldCheck, Coins, Building, Sprout, BookOpen } from "lucide-react";

export const FIVE_TAHAPAN_WEALTH = [
  {
    step: 1,
    id: "surety",
    name: "Surety",
    subtitle: "Mitigasi dan Kepastian Risiko",
    icon: ShieldCheck,
    colorClass: "from-blue-500/20 via-blue-500/5 to-transparent border-blue-500/30 text-blue-600 dark:text-blue-400",
    badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25",
    items: [
      { num: 1, text: "Instrumen hukum dan institusional yang berfungsi sebagai penjamin terhadap risiko kegagalan atau kelalaian finansial." },
      { num: 2, text: "Lapisan ketahanan sistemik yang melindungi aset dan aliran nilai dari peristiwa tak terduga serta gangguan struktural." },
      { num: 3, text: "Syarat minimum stabilitas finansial yang harus terpenuhi sebelum proses pertumbuhan dan ekspansi nilai dimulai." },
      { num: 4, text: "Prinsip dasar perlindungan dalam sistem keuangan yang memastikan terpenuhinya kewajiban dan terjaganya stabilitas nilai ekonomi." },
      { num: 5, text: "Fondasi keamanan ekonomi yang memungkinkan perencanaan, akumulasi, dan pengembangan kekayaan secara berkelanjutan." },
    ],
  },
  {
    step: 2,
    id: "flow",
    name: "Flow",
    subtitle: "Agresi dan Agilitas Kas",
    icon: Coins,
    colorClass: "from-emerald-500/20 via-emerald-500/5 to-transparent border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    items: [
      { num: 1, text: "Prasyarat operasional yang memastikan aset dan pendapatan dapat terus bersirkulasi secara berkelanjutan." },
      { num: 2, text: "Arus kas bersih yang menunjukkan kemampuan finansial aktual dalam memenuhi kebutuhan dan kewajiban secara berkala." },
      { num: 3, text: "Indikator efisiensi penggunaan modal dalam menjaga likuiditas tanpa mengorbankan stabilitas jangka panjang." },
      { num: 4, text: "Dinamika pergerakan dana yang mencerminkan aktivitas ekonomi dan kelangsungan sistem finansial." },
      { num: 5, text: "Sirkulasi nilai ekonomi yang memungkinkan sistem finansial tetap adaptif, hidup, dan berfungsi secara optimal." },
    ],
  },
  {
    step: 3,
    id: "build",
    name: "Build",
    subtitle: "Fondasi dan Modal Fundamental",
    icon: Building,
    colorClass: "from-amber-500/20 via-amber-500/5 to-transparent border-amber-500/30 text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
    items: [
      { num: 1, text: "Proses akumulasi aset secara bertahap untuk membangun fondasi kekayaan yang stabil." },
      { num: 2, text: "Basis kekayaan yang menjadi penopang utama bagi ekspansi dan keberlanjutan nilai ekonomi." },
      { num: 3, text: "Tahap konstruksi modal di mana arus kas dikonversi menjadi aset bernilai jangka panjang." },
      { num: 4, text: "Struktur konsolidasi finansial yang memperkuat posisi ekonomi sebelum memasuki fase pertumbuhan agresif." },
      { num: 5, text: "Fase pembentukan sistem aset yang dirancang untuk mendukung pertumbuhan dan ketahanan jangka panjang." },
    ],
  },
  {
    step: 4,
    id: "grow",
    name: "Grow",
    subtitle: "Akselerasi dan Skalabilitas Aset",
    icon: Sprout,
    colorClass: "from-teal-500/20 via-teal-500/5 to-transparent border-teal-500/30 text-teal-600 dark:text-teal-400",
    badgeBg: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/25",
    items: [
      { num: 1, text: "Proses menentukan batas kenyamanan dan kapasitas finansial dalam merespons dinamika pasar, memastikan strategi pertumbuhan yang dipilih tetap terukur dan berkelanjutan." },
      { num: 2, text: "Metode pendistribusian modal ke berbagai sektor produktif untuk mengoptimalkan potensi apresiasi nilai aset secara keseluruhan." },
      { num: 3, text: "Prinsip pengelolaan dana yang mengutamakan akurasi hasil dan efisiensi proses agar nilai kekayaan dapat melampaui inflasi." },
      { num: 4, text: "Mekanisme pertumbuhan nilai di mana keuntungan yang dihasilkan diinvestasikan kembali untuk menciptakan efek berlipat pada kekayaan dari waktu ke waktu." },
      { num: 5, text: "Tindakan meninjau dan menyesuaikan strategi secara berkala untuk memastikan seluruh instrumen tetap berjalan sesuai tujuan jangka panjang." },
    ],
  },
  {
    step: 5,
    id: "legacy",
    name: "Legacy",
    subtitle: "Transmisi dan Tata Kelola Nilai",
    icon: BookOpen,
    colorClass: "from-rose-500/20 via-rose-500/5 to-transparent border-rose-500/30 text-rose-600 dark:text-rose-400",
    badgeBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25",
    items: [
      { num: 1, text: "Jejak panjang dari seluruh keputusan finansial yang membentuk makna dan tujuan dari kekayaan." },
      { num: 2, text: "Struktur hukum dan institusional yang memastikan manfaat ekonomi tetap terjaga sepanjang waktu." },
      { num: 3, text: "Dimensi keberlanjutan finansial yang melampaui batas hidup seorang individu atau entitas." },
      { num: 4, text: "Sistem transmisi kekayaan yang menjaga kesinambungan nilai antar generasi." },
      { num: 5, text: "Manifestasi tertinggi dari sebuah sistem finansial yang terintegrasi, stabil, dan berkelanjutan." },
    ],
  },
];

export function FiveTahapanDescriptionBanner({
  activeTab,
  onSelectTab,
}: {
  activeTab: "all" | "surety" | "flow" | "build" | "grow" | "legacy";
  onSelectTab?: (tab: "surety" | "flow" | "build" | "grow" | "legacy") => void;
}) {
  return (
    <div className="w-full mb-8">
      {/* Header Info */}
      <div className="flex items-center justify-between gap-3 mb-3.5 px-1">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold font-mono">
            5
          </span>
          <h4 className="text-sm sm:text-base font-bold text-foreground">
            5 Tahapan Arsitektur Finansial (Surety, Flow, Build, Grow, Legacy)
          </h4>
        </div>
        <span className="text-[11px] text-muted-foreground hidden sm:inline">
          5 Definisi Prinsip Tiap Tahap (1 — 5)
        </span>
      </div>

      {/* Grid 5 Tahap */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {FIVE_TAHAPAN_WEALTH.map((tahap) => {
          const isSelected = activeTab === tahap.id;
          const Icon = tahap.icon;

          return (
            <div
              key={tahap.id}
              onClick={() => onSelectTab && onSelectTab(tahap.id as any)}
              className={`rounded-2xl border p-4 bg-card/60 backdrop-blur-xs flex flex-col justify-between transition-all cursor-pointer group ${
                isSelected
                  ? "ring-2 ring-primary border-primary shadow-sm bg-card"
                  : "border-border/80 hover:border-border hover:bg-card/90"
              }`}
            >
              <div>
                {/* Header Tahap */}
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="size-5 rounded-md bg-muted text-[10px] font-bold font-mono flex items-center justify-center text-foreground shrink-0">
                      {tahap.step}
                    </span>
                    <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      {tahap.name}
                    </span>
                  </div>
                  <div className={`p-1.5 rounded-lg border ${tahap.badgeBg} shrink-0`}>
                    <Icon size={14} />
                  </div>
                </div>

                <p className="text-[11px] font-medium text-muted-foreground/90 mb-3 italic leading-tight">
                  {tahap.subtitle}
                </p>

                {/* 5 Deskripsi Berurutan (1-2-3-4-5) */}
                <div className="space-y-2">
                  {tahap.items.map((item) => (
                    <div key={item.num} className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                      <span className="size-4 rounded-full bg-muted/80 text-[9px] font-bold font-mono flex items-center justify-center shrink-0 mt-0.5 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                        {item.num}
                      </span>
                      <span className="text-muted-foreground group-hover:text-foreground/90 transition-colors line-clamp-3">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Select Pill */}
              <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">Pilar #{tahap.step}</span>
                <span className={`font-semibold ${isSelected ? "text-primary font-bold" : "text-muted-foreground group-hover:text-foreground"}`}>
                  {isSelected ? "Sedang Difilter ✓" : "Lihat App →"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
