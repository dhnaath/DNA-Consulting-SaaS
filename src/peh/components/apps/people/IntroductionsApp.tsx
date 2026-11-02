import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { IntroductionItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const IntroductionsApp: React.FC = () => {
  const { introductions, addIntroduction, updateIntroductionStatus, deleteIntroduction, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('Semua');

  // Form states
  const [contactA, setContactA] = useState('');
  const [contactB, setContactB] = useState('');
  const [purpose, setPurpose] = useState<IntroductionItem['purpose']>('Kolaborasi Proyek');
  const [dateIntroduced, setDateIntroduced] = useState(new Date().toISOString().split('T')[0]);
  const [outcomeNotes, setOutcomeNotes] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactA.trim() || !contactB.trim()) return;

    addIntroduction({
      contactA: contactA.trim(),
      contactB: contactB.trim(),
      purpose,
      dateIntroduced,
      status: 'Baru Dihubungkan',
      outcomeNotes: outcomeNotes.trim() || undefined,
    });

    setContactA('');
    setContactB('');
    setOutcomeNotes('');
    setIsAddModalOpen(false);
  };

  const filteredIntros = introductions.filter((it) => {
    return filterStatus === 'Semua' || it.status === filterStatus;
  });

  const activeCollabsCount = introductions.filter((it) => it.status === 'Kolaborasi Aktif').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Icon name="Share2" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Mak Comblang & Sambung Relasi
            </h1>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Log menjembatani relasi antar-kolega, peluang kerja sama, dan hasil kemitraan timbal-balik.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Hubungkan Dua Pihak</span>
        </button>
      </div>

      {/* Sub-menus */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs">
        <button
          onClick={() => setActiveSubMenu('network-bridge')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'network-bridge'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="GitPullRequest" size={14} />
          <span>Koneksi Dijembatani ({introductions.length})</span>
        </button>
        <button
          onClick={() => setActiveSubMenu('outcomes')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'outcomes'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="Trophy" size={14} />
          <span>Kolaborasi Aktif & Berhasil ({activeCollabsCount})</span>
        </button>
      </div>

      {/* List */}
      {filteredIntros.length === 0 ? (
        <EmptyState
          iconName="Share2"
          title="Belum Ada Koneksi yang Dijembatani"
          description="Buku referral Anda masih kosong tanpa data dummy. Sambungkan rekan bisnis, talenta pencari kerja, atau calon kolaborator proyek."
          actionLabel="Hubungkan Relasi Sekarang"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {filteredIntros.map((it) => (
            <div
              key={it.id}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-300 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-neutral-900 dark:text-white">
                    <span className="text-emerald-600 dark:text-emerald-400">{it.contactA}</span>
                    <Icon name="ArrowRight" size={13} className="text-neutral-400" />
                    <span className="text-emerald-600 dark:text-emerald-400">{it.contactB}</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    {it.purpose}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      it.status === 'Kolaborasi Aktif'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : it.status === 'Pertemuan Pertama Selesai'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                        : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                    }`}
                  >
                    {it.status}
                  </span>
                </div>

                <div className="text-xs text-neutral-500">
                  <span>Dihubungkan pada {it.dateIntroduced}</span>
                  {it.outcomeNotes && <span className="ml-2 font-medium text-neutral-700 dark:text-neutral-300">• Hasil: {it.outcomeNotes}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <select
                  value={it.status}
                  onChange={(e) => updateIntroductionStatus(it.id, e.target.value as any)}
                  className="px-2 py-1 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                >
                  <option value="Baru Dihubungkan">Baru Dihubungkan</option>
                  <option value="Pertemuan Pertama Selesai">Pertemuan Pertama Selesai</option>
                  <option value="Kolaborasi Aktif">Kolaborasi Aktif</option>
                  <option value="Selesai / Ditutup">Selesai / Ditutup</option>
                </select>

                <button
                  onClick={() => deleteIntroduction(it.id)}
                  className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Hapus rekaman"
                >
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Introduction */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Jembatani Hubungan / Mak Comblang">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Pihak Pertama (Relasi A)</label>
              <input
                type="text"
                required
                value={contactA}
                onChange={(e) => setContactA(e.target.value)}
                placeholder="Contoh: Andi (Desainer Grafis)"
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Pihak Kedua (Relasi B)</label>
              <input
                type="text"
                required
                value={contactB}
                onChange={(e) => setContactB(e.target.value)}
                placeholder="Contoh: Citra (Founder Brand Fashion)"
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Tujuan Pengenalan</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="Kolaborasi Proyek">Kolaborasi Proyek</option>
                <option value="Peluang Kerja">Peluang Kerja</option>
                <option value="Kemitraan Bisnis">Kemitraan Bisnis</option>
                <option value="Mentoring">Mentoring</option>
                <option value="Relasi Personal">Relasi Personal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Tanggal Pengenalan</label>
              <input
                type="date"
                required
                value={dateIntroduced}
                onChange={(e) => setDateIntroduced(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Catatan Hasil / Konteks</label>
            <input
              type="text"
              value={outcomeNotes}
              onChange={(e) => setOutcomeNotes(e.target.value)}
              placeholder="Contoh: Sudah saling kontak di WhatsApp untuk pitching awal"
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
              Simpan Koneksi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
