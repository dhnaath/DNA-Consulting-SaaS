import React, { useState } from "react";
import {
  AlertOctagon,
  ShieldAlert,
  Dice5,
  ArrowRight,
  Sparkles,
  Layers,
} from "lucide-react";
import {
  StandaloneProhibitedApp,
  PROHIBITED_DATA,
  ProhibitedType,
} from "./ProhibitedStandaloneViews";

interface ProhibitedTransactionsProps {
  initialProhibited?: ProhibitedType | null;
  onNavigateProhibited?: (item: ProhibitedType | null) => void;
}

export default function ProhibitedTransactions({
  initialProhibited = null,
  onNavigateProhibited,
}: ProhibitedTransactionsProps) {
  const [activeProhibited, setActiveProhibited] = useState<ProhibitedType | null>(
    initialProhibited,
  );

  React.useEffect(() => {
    if (initialProhibited !== undefined) {
      setActiveProhibited(initialProhibited);
    }
  }, [initialProhibited]);

  const handleSelectProhibited = (item: ProhibitedType | null) => {
    setActiveProhibited(item);
    if (onNavigateProhibited) {
      onNavigateProhibited(item);
    }
  };

  // If a specific standalone app is active, show the standalone view
  if (activeProhibited && PROHIBITED_DATA[activeProhibited]) {
    return (
      <div className="w-full">
        <StandaloneProhibitedApp
          prohibitedId={activeProhibited}
          onBack={() => handleSelectProhibited(null)}
          onSelectProhibited={(id) => handleSelectProhibited(id)}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Top Filter & Standalone Apps Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/50 shadow-xs">
        <div className="flex items-center gap-2 px-2">
          <Layers className="w-4 h-4 text-rose-500" />
          <span className="text-xs font-bold text-foreground">Aplikasi Standalone:</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => handleSelectProhibited(null)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-500 text-white shadow-xs cursor-pointer"
          >
            Semua (Overview)
          </button>
          {(Object.keys(PROHIBITED_DATA) as ProhibitedType[]).map((key) => {
            const item = PROHIBITED_DATA[key];
            const ItemIcon = item.icon;
            return (
              <button
                key={key}
                onClick={() => handleSelectProhibited(key)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
              >
                <ItemIcon className="w-3.5 h-3.5" />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Section matching CSS selector structure:
          div#root > ... > section:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1..3) */}
      <section className="bg-card border border-black/5 p-8 flex flex-col lg:flex-row gap-8 lg:gap-12 w-full rounded-2xl shadow-xs">
        <div className="lg:w-1/3 flex flex-col">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/40">
            <ShieldAlert className="w-6 h-6 text-foreground" />
            <h2 className="text-2xl font-semibold italic text-foreground">Larangan Muamalah</h2>
          </div>

          <div className="text-xs text-muted-foreground leading-relaxed space-y-4">
            <p>
              Dalam sistem ekonomi syariah, terdapat tiga pilar utama larangan yang harus dijauhi
              dalam setiap transaksi atau akad. Keberadaan salah satu unsur ini dapat membatalkan
              keabsahan (fasid/bathil) sebuah transaksi.
            </p>
            <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 text-foreground/80 space-y-1">
              <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 text-xs">
                <Sparkles size={14} />
                Standalone App Mode
              </span>
              <p className="text-[11px] text-muted-foreground">
                Klik kartu atau tombol "Buka Standalone App" untuk mengakses audit, screener kepatuhan, kalkulator purifikasi, dan panduan lengkap.
              </p>
            </div>
            <p className="font-bold uppercase tracking-[0.1em] text-[10px] mt-4">Prinsip Dasar:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Keadilan (Al-'Adl)</li>
              <li>Transparansi (Al-Wudhu)</li>
              <li>Saling Ridha (An-Taradhin)</li>
            </ul>
          </div>
        </div>

        {/* 3 Standalone App Cards matching selector 3 (div 1), selector 2 (div 2), selector 1 (div 3) */}
        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Riba */}
          <div
            onClick={() => handleSelectProhibited("riba")}
            className="group bg-card border border-border/60 hover:border-rose-500/50 p-6 flex flex-col transition-all duration-300 rounded-xl hover:shadow-md cursor-pointer relative"
          >
            <div className="flex items-center justify-between mb-4">
              <AlertOctagon className="w-8 h-8 text-foreground group-hover:text-rose-500 transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary text-foreground">
                Bunga / Usury
              </span>
            </div>
            <h3 className="font-semibold italic text-xl text-foreground mb-1 group-hover:text-rose-500 transition-colors">
              Riba
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 border-b border-border/40 pb-2">
              Bunga & Penalti
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
              Tambahan yang disyaratkan dalam transaksi pinjaman (riba nasi'ah) atau pertukaran barang ribawi sejenis tak seimbang (riba fadhl). Uang tidak boleh melahirkan uang tanpa risiko bisnis riil.
            </p>
            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400">
              <span>Buka Standalone App</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Gharar */}
          <div
            onClick={() => handleSelectProhibited("gharar")}
            className="group bg-card border border-border/60 hover:border-rose-500/50 p-6 flex flex-col transition-all duration-300 rounded-xl hover:shadow-md cursor-pointer relative"
          >
            <div className="flex items-center justify-between mb-4">
              <ShieldAlert className="w-8 h-8 text-foreground group-hover:text-rose-500 transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary text-foreground">
                Ketidakpastian
              </span>
            </div>
            <h3 className="font-semibold italic text-xl text-foreground mb-1 group-hover:text-rose-500 transition-colors">
              Gharar
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 border-b border-border/40 pb-2">
              Uncertainty
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
              Ketidakjelasan dalam suatu akad mengenai kualitas, kuantitas, harga, maupun kesanggupan serah terima barang. Transaksi harus jelas, transparan, dan tidak manipulatif.
            </p>
            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400">
              <span>Buka Standalone App</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Maysir */}
          <div
            onClick={() => handleSelectProhibited("maysir")}
            className="group bg-card border border-border/60 hover:border-rose-500/50 p-6 flex flex-col transition-all duration-300 rounded-xl hover:shadow-md cursor-pointer relative"
          >
            <div className="flex items-center justify-between mb-4">
              <Dice5 className="w-8 h-8 text-foreground group-hover:text-rose-500 transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary text-foreground">
                Untung-Untungan
              </span>
            </div>
            <h3 className="font-semibold italic text-xl text-foreground mb-1 group-hover:text-rose-500 transition-colors">
              Maysir
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 border-b border-border/40 pb-2">
              Zero-Sum Game
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
              Transaksi yang menggantungkan keuntungan pada spekulasi keberuntungan murni atau perjudian di mana satu pihak pasti untung di atas kerugian mutlak pihak lain.
            </p>
            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400">
              <span>Buka Standalone App</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer Quranic Quote */}
      <section className="bg-card border border-black/5 p-6 md:p-8 grid grid-cols-1 gap-6 w-full rounded-2xl">
        <div className="text-xs md:text-sm text-muted-foreground italic border-l border-border/40 pl-4 md:pl-6 py-2">
          <p className="leading-relaxed">
            “Wahai orang-orang yang beriman! Janganlah kamu saling memakan harta sesamamu dengan jalan yang batil (tidak benar), kecuali dalam perdagangan yang berlaku atas dasar suka sama suka di antara kamu.”
          </p>
          <span className="block mt-3 not-italic font-bold text-[10px] uppercase tracking-[0.1em] opacity-60">
            — QS. An-Nisa' (4): 29
          </span>
        </div>
      </section>
    </div>
  );
}
