import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { ReadingItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const ReadingApp: React.FC = () => {
  const { readings, addReading, updateReadingProgress, deleteReading, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterCat, setFilterCat] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<ReadingItem['category']>('Pengembangan Diri');
  const [totalPages, setTotalPages] = useState<number>(250);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [status, setStatus] = useState<ReadingItem['status']>('Sedang Dibaca');
  const [rating, setRating] = useState<number>(5);
  const [favoriteQuote, setFavoriteQuote] = useState('');

  // Interactive Calculator Feature: Reading Speed & Finish Date Estimator
  const [pagesPerDay, setPagesPerDay] = useState<number>(15);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    addReading({
      title: title.trim(),
      author: author.trim(),
      category,
      totalPages: Number(totalPages) || 100,
      currentPage: Number(currentPage) || 0,
      status,
      rating: Number(rating) || 5,
      favoriteQuote: favoriteQuote.trim() || undefined,
    });

    setTitle('');
    setAuthor('');
    setFavoriteQuote('');
    setIsAddModalOpen(false);
  };

  const filteredReadings = readings.filter((r) => {
    const matchCat = filterCat === 'Semua' || r.category === filterCat;
    const matchSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const currentlyReadingCount = readings.filter((r) => r.status === 'Sedang Dibaca').length;
  const completedCount = readings.filter((r) => r.status === 'Selesai').length;
  const totalPagesRead = readings.reduce((acc, curr) => acc + (curr.currentPage || 0), 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* App Header & Submenu Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
              <Icon name="BookMarked" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Buku & Bahan Bacaan
            </h1>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Pelacak target membaca buku, progress halaman, kutipan inspiratif, dan rak bacaan pribadi.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Tambah Buku Baru</span>
        </button>
      </div>

      {/* Sub-menu Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveSubMenu('shelf')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'shelf'
              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="Book" size={14} />
          <span>Rak Buku Saya ({readings.length})</span>
        </button>
        <button
          onClick={() => setActiveSubMenu('currently-reading')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'currently-reading'
              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="Glasses" size={14} />
          <span>Sedang Dibaca ({currentlyReadingCount})</span>
        </button>
        <button
          onClick={() => setActiveSubMenu('quotes')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'quotes'
              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="Quote" size={14} />
          <span>Kutipan & Catatan Emas</span>
        </button>
      </div>

      {/* Interactive Feature: Reading Speed & Target Completion Forecaster */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <Icon name="Flame" size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Estimasi Kecepatan Membaca</h4>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Total {totalPagesRead.toLocaleString('id-ID')} halaman telah diselesaikan di seluruh koleksi.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-neutral-500">Target:</span>
            <input
              type="number"
              min="1"
              max="200"
              value={pagesPerDay}
              onChange={(e) => setPagesPerDay(Math.max(1, Number(e.target.value) || 1))}
              className="w-16 px-2 py-1 text-xs text-center border rounded bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold"
            />
            <span className="text-[11px] text-neutral-500">hlm/hari</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
            ~{Math.round((totalPagesRead || 100) / pagesPerDay)} hari buku rata-rata
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Icon name="Search" className="absolute left-3 top-2.5 text-neutral-400" size={14} />
            <input
              type="text"
              placeholder="Cari judul buku atau penulis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
            />
          </div>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Non-Fiksi">Non-Fiksi</option>
            <option value="Bisnis & Finansial">Bisnis & Finansial</option>
            <option value="Pengembangan Diri">Pengembangan Diri</option>
            <option value="Teknologi">Teknologi</option>
            <option value="Sastra & Fiksi">Sastra & Fiksi</option>
          </select>
        </div>

        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 self-end sm:self-auto">
          {filteredReadings.length} judul tercatat
        </div>
      </div>

      {/* Main Content Area */}
      {filteredReadings.length === 0 ? (
        <EmptyState
          iconName="BookOpen"
          title="Belum Ada Buku Tersimpan"
          description="Rak buku Anda masih kosong tanpa data dummy. Mulai catat buku yang sedang Anda baca atau target bacaan tahun ini."
          actionLabel="Tambah Buku Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : activeSubMenu === 'quotes' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReadings
            .filter((r) => r.favoriteQuote)
            .map((book) => (
              <div
                key={book.id}
                className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm relative overflow-hidden"
              >
                <Icon name="Quote" className="text-amber-500/20 absolute -right-2 -bottom-2 w-20 h-20" />
                <p className="text-xs italic text-neutral-700 dark:text-neutral-300 leading-relaxed relative z-10 mb-3">
                  "{book.favoriteQuote}"
                </p>
                <div className="text-[11px] font-semibold text-neutral-900 dark:text-white">
                  {book.title}
                </div>
                <div className="text-[10px] text-neutral-500">{book.author}</div>
              </div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReadings.map((book) => {
            const progress = book.totalPages > 0 ? Math.min(100, Math.round((book.currentPage / book.totalPages) * 100)) : 0;
            return (
              <div
                key={book.id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col justify-between hover:border-neutral-400 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      {book.category}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        book.status === 'Selesai'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : book.status === 'Sedang Dibaca'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                          : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                      }`}
                    >
                      {book.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-1">{book.title}</h3>
                  <p className="text-xs text-neutral-500 mb-3">{book.author}</p>

                  {/* Progress Bar */}
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-[11px] text-neutral-500">
                      <span>{book.currentPage} / {book.totalPages} hlm</span>
                      <span className="font-semibold">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <div className="h-full bg-neutral-900 dark:bg-neutral-100 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateReadingProgress(book.id, Math.min(book.totalPages, book.currentPage + 10))}
                      className="px-2 py-1 text-[10px] rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 font-medium cursor-pointer"
                    >
                      +10 Hlm
                    </button>
                    {book.status !== 'Selesai' && (
                      <button
                        onClick={() => updateReadingProgress(book.id, book.totalPages, 'Selesai')}
                        className="px-2 py-1 text-[10px] rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-medium cursor-pointer"
                      >
                        Selesai
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => deleteReading(book.id)}
                    className="p-1 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Hapus buku"
                  >
                    <Icon name="Trash2" size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add Book */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tambah Koleksi Buku">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Judul Buku</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Atomic Habits"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Penulis</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="James Clear"
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="Non-Fiksi">Non-Fiksi</option>
                <option value="Bisnis & Finansial">Bisnis & Finansial</option>
                <option value="Pengembangan Diri">Pengembangan Diri</option>
                <option value="Teknologi">Teknologi</option>
                <option value="Sastra & Fiksi">Sastra & Fiksi</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Total Halaman</label>
              <input
                type="number"
                min="1"
                required
                value={totalPages}
                onChange={(e) => setTotalPages(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Halaman Saat Ini</label>
              <input
                type="number"
                min="0"
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Status Baca</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="Akan Dibaca">Akan Dibaca</option>
                <option value="Sedang Dibaca">Sedang Dibaca</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Kutipan Berkesan (Opsional)</label>
            <textarea
              rows={2}
              value={favoriteQuote}
              onChange={(e) => setFavoriteQuote(e.target.value)}
              placeholder="Catat kalimat atau konsep utama dari buku..."
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold"
            >
              Simpan Buku
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
