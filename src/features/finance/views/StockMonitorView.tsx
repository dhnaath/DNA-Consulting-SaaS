import { useState } from "react";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  RefreshCcw,
  Search,
  LineChart,
  Activity,
} from "lucide-react";
import { motion } from "motion/react";
import { useDeletedItems } from "../hooks/useDeletedItems";
import { useScrollRestore } from "../hooks/useScrollRestore";

export function StockMonitorView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("StockMonitorView_scroll");
  const [searchQuery, setSearchQuery] = useState("");
  const { markDeleted } = useDeletedItems("deleted_stocks");
  const [stocks, setStocks] = useState<any[]>(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("stocks_list") : null;
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const formatPrice = (symbol: string, price: number) => {
    return symbol.includes(".JK") ? `Rp ${price.toLocaleString("id-ID")}` : `$${price.toFixed(2)}`;
  };

  const filteredStocks = stocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col min-h-screen bg-background relative font-sans text-foreground">
      <div className="p-4 flex flex-col gap-4 pt-6 shrink-0 bg-background z-10 sticky top-0 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="text-foreground p-1 hover:text-foreground transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-lg font-medium tracking-wide">Market Monitor</h1>
          </div>
          <button className="text-muted-foreground p-1.5 rounded-full bg-card border border-border hover:bg-accent transition-colors">
            <RefreshCcw size={18} />
          </button>
        </div>

        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70"
          />
          <input
            type="text"
            placeholder="Cari simbol saham (ex: BBCA, AAPL)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground outline-none focus:border-[#4caf50] transition-colors"
          />
        </div>
      </div>

      <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-4 pb-20">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card p-4 rounded-2xl border border-border">
            <div className="text-muted-foreground text-xs mb-1 flex justify-between">
              IHSG <Activity size={12} />
            </div>
            <div className="text-lg font-bold text-foreground">7,243.15</div>
            <div className="text-emerald-400 text-xs font-medium flex items-center mt-1">
              <TrendingUp size={12} className="mr-1" /> +0.45%
            </div>
          </div>
          <div className="bg-card p-4 rounded-2xl border border-border">
            <div className="text-muted-foreground text-xs mb-1 flex justify-between">
              S&P 500 <Activity size={12} />
            </div>
            <div className="text-lg font-bold text-foreground">5,123.69</div>
            <div className="text-red-400 text-xs font-medium flex items-center mt-1">
              <TrendingDown size={12} className="mr-1" /> -0.12%
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-sm font-medium text-muted-foreground/70 uppercase tracking-wider">
            Watchlist Anda
          </h2>
          <LineChart size={16} className="text-muted-foreground/70" />
        </div>

        <div className="space-y-3 w-full">
          {filteredStocks.map((stock, i) => (
            <div
              key={stock.symbol}
              className="relative mb-3 bg-card/60 rounded-2xl overflow-hidden border border-border"
            >
              <div className="absolute inset-0 flex items-center justify-between px-6 z-0">
                <div className="flex items-center gap-2 text-blue-400">
                  <span className="text-xs font-medium uppercase tracking-widest">Arsip</span>
                </div>
                <div className="flex items-center gap-2 text-red-500">
                  <span className="text-xs font-medium uppercase tracking-widest">Hapus</span>
                </div>
              </div>
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -100) {
                    if (window.confirm(`Hapus ${stock.symbol} dari watchlist?`)) {
                      markDeleted(stock.symbol);
                      setStocks((s) => s.filter((x) => x.symbol !== stock.symbol));
                    }
                  } else if (info.offset.x > 100) {
                    alert(`${stock.symbol} diarsipkan.`);
                    markDeleted(stock.symbol);
                    setStocks((s) => s.filter((x) => x.symbol !== stock.symbol));
                  }
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="w-full bg-card border-y border-border rounded-2xl p-4 relative z-10 hover:bg-accent transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-foreground">{stock.symbol}</h3>
                      <span className="text-xs uppercase font-medium px-2 py-0.5 rounded bg-[#2a2a2a] text-muted-foreground">
                        {stock.type}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground/70 mt-0.5">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-foreground">
                      {formatPrice(stock.symbol, stock.price)}
                    </div>
                    <div
                      className={`text-xs font-medium mt-0.5 flex items-center justify-end gap-1 ${stock.change >= 0 ? "text-emerald-400" : "text-red-400"}`}
                    >
                      {stock.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {stock.change > 0 ? "+" : ""}
                      {stock.change} ({stock.change > 0 ? "+" : ""}
                      {stock.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
                  <div>
                    <div className="text-xs text-muted-foreground/70 uppercase">Vol</div>
                    <div className="text-xs font-medium text-muted-foreground">{stock.volume}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground/70 uppercase">P/E Ratio</div>
                    <div className="text-xs font-medium text-muted-foreground">
                      {stock.pe > 0 ? stock.pe : "N/A"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground/70 uppercase">Mkt Cap</div>
                    <div className="text-xs font-medium text-muted-foreground">
                      {stock.marketCap}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
          {filteredStocks.length === 0 && (
            <div className="text-center py-10 text-muted-foreground/70">
              Pencarian tidak ditemukan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
