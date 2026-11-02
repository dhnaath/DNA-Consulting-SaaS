import React, { useState, useMemo } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { GroceryItem, GroceryCategory, GroceryStatus, RestockCycle } from '../../types';
import {
  ShoppingCart,
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Package,
  Layers,
  Sparkles,
  Trash2,
  Edit2,
  Star,
  RotateCcw,
  Check,
  AlertCircle,
  Tag,
  Store,
  DollarSign,
  Table as TableIcon,
  CheckSquare,
  X,
  Apple,
  Beef,
  Milk,
  Wheat,
  UtensilsCrossed,
  Cookie,
  Sparkle,
  ArrowRight,
} from 'lucide-react';

const CATEGORY_ICONS: Record<GroceryCategory, React.ElementType> = {
  'Sayuran & Buah': Apple,
  'Daging & Ikan': Beef,
  'Susu & Telur': Milk,
  'Bahan Pokok': Wheat,
  'Bumbu & Rempah': UtensilsCrossed,
  'Camilan & Minuman': Cookie,
  'Kebersihan Rumah': Sparkle,
};

const CATEGORY_COLORS: Record<GroceryCategory, string> = {
  'Sayuran & Buah': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Daging & Ikan': 'bg-rose-50 text-rose-700 border-rose-200',
  'Susu & Telur': 'bg-blue-50 text-blue-700 border-blue-200',
  'Bahan Pokok': 'bg-amber-50 text-amber-700 border-amber-200',
  'Bumbu & Rempah': 'bg-orange-50 text-orange-700 border-orange-200',
  'Camilan & Minuman': 'bg-purple-50 text-purple-700 border-purple-200',
  'Kebersihan Rumah': 'bg-cyan-50 text-cyan-700 border-cyan-200',
};

function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export const GroceryListView: React.FC = () => {
  const {
    groceryList,
    addGroceryItem,
    updateGroceryItem,
    deleteGroceryItem,
    toggleGroceryStatus,
    clearCompletedGroceryCart,
    restockGroceryItem,
    addTransaction,
    searchQuery,
  } = useLifeOS();

  const [activeTab, setActiveTab] = useState<'shopping' | 'pantry' | 'table' | 'favorites'>('shopping');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Omit<GroceryItem, 'id'>>({
    name: '',
    category: 'Sayuran & Buah',
    status: 'Need to Buy',
    quantity: 1,
    unit: 'pcs',
    estimatedPrice: 0,
    store: 'Supermarket',
    restockCycle: 'Mingguan',
    expiryDate: '',
    isFavorite: false,
    notes: '',
  });

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Sayuran & Buah',
      status: 'Need to Buy',
      quantity: 1,
      unit: 'pcs',
      estimatedPrice: 0,
      store: 'Supermarket',
      restockCycle: 'Mingguan',
      expiryDate: '',
      isFavorite: false,
      notes: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: GroceryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      status: item.status,
      quantity: item.quantity,
      unit: item.unit,
      estimatedPrice: item.estimatedPrice,
      actualPrice: item.actualPrice,
      store: item.store || 'Supermarket',
      restockCycle: item.restockCycle,
      expiryDate: item.expiryDate || '',
      isFavorite: item.isFavorite,
      notes: item.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingItem) {
      updateGroceryItem(editingItem.id, formData);
    } else {
      addGroceryItem(formData);
    }
    setIsModalOpen(false);
  };

  // Calculations
  const stats = useMemo(() => {
    const needToBuyItems = groceryList.filter((i) => i.status === 'Need to Buy');
    const inCartItems = groceryList.filter((i) => i.status === 'In Cart');
    const inStockItems = groceryList.filter((i) => i.status === 'In Stock');
    const favorites = groceryList.filter((i) => i.isFavorite);

    const needToBuyTotalCost = needToBuyItems.reduce((acc, i) => acc + (i.estimatedPrice || 0), 0);
    const inCartTotalCost = inCartItems.reduce(
      (acc, i) => acc + (i.actualPrice || i.estimatedPrice || 0),
      0
    );

    return {
      needToBuyCount: needToBuyItems.length,
      needToBuyTotalCost,
      inCartCount: inCartItems.length,
      inCartTotalCost,
      inStockCount: inStockItems.length,
      favoritesCount: favorites.length,
    };
  }, [groceryList]);

  // Filtered Items
  const filteredList = useMemo(() => {
    return groceryList.filter((item) => {
      // Tab filter
      if (activeTab === 'shopping' && item.status === 'In Stock') return false;
      if (activeTab === 'pantry' && item.status !== 'In Stock') return false;
      if (activeTab === 'favorites' && !item.isFavorite) return false;

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      // Store filter
      if (selectedStore !== 'all' && item.store !== selectedStore) return false;

      // Search
      const term = (searchQuery || localSearch).toLowerCase().trim();
      if (term) {
        const matchName = item.name.toLowerCase().includes(term);
        const matchCat = item.category.toLowerCase().includes(term);
        const matchStore = (item.store || '').toLowerCase().includes(term);
        if (!matchName && !matchCat && !matchStore) return false;
      }
      return true;
    });
  }, [groceryList, activeTab, selectedCategory, selectedStore, searchQuery, localSearch]);

  // Grouped by Category for Shopping Mode
  const groupedCategories = useMemo(() => {
    const map = new Map<GroceryCategory, GroceryItem[]>();
    filteredList.forEach((item) => {
      const list = map.get(item.category) || [];
      list.push(item);
      map.set(item.category, list);
    });
    return Array.from(map.entries());
  }, [filteredList]);

  const handleCheckoutComplete = (logExpense: boolean) => {
    const inCartItems = groceryList.filter((i) => i.status === 'In Cart');
    if (inCartItems.length === 0) return;

    if (logExpense) {
      const totalAmount = inCartItems.reduce(
        (sum, i) => sum + (i.actualPrice || i.estimatedPrice || 0),
        0
      );
      addTransaction({
        type: 'expense',
        name: `Belanja Dapur & Grocery (${inCartItems.length} barang)`,
        amount: totalAmount,
        date: new Date().toISOString().split('T')[0],
        category: 'Food & Groceries',
        note: `Item dibeli: ${inCartItems.map((i) => i.name).slice(0, 4).join(', ')}...`,
      });
    }

    clearCompletedGroceryCart();
    setShowCheckoutModal(false);
  };

  const allCategories: GroceryCategory[] = [
    'Sayuran & Buah',
    'Daging & Ikan',
    'Susu & Telur',
    'Bahan Pokok',
    'Bumbu & Rempah',
    'Camilan & Minuman',
    'Kebersihan Rumah',
  ];

  const stores = ['Supermarket', 'Pasar Tradisional', 'Minimarket', 'Online Mart'];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Banner */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700 shadow-xs">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-neutral-900 tracking-tight font-serif">
                  Grocery List & Pantry Tracker
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-medium border border-neutral-200/60">
                  {groceryList.length} item
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Checklist belanja harian/mingguan, estimasi bujet belanja, dan inventaris stok bahan makanan dapur
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {stats.inCartCount > 0 && (
              <button
                onClick={() => setShowCheckoutModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Selesaikan Belanja ({stats.inCartCount})</span>
              </button>
            )}

            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Item Belanja</span>
            </button>
          </div>
        </div>

        {/* Metric KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-neutral-100">
          <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Perlu Dibeli
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-semibold text-neutral-900">
                {stats.needToBuyCount}
              </span>
              <span className="text-xs text-neutral-500">item</span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Estimasi: {formatIDR(stats.needToBuyTotalCost)}
            </span>
          </div>

          <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Dalam Keranjang Belanja
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-semibold text-emerald-700">
                {stats.inCartCount}
              </span>
              <span className="text-xs text-neutral-500">sudah diambil</span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block font-mono">
              Total keranjang: {formatIDR(stats.inCartTotalCost)}
            </span>
          </div>

          <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Stok Pantry Dapur
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-semibold text-blue-700">
                {stats.inStockCount}
              </span>
              <span className="text-xs text-neutral-500">item tersedia</span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Siap di-restock jika habis
            </span>
          </div>

          <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Bahan Pokok Rutin
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-semibold text-amber-700">
                {stats.favoritesCount}
              </span>
              <span className="text-xs text-neutral-500">favorit</span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Kebutuhan mingguan berkala
            </span>
          </div>
        </div>
      </div>

      {/* Primary Tab Switcher */}
      <div className="flex items-center gap-1 border-b border-neutral-200 pb-2">
        <button
          onClick={() => setActiveTab('shopping')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'shopping'
              ? 'bg-neutral-900 text-white shadow-2xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Checklist Belanja Aktif</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
            {stats.needToBuyCount + stats.inCartCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('pantry')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'pantry'
              ? 'bg-neutral-900 text-white shadow-2xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Inventaris Pantry Dapur</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-200 text-neutral-700">
            {stats.inStockCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'favorites'
              ? 'bg-neutral-900 text-white shadow-2xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Bahan Pokok Rutin</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-200 text-neutral-700">
            {stats.favoritesCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('table')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'table'
              ? 'bg-neutral-900 text-white shadow-2xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <TableIcon className="w-3.5 h-3.5" />
          <span>Tabel Database</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Cari item bahan belanja, bumbu, merk..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 bg-neutral-50 hover:bg-neutral-100/80 focus:bg-white text-xs border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-400 transition-all text-neutral-900"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Store Filter */}
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700 focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
            >
              <option value="all">Semua Tempat Belanja</option>
              {stores.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
            }`}
          >
            Semua Aisle / Kategori ({groceryList.length})
          </button>
          {allCategories.map((cat) => {
            const count = groceryList.filter((i) => i.category === cat).length;
            const Icon = CATEGORY_ICONS[cat] || Apple;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Views */}
      {filteredList.length === 0 ? (
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-12 text-center">
          <ShoppingCart className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-neutral-900">Tidak ada item belanja yang ditemukan</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Coba sesuaikan tab atau kata kunci pencarian bahan belanjaan dapur Anda.
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-medium hover:bg-neutral-800 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Item Baru</span>
          </button>
        </div>
      ) : activeTab === 'shopping' ? (
        /* Shopping Mode Checklist (Grouped by Category) */
        <div className="space-y-6">
          {groupedCategories.map(([category, items]) => {
            const CategoryIcon = CATEGORY_ICONS[category] || Apple;
            const subtotal = items.reduce(
              (acc, i) => acc + (i.actualPrice || i.estimatedPrice || 0),
              0
            );

            return (
              <div
                key={category}
                className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-2xs"
              >
                {/* Category Header */}
                <div className="px-4 py-3 bg-neutral-50/80 border-b border-neutral-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="w-4 h-4 text-neutral-600" />
                    <h3 className="text-xs font-semibold text-neutral-900">{category}</h3>
                    <span className="text-[11px] text-neutral-400">({items.length} item)</span>
                  </div>
                  <span className="text-xs font-mono font-medium text-neutral-600">
                    Subtotal: {formatIDR(subtotal)}
                  </span>
                </div>

                {/* Items Checklist */}
                <div className="divide-y divide-neutral-100">
                  {items.map((item) => {
                    const isInCart = item.status === 'In Cart';

                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 flex items-center justify-between gap-3 transition-colors ${
                          isInCart ? 'bg-emerald-50/30' : 'hover:bg-neutral-50/50'
                        }`}
                      >
                        {/* Checkbox & Name */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <button
                            type="button"
                            onClick={() => toggleGroceryStatus(item.id)}
                            className="cursor-pointer shrink-0 transition-transform active:scale-90"
                            title={isInCart ? 'Keluarkan dari keranjang' : 'Masukkan ke keranjang'}
                          >
                            {isInCart ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="w-5 h-5 text-neutral-300 hover:text-neutral-500" />
                            )}
                          </button>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold ${
                                  isInCart
                                    ? 'line-through text-neutral-400'
                                    : 'text-neutral-900'
                                }`}
                              >
                                {item.name}
                              </span>
                              {item.isFavorite && (
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                              )}
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                                {item.quantity} {item.unit}
                              </span>
                            </div>

                            <div className="text-[11px] text-neutral-500 flex items-center gap-2 mt-0.5 flex-wrap">
                              {item.store && (
                                <span className="flex items-center gap-1">
                                  <Store className="w-3 h-3 text-neutral-400" />
                                  {item.store}
                                </span>
                              )}
                              {item.notes && <span className="text-neutral-400">• {item.notes}</span>}
                            </div>
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span
                              className={`text-xs font-mono font-semibold ${
                                isInCart ? 'text-emerald-700' : 'text-neutral-900'
                              }`}
                            >
                              {formatIDR(item.actualPrice || item.estimatedPrice || 0)}
                            </span>
                            <div className="text-[10px] text-neutral-400">
                              {isInCart ? 'Di keranjang' : 'Perlu dibeli'}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1 text-neutral-400 hover:text-neutral-700 rounded"
                              title="Edit Item"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Hapus ${item.name} dari daftar belanja?`)) {
                                  deleteGroceryItem(item.id);
                                }
                              }}
                              className="p-1 text-neutral-400 hover:text-rose-600 rounded"
                              title="Hapus Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : activeTab === 'pantry' ? (
        /* Pantry Inventory View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map((item) => {
            const CategoryIcon = CATEGORY_ICONS[item.category] || Apple;
            const categoryColor = CATEGORY_COLORS[item.category] || 'bg-neutral-100 text-neutral-700';

            return (
              <div
                key={item.id}
                className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-all space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded border ${categoryColor}`}
                    >
                      <CategoryIcon className="w-3 h-3" />
                      {item.category}
                    </span>
                    <button
                      onClick={() =>
                        updateGroceryItem(item.id, { isFavorite: !item.isFavorite })
                      }
                      className="p-0.5"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          item.isFavorite
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-neutral-300 hover:text-amber-400'
                        }`}
                      />
                    </button>
                  </div>

                  <h3 className="text-sm font-semibold text-neutral-900 mt-2">{item.name}</h3>

                  <div className="text-xs text-neutral-500 mt-1 flex items-center justify-between">
                    <span>Stok Saat Ini:</span>
                    <span className="font-mono font-medium text-neutral-900">
                      {item.quantity} {item.unit}
                    </span>
                  </div>

                  {item.expiryDate && (
                    <div className="text-[11px] text-neutral-500 mt-1 flex items-center justify-between">
                      <span>Kedaluwarsa:</span>
                      <span className="font-medium text-neutral-700">{item.expiryDate}</span>
                    </div>
                  )}

                  {item.notes && (
                    <p className="text-xs text-neutral-500 mt-2 bg-neutral-50 p-2 rounded border border-neutral-100">
                      {item.notes}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <button
                    onClick={() => restockGroceryItem(item.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-medium transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Perlu Beli Lagi</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus ${item.name} dari pantry?`)) {
                          deleteGroceryItem(item.id);
                        }
                      }}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-medium uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Nama Barang</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Jumlah</th>
                  <th className="py-3 px-3">Harga Estimasi</th>
                  <th className="py-3 px-3">Tempat Belanja</th>
                  <th className="py-3 px-3">Siklus Restock</th>
                  <th className="py-3 px-3">Kedaluwarsa</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredList.map((item) => {
                  const CategoryIcon = CATEGORY_ICONS[item.category] || Apple;
                  const categoryColor = CATEGORY_COLORS[item.category] || 'bg-neutral-100 text-neutral-700';

                  return (
                    <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                          {item.name}
                          {item.isFavorite && (
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded border ${categoryColor}`}
                        >
                          <CategoryIcon className="w-3 h-3" />
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                            item.status === 'Need to Buy'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : item.status === 'In Cart'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-neutral-700 whitespace-nowrap">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-neutral-900 whitespace-nowrap">
                        {formatIDR(item.actualPrice || item.estimatedPrice || 0)}
                      </td>
                      <td className="py-3 px-3 text-neutral-600 whitespace-nowrap">
                        {item.store || '-'}
                      </td>
                      <td className="py-3 px-3 text-neutral-500 whitespace-nowrap">
                        {item.restockCycle}
                      </td>
                      <td className="py-3 px-3 text-neutral-500 whitespace-nowrap">
                        {item.expiryDate || '-'}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus ${item.name}?`)) {
                                deleteGroceryItem(item.id);
                              }
                            }}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Checkout Dialog Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-neutral-900 font-serif">Selesaikan Belanja</h3>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              <p className="text-neutral-700 leading-relaxed">
                Anda memiliki <span className="font-semibold">{stats.inCartCount} barang</span> di
                keranjang dengan total belanja senilai{' '}
                <span className="font-semibold font-mono text-emerald-700">
                  {formatIDR(stats.inCartTotalCost)}
                </span>
                .
              </p>

              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/60 space-y-1.5 text-neutral-600">
                <span className="font-medium text-neutral-800 block">Tindakan Selesai Belanja:</span>
                <p>1. Semua barang di keranjang otomatis dipindahkan ke status <strong>"Stok Pantry"</strong>.</p>
                <p>2. Anda dapat otomatis mencatatkan pengeluaran ini ke dalam <strong>Finance OS / Simple Finance</strong>.</p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleCheckoutComplete(true)}
                  className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Selesaikan & Catat ke Pengeluaran ({formatIDR(stats.inCartTotalCost)})</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCheckoutComplete(false)}
                  className="w-full py-2 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-xl transition-all"
                >
                  Simpan ke Pantry Saja (Tanpa Catat Transaksi)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Grocery Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-neutral-800" />
                <h3 className="font-semibold text-neutral-900 font-serif text-lg">
                  {editingItem ? 'Edit Item Belanja' : 'Tambah Item Belanja Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-medium text-neutral-700 block mb-1">Nama Item / Bahan Makanan *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Susu UHT 1L, Telur Ayam 1kg, Bawang Merah 250g"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Aisle / Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as GroceryCategory })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                  >
                    {allCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Status Belanja</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as GroceryStatus })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                  >
                    <option value="Need to Buy">Perlu Dibeli</option>
                    <option value="In Cart">Dalam Keranjang</option>
                    <option value="In Stock">Stok Pantry (Ada)</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Siklus Restock</label>
                  <select
                    value={formData.restockCycle}
                    onChange={(e) =>
                      setFormData({ ...formData, restockCycle: e.target.value as RestockCycle })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                  >
                    <option value="Mingguan">Mingguan</option>
                    <option value="2 Mingguan">2 Mingguan</option>
                    <option value="Bulanan">Bulanan</option>
                    <option value="Sesuai Kebutuhan">Sesuai Kebutuhan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Jumlah</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity || 1}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400 font-mono"
                  />
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Satuan</label>
                  <input
                    type="text"
                    placeholder="kg, liter, pcs, ikat, pack"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                  />
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Estimasi Harga (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.estimatedPrice || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, estimatedPrice: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Tempat / Toko Belanja</label>
                  <select
                    value={formData.store}
                    onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                  >
                    {stores.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Tanggal Kedaluwarsa</label>
                  <input
                    type="date"
                    value={formData.expiryDate || ''}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">Catatan Tambahan</label>
                <input
                  type="text"
                  placeholder="e.g. Merk tertentu, simpan di freezer..."
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="favCheck"
                  checked={formData.isFavorite}
                  onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                  className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400"
                />
                <label htmlFor="favCheck" className="text-neutral-700 font-medium">
                  Tandai sebagai Bahan Pokok Rutin (Favorit)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-900 font-medium rounded-xl hover:bg-neutral-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-xl shadow-xs transition-all"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambahkan ke Daftar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
