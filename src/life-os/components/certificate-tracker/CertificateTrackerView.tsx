import React, { useState, useMemo } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  CertificateItem,
  CertificateCategory,
  DocumentStatus,
} from '../../types';
import {
  ShieldCheck,
  AlertTriangle,
  Plus,
  Search,
  Copy,
  Check,
  FolderLock,
  Cloud,
  Calendar,
  LayoutGrid,
  Table as TableIcon,
  Edit3,
  Trash2,
  X,
  FileBadge,
} from 'lucide-react';

const CATEGORIES: CertificateCategory[] = [
  'Identitas & Kependudukan',
  'Paspor, Visa & Imigrasi',
  'Pendidikan & Ijazah',
  'Sertifikasi Profesional',
  'Lisensi & Surat Izin (SIM/STNK)',
  'Polis Asuransi & Legal',
];

const STATUS_BADGE: Record<
  DocumentStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  Active: {
    label: 'Aktif Berlaku',
    color: 'text-emerald-800',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  'Expiring Soon': {
    label: 'Segera Perpanjang',
    color: 'text-amber-800',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
  },
  Expired: {
    label: 'Kedaluwarsa',
    color: 'text-rose-800',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  },
  Lifetime: {
    label: 'Seumur Hidup',
    color: 'text-blue-800',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
};

export const CertificateTrackerView: React.FC = () => {
  const { certificates, addCertificate, updateCertificate, deleteCertificate } = useLifeOS();

  const [selectedCategory, setSelectedCategory] = useState<CertificateCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<DocumentStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'gallery' | 'table'>('gallery');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CertificateCategory>('Identitas & Kependudukan');
  const [documentNumber, setDocumentNumber] = useState('');
  const [issuer, setIssuer] = useState('');
  const [holderName, setHolderName] = useState('Pemilik Workspace');
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState('');
  const [status, setStatus] = useState<DocumentStatus>('Active');
  const [physicalLocation, setPhysicalLocation] = useState('');
  const [digitalFileLink, setDigitalFileLink] = useState('');
  const [renewalCostEstimate, setRenewalCostEstimate] = useState<number>(0);
  const [notes, setNotes] = useState('');

  const filteredCertificates = useMemo(() => {
    return certificates.filter((c) => {
      if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = c.title.toLowerCase().includes(q);
        const inDocNo = c.documentNumber.toLowerCase().includes(q);
        const inIssuer = c.issuer.toLowerCase().includes(q);
        const inLoc = c.physicalLocation.toLowerCase().includes(q);
        if (!inTitle && !inDocNo && !inIssuer && !inLoc) return false;
      }
      return true;
    });
  }, [certificates, selectedCategory, selectedStatus, searchQuery]);

  const expiringDocs = useMemo(
    () => certificates.filter((c) => c.status === 'Expiring Soon' || c.status === 'Expired'),
    [certificates]
  );

  const totalRenewalCost = useMemo(
    () => certificates.reduce((sum, c) => sum + (c.renewalCostEstimate || 0), 0),
    [certificates]
  );

  const handleCopyDocNumber = (id: string, num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Sertifikasi Profesional');
    setDocumentNumber('');
    setIssuer('');
    setHolderName('Pemilik Workspace');
    setIssueDate(new Date().toISOString().split('T')[0]);
    setExpiryDate('');
    setStatus('Active');
    setPhysicalLocation('Brankas Rumah — Map Utama');
    setDigitalFileLink('Google Drive /Personal-Vault/');
    setRenewalCostEstimate(0);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleEdit = (item: CertificateItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setDocumentNumber(item.documentNumber);
    setIssuer(item.issuer);
    setHolderName(item.holderName);
    setIssueDate(item.issueDate);
    setExpiryDate(item.expiryDate || '');
    setStatus(item.status);
    setPhysicalLocation(item.physicalLocation);
    setDigitalFileLink(item.digitalFileLink || '');
    setRenewalCostEstimate(item.renewalCostEstimate || 0);
    setNotes(item.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload: Omit<CertificateItem, 'id'> = {
      title: title.trim(),
      category,
      documentNumber: documentNumber.trim() || '—',
      issuer: issuer.trim() || 'Instansi Resmi',
      holderName: holderName.trim() || 'Pemilik Workspace',
      issueDate,
      expiryDate: expiryDate || undefined,
      status,
      physicalLocation: physicalLocation.trim() || 'Arsip Rumah',
      digitalFileLink: digitalFileLink.trim() || undefined,
      renewalCostEstimate: renewalCostEstimate > 0 ? Number(renewalCostEstimate) : undefined,
      notes: notes.trim() || undefined,
    };

    if (editingId) {
      updateCertificate(editingId, payload);
    } else {
      addCertificate(payload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#E9E9E7] rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-indigo-50/60 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-3xl shadow-xs shrink-0">
              📜
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#2F3437] tracking-tight">
                  Certificate & Document Tracker
                </h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100/70 text-indigo-800">
                  by LifeCanvas
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl">
                Brankas katalog dokumen penting, paspor, SIM, ijazah akademik, sertifikasi
                profesional, dan pengingat masa berlaku perpanjangan otomatis.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenNew}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2F3437] hover:bg-black rounded-lg shadow-sm transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Dokumen / Sertifikat</span>
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#F1F1EF]">
          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3">
            <span className="text-[11px] font-medium text-neutral-500 block">Total Arsip Dokumen</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-[#2F3437]">{certificates.length}</span>
              <span className="text-[11px] text-neutral-400">berkas penting</span>
            </div>
          </div>

          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3">
            <span className="text-[11px] font-medium text-neutral-500 block">
              Aktif & Seumur Hidup
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-emerald-700">
                {
                  certificates.filter((c) => c.status === 'Active' || c.status === 'Lifetime')
                    .length
                }
              </span>
              <span className="text-[11px] text-neutral-400">aman berlaku</span>
            </div>
          </div>

          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3">
            <span className="text-[11px] font-medium text-neutral-500 block">
              Perlu Perpanjangan
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-amber-700">{expiringDocs.length}</span>
              <span className="text-[11px] text-neutral-400">segera habis</span>
            </div>
          </div>

          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3">
            <span className="text-[11px] font-medium text-neutral-500 block">
              Cadangan Biaya Renewal
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-base sm:text-lg font-bold text-indigo-800">
                Rp {totalRenewalCost.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expiring Soon Alert Banner */}
      {expiringDocs.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-amber-900">
                Pengingat Perpanjangan Dokumen ({expiringDocs.length} Berkas)
              </h3>
              <p className="text-xs text-amber-800/90 mt-0.5">
                {expiringDocs.map((d) => `${d.title} (Exp: ${d.expiryDate || 'Segera'})`).join(' • ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedStatus('Expiring Soon')}
            className="px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg shrink-0"
          >
            Lihat Dokumen
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white border border-[#E9E9E7] rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#2F3437] text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
            }`}
          >
            Semua Kategori ({certificates.length})
          </button>

          {CATEGORIES.map((cat) => {
            const count = certificates.filter((c) => c.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#2F3437] text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-neutral-700 text-white' : 'bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[#F1F1EF]">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nomor dokumen, paspor, SIM, lokasi brankas..."
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg text-neutral-800 focus:outline-none"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as DocumentStatus | 'all')}
              className="text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-2.5 py-1.5 text-neutral-700"
            >
              <option value="all">Semua Status Masa Berlaku</option>
              {(Object.keys(STATUS_BADGE) as DocumentStatus[]).map((st) => (
                <option key={st} value={st}>
                  {STATUS_BADGE[st].label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-[#E9E9E7] self-end sm:self-auto">
            <button
              onClick={() => setViewMode('gallery')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'gallery'
                  ? 'bg-white text-[#2F3437] shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kartu Arsip</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-[#2F3437] shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tabel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Cards View */}
      {viewMode === 'gallery' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCertificates.map((cert) => {
            const st = STATUS_BADGE[cert.status];
            return (
              <div
                key={cert.id}
                className="bg-white border border-[#E9E9E7] hover:border-neutral-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-700">
                      {cert.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${st.bg} ${st.border} ${st.color}`}
                    >
                      {st.label}
                    </span>
                  </div>

                  <div>
                    <h3
                      onClick={() => handleEdit(cert)}
                      className="text-base font-bold text-[#2F3437] hover:text-indigo-600 cursor-pointer"
                    >
                      {cert.title}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">Penerbit: {cert.issuer}</p>
                  </div>

                  {/* Document Number Copy Box */}
                  <div className="flex items-center justify-between bg-[#FAF9F6] border border-[#E9E9E7] rounded-xl px-3 py-2">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase block font-semibold">
                        Nomor Dokumen / Seri
                      </span>
                      <span className="font-mono text-xs font-bold text-[#2F3437]">
                        {cert.documentNumber}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopyDocNumber(cert.id, cert.documentNumber)}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-white border border-[#E9E9E7] rounded-lg hover:bg-neutral-50"
                    >
                      {copiedId === cert.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-neutral-500" />
                          <span>Salin Nomor</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Dates & Storage Location */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-neutral-50/70 rounded-xl border border-[#F1F1EF]">
                      <span className="text-[10px] text-neutral-400 block">Tanggal Terbit</span>
                      <span className="font-semibold text-neutral-800">{cert.issueDate}</span>
                    </div>
                    <div className="p-2.5 bg-neutral-50/70 rounded-xl border border-[#F1F1EF]">
                      <span className="text-[10px] text-neutral-400 block">
                        Kedaluwarsa / Renewal
                      </span>
                      <span className="font-semibold text-neutral-800">
                        {cert.expiryDate || 'Seumur Hidup (Lifetime)'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-neutral-700">
                      <FolderLock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>
                        <strong className="font-semibold">Lokasi Fisik:</strong>{' '}
                        {cert.physicalLocation}
                      </span>
                    </div>
                    {cert.digitalFileLink && (
                      <div className="flex items-center gap-2 text-neutral-600">
                        <Cloud className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">
                          <strong className="font-semibold">Salinan Digital:</strong>{' '}
                          {cert.digitalFileLink}
                        </span>
                      </div>
                    )}
                  </div>

                  {cert.notes && (
                    <p className="text-xs text-neutral-500 italic bg-neutral-50 p-2.5 rounded-lg border border-[#F1F1EF]">
                      "{cert.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-[#F1F1EF] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-neutral-500">
                    {cert.renewalCostEstimate
                      ? `Est. Biaya Perpanjangan: Rp ${cert.renewalCostEstimate.toLocaleString('id-ID')}`
                      : 'Tanpa biaya perpanjangan tahunan'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(cert)}
                      className="p-1 text-neutral-400 hover:text-neutral-800"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteCertificate(cert.id)}
                      className="p-1 text-neutral-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
        <div className="bg-white border border-[#E9E9E7] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-700">
              <thead className="bg-[#FAF9F6] text-neutral-500 border-b border-[#E9E9E7] font-semibold">
                <tr>
                  <th className="py-3 px-4">Nama Dokumen / Sertifikat</th>
                  <th className="py-3 px-4">Nomor Seri</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Masa Berlaku</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Lokasi Penyimpanan</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F1EF]">
                {filteredCertificates.map((c) => {
                  const st = STATUS_BADGE[c.status];
                  return (
                    <tr key={c.id} className="hover:bg-neutral-50/70">
                      <td className="py-3 px-4 font-semibold text-[#2F3437]">{c.title}</td>
                      <td className="py-3 px-4 font-mono">{c.documentNumber}</td>
                      <td className="py-3 px-4">{c.category}</td>
                      <td className="py-3 px-4">{c.expiryDate || 'Seumur Hidup'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.bg} ${st.border} ${st.color}`}
                        >
                          {st.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-600">{c.physicalLocation}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(c)}
                            className="p-1 text-neutral-400 hover:text-neutral-800"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteCertificate(c.id)}
                            className="p-1 text-neutral-400 hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="p-4 sm:px-6 border-b border-[#E9E9E7] flex items-center justify-between bg-[#FAF9F6]">
              <h3 className="text-sm font-bold text-[#2F3437]">
                {editingId ? 'Edit Dokumen / Sertifikat' : 'Tambah Dokumen Penting Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Nama Dokumen / Sertifikat *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Paspor Elektronik RI"
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Nomor Seri / Registrasi *
                  </label>
                  <input
                    type="text"
                    required
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    placeholder="Contoh: E9482710"
                    className="w-full text-xs font-mono bg-neutral-50 border border-[#E9E9E7] rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CertificateCategory)}
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-2.5 py-2"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Instansi Penerbit
                  </label>
                  <input
                    type="text"
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    placeholder="Dirjen Imigrasi / AWS / Korlantas"
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Tanggal Terbit
                  </label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Tanggal Kedaluwarsa
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Status Masa Berlaku
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as DocumentStatus)}
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-2.5 py-2"
                  >
                    {(Object.keys(STATUS_BADGE) as DocumentStatus[]).map((st) => (
                      <option key={st} value={st}>
                        {STATUS_BADGE[st].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Lokasi Penyimpanan Fisik *
                  </label>
                  <input
                    type="text"
                    required
                    value={physicalLocation}
                    onChange={(e) => setPhysicalLocation(e.target.value)}
                    placeholder="Brankas Rumah Map Biru"
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Tautan / Lokasi Cloud Digital
                  </label>
                  <input
                    type="text"
                    value={digitalFileLink}
                    onChange={(e) => setDigitalFileLink(e.target.value)}
                    placeholder="Google Drive /Vault/Dokumen.pdf"
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                  Catatan Perpanjangan / Keterangan
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg p-3"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E9E9E7]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-medium text-neutral-600 bg-neutral-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#2F3437] hover:bg-black rounded-lg"
                >
                  Simpan Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
