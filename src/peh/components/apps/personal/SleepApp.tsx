import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { SleepItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const SleepApp: React.FC = () => {
  const { sleepLogs, addSleepLog, deleteSleepLog, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [bedtime, setBedtime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('06:30');
  const [totalHours, setTotalHours] = useState<number>(7.5);
  const [qualityScore, setQualityScore] = useState<number>(85);
  const [disturbances, setDisturbances] = useState<SleepItem['disturbances']>('Tidak Ada');
  const [feltRested, setFeltRested] = useState<boolean>(true);
  const [notes, setNotes] = useState('');

  // Interactive Feature: Sleep Debt Calculator (Baseline: 8 hrs/night)
  const targetHours = 8;
  const totalLoggedHours = sleepLogs.reduce((acc, curr) => acc + curr.totalHours, 0);
  const averageHours = sleepLogs.length > 0 ? (totalLoggedHours / sleepLogs.length).toFixed(1) : '0';
  const totalDebt = sleepLogs.reduce((acc, curr) => acc + (targetHours - curr.totalHours), 0);
  const avgQuality = sleepLogs.length > 0 ? Math.round(sleepLogs.reduce((acc, curr) => acc + curr.qualityScore, 0) / sleepLogs.length) : 0;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSleepLog({
      date,
      bedtime,
      wakeTime,
      totalHours: Number(totalHours) || 7,
      qualityScore: Number(qualityScore) || 80,
      disturbances,
      feltRested,
      notes: notes.trim() || undefined,
    });

    setNotes('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
              <Icon name="Moon" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Tidur & Pemulihan
            </h1>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Kualitas tidur, jam istirahat malam, penghitung sleep debt, dan evaluasi kesegaran tubuh.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Catat Tidur Semalam</span>
        </button>
      </div>

      {/* Sub-menus */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs">
        <button
          onClick={() => setActiveSubMenu('sleep-log')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'sleep-log'
              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="Bed" size={14} />
          <span>Log Tidur Harian ({sleepLogs.length})</span>
        </button>
        <button
          onClick={() => setActiveSubMenu('recovery-calc')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'recovery-calc'
              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="Brain" size={14} />
          <span>Kalkulator Hutang Tidur & Pemulihan</span>
        </button>
      </div>

      {/* Interactive Feature: Sleep Debt & Recovery Status Gauge */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Icon name="Zap" size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Analisis Sleep Debt & Pemulihan</h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Berdasarkan target istirahat biologis standar (8.0 jam per malam).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[11px] text-neutral-500">Akumulasi Hutang Tidur:</div>
              <div className={`text-sm font-bold ${totalDebt > 3 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {totalDebt > 0 ? `-${totalDebt.toFixed(1)} Jam` : `Optimal (+${Math.abs(totalDebt).toFixed(1)} Jam)`}
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold">
              Rata-rata: {averageHours} Jam/Malam
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="text-[11px] text-neutral-500">Skor Kualitas Rata-rata</div>
          <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">{avgQuality} / 100</div>
          <div className="text-[10px] text-neutral-400">Evaluasi lelap & kenyamanan</div>
        </div>
        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="text-[11px] text-neutral-500">Bangun Tubuh Segar</div>
          <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
            {sleepLogs.filter((s) => s.feltRested).length} dari {sleepLogs.length}
          </div>
          <div className="text-[10px] text-neutral-400">Hari dengan energi penuh</div>
        </div>
        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 col-span-2 sm:col-span-1">
          <div className="text-[11px] text-neutral-500">Malam Bebas Gangguan</div>
          <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
            {sleepLogs.filter((s) => s.disturbances === 'Tidak Ada').length} malam
          </div>
          <div className="text-[10px] text-neutral-400">Tidur nyenyak berkesinambungan</div>
        </div>
      </div>

      {/* Log List */}
      {sleepLogs.length === 0 ? (
        <EmptyState
          iconName="Moon"
          title="Belum Ada Rekam Tidur"
          description="Buku catatan tidur Anda masih bersih tanpa data dummy. Catat jam tidur semalam untuk memantau pemulihan fisik dan mental."
          actionLabel="Catat Tidur Hari Ini"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {sleepLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-neutral-400 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 mt-0.5">
                  <Icon name="Bed" size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{log.date}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {log.totalHours} Jam
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        log.feltRested
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                      }`}
                    >
                      {log.feltRested ? '✓ Bangun Segar' : '✕ Masih Lelah'}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-1 flex flex-wrap items-center gap-3">
                    <span>🌙 {log.bedtime} - ☀️ {log.wakeTime}</span>
                    <span>🌟 Skor Kualitas: {log.qualityScore}/100</span>
                    {log.disturbances !== 'Tidak Ada' && (
                      <span className="text-amber-600 dark:text-amber-400">⚠️ {log.disturbances}</span>
                    )}
                  </div>
                  {log.notes && <p className="text-[11px] text-neutral-400 mt-1 italic">{log.notes}</p>}
                </div>
              </div>

              <button
                onClick={() => deleteSleepLog(log.id)}
                className="self-end sm:self-center p-1.5 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                title="Hapus entri"
              >
                <Icon name="Trash2" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Sleep */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Catat Tidur & Pemulihan Semalam">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Tanggal</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Total Jam Tidur</label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="24"
                required
                value={totalHours}
                onChange={(e) => setTotalHours(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Jam Terlelap (Malam)</label>
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Jam Bangun (Pagi)</label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Skor Kualitas (1-100)</label>
              <input
                type="number"
                min="10"
                max="100"
                value={qualityScore}
                onChange={(e) => setQualityScore(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Faktor Gangguan</label>
              <select
                value={disturbances}
                onChange={(e) => setDisturbances(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="Tidak Ada">Tidak Ada</option>
                <option value="Bangun Tengah Malam">Bangun Tengah Malam</option>
                <option value="Sulit Terlelap">Sulit Terlelap</option>
                <option value="Mimpi Buruk">Mimpi Buruk</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="feltRested"
              checked={feltRested}
              onChange={(e) => setFeltRested(e.target.checked)}
              className="rounded text-neutral-900 focus:ring-0"
            />
            <label htmlFor="feltRested" className="text-xs text-neutral-700 dark:text-neutral-300">
              Bangun pagi terasa bugar, segar, dan siap beraktivitas
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Catatan Tambahan</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Minum teh chamomile sebelum tidur, suhu kamar 22°C"
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
              className="px-4 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold"
            >
              Simpan Entri Tidur
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
