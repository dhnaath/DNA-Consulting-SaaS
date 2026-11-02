import React, { useState, useMemo } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { WishlistItem, WishlistCategory, WishlistPriority, WishlistStatus } from '../../types';
import {
  Gift,
  Plus,
  Search,
  Filter,
  DollarSign,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Trash2,
  Edit2,
  LayoutGrid,
  Table as TableIcon,
  Columns3,
  X,
  Star,
  Tag,
  ArrowUpRight,
  TrendingUp,
  Heart,
  ShoppingBag,
  Coins,
  ShieldCheck,
  Info,
} from 'lucide-react';

const CATEGORY_STYLES: Record<WishlistCategory, { label: string; badge: string }> = {
  'Gadget & Tech': { label: 'Gadget & Tech', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  'Home & Living': { label: 'Home & Living', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  'Fashion & Style': { label: 'Fashion & Style', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
  'Buku & Hobi': { label: 'Buku & Hobi', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
  'Self-Care & Health': { label: 'Self-Care & Health', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'Travel & Petualangan': { label: 'Travel & Petualangan', badge: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
};

const PRIORITY_STYLES: Record<WishlistPriority, { label: string; badge: string }> = {
  'Must Have': { label: 'Must Have', badge: 'bg-rose-100 text-rose-800 border-rose-300 font-semibold' },
  'High': { label: 'High', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
  'Medium': { label: 'Medium', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  'Low': { label: 'Low', badge: 'bg-neutral-100 text-neutral-600 border-neutral-200' },
  'Nice to Have': { label: 'Nice to Have', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
};

const STATUS_COLUMNS: { key: WishlistStatus; label: string; bg: string; dot: string }[] = [
  { key: 'Wishlist', label: 'Belum Dibeli (Wishlist)', bg: 'bg-neutral-50', dot: 'bg-neutral-400' },
  { key: 'Saving Up', label: 'Sedang Nabung', bg: 'bg-amber-50/50', dot: 'bg-amber-500' },
  { key: 'Ready to Buy', label: 'Siap Beli ✨', bg: 'bg-emerald-50/50', dot: 'bg-emerald-500' },
  { key: 'Purchased', label: 'Sudah Terbeli 🎉', bg: 'bg-blue-50/50', dot: 'bg-blue-500' },
];

function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function getDaysSince(dateStr: string): number {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export const WishlistView: React.FC = () => {
  const {
    wishlist,
    addWishlistItem,
    updateWishlistItem,
    deleteWishlistItem,
    addWishlistSavings,
    markWishlistPurchased,
    searchQuery,
  } = useLifeOS();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'board' | 'table'>('grid');
  const [localSearch, setLocalSearch] = useState<string>('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);

  // Quick Savings Modal
  const [savingsModalItem, setSavingsModalItem] = useState<WishlistItem | null>(null);
  const [savingsAmount, setSavingsAmount] = useState<number>(100000);

  // Purchased Satisfaction Modal
  const [purchaseModalItem, setPurchaseModalItem] = useState<WishlistItem | null>(null);
  const [ratingScore, setRatingScore] = useState<number>(5);

  // Form State
  const [formData, setFormData] = useState<Omit<WishlistItem, 'id' | 'dateAdded'>>({
    name: '',
    category: 'Gadget & Tech',
    priority: 'Medium',
    status: 'Wishlist',
    price: 0,
    savedAmount: 0,
    url: '',
    reason: '',
    photoUrl: '',
    notes: '',
  });

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Gadget & Tech',
      priority: 'Medium',
      status: 'Wishlist',
      price: 0,
      savedAmount: 0,
      url: '',
      reason: '',
      photoUrl: '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: WishlistItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      priority: item.priority,
      status: item.status,
      price: item.price,
      savedAmount: item.savedAmount,
      url: item.url || '',
      reason: item.reason || '',
      photoUrl: item.photoUrl || '',
      notes: item.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingItem) {
      updateWishlistItem(editingItem.id, formData);
    } else {
      addWishlistItem(formData);
    }
    setIsModalOpen(false);
  };

  const handleSavingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (savingsModalItem && savingsAmount > 0) {
      addWishlistSavings(savingsModalItem.id, savingsAmount);
      setSavingsModalItem(null);
    }
  };

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (purchaseModalItem) {
      markWishlistPurchased(purchaseModalItem.id, ratingScore);
      setPurchaseModalItem(null);
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    const activeItems = wishlist.filter((i) => i.status !== 'Purchased' && i.status !== 'Archived');
    const totalWishlistValue = activeItems.reduce((sum, i) => sum + i.price, 0);
    const totalSaved = activeItems.reduce((sum, i) => sum + (i.savedAmount || 0), 0);
    const readyToBuyCount = wishlist.filter((i) => i.status === 'Ready to Buy').length;
    const purchasedItems = wishlist.filter((i) => i.status === 'Purchased');
    const purchasedCount = purchasedItems.length;

    const avgSatisfaction =
      purchasedItems.length > 0
        ? (
            purchasedItems.reduce((acc, i) => acc + (i.satisfactionRating || 5), 0) /
            purchasedItems.length
          ).toFixed(1)
        : null;

    const fundingPercentage =
      totalWishlistValue > 0 ? Math.round((totalSaved / totalWishlistValue) * 100) : 0;

    return {
      totalWishlistValue,
      totalSaved,
      readyToBuyCount,
      purchasedCount,
      avgSatisfaction,
      fundingPercentage,
      activeCount: activeItems.length,
    };
  }, [wishlist]);

  const filteredWishlist = useMemo(() => {
    return wishlist.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedPriority !== 'all' && item.priority !== selectedPriority) return false;
      if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;

      const term = (searchQuery || localSearch).toLowerCase().trim();
      if (term) {
        const matchName = item.name.toLowerCase().includes(term);
        const matchCat = item.category.toLowerCase().includes(term);
        const matchReason = (item.reason || '').toLowerCase().includes(term);
        if (!matchName && !matchCat && !matchReason) return false;
      }
      return true;
    });
  }, [wishlist, selectedCategory, selectedPriority, selectedStatus, searchQuery, localSearch]);

  const allCategories: WishlistCategory[] = [
    'Gadget & Tech',
    'Home & Living',
    'Fashion & Style',
    'Buku & Hobi',
    'Self-Care & Health',
    'Travel & Petualangan',
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-700 shadow-xs">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-neutral-900 tracking-tight font-serif">
                  Wishlist & Mindful Shopping
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-medium border border-neutral-200/60">
                  {wishlist.length} impian belanja
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Belanja terencana dengan aturan jeda 30 hari (30-day cooling-off rule) & progres alokasi tabungan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Wishlist</span>
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-neutral-100">
          <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Nilai Wishlist Aktif
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-semibold text-neutral-900">
                {formatIDR(stats.totalWishlistValue)}
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              {stats.activeCount} barang sedang dipertimbangkan
            </span>
          </div>

          <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Tabungan Terkumpul
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-semibold text-emerald-700">
                {formatIDR(stats.totalSaved)}
              </span>
            </div>
            <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, stats.fundingPercentage)}%` }}
              />
            </div>
            <span className="text-[10px] text-neutral-400 mt-1 block">
              Terdanai {stats.fundingPercentage}% dari target
            </span>
          </div>

          <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Siap Beli ✨
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-semibold text-indigo-700">
                {stats.readyToBuyCount}
              </span>
              <span className="text-xs text-neutral-500">barang</span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Dana penuh & lolos masa tunggu
            </span>
          </div>

          <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Sudah Terbeli 🎉
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-semibold text-blue-700">
                {stats.purchasedCount}
              </span>
              <span className="text-xs text-neutral-500">item</span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block flex items-center gap-1">
              {stats.avgSatisfaction && (
                <>
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500 inline" />
                  Rata-rata kepuasan: {stats.avgSatisfaction} / 5
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* 30-Day Mindful Spending Callout */}
      <div className="bg-gradient-to-r from-purple-50/80 to-indigo-50/60 border border-purple-200/70 rounded-xl p-4 flex items-start gap-3.5">
        <Clock className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-semibold text-purple-950 block text-sm">
            Prinsip Jeda 30 Hari (30-Day Cooling-off Rule)
          </span>
          <p className="text-purple-900/90 leading-relaxed">
            Sebelum membeli barang non-esensial, berikan waktu jeda 30 hari sejak pertama kali dicatat. Jika setelah 30 hari barang tersebut masih benar-benar dibutuhkan dan membawa dampak positif nyata, maka barang tersebut boleh dibeli tanpa rasa bersalah (*guilt-free*).
          </p>
        </div>
      </div>

      {/* Filters and View Switcher */}
      <div className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Cari wishlist, alasan membeli..."
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
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700 focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
            >
              <option value="all">Semua Status</option>
              <option value="Wishlist">Belum Dibeli</option>
              <option value="Saving Up">Sedang Nabung</option>
              <option value="Ready to Buy">Siap Beli</option>
              <option value="Purchased">Sudah Terbeli</option>
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700 focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
            >
              <option value="all">Semua Prioritas</option>
              <option value="Must Have">Must Have</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="Nice to Have">Nice to Have</option>
            </select>

            {/* View Mode Switcher */}
            <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
                title="Tampilan Galeri Kartu"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('board')}
                className={`p-1.5 transition-colors ${
                  viewMode === 'board'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
                title="Tampilan Papan Kanban"
              >
                <Columns3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
                title="Tampilan Tabel Database"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
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
            Semua Kategori ({wishlist.length})
          </button>
          {allCategories.map((cat) => {
            const count = wishlist.filter((i) => i.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
                }`}
              >
                <span>{cat}</span>
                <span className="text-[10px] ml-1 opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Rendering */}
      {filteredWishlist.length === 0 ? (
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-12 text-center">
          <Gift className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-neutral-900">Wishlist kosong</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Tidak ada item wishlist yang sesuai filter. Tambahkan keinginan belanja yang ingin Anda tabung!
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-medium hover:bg-neutral-800 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Wishlist Baru</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Gallery Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWishlist.map((item) => {
            const daysSince = getDaysSince(item.dateAdded);
            const isCoolingActive = daysSince < 30 && item.status !== 'Purchased';
            const progress = Math.min(100, Math.round(((item.savedAmount || 0) / (item.price || 1)) * 100));
            const priorityStyle = PRIORITY_STYLES[item.priority] || PRIORITY_STYLES['Medium'];
            const categoryStyle = CATEGORY_STYLES[item.category] || CATEGORY_STYLES['Gadget & Tech'];

            return (
              <div
                key={item.id}
                className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Cover */}
                  <div className="h-40 bg-neutral-100 relative overflow-hidden flex items-center justify-center">
                    {item.photoUrl ? (
                      <img
                        src={item.photoUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-neutral-400">
                        <Gift className="w-10 h-10 stroke-[1.25]" />
                        <span className="text-[11px] mt-1 font-medium">{item.category}</span>
                      </div>
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded border backdrop-blur-md ${priorityStyle.badge}`}>
                        {priorityStyle.label}
                      </span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded border backdrop-blur-md ${categoryStyle.badge}`}>
                        {categoryStyle.label}
                      </span>
                    </div>

                    {/* Quick Action Menu */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 rounded-lg p-0.5 shadow-xs border border-neutral-200">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded"
                        title="Edit Item"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus ${item.name} dari wishlist?`)) {
                            deleteWishlistItem(item.id);
                          }
                        }}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* 30-Day Cooling Status Pill */}
                    {item.status !== 'Purchased' && (
                      <div className="absolute bottom-2.5 left-2.5">
                        {isCoolingActive ? (
                          <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/90 text-white backdrop-blur-md shadow-xs">
                            <Clock className="w-3 h-3" />
                            Jeda {30 - daysSince} hari lagi
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-600/90 text-white backdrop-blur-md shadow-xs">
                            <Sparkles className="w-3 h-3" />
                            Lolos Uji 30 Hari
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-neutral-900 leading-snug line-clamp-2">
                          {item.name}
                        </h3>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-neutral-700 shrink-0 p-0.5"
                            title="Buka Toko / Link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      {/* Mindful Reason Note */}
                      {item.reason && (
                        <div className="text-xs text-neutral-600 mt-2 p-2 bg-neutral-50 rounded-lg border border-neutral-100 italic">
                          "{item.reason}"
                        </div>
                      )}
                    </div>

                    {/* Progress Bar & Amount */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-baseline justify-between">
                        <span className="text-neutral-500 text-[11px]">Terkumpul / Target:</span>
                        <div className="text-right">
                          <span className="font-semibold text-neutral-900 font-mono">
                            {formatIDR(item.savedAmount || 0)}
                          </span>
                          <span className="text-neutral-400 text-[11px] font-mono">
                            {' / '}
                            {formatIDR(item.price)}
                          </span>
                        </div>
                      </div>

                      <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            item.status === 'Purchased'
                              ? 'bg-blue-600'
                              : progress >= 100
                              ? 'bg-emerald-600'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <span>{progress}% tercapai</span>
                        <span>
                          {item.status === 'Purchased'
                            ? 'Terbeli 🎉'
                            : item.status === 'Ready to Buy'
                            ? 'Siap Dibeli'
                            : `Kurang ${formatIDR(Math.max(0, item.price - (item.savedAmount || 0)))}`}
                        </span>
                      </div>
                    </div>

                    {/* Satisfaction Rating for Purchased */}
                    {item.status === 'Purchased' && item.satisfactionRating && (
                      <div className="flex items-center gap-1.5 pt-1 text-xs text-amber-700 bg-amber-50/70 p-2 rounded-lg border border-amber-200/60">
                        <span className="text-[11px] font-medium">Kepuasan:</span>
                        <div className="flex items-center text-amber-500">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= (item.satisfactionRating || 5)
                                  ? 'fill-amber-500 text-amber-500'
                                  : 'text-neutral-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-3 bg-neutral-50/80 border-t border-neutral-100 flex items-center justify-between gap-2 text-xs">
                  {item.status !== 'Purchased' ? (
                    <>
                      <button
                        onClick={() => {
                          setSavingsModalItem(item);
                          setSavingsAmount(100000);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100 rounded-lg font-medium transition-all shadow-2xs"
                      >
                        <Coins className="w-3.5 h-3.5 text-amber-600" />
                        <span>+ Tabung</span>
                      </button>

                      <button
                        onClick={() => {
                          setPurchaseModalItem(item);
                          setRatingScore(5);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium transition-all shadow-2xs ml-auto"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Tandai Terbeli</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center justify-between w-full text-[11px] text-neutral-500">
                      <span>Dibeli: {item.purchasedDate || item.dateAdded}</span>
                      <span className="font-medium text-emerald-700">Selesai Dibeli</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : viewMode === 'board' ? (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {STATUS_COLUMNS.map((col) => {
            const columnItems = filteredWishlist.filter((i) => i.status === col.key);
            const totalColValue = columnItems.reduce((acc, i) => acc + i.price, 0);

            return (
              <div
                key={col.key}
                className={`${col.bg} border border-neutral-200/80 rounded-xl p-3 flex flex-col space-y-3 min-h-[400px]`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                    <span className="text-xs font-semibold text-neutral-900">{col.label}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-neutral-200 text-neutral-600">
                    {columnItems.length}
                  </span>
                </div>

                <div className="text-[10px] text-neutral-500 font-mono">
                  Total: {formatIDR(totalColValue)}
                </div>

                {/* Column Items */}
                <div className="space-y-2.5 flex-1">
                  {columnItems.map((item) => {
                    const progress = Math.min(100, Math.round(((item.savedAmount || 0) / (item.price || 1)) * 100));

                    return (
                      <div
                        key={item.id}
                        className="bg-white border border-neutral-200 rounded-lg p-3 shadow-2xs hover:shadow-xs transition-all space-y-2"
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <h4 className="text-xs font-semibold text-neutral-900 leading-snug line-clamp-2">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => openEditModal(item)}
                            className="text-neutral-400 hover:text-neutral-700"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-baseline justify-between text-[11px] font-mono">
                          <span className="text-neutral-500">Harga:</span>
                          <span className="font-semibold text-neutral-900">{formatIDR(item.price)}</span>
                        </div>

                        <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-neutral-800 h-full rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-neutral-400">{item.category}</span>
                          {col.key !== 'Purchased' ? (
                            <button
                              onClick={() => {
                                setSavingsModalItem(item);
                                setSavingsAmount(100000);
                              }}
                              className="text-[10px] text-indigo-600 hover:underline font-medium"
                            >
                              + Tabung
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-600 font-medium">Lengkap</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
                  <th className="py-3 px-3">Prioritas</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Target Harga</th>
                  <th className="py-3 px-3">Tabungan</th>
                  <th className="py-3 px-3">Progress</th>
                  <th className="py-3 px-3">Masa Tunggu</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredWishlist.map((item) => {
                  const daysSince = getDaysSince(item.dateAdded);
                  const isCoolingActive = daysSince < 30 && item.status !== 'Purchased';
                  const progress = Math.min(100, Math.round(((item.savedAmount || 0) / (item.price || 1)) * 100));
                  const priorityStyle = PRIORITY_STYLES[item.priority] || PRIORITY_STYLES['Medium'];
                  const categoryStyle = CATEGORY_STYLES[item.category] || CATEGORY_STYLES['Gadget & Tech'];

                  return (
                    <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                          {item.name}
                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-neutral-400 hover:text-neutral-700"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        {item.reason && (
                          <div className="text-[10px] text-neutral-500 italic mt-0.5 line-clamp-1">
                            "{item.reason}"
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${categoryStyle.badge}`}>
                          {categoryStyle.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${priorityStyle.badge}`}>
                          {priorityStyle.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap font-medium text-neutral-700">
                        {item.status}
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-neutral-900 whitespace-nowrap">
                        {formatIDR(item.price)}
                      </td>
                      <td className="py-3 px-3 font-mono text-emerald-700 whitespace-nowrap">
                        {formatIDR(item.savedAmount || 0)}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-neutral-900 h-full" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-[10px] font-mono text-neutral-600">{progress}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-[11px]">
                        {item.status === 'Purchased' ? (
                          <span className="text-blue-600 font-medium">Terbeli</span>
                        ) : isCoolingActive ? (
                          <span className="text-amber-700 font-medium">Jeda {30 - daysSince} hari</span>
                        ) : (
                          <span className="text-emerald-700 font-medium">Lolos 30 hari</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {item.status !== 'Purchased' && (
                            <button
                              onClick={() => {
                                setSavingsModalItem(item);
                                setSavingsAmount(100000);
                              }}
                              className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded text-[11px] font-medium"
                            >
                              + Tabung
                            </button>
                          )}
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
                                deleteWishlistItem(item.id);
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

      {/* Quick Add Savings Modal */}
      {savingsModalItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-neutral-900 font-serif">Alokasikan Tabungan</h3>
              </div>
              <button
                onClick={() => setSavingsModalItem(null)}
                className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavingsSubmit} className="space-y-4 mt-4 text-xs">
              <p className="text-neutral-600">
                Menambah tabungan untuk: <span className="font-semibold text-neutral-900">{savingsModalItem.name}</span>
              </p>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">Nominal Tabungan (Rp)</label>
                <input
                  type="number"
                  min="1000"
                  step="10000"
                  required
                  value={savingsAmount}
                  onChange={(e) => setSavingsAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400 font-mono text-sm font-semibold"
                />
              </div>

              <div className="flex gap-1.5 flex-wrap">
                {[50000, 100000, 250000, 500000, 1000000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSavingsAmount(amt)}
                    className="px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-mono"
                  >
                    +{amt.toLocaleString('id-ID')}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setSavingsModalItem(null)}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium shadow-xs"
                >
                  Simpan Tabungan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mark Purchased & Rating Modal */}
      {purchaseModalItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-neutral-900 font-serif">Selamat atas Pembelian!</h3>
              </div>
              <button
                onClick={() => setPurchaseModalItem(null)}
                className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePurchaseSubmit} className="space-y-4 mt-4 text-xs">
              <p className="text-neutral-600">
                Tandai <span className="font-semibold text-neutral-900">{purchaseModalItem.name}</span> sebagai berhasil dibeli.
              </p>

              <div>
                <label className="font-medium text-neutral-700 block mb-2">
                  Tingkat Kepuasan Pembelian (1 - 5 Bintang):
                </label>
                <div className="flex items-center justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingScore(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= ratingScore
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-neutral-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-center text-neutral-400 mt-1">
                  Mengevaluasi kepuasan membantu kita memahami apakah keputusan beli benar-benar membawa nilai tambah.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setPurchaseModalItem(null)}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium shadow-xs"
                >
                  Konfirmasi Terbeli 🎉
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Wishlist Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-neutral-800" />
                <h3 className="font-semibold text-neutral-900 font-serif text-lg">
                  {editingItem ? 'Edit Item Wishlist' : 'Tambah Impian Belanja'}
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
                <label className="font-medium text-neutral-700 block mb-1">Nama Barang / Impian *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sony WH-1000XM5, Kursi Ergonomis, Monitor 34"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as WishlistCategory })
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
                  <label className="font-medium text-neutral-700 block mb-1">Prioritas</label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value as WishlistPriority })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                  >
                    <option value="Must Have">Must Have</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                    <option value="Nice to Have">Nice to Have</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as WishlistStatus })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                  >
                    <option value="Wishlist">Belum Dibeli</option>
                    <option value="Saving Up">Sedang Nabung</option>
                    <option value="Ready to Buy">Siap Beli</option>
                    <option value="Purchased">Sudah Terbeli</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Estimasi Harga (Rp) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400 font-mono"
                  />
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Dana Ditabung Saat Ini (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.savedAmount || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, savedAmount: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">
                  Mengapa saya menginginkan barang ini? (Intensi & Refleksi)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Untuk meningkatkan fokus kerja, menghemat waktu, atau menjaga kesehatan tubuh..."
                  value={formData.reason || ''}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Link Toko / Marketplace</label>
                  <input
                    type="url"
                    placeholder="https://tokopedia.com/..."
                    value={formData.url || ''}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                  />
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">URL Foto Produk</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.photoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">Catatan Tambahan</label>
                <textarea
                  rows={2}
                  placeholder="Kode voucher, ukuran yang dicoba, toko rekomendasi teman..."
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                />
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
                  {editingItem ? 'Simpan Perubahan' : 'Tambahkan ke Wishlist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
