import React, { useState, useEffect, useMemo } from "react";
import {
  Code as CodeIcon,
  Plus,
  Search,
  Copy,
  Check,
  Download,
  Trash2,
  Terminal,
  CheckCircle2,
  User,
} from "lucide-react";
import { cn } from "../../lib/utils";

export interface CodeSnippet {
  id: string;
  title: string;
  language: "sql" | "python" | "typescript" | "bash" | "json";
  category: "Finansial" | "Analitik" | "API" | "DevOps" | "Database";
  client?: string;
  description: string;
  code: string;
  updatedAt: string;
}

const INITIAL_SNIPPETS: CodeSnippet[] = [
  {
    id: "snip-1",
    title: "Customer Cohort Retention & Churn Matrix (PostgreSQL)",
    language: "sql",
    category: "Analitik",
    client: "PT Indo Surya Retail",
    description:
      "Query analitis untuk menghitung persentase retensi cohort bulanan dan mengidentifikasi periode churn kritis pelanggan.",
    code: `-- Analisis Cohort Bulanan Pelanggan (PostgreSQL / BigQuery)
WITH user_first_order AS (
    SELECT 
        customer_id,
        DATE_TRUNC('month', MIN(order_date)) AS cohort_month
    FROM orders
    WHERE status = 'COMPLETED'
    GROUP BY customer_id
),
monthly_activity AS (
    SELECT 
        o.customer_id,
        DATE_TRUNC('month', o.order_date) AS activity_month
    FROM orders o
    WHERE o.status = 'COMPLETED'
    GROUP BY o.customer_id, DATE_TRUNC('month', o.order_date)
),
cohort_size AS (
    SELECT 
        cohort_month,
        COUNT(DISTINCT customer_id) AS total_users
    FROM user_first_order
    GROUP BY cohort_month
)
SELECT 
    c.cohort_month::DATE,
    cs.total_users AS cohort_size,
    (EXTRACT(YEAR FROM a.activity_month) - EXTRACT(YEAR FROM c.cohort_month)) * 12 +
    (EXTRACT(MONTH FROM a.activity_month) - EXTRACT(MONTH FROM c.cohort_month)) AS month_number,
    COUNT(DISTINCT a.customer_id) AS active_users,
    ROUND((COUNT(DISTINCT a.customer_id)::DECIMAL / cs.total_users) * 100, 2) AS retention_rate_pct
FROM user_first_order c
JOIN monthly_activity a ON c.customer_id = a.customer_id
JOIN cohort_size cs ON c.cohort_month = cs.cohort_month
GROUP BY c.cohort_month, cs.total_users, a.activity_month
ORDER BY c.cohort_month, month_number;`,
    updatedAt: "2026-09-18 11:30",
  },
  {
    id: "snip-2",
    title: "DCF Valuation & WACC Sensitivity Analysis Table",
    language: "python",
    category: "Finansial",
    client: "Bank Mitra Syariah",
    description:
      "Skrip analisis valuasi arus kas terdiskon (DCF) dilengkapi matriks sensitivitas variasi WACC dan terminal growth rate.",
    code: `import numpy as np
import pandas as pd

def calculate_dcf(fcf_projections, wacc, terminal_growth, cash, debt, shares_outstanding):
    """
    Menghitung Enterprise Value & Implied Share Price berbasis DCF
    """
    years = np.arange(1, len(fcf_projections) + 1)
    discount_factors = 1 / ((1 + wacc) ** years)
    pv_fcf = fcf_projections * discount_factors
    
    # Terminal Value (Gordon Growth Model)
    last_fcf = fcf_projections[-1]
    terminal_value = (last_fcf * (1 + terminal_growth)) / (wacc - terminal_growth)
    pv_terminal_value = terminal_value / ((1 + wacc) ** len(fcf_projections))
    
    enterprise_value = np.sum(pv_fcf) + pv_terminal_value
    equity_value = enterprise_value + cash - debt
    implied_price = equity_value / shares_outstanding
    
    return {
        "Enterprise_Value": round(enterprise_value, 2),
        "Equity_Value": round(equity_value, 2),
        "Implied_Share_Price": round(implied_price, 2)
    }

# Proyeksi Arus Kas Bebas 5 Tahun (IDR Miliar)
fcf_5yr = np.array([45.0, 52.5, 61.0, 70.2, 80.5])

# Parameter Valuasi
wacc_range = [0.09, 0.10, 0.11, 0.12]
growth_range = [0.02, 0.025, 0.03]

sensitivity_matrix = []
for w in wacc_range:
    row = []
    for g in growth_range:
        res = calculate_dcf(fcf_5yr, w, g, cash=20.0, debt=50.0, shares_outstanding=100.0)
        row.append(res["Implied_Share_Price"])
    sensitivity_matrix.append(row)

df_sens = pd.DataFrame(
    sensitivity_matrix, 
    index=[f"WACC {int(w*100)}%" for w in wacc_range],
    columns=[f"g {round(g*100, 1)}%" for g in growth_range]
)

print("=== Matriks Sensitivitas Harga Saham Terimplikasi ===")
print(df_sens)`,
    updatedAt: "2026-09-17 15:45",
  },
  {
    id: "snip-3",
    title: "Resilient API Client with Exponential Backoff & Jitter",
    language: "typescript",
    category: "API",
    client: "Nusantara Logistics Core",
    description:
      "Utility fetch wrapper tahan gagal dengan mekanisme retry eksponensial, timeout otomatis, dan token refresh.",
    code: `interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  timeoutMs?: number;
}

export async function fetchWithBackoff<T = unknown>(
  url: string,
  options: RequestInit = {},
  retryOpts: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelayMs = 400,
    maxDelayMs = 5000,
    timeoutMs = 8000,
  } = retryOpts;

  let attempt = 0;

  while (attempt <= maxRetries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      // Status 429 (Rate Limit) atau 5xx (Server Error) layak di-retry
      if (!response.ok) {
        if (response.status === 429 || (response.status >= 500 && response.status <= 599)) {
          throw new Error(\`Transient HTTP error: \${response.status}\`);
        }
        // Error klien (4xx) tidak perlu di-retry
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || \`HTTP Request failed with status \${response.status}\`);
      }

      return (await response.json()) as T;
    } catch (err: any) {
      clearTimeout(timeoutId);
      attempt++;

      if (attempt > maxRetries) {
        throw new Error(\`Request to \${url} failed after \${maxRetries} retries: \${err.message}\`);
      }

      // Hitung jeda backoff eksponensial dengan full jitter acak
      const expDelay = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt));
      const jitter = Math.random() * expDelay;
      console.warn(\`[Retry \${attempt}/\${maxRetries}] Menunggu \${Math.round(jitter)}ms...\`);
      
      await new Promise((resolve) => setTimeout(resolve, jitter));
    }
  }

  throw new Error("Unexpected loop exit in backoff client.");
}`,
    updatedAt: "2026-09-19 08:15",
  },
  {
    id: "snip-4",
    title: "Unit Economics & Contribution Margin per Client Tier",
    language: "sql",
    category: "Database",
    client: "Samudra Maritim Lines",
    description:
      "Menghitung margin kontribusi bersih per kategori pelanggan dengan memperhitungkan biaya langsung tenaga ahli.",
    code: `-- Menghitung Gross Margin dan Profitability per Proyek Klien
SELECT 
    p.client_name,
    p.project_category,
    COUNT(DISTINCT p.project_id) AS total_projects,
    SUM(p.contract_value_idr) AS gross_revenue_idr,
    SUM(t.billable_hours * t.hourly_cost_idr) AS direct_labor_cost_idr,
    SUM(p.third_party_expenses_idr) AS direct_expenses_idr,
    
    -- Margin Kontribusi (Revenue - Direct Costs)
    (SUM(p.contract_value_idr) - (SUM(t.billable_hours * t.hourly_cost_idr) + SUM(p.third_party_expenses_idr))) 
        AS contribution_margin_idr,
        
    -- Persentase Margin Kontribusi
    ROUND(
        ((SUM(p.contract_value_idr) - (SUM(t.billable_hours * t.hourly_cost_idr) + SUM(p.third_party_expenses_idr))) 
        / NULLIF(SUM(p.contract_value_idr), 0)) * 100, 
        2
    ) AS contribution_margin_pct

FROM consulting_projects p
LEFT JOIN consultant_timesheets t ON p.project_id = t.project_id
WHERE p.fiscal_year = 2026 AND p.status IN ('ACTIVE', 'COMPLETED')
GROUP BY p.client_name, p.project_category
HAVING SUM(p.contract_value_idr) > 100000000
ORDER BY contribution_margin_idr DESC;`,
    updatedAt: "2026-09-16 13:20",
  },
  {
    id: "snip-5",
    title: "PostgreSQL Automated Dump, Compress, & S3 Sync Script",
    language: "bash",
    category: "DevOps",
    client: "Infrastruktur Internal",
    description:
      "Automasi backup database harian terkompresi dengan rotasi retensi 30 hari untuk mencegah disk penuh.",
    code: `#!/usr/bin/env bash
set -eo pipefail

# Konfigurasi Backup
BACKUP_DIR="/var/backups/postgres"
DATE_STR=$(date +"%Y%m%d_%H%M%S")
DB_NAME="\${DB_NAME:-aio_consulting_db}"
DB_USER="\${DB_USER:-postgres}"
DB_HOST="\${DB_HOST:-localhost}"
S3_BUCKET="s3://backup-vault-consulting/databases"
RETENTION_DAYS=30

mkdir -p "\${BACKUP_DIR}"
BACKUP_FILE="\${BACKUP_DIR}/\${DB_NAME}_\${DATE_STR}.sql.gz"

echo "=== [1/4] Memulai pg_dump untuk database: \${DB_NAME} ==="
PGPASSWORD="\${DB_PASSWORD}" pg_dump -h "\${DB_HOST}" -U "\${DB_USER}" -d "\${DB_NAME}" --clean --if-exists | gzip -9 > "\${BACKUP_FILE}"

echo "=== [2/4] Verifikasi integritas ukuran file backup ==="
FILE_SIZE=$(stat -c%s "\${BACKUP_FILE}")
if [ "\${FILE_SIZE}" -lt 1024 ]; then
    echo "ERROR: File backup terlalu kecil (\${FILE_SIZE} bytes). Indikasi gagal!"
    exit 1
fi
echo "Backup berhasil dibuat: \${BACKUP_FILE} (\$(du -h "\${BACKUP_FILE}" | cut -f1))"

echo "=== [3/4] Sinkronisasi ke S3 Cloud Storage ==="
aws s3 cp "\${BACKUP_FILE}" "\${S3_BUCKET}/\${DB_NAME}/\${DB_NAME}_\${DATE_STR}.sql.gz" --storage-class STANDARD_IA

echo "=== [4/4] Pembersihan file backup lokal yang lebih dari \${RETENTION_DAYS} hari ==="
find "\${BACKUP_DIR}" -name "\${DB_NAME}_*.sql.gz" -mtime +\${RETENTION_DAYS} -delete

echo "✅ Sukses: Seluruh proses backup selesai pada $(date)"`,
    updatedAt: "2026-09-14 09:10",
  },
  {
    id: "snip-6",
    title: "Standardized Consulting API Response Contract",
    language: "json",
    category: "API",
    client: "Enterprise Microservices",
    description:
      "Skema payload JSON baku untuk integrasi handoff endpoint sistem klien dengan standar envelop meta & pagination.",
    code: `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "ConsultingAPIResponseContract",
  "type": "object",
  "required": ["success", "timestamp", "data"],
  "properties": {
    "success": {
      "type": "boolean",
      "description": "Status eksekusi permintaan API (true/false)"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "example": "2026-09-19T13:30:00.000Z"
    },
    "data": {
      "type": "object",
      "properties": {
        "reportId": { "type": "string", "example": "REP-2026-089" },
        "clientCode": { "type": "string", "example": "PT-INDOSURYA" },
        "totalValuationIdr": { "type": "number", "example": 45000000000 },
        "auditStatus": { "type": "string", "enum": ["PENDING", "VERIFIED", "REJECTED"] }
      }
    },
    "pagination": {
      "type": "object",
      "properties": {
        "currentPage": { "type": "integer", "example": 1 },
        "pageSize": { "type": "integer", "example": 20 },
        "totalPages": { "type": "integer", "example": 5 },
        "totalRecords": { "type": "integer", "example": 98 }
      }
    },
    "errors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "field": { "type": "string" },
          "message": { "type": "string" }
        }
      }
    }
  }
}`,
    updatedAt: "2026-09-15 17:00",
  },
];

export function CodeView() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>(() => {
    try {
      const saved = localStorage.getItem("aio_code_snippets_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_SNIPPETS;
  });

  const [selectedId, setSelectedId] = useState<string>(snippets[0]?.id || "snip-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLang, setSelectedLang] = useState<string>("Semua");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form State for New/Edit Snippet
  const [formData, setFormData] = useState<Omit<CodeSnippet, "id" | "updatedAt">>({
    title: "",
    language: "sql",
    category: "Analitik",
    client: "",
    description: "",
    code: "",
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("aio_code_snippets_v1", JSON.stringify(snippets));
    } catch (e) {
      console.error("Failed to save snippets", e);
    }
  }, [snippets]);

  const activeSnippet = useMemo(() => {
    return snippets.find((s) => s.id === selectedId) || snippets[0] || null;
  }, [snippets, selectedId]);

  const filteredSnippets = useMemo(() => {
    return snippets.filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        (s.client && s.client.toLowerCase().includes(q)) ||
        s.code.toLowerCase().includes(q);
      const matchLang = selectedLang === "Semua" || s.language === selectedLang.toLowerCase();
      const matchCat = selectedCategory === "Semua" || s.category === selectedCategory;
      return matchSearch && matchLang && matchCat;
    });
  }, [snippets, searchQuery, selectedLang, selectedCategory]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: snippets.length,
      sql: snippets.filter((s) => s.language === "sql").length,
      python: snippets.filter((s) => s.language === "python").length,
      ts: snippets.filter((s) => s.language === "typescript").length,
    };
  }, [snippets]);

  // Copy code with feedback
  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Download code as file
  const handleDownload = (snippet: CodeSnippet) => {
    const extMap: Record<string, string> = {
      sql: "sql",
      python: "py",
      typescript: "ts",
      bash: "sh",
      json: "json",
    };
    const ext = extMap[snippet.language] || "txt";
    const blob = new Blob([snippet.code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${snippet.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Delete snippet
  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm("Hapus snippet kode ini?")) {
      const updated = snippets.filter((s) => s.id !== id);
      setSnippets(updated);
      if (selectedId === id && updated.length > 0) {
        setSelectedId(updated[0].id);
      }
    }
  };

  // Submit new snippet
  const handleCreateSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.code.trim()) {
      alert("Mohon isi judul dan kode snippet.");
      return;
    }

    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newSnippet: CodeSnippet = {
      id: `snip-${Date.now()}`,
      ...formData,
      updatedAt: formatted,
    };

    setSnippets([newSnippet, ...snippets]);
    setSelectedId(newSnippet.id);
    setShowNewModal(false);
    setFormData({
      title: "",
      language: "sql",
      category: "Analitik",
      client: "",
      description: "",
      code: "",
    });
  };

  // Language badge styling helper
  const getLanguageColor = (lang: string) => {
    switch (lang.toLowerCase()) {
      case "sql":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-900";
      case "python":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900";
      case "typescript":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-900";
      case "bash":
        return "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200 dark:border-purple-900";
      case "json":
        return "bg-muted text-foreground dark:bg-card dark:text-foreground border-border dark:border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full flex flex-col space-y-7">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-xl">
              <CodeIcon size={22} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Code Snippet Vault</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Penyimpanan terpusat skrip SQL, pemodelan keuangan Python, utilitas API, dan automasi teknis untuk konsultansi klien.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setFormData({
                title: "",
                language: "sql",
                category: "Analitik",
                client: "",
                description: "",
                code: "",
              });
              setShowNewModal(true);
            }}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20"
          >
            <Plus size={16} />
            <span>Snippet Baru</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Total Snippet</span>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Query SQL</span>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.sql}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Skrip Python</span>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.python}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">TypeScript / API</span>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.ts}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari snippet, query SQL, atau kata kunci (⌘K)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-card border border-border text-foreground outline-hidden focus:border-indigo-500 placeholder:text-muted-foreground"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border text-xs">
            {["Semua", "SQL", "Python", "TypeScript", "Bash", "JSON"].map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap",
                  selectedLang === lang
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {lang}
              </button>
            ))}
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-border bg-card text-xs text-foreground outline-hidden"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Analitik">Analitik</option>
            <option value="Finansial">Finansial</option>
            <option value="API">API</option>
            <option value="DevOps">DevOps</option>
            <option value="Database">Database</option>
          </select>
        </div>
      </div>

      {/* Master-Detail Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Snippets List (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-3 max-h-[750px] overflow-y-auto pr-1">
          {filteredSnippets.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-border rounded-2xl bg-card">
              <Terminal size={32} className="text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">Snippet tidak ditemukan</p>
              <p className="text-xs text-muted-foreground mt-1">Coba ganti filter atau buat snippet baru.</p>
            </div>
          ) : (
            filteredSnippets.map((snippet) => {
              const isSelected = activeSnippet?.id === snippet.id;
              return (
                <div
                  key={snippet.id}
                  onClick={() => {
                    setSelectedId(snippet.id);
                    setIsEditing(false);
                  }}
                  className={cn(
                    "p-4 rounded-2xl border transition-all cursor-pointer text-left relative",
                    isSelected
                      ? "bg-card border-indigo-500 shadow-sm ring-1 ring-indigo-500/20"
                      : "bg-card/70 hover:bg-card border-border hover:border-border/90"
                  )}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={cn(
                        "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border",
                        getLanguageColor(snippet.language)
                      )}
                    >
                      {snippet.language}
                    </span>

                    <span className="text-[11px] text-muted-foreground font-medium">
                      {snippet.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-foreground line-clamp-1">
                    {snippet.title}
                  </h3>

                  {snippet.client && (
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1">
                      <User size={11} />
                      <span className="line-clamp-1">{snippet.client}</span>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                    {snippet.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/50 text-[11px] text-muted-foreground">
                    <span>{snippet.code.split("\n").length} baris</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(snippet.code, snippet.id);
                      }}
                      className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                    >
                      {copiedId === snippet.id ? (
                        <>
                          <Check size={12} className="text-emerald-500" />
                          <span className="text-emerald-600">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Salin Cepat</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Active Snippet Code Inspector & Runner (7 Cols) */}
        <div className="lg:col-span-7 bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col">
          {activeSnippet ? (
            <>
              {/* Inspector Header */}
              <div className="p-4 sm:p-5 border-b border-border bg-muted/20 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        "text-[11px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border",
                        getLanguageColor(activeSnippet.language)
                      )}
                    >
                      {activeSnippet.language}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {activeSnippet.category}
                    </span>
                    {activeSnippet.client && (
                      <span className="text-xs text-muted-foreground/80 font-medium">
                        • {activeSnippet.client}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-foreground">{activeSnippet.title}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{activeSnippet.description}</p>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(activeSnippet.code, activeSnippet.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
                  >
                    {copiedId === activeSnippet.id ? (
                      <>
                        <Check size={14} className="text-emerald-300" />
                        <span>Tersalin ke Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Salin Kode</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDownload(activeSnippet)}
                    title="Unduh file kode"
                    className="p-1.5 rounded-lg border border-border hover:bg-muted text-foreground transition-colors"
                  >
                    <Download size={15} />
                  </button>

                  <button
                    onClick={() => handleDelete(activeSnippet.id)}
                    title="Hapus snippet"
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Code Container with Line Numbers */}
              <div className="relative bg-background text-foreground p-4 sm:p-5 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed max-h-[580px] overflow-y-auto">
                <div className="flex">
                  {/* Line Number Column */}
                  <div className="select-none text-muted-foreground pr-4 text-right border-r border-border shrink-0 font-mono text-xs">
                    {activeSnippet.code.split("\n").map((_, i) => (
                      <div key={i} className="leading-6">
                        {i + 1}
                      </div>
                    ))}
                  </div>

                  {/* Code Body Column */}
                  <pre className="pl-4 overflow-x-auto whitespace-pre font-mono text-xs sm:text-sm leading-6 flex-1">
                    <code>
                      {activeSnippet.code.split("\n").map((line, i) => {
                        // Parameter highlight {{EXAMPLE}}
                        if (line.includes("{{") && line.includes("}}")) {
                          return (
                            <div key={i} className="bg-amber-950/30 px-1 rounded-sm">
                              {line}
                            </div>
                          );
                        }
                        // Comments highlight
                        if (line.trim().startsWith("--") || line.trim().startsWith("#") || line.trim().startsWith("//")) {
                          return (
                            <div key={i} className="text-muted-foreground italic">
                              {line}
                            </div>
                          );
                        }
                        return <div key={i}>{line}</div>;
                      })}
                    </code>
                  </pre>
                </div>
              </div>

              {/* Footer bar */}
              <div className="px-5 py-3 border-t border-border bg-muted/10 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="font-mono">{activeSnippet.code.length} karakter</span>
                  <span>•</span>
                  <span>Diperbarui: {activeSnippet.updatedAt}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                  <CheckCircle2 size={13} />
                  <span>Format Terverifikasi</span>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              <CodeIcon size={36} className="mx-auto mb-2 opacity-50" />
              <p>Pilih snippet di panel kiri untuk melihat kode</p>
            </div>
          )}
        </div>
      </div>

      {/* New Snippet Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <CodeIcon size={20} className="text-indigo-600" />
                <h3 className="text-lg font-bold text-foreground">Tambah Snippet Kode Baru</h3>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-medium"
              >
                Tutup ✕
              </button>
            </div>

            <form onSubmit={handleCreateSnippet} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Judul Snippet *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="misal: Query Retensi Cohort 90 Hari"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Bahasa *
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        language: e.target.value as CodeSnippet["language"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-indigo-500"
                  >
                    <option value="sql">SQL</option>
                    <option value="python">Python</option>
                    <option value="typescript">TypeScript</option>
                    <option value="bash">Bash / Shell</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as CodeSnippet["category"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-indigo-500"
                  >
                    <option value="Analitik">Analitik</option>
                    <option value="Finansial">Finansial</option>
                    <option value="API">API</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Database">Database</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Nama Klien / Proyek (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.client || ""}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="misal: PT Bank Mandiri Syariah"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Deskripsi Fungsi Singkat
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Kegunaan snippet ini dalam proyek atau analisis..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Kode Sumber *
                </label>
                <textarea
                  required
                  rows={8}
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Tempel atau ketik kode di sini..."
                  className="w-full p-3 font-mono text-xs rounded-xl bg-background text-foreground border border-border outline-hidden focus:border-indigo-500 leading-relaxed resize-none"
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
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
                >
                  Simpan Snippet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
