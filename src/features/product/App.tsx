import React, { useState } from "react";
import { TrackedItem, ItemCategory } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { AddItemForm } from "./components/AddItemForm";
import { ItemCard } from "./components/ItemCard";
import { calculateStatus, calculateTotalCost, formatCurrency } from "./utils";
import { motion, AnimatePresence } from "motion/react";
import { AlertOctagon, AlertTriangle, CheckCircle2, Plus, Search, Wallet } from "lucide-react";

function Metrik({
  ikon,
  label,
  nilai,
  catatan,
}: {
  ikon: React.ReactNode;
  label: string;
  nilai: string;
  catatan: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-foreground">
          {ikon}
        </span>
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight">{nilai}</p>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{catatan}</p>
    </div>
  );
}

export default function App_Component() {
  const [items, setItems] = useLocalStorage<TrackedItem[]>("lifespan_tracker_items", []);
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<ItemCategory | "Semua">("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddItem = (newItemData: Omit<TrackedItem, "id" | "createdAt">) => {
    const newItem: TrackedItem = {
      ...newItemData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setItems((prev) => [newItem, ...prev]);
    setIsAdding(false);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Stats
  const activeItems = items.filter((i) => calculateStatus(i.endDate) === "aman").length;
  const expiringSoonItems = items.filter(
    (i) => calculateStatus(i.endDate) === "hampir_habis",
  ).length;
  const expiredItems = items.filter((i) => calculateStatus(i.endDate) === "kadaluarsa").length;

  const totalAssetValue = items.reduce(
    (acc, item) => acc + calculateTotalCost(item.price, item.quantity, item.discount),
    0,
  );

  // Filter & Search
  const filteredItems = items
    .filter((item) => filter === "Semua" || item.category === filter)
    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());

  return (
    <div className="space-y-6 pt-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metrik
          ikon={<Wallet className="size-4" />}
          label="Total Aset"
          nilai={formatCurrency(totalAssetValue)}
          catatan={`${items.length} Barang terdaftar`}
        />
        <Metrik
          ikon={<CheckCircle2 className="size-4 text-emerald-600" />}
          label="Aman"
          nilai={`${activeItems}`}
          catatan="Kondisi baik"
        />
        <Metrik
          ikon={<AlertTriangle className="size-4 text-amber-600" />}
          label="Peringatan"
          nilai={`${expiringSoonItems}`}
          catatan="Hampir habis/kadaluarsa"
        />
        <Metrik
          ikon={<AlertOctagon className="size-4 text-rose-600" />}
          label="Kritis"
          nilai={`${expiredItems}`}
          catatan="Perlu penggantian"
        />
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0, overflow: "hidden" }}
            animate={{ opacity: 1, height: "auto", overflow: "visible" }}
            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
            transition={{ duration: 0.2 }}
          >
            <AddItemForm onAdd={handleAddItem} onCancel={() => setIsAdding(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari barang..."
            className="flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-auto flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            Kategori:
          </span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="flex h-9 w-full sm:w-40 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Makanan">Makanan</option>
            <option value="Obat">Obat</option>
            <option value="Kosmetik">Kosmetik</option>
            <option value="Elektronik">Elektronik</option>
            <option value="Lainnya">Lainnya</option>
          </select>
          <button
            onClick={() => setIsAdding(true)}
            disabled={isAdding}
            className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-border rounded-2xl bg-card">
          <div className="flex size-12 items-center justify-center rounded-lg bg-accent text-muted-foreground mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold tracking-tight text-foreground">Belum ada barang</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Tambahkan barang pertama Anda untuk mulai melacak masa pakainya.
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" /> Tambah Barang
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 text-sm text-muted-foreground bg-card rounded-2xl border border-border">
          Tidak ada barang yang cocok dengan pencarian Anda.
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ItemCard item={item} onDelete={handleDeleteItem} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
