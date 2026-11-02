import React, { useState, useMemo } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { HouseholdItem, RoomCategory, ItemCondition } from '../../types';
import {
  Home,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Wrench,
  Calendar,
  Layers,
  Sparkles,
  Tag,
  Trash2,
  Edit2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  LayoutGrid,
  Table as TableIcon,
  X,
  Tv,
  Coffee,
  Bed,
  Bath,
  Briefcase,
  Warehouse,
  Utensils,
  Sun,
  DollarSign,
} from 'lucide-react';

const ROOM_ICONS: Record<RoomCategory, React.ElementType> = {
  'Ruang Tamu': Tv,
  'Dapur': Coffee,
  'Kamar Tidur': Bed,
  'Kamar Mandi': Bath,
  'Ruang Kerja': Briefcase,
  'Gudang & Garasi': Warehouse,
  'Ruang Makan': Utensils,
  'Balkon & Luar': Sun,
};

const ROOM_COLORS: Record<RoomCategory, string> = {
  'Ruang Tamu': 'bg-blue-50 text-blue-700 border-blue-200',
  'Dapur': 'bg-amber-50 text-amber-700 border-amber-200',
  'Kamar Tidur': 'bg-purple-50 text-purple-700 border-purple-200',
  'Kamar Mandi': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Ruang Kerja': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Gudang & Garasi': 'bg-stone-50 text-stone-700 border-stone-200',
  'Ruang Makan': 'bg-orange-50 text-orange-700 border-orange-200',
  'Balkon & Luar': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const CONDITION_STYLES: Record<ItemCondition, { label: string; badge: string }> = {
  'Baru': { label: 'Baru', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'Sangat Baik': { label: 'Sangat Baik', badge: 'bg-teal-50 text-teal-700 border-teal-200' },
  'Baik': { label: 'Baik', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  'Butuh Servis': { label: 'Butuh Servis', badge: 'bg-amber-100 text-amber-800 border-amber-300 font-semibold' },
  'Perlu Diganti': { label: 'Perlu Diganti', badge: 'bg-rose-100 text-rose-800 border-rose-300 font-semibold' },
};

function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export const HouseholdTrackerView: React.FC = () => {
  const {
    householdItems,
    addHouseholdItem,
    updateHouseholdItem,
    deleteHouseholdItem,
    searchQuery,
  } = useLifeOS();

  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [warrantyFilter, setWarrantyFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [localSearch, setLocalSearch] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HouseholdItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<HouseholdItem, 'id'>>({
    name: '',
    room: 'Ruang Tamu',
    condition: 'Baik',
    brand: '',
    modelNumber: '',
    serialNumber: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    purchasePrice: 0,
    currentValue: 0,
    quantity: 1,
    warrantyExpiry: '',
    warrantyStatus: 'Active',
    lastMaintenanceDate: '',
    nextMaintenanceDate: '',
    notes: '',
    photoUrl: '',
  });

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      room: 'Ruang Tamu',
      condition: 'Baik',
      brand: '',
      modelNumber: '',
      serialNumber: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      purchasePrice: 0,
      currentValue: 0,
      quantity: 1,
      warrantyExpiry: '',
      warrantyStatus: 'Active',
      lastMaintenanceDate: '',
      nextMaintenanceDate: '',
      notes: '',
      photoUrl: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: HouseholdItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      room: item.room,
      condition: item.condition,
      brand: item.brand || '',
      modelNumber: item.modelNumber || '',
      serialNumber: item.serialNumber || '',
      purchaseDate: item.purchaseDate,
      purchasePrice: item.purchasePrice,
      currentValue: item.currentValue,
      quantity: item.quantity || 1,
      warrantyExpiry: item.warrantyExpiry || '',
      warrantyStatus: item.warrantyStatus || 'Active',
      lastMaintenanceDate: item.lastMaintenanceDate || '',
      nextMaintenanceDate: item.nextMaintenanceDate || '',
      notes: item.notes || '',
      photoUrl: item.photoUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    // Auto determine warrantyStatus if date provided
    let calcWarrantyStatus = formData.warrantyStatus;
    if (formData.warrantyExpiry) {
      const today = new Date();
      const exp = new Date(formData.warrantyExpiry);
      const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) calcWarrantyStatus = 'Expired';
      else if (diffDays <= 60) calcWarrantyStatus = 'Expiring Soon';
      else calcWarrantyStatus = 'Active';
    }

    const payload = {
      ...formData,
      warrantyStatus: calcWarrantyStatus,
    };

    if (editingItem) {
      updateHouseholdItem(editingItem.id, payload);
    } else {
      addHouseholdItem(payload);
    }
    setIsModalOpen(false);
  };

  // Calculations
  const stats = useMemo(() => {
    const totalCount = householdItems.reduce((acc, i) => acc + (i.quantity || 1), 0);
    const totalValue = householdItems.reduce((acc, i) => acc + i.currentValue, 0);
    const totalCost = householdItems.reduce((acc, i) => acc + i.purchasePrice, 0);

    const activeWarranties = householdItems.filter(
      (i) => i.warrantyStatus === 'Active' || i.warrantyStatus === 'Expiring Soon'
    ).length;

    const needsMaintenance = householdItems.filter(
      (i) => i.condition === 'Butuh Servis' || i.condition === 'Perlu Diganti'
    ).length;

    const expiringSoonItems = householdItems.filter(
      (i) => i.warrantyStatus === 'Expiring Soon'
    );

    return {
      totalCount,
      totalValue,
      totalCost,
      activeWarranties,
      needsMaintenance,
      expiringSoonItems,
    };
  }, [householdItems]);

  const filteredItems = useMemo(() => {
    return householdItems.filter((item) => {
      if (selectedRoom !== 'all' && item.room !== selectedRoom) return false;
      if (selectedCondition !== 'all' && item.condition !== selectedCondition) return false;

      if (warrantyFilter === 'active' && item.warrantyStatus !== 'Active' && item.warrantyStatus !== 'Expiring Soon') return false;
      if (warrantyFilter === 'expiring' && item.warrantyStatus !== 'Expiring Soon') return false;
      if (warrantyFilter === 'expired' && item.warrantyStatus !== 'Expired') return false;

      const term = (searchQuery || localSearch).toLowerCase().trim();
      if (term) {
        const matchName = item.name.toLowerCase().includes(term);
        const matchBrand = (item.brand || '').toLowerCase().includes(term);
        const matchRoom = item.room.toLowerCase().includes(term);
        const matchModel = (item.modelNumber || '').toLowerCase().includes(term);
        if (!matchName && !matchBrand && !matchRoom && !matchModel) return false;
      }
      return true;
    });
  }, [householdItems, selectedRoom, selectedCondition, warrantyFilter, searchQuery, localSearch]);

  const allRooms: RoomCategory[] = [
    'Ruang Tamu',
    'Dapur',
    'Kamar Tidur',
    'Kamar Mandi',
    'Ruang Kerja',
    'Gudang & Garasi',
    'Ruang Makan',
    'Balkon & Luar',
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 shadow-xs">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-neutral-900 tracking-tight font-serif">
                  Household Items Tracker
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-medium border border-neutral-200/60">
                  {householdItems.length} perabotan
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Katalog inventaris rumah, status garansi, nilai aset, dan pemeliharaan berkala
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Barang</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-neutral-100">
          <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Total Inventaris
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-semibold text-neutral-900">
                {stats.totalCount}
              </span>
              <span className="text-xs text-neutral-500">item</span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Tersebar di {allRooms.length} ruangan
            </span>
          </div>

          <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Estimasi Nilai Barang
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-semibold text-neutral-900">
                {formatIDR(stats.totalValue)}
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Harga beli: {formatIDR(stats.totalCost)}
            </span>
          </div>

          <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Garansi Aktif
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-semibold text-emerald-700">
                {stats.activeWarranties}
              </span>
              <span className="text-xs text-neutral-500">perangkat terlindungi</span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              {stats.expiringSoonItems.length > 0
                ? `${stats.expiringSoonItems.length} garansi segera berakhir`
                : 'Semua aman'}
            </span>
          </div>

          <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Perlu Perhatian
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span
                className={`text-xl font-semibold ${
                  stats.needsMaintenance > 0 ? 'text-amber-700' : 'text-neutral-900'
                }`}
              >
                {stats.needsMaintenance}
              </span>
              <span className="text-xs text-neutral-500">item butuh servis</span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Kondisi butuh perbaikan
            </span>
          </div>
        </div>
      </div>

      {/* Expiring Soon Alert Banner */}
      {stats.expiringSoonItems.length > 0 && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <span className="font-semibold block text-sm text-amber-950 mb-0.5">
              Peringatan Garansi Segera Berakhir ({stats.expiringSoonItems.length} Barang)
            </span>
            <p className="text-amber-800">
              Barang berikut memiliki masa garansi yang akan habis dalam waktu 60 hari ke depan:{' '}
              <span className="font-medium">
                {stats.expiringSoonItems.map((i) => `${i.name} (${i.warrantyExpiry})`).join(', ')}
              </span>
              . Periksa kondisi unit jika memerlukan klaim garansi resmi sebelum kedaluwarsa.
            </p>
          </div>
        </div>
      )}

      {/* Filter and Control Bar */}
      <div className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Cari perabotan, merk, model, nomor seri..."
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
            {/* Condition Filter */}
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700 focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
            >
              <option value="all">Semua Kondisi</option>
              <option value="Baru">Baru</option>
              <option value="Sangat Baik">Sangat Baik</option>
              <option value="Baik">Baik</option>
              <option value="Butuh Servis">Butuh Servis</option>
              <option value="Perlu Diganti">Perlu Diganti</option>
            </select>

            {/* Warranty Filter */}
            <select
              value={warrantyFilter}
              onChange={(e) => setWarrantyFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700 focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
            >
              <option value="all">Semua Garansi</option>
              <option value="active">Garansi Aktif</option>
              <option value="expiring">Segera Berakhir (&lt; 60 hari)</option>
              <option value="expired">Garansi Habis</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
                title="Tampilan Kartu"
              >
                <LayoutGrid className="w-4 h-4" />
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

        {/* Room Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedRoom('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
              selectedRoom === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
            }`}
          >
            Semua Ruangan ({householdItems.length})
          </button>
          {allRooms.map((room) => {
            const count = householdItems.filter((i) => i.room === room).length;
            const IconComponent = ROOM_ICONS[room] || Home;
            return (
              <button
                key={room}
                onClick={() => setSelectedRoom(room)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
                  selectedRoom === room
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{room}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content: Grid or Table */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-12 text-center">
          <Home className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-neutral-900">Tidak ada barang yang cocok</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau bersihkan filter ruangan dan kondisi.
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-medium hover:bg-neutral-800 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Barang Baru</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const RoomIcon = ROOM_ICONS[item.room] || Home;
            const conditionStyle = CONDITION_STYLES[item.condition] || CONDITION_STYLES['Baik'];

            return (
              <div
                key={item.id}
                className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-2xs hover:shadow-xs transition-all flex flex-col group"
              >
                {/* Image Cover or Fallback */}
                <div className="h-36 bg-neutral-100 relative overflow-hidden flex items-center justify-center">
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-neutral-400">
                      <RoomIcon className="w-10 h-10 stroke-[1.25]" />
                      <span className="text-[11px] mt-1 font-medium">{item.room}</span>
                    </div>
                  )}

                  {/* Room Pill */}
                  <span
                    className={`absolute top-2.5 left-2.5 flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md border backdrop-blur-md shadow-xs ${
                      ROOM_COLORS[item.room] || 'bg-white/90 text-neutral-800 border-neutral-200'
                    }`}
                  >
                    <RoomIcon className="w-3 h-3" />
                    {item.room}
                  </span>

                  {/* Action Menu (hover) */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 rounded-lg p-0.5 shadow-xs border border-neutral-200">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded"
                      title="Edit Barang"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus ${item.name} dari inventaris rumah?`)) {
                          deleteHouseholdItem(item.id);
                        }
                      }}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                      title="Hapus Barang"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-neutral-900 leading-snug">
                        {item.name}
                      </h3>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${conditionStyle.badge}`}
                      >
                        {conditionStyle.label}
                      </span>
                    </div>

                    {(item.brand || item.modelNumber) && (
                      <div className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1.5 flex-wrap">
                        {item.brand && <span className="font-medium text-neutral-700">{item.brand}</span>}
                        {item.modelNumber && (
                          <span className="text-neutral-400 font-mono text-[10px]">
                            • {item.modelNumber}
                          </span>
                        )}
                      </div>
                    )}

                    {item.notes && (
                      <p className="text-xs text-neutral-600 mt-2 line-clamp-2 leading-relaxed bg-neutral-50/80 p-2 rounded-lg border border-neutral-100">
                        {item.notes}
                      </p>
                    )}
                  </div>

                  {/* Financial & Warranty Meta */}
                  <div className="pt-3 border-t border-neutral-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 text-[11px]">Nilai Saat Ini:</span>
                      <span className="font-semibold text-neutral-900 font-mono">
                        {formatIDR(item.currentValue)}
                      </span>
                    </div>

                    {item.warrantyExpiry && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500 flex items-center gap-1">
                          {item.warrantyStatus === 'Active' ? (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          ) : item.warrantyStatus === 'Expiring Soon' ? (
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                          ) : (
                            <ShieldX className="w-3.5 h-3.5 text-neutral-400" />
                          )}
                          Garansi s/d:
                        </span>
                        <span
                          className={`font-medium ${
                            item.warrantyStatus === 'Expiring Soon'
                              ? 'text-amber-700 font-semibold'
                              : item.warrantyStatus === 'Active'
                              ? 'text-emerald-700'
                              : 'text-neutral-400'
                          }`}
                        >
                          {item.warrantyExpiry}
                        </span>
                      </div>
                    )}

                    {item.lastMaintenanceDate && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500 flex items-center gap-1">
                          <Wrench className="w-3.5 h-3.5 text-neutral-400" />
                          Servis Terakhir:
                        </span>
                        <span className="text-neutral-700">{item.lastMaintenanceDate}</span>
                      </div>
                    )}
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
                  <th className="py-3 px-3">Ruangan</th>
                  <th className="py-3 px-3">Brand & Model</th>
                  <th className="py-3 px-3">Kondisi</th>
                  <th className="py-3 px-3">Harga Beli</th>
                  <th className="py-3 px-3">Nilai Sekarang</th>
                  <th className="py-3 px-3">Garansi</th>
                  <th className="py-3 px-3">Servis Terakhir</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredItems.map((item) => {
                  const RoomIcon = ROOM_ICONS[item.room] || Home;
                  const conditionStyle = CONDITION_STYLES[item.condition] || CONDITION_STYLES['Baik'];

                  return (
                    <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-neutral-900">{item.name}</div>
                        {item.serialNumber && (
                          <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                            SN: {item.serialNumber}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded border ${
                            ROOM_COLORS[item.room] || 'bg-neutral-100 text-neutral-700 border-neutral-200'
                          }`}
                        >
                          <RoomIcon className="w-3 h-3" />
                          {item.room}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-neutral-800">{item.brand || '-'}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">{item.modelNumber}</div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${conditionStyle.badge}`}
                        >
                          {conditionStyle.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-neutral-600 whitespace-nowrap">
                        {formatIDR(item.purchasePrice)}
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-neutral-900 whitespace-nowrap">
                        {formatIDR(item.currentValue)}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-[11px]">
                        {item.warrantyExpiry ? (
                          <span
                            className={
                              item.warrantyStatus === 'Expiring Soon'
                                ? 'text-amber-700 font-semibold'
                                : item.warrantyStatus === 'Active'
                                ? 'text-emerald-700 font-medium'
                                : 'text-neutral-400'
                            }
                          >
                            {item.warrantyExpiry}
                          </span>
                        ) : (
                          <span className="text-neutral-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-neutral-600">
                        {item.lastMaintenanceDate || '-'}
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
                                deleteHouseholdItem(item.id);
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-neutral-800" />
                <h3 className="font-semibold text-neutral-900 font-serif text-lg">
                  {editingItem ? 'Edit Perabotan Rumah' : 'Tambah Perabotan Rumah'}
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
                <label className="font-medium text-neutral-700 block mb-1">
                  Nama Barang / Perabot *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Robot Vacuum Cleaner X10, Smart TV 55"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Ruangan / Lokasi</label>
                  <select
                    value={formData.room}
                    onChange={(e) =>
                      setFormData({ ...formData, room: e.target.value as RoomCategory })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                  >
                    {allRooms.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Kondisi</label>
                  <select
                    value={formData.condition}
                    onChange={(e) =>
                      setFormData({ ...formData, condition: e.target.value as ItemCondition })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                  >
                    <option value="Baru">Baru</option>
                    <option value="Sangat Baik">Sangat Baik</option>
                    <option value="Baik">Baik</option>
                    <option value="Butuh Servis">Butuh Servis</option>
                    <option value="Perlu Diganti">Perlu Diganti</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Brand / Merek</label>
                  <input
                    type="text"
                    placeholder="e.g. Philips, LG, Bosch"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                  />
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Model / Tipe</label>
                  <input
                    type="text"
                    placeholder="e.g. OLED55C3"
                    value={formData.modelNumber}
                    onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                  />
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Serial Number</label>
                  <input
                    type="text"
                    placeholder="e.g. SN-882319"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Harga Beli (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.purchasePrice || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, purchasePrice: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400 font-mono"
                  />
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">
                    Nilai Sekarang (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.currentValue || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, currentValue: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400 font-mono"
                  />
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Jumlah (Qty)</label>
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Tanggal Beli</label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                  />
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">
                    Batas Akhir Garansi
                  </label>
                  <input
                    type="date"
                    value={formData.warrantyExpiry || ''}
                    onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">
                    Tanggal Servis Terakhir
                  </label>
                  <input
                    type="date"
                    value={formData.lastMaintenanceDate || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, lastMaintenanceDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                  />
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">URL Foto Sampul</label>
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
                <label className="font-medium text-neutral-700 block mb-1">Catatan & Tips Perawatan</label>
                <textarea
                  rows={2}
                  placeholder="Jadwal pembersihan, lokasi buku manual, kontak teknisi..."
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
                  {editingItem ? 'Simpan Perubahan' : 'Tambahkan ke Inventaris'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
