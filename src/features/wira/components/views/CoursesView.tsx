import React, { useState, useEffect, useMemo } from "react";
import {
  GraduationCap,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  PlayCircle,
  ExternalLink,
  Award,
  ChevronDown,
  ChevronUp,
  X,
  Edit2,
  Trash2,
  ListChecks,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CourseModule {
  id: string;
  title: string;
  duration?: string;
  completed: boolean;
}

export interface CourseItem {
  id: string;
  title: string;
  platform: string; // e.g., "Coursera", "Udemy", "edX", "YouTube"
  instructor: string;
  category: string;
  status: "in_progress" | "completed" | "want_to_take";
  totalLessons: number;
  completedLessons: number;
  totalHours: number;
  completedHours: number;
  rating?: number;
  certificateEarned: boolean;
  certificateUrl?: string;
  courseUrl?: string;
  accentColor?: string;
  notes?: string;
  modules: CourseModule[];
}

const DEFAULT_COURSES: CourseItem[] = [
  {
    id: "course_1",
    title: "Financial Modeling & Valuation Specialization",
    platform: "Coursera",
    instructor: "Aswath Damodaran",
    category: "Keuangan & Valuasi",
    status: "in_progress",
    totalLessons: 48,
    completedLessons: 32,
    totalHours: 35,
    completedHours: 24,
    rating: 5,
    certificateEarned: false,
    courseUrl: "https://www.coursera.org/",
    accentColor: "from-blue-600 to-indigo-700",
    notes: "Crucial formulas: DCF discount rates and terminal value assumptions.",
    modules: [
      { id: "m1", title: "Foundations of Financial Modeling", duration: "8 hrs", completed: true },
      { id: "m2", title: "Discounted Cash Flow & Sensitivity Analysis", duration: "7 hrs", completed: true },
      { id: "m3", title: "Structuring Valuation Projects", duration: "5 hrs", completed: true },
      { id: "m4", title: "Relative Valuation & Comparable Multiples", duration: "9 hrs", completed: false },
      { id: "m5", title: "Scenario Planning & Reporting", duration: "6 hrs", completed: false },
    ],
  },
  {
    id: "course_2",
    title: "Full-Stack System Design & Distributed Architecture",
    platform: "Frontend Masters / Educative",
    instructor: "Alex Xu & Primeagen",
    category: "Software Engineering",
    status: "in_progress",
    totalLessons: 30,
    completedLessons: 18,
    totalHours: 20,
    completedHours: 12,
    rating: 5,
    certificateEarned: false,
    courseUrl: "https://frontendmasters.com",
    accentColor: "from-violet-600 to-purple-800",
    notes: "Review CAP theorem tradeoffs, Consistent Hashing algorithms, and Kafka partition rebalancing.",
    modules: [
      { id: "m201", title: "Scale from Zero to Millions of Users", duration: "3 hrs", completed: true },
      { id: "m202", title: "Load Balancers, Reverse Proxies & CDN Caching", duration: "4 hrs", completed: true },
      { id: "m203", title: "Relational vs NoSQL Replication & Sharding", duration: "5 hrs", completed: true },
      { id: "m204", title: "Message Queues & Event-Driven Architecture", duration: "4 hrs", completed: false },
      { id: "m205", title: "Rate Limiting & Distributed Locking (Redis)", duration: "4 hrs", completed: false },
    ],
  },
  {
    id: "course_3",
    title: "CS50's Introduction to Computer Science",
    platform: "Harvard Online / edX",
    instructor: "David J. Malan",
    category: "Computer Science",
    status: "completed",
    totalLessons: 24,
    completedLessons: 24,
    totalHours: 40,
    completedHours: 40,
    rating: 5,
    certificateEarned: true,
    certificateUrl: "https://cs50.harvard.edu/certificates",
    courseUrl: "https://cs50.harvard.edu/x",
    accentColor: "from-emerald-600 to-teal-800",
    notes: "Outstanding foundation in memory management, pointers in C, and algorithmic complexity.",
    modules: [
      { id: "m301", title: "Week 0: Scratch & Computational Thinking", duration: "3 hrs", completed: true },
      { id: "m302", title: "Week 1: C Syntax & Control Flow", duration: "5 hrs", completed: true },
      { id: "m303", title: "Week 2: Arrays & Memory Structure", duration: "5 hrs", completed: true },
      { id: "m304", title: "Week 3: Algorithms & Big-O Notation", duration: "6 hrs", completed: true },
      { id: "m305", title: "Week 4: Memory, Pointers & Hexadecimal", duration: "7 hrs", completed: true },
      { id: "m306", title: "Week 5: Data Structures (Linked Lists & Trees)", duration: "7 hrs", completed: true },
      { id: "m307", title: "Final Project Demonstration", duration: "7 hrs", completed: true },
    ],
  },
  {
    id: "course_4",
    title: "Modern UI/UX Design with Figma to Production",
    platform: "Udemy",
    instructor: "Daniel Walter Scott",
    category: "Design",
    status: "want_to_take",
    totalLessons: 36,
    completedLessons: 0,
    totalHours: 18,
    completedHours: 0,
    rating: 4,
    certificateEarned: false,
    accentColor: "from-amber-500 to-orange-700",
    notes: "Recommended by senior design team for auto-layout v5 and design token variable sync.",
    modules: [
      { id: "m401", title: "Design Systems & Token Architecture", duration: "4 hrs", completed: false },
      { id: "m402", title: "Advanced Auto-Layout & Component Variants", duration: "5 hrs", completed: false },
      { id: "m403", title: "Interactive Micro-Animations & Smart Animate", duration: "5 hrs", completed: false },
      { id: "m404", title: "Developer Handoff & Redlines", duration: "4 hrs", completed: false },
    ],
  },
];

export function CoursesView() {
  const [courses, setCourses] = useState<CourseItem[]>(() => {
    try {
      const saved = localStorage.getItem("client_os_courses_data");
      return saved ? JSON.parse(saved) : DEFAULT_COURSES;
    } catch {
      return DEFAULT_COURSES;
    }
  });

  const [filterTab, setFilterTab] = useState<"all" | "in_progress" | "completed" | "want_to_take">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>("course_1");

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleDuration, setNewModuleDuration] = useState("");
  const [activeCourseForModule, setActiveCourseForModule] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formPlatform, setFormPlatform] = useState("");
  const [formInstructor, setFormInstructor] = useState("");
  const [formCategory, setFormCategory] = useState("Software Engineering");
  const [formStatus, setFormStatus] = useState<CourseItem["status"]>("in_progress");
  const [formTotalLessons, setFormTotalLessons] = useState<number>(20);
  const [formCompletedLessons, setFormCompletedLessons] = useState<number>(0);
  const [formTotalHours, setFormTotalHours] = useState<number>(15);
  const [formCompletedHours, setFormCompletedHours] = useState<number>(0);
  const [formCourseUrl, setFormCourseUrl] = useState("");
  const [formCertificateEarned, setFormCertificateEarned] = useState(false);
  const [formCertificateUrl, setFormCertificateUrl] = useState("");
  const [formNotes, setFormNotes] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("client_os_courses_data", JSON.stringify(courses));
    } catch (e) {
      console.error("Failed to save courses data", e);
    }
  }, [courses]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => set.add(c.category));
    return Array.from(set);
  }, [courses]);

  // Overall metric stats
  const metrics = useMemo(() => {
    const totalCourses = courses.length;
    const inProgress = courses.filter((c) => c.status === "in_progress").length;
    const completed = courses.filter((c) => c.status === "completed").length;
    const totalLessons = courses.reduce((acc, c) => acc + c.totalLessons, 0);
    const doneLessons = courses.reduce((acc, c) => acc + c.completedLessons, 0);
    const totalHoursSpent = courses.reduce((acc, c) => acc + c.completedHours, 0);
    const certificates = courses.filter((c) => c.certificateEarned).length;

    const overallProgress = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;

    return {
      totalCourses,
      inProgress,
      completed,
      doneLessons,
      totalLessons,
      totalHoursSpent,
      certificates,
      overallProgress,
    };
  }, [courses]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchTab = filterTab === "all" || course.status === filterTab;
      const matchCategory = selectedCategory === "all" || course.category === selectedCategory;
      const matchQuery =
        searchQuery === "" ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchCategory && matchQuery;
    });
  }, [courses, filterTab, selectedCategory, searchQuery]);

  // Quick Lesson step (+1 / -1)
  const handleUpdateLessonCount = (courseId: string, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        const newCount = Math.max(0, Math.min(c.totalLessons, c.completedLessons + delta));
        const isNowCompleted = newCount === c.totalLessons && c.totalLessons > 0;
        const estimatedHours =
          c.totalLessons > 0 ? Math.round((newCount / c.totalLessons) * c.totalHours) : c.completedHours;

        return {
          ...c,
          completedLessons: newCount,
          completedHours: estimatedHours,
          status: isNowCompleted ? "completed" : c.status === "completed" && delta < 0 ? "in_progress" : c.status,
          certificateEarned: isNowCompleted ? c.certificateEarned || false : c.certificateEarned,
        };
      })
    );
  };

  // Toggle Module completed
  const handleToggleModule = (courseId: string, moduleId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        const updatedModules = c.modules.map((m) => (m.id === moduleId ? { ...m, completed: !m.completed } : m));

        // Optionally synchronize lessons count if modules match lessons
        return {
          ...c,
          modules: updatedModules,
        };
      })
    );
  };

  // Add Module to course
  const handleAddModule = (courseId: string) => {
    if (!newModuleTitle.trim()) return;
    const newMod: CourseModule = {
      id: `mod_${Date.now()}`,
      title: newModuleTitle.trim(),
      duration: newModuleDuration.trim() || undefined,
      completed: false,
    };

    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          modules: [...c.modules, newMod],
          totalLessons: Math.max(c.totalLessons, c.modules.length + 1),
        };
      })
    );
    setNewModuleTitle("");
    setNewModuleDuration("");
    setActiveCourseForModule(null);
  };

  // Delete Course
  const handleDeleteCourse = (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this course and its syllabus tracking?")) {
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (course: CourseItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCourse(course);
    setFormTitle(course.title);
    setFormPlatform(course.platform);
    setFormInstructor(course.instructor);
    setFormCategory(course.category);
    setFormStatus(course.status);
    setFormTotalLessons(course.totalLessons);
    setFormCompletedLessons(course.completedLessons);
    setFormTotalHours(course.totalHours);
    setFormCompletedHours(course.completedHours);
    setFormCourseUrl(course.courseUrl || "");
    setFormCertificateEarned(course.certificateEarned);
    setFormCertificateUrl(course.certificateUrl || "");
    setFormNotes(course.notes || "");
    setIsModalOpen(true);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingCourse(null);
    setFormTitle("");
    setFormPlatform("Coursera");
    setFormInstructor("");
    setFormCategory("Software Engineering");
    setFormStatus("in_progress");
    setFormTotalLessons(20);
    setFormCompletedLessons(0);
    setFormTotalHours(15);
    setFormCompletedHours(0);
    setFormCourseUrl("");
    setFormCertificateEarned(false);
    setFormCertificateUrl("");
    setFormNotes("");
    setIsModalOpen(true);
  };

  // Save Add/Edit
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingCourse) {
      setCourses((prev) =>
        prev.map((item) =>
          item.id === editingCourse.id
            ? {
                ...item,
                title: formTitle.trim(),
                platform: formPlatform.trim() || "Online",
                instructor: formInstructor.trim() || "Instructor",
                category: formCategory.trim() || "General",
                status: formStatus,
                totalLessons: Number(formTotalLessons) || 1,
                completedLessons: Math.min(Number(formCompletedLessons) || 0, Number(formTotalLessons) || 1),
                totalHours: Number(formTotalHours) || 1,
                completedHours: Math.min(Number(formCompletedHours) || 0, Number(formTotalHours) || 1),
                courseUrl: formCourseUrl.trim() || undefined,
                certificateEarned: formCertificateEarned,
                certificateUrl: formCertificateUrl.trim() || undefined,
                notes: formNotes.trim() || undefined,
              }
            : item
        )
      );
    } else {
      const newCourse: CourseItem = {
        id: `course_${Date.now()}`,
        title: formTitle.trim(),
        platform: formPlatform.trim() || "Online",
        instructor: formInstructor.trim() || "Instructor",
        category: formCategory.trim() || "General",
        status: formStatus,
        totalLessons: Number(formTotalLessons) || 1,
        completedLessons: Number(formCompletedLessons) || 0,
        totalHours: Number(formTotalHours) || 1,
        completedHours: Number(formCompletedHours) || 0,
        courseUrl: formCourseUrl.trim() || undefined,
        certificateEarned: formCertificateEarned,
        certificateUrl: formCertificateUrl.trim() || undefined,
        notes: formNotes.trim() || undefined,
        accentColor: "from-blue-600 to-indigo-700",
        modules: [],
      };
      setCourses((prev) => [newCourse, ...prev]);
      setExpandedCourseId(newCourse.id);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full flex flex-col space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Courses & Learning</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Track online curriculums, lesson milestones, and professional certifications.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          id="btn-add-course"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm active:scale-[0.98]"
        >
          <Plus size={16} />
          Add Course
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium">Active Courses</span>
            <PlayCircle size={16} className="text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">{metrics.inProgress}</div>
          <span className="text-[11px] text-muted-foreground">dari {metrics.totalCourses} total kursus</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium">Lessons Completed</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">
            {metrics.doneLessons} <span className="text-sm font-normal text-muted-foreground">/ {metrics.totalLessons}</span>
          </div>
          <span className="text-[11px] text-muted-foreground">{metrics.overallProgress}% materi rampung</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium">Hours Invested</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">{metrics.totalHoursSpent} hrs</div>
          <span className="text-[11px] text-muted-foreground">total jam belajar terakumulasi</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium">Certificates Earned</span>
            <Award size={16} className="text-violet-500" />
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">{metrics.certificates}</div>
          <span className="text-[11px] text-muted-foreground">{metrics.completed} kursus selesai</span>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
        {/* Status Tabs */}
        <div className="flex items-center p-1 bg-muted/60 rounded-2xl border border-border/50 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setFilterTab("all")}
            className={cn(
              "px-3 py-1.5 rounded-xl transition-all shrink-0",
              filterTab === "all" ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            All Courses ({courses.length})
          </button>
          <button
            onClick={() => setFilterTab("in_progress")}
            className={cn(
              "px-3 py-1.5 rounded-xl transition-all shrink-0",
              filterTab === "in_progress" ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            In Progress ({courses.filter((c) => c.status === "in_progress").length})
          </button>
          <button
            onClick={() => setFilterTab("completed")}
            className={cn(
              "px-3 py-1.5 rounded-xl transition-all shrink-0",
              filterTab === "completed" ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Completed ({courses.filter((c) => c.status === "completed").length})
          </button>
          <button
            onClick={() => setFilterTab("want_to_take")}
            className={cn(
              "px-3 py-1.5 rounded-xl transition-all shrink-0",
              filterTab === "want_to_take" ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Watchlist ({courses.filter((c) => c.status === "want_to_take").length})
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-60">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search course or instructor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-card border border-border/70 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-card border border-border/70 rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses List */}
      {filteredCourses.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-border rounded-3xl bg-card">
          <GraduationCap className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-base font-semibold text-foreground">No courses match criteria</p>
          <p className="text-xs text-muted-foreground mt-1">Try resetting the filter or search query.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => {
            const isExpanded = expandedCourseId === course.id;
            const progressPercent =
              course.totalLessons > 0 ? Math.round((course.completedLessons / course.totalLessons) * 100) : 0;

            return (
              <div
                key={course.id}
                className="bg-card border border-border/70 rounded-3xl overflow-hidden shadow-xs transition-all hover:border-border"
              >
                {/* Main Card Summary Bar */}
                <div
                  onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                  className="p-5 md:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs bg-linear-to-br",
                        course.accentColor || "from-blue-600 to-indigo-700"
                      )}
                    >
                      <GraduationCap size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono">
                          {course.platform}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          {course.category}
                        </span>
                        {course.certificateEarned && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-600 flex items-center gap-1">
                            <Award size={11} /> Certificate
                          </span>
                        )}
                      </div>

                      <h3 className="text-base md:text-lg font-bold text-foreground truncate">{course.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Instructor: {course.instructor}</p>
                    </div>
                  </div>

                  {/* Progress & Quick Steppers */}
                  <div className="flex items-center justify-between md:justify-end gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-border/40">
                    <div className="w-36 md:w-44 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground font-mono">{progressPercent}%</span>
                        <span className="text-muted-foreground font-mono text-[11px]">
                          {course.completedLessons}/{course.totalLessons} Lessons
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-300",
                            progressPercent === 100 ? "bg-emerald-500" : "bg-blue-600"
                          )}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick Lesson Stepper Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        title="Decrease 1 Lesson"
                        onClick={(e) => handleUpdateLessonCount(course.id, -1, e)}
                        className="w-7 h-7 rounded-lg bg-muted hover:bg-muted/80 text-foreground flex items-center justify-center text-xs font-bold transition-colors"
                      >
                        -1
                      </button>
                      <button
                        title="Advance 1 Lesson"
                        onClick={(e) => handleUpdateLessonCount(course.id, 1, e)}
                        className="w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center text-xs font-bold transition-colors shadow-xs"
                      >
                        +1
                      </button>
                    </div>

                    {/* Actions & Expand indicator */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleOpenEdit(course, e)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="Edit Course"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteCourse(course.id, e)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10"
                        title="Delete Course"
                      >
                        <Trash2 size={15} />
                      </button>
                      <div className="text-muted-foreground ml-1">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details: Modules Checklist & Notes */}
                {isExpanded && (
                  <div className="border-t border-border/60 bg-muted/20 p-5 md:p-6 space-y-5 animate-in fade-in duration-200">
                    {/* Notes block if present */}
                    {course.notes && (
                      <div className="p-3.5 rounded-2xl bg-card border border-border/50 text-xs md:text-sm text-muted-foreground leading-relaxed flex items-start gap-2.5">
                        <Bookmark size={16} className="text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground block mb-0.5 text-xs">Course Focus & Study Notes:</strong>
                          <span>{course.notes}</span>
                        </div>
                      </div>
                    )}

                    {/* Syllabus Modules Breakdown */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <ListChecks size={16} className="text-blue-600" />
                          <h4 className="text-sm font-bold text-foreground">Syllabus & Module Milestones</h4>
                        </div>

                        <div className="flex items-center gap-2">
                          {course.courseUrl && (
                            <a
                              href={course.courseUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
                            >
                              <span>Open Course</span>
                              <ExternalLink size={12} />
                            </a>
                          )}
                          <button
                            onClick={() => setActiveCourseForModule(course.id)}
                            className="text-xs px-2.5 py-1 rounded-lg bg-card border border-border/70 hover:bg-muted font-medium text-foreground flex items-center gap-1"
                          >
                            <Plus size={12} /> Add Module
                          </button>
                        </div>
                      </div>

                      {/* Add Module Inline Form */}
                      {activeCourseForModule === course.id && (
                        <div className="p-3.5 bg-card border border-border rounded-xl mb-3 flex flex-wrap items-center gap-2">
                          <input
                            type="text"
                            placeholder="Module name or chapter title..."
                            value={newModuleTitle}
                            onChange={(e) => setNewModuleTitle(e.target.value)}
                            className="flex-1 min-w-[200px] text-xs px-3 py-1.5 bg-muted/40 border border-border rounded-lg text-foreground focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Duration (e.g. 4 hrs)"
                            value={newModuleDuration}
                            onChange={(e) => setNewModuleDuration(e.target.value)}
                            className="w-28 text-xs px-3 py-1.5 bg-muted/40 border border-border rounded-lg text-foreground focus:outline-none"
                          />
                          <button
                            onClick={() => handleAddModule(course.id)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setActiveCourseForModule(null)}
                            className="px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      {course.modules.length === 0 ? (
                        <div className="p-4 rounded-xl border border-dashed border-border/70 text-center text-xs text-muted-foreground">
                          Belum ada daftar bab modul. Klik "+ Add Module" untuk membuat checklist silabus terperinci.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {course.modules.map((module) => (
                            <div
                              key={module.id}
                              onClick={() => handleToggleModule(course.id, module.id)}
                              className={cn(
                                "flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer select-none",
                                module.completed
                                  ? "bg-card/90 border-emerald-500/30 text-muted-foreground"
                                  : "bg-card border-border/70 text-foreground hover:border-border"
                              )}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={cn(
                                    "w-4 h-4 rounded-md border flex items-center justify-center shrink-0",
                                    module.completed
                                      ? "bg-emerald-600 border-emerald-600 text-white"
                                      : "border-border bg-muted/40"
                                  )}
                                >
                                  {module.completed && <CheckCircle2 size={12} />}
                                </div>
                                <span
                                  className={cn(
                                    "text-xs font-medium truncate",
                                    module.completed && "line-through text-muted-foreground"
                                  )}
                                >
                                  {module.title}
                                </span>
                              </div>
                              {module.duration && (
                                <span className="text-[10px] text-muted-foreground font-mono ml-2 shrink-0">
                                  {module.duration}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add / Edit Course */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/20">
              <h2 className="text-base font-semibold text-foreground">
                {editingCourse ? "Edit Course Information" : "Add New Course"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Course Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Financial Modeling Specialization, Harvard CS50"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Platform / Provider</label>
                  <input
                    type="text"
                    placeholder="e.g. Coursera, Udemy, edX, YouTube"
                    value={formPlatform}
                    onChange={(e) => setFormPlatform(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Instructor / School</label>
                  <input
                    type="text"
                    placeholder="e.g. David Malan, Aswath Damodaran"
                    value={formInstructor}
                    onChange={(e) => setFormInstructor(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineering, Finance, Design"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as CourseItem["status"])}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="in_progress">In Progress (Sedang Berjalan)</option>
                    <option value="completed">Completed (Selesai)</option>
                    <option value="want_to_take">Want to Take (Watchlist)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Total Lessons</label>
                  <input
                    type="number"
                    min={1}
                    value={formTotalLessons}
                    onChange={(e) => setFormTotalLessons(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Done Lessons</label>
                  <input
                    type="number"
                    min={0}
                    value={formCompletedLessons}
                    onChange={(e) => setFormCompletedLessons(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Total Hours</label>
                  <input
                    type="number"
                    min={1}
                    value={formTotalHours}
                    onChange={(e) => setFormTotalHours(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Done Hours</label>
                  <input
                    type="number"
                    min={0}
                    value={formCompletedHours}
                    onChange={(e) => setFormCompletedHours(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Course URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formCourseUrl}
                  onChange={(e) => setFormCourseUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="certificateCheckbox"
                  checked={formCertificateEarned}
                  onChange={(e) => setFormCertificateEarned(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="certificateCheckbox" className="text-xs font-medium text-foreground cursor-pointer">
                  Certificate of Completion Earned
                </label>
              </div>

              {formCertificateEarned && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Certificate Link</label>
                  <input
                    type="url"
                    placeholder="https://coursera.org/verify/..."
                    value={formCertificateUrl}
                    onChange={(e) => setFormCertificateUrl(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Study Notes / Takeaways</label>
                <textarea
                  rows={3}
                  placeholder="Important formulas, concepts, or takeaways..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
                >
                  {editingCourse ? "Save Changes" : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
