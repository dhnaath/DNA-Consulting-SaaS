import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { IpLicenseItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const IpLicensesApp: React.FC = () => {
  const { ipLicenses, addIpLicense, deleteIpLicense, activeSubMenu, setActiveSubMenu } = usePEH();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [titleOrDomain, setTitleOrDomain] = useState('');
  const [type, setType] = useState<IpLicenseItem['type']>('Domain & Hosting');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [holdingEntity, setHoldingEntity] = useState('');
  const [costPerRenewal, setCostPerRenewal] = useState<number | undefined>(250000);
  const [expiryDate, setExpiryDate] = useState(new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0]);
  const [status, setStatus] = useState<IpLicenseItem['status']>('Aktif & Sah');
  const [notes, setNotes] = useState('');

  const currentTab = activeSubMenu === 'default' ? 'all-licenses' : activeSubMenu;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleOrDomain.trim() || !holdingEntity.trim() || !expiryDate) return;

    addIpLicense({
      titleOrDomain: titleOrDomain.trim(),
      type,
      registrationNumber: registrationNumber.trim() || undefined,
      holdingEntity: holdingEntity.trim(),
      costPerRenewal: costPerRenewal && costPerRenewal > 0 ? costPerRenewal : undefined,
      expiryDate,
      status,
      notes: notes.trim() || undefined,
    });

    setTitleOrDomain('');
    setType('Domain & Hosting');
    setRegistrationNumber('');
    setHoldingEntity('');
    setCostPerRenewal(250000);
    setExpiryDate(new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0]);
    setStatus('Aktif & Sah');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const filteredItems = ipLicenses.filter((item) => {
    if (currentTab === 'domains') return item.type === 'Domain & Hosting';
    if (currentTab === 'expiring-soon') {
      const daysUntil = Math.ceil((new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 3600 * 24));
      return daysUntil <= 90;
    }
    return true; // 'all-licenses'
  });

  const domainsCount = ipLicenses.filter(i => i.type === 'Domain & Hosting').length;
  const trademarkCount = ipLicenses.filter(i => i.type === 'Merek Dagang / Paten' || i.type === 'Hak Cipta Karya').length;

  return (
    <div className="space-y-6">
      {/* Submenu navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubMenu('all-licenses')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'all-licenses'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="FileCheck" className="h-4 w-4" />
            Semua Lisensi, IP & Domain
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              currentTab === 'all-licenses' ? 'bg-amber-900 text-amber-100' : 'bg-stone-200 text-stone-700'
            }`}>
              {ipLicenses.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubMenu('domains')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'domains'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Globe" className="h-4 w-4" />
            Domain & Infrastruktur
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              currentTab === 'domains' ? 'bg-amber-900 text-amber-100' : 'bg-stone-200 text-stone-700'
            }`}>
              {domainsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveSubMenu('expiring-soon')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'expiring-soon'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Clock" className="h-4 w-4" />
            Segera Kedaluwarsa (&lt;90 hari)
          </button>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-950 text-white text-sm font-medium rounded-lg hover:bg-amber-900 transition-colors shadow-xs"
        >
          <Icon name="Plus" className="h-4 w-4" />
          Daftarkan Lisensi / IP
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Lisensi & Hak IP</p>
          <p className="text-2xl font-semibold text-stone-900 mt-1 tabular-nums">{ipLicenses.length}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Merek Dagang & Hak Cipta</p>
          <p className="text-2xl font-semibold text-amber-950 mt-1 tabular-nums">{trademarkCount}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Domain Internet Terkelola</p>
          <p className="text-2xl font-semibold text-stone-900 mt-1 tabular-nums">{domainsCount}</p>
        </div>
      </div>

      {/* List or Empty State */}
      {filteredItems.length === 0 ? (
        <EmptyState
          title={
            currentTab === 'expiring-soon'
              ? 'Tidak Ada Lisensi yang Mendekati Kedaluwarsa'
              : 'Belum Ada Kepemilikan Hak IP atau Domain Web'
          }
          description="Amankan bukti kepemilikan aset tak berwujud (intangible assets): nama domain internet, sertifikat merek DJKI, hak paten penemuan, lisensi enterprise, dan izin usaha resmi."
          actionLabel="Daftarkan Lisensi Pertama"
          onAction={() => setIsAddModalOpen(true)}
          iconName="Award"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-stone-200 p-5 hover:border-stone-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-900 rounded-md">
                    {item.type}
                  </span>
                  <button
                    onClick={() => deleteIpLicense(item.id)}
                    className="text-stone-400 hover:text-red-600 transition-colors p-1"
                    title="Hapus Lisensi"
                  >
                    <Icon name="Trash2" className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="text-base font-semibold text-stone-900 mt-2.5 font-mono">{item.titleOrDomain}</h3>
                <p className="text-xs text-stone-500 mt-0.5">Pemegang Hak: <strong className="text-stone-800">{item.holdingEntity}</strong></p>

                <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-100 space-y-1.5 text-xs text-stone-700">
                  {item.registrationNumber && (
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Nomor Registrasi:</span>
                      <span className="font-mono text-stone-900">{item.registrationNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Jatuh Tempo:</span>
                    <span className="font-medium text-stone-900">{item.expiryDate}</span>
                  </div>
                  {item.costPerRenewal && (
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Biaya Perpanjangan:</span>
                      <span className="font-mono text-stone-800">Rp {item.costPerRenewal.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                    <span className="text-stone-500">Status Legalitas:</span>
                    <span className="font-semibold text-emerald-800">{item.status}</span>
                  </div>
                </div>

                {item.notes && (
                  <p className="mt-3 text-xs text-stone-500 italic">
                    "{item.notes}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span>Tercatat {new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
                <span className="text-amber-950 font-medium">Aset Legal Sah</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Daftarkan Hak Cipta, Lisensi & Domain"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Nama Aset / Judul Domain / Merk *
            </label>
            <input
              type="text"
              required
              value={titleOrDomain}
              onChange={(e) => setTitleOrDomain(e.target.value)}
              placeholder="Contoh: mycompany.com, Merek Dagang 'AERO TECH'"
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Klasifikasi IP / Lisensi *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as IpLicenseItem['type'])}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950 bg-white"
              >
                <option value="Domain & Hosting">Domain & Hosting</option>
                <option value="Merek Dagang / Paten">Merek Dagang / Paten</option>
                <option value="Lisensi Software Bisnis">Lisensi Software Bisnis</option>
                <option value="Hak Cipta Karya">Hak Cipta Karya</option>
                <option value="Izin Usaha / NIB">Izin Usaha / NIB</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Nomor Registrasi Resmi (Opsional)
              </label>
              <input
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="Contoh: IDM000981729 / NIB 12893..."
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Entitas Pemegang Hak Legal *
              </label>
              <input
                type="text"
                required
                value={holdingEntity}
                onChange={(e) => setHoldingEntity(e.target.value)}
                placeholder="Contoh: PT Digital Inovasi Nusantara"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Tanggal Kedaluwarsa *
              </label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Biaya Perpanjangan (Rp)
              </label>
              <input
                type="number"
                min="0"
                value={costPerRenewal || ''}
                onChange={(e) => setCostPerRenewal(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Rp 0"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as IpLicenseItem['status'])}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950 bg-white"
              >
                <option value="Aktif & Sah">Aktif & Sah</option>
                <option value="Mendekati Kedaluwarsa">Mendekati Kedaluwarsa</option>
                <option value="Proses Perpanjangan">Proses Perpanjangan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Catatan / Registrar / Keterangan
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Registrar Cloudflare, Auto-renew aktif kartu kredit perusahaan"
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
              Simpan Aset IP
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
