import React, { useState, useEffect } from "react";
import {
  Package,
  BookOpen,
  AlertTriangle,
  RefreshCw,
  CalendarDays,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "../../lib/utils";

// 1. INVENTARIS BAHAN DAPUR (PANTRY & CHILLER)
export function KitchenPantryView() {
  const [items, setItems] = useState(() => {
    try {
      const s = localStorage.getItem("aio_pantry_items");
      if (s) return JSON.parse(s);
    } catch {}
    return [
      { id: "p-1", name: "Minyak Zaitun Extra Virgin 1L", zone: "Rak Kering", qty: "1 Botol", minQty: "1 Botol", status: "Aman" },
      { id: "p-2", name: "Dada Ayam Fillet Segar Beku", zone: "Freezer", qty: "2 kg (4 pack)", minQty: "1 kg", status: "Aman" },
      { id: "p-3", name: "Telur Ayam Omega 3", zone: "Chiller", qty: "10 Butir", minQty: "15 Butir", status: "Perlu Beli" },
      { id: "p-4", name: "Bawang Putih & Bawang Bombay", zone: "Rak Kering", qty: "500 gram", minQty: "1 kg", status: "Perlu Beli" },
      { id: "p-5", name: "Susu Segar UHT Full Cream", zone: "Chiller", qty: "2 Liter", minQty: "1 Liter", status: "Aman" },
    ];
  });

  const [newName, setNewName] = useState("");
  const [newZone, setNewZone] = useState("Chiller");
  const [newQty, setNewQty] = useState("");
  const [newMinQty, setNewMinQty] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("aio_pantry_items", JSON.stringify(items));
    } catch {}
  }, [items]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setItems([
      ...items,
      {
        id: `p-${Date.now()}`,
        name: newName.trim(),
        zone: newZone,
        qty: newQty.trim() || "1 Pack",
        minQty: newMinQty.trim() || "1 Pack",
        status: "Aman",
      },
    ]);
    setNewName("");
    setNewQty("");
    setNewMinQty("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border bg-gradient-to-r from-card to-amber-500/5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Package size={22} />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">Pantry Inventory</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Stok bahan kulkas (Chiller), pembeku (Freezer), dan bumbu kering agar masakan terencana tanpa kekurangan bahan.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleAdd} className="p-4 rounded-xl border border-border bg-card grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Nama bahan makanan / bumbu..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
          required
        />
        <select
          value={newZone}
          onChange={(e) => setNewZone(e.target.value)}
          className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
        >
          <option value="Chiller">Chiller / Kulkas Bawah</option>
          <option value="Freezer">Freezer / Pembeku</option>
          <option value="Rak Kering">Rak Kering & Bumbu</option>
        </select>
        <input
          type="text"
          placeholder="Stok saat ini (contoh: 2 kg)..."
          value={newQty}
          onChange={(e) => setNewQty(e.target.value)}
          className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus size={14} />
          <span>Tambah Bahan</span>
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {items.map((item: any) => (
          <div key={item.id} className="p-4 rounded-xl border border-border bg-card flex flex-col justify-between gap-3 shadow-xs">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  {item.zone}
                </span>
                <span className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                  item.status === "Aman" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                )}>
                  {item.status}
                </span>
              </div>
              <h4 className="font-bold text-sm text-foreground mt-2">{item.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">Stok: <strong className="text-foreground">{item.qty}</strong></p>
            </div>

            <div className="border-t border-border pt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Batas Min: {item.minQty}</span>
              <button
                onClick={() => setItems(items.filter((x: any) => x.id !== item.id))}
                className="hover:text-rose-500 p-1"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. JURNAL MEMASAK (COOK LOG)
export function CookingLogView() {
  const [logs, setLogs] = useState(() => {
    try {
      const s = localStorage.getItem("aio_cooking_logs");
      if (s) return JSON.parse(s);
    } catch {}
    return [
      { id: "cl-1", dishName: "Salmon Ponzu & Quinoa Bowl", date: "2026-09-22", servings: 2, rating: 5, notes: "Kematangan salmon medium well sangat lembut, tingkat keasaman ponzu pas.", prepTime: "25 Menit" },
      { id: "cl-2", dishName: "Truffle Mushroom Risotto", date: "2026-09-18", servings: 4, rating: 4.8, notes: "Kaldunya dimasukkan perlahan, tekstur creamy sempurna disukai tamu.", prepTime: "45 Menit" },
      { id: "cl-3", dishName: "Sup Ikan Dori & Sayur Kuah Bening", date: "2026-09-15", servings: 3, rating: 4.5, notes: "Ringan untuk makan malam tanpa begah, perbanyak jahe lain kali.", prepTime: "20 Menit" },
    ];
  });

  const [dish, setDish] = useState("");
  const [servings, setServings] = useState("2");
  const [rating, setRating] = useState("5");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("aio_cooking_logs", JSON.stringify(logs));
    } catch {}
  }, [logs]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dish.trim()) return;
    setLogs([
      {
        id: `cl-${Date.now()}`,
        dishName: dish.trim(),
        date: new Date().toISOString().split("T")[0],
        servings: Number(servings) || 2,
        rating: Number(rating) || 5,
        notes: notes.trim() || "Eksekusi lancar dan rasa memuaskan.",
        prepTime: "30 Menit",
      },
      ...logs,
    ]);
    setDish("");
    setNotes("");
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-border bg-gradient-to-r from-card to-rose-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <BookOpen size={22} />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">Cook Log</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Catatan eksekusi resep di dapur, review rasa, penyesuaian porsi, dan feedback keluarga.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleAdd} className="p-4 rounded-xl border border-border bg-card space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Nama hidangan yang dimasak..."
            value={dish}
            onChange={(e) => setDish(e.target.value)}
            className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
            required
          />
          <input
            type="number"
            placeholder="Jumlah porsi (contoh: 2)..."
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
          />
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
          >
            <option value="5">⭐⭐⭐⭐⭐ (Sempurna & Sangat Lezat)</option>
            <option value="4.5">⭐⭐⭐⭐½ (Lezat, Ada Sedikit Improv)</option>
            <option value="4">⭐⭐⭐⭐ (Bagus & Standar)</option>
            <option value="3">⭐⭐⭐ (Cukup, Perlu Modifikasi Bumbu)</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Catatan rasa, tekstur, atau pembelajaran teknik memasak..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
        />
        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs cursor-pointer">
            Simpan ke Cook Log
          </button>
        </div>
      </form>

      <div className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden shadow-xs">
        {logs.map((log: any) => (
          <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-foreground">{log.dishName}</h4>
                <span className="text-xs text-amber-500 font-bold">★ {log.rating}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{log.servings} Porsi</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{log.notes}</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
              <span>{log.date}</span>
              <button onClick={() => setLogs(logs.filter((x: any) => x.id !== log.id))} className="hover:text-rose-500 p-1">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. PERINGATAN KADALUARSA (EXPIRY ALERTS)
export function FoodExpiryView() {
  const [items, setItems] = useState(() => {
    try {
      const s = localStorage.getItem("aio_food_expiry");
      if (s) return JSON.parse(s);
    } catch {}
    return [
      { id: "fe-1", name: "Susu Segar Pasteurisasi 1L", location: "Kulkas Utama", expiry: "2026-09-28", daysLeft: 3, urgency: "urgent" },
      { id: "fe-2", name: "Keju Ricotta Segar Kemasan", location: "Chiller", expiry: "2026-10-02", daysLeft: 7, urgency: "warning" },
      { id: "fe-3", name: "Fillet Ikan Kakap Merah Beku", location: "Freezer", expiry: "2026-11-20", daysLeft: 56, urgency: "safe" },
      { id: "fe-4", name: "Saus Pesto Kemasan Kaca", location: "Rak Bumbu", expiry: "2026-10-15", daysLeft: 20, urgency: "safe" },
    ];
  });

  const [name, setName] = useState("");
  const [loc, setLoc] = useState("Kulkas");
  const [date, setDate] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("aio_food_expiry", JSON.stringify(items));
    } catch {}
  }, [items]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) return;
    setItems([
      ...items,
      {
        id: `fe-${Date.now()}`,
        name: name.trim(),
        location: loc,
        expiry: date,
        daysLeft: 10,
        urgency: "warning",
      },
    ]);
    setName("");
    setDate("");
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-border bg-gradient-to-r from-card to-amber-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">Expiry Alert</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pantau bahan yang mendekati batas konsumsi untuk memprioritaskan menu harian dan menekan pemborosan pangan.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleAdd} className="p-4 rounded-xl border border-border bg-card grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Nama makanan / minuman..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="Lokasi (Kulkas / Rak)..."
          value={loc}
          onChange={(e) => setLoc(e.target.value)}
          className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
          required
        />
        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs cursor-pointer">
          Catat Batas Kedaluwarsa
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item: any) => (
          <div
            key={item.id}
            className={cn(
              "p-4 rounded-xl border bg-card flex items-center justify-between gap-3 shadow-xs",
              item.urgency === "urgent" ? "border-rose-500/30 bg-rose-500/5" : "border-border"
            )}
          >
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full",
                    item.urgency === "urgent"
                      ? "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  )}
                >
                  {item.urgency === "urgent" ? "Konsumsi Segera!" : "Aman"}
                </span>
                <span className="text-[11px] text-muted-foreground">📍 {item.location}</span>
              </div>
              <h4 className="font-bold text-sm text-foreground mt-1.5">{item.name}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Batas: <strong className="text-foreground">{item.expiry}</strong></p>
            </div>

            <button onClick={() => setItems(items.filter((x: any) => x.id !== item.id))} className="text-muted-foreground hover:text-rose-500 p-1">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. MANAJEMEN MAKANAN SISA (LEFTOVERS)
export function LeftoversManagerView() {
  const [leftovers, setLeftovers] = useState(() => {
    try {
      const s = localStorage.getItem("aio_leftovers_items");
      if (s) return JSON.parse(s);
    } catch {}
    return [
      { id: "lo-1", dish: "Nasi Merah Organik Matang (2 Porsi)", storedDate: "2026-09-24", transformIdea: "Nasi Goreng Sehat Dada Ayam & Sayur", status: "Perlu Olah Hari Ini" },
      { id: "lo-2", dish: "Potongan Daging Panggang Rosemary", storedDate: "2026-09-23", transformIdea: "Topping Salad Romaine dressing wijen sangrai", status: "Siap Olah" },
      { id: "lo-3", dish: "Sup Kaldu Tulang Sapi Gurih", storedDate: "2026-09-24", transformIdea: "Kuah Ramen Jepang & Mie Shirataki", status: "Siap Olah" },
    ];
  });

  const [newDish, setNewDish] = useState("");
  const [newIdea, setNewIdea] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("aio_leftovers_items", JSON.stringify(leftovers));
    } catch {}
  }, [leftovers]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.trim()) return;
    setLeftovers([
      ...leftovers,
      {
        id: `lo-${Date.now()}`,
        dish: newDish.trim(),
        storedDate: new Date().toISOString().split("T")[0],
        transformIdea: newIdea.trim() || "Olah untuk makan malam",
        status: "Siap Olah",
      },
    ]);
    setNewDish("");
    setNewIdea("");
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-border bg-gradient-to-r from-card to-emerald-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <RefreshCw size={22} />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">Leftover Manager</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Transformasikan sisa hidangan berkualitas menjadi sajian baru yang segar, lezat, dan bergizi.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleAdd} className="p-4 rounded-xl border border-border bg-card grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Makanan sisa di kulkas..."
          value={newDish}
          onChange={(e) => setNewDish(e.target.value)}
          className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="Rencana ide transformasi sajian baru..."
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
          className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
        />
        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs cursor-pointer">
          Catat di Leftover Manager
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {leftovers.map((lo: any) => (
          <div key={lo.id} className="p-4 rounded-xl border border-border bg-card flex flex-col justify-between gap-3 shadow-xs">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                {lo.status}
              </span>
              <h4 className="font-bold text-sm text-foreground mt-2">{lo.dish}</h4>
              <div className="mt-2 p-2.5 rounded-lg bg-muted/40 text-xs">
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Ide Pemanfaatan:</span>
                <p className="text-foreground font-medium mt-0.5">💡 {lo.transformIdea}</p>
              </div>
            </div>

            <div className="border-t border-border pt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Disimpan: {lo.storedDate}</span>
              <button onClick={() => setLeftovers(leftovers.filter((x: any) => x.id !== lo.id))} className="hover:text-rose-500 p-1">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. PERENCANA MENU MINGGUAN (MEAL PLANNER)
export function WeeklyMealPlannerView() {
  const [plans, setPlans] = useState(() => {
    try {
      const s = localStorage.getItem("aio_weekly_meal_plans");
      if (s) return JSON.parse(s);
    } catch {}
    return [
      { day: "Senin", breakfast: "Oatmeal Chia Seed & Buah Beri", lunch: "Salmon Quinoa Ponzu Bowl", dinner: "Sup Ikan Bening Jamur Enoki" },
      { day: "Selasa", breakfast: "Telur Orak-Arik Alpukat & Roti Gandum", lunch: "Dada Ayam Panggang Rosemary", dinner: "Salad Sayur Segar Tempe Panggang" },
      { day: "Rabu", breakfast: "Green Smoothie Bayam Nanas Protein", lunch: "Gado-Gado Siram Kacang Mede", dinner: "Steak Salmon Asparagus" },
      { day: "Kamis", breakfast: "Overnight Oats Greek Yogurt", lunch: "Sup Ayam Kampung Jahe Herbal", dinner: "Tahu Tempe Bacem Panggang & Tumis Buncis" },
      { day: "Jumat", breakfast: "Avocado Toast Poached Egg", lunch: "Truffle Mushroom Risotto", dinner: "Sup Daging Sayuran Ringan" },
      { day: "Sabtu", breakfast: "Pancake Pisang Gandum Utuh", lunch: "Steak Tenderloin Panggang Sayur", dinner: "Hosting Klien / Makan di Luar" },
      { day: "Minggu", breakfast: "Bubur Ayam Kampung Oat Rendah Kalori", lunch: "Ikan Bakar Bumbu Kuning & Lalapan", dinner: "Detoks Buah & Rehat Cerna" },
    ];
  });

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-border bg-gradient-to-r from-card to-blue-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <CalendarDays size={22} />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">Meal Planner</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Atur komposisi sarapan, makan siang, dan makan malam keluarga selama 7 hari untuk gizi berimbang.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((p: any, idx: number) => (
          <div key={idx} className="p-4 rounded-xl border border-border bg-card shadow-xs flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="font-bold text-sm text-foreground">{p.day}</span>
                <span className="text-[10px] font-semibold text-primary">3 Sesi Makan</span>
              </div>

              <div className="mt-3 space-y-2.5 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-500">Pagi (Sarapan)</span>
                  <p className="text-foreground font-medium mt-0.5">{p.breakfast}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-500">Siang (Makan Siang)</span>
                  <p className="text-foreground font-medium mt-0.5">{p.lunch}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-500">Malam (Makan Malam)</span>
                  <p className="text-foreground font-medium mt-0.5">{p.dinner}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
