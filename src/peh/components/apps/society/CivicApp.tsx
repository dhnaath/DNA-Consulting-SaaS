import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { CivicItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const CivicApp: React.FC = () => {
  const { civicContacts, addCivicContact, deleteCivicContact, activeSubMenu, setActiveSubMenu } = usePEH();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [nameOrOfficial, setNameOrOfficial] = useState('');
  const [role, setRole] = useState<CivicItem['role']>('Ketua RT / RW');
  const [areaName, setAreaName] = useState('');
  const [phone, setPhone] = useState('');
  const [isEmergencyContact, setIsEmergencyContact] = useState(false);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const currentTab = activeSubMenu === 'default' ? 'directory' : activeSubMenu;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameOrOfficial.trim() || !areaName.trim() || !phone.trim()) return;

    addCivicContact({
      nameOrOfficial: nameOrOfficial.trim(),
      role,
      areaName: areaName.trim(),
      phone: phone.trim(),
      isEmergencyContact,
      address: address.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setNameOrOfficial('');
    setRole('Ketua RT / RW');
    setAreaName('');
    setPhone('');
    setIsEmergencyContact(false);
    setAddress('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const filteredContacts = civicContacts.filter((c) => {
    if (currentTab === 'emergency-hotline') {
      return c.isEmergencyContact;
    }
    if (currentTab === 'area-zones') {
      return c.role === 'Fasilitas Umum' || c.role === 'Warga Koordinator';
    }
    return true; // 'directory'
  });

  const emergencyCount = civicContacts.filter(c => c.isEmergencyContact).length;

  return (
    <div className="space-y-6">
      {/* Submenu navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubMenu('directory')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'directory'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Contact" className="h-4 w-4" />
            Pengurus & Kontak Sipil
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              currentTab === 'directory' ? 'bg-emerald-800 text-emerald-100' : 'bg-stone-200 text-stone-700'
            }`}>
              {civicContacts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubMenu('emergency-hotline')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'emergency-hotline'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Siren" className="h-4 w-4 text-red-400" />
            Kontak Darurat Lingkungan
            {emergencyCount > 0 && (
              <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-800 rounded-full font-bold">
                {emergencyCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubMenu('area-zones')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'area-zones'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Landmark" className="h-4 w-4" />
            Fasilitas & Koordinator Zona
          </button>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-900 text-white text-sm font-medium rounded-lg hover:bg-emerald-800 transition-colors shadow-xs"
        >
          <Icon name="Plus" className="h-4 w-4" />
          Tambah Kontak Warga / RT
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Kontak Pengurus Warga</p>
          <p className="text-2xl font-semibold text-stone-900 mt-1 tabular-nums">{civicContacts.length}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Jalur Cepat Kontak Darurat</p>
          <p className="text-2xl font-semibold text-red-600 mt-1 tabular-nums">{emergencyCount}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Ketua Lingkungan (RT/RW)</p>
          <p className="text-2xl font-semibold text-emerald-900 mt-1 tabular-nums">
            {civicContacts.filter(c => c.role === 'Ketua RT / RW').length}
          </p>
        </div>
      </div>

      {/* Content list or empty state */}
      {filteredContacts.length === 0 ? (
        <EmptyState
          title={
            currentTab === 'emergency-hotline'
              ? 'Belum Ada Kontak Darurat Lingkungan'
              : currentTab === 'area-zones'
              ? 'Belum Ada Fasilitas Umum atau Koordinator Zona'
              : 'Belum Ada Kontak Pengurus Lingkungan & Warga'
          }
          description="Catat kontak Ketua RT/RW, petugas keamanan pos ronda, koordinator sampah/kebersihan, dan nomor darurat warga sekitar agar mudah dihubungi kapan saja."
          actionLabel="Tambah Kontak Pengurus Pertama"
          onAction={() => setIsAddModalOpen(true)}
          iconName="Building2"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`bg-white rounded-xl border p-5 transition-all flex flex-col justify-between ${
                contact.isEmergencyContact
                  ? 'border-red-300 ring-1 ring-red-100 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-800 rounded-md">
                      {contact.role}
                    </span>
                    {contact.isEmergencyContact && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-red-100 text-red-700 rounded-md inline-flex items-center gap-1">
                        <Icon name="AlertTriangle" className="h-3 w-3" />
                        Darurat 24 Jam
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => deleteCivicContact(contact.id)}
                    className="text-stone-400 hover:text-red-600 transition-colors p-1"
                    title="Hapus Kontak"
                  >
                    <Icon name="Trash2" className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="text-base font-semibold text-stone-900 mt-2.5">{contact.nameOrOfficial}</h3>
                <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                  <Icon name="MapPin" className="h-3 w-3 text-stone-400" />
                  {contact.areaName}
                </p>

                <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-100 space-y-1.5 text-xs text-stone-700">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-medium">Telepon / WhatsApp:</span>
                    <a
                      href={`tel:${contact.phone}`}
                      className="font-mono font-semibold text-emerald-800 hover:underline"
                    >
                      {contact.phone}
                    </a>
                  </div>
                  {contact.address && (
                    <div className="text-stone-600 pt-1 border-t border-stone-200/60">
                      <span className="text-stone-500">Alamat / Pos:</span> {contact.address}
                    </div>
                  )}
                </div>

                {contact.notes && (
                  <p className="mt-3 text-xs text-stone-500 italic">
                    "{contact.notes}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span>Didaftarkan {new Date(contact.createdAt).toLocaleDateString('id-ID')}</span>
                <span className="text-emerald-700 font-medium">Lingkungan Aktif</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Daftarkan Kontak Pengurus Warga / RT"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Nama Pejabat / Pos / Petugas *
            </label>
            <input
              type="text"
              required
              value={nameOrOfficial}
              onChange={(e) => setNameOrOfficial(e.target.value)}
              placeholder="Contoh: Pak RT Bambang, Pos Satpam Gerbang Barat"
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Peran / Tanggung Jawab *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as CivicItem['role'])}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900 bg-white"
              >
                <option value="Ketua RT / RW">Ketua RT / RW</option>
                <option value="Petugas Keamanan / Ronda">Petugas Keamanan / Ronda</option>
                <option value="Petugas Sampah / Kebersihan">Petugas Sampah / Kebersihan</option>
                <option value="Kader Posyandu">Kader Posyandu</option>
                <option value="Warga Koordinator">Warga Koordinator</option>
                <option value="Fasilitas Umum">Fasilitas Umum</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Wilayah / Blok RT-RW *
              </label>
              <input
                type="text"
                required
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                placeholder="Contoh: RT 03 / RW 07 Cluster Pinus"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Nomor HP / Hotline *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Alamat Rumah / Pos Jaga (Opsional)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="No. Rumah / Patokan"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <input
              type="checkbox"
              id="isEmergencyContact"
              checked={isEmergencyContact}
              onChange={(e) => setIsEmergencyContact(e.target.checked)}
              className="h-4 w-4 text-emerald-900 rounded-md focus:ring-emerald-900"
            />
            <label htmlFor="isEmergencyContact" className="text-xs text-amber-900 font-medium">
              Tandai sebagai Kontak Darurat Prioritas Warga (Hotline Siaga 24 Jam)
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Catatan / Jadwal Pelayanan
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Jadwal pengangkutan sampah tiap Selasa & Jumat pagi"
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900"
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
              className="px-4 py-2 text-xs font-medium bg-emerald-900 text-white rounded-lg hover:bg-emerald-800 transition-colors"
            >
              Simpan Kontak Warga
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
