import { useState, useMemo } from "react";
import {
  Database,
  Table as TableIcon,
  Plus,
  LayoutGrid,
  Calendar as CalendarIcon,
  Columns,
  Search,
  Trash2,
  Hash,
  Type,
  CheckSquare,
  DollarSign,
  Link,
  Sigma,
  Download,
  BarChart3,
  X,
} from "lucide-react";
import { useDatabaseStore } from "./store";
import { useShellSections } from "@/app/shell-sections";
import {
  FieldType,
  DatabaseRecord,
} from "./types";

export function DatabaseApp() {
  const {
    tables,
    fields,
    records,
    views,
    computeFieldValue,
    addTable,
    addField,
    deleteField,
    addRecord,
    updateRecordValue,
    deleteRecord,
    addView,
  } = useDatabaseStore();

  const [activeTableId, setActiveTableId] = useState<string>(tables[0]?.id || "");
  const [activeViewId, setActiveViewId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isNewTableModalOpen, setIsNewTableModalOpen] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [newTableDesc, setNewTableDesc] = useState("");
  const [newTablePrimary, setNewTablePrimary] = useState("Name");

  const [isNewFieldModalOpen, setIsNewFieldModalOpen] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<FieldType>("text");
  const [newFieldOptions, setNewFieldOptions] = useState("Opsi 1, Opsi 2, Opsi 3");
  const [newFieldRelatedTable, setNewFieldRelatedTable] = useState("");

  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DatabaseRecord | null>(null);

  // Active Table
  const currentTable = useMemo(
    () => tables.find((t) => t.id === activeTableId) || tables[0],
    [tables, activeTableId]
  );

  // Table Fields
  const currentFields = useMemo(
    () => fields.filter((f) => f.tableId === currentTable?.id).sort((a, b) => a.order - b.order),
    [fields, currentTable]
  );

  // Table Views
  const tableViews = useMemo(
    () => views.filter((v) => v.tableId === currentTable?.id),
    [views, currentTable]
  );

  const currentView = useMemo(
    () => tableViews.find((v) => v.id === activeViewId) || tableViews[0],
    [tableViews, activeViewId]
  );

  // Records for current table
  const tableRecords = useMemo(
    () => records.filter((r) => r.tableId === currentTable?.id),
    [records, currentTable]
  );

  // Publish this app's tables as shell sections → they appear in the left
  // sidebar ("Di aplikasi ini") and as interactive buttons in the header.
  useShellSections(
    tables.map((t) => ({
      id: t.id,
      label: t.name,
      icon: TableIcon,
      active: t.id === currentTable?.id,
      onSelect: () => setActiveTableId(t.id),
    })),
  );

  // Filtered records
  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return tableRecords;
    const q = searchQuery.toLowerCase();
    return tableRecords.filter((rec) => {
      return Object.values(rec.values).some((v) =>
        String(v || "").toLowerCase().includes(q)
      );
    });
  }, [tableRecords, searchQuery]);

  // Statistics Calculation (§11)
  const stats = useMemo(() => {
    const totalRecs = tableRecords.length;
    if (totalRecs === 0) return { totalRecs: 0, fillRate: "0%" };

    let totalCells = totalRecs * currentFields.length;
    let filledCells = 0;

    tableRecords.forEach((rec) => {
      currentFields.forEach((f) => {
        const val = rec.values[f.id];
        if (val !== undefined && val !== null && val !== "" && (!Array.isArray(val) || val.length > 0)) {
          filledCells++;
        }
      });
    });

    const fillRate = totalCells > 0 ? `${Math.round((filledCells / totalCells) * 100)}%` : "0%";
    return { totalRecs, fillRate };
  }, [tableRecords, currentFields]);

  // Field type icon helper
  const getFieldIcon = (type: FieldType) => {
    switch (type) {
      case "text":
      case "long_text":
        return <Type className="size-3 text-muted-foreground" />;
      case "number":
      case "currency":
        return <DollarSign className="size-3 text-emerald-500" />;
      case "date":
        return <CalendarIcon className="size-3 text-blue-500" />;
      case "select":
      case "multi_select":
        return <CheckSquare className="size-3 text-purple-500" />;
      case "relation":
      case "lookup":
        return <Link className="size-3 text-indigo-500" />;
      case "formula":
      case "rollup":
        return <Sigma className="size-3 text-amber-500" />;
      default:
        return <Hash className="size-3 text-muted-foreground" />;
    }
  };

  const handleCreateTable = () => {
    if (!newTableName.trim()) return;
    const created = addTable(
      {
        name: newTableName,
        description: newTableDesc,
      },
      newTablePrimary || "Nama"
    );
    setActiveTableId(created.id);
    setNewTableName("");
    setNewTableDesc("");
    setNewTablePrimary("Nama");
    setIsNewTableModalOpen(false);
  };

  const handleAddField = () => {
    if (!newFieldName.trim() || !currentTable) return;

    let config: any = {};
    if (newFieldType === "select" || newFieldType === "multi_select") {
      const opts = newFieldOptions
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((opt, i) => ({
          id: `opt-${Date.now()}-${i}`,
          label: opt,
          color: ["blue", "green", "purple", "amber", "red"][i % 5],
        }));
      config.options = opts;
    } else if (newFieldType === "relation") {
      config.relatedTableId = newFieldRelatedTable || tables[0]?.id;
    } else if (newFieldType === "currency") {
      config.currencySymbol = "Rp";
    }

    addField({
      tableId: currentTable.id,
      name: newFieldName,
      type: newFieldType,
      config,
    });

    setNewFieldName("");
    setNewFieldType("text");
    setIsNewFieldModalOpen(false);
  };

  // CSV Export
  const handleExportCSV = () => {
    if (!currentTable || tableRecords.length === 0) return;
    const header = currentFields.map((f) => `"${f.name}"`).join(",");
    const rows = tableRecords.map((r) =>
      currentFields
        .map((f) => {
          const val = computeFieldValue(r, f);
          return `"${String(val ?? "").replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [header, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${currentTable.name.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-muted/40 dark:bg-background text-foreground dark:text-foreground overflow-hidden font-sans">
      {/* Top Bar: Tables & Global Actions */}
      <div className="bg-card dark:bg-background border-b border-border dark:border-border px-4 py-2.5 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3 overflow-x-auto">
          <div className="w-8 h-8 rounded-xl bg-card border border-border dark:border-border shadow-xs flex items-center justify-center text-foreground dark:text-foreground shrink-0 font-bold">
            <Database className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground dark:text-foreground">Database Engine</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted dark:bg-card font-semibold text-muted-foreground dark:text-foreground border border-border dark:border-border">
                #15 Standalone
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
                Schema-Defined-By-User
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-muted dark:border-border mx-1" />

          {/* Table Tabs */}
          <div className="flex items-center gap-1">
            {tables.map((tbl) => {
              const isActive = tbl.id === currentTable?.id;
              return (
                <button
                  key={tbl.id}
                  onClick={() => {
                    setActiveTableId(tbl.id);
                    setActiveViewId("");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-foreground text-background dark:bg-card dark:text-foreground shadow-xs"
                      : "text-muted-foreground dark:text-muted-foreground hover:bg-muted dark:hover:bg-card"
                  }`}
                >
                  <TableIcon className="size-3.5" />
                  <span>{tbl.name}</span>
                </button>
              );
            })}

            <button
              onClick={() => setIsNewTableModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-dashed border-border dark:border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            >
              <Plus className="size-3.5" /> Tambah Tabel
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStatsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border dark:border-border text-xs font-medium hover:bg-muted/40 dark:hover:bg-card transition-colors"
          >
            <BarChart3 className="size-3.5 text-muted-foreground" />
            Statistik Tabel ({stats.totalRecs} baris)
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border dark:border-border text-xs font-medium hover:bg-muted/40 dark:hover:bg-card transition-colors"
            title="Export CSV"
          >
            <Download className="size-3.5 text-muted-foreground" />
            CSV Export
          </button>
          <button
            onClick={() => addRecord(currentTable.id)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs transition-colors"
          >
            <Plus className="size-4" />
            Baris Baru
          </button>
        </div>
      </div>

      {/* Sub Bar: Views & Filter Toolbar */}
      <div className="bg-muted/70 dark:bg-background/60 border-b border-border dark:border-border px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-card dark:bg-card p-0.5 rounded-lg border border-border dark:border-border">
            {tableViews.map((vw) => {
              const isActive = vw.id === currentView?.id;
              return (
                <button
                  key={vw.id}
                  onClick={() => setActiveViewId(vw.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold"
                      : "text-muted-foreground dark:text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {vw.type === "grid" && <Columns className="size-3.5" />}
                  {vw.type === "kanban" && <LayoutGrid className="size-3.5" />}
                  {vw.type === "calendar" && <CalendarIcon className="size-3.5" />}
                  <span>{vw.name}</span>
                </button>
              );
            })}

            <button
              onClick={() => {
                addView({
                  tableId: currentTable.id,
                  name: `Kanban ${tableViews.length + 1}`,
                  type: "kanban",
                  filters: [],
                  sortRules: [],
                  visibleFieldIds: currentFields.map((f) => f.id),
                  groupByFieldId: currentFields.find((f) => f.type === "select")?.id,
                });
              }}
              className="px-2 py-1 text-xs text-muted-foreground hover:text-muted-foreground"
              title="Tambah View Baru"
            >
              <Plus className="size-3" />
            </button>
          </div>

          <span className="text-xs text-muted-foreground">
            {filteredRecords.length} dari {tableRecords.length} records
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="relative">
            <Search className="size-3.5 absolute left-2.5 top-2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari dalam tabel..."
              className="pl-8 pr-3 py-1 rounded-lg border border-border dark:border-border bg-card dark:bg-card text-xs w-48 focus:w-64 transition-all outline-none"
            />
          </div>

          <button
            onClick={() => setIsNewFieldModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border dark:border-border bg-card dark:bg-card text-xs font-medium hover:bg-muted/40 transition-colors"
          >
            <Plus className="size-3 text-muted-foreground" />
            Tambah Kolom / Field
          </button>
        </div>
      </div>

      {/* Main Workspace Display based on View */}
      <div className="flex-1 overflow-auto bg-card dark:bg-background">
        {currentView?.type === "kanban" ? (
          /* Kanban View (§8) */
          <div className="p-6 flex gap-6 overflow-x-auto min-h-full items-start">
            {(() => {
              const groupField = currentFields.find(
                (f) => f.id === currentView.groupByFieldId || f.type === "select"
              );
              const options = groupField?.config?.options || [
                { id: "none", label: "Belum Ditentukan", color: "gray" },
              ];

              return options.map((opt) => {
                const colRecs = filteredRecords.filter((r) => {
                  const val = r.values[groupField?.id || ""];
                  return val === opt.id || (!val && opt.id === "none");
                });

                return (
                  <div
                    key={opt.id}
                    className="w-72 rounded-2xl bg-muted/40 dark:bg-background border border-border dark:border-border flex flex-col shrink-0 max-h-[calc(100vh-12rem)]"
                  >
                    <div className="p-3 border-b border-border dark:border-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <h4 className="text-xs font-bold text-foreground dark:text-foreground">
                          {opt.label}
                        </h4>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted dark:bg-card font-semibold text-muted-foreground dark:text-foreground">
                        {colRecs.length}
                      </span>
                    </div>

                    <div className="p-3 overflow-y-auto space-y-3 flex-1">
                      {colRecs.map((rec) => {
                        const primaryVal = rec.values[currentTable.primaryFieldId] || "(Kosong)";
                        return (
                          <div
                            key={rec.id}
                            onClick={() => setSelectedRecord(rec)}
                            className="p-3 rounded-xl bg-card dark:bg-card border border-border dark:border-border hover:shadow-sm cursor-pointer transition-shadow space-y-2 text-xs"
                          >
                            <div className="font-bold text-foreground dark:text-foreground">
                              {primaryVal}
                            </div>
                            <div className="space-y-1 text-[11px] text-muted-foreground">
                              {currentFields.slice(1, 4).map((f) => (
                                <div key={f.id} className="flex items-center justify-between">
                                  <span className="text-muted-foreground">{f.name}:</span>
                                  <span className="font-medium text-foreground dark:text-foreground truncate max-w-[120px]">
                                    {String(computeFieldValue(rec, f) || "-")}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        ) : currentView?.type === "calendar" ? (
          /* Calendar View (§8) */
          <div className="p-6">
            <div className="bg-muted/40 dark:bg-background border border-border dark:border-border rounded-2xl p-6 text-center space-y-4">
              <CalendarIcon className="size-10 text-blue-500 mx-auto" />
              <div>
                <h3 className="text-sm font-bold">Calendar View Mode</h3>
                <p className="text-xs text-muted-foreground">
                  Data dipetakan berdasarkan field tanggal:{" "}
                  <span className="font-semibold text-foreground dark:text-foreground">
                    {currentFields.find((f) => f.type === "date")?.name || "(Pilih Field Tanggal)"}
                  </span>
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
                {filteredRecords.map((r) => {
                  const dateField = currentFields.find((f) => f.type === "date");
                  const dateVal = dateField ? r.values[dateField.id] : null;
                  return (
                    <div
                      key={r.id}
                      className="p-3 rounded-xl bg-card dark:bg-card border border-border dark:border-border text-xs"
                    >
                      <div className="text-[10px] text-blue-600 font-bold uppercase">
                        {dateVal || "Belum ditentukan"}
                      </div>
                      <div className="font-bold text-foreground dark:text-foreground mt-1">
                        {r.values[currentTable.primaryFieldId] || "(Tanpa Judul)"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Grid View (Interactive Spreadsheet Table §8) */
          <div className="min-w-full inline-block align-middle">
            <table className="min-w-full divide-y divide-border dark:divide-border text-xs">
              <thead className="bg-muted/40 dark:bg-background/80 sticky top-0 z-10">
                <tr>
                  <th className="w-10 px-3 py-2 text-center text-muted-foreground font-normal">#</th>
                  {currentFields.map((f) => (
                    <th
                      key={f.id}
                      className="px-4 py-2.5 text-left font-semibold text-foreground dark:text-foreground border-r border-border dark:border-border"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {getFieldIcon(f.type)}
                          <span>{f.name}</span>
                          {f.isRequired && <span className="text-rose-500">*</span>}
                        </div>
                        {f.id !== currentTable.primaryFieldId && (
                          <button
                            onClick={() => deleteField(f.id)}
                            className="text-foreground hover:text-rose-500"
                            title="Hapus Kolom"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="w-16 px-3 py-2 text-center text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-border/60 bg-card dark:bg-background">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={currentFields.length + 2}
                      className="p-8 text-center text-muted-foreground text-xs"
                    >
                      Belum ada data dalam tabel ini. Klik tombol &ldquo;Baris Baru&rdquo; untuk
                      menambah data.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((rec, rowIdx) => (
                    <tr
                      key={rec.id}
                      className="hover:bg-blue-50/30 dark:hover:bg-card/40 transition-colors group"
                    >
                      <td className="w-10 px-3 py-2 text-center text-muted-foreground font-mono text-[11px]">
                        {rowIdx + 1}
                      </td>

                      {currentFields.map((f) => {
                        const computedVal = computeFieldValue(rec, f);
                        const isSelect = f.type === "select";

                        return (
                          <td
                            key={f.id}
                            className="px-4 py-2 border-r border-border dark:border-border/60 max-w-xs truncate"
                          >
                            {f.type === "formula" || f.type === "rollup" ? (
                              <span className="font-mono text-purple-600 dark:text-purple-400 font-semibold">
                                {String(computedVal ?? "-")}
                              </span>
                            ) : isSelect ? (
                              <select
                                value={rec.values[f.id] || ""}
                                onChange={(e) => updateRecordValue(rec.id, f.id, e.target.value)}
                                className="w-full bg-transparent outline-none cursor-pointer py-1 font-medium"
                              >
                                <option value="">(Pilih...)</option>
                                {f.config?.options?.map((o) => (
                                  <option key={o.id} value={o.id}>
                                    {o.label}
                                  </option>
                                ))}
                              </select>
                            ) : f.type === "boolean" ? (
                              <input
                                type="checkbox"
                                checked={Boolean(rec.values[f.id])}
                                onChange={(e) => updateRecordValue(rec.id, f.id, e.target.checked)}
                                className="rounded text-blue-600 focus:ring-0"
                              />
                            ) : (
                              <input
                                type={f.type === "number" || f.type === "currency" ? "number" : "text"}
                                value={rec.values[f.id] ?? ""}
                                onChange={(e) => updateRecordValue(rec.id, f.id, e.target.value)}
                                placeholder="-"
                                className="w-full bg-transparent outline-none focus:bg-blue-50/50 dark:focus:bg-card px-1 py-0.5 rounded"
                              />
                            )}
                          </td>
                        );
                      })}

                      <td className="w-16 px-3 py-2 text-center">
                        <button
                          onClick={() => deleteRecord(rec.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-rose-600 transition-opacity"
                          title="Hapus Baris"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create Table */}
      {isNewTableModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl w-full max-w-md p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground dark:text-foreground flex items-center gap-2">
              <TableIcon className="size-4 text-blue-500" />
              Buat Tabel Baru
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nama Tabel *</label>
                <input
                  type="text"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  placeholder="Mis. Klien, Inventaris, Transaksi..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Kolom Utama (Primary Field) *</label>
                <input
                  type="text"
                  value={newTablePrimary}
                  onChange={(e) => setNewTablePrimary(e.target.value)}
                  placeholder="Nama / Kode Dokumen"
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Deskripsi Tabel</label>
                <input
                  type="text"
                  value={newTableDesc}
                  onChange={(e) => setNewTableDesc(e.target.value)}
                  placeholder="Penjelasan tujuan skema tabel ini..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNewTableModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleCreateTable}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
              >
                Buat Tabel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Field / Column */}
      {isNewFieldModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl w-full max-w-md p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground dark:text-foreground flex items-center gap-2">
              <Columns className="size-4 text-purple-500" />
              Tambah Kolom / Field Baru (§4)
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nama Kolom *</label>
                <input
                  type="text"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="Mis. Harga, Tanggal Jatuh Tempo, Status..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tipe Data Kolom</label>
                <select
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value as FieldType)}
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                >
                  <option value="text">Text (String Bebas)</option>
                  <option value="number">Number (Angka Numerik)</option>
                  <option value="currency">Currency (Format Mata Uang Rp)</option>
                  <option value="date">Date (Tanggal)</option>
                  <option value="select">Select (Pilihan Tunggal)</option>
                  <option value="multi_select">Multi-Select (Banyak Pilihan)</option>
                  <option value="boolean">Checkbox (True / False)</option>
                  <option value="relation">Relation (Tautan ke Tabel Lain)</option>
                  <option value="email">Email</option>
                  <option value="url">URL Web</option>
                </select>
              </div>

              {(newFieldType === "select" || newFieldType === "multi_select") && (
                <div>
                  <label className="block font-semibold mb-1">Pilihan Opsi (Pisahkan koma)</label>
                  <input
                    type="text"
                    value={newFieldOptions}
                    onChange={(e) => setNewFieldOptions(e.target.value)}
                    placeholder="Aktif, Pending, Selesai"
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                  />
                </div>
              )}

              {newFieldType === "relation" && (
                <div>
                  <label className="block font-semibold mb-1">Tabel Tujuan Relasi</label>
                  <select
                    value={newFieldRelatedTable}
                    onChange={(e) => setNewFieldRelatedTable(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                  >
                    {tables.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNewFieldModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleAddField}
                className="px-4 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold"
              >
                Tambahkan Kolom
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Statistics (§11) */}
      {isStatsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <BarChart3 className="size-4 text-blue-500" />
                Statistik Tabel: {currentTable?.name}
              </h3>
              <button onClick={() => setIsStatsModalOpen(false)}>
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-4 rounded-xl bg-muted/40 dark:bg-card border border-border dark:border-border">
                <div className="text-2xl font-bold text-foreground dark:text-foreground">
                  {stats.totalRecs}
                </div>
                <div className="text-[10px] uppercase text-muted-foreground font-semibold mt-1">
                  Total Baris (Records)
                </div>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200">
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {stats.fillRate}
                </div>
                <div className="text-[10px] uppercase text-blue-600 font-semibold mt-1">
                  Field Fill Rate
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border dark:border-border">
                <span className="text-muted-foreground">Jumlah Kolom Terdefinisi:</span>
                <span className="font-bold">{currentFields.length} Kolom</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border dark:border-border">
                <span className="text-muted-foreground">Primary Field Identitas:</span>
                <span className="font-bold">
                  {currentFields.find((f) => f.id === currentTable?.primaryFieldId)?.name}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Tampilan Terkonfigurasi:</span>
                <span className="font-bold">{tableViews.length} Views</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsStatsModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
