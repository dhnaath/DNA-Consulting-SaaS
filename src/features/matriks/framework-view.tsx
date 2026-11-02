import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  LayoutTemplate, 
  PenTool, 
  ListOrdered, 
  Target, 
  Lightbulb, 
  CheckSquare, 
  Check, 
  CheckCircle2, 
  Copy, 
  Printer, 
  Download, 
  RotateCcw,
  Sparkles
} from "lucide-react";
import { AppShell } from "@/app/app-shell";
import { ShellSections } from "@/app/shell-sections";
import { Panel } from "@/app/ui-bits";
import { VisualLayoutMockup } from "@/app/VisualMockups";
import { getFrameworkData, FrameworkContent } from "@/frameworkData";

interface FrameworkViewProps {
  frameworkName: string;
  customCanvas?: React.ReactNode;
}

const SectionHeader = ({ number, title, icon: Icon }: { number: string; title: string; icon: any }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-sm">
      {number}
    </div>
    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
      {title}
    </h2>
  </div>
);

export function FrameworkView({ frameworkName, customCanvas }: FrameworkViewProps) {
  const fwData: FrameworkContent = getFrameworkData(frameworkName);

  const [activeTab, setActiveTab] = useState<'hints' | 'worksheet'>('hints');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('teori');

  const goSection = (id: string) => {
    setActiveSection(id);
    document
      .getElementById(`fw-${id}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const [worksheetNotes, setWorksheetNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(`bizcoach_worksheet_${frameworkName}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`bizcoach_checklist_${frameworkName}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const triggerNotify = (msg: string) => {
    setToastMessage(msg);
  };

  const handleNoteChange = (bagian: string, text: string) => {
    const updated = { ...worksheetNotes, [bagian]: text };
    setWorksheetNotes(updated);
    try {
      localStorage.setItem(`bizcoach_worksheet_${frameworkName}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTask = (index: number) => {
    const updated = { ...checkedTasks, [index]: !checkedTasks[index] };
    setCheckedTasks(updated);
    try {
      localStorage.setItem(`bizcoach_checklist_${frameworkName}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetWorksheet = () => {
    if (window.confirm(`Hapus semua catatan lembar kerja ${frameworkName}?`)) {
      setWorksheetNotes({});
      localStorage.removeItem(`bizcoach_worksheet_${frameworkName}`);
      triggerNotify("Lembar kerja telah direset.");
    }
  };

  const handleResetChecklist = () => {
    setCheckedTasks({});
    localStorage.removeItem(`bizcoach_checklist_${frameworkName}`);
    triggerNotify("Daftar aksi direset.");
  };

  const handleCopySummary = () => {
    const text = `${frameworkName.toUpperCase()} - Strategic Framework
Teori: ${fwData.teori.deskripsi}
Manfaat: ${fwData.teori.manfaat}

Draft & Komponen:
${fwData.draft.map(d => `- ${d.bagian}: ${d.hint}`).join('\n')}

Tutorial Eksekusi:
${fwData.tutorial.map((t, idx) => `${idx + 1}. ${t.step}: ${t.desc}`).join('\n')}

Action Plan:
${fwData.actionPlan.map(a => `[ ] ${a}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    triggerNotify(`Ringkasan ${frameworkName} disalin ke clipboard!`);
  };

  const handleExportWorksheetMD = () => {
    const content = [
      `# LEMBAR KERJA BISNIS: ${frameworkName.toUpperCase()}`,
      `Generated on: ${new Date().toLocaleDateString('id-ID')}`,
      '',
      `## 1. Komponen & Catatan Analisis`,
      ...fwData.draft.map(d => {
        return `### ${d.bagian}\n*Hint: ${d.hint}*\n\n**Catatan:**\n${worksheetNotes[d.bagian] || '*(Belum ada catatan)*'}\n`;
      }),
      `## 2. Action Plan Status`,
      ...fwData.actionPlan.map((a, i) => `${checkedTasks[i] ? '[x]' : '[ ]'} ${a}`)
    ].join('\n');

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${frameworkName.replace(/\s+/g, '_')}_Worksheet.md`;
    a.click();
    URL.revokeObjectURL(url);
    triggerNotify("File Markdown berhasil diunduh!");
  };

  const totalChecklist = fwData.actionPlan.length;
  const completedChecklist = fwData.actionPlan.filter((_, idx) => checkedTasks[idx]).length;

  return (
    <AppShell
      title={frameworkName} 
      subtitle={fwData.teori.manfaat}
      actions={
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleExportWorksheetMD}
            className="p-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted text-foreground transition-colors shadow-2xs cursor-pointer shrink-0 flex items-center justify-center"
            title={`Unduh Laporan Klien (${frameworkName})`}
            aria-label="Export Klien"
          >
            <Download size={13} className="text-primary" />
          </button>
          <button
            onClick={handleCopySummary}
            className="p-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted text-foreground transition-colors shadow-2xs cursor-pointer shrink-0 flex items-center justify-center"
            title={`Salin Ringkasan ${frameworkName}`}
            aria-label="Salin Ringkasan"
          >
            <Copy size={13} className="text-muted-foreground" />
          </button>
          <button
            onClick={() => window.print()}
            className="p-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted text-foreground transition-colors shadow-2xs cursor-pointer shrink-0 flex items-center justify-center"
            title={`Cetak ${frameworkName}`}
            aria-label="Cetak"
          >
            <Printer size={13} className="text-muted-foreground" />
          </button>
        </div>
      }
    >
      <ShellSections
        sections={[
          { id: "teori", label: "Teori & Konsep", icon: BookOpen, active: activeSection === "teori", onSelect: () => goSection("teori") },
          { id: "layout", label: "Desain Visual", icon: LayoutTemplate, active: activeSection === "layout", onSelect: () => goSection("layout") },
          { id: "draft", label: "Draft & Lembar Kerja", icon: PenTool, active: activeSection === "draft", onSelect: () => goSection("draft") },
          { id: "tutorial", label: "Tutorial Eksekusi", icon: ListOrdered, active: activeSection === "tutorial", onSelect: () => goSection("tutorial") },
          { id: "action", label: "Action Plan", icon: CheckSquare, active: activeSection === "action", onSelect: () => goSection("action") },
        ]}
      />
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-foreground text-background text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={14} className="text-emerald-500" />
          {toastMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Custom Canvas if provided */}
        {customCanvas && (
          <div className="space-y-4">
            {customCanvas}
          </div>
        )}

        {/* 1. Teori & Konsep Dasar */}
        <section id="fw-teori" className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm scroll-mt-24">
          <SectionHeader number="1" title="Teori & Konsep Dasar" icon={BookOpen} />
          
          <div className="grid md:grid-cols-2 gap-6">
            <Panel className="p-5 border-l-4 border-l-primary/70 bg-accent/20">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                <Lightbulb size={16} className="text-primary" />
                Apa itu alat ini?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {fwData.teori.deskripsi}
              </p>
            </Panel>

            <Panel className="p-5 border-l-4 border-l-emerald-500/70 bg-accent/20">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                <Target size={16} className="text-emerald-500" />
                Manfaat Praktis
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {fwData.teori.manfaat}
              </p>
            </Panel>
          </div>
        </section>

        {/* 2. Desain & Layout Visual (UI) */}
        <section id="fw-layout" className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm scroll-mt-24">
          <SectionHeader number="2" title="Desain & Layout Visual (UI)" icon={LayoutTemplate} />
          <div className="mb-4 text-xs text-muted-foreground">
            Representasi visual standar industri (<span className="font-semibold text-foreground">{fwData.layout.tipe}</span>):
          </div>
          <div className="bg-muted/30 rounded-xl p-4 md:p-6 border border-border/60">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              {fwData.layout.elemen.length} Komponen Elemen
            </div>
            <VisualLayoutMockup layout={fwData.layout} />
          </div>
        </section>

        {/* 3. Draft Konten & Lembar Kerja Interaktif */}
        <section id="fw-draft" className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-sm">
                3
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Draft Konten & Lembar Kerja
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Gunakan panduan pertanyaan atau isi langsung catatan analisis tim Anda.
                </p>
              </div>
            </div>

            {/* Tab switch */}
            <div className="flex items-center gap-1 bg-muted p-1 rounded-xl shrink-0 self-start sm:self-auto">
              <button
                onClick={() => setActiveTab('hints')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'hints' 
                    ? "bg-card text-foreground shadow-sm font-semibold" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Panduan & Hint
              </button>
              <button
                onClick={() => setActiveTab('worksheet')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'worksheet' 
                    ? "bg-card text-foreground shadow-sm font-semibold" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <PenTool size={12} />
                Lembar Kerja
                {Object.values(worksheetNotes).some(v => v?.trim()) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            </div>
          </div>

          {activeTab === 'hints' ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {fwData.draft.map((d, i) => (
                <div 
                  key={i} 
                  className="bg-card rounded-xl p-4 border border-border hover:border-primary/40 transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded-md bg-accent text-accent-foreground text-[11px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                      {d.bagian}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {d.hint}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-border">
                <span className="text-xs text-muted-foreground">
                  Catatan tersimpan otomatis di perangkat browser Anda.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportWorksheetMD}
                    className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                  >
                    <Download size={13} />
                    Ekspor MD
                  </button>
                  <span className="text-muted-foreground/30">•</span>
                  <button
                    onClick={handleResetWorksheet}
                    className="flex items-center gap-1 text-xs text-destructive hover:underline font-medium"
                  >
                    <RotateCcw size={13} />
                    Reset
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {fwData.draft.map((d, i) => {
                  const note = worksheetNotes[d.bagian] || "";
                  return (
                    <div key={i} className="flex flex-col bg-accent/20 rounded-xl p-3.5 border border-border">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-foreground uppercase tracking-wide">
                          {d.bagian}
                        </label>
                        <span className="text-[10px] text-muted-foreground">
                          {note.length} karakter
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mb-2 italic">
                        {d.hint}
                      </p>
                      <textarea
                        rows={4}
                        value={note}
                        onChange={(e) => handleNoteChange(d.bagian, e.target.value)}
                        placeholder={`Tulis hasil analisis atau temuan untuk ${d.bagian}...`}
                        className="w-full text-xs p-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary resize-none transition-all"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* 4. Tutorial Eksekusi */}
        <section id="fw-tutorial" className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm scroll-mt-24">
          <SectionHeader number="4" title="Tutorial Eksekusi" icon={ListOrdered} />
          
          <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            {fwData.tutorial.map((tut, i) => (
              <div key={i} className="relative group">
                <div className="absolute -left-[19px] top-0 w-6 h-6 rounded-full bg-card border-2 border-primary text-primary flex items-center justify-center font-bold text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {i + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-1">
                    {tut.step}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tut.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Action Plan & Takeaways */}
        <section id="fw-action" className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm scroll-mt-24">
          <div className="flex items-center justify-between gap-4 mb-6">
            <SectionHeader number="5" title="Action Plan & Takeaways" icon={CheckSquare} />
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-muted-foreground">
                Progres: <span className="text-foreground font-bold">{completedChecklist}</span> / {totalChecklist}
              </span>
              <button
                onClick={handleResetChecklist}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors p-1"
                title="Reset Checklist"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden mb-6">
            <div 
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${(completedChecklist / totalChecklist) * 100}%` }}
            />
          </div>

          <div className="space-y-3">
            {fwData.actionPlan.map((plan, i) => {
              const isChecked = !!checkedTasks[i];
              return (
                <div 
                  key={i}
                  onClick={() => toggleTask(i)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                    isChecked 
                      ? "bg-accent/30 border-primary/30" 
                      : "bg-card border-border hover:border-primary/40"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isChecked 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : "border-muted-foreground/40 bg-card"
                  }`}>
                    {isChecked && <Check size={13} strokeWidth={3} />}
                  </div>
                  <span className={`text-xs leading-relaxed transition-all ${
                    isChecked 
                      ? "line-through text-muted-foreground" 
                      : "text-foreground font-medium"
                  }`}>
                    {plan}
                  </span>
                </div>
              );
            })}
          </div>

          {completedChecklist === totalChecklist && totalChecklist > 0 && (
            <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 text-xs font-medium">
              <Sparkles size={18} className="shrink-0 text-emerald-500" />
              <span>
                Hebat! Seluruh rekomendasi action plan untuk {frameworkName} telah selesai Anda tandai.
              </span>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
