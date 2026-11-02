import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { CommunityEventItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const CommunityEventsApp: React.FC = () => {
  const { communityEvents, addCommunityEvent, deleteCommunityEvent, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterScope, setFilterScope] = useState<string>('Semua');

  // Form states
  const [eventName, setEventName] = useState('');
  const [scope, setScope] = useState<CommunityEventItem['scope']>('Lingkungan RT/RW');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [myRole, setMyRole] = useState<CommunityEventItem['myRole']>('Ketua / Panitia');
  const [attendeeCountEstimate, setAttendeeCountEstimate] = useState<number>(40);
  const [budgetAllocation, setBudgetAllocation] = useState<number>(2500000);
  const [notes, setNotes] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim() || !location.trim()) return;

    addCommunityEvent({
      eventName: eventName.trim(),
      scope,
      eventDate,
      location: location.trim(),
      myRole,
      attendeeCountEstimate: Number(attendeeCountEstimate) || 10,
      budgetAllocation: Number(budgetAllocation) || undefined,
      status: 'Rencana',
      notes: notes.trim() || undefined,
    });

    setEventName('');
    setLocation('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const filteredEvents = communityEvents.filter((ce) => {
    return filterScope === 'Semua' || ce.scope === filterScope;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Icon name="CalendarCheck" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Acara & Agenda Warga
            </h1>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Papan agenda rapat RW, kerja bakti, peringatan 17-an, dan absensi relawan panitia.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Buat Agenda Acara</span>
        </button>
      </div>

      {/* Sub-menus */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs">
        <button
          onClick={() => setActiveSubMenu('event-board')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'event-board'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="Calendar" size={14} />
          <span>Papan Agenda Warga ({communityEvents.length})</span>
        </button>
      </div>

      {/* List */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          iconName="CalendarCheck"
          title="Belum Ada Acara Komunitas"
          description="Papan agenda warga Anda masih bersih tanpa data dummy. Rencanakan rapat kerja warga, kerja bakti bulanan, atau turnamen olahraga RT."
          actionLabel="Rencanakan Acara Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                    {ev.scope}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">📅 {ev.eventDate}</span>
                </div>

                <h3 className="text-base font-bold text-neutral-900 dark:text-white">{ev.eventName}</h3>
                <p className="text-xs text-neutral-500 mb-3">📍 Lokasi: {ev.location}</p>

                <div className="space-y-1 text-xs text-neutral-500 border-t border-neutral-100 dark:border-neutral-800 pt-2 mb-3">
                  <div className="flex justify-between">
                    <span>Peran Saya:</span>
                    <strong className="text-neutral-800 dark:text-neutral-200">{ev.myRole}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimasi Partisipan:</span>
                    <span>~{ev.attendeeCountEstimate} Warga</span>
                  </div>
                  {ev.budgetAllocation && (
                    <div className="flex justify-between">
                      <span>Alokasi Kas Panitia:</span>
                      <span className="font-semibold text-emerald-600">Rp {ev.budgetAllocation.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  {ev.notes && <p className="text-[11px] text-neutral-400 italic pt-1">{ev.notes}</p>}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 font-semibold text-neutral-600 dark:text-neutral-300">
                  Status: {ev.status}
                </span>

                <button
                  onClick={() => deleteCommunityEvent(ev.id)}
                  className="p-1 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Hapus agenda"
                >
                  <Icon name="Trash2" size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Community Event */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Buat Agenda Acara Komunitas">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Nama Acara / Kegiatan</label>
            <input
              type="text"
              required
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Contoh: Kerja Bakti Saluran Air RW 05, Jalan Santai 17 Agustus"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Lingkup Komunitas</label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="Lingkungan RT/RW">Lingkungan RT/RW</option>
                <option value="Komunitas Hobi">Komunitas Hobi</option>
                <option value="Alumni">Alumni</option>
                <option value="Organisasi Profesi">Organisasi Profesi</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Peran Saya</label>
              <select
                value={myRole}
                onChange={(e) => setMyRole(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="Ketua / Panitia">Ketua / Panitia</option>
                <option value="Peserta Aktif">Peserta Aktif</option>
                <option value="Donatur / Sponsor">Donatur / Sponsor</option>
                <option value="Pengamat">Pengamat</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Tanggal Acara</label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Lokasi Titik Kumpul</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Balai Warga RW 05 / Lapangan Futsal"
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Estimasi Jumlah Peserta</label>
              <input
                type="number"
                min="1"
                required
                value={attendeeCountEstimate}
                onChange={(e) => setAttendeeCountEstimate(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Anggaran Kas Panitia (Opsional)</label>
              <input
                type="number"
                step="50000"
                value={budgetAllocation}
                onChange={(e) => setBudgetAllocation(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Catatan Tambahan & Perlengkapan</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Warga membawa sapu lidi dan cangkul sendiri"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
            >
              Simpan Agenda Acara
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
