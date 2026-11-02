import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { TaskItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const TasksApp: React.FC = () => {
  const { tasks, addTask, toggleTaskStatus, deleteTask, activeSubMenu, setActiveSubMenu } = usePEH();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [priorityQuadrant, setPriorityQuadrant] = useState<TaskItem['priorityQuadrant']>('Q1: Penting & Mendesak');
  const [status, setStatus] = useState<TaskItem['status']>('Todo');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [estimatedHours, setEstimatedHours] = useState<number>(2);
  const [tagInput, setTagInput] = useState('');

  const currentTab = activeSubMenu === 'default' ? 'eisenhower' : activeSubMenu;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    addTask({
      title: title.trim(),
      priorityQuadrant,
      status,
      dueDate,
      estimatedHours: Number(estimatedHours) || 1,
      tags: tagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });

    setTitle('');
    setPriorityQuadrant('Q1: Penting & Mendesak');
    setStatus('Todo');
    setDueDate(new Date().toISOString().split('T')[0]);
    setEstimatedHours(2);
    setTagInput('');
    setIsAddModalOpen(false);
  };

  const completedTasks = tasks.filter((t) => t.status === 'Selesai');
  const activeTasks = tasks.filter((t) => t.status !== 'Selesai');
  const totalEstimatedHours = activeTasks.reduce((acc, curr) => acc + (curr.estimatedHours || 0), 0);

  const quadrants: TaskItem['priorityQuadrant'][] = [
    'Q1: Penting & Mendesak',
    'Q2: Penting & Tidak Mendesak',
    'Q3: Mendesak & Tidak Penting',
    'Q4: Tidak Penting & Tidak Mendesak',
  ];

  return (
    <div className="space-y-6">
      {/* Submenu navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubMenu('eisenhower')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'eisenhower'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Grid" className="h-4 w-4" />
            Matriks Eisenhower
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              currentTab === 'eisenhower' ? 'bg-amber-900 text-amber-100' : 'bg-stone-200 text-stone-700'
            }`}>
              {activeTasks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubMenu('todo-list')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'todo-list'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="ListTodo" className="h-4 w-4" />
            Daftar Tugas Harian
          </button>

          <button
            onClick={() => setActiveSubMenu('completed')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'completed'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Check" className="h-4 w-4" />
            Riwayat Selesai
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              currentTab === 'completed' ? 'bg-amber-900 text-amber-100' : 'bg-stone-200 text-stone-700'
            }`}>
              {completedTasks.length}
            </span>
          </button>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-950 text-white text-sm font-medium rounded-lg hover:bg-amber-900 transition-colors shadow-xs"
        >
          <Icon name="Plus" className="h-4 w-4" />
          Tambah Tugas Baru
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Tugas Menunggu Dikerjakan</p>
          <p className="text-2xl font-semibold text-stone-900 mt-1 tabular-nums">{activeTasks.length}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Beban Estimasi Deep Work</p>
          <p className="text-2xl font-semibold text-amber-900 mt-1 tabular-nums">
            {totalEstimatedHours} <span className="text-sm font-normal text-stone-500">Jam Fokus</span>
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Tugas Selesai (Completed)</p>
          <p className="text-2xl font-semibold text-emerald-800 mt-1 tabular-nums">{completedTasks.length}</p>
        </div>
      </div>

      {/* View switching: Eisenhower Matrix vs List */}
      {tasks.length === 0 ? (
        <EmptyState
          title="Belum Ada Tugas atau Sesi Deep Work"
          description="Kelola beban kerja harian menggunakan Matriks Eisenhower: pisahkan antara yang penting vs sekadar mendesak agar fokus pada hasil bernilai tinggi."
          actionLabel="Buat Tugas Pertama"
          onAction={() => setIsAddModalOpen(true)}
          iconName="CheckSquare"
        />
      ) : currentTab === 'eisenhower' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quadrants.map((quad) => {
            const quadTasks = activeTasks.filter((t) => t.priorityQuadrant === quad);
            const isQ1 = quad.startsWith('Q1');
            const isQ2 = quad.startsWith('Q2');
            const isQ3 = quad.startsWith('Q3');

            return (
              <div
                key={quad}
                className={`bg-white rounded-xl border p-4 flex flex-col justify-between ${
                  isQ1
                    ? 'border-rose-200 bg-rose-50/20'
                    : isQ2
                    ? 'border-amber-200 bg-amber-50/20'
                    : isQ3
                    ? 'border-blue-200 bg-blue-50/20'
                    : 'border-stone-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200/60 mb-3">
                    <span className="text-xs font-bold text-stone-900 tracking-wide">{quad}</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white border border-stone-200 text-stone-600">
                      {quadTasks.length} tugas
                    </span>
                  </div>

                  {quadTasks.length === 0 ? (
                    <p className="text-xs text-stone-400 py-6 text-center italic">Tidak ada tugas pada kuadran ini</p>
                  ) : (
                    <div className="space-y-2">
                      {quadTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 bg-white rounded-lg border border-stone-200/80 shadow-2xs hover:border-stone-300 flex items-start justify-between gap-2"
                        >
                          <div className="flex items-start gap-2.5">
                            <input
                              type="checkbox"
                              checked={task.status === 'Selesai'}
                              onChange={() => toggleTaskStatus(task.id)}
                              className="mt-0.5 h-4 w-4 rounded-md border-stone-300 text-amber-950 focus:ring-amber-950 cursor-pointer"
                            />
                            <div>
                              <p className="text-xs font-semibold text-stone-900">{task.title}</p>
                              <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                                <span>{task.estimatedHours} jam</span>
                                <span>·</span>
                                <span>Jatuh tempo: {task.dueDate}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-stone-300 hover:text-red-600 p-0.5"
                          >
                            <Icon name="Trash2" className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-stone-100 text-[10px] text-stone-400">
                  {isQ1 && 'Lakukan Sekarang (Do First)'}
                  {isQ2 && 'Jadwalkan Waktu Khusus (Schedule / Deep Work)'}
                  {isQ3 && 'Delegasikan / Batasi (Delegate)'}
                  {!isQ1 && !isQ2 && !isQ3 && 'Eliminasi / Hindari (Eliminate)'}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Regular List View */
        <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
          {(currentTab === 'completed' ? completedTasks : activeTasks).map((task) => (
            <div
              key={task.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <input
                  type="checkbox"
                  checked={task.status === 'Selesai'}
                  onChange={() => toggleTaskStatus(task.id)}
                  className="h-4 w-4 rounded-md border-stone-300 text-amber-950 focus:ring-amber-950 cursor-pointer"
                />
                <div className="min-w-0">
                  <h4 className={`text-sm font-semibold truncate ${
                    task.status === 'Selesai' ? 'line-through text-stone-400' : 'text-stone-900'
                  }`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                    <span className="font-medium text-amber-950">{task.priorityQuadrant}</span>
                    <span>·</span>
                    <span>Estimasi {task.estimatedHours} Jam</span>
                    <span>·</span>
                    <span>Tenggat: {task.dueDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className={`px-2 py-0.5 text-xs rounded-md font-medium ${
                  task.status === 'Selesai'
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'bg-amber-50 text-amber-900'
                }`}>
                  {task.status}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-stone-400 hover:text-red-600 transition-colors p-1"
                >
                  <Icon name="Trash2" className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Tugas & Sesi Deep Work"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Nama Tugas / Tindakan *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Selesaikan draf proposal teknis, Refactor modul autentikasi"
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Kuadran Prioritas (Eisenhower Matrix) *
            </label>
            <select
              value={priorityQuadrant}
              onChange={(e) => setPriorityQuadrant(e.target.value as TaskItem['priorityQuadrant'])}
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950 bg-white"
            >
              <option value="Q1: Penting & Mendesak">Q1: Penting & Mendesak (Krisis / Masalah Mendesak)</option>
              <option value="Q2: Penting & Tidak Mendesak">Q2: Penting & Tidak Mendesak (Perencanaan & Deep Work Utama)</option>
              <option value="Q3: Mendesak & Tidak Penting">Q3: Mendesak & Tidak Penting (Interupsi / Delegasi)</option>
              <option value="Q4: Tidak Penting & Tidak Mendesak">Q4: Tidak Penting & Tidak Mendesak (Distraksi)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Jatuh Tempo *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Estimasi Waktu Fokus (Jam) *
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                required
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Tag / Label (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Contoh: sprint-14, backend, klien-utama"
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium bg-amber-950 text-white rounded-lg hover:bg-amber-900 transition-colors"
            >
              Simpan Tugas
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
