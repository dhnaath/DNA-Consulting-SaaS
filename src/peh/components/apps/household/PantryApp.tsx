import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { PantryItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const PantryApp: React.FC = () => {
  const {
    pantryItems,
    addPantryItem,
    updatePantryQty,
    toggleRestock,
    deletePantryItem,
    activeSubMenu,
    setActiveSubMenu,
  } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterZone, setFilterZone] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<PantryItem['category']>('Bahan Pokok');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState<PantryItem['unit']>('pcs');
  const [storageZone, setStorageZone] = useState<PantryItem['storageZone']>('Pantry Kering');
  const [minStockAlert, setMinStockAlert] = useState('1');
  const [expiryDate, setExpiryDate] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addPantryItem({
      name: name.trim(),
      category,
      quantity: Number(quantity) || 1,
      unit,
      storageZone,
      minStockAlert: Number(minStockAlert) || 1,
      expiryDate: expiryDate || undefined,
      isRestockNeeded: Number(quantity) <= Number(minStockAlert),
    });

    setName('');
    setQuantity('1');
    setExpiryDate('');
    setIsAddModalOpen(false);
  };

  const filteredItems = pantryItems.filter((item) => {
    const matchZone = filterZone === 'Semua' || item.storageZone === filterZone;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchZone && matchSearch;
  });

  const restockList = pantryItems.filter((item) => item.isRestockNeeded || item.quantity <= item.minStockAlert);

  const zones = ['Kulkas', 'Freezer', 'Pantry Kering', 'Rak Dapur'] as const;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-neutral-100 text-neutral-800">
              <Icon name="ShoppingBag" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Dapur & Inventaris
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Pantau stok bahan pangan dapur, otomatisasi daftar belanja restock, dan manajemen zona simpan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs"
        >
          <Icon name="Plus" size={14} />
          <span>Tambah Bahan / Stok</span>
        </button>
      </div>

      {/* Submenus */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex p-1 bg-neutral-100 rounded-lg text-xs font-medium">
          {[
            { id: 'stock', label: 'Stok Bahan', count: pantryItems.length },
            { id: 'restock', label: 'Daftar Belanja', count: restockList.length },
            { id: 'zones', label: 'Zona Penyimpanan' },
          ].map((tab) => {
            const isActive = activeSubMenu === tab.id || (!activeSubMenu && tab.id === 'stock');
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubMenu(tab.id)}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterZone}
            onChange={(e) => setFilterZone(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-neutral-200 rounded-lg bg-white"
          >
            <option value="Semua">Semua Zona</option>
            {zones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>
      </div>

      {pantryItems.length === 0 ? (
        <EmptyState
          iconName="ShoppingBag"
          title="Inventaris dapur belum memiliki data"
          description="Catat persediaan beras, bumbu, telur, susu, atau kebutuhan dapur lainnya untuk memastikan stok selalu terpantau dan daftar belanja otomatis terbuat."
          actionLabel="Catat Bahan Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <>
          {/* Stock List View */}
          {(activeSubMenu === 'stock' || !activeSubMenu) && (
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
              <div className="divide-y divide-neutral-100">
                {filteredItems.map((item) => {
                  const isLow = item.quantity <= item.minStockAlert;

                  return (
                    <div
                      key={item.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/50"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-neutral-900 text-sm">{item.name}</span>
                          {isLow && (
                            <span className="text-[10px] text-amber-600 font-medium">· Stok Menipis</span>
                          )}
                        </div>

                        {/* Zero-pill metadata */}
                        <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1 flex-wrap">
                          <span>{item.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>Zona: {item.storageZone}</span>
                          {item.expiryDate && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>Kadaluarsa: {item.expiryDate}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Interactive Quantity Stepper */}
                        <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50">
                          <button
                            type="button"
                            onClick={() => updatePantryQty(item.id, item.quantity - 1)}
                            className="p-1.5 text-neutral-600 hover:text-neutral-900 transition-colors"
                            aria-label="Kurangi jumlah"
                          >
                            <Icon name="Minus" size={13} />
                          </button>
                          <span className="px-2.5 text-xs font-mono font-semibold text-neutral-900 tabular-nums">
                            {item.quantity} {item.unit}
                          </span>
                          <button
                            type="button"
                            onClick={() => updatePantryQty(item.id, item.quantity + 1)}
                            className="p-1.5 text-neutral-600 hover:text-neutral-900 transition-colors"
                            aria-label="Tambah jumlah"
                          >
                            <Icon name="Plus" size={13} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleRestock(item.id)}
                          className={`p-1.5 rounded-lg border text-xs transition-colors ${
                            item.isRestockNeeded
                              ? 'bg-neutral-900 text-white border-neutral-900'
                              : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                          }`}
                          title={item.isRestockNeeded ? 'Di daftar belanja' : 'Masukkan ke daftar belanja'}
                        >
                          <Icon name="ShoppingCart" size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => deletePantryItem(item.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded-md transition-colors"
                        >
                          <Icon name="Trash2" size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Restock & Shopping List View */}
          {activeSubMenu === 'restock' && (
            <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <h3 className="text-base font-semibold text-neutral-900">Daftar Belanja Kebutuhan Dapur</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Item yang ditandai belanja atau otomatis masuk saat stok mencapai batas minimum.
                  </p>
                </div>
                <span className="text-xs font-mono text-neutral-400 tabular-nums">
                  {restockList.length} item
                </span>
              </div>

              {restockList.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-400">
                  Tidak ada bahan dapur yang perlu dibeli. Semua stok dalam kondisi aman.
                </div>
              ) : (
                <div className="space-y-2">
                  {restockList.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 border border-neutral-200 rounded-lg flex items-center justify-between hover:bg-neutral-50/50"
                    >
                      <div>
                        <div className="text-xs font-semibold text-neutral-900">{item.name}</div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          Sisa saat ini: {item.quantity} {item.unit} · Zona: {item.storageZone}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          updatePantryQty(item.id, item.quantity + 1);
                          toggleRestock(item.id);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors"
                      >
                        <Icon name="Check" size={13} />
                        <span>Sudah Dibeli (+1 {item.unit})</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Storage Zones View */}
          {activeSubMenu === 'zones' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {zones.map((zone) => {
                const zoneItems = pantryItems.filter((i) => i.storageZone === zone);
                return (
                  <div key={zone} className="p-4 bg-white border border-neutral-200 rounded-xl">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100">
                      <h4 className="text-xs font-semibold text-neutral-900">{zone}</h4>
                      <span className="text-xs font-mono text-neutral-400 tabular-nums">
                        {zoneItems.length} bahan
                      </span>
                    </div>

                    {zoneItems.length === 0 ? (
                      <div className="py-4 text-center text-xs text-neutral-400">
                        Belum ada item di zona ini.
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {zoneItems.map((item) => (
                          <div
                            key={item.id}
                            className="text-xs text-neutral-700 py-1 flex items-center justify-between"
                          >
                            <span>{item.name}</span>
                            <span className="font-mono text-neutral-500 tabular-nums">
                              {item.quantity} {item.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Add Pantry Item Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Bahan ke Dapur"
        subtitle="Catat nama bahan, jumlah stok saat ini, dan zona penyimpanan."
        maxWidth="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Nama Bahan / Barang *
            </label>
            <input
              type="text"
              required
              placeholder="Misal: Beras Pandan Wangi, Saus Tiram, Bawang Merah"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg bg-white"
              >
                <option value="Bahan Pokok">Bahan Pokok</option>
                <option value="Bumbu & Saus">Bumbu & Saus</option>
                <option value="Sayur & Buah">Sayur & Buah</option>
                <option value="Daging & Protein">Daging & Protein</option>
                <option value="Minuman">Minuman</option>
                <option value="Perlengkapan Rumah">Perlengkapan Rumah</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Zona Simpan</label>
              <select
                value={storageZone}
                onChange={(e) => setStorageZone(e.target.value as any)}
                className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg bg-white"
              >
                {zones.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Jumlah Stok</label>
              <input
                type="number"
                min="0"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Satuan</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg bg-white"
              >
                <option value="pcs">pcs</option>
                <option value="kg">kg</option>
                <option value="gram">gram</option>
                <option value="liter">liter</option>
                <option value="pack">pack</option>
                <option value="botol">botol</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Batas Min. Peringatan</label>
              <input
                type="number"
                min="0"
                value={minStockAlert}
                onChange={(e) => setMinStockAlert(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg font-mono tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Tanggal Kedaluwarsa (Opsional)
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
            >
              Simpan Bahan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
