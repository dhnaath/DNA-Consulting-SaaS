import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { DocumentItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const DocumentsApp: React.FC = () => {
  const { documents, addDocument, deleteDocument, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentItem['category']>('Identitas & Sipil');
  const [identifierNumber, setIdentifierNumber] = useState('');
  const [physicalLocation, setPhysicalLocation] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [tagInput, setTagInput] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !physicalLocation.trim()) return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    addDocument({
      title: title.trim(),
      category,
      identifierNumber: identifierNumber.trim() || undefined,
      physicalLocation: physicalLocation.trim(),
      expiryDate: expiryDate || undefined,
      tags,
    });

    setTitle('');
    setIdentifierNumber('');
    setPhysicalLocation('');
    setExpiryDate('');
    setTagInput('');
    setIsAddModalOpen(false);
  };

  const filteredDocs = documents.filter((doc) => {
    const matchCat = filterCategory === 'Semua' || doc.category === filterCategory;
    const matchSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.physicalLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.identifierNumber && doc.identifierNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  // Calculate days remaining helper
  const getDaysRemaining = (expStr?: string) => {
    if (!expStr) return null;
    const now = new Date().getTime();
    const target = new Date(expStr).getTime();
    return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  };

  // Group by physical location
  const locationGroups = documents.reduce<Record<string, DocumentItem[]>>((acc, curr) => {
    acc[curr.physicalLocation] = acc[curr.physicalLocation] || [];
    acc[curr.physicalLocation].push(curr);
    return acc;
  }, {});

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-neutral-100 text-neutral-800">
              <Icon name="FolderArchive" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Dokumen & Garansi
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Sentralisasi pengarsipan berkas fisik, lokasi map penyimpanan, dan radar kedaluwarsa garansi.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs"
        >
          <Icon name="Plus" size={14} />
          <span>Tambah Dokumen</span>
        </button>
      </div>

      {/* Submenus */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex p-1 bg-neutral-100 rounded-lg text-xs font-medium">
          {[
            { id: 'active-docs', label: 'Berkas Tersimpan', count: documents.length },
            { id: 'expiry-watch', label: 'Radar Kedaluwarsa' },
            { id: 'locations', label: 'Lokasi Simpan Fisik' },
          ].map((tab) => {
            const isActive = activeSubMenu === tab.id || (!activeSubMenu && tab.id === 'active-docs');
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
              placeholder="Cari berkas / lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 w-44"
            />
          </div>
        </div>
      </div>

      {documents.length === 0 ? (
        <EmptyState
          iconName="FolderArchive"
          title="Belum ada dokumen yang diarsipkan"
          description="Catat lokasi map fisik dokumen legal, kartu garansi elektronik rumah, atau polis penting agar mudah ditemukan saat dibutuhkan."
          actionLabel="Arsipkan Dokumen Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <>
          {/* Active Docs View */}
          {(activeSubMenu === 'active-docs' || !activeSubMenu) && (
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
              <div className="divide-y divide-neutral-100">
                {filteredDocs.map((doc) => {
                  const daysLeft = getDaysRemaining(doc.expiryDate);

                  return (
                    <div
                      key={doc.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/50"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-neutral-900 text-sm">{doc.title}</div>
                        {/* Zero-pill clean text metadata */}
                        <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1 flex-wrap">
                          <span>{doc.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium text-neutral-800">
                            Lokasi: {doc.physicalLocation}
                          </span>
                          {doc.identifierNumber && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono">{doc.identifierNumber}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        {doc.expiryDate && (
                          <div className="text-right">
                            <div className="text-xs font-mono tabular-nums text-neutral-700">
                              {doc.expiryDate}
                            </div>
                            <div
                              className={`text-[11px] ${
                                daysLeft !== null && daysLeft < 30
                                  ? 'text-amber-600 font-medium'
                                  : 'text-neutral-400'
                              }`}
                            >
                              {daysLeft !== null
                                ? daysLeft > 0
                                  ? `${daysLeft} hari lagi`
                                  : 'Kedaluwarsa'
                                : ''}
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded-md transition-colors"
                          title="Hapus berkas"
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

          {/* Expiry Radar View */}
          {activeSubMenu === 'expiry-watch' && (
            <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-neutral-900">Radar Kedaluwarsa & Garansi</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Dokumen yang memiliki batas masa aktif atau masa garansi resmi.
                </p>
              </div>

              {documents.filter((d) => d.expiryDate).length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-400">
                  Tidak ada dokumen dengan tanggal kedaluwarsa yang tersimpan.
                </div>
              ) : (
                <div className="space-y-3">
                  {documents
                    .filter((d) => d.expiryDate)
                    .sort((a, b) => (a.expiryDate! > b.expiryDate! ? 1 : -1))
                    .map((d) => {
                      const daysLeft = getDaysRemaining(d.expiryDate);
                      return (
                        <div
                          key={d.id}
                          className="p-3.5 border border-neutral-200 rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <div className="text-xs font-semibold text-neutral-900">{d.title}</div>
                            <div className="text-xs text-neutral-500 mt-0.5">
                              Lokasi: {d.physicalLocation} · {d.category}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xs font-mono tabular-nums text-neutral-800">
                              {d.expiryDate}
                            </div>
                            <div className="text-[11px] text-neutral-500 font-mono">
                              {daysLeft !== null && daysLeft > 0 ? `${daysLeft} hari sisa` : 'Sudah Lewat'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* Physical Locations View */}
          {activeSubMenu === 'locations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(locationGroups).map(([location, docs]) => (
                <div key={location} className="p-4 bg-white border border-neutral-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-neutral-100">
                    <Icon name="MapPin" size={14} className="text-neutral-500" />
                    <h4 className="text-xs font-semibold text-neutral-900">{location}</h4>
                    <span className="text-[11px] text-neutral-400 ml-auto font-mono">
                      {docs.length} berkas
                    </span>
                  </div>
                  <div className="space-y-1">
                    {docs.map((d) => (
                      <div key={d.id} className="text-xs text-neutral-700 py-1 flex items-center justify-between">
                        <span className="truncate">{d.title}</span>
                        <span className="text-[11px] text-neutral-400">{d.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add Document Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Arsipkan Dokumen / Garansi"
        subtitle="Catat lokasi fisik tempat penyimpanan berkas ini."
        maxWidth="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Nama Dokumen / Aset *
            </label>
            <input
              type="text"
              required
              placeholder="Misal: Polis Asuransi Sinarmas, Garansi TV LG 55 Inch"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg bg-white"
              >
                <option value="Identitas & Sipil">Identitas & Sipil</option>
                <option value="Garansi Barang">Garansi Barang</option>
                <option value="Asuransi & Polis">Asuransi & Polis</option>
                <option value="Kontrak & Properti">Kontrak & Properti</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Lokasi Simpan Fisik *
              </label>
              <input
                type="text"
                required
                placeholder="Misal: Binder Biru Rak Dinding, Laci Meja Kerja"
                value={physicalLocation}
                onChange={(e) => setPhysicalLocation(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Nomor Seri / Polis (Opsional)
              </label>
              <input
                type="text"
                placeholder="POL-2024-99812"
                value={identifierNumber}
                onChange={(e) => setIdentifierNumber(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Masa Berlaku / Garansi Berakhir
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Tag / Kata Kunci (Pisahkan koma)
            </label>
            <input
              type="text"
              placeholder="elektronik, ruang keluarga, klaim"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
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
              Simpan Dokumen
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
