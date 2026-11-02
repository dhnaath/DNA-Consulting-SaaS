import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { FamilyMemberItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const FamilyTreeApp: React.FC = () => {
  const { familyMembers, addFamilyMember, deleteFamilyMember, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterGen, setFilterGen] = useState<string>('Semua');

  // Form states
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<FamilyMemberItem['role']>('Orang Tua');
  const [generationLevel, setGenerationLevel] = useState<'1' | '2' | '3' | '4'>('3');
  const [birthDate, setBirthDate] = useState('');
  const [birthCity, setBirthCity] = useState('');
  const [phone, setPhone] = useState('');
  const [domicileCity, setDomicileCity] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    addFamilyMember({
      fullName: fullName.trim(),
      role,
      generationLevel: Number(generationLevel) as 1 | 2 | 3 | 4,
      birthDate: birthDate || undefined,
      birthCity: birthCity.trim() || undefined,
      phone: phone.trim() || undefined,
      domicileCity: domicileCity.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setFullName('');
    setBirthDate('');
    setBirthCity('');
    setPhone('');
    setDomicileCity('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const filteredMembers = familyMembers.filter((m) => {
    if (filterGen === 'Semua') return true;
    return m.generationLevel.toString() === filterGen;
  });

  const getGenerationName = (gen: number) => {
    switch (gen) {
      case 1:
        return 'Generasi 1 (Kakek / Nenek / Sesepuh)';
      case 2:
        return 'Generasi 2 (Orang Tua / Paman / Bibi)';
      case 3:
        return 'Generasi 3 (Diri Sendiri / Pasangan / Sepupu)';
      case 4:
        return 'Generasi 4 (Anak / Keponakan / Cucu)';
      default:
        return `Generasi ${gen}`;
    }
  };

  const roles: FamilyMemberItem['role'][] = [
    'Orang Tua',
    'Pasangan',
    'Anak',
    'Kakek / Nenek',
    'Paman / Bibi',
    'Sepupu',
    'Keponakan',
    'Lainnya',
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-100">
              <Icon name="GitMerge" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Silsilah & Anggota Keluarga
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Arsip silsilah trah keluarga, profil anggota lintas generasi, dan direktori domisili kota.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Tambah Anggota Keluarga</span>
        </button>
      </div>

      {/* Submenus */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex p-1 bg-neutral-100 rounded-lg text-xs font-medium">
          {[
            { id: 'members', label: 'Daftar Anggota', count: familyMembers.length },
            { id: 'generations', label: 'Tingkatan Generasi' },
            { id: 'directory', label: 'Buku Alamat Domisili' },
          ].map((tab) => {
            const isActive = activeSubMenu === tab.id || (!activeSubMenu && tab.id === 'members');
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

        <div className="flex items-center gap-2">
          <select
            value={filterGen}
            onChange={(e) => setFilterGen(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-neutral-200 rounded-lg bg-white"
          >
            <option value="Semua">Semua Generasi</option>
            <option value="1">Generasi 1 (Sesepuh)</option>
            <option value="2">Generasi 2 (Orang Tua)</option>
            <option value="3">Generasi 3 (Kita/Sepupu)</option>
            <option value="4">Generasi 4 (Anak/Cucu)</option>
          </select>
        </div>
      </div>

      {familyMembers.length === 0 ? (
        <EmptyState
          iconName="GitMerge"
          title="Silsilah keluarga belum dicatat"
          description="Dokumentasikan garis keturunan keluarga besar Anda, kota kelahiran, dan nomor kontak agar tali persaudaraan tidak terputus."
          actionLabel="Tambah Anggota Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <>
          {/* Members List */}
          {(activeSubMenu === 'members' || !activeSubMenu) && (
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/50"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0 font-bold text-xs">
                      G{member.generationLevel}
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900 text-sm">{member.fullName}</div>
                      {/* Zero-pill metadata */}
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5 flex-wrap">
                        <span className="font-medium text-neutral-800">{member.role}</span>
                        <span aria-hidden="true">·</span>
                        <span>{getGenerationName(member.generationLevel)}</span>
                        {member.domicileCity && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>Domisili: {member.domicileCity}</span>
                          </>
                        )}
                        {member.birthCity && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>Lahir di {member.birthCity}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {member.phone && (
                      <span className="text-xs font-mono text-neutral-600">{member.phone}</span>
                    )}
                    <button
                      onClick={() => deleteFamilyMember(member.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 rounded-md transition-colors"
                      title="Hapus"
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Generations View */}
          {activeSubMenu === 'generations' && (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((gen) => {
                const group = familyMembers.filter((m) => m.generationLevel === gen);
                return (
                  <div key={gen} className="bg-white border border-neutral-200 rounded-xl p-5">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
                      <h4 className="text-sm font-semibold text-neutral-900">{getGenerationName(gen)}</h4>
                      <span className="text-xs font-mono text-neutral-400 tabular-nums">
                        {group.length} anggota
                      </span>
                    </div>

                    {group.length === 0 ? (
                      <div className="text-xs text-neutral-400 py-3 text-center">
                        Belum ada anggota terdaftar di tingkatan ini.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {group.map((m) => (
                          <div key={m.id} className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/50">
                            <div className="font-semibold text-xs text-neutral-900">{m.fullName}</div>
                            <div className="text-[11px] text-neutral-500 mt-0.5">
                              {m.role} {m.domicileCity && `· ${m.domicileCity}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Directory View */}
          {activeSubMenu === 'directory' && (
            <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-neutral-900">Buku Kontak & Domisili Keluarga</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Daftar kontak telepon dan persebaran kota domisili kerabat.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {familyMembers.map((m) => (
                  <div key={m.id} className="p-3.5 border border-neutral-100 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-neutral-900">{m.fullName}</div>
                      <div className="text-[11px] text-neutral-500">{m.role} · {m.domicileCity || 'Kota belum diisi'}</div>
                    </div>
                    <span className="text-xs font-mono text-neutral-700">{m.phone || '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Anggota Silsilah Keluarga"
        subtitle="Dokumentasikan profil kerabat dalam pohon keluarga."
        maxWidth="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Nama Lengkap *
            </label>
            <input
              type="text"
              required
              placeholder="Misal: H. Abdullah Mansyur, Siti Aisyah"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Peran / Hubungan</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg bg-white"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Tingkat Generasi</label>
              <select
                value={generationLevel}
                onChange={(e) => setGenerationLevel(e.target.value as any)}
                className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg bg-white"
              >
                <option value="1">Generasi 1 (Kakek / Nenek)</option>
                <option value="2">Generasi 2 (Orang Tua / Paman)</option>
                <option value="3">Generasi 3 (Diri / Sepupu)</option>
                <option value="4">Generasi 4 (Anak / Cucu)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Kota Kelahiran</label>
              <input
                type="text"
                placeholder="Yogyakarta, Surabaya"
                value={birthCity}
                onChange={(e) => setBirthCity(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Kota Domisili Saat Ini</label>
              <input
                type="text"
                placeholder="Jakarta Selatan, Bandung"
                value={domicileCity}
                onChange={(e) => setDomicileCity(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Nomor Telepon</label>
              <input
                type="text"
                placeholder="08123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Tanggal Lahir</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Catatan Tambahan</label>
            <input
              type="text"
              placeholder="Profesi, cabang keluarga, riwayat khusus"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              Simpan Anggota
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
