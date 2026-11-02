import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { GoalItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const GoalsApp: React.FC = () => {
  const { goals, addGoal, toggleMilestone, deleteGoal, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('Semua');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GoalItem['category']>('Karier');
  const [targetDate, setTargetDate] = useState('');
  const [milestonesInput, setMilestonesInput] = useState('');
  const [notes, setNotes] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const ms = milestonesInput
      .split('\n')
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    addGoal(
      {
        title: title.trim(),
        category,
        targetDate: targetDate || new Date().toISOString().split('T')[0],
        status: 'Aktif',
        notes: notes.trim(),
      },
      ms.length > 0 ? ms : undefined
    );

    setTitle('');
    setTargetDate('');
    setMilestonesInput('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const activeGoals = goals.filter((g) => g.status === 'Aktif');
  const archivedGoals = goals.filter((g) => g.status === 'Selesai' || g.status === 'Ditunda');

  const filteredGoals = (activeSubMenu === 'archive' ? archivedGoals : activeGoals).filter((g) => {
    if (filterCategory === 'Semua') return true;
    return g.category === filterCategory;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-neutral-100 text-neutral-800">
              <Icon name="Target" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Target & Milestone
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Petakan sasaran hidup, urutkan checkpoint milestone, dan pantau progres capaian nyata.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs"
        >
          <Icon name="Plus" size={14} />
          <span>Tambah Target Sasaran</span>
        </button>
      </div>

      {/* Submenus */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex p-1 bg-neutral-100 rounded-lg text-xs font-medium">
          {[
            { id: 'active', label: 'Sasaran Aktif', count: activeGoals.length },
            { id: 'milestones', label: 'Daftar Milestone' },
            { id: 'archive', label: 'Arsip Target', count: archivedGoals.length },
          ].map((tab) => {
            const isActive = activeSubMenu === tab.id || (!activeSubMenu && tab.id === 'active');
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
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-neutral-200 rounded-lg bg-white"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Karier">Karier</option>
            <option value="Finansial">Finansial</option>
            <option value="Keluarga">Keluarga</option>
            <option value="Keahlian">Keahlian</option>
            <option value="Kesehatan">Kesehatan</option>
          </select>
        </div>
      </div>

      {goals.length === 0 ? (
        <EmptyState
          iconName="Target"
          title="Belum ada sasaran atau milestone"
          description="Rancang rencana masa depan Anda dengan menetapkan tujuan spesifik, tenggat waktu, dan tahapan checkpoint yang dapat diukur."
          actionLabel="Buat Sasaran Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <>
          {/* Active Goals View */}
          {(activeSubMenu === 'active' || !activeSubMenu) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGoals.map((goal) => {
                const totalMs = goal.milestones.length;
                const completedMs = goal.milestones.filter((m) => m.completed).length;
                const progressPct = totalMs > 0 ? Math.round((completedMs / totalMs) * 100) : 0;

                return (
                  <div
                    key={goal.id}
                    className="p-5 bg-white border border-neutral-200 rounded-xl flex flex-col justify-between hover:border-neutral-300 transition-colors"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="text-base font-semibold text-neutral-900 tracking-tight">
                            {goal.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                            <span>{goal.category}</span>
                            <span aria-hidden="true">·</span>
                            <span>Tenggat: {goal.targetDate}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded-md transition-colors"
                          title="Hapus sasaran"
                        >
                          <Icon name="Trash2" size={14} />
                        </button>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-4 mb-3">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-neutral-500 font-mono tabular-nums">
                            {completedMs} dari {totalMs} milestone tercapai
                          </span>
                          <span className="font-semibold text-neutral-900 font-mono tabular-nums">
                            {progressPct}%
                          </span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-neutral-900 h-full rounded-full transition-all duration-300"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Milestones list */}
                      {totalMs > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                          {goal.milestones.map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => toggleMilestone(goal.id, m.id)}
                              className="w-full flex items-center gap-2.5 text-left text-xs py-1 px-1.5 rounded hover:bg-neutral-50 transition-colors group cursor-pointer"
                            >
                              <span
                                className={`w-4 h-4 rounded flex items-center justify-center transition-colors shrink-0 ${
                                  m.completed
                                    ? 'bg-neutral-900 text-white'
                                    : 'border border-neutral-300 group-hover:border-neutral-500'
                                }`}
                              >
                                {m.completed && <Icon name="Check" size={10} className="stroke-[3]" />}
                              </span>
                              <span
                                className={`truncate ${
                                  m.completed ? 'line-through text-neutral-400' : 'text-neutral-700'
                                }`}
                              >
                                {m.title}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {goal.notes && (
                      <div className="mt-4 pt-3 border-t border-neutral-100 text-xs text-neutral-500 italic">
                        "{goal.notes}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Milestones Master Checklist */}
          {activeSubMenu === 'milestones' && (
            <div className="bg-white border border-neutral-200 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-neutral-900">Seluruh Checkpoint Milestone</h3>
              <div className="space-y-2">
                {goals.flatMap((g) =>
                  g.milestones.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 hover:bg-neutral-50/50"
                    >
                      <button
                        onClick={() => toggleMilestone(g.id, m.id)}
                        className="flex items-center gap-3 text-left cursor-pointer"
                      >
                        <span
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                            m.completed ? 'bg-neutral-900 text-white' : 'border border-neutral-300'
                          }`}
                        >
                          {m.completed && <Icon name="Check" size={10} />}
                        </span>
                        <div>
                          <div className={`text-xs font-medium ${m.completed ? 'line-through text-neutral-400' : 'text-neutral-800'}`}>
                            {m.title}
                          </div>
                          <div className="text-[11px] text-neutral-400">Target: {g.title}</div>
                        </div>
                      </button>
                      <span className="text-[11px] font-mono text-neutral-400">{g.targetDate}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Archive View */}
          {activeSubMenu === 'archive' && (
            <div className="space-y-3">
              {archivedGoals.length === 0 ? (
                <div className="p-8 text-center bg-white border border-neutral-200 rounded-xl text-xs text-neutral-400">
                  Belum ada sasaran yang diarsipkan atau diselesaikan.
                </div>
              ) : (
                archivedGoals.map((goal) => (
                  <div key={goal.id} className="p-4 bg-white border border-neutral-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-neutral-900">{goal.title}</div>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        Status: {goal.status} · Kategori: {goal.category}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 rounded-md transition-colors"
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* Add Goal Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Buat Sasaran Baru"
        subtitle="Petakan target dan tahapan milestone yang konkret."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Nama Sasaran *</label>
            <input
              type="text"
              required
              placeholder="Misal: Tabungan Investasi 100 Juta, Lulus Sertifikasi Cloud"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Kategori Sasaran</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg bg-white"
              >
                <option value="Karier">Karier</option>
                <option value="Finansial">Finansial</option>
                <option value="Keluarga">Keluarga</option>
                <option value="Keahlian">Keahlian</option>
                <option value="Kesehatan">Kesehatan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Tenggat Waktu</label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Tahapan Milestone (Satu per baris)
            </label>
            <textarea
              rows={4}
              placeholder="Tahap 1: Riset dan perencanaan&#10;Tahap 2: Eksekusi alur utama&#10;Tahap 3: Review dan evaluasi"
              value={milestonesInput}
              onChange={(e) => setMilestonesInput(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Catatan Tambahan</label>
            <input
              type="text"
              placeholder="Catatan motivasi atau rujukan"
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
              Simpan Sasaran
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
