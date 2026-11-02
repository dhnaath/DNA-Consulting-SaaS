import React, { useState, useMemo } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { WeightLogEntry, WeightProfile } from '../../types';
import {
  Scale,
  Plus,
  TrendingDown,
  TrendingUp,
  Target,
  Calendar,
  Award,
  Edit2,
  Trash2,
  Flame,
  CheckCircle2,
  Activity,
  User,
  Heart,
  Sparkles,
  ArrowDown,
  ArrowUp,
  X,
  Info,
} from 'lucide-react';

function calculateBMI(weightKg: number, heightCm: number): { bmi: number; status: string; color: string } {
  if (!heightCm || heightCm <= 0) return { bmi: 0, status: 'Belum diatur', color: 'text-neutral-500' };
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  if (bmi < 18.5) return { bmi, status: 'Underweight (Kurang)', color: 'text-blue-600 bg-blue-50 border-blue-200' };
  if (bmi <= 24.9) return { bmi, status: 'Normal / Ideal ✨', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (bmi <= 29.9) return { bmi, status: 'Overweight (Kelebihan)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  return { bmi, status: 'Obesitas', color: 'text-rose-700 bg-rose-50 border-rose-200' };
}

export const WeightTrackerView: React.FC = () => {
  const {
    weightLogs,
    weightProfile,
    addWeightLog,
    updateWeightLog,
    deleteWeightLog,
    updateWeightProfile,
  } = useLifeOS();

  // Modals
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<WeightLogEntry | null>(null);

  // Log Form State
  const [logFormData, setLogFormData] = useState<Omit<WeightLogEntry, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    weight: weightProfile?.currentWeight || 70,
    bodyFat: undefined,
    muscleMass: undefined,
    waistCircumference: undefined,
    notes: '',
  });

  // Profile Form State
  const [profileFormData, setProfileFormData] = useState<WeightProfile>(
    weightProfile || {
      startingWeight: 75,
      currentWeight: 70,
      targetWeight: 65,
      heightCm: 175,
      startDate: '2026-01-01',
      targetDate: '2026-06-30',
      unit: 'kg',
    }
  );

  const openAddLogModal = () => {
    setEditingLog(null);
    setLogFormData({
      date: new Date().toISOString().split('T')[0],
      weight: weightProfile?.currentWeight || 70,
      bodyFat: undefined,
      muscleMass: undefined,
      waistCircumference: undefined,
      notes: '',
    });
    setIsLogModalOpen(true);
  };

  const openEditLogModal = (log: WeightLogEntry) => {
    setEditingLog(log);
    setLogFormData({
      date: log.date,
      weight: log.weight,
      bodyFat: log.bodyFat,
      muscleMass: log.muscleMass,
      waistCircumference: log.waistCircumference,
      notes: log.notes || '',
    });
    setIsLogModalOpen(true);
  };

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logFormData.weight || logFormData.weight <= 0) return;

    if (editingLog) {
      updateWeightLog(editingLog.id, logFormData);
    } else {
      addWeightLog(logFormData);
    }
    setIsLogModalOpen(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateWeightProfile(profileFormData);
    setIsProfileModalOpen(false);
  };

  // Sort logs by date descending for table, ascending for chart
  const sortedLogsDesc = useMemo(() => {
    return [...weightLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [weightLogs]);

  const sortedLogsAsc = useMemo(() => {
    return [...weightLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [weightLogs]);

  // Statistics
  const stats = useMemo(() => {
    const currentWeight = sortedLogsDesc.length > 0 ? sortedLogsDesc[0].weight : weightProfile.currentWeight;
    const startWeight = weightProfile.startingWeight;
    const targetWeight = weightProfile.targetWeight;

    const totalToLose = startWeight - targetWeight;
    const lostSoFar = startWeight - currentWeight;
    const remainingToTarget = Math.abs(currentWeight - targetWeight);

    let progressPercent = 0;
    if (totalToLose > 0) {
      progressPercent = Math.min(100, Math.max(0, Math.round((lostSoFar / totalToLose) * 100)));
    } else if (totalToLose < 0) {
      // Weight gain goal
      const gainedSoFar = currentWeight - startWeight;
      progressPercent = Math.min(100, Math.max(0, Math.round((gainedSoFar / Math.abs(totalToLose)) * 100)));
    }

    const bmiInfo = calculateBMI(currentWeight, weightProfile.heightCm);

    // Latest change
    let recentChange = 0;
    if (sortedLogsDesc.length >= 2) {
      recentChange = Number((sortedLogsDesc[0].weight - sortedLogsDesc[1].weight).toFixed(1));
    }

    return {
      currentWeight,
      startWeight,
      targetWeight,
      lostSoFar: Number(lostSoFar.toFixed(1)),
      remainingToTarget: Number(remainingToTarget.toFixed(1)),
      progressPercent,
      bmiInfo,
      recentChange,
      totalEntries: weightLogs.length,
    };
  }, [weightLogs, weightProfile, sortedLogsDesc]);

  // SVG Chart data points
  const chartPoints = useMemo(() => {
    if (sortedLogsAsc.length < 2) return null;
    const weights = sortedLogsAsc.map((l) => l.weight);
    const minW = Math.min(...weights, weightProfile.targetWeight) - 1;
    const maxW = Math.max(...weights, weightProfile.startingWeight) + 1;
    const range = maxW - minW || 1;

    const width = 600;
    const height = 180;
    const padding = 35;

    const points = sortedLogsAsc.map((log, index) => {
      const x = padding + (index / (sortedLogsAsc.length - 1)) * (width - padding * 2);
      const y = height - padding - ((log.weight - minW) / range) * (height - padding * 2);
      return { x, y, weight: log.weight, date: log.date };
    });

    const pathString = points.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
    }, '');

    // Target line Y
    const targetY =
      height - padding - ((weightProfile.targetWeight - minW) / range) * (height - padding * 2);

    return { points, pathString, width, height, targetY, minW, maxW };
  }, [sortedLogsAsc, weightProfile]);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Banner */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-700 shadow-xs">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-neutral-900 tracking-tight font-serif">
                  Weight Tracker by LifeCanvas
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-medium border border-neutral-200/60">
                  {stats.totalEntries} catatan timbangan
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Pemantauan transformasi berat badan berkala, estimasi BMI ideal, dan grafik tren progres kesehatan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setProfileFormData(weightProfile);
                setIsProfileModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium rounded-xl transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Target & Profil Fisik</span>
            </button>

            <button
              onClick={openAddLogModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Timbangan</span>
            </button>
          </div>
        </div>

        {/* Top Summary Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-neutral-100">
          <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Berat Saat Ini
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-neutral-900 font-mono">
                {stats.currentWeight}
              </span>
              <span className="text-xs text-neutral-500 font-medium">kg</span>
              {stats.recentChange !== 0 && (
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center ml-1 ${
                    stats.recentChange < 0
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {stats.recentChange < 0 ? (
                    <ArrowDown className="w-2.5 h-2.5 inline mr-0.5" />
                  ) : (
                    <ArrowUp className="w-2.5 h-2.5 inline mr-0.5" />
                  )}
                  {Math.abs(stats.recentChange)} kg
                </span>
              )}
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Titik awal: {stats.startWeight} kg
            </span>
          </div>

          <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Target Berat Badan
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-indigo-700 font-mono">
                {stats.targetWeight}
              </span>
              <span className="text-xs text-neutral-500 font-medium">kg</span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Sisa {stats.remainingToTarget} kg menuju goal
            </span>
          </div>

          <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Progres Capaian
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-emerald-700 font-mono">
                {stats.progressPercent}%
              </span>
              <span className="text-xs text-neutral-500">tercapai</span>
            </div>
            <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all"
                style={{ width: `${stats.progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-neutral-400 mt-1 block">
              Total turun: {stats.lostSoFar > 0 ? `-${stats.lostSoFar} kg` : `${stats.lostSoFar} kg`}
            </span>
          </div>

          <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Kategori BMI
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-neutral-900 font-mono">
                {stats.bmiInfo.bmi}
              </span>
            </div>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border inline-block mt-1 ${stats.bmiInfo.color}`}
            >
              {stats.bmiInfo.status}
            </span>
          </div>
        </div>
      </div>

      {/* Weight Trend Chart Visualizer */}
      {chartPoints && (
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-semibold text-neutral-900">
                Grafik Tren Berat Badan (Weigh-in History)
              </h3>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-neutral-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-indigo-600 inline-block rounded" />
                Tren Berat Aktual
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 border-b border-dashed border-emerald-600 inline-block" />
                Target Goal ({weightProfile.targetWeight} kg)
              </span>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartPoints.width} ${chartPoints.height}`}
              className="w-full max-h-48 overflow-visible select-none"
            >
              {/* Target Line */}
              <line
                x1={20}
                y1={chartPoints.targetY}
                x2={chartPoints.width - 20}
                y2={chartPoints.targetY}
                stroke="#059669"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity={0.6}
              />
              <text
                x={chartPoints.width - 20}
                y={chartPoints.targetY - 5}
                fontSize="9"
                fill="#059669"
                textAnchor="end"
                fontFamily="monospace"
              >
                Goal: {weightProfile.targetWeight} kg
              </text>

              {/* Weight Line */}
              <path
                d={chartPoints.pathString}
                fill="none"
                stroke="#4F46E5"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Points */}
              {chartPoints.points.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={3.5}
                    fill="#FFFFFF"
                    stroke="#4F46E5"
                    strokeWidth="2"
                    className="hover:r-5 transition-all"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 8}
                    fontSize="9"
                    fill="#374151"
                    textAnchor="middle"
                    fontFamily="monospace"
                    fontWeight="500"
                  >
                    {pt.weight}
                  </text>
                  <text
                    x={pt.x}
                    y={chartPoints.height - 8}
                    fontSize="8"
                    fill="#9CA3AF"
                    textAnchor="middle"
                  >
                    {pt.date.slice(5)}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      )}

      {/* Log History Database Table */}
      <div className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-neutral-600" />
            <h3 className="text-xs font-semibold text-neutral-900">
              Riwayat Timbangan Harian / Mingguan
            </h3>
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            {sortedLogsDesc.length} rekaman data
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-medium uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-3">Berat Badan</th>
                <th className="py-3 px-3">Perubahan</th>
                <th className="py-3 px-3">Body Fat %</th>
                <th className="py-3 px-3">Massa Otot (kg)</th>
                <th className="py-3 px-3">Lingkar Pinggang (cm)</th>
                <th className="py-3 px-3">Catatan / Pola Makan</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {sortedLogsDesc.map((log, idx) => {
                const prevLog = sortedLogsDesc[idx + 1];
                const diff = prevLog ? Number((log.weight - prevLog.weight).toFixed(1)) : 0;

                return (
                  <tr key={log.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3 px-4 font-medium text-neutral-900 whitespace-nowrap">
                      {log.date}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-neutral-900 whitespace-nowrap">
                      {log.weight} kg
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {prevLog ? (
                        <span
                          className={`inline-flex items-center gap-0.5 text-[10px] font-mono font-medium px-2 py-0.5 rounded ${
                            diff < 0
                              ? 'bg-emerald-50 text-emerald-700'
                              : diff > 0
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {diff < 0 ? (
                            <ArrowDown className="w-2.5 h-2.5" />
                          ) : diff > 0 ? (
                            <ArrowUp className="w-2.5 h-2.5" />
                          ) : null}
                          {diff > 0 ? `+${diff}` : diff} kg
                        </span>
                      ) : (
                        <span className="text-[10px] text-neutral-400">Baseline</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-neutral-700 whitespace-nowrap">
                      {log.bodyFat ? `${log.bodyFat}%` : '-'}
                    </td>
                    <td className="py-3 px-3 font-mono text-neutral-700 whitespace-nowrap">
                      {log.muscleMass ? `${log.muscleMass} kg` : '-'}
                    </td>
                    <td className="py-3 px-3 font-mono text-neutral-700 whitespace-nowrap">
                      {log.waistCircumference ? `${log.waistCircumference} cm` : '-'}
                    </td>
                    <td className="py-3 px-3 text-neutral-600 max-w-xs truncate">
                      {log.notes || '-'}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditLogModal(log)}
                          className="p-1 text-neutral-400 hover:text-neutral-700 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus catatan tanggal ${log.date}?`)) {
                              deleteWeightLog(log.id);
                            }
                          }}
                          className="p-1 text-neutral-400 hover:text-rose-600 rounded"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Weigh-in Log Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-neutral-900 font-serif">
                  {editingLog ? 'Edit Catatan Timbangan' : 'Catat Timbangan Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLog} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Tanggal *</label>
                  <input
                    type="date"
                    required
                    value={logFormData.date}
                    onChange={(e) => setLogFormData({ ...logFormData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                  />
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Berat Badan (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="20"
                    max="300"
                    required
                    value={logFormData.weight || ''}
                    onChange={(e) =>
                      setLogFormData({ ...logFormData, weight: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400 font-mono text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Body Fat (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="3"
                    max="60"
                    placeholder="e.g. 18.2"
                    value={logFormData.bodyFat || ''}
                    onChange={(e) =>
                      setLogFormData({
                        ...logFormData,
                        bodyFat: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400 font-mono"
                  />
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Massa Otot (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="10"
                    placeholder="e.g. 55.0"
                    value={logFormData.muscleMass || ''}
                    onChange={(e) =>
                      setLogFormData({
                        ...logFormData,
                        muscleMass: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400 font-mono"
                  />
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Lingkar Pinggang</label>
                  <input
                    type="number"
                    step="0.5"
                    min="30"
                    placeholder="e.g. 82.5"
                    value={logFormData.waistCircumference || ''}
                    onChange={(e) =>
                      setLogFormData({
                        ...logFormData,
                        waistCircumference: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">Catatan Harian / Evaluasi</label>
                <textarea
                  rows={2}
                  placeholder="Kondisi hidrasi, kualitas tidur, defisit kalori, jadwal latihan..."
                  value={logFormData.notes || ''}
                  onChange={(e) => setLogFormData({ ...logFormData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-3.5 py-2 text-neutral-600 hover:bg-neutral-100 rounded-xl font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-medium shadow-xs"
                >
                  {editingLog ? 'Simpan Perubahan' : 'Simpan Data Timbangan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile & Target Weight Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-neutral-900 font-serif">
                  Pengaturan Target & Profil Fisik
                </h3>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Berat Awal (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    required
                    value={profileFormData.startingWeight}
                    onChange={(e) =>
                      setProfileFormData({
                        ...profileFormData,
                        startingWeight: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-mono"
                  />
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Target Berat (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    required
                    value={profileFormData.targetWeight}
                    onChange={(e) =>
                      setProfileFormData({
                        ...profileFormData,
                        targetWeight: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-mono font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">Tinggi Badan (cm) *</label>
                <input
                  type="number"
                  min="100"
                  max="250"
                  required
                  value={profileFormData.heightCm}
                  onChange={(e) =>
                    setProfileFormData({
                      ...profileFormData,
                      heightCm: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-mono"
                />
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Digunakan untuk menghitung nilai Body Mass Index (BMI) secara akurat.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={profileFormData.startDate}
                    onChange={(e) =>
                      setProfileFormData({ ...profileFormData, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
                  />
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Target Tanggal Capaian</label>
                  <input
                    type="date"
                    value={profileFormData.targetDate}
                    onChange={(e) =>
                      setProfileFormData({ ...profileFormData, targetDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-3.5 py-2 text-neutral-600 hover:bg-neutral-100 rounded-xl font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-medium shadow-xs"
                >
                  Perbarui Target Fisik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
