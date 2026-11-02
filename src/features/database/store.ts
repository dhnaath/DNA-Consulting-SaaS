import { useState, useEffect } from "react";
import { getRaw, setRaw } from "../../core/rawStorage";
import {
  DatabaseData,
  DatabaseTable,
  DatabaseField,
  DatabaseRecord,
  DatabaseRelation,
  DatabaseView,
  AggregationType,
} from "./types";

const STORAGE_KEY = "aio_database_data_v1";

const DEFAULT_TABLES: DatabaseTable[] = [
  {
    id: "tbl-vendor",
    name: "Vendor & Pemasok",
    description: "Pelacak vendor, kategori pengadaan, dan status kontrak aktif",
    primaryFieldId: "fld-v-name",
    icon: "Building2",
    color: "#3b82f6",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: "tbl-contract",
    name: "Kontrak & Perjanjian",
    description: "Daftar kontrak kerjasama, nilai perjanjian, dan masa berlaku",
    primaryFieldId: "fld-c-no",
    icon: "FileCheck2",
    color: "#10b981",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
];

const DEFAULT_FIELDS: DatabaseField[] = [
  // Vendor Table Fields
  { id: "fld-v-name", tableId: "tbl-vendor", name: "Nama Vendor", type: "text", isRequired: true, order: 1 },
  {
    id: "fld-v-cat",
    tableId: "tbl-vendor",
    name: "Kategori",
    type: "select",
    order: 2,
    config: {
      options: [
        { id: "opt-cloud", label: "Cloud & Hosting", color: "blue" },
        { id: "opt-hardware", label: "Perangkat Keras", color: "purple" },
        { id: "opt-consulting", label: "Konsultan Hukum & Finansial", color: "amber" },
      ],
    },
  },
  { id: "fld-v-email", tableId: "tbl-vendor", name: "Email Kontak", type: "email", order: 3 },
  {
    id: "fld-v-status",
    tableId: "tbl-vendor",
    name: "Status Kerjasama",
    type: "select",
    order: 4,
    config: {
      options: [
        { id: "opt-act", label: "Aktif", color: "green" },
        { id: "opt-rev", label: "Dalam Evaluasi", color: "amber" },
        { id: "opt-ter", label: "Terminasi", color: "red" },
      ],
    },
  },
  {
    id: "fld-v-contract",
    tableId: "tbl-vendor",
    name: "Kontrak Terkait",
    type: "relation",
    order: 5,
    config: { relatedTableId: "tbl-contract" },
  },

  // Contract Table Fields
  { id: "fld-c-no", tableId: "tbl-contract", name: "Nomor Kontrak", type: "text", isRequired: true, order: 1 },
  { id: "fld-c-val", tableId: "tbl-contract", name: "Nilai Kontrak", type: "currency", order: 2, config: { currencySymbol: "Rp" } },
  { id: "fld-c-start", tableId: "tbl-contract", name: "Tanggal Mulai", type: "date", order: 3 },
  { id: "fld-c-end", tableId: "tbl-contract", name: "Tanggal Berakhir", type: "date", order: 4 },
  {
    id: "fld-c-status",
    tableId: "tbl-contract",
    name: "Status Kontrak",
    type: "select",
    order: 5,
    config: {
      options: [
        { id: "opt-c-act", label: "Berjalan", color: "green" },
        { id: "opt-c-exp", label: "Expired", color: "red" },
      ],
    },
  },
];

const DEFAULT_RECORDS: DatabaseRecord[] = [
  {
    id: "rec-v-1",
    tableId: "tbl-vendor",
    values: {
      "fld-v-name": "PT Cloud Infrastruktur Indonesia",
      "fld-v-cat": "opt-cloud",
      "fld-v-email": "support@cloudindonesia.co.id",
      "fld-v-status": "opt-act",
      "fld-v-contract": ["rec-c-1"],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "rec-v-2",
    tableId: "tbl-vendor",
    values: {
      "fld-v-name": "CV Hardware Solusindo",
      "fld-v-cat": "opt-hardware",
      "fld-v-email": "sales@hardwaresolusi.com",
      "fld-v-status": "opt-act",
      "fld-v-contract": ["rec-c-2"],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "rec-v-3",
    tableId: "tbl-vendor",
    values: {
      "fld-v-name": "Advisory Partners Legal",
      "fld-v-cat": "opt-consulting",
      "fld-v-email": "contact@advisorylegal.id",
      "fld-v-status": "opt-rev",
      "fld-v-contract": [],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Contracts
  {
    id: "rec-c-1",
    tableId: "tbl-contract",
    values: {
      "fld-c-no": "CTR/2026/IT-001",
      "fld-c-val": 120000000,
      "fld-c-start": "2026-01-01",
      "fld-c-end": "2026-12-31",
      "fld-c-status": "opt-c-act",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "rec-c-2",
    tableId: "tbl-contract",
    values: {
      "fld-c-no": "CTR/2025/HW-088",
      "fld-c-val": 45000000,
      "fld-c-start": "2025-06-01",
      "fld-c-end": "2026-06-01",
      "fld-c-status": "opt-c-act",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_VIEWS: DatabaseView[] = [
  {
    id: "vw-v-grid",
    tableId: "tbl-vendor",
    name: "Daftar Vendor (Grid)",
    type: "grid",
    filters: [],
    sortRules: [],
    visibleFieldIds: ["fld-v-name", "fld-v-cat", "fld-v-email", "fld-v-status", "fld-v-contract"],
  },
  {
    id: "vw-v-kanban",
    tableId: "tbl-vendor",
    name: "Pipeline Status (Kanban)",
    type: "kanban",
    filters: [],
    sortRules: [],
    visibleFieldIds: ["fld-v-name", "fld-v-cat", "fld-v-email", "fld-v-status"],
    groupByFieldId: "fld-v-status",
  },
  {
    id: "vw-c-grid",
    tableId: "tbl-contract",
    name: "Semua Kontrak (Grid)",
    type: "grid",
    filters: [],
    sortRules: [],
    visibleFieldIds: ["fld-c-no", "fld-c-val", "fld-c-start", "fld-c-end", "fld-c-status"],
  },
  {
    id: "vw-c-cal",
    tableId: "tbl-contract",
    name: "Jadwal Jatuh Tempo (Calendar)",
    type: "calendar",
    filters: [],
    sortRules: [],
    visibleFieldIds: ["fld-c-no", "fld-c-val", "fld-c-end"],
    dateFieldId: "fld-c-end",
  },
];

const DEFAULT_RELATIONS: DatabaseRelation[] = [
  {
    id: "rel-vendor-contract",
    fieldId: "fld-v-contract",
    fromTableId: "tbl-vendor",
    toTableId: "tbl-contract",
    cardinality: "one_to_many",
  },
];

const INITIAL_DATA: DatabaseData = {
  tables: DEFAULT_TABLES,
  fields: DEFAULT_FIELDS,
  records: DEFAULT_RECORDS,
  views: DEFAULT_VIEWS,
  relations: DEFAULT_RELATIONS,
};

function loadDatabaseData(): DatabaseData {
  try {
    const raw = getRaw(STORAGE_KEY);
    if (!raw) return INITIAL_DATA;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_DATA,
      ...parsed,
      tables: Array.isArray(parsed.tables) ? parsed.tables : INITIAL_DATA.tables,
      fields: Array.isArray(parsed.fields) ? parsed.fields : INITIAL_DATA.fields,
      records: Array.isArray(parsed.records) ? parsed.records : INITIAL_DATA.records,
      views: Array.isArray(parsed.views) ? parsed.views : INITIAL_DATA.views,
      relations: Array.isArray(parsed.relations) ? parsed.relations : INITIAL_DATA.relations,
    };
  } catch {
    return INITIAL_DATA;
  }
}

function saveDatabaseData(data: DatabaseData) {
  try {
    setRaw(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save Database data:", e);
  }
}

export function useDatabaseStore() {
  const [data, setData] = useState<DatabaseData>(loadDatabaseData);

  useEffect(() => {
    saveDatabaseData(data);
  }, [data]);

  // Compute cell value including Formula, Rollup, and Lookup
  const computeFieldValue = (record: DatabaseRecord, field: DatabaseField): any => {
    if (field.type === "formula" && field.config?.formulaExpression) {
      try {
        let expr = field.config.formulaExpression;
        data.fields
          .filter((f) => f.tableId === record.tableId)
          .forEach((f) => {
            const val = record.values[f.id] ?? 0;
            expr = expr.replace(new RegExp(`{${f.name}}`, "g"), String(val));
          });
        // eslint-disable-next-line no-eval
        return Function(`"use strict"; return (${expr})`)();
      } catch {
        return "#ERR!";
      }
    }

    if (field.type === "rollup" && field.config?.relationFieldId && field.config?.targetFieldId) {
      const relFieldValues = record.values[field.config.relationFieldId] || [];
      const targetRecords = data.records.filter((r) => relFieldValues.includes(r.id));
      const targetValues = targetRecords
        .map((r) => Number(r.values[field.config!.targetFieldId!]) || 0)
        .filter((n) => !isNaN(n));

      const agg: AggregationType = field.config.aggregation || "count";
      if (agg === "count") return targetValues.length;
      if (agg === "sum") return targetValues.reduce((a, b) => a + b, 0);
      if (agg === "avg") return targetValues.length ? targetValues.reduce((a, b) => a + b, 0) / targetValues.length : 0;
      if (agg === "min") return targetValues.length ? Math.min(...targetValues) : 0;
      if (agg === "max") return targetValues.length ? Math.max(...targetValues) : 0;
      return targetValues.length;
    }

    return record.values[field.id];
  };

  const addTable = (table: Omit<DatabaseTable, "id" | "createdAt" | "primaryFieldId">, primaryFieldName: string = "Name") => {
    const tableId = `tbl-${Date.now()}`;
    const primaryFieldId = `fld-p-${Date.now()}`;

    const newPrimaryField: DatabaseField = {
      id: primaryFieldId,
      tableId,
      name: primaryFieldName,
      type: "text",
      isRequired: true,
      order: 1,
    };

    const newTable: DatabaseTable = {
      ...table,
      id: tableId,
      primaryFieldId,
      createdAt: new Date().toISOString(),
    };

    const defaultView: DatabaseView = {
      id: `vw-${Date.now()}`,
      tableId,
      name: "Default Grid",
      type: "grid",
      filters: [],
      sortRules: [],
      visibleFieldIds: [primaryFieldId],
    };

    setData((prev) => ({
      ...prev,
      tables: [...prev.tables, newTable],
      fields: [...prev.fields, newPrimaryField],
      views: [...prev.views, defaultView],
    }));

    return newTable;
  };

  const updateTable = (id: string, updates: Partial<DatabaseTable>) => {
    setData((prev) => ({
      ...prev,
      tables: prev.tables.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  };

  const deleteTable = (id: string) => {
    setData((prev) => ({
      ...prev,
      tables: prev.tables.filter((t) => t.id !== id),
      fields: prev.fields.filter((f) => f.tableId !== id),
      records: prev.records.filter((r) => r.tableId !== id),
      views: prev.views.filter((v) => v.tableId !== id),
      relations: prev.relations.filter((rel) => rel.fromTableId !== id && rel.toTableId !== id),
    }));
  };

  const addField = (field: Omit<DatabaseField, "id" | "order">) => {
    const tableFields = data.fields.filter((f) => f.tableId === field.tableId);
    const order = tableFields.length + 1;
    const newField: DatabaseField = {
      ...field,
      id: `fld-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      order,
    };

    setData((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
      views: prev.views.map((v) =>
        v.tableId === field.tableId ? { ...v, visibleFieldIds: [...v.visibleFieldIds, newField.id] } : v
      ),
    }));

    return newField;
  };

  const updateField = (id: string, updates: Partial<DatabaseField>) => {
    setData((prev) => ({
      ...prev,
      fields: prev.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    }));
  };

  const deleteField = (id: string) => {
    setData((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f.id !== id),
      views: prev.views.map((v) => ({
        ...v,
        visibleFieldIds: v.visibleFieldIds.filter((fid) => fid !== id),
      })),
    }));
  };

  const addRecord = (tableId: string, initialValues: Record<string, any> = {}) => {
    const now = new Date().toISOString();
    const newRecord: DatabaseRecord = {
      id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      tableId,
      values: initialValues,
      createdAt: now,
      updatedAt: now,
    };

    setData((prev) => ({
      ...prev,
      records: [newRecord, ...prev.records],
    }));

    return newRecord;
  };

  const updateRecordValue = (recordId: string, fieldId: string, value: any) => {
    setData((prev) => ({
      ...prev,
      records: prev.records.map((r) =>
        r.id === recordId
          ? {
              ...r,
              values: { ...r.values, [fieldId]: value },
              updatedAt: new Date().toISOString(),
            }
          : r
      ),
    }));
  };

  const deleteRecord = (recordId: string) => {
    setData((prev) => ({
      ...prev,
      records: prev.records.filter((r) => r.id !== recordId),
    }));
  };

  const addView = (view: Omit<DatabaseView, "id">) => {
    const newView: DatabaseView = {
      ...view,
      id: `vw-${Date.now()}`,
    };
    setData((prev) => ({
      ...prev,
      views: [...prev.views, newView],
    }));
    return newView;
  };

  const updateView = (id: string, updates: Partial<DatabaseView>) => {
    setData((prev) => ({
      ...prev,
      views: prev.views.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    }));
  };

  const deleteView = (id: string) => {
    setData((prev) => ({
      ...prev,
      views: prev.views.filter((v) => v.id !== id),
    }));
  };

  return {
    data,
    tables: data.tables,
    fields: data.fields,
    records: data.records,
    views: data.views,
    relations: data.relations,
    computeFieldValue,
    addTable,
    updateTable,
    deleteTable,
    addField,
    updateField,
    deleteField,
    addRecord,
    updateRecordValue,
    deleteRecord,
    addView,
    updateView,
    deleteView,
  };
}
