import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { FamilyHealthItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const FamilyHealthApp: React.FC = () => {
  const { familyHealth, addFamilyHealth, deleteFamilyHealth, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [memberName, setMemberName] = useState('');
  const [bloodType, setBloodType] = useState<FamilyHealthItem['bloodType']>('O+');
  const [allergiesInput, setAllergiesInput] = useState('');
  const [chronicInput, setChronicInput] = useState('');
  const [medicinesInput, setMedicinesInput] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [lastCheckup, setLastCheckup] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;

    const parseList = (str: string) =>
      str
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    addFamilyHealth({
      memberName: memberName.trim(),
      bloodType,
      allergies: parseList(allergiesInput),
      chronicConditions: parseList(chronicInput),
      regularMedicines: parseList(medicinesInput),
      emergencyContact: emergencyContact.trim() || undefined,
      lastMedicalCheckup: lastCheckup || undefined,
      notes: notes.trim() || undefined,
    });

    setMemberName('');
    setAllergiesInput('');
    setChronicInput('');
    setMedicinesInput('');
    setEmergencyContact('');
    setLastCheckup('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const bloodTypes: FamilyHealthItem['bloodType'][] = [
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
    'Belum Diketahui',
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-100">
              <Icon name="Activity" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Kesehatan & Rekam Medis
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Sentralisasi data golongan darah, riwayat alergi obat, penyakit kronis, dan kontak darurat medis.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Tambah Profil Medis</span>
        </button>
      </div>

      {/* Submenus */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex p-1 bg-neutral-100 rounded-lg text-xs font-medium">
          {[
            { id: 'profiles', label: 'Profil Darah & Alergi', count: familyHealth.length },
            { id: 'emergency', label: 'Kartu Kontak Darurat' },
            { id: 'meds', label: 'Pengobatan Rutin' },
          ].map((tab) => {
            const isActive = activeSubMenu === tab.id || (!activeSubMenu && tab.id === 'profiles');
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubMenu(tab.id)}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {familyHealth.length === 0 ? (
        <EmptyState
          iconName="Activity"
          title="Belum ada rekam medis anggota keluarga"
          description="Catat golongan darah dan alergi obat kritis untuk seluruh anggota keluarga agar penanganan medis darurat dapat dilakukan dengan aman dan cepat."
          actionLabel="Tambah Profil Medis Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {familyHealth.map((profile) => (
            <div
              key={profile.id}
              className="p-5 bg-white border border-neutral-200 rounded-xl flex flex-col justify-between hover:border-neutral-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-neutral-900">{profile.memberName}</h3>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      Golongan Darah: <strong className="text-neutral-900 font-mono">{profile.bloodType}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteFamilyHealth(profile.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 rounded-md transition-colors"
                    title="Hapus"
                  >
                    <Icon name="Trash2" size={14} />
                  </button>
                </div>

                <div className="space-y-2 text-xs pt-2 border-t border-neutral-100">
                  {profile.allergies.length > 0 && (
                    <div>
                      <span className="font-semibold text-neutral-800">Alergi Teridentifikasi:</span>
                      <p className="text-amber-700 mt-0.5 font-medium">{profile.allergies.join(', ')}</p>
                    </div>
                  )}

                  {profile.chronicConditions.length > 0 && (
                    <div>
                      <span className="font-semibold text-neutral-800">Riwayat / Kondisi Kronis:</span>
                      <p className="text-neutral-600 mt-0.5">{profile.chronicConditions.join(', ')}</p>
                    </div>
                  )}

                  {profile.regularMedicines.length > 0 && (
                    <div>
                      <span className="font-semibold text-neutral-800">Konsumsi Obat Rutin:</span>
                      <p className="text-neutral-600 mt-0.5">{profile.regularMedicines.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>

              {profile.emergencyContact && (
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-neutral-500">Kontak Darurat:</span>
                  <span className="font-mono text-neutral-900 font-medium">{profile.emergencyContact}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Health Profile Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Catat Rekam Medis Keluarga"
        subtitle="Simpan catatan alergi dan golongan darah keluarga."
        maxWidth="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Nama Anggota Keluarga *
            </label>
            <input
              type="text"
              required
              placeholder="Misal: Ayah, Ibu, Adik"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Golongan Darah</label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value as any)}
                className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg bg-white"
              >
                {bloodTypes.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Kontak Darurat</label>
              <input
                type="text"
                placeholder="08123456789 (Dokter/RS)"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Alergi Obat / Makanan (Pisahkan koma)
            </label>
            <input
              type="text"
              placeholder="Antibiotik Penisilin, Seafood, Debu"
              value={allergiesInput}
              onChange={(e) => setAllergiesInput(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Penyakit / Kondisi Khusus (Pisahkan koma)
            </label>
            <input
              type="text"
              placeholder="Hipertensi, Asma, Diabetes"
              value={chronicInput}
              onChange={(e) => setChronicInput(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Obat Rutin Yang Diminum (Pisahkan koma)
            </label>
            <input
              type="text"
              placeholder="Amlodipine 5mg, Inhaler"
              value={medicinesInput}
              onChange={(e) => setMedicinesInput(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
            >
              Simpan Profil Medis
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
