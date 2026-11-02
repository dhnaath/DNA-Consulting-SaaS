import React, { useState, useEffect, useMemo } from "react";
import {
  Book,
  Plus,
  Search,
  BookOpen,
  CheckCircle2,
  Star,
  Bookmark,
  Edit2,
  Trash2,
  ChevronRight,
  FileText,
  X,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type BookShelf = "reading" | "to-read" | "finished" | "abandoned";
export type BookFormat = "Physical" | "E-Book" | "Audiobook" | "Article/PDF";

export interface BookItem {
  id: string;
  title: string;
  author: string;
  shelf: BookShelf;
  genre: string;
  format: BookFormat;
  currentPage: number;
  totalPages: number;
  rating: number; // 1 to 5
  startDate?: string;
  finishDate?: string;
  notes?: string;
  quotes?: string;
  coverColor?: string;
}

const DEFAULT_BOOKS: BookItem[] = [
  {
    id: "b1",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    shelf: "reading",
    genre: "Psychology & Behavioral Economics",
    format: "Physical",
    currentPage: 218,
    totalPages: 499,
    rating: 5,
    startDate: "2026-08-10",
    notes: "System 1 vs System 2 thinking. Framing bias affects financial risk decisions heavily.",
    quotes: "A reliable way to make people believe in falsehoods is frequent repetition.",
    coverColor: "from-amber-600 to-rose-700",
  },
  {
    id: "b2",
    title: "Principles for Dealing with the Changing World Order",
    author: "Ray Dalio",
    shelf: "reading",
    genre: "Macroeconomics & History",
    format: "E-Book",
    currentPage: 340,
    totalPages: 576,
    rating: 4,
    startDate: "2026-08-25",
    notes: "The big debt cycle and shifts in global reserve currencies. Crucial for wealth preservation.",
    quotes: "He who lives by the crystal ball will eat shattered glass.",
    coverColor: "from-blue-600 to-indigo-800",
  },
  {
    id: "b3",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    shelf: "finished",
    genre: "Personal Finance",
    format: "Physical",
    currentPage: 256,
    totalPages: 256,
    rating: 5,
    startDate: "2026-06-01",
    finishDate: "2026-06-20",
    notes: "Doing well with money has a little to do with how smart you are and a lot to do with how you behave.",
    quotes: "Spending money to show people how much money you have is the fastest way to have less money.",
    coverColor: "from-emerald-600 to-teal-800",
  },
  {
    id: "b4",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    shelf: "to-read",
    genre: "Software Engineering",
    format: "Physical",
    currentPage: 0,
    totalPages: 614,
    rating: 5,
    notes: "Must-read for distributed systems, replication topologies, and consensus models.",
    coverColor: "from-purple-600 to-border",
  },
  {
    id: "b5",
    title: "Atomic Habits",
    author: "James Clear",
    shelf: "finished",
    genre: "Self Improvement",
    format: "Audiobook",
    currentPage: 320,
    totalPages: 320,
    rating: 5,
    startDate: "2026-05-10",
    finishDate: "2026-05-28",
    notes: "The 1% improvement compounding effect. Focus on identity shift rather than goals alone.",
    quotes: "You do not rise to the level of your goals. You fall to the level of your systems.",
    coverColor: "from-orange-500 to-amber-700",
  },
];

const GENRES = [
  "All Genres",
  "Psychology & Behavioral Economics",
  "Macroeconomics & History",
  "Personal Finance",
  "Software Engineering",
  "Self Improvement",
  "Management & Strategy",
];

const COLOR_OPTIONS = [
  { label: "Ocean Indigo", value: "from-blue-600 to-indigo-800" },
  { label: "Sunset Amber", value: "from-amber-600 to-rose-700" },
  { label: "Emerald Pine", value: "from-emerald-600 to-teal-800" },
  { label: "Deep Violet", value: "from-purple-600 to-border" },
  { label: "Solar Gold", value: "from-orange-500 to-amber-700" },
  { label: "Crimson Velvet", value: "from-rose-600 to-pink-800" },
];

export function ReadingListView() {
  const [books, setBooks] = useState<BookItem[]>(() => {
    try {
      const saved = localStorage.getItem("client_os_reading_list");
      return saved ? JSON.parse(saved) : DEFAULT_BOOKS;
    } catch {
      return DEFAULT_BOOKS;
    }
  });

  const [activeTab, setActiveTab] = useState<"all" | BookShelf>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookItem | null>(null);
  const [viewingNotesBook, setViewingNotesBook] = useState<BookItem | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [formShelf, setFormShelf] = useState<BookShelf>("reading");
  const [formGenre, setFormGenre] = useState("Personal Finance");
  const [formFormat, setFormFormat] = useState<BookFormat>("Physical");
  const [formCurrentPage, setFormCurrentPage] = useState<number>(0);
  const [formTotalPages, setFormTotalPages] = useState<number>(300);
  const [formRating, setFormRating] = useState<number>(5);
  const [formNotes, setFormNotes] = useState("");
  const [formQuotes, setFormQuotes] = useState("");
  const [formCoverColor, setFormCoverColor] = useState("from-blue-600 to-indigo-800");

  useEffect(() => {
    try {
      localStorage.setItem("client_os_reading_list", JSON.stringify(books));
    } catch (e) {
      console.error("Failed to save reading list", e);
    }
  }, [books]);

  // Derived metrics
  const stats = useMemo(() => {
    const readingCount = books.filter((b) => b.shelf === "reading").length;
    const finishedCount = books.filter((b) => b.shelf === "finished").length;
    const toReadCount = books.filter((b) => b.shelf === "to-read").length;
    const totalPagesRead = books.reduce((acc, curr) => acc + (curr.currentPage || 0), 0);
    return { readingCount, finishedCount, toReadCount, totalPagesRead };
  }, [books]);

  // Filtered books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchShelf = activeTab === "all" ? true : book.shelf === activeTab;
      const matchGenre = selectedGenre === "All Genres" ? true : book.genre === selectedGenre;
      const matchSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchQuery.toLowerCase());
      return matchShelf && matchGenre && matchSearch;
    });
  }, [books, activeTab, selectedGenre, searchQuery]);

  const openAddModal = () => {
    setEditingBook(null);
    setFormTitle("");
    setFormAuthor("");
    setFormShelf("reading");
    setFormGenre("Personal Finance");
    setFormFormat("Physical");
    setFormCurrentPage(0);
    setFormTotalPages(320);
    setFormRating(5);
    setFormNotes("");
    setFormQuotes("");
    setFormCoverColor(COLOR_OPTIONS[0].value);
    setIsFormModalOpen(true);
  };

  const openEditModal = (book: BookItem) => {
    setEditingBook(book);
    setFormTitle(book.title);
    setFormAuthor(book.author);
    setFormShelf(book.shelf);
    setFormGenre(book.genre);
    setFormFormat(book.format);
    setFormCurrentPage(book.currentPage);
    setFormTotalPages(book.totalPages);
    setFormRating(book.rating || 5);
    setFormNotes(book.notes || "");
    setFormQuotes(book.quotes || "");
    setFormCoverColor(book.coverColor || COLOR_OPTIONS[0].value);
    setIsFormModalOpen(true);
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const validatedTotal = Math.max(1, Number(formTotalPages) || 1);
    const validatedCurrent = Math.min(validatedTotal, Math.max(0, Number(formCurrentPage) || 0));
    const isFinished = validatedCurrent >= validatedTotal && validatedTotal > 0;

    const finalShelf: BookShelf = isFinished ? "finished" : formShelf;

    if (editingBook) {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === editingBook.id
            ? {
                ...b,
                title: formTitle.trim(),
                author: formAuthor.trim() || "Unknown Author",
                shelf: finalShelf,
                genre: formGenre,
                format: formFormat,
                currentPage: validatedCurrent,
                totalPages: validatedTotal,
                rating: formRating,
                notes: formNotes.trim(),
                quotes: formQuotes.trim(),
                coverColor: formCoverColor,
                finishDate: isFinished && !b.finishDate ? new Date().toISOString().split("T")[0] : b.finishDate,
              }
            : b
        )
      );
    } else {
      const newBook: BookItem = {
        id: `book_${Date.now()}`,
        title: formTitle.trim(),
        author: formAuthor.trim() || "Unknown Author",
        shelf: finalShelf,
        genre: formGenre,
        format: formFormat,
        currentPage: validatedCurrent,
        totalPages: validatedTotal,
        rating: formRating,
        startDate: new Date().toISOString().split("T")[0],
        finishDate: isFinished ? new Date().toISOString().split("T")[0] : undefined,
        notes: formNotes.trim(),
        quotes: formQuotes.trim(),
        coverColor: formCoverColor,
      };
      setBooks((prev) => [newBook, ...prev]);
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteBook = (id: string) => {
    if (confirm("Delete this book from your reading list?")) {
      setBooks((prev) => prev.filter((b) => b.id !== id));
      if (viewingNotesBook?.id === id) setViewingNotesBook(null);
    }
  };

  const handleQuickPageStep = (id: string, delta: number) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const newPage = Math.min(b.totalPages, Math.max(0, b.currentPage + delta));
        const autoFinished = newPage >= b.totalPages;
        return {
          ...b,
          currentPage: newPage,
          shelf: autoFinished ? "finished" : b.shelf === "finished" && newPage < b.totalPages ? "reading" : b.shelf,
          finishDate: autoFinished && !b.finishDate ? new Date().toISOString().split("T")[0] : b.finishDate,
        };
      })
    );
  };

  const handleStatusChange = (id: string, newShelf: BookShelf) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const autoCurrent = newShelf === "finished" ? b.totalPages : newShelf === "to-read" ? 0 : b.currentPage;
        return {
          ...b,
          shelf: newShelf,
          currentPage: autoCurrent,
          finishDate: newShelf === "finished" ? new Date().toISOString().split("T")[0] : undefined,
        };
      })
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full flex flex-col space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Book className="w-5 h-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Reading List</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your personal library, reading progress, and essential highlights.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openAddModal}
            id="btn-add-book"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm active:scale-[0.98]"
          >
            <Plus size={16} />
            Add Book
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground">Currently Reading</span>
            <div className="text-2xl font-bold text-foreground mt-0.5">{stats.readingCount}</div>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">In active shelf</span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
            <BookOpen size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground">Books Finished</span>
            <div className="text-2xl font-bold text-foreground mt-0.5">{stats.finishedCount}</div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Completed</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground">Pages Read</span>
            <div className="text-2xl font-bold text-foreground mt-0.5">{stats.totalPagesRead.toLocaleString()}</div>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Total logged</span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground">Want to Read</span>
            <div className="text-2xl font-bold text-foreground mt-0.5">{stats.toReadCount}</div>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">In backlog</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
            <Bookmark size={20} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border/60">
        {/* Shelf Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {(
            [
              { id: "all", label: "All Books" },
              { id: "reading", label: "Reading" },
              { id: "to-read", label: "Want to Read" },
              { id: "finished", label: "Finished" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3 py-1.5 text-xs md:text-sm font-medium rounded-xl whitespace-nowrap transition-colors",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Genre Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search title, author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-muted/50 border border-border/70 rounded-xl text-xs md:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            aria-label="Filter books by genre"
            className="px-2.5 py-1.5 bg-muted/50 border border-border/70 rounded-xl text-xs md:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {GENRES.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Book Grid */}
      {filteredBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border/80 rounded-3xl bg-card/40 text-center">
          <div className="w-14 h-14 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3">
            <BookOpen size={28} />
          </div>
          <h3 className="text-base font-semibold text-foreground">No books found</h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-sm">
            {searchQuery || selectedGenre !== "All Genres" || activeTab !== "all"
              ? "Try adjusting your search terms or filters to find what you're looking for."
              : "Your reading shelf is currently empty. Click 'Add Book' above to start tracking."}
          </p>
          {(searchQuery || selectedGenre !== "All Genres" || activeTab !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedGenre("All Genres");
                setActiveTab("all");
              }}
              className="mt-4 px-3 py-1.5 text-xs font-medium text-blue-600 hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBooks.map((book) => {
            const percentage = Math.min(
              100,
              Math.round(((book.currentPage || 0) / (book.totalPages || 1)) * 100)
            );
            return (
              <div
                key={book.id}
                className="group flex flex-col bg-card border border-border/70 rounded-2xl p-4 hover:shadow-md transition-all relative overflow-hidden"
              >
                {/* Top Banner Accent */}
                <div className="flex items-start gap-3">
                  {/* Visual Book Spine */}
                  <div
                    className={cn(
                      "w-12 h-16 rounded-lg bg-linear-to-br shadow-xs flex flex-col items-center justify-between p-1.5 shrink-0 text-white",
                      book.coverColor || "from-blue-600 to-indigo-800"
                    )}
                  >
                    <Book size={14} className="opacity-80" />
                    <span className="text-[9px] font-mono tracking-tighter uppercase font-bold opacity-90">
                      {book.format.slice(0, 3)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground truncate">
                        {book.genre}
                      </span>
                      {/* Rating stars */}
                      <div className="flex items-center text-amber-500 shrink-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={cn(i < book.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")}
                          />
                        ))}
                      </div>
                    </div>

                    <h3 className="font-semibold text-sm md:text-base text-foreground truncate mt-1 group-hover:text-blue-600 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                  </div>
                </div>

                {/* Progress Bar & Quick Step */}
                <div className="mt-4 pt-3 border-t border-border/40">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground font-medium">
                      p. <strong className="text-foreground">{book.currentPage}</strong> of {book.totalPages}
                    </span>
                    <span
                      className={cn(
                        "font-semibold text-xs",
                        percentage === 100 ? "text-emerald-600" : "text-blue-600 dark:text-blue-400"
                      )}
                    >
                      {percentage}%
                    </span>
                  </div>

                  {/* Progress track */}
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        percentage === 100 ? "bg-emerald-500" : "bg-blue-600"
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  {/* Quick update buttons */}
                  <div className="flex items-center justify-between mt-3 text-xs">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleQuickPageStep(book.id, -10)}
                        title="Step back 10 pages"
                        className="px-2 py-0.5 bg-muted hover:bg-muted/80 rounded-md font-mono text-[11px] text-muted-foreground hover:text-foreground"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => handleQuickPageStep(book.id, 10)}
                        title="Add 10 pages"
                        className="px-2 py-0.5 bg-muted hover:bg-muted/80 rounded-md font-mono text-[11px] text-muted-foreground hover:text-foreground"
                      >
                        +10
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Shelf quick dropdown */}
                      <select
                        value={book.shelf}
                        onChange={(e) => handleStatusChange(book.id, e.target.value as BookShelf)}
                        aria-label="Change reading status"
                        className="text-[11px] bg-muted/60 border border-border/60 rounded-md px-1.5 py-0.5 text-foreground focus:outline-none"
                      >
                        <option value="reading">Reading</option>
                        <option value="to-read">To Read</option>
                        <option value="finished">Finished</option>
                        <option value="abandoned">Abandoned</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Footer Actions (Takeaways & Controls) */}
                <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between">
                  <button
                    onClick={() => setViewingNotesBook(book)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-blue-600 transition-colors font-medium"
                  >
                    <FileText size={13} />
                    <span>{book.notes || book.quotes ? "Notes & Quotes" : "Add Notes"}</span>
                    <ChevronRight size={13} />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(book)}
                      title="Edit book details"
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      title="Remove book"
                      className="p-1 rounded-md text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add or Edit Book */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/20">
              <h2 className="text-base font-semibold text-foreground">
                {editingBook ? "Edit Book Details" : "Add Book to Library"}
              </h2>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBook} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Book Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thinking, Fast and Slow"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Author</label>
                  <input
                    type="text"
                    placeholder="e.g. Daniel Kahneman"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Shelf Status</label>
                  <select
                    value={formShelf}
                    onChange={(e) => setFormShelf(e.target.value as BookShelf)}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="reading">Currently Reading</option>
                    <option value="to-read">Want to Read</option>
                    <option value="finished">Finished</option>
                    <option value="abandoned">Abandoned</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Genre / Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Personal Finance, Tech"
                    value={formGenre}
                    onChange={(e) => setFormGenre(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Format</label>
                  <select
                    value={formFormat}
                    onChange={(e) => setFormFormat(e.target.value as BookFormat)}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Physical">Physical Book</option>
                    <option value="E-Book">E-Book / Kindle</option>
                    <option value="Audiobook">Audiobook</option>
                    <option value="Article/PDF">Article / Research PDF</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Current Page</label>
                  <input
                    type="number"
                    min="0"
                    max={formTotalPages}
                    value={formCurrentPage}
                    onChange={(e) => setFormCurrentPage(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Total Pages</label>
                  <input
                    type="number"
                    min="1"
                    value={formTotalPages}
                    onChange={(e) => setFormTotalPages(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Rating (1 - 5)</label>
                  <div className="flex items-center gap-1 py-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormRating(star)}
                        className="text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star
                          size={18}
                          className={cn(star <= formRating ? "fill-amber-400" : "text-muted-foreground/30")}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cover Color Picker */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Cover Accent</label>
                <div className="flex items-center gap-2">
                  {COLOR_OPTIONS.map((col) => (
                    <button
                      type="button"
                      key={col.value}
                      onClick={() => setFormCoverColor(col.value)}
                      title={col.label}
                      className={cn(
                        "w-7 h-7 rounded-lg bg-linear-to-br transition-all",
                        col.value,
                        formCoverColor === col.value ? "ring-2 ring-primary ring-offset-2 scale-110" : "opacity-80"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Takeaways & Quotes */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Key Takeaways & Summary</label>
                <textarea
                  rows={3}
                  placeholder="Summarize main arguments or insights..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Memorable Quotes</label>
                <textarea
                  rows={2}
                  placeholder="Favorite sentence or quote..."
                  value={formQuotes}
                  onChange={(e) => setFormQuotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary italic"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
                >
                  {editingBook ? "Save Changes" : "Add to Library"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Notes & Quotes */}
      {viewingNotesBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/20">
              <div>
                <h3 className="text-base font-semibold text-foreground">{viewingNotesBook.title}</h3>
                <p className="text-xs text-muted-foreground">by {viewingNotesBook.author}</p>
              </div>
              <button
                onClick={() => setViewingNotesBook(null)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Sparkles size={14} className="text-amber-500" />
                  Key Takeaways & Insights
                </h4>
                {viewingNotesBook.notes ? (
                  <p className="text-sm text-foreground bg-muted/40 p-3.5 rounded-xl border border-border/40 whitespace-pre-wrap leading-relaxed">
                    {viewingNotesBook.notes}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground italic bg-muted/20 p-3 rounded-xl">
                    No notes recorded yet.
                  </p>
                )}
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Bookmark size={14} className="text-blue-500" />
                  Memorable Quote
                </h4>
                {viewingNotesBook.quotes ? (
                  <blockquote className="text-sm italic text-foreground bg-blue-50/50 dark:bg-blue-950/20 p-3.5 rounded-xl border-l-4 border-blue-600">
                    "{viewingNotesBook.quotes}"
                  </blockquote>
                ) : (
                  <p className="text-xs text-muted-foreground italic bg-muted/20 p-3 rounded-xl">
                    No memorable quotes recorded.
                  </p>
                )}
              </div>
            </div>

            <div className="px-6 py-3 border-t border-border/60 flex items-center justify-between bg-muted/10">
              <button
                onClick={() => {
                  const b = viewingNotesBook;
                  setViewingNotesBook(null);
                  openEditModal(b);
                }}
                className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
              >
                <Edit2 size={12} />
                Edit Notes or Quotes
              </button>
              <button
                onClick={() => setViewingNotesBook(null)}
                className="px-3 py-1.5 text-xs font-medium bg-muted hover:bg-muted/80 text-foreground rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
