import React, { useState, useEffect, useMemo } from "react";
import {
  Globe,
  Plus,
  Search,
  BookA,
  Eye,
  EyeOff,
  Trash2,
  Edit2,
  Headphones,
  Mic,
  BookOpen,
  PenTool,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type WordStatus = "new" | "reviewing" | "mastered";

export interface VocabItem {
  id: string;
  word: string;
  reading?: string; // e.g. Furigana, Pinyin, IPA
  meaning: string;
  category: string; // e.g. Business, Daily, Slang, Tech
  exampleSentence?: string;
  exampleTranslation?: string;
  status: WordStatus;
  timesReviewed: number;
}

export interface LanguageProfile {
  id: string;
  name: string;
  code: string;
  flag: string; // emoji or code
  targetLevel: string; // e.g. "B2 Business", "JLPT N2", "HSK 4"
  hoursLogged: number;
  targetHours: number;
  skills: {
    listening: number; // 0 - 100%
    speaking: number;
    reading: number;
    writing: number;
  };
  words: VocabItem[];
}

const DEFAULT_LANGUAGES: LanguageProfile[] = [
  {
    id: "lang_en",
    name: "Business English",
    code: "en",
    flag: "🇬🇧",
    targetLevel: "C1 Advanced Professional",
    hoursLogged: 145,
    targetHours: 200,
    skills: {
      listening: 85,
      speaking: 70,
      reading: 90,
      writing: 75,
    },
    words: [
      {
        id: "w1",
        word: "Leverage",
        reading: "/ˈliːvərɪdʒ/",
        meaning: "To use something to maximum advantage",
        category: "Business Strategy",
        exampleSentence: "We can leverage our existing client relationships to expand into the enterprise tier.",
        exampleTranslation: "Kita dapat memanfaatkan relasi klien yang ada untuk berekspansi ke segmen enterprise.",
        status: "mastered",
        timesReviewed: 8,
      },
      {
        id: "w2",
        word: "Mitigate",
        reading: "/ˈmɪtɪɡeɪt/",
        meaning: "Make less severe, serious, or painful",
        category: "Risk Management",
        exampleSentence: "The contingency clause is designed to mitigate currency exchange risks.",
        exampleTranslation: "Klausa kontinjensi dirancang untuk memitigasi risiko fluktuasi nilai tukar.",
        status: "reviewing",
        timesReviewed: 4,
      },
      {
        id: "w3",
        word: "Synergy",
        reading: "/ˈsɪnədʒi/",
        meaning: "Interaction of elements producing a combined effect greater than the sum",
        category: "M&A",
        exampleSentence: "The post-merger integration unlocked significant operational synergies.",
        exampleTranslation: "Integrasi pasca-merger membuka sinergi operasional yang signifikan.",
        status: "mastered",
        timesReviewed: 12,
      },
      {
        id: "w4",
        word: "Pragmatic",
        reading: "/præɡˈmætɪk/",
        meaning: "Dealing with things sensibly and realistically based on practical considerations",
        category: "General",
        exampleSentence: "Let's adopt a pragmatic roadmap rather than theoretical milestones.",
        exampleTranslation: "Mari kita terapkan roadmap pragmatis daripada target-target teoritis.",
        status: "new",
        timesReviewed: 1,
      },
    ],
  },
  {
    id: "lang_ja",
    name: "Japanese (日本語)",
    code: "ja",
    flag: "🇯🇵",
    targetLevel: "JLPT N2 (Upper Intermediate)",
    hoursLogged: 92,
    targetHours: 300,
    skills: {
      listening: 60,
      speaking: 45,
      reading: 75,
      writing: 40,
    },
    words: [
      {
        id: "wj1",
        word: "改善",
        reading: "かいぜん (Kaizen)",
        meaning: "Continuous incremental improvement",
        category: "Operations",
        exampleSentence: "製造プロセスの改善を進めています。",
        exampleTranslation: "Kami sedang menjalankan continuous improvement pada proses manufaktur.",
        status: "mastered",
        timesReviewed: 15,
      },
      {
        id: "wj2",
        word: "稟議",
        reading: "りんぎ (Ringi)",
        meaning: "Consensus-based proposal circulation for approval",
        category: "Business Culture",
        exampleSentence: "新しいツールの導入には稟議書を提出する必要があります。",
        exampleTranslation: "Untuk implementasi tools baru, perlu pengajuan dokumen ringi.",
        status: "reviewing",
        timesReviewed: 5,
      },
      {
        id: "wj3",
        word: "優先順位",
        reading: "ゆうせんじゅんい (Yuusen jun'i)",
        meaning: "Order of priority / Priority ranking",
        category: "Management",
        exampleSentence: "タスクの優先順位を明確にしましょう。",
        exampleTranslation: "Mari perjelas urutan prioritas setiap tugas.",
        status: "new",
        timesReviewed: 2,
      },
    ],
  },
  {
    id: "lang_de",
    name: "German (Deutsch)",
    code: "de",
    flag: "🇩🇪",
    targetLevel: "Goethe-Zertifikat B1",
    hoursLogged: 35,
    targetHours: 150,
    skills: {
      listening: 40,
      speaking: 30,
      reading: 50,
      writing: 35,
    },
    words: [
      {
        id: "wd1",
        word: "Feierabend",
        reading: "/ˈfaɪ̯ɐˌʔaːbn̩t/",
        meaning: "The end of the working day, evening leisure time",
        category: "Culture",
        exampleSentence: "Schönen Feierabend allerseits!",
        exampleTranslation: "Selamat menikmati waktu luang setelah kerja semuanya!",
        status: "mastered",
        timesReviewed: 6,
      },
      {
        id: "wd2",
        word: "Verhandlungsbasis",
        reading: "/fɛɐ̯ˈhandlʊŋsˌbaːzɪs/",
        meaning: "Basis for negotiation (VB)",
        category: "Business",
        exampleSentence: "Der genannte Preis versteht sich als Verhandlungsbasis.",
        exampleTranslation: "Harga yang tertera merupakan dasar untuk negosiasi.",
        status: "reviewing",
        timesReviewed: 3,
      },
    ],
  },
];

export function LanguagesView() {
  const [languages, setLanguages] = useState<LanguageProfile[]>(() => {
    try {
      const saved = localStorage.getItem("client_os_languages_data");
      return saved ? JSON.parse(saved) : DEFAULT_LANGUAGES;
    } catch {
      return DEFAULT_LANGUAGES;
    }
  });

  const [selectedLangId, setSelectedLangId] = useState<string>(() => {
    return languages[0]?.id || "lang_en";
  });

  const [activeStatusFilter, setActiveStatusFilter] = useState<"all" | WordStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "flashcards">("table");

  // Flashcard carousel state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Modals
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<VocabItem | null>(null);
  const [isNewLangModalOpen, setIsNewLangModalOpen] = useState(false);

  // Form Word states
  const [wordInput, setWordInput] = useState("");
  const [readingInput, setReadingInput] = useState("");
  const [meaningInput, setMeaningInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("Business");
  const [exampleInput, setExampleInput] = useState("");
  const [exampleTransInput, setExampleTransInput] = useState("");
  const [statusInput, setStatusInput] = useState<WordStatus>("new");

  // Form New Language
  const [newLangName, setNewLangName] = useState("");
  const [newLangFlag, setNewLangFlag] = useState("🌐");
  const [newLangTarget, setNewLangTarget] = useState("B1 Intermediate");
  const [newLangTargetHours, setNewLangTargetHours] = useState(150);

  useEffect(() => {
    try {
      localStorage.setItem("client_os_languages_data", JSON.stringify(languages));
    } catch (e) {
      console.error("Failed to save languages data", e);
    }
  }, [languages]);

  const currentLanguage = useMemo(() => {
    return languages.find((l) => l.id === selectedLangId) || languages[0];
  }, [languages, selectedLangId]);

  // Filtered vocabulary
  const filteredWords = useMemo(() => {
    if (!currentLanguage) return [];
    return currentLanguage.words.filter((item) => {
      const matchStatus = activeStatusFilter === "all" ? true : item.status === activeStatusFilter;
      const matchSearch =
        item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.reading && item.reading.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [currentLanguage, activeStatusFilter, searchQuery]);

  // Reset flashcard index if out of bounds
  useEffect(() => {
    setFlashcardIndex(0);
    setIsFlipped(false);
  }, [selectedLangId, activeStatusFilter]);

  // Handlers for word CRUD
  const handleOpenAddWord = () => {
    setEditingWord(null);
    setWordInput("");
    setReadingInput("");
    setMeaningInput("");
    setCategoryInput("Business");
    setExampleInput("");
    setExampleTransInput("");
    setStatusInput("new");
    setIsWordModalOpen(true);
  };

  const handleOpenEditWord = (item: VocabItem) => {
    setEditingWord(item);
    setWordInput(item.word);
    setReadingInput(item.reading || "");
    setMeaningInput(item.meaning);
    setCategoryInput(item.category);
    setExampleInput(item.exampleSentence || "");
    setExampleTransInput(item.exampleTranslation || "");
    setStatusInput(item.status);
    setIsWordModalOpen(true);
  };

  const handleSaveWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wordInput.trim() || !meaningInput.trim() || !currentLanguage) return;

    if (editingWord) {
      setLanguages((prev) =>
        prev.map((lang) => {
          if (lang.id !== currentLanguage.id) return lang;
          return {
            ...lang,
            words: lang.words.map((w) =>
              w.id === editingWord.id
                ? {
                    ...w,
                    word: wordInput.trim(),
                    reading: readingInput.trim() || undefined,
                    meaning: meaningInput.trim(),
                    category: categoryInput.trim() || "General",
                    exampleSentence: exampleInput.trim() || undefined,
                    exampleTranslation: exampleTransInput.trim() || undefined,
                    status: statusInput,
                  }
                : w
            ),
          };
        })
      );
    } else {
      const newItem: VocabItem = {
        id: `word_${Date.now()}`,
        word: wordInput.trim(),
        reading: readingInput.trim() || undefined,
        meaning: meaningInput.trim(),
        category: categoryInput.trim() || "General",
        exampleSentence: exampleInput.trim() || undefined,
        exampleTranslation: exampleTransInput.trim() || undefined,
        status: statusInput,
        timesReviewed: 0,
      };
      setLanguages((prev) =>
        prev.map((lang) => {
          if (lang.id !== currentLanguage.id) return lang;
          return {
            ...lang,
            words: [newItem, ...lang.words],
          };
        })
      );
    }
    setIsWordModalOpen(false);
  };

  const handleDeleteWord = (id: string) => {
    if (!currentLanguage) return;
    if (confirm("Remove this word from your vocabulary deck?")) {
      setLanguages((prev) =>
        prev.map((lang) => {
          if (lang.id !== currentLanguage.id) return lang;
          return {
            ...lang,
            words: lang.words.filter((w) => w.id !== id),
          };
        })
      );
    }
  };

  const handleWordStatusToggle = (wordId: string, newStatus: WordStatus) => {
    if (!currentLanguage) return;
    setLanguages((prev) =>
      prev.map((lang) => {
        if (lang.id !== currentLanguage.id) return lang;
        return {
          ...lang,
          words: lang.words.map((w) =>
            w.id === wordId
              ? {
                  ...w,
                  status: newStatus,
                  timesReviewed: newStatus === "mastered" ? w.timesReviewed + 1 : w.timesReviewed,
                }
              : w
          ),
        };
      })
    );
  };

  // Log study hour quick increment
  const handleAddStudyHour = (hours: number) => {
    if (!currentLanguage) return;
    setLanguages((prev) =>
      prev.map((l) => (l.id === currentLanguage.id ? { ...l, hoursLogged: Math.max(0, l.hoursLogged + hours) } : l))
    );
  };

  // Add new language handler
  const handleCreateLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLangName.trim()) return;
    const newProfile: LanguageProfile = {
      id: `lang_${Date.now()}`,
      name: newLangName.trim(),
      code: newLangName.slice(0, 2).toLowerCase(),
      flag: newLangFlag.trim() || "🌐",
      targetLevel: newLangTarget.trim() || "B1 Intermediate",
      hoursLogged: 0,
      targetHours: Math.max(20, Number(newLangTargetHours) || 100),
      skills: { listening: 10, speaking: 10, reading: 15, writing: 10 },
      words: [],
    };
    setLanguages((prev) => [...prev, newProfile]);
    setSelectedLangId(newProfile.id);
    setIsNewLangModalOpen(false);
  };

  const currentCard = filteredWords[flashcardIndex];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full flex flex-col space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Globe className="w-5 h-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Languages</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Build vocabulary decks, track 4-skill proficiency, and master target languages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewLangModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-border/80 hover:bg-muted rounded-xl text-foreground transition-colors"
          >
            <Plus size={14} />
            Add Language
          </button>
          <button
            onClick={handleOpenAddWord}
            id="btn-add-word"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm active:scale-[0.98]"
          >
            <Plus size={16} />
            Add Word
          </button>
        </div>
      </div>

      {/* Language Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {languages.map((lang) => {
          const isSelected = lang.id === selectedLangId;
          return (
            <button
              key={lang.id}
              onClick={() => setSelectedLangId(lang.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-semibold transition-all border shrink-0",
                isSelected
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/20"
                  : "bg-card hover:bg-muted/60 text-muted-foreground hover:text-foreground border-border/70"
              )}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.name}</span>
              <span
                className={cn(
                  "text-[11px] px-2 py-0.5 rounded-full font-mono font-normal",
                  isSelected ? "bg-card/20 text-white" : "bg-muted text-muted-foreground"
                )}
              >
                {lang.targetLevel}
              </span>
            </button>
          );
        })}
      </div>

      {currentLanguage && (
        <>
          {/* Overview Banner: Stats & 4-Pillar Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Study Hours Card */}
            <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Immersion & Study Time</span>
                  <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                    {Math.round((currentLanguage.hoursLogged / currentLanguage.targetHours) * 100)}%
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-3xl font-extrabold text-foreground">{currentLanguage.hoursLogged}</span>
                  <span className="text-xs text-muted-foreground">/ {currentLanguage.targetHours} jam target</span>
                </div>

                <div className="w-full bg-muted rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (currentLanguage.hoursLogged / currentLanguage.targetHours) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/40">
                <span className="text-xs text-muted-foreground">Quick Log:</span>
                <button
                  onClick={() => handleAddStudyHour(1)}
                  className="px-2.5 py-1 text-xs font-semibold bg-muted hover:bg-muted/80 rounded-lg text-foreground transition-colors"
                >
                  +1 Jam
                </button>
                <button
                  onClick={() => handleAddStudyHour(2)}
                  className="px-2.5 py-1 text-xs font-semibold bg-muted hover:bg-muted/80 rounded-lg text-foreground transition-colors"
                >
                  +2 Jam
                </button>
              </div>
            </div>

            {/* Vocab Mastery Stats */}
            <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-medium text-muted-foreground">Vocabulary Retention</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-extrabold text-foreground">{currentLanguage.words.length}</span>
                  <span className="text-xs text-muted-foreground">Total Words Saved</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-center">
                    <span className="text-[11px] font-medium text-emerald-600 block">Mastered</span>
                    <strong className="text-base text-foreground">
                      {currentLanguage.words.filter((w) => w.status === "mastered").length}
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-center">
                    <span className="text-[11px] font-medium text-amber-600 block">Reviewing</span>
                    <strong className="text-base text-foreground">
                      {currentLanguage.words.filter((w) => w.status === "reviewing").length}
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-center">
                    <span className="text-[11px] font-medium text-blue-600 block">New Words</span>
                    <strong className="text-base text-foreground">
                      {currentLanguage.words.filter((w) => w.status === "new").length}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/40 text-xs text-muted-foreground flex items-center justify-between">
                <span>Memory Goal</span>
                <strong className="text-foreground">80% Mastered</strong>
              </div>
            </div>

            {/* 4 Skill Pillars */}
            <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-medium text-muted-foreground">4 Core Skill Pillars</span>
                <div className="space-y-2 mt-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Headphones size={13} className="text-blue-500" /> Listening
                    </span>
                    <span className="font-semibold text-foreground">{currentLanguage.skills.listening}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${currentLanguage.skills.listening}%` }} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Mic size={13} className="text-emerald-500" /> Speaking
                    </span>
                    <span className="font-semibold text-foreground">{currentLanguage.skills.speaking}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${currentLanguage.skills.speaking}%` }} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <BookOpen size={13} className="text-amber-500" /> Reading
                    </span>
                    <span className="font-semibold text-foreground">{currentLanguage.skills.reading}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${currentLanguage.skills.reading}%` }} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <PenTool size={13} className="text-purple-500" /> Writing
                    </span>
                    <span className="font-semibold text-foreground">{currentLanguage.skills.writing}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${currentLanguage.skills.writing}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vocabulary Deck Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border/70">
            {/* Status Filter */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {(
                [
                  { id: "all", label: "All Words" },
                  { id: "new", label: "New" },
                  { id: "reviewing", label: "Reviewing" },
                  { id: "mastered", label: "Mastered" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveStatusFilter(tab.id)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-colors",
                    activeStatusFilter === tab.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search & View Mode Switcher */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search word, meaning..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-muted/50 border border-border/70 rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* View Switcher Button */}
              <div className="flex items-center p-0.5 bg-muted/60 rounded-xl border border-border/60">
                <button
                  onClick={() => setViewMode("table")}
                  className={cn(
                    "px-2.5 py-1 text-xs font-medium rounded-lg transition-colors",
                    viewMode === "table" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  List View
                </button>
                <button
                  onClick={() => setViewMode("flashcards")}
                  className={cn(
                    "px-2.5 py-1 text-xs font-medium rounded-lg transition-colors",
                    viewMode === "flashcards" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Flashcard Mode
                </button>
              </div>
            </div>
          </div>

          {/* Mode 1: Flashcard Practice Mode */}
          {viewMode === "flashcards" && (
            <div className="bg-card border border-border/70 rounded-3xl p-6 flex flex-col items-center justify-center max-w-xl mx-auto w-full shadow-md min-h-[360px]">
              {filteredWords.length === 0 ? (
                <div className="text-center p-6 text-muted-foreground">
                  <p className="text-sm">No flashcards available in this filter.</p>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <div className="w-full flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span>Card {flashcardIndex + 1} of {filteredWords.length}</span>
                    <span className="font-semibold uppercase tracking-wider text-[11px] px-2 py-0.5 rounded-md bg-muted">
                      {currentCard?.category}
                    </span>
                  </div>

                  {/* Interactive Card */}
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="w-full min-h-[220px] cursor-pointer rounded-2xl border border-border/80 bg-linear-to-b from-muted/30 to-muted/80 p-8 flex flex-col items-center justify-center text-center relative group select-none transition-all hover:border-indigo-500/50"
                  >
                    <span className="absolute top-3 right-3 text-xs text-muted-foreground flex items-center gap-1 group-hover:text-indigo-600">
                      {isFlipped ? <EyeOff size={14} /> : <Eye size={14} />}
                      {isFlipped ? "Hide meaning" : "Click to flip"}
                    </span>

                    <h3 className="text-3xl font-extrabold text-foreground tracking-tight">{currentCard?.word}</h3>

                    {currentCard?.reading && (
                      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-1">
                        {currentCard?.reading}
                      </p>
                    )}

                    {isFlipped && (
                      <div className="mt-5 pt-4 border-t border-border/60 w-full animate-in fade-in duration-200">
                        <p className="text-base font-semibold text-foreground">{currentCard?.meaning}</p>
                        {currentCard?.exampleSentence && (
                          <div className="mt-3 p-3 rounded-xl bg-card border border-border/40 text-xs text-left">
                            <p className="text-foreground italic">"{currentCard.exampleSentence}"</p>
                            {currentCard.exampleTranslation && (
                              <p className="text-muted-foreground mt-1">{currentCard.exampleTranslation}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between w-full mt-6 gap-3">
                    <button
                      disabled={flashcardIndex === 0}
                      onClick={() => {
                        setIsFlipped(false);
                        setFlashcardIndex((prev) => Math.max(0, prev - 1));
                      }}
                      className="px-4 py-2 text-xs font-medium bg-muted hover:bg-muted/80 disabled:opacity-40 rounded-xl transition-colors"
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleWordStatusToggle(currentCard.id, "reviewing")}
                        className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors"
                      >
                        Needs Review
                      </button>
                      <button
                        onClick={() => handleWordStatusToggle(currentCard.id, "mastered")}
                        className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                      >
                        Mastered
                      </button>
                    </div>

                    <button
                      disabled={flashcardIndex >= filteredWords.length - 1}
                      onClick={() => {
                        setIsFlipped(false);
                        setFlashcardIndex((prev) => Math.min(filteredWords.length - 1, prev + 1));
                      }}
                      className="px-4 py-2 text-xs font-medium bg-muted hover:bg-muted/80 disabled:opacity-40 rounded-xl transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Table / List View */}
          {viewMode === "table" && (
            <div className="bg-card border border-border/70 rounded-2xl overflow-hidden shadow-xs">
              {filteredWords.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  <BookA size={32} className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm font-semibold text-foreground">No vocabulary matches your search</p>
                  <p className="text-xs mt-1">Try clearing filters or add a new word to this deck.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs md:text-sm">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-medium text-xs">
                        <th className="py-3 px-4">Word / Term</th>
                        <th className="py-3 px-4">Pronunciation</th>
                        <th className="py-3 px-4">Meaning & Context</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {filteredWords.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/20 transition-colors group">
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-foreground text-sm">{item.word}</span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-xs text-indigo-600 dark:text-indigo-400">
                            {item.reading || "—"}
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="font-medium text-foreground">{item.meaning}</div>
                            {item.exampleSentence && (
                              <div className="text-[11px] text-muted-foreground italic mt-0.5 line-clamp-1">
                                "{item.exampleSentence}"
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-semibold">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={item.status}
                              onChange={(e) => handleWordStatusToggle(item.id, e.target.value as WordStatus)}
                              aria-label="Change word status"
                              className={cn(
                                "text-[11px] font-semibold rounded-md px-2 py-1 border focus:outline-none",
                                item.status === "mastered"
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                                  : item.status === "reviewing"
                                  ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                                  : "bg-blue-500/10 text-blue-600 border-blue-500/30"
                              )}
                            >
                              <option value="new">New</option>
                              <option value="reviewing">Reviewing</option>
                              <option value="mastered">Mastered</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100">
                              <button
                                onClick={() => handleOpenEditWord(item)}
                                title="Edit word"
                                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteWord(item.id)}
                                title="Delete word"
                                className="p-1 rounded-md text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal: Add or Edit Word */}
      {isWordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/20">
              <h2 className="text-base font-semibold text-foreground">
                {editingWord ? "Edit Vocabulary Term" : `Add Word to ${currentLanguage?.name}`}
              </h2>
              <button
                onClick={() => setIsWordModalOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveWord} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Word / Expression <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Synergy, 改善, Feierabend"
                  value={wordInput}
                  onChange={(e) => setWordInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Pronunciation / Furigana / Pinyin
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /ˈsɪnədʒi/, かいぜん"
                    value={readingInput}
                    onChange={(e) => setReadingInput(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Category / Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Business, Tech, Daily"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Meaning & Translation <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Definition in Bahasa Indonesia or English"
                  value={meaningInput}
                  onChange={(e) => setMeaningInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Example Sentence</label>
                <textarea
                  rows={2}
                  placeholder="Show how the word is used in real context..."
                  value={exampleInput}
                  onChange={(e) => setExampleInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Sentence Translation</label>
                <input
                  type="text"
                  placeholder="Translation of the example sentence"
                  value={exampleTransInput}
                  onChange={(e) => setExampleTransInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Initial Mastery Status</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value as WordStatus)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="new">New Word</option>
                  <option value="reviewing">In Active Review</option>
                  <option value="mastered">Mastered</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsWordModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs"
                >
                  {editingWord ? "Save Changes" : "Add to Deck"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Language Profile */}
      {isNewLangModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/20">
              <h2 className="text-base font-semibold text-foreground">Add New Language Target</h2>
              <button
                onClick={() => setIsNewLangModalOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateLanguage} className="p-6 space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Flag/Emoji</label>
                  <input
                    type="text"
                    required
                    value={newLangFlag}
                    onChange={(e) => setNewLangFlag(e.target.value)}
                    className="w-full text-center text-xl px-2 py-2 bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Language Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. French, Mandarin, Arabic"
                    value={newLangName}
                    onChange={(e) => setNewLangName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Target Proficiency Level</label>
                <input
                  type="text"
                  placeholder="e.g. CEFR B2, DELF B1, HSK 4"
                  value={newLangTarget}
                  onChange={(e) => setNewLangTarget(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Total Target Study Hours</label>
                <input
                  type="number"
                  min="10"
                  max="2000"
                  value={newLangTargetHours}
                  onChange={(e) => setNewLangTargetHours(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsNewLangModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
