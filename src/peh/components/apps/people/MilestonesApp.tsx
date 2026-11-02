import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { MilestoneItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const MilestonesApp: React.FC = () => {
  const { milestones, addMilestone, deleteMilestone, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('Semua');

  // Form states
  const [title, setTitle] = useState('');
  const [personName, setPersonName] = useState('');
  const [eventType, setEventType] = useState<MilestoneItem['eventType']>('Ulang Tahun');
  const [date, setDate] = useState('');
  const [reminderDays, setReminderDays] = useState('7');
  const [notes, setNotes] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !personName.trim() || !date) return;

    addMilestone({
      title: title.trim(),
      personName: personName.trim(),
      eventType,
      date,
      reminderDaysBefore: Number(reminderDays) || 7,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setPersonName('');
    setDate('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const filteredMilestones = milestones.filter((m) => {
    if (filterType === 'Semua') return true;
    return m.eventType === filterType;
  });

  const eventTypes: MilestoneItem['eventType'][] = [
    'Ulang Tahun',
    'Hari Jadi Pernikahan',
    'Kelulusan / Promosi',
    'Peringatan Hari Wafat',
    'Lainnya',
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-100">
              <Icon name="Cake" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Momen & Ulang Tahun
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Pengingat hari jadi, tanggal lahir sahabat & kerabat, serta perayaan bersejarah tahunan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Tambah Tanggal Spesial</span>
        </button>
      </div>

      {/* Submenus */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex p-1 bg-neutral-100 rounded-lg text-xs font-medium">
          {[
            { id: 'upcoming', label: 'Momen Terdekat', count: milestones.length },
            { id: 'calendar', label: 'Kalender Tahunan' },
            { id: 'archive', label: 'Daftar Lengkap' },
          ].map((tab) => {
            const isActive = activeSubMenu === tab.id || (!activeSubMenu && tab.id === 'upcoming');
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
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-neutral-200 rounded-lg bg-white"
          >
            <option value="Semua">Semua Jenis Momen</option>
            {eventTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {milestones.length === 0 ? (
        <EmptyState
          iconName="Cake"
          title="Belum ada momen spesial yang dicatat"
          description="Catat tanggal lahir orang terkasih, ulang tahun pernikahan, atau kelulusan agar Anda selalu siap memberikan ucapan tepat waktu."
          actionLabel="Catat Momen Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100">
            {filteredMilestones
              .slice()
              .sort((a, b) => (a.date > b.date ? 1 : -1))
              .map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/50"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                      <Icon name="CalendarHeart" size={17} />
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900 text-sm">{item.title}</div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                        <span className="font-medium text-neutral-800">{item.personName}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.eventType}</span>
                        {item.notes && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="truncate max-w-[200px] italic">{item.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-neutral-900 tabular-nums">
                        {item.date}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        Pengingat: {item.reminderDaysBefore} hari sebelum
                      </div>
                    </div>

                    <button
                      onClick={() => deleteMilestone(item.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 rounded-md transition-colors"
                      title="Hapus momen"
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Add Milestone Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Catat Momen Spesial"
        subtitle="Tetapkan nama acara, orang terkait, dan tanggal perayaan."
        maxWidth="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Judul Acara / Momen *
            </label>
            <input
              type="text"
              required
              placeholder="Misal: Ulang Tahun Ibu, Hari Jadi Pernikahan Mas Budi"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Nama Orang Terkait *
              </label>
              <input
                type="text"
                required
                placeholder="Ibu, Mas Budi, Rian"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Jenis Momen</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as any)}
                className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg bg-white"
              >
                {eventTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Tanggal Perayaan *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Pengingat Awal (Hari)
              </label>
              <input
                type="number"
                min="0"
                value={reminderDays}
                onChange={(e) => setReminderDays(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg font-mono tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Catatan Tambahan</label>
            <input
              type="text"
              placeholder="Rencana kejutan kado, pesan ucapan khusus"
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
              Simpan Momen
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
