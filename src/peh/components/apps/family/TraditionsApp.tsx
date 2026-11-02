import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { TraditionItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const TraditionsApp: React.FC = () => {
  const { traditions, addTradition, deleteTradition, activeSubMenu, setActiveSubMenu } = usePEH();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TraditionItem['category']>('Arisan Berkala');
  const [frequency, setFrequency] = useState<TraditionItem['frequency']>('Bulanan');
  const [nextDate, setNextDate] = useState('');
  const [leadOrganizer, setLeadOrganizer] = useState('');
  const [venueOrLocation, setVenueOrLocation] = useState('');
  const [budgetEstimate, setBudgetEstimate] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');

  const currentTab = activeSubMenu === 'default' ? 'events' : activeSubMenu;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !nextDate || !leadOrganizer.trim() || !venueOrLocation.trim()) return;

    addTradition({
      title: title.trim(),
      category,
      frequency,
      nextDate,
      leadOrganizer: leadOrganizer.trim(),
      venueOrLocation: venueOrLocation.trim(),
      budgetEstimate: budgetEstimate && budgetEstimate > 0 ? budgetEstimate : undefined,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setCategory('Arisan Berkala');
    setFrequency('Bulanan');
    setNextDate('');
    setLeadOrganizer('');
    setVenueOrLocation('');
    setBudgetEstimate(undefined);
    setNotes('');
    setIsAddModalOpen(false);
  };

  const totalBudget = traditions.reduce((acc, curr) => acc + (curr.budgetEstimate || 0), 0);

  const filteredTraditions = traditions.filter((trad) => {
    if (currentTab === 'rituals') {
      return trad.category === 'Tradisi Khusus' || trad.category === 'Ziarah & Doa Bersama';
    }
    if (currentTab === 'treasury') {
      return (trad.budgetEstimate || 0) > 0;
    }
    return true; // 'events' shows all
  });

  return (
    <div className="space-y-6">
      {/* Submenu Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubMenu('events')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'events'
                ? 'bg-rose-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Calendar" className="h-4 w-4" />
            Jadwal Acara & Reuni
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              currentTab === 'events' ? 'bg-rose-800 text-rose-100' : 'bg-stone-200 text-stone-700'
            }`}>
              {traditions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubMenu('rituals')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'rituals'
                ? 'bg-rose-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Flame" className="h-4 w-4" />
            Tradisi & Ritual Khusus
          </button>

          <button
            onClick={() => setActiveSubMenu('treasury')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'treasury'
                ? 'bg-rose-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Coins" className="h-4 w-4" />
            Kas & Anggaran Acara
          </button>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-rose-900 text-white text-sm font-medium rounded-lg hover:bg-rose-800 transition-colors shadow-xs"
        >
          <Icon name="Plus" className="h-4 w-4" />
          Rencanakan Tradisi / Acara
        </button>
      </div>

      {/* Summary Stat Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Acara Terencana</p>
          <p className="text-2xl font-semibold text-stone-900 mt-1 tabular-nums">{traditions.length}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Arisan / Pertemuan</p>
          <p className="text-2xl font-semibold text-stone-900 mt-1 tabular-nums">
            {traditions.filter(t => t.category === 'Arisan Berkala').length}
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Estimasi Anggaran Acara</p>
          <p className="text-2xl font-semibold text-rose-900 mt-1 tabular-nums">
            Rp {totalBudget.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* List or Empty State */}
      {filteredTraditions.length === 0 ? (
        <EmptyState
          title={
            currentTab === 'rituals'
              ? 'Belum Ada Tradisi Khusus'
              : currentTab === 'treasury'
              ? 'Belum Ada Estimasi Kas Acara'
              : 'Belum Ada Agenda Tradisi & Acara Keluarga'
          }
          description="Rencanakan arisan keluarga bulanan, mudik akbar hari raya, ziarah leluhur, atau tradisi silaturahmi agar kebersamaan selalu terjaga."
          actionLabel="Rencanakan Acara Pertama"
          onAction={() => setIsAddModalOpen(true)}
          iconName="CalendarHeart"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTraditions.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-stone-200 p-5 hover:border-stone-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-rose-50 text-rose-800 rounded-md">
                    {item.category}
                  </span>
                  <button
                    onClick={() => deleteTradition(item.id)}
                    className="text-stone-400 hover:text-red-600 transition-colors p-1"
                    title="Hapus Acara"
                  >
                    <Icon name="Trash2" className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="text-base font-semibold text-stone-900 mt-2">{item.title}</h3>
                <p className="text-xs text-stone-500 mt-0.5">Siklus: {item.frequency}</p>

                <div className="mt-4 space-y-2 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <Icon name="Calendar" className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                    <span>Tanggal: <strong className="text-stone-800">{item.nextDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Users" className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                    <span>Tuan Rumah / PJ: <strong className="text-stone-800">{item.leadOrganizer}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="MapPin" className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{item.venueOrLocation}</span>
                  </div>
                  {item.budgetEstimate !== undefined && (
                    <div className="flex items-center gap-2">
                      <Icon name="Coins" className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                      <span>Estimasi: <strong>Rp {item.budgetEstimate.toLocaleString('id-ID')}</strong></span>
                    </div>
                  )}
                </div>

                {item.notes && (
                  <p className="mt-3 text-xs text-stone-500 bg-stone-50 p-2 rounded-lg italic">
                    "{item.notes}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span>Didaftarkan {new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Rencanakan Agenda / Tradisi Keluarga"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Nama Tradisi / Agenda Acara *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Arisan Keluarga Besar Bani Sastro, Halal Bihalal Idul Fitri"
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Kategori *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TraditionItem['category'])}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-900 bg-white"
              >
                <option value="Arisan Berkala">Arisan Berkala</option>
                <option value="Mudik & Hari Raya">Mudik & Hari Raya</option>
                <option value="Reuni Akbar Tahunan">Reuni Akbar Tahunan</option>
                <option value="Ziarah & Doa Bersama">Ziarah & Doa Bersama</option>
                <option value="Tradisi Khusus">Tradisi Khusus</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Frekuensi *
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as TraditionItem['frequency'])}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-900 bg-white"
              >
                <option value="Bulanan">Bulanan</option>
                <option value="Tahunan">Tahunan</option>
                <option value="Hari Raya">Hari Raya</option>
                <option value="Insidental">Insidental</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Tanggal Pelaksanaan Berikutnya *
              </label>
              <input
                type="date"
                required
                value={nextDate}
                onChange={(e) => setNextDate(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Tuan Rumah / Penanggung Jawab *
              </label>
              <input
                type="text"
                required
                value={leadOrganizer}
                onChange={(e) => setLeadOrganizer(e.target.value)}
                placeholder="Contoh: Bude Ani / Om Budi"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Lokasi / Tempat Acara *
              </label>
              <input
                type="text"
                required
                value={venueOrLocation}
                onChange={(e) => setVenueOrLocation(e.target.value)}
                placeholder="Contoh: Rumah Kediaman Eyang, Solo"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Estimasi Anggaran Kas (Opsional)
              </label>
              <input
                type="number"
                min="0"
                value={budgetEstimate || ''}
                onChange={(e) => setBudgetEstimate(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Rp 0"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Catatan Khusus / Perlengkapan
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Dresscode batik coklat, bawa menu potluck khas daerah"
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium bg-rose-900 text-white rounded-lg hover:bg-rose-800 transition-colors"
            >
              Simpan Agenda
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
