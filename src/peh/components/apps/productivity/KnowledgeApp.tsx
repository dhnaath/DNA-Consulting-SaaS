import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { KnowledgeItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const KnowledgeApp: React.FC = () => {
  const { knowledgeList, addKnowledge, deleteKnowledge, activeSubMenu, setActiveSubMenu } = usePEH();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<KnowledgeItem['docType']>('SOP & Prosedur');
  const [department, setDepartment] = useState<KnowledgeItem['department']>('Operasional');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const currentTab = activeSubMenu === 'default' ? 'articles' : activeSubMenu;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !content.trim()) return;

    addKnowledge({
      title: title.trim(),
      docType,
      department,
      summary: summary.trim(),
      content: content.trim(),
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });

    setTitle('');
    setDocType('SOP & Prosedur');
    setDepartment('Operasional');
    setSummary('');
    setContent('');
    setTagsInput('');
    setIsAddModalOpen(false);
  };

  const filteredDocs = knowledgeList.filter((doc) => {
    if (currentTab === 'sops') return doc.docType === 'SOP & Prosedur';
    if (currentTab === 'templates') return doc.docType === 'Template Dokumen' || doc.docType === 'Playbook Strategi';
    return true; // 'articles'
  });

  const sopCount = knowledgeList.filter(d => d.docType === 'SOP & Prosedur').length;

  return (
    <div className="space-y-6">
      {/* Submenu navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubMenu('articles')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'articles'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="FileText" className="h-4 w-4" />
            Pustaka SOP & Pengetahuan
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              currentTab === 'articles' ? 'bg-amber-900 text-amber-100' : 'bg-stone-200 text-stone-700'
            }`}>
              {knowledgeList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubMenu('sops')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'sops'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="ClipboardCheck" className="h-4 w-4" />
            Standar Operasional (SOP)
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              currentTab === 'sops' ? 'bg-amber-900 text-amber-100' : 'bg-stone-200 text-stone-700'
            }`}>
              {sopCount}
            </span>
          </button>

          <button
            onClick={() => setActiveSubMenu('templates')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'templates'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Bookmark" className="h-4 w-4" />
            Format & Playbook
          </button>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-950 text-white text-sm font-medium rounded-lg hover:bg-amber-900 transition-colors shadow-xs"
        >
          <Icon name="Plus" className="h-4 w-4" />
          Tulis SOP / Dokumen Baru
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Dokumen Terpelihara</p>
          <p className="text-2xl font-semibold text-stone-900 mt-1 tabular-nums">{knowledgeList.length}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">SOP & Prosedur Baku</p>
          <p className="text-2xl font-semibold text-amber-900 mt-1 tabular-nums">{sopCount}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Divisi / Departemen Terdokumentasi</p>
          <p className="text-2xl font-semibold text-stone-900 mt-1 tabular-nums">
            {new Set(knowledgeList.map(k => k.department)).size}
          </p>
        </div>
      </div>

      {/* Main List or Empty State */}
      {filteredDocs.length === 0 ? (
        <EmptyState
          title={
            currentTab === 'sops'
              ? 'Belum Ada Standar Operasional Prosedur (SOP)'
              : currentTab === 'templates'
              ? 'Belum Ada Format & Playbook Strategi'
              : 'Belum Ada Dokumen Pustaka Pengetahuan'
          }
          description="Dokumentasikan cara kerja standar, instruksi onboarding, format rilis, dan playbook insiden agar operasional bisnis berjalan konsisten tanpa ketergantungan individu."
          actionLabel="Tulis SOP Pertama"
          onAction={() => setIsAddModalOpen(true)}
          iconName="BookOpen"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-stone-200 p-5 hover:border-stone-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-900 rounded-md">
                      {doc.docType}
                    </span>
                    <span className="px-2 py-0.5 text-[11px] font-medium bg-stone-100 text-stone-700 rounded-md">
                      {doc.department}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteKnowledge(doc.id)}
                    className="text-stone-400 hover:text-red-600 transition-colors p-1"
                    title="Hapus Dokumen"
                  >
                    <Icon name="Trash2" className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="text-base font-semibold text-stone-900 mt-2.5">{doc.title}</h3>
                <p className="text-xs text-stone-600 mt-1.5 line-clamp-2">{doc.summary}</p>

                {doc.tags && doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {doc.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-stone-50 border border-stone-200 text-stone-600 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-400 text-[11px]">Diperbarui {doc.lastUpdated}</span>
                <button
                  type="button"
                  onClick={() => setSelectedItem(doc)}
                  className="font-semibold text-amber-950 hover:underline flex items-center gap-1"
                >
                  <span>Baca Detail</span>
                  <Icon name="ChevronRight" className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reader Modal */}
      {selectedItem && (
        <Modal
          isOpen={Boolean(selectedItem)}
          onClose={() => setSelectedItem(null)}
          title={selectedItem.title}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-semibold bg-amber-50 text-amber-950 rounded-md">
                {selectedItem.docType}
              </span>
              <span className="px-2 py-0.5 text-xs font-medium bg-stone-100 text-stone-700 rounded-md">
                Departemen: {selectedItem.department}
              </span>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-700">
              <p className="font-semibold text-stone-900 mb-0.5">Ringkasan:</p>
              <p>{selectedItem.summary}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Isi Prosedur Lengkap</h4>
              <div className="p-4 bg-white rounded-lg border border-stone-200 text-xs text-stone-800 font-mono whitespace-pre-wrap leading-relaxed">
                {selectedItem.content}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
              >
                Tutup Baca
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tulis Prosedur / SOP Baru"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Judul Prosedur / SOP *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: SOP Rilis Kode ke Produksi, Panduan Onboarding Tim Baru"
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Tipe Dokumen *
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as KnowledgeItem['docType'])}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950 bg-white"
              >
                <option value="SOP & Prosedur">SOP & Prosedur</option>
                <option value="Playbook Strategi">Playbook Strategi</option>
                <option value="Template Dokumen">Template Dokumen</option>
                <option value="Catatan Teknis">Catatan Teknis</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Departemen / Tim *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as KnowledgeItem['department'])}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950 bg-white"
              >
                <option value="Operasional">Operasional</option>
                <option value="Teknologi & Produk">Teknologi & Produk</option>
                <option value="Pemasaran & Penjualan">Pemasaran & Penjualan</option>
                <option value="Keuangan & Legal">Keuangan & Legal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Ringkasan Singkat (Executive Summary) *
            </label>
            <input
              type="text"
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Jelaskan tujuan dan audiens utama dokumen ini dalam 1-2 kalimat"
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Langkah Kerja & Konten SOP (Detail) *
            </label>
            <textarea
              rows={5}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan poin langkah 1, 2, 3 atau checklist instruksi kerja di sini..."
              className="w-full text-sm font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Tag Kata Kunci (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Contoh: devops, ci-cd, rilis, pedoman-keamanan"
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
              Simpan Dokumen
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
