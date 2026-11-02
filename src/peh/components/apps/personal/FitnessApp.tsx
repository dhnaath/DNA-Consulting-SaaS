import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { FitnessItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const FitnessApp: React.FC = () => {
  const { fitnessLogs, addFitnessLog, deleteFitnessLog, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('Semua');

  // Form states
  const [workoutName, setWorkoutName] = useState('');
  const [workoutType, setWorkoutType] = useState<FitnessItem['workoutType']>('Beban / Gym');
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [caloriesBurned, setCaloriesBurned] = useState<number>(320);
  const [intensity, setIntensity] = useState<FitnessItem['intensity']>('Sedang');
  const [targetMuscles, setTargetMuscles] = useState('');
  const [notes, setNotes] = useState('');

  // Interactive Feature: 1RM Strength Calculator (Epley formula)
  const [calcWeight, setCalcWeight] = useState<number>(80);
  const [calcReps, setCalcReps] = useState<number>(5);
  const estimated1RM = Math.round(calcWeight * (1 + calcReps / 30));

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workoutName.trim()) return;

    addFitnessLog({
      workoutName: workoutName.trim(),
      workoutType,
      durationMinutes: Number(durationMinutes) || 30,
      caloriesBurned: Number(caloriesBurned) || undefined,
      intensity,
      targetMuscles: targetMuscles.trim() || undefined,
      date: new Date().toISOString().split('T')[0],
      notes: notes.trim() || undefined,
    });

    setWorkoutName('');
    setTargetMuscles('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const filteredLogs = fitnessLogs.filter((f) => {
    return filterType === 'Semua' || f.workoutType === filterType;
  });

  const totalMinutes = fitnessLogs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalCalories = fitnessLogs.reduce((acc, curr) => acc + (curr.caloriesBurned || 0), 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* App Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
              <Icon name="Dumbbell" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Latihan & Olahraga
            </h1>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Log sesi latihan fisik, kalori, intensitas detak, dan kalkulator kekuatan 1RM.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Catat Sesi Latihan</span>
        </button>
      </div>

      {/* Sub-menus */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs">
        <button
          onClick={() => setActiveSubMenu('workouts')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'workouts'
              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="Flame" size={14} />
          <span>Log Latihan ({fitnessLogs.length})</span>
        </button>
        <button
          onClick={() => setActiveSubMenu('calculator')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'calculator'
              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="Calculator" size={14} />
          <span>Kalkulator 1RM & Kekuatan</span>
        </button>
      </div>

      {/* Interactive Feature: 1RM Calculator Banner */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <Icon name="Activity" size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Kalkulator One-Rep Max (1RM)</h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Estimasi beban angkatan maksimal satu repetisi dengan formula Epley.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-neutral-500">Beban:</span>
              <input
                type="number"
                value={calcWeight}
                onChange={(e) => setCalcWeight(Number(e.target.value))}
                className="w-16 px-2 py-1 text-xs text-center border rounded bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 font-bold"
              />
              <span className="text-[11px] text-neutral-500">kg</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-neutral-500">Reps:</span>
              <input
                type="number"
                min="1"
                max="30"
                value={calcReps}
                onChange={(e) => setCalcReps(Number(e.target.value))}
                className="w-14 px-2 py-1 text-xs text-center border rounded bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 font-bold"
              />
            </div>
            <div className="px-3 py-1 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold">
              1RM: {estimated1RM} kg
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="text-[11px] text-neutral-500">Total Durasi Latihan</div>
          <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">{totalMinutes} menit</div>
          <div className="text-[10px] text-neutral-400">{(totalMinutes / 60).toFixed(1)} jam aktif</div>
        </div>
        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="text-[11px] text-neutral-500">Total Kalori Terbakar</div>
          <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">{totalCalories.toLocaleString('id-ID')} kkal</div>
          <div className="text-[10px] text-neutral-400">Estimasi metabolisme aktif</div>
        </div>
        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 col-span-2 sm:col-span-1">
          <div className="text-[11px] text-neutral-500">Total Sesi Tercatat</div>
          <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">{fitnessLogs.length} sesi</div>
          <div className="text-[10px] text-neutral-400">Rutinitas kebugaran</div>
        </div>
      </div>

      {/* Main Content */}
      {filteredLogs.length === 0 ? (
        <EmptyState
          iconName="Dumbbell"
          title="Belum Ada Log Latihan"
          description="Catatan kebugaran Anda masih bersih tanpa data dummy. Mulai catat sesi angkat beban, lari, atau olahraga favorit Anda."
          actionLabel="Catat Sesi Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-neutral-400 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 mt-0.5">
                  <Icon name="Activity" size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{log.workoutName}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      {log.workoutType}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-medium">
                      Intensitas {log.intensity}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-1 flex flex-wrap items-center gap-3">
                    <span>⏱ {log.durationMinutes} Menit</span>
                    {log.caloriesBurned && <span>🔥 {log.caloriesBurned} kkal</span>}
                    {log.targetMuscles && <span>💪 {log.targetMuscles}</span>}
                    <span>📅 {log.date}</span>
                  </div>
                  {log.notes && <p className="text-[11px] text-neutral-400 mt-1 italic">{log.notes}</p>}
                </div>
              </div>

              <button
                onClick={() => deleteFitnessLog(log.id)}
                className="self-end sm:self-center p-1.5 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                title="Hapus log latihan"
              >
                <Icon name="Trash2" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Workout */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Catat Sesi Latihan Baru">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Nama Sesi Latihan</label>
            <input
              type="text"
              required
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="Contoh: Chest & Triceps Push Day, Lari 5K Pagi"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Jenis Olahraga</label>
              <select
                value={workoutType}
                onChange={(e) => setWorkoutType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="Beban / Gym">Beban / Gym</option>
                <option value="Kardio / Lari">Kardio / Lari</option>
                <option value="HIIT & Calisthenics">HIIT & Calisthenics</option>
                <option value="Mobilitas & Renang">Mobilitas & Renang</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Intensitas Latihan</label>
              <select
                value={intensity}
                onChange={(e) => setIntensity(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="Ringan">Ringan</option>
                <option value="Sedang">Sedang</option>
                <option value="Tinggi">Tinggi</option>
                <option value="Maksimal">Maksimal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Durasi (Menit)</label>
              <input
                type="number"
                min="5"
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Kalori Terbakar (Opsional)</label>
              <input
                type="number"
                min="0"
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Otot Sasaran / Fokus Gerakan</label>
            <input
              type="text"
              value={targetMuscles}
              onChange={(e) => setTargetMuscles(e.target.value)}
              placeholder="Contoh: Dada, Paha Depan, Bahu Lateral"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Catatan Tambahan (Opsional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: RPE 8, tempo lambat, hidrasi cukup"
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
              Simpan Sesi Latihan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
