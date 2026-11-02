import { ShellSidebar } from "@/app/shell-sidebar";
import { useState } from "react";
import { Search, Navigation } from "lucide-react";
import { incotermData } from "./data";
import { cn } from "../wira/lib/utils";

export default function IncotermsApp() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = incotermData
    .map((group) => ({
      ...group,
      terms: group.terms.filter(
        (term) =>
          term.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          term.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          term.description.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((group) => group.terms.length > 0);

  return (
    <div className="w-full h-full bg-transparent text-foreground font-sans flex flex-col">
      {/* Header that blends perfectly */}
      <div className="px-6 sm:px-8 pt-8 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panduan Incoterms®</h1>
          <p className="text-muted-foreground mt-2">
            Referensi Aturan Perdagangan Internasional 2020
          </p>
        </div>
        <div className="w-full sm:w-auto sm:min-w-[300px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Cari kode (mis. FOB)..."
              className="block w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Groupings */}
        <ShellSidebar>
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Kategori
          </h2>
          <div className="space-y-3">
            {incotermData.map((group) => {
              const colorClass =
                group.id === "E"
                  ? "text-blue-500"
                  : group.id === "F"
                    ? "text-emerald-500"
                    : group.id === "C"
                      ? "text-amber-500"
                      : "text-rose-500";
              const groupDesc =
                group.id === "E"
                  ? "Penjual menyediakan barang di lokasi mereka sendiri."
                  : group.id === "F"
                    ? "Penjual menyerahkan barang ke pengangkut yang ditunjuk pembeli."
                    : group.id === "C"
                      ? "Penjual mengontrak pengangkutan tanpa menanggung risiko kehilangan."
                      : "Penjual menanggung semua biaya dan risiko ke tujuan.";
              return (
                <div
                  key={group.id}
                  className="p-3 bg-card border border-border/40 rounded-xl shadow-sm"
                >
                  <span className={cn("text-xs font-bold block mb-1.5", colorClass)}>
                    {group.title}: {group.subtitle}
                  </span>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">{groupDesc}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-6">
            <div className="p-4 rounded-xl bg-secondary/50 border border-border/40 text-foreground">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Legenda
              </p>
              <div className="flex items-center space-x-2 text-[11px] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>Tanggung Jawab Pembeli</span>
              </div>
              <div className="flex items-center space-x-2 mt-2 text-[11px] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground"></span>
                <span>Tanggung Jawab Penjual</span>
              </div>
            </div>
          </div>
        </ShellSidebar>

        {/* Main Grid */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto bg-secondary/10">
          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Navigation className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Tidak ada hasil ditemukan
              </h3>
              <p className="text-muted-foreground text-sm">
                Kami tidak dapat menemukan istilah yang cocok dengan "{searchTerm}".
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-6 px-4 py-2 bg-background border border-border hover:bg-secondary text-foreground font-medium rounded-lg transition-colors text-sm shadow-sm"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            <div className="space-y-10 max-w-5xl mx-auto pb-12">
              {filteredData.map((group) => (
                <section key={group.id} className="scroll-mt-6" id={`group-${group.id}`}>
                  {/* Group Header */}
                  <div className="mb-5 flex items-center border-b border-border/40 pb-3">
                    <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                      Grup {group.title}
                      <span className="text-muted-foreground font-medium text-sm ml-1">
                        — {group.subtitle}
                      </span>
                    </h2>
                  </div>

                  {/* Terms Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.terms.map((term) => {
                      const badgeColor =
                        group.id === "E"
                          ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                          : group.id === "F"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : group.id === "C"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              : "bg-rose-500/10 text-rose-600 border-rose-500/20";

                      const borderColor =
                        group.id === "E"
                          ? "border-l-blue-500"
                          : group.id === "F"
                            ? "border-l-emerald-500"
                            : group.id === "C"
                              ? "border-l-amber-500"
                              : "border-l-rose-500";

                      return (
                        <div
                          key={term.code}
                          className={cn(
                            "bg-card p-5 border border-border/50 rounded-xl shadow-sm hover:shadow-md hover:border-border transition-all flex flex-col border-l-4",
                            borderColor,
                          )}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <span
                              className={cn(
                                "px-2.5 py-1 text-xs font-bold rounded-md uppercase border",
                                badgeColor,
                              )}
                            >
                              {term.code}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider bg-secondary px-2 py-0.5 rounded-sm">
                              Group {group.id}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-foreground leading-tight mb-2">
                            {term.name}
                          </h3>
                          <p className="text-xs text-muted-foreground flex-grow leading-relaxed">
                            {term.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Footer Bar */}
      <footer className="h-10 bg-card border-t border-border flex items-center px-6 md:px-8 justify-between text-[11px] text-muted-foreground font-medium shrink-0">
        <div className="flex space-x-6">
          <span>Semua Moda Transportasi (EXW, FCA, CPT, CIP, DAP, DPU, DDP)</span>
          <span className="hidden sm:inline">
            Khusus Laut / Perairan Darat (FAS, FOB, CFR, CIF)
          </span>
        </div>
        <div>© Incoterms® 2020 Reference</div>
      </footer>
    </div>
  );
}
