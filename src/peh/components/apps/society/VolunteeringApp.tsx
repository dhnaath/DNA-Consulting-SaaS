import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { VolunteerItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const VolunteeringApp: React.FC = () => {
  const { volunteers, addVolunteer, deleteVolunteer, activeSubMenu, setActiveSubMenu } = usePEH();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [initiativeTitle, setInitiativeTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [causeType, setCauseType] = useState<VolunteerItem['causeType']>('Pendidikan Anak');
  const [roleOrContribution, setRoleOrContribution] = useState('');
  const [hoursSpent, setHoursSpent] = useState<number>(2);
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [impactNotes, setImpactNotes] = useState('');

  const currentTab = activeSubMenu === 'default' ? 'initiatives' : activeSubMenu;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!initiativeTitle.trim() || !organization.trim() || !roleOrContribution.trim() || !eventDate) return;

    addVolunteer({
      initiativeTitle: initiativeTitle.trim(),
      organization: organization.trim(),
      causeType,
      roleOrContribution: roleOrContribution.trim(),
      hoursSpent: Number(hoursSpent) || 1,
      eventDate,
      impactNotes: impactNotes.trim() || undefined,
    });

    setInitiativeTitle('');
    setOrganization('');
    setCauseType('Pendidikan Anak');
    setRoleOrContribution('');
    setHoursSpent(2);
    setImpactNotes('');
    setIsAddModalOpen(false);
  };

  const totalHours = volunteers.reduce((acc, curr) => acc + (curr.hoursSpent || 0), 0);

  const filteredItems = volunteers.filter((item) => {
    if (currentTab === 'hour-log') {
      return item.hoursSpent > 0;
    }
    if (currentTab === 'causes') {
      return item.causeType === 'Kelestarian Lingkungan' || item.causeType === 'Kemanusiaan & Bencana';
    }
    return true; // 'initiatives'
  });

  return (
    <div className="space-y-6">
      {/* Submenu navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubMenu('initiatives')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'initiatives'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Smile" className="h-4 w-4" />
            Aksi & Organisasi
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              currentTab === 'initiatives' ? 'bg-emerald-800 text-emerald-100' : 'bg-stone-200 text-stone-700'
            }`}>
              {volunteers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubMenu('hour-log')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'hour-log'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Hourglass" className="h-4 w-4" />
            Log Jam Kontribusi
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              currentTab === 'hour-log' ? 'bg-emerald-800 text-emerald-100' : 'bg-stone-200 text-stone-700'
            }`}>
              {totalHours} Jam
            </span>
          </button>

          <button
            onClick={() => setActiveSubMenu('causes')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'causes'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Compass" className="h-4 w-4" />
            Fokus Lingkungan & Bencana
          </button>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-900 text-white text-sm font-medium rounded-lg hover:bg-emerald-800 transition-colors shadow-xs"
        >
          <Icon name="Plus" className="h-4 w-4" />
          Catat Keterlibatan Relawan
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Aksi Relawan</p>
          <p className="text-2xl font-semibold text-stone-900 mt-1 tabular-nums">{volunteers.length}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Jam Waktu Didedikasikan</p>
          <p className="text-2xl font-semibold text-emerald-900 mt-1 tabular-nums">
            {totalHours} <span className="text-sm font-normal text-stone-500">Jam Kontribusi</span>
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Organisasi / Mitra Sosial</p>
          <p className="text-2xl font-semibold text-stone-900 mt-1 tabular-nums">
            {new Set(volunteers.map(v => v.organization)).size}
          </p>
        </div>
      </div>

      {/* Main List or Empty State */}
      {filteredItems.length === 0 ? (
        <EmptyState
          title={
            currentTab === 'hour-log'
              ? 'Belum Ada Jam Kontribusi Sosial'
              : currentTab === 'causes'
              ? 'Belum Ada Aksi Lingkungan & Kemanusiaan'
              : 'Belum Ada Riwayat Keterlibatan Relawan'
          }
          description="Dedikasikan keahlian dan waktu Anda untuk pengajaran anak-anak, bakti sosial panti, aksi tanam pohon, atau respon bencana alam bersama organisasi sosial."
          actionLabel="Catat Kegiatan Relawan Pertama"
          onAction={() => setIsAddModalOpen(true)}
          iconName="HandHeart"
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
                  <span className="px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-800 rounded-md">
                    {item.causeType}
                  </span>
                  <button
                    onClick={() => deleteVolunteer(item.id)}
                    className="text-stone-400 hover:text-red-600 transition-colors p-1"
                    title="Hapus Rekaman"
                  >
                    <Icon name="Trash2" className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="text-base font-semibold text-stone-900 mt-2.5">{item.initiativeTitle}</h3>
                <p className="text-xs text-stone-500 font-medium mt-0.5">{item.organization}</p>

                <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-100 space-y-2 text-xs text-stone-700">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Peran / Tugas:</span>
                    <strong className="text-stone-900">{item.roleOrContribution}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Durasi Kontribusi:</span>
                    <span className="font-semibold text-emerald-800 tabular-nums">{item.hoursSpent} Jam</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Tanggal Pelaksanaan:</span>
                    <span>{item.eventDate}</span>
                  </div>
                </div>

                {item.impactNotes && (
                  <p className="mt-3 text-xs text-stone-600 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                    <span className="font-medium text-emerald-900">Dampak & Kesan: </span>
                    {item.impactNotes}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span>Tercatat {new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
                <span className="text-emerald-700 font-medium">Aksi Berkelanjutan</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Catat Kegiatan Relawan & Aksi Sosial"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Nama Kegiatan / Inisiatif *
            </label>
            <input
              type="text"
              required
              value={initiativeTitle}
              onChange={(e) => setInitiativeTitle(e.target.value)}
              placeholder="Contoh: Mengajar Anak Jalanan, Bersih Pantai Pesisir, Dapur Umum Bencana"
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Lembaga / Komunitas Penyelenggara *
              </label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Contoh: Yayasan Peduli Sesama, PMI, Indorelawan"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Bidang Kepedulian *
              </label>
              <select
                value={causeType}
                onChange={(e) => setCauseType(e.target.value as VolunteerItem['causeType'])}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900 bg-white"
              >
                <option value="Pendidikan Anak">Pendidikan Anak</option>
                <option value="Kemanusiaan & Bencana">Kemanusiaan & Bencana</option>
                <option value="Kelestarian Lingkungan">Kelestarian Lingkungan</option>
                <option value="Sosial & Panti">Sosial & Panti</option>
                <option value="Komunitas Warga">Komunitas Warga</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Jam Tercurah *
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                required
                value={hoursSpent}
                onChange={(e) => setHoursSpent(Number(e.target.value))}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900 tabular-nums"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Tanggal Kegiatan *
              </label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Peran Anda / Kontribusi Utama *
            </label>
            <input
              type="text"
              required
              value={roleOrContribution}
              onChange={(e) => setRoleOrContribution(e.target.value)}
              placeholder="Contoh: Fasilitator Matematika, Distribusi Logistik Sembako"
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Catatan Dampak & Refleksi Sosial
            </label>
            <textarea
              rows={2}
              value={impactNotes}
              onChange={(e) => setImpactNotes(e.target.value)}
              placeholder="Contoh: 45 anak terbantu, materi tersampaikan dengan gembira"
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
              Simpan Kontribusi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
