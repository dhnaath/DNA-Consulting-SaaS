import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Search,
  ArrowRight,
  Layers,
  Sparkles,
  X,
  Home,
} from "lucide-react";
import { navKonsultan } from "@/config/nav";
import { CATEGORIES } from "@/frameworkData";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaletteItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  to: string;
  icon?: any;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Aggregate items from nav and 100 frameworks
  const allItems: PaletteItem[] = useMemo(() => {
    const list: PaletteItem[] = [
      {
        id: "nav-home",
        title: "Beranda (Home)",
        category: "Utama",
        badge: "Cockpit",
        to: "/home",
        icon: Home,
      },
    ];

    // 1. Navigation items (Executive apps, Portals, Money tracker, etc.)
    navKonsultan.forEach((group) => {
      group.items.forEach((item) => {
        if (item.to && item.to !== "/") {
          list.push({
            id: `nav-${item.to}`,
            title: item.label,
            category: group.title,
            badge: group.title.includes("Finance") || ["Asset", "Flow", "Grow", "Build", "Legacy"].some(w => group.title.includes(w))
              ? "Finance"
              : group.title.includes("Client") || group.title.includes("Portal")
              ? "Client Portal"
              : "App",
            to: item.to,
            icon: item.icon,
          });
        }
      });
    });

    // 2. 100 Consulting Frameworks
    CATEGORIES.forEach((cat) => {
      cat.frameworks.forEach((fw) => {
        const slug = fw.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        list.push({
          id: `fw-${slug}`,
          title: fw,
          category: `Framework: ${cat.name}`,
          badge: "100 Framework",
          to: `/framework/${slug}`,
          icon: Layers,
        });
      });
    });

    // Remove potential duplicates by 'to'
    const seen = new Set<string>();
    return list.filter((item) => {
      if (seen.has(item.to)) return false;
      seen.add(item.to);
      return true;
    });
  }, []);

  // Filter items by search query
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Suggest high-value starting points
      return allItems.slice(0, 15);
    }
    return allItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.badge.toLowerCase().includes(q) ||
          item.to.toLowerCase().includes(q)
      )
      .slice(0, 30);
  }, [allItems, query]);

  // Keyboard navigation inside modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
      } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
        e.preventDefault();
        handleSelect(filteredItems[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  // Keep selected item scrolled into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  const handleSelect = (item: PaletteItem) => {
    onClose();
    navigate({ to: item.to as any });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-24 px-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-background/50">
          <Search className="size-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Cari modul, kuadran, framework (misal: SWOT, Cashflow, Klien)..."
            className="flex-1 bg-transparent border-0 outline-none text-sm sm:text-base text-foreground placeholder:text-muted-foreground"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-muted-foreground hover:text-foreground rounded"
            >
              <X className="size-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground bg-muted rounded border border-border">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-transparent text-sm max-h-[60vh] no-scrollbar"
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon || Sparkles;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-100 ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-muted/70 text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-xs sm:text-sm truncate">
                        {item.title}
                      </span>
                      <span
                        className={`text-[11px] truncate ${
                          isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                        isSelected
                          ? "border-primary-foreground/30 bg-primary-foreground/15 text-primary-foreground"
                          : "border-border bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      {item.badge}
                    </span>
                    <ArrowRight
                      className={`size-3.5 transition-transform ${
                        isSelected ? "translate-x-0.5 opacity-100" : "opacity-0"
                      }`}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <Search className="size-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">Tidak ada modul atau framework yang cocok</p>
              <p className="text-xs text-muted-foreground/80 mt-1">
                Coba gunakan kata kunci lain seperti "SWOT", "Aset", atau "Tugas"
              </p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-t border-border text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px]">↓</kbd>
              <span>Navigasi</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px]">↵</kbd>
              <span>Pilih</span>
            </span>
          </div>
          <span className="hidden sm:inline">Universal Quick Finder</span>
        </div>
      </div>
    </div>
  );
}
