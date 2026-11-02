import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { ComplianceItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const ComplianceApp: React.FC = () => {
  const { compliances, addCompliance, updateComplianceStatus, deleteCompliance, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('Semua');

  // Form state
  const [complianceName, setComplianceName] = useState('');
  const [issuingBody, setIssuingBody] = useState<ComplianceItem['issuingBody']>('Badan Standarisasi');
  const [type, setType] = useState<ComplianceItem['type']>('Standar Mutu & ISO');
  const [validityEndDate, setValidityEndDate] = useState('2027-12-31');
  const [auditCycleMonths, setAuditCycleMonths] = useState<number>(12);
  const [status, setStatus] = useState<ComplianceItem['status']>('Patuh (Compliant)');
  const [auditScoreOrRef, setAuditScoreOrRef] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complianceName.trim()) return;

    addCompliance({
      complianceName: complianceName.trim(),
      issuingBody,
      type,
      validityEndDate,
      auditCycleMonths: Number(auditCycleMonths) || 12,
      status,
      auditScoreOrRef: auditScoreOrRef.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setComplianceName('');
    setAuditScoreOrRef('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const filteredCompliances = compliances.filter((c) => {
    return filterType === 'Semua' || c.type === filterType;
  });

  const compliantCount = compliances.filter((c) => c.status === 'Patuh (Compliant)').length;
  const auditUpcomingCount = compliances.filter((c) => c.status === 'Audit Mendatang').length;
  const criticalCount = compliances.filter((c) => c.status === 'Kritis / Kedaluwarsa' || c.status === 'Perlu Perbaikan Tindak Lanjut').length;
  const readinessPercent = compliances.length > 0 ? Math.round((compliantCount / compliances.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200 dark:border-amber-900/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Icon name="Shield" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
              Audit Kepatuhan & Regulasi
            </h1>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Matriks kepatuhan hukum, audit ISO/K3/Pajak, dan skor kesiapan inspeksi eksternal.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Tambah Regulasi / Izin</span>
        </button>
      </div>

      {/* Sub-menus */}
      <div className="flex items-center gap-2 border-b border-amber-200/60 dark:border-amber-900/40 pb-2 text-xs">
        <button
          onClick={() => setActiveSubMenu('compliance-matrix')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'compliance-matrix'
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <Icon name="Shield" size={14} />
          <span>Matriks Kepatuhan ({compliances.length})</span>
        </button>
        <button
          onClick={() => setActiveSubMenu('readiness-score')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'readiness-score'
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <Icon name="Award" size={14} />
          <span>Skor Kesiapan Audit ({readinessPercent}%)</span>
        </button>
        <button
          onClick={() => setActiveSubMenu('expiry-radar')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'expiry-radar'
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <Icon name="Clock" size={14} />
          <span>Radar Jatuh Tempo Izin</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50">
          <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400">Total Mandat Terdaftar</p>
          <p className="text-xl font-bold text-stone-900 dark:text-white mt-1">{compliances.length}</p>
        </div>
        <div className="p-3.5 rounded-xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/20">
          <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Patuh & Terakreditasi</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{compliantCount}</p>
        </div>
        <div className="p-3.5 rounded-xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/20 dark:bg-blue-950/20">
          <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400">Audit Mendatang</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">{auditUpcomingCount}</p>
        </div>
        <div className="p-3.5 rounded-xl border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/20">
          <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">Perhatian / Kedaluwarsa</p>
          <p className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">{criticalCount}</p>
        </div>
      </div>

      {/* View: readiness-score */}
      {activeSubMenu === 'readiness-score' && (
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-stone-900 dark:text-white">Audit Readiness Index</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">Tingkat kepatuhan terhadap standar regulasi & akreditasi industri</p>
            </div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{readinessPercent}%</div>
          </div>
          <div className="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                readinessPercent >= 80 ? 'bg-emerald-500' : readinessPercent >= 50 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${readinessPercent}%` }}
            />
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            {readinessPercent >= 80
              ? 'Status Organisasi: Prima. Mayoritas perizinan, lisensi, dan sertifikasi operasional aktif serta siap diverifikasi inspektorat.'
              : 'Terdapat kewajiban regulasi yang perlu diperbarui atau disiapkan sebelum audit rutin berjalan.'}
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-stone-500">Filter Bidang:</span>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300"
        >
          <option value="Semua">Semua Bidang</option>
          <option value="Standar Mutu & ISO">Standar Mutu & ISO</option>
          <option value="Pajak & Fiskal">Pajak & Fiskal</option>
          <option value="Keamanan Data & Privasi">Keamanan Data & Privasi</option>
          <option value="Legalitas Korporasi">Legalitas Korporasi</option>
          <option value="Ketenagakerjaan & K3">Ketenagakerjaan & K3</option>
        </select>
      </div>

      {/* List */}
      {filteredCompliances.length === 0 ? (
        <EmptyState
          iconName="Shield"
          title="Belum Ada Rekam Kepatuhan"
          description="Tambahkan izin usaha, sertifikasi ISO, kepatuhan perpajakan, atau dokumen K3 operasional Anda."
          actionLabel="Tambah Regulasi Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCompliances.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/70 dark:bg-stone-900/60 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                      {item.type}
                    </span>
                    <h3 className="font-semibold text-sm text-stone-900 dark:text-white mt-1.5">
                      {item.complianceName}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Penerbit: {item.issuingBody}</p>
                  </div>
                  <button
                    onClick={() => deleteCompliance(item.id)}
                    className="text-stone-400 hover:text-rose-500 p-1 rounded transition-colors cursor-pointer"
                    title="Hapus"
                  >
                    <Icon name="Trash2" size={14} />
                  </button>
                </div>

                <div className="mt-3 text-xs space-y-1 text-stone-600 dark:text-stone-400">
                  <div className="flex items-center justify-between">
                    <span>Masa Berlaku Hingga:</span>
                    <span className="font-medium text-stone-800 dark:text-stone-200">{item.validityEndDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Siklus Audit:</span>
                    <span className="font-medium text-stone-800 dark:text-stone-200">Tiap {item.auditCycleMonths} Bulan</span>
                  </div>
                  {item.auditScoreOrRef && (
                    <div className="flex items-center justify-between">
                      <span>No. Sertifikat / Nilai:</span>
                      <span className="font-medium text-stone-800 dark:text-stone-200">{item.auditScoreOrRef}</span>
                    </div>
                  )}
                </div>

                {item.notes && (
                  <p className="mt-2 text-xs italic text-stone-500 bg-stone-50 dark:bg-stone-950/40 p-2 rounded">
                    "{item.notes}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    item.status === 'Patuh (Compliant)'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : item.status === 'Audit Mendatang'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}
                >
                  {item.status}
                </span>

                <select
                  value={item.status}
                  onChange={(e) => updateComplianceStatus(item.id, e.target.value as ComplianceItem['status'])}
                  className="text-xs px-2 py-1 rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 cursor-pointer"
                >
                  <option value="Patuh (Compliant)">Set: Patuh</option>
                  <option value="Audit Mendatang">Set: Audit Mendatang</option>
                  <option value="Perlu Perbaikan Tindak Lanjut">Set: Perlu Perbaikan</option>
                  <option value="Kritis / Kedaluwarsa">Set: Kedaluwarsa</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tambah Regulasi / Izin Baru">
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
              Nama Regulasi / Lisensi / Standar *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Sertifikasi ISO 27001 Sistem Manajemen Keamanan Informasi"
              value={complianceName}
              onChange={(e) => setComplianceName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Lembaga Penerbit / Regulator</label>
              <select
                value={issuingBody}
                onChange={(e) => setIssuingBody(e.target.value as ComplianceItem['issuingBody'])}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              >
                <option value="Badan Standarisasi">Badan Standarisasi</option>
                <option value="Kemenkumham">Kemenkumham</option>
                <option value="Dirjen Pajak">Dirjen Pajak</option>
                <option value="Kementerian Kesehatan">Kementerian Kesehatan</option>
                <option value="Lembaga Audit Eksternal">Lembaga Audit Eksternal</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Bidang Kepatuhan</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ComplianceItem['type'])}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              >
                <option value="Standar Mutu & ISO">Standar Mutu & ISO</option>
                <option value="Pajak & Fiskal">Pajak & Fiskal</option>
                <option value="Keamanan Data & Privasi">Keamanan Data & Privasi</option>
                <option value="Legalitas Korporasi">Legalitas Korporasi</option>
                <option value="Ketenagakerjaan & K3">Ketenagakerjaan & K3</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Masa Berlaku Berakhir</label>
              <input
                type="date"
                required
                value={validityEndDate}
                onChange={(e) => setValidityEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Siklus Audit (Bulan)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={auditCycleMonths}
                onChange={(e) => setAuditCycleMonths(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Status Kesiapan</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ComplianceItem['status'])}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              >
                <option value="Patuh (Compliant)">Patuh (Compliant)</option>
                <option value="Audit Mendatang">Audit Mendatang</option>
                <option value="Perlu Perbaikan Tindak Lanjut">Perlu Perbaikan</option>
                <option value="Kritis / Kedaluwarsa">Kritis / Kedaluwarsa</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">No. Registrasi / Sertifikat / Skor</label>
            <input
              type="text"
              placeholder="Contoh: ISO/IEC 27001:2022 - Reg #ID-98214"
              value={auditScoreOrRef}
              onChange={(e) => setAuditScoreOrRef(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Catatan Tindak Lanjut</label>
            <textarea
              rows={2}
              placeholder="Rincian dokumen pendukung atau jadwal visit auditor lapangan..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-200 dark:border-stone-700">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs"
            >
              Simpan Mandat
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
