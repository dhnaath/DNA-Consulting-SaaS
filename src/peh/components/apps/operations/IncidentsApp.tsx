import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { IncidentItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const IncidentsApp: React.FC = () => {
  const { incidents, addIncident, resolveIncident, deleteIncident, activeSubMenu, setActiveSubMenu } = usePEH();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [resolvingItem, setResolvingItem] = useState<IncidentItem | null>(null);

  // Form state
  const [issueTitle, setIssueTitle] = useState('');
  const [severity, setSeverity] = useState<IncidentItem['severity']>('Tinggi (P2)');
  const [systemAffected, setSystemAffected] = useState('');
  const [status, setStatus] = useState<IncidentItem['status']>('Investigasi');
  const [reportedDate, setReportedDate] = useState(new Date().toISOString().split('T')[0]);
  const [downtimeMinutes, setDowntimeMinutes] = useState<number | undefined>(undefined);
  const [rootCause, setRootCause] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Resolve modal state
  const [solveNotes, setSolveNotes] = useState('');
  const [solveRootCause, setSolveRootCause] = useState('');

  const currentTab = activeSubMenu === 'default' ? 'active-issues' : activeSubMenu;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle.trim() || !systemAffected.trim() || !reportedDate) return;

    addIncident({
      issueTitle: issueTitle.trim(),
      severity,
      systemAffected: systemAffected.trim(),
      status,
      reportedDate,
      downtimeMinutes: downtimeMinutes && downtimeMinutes > 0 ? downtimeMinutes : undefined,
      rootCause: rootCause.trim() || undefined,
      resolutionNotes: resolutionNotes.trim() || undefined,
    });

    setIssueTitle('');
    setSeverity('Tinggi (P2)');
    setSystemAffected('');
    setStatus('Investigasi');
    setReportedDate(new Date().toISOString().split('T')[0]);
    setDowntimeMinutes(undefined);
    setRootCause('');
    setResolutionNotes('');
    setIsAddModalOpen(false);
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingItem || !solveNotes.trim()) return;

    resolveIncident(resolvingItem.id, solveNotes.trim(), solveRootCause.trim() || undefined);
    setResolvingItem(null);
    setSolveNotes('');
    setSolveRootCause('');
  };

  const filteredIncidents = incidents.filter((i) => {
    if (currentTab === 'active-issues') return i.status !== 'Terselesaikan';
    if (currentTab === 'resolved') return i.status === 'Terselesaikan';
    if (currentTab === 'post-mortem') return Boolean(i.rootCause);
    return true;
  });

  const activeCount = incidents.filter(i => i.status !== 'Terselesaikan').length;
  const criticalCount = incidents.filter(i => i.severity.startsWith('Kritis')).length;
  const totalDowntime = incidents.reduce((acc, curr) => acc + (curr.downtimeMinutes || 0), 0);

  return (
    <div className="space-y-6">
      {/* Submenu navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubMenu('active-issues')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'active-issues'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="AlertTriangle" className="h-4 w-4 text-rose-300" />
            Insiden Terbuka
            {activeCount > 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-rose-900 text-rose-100 font-bold">
                {activeCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubMenu('resolved')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'resolved'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="CheckCircle" className="h-4 w-4" />
            Terselesaikan
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              currentTab === 'resolved' ? 'bg-amber-900 text-amber-100' : 'bg-stone-200 text-stone-700'
            }`}>
              {incidents.filter(i => i.status === 'Terselesaikan').length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubMenu('post-mortem')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'post-mortem'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="FileSearch" className="h-4 w-4" />
            Akar Masalah (RCA & Evaluasi)
          </button>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-950 text-white text-sm font-medium rounded-lg hover:bg-amber-900 transition-colors shadow-xs"
        >
          <Icon name="Plus" className="h-4 w-4" />
          Laporkan Insiden Baru
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Insiden Terbuka (Aktif)</p>
          <p className={`text-2xl font-semibold mt-1 tabular-nums ${activeCount > 0 ? 'text-rose-600' : 'text-stone-900'}`}>
            {activeCount}
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Tingkat Kritis (P1)</p>
          <p className="text-2xl font-semibold text-rose-700 mt-1 tabular-nums">{criticalCount}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Akumulasi Gangguan / Downtime</p>
          <p className="text-2xl font-semibold text-stone-900 mt-1 tabular-nums">
            {totalDowntime} <span className="text-sm font-normal text-stone-500">Menit</span>
          </p>
        </div>
      </div>

      {/* List or Empty State */}
      {filteredIncidents.length === 0 ? (
        <EmptyState
          title={
            currentTab === 'active-issues'
              ? 'Layanan Beroperasi Normal (Zero Open Incidents)'
              : 'Belum Ada Log Insiden atau Gangguan Operasional'
          }
          description="Catat kegagalan server, komplain eskalasi klien, gangguan logistik, atau bug pembayaran. Lakukan evaluasi RCA (Root Cause Analysis) agar tidak terulang."
          actionLabel="Laporkan Insiden"
          onAction={() => setIsAddModalOpen(true)}
          iconName="AlertOctagon"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIncidents.map((item) => {
            const isResolved = item.status === 'Terselesaikan';
            const isP1 = item.severity.startsWith('Kritis');

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl border p-5 transition-all flex flex-col justify-between ${
                  isP1 && !isResolved ? 'border-red-300 ring-1 ring-red-100' : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-md ${
                      isP1
                        ? 'bg-red-100 text-red-800'
                        : item.severity.startsWith('Tinggi')
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-stone-100 text-stone-700'
                    }`}>
                      {item.severity}
                    </span>
                    <button
                      onClick={() => deleteIncident(item.id)}
                      className="text-stone-400 hover:text-red-600 transition-colors p-1"
                      title="Hapus Insiden"
                    >
                      <Icon name="Trash2" className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 className="text-base font-semibold text-stone-900 mt-2.5">{item.issueTitle}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">Sistem Terdampak: <strong className="text-stone-800">{item.systemAffected}</strong></p>

                  <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-100 space-y-1.5 text-xs text-stone-700">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Status Penanganan:</span>
                      <span className={`font-semibold ${isResolved ? 'text-emerald-800' : 'text-amber-900'}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Waktu Laporan:</span>
                      <span>{item.reportedDate}</span>
                    </div>
                    {item.downtimeMinutes && (
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Downtime Layanan:</span>
                        <strong className="text-rose-700 font-mono">{item.downtimeMinutes} Menit</strong>
                      </div>
                    )}
                  </div>

                  {item.rootCause && (
                    <div className="mt-3 p-2.5 bg-amber-50/50 rounded-lg border border-amber-200/60 text-xs">
                      <p className="font-semibold text-amber-950 mb-0.5">Akar Masalah (RCA):</p>
                      <p className="text-stone-700">{item.rootCause}</p>
                    </div>
                  )}

                  {item.resolutionNotes && (
                    <div className="mt-2 p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-200/60 text-xs">
                      <p className="font-semibold text-emerald-950 mb-0.5">Solusi & Tindakan:</p>
                      <p className="text-stone-700">{item.resolutionNotes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    {new Date(item.createdAt).toLocaleDateString('id-ID')}
                  </span>
                  {!isResolved ? (
                    <button
                      onClick={() => setResolvingItem(item)}
                      className="px-2.5 py-1 text-xs font-semibold bg-emerald-800 text-white rounded-md hover:bg-emerald-700 transition-colors"
                    >
                      Selesaikan Insiden
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <Icon name="CheckCircle" className="h-3.5 w-3.5" />
                      Rampung
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Resolve Modal */}
      {resolvingItem && (
        <Modal
          isOpen={Boolean(resolvingItem)}
          onClose={() => setResolvingItem(null)}
          title={`Penyelesaian Insiden: ${resolvingItem.issueTitle}`}
        >
          <form onSubmit={handleResolveSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Akar Masalah (Root Cause Analysis / RCA)
              </label>
              <textarea
                rows={2}
                value={solveRootCause}
                onChange={(e) => setSolveRootCause(e.target.value)}
                placeholder="Apa penyebab utama masalah ini terjadi? (Contoh: Kuota koneksi database terlampaui saat lonjakan promo)"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Tindakan Perbaikan & Solusi Dilakukan *
              </label>
              <textarea
                rows={3}
                required
                value={solveNotes}
                onChange={(e) => setSolveNotes(e.target.value)}
                placeholder="Langkah apa yang telah dilakukan untuk memulihkan layanan dan mencegah hal ini terulang kembali?"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setResolvingItem(null)}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium bg-emerald-800 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Tandai Sebagai Terselesaikan
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Laporkan Insiden & Gangguan Operasional"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Judul Masalah / Insiden *
            </label>
            <input
              type="text"
              required
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              placeholder="Contoh: Server API Checkout Timeout, Keterlambatan Pengiriman Klaster Jawa"
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Tingkat Urgensi / Dampak *
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as IncidentItem['severity'])}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950 bg-white"
              >
                <option value="Kritis (P1)">Kritis (P1 - Layanan Lumpuh Total)</option>
                <option value="Tinggi (P2)">Tinggi (P2 - Fungsi Utama Terganggu)</option>
                <option value="Sedang (P3)">Sedang (P3 - Masalah Parsial)</option>
                <option value="Rendah (P4)">Rendah (P4 - Gangguan Minor / Kosmetik)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Sistem / Proses Terdampak *
              </label>
              <input
                type="text"
                required
                value={systemAffected}
                onChange={(e) => setSystemAffected(e.target.value)}
                placeholder="Contoh: Payment Gateway, Jalur Kurir Kilat"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Tanggal Terjadi *
              </label>
              <input
                type="date"
                required
                value={reportedDate}
                onChange={(e) => setReportedDate(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Estimasi Downtime (Menit)
              </label>
              <input
                type="number"
                min="0"
                value={downtimeMinutes || ''}
                onChange={(e) => setDowntimeMinutes(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Investigasi Awal / Gejala
            </label>
            <textarea
              rows={2}
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              placeholder="Catat pesan error atau laporan awal yang diterima tim"
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
              Daftarkan Insiden
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
