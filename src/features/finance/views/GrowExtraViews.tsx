import { ArrowLeft } from "lucide-react";
import { useScrollRestore } from "../hooks/useScrollRestore";

export function BondsSBNView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("BondsSBNView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide">Obligasi & SBN</h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-5 rounded-2xl border border-border text-center">
          <p className="text-muted-foreground/70 text-sm">Belum ada portofolio obligasi & SBN.</p>
        </div>
      </div>
    </div>
  );
}

export function MutualFundView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("MutualFundView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide">Reksa Dana & ETF</h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-5 rounded-2xl border border-border text-center">
          <p className="text-muted-foreground/70 text-sm">
            Belum ada investasi reksa dana atau ETF.
          </p>
        </div>
      </div>
    </div>
  );
}

export function P2PLendingView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("P2PLendingView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide">P2P & Crowdfunding</h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-5 rounded-2xl border border-border text-center">
          <p className="text-muted-foreground/70 text-sm">
            Belum ada investasi P2P Lending atau Crowdfunding.
          </p>
        </div>
      </div>
    </div>
  );
}

export function TradingJournalView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("TradingJournalView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide">Jurnal Trading</h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-5 rounded-2xl border border-border text-center">
          <p className="text-muted-foreground/70 text-sm">Jurnal trading Anda masih kosong.</p>
        </div>
      </div>
    </div>
  );
}

export function DepositoView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("DepositoView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide">Deposito & Pasar Uang</h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-5 rounded-2xl border border-blue-900/30 mb-4 text-center">
          <h3 className="text-foreground text-sm font-medium mb-1">Total Deposito Aktif</h3>
          <div className="text-2xl font-bold text-blue-400 mb-2">Rp 0</div>
          <p className="text-muted-foreground/70 text-xs mt-4">
            Belum ada portofolio deposito yang dihubungkan.
          </p>
        </div>
      </div>
    </div>
  );
}

export function GoldInvestmentView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("GoldInvestmentView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide">Emas & Logam Mulia</h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-5 rounded-2xl border border-border text-center">
          <p className="text-muted-foreground/70 text-sm">Belum ada investasi emas tercatat.</p>
        </div>
      </div>
    </div>
  );
}

export function PropertyInvestmentView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("PropertyInvestmentView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide">Aset Properti</h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-5 rounded-2xl border border-border text-center">
          <p className="text-muted-foreground/70 text-sm">Belum ada aset properti.</p>
        </div>
      </div>
    </div>
  );
}

export function ForexView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("ForexView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide">Valuta Asing (Forex)</h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-5 rounded-2xl border border-border text-center">
          <p className="text-muted-foreground/70 text-sm">Belum ada portofolio valuta asing.</p>
        </div>
      </div>
    </div>
  );
}

export function RoboAdvisorView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("RoboAdvisorView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide">Robo Advisor</h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-5 rounded-2xl border border-purple-900/30 mb-4 text-center">
          <h3 className="text-foreground text-sm font-medium mb-1">Portofolio Cerdas</h3>
          <div className="text-2xl font-bold text-purple-400 mb-2">Rp 0</div>
          <p className="text-muted-foreground/70 text-xs mt-4">
            Hubungkan robo advisor untuk portofolio otomatis.
          </p>
        </div>
      </div>
    </div>
  );
}
