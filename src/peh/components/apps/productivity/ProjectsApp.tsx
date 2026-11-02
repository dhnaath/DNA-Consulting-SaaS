import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { ProjectItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const ProjectsApp: React.FC = () => {
  const { projects, addProject, updateProjectProgress, deleteProject, activeSubMenu, setActiveSubMenu } = usePEH();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [clientOrOrg, setClientOrOrg] = useState('');
  const [category, setCategory] = useState<ProjectItem['category']>('Pengembangan Produk');
  const [status, setStatus] = useState<ProjectItem['status']>('Sedang Berjalan');
  const [priority, setPriority] = useState<ProjectItem['priority']>('Tinggi');
  const [progressPercent, setProgressPercent] = useState<number>(20);
  const [deadline, setDeadline] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
  const [budget, setBudget] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState('');

  const currentTab = activeSubMenu === 'default' ? 'all-projects' : activeSubMenu;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !deadline) return;

    addProject({
      title: title.trim(),
      clientOrOrg: clientOrOrg.trim() || undefined,
      category,
      status,
      priority,
      progressPercent: Number(progressPercent) || 0,
      deadline,
      budget: budget && budget > 0 ? budget : undefined,
      description: description.trim() || undefined,
    });

    setTitle('');
    setClientOrOrg('');
    setCategory('Pengembangan Produk');
    setStatus('Sedang Berjalan');
    setPriority('Tinggi');
    setProgressPercent(20);
    setDeadline(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
    setBudget(undefined);
    setDescription('');
    setIsAddModalOpen(false);
  };

  const filteredProjects = projects.filter((p) => {
    if (currentTab === 'in-progress') return p.status === 'Sedang Berjalan';
    if (currentTab === 'milestones') return p.status === 'Selesai' || p.status === 'Review / Evaluasi';
    return true; // 'all-projects'
  });

  const totalBudget = projects.reduce((acc, curr) => acc + (curr.budget || 0), 0);
  const inProgressCount = projects.filter(p => p.status === 'Sedang Berjalan').length;
  const completedCount = projects.filter(p => p.status === 'Selesai').length;

  return (
    <div className="space-y-6">
      {/* Submenu navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubMenu('all-projects')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'all-projects'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Layers" className="h-4 w-4" />
            Semua Proyek
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              currentTab === 'all-projects' ? 'bg-amber-900 text-amber-100' : 'bg-stone-200 text-stone-700'
            }`}>
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubMenu('in-progress')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'in-progress'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="PlayCircle" className="h-4 w-4" />
            Sedang Berjalan
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              currentTab === 'in-progress' ? 'bg-amber-900 text-amber-100' : 'bg-stone-200 text-stone-700'
            }`}>
              {inProgressCount}
            </span>
          </button>

          <button
            onClick={() => setActiveSubMenu('milestones')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'milestones'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="CheckCircle2" className="h-4 w-4" />
            Evaluasi & Selesai
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              currentTab === 'milestones' ? 'bg-amber-900 text-amber-100' : 'bg-stone-200 text-stone-700'
            }`}>
              {completedCount}
            </span>
          </button>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-950 text-white text-sm font-medium rounded-lg hover:bg-amber-900 transition-colors shadow-xs"
        >
          <Icon name="Plus" className="h-4 w-4" />
          Tambah Proyek Baru
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Portofolio Proyek</p>
          <p className="text-2xl font-semibold text-stone-900 mt-1 tabular-nums">{projects.length}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Proyek Aktif (In-Flight)</p>
          <p className="text-2xl font-semibold text-amber-900 mt-1 tabular-nums">{inProgressCount}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Akumulasi Nilai / Anggaran</p>
          <p className="text-2xl font-semibold text-stone-900 mt-1 tabular-nums">
            Rp {totalBudget.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Main List or Empty State */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          title={
            currentTab === 'in-progress'
              ? 'Tidak Ada Proyek yang Sedang Berjalan'
              : currentTab === 'milestones'
              ? 'Belum Ada Proyek yang Telah Selesai atau Evaluasi'
              : 'Belum Ada Inisiatif & Proyek Terdaftar'
          }
          description="Inisiasi deliverable produk, kontrak klien, atau target inisiatif tim. Pantau progres persentase, tenggat waktu, dan anggaran deliverable."
          actionLabel="Inisiasi Proyek Pertama"
          onAction={() => setIsAddModalOpen(true)}
          iconName="Briefcase"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-stone-200 p-5 hover:border-stone-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-900 rounded-md">
                      {item.category}
                    </span>
                    <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md ${
                      item.priority === 'Tinggi'
                        ? 'bg-rose-50 text-rose-700'
                        : item.priority === 'Sedang'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-stone-100 text-stone-600'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteProject(item.id)}
                    className="text-stone-400 hover:text-red-600 transition-colors p-1"
                    title="Hapus Proyek"
                  >
                    <Icon name="Trash2" className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="text-base font-semibold text-stone-900 mt-2.5">{item.title}</h3>
                {item.clientOrOrg && (
                  <p className="text-xs text-stone-500 mt-0.5">Klien / Entitas: <strong className="text-stone-700">{item.clientOrOrg}</strong></p>
                )}

                {/* Progress bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500 font-medium">Progres Penyelesaian</span>
                    <span className="font-bold text-amber-950 tabular-nums">{item.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-900 h-full rounded-full transition-all duration-300"
                      style={{ width: `${item.progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-end gap-1.5 pt-1">
                    <button
                      onClick={() => updateProjectProgress(item.id, Math.min(100, item.progressPercent + 20))}
                      className="text-[10px] text-stone-500 hover:text-amber-950 font-medium px-1.5 py-0.5 rounded bg-stone-50 hover:bg-stone-100 border border-stone-200"
                    >
                      +20% Progres
                    </button>
                    {item.progressPercent < 100 ? (
                      <button
                        onClick={() => updateProjectProgress(item.id, 100, 'Selesai')}
                        className="text-[10px] text-emerald-800 font-semibold px-1.5 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                      >
                        Tandai Selesai
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-700 font-bold px-1.5 py-0.5">
                        Tuntas
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-100 space-y-1.5 text-xs text-stone-700">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Tenggat Waktu:</span>
                    <span className="font-medium text-stone-900 flex items-center gap-1">
                      <Icon name="Calendar" className="h-3 w-3 text-stone-400" />
                      {item.deadline}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Status Tahapan:</span>
                    <span className="font-medium text-amber-900">{item.status}</span>
                  </div>
                  {item.budget && (
                    <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                      <span className="text-stone-500">Nilai / Anggaran:</span>
                      <strong className="text-stone-900 tabular-nums">Rp {item.budget.toLocaleString('id-ID')}</strong>
                    </div>
                  )}
                </div>

                {item.description && (
                  <p className="mt-3 text-xs text-stone-500 italic">
                    "{item.description}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span>Dibuat {new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
                <span className="text-amber-900 font-medium">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Inisiasi Proyek & Deliverable Baru"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Nama Proyek / Inisiatif *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Rilis Aplikasi Mobile v2.0, Revamp Brand Identity"
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Klien / Divisi Pemilik
              </label>
              <input
                type="text"
                value={clientOrOrg}
                onChange={(e) => setClientOrOrg(e.target.value)}
                placeholder="Contoh: PT Surya Kencana / Tim Internal"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Kategori Inisiatif *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectItem['category'])}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950 bg-white"
              >
                <option value="Pengembangan Produk">Pengembangan Produk</option>
                <option value="Klien & Servis">Klien & Servis</option>
                <option value="Internal / Inisiatif">Internal / Inisiatif</option>
                <option value="Pemasaran & Konten">Pemasaran & Konten</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectItem['status'])}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950 bg-white"
              >
                <option value="Perencanaan">Perencanaan</option>
                <option value="Sedang Berjalan">Sedang Berjalan</option>
                <option value="Review / Evaluasi">Review / Evaluasi</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Prioritas *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ProjectItem['priority'])}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950 bg-white"
              >
                <option value="Tinggi">Tinggi</option>
                <option value="Sedang">Sedang</option>
                <option value="Rendah">Rendah</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Progres Awal (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={progressPercent}
                onChange={(e) => setProgressPercent(Number(e.target.value))}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Target Selesai (Deadline) *
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Anggaran / Nilai Kontrak (Opsional)
              </label>
              <input
                type="number"
                min="0"
                value={budget || ''}
                onChange={(e) => setBudget(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Rp 0"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Ringkasan Scope & Deliverable
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan output kunci atau kriteria penerimaan proyek ini"
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
              Simpan Proyek
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
