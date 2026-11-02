import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { AdvocacyItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const AdvocacyApp: React.FC = () => {
  const { advocacies, addAdvocacy, updateAdvocacyStatus, deleteAdvocacy, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterUrgency, setFilterUrgency] = useState<string>('Semua');

  // Form states
  const [issueTitle, setIssueTitle] = useState('');
  const [targetAuthority, setTargetAuthority] = useState<AdvocacyItem['targetAuthority']>('Dinas Bina Marga / PU');
  const [urgency, setUrgency] = useState<AdvocacyItem['urgency']>('P2: Gangguan Rutinitas');
  const [submissionDate, setSubmissionDate] = useState(new Date().toISOString().split('T')[0]);
  const [trackingTicketNumber, setTrackingTicketNumber] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle.trim()) return;

    addAdvocacy({
      issueTitle: issueTitle.trim(),
      targetAuthority,
      urgency,
      submissionDate,
      trackingTicketNumber: trackingTicketNumber.trim() || undefined,
      status: 'Draft Laporan',
      resolutionNotes: resolutionNotes.trim() || undefined,
    });

    setIssueTitle('');
    setTrackingTicketNumber('');
    setResolutionNotes('');
    setIsAddModalOpen(false);
  };

  const filteredAdvocacies = advocacies.filter((a) => {
    return filterUrgency === 'Semua' || a.urgency === filterUrgency;
  });

  const pendingIssuesCount = advocacies.filter((a) => a.status !== 'Tuntas Diperbaiki').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Icon name="Megaphone" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Aspirasi & Laporan Fasum
            </h1>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Pelaporan jalan rusak, lampu PJU mati, aduan ke dinas, serta matriks urgensi aspirasi warga.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Buat Laporan Aspirasi</span>
        </button>
      </div>

      {/* Sub-menus */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs">
        <button
          onClick={() => setActiveSubMenu('issues')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'issues'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="AlertCircle" size={14} />
          <span>Daftar Laporan Aspirasi ({advocacies.length})</span>
        </button>
        <button
          onClick={() => setActiveSubMenu('urgency-matrix')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'urgency-matrix'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="Grid" size={14} />
          <span>Matriks Urgensi Publik ({pendingIssuesCount} Aktif)</span>
        </button>
      </div>

      {/* List */}
      {filteredAdvocacies.length === 0 ? (
        <EmptyState
          iconName="Megaphone"
          title="Belum Ada Laporan Aspirasi Fasum"
          description="Log advokasi sipil Anda masih bersih tanpa data dummy. Mulai catat permohonan perbaikan lampu jalan, pengaspalan jalan rusak, atau aduan saluran air."
          actionLabel="Buat Laporan Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {filteredAdvocacies.map((a) => (
            <div
              key={a.id}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-300 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{a.issueTitle}</h3>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      a.urgency.startsWith('P1')
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                        : a.urgency.startsWith('P2')
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                        : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                    }`}
                  >
                    {a.urgency}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-medium">
                    {a.status}
                  </span>
                </div>

                <div className="text-xs text-neutral-500">
                  <span>Diajukan ke <strong>{a.targetAuthority}</strong></span>
                  {a.trackingTicketNumber && <span> • No Tiket: <code className="font-mono">{a.trackingTicketNumber}</code></span>}
                  <span> • Tanggal: {a.submissionDate}</span>
                </div>
                {a.resolutionNotes && <p className="text-[11px] text-neutral-400 italic mt-1">Status: {a.resolutionNotes}</p>}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <select
                  value={a.status}
                  onChange={(e) => updateAdvocacyStatus(a.id, e.target.value as any)}
                  className="px-2 py-1 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                >
                  <option value="Draft Laporan">Draft Laporan</option>
                  <option value="Terkirim / Diajukan">Terkirim / Diajukan</option>
                  <option value="Dalam Penanganan Dinas">Dalam Penanganan Dinas</option>
                  <option value="Tuntas Diperbaiki">Tuntas Diperbaiki</option>
                </select>

                <button
                  onClick={() => deleteAdvocacy(a.id)}
                  className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Hapus laporan"
                >
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Advocacy */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Buat Laporan Aspirasi / Fasum">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Judul Masalah / Aspirasi</label>
            <input
              type="text"
              required
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              placeholder="Contoh: Lampu PJU Mati Depan Blok C, Lubang Jalan Utama Aspal Terkelupas"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Instansi / Dinas Sasaran</label>
              <select
                value={targetAuthority}
                onChange={(e) => setTargetAuthority(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="Dinas Bina Marga / PU">Dinas Bina Marga / PU</option>
                <option value="Kelurahan / Kecamatan">Kelurahan / Kecamatan</option>
                <option value="PLN / PDAM">PLN / PDAM</option>
                <option value="Kepolisian">Kepolisian</option>
                <option value="Pengurus RT/RW">Pengurus RT/RW</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Tingkat Urgensi</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="P1: Bahaya Keselamatan">P1: Bahaya Keselamatan (Urgent)</option>
                <option value="P2: Gangguan Rutinitas">P2: Gangguan Rutinitas</option>
                <option value="P3: Kenyamanan Lingkungan">P3: Kenyamanan Lingkungan</option>
                <option value="P4: Saran Estetika">P4: Saran Estetika</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Tanggal Diajukan</label>
              <input
                type="date"
                required
                value={submissionDate}
                onChange={(e) => setSubmissionDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Nomor Tiket / Aduan (Opsional)</label>
              <input
                type="text"
                value={trackingTicketNumber}
                onChange={(e) => setTrackingTicketNumber(e.target.value)}
                placeholder="JAKEVO-2026-9912 / TIKET-PLN-123"
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Catatan Tindak Lanjut / Lokasi Spesifik</label>
            <input
              type="text"
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Contoh: Sudah difoto dan dilaporkan melalui aplikasi CRM dinas"
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
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
            >
              Simpan Laporan Aspirasi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
