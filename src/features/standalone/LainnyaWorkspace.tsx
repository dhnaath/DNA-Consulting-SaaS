import * as React from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import { StandaloneAppView } from "@/features/standalone/StandaloneAppView";
import { STANDALONE_APPS } from "@/features/standalone/standaloneAppsData";
import {
  useCustomNav,
} from "@/hooks/useCustomNav";
import {
  Folder,
  FileText,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Circle,
  Link as LinkIcon,
  Calendar,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";



export function LainnyaWorkspace({ initialAppId }: { initialAppId?: string } = {}) {
  const routerState = useRouterState();
  const search = (routerState.location.search || {}) as { id?: string; app?: string };
  const id = search.id;
  const app = initialAppId || search.app;

  const effectiveAppId = app || (id && STANDALONE_APPS[id] ? id : undefined);

  if (effectiveAppId && STANDALONE_APPS[effectiveAppId]) {
    const standaloneConfig = STANDALONE_APPS[effectiveAppId];
    return (
      <AppShell
        title={standaloneConfig.title}
        subtitle={standaloneConfig.subtitle}
      >
        <div className="w-full">
          <StandaloneAppView appId={effectiveAppId} />
        </div>
      </AppShell>
    );
  }

  return <CustomNavWorkspaceContent id={id} />;
}

function CustomNavWorkspaceContent({ id }: { id?: string }) {
  const navigate = useNavigate();
  const {
    categories,
    findItemById,
    updateMenuItem,
    deleteMenuItem,
  } = useCustomNav();


  const activeData = id ? findItemById(id) : null;
  const currentItem = activeData?.item;
  const currentCategory = activeData?.category;

  // Local state for live workspace editing
  const [notes, setNotes] = React.useState(currentItem?.notes || "");
  const [tasks, setTasks] = React.useState(currentItem?.tasks || []);
  const [newTaskText, setNewTaskText] = React.useState("");
  const [links, setLinks] = React.useState(currentItem?.links || []);
  const [newLinkTitle, setNewLinkTitle] = React.useState("");
  const [newLinkUrl, setNewLinkUrl] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"notes" | "tasks" | "links">("notes");
  const [isSaved, setIsSaved] = React.useState(true);

  // Sync state when active item changes
  React.useEffect(() => {
    if (currentItem) {
      setNotes(currentItem.notes || "");
      setTasks(currentItem.tasks || []);
      setLinks(currentItem.links || []);
      setIsSaved(true);
    }
  }, [currentItem?.id]);

  // Debounced auto-save notes
  React.useEffect(() => {
    if (!currentItem || !currentCategory) return;
    if (notes === currentItem.notes) return;

    setIsSaved(false);
    const timeout = setTimeout(() => {
      updateMenuItem(currentCategory.id, currentItem.id, { notes });
      setIsSaved(true);
    }, 600);

    return () => clearTimeout(timeout);
  }, [notes, currentItem?.id, currentCategory?.id, updateMenuItem]);

  const handleToggleTask = (taskId: string) => {
    if (!currentItem || !currentCategory) return;
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
    updateMenuItem(currentCategory.id, currentItem.id, { tasks: updated });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim() || !currentItem || !currentCategory) return;
    const newTask = {
      id: `task-${Date.now()}`,
      text: newTaskText.trim(),
      completed: false,
    };
    const updated = [...tasks, newTask];
    setTasks(updated);
    setNewTaskText("");
    updateMenuItem(currentCategory.id, currentItem.id, { tasks: updated });
  };

  const handleDeleteTask = (taskId: string) => {
    if (!currentItem || !currentCategory) return;
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    updateMenuItem(currentCategory.id, currentItem.id, { tasks: updated });
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkTitle.trim() || !newLinkUrl.trim() || !currentItem || !currentCategory) return;
    const newLink = {
      id: `link-${Date.now()}`,
      title: newLinkTitle.trim(),
      url: newLinkUrl.trim(),
    };
    const updated = [...links, newLink];
    setLinks(updated);
    setNewLinkTitle("");
    setNewLinkUrl("");
    updateMenuItem(currentCategory.id, currentItem.id, { links: updated });
  };

  const handleDeleteLink = (linkId: string) => {
    if (!currentItem || !currentCategory) return;
    const updated = links.filter((l) => l.id !== linkId);
    setLinks(updated);
    updateMenuItem(currentCategory.id, currentItem.id, { links: updated });
  };

  const handleDeleteCurrentMenu = () => {
    if (!currentItem || !currentCategory) return;
    if (confirm(`Yakin ingin menghapus menu "${currentItem.label}"?`)) {
      deleteMenuItem(currentCategory.id, currentItem.id);
      (navigate as any)({ to: "/lainnya" });
    }
  };

  // If no item is selected or item not found, show directory of custom folders
  if (!currentItem || !currentCategory) {
    return (
      <AppShell
        title="Folder & Menu Kustom"
        subtitle="Kelola kategori, folder, dan menu kerja pribadi"
      >
        <div className="max-w-5xl mx-auto space-y-6 pb-12">
          {/* Hero Banner */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  <Sparkles className="size-3.5" />
                  <span>Kustomisasi Navigasi</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Pusat Menu & Folder Kustom
                </h2>
                <p className="text-sm text-muted-foreground max-w-xl">
                  Buat kategori atau folder baru di panel sidebar kiri untuk mengatur alur kerja Anda. Setiap menu yang Anda buat akan otomatis tersinkronisasi dengan Breadcrumb di bagian atas.
                </p>
              </div>
            </div>
          </div>

          {/* Folder Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-muted text-primary">
                        <Folder className="size-4" />
                      </div>
                      <h3 className="font-semibold text-foreground text-base">
                        {cat.title}
                      </h3>
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {cat.items.length} Menu
                    </span>
                  </div>

                  <div className="space-y-1.5 mt-3">
                    {cat.items.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic py-2">
                        Belum ada menu di folder ini. Tambahkan melalui sidebar.
                      </p>
                    ) : (
                      cat.items.map((item) => (
                        <Link
                          key={item.id}
                          to={item.path}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/60 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <FileText className="size-3.5 opacity-70 group-hover:text-primary" />
                            <span className="truncate">{item.label}</span>
                          </span>
                          <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  // Active custom workspace item view
  return (
    <AppShell
      title={currentItem.label}
      subtitle={`${currentCategory.title} > ${currentItem.label}`}
      actions={
        <div className="flex items-center gap-2 shrink-0">
          {isSaved ? (
            <span className="text-xs text-emerald-500 font-medium flex items-center gap-1 whitespace-nowrap">
              <Check className="size-3.5" /> Tersimpan
            </span>
          ) : (
            <span className="text-xs text-amber-500 font-medium animate-pulse whitespace-nowrap">
              Menyimpan...
            </span>
          )}
          <button
            type="button"
            onClick={handleDeleteCurrentMenu}
            className="size-8 flex items-center justify-center rounded-lg border border-border/70 bg-card/60 text-muted-foreground hover:text-rose-500 hover:border-rose-300 transition-colors shadow-2xs cursor-pointer"
            title="Hapus Menu Ini"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      }
    >
      <div className="max-w-5xl mx-auto space-y-5 pb-16">
        {/* Workspace Banner */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                <FileText className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                    📁 {currentCategory.title}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="size-3" />
                    {new Date(currentItem.updatedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-foreground mt-1">
                  {currentItem.label}
                </h2>
                {currentItem.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {currentItem.description}
                  </p>
                )}
              </div>
            </div>

            {/* Sibling navigation dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Menu Selevel:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentCategory.items.map((sib) => (
                  <Link
                    key={sib.id}
                    to={sib.path}
                    className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                      sib.id === currentItem.id
                        ? "bg-primary text-white border-primary font-semibold"
                        : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {sib.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("notes")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "notes"
                ? "bg-accent text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="size-3.5" />
            Catatan & Dokumen
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tasks")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "tasks"
                ? "bg-accent text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CheckCircle2 className="size-3.5" />
            Daftar Checklist ({tasks.filter((t) => t.completed).length}/{tasks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("links")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "links"
                ? "bg-accent text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LinkIcon className="size-3.5" />
            Tautan Terkait ({links.length})
          </button>
        </div>

        {/* Tab Content: Notes */}
        {activeTab === "notes" && (
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Catatan Bebas & Dokumentasi
              </span>
              <span className="text-[11px] text-muted-foreground">
                Tersimpan otomatis
              </span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tuliskan catatan, riset, atau panduan kerja untuk menu ini..."
              rows={14}
              className="w-full p-3.5 text-sm font-sans rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed text-foreground"
            />
          </div>
        )}

        {/* Tab Content: Tasks Checklist */}
        {activeTab === "tasks" && (
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-4">
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="+ Tambah tugas atau item checklist baru..."
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 flex items-center gap-1"
              >
                <Plus className="size-3.5" /> Tambah
              </button>
            </form>

            <div className="space-y-1.5">
              {tasks.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-4 text-center">
                  Belum ada tugas dalam checklist ini.
                </p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors group"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task.id)}
                      className="flex items-center gap-2.5 text-left flex-1 min-w-0 cursor-pointer"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="size-4 text-muted-foreground shrink-0" />
                      )}
                      <span
                        className={`text-xs sm:text-sm truncate ${
                          task.completed
                            ? "line-through text-muted-foreground"
                            : "text-foreground font-medium"
                        }`}
                      >
                        {task.text}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 rounded text-muted-foreground hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Links */}
        {activeTab === "links" && (
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-4">
            <form onSubmit={handleAddLink} className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  placeholder="Judul Tautan (misal: Dokumen Google Drive)"
                  className="px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
                <input
                  type="url"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 flex items-center gap-1"
              >
                <Plus className="size-3.5" /> Tambah Tautan
              </button>
            </form>

            <div className="space-y-1.5 pt-2">
              {links.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-4 text-center">
                  Belum ada tautan terkait.
                </p>
              ) : (
                links.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors group"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-medium text-primary hover:underline truncate"
                    >
                      <ExternalLink className="size-3.5 shrink-0" />
                      <span className="truncate">{link.title}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDeleteLink(link.id)}
                      className="p-1 rounded text-muted-foreground hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
