import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { HabitItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const HabitsApp: React.FC = () => {
  const { habits, toggleHabitToday, deleteHabit, addHabit, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HabitItem['category']>('Kesehatan');
  const [frequency, setFrequency] = useState<HabitItem['frequency']>('Harian');
  const [timeOfDay, setTimeOfDay] = useState<HabitItem['timeOfDay']>('Pagi');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addHabit({
      title: title.trim(),
      category,
      frequency,
      targetDaysPerWeek: frequency === 'Harian' ? 7 : frequency === 'Hari Kerja' ? 5 : 2,
      timeOfDay,
    });
    setTitle('');
    setIsAddModalOpen(false);
  };

  const filteredHabits = habits.filter((h) => {
    const matchCat = filterCategory === 'Semua' || h.category === filterCategory;
    const matchSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const completedTodayCount = habits.filter((h) => h.completedDates.includes(todayStr)).length;
  const completionRateToday = habits.length > 0 ? Math.round((completedTodayCount / habits.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* App Header & Submenu Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-neutral-100 text-neutral-800">
              <Icon name="CheckSquare" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Habit & Rutinitas
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Bangun ritme hidup teratur, konsistensi jangka panjang, dan pantau progres harian.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs"
          >
            <Icon name="Plus" size={14} />
            <span>Tambah Kebiasaan</span>
          </button>
        </div>
      </div>

      {/* Submenu Segmented Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex p-1 bg-neutral-100 rounded-lg text-xs font-medium">
          {[
            { id: 'today', label: 'Agenda Hari Ini', count: habits.length },
            { id: 'all-habits', label: 'Katalog Kebiasaan', count: habits.length },
            { id: 'streak-recovery', label: 'Streak Freeze & Heatmap' },
            { id: 'analytics', label: 'Konsistensi & Performa' },
          ].map((tab) => {
            const isActive = activeSubMenu === tab.id || (!activeSubMenu && tab.id === 'today');
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

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Icon name="Search" size={13} className="absolute left-2.5 top-2.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Cari kebiasaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 w-44"
            />
          </div>
        </div>
      </div>

      {/* Content depending on activeSubMenu */}
      {habits.length === 0 ? (
        <EmptyState
          iconName="CheckSquare"
          title="Belum ada kebiasaan yang dibuat"
          description="Mulailah membangun ritme harian Anda dengan mendaftarkan kebiasaan pertama Anda, seperti minum air, olahraga ringan, atau membaca buku."
          actionLabel="Tambah Kebiasaan Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <>
          {/* View: Today's Checklist */}
          {(activeSubMenu === 'today' || !activeSubMenu) && (
            <div className="space-y-4">
              {/* Daily Progress summary banner */}
              <div className="p-4 bg-white border border-neutral-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-neutral-500">Pencapaian Hari Ini</div>
                  <div className="text-sm font-semibold text-neutral-900 mt-0.5 font-mono tabular-nums">
                    {completedTodayCount} dari {habits.length} kebiasaan selesai
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-neutral-900 font-mono tabular-nums">
                    {completionRateToday}%
                  </div>
                  <div className="text-[11px] text-neutral-400">Tingkat Konsistensi</div>
                </div>
              </div>

              {/* Habits List */}
              <div className="space-y-2">
                {filteredHabits.map((habit) => {
                  const isDoneToday = habit.completedDates.includes(todayStr);
                  const streakDays = habit.completedDates.length;

                  return (
                    <div
                      key={habit.id}
                      className={`p-3.5 bg-white border rounded-xl flex items-center justify-between transition-colors ${
                        isDoneToday ? 'border-neutral-200 bg-neutral-50/40' : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <button
                          type="button"
                          onClick={() => toggleHabitToday(habit.id)}
                          className={`w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                            isDoneToday
                              ? 'bg-neutral-900 text-white'
                              : 'border border-neutral-300 hover:border-neutral-500 bg-white'
                          }`}
                          aria-label={isDoneToday ? 'Tandai belum selesai' : 'Tandai selesai'}
                        >
                          {isDoneToday && <Icon name="Check" size={13} className="stroke-[2.5]" />}
                        </button>

                        <div className="min-w-0">
                          <h4
                            className={`text-sm font-medium truncate ${
                              isDoneToday ? 'line-through text-neutral-400' : 'text-neutral-900'
                            }`}
                          >
                            {habit.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                            <span>{habit.category}</span>
                            <span aria-hidden="true">·</span>
                            <span>{habit.timeOfDay}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">{streakDays} hari selesai</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => deleteHabit(habit.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded-md hover:bg-neutral-100 transition-colors"
                          title="Hapus kebiasaan"
                        >
                          <Icon name="Trash2" size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* View: All Habits Catalog */}
          {activeSubMenu === 'all-habits' && (
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-700">Daftar Definisi Kebiasaan</span>
                <span className="text-xs font-mono text-neutral-400 tabular-nums">{habits.length} total</span>
              </div>
              <div className="divide-y divide-neutral-100">
                {filteredHabits.map((habit) => (
                  <div key={habit.id} className="p-4 flex items-center justify-between hover:bg-neutral-50/50">
                    <div>
                      <div className="text-sm font-medium text-neutral-900">{habit.title}</div>
                      <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                        <span>{habit.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>Frekuensi: {habit.frequency}</span>
                        <span aria-hidden="true">·</span>
                        <span>Waktu: {habit.timeOfDay}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-neutral-500 tabular-nums">
                        {habit.completedDates.length} entri riwayat
                      </span>
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded-md transition-colors"
                      >
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View: Analytics & Consistency */}
          {activeSubMenu === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-neutral-200 rounded-xl">
                  <div className="text-xs text-neutral-500">Total Kebiasaan Aktif</div>
                  <div className="text-2xl font-bold text-neutral-900 mt-1 font-mono tabular-nums">
                    {habits.length}
                  </div>
                </div>
                <div className="p-4 bg-white border border-neutral-200 rounded-xl">
                  <div className="text-xs text-neutral-500">Tingkat Capaian Hari Ini</div>
                  <div className="text-2xl font-bold text-neutral-900 mt-1 font-mono tabular-nums">
                    {completionRateToday}%
                  </div>
                </div>
                <div className="p-4 bg-white border border-neutral-200 rounded-xl">
                  <div className="text-xs text-neutral-500">Total Entri Penyelesaian Real</div>
                  <div className="text-2xl font-bold text-neutral-900 mt-1 font-mono tabular-nums">
                    {habits.reduce((sum, h) => sum + h.completedDates.length, 0)}
                  </div>
                </div>
              </div>

              {/* Log table */}
              <div className="bg-white border border-neutral-200 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-neutral-800 mb-3">Tingkat Konsistensi per Kebiasaan</h4>
                <div className="space-y-3">
                  {habits.map((h) => {
                    const days = h.completedDates.length;
                    return (
                      <div key={h.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-neutral-800">{h.title}</span>
                          <span className="font-mono text-neutral-500 tabular-nums">{days} hari tercatat</span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-neutral-900 h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.max(8, days * 10))}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Habit Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Kebiasaan Baru"
        subtitle="Tetapkan nama kebiasaan, frekuensi, dan alokasi waktu pelaksanaan."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Nama Kebiasaan *
            </label>
            <input
              type="text"
              required
              placeholder="Misal: Membaca 15 Halaman, Jalan Kaki 5000 Langkah"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg bg-white"
              >
                <option value="Kesehatan">Kesehatan</option>
                <option value="Produktivitas">Produktivitas</option>
                <option value="Pikiran">Pikiran</option>
                <option value="Kebugaran">Kebugaran</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Frekuensi Target</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg bg-white"
              >
                <option value="Harian">Harian (7 hari)</option>
                <option value="Hari Kerja">Hari Kerja (5 hari)</option>
                <option value="Akhir Pekan">Akhir Pekan (2 hari)</option>
                <option value="Mingguan">Mingguan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Waktu Pelaksanaan</label>
            <select
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value as any)}
              className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg bg-white"
            >
              <option value="Pagi">Pagi Hari</option>
              <option value="Siang">Siang Hari</option>
              <option value="Sore">Sore Hari</option>
              <option value="Malam">Malam Hari</option>
              <option value="Fleksibel">Kapan Saja (Fleksibel)</option>
            </select>
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
              Simpan Kebiasaan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
