import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { TimeAuditItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const TimeAuditApp: React.FC = () => {
  const { timeAudits, addTimeAudit, deleteTimeAudit, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterCat, setFilterCat] = useState<string>('Semua');

  // Form states
  const [activityName, setActivityName] = useState('');
  const [category, setCategory] = useState<TimeAuditItem['category']>('Deep Work');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [energyLevel, setEnergyLevel] = useState<TimeAuditItem['energyLevel']>('Tinggi (Peak)');
  const [outputDeliverable, setOutputDeliverable] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityName.trim()) return;

    addTimeAudit({
      activityName: activityName.trim(),
      category,
      date,
      durationMinutes: Number(durationMinutes) || 30,
      energyLevel,
      outputDeliverable: outputDeliverable.trim() || undefined,
    });

    setActivityName('');
    setOutputDeliverable('');
    setIsAddModalOpen(false);
  };

  const filteredAudits = timeAudits.filter((ta) => {
    return filterCat === 'Semua' || ta.category === filterCat;
  });

  const deepWorkMinutes = timeAudits.filter((t) => t.category === 'Deep Work').reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const distractionMinutes = timeAudits.filter((t) => t.category === 'Gangguan / Distraksi').reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalMinutes = timeAudits.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const deepWorkQuotient = totalMinutes > 0 ? Math.round((deepWorkMinutes / totalMinutes) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200 dark:border-amber-900/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Icon name="Timer" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
              Audit Waktu & Deep Work
            </h1>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Pelacak blok fokus kerja mendalam, rasio distraksi, dan analisis jam puncak energi kerja.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Log Blok Waktu</span>
        </button>
      </div>

      {/* Sub-menus */}
      <div className="flex items-center gap-2 border-b border-amber-200/60 dark:border-amber-900/40 pb-2 text-xs">
        <button
          onClick={() => setActiveSubMenu('blocks')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'blocks'
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <Icon name="Clock" size={14} />
          <span>Blok Sesi Fokus ({timeAudits.length})</span>
        </button>
        <button
          onClick={() => setActiveSubMenu('focus-ratio')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'focus-ratio'
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <Icon name="PieChart" size={14} />
          <span>Rasio Fokus vs Distraksi</span>
        </button>
      </div>

      {/* Interactive Feature: Deep Work Quotient Ratio */}
      <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
              <Icon name="Zap" size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900 dark:text-white">Deep Work Quotient (DWQ)</h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Persentase waktu yang dialokasikan untuk pekerjaan bervaluasi tinggi tanpa distraksi.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <span className="text-stone-500">Deep Work: <strong>{Math.round(deepWorkMinutes / 60)} Jam</strong></span>
              <span className="mx-2 text-stone-300">|</span>
              <span className="text-rose-600 font-semibold">Distraksi: {distractionMinutes} mnt</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold shadow-sm">
              Skor Fokus: {deepWorkQuotient}%
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      {filteredAudits.length === 0 ? (
        <EmptyState
          iconName="Timer"
          title="Belum Ada Log Waktu Tercatat"
          description="Timesheet Anda masih bersih tanpa data dummy. Catat blok kerja mendalam (coding, menulis, analisis) atau waktu rapat."
          actionLabel="Log Blok Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {filteredAudits.map((ta) => (
            <div
              key={ta.id}
              className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 mt-0.5">
                  <Icon name="Clock" size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white">{ta.activityName}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                      {ta.category}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-medium">
                      Energi: {ta.energyLevel}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 mt-1 flex flex-wrap items-center gap-3">
                    <span>⏱ {ta.durationMinutes} Menit</span>
                    <span>📅 {ta.date}</span>
                    {ta.outputDeliverable && <span>📦 Output: <strong className="text-stone-700 dark:text-stone-300">{ta.outputDeliverable}</strong></span>}
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteTimeAudit(ta.id)}
                className="self-end sm:self-center p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                title="Hapus log waktu"
              >
                <Icon name="Trash2" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Time Audit */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Log Sesi Kerja & Audit Waktu">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Aktivitas / Nama Pekerjaan</label>
            <input
              type="text"
              required
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              placeholder="Contoh: Redesain Arsitektur Database, Sprint Planning, Menulis Laporan Q3"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Kategori Waktu</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
              >
                <option value="Deep Work">Deep Work (Fokus Tinggi)</option>
                <option value="Shallow Work / Email">Shallow Work / Email & Chat</option>
                <option value="Rapat & Diskusi">Rapat & Diskusi</option>
                <option value="Gangguan / Distraksi">Gangguan / Distraksi</option>
                <option value="Istirahat">Istirahat</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Level Energi</label>
              <select
                value={energyLevel}
                onChange={(e) => setEnergyLevel(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
              >
                <option value="Tinggi (Peak)">Tinggi (Peak)</option>
                <option value="Stabil">Stabil</option>
                <option value="Lelah / Drop">Lelah / Drop</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Durasi (Menit)</label>
              <input
                type="number"
                min="5"
                step="5"
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Tanggal</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Hasil / Deliverable Terwujud</label>
            <input
              type="text"
              value={outputDeliverable}
              onChange={(e) => setOutputDeliverable(e.target.value)}
              placeholder="Contoh: Dokumen PRD selesai 10 halaman, PR code review disetujui"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
            >
              Simpan Blok Waktu
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
