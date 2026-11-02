import React, { useState, useEffect, useMemo } from "react";
import {
  Key,
  Plus,
  Search,
  Eye,
  EyeOff,
  Copy,
  Check,
  Star,
  Trash2,
  Edit3,
  ShieldCheck,
  ShieldAlert,
  Lock,
  RefreshCw,
  Sparkles,
  Download,
  Upload,
  X,
  Globe,
} from "lucide-react";

export type PasswordItem = {
  id: string;
  title: string;
  category: "Finansial / Perbankan" | "Email & Akun Kerja" | "Server & Cloud" | "Media Sosial" | "Klien & Portal" | "Lainnya";
  username: string;
  password: string;
  url?: string;
  notes?: string;
  isFavorite: boolean;
  tags: string[];
  updatedAt: string;
};

const CATEGORIES = [
  "Semua",
  "Finansial / Perbankan",
  "Email & Akun Kerja",
  "Server & Cloud",
  "Media Sosial",
  "Klien & Portal",
  "Lainnya",
] as const;

const INITIAL_PASSWORDS: PasswordItem[] = [
  {
    id: "pwd-1",
    title: "KlikBCA Bisnis Corporate",
    category: "Finansial / Perbankan",
    username: "CORP_DIGITAL_01",
    password: "Bca#Secure2026!Str",
    url: "https://klikbca.com",
    notes: "Gunakan token key BCA untuk otorisasi transfer batch payroll setiap tanggal 25.",
    isFavorite: true,
    tags: ["Prioritas", "Banking"],
    updatedAt: "2026-03-01",
  },
  {
    id: "pwd-2",
    title: "Google Workspace Superadmin",
    category: "Email & Akun Kerja",
    username: "admin@perusahaan.co.id",
    password: "GSuite$Enterprise99#",
    url: "https://admin.google.com",
    notes: "Pengelolaan user email konsultan, shared drive tim, dan lisensi Google Meet.",
    isFavorite: true,
    tags: ["Admin", "2FA"],
    updatedAt: "2026-02-15",
  },
  {
    id: "pwd-3",
    title: "Cloud Infrastructure & Database Console",
    category: "Server & Cloud",
    username: "ops-cloud@devteam.id",
    password: "K8s-CloudCluster*2026",
    url: "https://console.cloud.google.com",
    notes: "Akses cluster staging dan production database PostgreSQL Cloud SQL.",
    isFavorite: false,
    tags: ["DevOps", "Production"],
    updatedAt: "2026-03-10",
  },
  {
    id: "pwd-4",
    title: "GitHub Corporate Organization",
    category: "Server & Cloud",
    username: "lead-architect",
    password: "GhP_99xSecureCodeRepo#",
    url: "https://github.com",
    notes: "Personal access token dengan hak akses repo privat dan CI/CD deployment action.",
    isFavorite: true,
    tags: ["Code", "Dev"],
    updatedAt: "2026-02-28",
  },
  {
    id: "pwd-5",
    title: "Portal Klien Enterprise Hub",
    category: "Klien & Portal",
    username: "consultant.lead@clientportal.com",
    password: "ClientHub2026@Pass!",
    url: "https://portal.clientos.internal",
    notes: "Akses verifikasi laporan bulanan dan modul tanda tangan dokumen kontrak klien.",
    isFavorite: false,
    tags: ["ClientOS"],
    updatedAt: "2026-03-05",
  },
];

const STORAGE_KEY = "wira_passwords_vault_v2";

// Password strength evaluator
function evaluatePasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
  textColor: string;
} {
  if (!password) return { score: 0, label: "Kosong", color: "bg-muted", textColor: "text-muted-foreground" };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score, label: "Rentan / Lemah", color: "bg-rose-500", textColor: "text-rose-600 dark:text-rose-400" };
  if (score <= 3) return { score, label: "Sedang", color: "bg-amber-500", textColor: "text-amber-600 dark:text-amber-400" };
  if (score === 4) return { score, label: "Kuat", color: "bg-blue-500", textColor: "text-blue-600 dark:text-blue-400" };
  return { score, label: "Sangat Kuat", color: "bg-emerald-500", textColor: "text-emerald-600 dark:text-emerald-400" };
}

// Password Generator helper
function generateRandomPassword(length: number, useUpper: boolean, useLower: boolean, useNumbers: boolean, useSymbols: boolean): string {
  let charset = "";
  if (useUpper) charset += "ABCDEFGHJKLMNPQRSTUVWXYZ";
  if (useLower) charset += "abcdefghijkmnpqrstuvwxyz";
  if (useNumbers) charset += "23456789";
  if (useSymbols) charset += "!@#$%^&*()_+~|}{[]:;?><=";
  if (!charset) charset = "abcdefghijklmnopqrstuvwxyz";

  let result = "";
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += charset[array[i] % charset.length];
  }
  return result;
}

export function PasswordsView() {
  const [passwords, setPasswords] = useState<PasswordItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PASSWORDS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [pinInput, setPinInput] = useState("");

  // Visible password tracking per id
  const [visibleMap, setVisibleMap] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPassword, setEditingPassword] = useState<PasswordItem | null>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(passwords));
    } catch {
      // ignore
    }
  }, [passwords]);

  const toggleVisible = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setVisibleMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, keyName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPasswords((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Hapus entri kata sandi ini dari brankas?")) {
      setPasswords((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSavePassword = (data: Omit<PasswordItem, "id" | "updatedAt">) => {
    if (editingPassword) {
      setPasswords((prev) =>
        prev.map((p) =>
          p.id === editingPassword.id
            ? { ...p, ...data, updatedAt: new Date().toISOString().slice(0, 10) }
            : p
        )
      );
    } else {
      const newEntry: PasswordItem = {
        ...data,
        id: `pwd-${Date.now()}`,
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      setPasswords((prev) => [newEntry, ...prev]);
    }
    setIsModalOpen(false);
    setEditingPassword(null);
  };

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return passwords.filter((item) => {
      if (onlyFavorites && !item.isFavorite) return false;
      if (selectedCategory !== "Semua" && item.category !== selectedCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.username.toLowerCase().includes(q) ||
        (item.url && item.url.toLowerCase().includes(q)) ||
        (item.notes && item.notes.toLowerCase().includes(q)) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [passwords, onlyFavorites, selectedCategory, searchQuery]);

  // Security audit overview
  const audit = useMemo(() => {
    const total = passwords.length;
    const strongCount = passwords.filter((p) => evaluatePasswordStrength(p.password).score >= 4).length;
    const weakCount = passwords.filter((p) => evaluatePasswordStrength(p.password).score <= 2).length;
    const favorites = passwords.filter((p) => p.isFavorite).length;
    return { total, strongCount, weakCount, favorites };
  }, [passwords]);

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(passwords, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `brankas_password_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (Array.isArray(parsed)) {
          setPasswords(parsed);
          alert(`Berhasil mengimpor ${parsed.length} akun password!`);
        }
      } catch {
        alert("File tidak valid.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  if (isLocked) {
    return (
      <div className="w-full max-w-md mx-auto my-12 p-8 bg-card border border-border rounded-3xl shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
          <Lock size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Brankas Terkunci</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Masukkan PIN atau klik Buka Kunci untuk melihat kredensial Anda.
          </p>
        </div>
        <div className="space-y-3">
          <input
            type="password"
            placeholder="PIN Brankas (default: bebas)"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            className="w-full px-4 py-2.5 text-center text-base tracking-widest bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={() => {
              setIsLocked(false);
              setPinInput("");
            }}
            className="w-full py-2.5 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-md"
          >
            Buka Kunci Brankas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Brankas Kata Sandi & Secrets
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {passwords.length} Kredensial
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Penyimpanan kredensial aman, audit kekuatan kata sandi, dan generator sandi acak berkeamanan tinggi.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-border bg-card hover:bg-muted/50 text-foreground transition-colors shadow-sm"
          >
            <Sparkles size={14} className="text-amber-500" />
            <span>Generator Sandi</span>
          </button>

          <button
            onClick={() => setIsLocked(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-border bg-card hover:bg-muted/50 text-foreground transition-colors shadow-sm"
            title="Kunci Layar Brankas"
          >
            <Lock size={14} />
            <span>Kunci</span>
          </button>

          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-border bg-card hover:bg-muted/50 text-foreground transition-colors shadow-sm">
            <Upload size={14} />
            <span>Impor</span>
            <input type="file" accept=".json" onChange={importJSON} className="hidden" />
          </label>

          <button
            onClick={exportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-border bg-card hover:bg-muted/50 text-foreground transition-colors shadow-sm"
          >
            <Download size={14} />
            <span>Ekspor</span>
          </button>

          <button
            onClick={() => {
              setEditingPassword(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-md shadow-primary/20"
          >
            <Plus size={16} />
            <span>Tambah Kredensial</span>
          </button>
        </div>
      </div>

      {/* Security Health & Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card border border-border p-3.5 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Key size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Akun</p>
            <p className="text-lg font-bold text-foreground">{audit.total}</p>
          </div>
        </div>

        <div className="bg-card border border-border p-3.5 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Sandi Sangat Kuat</p>
            <p className="text-lg font-bold text-foreground">{audit.strongCount}</p>
          </div>
        </div>

        <div className="bg-card border border-border p-3.5 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <ShieldAlert size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Perlu Diperkuat</p>
            <p className="text-lg font-bold text-foreground">{audit.weakCount}</p>
          </div>
        </div>

        <div className="bg-card border border-border p-3.5 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Star size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Favorit / Disematkan</p>
            <p className="text-lg font-bold text-foreground">{audit.favorites}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama akun, username, url domain, atau tag..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
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

          <button
            onClick={() => setOnlyFavorites((prev) => !prev)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border shrink-0 ${
              onlyFavorites
                ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                : "bg-background text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            <Star size={14} className={onlyFavorites ? "fill-white" : ""} />
            <span>Favorit Saja</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-muted-foreground font-medium mr-1 shrink-0">Kategori:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors border ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background text-muted-foreground border-border hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Password Vault List */}
      {filteredEntries.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-3xl p-12 text-center bg-card/40 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
            <Key size={28} />
          </div>
          <h3 className="text-lg font-bold text-foreground">Tidak Ada Kata Sandi Ditemukan</h3>
          <p className="text-sm text-muted-foreground max-w-md mt-1 mb-6">
            {searchQuery || selectedCategory !== "Semua" || onlyFavorites
              ? "Coba sesuaikan kata kunci pencarian atau filter kategori Anda."
              : "Amankan akun, PIN, dan kata sandi Anda di dalam brankas lokal."}
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Semua");
              setOnlyFavorites(false);
              setEditingPassword(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-sm"
          >
            Tambah Kredensial Baru
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.map((item) => {
            const isVisible = !!visibleMap[item.id];
            const strength = evaluatePasswordStrength(item.password);

            return (
              <div
                key={item.id}
                className="bg-card border border-border hover:border-primary/40 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Title, Category & Fav */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-bold text-base text-foreground leading-snug">
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-muted text-muted-foreground border border-border">
                          {item.category}
                        </span>
                        {item.url && (
                          <a
                            href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-primary hover:underline flex items-center gap-0.5 font-medium"
                          >
                            <Globe size={11} /> {item.url.replace(/^https?:\/\//, "").split("/")[0]}
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => toggleFavorite(item.id, e)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-500 hover:bg-muted transition-colors"
                        title={item.isFavorite ? "Hapus favorit" : "Tandai favorit"}
                      >
                        <Star
                          size={16}
                          className={item.isFavorite ? "fill-amber-400 text-amber-400" : ""}
                        />
                      </button>
                      <button
                        onClick={() => {
                          setEditingPassword(item);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                        title="Edit"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Username Field */}
                  <div className="space-y-2 bg-muted/30 p-3.5 rounded-2xl border border-border mb-3 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground font-medium shrink-0">Username / Email:</span>
                      <div className="flex items-center gap-1.5 font-mono text-foreground font-semibold truncate">
                        <span>{item.username}</span>
                        <button
                          onClick={(e) => copyToClipboard(item.username, `user-${item.id}`, e)}
                          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="Salin Username"
                        >
                          {copiedKey === `user-${item.id}` ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
                      <span className="text-muted-foreground font-medium shrink-0">Password:</span>
                      <div className="flex items-center gap-1.5 font-mono text-foreground font-semibold">
                        <span className={isVisible ? "text-foreground" : "tracking-wider text-muted-foreground"}>
                          {isVisible ? item.password : "••••••••••••"}
                        </span>
                        <button
                          onClick={(e) => toggleVisible(item.id, e)}
                          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title={isVisible ? "Sembunyikan" : "Tampilkan Sandi"}
                        >
                          {isVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                        <button
                          onClick={(e) => copyToClipboard(item.password, `pass-${item.id}`, e)}
                          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="Salin Kata Sandi"
                        >
                          {copiedKey === `pass-${item.id}` ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notes / Tags if available */}
                  {item.notes && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2 italic">
                      "{item.notes}"
                    </p>
                  )}
                </div>

                {/* Card Footer: Strength Indicator */}
                <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-medium">Kekuatan:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div
                          key={s}
                          className={`w-3.5 h-1.5 rounded-full ${
                            s <= strength.score ? strength.color : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`font-semibold ${strength.textColor}`}>{strength.label}</span>
                  </div>

                  <span className="text-muted-foreground">Diperbarui: {item.updatedAt}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Password Generator Modal */}
      {isGeneratorOpen && (
        <PasswordGeneratorModal
          onClose={() => setIsGeneratorOpen(false)}
          onUsePassword={(pwd) => {
            setIsGeneratorOpen(false);
            setEditingPassword(null);
            setIsModalOpen(true);
          }}
        />
      )}

      {/* Add / Edit Form Modal */}
      {isModalOpen && (
        <PasswordFormModal
          initialData={editingPassword}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPassword(null);
          }}
          onSave={handleSavePassword}
        />
      )}
    </div>
  );
}

function PasswordGeneratorModal({
  onClose,
  onUsePassword,
}: {
  onClose: () => void;
  onUsePassword: (pwd: string) => void;
}) {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const pwd = generateRandomPassword(length, useUpper, useLower, useNumbers, useSymbols);
    setGeneratedPassword(pwd);
  };

  useEffect(() => {
    generate();
  }, [length, useUpper, useLower, useNumbers, useSymbols]);

  const copy = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = evaluatePasswordStrength(generatedPassword);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Generator Kata Sandi Acak</h2>
            <p className="text-xs text-muted-foreground">Buat password dengan entropi tinggi dan tahan serangan brute-force.</p>
          </div>
        </div>

        {/* Display screen */}
        <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-sm sm:text-base font-bold text-foreground break-all select-all">
              {generatedPassword}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={generate}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Acak Ulang"
              >
                <RefreshCw size={16} />
              </button>
              <button
                onClick={copy}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Salin Sandi"
              >
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50">
            <span className="text-muted-foreground">Kekuatan: {strength.label}</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`w-3.5 h-1.5 rounded-full ${s <= strength.score ? strength.color : "bg-muted"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Length slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-foreground">
            <span>Panjang Karakter:</span>
            <span>{length} Karakter</span>
          </div>
          <input
            type="range"
            min={8}
            max={36}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        {/* Character options */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <label className="flex items-center gap-2 p-2.5 bg-muted/30 border border-border rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={useUpper}
              onChange={(e) => setUseUpper(e.target.checked)}
              className="rounded text-primary focus:ring-primary"
            />
            <span>Huruf Besar (A-Z)</span>
          </label>
          <label className="flex items-center gap-2 p-2.5 bg-muted/30 border border-border rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={useLower}
              onChange={(e) => setUseLower(e.target.checked)}
              className="rounded text-primary focus:ring-primary"
            />
            <span>Huruf Kecil (a-z)</span>
          </label>
          <label className="flex items-center gap-2 p-2.5 bg-muted/30 border border-border rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={(e) => setUseNumbers(e.target.checked)}
              className="rounded text-primary focus:ring-primary"
            />
            <span>Angka (0-9)</span>
          </label>
          <label className="flex items-center gap-2 p-2.5 bg-muted/30 border border-border rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={useSymbols}
              onChange={(e) => setUseSymbols(e.target.checked)}
              className="rounded text-primary focus:ring-primary"
            />
            <span>Simbol (!@#$%)</span>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => onUsePassword(generatedPassword)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
          >
            Gunakan Sandi Ini
          </button>
        </div>
      </div>
    </div>
  );
}

function PasswordFormModal({
  initialData,
  onClose,
  onSave,
}: {
  initialData: PasswordItem | null;
  onClose: () => void;
  onSave: (data: Omit<PasswordItem, "id" | "updatedAt">) => void;
}) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [category, setCategory] = useState<PasswordItem["category"]>(initialData?.category || "Finansial / Perbankan");
  const [username, setUsername] = useState(initialData?.username || "");
  const [password, setPassword] = useState(initialData?.password || "");
  const [url, setUrl] = useState(initialData?.url || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [isFavorite, setIsFavorite] = useState(initialData?.isFavorite || false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGenerate = () => {
    const gen = generateRandomPassword(16, true, true, true, true);
    setPassword(gen);
    setShowPassword(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !username.trim() || !password.trim()) {
      alert("Nama akun, username, dan password wajib diisi.");
      return;
    }

    onSave({
      title: title.trim(),
      category,
      username: username.trim(),
      password: password.trim(),
      url: url.trim(),
      notes: notes.trim(),
      isFavorite,
      tags: [category.split("/")[0].trim()],
    });
  };

  const strength = evaluatePasswordStrength(password);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-foreground mb-1">
          {initialData ? "Edit Kredensial" : "Tambah Kredensial Sandi"}
        </h2>
        <p className="text-xs text-muted-foreground mb-6">
          Simpan informasi login atau kunci API Anda secara aman di dalam brankas lokal.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Nama Layanan / Akun *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Mandiri Cash Management, AWS Production"
              className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Kategori Akun</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PasswordItem["category"])}
                className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
              >
                <option value="Finansial / Perbankan">Finansial / Perbankan</option>
                <option value="Email & Akun Kerja">Email & Akun Kerja</option>
                <option value="Server & Cloud">Server & Cloud</option>
                <option value="Media Sosial">Media Sosial</option>
                <option value="Klien & Portal">Klien & Portal</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Website / URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Username / ID / Email *</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin@perusahaan.com atau user ID"
              className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
            />
          </div>

          {/* Password with generator button */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">Kata Sandi (Password) *</label>
              <button
                type="button"
                onClick={handleGenerate}
                className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
              >
                <Sparkles size={12} className="text-amber-500" /> Generate Sandi Acak
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                className="w-full pl-3.5 pr-10 py-2 text-sm font-mono bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Strength meter bar */}
            {password && (
              <div className="pt-1.5 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div
                      key={s}
                      className={`w-4 h-1 rounded-full ${s <= strength.score ? strength.color : "bg-muted"}`}
                    />
                  ))}
                </div>
                <span className={`text-[11px] font-semibold ${strength.textColor}`}>{strength.label}</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Catatan / Kunci Pemulihan / Hint</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instruksi login, 2FA backup codes, atau catatan penting..."
              className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isFavPass"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="rounded text-primary focus:ring-primary"
            />
            <label htmlFor="isFavPass" className="text-xs font-medium text-foreground cursor-pointer">
              Sematkan ke daftar Favorit / Prioritas Atas
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-colors shadow-sm"
            >
              Simpan Kredensial
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
