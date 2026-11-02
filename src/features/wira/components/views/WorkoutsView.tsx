import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Dumbbell,
  Activity,
  Flame,
  Clock,
  Calendar,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  Circle,
  ChevronRight,
  X,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Target,
  Check,
  Award,
  Shield,
  Layers,
} from "lucide-react";
import { cn } from "../../lib/utils";

export type WorkoutCategory =
  | "Kekuatan & Fungsional"
  | "Kardio & VO2 Max"
  | "Postur & Spine Health"
  | "HIIT & MetCon"
  | "Mobilitas & Recovery";

export interface ExerciseItem {
  id: string;
  name: string;
  targetMuscle: string;
  sets: number;
  reps: string;
  targetWeight?: string;
  restSeconds: number;
  completedSets?: boolean[];
  notes?: string;
}

export interface WorkoutProgram {
  id: string;
  title: string;
  category: WorkoutCategory;
  durationMinutes: number;
  estimatedCalories: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  targetFocus: string;
  description: string;
  exercises: ExerciseItem[];
  imageUrl: string;
}

export interface WorkoutLogEntry {
  id: string;
  workoutTitle: string;
  category: WorkoutCategory;
  date: string;
  durationMinutes: number;
  caloriesBurned: number;
  rpeScore: number; // 1-10
  notes: string;
}

const INITIAL_PROGRAMS: WorkoutProgram[] = [
  {
    id: "workout-1",
    title: "Executive Core & Functional Hypertrophy",
    category: "Kekuatan & Fungsional",
    durationMinutes: 45,
    estimatedCalories: 420,
    difficulty: "Intermediate",
    targetFocus: "Compound Strength, Bahu, Punggung, & Core Stability",
    description:
      "Program angkat beban compound yang efisien waktu untuk memperkuat rantai posterior, mempertahankan massa otot metabolik, dan memperbaiki postur tubuh eksekutif.",
    imageUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    exercises: [
      {
        id: "ex-1",
        name: "Trap Bar Deadlift (atau Dumbbell RDL)",
        targetMuscle: "Hamstring, Glutes & Rantai Posterior",
        sets: 4,
        reps: "8-10 reps",
        targetWeight: "60-80 kg",
        restSeconds: 90,
        completedSets: [false, false, false, false],
        notes: "Jaga punggung netral, dorong lantai dengan tumit.",
      },
      {
        id: "ex-2",
        name: "Incline Dumbbell Bench Press",
        targetMuscle: "Dada Atas & Bahu Depan",
        sets: 3,
        reps: "10-12 reps",
        targetWeight: "20-26 kg",
        restSeconds: 60,
        completedSets: [false, false, false],
        notes: "Sudut bangku 30 derajat, kontrol fase eksentrik 2 detik.",
      },
      {
        id: "ex-3",
        name: "Neutral-Grip Lat Pulldown / Pull-ups",
        targetMuscle: "Lats & Punggung Atas",
        sets: 4,
        reps: "8-10 reps",
        targetWeight: "55 kg",
        restSeconds: 60,
        completedSets: [false, false, false, false],
        notes: "Tarik siku ke arah saku pinggang belakang.",
      },
      {
        id: "ex-4",
        name: "Standing Dumbbell Overhead Press",
        targetMuscle: "Bahu & Core Stabilizer",
        sets: 3,
        reps: "10 reps",
        targetWeight: "14-18 kg",
        restSeconds: 60,
        completedSets: [false, false, false],
        notes: "Kencangkan perut dan glutes agar tulang belakang tidak hiperekstensi.",
      },
      {
        id: "ex-5",
        name: "Farmer's Carry Walk",
        targetMuscle: "Grip Strength, Traps & Anti-Rotasi Core",
        sets: 3,
        reps: "40 langkah",
        targetWeight: "2x 24 kg",
        restSeconds: 60,
        completedSets: [false, false, false],
        notes: "Jaga bahu tegak, dada tegap, jangan condong ke satu sisi.",
      },
    ],
  },
  {
    id: "workout-2",
    title: "Desk Spine Decompression & Postural Reset",
    category: "Postur & Spine Health",
    durationMinutes: 20,
    estimatedCalories: 110,
    difficulty: "Beginner",
    targetFocus: "Cervical Spine, Thoracic Mobility, & Glute Activation",
    description:
      "Protokol koreksi postur harian khusus profesional meja. Menghilangkan ketegangan leher kaku (tech neck), membuka dada yang membungkuk, dan mengaktifkan otot panggul.",
    imageUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
    exercises: [
      {
        id: "ex-201",
        name: "Prone Cobra / Thoracic Extension",
        targetMuscle: "Punggung Tengah & Rhomboids",
        sets: 3,
        reps: "12 reps (tahan 3 detik)",
        targetWeight: "Bodyweight",
        restSeconds: 30,
        completedSets: [false, false, false],
        notes: "Putar jempol ke arah luar, satukan belikat tanpa menengadah leher.",
      },
      {
        id: "ex-202",
        name: "Bird Dog Isometric Hold",
        targetMuscle: "Multifidus & Core Stability",
        sets: 3,
        reps: "8 reps per sisi (tahan 4 detik)",
        targetWeight: "Bodyweight",
        restSeconds: 30,
        completedSets: [false, false, false],
        notes: "Jaga pinggul tetap sejajar lantai, hindari melengkungkan pinggang.",
      },
      {
        id: "ex-203",
        name: "Wall Angels & Scapular Slides",
        targetMuscle: "Serratus Anterior & Rotator Cuff",
        sets: 3,
        reps: "10 repetisi terkontrol",
        targetWeight: "Bodyweight",
        restSeconds: 30,
        completedSets: [false, false, false],
        notes: "Tempelkan pergelangan tangan dan siku ke dinding sepanjang gerakan.",
      },
      {
        id: "ex-204",
        name: "Half-Kneeling Hip Flexor Stretch",
        targetMuscle: "Psoas & Iliacus",
        sets: 2,
        reps: "45 detik per sisi",
        targetWeight: "Stretch",
        restSeconds: 20,
        completedSets: [false, false],
        notes: "Tuck pelvis (posterior pelvic tilt) untuk meregangkan pangkal paha.",
      },
      {
        id: "ex-205",
        name: "Single-Leg Glute Bridge",
        targetMuscle: "Gluteus Maximus",
        sets: 3,
        reps: "12 reps per kaki",
        targetWeight: "Bodyweight",
        restSeconds: 30,
        completedSets: [false, false, false],
        notes: "Kunci aktivasi pantat di puncak gerakan selama 2 detik.",
      },
    ],
  },
  {
    id: "workout-3",
    title: "Zone 2 Cardio & VO2 Max Engine",
    category: "Kardio & VO2 Max",
    durationMinutes: 40,
    estimatedCalories: 380,
    difficulty: "Intermediate",
    targetFocus: "Mitochondrial Density, Fat Oxidation, & Mental Grit",
    description:
      "Sesi kardio intensitas stabil di zona detak jantung 125-140 bpm (kemampuan berbicara tanpa terengah-engah) untuk meregenerasi mitokondria dan meningkatkan kapasitas fokus otak.",
    imageUrl:
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=800&q=80",
    exercises: [
      {
        id: "ex-301",
        name: "Warm-up Dynamic Mobility & Joint Circles",
        targetMuscle: "Mobilitas Sendi & Suhu Tubuh",
        sets: 1,
        reps: "5 menit",
        restSeconds: 60,
        completedSets: [false],
        notes: "Arm circles, leg swings, dan cat-cow stretch.",
      },
      {
        id: "ex-302",
        name: "Zone 2 Steady-State Treadmill / Outdoor Jog",
        targetMuscle: "Kardiovaskular & Otot Kaki",
        sets: 1,
        reps: "25 menit (HR 130-140 bpm)",
        targetWeight: "Incline 2-3%",
        restSeconds: 90,
        completedSets: [false],
        notes: "Bernapas konsisten lewat hidung bila memungkinkan.",
      },
      {
        id: "ex-303",
        name: "VO2 Max Sprint Finishers (Norwegian 4x4 mini)",
        targetMuscle: "Anaerobic Power & Jantung",
        sets: 4,
        reps: "45 detik all-out / 60 detik jalan",
        targetWeight: "High Pace",
        restSeconds: 60,
        completedSets: [false, false, false, false],
        notes: "Dorong hingga 85-90% kapasitas detak jantung maksimal.",
      },
      {
        id: "ex-304",
        name: "Cool Down Breathwork & Walk",
        targetMuscle: "Aktivasi Sistem Saraf Parasimpatik",
        sets: 1,
        reps: "5 menit napas lambat",
        restSeconds: 0,
        completedSets: [false],
        notes: "Inhale 4 detik, exhale panjang 6 detik untuk menurunkan kortisol.",
      },
    ],
  },
  {
    id: "workout-4",
    title: "Executive High-Intensity MetCon 20",
    category: "HIIT & MetCon",
    durationMinutes: 20,
    estimatedCalories: 260,
    difficulty: "Advanced",
    targetFocus: "Full-Body Metabolic Conditioning & EPOC Burn",
    description:
      "Protokol interval 20 menit bagi eksekutif dengan jendela waktu sempit. Memacu metabolisme pasca-latihan (afterburn effect) dengan sirkuit kettlebell dan gerakan kalistenik.",
    imageUrl:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    exercises: [
      {
        id: "ex-401",
        name: "Russian Kettlebell Swings",
        targetMuscle: "Glutes, Hamstrings & Latissimus",
        sets: 4,
        reps: "15 reps",
        targetWeight: "16-20 kg",
        restSeconds: 30,
        completedSets: [false, false, false, false],
        notes: "Gerakan engsel pinggul (hip hinge), bukan squat.",
      },
      {
        id: "ex-402",
        name: "Dumbbell Goblet Squat",
        targetMuscle: "Quadriceps & Core",
        sets: 4,
        reps: "12 reps",
        targetWeight: "18 kg",
        restSeconds: 30,
        completedSets: [false, false, false, false],
        notes: "Kedalaman paha minimal sejajar lutut, dada tegak.",
      },
      {
        id: "ex-403",
        name: "Push-ups to Renegade Row",
        targetMuscle: "Dada, Lats & Anti-Rotasi",
        sets: 3,
        reps: "8 reps per sisi",
        targetWeight: "2x 10 kg",
        restSeconds: 45,
        completedSets: [false, false, false],
        notes: "Kaki dibuka sedikit lebih lebar dari pinggul agar stabil.",
      },
      {
        id: "ex-404",
        name: "Hanging Knee Raises / Hollow Body Rock",
        targetMuscle: "Rectus Abdominis & Grip",
        sets: 3,
        reps: "12 reps",
        targetWeight: "Bodyweight",
        restSeconds: 30,
        completedSets: [false, false, false],
        notes: "Kendalikan ayunan tubuh tanpa momentum berlebih.",
      },
    ],
  },
  {
    id: "workout-5",
    title: "Deep Fascia Release & Evening Recovery Flow",
    category: "Mobilitas & Recovery",
    durationMinutes: 25,
    estimatedCalories: 90,
    difficulty: "Beginner",
    targetFocus: "Nervous System Down-regulation & Hip Openers",
    description:
      "Peregangan restoratif malam hari untuk menetralkan ketegangan otot setelah seharian memimpin pertemuan atau negosiasi intens. Mempersiapkan tubuh untuk fase deep sleep.",
    imageUrl:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
    exercises: [
      {
        id: "ex-501",
        name: "Foam Rolling Upper Back & Quads",
        targetMuscle: "Myofascial Tissue",
        sets: 1,
        reps: "6 menit",
        restSeconds: 15,
        completedSets: [false],
        notes: "Bernapas dalam saat menemukan titik simpul otot (trigger point).",
      },
      {
        id: "ex-502",
        name: "Pigeon Pose / Sleeping Swan",
        targetMuscle: "Piriformis & Hip Rotators",
        sets: 2,
        reps: "90 detik per sisi",
        targetWeight: "Bodyweight",
        restSeconds: 20,
        completedSets: [false, false],
        notes: "Letakkan bantal di bawah pinggul bila terasa terlalu ketat.",
      },
      {
        id: "ex-503",
        name: "World's Greatest Stretch",
        targetMuscle: "Hip Flexor, Hamstring, Thoracic",
        sets: 2,
        reps: "6 reps per sisi dinamis",
        targetWeight: "Bodyweight",
        restSeconds: 20,
        completedSets: [false, false],
        notes: "Buka dada ke atas, pandangan mengikuti ujung jari tangan.",
      },
      {
        id: "ex-504",
        name: "Legs Up the Wall (Viparita Karani)",
        targetMuscle: "Venous Return & Parasympathetic",
        sets: 1,
        reps: "8 menit relaksasi",
        targetWeight: "Gravity",
        restSeconds: 0,
        completedSets: [false],
        notes: "Mata terpejam, letakkan tangan di perut untuk merasakan napas diafragma.",
      },
    ],
  },
];

const INITIAL_LOGS: WorkoutLogEntry[] = [
  {
    id: "log-1",
    workoutTitle: "Executive Core & Functional Hypertrophy",
    category: "Kekuatan & Fungsional",
    date: "18 Sep 2026",
    durationMinutes: 48,
    caloriesBurned: 435,
    rpeScore: 8,
    notes: "Trap bar deadlift naik ke 80kg dengan form prima. Otot punggung terasa aktif mantap.",
  },
  {
    id: "log-2",
    workoutTitle: "Zone 2 Cardio & VO2 Max Engine",
    category: "Kardio & VO2 Max",
    date: "16 Sep 2026",
    durationMinutes: 40,
    caloriesBurned: 375,
    rpeScore: 6,
    notes: "Lari outdoor di Senayan Park. Rata-rata HR stabil di 132 bpm, napas hidung lancar.",
  },
  {
    id: "log-3",
    workoutTitle: "Desk Spine Decompression & Postural Reset",
    category: "Postur & Spine Health",
    date: "15 Sep 2026",
    durationMinutes: 22,
    caloriesBurned: 115,
    rpeScore: 4,
    notes: "Sesi siang hari setelah maraton meeting 4 jam. Leher kaku hilang seketika.",
  },
];

export function WorkoutsView() {
  const [programs, setPrograms] = useState<WorkoutProgram[]>(() => {
    try {
      const saved = localStorage.getItem("aio_executive_workouts");
      return saved ? JSON.parse(saved) : INITIAL_PROGRAMS;
    } catch {
      return INITIAL_PROGRAMS;
    }
  });

  const [logs, setLogs] = useState<WorkoutLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem("aio_workout_logs");
      return saved ? JSON.parse(saved) : INITIAL_LOGS;
    } catch {
      return INITIAL_LOGS;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"programs" | "logs">("programs");

  // Active workout drawer / session state
  const [activeWorkout, setActiveWorkout] = useState<WorkoutProgram | null>(null);
  const [exerciseProgress, setExerciseProgress] = useState<Record<string, boolean[]>>({});
  const [sessionNotes, setSessionNotes] = useState("");
  const [sessionRpe, setSessionRpe] = useState(7);
  const [sessionFinished, setSessionFinished] = useState(false);

  // Real-time Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerInitial, setTimerInitial] = useState(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // New Workout Form Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<WorkoutCategory>("Kekuatan & Fungsional");
  const [newDuration, setNewDuration] = useState(30);
  const [newCalories, setNewCalories] = useState(250);
  const [newDifficulty, setNewDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [newTargetFocus, setNewTargetFocus] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newExercisesText, setNewExercisesText] = useState(
    "Dumbbell Goblet Squat (3 sets, 12 reps, 60s rest)\nPush-ups (3 sets, 15 reps, 45s rest)\nDumbbell Row (3 sets, 10 reps, 60s rest)"
  );

  // Save programs and logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("aio_executive_workouts", JSON.stringify(programs));
    } catch (e) {
      console.error(e);
    }
  }, [programs]);

  useEffect(() => {
    try {
      localStorage.setItem("aio_workout_logs", JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  }, [logs]);

  // Rest timer countdown effect
  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      timerRef.current = setTimeout(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
      // Play web audio beep when rest ends
      try {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      } catch {
        // audio might be blocked without gesture
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timerRunning, timerSeconds]);

  const startRestTimer = (seconds: number) => {
    setTimerInitial(seconds);
    setTimerSeconds(seconds);
    setTimerRunning(true);
  };

  const toggleTimerPause = () => {
    setTimerRunning(!timerRunning);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(timerInitial);
  };

  // Open Workout Drawer
  const handleOpenWorkout = (workout: WorkoutProgram) => {
    setActiveWorkout(workout);
    setSessionFinished(false);
    setSessionNotes("");
    setSessionRpe(7);
    // Initialize completed sets map
    const initialProgress: Record<string, boolean[]> = {};
    workout.exercises.forEach((ex) => {
      initialProgress[ex.id] = new Array(ex.sets).fill(false);
    });
    setExerciseProgress(initialProgress);
  };

  // Toggle set checkbox
  const toggleSetComplete = (exerciseId: string, setIndex: number, restSeconds: number) => {
    setExerciseProgress((prev) => {
      const currentSets = prev[exerciseId] ? [...prev[exerciseId]] : [];
      const newState = !currentSets[setIndex];
      currentSets[setIndex] = newState;

      // Auto trigger rest timer if set was marked completed
      if (newState) {
        startRestTimer(restSeconds || 60);
      }

      return {
        ...prev,
        [exerciseId]: currentSets,
      };
    });
  };

  // Finish Workout Session and save to log
  const handleFinishWorkout = () => {
    if (!activeWorkout) return;

    // Calculate completion rate
    let totalSets = 0;
    let completedCount = 0;
    Object.values(exerciseProgress).forEach((sets) => {
      sets.forEach((done) => {
        totalSets++;
        if (done) completedCount++;
      });
    });

    const completionRate = totalSets > 0 ? Math.round((completedCount / totalSets) * 100) : 100;

    const newLog: WorkoutLogEntry = {
      id: "log-" + Date.now(),
      workoutTitle: activeWorkout.title,
      category: activeWorkout.category,
      date: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      durationMinutes: activeWorkout.durationMinutes,
      caloriesBurned: Math.round(activeWorkout.estimatedCalories * (completionRate / 100)),
      rpeScore: sessionRpe,
      notes: sessionNotes || `Selesai ${completedCount}/${totalSets} set (${completionRate}% target terpenuhi).`,
    };

    setLogs([newLog, ...logs]);
    setSessionFinished(true);
  };

  // Handle create new routine
  const handleCreateWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Parse simple exercise lines
    const parsedExercises: ExerciseItem[] = newExercisesText
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .map((line, idx) => ({
        id: `custom-ex-${Date.now()}-${idx}`,
        name: line.replace(/\(.*\)/, "").trim(),
        targetMuscle: "Otot Fungsional",
        sets: 3,
        reps: "10-12 reps",
        restSeconds: 60,
        completedSets: [false, false, false],
        notes: line.includes("(") ? line.substring(line.indexOf("(") + 1, line.indexOf(")")) : "Fokus form rapi",
      }));

    const newProgram: WorkoutProgram = {
      id: "prog-" + Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      durationMinutes: Number(newDuration) || 30,
      estimatedCalories: Number(newCalories) || 200,
      difficulty: newDifficulty,
      targetFocus: newTargetFocus.trim() || "Kebugaran & Postur",
      description: newDescription.trim() || "Rutinitas latihan personal dirancang untuk menjaga kebugaran eksekutif.",
      imageUrl:
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      exercises: parsedExercises.length > 0 ? parsedExercises : [
        {
          id: "ex-default",
          name: "Full Body Circuit",
          targetMuscle: "Otot Inti & Stamina",
          sets: 3,
          reps: "12 reps",
          restSeconds: 60,
          completedSets: [false, false, false],
        },
      ],
    };

    setPrograms([newProgram, ...programs]);
    setIsAddModalOpen(false);
    // Reset form
    setNewTitle("");
    setNewTargetFocus("");
    setNewDescription("");
  };

  // Delete workout
  const handleDeleteWorkout = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Hapus rutinitas latihan ini dari daftar?")) {
      setPrograms(programs.filter((p) => p.id !== id));
      if (activeWorkout?.id === id) setActiveWorkout(null);
    }
  };

  // Delete log entry
  const handleDeleteLog = (id: string) => {
    setLogs(logs.filter((l) => l.id !== id));
  };

  // Filtered Programs
  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      const matchCat = selectedCategory === "Semua" || p.category === selectedCategory;
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.targetFocus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [programs, selectedCategory, searchQuery]);

  // Executive Stats Calculation
  const stats = useMemo(() => {
    const totalSessions = logs.length;
    const totalMinutes = logs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
    const totalCalories = logs.reduce((acc, curr) => acc + curr.caloriesBurned, 0);
    const weeklyTargetMinutes = 240; // 4 jam per minggu
    const weeklyProgress = Math.min(Math.round((totalMinutes / weeklyTargetMinutes) * 100), 100);

    return {
      totalSessions,
      totalMinutes,
      totalCalories,
      weeklyProgress,
    };
  }, [logs]);

  const categories: string[] = [
    "Semua",
    "Kekuatan & Fungsional",
    "Postur & Spine Health",
    "Kardio & VO2 Max",
    "HIIT & MetCon",
    "Mobilitas & Recovery",
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-16">
      {/* Top Banner & Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Executive Physical Readiness
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Shield size={12} className="text-emerald-500" />
              Ergonomic & Longevity Protocol
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mt-2 tracking-tight">
            Workouts & Fitness Performance
          </h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Protokol kebugaran fungsional, dekompresi tulang belakang pekerja meja, dan ketahanan kardiovaskular Zone 2 untuk menopang ketajaman kognitif eksekutif.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Rest Timer Pill */}
          {timerSeconds > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-sm font-medium animate-pulse">
              <Clock size={16} />
              <span>Istirahat: {timerSeconds}s</span>
              <button
                onClick={toggleTimerPause}
                className="p-1 hover:bg-amber-500/20 rounded"
                title={timerRunning ? "Jeda Timer" : "Lanjutkan Timer"}
              >
                {timerRunning ? <Pause size={12} /> : <Play size={12} />}
              </button>
              <button
                onClick={resetTimer}
                className="p-1 hover:bg-amber-500/20 rounded"
                title="Reset Timer"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02]"
          >
            <Plus size={16} />
            <span>Tambah Rutinitas</span>
          </button>
        </div>
      </div>

      {/* KPI Performance Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Sesi Latihan Tercatat
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-foreground">{stats.totalSessions}</span>
              <span className="text-xs text-muted-foreground">sesi selesai</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Dumbbell size={20} />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Waktu Aktif Kumulatif
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-foreground">{stats.totalMinutes}</span>
              <span className="text-xs text-muted-foreground">menit latihan</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Kalori Terbakar
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-foreground">{stats.totalCalories.toLocaleString("id-ID")}</span>
              <span className="text-xs text-muted-foreground">kcal</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Flame size={20} />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Target Mingguan (240m)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-foreground">{stats.weeklyProgress}%</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">On Track</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Target size={20} />
          </div>
        </div>
      </div>

      {/* Navigation View Tabs (Program Katalog vs Riwayat Log) */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center bg-muted/70 p-1 rounded-xl border border-border/80">
          <button
            onClick={() => setActiveTab("programs")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
              activeTab === "programs"
                ? "bg-card text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Koleksi Program ({programs.length})
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5",
              activeTab === "logs"
                ? "bg-card text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Activity size={14} />
            <span>Riwayat Sesi ({logs.length})</span>
          </button>
        </div>

        {activeTab === "programs" && (
          <div className="flex items-center gap-3 flex-1 max-w-md justify-end">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari program, otot target, atau gerakan..."
                className="w-full bg-card border border-border pl-9 pr-4 py-1.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-foreground"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === "programs" ? (
        <div className="space-y-6">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border",
                  selectedCategory === cat
                    ? "bg-foreground text-background border-foreground shadow-sm font-semibold"
                    : "bg-card text-muted-foreground border-border hover:bg-accent hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <div
                key={program.id}
                onClick={() => handleOpenWorkout(program)}
                className="group bg-card border border-border hover:border-blue-500/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col"
              >
                {/* Image Cover */}
                <div className="relative h-44 w-full overflow-hidden bg-muted">
                  <img
                    src={program.imageUrl}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Category & Difficulty Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-border/10">
                      {program.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-md text-[11px] font-bold border",
                        program.difficulty === "Beginner"
                          ? "bg-emerald-500/80 text-white border-emerald-400/40"
                          : program.difficulty === "Intermediate"
                          ? "bg-blue-500/80 text-white border-blue-400/40"
                          : "bg-rose-500/80 text-white border-rose-400/40"
                      )}
                    >
                      {program.difficulty}
                    </span>
                  </div>

                  {/* Title & Quick Info on Image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-base font-bold line-clamp-1 group-hover:text-blue-300 transition-colors">
                      {program.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-white/80 mt-1 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {program.durationMinutes} menit
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Flame size={12} className="text-rose-400" />
                        ~{program.estimatedCalories} kcal
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Layers size={12} />
                        {program.exercises.length} gerakan
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 mb-1.5">
                      <Target size={13} />
                      <span>{program.targetFocus}</span>
                    </div>
                    <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">
                      {program.description}
                    </p>
                  </div>

                  {/* Exercise Preview List */}
                  <div className="border-t border-border/60 pt-3 space-y-1.5">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Gerakan Inti:
                    </span>
                    <ul className="space-y-1">
                      {program.exercises.slice(0, 3).map((ex) => (
                        <li
                          key={ex.id}
                          className="text-xs text-foreground/90 flex items-center justify-between"
                        >
                          <span className="truncate pr-2">• {ex.name}</span>
                          <span className="text-muted-foreground text-[11px] font-mono whitespace-nowrap">
                            {ex.sets}x {ex.reps}
                          </span>
                        </li>
                      ))}
                      {program.exercises.length > 3 && (
                        <li className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                          +{program.exercises.length - 3} gerakan lainnya...
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <button
                      onClick={(e) => handleDeleteWorkout(program.id, e)}
                      className="p-1.5 text-muted-foreground hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Hapus Rutinitas"
                    >
                      <Trash2 size={14} />
                    </button>

                    <button
                      onClick={() => handleOpenWorkout(program)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Mulai Latihan</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Sesi Latihan Selesai / Workout Logs */
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Activity size={18} className="text-emerald-500" />
                Catatan Performa & Log Sesi Selesai
              </h3>
              <span className="text-xs text-muted-foreground">
                Total {logs.length} sesi tersimpan
              </span>
            </div>

            {logs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Dumbbell size={36} className="mx-auto mb-3 opacity-30 text-blue-500" />
                <p className="text-sm font-medium">Belum ada sesi latihan yang dicatat.</p>
                <p className="text-xs mt-1">Pilih salah satu program lalu selesaikan set latihan untuk menyimpan riwayat.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-foreground">
                          {log.workoutTitle}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          {log.category}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar size={12} />
                          {log.date}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {log.notes}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock size={13} className="text-blue-500" />
                        <span className="font-semibold text-foreground">{log.durationMinutes}m</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Flame size={13} className="text-rose-500" />
                        <span className="font-semibold text-foreground">{log.caloriesBurned} kcal</span>
                      </div>
                      <div className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-[11px]">
                        RPE: {log.rpeScore}/10
                      </div>
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="p-1.5 text-muted-foreground hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Hapus Log"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ACTIVE WORKOUT DRAWER / MODAL */}
      {activeWorkout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-border/80 flex items-start justify-between bg-muted/30">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    {activeWorkout.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Target: {activeWorkout.durationMinutes} menit • ~{activeWorkout.estimatedCalories} kcal
                  </span>
                </div>
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  {activeWorkout.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activeWorkout.targetFocus}
                </p>
              </div>

              <button
                onClick={() => setActiveWorkout(null)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: Exercises & Rest Timer */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Floating Active Rest Timer Card */}
              <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-sm shadow-md shadow-blue-500/30">
                    {timerSeconds > 0 ? `${timerSeconds}s` : <Clock size={20} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      {timerSeconds > 0
                        ? timerRunning
                          ? "Istirahat Aktif..."
                          : "Timer Dijeda"
                        : "Istirahat Antar Set (Rest Timer)"}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Klik salah satu preset untuk memulai jeda pemulihan ATP otot.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {[30, 60, 90, 120].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => startRestTimer(sec)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                        timerSeconds === sec && timerRunning
                          ? "bg-blue-600 text-white"
                          : "bg-card border border-border hover:bg-accent text-foreground"
                      )}
                    >
                      {sec}s
                    </button>
                  ))}
                  {timerSeconds > 0 && (
                    <button
                      onClick={toggleTimerPause}
                      className="p-1.5 rounded-lg bg-card border border-border text-foreground hover:bg-accent"
                      title="Pause/Play"
                    >
                      {timerRunning ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                  )}
                </div>
              </div>

              {/* Checklist Exercise by Exercise */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Dumbbell size={16} className="text-blue-500" />
                    Daftar Gerakan & Pelacak Set
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    Centang nomor set saat kamu menyelesaikan repetisi
                  </span>
                </div>

                <div className="space-y-3">
                  {activeWorkout.exercises.map((ex, exIndex) => {
                    const setsState = exerciseProgress[ex.id] || new Array(ex.sets).fill(false);
                    const isAllDone = setsState.length > 0 && setsState.every(Boolean);

                    return (
                      <div
                        key={ex.id}
                        className={cn(
                          "p-4 rounded-2xl border transition-all",
                          isAllDone
                            ? "bg-emerald-500/5 border-emerald-500/30"
                            : "bg-card border-border"
                        )}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-muted-foreground">
                                #{exIndex + 1}
                              </span>
                              <h5 className="text-sm font-bold text-foreground">
                                {ex.name}
                              </h5>
                              {isAllDone && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                  <Check size={10} /> Selesai
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                              <span>Target: {ex.targetMuscle}</span>
                              {ex.targetWeight && (
                                <>
                                  <span>•</span>
                                  <span className="font-mono text-foreground font-medium">
                                    Beban: {ex.targetWeight}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground font-mono">
                            Target: {ex.sets} Set × {ex.reps} (Jeda: {ex.restSeconds}s)
                          </div>
                        </div>

                        {ex.notes && (
                          <p className="text-xs text-muted-foreground/80 italic mb-3">
                            💡 {ex.notes}
                          </p>
                        )}

                        {/* Set Checkboxes */}
                        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border/50">
                          <span className="text-xs font-semibold text-muted-foreground mr-1">
                            Set:
                          </span>
                          {setsState.map((isDone, sIndex) => (
                            <button
                              key={sIndex}
                              onClick={() => toggleSetComplete(ex.id, sIndex, ex.restSeconds)}
                              className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
                                isDone
                                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 scale-105"
                                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border"
                              )}
                            >
                              {isDone ? (
                                <CheckCircle2 size={13} className="text-white" />
                              ) : (
                                <Circle size={13} />
                              )}
                              <span>Set {sIndex + 1}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Session Feedback & RPE Input */}
              <div className="bg-muted/40 p-4 rounded-2xl border border-border/70 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Zap size={14} className="text-amber-500" />
                    Tingkat Usaha Fisik / RPE (Rate of Perceived Exertion): {sessionRpe}/10
                  </label>
                  <span className="text-xs text-muted-foreground">
                    {sessionRpe <= 4
                      ? "Ringan (Easy Recovery)"
                      : sessionRpe <= 7
                      ? "Menengah (Challenging & Solid)"
                      : sessionRpe <= 9
                      ? "Intensitas Tinggi (Near Failure)"
                      : "Maksimal (All-Out Effort)"}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={sessionRpe}
                  onChange={(e) => setSessionRpe(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />

                <div className="pt-2">
                  <label className="text-xs font-bold text-foreground mb-1 block">
                    Catatan Refleksi Sesi (Opsional):
                  </label>
                  <input
                    type="text"
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    placeholder="Contoh: Beban dumbbell terasa enteng, lutut aman, energi prima..."
                    className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {sessionFinished && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-3">
                  <Award size={24} className="text-emerald-500 flex-shrink-0" />
                  <div>
                    <h5 className="text-sm font-bold">Latihan Berhasil Disimpan ke Log!</h5>
                    <p className="text-xs mt-0.5 opacity-90">
                      Metrik pembakaran kalori dan durasi telah diperbarui ke dasbor kebugaran mingguan.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border/80 flex items-center justify-between bg-muted/30">
              <button
                onClick={() => setActiveWorkout(null)}
                className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Tutup Jendela
              </button>

              <button
                onClick={handleFinishWorkout}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
              >
                <Check size={16} />
                <span>Simpan Sesi ke Riwayat Log</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW WORKOUT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Dumbbell size={18} className="text-blue-500" />
                Tambah Program Latihan Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateWorkout} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">
                  Nama Program Latihan *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Morning Mobility & Kettlebell Armor"
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">
                    Kategori Latihan
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as WorkoutCategory)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none"
                  >
                    <option value="Kekuatan & Fungsional">Kekuatan & Fungsional</option>
                    <option value="Postur & Spine Health">Postur & Spine Health</option>
                    <option value="Kardio & VO2 Max">Kardio & VO2 Max</option>
                    <option value="HIIT & MetCon">HIIT & MetCon</option>
                    <option value="Mobilitas & Recovery">Mobilitas & Recovery</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">
                    Tingkat Kesulitan
                  </label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as "Beginner" | "Intermediate" | "Advanced")}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">
                    Estimasi Durasi (Menit)
                  </label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">
                    Estimasi Kalori (kcal)
                  </label>
                  <input
                    type="number"
                    value={newCalories}
                    onChange={(e) => setNewCalories(Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">
                  Target Otot / Fokus Utama
                </label>
                <input
                  type="text"
                  value={newTargetFocus}
                  onChange={(e) => setNewTargetFocus(e.target.value)}
                  placeholder="Contoh: Punggung Bawah, Bahu, Rantai Posterior"
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">
                  Daftar Gerakan (Satu baris per gerakan)
                </label>
                <textarea
                  rows={4}
                  value={newExercisesText}
                  onChange={(e) => setNewExercisesText(e.target.value)}
                  placeholder="Nama Gerakan (3 sets, 12 reps, 60s rest)"
                  className="w-full bg-background border border-border rounded-xl p-3 text-xs text-foreground font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-600/20"
                >
                  Simpan Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
