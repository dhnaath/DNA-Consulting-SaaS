import React, { useState, useEffect, useMemo } from "react";
import {
  FileCheck,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  Award,
  TrendingUp,
  X,
  Edit2,
  Trash2,
  ListTodo,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExamTopic {
  id: string;
  title: string;
  module: string;
  status: "not_started" | "in_progress" | "mastered";
}

export interface MockTestResult {
  id: string;
  title: string;
  date: string;
  score: number;
  maxScore: number;
  passed: boolean;
}

export interface ExamItem {
  id: string;
  title: string;
  category: string; // e.g. "Professional Certification", "Language Proficiency", "University"
  examDate: string; // "YYYY-MM-DD"
  examTime?: string; // "09:00 AM"
  location?: string; // e.g. "Pearson VUE Test Center / Online"
  targetScore: string; // e.g. "75% Passing", "Band 8.0"
  passingGrade: string;
  registrationStatus: "Registered" | "Pending Payment" | "Planning";
  notes?: string;
  topics: ExamTopic[];
  mockTests: MockTestResult[];
}

const DEFAULT_EXAMS: ExamItem[] = [
  {
    id: "exam_1",
    title: "CFA Level I — Financial Analysis",
    category: "Professional Certification",
    examDate: "2026-11-15",
    examTime: "08:30 AM",
    location: "Prometric Testing Center (Jakarta)",
    targetScore: "Top 10% Decile (>72%)",
    passingGrade: "Approx. 70%",
    registrationStatus: "Registered",
    notes: "Review Ethics formulas and Financial Statement Analysis heavily during the final 3 weeks.",
    topics: [
      { id: "t1", title: "Ethical and Professional Standards", module: "Ethics", status: "mastered" },
      { id: "t2", title: "Quantitative Methods & Time Value", module: "Quant", status: "mastered" },
      { id: "t3", title: "Financial Reporting & Analysis (FSA)", module: "Financial Reporting", status: "in_progress" },
      { id: "t4", title: "Corporate Issuers & Governance", module: "Corporate", status: "in_progress" },
      { id: "t5", title: "Equity Investments & Valuation", module: "Equity", status: "not_started" },
      { id: "t6", title: "Fixed Income Analysis & Duration", module: "Fixed Income", status: "in_progress" },
      { id: "t7", title: "Derivatives & Forward Contracts", module: "Derivatives", status: "not_started" },
      { id: "t8", title: "Portfolio Management Basics", module: "Portfolio", status: "not_started" },
    ],
    mockTests: [
      { id: "m1", title: "Kaplan Mock Exam 1 (Session AM)", date: "2026-08-20", score: 68, maxScore: 100, passed: false },
      { id: "m2", title: "CFA Institute Official Mock A", date: "2026-09-10", score: 74, maxScore: 100, passed: true },
    ],
  },
  {
    id: "exam_2",
    title: "IELTS Academic Test",
    category: "Language Proficiency",
    examDate: "2026-10-24",
    examTime: "13:00 PM",
    location: "British Council IDP Test Venue",
    targetScore: "Overall Band 8.0",
    passingGrade: "Band 7.0 Requirement",
    registrationStatus: "Registered",
    notes: "Writing Task 2 structure needs coherent cohesive devices. Practice timed speaking drills.",
    topics: [
      { id: "i1", title: "Listening Section 4 (Academic Monologue)", module: "Listening", status: "mastered" },
      { id: "i2", title: "Reading True/False/Not Given Mastery", module: "Reading", status: "mastered" },
      { id: "i3", title: "Writing Task 1: Complex Chart Synthesis", module: "Writing", status: "in_progress" },
      { id: "i4", title: "Writing Task 2: Counter-argumentation", module: "Writing", status: "in_progress" },
      { id: "i5", title: "Speaking Part 3: Abstract Discourse", module: "Speaking", status: "in_progress" },
    ],
    mockTests: [
      { id: "im1", title: "Cambridge IELTS 18 Practice Test", date: "2026-09-05", score: 7.5, maxScore: 9.0, passed: true },
    ],
  },
  {
    id: "exam_3",
    title: "AWS Certified Solutions Architect (SAA-C03)",
    category: "Cloud & DevOps",
    examDate: "2026-12-05",
    examTime: "10:00 AM",
    location: "Pearson VUE Online Proctored",
    targetScore: "850 / 1000",
    passingGrade: "720 / 1000",
    registrationStatus: "Planning",
    notes: "Deep dive on VPC Peering, Transit Gateway, and Multi-region Aurora replication.",
    topics: [
      { id: "a1", title: "Design Resilient Architectures", module: "Architecture", status: "mastered" },
      { id: "a2", title: "Design High-Performing Architectures", module: "Performance", status: "in_progress" },
      { id: "a3", title: "Design Secure Applications and Architectures", module: "Security", status: "not_started" },
      { id: "a4", title: "Design Cost-Optimized Architectures", module: "Cost Optimization", status: "not_started" },
    ],
    mockTests: [],
  },
];

export function ExamsView() {
  const [exams, setExams] = useState<ExamItem[]>(() => {
    try {
      const saved = localStorage.getItem("client_os_exams_data");
      return saved ? JSON.parse(saved) : DEFAULT_EXAMS;
    } catch {
      return DEFAULT_EXAMS;
    }
  });

  const [selectedExamId, setSelectedExamId] = useState<string>(() => {
    return exams[0]?.id || "exam_1";
  });

  // Modals
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<ExamItem | null>(null);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isMockModalOpen, setIsMockModalOpen] = useState(false);

  // Form: Exam
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Professional Certification");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formTargetScore, setFormTargetScore] = useState("");
  const [formPassingGrade, setFormPassingGrade] = useState("");
  const [formStatus, setFormStatus] = useState<ExamItem["registrationStatus"]>("Registered");
  const [formNotes, setFormNotes] = useState("");

  // Form: Topic
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicModule, setNewTopicModule] = useState("");

  // Form: Mock Test
  const [mockTitle, setMockTitle] = useState("");
  const [mockDate, setMockDate] = useState("");
  const [mockScore, setMockScore] = useState<number>(75);
  const [mockMaxScore, setMockMaxScore] = useState<number>(100);

  useEffect(() => {
    try {
      localStorage.setItem("client_os_exams_data", JSON.stringify(exams));
    } catch (e) {
      console.error("Failed to save exams data", e);
    }
  }, [exams]);

  const activeExam = useMemo(() => {
    return exams.find((e) => e.id === selectedExamId) || exams[0];
  }, [exams, selectedExamId]);

  // Calculate countdown days
  const calculateDaysLeft = (dateString: string) => {
    if (!dateString) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateString);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Readiness calculation
  const readinessStats = useMemo(() => {
    if (!activeExam || !activeExam.topics.length) {
      return { percentage: 0, mastered: 0, inProgress: 0, total: 0 };
    }
    const total = activeExam.topics.length;
    const mastered = activeExam.topics.filter((t) => t.status === "mastered").length;
    const inProgress = activeExam.topics.filter((t) => t.status === "in_progress").length;
    // Mastered counts full, in-progress counts half
    const score = ((mastered * 1 + inProgress * 0.5) / total) * 100;
    return {
      percentage: Math.round(score),
      mastered,
      inProgress,
      total,
    };
  }, [activeExam]);

  // Handlers for Exam CRUD
  const handleOpenAddExam = () => {
    setEditingExam(null);
    setFormTitle("");
    setFormCategory("Professional Certification");
    setFormDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
    setFormTime("09:00 AM");
    setFormLocation("Official Testing Center");
    setFormTargetScore("75%");
    setFormPassingGrade("70%");
    setFormStatus("Registered");
    setFormNotes("");
    setIsExamModalOpen(true);
  };

  const handleOpenEditExam = (exam: ExamItem) => {
    setEditingExam(exam);
    setFormTitle(exam.title);
    setFormCategory(exam.category);
    setFormDate(exam.examDate);
    setFormTime(exam.examTime || "");
    setFormLocation(exam.location || "");
    setFormTargetScore(exam.targetScore);
    setFormPassingGrade(exam.passingGrade);
    setFormStatus(exam.registrationStatus);
    setFormNotes(exam.notes || "");
    setIsExamModalOpen(true);
  };

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDate) return;

    if (editingExam) {
      setExams((prev) =>
        prev.map((item) =>
          item.id === editingExam.id
            ? {
                ...item,
                title: formTitle.trim(),
                category: formCategory.trim(),
                examDate: formDate,
                examTime: formTime.trim() || undefined,
                location: formLocation.trim() || undefined,
                targetScore: formTargetScore.trim() || "Pass",
                passingGrade: formPassingGrade.trim() || "Passing Grade",
                registrationStatus: formStatus,
                notes: formNotes.trim(),
              }
            : item
        )
      );
    } else {
      const newExam: ExamItem = {
        id: `exam_${Date.now()}`,
        title: formTitle.trim(),
        category: formCategory.trim(),
        examDate: formDate,
        examTime: formTime.trim() || undefined,
        location: formLocation.trim() || undefined,
        targetScore: formTargetScore.trim() || "Pass",
        passingGrade: formPassingGrade.trim() || "Passing Grade",
        registrationStatus: formStatus,
        notes: formNotes.trim(),
        topics: [],
        mockTests: [],
      };
      setExams((prev) => [newExam, ...prev]);
      setSelectedExamId(newExam.id);
    }
    setIsExamModalOpen(false);
  };

  const handleDeleteExam = (id: string) => {
    if (confirm("Delete this exam schedule and all its study tracking?")) {
      const updated = exams.filter((e) => e.id !== id);
      setExams(updated);
      if (selectedExamId === id && updated.length > 0) {
        setSelectedExamId(updated[0].id);
      }
    }
  };

  // Syllabus Topic Handlers
  const handleToggleTopicStatus = (topicId: string) => {
    if (!activeExam) return;
    const nextStatusMap: Record<ExamTopic["status"], ExamTopic["status"]> = {
      not_started: "in_progress",
      in_progress: "mastered",
      mastered: "not_started",
    };

    setExams((prev) =>
      prev.map((exam) => {
        if (exam.id !== activeExam.id) return exam;
        return {
          ...exam,
          topics: exam.topics.map((t) => (t.id === topicId ? { ...t, status: nextStatusMap[t.status] } : t)),
        };
      })
    );
  };

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !activeExam) return;

    const newTopic: ExamTopic = {
      id: `topic_${Date.now()}`,
      title: newTopicTitle.trim(),
      module: newTopicModule.trim() || "Core Module",
      status: "not_started",
    };

    setExams((prev) =>
      prev.map((exam) => (exam.id === activeExam.id ? { ...exam, topics: [...exam.topics, newTopic] } : exam))
    );
    setNewTopicTitle("");
    setNewTopicModule("");
    setIsTopicModalOpen(false);
  };

  const handleDeleteTopic = (topicId: string) => {
    if (!activeExam) return;
    setExams((prev) =>
      prev.map((exam) => {
        if (exam.id !== activeExam.id) return exam;
        return {
          ...exam,
          topics: exam.topics.filter((t) => t.id !== topicId),
        };
      })
    );
  };

  // Mock Test Handlers
  const handleAddMockTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockTitle.trim() || !activeExam) return;

    const newMock: MockTestResult = {
      id: `mock_${Date.now()}`,
      title: mockTitle.trim(),
      date: mockDate || new Date().toISOString().split("T")[0],
      score: Number(mockScore) || 0,
      maxScore: Number(mockMaxScore) || 100,
      passed: Number(mockScore) >= Number(mockMaxScore) * 0.7,
    };

    setExams((prev) =>
      prev.map((exam) => (exam.id === activeExam.id ? { ...exam, mockTests: [newMock, ...exam.mockTests] } : exam))
    );
    setMockTitle("");
    setIsMockModalOpen(false);
  };

  const daysLeft = activeExam ? calculateDaysLeft(activeExam.examDate) : null;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full flex flex-col space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Exams</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Track certification countdowns, syllabus readiness, and practice mock scores.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAddExam}
            id="btn-add-exam"
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm active:scale-[0.98]"
          >
            <Plus size={16} />
            Add Exam
          </button>
        </div>
      </div>

      {/* Exam Selector Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {exams.map((exam) => {
          const isSelected = exam.id === selectedExamId;
          const dLeft = calculateDaysLeft(exam.examDate);
          return (
            <button
              key={exam.id}
              onClick={() => setSelectedExamId(exam.id)}
              className={cn(
                "flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-semibold transition-all border shrink-0",
                isSelected
                  ? "bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-600/20"
                  : "bg-card hover:bg-muted/60 text-muted-foreground hover:text-foreground border-border/70"
              )}
            >
              <span>{exam.title}</span>
              {dLeft !== null && (
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-mono font-bold",
                    isSelected
                      ? "bg-card/20 text-white"
                      : dLeft < 7
                      ? "bg-rose-500/15 text-rose-600"
                      : dLeft < 30
                      ? "bg-amber-500/15 text-amber-600"
                      : "bg-emerald-500/15 text-emerald-600"
                  )}
                >
                  {dLeft <= 0 ? "Today" : `D-${dLeft}`}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeExam ? (
        <>
          {/* Hero Countdown & Essential Info Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Countdown Hero */}
            <div className="lg:col-span-2 bg-linear-to-br from-card to-muted/40 border border-border/70 rounded-3xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    {activeExam.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditExam(activeExam)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted text-xs flex items-center gap-1"
                    >
                      <Edit2 size={13} />
                      <span>Edit Info</span>
                    </button>
                    <button
                      onClick={() => handleDeleteExam(activeExam.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <h2 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">{activeExam.title}</h2>

                {activeExam.notes && (
                  <p className="text-xs md:text-sm text-muted-foreground mt-2 leading-relaxed bg-card/60 p-3 rounded-xl border border-border/40">
                    {activeExam.notes}
                  </p>
                )}
              </div>

              {/* Schedule Info Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-border/50 text-xs">
                <div>
                  <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                    <Calendar size={12} /> Exam Date
                  </span>
                  <strong className="text-foreground text-sm block mt-0.5">
                    {new Date(activeExam.examDate).toLocaleDateString("id-ID", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </strong>
                  {activeExam.examTime && <span className="text-muted-foreground text-[11px]">{activeExam.examTime}</span>}
                </div>

                <div>
                  <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                    <Award size={12} /> Target / Passing
                  </span>
                  <strong className="text-foreground text-sm block mt-0.5">{activeExam.targetScore}</strong>
                  <span className="text-muted-foreground text-[11px]">Min: {activeExam.passingGrade}</span>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <span className="text-muted-foreground text-[11px]">Countdown</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={cn(
                        "text-xl md:text-2xl font-mono font-extrabold",
                        daysLeft !== null && daysLeft < 7
                          ? "text-rose-600"
                          : daysLeft !== null && daysLeft < 30
                          ? "text-amber-600"
                          : "text-emerald-600"
                      )}
                    >
                      {daysLeft !== null && (daysLeft <= 0 ? "TODAY" : `${daysLeft} Hari`)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Readiness Score Card */}
            <div className="bg-card border border-border/70 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Syllabus Readiness Score
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-extrabold text-foreground font-mono">{readinessStats.percentage}%</span>
                  <span className="text-xs text-muted-foreground">Topics Completed</span>
                </div>

                <div className="w-full bg-muted rounded-full h-3 mt-4 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      readinessStats.percentage >= 80
                        ? "bg-emerald-500"
                        : readinessStats.percentage >= 50
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    )}
                    style={{ width: `${readinessStats.percentage}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="p-2 rounded-xl bg-muted/40">
                    <span className="text-[10px] text-muted-foreground block">Mastered</span>
                    <strong className="text-emerald-600 text-sm">{readinessStats.mastered}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-muted/40">
                    <span className="text-[10px] text-muted-foreground block">In Progress</span>
                    <strong className="text-amber-600 text-sm">{readinessStats.inProgress}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-muted/40">
                    <span className="text-[10px] text-muted-foreground block">Total Topics</span>
                    <strong className="text-foreground text-sm">{readinessStats.total}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/40 text-[11px] text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                <span>Klik item topik silabus untuk mengubah status kesiapan</span>
              </div>
            </div>
          </div>

          {/* Main Workspace: 2-Column Split (Syllabus Checklist vs Mock Tests) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (2/3): Syllabus Checklist */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListTodo size={18} className="text-rose-600" />
                  <h3 className="font-bold text-base text-foreground">Syllabus & Topic Breakdown</h3>
                </div>
                <button
                  onClick={() => setIsTopicModalOpen(true)}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors"
                >
                  <Plus size={14} /> Add Topic
                </button>
              </div>

              {activeExam.topics.length === 0 ? (
                <div className="p-8 border-2 border-dashed border-border/70 rounded-2xl bg-card text-center">
                  <p className="text-sm text-muted-foreground">Belum ada topik silabus yang ditambahkan.</p>
                  <button
                    onClick={() => setIsTopicModalOpen(true)}
                    className="mt-3 text-xs font-medium text-rose-600 hover:underline"
                  >
                    + Tambah Bab Pertama
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeExam.topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="group flex items-center justify-between p-3.5 bg-card border border-border/70 rounded-2xl hover:border-border transition-all"
                    >
                      <div
                        onClick={() => handleToggleTopicStatus(topic.id)}
                        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer select-none"
                      >
                        <button
                          type="button"
                          className={cn(
                            "w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0",
                            topic.status === "mastered"
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : topic.status === "in_progress"
                              ? "bg-amber-500/20 border-amber-500 text-amber-600"
                              : "border-border/80 bg-muted/40"
                          )}
                        >
                          {topic.status === "mastered" && <CheckCircle2 size={13} />}
                          {topic.status === "in_progress" && <Clock size={11} />}
                        </button>

                        <div className="min-w-0">
                          <span
                            className={cn(
                              "text-sm font-medium block truncate",
                              topic.status === "mastered"
                                ? "line-through text-muted-foreground"
                                : "text-foreground"
                            )}
                          >
                            {topic.title}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">{topic.module}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded-md font-semibold capitalize",
                            topic.status === "mastered"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : topic.status === "in_progress"
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {topic.status.replace("_", " ")}
                        </span>

                        <button
                          onClick={() => handleDeleteTopic(topic.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-rose-600 transition-opacity"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column (1/3): Mock Test Score Tracker */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-emerald-600" />
                  <h3 className="font-bold text-base text-foreground">Practice / Mock Tests</h3>
                </div>
                <button
                  onClick={() => {
                    setMockTitle("");
                    setMockDate(new Date().toISOString().split("T")[0]);
                    setMockScore(75);
                    setMockMaxScore(100);
                    setIsMockModalOpen(true);
                  }}
                  className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors"
                >
                  <Plus size={14} /> Log Score
                </button>
              </div>

              <div className="bg-card border border-border/70 rounded-2xl p-4 space-y-3 shadow-xs">
                {activeExam.mockTests.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">
                    Belum ada riwayat tryout. Klik "Log Score" untuk mencatat hasil latihan pertama Anda.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {activeExam.mockTests.map((mock) => {
                      return (
                        <div
                          key={mock.id}
                          className="p-3 rounded-xl bg-muted/30 border border-border/40 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-medium text-xs text-foreground block">{mock.title}</span>
                            <span className="text-[10px] text-muted-foreground">{mock.date}</span>
                          </div>

                          <div className="text-right">
                            <span className="font-mono font-bold text-sm text-foreground">
                              {mock.score} / {mock.maxScore}
                            </span>
                            <span
                              className={cn(
                                "block text-[10px] font-semibold",
                                mock.passed ? "text-emerald-600" : "text-rose-600"
                              )}
                            >
                              {mock.passed ? "Passing Grade Met" : "Below Target"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="p-12 text-center border-2 border-dashed border-border rounded-3xl bg-card">
          <p className="text-base text-foreground font-semibold">No exams created yet</p>
          <p className="text-xs text-muted-foreground mt-1">Start tracking your upcoming tests and certifications.</p>
          <button
            onClick={handleOpenAddExam}
            className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-medium shadow-xs"
          >
            Create First Exam
          </button>
        </div>
      )}

      {/* Modal: Add or Edit Exam */}
      {isExamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/20">
              <h2 className="text-base font-semibold text-foreground">
                {editingExam ? "Edit Exam Schedule" : "Add New Exam"}
              </h2>
              <button
                onClick={() => setIsExamModalOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveExam} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Exam Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CFA Level I, IELTS, AWS Solutions Architect"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Professional Certification, University"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Registration Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as ExamItem["registrationStatus"])}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Registered">Confirmed & Registered</option>
                    <option value="Pending Payment">Pending Payment</option>
                    <option value="Planning">Planning / Preparing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Exam Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Exam Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 08:30 AM"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Location / Test Center</label>
                <input
                  type="text"
                  placeholder="e.g. Pearson VUE Test Center / Online Proctored"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Target Score</label>
                  <input
                    type="text"
                    placeholder="e.g. Band 8.0, 75%"
                    value={formTargetScore}
                    onChange={(e) => setFormTargetScore(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Minimum Passing Grade</label>
                  <input
                    type="text"
                    placeholder="e.g. Band 7.0, 70%"
                    value={formPassingGrade}
                    onChange={(e) => setFormPassingGrade(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Exam Strategy & Notes</label>
                <textarea
                  rows={3}
                  placeholder="Key topics to review in final weeks..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsExamModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
                >
                  {editingExam ? "Save Changes" : "Create Exam"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Syllabus Topic */}
      {isTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/20">
              <h2 className="text-base font-semibold text-foreground">Add Syllabus Topic</h2>
              <button
                onClick={() => setIsTopicModalOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTopic} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Topic / Sub-chapter Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Duration and Convexity, Writing Task 2"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Module / Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Fixed Income, Quant, Writing"
                  value={newTopicModule}
                  onChange={(e) => setNewTopicModule(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsTopicModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
                >
                  Add Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Mock Test */}
      {isMockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/20">
              <h2 className="text-base font-semibold text-foreground">Log Mock Test Result</h2>
              <button
                onClick={() => setIsMockModalOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddMockTest} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Mock Test Name / Source <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Official Mock A, Kaplan Trial 1"
                  value={mockTitle}
                  onChange={(e) => setMockTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Test Date</label>
                <input
                  type="date"
                  value={mockDate}
                  onChange={(e) => setMockDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Your Score</label>
                  <input
                    type="number"
                    step="0.1"
                    value={mockScore}
                    onChange={(e) => setMockScore(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Maximum Score</label>
                  <input
                    type="number"
                    step="0.1"
                    value={mockMaxScore}
                    onChange={(e) => setMockMaxScore(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsMockModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
                >
                  Save Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
