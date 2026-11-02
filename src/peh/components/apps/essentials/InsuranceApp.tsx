import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { InsuranceItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const InsuranceApp: React.FC = () => {
  const { insurancePolicies, addInsurancePolicy, deleteInsurancePolicy, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('Semua');

  // Form states
  const [providerName, setProviderName] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [type, setType] = useState<InsuranceItem['type']>('Kesehatan');
  const [insuredPerson, setInsuredPerson] = useState('');
  const [premiumAmount, setPremiumAmount] = useState<number>(750000);
  const [paymentFrequency, setPaymentFrequency] = useState<InsuranceItem['paymentFrequency']>('Bulanan');
  const [coverageLimit, setCoverageLimit] = useState<number>(500000000);
  const [expiryDate, setExpiryDate] = useState('2027-12-31');
  const [status, setStatus] = useState<InsuranceItem['status']>('Aktif');
  const [notes, setNotes] = useState('');

  // Interactive Feature: Coverage Gap Calculator (Target coverage baseline = Rp 1 Miliar per breadwinner)
  const [targetSafetyCoverage, setTargetSafetyCoverage] = useState<number>(1000000000);
  const totalCoverage = insurancePolicies.reduce((acc, curr) => acc + curr.coverageLimit, 0);
  const coverageGap = targetSafetyCoverage - totalCoverage;
  const totalAnnualPremiums = insurancePolicies.reduce((acc, curr) => {
    const multiplier = curr.paymentFrequency === 'Bulanan' ? 12 : curr.paymentFrequency === 'Triwulanan' ? 4 : 1;
    return acc + curr.premiumAmount * multiplier;
  }, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerName.trim() || !policyNumber.trim()) return;

    addInsurancePolicy({
      providerName: providerName.trim(),
      policyNumber: policyNumber.trim(),
      type,
      insuredPerson: insuredPerson.trim() || 'Diri Sendiri',
      premiumAmount: Number(premiumAmount) || 0,
      paymentFrequency,
      coverageLimit: Number(coverageLimit) || 0,
      expiryDate,
      status,
      notes: notes.trim() || undefined,
    });

    setProviderName('');
    setPolicyNumber('');
    setInsuredPerson('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const filteredPolicies = insurancePolicies.filter((p) => {
    return filterType === 'Semua' || p.type === filterType;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
              <Icon name="ShieldCheck" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Polis Asuransi & Proteksi
            </h1>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Pusat data polis kesehatan, jiwa, kendaraan, plafon pertanggungan, dan premi tahunan.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Tambah Polis Asuransi</span>
        </button>
      </div>

      {/* Sub-menus */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs">
        <button
          onClick={() => setActiveSubMenu('policies')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'policies'
              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="FileCheck" size={14} />
          <span>Daftar Polis Aktif ({insurancePolicies.length})</span>
        </button>
        <button
          onClick={() => setActiveSubMenu('gap-checker')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'gap-checker'
              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="CheckSquare" size={14} />
          <span>Cek Celah Proteksi (Gap)</span>
        </button>
      </div>

      {/* Interactive Feature: Insurance Coverage Gap Checker */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Icon name="ShieldAlert" size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Analisis Celah Pertanggungan (Protection Gap)</h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Bandingkan total uang pertanggungan riil vs estimasi kebutuhan jaring pengaman keluarga.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-neutral-500">Target Proteksi: Rp</span>
              <input
                type="number"
                step="50000000"
                value={targetSafetyCoverage}
                onChange={(e) => setTargetSafetyCoverage(Number(e.target.value))}
                className="w-28 px-2 py-1 text-xs text-center border rounded bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 font-bold"
              />
            </div>
            <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              coverageGap <= 0
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}>
              {coverageGap <= 0 ? '✓ Proteksi Tercukupi' : `Celah: -Rp ${coverageGap.toLocaleString('id-ID')}`}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="text-[11px] text-neutral-500">Total Plafon Pertanggungan</div>
          <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
            Rp {totalCoverage.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-neutral-400">Akumulasi seluruh polis</div>
        </div>
        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="text-[11px] text-neutral-500">Total Premi Setahun</div>
          <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
            Rp {totalAnnualPremiums.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-neutral-400">Beban proteksi tahunan</div>
        </div>
        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 col-span-2 sm:col-span-1">
          <div className="text-[11px] text-neutral-500">Polis Berstatus Aktif</div>
          <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
            {insurancePolicies.filter((p) => p.status === 'Aktif').length} Polis
          </div>
          <div className="text-[10px] text-neutral-400">Perlindungan berlaku sah</div>
        </div>
      </div>

      {/* Policies List */}
      {filteredPolicies.length === 0 ? (
        <EmptyState
          iconName="ShieldCheck"
          title="Belum Ada Polis Tercatat"
          description="Daftar asuransi Anda masih bersih tanpa data dummy. Catat polis BPJS, asuransi kesehatan swasta, asuransi mobil, atau asuransi jiwa."
          actionLabel="Tambah Polis Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {filteredPolicies.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-neutral-400 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 mt-0.5">
                  <Icon name="ShieldCheck" size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{p.providerName}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      {p.type}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-medium">
                      {p.status}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-1 flex flex-wrap items-center gap-3">
                    <span>No. Polis: <strong>{p.policyNumber}</strong></span>
                    <span>Tertanggung: <strong>{p.insuredPerson}</strong></span>
                    <span>Premi: <strong>Rp {p.premiumAmount.toLocaleString('id-ID')} / {p.paymentFrequency}</strong></span>
                    <span>Plafon: <strong>Rp {p.coverageLimit.toLocaleString('id-ID')}</strong></span>
                    <span>Masa Berlaku: {p.expiryDate}</span>
                  </div>
                  {p.notes && <p className="text-[11px] text-neutral-400 mt-1 italic">{p.notes}</p>}
                </div>
              </div>

              <button
                onClick={() => deleteInsurancePolicy(p.id)}
                className="self-end sm:self-center p-1.5 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                title="Hapus polis"
              >
                <Icon name="Trash2" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Policy */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tambah Polis Asuransi Baru">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Perusahaan Penyedia</label>
              <input
                type="text"
                required
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                placeholder="Contoh: BPJS Kesehatan, Prudential, Sinarmas"
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Nomor Polis / Kartu</label>
              <input
                type="text"
                required
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
                placeholder="000123456789"
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Jenis Asuransi</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="Kesehatan">Kesehatan</option>
                <option value="Jiwa (Term Life)">Jiwa (Term Life)</option>
                <option value="Kendaraan">Kendaraan</option>
                <option value="Properti / Rumah">Properti / Rumah</option>
                <option value="Pendidikan Anak">Pendidikan Anak</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Nama Tertanggung</label>
              <input
                type="text"
                value={insuredPerson}
                onChange={(e) => setInsuredPerson(e.target.value)}
                placeholder="Diri Sendiri, Istri, Anak Pertama"
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Nilai Premi (Rp)</label>
              <input
                type="number"
                step="25000"
                required
                value={premiumAmount}
                onChange={(e) => setPremiumAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Frekuensi Bayar</label>
              <select
                value={paymentFrequency}
                onChange={(e) => setPaymentFrequency(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="Bulanan">Bulanan</option>
                <option value="Triwulanan">Triwulanan</option>
                <option value="Tahunan">Tahunan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Plafon Manfaat (Rp)</label>
              <input
                type="number"
                step="10000000"
                required
                value={coverageLimit}
                onChange={(e) => setCoverageLimit(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Tanggal Berakhir Polis</label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Status Polis</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="Aktif">Aktif</option>
                <option value="Grace Period">Grace Period</option>
                <option value="Klaim Berjalan">Klaim Berjalan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Catatan Tambahan (Klausul, Agen, RS Rekanan)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Cashless RS rekanan, agen kontak 0812-xxxx"
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
              className="px-4 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold"
            >
              Simpan Data Polis
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
