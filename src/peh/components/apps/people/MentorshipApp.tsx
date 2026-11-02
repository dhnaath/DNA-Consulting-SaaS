import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { MentorshipItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const MentorshipApp: React.FC = () => {
  const { mentorships, addMentorship, deleteMentorship, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterDomain, setFilterDomain] = useState<string>('Semua');

  // Form states
  const [mentorName, setMentorName] = useState('');
  const [domain, setDomain] = useState<MentorshipItem['domain']>('Karier & Kepemimpinan');
  const [cadence, setCadence] = useState<MentorshipItem['cadence']>('Bulanan');
  const [lastSessionDate, setLastSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [nextSessionDate, setNextSessionDate] = useState('');
  const [keyAdviceSummary, setKeyAdviceSummary] = useState('');
  const [actionItemForMe, setActionItemForMe] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorName.trim() || !keyAdviceSummary.trim() || !actionItemForMe.trim()) return;

    addMentorship({
      mentorName: mentorName.trim(),
      domain,
      cadence,
      lastSessionDate,
      nextSessionDate: nextSessionDate || undefined,
      keyAdviceSummary: keyAdviceSummary.trim(),
      actionItemForMe: actionItemForMe.trim(),
      notes: notes.trim() || undefined,
    });

    setMentorName('');
    setKeyAdviceSummary('');
    setActionItemForMe('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const filteredMentorships = mentorships.filter((m) => {
    return filterDomain === 'Semua' || m.domain === filterDomain;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Icon name="Compass" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Mentor & Bimbingan
            </h1>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Sesi bimbingan 1-on-1, intisari nasihat penting, dan komitmen aksi tindak lanjut.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Catat Sesi Mentoring</span>
        </button>
      </div>

      {/* Sub-menus */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs">
        <button
          onClick={() => setActiveSubMenu('mentors')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'mentors'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="UserCheck" size={14} />
          <span>Daftar Mentor ({mentorships.length})</span>
        </button>
        <button
          onClick={() => setActiveSubMenu('commitments')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'commitments'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="CheckSquare" size={14} />
          <span>Komitmen & Action Items</span>
        </button>
      </div>

      {/* Interactive Feature: Follow-up Due Tracker */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
            <Icon name="CheckSquare" size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Pelacak Komitmen Tindak Lanjut</h4>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Pastikan setiap wawasan yang didapatkan dari mentor segera dieksekusi menjadi tindakan nyata.
            </p>
          </div>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          {mentorships.length} Mentor Aktif
        </div>
      </div>

      {/* List */}
      {filteredMentorships.length === 0 ? (
        <EmptyState
          iconName="Compass"
          title="Belum Ada Catatan Bimbingan"
          description="Direktori mentor Anda masih bersih tanpa data dummy. Mulai catat saran karier, strategi bisnis, atau arahan spiritual dari mentor tepercaya."
          actionLabel="Catat Sesi Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {filteredMentorships.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:border-emerald-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
                    {m.mentorName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{m.mentorName}</h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">{m.domain}</span>
                      <span>•</span>
                      <span>Cadence: {m.cadence}</span>
                      <span>•</span>
                      <span>Sesi: {m.lastSessionDate}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteMentorship(m.id)}
                  className="self-end sm:self-auto p-1 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Hapus entri"
                >
                  <Icon name="Trash2" size={14} />
                </button>
              </div>

              <div className="space-y-2 border-t border-neutral-100 dark:border-neutral-800/80 pt-3">
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 text-xs">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">💡 Intisari Nasihat & Refleksi:</span>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{m.keyAdviceSummary}</p>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs">
                  <span className="font-semibold text-emerald-800 dark:text-emerald-300 block mb-1">🎯 Komitmen Aksi Tindak Lanjut:</span>
                  <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed font-medium">{m.actionItemForMe}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Mentorship */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Catat Sesi Bimbingan Mentor">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Nama Mentor</label>
              <input
                type="text"
                required
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
                placeholder="Contoh: Pak Budi Santoso"
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Domain Bimbingan</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="Karier & Kepemimpinan">Karier & Kepemimpinan</option>
                <option value="Bisnis & Startup">Bisnis & Startup</option>
                <option value="Teknologi & Engineering">Teknologi & Engineering</option>
                <option value="Keuangan & Investasi">Keuangan & Investasi</option>
                <option value="Spiritual / Kehidupan">Spiritual / Kehidupan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Frekuensi Pertemuan</label>
              <select
                value={cadence}
                onChange={(e) => setCadence(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="Mingguan">Mingguan</option>
                <option value="Dua Mingguan">Dua Mingguan</option>
                <option value="Bulanan">Bulanan</option>
                <option value="Insidental">Insidental</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Tanggal Sesi Terakhir</label>
              <input
                type="date"
                required
                value={lastSessionDate}
                onChange={(e) => setLastSessionDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Jadwal Sesi Mendatang</label>
              <input
                type="date"
                value={nextSessionDate}
                onChange={(e) => setNextSessionDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Intisari Nasihat & Insight Penting</label>
            <textarea
              rows={3}
              required
              value={keyAdviceSummary}
              onChange={(e) => setKeyAdviceSummary(e.target.value)}
              placeholder="Catat konsep inti, umpan balik konstruktif, atau cara pandang baru yang diberikan mentor..."
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Komitmen Tindakan (Action Items)</label>
            <input
              type="text"
              required
              value={actionItemForMe}
              onChange={(e) => setActionItemForMe(e.target.value)}
              placeholder="Contoh: Selesaikan proposal kemitraan sebelum akhir minggu"
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
              Simpan Sesi Bimbingan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
