import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Item, QuadrantData } from "../types";

interface QuadrantProps {
  data: QuadrantData;
  items: Item[];
  onAddItem: (text: string) => void;
  onRemoveItem: (id: string) => void;
  id?: string;
  focused?: boolean;
}

export function Quadrant({ data, items, onAddItem, onRemoveItem, id, focused }: QuadrantProps) {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAddItem(inputText.trim());
    setInputText("");
  };

  const getThemeClasses = (theme?: string) => {
    switch (theme) {
      case "emerald":
        return "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400";
      case "blue":
        return "border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400";
      case "amber":
        return "border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400";
      case "rose":
        return "border-rose-500/30 bg-rose-500/5 text-rose-600 dark:text-rose-400";
      default:
        return "border-border bg-card text-foreground";
    }
  };

  return (
    <div
      id={id}
      className={`flex flex-col p-5 rounded-2xl border shadow-sm transition-all duration-200 ${getThemeClasses(data.theme)} ${
        focused ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.01]" : ""
      }`}
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">{data.title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{data.subtitle}</p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto mb-4 min-h-[140px]">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-muted-foreground italic">
            Belum ada item di kuadran ini
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-background border border-border text-xs text-foreground shadow-xs"
            >
              <span>{item.text}</span>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-muted-foreground hover:text-destructive shrink-0 transition-colors"
                title="Hapus"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Tambah aset..."
          className="flex-1 h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-1 shrink-0 cursor-pointer"
        >
          <Plus className="size-3.5" />
          <span>Tambah</span>
        </button>
      </form>
    </div>
  );
}
