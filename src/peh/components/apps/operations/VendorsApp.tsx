import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { VendorItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const VendorsApp: React.FC = () => {
  const { vendors, addVendor, deleteVendor, activeSubMenu, setActiveSubMenu } = usePEH();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [companyName, setCompanyName] = useState('');
  const [serviceCategory, setServiceCategory] = useState<VendorItem['serviceCategory']>('Cloud & SaaS');
  const [contactPerson, setContactPerson] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [contractValue, setContractValue] = useState<number>(5000000);
  const [paymentCycle, setPaymentCycle] = useState<VendorItem['paymentCycle']>('Bulanan');
  const [renewalDate, setRenewalDate] = useState(new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0]);
  const [slaRating, setSlaRating] = useState<VendorItem['slaRating']>('A (Sangat Baik)');
  const [notes, setNotes] = useState('');

  const currentTab = activeSubMenu === 'default' ? 'directory' : activeSubMenu;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactPerson.trim() || !emailOrPhone.trim() || !renewalDate) return;

    addVendor({
      companyName: companyName.trim(),
      serviceCategory,
      contactPerson: contactPerson.trim(),
      emailOrPhone: emailOrPhone.trim(),
      contractValue: Number(contractValue) || 0,
      paymentCycle,
      renewalDate,
      slaRating,
      notes: notes.trim() || undefined,
    });

    setCompanyName('');
    setServiceCategory('Cloud & SaaS');
    setContactPerson('');
    setEmailOrPhone('');
    setContractValue(5000000);
    setPaymentCycle('Bulanan');
    setRenewalDate(new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0]);
    setSlaRating('A (Sangat Baik)');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const filteredVendors = vendors.filter((v) => {
    if (currentTab === 'contracts') {
      const daysUntil = Math.ceil((new Date(v.renewalDate).getTime() - Date.now()) / (1000 * 3600 * 24));
      return daysUntil <= 60;
    }
    if (currentTab === 'slas') return v.slaRating.startsWith('A');
    return true; // 'directory'
  });

  const totalContractCommitment = vendors.reduce((acc, curr) => acc + (curr.contractValue || 0), 0);

  return (
    <div className="space-y-6">
      {/* Submenu navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubMenu('directory')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'directory'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Users" className="h-4 w-4" />
            Direktori Rekanan & Vendor
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              currentTab === 'directory' ? 'bg-amber-900 text-amber-100' : 'bg-stone-200 text-stone-700'
            }`}>
              {vendors.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubMenu('contracts')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'contracts'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Calendar" className="h-4 w-4" />
            Jatuh Tempo Perpanjangan (&lt;60 hari)
          </button>

          <button
            onClick={() => setActiveSubMenu('slas')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'slas'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Star" className="h-4 w-4" />
            Mitra Unggulan (SLA Grade A)
          </button>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-950 text-white text-sm font-medium rounded-lg hover:bg-amber-900 transition-colors shadow-xs"
        >
          <Icon name="Plus" className="h-4 w-4" />
          Daftarkan Mitra Vendor
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Rekanan Vendor Aktif</p>
          <p className="text-2xl font-semibold text-stone-900 mt-1 tabular-nums">{vendors.length}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Komitmen Nilai Kontrak</p>
          <p className="text-2xl font-semibold text-amber-900 mt-1 tabular-nums">
            Rp {totalContractCommitment.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Mitra Kategori Cloud & IT</p>
          <p className="text-2xl font-semibold text-stone-900 mt-1 tabular-nums">
            {vendors.filter(v => v.serviceCategory === 'Cloud & SaaS').length}
          </p>
        </div>
      </div>

      {/* List or Empty State */}
      {filteredVendors.length === 0 ? (
        <EmptyState
          title={
            currentTab === 'contracts'
              ? 'Tidak Ada Kontrak Vendor yang Mendekati Jatuh Tempo'
              : 'Belum Ada Mitra Layanan atau Vendor Terdaftar'
          }
          description="Catat vendor infrastruktur cloud, agensi konsultan, penyedia logistik, atau supplier bahan baku lengkap dengan nilai kontrak dan jaminan SLA."
          actionLabel="Daftarkan Vendor Pertama"
          onAction={() => setIsAddModalOpen(true)}
          iconName="Building"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVendors.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-xl border border-stone-200 p-5 hover:border-stone-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-900 rounded-md">
                    {v.serviceCategory}
                  </span>
                  <button
                    onClick={() => deleteVendor(v.id)}
                    className="text-stone-400 hover:text-red-600 transition-colors p-1"
                    title="Hapus Vendor"
                  >
                    <Icon name="Trash2" className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="text-base font-semibold text-stone-900 mt-2.5">{v.companyName}</h3>
                <p className="text-xs text-stone-500 mt-0.5">PIC: <strong className="text-stone-700">{v.contactPerson}</strong></p>

                <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-100 space-y-1.5 text-xs text-stone-700">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Nilai Kontrak:</span>
                    <strong className="text-stone-900 font-mono">Rp {v.contractValue.toLocaleString('id-ID')} / {v.paymentCycle}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Perpanjangan:</span>
                    <span className="text-stone-800 font-medium">{v.renewalDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Kontak:</span>
                    <span className="text-stone-800 font-mono truncate">{v.emailOrPhone}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                    <span className="text-stone-500">Rating SLA:</span>
                    <span className="font-semibold text-emerald-800">{v.slaRating}</span>
                  </div>
                </div>

                {v.notes && (
                  <p className="mt-3 text-xs text-stone-500 italic">
                    "{v.notes}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span>Terdaftar {new Date(v.createdAt).toLocaleDateString('id-ID')}</span>
                <span className="text-amber-900 font-medium">Kontrak Aktif</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Daftarkan Rekanan / Mitra Vendor Baru"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Nama Perusahaan / Vendor *
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Contoh: Amazon Web Services, PT Mitra Logistik Prima"
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Kategori Layanan *
              </label>
              <select
                value={serviceCategory}
                onChange={(e) => setServiceCategory(e.target.value as VendorItem['serviceCategory'])}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950 bg-white"
              >
                <option value="Cloud & SaaS">Cloud & SaaS</option>
                <option value="Logistik & Ekspedisi">Logistik & Ekspedisi</option>
                <option value="Konsultan & Agensi">Konsultan & Agensi</option>
                <option value="Penyedia Bahan Baku">Penyedia Bahan Baku</option>
                <option value="Perangkat Keras">Perangkat Keras</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Rating SLA Layanan *
              </label>
              <select
                value={slaRating}
                onChange={(e) => setSlaRating(e.target.value as VendorItem['slaRating'])}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950 bg-white"
              >
                <option value="A (Sangat Baik)">A (Sangat Baik / 99.9% Uptime)</option>
                <option value="B (Standar)">B (Standar / Sesuai Kontrak)</option>
                <option value="C (Perlu Evaluasi)">C (Perlu Evaluasi Khusus)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Nama Kontak PIC *
              </label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Contoh: Pak Anton (Account Manager)"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Email / No. HP *
              </label>
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="sales@vendor.com / 0811-xxx"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Nilai Kontrak (Rp) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={contractValue}
                onChange={(e) => setContractValue(Number(e.target.value))}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Siklus Pembayaran *
              </label>
              <select
                value={paymentCycle}
                onChange={(e) => setPaymentCycle(e.target.value as VendorItem['paymentCycle'])}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950 bg-white"
              >
                <option value="Bulanan">Bulanan</option>
                <option value="Tahunan">Tahunan</option>
                <option value="Per Proyek">Per Proyek</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Jatuh Tempo Perpanjangan *
              </label>
              <input
                type="date"
                required
                value={renewalDate}
                onChange={(e) => setRenewalDate(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Catatan Khusus / Syarat Layanan
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Pembayaran tempo 30 hari setelah invoice diterbitkan"
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
              Simpan Vendor
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
