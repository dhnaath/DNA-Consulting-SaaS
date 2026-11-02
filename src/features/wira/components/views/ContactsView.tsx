import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Building2,
  Briefcase,
  Star,
  Trash2,
  Edit3,
  Copy,
  Check,
  Download,
  Upload,
  LayoutGrid,
  List,
  X,
  ExternalLink,
  MessageCircle,
  UserCheck,
} from "lucide-react";

export type ContactItem = {
  id: string;
  name: string;
  title?: string;
  company?: string;
  category: "Klien" | "Prospek" | "Partner" | "Vendor" | "Investor" | "Pribadi";
  labels: string[];
  email: string;
  phone: string;
  whatsapp?: string;
  website?: string;
  address?: string;
  notes?: string;
  isFavorite: boolean;
  createdAt: string;
  avatarColor: string;
};

const CATEGORIES = ["Semua", "Klien", "Prospek", "Partner", "Vendor", "Investor", "Pribadi"] as const;
const PRESET_LABELS = ["VIP", "Prioritas", "Hangat (Warm)", "Dingin (Cold)", "Follow-up", "Aktif", "Mitra Strategis"];

const AVATAR_COLORS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-purple-500 to-violet-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-blue-600",
];

const INITIAL_CONTACTS: ContactItem[] = [
  {
    id: "cnt-1",
    name: "Bambang Prasetyo, S.E.",
    title: "Direktur Utama",
    company: "PT Digital Sinergi Nusantara",
    category: "Klien",
    labels: ["VIP", "Aktif", "Mitra Strategis"],
    email: "bambang.prasetyo@digitalsinergi.co.id",
    phone: "+62 812-3456-7890",
    whatsapp: "6281234567890",
    website: "https://digitalsinergi.co.id",
    address: "Sudirman Central Business District (SCBD), Jakarta Selatan",
    notes: "Klien retainer tahunan untuk transformasi ERP dan arsitektur data. Diskusi evaluasi kuartalan setiap awal bulan.",
    isFavorite: true,
    createdAt: "2026-01-15T09:00:00.000Z",
    avatarColor: "from-blue-500 to-indigo-600",
  },
  {
    id: "cnt-2",
    name: "Dr. Nadia Kartika",
    title: "Head of Strategy & Investment",
    company: "Ventura Nusantara Capital",
    category: "Investor",
    labels: ["VIP", "Hangat (Warm)"],
    email: "nadia.kartika@venturacap.id",
    phone: "+62 811-9876-5432",
    whatsapp: "6281198765432",
    website: "https://venturacap.id",
    address: "Mega Kuningan Barat, Kav. E4, Jakarta",
    notes: "Tertarik pada diversifikasi portofolio komoditas logistik dan SaaS muamalah syariah.",
    isFavorite: true,
    createdAt: "2026-02-10T14:30:00.000Z",
    avatarColor: "from-purple-500 to-violet-600",
  },
  {
    id: "cnt-3",
    name: "Ir. Hendra Gunawan",
    title: "Chief Procurement Officer",
    company: "PT Global Agro Mandiri",
    category: "Vendor",
    labels: ["Prioritas", "Mitra Strategis"],
    email: "hendra.gunawan@globalagro.com",
    phone: "+62 813-8822-1199",
    whatsapp: "6281388221199",
    website: "https://globalagro.com",
    address: "Kawasan Industri MM2100, Cikarang Barat, Bekasi",
    notes: "Penyedia pasokan komoditas kopi dan rempah kualitas ekspor grade A. Pembayaran tempo 30 hari.",
    isFavorite: false,
    createdAt: "2026-03-01T11:15:00.000Z",
    avatarColor: "from-emerald-500 to-teal-600",
  },
  {
    id: "cnt-4",
    name: "Sarah Wijaya",
    title: "Founder & Creative Lead",
    company: "Studio Aksara Visual",
    category: "Partner",
    labels: ["Follow-up", "Aktif"],
    email: "sarah@aksaravisual.design",
    phone: "+62 819-0123-4567",
    whatsapp: "6281901234567",
    website: "https://aksaravisual.design",
    address: "Jalan Dago Atas No. 88, Bandung",
    notes: "Partner desain visual korporat dan branding katalog produk klien.",
    isFavorite: false,
    createdAt: "2026-03-08T16:00:00.000Z",
    avatarColor: "from-rose-500 to-pink-600",
  },
  {
    id: "cnt-5",
    name: "Rian Fadhillah",
    title: "VP Operations",
    company: "Logistik Cepat Bersama",
    category: "Prospek",
    labels: ["Hangat (Warm)", "Follow-up"],
    email: "rian.fadhil@logistikcepat.id",
    phone: "+62 856-7890-1234",
    whatsapp: "6285678901234",
    website: "https://logistikcepat.id",
    address: "Tanjung Priok Logistics Center, Jakarta Utara",
    notes: "Meminta proposal implementasi kalkulator tarif dan sistem incoterms freight.",
    isFavorite: false,
    createdAt: "2026-03-12T10:45:00.000Z",
    avatarColor: "from-amber-500 to-orange-600",
  },
];

const STORAGE_KEY = "wira_contacts_database_v2";

export function ContactsView() {
  const [contacts, setContacts] = useState<ContactItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_CONTACTS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [selectedLabel, setSelectedLabel] = useState<string>("Semua");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactItem | null>(null);
  const [detailContact, setDetailContact] = useState<ContactItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    } catch {
      // ignore
    }
  }, [contacts]);

  // Filtered contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter((item) => {
      if (onlyFavorites && !item.isFavorite) return false;
      if (selectedCategory !== "Semua" && item.category !== selectedCategory) return false;
      if (selectedLabel !== "Semua" && !item.labels.includes(selectedLabel)) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        (item.company && item.company.toLowerCase().includes(q)) ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        item.email.toLowerCase().includes(q) ||
        item.phone.includes(q) ||
        (item.address && item.address.toLowerCase().includes(q)) ||
        item.labels.some((l) => l.toLowerCase().includes(q)) ||
        (item.notes && item.notes.toLowerCase().includes(q))
      );
    });
  }, [contacts, searchQuery, selectedCategory, selectedLabel, onlyFavorites]);

  // Statistics
  const stats = useMemo(() => {
    const total = contacts.length;
    const klien = contacts.filter((c) => c.category === "Klien").length;
    const prospek = contacts.filter((c) => c.category === "Prospek").length;
    const partner = contacts.filter((c) => c.category === "Partner").length;
    const favorites = contacts.filter((c) => c.isFavorite).length;
    return { total, klien, prospek, partner, favorites };
  }, [contacts]);

  const handleSaveContact = (contactData: Omit<ContactItem, "id" | "createdAt" | "avatarColor">) => {
    if (editingContact) {
      setContacts((prev) =>
        prev.map((c) => (c.id === editingContact.id ? { ...c, ...contactData } : c))
      );
    } else {
      const newContact: ContactItem = {
        ...contactData,
        id: `cnt-${Date.now()}`,
        createdAt: new Date().toISOString(),
        avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      };
      setContacts((prev) => [newContact, ...prev]);
    }
    setIsFormModalOpen(false);
    setEditingContact(null);
  };

  const handleDeleteContact = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kontak ini?")) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (detailContact?.id === id) setDetailContact(null);
    }
  };

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  };

  const copyToClipboard = (text: string, id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportContactsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(contacts, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `kontak_crm_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importContactsJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          setContacts(parsed);
          alert(`Berhasil mengimpor ${parsed.length} kontak!`);
        }
      } catch {
        alert("Format file tidak valid.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Kontak & Personal CRM
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {contacts.length} Entri
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Buku relasi profesional, manajemen klien, prospek bisnis, dan integrasi komunikasi langsung.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-border bg-card hover:bg-muted/50 text-foreground transition-colors shadow-sm">
            <Upload size={14} />
            <span>Impor</span>
            <input type="file" accept=".json" onChange={importContactsJSON} className="hidden" />
          </label>

          <button
            onClick={exportContactsJSON}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-border bg-card hover:bg-muted/50 text-foreground transition-colors shadow-sm"
          >
            <Download size={14} />
            <span>Ekspor</span>
          </button>

          <button
            onClick={() => {
              setEditingContact(null);
              setIsFormModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-md shadow-primary/20"
          >
            <Plus size={16} />
            <span>Tambah Kontak</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-card border border-border p-3.5 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Kontak</p>
            <p className="text-lg font-bold text-foreground">{stats.total}</p>
          </div>
        </div>

        <div className="bg-card border border-border p-3.5 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <UserCheck size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Klien Aktif</p>
            <p className="text-lg font-bold text-foreground">{stats.klien}</p>
          </div>
        </div>

        <div className="bg-card border border-border p-3.5 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Briefcase size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Prospek Bisnis</p>
            <p className="text-lg font-bold text-foreground">{stats.prospek}</p>
          </div>
        </div>

        <div className="bg-card border border-border p-3.5 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Mitra & Partner</p>
            <p className="text-lg font-bold text-foreground">{stats.partner}</p>
          </div>
        </div>

        <div className="bg-card border border-border p-3.5 rounded-2xl shadow-sm flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <Star size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Favorit / VIP</p>
            <p className="text-lg font-bold text-foreground">{stats.favorites}</p>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filter Tabs & View Toggle */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, perusahaan, email, nomor HP, kota, atau label..."
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyFavorites((prev) => !prev)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                onlyFavorites
                  ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                  : "bg-background text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              <Star size={14} className={onlyFavorites ? "fill-white" : ""} />
              <span>Favorit Saja</span>
            </button>

            <div className="flex items-center border border-border rounded-xl p-0.5 bg-background">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
                title="Tampilan Grid"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "table" ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
                title="Tampilan Tabel"
              >
                <List size={16} />
              </button>
            </div>
          </div>
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

      {/* Main Content List / Grid */}
      {filteredContacts.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-3xl p-12 text-center bg-card/40 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
            <Users size={28} />
          </div>
          <h3 className="text-lg font-bold text-foreground">Tidak Ada Kontak Ditemukan</h3>
          <p className="text-sm text-muted-foreground max-w-md mt-1 mb-6">
            {searchQuery || selectedCategory !== "Semua" || onlyFavorites
              ? "Coba ubah kata kunci pencarian atau sesuaikan filter kategori Anda."
              : "Mulai bangun buku relasi Anda dengan menambahkan kontak pertama."}
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Semua");
              setOnlyFavorites(false);
              setEditingContact(null);
              setIsFormModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-sm"
          >
            Tambah Kontak Baru
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => {
            const cleanPhone = (contact.whatsapp || contact.phone).replace(/\D/g, "");
            return (
              <div
                key={contact.id}
                onClick={() => setDetailContact(contact)}
                className="bg-card border border-border hover:border-primary/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${contact.avatarColor} text-white font-bold text-base flex items-center justify-center shadow-sm shrink-0`}
                      >
                        {getInitials(contact.name)}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors">
                          {contact.name}
                        </h3>
                        {contact.title && (
                          <p className="text-xs text-muted-foreground font-medium line-clamp-1">
                            {contact.title} {contact.company ? `• ${contact.company}` : ""}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => toggleFavorite(contact.id, e)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-500 hover:bg-muted transition-colors shrink-0"
                      title={contact.isFavorite ? "Hapus dari favorit" : "Tandai favorit"}
                    >
                      <Star
                        size={16}
                        className={contact.isFavorite ? "fill-amber-400 text-amber-400" : ""}
                      />
                    </button>
                  </div>

                  {/* Category & Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-muted text-foreground border border-border">
                      {contact.category}
                    </span>
                    {contact.labels.map((lbl) => (
                      <span
                        key={lbl}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                      >
                        {lbl}
                      </span>
                    ))}
                  </div>

                  {/* Contact Info Lines */}
                  <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="shrink-0 text-muted-foreground/80" />
                      <span className="truncate">{contact.phone}</span>
                    </div>
                    {contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={13} className="shrink-0 text-muted-foreground/80" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                    )}
                    {contact.address && (
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="shrink-0 text-muted-foreground/80" />
                        <span className="truncate">{contact.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Action Bar */}
                <div
                  className="pt-3 border-t border-border flex items-center justify-between gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1.5">
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors"
                        title="Chat WhatsApp"
                      >
                        <MessageCircle size={15} />
                      </a>
                    )}
                    <a
                      href={`tel:${contact.phone}`}
                      className="p-2 rounded-xl bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white transition-colors"
                      title="Panggilan Telepon"
                    >
                      <Phone size={15} />
                    </a>
                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        className="p-2 rounded-xl bg-purple-500/10 text-purple-600 hover:bg-purple-500 hover:text-white transition-colors"
                        title="Kirim Email"
                      >
                        <Mail size={15} />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => copyToClipboard(`${contact.name} - ${contact.phone} (${contact.email})`, contact.id, e)}
                      className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Salin Info Kontak"
                    >
                      {copiedId === contact.id ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingContact(contact);
                        setIsFormModalOpen(true);
                      }}
                      className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                      title="Edit Kontak"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteContact(contact.id);
                      }}
                      className="p-2 rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Hapus Kontak"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table Mode */
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs font-semibold uppercase border-b border-border">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">Fav</th>
                  <th className="py-3.5 px-4">Nama Lengkap</th>
                  <th className="py-3.5 px-4">Kategori & Label</th>
                  <th className="py-3.5 px-4">Kontak (Telepon / Email)</th>
                  <th className="py-3.5 px-4">Perusahaan / Lokasi</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    onClick={() => setDetailContact(contact)}
                    className="hover:bg-muted/30 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 text-center" onClick={(e) => toggleFavorite(contact.id, e)}>
                      <Star
                        size={16}
                        className={`mx-auto ${
                          contact.isFavorite ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40 hover:text-amber-400"
                        }`}
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl bg-gradient-to-br ${contact.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                        >
                          {getInitials(contact.name)}
                        </div>
                        <div>
                          <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {contact.name}
                          </p>
                          {contact.title && <p className="text-xs text-muted-foreground">{contact.title}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-foreground border border-border">
                          {contact.category}
                        </span>
                        {contact.labels.slice(0, 2).map((l) => (
                          <span key={l} className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            {l}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 text-xs">
                        <p className="font-medium text-foreground">{contact.phone}</p>
                        <p className="text-muted-foreground">{contact.email}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 text-xs">
                        <p className="font-medium text-foreground">{contact.company || "—"}</p>
                        <p className="text-muted-foreground truncate max-w-[180px]">{contact.address || "—"}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingContact(contact);
                            setIsFormModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted"
                          title="Edit"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteContact(contact.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Hapus"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailContact && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setDetailContact(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-4 pr-10">
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${detailContact.avatarColor} text-white font-bold text-xl flex items-center justify-center shadow-md shrink-0`}
              >
                {getInitials(detailContact.name)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">{detailContact.name}</h2>
                  <button
                    onClick={() => toggleFavorite(detailContact.id)}
                    className="text-muted-foreground hover:text-amber-500"
                  >
                    <Star
                      size={18}
                      className={detailContact.isFavorite ? "fill-amber-400 text-amber-400" : ""}
                    />
                  </button>
                </div>
                {detailContact.title && (
                  <p className="text-sm font-medium text-muted-foreground">{detailContact.title}</p>
                )}
                {detailContact.company && (
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Building2 size={12} /> {detailContact.company}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary text-primary-foreground">
                {detailContact.category}
              </span>
              {detailContact.labels.map((lbl) => (
                <span
                  key={lbl}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-muted text-foreground border border-border"
                >
                  {lbl}
                </span>
              ))}
            </div>

            {/* Action Bar */}
            <div className="grid grid-cols-3 gap-2">
              <a
                href={`https://wa.me/${(detailContact.whatsapp || detailContact.phone).replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
              <a
                href={`tel:${detailContact.phone}`}
                className="py-2 px-3 rounded-xl bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone size={15} /> Telepon
              </a>
              <a
                href={`mailto:${detailContact.email}`}
                className="py-2 px-3 rounded-xl bg-purple-500/10 text-purple-600 hover:bg-purple-500 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Mail size={15} /> Email
              </a>
            </div>

            {/* Information Grid */}
            <div className="space-y-3 bg-muted/40 p-4 rounded-2xl border border-border text-xs">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Nomor Telepon:</span>
                <span className="font-semibold text-foreground">{detailContact.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Alamat Email:</span>
                <span className="font-semibold text-foreground">{detailContact.email || "—"}</span>
              </div>
              {detailContact.website && (
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Website:</span>
                  <a
                    href={detailContact.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    {detailContact.website} <ExternalLink size={11} />
                  </a>
                </div>
              )}
              {detailContact.address && (
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Alamat Kantor / Domisili:</span>
                  <span className="font-semibold text-foreground text-right max-w-[220px]">
                    {detailContact.address}
                  </span>
                </div>
              )}
            </div>

            {/* Notes Section */}
            {detailContact.notes && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Catatan Relasi & Histori
                </h4>
                <div className="p-3 bg-card border border-border rounded-xl text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                  {detailContact.notes}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                onClick={() => {
                  setEditingContact(detailContact);
                  setDetailContact(null);
                  setIsFormModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors"
              >
                Edit Data
              </button>
              <button
                onClick={() => setDetailContact(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {isFormModalOpen && (
        <ContactFormModal
          initialData={editingContact}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingContact(null);
          }}
          onSave={handleSaveContact}
        />
      )}
    </div>
  );
}

function ContactFormModal({
  initialData,
  onClose,
  onSave,
}: {
  initialData: ContactItem | null;
  onClose: () => void;
  onSave: (contact: Omit<ContactItem, "id" | "createdAt" | "avatarColor">) => void;
}) {
  const [name, setName] = useState(initialData?.name || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [company, setCompany] = useState(initialData?.company || "");
  const [category, setCategory] = useState<ContactItem["category"]>(initialData?.category || "Klien");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp || "");
  const [website, setWebsite] = useState(initialData?.website || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [isFavorite, setIsFavorite] = useState(initialData?.isFavorite || false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>(initialData?.labels || []);
  const [customLabelInput, setCustomLabelInput] = useState("");

  const toggleLabel = (lbl: string) => {
    setSelectedLabels((prev) =>
      prev.includes(lbl) ? prev.filter((l) => l !== lbl) : [...prev, lbl]
    );
  };

  const addCustomLabel = () => {
    if (customLabelInput.trim() && !selectedLabels.includes(customLabelInput.trim())) {
      setSelectedLabels((prev) => [...prev, customLabelInput.trim()]);
      setCustomLabelInput("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("Nama dan nomor telepon wajib diisi.");
      return;
    }

    onSave({
      name: name.trim(),
      title: title.trim(),
      company: company.trim(),
      category,
      email: email.trim(),
      phone: phone.trim(),
      whatsapp: (whatsapp || phone).replace(/\D/g, ""),
      website: website.trim(),
      address: address.trim(),
      notes: notes.trim(),
      isFavorite,
      labels: selectedLabels,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-foreground mb-1">
          {initialData ? "Edit Kontak" : "Tambah Kontak Baru"}
        </h2>
        <p className="text-xs text-muted-foreground mb-6">
          Isi detail informasi relasi, klien, atau prospek bisnis Anda.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-foreground">Nama Lengkap *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Santoso, S.T."
                className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Jabatan / Role</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Managing Director"
                className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Perusahaan / Organisasi</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Contoh: PT Prima Solusi"
                className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ContactItem["category"])}
                className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
              >
                <option value="Klien">Klien</option>
                <option value="Prospek">Prospek</option>
                <option value="Partner">Partner</option>
                <option value="Vendor">Vendor</option>
                <option value="Investor">Investor</option>
                <option value="Pribadi">Pribadi</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Nomor Telepon / HP *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+62 812-xxxx-xxxx"
                className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Alamat Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.com"
                className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Website / Portofolio</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://perusahaan.com"
                className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-foreground">Alamat Kantor / Domisili</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jalan, Gedung, Kota"
                className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
              />
            </div>

            {/* Labels Tags */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-foreground">Label & Tag Relasi</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {PRESET_LABELS.map((lbl) => {
                  const active = selectedLabels.includes(lbl);
                  return (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => toggleLabel(lbl)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
                        active
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground border-border hover:bg-muted/40"
                      }`}
                    >
                      {lbl}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customLabelInput}
                  onChange={(e) => setCustomLabelInput(e.target.value)}
                  placeholder="Tambah tag khusus..."
                  className="flex-1 px-3 py-1.5 text-xs bg-background border border-border rounded-xl focus:ring-1 focus:ring-primary outline-none"
                />
                <button
                  type="button"
                  onClick={addCustomLabel}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors"
                >
                  Tambah Tag
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-foreground">Catatan Tambahan</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Preferensi komunikasi, riwayat pertemuan, atau catatan penting lainnya..."
                className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none resize-none"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isFavCheck"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="rounded text-primary focus:ring-primary"
              />
              <label htmlFor="isFavCheck" className="text-xs font-medium text-foreground cursor-pointer">
                Tandai sebagai kontak Favorit / VIP (prioritas atas)
              </label>
            </div>
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
              Simpan Kontak
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
