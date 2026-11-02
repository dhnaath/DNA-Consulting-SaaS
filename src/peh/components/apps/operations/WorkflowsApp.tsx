import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { WorkflowItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const WorkflowsApp: React.FC = () => {
  const { workflows, addWorkflow, advanceWorkflowStage, deleteWorkflow, activeSubMenu, setActiveSubMenu } = usePEH();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [workflowName, setWorkflowName] = useState('');
  const [department, setDepartment] = useState('Operasional & Bisnis');
  const [stagesInput, setStagesInput] = useState('Draf Pengajuan, Review Legal, Persetujuan Finansial, Eksekusi');
  const [leadAssignee, setLeadAssignee] = useState('');
  const [cycleTimeDays, setCycleTimeDays] = useState<number>(7);
  const [notes, setNotes] = useState('');

  const currentTab = activeSubMenu === 'default' ? 'pipelines' : activeSubMenu;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workflowName.trim() || !leadAssignee.trim() || !stagesInput.trim()) return;

    const stages = stagesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (stages.length === 0) return;

    addWorkflow({
      workflowName: workflowName.trim(),
      department: department.trim(),
      stages,
      currentStageIndex: 0,
      leadAssignee: leadAssignee.trim(),
      cycleTimeDays: Number(cycleTimeDays) || 7,
      status: 'Aktif Berjalan',
      notes: notes.trim() || undefined,
    });

    setWorkflowName('');
    setDepartment('Operasional & Bisnis');
    setStagesInput('Draf Pengajuan, Review Legal, Persetujuan Finansial, Eksekusi');
    setLeadAssignee('');
    setCycleTimeDays(7);
    setNotes('');
    setIsAddModalOpen(false);
  };

  const filteredWorkflows = workflows.filter((w) => {
    if (currentTab === 'active-runs') return w.status === 'Aktif Berjalan';
    if (currentTab === 'templates') return true;
    return true; // 'pipelines'
  });

  const activeCount = workflows.filter(w => w.status === 'Aktif Berjalan').length;
  const completedCount = workflows.filter(w => w.status === 'Selesai').length;

  return (
    <div className="space-y-6">
      {/* Submenu navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubMenu('pipelines')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'pipelines'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="GitCommit" className="h-4 w-4" />
            Pipeline & Alur Kerja
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              currentTab === 'pipelines' ? 'bg-amber-900 text-amber-100' : 'bg-stone-200 text-stone-700'
            }`}>
              {workflows.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubMenu('active-runs')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'active-runs'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Activity" className="h-4 w-4" />
            Proses Berjalan (In-Flight)
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              currentTab === 'active-runs' ? 'bg-amber-900 text-amber-100' : 'bg-stone-200 text-stone-700'
            }`}>
              {activeCount}
            </span>
          </button>

          <button
            onClick={() => setActiveSubMenu('templates')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'templates'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Sliders" className="h-4 w-4" />
            Semua Tahapan Standar
          </button>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-950 text-white text-sm font-medium rounded-lg hover:bg-amber-900 transition-colors shadow-xs"
        >
          <Icon name="Plus" className="h-4 w-4" />
          Rancang Alur Baru
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Pipeline Terpasang</p>
          <p className="text-2xl font-semibold text-stone-900 mt-1 tabular-nums">{workflows.length}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Alur Sedang Berjalan</p>
          <p className="text-2xl font-semibold text-amber-900 mt-1 tabular-nums">{activeCount}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Alur Tuntas Selesai</p>
          <p className="text-2xl font-semibold text-emerald-800 mt-1 tabular-nums">{completedCount}</p>
        </div>
      </div>

      {/* Main List or Empty State */}
      {filteredWorkflows.length === 0 ? (
        <EmptyState
          title={
            currentTab === 'active-runs'
              ? 'Tidak Ada Alur Kerja yang Sedang Berjalan'
              : 'Belum Ada Pipeline Alur Kerja Operasional'
          }
          description="Bangun rantai proses berulang bertahap (multi-step pipeline), pantau perpindahan fase (stage transition), penanggung jawab, dan estimasi waktu siklus."
          actionLabel="Rancang Alur Kerja Pertama"
          onAction={() => setIsAddModalOpen(true)}
          iconName="GitBranch"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWorkflows.map((item) => {
            const isCompleted = item.status === 'Selesai';
            const currentStageName = item.stages[item.currentStageIndex] || 'Selesai';
            const progressRatio = Math.round(((item.currentStageIndex + (isCompleted ? 1 : 0)) / item.stages.length) * 100);

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-stone-200 p-5 hover:border-stone-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-900 rounded-md">
                      {item.department}
                    </span>
                    <button
                      onClick={() => deleteWorkflow(item.id)}
                      className="text-stone-400 hover:text-red-600 transition-colors p-1"
                      title="Hapus Alur"
                    >
                      <Icon name="Trash2" className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 className="text-base font-semibold text-stone-900 mt-2">{item.workflowName}</h3>
                  <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                    <span>PJ: <strong className="text-stone-700">{item.leadAssignee}</strong></span>
                    <span>·</span>
                    <span>Siklus: {item.cycleTimeDays} Hari</span>
                  </div>

                  {/* Stage Flow visualization */}
                  <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-100">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-medium text-stone-600">Tahap Sekarang:</span>
                      <span className="font-bold text-amber-950">{currentStageName}</span>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                      {item.stages.map((stg, sIdx) => {
                        const isPast = sIdx < item.currentStageIndex;
                        const isCurrent = sIdx === item.currentStageIndex && !isCompleted;
                        return (
                          <div
                            key={sIdx}
                            className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-md shrink-0 border ${
                              isPast
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                : isCurrent
                                ? 'bg-amber-950 border-amber-950 text-white font-semibold'
                                : 'bg-white border-stone-200 text-stone-400'
                            }`}
                          >
                            <span>{sIdx + 1}.</span>
                            <span>{stg}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {item.notes && (
                    <p className="mt-3 text-xs text-stone-500 italic">
                      "{item.notes}"
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="text-[11px] text-stone-400">
                    {progressRatio}% Tahapan Dilalui
                  </div>
                  {!isCompleted ? (
                    <button
                      onClick={() => advanceWorkflowStage(item.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-amber-950 text-white text-xs font-semibold rounded-lg hover:bg-amber-900 transition-colors"
                    >
                      <span>Maju ke Tahap Berikutnya</span>
                      <Icon name="ArrowRight" className="h-3 w-3" />
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 inline-flex items-center gap-1">
                      <Icon name="CheckCircle" className="h-3.5 w-3.5" />
                      Pipeline Selesai
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Rancang Pipeline & Alur Kerja Operasional"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Nama Alur Kerja / Pipeline *
            </label>
            <input
              type="text"
              required
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="Contoh: Alur Onboarding Klien B2B, Alur Pengadaan Hardware"
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Departemen / Unit *
              </label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Contoh: Operasional, IT & Infrastruktur, Legal"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Penanggung Jawab (Lead Assignee) *
              </label>
              <input
                type="text"
                required
                value={leadAssignee}
                onChange={(e) => setLeadAssignee(e.target.value)}
                placeholder="Nama Manajer / Koordinator"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Daftar Tahapan Berurutan (Pisahkan dengan koma) *
            </label>
            <input
              type="text"
              required
              value={stagesInput}
              onChange={(e) => setStagesInput(e.target.value)}
              placeholder="Tahap 1, Tahap 2, Tahap 3, Tahap 4..."
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Setiap nama yang dipisahkan koma akan menjadi milestone tahap yang dapat dimajukan.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Target Waktu Siklus (Hari)
            </label>
            <input
              type="number"
              min="1"
              value={cycleTimeDays}
              onChange={(e) => setCycleTimeDays(Number(e.target.value))}
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Catatan / Standar Kualitas
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Memerlukan approval dua direksi sebelum eksekusi rilis"
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
              Simpan Pipeline
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
