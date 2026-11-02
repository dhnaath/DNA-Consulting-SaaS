import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { GiftItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const GiftsApp: React.FC = () => {
  const { gifts, addGift, toggleGiftFulfilled, deleteGift, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterDirection, setFilterDirection] = useState<string>('Semua');

  // Form states
  const [personName, setPersonName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [direction, setDirection] = useState<GiftItem['direction']>('Ide Hadiah Keluar');
  const [occasion, setOccasion] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim() || !itemDescription.trim()) return;

    addGift({
      personName: personName.trim(),
      itemDescription: itemDescription.trim(),
      direction,
      occasion: occasion.trim() || 'Spesial',
      estimatedValue: estimatedValue ? Number(estimatedValue) : undefined,
      isFulfilled: false,
      notes: notes.trim() || undefined,
    });

    setPersonName('');
    setItemDescription('');
    setOccasion('');
    setEstimatedValue('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const filteredGifts = gifts.filter((g) => {
    if (filterDirection === 'Semua') return true;
    return g.direction === filterDirection;
  });

  const directions: GiftItem['direction'][] = [
    'Ide Hadiah Keluar',
    'Hadiah Diterima',
    'Budi & Saling Bantu',
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-100">
              <Icon name="Gift" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Inspirasi Hadiah & Budi
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Catatan ide kado bermakna, riwayat bingkisan yang diterima/diberikan, serta jejak saling bantu.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Tambah Ide / Catatan</span>
        </button>
      </div>

      {/* Submenus */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex p-1 bg-neutral-100 rounded-lg text-xs font-medium">
          {[
            { id: 'ideas', label: 'Ide Hadiah Terencana', count: gifts.filter((g) => !g.isFulfilled).length },
            { id: 'history', label: 'Riwayat Kado Masuk/Keluar', count: gifts.length },
            { id: 'favors', label: 'Catatan Saling Bantu', count: gifts.filter((g) => g.direction === 'Budi & Saling Bantu').length },
          ].map((tab) => {
            const isActive = activeSubMenu === tab.id || (!activeSubMenu && tab.id === 'ideas');
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
            value={filterDirection}
            onChange={(e) => setFilterDirection(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-neutral-200 rounded-lg bg-white"
          >
            <option value="Semua">Semua Jenis Aliran</option>
            {directions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {gifts.length === 0 ? (
        <EmptyState
          iconName="Gift"
          title="Belum ada ide hadiah atau catatan budi"
          description="Catat ide bingkisan saat mendengar orang terdekat Anda menyukai sesuatu, atau catat pertolongan budi yang ingin Anda balas di masa depan."
          actionLabel="Tambah Catatan Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100">
          {filteredGifts.map((gift) => (
            <div
              key={gift.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/50"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-neutral-900 text-sm">{gift.itemDescription}</span>
                  <span
                    className={`text-xs ${
                      gift.isFulfilled ? 'text-emerald-600 font-medium' : 'text-neutral-400'
                    }`}
                  >
                    · {gift.isFulfilled ? 'Sudah Terwujud' : 'Terencana'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1 flex-wrap">
                  <span className="font-medium text-neutral-800">{gift.personName}</span>
                  <span aria-hidden="true">·</span>
                  <span>{gift.direction}</span>
                  <span aria-hidden="true">·</span>
                  <span>Momen: {gift.occasion}</span>
                  {gift.estimatedValue && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        Rp {gift.estimatedValue.toLocaleString('id-ID')}
                      </span>
                    </>
                  )}
                </div>

                {gift.notes && <p className="text-xs text-neutral-600 mt-1 italic">"{gift.notes}"</p>}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleGiftFulfilled(gift.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border cursor-pointer ${
                    gift.isFulfilled
                      ? 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200/80'
                      : 'bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800'
                  }`}
                >
                  {gift.isFulfilled ? 'Batal Status' : 'Tandai Selesai'}
                </button>

                <button
                  onClick={() => deleteGift(gift.id)}
                  className="p-1.5 text-neutral-400 hover:text-red-600 rounded-md transition-colors"
                >
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Gift Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Catat Hadiah atau Budi"
        subtitle="Simpan ide kado atau catatan saling bantu antarrekan/keluarga."
        maxWidth="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Deskripsi Hadiah / Bentuk Bantuan *
            </label>
            <input
              type="text"
              required
              placeholder="Misal: Buku Novel Bahasa Asing, Bantuan Antar Berkas Rumah Sakit"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Nama Orang *
              </label>
              <input
                type="text"
                required
                placeholder="Rian, Tante Sari, Kak Budi"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Jenis Aliran</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as any)}
                className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg bg-white"
              >
                {directions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Konteks / Momen Acara
              </label>
              <input
                type="text"
                placeholder="Ulang Tahun, Syukuran Rumah, Wisuda"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Estimasi Nilai / Biaya (Rp)
              </label>
              <input
                type="number"
                placeholder="250000"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg font-mono tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Catatan Tambahan</label>
            <input
              type="text"
              placeholder="Toko langganan, ukuran baju/sepatu, warna kesukaan"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              Simpan Catatan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
