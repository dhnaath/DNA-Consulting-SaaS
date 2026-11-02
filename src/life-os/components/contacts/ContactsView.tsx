import React, { useState, useMemo } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { ContactItem, ContactCategory } from '../../types';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Building2,
  Calendar,
  Star,
  Trash2,
  Edit2,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  Table as TableIcon,
  Cake,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

const CATEGORIES: { id: string; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'favorite', label: '★ Favorit' },
  { id: 'Teman', label: 'Teman' },
  { id: 'Keluarga', label: 'Keluarga' },
  { id: 'Rekan Kerja', label: 'Rekan Kerja' },
  { id: 'Klien', label: 'Klien' },
  { id: 'Mentor', label: 'Mentor' },
  { id: 'Vendor', label: 'Vendor' },
];

const CATEGORY_STYLES: Record<ContactCategory, { bg: string; text: string; border: string }> = {
  'Teman': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200/70' },
  'Keluarga': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200/70' },
  'Rekan Kerja': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200/70' },
  'Klien': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200/70' },
  'Mentor': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200/70' },
  'Vendor': { bg: 'bg-neutral-100', text: 'text-neutral-700', border: 'border-neutral-200/70' },
};

export const ContactsView: React.FC = () => {
  const { contacts, deleteContact, toggleFavoriteContact, openModal, searchQuery } = useLifeOS();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'gallery' | 'table'>('gallery');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [activeContactDetail, setActiveContactDetail] = useState<ContactItem | null>(null);

  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      // Category filter
      if (selectedCategory === 'favorite') {
        if (!c.favorite) return false;
      } else if (selectedCategory !== 'all') {
        if (c.category !== selectedCategory) return false;
      }

      // Search term
      const query = (searchQuery || localSearch).toLowerCase().trim();
      if (query) {
        const matchName = c.name.toLowerCase().includes(query) || (c.nickname && c.nickname.toLowerCase().includes(query));
        const matchCompany = c.company?.toLowerCase().includes(query);
        const matchRole = c.role.toLowerCase().includes(query);
        const matchEmail = c.email.toLowerCase().includes(query);
        const matchTag = c.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchName && !matchCompany && !matchRole && !matchEmail && !matchTag) {
          return false;
        }
      }

      return true;
    });
  }, [contacts, selectedCategory, searchQuery, localSearch]);

  // Birthday upcoming (next 30 days)
  const upcomingBirthdays = useMemo(() => {
    return contacts.filter((c) => {
      if (!c.birthday) return false;
      return true;
    });
  }, [contacts]);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 transition-all select-none">
      {/* Top Banner & Title matching Notion */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                  Kontak
                </h1>
                <span className="px-2 py-0.5 text-xs font-mono-nums bg-neutral-100 text-neutral-600 rounded-sm">
                  {contacts.length} orang
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Buku alamat personal, relasi keluarga & profesional, log interaksi, dan database jaringan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal('contact')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#2383E2] hover:bg-[#1B74C9] rounded-md shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Kontak</span>
            </button>
          </div>
        </div>

        {/* Birthday / Highlight notification strip */}
        <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200/60 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-amber-900 font-medium">
            <Cake className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Catatan Ulang Tahun: Pastikan mengirim ucapan hangat atau reservasi makan malam untuk kontak prioritas keluarga & mentor bulan ini.
            </span>
          </div>
          <span className="text-[11px] text-amber-700 font-mono-nums shrink-0">
            {upcomingBirthdays.length} kontak tercatat tgl ultah
          </span>
        </div>
      </div>

      {/* Filter and View Bar */}
      <div className="bg-white rounded-lg border border-neutral-200/70 p-3 shadow-2xs mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Categories Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* View Switcher & Search */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-50 rounded-md border border-neutral-200/70 text-xs">
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Cari nama, role, kantor..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="bg-transparent outline-hidden w-28 sm:w-40 text-neutral-700 placeholder:text-neutral-400 text-xs"
            />
          </div>

          <div className="flex items-center bg-neutral-100 p-0.5 rounded-md border border-neutral-200/60">
            <button
              onClick={() => setViewMode('gallery')}
              className={`p-1 rounded-sm transition-colors ${
                viewMode === 'gallery' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-800'
              }`}
              title="Gallery Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded-sm transition-colors ${
                viewMode === 'table' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-800'
              }`}
              title="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Grid View */}
      {viewMode === 'gallery' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredContacts.map((contact) => {
            const catStyle = CATEGORY_STYLES[contact.category] || CATEGORY_STYLES['Teman'];
            const initials = contact.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();

            return (
              <div
                key={contact.id}
                onClick={() => setActiveContactDetail(contact)}
                className="bg-white rounded-lg border border-neutral-200/70 hover:border-neutral-300 p-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Avatar & Star */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-2xs"
                        style={{ backgroundColor: contact.avatarBg || '#2563EB' }}
                      >
                        {initials}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-neutral-800 group-hover:text-blue-600 transition-colors leading-tight">
                          {contact.name}
                        </h3>
                        {contact.nickname && (
                          <span className="text-[11px] text-neutral-400">
                            "{contact.nickname}"
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteContact(contact.id);
                      }}
                      className="p-1 text-neutral-300 hover:text-amber-500 transition-colors"
                      title={contact.favorite ? 'Hapus favorit' : 'Tandai favorit'}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          contact.favorite ? 'fill-amber-400 text-amber-500' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Role & Company */}
                  <div className="space-y-1 mb-3">
                    <div className="text-xs font-medium text-neutral-700 truncate">
                      {contact.role}
                    </div>
                    {contact.company && (
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 truncate">
                        <Building2 className="w-3 h-3 text-neutral-400 shrink-0" />
                        <span>{contact.company}</span>
                      </div>
                    )}
                  </div>

                  {/* Category Pill */}
                  <div className="mb-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-xs border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                    >
                      {contact.category}
                    </span>
                  </div>

                  {/* Contact Methods */}
                  <div className="space-y-1.5 text-xs text-neutral-600 font-mono-nums">
                    <a
                      href={`tel:${contact.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{contact.phone}</span>
                    </a>
                    <a
                      href={`mailto:${contact.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate font-sans-body">{contact.email}</span>
                    </a>
                  </div>

                  {/* Tags */}
                  {contact.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {contact.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 bg-neutral-100 text-neutral-600 text-[9px] rounded-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer notes & actions */}
                <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-400">
                  <span>
                    Kontak: {contact.lastContacted || 'Belum dicatat'}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteContact(contact.id);
                      }}
                      className="p-1 hover:text-rose-600 rounded-sm"
                      title="Hapus kontak"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-lg border border-neutral-200/70 shadow-2xs overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200/60 bg-neutral-50/50 text-neutral-500 font-medium">
                <th className="py-2.5 px-3 w-8 text-center">★</th>
                <th className="py-2.5 px-3">Nama</th>
                <th className="py-2.5 px-3">Kategori</th>
                <th className="py-2.5 px-3">Pekerjaan / Perusahaan</th>
                <th className="py-2.5 px-3">Nomor Telepon</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Ulang Tahun</th>
                <th className="py-2.5 px-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredContacts.map((c) => {
                const catStyle = CATEGORY_STYLES[c.category] || CATEGORY_STYLES['Teman'];
                return (
                  <tr
                    key={c.id}
                    onClick={() => setActiveContactDetail(c)}
                    className="hover:bg-[#F7F7F5] transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3 text-center align-middle">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteContact(c.id);
                        }}
                        className="text-neutral-300 hover:text-amber-500"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            c.favorite ? 'fill-amber-400 text-amber-500' : ''
                          }`}
                        />
                      </button>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-neutral-800 align-middle">
                      <span>{c.name}</span>
                      {c.nickname && (
                        <span className="text-neutral-400 font-normal ml-1">
                          ({c.nickname})
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 align-middle">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-xs border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                      >
                        {c.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-neutral-700 align-middle">
                      <span className="font-medium">{c.role}</span>
                      {c.company && (
                        <span className="text-neutral-400 ml-1">· {c.company}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono-nums text-neutral-600 align-middle">
                      {c.phone}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-600 align-middle font-mono-nums">
                      {c.email}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-500 font-mono-nums align-middle">
                      {c.birthday || '—'}
                    </td>
                    <td className="py-2.5 px-2 text-right align-middle">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteContact(c.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-rose-600 transition-opacity"
                        title="Hapus kontak"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredContacts.length === 0 && (
        <div className="bg-white rounded-lg border border-neutral-200/70 p-12 text-center text-xs text-neutral-400 shadow-2xs">
          <Users className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
          <p>Tidak ada kontak ditemukan dalam kategori ini.</p>
          <button
            onClick={() => openModal('contact')}
            className="mt-3 px-3 py-1.5 bg-[#2383E2] text-white rounded-md text-xs font-medium"
          >
            + Tambah Kontak Baru
          </button>
        </div>
      )}

      {/* Contact Detail Modal */}
      {activeContactDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base shadow-xs"
                  style={{ backgroundColor: activeContactDetail.avatarBg || '#2563EB' }}
                >
                  {activeContactDetail.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif-title text-2xl font-normal text-neutral-900 leading-tight">
                    {activeContactDetail.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-neutral-500">{activeContactDetail.role}</span>
                    {activeContactDetail.company && (
                      <span className="text-xs text-neutral-400">· {activeContactDetail.company}</span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveContactDetail(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-200/50">
                <span className="text-neutral-400">Kategori:</span>
                <span className="font-medium text-neutral-800">{activeContactDetail.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200/50">
                <span className="text-neutral-400">Nomor Telepon:</span>
                <a href={`tel:${activeContactDetail.phone}`} className="font-mono-nums text-blue-600 hover:underline">
                  {activeContactDetail.phone}
                </a>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200/50">
                <span className="text-neutral-400">Email:</span>
                <a href={`mailto:${activeContactDetail.email}`} className="font-mono-nums text-blue-600 hover:underline">
                  {activeContactDetail.email}
                </a>
              </div>
              {activeContactDetail.birthday && (
                <div className="flex justify-between py-1 border-b border-neutral-200/50">
                  <span className="text-neutral-400">Ulang Tahun:</span>
                  <span className="font-mono-nums text-neutral-800">{activeContactDetail.birthday}</span>
                </div>
              )}
              {activeContactDetail.instagram && (
                <div className="flex justify-between py-1 border-b border-neutral-200/50">
                  <span className="text-neutral-400">Instagram:</span>
                  <span className="text-neutral-800">{activeContactDetail.instagram}</span>
                </div>
              )}
              {activeContactDetail.linkedin && (
                <div className="flex justify-between py-1 border-b border-neutral-200/50">
                  <span className="text-neutral-400">LinkedIn:</span>
                  <span className="text-neutral-800">{activeContactDetail.linkedin}</span>
                </div>
              )}
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Terakhir Kontak:</span>
                <span className="font-mono-nums text-neutral-800">{activeContactDetail.lastContacted || '—'}</span>
              </div>
            </div>

            {activeContactDetail.notes && (
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                  Catatan Interaksi & Kolaborasi
                </span>
                <p className="text-xs text-neutral-700 leading-relaxed p-2.5 bg-white border border-neutral-200 rounded-md">
                  {activeContactDetail.notes}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/${activeContactDetail.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-medium"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${activeContactDetail.phone}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-medium"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Telepon</span>
                </a>
              </div>
              <button
                onClick={() => setActiveContactDetail(null)}
                className="px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-800"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
