import { useState } from "react";
import { Item, QuadrantId } from "../matriks/types";
import { Quadrant } from "../matriks/components/Quadrant";
import { useMatrixQuadrantFocus } from "./useMatrixQuadrantFocus";

const assetFramework = {
  id: "asset",
  name: "Kuadran Aset",
  description:
    "Memetakan aset berdasarkan likuiditas dan produktivitas (Sumbu X: Liquid vs Illiquid, Sumbu Y: Productive vs Non-Productive).",
  quadrants: {
    tl: {
      id: "tl",
      title: "Productive & Liquid",
      subtitle: "Menghasilkan & Mudah Dicairkan (Saham, Deposito)",
      theme: "emerald",
    },
    tr: {
      id: "tr",
      title: "Productive & Illiquid",
      subtitle: "Menghasilkan & Sulit Dicairkan (Properti Sewa, Bisnis)",
      theme: "blue",
    },
    bl: {
      id: "bl",
      title: "Non-Productive & Liquid",
      subtitle: "Tidak Menghasilkan & Mudah Dicairkan (Uang Tunai, Emas)",
      theme: "amber",
    },
    br: {
      id: "br",
      title: "Non-Productive & Illiquid",
      subtitle: "Tidak Menghasilkan & Sulit Dicairkan (Barang Mewah, Rumah Tinggal)",
      theme: "rose",
    },
  },
};

export function AssetMatrix() {
  const [items, setItems] = useState<Record<QuadrantId, Item[]>>({
    tl: [],
    tr: [],
    bl: [],
    br: [],
  });
  const { focusedQuadrant, quadrantId } = useMatrixQuadrantFocus(
    "asset",
    assetFramework.quadrants
  );

  const handleAddItem = (quadrantId: QuadrantId, text: string) => {
    const newItem: Item = { id: crypto.randomUUID(), text };
    setItems((prev) => ({
      ...prev,
      [quadrantId]: [...prev[quadrantId], newItem],
    }));
  };

  const handleRemoveItem = (quadrantId: QuadrantId, itemId: string) => {
    setItems((prev) => ({
      ...prev,
      [quadrantId]: prev[quadrantId].filter((i) => i.id !== itemId),
    }));
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 pb-12">
      <div className="p-4 rounded-2xl border border-border bg-card/60 shadow-xs flex items-center justify-between">
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {assetFramework.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr min-h-[600px]">
        <Quadrant
          data={assetFramework.quadrants.tl as any}
          items={items.tl}
          onAddItem={(text) => handleAddItem("tl", text)}
          onRemoveItem={(id) => handleRemoveItem("tl", id)}
          id={quadrantId("tl")}
          focused={focusedQuadrant === "tl"}
        />
        <Quadrant
          data={assetFramework.quadrants.tr as any}
          items={items.tr}
          onAddItem={(text) => handleAddItem("tr", text)}
          onRemoveItem={(id) => handleRemoveItem("tr", id)}
          id={quadrantId("tr")}
          focused={focusedQuadrant === "tr"}
        />
        <Quadrant
          data={assetFramework.quadrants.bl as any}
          items={items.bl}
          onAddItem={(text) => handleAddItem("bl", text)}
          onRemoveItem={(id) => handleRemoveItem("bl", id)}
          id={quadrantId("bl")}
          focused={focusedQuadrant === "bl"}
        />
        <Quadrant
          data={assetFramework.quadrants.br as any}
          items={items.br}
          onAddItem={(text) => handleAddItem("br", text)}
          onRemoveItem={(id) => handleRemoveItem("br", id)}
          id={quadrantId("br")}
          focused={focusedQuadrant === "br"}
        />
      </div>
    </div>
  );
}
