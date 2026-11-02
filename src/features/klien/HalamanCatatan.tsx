import React from "react";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import {
  Pin,
  Search,
  Plus,
  Trash2,
  Copy,
  Check,
  Download,
  Upload,
  X,
  FileText,
  Calendar,
  Building2,
} from "lucide-react";
import { AppShell } from "@/app/app-shell";
import { cn } from "@/lib/utils";
import { clientsQuery, notesQuery, waktuRelatif, Note } from "@/lib/data";

const STORAGE_KEY = "wira_catatan_knowledge_v2";



export function HalamanCatatan() {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("semua");
  const [filterKlien, setFilterKlien] = useState<string>("semua");
  const [hanyaDipin, setHanyaDipin] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const [notesResult, clientsResult] = useQueries({
    queries: [notesQuery, clientsQuery],
  });

  const clients = clientsResult.data ?? [];
  const defaultNotes = notesResult.data ?? [];

  const [catatanList, setCatatanList] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return defaultNotes;
  });

  useEffect(() => {
    if (defaultNotes.length > 0 && catatanList.length === 0) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setCatatanList(defaultNotes);
      }
    }
  }, [defaultNotes, catatanList.length]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(catatanList));
    } catch {
      // ignore
    }
  }, [catatanList]);

  const kategoriList = useMemo(() => {
    const setKat = new Set(catatanList.map((n) => n.kategori));
    return ["semua", ...Array.from(setKat)];
  }, [catatanList]);

  const namaKlien = (id: string | null) => {
    if (!id) return "Internal";
    return clients.find((k) => k.id === id)?.nama ?? "Klien Eksternal";
  };

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCatatanList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, dipin: !item.dipin } : item))
    );
  };

  const handleCopyText = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `${note.judul}\n${note.kategori} · ${namaKlien(note.client_id)}\n\n${note.isi ?? ""}\n\nTagar: ${note.tags.map((t) => `#${t}`).join(" ")}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Hapus catatan ini dari basis pengetahuan?")) {
      setCatatanList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSaveNote = (noteData: Omit<Note, "id" | "updated_at">) => {
    const nowIso = new Date().toISOString();
    if (editingNote) {
      setCatatanList((prev) =>
        prev.map((item) =>
          item.id === editingNote.id
            ? { ...item, ...noteData, updated_at: nowIso }
            : item
        )
      );
    } else {
      const newNote: Note = {
        ...noteData,
        id: `note-${Date.now()}`,
        updated_at: nowIso,
      };
      setCatatanList((prev) => [newNote, ...prev]);
    }
    setIsModalOpen(false);
    setEditingNote(null);
  };

  const exportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(catatanList, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `catatan_knowledge_base_${new Date().toISOString().slice(0, 10)}.json`;
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
          setCatatanList(parsed);
        }
      } catch {
        alert("File JSON tidak valid.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const hasil = useMemo(() => {
    return catatanList.filter((n) => {
      if (hanyaDipin && !n.dipin) return false;
      const cocokKategori = kategori === "semua" || n.kategori === kategori;
      const cocokKlien =
        filterKlien === "semua" ||
        (filterKlien === "internal" ? !n.client_id : n.client_id === filterKlien);

      const q = cari.trim().toLowerCase();
      const cocokCari =
        !q ||
        n.judul.toLowerCase().includes(q) ||
        (n.isi ?? "").toLowerCase().includes(q) ||
        namaKlien(n.client_id).toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q));

      return cocokKategori && cocokKlien && cocokCari;
    });
  }, [catatanList, hanyaDipin, kategori, filterKlien, cari, clients]);

  const urut = useMemo(() => {
    return [...hasil].sort((a, b) => {
      if (a.dipin && !b.dipin) return -1;
      if (!a.dipin && b.dipin) return 1;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [hasil]);

  return (
    <AppShell
      title="Catatan"
      subtitle="Notulen rapat, temuan lapangan, metodologi, dan template kerja konsultan"
      actions={
        <div className="flex items-center gap-1.5 shrink-0">
          <label
            title="Impor Catatan (.json)"
            aria-label="Impor"
            className="cursor-pointer inline-flex items-center justify-center p-1.5 rounded-lg text-xs font-medium border border-border/70 bg-card/60 hover:bg-accent text-foreground transition-colors shadow-2xs shrink-0"
          >
            <Upload size={13} />
            <input type="file" accept=".json" onChange={importJSON} className="hidden" />
          </label>

          <button
            onClick={exportJSON}
            className="inline-flex items-center justify-center p-1.5 rounded-lg text-xs font-medium border border-border/70 bg-card/60 hover:bg-accent text-foreground transition-colors shadow-2xs cursor-pointer shrink-0"
            title="Ekspor Catatan (.json)"
            aria-label="Ekspor"
          >
            <Download size={13} />
          </button>

          <button
            onClick={() => {
              setEditingNote(null);
              setIsModalOpen(true);
            }}
            title="Tambah Catatan Baru"
            aria-label="Catatan Baru"
            className="inline-flex items-center justify-center p-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-2xs cursor-pointer shrink-0"
          >
            <Plus size={14} />
          </button>
        </div>
      }
    >
      <div className="max-w-6xl mx-auto w-full space-y-4 py-1">
        {/* Unified Search & Filter Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-2 border-b border-border/80">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4 pointer-events-none" />
            <input
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              placeholder="Cari judul, kata kunci isi, atau #tagar…"
              className="w-full h-9 pl-9 pr-8 text-xs bg-card border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary placeholder:text-muted-foreground/60"
            />
            {cari && (
              <button
                onClick={() => setCari("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setHanyaDipin((prev) => !prev)}
              className={cn(
                "h-8 px-2.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors",
                hanyaDipin
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:text-foreground"
              )}
            >
              <Pin size={12} className={hanyaDipin ? "fill-current" : ""} />
              <span>Disematkan</span>
            </button>

            <select
              value={filterKlien}
              onChange={(e) => setFilterKlien(e.target.value)}
              className="h-8 px-2.5 bg-card border border-border rounded-lg text-foreground text-xs font-medium outline-none"
            >
              <option value="semua">Semua Klien & Internal</option>
              <option value="internal">Hanya Internal</option>
              {clients.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {kategoriList.map((k) => (
            <button
              key={k}
              onClick={() => setKategori(k)}
              className={cn(
                "px-3 py-1 rounded-md font-medium capitalize whitespace-nowrap transition-colors border",
                kategori === k
                  ? "border-primary/40 bg-primary/10 text-primary font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              {k}
              {k === "semua" && ` (${catatanList.length})`}
            </button>
          ))}
        </div>

        {/* Notes Grid */}
        {urut.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-border rounded-xl bg-card/40">
            <FileText className="mx-auto size-8 text-muted-foreground/60 mb-2" />
            <h3 className="text-sm font-semibold text-foreground">Tidak Ada Catatan</h3>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-sm mx-auto">
              Tidak ada catatan yang cocok dengan filter atau kata kunci pencarian Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {urut.map((n) => (
              <article
                key={n.id}
                onClick={() => {
                  setEditingNote(n);
                  setIsModalOpen(true);
                }}
                className={cn(
                  "group relative flex flex-col justify-between p-4 rounded-xl border bg-card hover:border-foreground/20 hover:shadow-xs transition-all cursor-pointer",
                  n.dipin ? "border-primary/30 bg-primary/[0.015]" : "border-border"
                )}
              >
                <div>
                  {/* Top line: Category, Client, and Actions */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded truncate">
                        {n.kategori}
                      </span>
                      <span className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                        <Building2 size={11} className="shrink-0" />
                        {namaKlien(n.client_id)}
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={(e) => handleTogglePin(n.id, e)}
                        className="p-1 rounded text-muted-foreground hover:text-primary transition-colors"
                        title={n.dipin ? "Lepas pin" : "Sematkan"}
                      >
                        <Pin size={13} className={n.dipin ? "fill-primary text-primary" : ""} />
                      </button>
                      <button
                        onClick={(e) => handleCopyText(n, e)}
                        className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                        title="Salin isi catatan"
                      >
                        {copiedId === n.id ? (
                          <Check size={13} className="text-emerald-500" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                      <button
                        onClick={(e) => handleDelete(n.id, e)}
                        className="p-1 rounded text-muted-foreground hover:text-rose-500 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="font-semibold text-sm text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {n.judul}
                  </h2>

                  {/* Body Snippet */}
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mt-1.5 whitespace-pre-line">
                    {n.isi}
                  </p>
                </div>

                {/* Footer info: tags & relative time */}
                <div className="mt-3.5 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {waktuRelatif(n.updated_at)}
                  </span>

                  <div className="flex items-center gap-1 max-w-[50%] overflow-hidden">
                    {n.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-[10px] bg-muted px-1.5 py-0.5 rounded truncate">
                        #{t}
                      </span>
                    ))}
                    {n.tags.length > 2 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{n.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Modal Add / Edit Note */}
        {isModalOpen && (
          <CatatanFormModal
            initialData={editingNote}
            clients={clients}
            kategoriList={kategoriList.filter((k) => k !== "semua")}
            onClose={() => {
              setIsModalOpen(false);
              setEditingNote(null);
            }}
            onSave={handleSaveNote}
          />
        )}
      </div>
    </AppShell>
  );
}

// Modal Form
function CatatanFormModal({
  initialData,
  clients,
  kategoriList,
  onClose,
  onSave,
}: {
  initialData: Note | null;
  clients: Array<{ id: string; nama: string }>;
  kategoriList: string[];
  onClose: () => void;
  onSave: (note: Omit<Note, "id" | "updated_at">) => void;
}) {
  const [judul, setJudul] = useState(initialData?.judul || "");
  const [isi, setIsi] = useState(initialData?.isi || "");
  const [kategori, setKategori] = useState(initialData?.kategori || "Notulen Rapat");
  const [clientId, setClientId] = useState<string>(initialData?.client_id || "");
  const [tagsInput, setTagsInput] = useState(initialData?.tags.join(", ") || "");
  const [dipin, setDipin] = useState(initialData?.dipin || false);

  const defaultKategoriOptions = [
    "Notulen Rapat",
    "Temuan Lapangan",
    "Metodologi",
    "Checklist",
    "Template Proposal",
    "SOP & Kebijakan",
    "Insight Strategis",
  ];

  const allOptions = Array.from(new Set([...defaultKategoriOptions, ...kategoriList]));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim()) {
      alert("Judul catatan wajib diisi.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter((t) => t.length > 0);

    onSave({
      judul: judul.trim(),
      isi: isi.trim(),
      kategori: kategori.trim(),
      client_id: clientId ? clientId : null,
      project_id: null,
      tags,
      dipin,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl max-w-xl w-full p-5 shadow-xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X size={16} />
        </button>

        <h2 className="text-base font-bold text-foreground mb-0.5">
          {initialData ? "Edit Catatan Pengetahuan" : "Buat Catatan Baru"}
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Dokumentasikan notulen rapat, temuan konsultansi, atau metodologi kerja tim.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Judul Catatan *</label>
            <input
              type="text"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Temuan Audit Operasional Gudang Cikarang..."
              className="w-full px-3 py-2 text-xs bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Kategori Pengetahuan</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-background border border-border rounded-lg outline-none"
              >
                {allOptions.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Klien Terkait</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-background border border-border rounded-lg outline-none"
              >
                <option value="">Pengetahuan Internal</option>
                {clients.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Isi Catatan & Dokumentasi</label>
            <textarea
              rows={8}
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
              placeholder="Tuliskan poin pembahasan, temuan fakta, risiko, atau tindak lanjut..."
              className="w-full px-3 py-2 text-xs bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none resize-none leading-relaxed font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Tagar (pisahkan dengan koma)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Audit, Efisiensi, Rapat, Checklist"
              className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isDipinCheck"
              checked={dipin}
              onChange={(e) => setDipin(e.target.checked)}
              className="rounded text-primary focus:ring-primary"
            />
            <label htmlFor="isDipinCheck" className="text-xs font-medium text-foreground cursor-pointer">
              Sematkan catatan ini di atas (Pin)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-colors shadow-xs"
            >
              Simpan Catatan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
