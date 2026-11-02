import React, { useState, useEffect, useMemo } from "react";
import {
  ShoppingCart,
  CheckCircle2,
  Plus,
  Trash2,
  Search,
  DollarSign,
  Tag,
  Store,
  Check,
  TrendingUp,
  ShoppingBag,
  Clock,
} from "lucide-react";
import { cn } from "../../lib/utils";

export type ShoppingCategory =
  | "Groceries & Fresh Food"
  | "Brain Fuel & Suplemen"
  | "Office & Tech Gear"
  | "Travel Essentials"
  | "Home & Wellbeing";

export type PriorityLevel = "Mendesak" | "Penting" | "Normal";

export interface ShoppingItem {
  id: string;
  name: string;
  category: ShoppingCategory;
  quantity: string;
  estimatedPrice: number; // in IDR
  priority: PriorityLevel;
  storeNote: string;
  isCompleted: boolean;
  addedDate: string;
}

const INITIAL_SHOPPING_ITEMS: ShoppingItem[] = [
  {
    id: "shop-1",
    name: "Ceremonial Grade Uji Matcha (100g kaleng)",
    category: "Brain Fuel & Suplemen",
    quantity: "2 kaleng",
    estimatedPrice: 380000,
    priority: "Mendesak",
    storeNote: "Ippodo Tea / Kemchicks SCBD",
    isCompleted: false,
    addedDate: "18 Sep 2026",
  },
  {
    id: "shop-2",
    name: "Fillet Salmon Liar Grade Sashimi (Fresh)",
    category: "Groceries & Fresh Food",
    quantity: "600 gram",
    estimatedPrice: 245000,
    priority: "Mendesak",
    storeNote: "Grand Lucky Superstore Pacific Place",
    isCompleted: false,
    addedDate: "18 Sep 2026",
  },
  {
    id: "shop-3",
    name: "Susu Oat Barista Organik (Unsweetened)",
    category: "Groceries & Fresh Food",
    quantity: "4 liter",
    estimatedPrice: 190000,
    priority: "Penting",
    storeNote: "Kemchicks / Tokopedia Mart",
    isCompleted: true,
    addedDate: "17 Sep 2026",
  },
  {
    id: "shop-4",
    name: "Organik Lion's Mane Extract Powder (150g)",
    category: "Brain Fuel & Suplemen",
    quantity: "1 pouch",
    estimatedPrice: 275000,
    priority: "Penting",
    storeNote: "Herb & Tonic Direct Official",
    isCompleted: false,
    addedDate: "17 Sep 2026",
  },
  {
    id: "shop-5",
    name: "Universal Multi-Country Travel Adapter 65W GaN",
    category: "Travel Essentials",
    quantity: "1 unit",
    estimatedPrice: 420000,
    priority: "Penting",
    storeNote: "Anker / Erajaya Flagship Store",
    isCompleted: false,
    addedDate: "16 Sep 2026",
  },
  {
    id: "shop-6",
    name: "Moleskine Pro Hardcover Executive Notebook A5",
    category: "Office & Tech Gear",
    quantity: "2 buku",
    estimatedPrice: 560000,
    priority: "Normal",
    storeNote: "Kinokuniya Grand Indonesia",
    isCompleted: true,
    addedDate: "15 Sep 2026",
  },
  {
    id: "shop-7",
    name: "Quinoa Putih & Hitam Organik (1kg)",
    category: "Groceries & Fresh Food",
    quantity: "1 pack",
    estimatedPrice: 145000,
    priority: "Normal",
    storeNote: "Grand Lucky Superstore",
    isCompleted: false,
    addedDate: "18 Sep 2026",
  },
  {
    id: "shop-8",
    name: "Essential Oil Diffuser Blend: French Lavender & Cedarwood",
    category: "Home & Wellbeing",
    quantity: "2 botol",
    estimatedPrice: 320000,
    priority: "Normal",
    storeNote: "Sensatia Botanicals Plaza Senayan",
    isCompleted: false,
    addedDate: "18 Sep 2026",
  },
];

const LOCAL_STORAGE_KEY = "aio_shopping_list_v1";

export function ShoppingListView() {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_SHOPPING_ITEMS;
  });

  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<ShoppingCategory>("Groceries & Fresh Food");
  const [newQuantity, setNewQuantity] = useState("1 unit");
  const [newPrice, setNewPrice] = useState("");
  const [newPriority, setNewPriority] = useState<PriorityLevel>("Penting");
  const [newStore, setNewStore] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const categories: string[] = [
    "Semua",
    "Groceries & Fresh Food",
    "Brain Fuel & Suplemen",
    "Office & Tech Gear",
    "Travel Essentials",
    "Home & Wellbeing",
  ];

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  const deleteItem = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCompleted = () => {
    if (confirm("Hapus semua item yang sudah selesai dibeli?")) {
      setItems((prev) => prev.filter((item) => !item.isCompleted));
    }
  };


  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // status tab
      if (activeTab === "pending" && item.isCompleted) return false;
      if (activeTab === "completed" && !item.isCompleted) return false;

      // category
      if (selectedCategory !== "Semua" && item.category !== selectedCategory) return false;

      // search
      const q = searchQuery.toLowerCase();
      if (
        q &&
        !item.name.toLowerCase().includes(q) &&
        !item.storeNote.toLowerCase().includes(q) &&
        !item.category.toLowerCase().includes(q)
      ) {
        return false;
      }

      return true;
    });
  }, [items, activeTab, selectedCategory, searchQuery]);

  // Financial calculations
  const totalEstimatedCost = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);
  }, [items]);

  const totalSpent = useMemo(() => {
    return items
      .filter((item) => item.isCompleted)
      .reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);
  }, [items]);

  const remainingBudget = totalEstimatedCost - totalSpent;
  const completedCount = items.filter((i) => i.isCompleted).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const priceNum = parseInt(newPrice.replace(/\D/g, ""), 10) || 0;

    const newItem: ShoppingItem = {
      id: `shop-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      quantity: newQuantity.trim() || "1 unit",
      estimatedPrice: priceNum,
      priority: newPriority,
      storeNote: newStore.trim() || "Toko Pilihan",
      isCompleted: false,
      addedDate: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    setItems((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);

    // reset
    setNewName("");
    setNewPrice("");
    setNewStore("");
    setNewQuantity("1 unit");
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Budget / Progress Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Estimasi Belanja
            </span>
            <DollarSign size={18} className="text-blue-500" />
          </div>
          <p className="text-xl md:text-2xl font-bold text-foreground mt-2">
            {formatIDR(totalEstimatedCost)}
          </p>
          <span className="text-xs text-muted-foreground">{items.length} item terdaftar</span>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Sudah Dibelanjakan
            </span>
            <CheckCircle2 size={18} className="text-emerald-500" />
          </div>
          <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            {formatIDR(totalSpent)}
          </p>
          <span className="text-xs text-muted-foreground">{completedCount} item selesai</span>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Sisa Kebutuhan Dana
            </span>
            <TrendingUp size={18} className="text-amber-500" />
          </div>
          <p className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">
            {formatIDR(remainingBudget)}
          </p>
          <span className="text-xs text-muted-foreground">
            {items.length - completedCount} item tersisa
          </span>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Progress Pengadaan
              </span>
              <span className="text-xs font-bold text-blue-600">{progressPercent}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 mt-3 overflow-hidden">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/60 text-xs text-muted-foreground">
            <span>Status</span>
            <span className="font-semibold text-foreground">
              {completedCount} dari {items.length} selesai
            </span>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search, Category Filter, Tab Buttons, Add Item */}
      <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari item, merek, atau toko..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Tab Filter: Semua, Belum Dibeli, Selesai */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl w-full md:w-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                activeTab === "all" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Semua ({items.length})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={cn(
                "flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                activeTab === "pending"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Belum Dibeli ({items.length - completedCount})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={cn(
                "flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                activeTab === "completed"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Selesai ({completedCount})
            </button>
          </div>

          {/* Quick Action buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/40 px-3 py-2 rounded-xl transition-colors font-medium"
                title="Hapus item yang sudah dibeli"
              >
                <Trash2 size={14} />
                <span className="hidden sm:inline">Hapus Selesai</span>
              </button>
            )}

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-blue-600/25 shrink-0"
            >
              <Plus size={16} />
              <span>Tambah Item</span>
            </button>
          </div>
        </div>

        {/* Category Pills horizontal scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-border/50 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150",
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                  : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="border border-dashed border-border rounded-3xl p-12 text-center bg-card/40 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 text-blue-600">
            <ShoppingCart size={28} />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Tidak ada item belanja</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            {activeTab === "completed"
              ? "Belum ada item yang ditandai selesai."
              : "Semua kebutuhan belanja Anda telah terpenuhi atau coba ganti filter kategori."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const isDone = item.isCompleted;
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={cn(
                  "group bg-card border rounded-2xl p-4 transition-all duration-150 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3",
                  isDone
                    ? "border-border/40 bg-muted/20 opacity-70"
                    : "border-border/80 hover:border-blue-500/50 shadow-sm hover:shadow"
                )}
              >
                {/* Left checkbox & title details */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItem(item.id);
                    }}
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 transition-colors",
                      isDone
                        ? "bg-emerald-500 text-white"
                        : "border-2 border-muted-foreground hover:border-blue-500"
                    )}
                  >
                    {isDone ? <Check size={14} /> : null}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={cn(
                          "text-sm font-semibold text-foreground transition-all",
                          isDone ? "line-through text-muted-foreground" : "group-hover:text-blue-600"
                        )}
                      >
                        {item.name}
                      </h4>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Tag size={12} className="text-blue-500" />
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Store size={12} className="text-amber-500" />
                        {item.storeNote}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] opacity-80">
                        <Clock size={11} />
                        {item.addedDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right priority badge, price & delete */}
                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <span
                    className={cn(
                      "text-[11px] font-semibold px-2.5 py-1 rounded-lg",
                      item.priority === "Mendesak"
                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                        : item.priority === "Penting"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {item.priority}
                  </span>

                  <span className="font-bold text-sm text-foreground min-w-[100px] text-right">
                    {formatIDR(item.estimatedPrice)}
                  </span>

                  <button
                    onClick={(e) => deleteItem(item.id, e)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors opacity-80 group-hover:opacity-100"
                    title="Hapus item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">Tambah Item Belanja</h3>
                  <p className="text-xs text-muted-foreground">Catat kebutuhan pengadaan &amp; estimasi biaya</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-muted text-muted-foreground flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Nama Item / Barang *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kopi Single Origin Beans Gayo 500g"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Kategori Item
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ShoppingCategory)}
                    className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Groceries & Fresh Food">Groceries &amp; Fresh Food</option>
                    <option value="Brain Fuel & Suplemen">Brain Fuel &amp; Suplemen</option>
                    <option value="Office & Tech Gear">Office &amp; Tech Gear</option>
                    <option value="Travel Essentials">Travel Essentials</option>
                    <option value="Home & Wellbeing">Home &amp; Wellbeing</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Jumlah / Takaran
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 2 pak / 500 gram"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Estimasi Harga (Rp)
                  </label>
                  <input
                    type="number"
                    placeholder="Contoh: 150000"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Prioritas Pembelian
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                    className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl"
                  >
                    <option value="Mendesak">Mendesak (High)</option>
                    <option value="Penting">Penting (Medium)</option>
                    <option value="Normal">Normal (Regular)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Rujukan Toko / Vendor Pembelian
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kemchicks SCBD / Tokopedia Official"
                  value={newStore}
                  onChange={(e) => setNewStore(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm"
                >
                  Tambahkan ke List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
