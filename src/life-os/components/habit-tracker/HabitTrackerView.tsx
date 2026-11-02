import React, { useState, useMemo } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { HabitItem } from '../../types';
import {
  Flame,
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  Sparkles,
  Trophy,
  Activity,
  Edit2,
  Trash2,
  X,
  Dumbbell,
  BookOpen,
  Book,
  Droplet,
  Zap,
  Moon,
  Sun,
  Clock,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Dumbbell,
  BookOpen,
  Book,
  Droplet,
  Zap,
  Moon,
  Sun,
  Flame,
  Activity,
};

const CATEGORY_COLORS: Record<string, string> = {
  Fitness: 'bg-rose-50 text-rose-700 border-rose-200',
  Mindfulness: 'bg-purple-50 text-purple-700 border-purple-200',
  Learning: 'bg-blue-50 text-blue-700 border-blue-200',
  Health: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Productivity: 'bg-amber-50 text-amber-700 border-amber-200',
};

const TIME_OF_DAY_BADGES: Record<string, string> = {
  'Pagi': 'bg-amber-50 text-amber-800 border-amber-200',
  'Siang': 'bg-sky-50 text-sky-800 border-sky-200',
  'Sore': 'bg-orange-50 text-orange-800 border-orange-200',
  'Malam': 'bg-indigo-50 text-indigo-800 border-indigo-200',
  'Sepanjang Hari': 'bg-neutral-100 text-neutral-700 border-neutral-200',
};

// Generates 7 dates for the active week window
function getWeekDates(offsetWeeks: number = 0): { dayName: string; dateStr: string; dayNum: number; isToday: boolean }[] {
  const now = new Date();
  // Adjust by offsetWeeks
  now.setDate(now.getDate() + offsetWeeks * 7);

  const dayOfWeek = now.getDay(); // 0 is Sunday
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);

  const days: { dayName: string; dateStr: string; dayNum: number; isToday: boolean }[] = [];
  const dayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const todayStr = new Date().toISOString().split('T')[0];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    days.push({
      dayName: dayNames[i],
      dateStr,
      dayNum: d.getDate(),
      isToday: dateStr === todayStr,
    });
  }

  return days;
}

export const HabitTrackerView: React.FC = () => {
  const { habits, addHabit, deleteHabit, toggleHabitToday, toggleHabitDay, updateHabit } = useLifeOS();

  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    timeOfDay: 'Pagi' | 'Siang' | 'Sore' | 'Malam' | 'Sepanjang Hari';
    targetDays: number;
    icon: string;
    notes: string;
  }>({
    name: '',
    category: 'Health',
    timeOfDay: 'Pagi',
    targetDays: 7,
    icon: 'Activity',
    notes: '',
  });

  const weekDays = useMemo(() => getWeekDates(weekOffset), [weekOffset]);
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const openAddModal = () => {
    setEditingHabit(null);
    setFormData({
      name: '',
      category: 'Health',
      timeOfDay: 'Pagi',
      targetDays: 7,
      icon: 'Activity',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (h: HabitItem) => {
    setEditingHabit(h);
    setFormData({
      name: h.name,
      category: h.category || 'Health',
      timeOfDay: h.timeOfDay || 'Pagi',
      targetDays: h.targetDays || 7,
      icon: h.icon || 'Activity',
      notes: h.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingHabit) {
      updateHabit(editingHabit.id, formData);
    } else {
      addHabit(formData.name);
      // Wait next cycle or update after creation
    }
    setIsModalOpen(false);
  };

  // Stats
  const stats = useMemo(() => {
    const totalCount = habits.length;
    const completedTodayCount = habits.filter((h) => !!h.history[todayStr] || h.completedToday).length;
    const todayScore = totalCount > 0 ? Math.round((completedTodayCount / totalCount) * 100) : 0;

    const highestStreak = habits.reduce(
      (max, h) => Math.max(max, h.streak, h.longestStreak || 0),
      0
    );

    // Calculate total weekly completions for current active week
    let weeklyChecks = 0;
    const possibleChecks = totalCount * 7;
    habits.forEach((h) => {
      weekDays.forEach((d) => {
        if (h.history[d.dateStr]) weeklyChecks++;
      });
    });
    const weeklyRate = possibleChecks > 0 ? Math.round((weeklyChecks / possibleChecks) * 100) : 0;

    return {
      totalCount,
      completedTodayCount,
      todayScore,
      highestStreak,
      weeklyRate,
    };
  }, [habits, todayStr, weekDays]);

  const filteredHabits = useMemo(() => {
    if (selectedCategory === 'all') return habits;
    return habits.filter((h) => h.category === selectedCategory);
  }, [habits, selectedCategory]);

  const categories = ['Fitness', 'Mindfulness', 'Learning', 'Health', 'Productivity'];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Banner */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 shadow-xs">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-neutral-900 tracking-tight font-serif">
                  Habit Tracker by LifeCanvas
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-medium border border-neutral-200/60">
                  {habits.length} kebiasaan aktif
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Membangun konsistensi harian dengan matriks mingguan interaktif, pencatat streak, & skor kepatuhan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Habit Baru</span>
            </button>
          </div>
        </div>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-neutral-100">
          <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Selesai Hari Ini
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-neutral-900 font-mono">
                {stats.completedTodayCount}
              </span>
              <span className="text-xs text-neutral-500">/ {stats.totalCount} habit</span>
            </div>
            <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-neutral-900 h-full rounded-full transition-all"
                style={{ width: `${stats.todayScore}%` }}
              />
            </div>
            <span className="text-[10px] text-neutral-400 mt-1 block">
              {stats.todayScore}% target harian tercapai
            </span>
          </div>

          <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Streak Tertinggi
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-amber-600 font-mono">
                {stats.highestStreak}
              </span>
              <span className="text-xs text-neutral-500">hari berturut-turut</span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-500" />
              Konsistensi luar biasa 🔥
            </span>
          </div>

          <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Konsistensi Minggu Ini
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-emerald-700 font-mono">
                {stats.weeklyRate}%
              </span>
              <span className="text-xs text-neutral-500">completion</span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Berdasarkan 7 hari terakhir
            </span>
          </div>

          <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Kategori Aktif
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-indigo-700 font-mono">
                {categories.length}
              </span>
              <span className="text-xs text-neutral-500">pilar kehidupan</span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Kebugaran, Belajar, & Disiplin
            </span>
          </div>
        </div>
      </div>

      {/* Week Navigator & Category Selector */}
      <div className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
            }`}
          >
            Semua Kategori ({habits.length})
          </button>
          {categories.map((cat) => {
            const count = habits.filter((h) => h.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
                }`}
              >
                <span>{cat}</span>
                <span className="text-[10px] ml-1 opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Week navigation */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600"
            title="Minggu Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-medium text-neutral-800 font-mono px-2">
            {weekOffset === 0
              ? 'Minggu Ini'
              : weekOffset === -1
              ? '1 Minggu Lalu'
              : `${Math.abs(weekOffset)} Minggu ${weekOffset < 0 ? 'Lalu' : 'Depan'}`}
          </span>

          <button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600"
            title="Minggu Berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {weekOffset !== 0 && (
            <button
              onClick={() => setWeekOffset(0)}
              className="px-2.5 py-1 text-[11px] bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700 font-medium ml-1"
            >
              Kembali ke Hari Ini
            </button>
          )}
        </div>
      </div>

      {/* Interactive Habit Weekly Matrix Table */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-medium uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 min-w-[220px]">Kebiasaan & Kategori</th>
                <th className="py-3.5 px-3 whitespace-nowrap">Streak</th>
                {weekDays.map((d) => (
                  <th
                    key={d.dateStr}
                    className={`py-3.5 px-2 text-center min-w-[50px] ${
                      d.isToday ? 'bg-amber-50/80 text-amber-900 font-bold' : ''
                    }`}
                  >
                    <div>{d.dayName}</div>
                    <div className="text-[11px] font-mono mt-0.5">{d.dayNum}</div>
                  </th>
                ))}
                <th className="py-3.5 px-3 text-center whitespace-nowrap">Target</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredHabits.map((habit) => {
                const IconComponent = ICON_MAP[habit.icon || 'Activity'] || Activity;
                const catColor = CATEGORY_COLORS[habit.category || 'Health'] || 'bg-neutral-100 text-neutral-700 border-neutral-200';
                const timeBadge = TIME_OF_DAY_BADGES[habit.timeOfDay || 'Pagi'] || 'bg-neutral-100 text-neutral-700 border-neutral-200';

                // Count completed days in current week view
                const weekCompletedCount = weekDays.filter((d) => !!habit.history[d.dateStr]).length;

                return (
                  <tr key={habit.id} className="hover:bg-neutral-50/50 transition-colors">
                    {/* Habit Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-neutral-900 text-xs leading-snug">
                            {habit.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {habit.category && (
                              <span
                                className={`text-[9px] font-medium px-1.5 py-0.2 rounded border ${catColor}`}
                              >
                                {habit.category}
                              </span>
                            )}
                            {habit.timeOfDay && (
                              <span
                                className={`text-[9px] font-medium px-1.5 py-0.2 rounded border ${timeBadge}`}
                              >
                                {habit.timeOfDay}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Streak Count */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-mono text-amber-700 font-semibold text-xs">
                        <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{habit.streak} hari</span>
                      </div>
                      {habit.longestStreak && (
                        <div className="text-[10px] text-neutral-400 font-mono">
                          Rekor: {habit.longestStreak}
                        </div>
                      )}
                    </td>

                    {/* 7 Days of the Week Interactive Checkboxes */}
                    {weekDays.map((d) => {
                      const isChecked = !!habit.history[d.dateStr];

                      return (
                        <td
                          key={d.dateStr}
                          className={`py-3.5 px-2 text-center ${
                            d.isToday ? 'bg-amber-50/40' : ''
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleHabitDay(habit.id, d.dateStr)}
                            className="cursor-pointer transition-transform active:scale-90 inline-flex items-center justify-center"
                            title={`${habit.name} - ${d.dayName}, ${d.dateStr}`}
                          >
                            {isChecked ? (
                              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-2xs hover:bg-emerald-700 transition-colors">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                            ) : (
                              <div
                                className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                                  d.isToday
                                    ? 'border-amber-300 bg-white hover:border-amber-400'
                                    : 'border-neutral-200 hover:border-neutral-400 bg-neutral-50/50'
                                }`}
                              >
                                <Circle className="w-3.5 h-3.5 text-transparent hover:text-neutral-300" />
                              </div>
                            )}
                          </button>
                        </td>
                      );
                    })}

                    {/* Target Rate */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap font-mono text-xs">
                      <span
                        className={`font-semibold ${
                          weekCompletedCount >= (habit.targetDays || 5)
                            ? 'text-emerald-700'
                            : 'text-neutral-800'
                        }`}
                      >
                        {weekCompletedCount}
                      </span>
                      <span className="text-neutral-400 text-[11px]">
                        {' / '}
                        {habit.targetDays || 7}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(habit)}
                          className="p-1 text-neutral-400 hover:text-neutral-700 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus habit "${habit.name}"?`)) {
                              deleteHabit(habit.id);
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

      {/* Today's Focus Checklist Cards */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-semibold text-neutral-900">
              Checklist Hari Ini ({stats.completedTodayCount}/{stats.totalCount} Selesai)
            </h3>
          </div>
          <span className="text-xs text-neutral-500 font-mono">
            {todayStr}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {habits.map((habit) => {
            const isDone = !!habit.history[todayStr] || habit.completedToday;
            const IconComponent = ICON_MAP[habit.icon || 'Activity'] || Activity;

            return (
              <div
                key={habit.id}
                onClick={() => toggleHabitDay(habit.id, todayStr)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isDone
                    ? 'bg-emerald-50/60 border-emerald-200/80 shadow-2xs'
                    : 'bg-neutral-50/60 border-neutral-200/80 hover:bg-neutral-100/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isDone ? 'bg-emerald-600 text-white' : 'bg-white text-neutral-600 border'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span
                      className={`text-xs font-semibold block truncate ${
                        isDone ? 'line-through text-neutral-500' : 'text-neutral-900'
                      }`}
                    >
                      {habit.name}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      🔥 {habit.streak} hari
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="w-5 h-5 text-neutral-300" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Habit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-neutral-900 font-serif">
                  {editingHabit ? 'Edit Habit' : 'Tambah Habit Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-medium text-neutral-700 block mb-1">Nama Kebiasaan / Habit *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meditasi 10 menit, Push up 30x, Membaca 15 hal..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Waktu Pelaksanaan</label>
                  <select
                    value={formData.timeOfDay}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        timeOfDay: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                  >
                    <option value="Pagi">Pagi</option>
                    <option value="Siang">Siang</option>
                    <option value="Sore">Sore</option>
                    <option value="Malam">Malam</option>
                    <option value="Sepanjang Hari">Sepanjang Hari</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Target Hari / Minggu</label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={formData.targetDays}
                    onChange={(e) =>
                      setFormData({ ...formData, targetDays: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-mono"
                  />
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Icon Simbol</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
                  >
                    <option value="Activity">Aktivitas Umum</option>
                    <option value="Dumbbell">Olahraga (Dumbbell)</option>
                    <option value="BookOpen">Jurnal / Membaca</option>
                    <option value="Droplet">Air / Hidrasi</option>
                    <option value="Zap">Fokus / Produktivitas</option>
                    <option value="Moon">Tidur / Malam</option>
                    <option value="Sun">Pagi Hari</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">Catatan Pendorong / Tips</label>
                <textarea
                  rows={2}
                  placeholder="Kaitkan dengan kebiasaan yang sudah ada (habit stacking)..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-neutral-600 hover:bg-neutral-100 rounded-xl font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-medium shadow-xs"
                >
                  {editingHabit ? 'Simpan Perubahan' : 'Mulai Kebiasaan Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
