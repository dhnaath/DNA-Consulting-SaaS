import React, { useState } from "react";
import { Plus, Trash2, Shield, AlertTriangle, Sparkles, TrendingUp } from "lucide-react";
import { useShellSections } from "@/app/shell-sections";

interface MatrixItem {
  id: string;
  text: string;
}

export function TOWSMatrix() {
  const [soItems, setSoItems] = useState<MatrixItem[]>([
    { id: "1", text: "Manfaatkan reputasi kuat untuk ekspansi ke pasar regional" },
    { id: "2", text: "Luncurkan platform digital berbasis keahlian internal" },
  ]);

  const [woItems, setWoItems] = useState<MatrixItem[]>([
    { id: "3", text: "Kolaborasi kemitraan untuk menutupi kekurangan kapabilitas dev" },
    { id: "4", text: "Adopsi otomatisasi proses untuk menghemat biaya operasional" },
  ]);

  const [stItems, setStItems] = useState<MatrixItem[]>([
    { id: "5", text: "Perkuat diferensiasi metodologi agar kebal perang harga" },
    { id: "6", text: "Kunci kontrak jangka panjang dengan klien strategis" },
  ]);

  const [wtItems, setWtItems] = useState<MatrixItem[]>([
    { id: "7", text: "Restrukturisasi portofolio produk yang tidak menguntungkan" },
    { id: "8", text: "Hentikan ekspansi berisiko tinggi sebelum cashflow stabil" },
  ]);

  const [newItemText, setNewItemText] = useState("");
  const [targetQuadrant, setTargetQuadrant] = useState<"so" | "wo" | "st" | "wt">("so");

  const focusQuadrant = (q: "so" | "wo" | "st" | "wt") => {
    setTargetQuadrant(q);
    document
      .getElementById(`q-tows-${q}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  useShellSections([
    {
      id: "so",
      label: "Strategi SO (Maxi-Maxi)",
      icon: Sparkles,
      active: targetQuadrant === "so",
      onSelect: () => focusQuadrant("so"),
    },
    {
      id: "wo",
      label: "Strategi WO (Mini-Maxi)",
      icon: TrendingUp,
      active: targetQuadrant === "wo",
      onSelect: () => focusQuadrant("wo"),
    },
    {
      id: "st",
      label: "Strategi ST (Maxi-Mini)",
      icon: Shield,
      active: targetQuadrant === "st",
      onSelect: () => focusQuadrant("st"),
    },
    {
      id: "wt",
      label: "Strategi WT (Mini-Mini)",
      icon: AlertTriangle,
      active: targetQuadrant === "wt",
      onSelect: () => focusQuadrant("wt"),
    },
  ]);

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const item: MatrixItem = { id: Date.now().toString(), text: newItemText.trim() };

    if (targetQuadrant === "so") setSoItems((prev) => [...prev, item]);
    if (targetQuadrant === "wo") setWoItems((prev) => [...prev, item]);
    if (targetQuadrant === "st") setStItems((prev) => [...prev, item]);
    if (targetQuadrant === "wt") setWtItems((prev) => [...prev, item]);

    setNewItemText("");
  };

  const removeItem = (quadrant: "so" | "wo" | "st" | "wt", id: string) => {
    if (quadrant === "so") setSoItems((prev) => prev.filter((i) => i.id !== id));
    if (quadrant === "wo") setWoItems((prev) => prev.filter((i) => i.id !== id));
    if (quadrant === "st") setStItems((prev) => prev.filter((i) => i.id !== id));
    if (quadrant === "wt") setWtItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SO Strategy */}
        <div id="q-tows-so" className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3 scroll-mt-24">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
            <Sparkles className="size-4" />
            <span>Strategi SO (Maxi-Maxi)</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Gunakan Kekuatan internal untuk merebut Peluang eksternal.
          </p>
          <ul className="space-y-2">
            {soItems.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-2 p-2 rounded-lg bg-background border border-border text-xs text-foreground"
              >
                <span>{item.text}</span>
                <button
                  onClick={() => removeItem("so", item.id)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* WO Strategy */}
        <div id="q-tows-wo" className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-3 scroll-mt-24">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm">
            <TrendingUp className="size-4" />
            <span>Strategi WO (Mini-Maxi)</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Atasi Kelemahan internal dengan memanfaatkan Peluang eksternal.
          </p>
          <ul className="space-y-2">
            {woItems.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-2 p-2 rounded-lg bg-background border border-border text-xs text-foreground"
              >
                <span>{item.text}</span>
                <button
                  onClick={() => removeItem("wo", item.id)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* ST Strategy */}
        <div id="q-tows-st" className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3 scroll-mt-24">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm">
            <Shield className="size-4" />
            <span>Strategi ST (Maxi-Mini)</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Gunakan Kekuatan internal untuk menangkal Ancaman eksternal.
          </p>
          <ul className="space-y-2">
            {stItems.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-2 p-2 rounded-lg bg-background border border-border text-xs text-foreground"
              >
                <span>{item.text}</span>
                <button
                  onClick={() => removeItem("st", item.id)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* WT Strategy */}
        <div id="q-tows-wt" className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-3 scroll-mt-24">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-sm">
            <AlertTriangle className="size-4" />
            <span>Strategi WT (Mini-Mini)</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Minimalkan Kelemahan internal dan hindari Ancaman eksternal.
          </p>
          <ul className="space-y-2">
            {wtItems.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-2 p-2 rounded-lg bg-background border border-border text-xs text-foreground"
              >
                <span>{item.text}</span>
                <button
                  onClick={() => removeItem("wt", item.id)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick Input Form */}
      <form onSubmit={addItem} className="flex flex-col sm:flex-row gap-2 p-3 rounded-xl border border-border bg-card">
        <select
          value={targetQuadrant}
          onChange={(e) => setTargetQuadrant(e.target.value as any)}
          className="h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-medium"
        >
          <option value="so">Strategi SO (Maxi-Maxi)</option>
          <option value="wo">Strategi WO (Mini-Maxi)</option>
          <option value="st">Strategi ST (Maxi-Mini)</option>
          <option value="wt">Strategi WT (Mini-Mini)</option>
        </select>
        <input
          type="text"
          placeholder="Tulis rumusan strategi baru..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          className="flex-1 h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="size-3.5" />
          <span>Tambah</span>
        </button>
      </form>
    </div>
  );
}
