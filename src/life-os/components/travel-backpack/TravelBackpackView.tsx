import React, { useState, useMemo } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  TravelBackpackItem,
  PackingCategory,
  TripType,
} from '../../types';
import {
  Briefcase,
  Plus,
  Search,
  CheckSquare,
  Square,
  Scale,
  RotateCcw,
  Plane,
  Luggage,
  AlertCircle,
  LayoutGrid,
  Table as TableIcon,
  Edit3,
  Trash2,
  X,
} from 'lucide-react';

const PACKING_CATEGORIES: PackingCategory[] = [
  'Dokumen & Uang',
  'Elektronik & Gadget',
  'Pakaian & Alas Kaki',
  'Toiletries & Perawatan',
  'Obat & P3K',
  'Perlengkapan Outdoor & Lainnya',
];

const BAG_SECTIONS: TravelBackpackItem['bagSection'][] = [
  'Personal Daypack',
  'Cabin / Carry-On',
  'Checked Baggage',
];

const TRIP_TYPES: TripType[] = [
  'Liburan (Leisure)',
  'Perjalanan Bisnis',
  'Backpacking & Alam',
  'Akhir Pekan (Staycation)',
];

export const TravelBackpackView: React.FC = () => {
  const {
    travelItems,
    addTravelItem,
    updateTravelItem,
    deleteTravelItem,
    togglePackedTravelItem,
    resetTripPacking,
  } = useLifeOS();

  const [selectedTrip, setSelectedTrip] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<PackingCategory | 'all'>('all');
  const [selectedBagSection, setSelectedBagSection] = useState<string>('all');
  const [packingFilter, setPackingFilter] = useState<'all' | 'unpacked' | 'packed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'checklist' | 'table'>('checklist');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<PackingCategory>('Pakaian & Alas Kaki');
  const [quantity, setQuantity] = useState(1);
  const [weightGrams, setWeightGrams] = useState(250);
  const [isPacked, setIsPacked] = useState(false);
  const [isEssential, setIsEssential] = useState(true);
  const [tripName, setTripName] = useState('Kyoto & Tokyo Autumn Trip');
  const [tripType, setTripType] = useState<TripType>('Liburan (Leisure)');
  const [bagSection, setBagSection] = useState<TravelBackpackItem['bagSection']>('Cabin / Carry-On');
  const [notes, setNotes] = useState('');

  const allTrips = useMemo(() => {
    const set = new Set<string>();
    travelItems.forEach((t) => set.add(t.tripName));
    return Array.from(set);
  }, [travelItems]);

  const filteredItems = useMemo(() => {
    return travelItems.filter((item) => {
      if (selectedTrip !== 'all' && item.tripName !== selectedTrip) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedBagSection !== 'all' && item.bagSection !== selectedBagSection) return false;
      if (packingFilter === 'unpacked' && item.isPacked) return false;
      if (packingFilter === 'packed' && !item.isPacked) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = item.name.toLowerCase().includes(q);
        const inTrip = item.tripName.toLowerCase().includes(q);
        const inNotes = (item.notes || '').toLowerCase().includes(q);
        if (!inName && !inTrip && !inNotes) return false;
      }
      return true;
    });
  }, [
    travelItems,
    selectedTrip,
    selectedCategory,
    selectedBagSection,
    packingFilter,
    searchQuery,
  ]);

  // Metrics based on current trip selection
  const tripScopedItems = useMemo(() => {
    return selectedTrip === 'all'
      ? travelItems
      : travelItems.filter((i) => i.tripName === selectedTrip);
  }, [travelItems, selectedTrip]);

  const packedCount = useMemo(
    () => tripScopedItems.filter((i) => i.isPacked).length,
    [tripScopedItems]
  );

  const packingProgressPercent = useMemo(() => {
    if (tripScopedItems.length === 0) return 0;
    return Math.round((packedCount / tripScopedItems.length) * 100);
  }, [packedCount, tripScopedItems.length]);

  const totalWeightKg = useMemo(() => {
    const grams = tripScopedItems.reduce((sum, i) => sum + i.weightGrams * i.quantity, 0);
    return (grams / 1000).toFixed(2);
  }, [tripScopedItems]);

  const cabinWeightKg = useMemo(() => {
    const grams = tripScopedItems
      .filter((i) => i.bagSection === 'Cabin / Carry-On' || i.bagSection === 'Personal Daypack')
      .reduce((sum, i) => sum + i.weightGrams * i.quantity, 0);
    return (grams / 1000).toFixed(2);
  }, [tripScopedItems]);

  const unpackedEssentialsCount = useMemo(
    () => tripScopedItems.filter((i) => i.isEssential && !i.isPacked).length,
    [tripScopedItems]
  );

  const handleOpenNew = () => {
    setEditingId(null);
    setName('');
    setCategory('Pakaian & Alas Kaki');
    setQuantity(1);
    setWeightGrams(200);
    setIsPacked(false);
    setIsEssential(true);
    setTripName(selectedTrip !== 'all' ? selectedTrip : allTrips[0] || 'Kyoto & Tokyo Autumn Trip');
    setTripType('Liburan (Leisure)');
    setBagSection('Cabin / Carry-On');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleEdit = (item: TravelBackpackItem) => {
    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
    setQuantity(item.quantity);
    setWeightGrams(item.weightGrams);
    setIsPacked(item.isPacked);
    setIsEssential(item.isEssential);
    setTripName(item.tripName);
    setTripType(item.tripType);
    setBagSection(item.bagSection);
    setNotes(item.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: Omit<TravelBackpackItem, 'id'> = {
      name: name.trim(),
      category,
      quantity: Math.max(1, Number(quantity) || 1),
      weightGrams: Math.max(0, Number(weightGrams) || 0),
      isPacked,
      isEssential,
      tripName: tripName.trim() || 'Trip Baru',
      tripType,
      bagSection,
      notes: notes.trim() || undefined,
    };

    if (editingId) {
      updateTravelItem(editingId, payload);
    } else {
      addTravelItem(payload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#E9E9E7] rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-teal-50/70 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-3xl shadow-xs shrink-0">
              🎒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#2F3437] tracking-tight">
                  Travel Backpack & Packing List
                </h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-100/70 text-teal-800">
                  by LifeCanvas
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl">
                Checklist barang bawaan perjalanan, kalkulator beban tas kabin & bagasi, penanda
                barang esensial, dan daftar yang dapat di-reset ulang untuk trip berikutnya.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() =>
                resetTripPacking(selectedTrip === 'all' ? undefined : selectedTrip)
              }
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
              title="Kosongkan seluruh centang untuk dipakai pada perjalanan berikutnya"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Checklist Trip</span>
            </button>

            <button
              onClick={handleOpenNew}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2F3437] hover:bg-black rounded-lg shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Barang Bawaan</span>
            </button>
          </div>
        </div>

        {/* Packing Progress Bar */}
        <div className="mt-6 pt-5 border-t border-[#F1F1EF] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#2F3437]">
              Progres Packing ({selectedTrip === 'all' ? 'Semua Trip' : selectedTrip})
            </span>
            <span className="font-bold text-teal-700">
              {packedCount} / {tripScopedItems.length} Barang Masuk Tas ({packingProgressPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600 rounded-full transition-all duration-300"
              style={{ width: `${packingProgressPercent}%` }}
            />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3">
            <span className="text-[11px] font-medium text-neutral-500 block">
              Total Berat Bawaan
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-[#2F3437]">{totalWeightKg} kg</span>
              <span className="text-[11px] text-neutral-400">estimasi beban</span>
            </div>
          </div>

          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3">
            <span className="text-[11px] font-medium text-neutral-500 block">
              Beban Kabin + Daypack
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-blue-700">{cabinWeightKg} kg</span>
              <span className="text-[11px] text-neutral-400">maks 7.0 kg kabin</span>
            </div>
          </div>

          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3">
            <span className="text-[11px] font-medium text-neutral-500 block">
              Barang Esensial Belum Masuk
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span
                className={`text-xl font-bold ${
                  unpackedEssentialsCount > 0 ? 'text-amber-700' : 'text-emerald-700'
                }`}
              >
                {unpackedEssentialsCount}
              </span>
              <span className="text-[11px] text-neutral-400">wajib dibawa</span>
            </div>
          </div>

          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3">
            <span className="text-[11px] font-medium text-neutral-500 block">Daftar Perjalanan</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-teal-700">{allTrips.length}</span>
              <span className="text-[11px] text-neutral-400">rencana trip</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Trip Selector */}
      <div className="bg-white border border-[#E9E9E7] rounded-2xl p-4 shadow-sm space-y-4">
        {/* Trip Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedTrip('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
              selectedTrip === 'all'
                ? 'bg-[#2F3437] text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Semua Perjalanan ({travelItems.length})</span>
          </button>

          {allTrips.map((trip) => {
            const count = travelItems.filter((t) => t.tripName === trip).length;
            const isSelected = selectedTrip === trip;
            return (
              <button
                key={trip}
                onClick={() => setSelectedTrip(trip)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-teal-700 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
                }`}
              >
                <span>✈️ {trip}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-teal-900 text-white' : 'bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Secondary Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[#F1F1EF]">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari barang (paspor, jaket, charger)..."
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg"
              />
            </div>

            <select
              value={selectedBagSection}
              onChange={(e) => setSelectedBagSection(e.target.value)}
              className="text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-2.5 py-1.5 text-neutral-700"
            >
              <option value="all">Semua Kompartemen Tas</option>
              {BAG_SECTIONS.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setPackingFilter('all')}
                className={`px-2.5 py-1 rounded-md font-medium ${
                  packingFilter === 'all' ? 'bg-white text-black shadow-2xs' : 'text-neutral-500'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setPackingFilter('unpacked')}
                className={`px-2.5 py-1 rounded-md font-medium ${
                  packingFilter === 'unpacked'
                    ? 'bg-white text-amber-800 shadow-2xs'
                    : 'text-neutral-500'
                }`}
              >
                Belum Masuk
              </button>
              <button
                onClick={() => setPackingFilter('packed')}
                className={`px-2.5 py-1 rounded-md font-medium ${
                  packingFilter === 'packed'
                    ? 'bg-white text-emerald-800 shadow-2xs'
                    : 'text-neutral-500'
                }`}
              >
                Sudah Masuk ✓
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-[#E9E9E7] self-end sm:self-auto">
            <button
              onClick={() => setViewMode('checklist')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'checklist'
                  ? 'bg-white text-[#2F3437] shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Checklist Kategori</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-[#2F3437] shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tabel</span>
            </button>
          </div>
        </div>
      </div>

      {/* View 1: Grouped Category Checklist */}
      {viewMode === 'checklist' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PACKING_CATEGORIES.map((cat) => {
            const catItems = filteredItems.filter((i) => i.category === cat);
            if (catItems.length === 0) return null;

            const catPacked = catItems.filter((i) => i.isPacked).length;
            const catWeightGrams = catItems.reduce(
              (sum, i) => sum + i.weightGrams * i.quantity,
              0
            );

            return (
              <div
                key={cat}
                className="bg-white border border-[#E9E9E7] rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#F1F1EF] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#2F3437]">{cat}</h3>
                    <span className="text-[11px] text-neutral-400">
                      Berat Kategori: {(catWeightGrams / 1000).toFixed(2)} kg
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    {catPacked} / {catItems.length} Siap
                  </span>
                </div>

                <div className="space-y-2">
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                        item.isPacked
                          ? 'bg-neutral-50/80 border-neutral-200/70 text-neutral-400'
                          : 'bg-white border-[#E9E9E7] hover:border-neutral-300'
                      }`}
                    >
                      <div
                        onClick={() => togglePackedTravelItem(item.id)}
                        className="flex items-start gap-2.5 cursor-pointer flex-1"
                      >
                        <button type="button" className="mt-0.5 text-teal-600 shrink-0">
                          {item.isPacked ? (
                            <CheckSquare className="w-4 h-4 fill-teal-600 text-white" />
                          ) : (
                            <Square className="w-4 h-4 text-neutral-400" />
                          )}
                        </button>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-xs font-semibold ${
                                item.isPacked ? 'line-through text-neutral-400' : 'text-[#2F3437]'
                              }`}
                            >
                              {item.name}
                            </span>
                            {item.quantity > 1 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-neutral-200 text-neutral-700">
                                {item.quantity}x
                              </span>
                            )}
                            {item.isEssential && !item.isPacked && (
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                                Esensial
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                            <span>🎒 {item.bagSection}</span>
                            <span>•</span>
                            <span>⚖️ {item.weightGrams * item.quantity}g</span>
                          </div>
                          {item.notes && (
                            <p className="text-[11px] text-neutral-500 italic">{item.notes}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 text-neutral-400 hover:text-neutral-700"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTravelItem(item.id)}
                          className="p-1 text-neutral-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 2: Table View */}
      {viewMode === 'table' && (
        <div className="bg-white border border-[#E9E9E7] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-700">
              <thead className="bg-[#FAF9F6] text-neutral-500 border-b border-[#E9E9E7] font-semibold">
                <tr>
                  <th className="py-3 px-4 w-10 text-center">Pack</th>
                  <th className="py-3 px-4">Nama Barang</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Kompartemen Tas</th>
                  <th className="py-3 px-4">Jumlah</th>
                  <th className="py-3 px-4">Total Berat</th>
                  <th className="py-3 px-4">Nama Trip</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F1EF]">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/70">
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={item.isPacked}
                        onChange={() => togglePackedTravelItem(item.id)}
                        className="rounded text-teal-600 cursor-pointer"
                      />
                    </td>
                    <td
                      className={`py-3 px-4 font-semibold ${
                        item.isPacked ? 'line-through text-neutral-400' : 'text-[#2F3437]'
                      }`}
                    >
                      {item.name}
                    </td>
                    <td className="py-3 px-4">{item.category}</td>
                    <td className="py-3 px-4">{item.bagSection}</td>
                    <td className="py-3 px-4">{item.quantity} pcs</td>
                    <td className="py-3 px-4">{item.weightGrams * item.quantity} g</td>
                    <td className="py-3 px-4 text-teal-800 font-medium">{item.tripName}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 text-neutral-400 hover:text-neutral-800"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTravelItem(item.id)}
                          className="p-1 text-neutral-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Travel Item */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="p-4 sm:px-6 border-b border-[#E9E9E7] flex items-center justify-between bg-[#FAF9F6]">
              <h3 className="text-sm font-bold text-[#2F3437]">
                {editingId ? 'Edit Barang Bawaan' : 'Tambah Barang ke Packing List'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                  Nama Barang Bawaan *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Jaket Ultralight Down / Universal Travel Adapter"
                  className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PackingCategory)}
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-2.5 py-2"
                  >
                    {PACKING_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Kompartemen Tas
                  </label>
                  <select
                    value={bagSection}
                    onChange={(e) =>
                      setBagSection(e.target.value as TravelBackpackItem['bagSection'])
                    }
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-2.5 py-2"
                  >
                    {BAG_SECTIONS.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Jumlah (Qty)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Berat / Item (Gram)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={weightGrams}
                    onChange={(e) => setWeightGrams(Number(e.target.value))}
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-3 py-2"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1 flex items-center gap-4 pt-5">
                  <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isEssential}
                      onChange={(e) => setIsEssential(e.target.checked)}
                      className="rounded"
                    />
                    <span>Wajib (Esensial)</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Nama Perjalanan (Trip)
                  </label>
                  <input
                    type="text"
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    placeholder="Kyoto & Tokyo Autumn Trip"
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Tipe Perjalanan
                  </label>
                  <select
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value as TripType)}
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-2.5 py-2"
                  >
                    {TRIP_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                  Catatan Packing
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Gunakan pouch kedap air..."
                  className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E9E9E7]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-medium text-neutral-600 bg-neutral-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#2F3437] hover:bg-black rounded-lg"
                >
                  Simpan ke Tas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
