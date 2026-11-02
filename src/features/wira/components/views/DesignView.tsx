import React, { useState, useEffect, useMemo } from "react";
import {
  PenTool,
  Figma,
  ExternalLink,
  Palette,
  Layers,
  Plus,
  Copy,
  Check,
  Trash2,
  Search,
  User,
} from "lucide-react";
import { cn } from "../../lib/utils";

export interface DesignProject {
  id: string;
  title: string;
  client: string;
  category: "UI/UX System" | "Mobile App" | "Web Portal" | "Brand Identity";
  figmaUrl: string;
  previewUrl: string;
  status: "Handoff" | "In Review" | "Production";
  screensCount: number;
  description: string;
  updatedAt: string;
}

const INITIAL_PROJECTS: DesignProject[] = [
  {
    id: "des-1",
    title: "Executive KPI Dashboard & Financial Portal",
    client: "Bank Mitra Niaga Syariah",
    category: "Web Portal",
    figmaUrl: "https://www.figma.com/templates/dashboard-designs/",
    previewUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
    status: "Production",
    screensCount: 24,
    description: "Desain sistem dasbor eksekutif dengan widget analitik real-time, visualisasi portofolio, dan dark-mode.",
    updatedAt: "18 Sep 2026",
  },
  {
    id: "des-2",
    title: "Mobile Banking SuperApp Redesign v3.0",
    client: "PT FinTech Nusantara",
    category: "Mobile App",
    figmaUrl: "https://www.figma.com/community",
    previewUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80",
    status: "Handoff",
    screensCount: 48,
    description: "Arsitektur navigasi baru, alur transfer 2-langkah, dan modul investasi reksadana digital.",
    updatedAt: "16 Sep 2026",
  },
  {
    id: "des-3",
    title: "Enterprise B2B Supply Chain & Tracking Portal",
    client: "PT Indo Surya Logistik",
    category: "UI/UX System",
    figmaUrl: "https://www.figma.com/templates",
    previewUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80",
    status: "In Review",
    screensCount: 32,
    description: "High-density data tables, status pipeline kontainer real-time, dan manajemen manifes armada.",
    updatedAt: "14 Sep 2026",
  },
  {
    id: "des-4",
    title: "Corporate Visual Identity & Design Guidelines",
    client: "Samudra Maritim Lines",
    category: "Brand Identity",
    figmaUrl: "https://www.figma.com",
    previewUrl: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1000&q=80",
    status: "Production",
    screensCount: 16,
    description: "Panduan safe zone logo, harmoni tipografi, warna primer dan sekunder, serta token CSS.",
    updatedAt: "10 Sep 2026",
  },
];

const BRAND_COLORS = [
  { name: "Primary 600", hex: "#2563eb", rgb: "rgb(37, 99, 235)", role: "Action & CTA Utama" },
  { name: "Primary 500", hex: "#3b82f6", rgb: "rgb(59, 130, 246)", role: "Hover & Highlight" },
  { name: "Accent Indigo", hex: "#6366f1", rgb: "rgb(99, 102, 241)", role: "Secondary Accents" },
  { name: "Emerald 500", hex: "#10b981", rgb: "rgb(16, 185, 129)", role: "Status Success / Laba" },
  { name: "Amber 500", hex: "#f59e0b", rgb: "rgb(245, 158, 11)", role: "Warning / In Review" },
  { name: "Rose 500", hex: "#f43f5e", rgb: "rgb(244, 63, 94)", role: "Critical / Churn Risk" },
  { name: "Slate 900", hex: "#0f172a", rgb: "rgb(15, 23, 42)", role: "Surface Dark / Text" },
  { name: "Slate 100", hex: "#f1f5f9", rgb: "rgb(241, 245, 249)", role: "Background Neutral" },
];

export function DesignView() {
  const [projects, setProjects] = useState<DesignProject[]>(() => {
    try {
      const saved = localStorage.getItem("aio_design_projects_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_PROJECTS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [previewProject, setPreviewProject] = useState<DesignProject | null>(null);

  // New project state
  const [newProject, setNewProject] = useState({
    title: "",
    client: "",
    category: "Web Portal" as DesignProject["category"],
    figmaUrl: "https://www.figma.com",
    previewUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
    screensCount: 12,
    description: "",
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("aio_design_projects_v1", JSON.stringify(projects));
    } catch (e) {
      console.error("Failed to save design projects", e);
    }
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        p.title.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      const matchCat = selectedCategory === "Semua" || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [projects, searchQuery, selectedCategory]);

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2500);
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm("Hapus proyek desain ini?")) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (previewProject?.id === id) setPreviewProject(null);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim()) {
      alert("Mohon masukkan judul proyek desain.");
      return;
    }

    const now = new Date();
    const formatted = `${now.getDate()} ${now.toLocaleString("id-ID", { month: "short" })} ${now.getFullYear()}`;

    const project: DesignProject = {
      id: `des-${Date.now()}`,
      title: newProject.title,
      client: newProject.client || "Klien Konsultansi",
      category: newProject.category,
      figmaUrl: newProject.figmaUrl,
      previewUrl: newProject.previewUrl,
      status: "In Review",
      screensCount: Number(newProject.screensCount) || 12,
      description: newProject.description || "Dokumentasi dan aset visual desain antarmuka.",
      updatedAt: formatted,
    };

    setProjects([project, ...projects]);
    setShowNewModal(false);
    setNewProject({
      title: "",
      client: "",
      category: "Web Portal",
      figmaUrl: "https://www.figma.com",
      previewUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
      screensCount: 12,
      description: "",
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full flex flex-col space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-pink-500/10 text-pink-600 rounded-xl">
              <PenTool size={22} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Design Hub & UI Systems</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Pusat manajemen artefak desain UI/UX, prototipe Figma, token warna, tipografi, dan panduan identitas visual klien.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-medium hover:bg-pink-700 transition-colors shadow-md shadow-pink-600/20"
          >
            <Plus size={16} />
            <span>Proyek Desain Baru</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Proyek Desain Aktif</span>
          <p className="text-2xl font-bold text-foreground mt-1">{projects.length}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-pink-600 dark:text-pink-400 font-medium">Total Layar UI</span>
          <p className="text-2xl font-bold text-foreground mt-1">
            {projects.reduce((acc, p) => acc + p.screensCount, 0)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Token Warna Baku</span>
          <p className="text-2xl font-bold text-foreground mt-1">{BRAND_COLORS.length}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Status Handoff/Prod</span>
          <p className="text-2xl font-bold text-foreground mt-1">
            {projects.filter((p) => p.status === "Production" || p.status === "Handoff").length}
          </p>
        </div>
      </div>

      {/* Interactive Color System Swatches */}
      <section className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-pink-600" />
            <h2 className="text-base sm:text-lg font-bold text-foreground">Palet Warna Sistem (Design Tokens)</h2>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Klik swatch warna untuk menyalin kode HEX langsung
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {BRAND_COLORS.map((c) => (
            <div
              key={c.hex}
              onClick={() => handleCopyColor(c.hex)}
              className="group p-2.5 rounded-xl border border-border hover:border-pink-500/50 bg-muted/20 hover:bg-card cursor-pointer transition-all flex flex-col"
            >
              <div
                className="w-full h-14 rounded-lg mb-2 shadow-xs transition-transform group-hover:scale-102 flex items-center justify-center text-white"
                style={{ backgroundColor: c.hex }}
              >
                {copiedHex === c.hex && <Check size={18} className="drop-shadow-md text-white" />}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-semibold text-foreground text-[11px]">{c.hex}</span>
                {copiedHex === c.hex ? (
                  <span className="text-[10px] text-emerald-500 font-bold">Tersalin</span>
                ) : (
                  <Copy size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              <span className="text-[10px] text-muted-foreground mt-0.5 truncate">{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari proyek desain, nama klien, atau wireframe..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-card border border-border text-foreground outline-hidden focus:border-pink-500 placeholder:text-muted-foreground"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["Semua", "Web Portal", "Mobile App", "UI/UX System", "Brand Identity"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap border",
                selectedCategory === cat
                  ? "bg-pink-600 text-white border-pink-600 shadow-xs"
                  : "bg-card text-muted-foreground border-border hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Showcase Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-border rounded-2xl bg-card">
          <Layers size={36} className="text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-sm font-semibold text-foreground">Proyek desain tidak ditemukan</p>
          <p className="text-xs text-muted-foreground mt-1">Coba sesuaikan filter atau tambahkan proyek baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setPreviewProject(project)}
              className="group bg-card border border-border hover:border-pink-500/50 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              {/* Preview Image with Banner */}
              <div className="relative aspect-16/9 w-full bg-muted overflow-hidden">
                <img
                  src={project.previewUrl}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-black/70 text-white backdrop-blur-md">
                    {project.category}
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-bold backdrop-blur-md",
                      project.status === "Production"
                        ? "bg-emerald-500/80 text-white"
                        : project.status === "Handoff"
                        ? "bg-blue-500/80 text-white"
                        : "bg-amber-500/80 text-white"
                    )}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-black/70 text-white backdrop-blur-md">
                    {project.screensCount} Layar
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-base text-foreground group-hover:text-pink-600 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <User size={12} />
                    <span>{project.client}</span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2.5 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Footer and Quick Links */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/50 text-xs">
                  <span className="text-[11px] text-muted-foreground">Diperbarui: {project.updatedAt}</span>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={project.figmaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                      title="Buka File Figma"
                    >
                      <Figma size={14} />
                      <span>Figma</span>
                      <ExternalLink size={11} />
                    </a>

                    <button
                      onClick={(e) => handleDelete(project.id, e)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Hapus Proyek"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Figma Embed / Live Showcase Section */}
      <section className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Figma className="w-5 h-5 text-orange-500" />
            <h2 className="text-base sm:text-lg font-bold text-foreground">Figma Live Design Community Showcase</h2>
          </div>
          <a
            href="https://www.figma.com/templates/dashboard-designs/"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            <span>Buka Template Figma</span>
            <ExternalLink size={12} />
          </a>
        </div>

        <div className="w-full rounded-xl overflow-hidden border border-border bg-muted/20 h-[380px]">
          <iframe
            style={{ border: "none" }}
            width="100%"
            height="100%"
            src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ftemplates%2Fdashboard-designs%2F"
            allowFullScreen
            title="Figma Dashboard Designs Preview"
          ></iframe>
        </div>
      </section>

      {/* New Project Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <PenTool size={20} className="text-pink-600" />
                <h3 className="text-lg font-bold text-foreground">Tambah Proyek Desain Baru</h3>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-medium"
              >
                Tutup ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Nama Proyek Desain *
                </label>
                <input
                  type="text"
                  required
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="misal: Redesign Aplikasi Web Logistik"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Nama Klien
                  </label>
                  <input
                    type="text"
                    value={newProject.client}
                    onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                    placeholder="misal: PT Petro Industri"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Kategori Desain *
                  </label>
                  <select
                    value={newProject.category}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        category: e.target.value as DesignProject["category"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-pink-500"
                  >
                    <option value="Web Portal">Web Portal</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="UI/UX System">UI/UX System</option>
                    <option value="Brand Identity">Brand Identity</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  URL File Figma / Prototipe
                </label>
                <input
                  type="url"
                  value={newProject.figmaUrl}
                  onChange={(e) => setNewProject({ ...newProject, figmaUrl: e.target.value })}
                  placeholder="https://www.figma.com/file/..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-pink-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    URL Gambar Mockup Preview
                  </label>
                  <input
                    type="url"
                    value={newProject.previewUrl}
                    onChange={(e) => setNewProject({ ...newProject, previewUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-pink-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Jumlah Layar (Screens)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newProject.screensCount}
                    onChange={(e) => setNewProject({ ...newProject, screensCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Deskripsi Proyek
                </label>
                <textarea
                  rows={3}
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Penjelasan deliverable dan cakupan desain antarmuka..."
                  className="w-full p-2.5 text-xs rounded-xl bg-muted/40 border border-border text-foreground outline-hidden focus:border-pink-500 leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-border hover:bg-muted text-foreground"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-pink-600 text-white hover:bg-pink-700 shadow-md shadow-pink-600/20"
                >
                  Simpan Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
