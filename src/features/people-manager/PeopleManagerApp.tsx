import { ShellHeader } from "@/app/shell-header";
import { ShellSidebar } from "@/app/shell-sidebar";
import { useShellSections } from "@/app/shell-sections";
import React, { useState, useMemo, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Users,
  UserPlus,
  Building2,
  Mail,
  Phone,
  Network,
  BarChart3,
  Search,
  X,
  CheckCircle2,
  ChevronRight,
  Trash2,
  Archive,
  ArrowRight,
  GitMerge,
  ShieldCheck,
  Globe,
  GitFork,
  Scale,
  HeartHandshake,
  PhoneCall,
  ArrowRightLeft,
  Gift,
  PartyPopper,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { usePeopleStore } from "./store";
import {
  Person,
  PersonType,
  PeopleViewMode,
  ContactMethodType,
  RelationshipType,
} from "./types";

export function PeopleManagerApp() {
  const {
    people,
    organizations,
    contactMethods,
    relationships,
    selectedPersonId,
    createPerson,
    deletePerson,
    mergePersons,
    addContactMethod,
    removeContactMethod,
    setPrimaryContactMethod,
    addRelationship,
    removeRelationship,
    createOrganization,
    setSelectedPersonId,
  } = usePeopleStore();

  const [activeTab, setActiveTab] = useState<PeopleViewMode>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [orgFilter, setOrgFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isTabMenuOpen, setIsTabMenuOpen] = useState(false);

  // Otomatis buka sidebar kiri pada tab menu saat halaman dimuat
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("open-left-sidebar", { detail: { tab: "menu" } })
    );
  }, []);


  // New Person Modal
  const [isNewPersonOpen, setIsNewPersonOpen] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newType, setNewType] = useState<PersonType>("external");
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newOrgId, setNewOrgId] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newSelectedTags, setNewSelectedTags] = useState<string[]>(["Klien"]);

  // New Organization Modal
  const [isNewOrgOpen, setIsNewOrgOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgIndustry, setNewOrgIndustry] = useState("");
  const [newOrgWebsite, setNewOrgWebsite] = useState("");

  // Inline Contact Method Modal
  const [newCmType, setNewCmType] = useState<ContactMethodType>("email");
  const [newCmVal, setNewCmVal] = useState("");
  const [newCmLabel, setNewCmLabel] = useState("Kerja");

  // Inline Relationship Modal
  const [newRelToPerson, setNewRelToPerson] = useState("");
  const [newRelType, setNewRelType] = useState<RelationshipType>("colleague");
  const [newRelNote, setNewRelNote] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activePerson = useMemo(() => {
    if (!selectedPersonId) return null;
    return people.find((p) => p.id === selectedPersonId) || null;
  }, [people, selectedPersonId]);

  const activeContacts = useMemo(() => {
    if (!activePerson) return [];
    return contactMethods.filter((c) => c.personId === activePerson.id);
  }, [contactMethods, activePerson]);

  const activeRelationships = useMemo(() => {
    if (!activePerson) return [];
    return relationships.filter(
      (r) => r.fromPersonId === activePerson.id || r.toPersonId === activePerson.id
    );
  }, [relationships, activePerson]);

  // Heuristic Duplicate Candidates
  const duplicateCandidates = useMemo(() => {
    const list: { personA: Person; personB: Person; reason: string }[] = [];
    for (let i = 0; i < people.length; i++) {
      for (let j = i + 1; j < people.length; j++) {
        const a = people[i];
        const b = people[j];

        // 1. Check identical email
        const emailsA = contactMethods
          .filter((c) => c.personId === a.id && c.type === "email")
          .map((c) => c.value.toLowerCase().trim());
        const emailsB = contactMethods
          .filter((c) => c.personId === b.id && c.type === "email")
          .map((c) => c.value.toLowerCase().trim());

        const commonEmail = emailsA.find((e) => emailsB.includes(e));
        if (commonEmail) {
          list.push({ personA: a, personB: b, reason: `Email persis: ${commonEmail}` });
          continue;
        }

        // 2. Check similar name
        const cleanA = a.fullName.toLowerCase().replace(/[^a-z]/g, "");
        const cleanB = b.fullName.toLowerCase().replace(/[^a-z]/g, "");
        if (cleanA.includes(cleanB) || cleanB.includes(cleanA)) {
          list.push({ personA: a, personB: b, reason: "Kemiripan nama yang sangat tinggi" });
        }
      }
    }
    return list;
  }, [people, contactMethods]);

  // Filtered People
  const filteredPeople = useMemo(() => {
    return people.filter((p) => {
      if (typeFilter !== "all" && p.personType !== typeFilter) return false;
      if (orgFilter !== "all" && p.organizationId !== orgFilter) return false;
      if (tagFilter !== "all" && !p.tags.includes(tagFilter)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.fullName.toLowerCase().includes(q);
        const matchTitle = (p.jobTitle || "").toLowerCase().includes(q);
        const matchNotes = (p.notes || "").toLowerCase().includes(q);

        const personEmails = contactMethods
          .filter((c) => c.personId === p.id)
          .map((c) => c.value.toLowerCase());
        const matchEmail = personEmails.some((e) => e.includes(q));

        if (!matchName && !matchTitle && !matchNotes && !matchEmail) return false;
      }
      return true;
    });
  }, [people, typeFilter, orgFilter, tagFilter, searchQuery, contactMethods]);

  // Statistics
  const stats = useMemo(() => {
    const total = people.length;
    const internal = people.filter((p) => p.personType === "internal").length;
    const external = people.filter((p) => p.personType === "external").length;
    const archived = people.filter((p) => p.status === "archived").length;
    const orgsCount = organizations.length;
    const relsCount = relationships.length;

    return { total, internal, external, archived, orgsCount, relsCount };
  }, [people, organizations, relationships]);

  // Daftarkan opsi fitur ke ShellSections agar selalu muncul di tab Menu sidebar kiri
  useShellSections([
    {
      id: "all",
      label: `Semua Orang (${people.length})`,
      icon: Users,
      active: activeTab === "all",
      onSelect: () => setActiveTab("all"),
    },
    {
      id: "by_organization",
      label: `Per Organisasi (${organizations.length})`,
      icon: Building2,
      active: activeTab === "by_organization",
      onSelect: () => setActiveTab("by_organization"),
    },
    {
      id: "relationships",
      label: `Graf Relasi (${relationships.length})`,
      icon: Network,
      active: activeTab === "relationships",
      onSelect: () => setActiveTab("relationships"),
    },
    {
      id: "duplicates",
      label: `Tinjau Duplikat (${duplicateCandidates.length})`,
      icon: GitMerge,
      active: activeTab === "duplicates",
      onSelect: () => setActiveTab("duplicates"),
    },
    {
      id: "stats",
      label: "Statistik Identitas",
      icon: BarChart3,
      active: activeTab === "stats",
      onSelect: () => setActiveTab("stats"),
    },
  ]);

  const handleCreatePerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim()) return;

    const id = createPerson(
      {
        fullName: newFullName.trim(),
        displayName: newDisplayName.trim() || undefined,
        personType: newType,
        jobTitle: newJobTitle.trim() || undefined,
        organizationId: newOrgId || undefined,
        notes: newNotes.trim() || undefined,
        tags: newSelectedTags,
      },
      newContactEmail.trim()
        ? { type: "email", value: newContactEmail.trim(), label: "Email Kerja" }
        : undefined
    );

    if (newContactPhone.trim()) {
      addContactMethod({
        personId: id,
        type: "phone",
        value: newContactPhone.trim(),
        label: "WhatsApp / Mobile",
        isPrimary: false,
      });
    }

    showToast(`Person "${newFullName}" berhasil disimpan sebagai identitas tunggal!`);
    setIsNewPersonOpen(false);
    setNewFullName("");
    setNewDisplayName("");
    setNewJobTitle("");
    setNewContactEmail("");
    setNewContactPhone("");
    setNewNotes("");
  };

  const handleCreateOrganization = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    createOrganization({
      name: newOrgName.trim(),
      industry: newOrgIndustry.trim() || undefined,
      website: newOrgWebsite.trim() || undefined,
    });

    showToast(`Organisasi "${newOrgName}" berhasil dibuat!`);
    setIsNewOrgOpen(false);
    setNewOrgName("");
    setNewOrgIndustry("");
    setNewOrgWebsite("");
  };

  const handleAddContactInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePerson || !newCmVal.trim()) return;

    addContactMethod({
      personId: activePerson.id,
      type: newCmType,
      value: newCmVal.trim(),
      label: newCmLabel.trim(),
      isPrimary: activeContacts.length === 0,
    });

    setNewCmVal("");
    showToast("Metode kontak berhasil ditambahkan!");
  };

  const handleAddRelationshipInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePerson || !newRelToPerson) return;

    addRelationship({
      fromPersonId: activePerson.id,
      toPersonId: newRelToPerson,
      type: newRelType,
      note: newRelNote.trim() || undefined,
      startedAt: new Date().toISOString().split("T")[0],
    });

    setNewRelToPerson("");
    setNewRelNote("");
    showToast("Hubungan / Relasi berhasil dicatat!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-400 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR: Navigasi Menu & Tab Fitur People Manager */}
      <ShellSidebar>
        {/* Header Modul People Manager */}
        <div className="p-3.5 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/25 flex items-center justify-center text-white shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-bold text-foreground tracking-tight">People Manager</h2>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 font-semibold border border-indigo-500/30">
                  #35
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">Identity & Multi-Org Layer</p>
            </div>
          </div>
        </div>

        {/* Menu Tab Fitur Utama */}
        <div className="p-2 space-y-1">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Menu Navigasi Fitur
          </div>

          <button
            onClick={() => setActiveTab("all")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "all"
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-foreground/80 hover:text-foreground hover:bg-accent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 shrink-0" />
              <span>Semua Orang</span>
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                activeTab === "all"
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {people.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("by_organization")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "by_organization"
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-foreground/80 hover:text-foreground hover:bg-accent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Per Organisasi</span>
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                activeTab === "by_organization"
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {organizations.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("relationships")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "relationships"
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-foreground/80 hover:text-foreground hover:bg-accent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Network className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Graf & Jaringan Relasi</span>
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                activeTab === "relationships"
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {relationships.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("duplicates")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "duplicates"
                ? "bg-amber-600 text-white font-semibold shadow-xs"
                : "text-foreground/80 hover:text-amber-500 hover:bg-amber-500/10"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <GitMerge className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Tinjau Duplikat</span>
            </div>
            {duplicateCandidates.length > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  activeTab === "duplicates"
                    ? "bg-white/25 text-white"
                    : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                }`}
              >
                {duplicateCandidates.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "stats"
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-foreground/80 hover:text-foreground hover:bg-accent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Statistik Identitas</span>
            </div>
          </button>
        </div>

        {/* 10 Sub-fitur Terintegrasi (Dipindahkan ke Sidebar Kiri) */}
        <div className="p-2 border-t border-border/70 space-y-1">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
            <Sparkles className="size-3 text-indigo-500" />
            <span>10 Fitur Terintegrasi</span>
          </div>
          <div className="grid grid-cols-2 gap-1 px-1">
            {[
              { label: "Family Tree", to: "/lainnya?app=family-tree", icon: GitFork },
              { label: "House Rules", to: "/lainnya?app=family-rules", icon: Scale },
              { label: "Family Archive", to: "/lainnya?app=family-archive", icon: Archive },
              { label: "Medical Profile", to: "/lainnya?app=medical-family", icon: HeartHandshake },
              { label: "Relation Circles", to: "/lainnya?app=circle-groups", icon: Network },
              { label: "Catchup", to: "/lainnya?app=catchup-cadence", icon: PhoneCall },
              { label: "Borrow Log", to: "/lainnya?app=borrowed-items", icon: ArrowRightLeft },
              { label: "Gift Tracker", to: "/lainnya?app=gift-tracker", icon: Gift },
              { label: "Reunion", to: "/lainnya?app=reunion-planner", icon: PartyPopper },
              { label: "Anniversary", to: "/lainnya?app=family-anniversary", icon: CalendarDays },
            ].map((feat, i) => {
              const Icon = feat.icon;
              const featPath = feat.to.split("?")[0];
              const featSearch = feat.to.includes("?")
                ? Object.fromEntries(new URLSearchParams(feat.to.split("?")[1]))
                : undefined;

              return (
                <Link
                  key={i}
                  to={featPath}
                  search={featSearch as any}
                  className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/60 hover:border-indigo-500/40 text-[10.5px] font-medium text-muted-foreground hover:text-foreground transition truncate"
                >
                  <Icon size={11} className="text-indigo-500 shrink-0" />
                  <span className="truncate">{feat.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Ringkasan Jumlah di Bawah Sidebar */}
        <div className="p-3 mt-auto border-t border-border/70">
          <div className="p-2.5 rounded-xl bg-card border border-border/80 shadow-2xs space-y-1.5 text-xs">
            <div className="flex items-center justify-between font-semibold text-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                Total Individu
              </span>
              <span className="font-bold text-indigo-500">{stats.total}</span>
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Internal: {stats.internal}</span>
              <span>Eksternal: {stats.external}</span>
            </div>
          </div>
        </div>
      </ShellSidebar>

      {/* Header Actions in Floating Pill */}
      <ShellHeader>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsNewOrgOpen(true)}
            title="Tambah Organisasi"
            aria-label="Tambah Organisasi"
            className="p-1.5 bg-card hover:bg-accent text-foreground border border-border/80 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0 flex items-center justify-center"
          >
            <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          <button
            onClick={() => setIsNewPersonOpen(true)}
            title="Tambah Orang / Kontak"
            aria-label="Tambah Kontak"
            className="p-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0 flex items-center justify-center"
          >
            <UserPlus className="w-3.5 h-3.5" />
          </button>
        </div>
      </ShellHeader>

      {/* Page Header Banner (Clean, all options moved to Left Sidebar) */}
      <div className="px-6 py-4 border-b border-border bg-card/40 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/20 shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">People Manager</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
                  App #35
                </span>
                <span className="text-xs text-muted-foreground">
                  Identity Layer • Rujukan Identitas Tunggal Seluruh Ekosistem
                </span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Penyimpanan terpusat profil individu (Internal/External), organisasi, metode kontak, relasi multi-arah, dan deduplikasi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 mt-4">
        {/* STATS VIEW */}
        {activeTab === "stats" && (
          <div className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Total Individu</div>
                <div className="text-3xl font-extrabold text-white mt-1">{stats.total}</div>
                <div className="text-xs text-muted-foreground mt-1">Identitas terdaftar</div>
              </div>
              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Tim Internal</div>
                <div className="text-3xl font-extrabold text-emerald-400 mt-1">{stats.internal}</div>
                <div className="text-xs text-muted-foreground mt-1">Akun internal konsultan</div>
              </div>
              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Kontak Eksternal</div>
                <div className="text-3xl font-extrabold text-cyan-400 mt-1">{stats.external}</div>
                <div className="text-xs text-muted-foreground mt-1">Klien, Vendor & Mitra</div>
              </div>
              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Jaringan Relasi</div>
                <div className="text-3xl font-extrabold text-purple-400 mt-1">{stats.relsCount}</div>
                <div className="text-xs text-muted-foreground mt-1">Koneksi antar-orang</div>
              </div>
            </div>
          </div>
        )}

        {/* DUPLICATE CANDIDATES VIEW */}
        {activeTab === "duplicates" && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-4 bg-card/40 border border-border/60 rounded-xl text-xs text-muted-foreground leading-relaxed">
              Deteksi heuristik berbasis kemiripan nama dan kecocokan email persis. Penggabungan (*merge*) memindahkan semua metode kontak, tag, dan relasi ke record utama tanpa menghapus referensi historis.
            </div>

            {duplicateCandidates.length === 0 ? (
              <div className="p-12 text-center bg-card/40 border border-border/60 rounded-xl">
                <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <h3 className="font-semibold text-foreground">Tidak ada duplikat terdeteksi</h3>
                <p className="text-xs text-muted-foreground mt-1">Database identitas bersih dan unik.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {duplicateCandidates.map((cand, idx) => (
                  <div key={idx} className="p-5 bg-card/80 border border-border rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {cand.reason}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-background/80 border border-border rounded-lg space-y-1">
                        <div className="text-xs text-muted-foreground">Record A (Dipertahankan):</div>
                        <div className="font-bold text-foreground">{cand.personA.fullName}</div>
                        <div className="text-xs text-muted-foreground">{cand.personA.jobTitle || "Tanpa Jabatan"}</div>
                      </div>

                      <div className="p-3 bg-background/80 border border-border rounded-lg space-y-1">
                        <div className="text-xs text-muted-foreground">Record B (Akan Digabung):</div>
                        <div className="font-bold text-foreground">{cand.personB.fullName}</div>
                        <div className="text-xs text-muted-foreground">{cand.personB.jobTitle || "Tanpa Jabatan"}</div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
                      <button
                        onClick={() => {
                          mergePersons(cand.personA.id, cand.personB.id);
                          showToast(`Record ${cand.personB.fullName} berhasil digabung ke ${cand.personA.fullName}!`);
                        }}
                        className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-600/30"
                      >
                        <GitMerge className="w-3.5 h-3.5" />
                        Gabungkan Data (Merge)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RELATIONSHIPS VIEW */}
        {activeTab === "relationships" && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-4 bg-card/40 border border-border/60 rounded-xl text-xs text-muted-foreground">
              Jaringan koneksi antar individu (atasan-bawahan, relasi klien, mitra kerja) secara multi-arah.
            </div>

            <div className="space-y-3">
              {relationships.map((r) => {
                const pFrom = people.find((p) => p.id === r.fromPersonId);
                const pTo = people.find((p) => p.id === r.toPersonId);
                const oTo = organizations.find((o) => o.id === r.toOrganizationId);

                return (
                  <div key={r.id} className="p-4 bg-card/80 border border-border rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-foreground">{pFrom?.fullName || "Person"}</span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[11px] uppercase">
                        {r.type.replace("_", " ")}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-bold text-foreground">
                        {pTo?.fullName || oTo?.name || "Entitas Terkait"}
                      </span>
                      {r.note && <span className="text-muted-foreground italic">({r.note})</span>}
                    </div>

                    <button
                      onClick={() => removeRelationship(r.id)}
                      className="text-muted-foreground hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BY ORGANIZATION VIEW */}
        {activeTab === "by_organization" && (
          <div className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {organizations.map((org) => {
                const members = people.filter((p) => p.organizationId === org.id);

                return (
                  <div key={org.id} className="p-5 bg-card/80 border border-border rounded-xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-base text-white">{org.name}</h3>
                        <div className="text-xs text-muted-foreground">{org.industry || "Industri Umum"}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-card text-foreground text-xs font-semibold">
                        {members.length} Orang
                      </span>
                    </div>

                    {org.website && (
                      <div className="text-xs text-cyan-400 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5" />
                        <span>{org.website}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-border/60 space-y-1.5">
                      <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Anggota Terdaftar:</div>
                      {members.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => setSelectedPersonId(m.id)}
                          className="p-2 bg-background/60 rounded flex items-center justify-between text-xs cursor-pointer hover:border-border transition"
                        >
                          <span className="text-foreground font-medium">{m.fullName}</span>
                          <span className="text-muted-foreground text-[11px]">{m.jobTitle}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ALL PEOPLE VIEW */}
        {activeTab === "all" && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-card/80 border border-border rounded-xl">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama, jabatan, email, tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs md:text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">Semua Tipe</option>
                  <option value="internal">Internal (Tim)</option>
                  <option value="external">External (Klien/Mitra)</option>
                </select>

                <select
                  value={orgFilter}
                  onChange={(e) => setOrgFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">Semua Organisasi</option>
                  {organizations.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* People Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPeople.map((person) => {
                const org = organizations.find((o) => o.id === person.organizationId);
                const primaryEmail = contactMethods.find(
                  (c) => c.personId === person.id && c.type === "email" && c.isPrimary
                );
                const primaryPhone = contactMethods.find(
                  (c) => c.personId === person.id && c.type === "phone"
                );

                return (
                  <div
                    key={person.id}
                    className="p-5 bg-card/80 border border-border hover:border-border rounded-xl flex flex-col justify-between transition space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            person.personType === "internal"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          }`}
                        >
                          {person.personType === "internal" ? "Internal Team" : "External Contact"}
                        </span>

                        <div className="flex items-center gap-1">
                          {person.tags.map((t, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded bg-card text-foreground text-[10px]">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3
                          onClick={() => setSelectedPersonId(person.id)}
                          className="font-bold text-base text-foreground cursor-pointer hover:text-indigo-400 transition"
                        >
                          {person.fullName}
                        </h3>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {person.jobTitle || "Peran Belum Ditetapkan"} • {org?.name || "Independen"}
                        </div>
                      </div>

                      {/* Contact Preview */}
                      <div className="space-y-1 pt-1 text-xs text-foreground">
                        {primaryEmail && (
                          <div className="flex items-center gap-2 text-muted-foreground truncate">
                            <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span className="truncate">{primaryEmail.value}</span>
                          </div>
                        )}
                        {primaryPhone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{primaryPhone.value}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setSelectedPersonId(person.id)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1 shadow-sm"
                      >
                        Detail & Kontak
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: DETAIL PERSON & CONTACT METHODS */}
      {selectedPersonId && activePerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-2xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                    {activePerson.personType}
                  </span>
                  <span className="text-xs text-muted-foreground">{activePerson.status}</span>
                </div>
                <h3 className="font-bold text-lg text-white mt-1">{activePerson.fullName}</h3>
                <div className="text-xs text-muted-foreground">
                  {activePerson.jobTitle} • {organizations.find((o) => o.id === activePerson.organizationId)?.name}
                </div>
              </div>
              <button onClick={() => setSelectedPersonId(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* CONTACT METHODS LIST */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  Metode Kontak (Contact Methods)
                </h4>

                <div className="space-y-2">
                  {activeContacts.map((cm) => (
                    <div
                      key={cm.id}
                      className="p-3 bg-card/60 border border-border rounded-lg flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        {cm.type === "email" ? (
                          <Mail className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <Phone className="w-4 h-4 text-emerald-400" />
                        )}
                        <div>
                          <div className="font-semibold text-foreground">{cm.value}</div>
                          <div className="text-[10px] text-muted-foreground">{cm.label}</div>
                        </div>
                        {cm.isPrimary && (
                          <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                            UTAMA
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {!cm.isPrimary && (
                          <button
                            onClick={() => setPrimaryContactMethod(activePerson.id, cm.id)}
                            className="text-[11px] text-indigo-400 hover:underline"
                          >
                            Set Utama
                          </button>
                        )}
                        <button
                          onClick={() => removeContactMethod(cm.id)}
                          className="text-muted-foreground hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Contact Form */}
                <form onSubmit={handleAddContactInline} className="p-3 bg-background border border-border rounded-lg space-y-2">
                  <div className="text-xs font-semibold text-foreground">Tambah Metode Kontak:</div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <select
                      value={newCmType}
                      onChange={(e) => setNewCmType(e.target.value as any)}
                      className="px-2 py-1.5 bg-background border border-border rounded text-xs text-foreground focus:outline-none focus:border-indigo-500"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone / WA</option>
                      <option value="social_media">Social / LinkedIn</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Nilai (email / no hp)"
                      value={newCmVal}
                      onChange={(e) => setNewCmVal(e.target.value)}
                      className="md:col-span-2 px-2.5 py-1.5 bg-background border border-border rounded text-xs text-foreground focus:outline-none focus:border-indigo-500"
                    />

                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold"
                    >
                      + Tambah
                    </button>
                  </div>
                </form>
              </div>

              {/* RELATIONSHIPS LIST */}
              <div className="space-y-3 pt-2 border-t border-border">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Network className="w-4 h-4 text-purple-400" />
                  Hubungan & Relasi (Relationships)
                </h4>

                <div className="space-y-2">
                  {activeRelationships.map((r) => {
                    const otherPerson = people.find(
                      (p) => p.id === (r.fromPersonId === activePerson.id ? r.toPersonId : r.fromPersonId)
                    );

                    return (
                      <div
                        key={r.id}
                        className="p-2.5 bg-card/60 border border-border rounded text-xs flex items-center justify-between"
                      >
                        <div>
                          <span className="font-semibold text-foreground">{otherPerson?.fullName}</span>
                          <span className="text-muted-foreground text-[11px] ml-2 font-mono">
                            ({r.type.replace("_", " ")})
                          </span>
                        </div>
                        <button
                          onClick={() => removeRelationship(r.id)}
                          className="text-muted-foreground hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Add Rel Form */}
                <form onSubmit={handleAddRelationshipInline} className="p-3 bg-background border border-border rounded-lg space-y-2">
                  <div className="text-xs font-semibold text-foreground">Tautkan Relasi:</div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <select
                      value={newRelToPerson}
                      onChange={(e) => setNewRelToPerson(e.target.value)}
                      className="md:col-span-2 px-2 py-1.5 bg-background border border-border rounded text-xs text-foreground focus:outline-none focus:border-indigo-500"
                    >
                      <option value="">Pilih Orang...</option>
                      {people
                        .filter((p) => p.id !== activePerson.id)
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.fullName} ({p.jobTitle || "Independen"})
                          </option>
                        ))}
                    </select>

                    <select
                      value={newRelType}
                      onChange={(e) => setNewRelType(e.target.value as any)}
                      className="px-2 py-1.5 bg-background border border-border rounded text-xs text-foreground focus:outline-none focus:border-indigo-500"
                    >
                      <option value="colleague">Kolega</option>
                      <option value="reports_to">Lapor Ke (Bawahan)</option>
                      <option value="manager_of">Atasan Dari</option>
                      <option value="client_of">Klien Dari</option>
                      <option value="vendor_of">Vendor Dari</option>
                    </select>

                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-bold"
                    >
                      + Simpan Relasi
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border">
              <button
                onClick={() => {
                  deletePerson(activePerson.id);
                  showToast("Data orang dihapus.");
                  setSelectedPersonId(null);
                }}
                className="px-3 py-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus
              </button>

              <button
                onClick={() => setSelectedPersonId(null)}
                className="px-4 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE PERSON */}
      {isNewPersonOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-white">Tambah Individu (Identity Layer)</h3>
              <button onClick={() => setIsNewPersonOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePerson} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Nama Lengkap <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="mis. Bambang Pamungkas, S.T."
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Tipe Individu</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-indigo-500"
                  >
                    <option value="external">External (Klien/Mitra)</option>
                    <option value="internal">Internal (Tim Konsultan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Organisasi / Perusahaan</label>
                  <select
                    value={newOrgId}
                    onChange={(e) => setNewOrgId(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Independen / Bebas</option>
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Jabatan / Peran</label>
                <input
                  type="text"
                  placeholder="mis. VP Technology, Account Executive"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Email Utama</label>
                  <input
                    type="email"
                    placeholder="nama@perusahaan.co.id"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Nomor WhatsApp / HP</label>
                  <input
                    type="text"
                    placeholder="+62 811..."
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsNewPersonOpen(false)}
                  className="px-3.5 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
                >
                  Simpan Identitas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE ORG */}
      {isNewOrgOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-white">Tambah Organisasi Baru</h3>
              <button onClick={() => setIsNewOrgOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrganization} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Nama Organisasi <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="mis. PT Bank Central Makmur"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Sektor / Industri</label>
                <input
                  type="text"
                  placeholder="mis. Financial Services, Telekomunikasi"
                  value={newOrgIndustry}
                  onChange={(e) => setNewOrgIndustry(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Website</label>
                <input
                  type="url"
                  placeholder="https://perusahaan.co.id"
                  value={newOrgWebsite}
                  onChange={(e) => setNewOrgWebsite(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsNewOrgOpen(false)}
                  className="px-3.5 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
                >
                  Simpan Organisasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
