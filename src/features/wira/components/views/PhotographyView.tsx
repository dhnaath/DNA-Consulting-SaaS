import React, { useState, useEffect, useMemo } from "react";
import {
  Camera,
  Plus,
  Search,
  Download,
  Copy,
  Check,
  Trash2,
  Maximize2,
  X,
  User,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "../../lib/utils";

export interface PhotoAsset {
  id: string;
  title: string;
  client: string;
  album: "Site Visit" | "Corporate" | "Retail" | "Event" | "Arsitektur";
  url: string;
  date: string;
  location: string;
  photographer: string;
  resolution: string;
  tags: string[];
}

const INITIAL_PHOTOS: PhotoAsset[] = [
  {
    id: "photo-1",
    title: "Inspeksi Pabrik Manufaktur & Jalur Logistik",
    client: "PT Indo Surya Logistik",
    album: "Site Visit",
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    date: "18 Sep 2026",
    location: "Kawasan Industri Gresik, Jawa Timur",
    photographer: "Bima Santoso (Lead Auditor)",
    resolution: "4200 × 2800 (Full HD)",
    tags: ["Manufaktur", "Audit", "Pabrik", "IoT"],
  },
  {
    id: "photo-2",
    title: "Diskusi Strategis Dewan Direksi & Komite Audit",
    client: "Bank Mitra Niaga Syariah",
    album: "Corporate",
    url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80",
    date: "15 Sep 2026",
    location: "Sudirman Central Business District, Jakarta",
    photographer: "Studio Citra Prima",
    resolution: "5120 × 3413 (4K Ultra)",
    tags: ["Boardroom", "Executive", "Rapat", "Governance"],
  },
  {
    id: "photo-3",
    title: "Audit Tata Letak & Customer Journey Gerai Flagship",
    client: "Retail Nusantara Mandiri",
    album: "Retail",
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    date: "12 Sep 2026",
    location: "Grand Indonesia Mall, Jakarta Pusat",
    photographer: "Rian Hidayat",
    resolution: "3840 × 2560 (4K)",
    tags: ["Retail", "Store Design", "Point of Sale", "Visual"],
  },
  {
    id: "photo-4",
    title: "Dokumentasi Townhall & Peluncuran Inisiatif Digital",
    client: "Samudra Maritim Lines",
    album: "Event",
    url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    date: "10 Sep 2026",
    location: "Grand Ballroom Hotel Indonesia Kempinski",
    photographer: "Media All in One Advisory",
    resolution: "4500 × 3000",
    tags: ["Townhall", "Keynote", "Culture", "Digital Launch"],
  },
  {
    id: "photo-5",
    title: "Survei Arsitektur Gedung Ramah Lingkungan (Green Building)",
    client: "Eco Property Landcorp",
    album: "Arsitektur",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    date: "05 Sep 2026",
    location: "Kuningan Smart District, Jakarta Selatan",
    photographer: "ArchiLens Drone Team",
    resolution: "6000 × 4000 (RAW Ultra)",
    tags: ["Arsitektur", "Facade", "ESG", "Sustainability"],
  },
  {
    id: "photo-6",
    title: "Sesi Kolaborasi Desain & Testing Prototipe UX",
    client: "Fintech Maju Sejahtera",
    album: "Corporate",
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    date: "01 Sep 2026",
    location: "All in One Advisory Innovation Lab",
    photographer: "Dewi Lestari",
    resolution: "4000 × 2667",
    tags: ["Workshop", "UX Lab", "Agile", "Teamwork"],
  },
];

export function PhotographyView() {
  const [photos, setPhotos] = useState<PhotoAsset[]>(() => {
    try {
      const saved = localStorage.getItem("aio_photography_assets_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_PHOTOS;
  });

  const [activePhoto, setActivePhoto] = useState<PhotoAsset | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState<string>("Semua");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New photo form
  const [newPhoto, setNewPhoto] = useState<{
    title: string;
    client: string;
    album: PhotoAsset["album"];
    url: string;
    location: string;
    tags: string;
  }>({
    title: "",
    client: "",
    album: "Site Visit",
    url: "",
    location: "",
    tags: "",
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("aio_photography_assets_v1", JSON.stringify(photos));
    } catch (e) {
      console.error("Failed to save photos", e);
    }
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    return photos.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        p.title.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      const matchAlbum = selectedAlbum === "Semua" || p.album === selectedAlbum;
      return matchSearch && matchAlbum;
    });
  }, [photos, searchQuery, selectedAlbum]);

  const stats = useMemo(() => {
    return {
      total: photos.length,
      siteVisits: photos.filter((p) => p.album === "Site Visit").length,
      corporate: photos.filter((p) => p.album === "Corporate").length,
      retail: photos.filter((p) => p.album === "Retail").length,
    };
  }, [photos]);

  const handleCopyUrl = (url: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm("Hapus foto aset ini dari galeri?")) {
      const updated = photos.filter((p) => p.id !== id);
      setPhotos(updated);
      if (activePhoto?.id === id) {
        setActivePhoto(null);
      }
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.title.trim() || !newPhoto.url.trim()) {
      alert("Mohon masukkan judul dan tautan URL foto.");
      return;
    }

    const now = new Date();
    const formatted = `${now.getDate()} ${now.toLocaleString("id-ID", { month: "short" })} ${now.getFullYear()}`;

    const tagsArray = newPhoto.tags
      ? newPhoto.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : ["Dokumentasi", "Klien"];

    const asset: PhotoAsset = {
      id: `photo-${Date.now()}`,
      title: newPhoto.title,
      client: newPhoto.client || "Klien Konsultansi Umum",
      album: newPhoto.album,
      url: newPhoto.url,
      date: formatted,
      location: newPhoto.location || "Jakarta, Indonesia",
      photographer: "Tim Advisory Internal",
      resolution: "3840 × 2160 (Ultra HD)",
      tags: tagsArray,
    };

    setPhotos([asset, ...photos]);
    setShowUploadModal(false);
    setNewPhoto({
      title: "",
      client: "",
      album: "Site Visit",
      url: "",
      location: "",
      tags: "",
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full flex flex-col space-y-7">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <Camera size={22} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Photography & Visual Assets</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Arsip dokumentasi visual proyek konsultansi: kunjungan lapangan (site visit), audit fasilitas, foto direksi, dan visual ritel.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-medium hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
          >
            <Plus size={16} />
            <span>Upload Foto Baru</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Total Aset Foto</span>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Kunjungan Lapangan</span>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.siteVisits}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Corporate & Rapat</span>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.corporate}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Audit Ritel & Toko</span>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.retail}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari lokasi, nama klien, atau tag foto..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-card border border-border text-foreground outline-hidden focus:border-emerald-500 placeholder:text-muted-foreground"
          />
        </div>

        {/* Album Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["Semua", "Site Visit", "Corporate", "Retail", "Event", "Arsitektur"].map((album) => (
            <button
              key={album}
              onClick={() => setSelectedAlbum(album)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap border",
                selectedAlbum === album
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                  : "bg-card text-muted-foreground border-border hover:text-foreground"
              )}
            >
              {album}
            </button>
          ))}
        </div>
      </div>

      {/* Photos Masonry / Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-2xl bg-card text-center">
          <ImageIcon size={36} className="text-muted-foreground/50 mb-3" />
          <h4 className="font-semibold text-foreground text-sm sm:text-base">Foto tidak ditemukan</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Coba sesuaikan kata kunci pencarian atau unggah dokumentasi foto baru.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="group bg-card border border-border hover:border-emerald-500/50 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              {/* Photo Preview with Aspect Ratio */}
              <div className="relative aspect-16/10 w-full bg-muted overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3.5">
                  <span className="text-white text-xs font-medium flex items-center gap-1.5">
                    <Maximize2 size={13} />
                    <span>Lihat Detail</span>
                  </span>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleCopyUrl(photo.url, photo.id, e)}
                      title="Salin URL Foto"
                      className="p-1.5 rounded-lg bg-black/60 hover:bg-black text-white text-xs backdrop-blur-xs transition-colors"
                    >
                      {copiedId === photo.id ? (
                        <Check size={14} className="text-emerald-400" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                    <button
                      onClick={(e) => handleDelete(photo.id, e)}
                      title="Hapus Foto"
                      className="p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white text-xs backdrop-blur-xs transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-black/60 text-white backdrop-blur-md">
                    {photo.album}
                  </span>
                </div>
              </div>

              {/* Photo Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-foreground group-hover:text-emerald-600 transition-colors line-clamp-1">
                    {photo.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <User size={12} />
                    <span className="line-clamp-1">{photo.client}</span>
                  </div>

                  <p className="text-[11px] text-muted-foreground/80 mt-1.5 line-clamp-1">
                    📍 {photo.location}
                  </p>
                </div>

                {/* Tags and Date */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/50 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {photo.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-muted text-[10px]">
                        #{tag}
                      </span>
                    ))}
                    {photo.tags.length > 2 && (
                      <span className="text-[10px] text-muted-foreground">+{photo.tags.length - 2}</span>
                    )}
                  </div>
                  <span>{photo.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Detail Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="bg-card border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                  {activePhoto.album}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-foreground line-clamp-1">
                  {activePhoto.title}
                </h3>
              </div>
              <button
                onClick={() => setActivePhoto(null)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Image Display */}
            <div className="bg-black/90 flex items-center justify-center overflow-hidden max-h-[55vh]">
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                referrerPolicy="no-referrer"
                className="max-h-[55vh] w-auto object-contain"
              />
            </div>

            {/* Modal Info & Actions */}
            <div className="p-4 sm:p-5 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                  <span>Klien: {activePhoto.client}</span>
                  <span>•</span>
                  <span>Fotografer: {activePhoto.photographer}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>📍 {activePhoto.location}</span>
                  <span>•</span>
                  <span>Resolusi: {activePhoto.resolution}</span>
                  <span>•</span>
                  <span>{activePhoto.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopyUrl(activePhoto.url, activePhoto.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-medium text-foreground transition-colors"
                >
                  {copiedId === activePhoto.id ? (
                    <>
                      <Check size={14} className="text-emerald-500" />
                      <span className="text-emerald-600 font-semibold">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Salin URL</span>
                    </>
                  )}
                </button>

                <a
                  href={activePhoto.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  <Download size={14} />
                  <span>Buka Foto Asli</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Camera size={20} className="text-emerald-600" />
                <h3 className="text-lg font-bold text-foreground">Upload Dokumentasi Foto</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-medium"
              >
                Tutup ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Judul Foto / Kegiatan *
                </label>
                <input
                  type="text"
                  required
                  value={newPhoto.title}
                  onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                  placeholder="misal: Verifikasi Fasilitas Gudang Dingin"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Nama Klien / Proyek
                  </label>
                  <input
                    type="text"
                    value={newPhoto.client}
                    onChange={(e) => setNewPhoto({ ...newPhoto, client: e.target.value })}
                    placeholder="misal: PT Agro Maritim Prima"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Album Kategori *
                  </label>
                  <select
                    value={newPhoto.album}
                    onChange={(e) =>
                      setNewPhoto({
                        ...newPhoto,
                        album: e.target.value as PhotoAsset["album"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-emerald-500"
                  >
                    <option value="Site Visit">Site Visit</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Retail">Retail</option>
                    <option value="Event">Event</option>
                    <option value="Arsitektur">Arsitektur</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Tautan URL Foto (Direct Link / Unsplash) *
                </label>
                <input
                  type="url"
                  required
                  value={newPhoto.url}
                  onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Lokasi Pengambilan
                  </label>
                  <input
                    type="text"
                    value={newPhoto.location}
                    onChange={(e) => setNewPhoto({ ...newPhoto, location: e.target.value })}
                    placeholder="misal: Pelabuhan Tanjung Priok"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Tagar (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={newPhoto.tags}
                    onChange={(e) => setNewPhoto({ ...newPhoto, tags: e.target.value })}
                    placeholder="Audit, Cold Storage, Logistik"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-border hover:bg-muted text-foreground"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                >
                  Simpan ke Galeri
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
