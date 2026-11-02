import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { JournalEntry } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const JournalApp: React.FC = () => {
  const { journalEntries, addJournalEntry, deleteJournalEntry, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState<string>('Semua');

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<JournalEntry['mood']>('Produktif');
  const [tagInput, setTagInput] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    addJournalEntry({
      title: title.trim(),
      content: content.trim(),
      mood,
      tags,
      date: new Date().toISOString().split('T')[0],
    });

    setTitle('');
    setContent('');
    setTagInput('');
    setIsWriteModalOpen(false);
  };

  const filteredEntries = journalEntries.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMood = filterMood === 'Semua' || item.mood === filterMood;
    return matchSearch && matchMood;
  });

  // Mood counts derived strictly from real user entries
  const moodCounts = journalEntries.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.mood] = (acc[curr.mood] || 0) + 1;
    return acc;
  }, {});

  // All distinct tags from real entries
  const allTags = Array.from(new Set(journalEntries.flatMap((e) => e.tags)));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-neutral-100 text-neutral-800">
              <Icon name="BookOpen" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Jurnal & Mood
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Ruang refleksi privat, pencatatan evaluasi diri, dan pemantauan suasana hati.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsWriteModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs"
        >
          <Icon name="PenSquare" size={14} />
          <span>Tulis Catatan Baru</span>
        </button>
      </div>

      {/* Submenus */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex p-1 bg-neutral-100 rounded-lg text-xs font-medium">
          {[
            { id: 'timeline', label: 'Lini Masa Entri', count: journalEntries.length },
            { id: 'mood-map', label: 'Peta Suasana Hati' },
            { id: 'topics', label: 'Tag & Topik' },
          ].map((tab) => {
            const isActive = activeSubMenu === tab.id || (!activeSubMenu && tab.id === 'timeline');
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
              placeholder="Cari dalam jurnal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 w-44"
            />
          </div>
        </div>
      </div>

      {journalEntries.length === 0 ? (
        <EmptyState
          iconName="BookOpen"
          title="Belum ada entri jurnal"
          description="Tuliskan pengalaman hari ini, refleksi pembelajaran, atau catat suasana hati Anda tanpa template palsu."
          actionLabel="Tulis Catatan Pertama"
          onAction={() => setIsWriteModalOpen(true)}
        />
      ) : (
        <>
          {/* Timeline View */}
          {(activeSubMenu === 'timeline' || !activeSubMenu) && (
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <article
                  key={entry.id}
                  className="bg-white border border-neutral-200 rounded-xl p-5 hover:border-neutral-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-base font-semibold text-neutral-900 tracking-tight">
                        {entry.title}
                      </h3>
                      {/* Anti-slop zero pill metadata */}
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                        <span>{entry.date}</span>
                        <span aria-hidden="true">·</span>
                        <span>Mood: {entry.mood}</span>
                        {entry.tags.length > 0 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{entry.tags.join(', ')}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteJournalEntry(entry.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 rounded-md transition-colors"
                      title="Hapus entri"
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>

                  <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap mt-3">
                    {entry.content}
                  </p>
                </article>
              ))}
            </div>
          )}

          {/* Mood Map View */}
          {activeSubMenu === 'mood-map' && (
            <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Distribusi Suasana Hati Real</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Dihitung secara akurat dari seluruh catatan yang Anda simpan.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['Sangat Baik', 'Produktif', 'Tenang', 'Lelah', 'Stres', 'Reflektif'].map((m) => {
                  const count = moodCounts[m] || 0;
                  const pct = journalEntries.length > 0 ? Math.round((count / journalEntries.length) * 100) : 0;
                  return (
                    <div key={m} className="p-3.5 border border-neutral-100 rounded-lg bg-neutral-50/50">
                      <div className="text-xs text-neutral-500">{m}</div>
                      <div className="text-xl font-bold text-neutral-900 mt-1 font-mono tabular-nums">
                        {count} <span className="text-xs font-normal text-neutral-400">({pct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Topics & Tags View */}
          {activeSubMenu === 'topics' && (
            <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Tag & Topik Teridentifikasi</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Seluruh topik yang Anda sertakan pada catatan jurnal Anda.
                </p>
              </div>

              {allTags.length === 0 ? (
                <div className="py-6 text-center text-xs text-neutral-400">
                  Belum ada tag yang ditambahkan pada catatan Anda.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => {
                    const tagCount = journalEntries.filter((e) => e.tags.includes(tag)).length;
                    return (
                      <span
                        key={tag}
                        className="px-3 py-1.5 text-xs text-neutral-700 bg-neutral-100 rounded-md font-mono"
                      >
                        #{tag} ({tagCount})
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Write Entry Modal */}
      <Modal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        title="Tulis Catatan Jurnal"
        subtitle="Ekspresikan pemikiran Anda secara aman dan privat."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Judul Catatan *</label>
            <input
              type="text"
              required
              placeholder="Misal: Evaluasi Kuartal Ketiga, Refleksi Rasa Syukur Hari Ini"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Suasana Hati (Mood)</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value as any)}
                className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg bg-white"
              >
                <option value="Sangat Baik">Sangat Baik</option>
                <option value="Produktif">Produktif</option>
                <option value="Tenang">Tenang</option>
                <option value="Lelah">Lelah</option>
                <option value="Stres">Stres</option>
                <option value="Reflektif">Reflektif</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Tag (Pisahkan koma)</label>
              <input
                type="text"
                placeholder="karier, keluarga, refleksi"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Isi Catatan</label>
            <textarea
              rows={6}
              placeholder="Tuliskan pengalaman, kendala, atau hal berharga hari ini..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setIsWriteModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
            >
              Simpan Jurnal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
