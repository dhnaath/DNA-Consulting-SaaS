import React, { useState } from "react";
import {
  HeartHandshake,
  Scale,
  Handshake,
  Archive,
  Users,
  Tag,
  ArrowRight,
  Layers,
  Sparkles,
  Shield,
  Heart,
} from "lucide-react";
import {
  StandaloneAkadApp,
  AKAD_DATA,
  AkadType,
} from "./AkadStandaloneViews";

interface IslamicContractsProps {
  initialAkad?: AkadType | null;
  onNavigateAkad?: (akad: AkadType | null) => void;
}

export default function IslamicContracts({
  initialAkad = null,
  onNavigateAkad,
}: IslamicContractsProps) {
  const [activeAkad, setActiveAkad] = useState<AkadType | null>(initialAkad);

  // Sync if initialAkad prop changes
  React.useEffect(() => {
    if (initialAkad !== undefined) {
      setActiveAkad(initialAkad);
    }
  }, [initialAkad]);

  const handleSelectAkad = (akad: AkadType | null) => {
    setActiveAkad(akad);
    if (onNavigateAkad) {
      onNavigateAkad(akad);
    }
  };

  // If a specific standalone akad is active, show the standalone app view
  if (activeAkad && AKAD_DATA[activeAkad]) {
    return (
      <div className="w-full">
        <StandaloneAkadApp
          akadId={activeAkad}
          onBack={() => handleSelectAkad(null)}
          onSelectAkad={(id) => handleSelectAkad(id)}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Top Filter & Standalone Apps Launcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/50 shadow-xs">
        <div className="flex items-center gap-2 px-2">
          <Layers className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-foreground">Aplikasi Standalone:</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => handleSelectAkad(null)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-xs cursor-pointer"
          >
            Semua (Overview)
          </button>
          {(Object.keys(AKAD_DATA) as AkadType[]).map((key) => {
            const item = AKAD_DATA[key];
            const ItemIcon = item.icon;
            return (
              <button
                key={key}
                onClick={() => handleSelectAkad(key)}
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
          div#root > ... > section:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1..6) */}
      <section className="bg-card border border-black/5 p-8 flex flex-col lg:flex-row gap-8 lg:gap-12 w-full rounded-2xl shadow-xs">
        <div className="lg:w-1/3 flex flex-col">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/40">
            <Handshake className="w-6 h-6 text-foreground" />
            <h2 className="text-2xl font-semibold italic text-foreground">Akad Muamalah</h2>
          </div>

          <div className="text-xs text-muted-foreground leading-relaxed space-y-4">
            <p>
              Dalam sistem ekonomi syariah, akad dan muamalah berlandaskan asas
              tolong-menolong, keadilan, dan transparansi. 9 akad & instrumen proteksi syariah
              berikut telah disediakan sebagai aplikasi standalone interaktif dengan simulator dan ketentuan komprehensif.
            </p>
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-foreground/80 space-y-1">
              <span className="font-bold text-primary flex items-center gap-1.5 text-xs">
                <Sparkles size={14} />
                Standalone App Mode
              </span>
              <p className="text-[11px] text-muted-foreground">
                Klik kartu atau tombol "Buka Standalone App" untuk mengakses simulator dan panduan rukun & fatwa lengkap masing-masing akad.
              </p>
            </div>
          </div>
        </div>

        {/* 6 Standalone App Cards */}
        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Tabarru' */}
          <div
            onClick={() => handleSelectAkad("tabarru")}
            className="group bg-card border border-border/60 hover:border-primary/50 p-6 flex flex-col transition-all duration-300 rounded-xl hover:shadow-md cursor-pointer relative"
          >
            <div className="flex items-center justify-between mb-4">
              <HeartHandshake className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary text-foreground">
                Non-Profit
              </span>
            </div>
            <h3 className="font-semibold italic text-xl text-foreground mb-1 group-hover:text-primary transition-colors">
              Tabarru'
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 border-b border-border/40 pb-2">
              Gotong Royong
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
              Akad tolong-menolong tanpa berorientasi keuntungan finansial materiil. Fondasi takaful, dana kebajikan, qardh al-hasan, dan wakaf.
            </p>
            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
              <span>Buka Standalone App</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Mudharabah */}
          <div
            onClick={() => handleSelectAkad("mudharabah")}
            className="group bg-card border border-border/60 hover:border-primary/50 p-6 flex flex-col transition-all duration-300 rounded-xl hover:shadow-md cursor-pointer relative"
          >
            <div className="flex items-center justify-between mb-4">
              <Scale className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary text-foreground">
                Bagi Hasil
              </span>
            </div>
            <h3 className="font-semibold italic text-xl text-foreground mb-1 group-hover:text-primary transition-colors">
              Mudharabah
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 border-b border-border/40 pb-2">
              Bagi Hasil
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
              Kemitraan antara pemilik dana 100% (Shahibul Maal) dan pengelola (Mudharib). Laba dibagi sesuai rasio nisbah disepakati di awal.
            </p>
            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
              <span>Buka Standalone App</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Wakalah */}
          <div
            onClick={() => handleSelectAkad("wakalah")}
            className="group bg-card border border-border/60 hover:border-primary/50 p-6 flex flex-col transition-all duration-300 rounded-xl hover:shadow-md cursor-pointer relative"
          >
            <div className="flex items-center justify-between mb-4">
              <Handshake className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary text-foreground">
                Jasa Kuasa
              </span>
            </div>
            <h3 className="font-semibold italic text-xl text-foreground mb-1 group-hover:text-primary transition-colors">
              Wakalah
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 border-b border-border/40 pb-2">
              Perwakilan
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
              Pelimpahan kuasa perwakilan dari pemberi kuasa kepada penerima kuasa, baik sukarela maupun dengan upah jasa (Wakalah bil Ujrah).
            </p>
            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
              <span>Buka Standalone App</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Wadiah */}
          <div
            onClick={() => handleSelectAkad("wadiah")}
            className="group bg-card border border-border/60 hover:border-primary/50 p-6 flex flex-col transition-all duration-300 rounded-xl hover:shadow-md cursor-pointer relative"
          >
            <div className="flex items-center justify-between mb-4">
              <Archive className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary text-foreground">
                Titipan Murni
              </span>
            </div>
            <h3 className="font-semibold italic text-xl text-foreground mb-1 group-hover:text-primary transition-colors">
              Wadiah
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 border-b border-border/40 pb-2">
              Titipan
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
              Akad penitipan barang atau uang dengan garansi keamanan dan keutuhan 100%. Fondasi tabungan dan giro syariah tanpa riba.
            </p>
            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
              <span>Buka Standalone App</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Musyarakah */}
          <div
            onClick={() => handleSelectAkad("musyarakah")}
            className="group bg-card border border-border/60 hover:border-primary/50 p-6 flex flex-col transition-all duration-300 rounded-xl hover:shadow-md cursor-pointer relative"
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary text-foreground">
                Kemitraan Modal
              </span>
            </div>
            <h3 className="font-semibold italic text-xl text-foreground mb-1 group-hover:text-primary transition-colors">
              Musyarakah
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 border-b border-border/40 pb-2">
              Kerja Sama
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
              Akad kemitraan usaha bersama dengan kontribusi modal dari setiap pihak. Laba dibagi sesuai nisbah, kerugian proporsional modal.
            </p>
            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
              <span>Buka Standalone App</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Murabahah */}
          <div
            onClick={() => handleSelectAkad("murabahah")}
            className="group bg-card border border-border/60 hover:border-primary/50 p-6 flex flex-col transition-all duration-300 rounded-xl hover:shadow-md cursor-pointer relative"
          >
            <div className="flex items-center justify-between mb-4">
              <Tag className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary text-foreground">
                Jual Beli Margin
              </span>
            </div>
            <h3 className="font-semibold italic text-xl text-foreground mb-1 group-hover:text-primary transition-colors">
              Murabahah
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 border-b border-border/40 pb-2">
              Jual Beli
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
              Jual beli barang dengan pengungkapan harga pokok dan margin keuntungan transparan. Cicilan tetap tanpa bunga floating.
            </p>
            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
              <span>Buka Standalone App</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 7: Ta'min */}
          <div
            onClick={() => handleSelectAkad("tamin")}
            className="group bg-card border border-border/60 hover:border-primary/50 p-6 flex flex-col transition-all duration-300 rounded-xl hover:shadow-md cursor-pointer relative"
          >
            <div className="flex items-center justify-between mb-4">
              <Shield className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary text-foreground">
                Proteksi
              </span>
            </div>
            <h3 className="font-semibold italic text-xl text-foreground mb-1 group-hover:text-primary transition-colors">
              Ta'min
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 border-b border-border/40 pb-2">
              Perlindungan / Rasa Aman
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
              Prinsip memberikan perlindungan dan ketenangan (rasa aman) dari risiko dan musibah melalui ikhtiar terencana tanpa maisir, riba, dan gharar.
            </p>
            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
              <span>Buka Standalone App</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 8: Takaful */}
          <div
            onClick={() => handleSelectAkad("takaful")}
            className="group bg-card border border-border/60 hover:border-primary/50 p-6 flex flex-col transition-all duration-300 rounded-xl hover:shadow-md cursor-pointer relative"
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary text-foreground">
                Risk Sharing
              </span>
            </div>
            <h3 className="font-semibold italic text-xl text-foreground mb-1 group-hover:text-primary transition-colors">
              Takaful
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 border-b border-border/40 pb-2">
              Saling Menanggung
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
              Saling memikul beban dan musibah bersama melalui pool dana kebajikan (dana tabarru') dengan pembagian surplus underwriting yang adil.
            </p>
            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
              <span>Buka Standalone App</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 9: Tadhamun */}
          <div
            onClick={() => handleSelectAkad("tadhamun")}
            className="group bg-card border border-border/60 hover:border-primary/50 p-6 flex flex-col transition-all duration-300 rounded-xl hover:shadow-md cursor-pointer relative"
          >
            <div className="flex items-center justify-between mb-4">
              <Heart className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary text-foreground">
                Solidaritas
              </span>
            </div>
            <h3 className="font-semibold italic text-xl text-foreground mb-1 group-hover:text-primary transition-colors">
              Tadhamun
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 border-b border-border/40 pb-2">
              Ukhuwah & Gotong Royong
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
              Asas kebersamaan dan solidaritas sosial untuk menopang ketahanan ekonomi sesama jamaah, paguyuban, dan komunitas tanpa komersialisasi.
            </p>
            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
              <span>Buka Standalone App</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer Quranic Dalil */}
      <section className="bg-card border border-black/5 p-6 md:p-8 grid grid-cols-1 gap-6 w-full rounded-2xl">
        <div className="text-xs md:text-sm text-muted-foreground italic border-l border-border/40 pl-4 md:pl-6 py-2">
          <p className="leading-relaxed">
            “Dan tolong-menolonglah kamu dalam (mengerjakan) kebajikan dan takwa, dan jangan
            tolong-menolong dalam berbuat dosa dan pelanggaran.”
          </p>
          <span className="block mt-3 not-italic font-bold text-[10px] uppercase tracking-[0.1em] opacity-60">
            — QS. Al-Ma'idah (5): 2
          </span>
        </div>
      </section>
    </div>
  );
}
