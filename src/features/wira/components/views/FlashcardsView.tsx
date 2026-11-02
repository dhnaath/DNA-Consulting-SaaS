import React, { useState, useEffect, useMemo } from "react";
import {
  Layers,
  Plus,
  Play,
  RotateCcw,
  Brain,
  Search,
  Sparkles,
  Award,
  Edit2,
  Trash2,
  X,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  tags?: string[];
  status: "new" | "learning" | "mastered";
  reviewCount: number;
  lastReviewed?: string;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  category: string;
  color: string; // e.g. "from-indigo-500 to-purple-600"
  cards: Flashcard[];
}

const DEFAULT_DECKS: FlashcardDeck[] = [
  {
    id: "deck_1",
    title: "System Design & Architecture",
    description: "Core distributed systems concepts, CAP theorem, and caching strategies.",
    category: "Software Engineering",
    color: "from-indigo-600 to-blue-700",
    cards: [
      {
        id: "c1",
        front: "What is the CAP Theorem?",
        back: "In a distributed computer system, it is impossible to simultaneously provide more than two out of three guarantees: Consistency (every read receives the most recent write), Availability (every request receives a non-error response), and Partition tolerance (the system continues to operate despite network partition).",
        hint: "Pick two: Consistency, Availability, Partition Tolerance.",
        tags: ["Distributed Systems", "Core"],
        status: "mastered",
        reviewCount: 4,
        lastReviewed: "2026-09-18",
      },
      {
        id: "c2",
        front: "Explain Consistent Hashing and its main benefit.",
        back: "Consistent Hashing is a distributed hashing scheme that operates independently of the number of servers. When a hash table is resized (node added or removed), only k/n keys need to be remapped on average, minimizing cache churn across distributed clusters.",
        hint: "Virtual nodes on a hash ring.",
        tags: ["Hashing", "Caching"],
        status: "mastered",
        reviewCount: 3,
        lastReviewed: "2026-09-18",
      },
      {
        id: "c3",
        front: "What is the difference between Cache-Aside and Write-Through?",
        back: "Cache-Aside: The application reads from cache; on miss, reads from DB and writes to cache. Application writes directly to DB and invalidates cache.\nWrite-Through: The application treats cache as main data store; cache synchronously updates DB before acknowledging the write.",
        hint: "Who updates the DB first?",
        tags: ["Caching", "Database"],
        status: "learning",
        reviewCount: 2,
        lastReviewed: "2026-09-17",
      },
      {
        id: "c4",
        front: "Explain the Raft Consensus Algorithm in simple terms.",
        back: "Raft achieves consensus via leader election, log replication, and safety. A single elected leader manages the replicated log, accepts client commands, replicates them to follower nodes, and tells followers when it is safe to commit.",
        hint: "Leader, Followers, and Candidate states.",
        tags: ["Consensus", "Distributed"],
        status: "new",
        reviewCount: 0,
      },
    ],
  },
  {
    id: "deck_2",
    title: "Financial Accounting & Valuation Ratios",
    description: "Key multiples, financial statement metrics, and cash flow formulas.",
    category: "Finance & Investment",
    color: "from-emerald-600 to-teal-700",
    cards: [
      {
        id: "c201",
        front: "Formula for DuPont Analysis (3-Step Return on Equity)?",
        back: "ROE = (Net Profit Margin) × (Asset Turnover) × (Financial Leverage Ratio)\n= (Net Income / Revenue) × (Revenue / Total Assets) × (Total Assets / Shareholders' Equity)",
        hint: "Profitability × Efficiency × Leverage",
        tags: ["DuPont", "ROE"],
        status: "mastered",
        reviewCount: 5,
        lastReviewed: "2026-09-19",
      },
      {
        id: "c202",
        front: "How do you calculate Free Cash Flow to Firm (FCFF) from CFO?",
        back: "FCFF = Cash Flow from Operations (CFO) + [Interest Expense × (1 - Tax Rate)] - Capital Expenditures (CapEx)",
        hint: "Adjust operating cash flow for after-tax debt interest and necessary CapEx.",
        tags: ["Cash Flow", "Valuation"],
        status: "learning",
        reviewCount: 2,
        lastReviewed: "2026-09-16",
      },
      {
        id: "c203",
        front: "What does Enterprise Value (EV) represent, and what is its formula?",
        back: "EV measures the total value of a company's core business operations available to all capital providers.\nFormula: EV = Market Cap + Total Debt + Preferred Stock + Minority Interest - Cash and Cash Equivalents.",
        hint: "Equity + Net Debt",
        tags: ["Enterprise Value", "Multiples"],
        status: "learning",
        reviewCount: 2,
        lastReviewed: "2026-09-17",
      },
    ],
  },
  {
    id: "deck_3",
    title: "Advanced English Idioms & Nuance",
    description: "Sophisticated expressions for executive presentations and writing.",
    category: "Languages & Communication",
    color: "from-rose-600 to-pink-700",
    cards: [
      {
        id: "c301",
        front: "To kick something into the long grass",
        back: "To deliberately delay, shelve, or postpone dealing with an awkward or difficult problem so that people eventually forget about it.",
        hint: "British political idiom about delaying action.",
        tags: ["Idioms", "Business"],
        status: "mastered",
        reviewCount: 3,
        lastReviewed: "2026-09-15",
      },
      {
        id: "c302",
        front: "Quid pro quo",
        back: "A Latin term meaning 'something for something' — an arrangement where one favor or advantage is granted in return for something of equal value.",
        hint: "Reciprocal exchange.",
        tags: ["Latinate", "Negotiation"],
        status: "mastered",
        reviewCount: 4,
        lastReviewed: "2026-09-19",
      },
      {
        id: "c303",
        front: "To pass the buck",
        back: "To shift the responsibility or blame for something onto someone else rather than accepting accountability.",
        hint: "Opposite of 'The buck stops here'.",
        tags: ["Management", "Phrases"],
        status: "new",
        reviewCount: 0,
      },
    ],
  },
];

export function FlashcardsView() {
  const [decks, setDecks] = useState<FlashcardDeck[]>(() => {
    try {
      const saved = localStorage.getItem("client_os_flashcards_data");
      return saved ? JSON.parse(saved) : DEFAULT_DECKS;
    } catch {
      return DEFAULT_DECKS;
    }
  });

  const [selectedDeckId, setSelectedDeckId] = useState<string>(() => {
    return decks[0]?.id || "deck_1";
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Study Mode State
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyStats, setStudyStats] = useState({ correct: 0, reviewed: 0 });
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  // Modals
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<FlashcardDeck | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

  // Form Deck states
  const [deckTitle, setDeckTitle] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [deckCategory, setDeckCategory] = useState("Software Engineering");
  const [deckColor, setDeckColor] = useState("from-indigo-600 to-blue-700");

  // Form Card states
  const [cardFront, setCardFront] = useState("");
  const [cardBack, setCardBack] = useState("");
  const [cardHint, setCardHint] = useState("");
  const [cardTags, setCardTags] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("client_os_flashcards_data", JSON.stringify(decks));
    } catch (e) {
      console.error("Failed to save flashcards data", e);
    }
  }, [decks]);

  const activeDeck = useMemo(() => {
    return decks.find((d) => d.id === selectedDeckId) || decks[0];
  }, [decks, selectedDeckId]);

  // Overall Statistics
  const overallMetrics = useMemo(() => {
    const totalDecks = decks.length;
    let totalCards = 0;
    let masteredCards = 0;
    let learningCards = 0;

    decks.forEach((deck) => {
      totalCards += deck.cards.length;
      deck.cards.forEach((c) => {
        if (c.status === "mastered") masteredCards++;
        else if (c.status === "learning") learningCards++;
      });
    });

    const masteryRate = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;

    return {
      totalDecks,
      totalCards,
      masteredCards,
      learningCards,
      masteryRate,
    };
  }, [decks]);

  // Filtered Cards in active deck
  const filteredActiveCards = useMemo(() => {
    if (!activeDeck) return [];
    if (!searchQuery.trim()) return activeDeck.cards;
    const q = searchQuery.toLowerCase();
    return activeDeck.cards.filter(
      (c) =>
        c.front.toLowerCase().includes(q) ||
        c.back.toLowerCase().includes(q) ||
        c.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [activeDeck, searchQuery]);

  // Start Study Session
  const handleStartStudy = (deck: FlashcardDeck, shuffle: boolean = false) => {
    if (!deck.cards.length) return;
    let cardsToStudy = [...deck.cards];
    if (shuffle) {
      cardsToStudy = cardsToStudy.sort(() => Math.random() - 0.5);
    }
    setStudyCards(cardsToStudy);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setStudyStats({ correct: 0, reviewed: 0 });
    setIsSessionFinished(false);
    setIsStudyMode(true);
  };

  // Keyboard navigation in Study Mode
  useEffect(() => {
    if (!isStudyMode || isSessionFinished) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === "1") {
        handleRateCard("learning");
      } else if (e.key === "2") {
        handleRateCard("learning");
      } else if (e.key === "3") {
        handleRateCard("mastered");
      } else if (e.key === "4") {
        handleRateCard("mastered");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isStudyMode, isSessionFinished, currentCardIndex, isFlipped, studyCards]);

  // Rate card in study mode
  const handleRateCard = (rating: "learning" | "mastered") => {
    if (!studyCards.length) return;
    const currentCard = studyCards[currentCardIndex];

    // Update the card in decks state
    setDecks((prev) =>
      prev.map((deck) => {
        if (deck.id !== activeDeck.id) return deck;
        return {
          ...deck,
          cards: deck.cards.map((c) =>
            c.id === currentCard.id
              ? {
                  ...c,
                  status: rating,
                  reviewCount: c.reviewCount + 1,
                  lastReviewed: new Date().toISOString().split("T")[0],
                }
              : c
          ),
        };
      })
    );

    const isCorrect = rating === "mastered";
    setStudyStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      reviewed: prev.reviewed + 1,
    }));

    if (currentCardIndex + 1 < studyCards.length) {
      setCurrentCardIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      setIsSessionFinished(true);
    }
  };

  // Deck CRUD
  const handleOpenAddDeck = () => {
    setEditingDeck(null);
    setDeckTitle("");
    setDeckDescription("");
    setDeckCategory("General Knowledge");
    setDeckColor("from-indigo-600 to-blue-700");
    setIsDeckModalOpen(true);
  };

  const handleOpenEditDeck = (deck: FlashcardDeck, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDeck(deck);
    setDeckTitle(deck.title);
    setDeckDescription(deck.description);
    setDeckCategory(deck.category);
    setDeckColor(deck.color);
    setIsDeckModalOpen(true);
  };

  const handleSaveDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deckTitle.trim()) return;

    if (editingDeck) {
      setDecks((prev) =>
        prev.map((d) =>
          d.id === editingDeck.id
            ? {
                ...d,
                title: deckTitle.trim(),
                description: deckDescription.trim(),
                category: deckCategory.trim(),
                color: deckColor,
              }
            : d
        )
      );
    } else {
      const newDeck: FlashcardDeck = {
        id: `deck_${Date.now()}`,
        title: deckTitle.trim(),
        description: deckDescription.trim(),
        category: deckCategory.trim(),
        color: deckColor,
        cards: [],
      };
      setDecks((prev) => [newDeck, ...prev]);
      setSelectedDeckId(newDeck.id);
    }
    setIsDeckModalOpen(false);
  };

  const handleDeleteDeck = (deckId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this deck and all of its flashcards?")) {
      const remaining = decks.filter((d) => d.id !== deckId);
      setDecks(remaining);
      if (selectedDeckId === deckId && remaining.length > 0) {
        setSelectedDeckId(remaining[0].id);
      }
    }
  };

  // Card CRUD
  const handleOpenAddCard = () => {
    setEditingCard(null);
    setCardFront("");
    setCardBack("");
    setCardHint("");
    setCardTags("");
    setIsCardModalOpen(true);
  };

  const handleOpenEditCard = (card: Flashcard) => {
    setEditingCard(card);
    setCardFront(card.front);
    setCardBack(card.back);
    setCardHint(card.hint || "");
    setCardTags(card.tags ? card.tags.join(", ") : "");
    setIsCardModalOpen(true);
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardFront.trim() || !cardBack.trim() || !activeDeck) return;

    const parsedTags = cardTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingCard) {
      setDecks((prev) =>
        prev.map((deck) => {
          if (deck.id !== activeDeck.id) return deck;
          return {
            ...deck,
            cards: deck.cards.map((c) =>
              c.id === editingCard.id
                ? {
                    ...c,
                    front: cardFront.trim(),
                    back: cardBack.trim(),
                    hint: cardHint.trim() || undefined,
                    tags: parsedTags.length > 0 ? parsedTags : undefined,
                  }
                : c
            ),
          };
        })
      );
    } else {
      const newCard: Flashcard = {
        id: `card_${Date.now()}`,
        front: cardFront.trim(),
        back: cardBack.trim(),
        hint: cardHint.trim() || undefined,
        tags: parsedTags.length > 0 ? parsedTags : undefined,
        status: "new",
        reviewCount: 0,
      };

      setDecks((prev) =>
        prev.map((deck) => (deck.id === activeDeck.id ? { ...deck, cards: [newCard, ...deck.cards] } : deck))
      );
    }

    setIsCardModalOpen(false);
  };

  const handleDeleteCard = (cardId: string) => {
    if (!activeDeck) return;
    setDecks((prev) =>
      prev.map((deck) => {
        if (deck.id !== activeDeck.id) return deck;
        return {
          ...deck,
          cards: deck.cards.filter((c) => c.id !== cardId),
        };
      })
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full flex flex-col space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Layers className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Flashcards & Decks</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Master definitions, system concepts, and formulas using active recall and spaced repetition.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeDeck && activeDeck.cards.length > 0 && (
            <button
              onClick={() => handleStartStudy(activeDeck)}
              id="btn-study-deck"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-[0.98]"
            >
              <Play size={16} className="fill-white" />
              Study Deck ({activeDeck.cards.length})
            </button>
          )}

          <button
            onClick={handleOpenAddDeck}
            id="btn-create-deck"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm active:scale-[0.98]"
          >
            <Plus size={16} />
            Create Deck
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium">Total Decks</span>
            <BookOpen size={16} className="text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">{overallMetrics.totalDecks}</div>
          <span className="text-[11px] text-muted-foreground">topik pembelajaran aktif</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium">Total Flashcards</span>
            <Layers size={16} className="text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">{overallMetrics.totalCards}</div>
          <span className="text-[11px] text-muted-foreground">kartu konsep & istilah</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium">Mastery Rate</span>
            <Award size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">{overallMetrics.masteryRate}%</div>
          <span className="text-[11px] text-muted-foreground">{overallMetrics.masteredCards} kartu dikuasai</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium">Learning Queue</span>
            <Brain size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">{overallMetrics.learningCards}</div>
          <span className="text-[11px] text-muted-foreground">perlu pengulangan berkala</span>
        </div>
      </div>

      {/* Deck Selector Tabs / Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Deck</h3>
          <span className="text-xs text-muted-foreground">
            {decks.length} {decks.length === 1 ? "Deck" : "Decks"} available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {decks.map((deck) => {
            const isSelected = deck.id === selectedDeckId;
            const mastered = deck.cards.filter((c) => c.status === "mastered").length;
            const percent = deck.cards.length > 0 ? Math.round((mastered / deck.cards.length) * 100) : 0;

            return (
              <div
                key={deck.id}
                onClick={() => setSelectedDeckId(deck.id)}
                className={cn(
                  "p-4 rounded-2xl border text-left transition-all cursor-pointer relative group flex flex-col justify-between select-none",
                  isSelected
                    ? "bg-card border-indigo-600 shadow-md ring-1 ring-indigo-600/30"
                    : "bg-card/70 hover:bg-card border-border/70 hover:border-border"
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      {deck.category}
                    </span>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleOpenEditDeck(deck, e)}
                        className="p-1 text-muted-foreground hover:text-foreground rounded"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteDeck(deck.id, e)}
                        className="p-1 text-muted-foreground hover:text-rose-600 rounded"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-foreground line-clamp-1">{deck.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{deck.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                  <span className="font-mono font-medium text-foreground">{deck.cards.length} Cards</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">{percent}% Mastered</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDeckId(deck.id);
                        handleStartStudy(deck);
                      }}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-medium flex items-center gap-1 shadow-xs"
                    >
                      <Play size={10} className="fill-white" /> Study
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Deck Card Management */}
      {activeDeck && (
        <div className="bg-card border border-border/70 rounded-3xl p-5 md:p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground">{activeDeck.title}</h2>
                <span className="text-xs px-2 py-0.5 bg-muted rounded-md text-muted-foreground font-mono">
                  {activeDeck.cards.length} Cards
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{activeDeck.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-48 md:w-56">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search cards in deck..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-muted/40 border border-border/70 rounded-xl text-foreground focus:outline-none"
                />
              </div>

              <button
                onClick={handleOpenAddCard}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
              >
                <Plus size={14} /> Add Card
              </button>
            </div>
          </div>

          {/* Cards List in Deck */}
          {filteredActiveCards.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-border/70 rounded-2xl">
              <p className="text-sm font-medium text-foreground">Tidak ada kartu dalam deck ini.</p>
              <p className="text-xs text-muted-foreground mt-1">Tambahkan kartu baru untuk mulai belajar.</p>
              <button
                onClick={handleOpenAddCard}
                className="mt-3 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-medium"
              >
                + Tambah Kartu Pertama
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredActiveCards.map((card, idx) => (
                <div
                  key={card.id}
                  className="p-4 rounded-2xl bg-muted/20 border border-border/60 hover:border-border transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-muted-foreground">#{idx + 1}</span>
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-2 py-0.5 rounded-md capitalize",
                            card.status === "mastered"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : card.status === "learning"
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {card.status}
                        </span>
                        {card.reviewCount > 0 && (
                          <span className="text-[10px] text-muted-foreground font-mono">({card.reviewCount}x)</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEditCard(card)}
                          className="p-1 text-muted-foreground hover:text-foreground rounded"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          className="p-1 text-muted-foreground hover:text-rose-600 rounded"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-sm font-semibold text-foreground leading-snug">{card.front}</h4>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed bg-card/60 p-2.5 rounded-xl border border-border/40">
                      {card.back}
                    </p>
                  </div>

                  {card.tags && card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3 pt-2 border-t border-border/40">
                      {card.tags.map((t) => (
                        <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-card text-muted-foreground border border-border/60">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Interactive Study Mode Modal */}
      {isStudyMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Top Bar */}
            <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2">
                <Brain size={18} className="text-indigo-600" />
                <span className="text-sm font-bold text-foreground">{activeDeck?.title}</span>
              </div>

              {!isSessionFinished && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground">
                    Card {currentCardIndex + 1} of {studyCards.length}
                  </span>
                  <button
                    onClick={() => setIsStudyMode(false)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Study Progress Bar */}
            {!isSessionFinished && (
              <div className="w-full bg-muted h-1.5">
                <div
                  className="h-full bg-indigo-600 transition-all duration-200"
                  style={{ width: `${((currentCardIndex + 1) / studyCards.length) * 100}%` }}
                />
              </div>
            )}

            {/* Main Content Area */}
            <div className="p-6 flex-1 flex flex-col justify-center">
              {isSessionFinished ? (
                /* Celebration Completion Screen */
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Session Complete!</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    You reviewed all {studyCards.length} cards in this deck. Repetition cements neural pathways.
                  </p>

                  <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto p-4 rounded-2xl bg-muted/30 border border-border/60">
                    <div>
                      <span className="text-xs text-muted-foreground block">Mastered</span>
                      <strong className="text-emerald-600 text-lg font-mono">{studyStats.correct}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Reviewed</span>
                      <strong className="text-foreground text-lg font-mono">{studyStats.reviewed}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-4">
                    <button
                      onClick={() => handleStartStudy(activeDeck, true)}
                      className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-semibold flex items-center gap-1.5"
                    >
                      <RotateCcw size={14} /> Restart Session
                    </button>
                    <button
                      onClick={() => setIsStudyMode(false)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
                    >
                      Back to Decks
                    </button>
                  </div>
                </div>
              ) : (
                /* Flashcard Card Display with 3D Flip */
                <div className="space-y-6">
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className={cn(
                      "w-full min-h-[260px] md:min-h-[300px] p-8 rounded-3xl border transition-all cursor-pointer select-none flex flex-col justify-between relative shadow-sm hover:shadow-md",
                      isFlipped
                        ? "bg-card border-indigo-500/40 ring-1 ring-indigo-500/20"
                        : "bg-linear-to-br from-card to-muted/30 border-border/80"
                    )}
                  >
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold uppercase tracking-wider text-[11px] text-indigo-600">
                        {isFlipped ? "ANSWER / EXPLANATION" : "QUESTION / PROMPT"}
                      </span>
                      <span className="text-[11px] bg-muted px-2 py-0.5 rounded-full">
                        {isFlipped ? "Click to see front" : "Click or Space to flip"}
                      </span>
                    </div>

                    <div className="my-auto py-4">
                      {isFlipped ? (
                        <div className="text-base md:text-lg text-foreground leading-relaxed whitespace-pre-line animate-in fade-in duration-150">
                          {studyCards[currentCardIndex]?.back}
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-lg md:text-2xl font-bold text-foreground leading-snug">
                            {studyCards[currentCardIndex]?.front}
                          </h3>
                          {studyCards[currentCardIndex]?.hint && (
                            <p className="text-xs text-muted-foreground mt-3 italic">
                              Hint: {studyCards[currentCardIndex]?.hint}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border/40 text-[11px] text-muted-foreground">
                      <span>Status: <strong className="capitalize">{studyCards[currentCardIndex]?.status}</strong></span>
                      {studyCards[currentCardIndex]?.tags && (
                        <span>{studyCards[currentCardIndex]?.tags?.join(" • ")}</span>
                      )}
                    </div>
                  </div>

                  {/* Rating Response Buttons */}
                  <div className="space-y-2">
                    <span className="text-[11px] text-muted-foreground block text-center">
                      Rate your recall accuracy (or press 1–4 on keyboard):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        onClick={() => handleRateCard("learning")}
                        className="py-2.5 px-3 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 text-xs font-semibold flex flex-col items-center transition-all"
                      >
                        <span>Again</span>
                        <span className="text-[10px] opacity-75 font-normal">Forgot (1)</span>
                      </button>
                      <button
                        onClick={() => handleRateCard("learning")}
                        className="py-2.5 px-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 text-xs font-semibold flex flex-col items-center transition-all"
                      >
                        <span>Hard</span>
                        <span className="text-[10px] opacity-75 font-normal">Struggled (2)</span>
                      </button>
                      <button
                        onClick={() => handleRateCard("mastered")}
                        className="py-2.5 px-3 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 text-xs font-semibold flex flex-col items-center transition-all"
                      >
                        <span>Good</span>
                        <span className="text-[10px] opacity-75 font-normal">Recalled (3)</span>
                      </button>
                      <button
                        onClick={() => handleRateCard("mastered")}
                        className="py-2.5 px-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 text-xs font-semibold flex flex-col items-center transition-all"
                      >
                        <span>Easy</span>
                        <span className="text-[10px] opacity-75 font-normal">Mastered (4)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create / Edit Deck */}
      {isDeckModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/20">
              <h2 className="text-base font-semibold text-foreground">
                {editingDeck ? "Edit Study Deck" : "Create New Deck"}
              </h2>
              <button
                onClick={() => setIsDeckModalOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDeck} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Deck Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. System Design Patterns, Japanese N2 Vocab"
                  value={deckTitle}
                  onChange={(e) => setDeckTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Category / Domain</label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineering, Finance, Language"
                  value={deckCategory}
                  onChange={(e) => setDeckCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Description / Focus</label>
                <textarea
                  rows={2}
                  placeholder="What concepts does this deck cover?"
                  value={deckDescription}
                  onChange={(e) => setDeckDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsDeckModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs"
                >
                  {editingDeck ? "Save Changes" : "Create Deck"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create / Edit Flashcard */}
      {isCardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/20">
              <h2 className="text-base font-semibold text-foreground">
                {editingCard ? "Edit Flashcard" : `Add Flashcard to "${activeDeck?.title}"`}
              </h2>
              <button
                onClick={() => setIsCardModalOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCard} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Front / Question / Term <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. What is the difference between TCP and UDP?"
                  value={cardFront}
                  onChange={(e) => setCardFront(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Back / Answer / Explanation <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed explanation, formula, or definition..."
                  value={cardBack}
                  onChange={(e) => setCardBack(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Optional Hint</label>
                  <input
                    type="text"
                    placeholder="e.g. Connection-oriented vs connectionless"
                    value={cardHint}
                    onChange={(e) => setCardHint(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Networking, Protocols, Core"
                    value={cardTags}
                    onChange={(e) => setCardTags(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsCardModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs"
                >
                  {editingCard ? "Save Changes" : "Add Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
