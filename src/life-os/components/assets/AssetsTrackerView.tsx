import React, { useState, useMemo } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { AssetItem, AssetCategory, AssetLiquidity } from '../../types';
import {
  Landmark,
  Plus,
  Search,
  Building,
  Car,
  Laptop,
  Bitcoin,
  Coins,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Trash2,
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

const CATEGORY_ICONS: Record<AssetCategory, React.ElementType> = {
  'Property': Building,
  'Investasi': TrendingUp,
  'Kas & Bank': Landmark,
  'Kendaraan': Car,
  'Kripto': Bitcoin,
  'Elektronik & Gadget': Laptop,
  'Logam Mulia': Coins,
};

const CATEGORY_COLORS: Record<AssetCategory, string> = {
  'Property': '#F59E0B',
  'Investasi': '#3B82F6',
  'Kas & Bank': '#10B981',
  'Kendaraan': '#EC4899',
  'Kripto': '#8B5CF6',
  'Elektronik & Gadget': '#6366F1',
  'Logam Mulia': '#D97706',
};

const LIQUIDITY_STYLES: Record<AssetLiquidity, { label: string; bg: string }> = {
  'High': { label: 'Likuiditas Tinggi', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60' },
  'Medium': { label: 'Likuiditas Sedang', bg: 'bg-amber-50 text-amber-700 border-amber-200/60' },
  'Low': { label: 'Likuiditas Rendah', bg: 'bg-neutral-100 text-neutral-600 border-neutral-200' },
};

export const AssetsTrackerView: React.FC = () => {
  const {
    assets,
    deleteAsset,
    openModal,
    searchQuery,
    totalAssetsValue,
    totalAssetsCost,
    totalAssetsGain,
    totalLiquidAssets,
  } = useLifeOS();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [localSearch, setLocalSearch] = useState<string>('');

  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
      const term = (searchQuery || localSearch).toLowerCase().trim();
      if (term) {
        const matchName = a.name.toLowerCase().includes(term);
        const matchCat = a.category.toLowerCase().includes(term);
        const matchInst = a.institution.toLowerCase().includes(term);
        if (!matchName && !matchCat && !matchInst) return false;
      }
      return true;
    });
  }, [assets, selectedCategory, searchQuery, localSearch]);

  const gainPercentage = totalAssetsCost > 0 ? (totalAssetsGain / totalAssetsCost) * 100 : 0;

  // Breakdown by category for stacked allocation bar
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    assets.forEach((a) => {
      map[a.category] = (map[a.category] || 0) + a.currentValue;
    });
    return Object.entries(map).map(([cat, val]) => ({
      category: cat as AssetCategory,
      amount: val,
      percentage: totalAssetsValue > 0 ? (val / totalAssetsValue) * 100 : 0,
      color: CATEGORY_COLORS[cat as AssetCategory] || '#4B5563',
    }));
  }, [assets, totalAssetsValue]);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 transition-all select-none">
      {/* Top Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-xs">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                  Assets Tracker
                </h1>
                <span className="px-2 py-0.5 text-xs font-mono-nums bg-neutral-100 text-neutral-600 rounded-sm">
                  {assets.length} aset terdata
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Pelacak portofolio kekayaan bersih, alokasi kelas aset fisik & likuid, dan capital gain.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal('asset')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#2383E2] hover:bg-[#1B74C9] rounded-md shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Aset Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Net Worth Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        <div className="bg-white p-4 rounded-lg border border-neutral-200/70 shadow-2xs">
          <span className="text-[11px] font-medium text-neutral-400 block mb-1">
            Total Nilai Pasar Aset
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono-nums text-neutral-900">
            ${totalAssetsValue.toLocaleString()}
          </div>
          <span className="text-[10px] text-neutral-500 mt-1 block">
            Gross Assets Valuation
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200/70 shadow-2xs">
          <span className="text-[11px] font-medium text-neutral-400 block mb-1">
            Total Modal / Biaya Beli
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono-nums text-neutral-900">
            ${totalAssetsCost.toLocaleString()}
          </div>
          <span className="text-[10px] text-neutral-500 mt-1 block">
            Historical Acquisition Cost
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200/70 shadow-2xs">
          <span className="text-[11px] font-medium text-neutral-400 block mb-1">
            Capital Gain / Unrealized Profit
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono-nums flex items-baseline gap-1.5">
            <span className={totalAssetsGain >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
              {totalAssetsGain >= 0 ? '+' : ''}${totalAssetsGain.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              ({gainPercentage >= 0 ? '+' : ''}{gainPercentage.toFixed(1)}%)
            </span>
          </div>
          <span className="text-[10px] text-neutral-500 mt-1 block">
            Pertumbuhan nilai kekayaan
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200/70 shadow-2xs">
          <span className="text-[11px] font-medium text-neutral-400 block mb-1">
            Aset Likuid (Kas & Reksa Dana)
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono-nums text-neutral-900">
            ${totalLiquidAssets.toLocaleString()}
          </div>
          <span className="text-[10px] text-neutral-500 mt-1 block font-mono-nums">
            {totalAssetsValue > 0 ? ((totalLiquidAssets / totalAssetsValue) * 100).toFixed(1) : 0}% dari total portofolio
          </span>
        </div>
      </div>

      {/* Asset Allocation Stacked Bar */}
      <div className="bg-white rounded-lg border border-neutral-200/70 p-4 shadow-2xs mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-neutral-800">
            Distribusi Alokasi Portofolio Aset
          </span>
          <span className="text-[11px] text-neutral-400">
            100% Portofolio Bersih
          </span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="w-full h-3 rounded-full bg-neutral-100 flex overflow-hidden gap-0.5">
          {categoryBreakdown.map((item) => (
            <div
              key={item.category}
              className="h-full transition-all"
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.color,
              }}
              title={`${item.category}: $${item.amount.toLocaleString()} (${item.percentage.toFixed(1)}%)`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs">
          {categoryBreakdown.map((item) => (
            <div key={item.category} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-neutral-600">{item.category}</span>
              <span className="font-mono-nums font-semibold text-neutral-800 text-[11px]">
                {item.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and View Mode Bar */}
      <div className="bg-white rounded-lg border border-neutral-200/70 p-3 shadow-2xs mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Categories */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            Semua Aset
          </button>
          {Object.keys(CATEGORY_ICONS).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & View Mode */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-50 rounded-md border border-neutral-200/70 text-xs">
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Cari aset atau bank..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="bg-transparent outline-hidden w-28 sm:w-36 text-neutral-700 placeholder:text-neutral-400 text-xs"
            />
          </div>

          <div className="flex items-center bg-neutral-100 p-0.5 rounded-md border border-neutral-200/60">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-sm transition-colors ${
                viewMode === 'grid' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded-sm transition-colors ${
                viewMode === 'table' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-800'
              }`}
              title="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => {
            const Icon = CATEGORY_ICONS[asset.category] || Landmark;
            const catColor = CATEGORY_COLORS[asset.category] || '#3B82F6';
            const gain = asset.currentValue - asset.purchasePrice;
            const gainPct = asset.purchasePrice > 0 ? (gain / asset.purchasePrice) * 100 : 0;
            const liq = LIQUIDITY_STYLES[asset.liquidity];

            return (
              <div
                key={asset.id}
                className="bg-white rounded-lg border border-neutral-200/70 hover:border-neutral-300 p-4 shadow-2xs transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: catColor }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-neutral-500">
                        {asset.category}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-xs text-[10px] font-medium border ${liq.bg}`}>
                      {liq.label}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-800 mb-1 leading-snug line-clamp-2">
                    {asset.name}
                  </h3>

                  <div className="text-[11px] text-neutral-500 mb-3 truncate">
                    {asset.institution}
                  </div>

                  {/* Valuation & Cost box */}
                  <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200/50 space-y-1.5 text-xs font-mono-nums mb-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-neutral-400 font-sans text-[11px]">Nilai Pasar:</span>
                      <span className="text-base font-bold text-neutral-900">
                        ${asset.currentValue.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline text-neutral-500 text-[11px]">
                      <span className="font-sans">Harga Beli:</span>
                      <span>${asset.purchasePrice.toLocaleString()}</span>
                    </div>

                    <div className="pt-1 border-t border-neutral-200/60 flex justify-between items-baseline text-[11px]">
                      <span className="font-sans text-neutral-500">Capital Gain:</span>
                      <span
                        className={`font-semibold flex items-center gap-0.5 ${
                          gain >= 0 ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {gain >= 0 ? '+' : ''}${gain.toLocaleString()} ({gainPct >= 0 ? '+' : ''}{gainPct.toFixed(1)}%)
                      </span>
                    </div>
                  </div>

                  {asset.notes && (
                    <p className="text-[11px] text-neutral-500 line-clamp-2 italic">
                      "{asset.notes}"
                    </p>
                  )}
                </div>

                {/* Footer info */}
                <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{asset.acquiredDate}</span>
                  </span>

                  <button
                    onClick={() => deleteAsset(asset.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-rose-600 transition-opacity"
                    title="Hapus aset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-lg border border-neutral-200/70 shadow-2xs overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200/60 bg-neutral-50/50 text-neutral-500 font-medium">
                <th className="py-2.5 px-3">Nama Aset</th>
                <th className="py-2.5 px-3">Kategori</th>
                <th className="py-2.5 px-3">Institusi / Lokasi</th>
                <th className="py-2.5 px-3">Nilai Pasar</th>
                <th className="py-2.5 px-3">Harga Beli</th>
                <th className="py-2.5 px-3">Gain / Loss</th>
                <th className="py-2.5 px-3">Likuiditas</th>
                <th className="py-2.5 px-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredAssets.map((asset) => {
                const gain = asset.currentValue - asset.purchasePrice;
                const gainPct = asset.purchasePrice > 0 ? (gain / asset.purchasePrice) * 100 : 0;
                const liq = LIQUIDITY_STYLES[asset.liquidity];

                return (
                  <tr key={asset.id} className="hover:bg-[#F7F7F5] transition-colors group">
                    <td className="py-2.5 px-3 font-semibold text-neutral-800 align-middle">
                      {asset.name}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-700 align-middle">
                      <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-xs text-[10px]">
                        {asset.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-neutral-600 align-middle">
                      {asset.institution}
                    </td>
                    <td className="py-2.5 px-3 font-mono-nums font-bold text-neutral-900 align-middle">
                      ${asset.currentValue.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono-nums text-neutral-500 align-middle">
                      ${asset.purchasePrice.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono-nums align-middle">
                      <span className={gain >= 0 ? 'text-emerald-700 font-medium' : 'text-rose-600 font-medium'}>
                        {gain >= 0 ? '+' : ''}${gain.toLocaleString()} ({gainPct.toFixed(1)}%)
                      </span>
                    </td>
                    <td className="py-2.5 px-3 align-middle">
                      <span className={`px-2 py-0.5 rounded-xs text-[10px] font-medium border ${liq.bg}`}>
                        {liq.label.split(' ')[1]}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right align-middle">
                      <button
                        onClick={() => deleteAsset(asset.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-rose-600 transition-opacity"
                        title="Hapus aset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
