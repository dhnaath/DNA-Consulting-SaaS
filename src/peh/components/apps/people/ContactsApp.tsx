import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { ContactItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const ContactsApp: React.FC = () => {
  const {
    contacts,
    addContact,
    recordContactInteraction,
    deleteContact,
    activeSubMenu,
    setActiveSubMenu,
  } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterRel, setFilterRel] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState<ContactItem['relationship']>('Sahabat');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [howWeMet, setHowWeMet] = useState('');
  const [cadenceDays, setCadenceDays] = useState('30');
  const [notes, setNotes] = useState('');
  const [tagInput, setTagInput] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    addContact({
      fullName: fullName.trim(),
      relationship,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      howWeMet: howWeMet.trim() || undefined,
      contactCadenceDays: Number(cadenceDays) || 30,
      tags,
      notes: notes.trim() || undefined,
    });

    setFullName('');
    setPhone('');
    setEmail('');
    setHowWeMet('');
    setNotes('');
    setTagInput('');
    setIsAddModalOpen(false);
  };

  const filteredContacts = contacts.filter((c) => {
    const matchRel = filterRel === 'Semua' || c.relationship === filterRel;
    const matchSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.notes && c.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.howWeMet && c.howWeMet.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchRel && matchSearch;
  });

  // Calculate days since last contact
  const getDaysSinceContact = (lastDate?: string) => {
    if (!lastDate) return null;
    const now = new Date().getTime();
    const past = new Date(lastDate).getTime();
    return Math.floor((now - past) / (1000 * 60 * 60 * 24));
  };

  // Contacts that need check-in based on cadence
  const needCheckInContacts = contacts.filter((c) => {
    const days = getDaysSinceContact(c.lastContactedDate);
    if (days === null) return true; // never contacted
    return days >= c.contactCadenceDays;
  });

  const relationships: ContactItem['relationship'][] = [
    'Keluarga Inti',
    'Keluarga Besar',
    'Sahabat',
    'Rekan Kerja',
    'Mentor / Guru',
    'Kenalan',
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-100">
              <Icon name="Contact" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Jejaring & Relasi (Personal CRM)
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Buku kontak relasi personal, pantauan sapaan berkala, dan dokumentasi interaksi silaturahmi.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Tambah Kontak Relasi</span>
        </button>
      </div>

      {/* Submenus */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex p-1 bg-neutral-100 rounded-lg text-xs font-medium">
          {[
            { id: 'all-contacts', label: 'Daftar Kontak Relasi', count: contacts.length },
            { id: 'cadence', label: 'Radar Sapaan Berkala', count: needCheckInContacts.length },
            { id: 'circles', label: 'Lingkaran & Kategori' },
          ].map((tab) => {
            const isActive = activeSubMenu === tab.id || (!activeSubMenu && tab.id === 'all-contacts');
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
          <div className="relative">
            <Icon name="Search" size={13} className="absolute left-2.5 top-2.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Cari kontak relasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 w-44"
            />
          </div>
        </div>
      </div>

      {contacts.length === 0 ? (
        <EmptyState
          iconName="Contact"
          title="Belum ada kontak relasi yang disimpan"
          description="Tambahkan teman dekat, mentor karier, atau kerabat untuk menjaga silaturahmi secara konsisten dengan jadwal sapaan berkala."
          actionLabel="Tambah Kontak Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <>
          {/* All Contacts View */}
          {(activeSubMenu === 'all-contacts' || !activeSubMenu) && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500">Filter Hubungan:</span>
                <select
                  value={filterRel}
                  onChange={(e) => setFilterRel(e.target.value)}
                  className="text-xs px-2.5 py-1.5 border border-neutral-200 rounded-lg bg-white"
                >
                  <option value="Semua">Semua Hubungan ({contacts.length})</option>
                  {relationships.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100">
                {filteredContacts.map((contact) => {
                  const daysSince = getDaysSinceContact(contact.lastContactedDate);
                  const isOverdue = daysSince === null || daysSince >= contact.contactCadenceDays;

                  return (
                    <div
                      key={contact.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/50"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-neutral-900 text-sm">{contact.fullName}</span>
                          {isOverdue && (
                            <span className="text-[10px] text-amber-600 font-medium">· Perlu Disapa</span>
                          )}
                        </div>

                        {/* Zero-pill metadata */}
                        <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1 flex-wrap">
                          <span>{contact.relationship}</span>
                          {contact.phone && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono">{contact.phone}</span>
                            </>
                          )}
                          {contact.howWeMet && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>Pertemuan: {contact.howWeMet}</span>
                            </>
                          )}
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-neutral-600">
                            Siklus sapa: tiap {contact.contactCadenceDays} hari
                          </span>
                        </div>

                        {contact.notes && (
                          <p className="text-xs text-neutral-600 mt-1.5 italic">"{contact.notes}"</p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-xs font-mono text-neutral-700">
                            {contact.lastContactedDate ? `Terakhir: ${contact.lastContactedDate}` : 'Belum pernah disapa'}
                          </div>
                          <div className="text-[11px] text-neutral-400">
                            {daysSince !== null ? `${daysSince} hari lalu` : 'Waktunya kontak'}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => recordContactInteraction(contact.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200/80 rounded-lg transition-colors cursor-pointer"
                          title="Tandai telah berinteraksi/menghubungi hari ini"
                        >
                          <Icon name="Check" size={13} />
                          <span>Sapa Hari Ini</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteContact(contact.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded-md transition-colors"
                        >
                          <Icon name="Trash2" size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cadence Check-in View */}
          {activeSubMenu === 'cadence' && (
            <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-neutral-900">Radar Sapaan & Silaturahmi</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Daftar sahabat dan relasi yang belum dihubungi melebihi siklus hari yang Anda tentukan.
                </p>
              </div>

              {needCheckInContacts.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-400">
                  Semua relasi Anda telah disapa sesuai jadwal! Hubungan sosial Anda terjaga sangat baik.
                </div>
              ) : (
                <div className="space-y-3">
                  {needCheckInContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="p-3.5 border border-neutral-200 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-semibold text-neutral-900">{contact.fullName}</div>
                        <div className="text-[11px] text-neutral-500">
                          {contact.relationship} {contact.phone && `· ${contact.phone}`}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-amber-600 font-medium">
                          Target: tiap {contact.contactCadenceDays} hari
                        </span>
                        <button
                          type="button"
                          onClick={() => recordContactInteraction(contact.id)}
                          className="px-3 py-1 text-xs font-medium text-white bg-neutral-900 rounded-md hover:bg-neutral-800 transition-colors"
                        >
                          Tandai Selesai
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Circles View */}
          {activeSubMenu === 'circles' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relationships.map((rel) => {
                const group = contacts.filter((c) => c.relationship === rel);
                return (
                  <div key={rel} className="p-4 bg-white border border-neutral-200 rounded-xl">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100">
                      <h4 className="text-xs font-semibold text-neutral-900">{rel}</h4>
                      <span className="text-xs font-mono text-neutral-400 tabular-nums">
                        {group.length} kontak
                      </span>
                    </div>

                    {group.length === 0 ? (
                      <div className="py-4 text-center text-xs text-neutral-400">
                        Belum ada kontak di lingkaran ini.
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {group.map((c) => (
                          <div key={c.id} className="text-xs text-neutral-700 py-1 flex items-center justify-between">
                            <span>{c.fullName}</span>
                            <span className="text-[11px] font-mono text-neutral-400">{c.phone || c.email || '—'}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Add Contact Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Kontak Relasi"
        subtitle="Simpan data jejaring personal dan tentukan frekuensi silaturahmi."
        maxWidth="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Nama Lengkap / Panggilan *
            </label>
            <input
              type="text"
              required
              placeholder="Misal: Dimas Pratama, Ibu Ratna (Mentor)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Hubungan</label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value as any)}
                className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg bg-white"
              >
                {relationships.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Frekuensi Sapaan (Hari)
              </label>
              <input
                type="number"
                min="7"
                required
                value={cadenceDays}
                onChange={(e) => setCadenceDays(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg font-mono tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Nomor WhatsApp / Telp</label>
              <input
                type="text"
                placeholder="081234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Alamat Surel (Email)</label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Di Mana / Bagaimana Berkenalan?
            </label>
            <input
              type="text"
              placeholder="Teman kuliah, konferensi teknologi, reuni SMA"
              value={howWeMet}
              onChange={(e) => setHowWeMet(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Catatan Penting Pribadi
            </label>
            <input
              type="text"
              placeholder="Topik diskusi favorit, minat hobi, hal yang disenangi"
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
              Simpan Kontak
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
