import React, { useState, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  LineChart,
  Plus,
  Search,
  BellRing,
  Download,
  LayoutGrid,
} from "lucide-react";
import { useStatisticsStore } from "./store";
import { AlertSeverity, AlertCondition } from "./types";
import { useShellSections } from "@/app/shell-sections";
import { ShellHeader } from "@/app/shell-header";

type ViewTab = "cockpit" | "catalog" | "correlations" | "alerts" | "report";

export function StatisticsApp() {
  const {
    metrics,
    dashboards,
    selectedDashboardId,
    alertRules,
    correlations,
    timeSeriesData,
    createAlertRule,
    toggleAlertRule,
    deleteAlertRule,
  } = useStatisticsStore();

  const [activeTab, setActiveTab] = useState<ViewTab>("cockpit");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useShellSections([
    { id: "cockpit", label: "Executive Cockpit", icon: LayoutGrid, active: activeTab === "cockpit", onSelect: () => setActiveTab("cockpit") },
    { id: "catalog", label: `Metric Catalog (${metrics.length})`, icon: BarChart3, active: activeTab === "catalog", onSelect: () => setActiveTab("catalog") },
    { id: "correlations", label: "Correlations & Trends", icon: LineChart, active: activeTab === "correlations", onSelect: () => setActiveTab("correlations") },
    { id: "alerts", label: `Alerts (${alertRules.length})`, icon: BellRing, active: activeTab === "alerts", onSelect: () => setActiveTab("alerts") },
    { id: "report", label: "Snapshot Export", icon: Download, active: activeTab === "report", onSelect: () => setActiveTab("report") },
  ]);

  // Modals
  const [isNewAlertOpen, setIsNewAlertOpen] = useState(false);
  const [alertMetricId, setAlertMetricId] = useState(metrics[0]?.id || "");
  const [alertCondition, setAlertCondition] = useState<AlertCondition>("less_than");
  const [alertThreshold, setAlertThreshold] = useState(80);
  const [alertSeverity, setAlertSeverity] = useState<AlertSeverity>("warning");
  const [alertChannel, setAlertChannel] = useState("#engineering-leads");

  // Active Dashboard
  const currentDashboard = useMemo(() => {
    return dashboards.find((d) => d.id === selectedDashboardId) || dashboards[0] || null;
  }, [dashboards, selectedDashboardId]);

  // Filtered metrics
  const filteredMetrics = useMemo(() => {
    return metrics.filter((m) => {
      const matchCat = categoryFilter === "all" || m.category === categoryFilter;
      const matchSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [metrics, categoryFilter, searchQuery]);

  // Stats calculation per specification
  const stats = useMemo(() => {
    const totalMetrics = metrics.length;
    const totalDashboards = dashboards.length;
    const activeAlerts = alertRules.filter((a) => a.isActive).length;
    const triggeredCount = alertRules.filter((a) => a.lastTriggeredAt).length;

    return {
      totalMetrics,
      totalDashboards,
      activeAlerts,
      triggeredCount,
      freshnessLag: "< 3s real-time",
    };
  }, [metrics, dashboards, alertRules]);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const met = metrics.find((m) => m.id === alertMetricId);
    if (!met) return;

    createAlertRule({
      metricId: met.id,
      metricName: met.name,
      condition: alertCondition,
      threshold: Number(alertThreshold),
      severity: alertSeverity,
      notifyChannels: [alertChannel],
    });

    setIsNewAlertOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Header Actions in Floating Pill */}
      <ShellHeader>
        <div className="flex items-center gap-1.5 shrink-0">
          {/* View Tab Switchers - Compact Segmented Icon Pills */}
          <div className="flex items-center gap-0.5 border border-border/60 rounded-lg p-0.5 bg-muted/70 text-xs shrink-0">
            {[
              { id: "cockpit", label: "Executive Cockpit", icon: LayoutGrid },
              { id: "catalog", label: `Metric Catalog (${metrics.length})`, icon: BarChart3 },
              { id: "correlations", label: "Correlations & Trends", icon: LineChart },
              { id: "alerts", label: `Alerts (${alertRules.length})`, icon: BellRing },
              { id: "report", label: "Snapshot Export", icon: Download },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ViewTab)}
                  title={tab.label}
                  aria-label={tab.label}
                  className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-background text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsNewAlertOpen(true)}
            title="Buat Aturan Alert Baru"
            aria-label="Set Alert Rule"
            className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0 flex items-center justify-center"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </ShellHeader>

      {/* Top Header */}
      <div className="border-b border-border bg-background/70 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              #24 Statistics
            </span>
            <span className="text-xs text-muted-foreground">Cross-App Metric Aggregator • Time Series, Trends & Threshold Alerts</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1 flex items-center gap-3">
            Operational Intelligence
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              Ecosystem Data Freshness: {stats.freshnessLag}
            </span>
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {/* TAB 1: EXECUTIVE COCKPIT */}
        {activeTab === "cockpit" && currentDashboard && (
          <div className="space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {metrics.slice(0, 3).map((met) => {
                const diff = met.previousValue ? met.currentValue - met.previousValue : 0;
                const isPositive = diff >= 0;

                return (
                  <div key={met.id} className="bg-background border border-border rounded-xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-card px-2 py-0.5 rounded">
                        {met.category}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        Target: {met.targetValue} {met.unit}
                      </span>
                    </div>

                    <div>
                      <div className="text-3xl font-extrabold text-white">
                        {met.currentValue} <span className="text-sm font-normal text-muted-foreground">{met.unit}</span>
                      </div>
                      <h4 className="font-semibold text-sm text-foreground mt-1">{met.name}</h4>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-3 border-t border-border/80">
                      <span className={`flex items-center gap-1 font-semibold ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {isPositive ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`} vs last cycle
                      </span>
                      <span className="text-muted-foreground text-[11px]">from {met.sourceApps[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time Series Multi-Line Progress Visualizer */}
            <div className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-emerald-400" />
                    Multi-Metric Time Series Trajectory (Past 4 Weeks)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Normalized tracking of productivity, deliverable compliance, and SLA adherence.
                  </p>
                </div>
              </div>

              {/* Chart Visual Simulation */}
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-border">
                {["Week 1 (09-01)", "Week 2 (09-08)", "Week 3 (09-15)", "Week 4 (09-22)"].map((wk, idx) => (
                  <div key={wk} className="bg-background p-4 rounded-xl border border-border/80 space-y-3">
                    <span className="text-xs font-mono font-bold text-emerald-400">{wk}</span>
                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between text-muted-foreground text-[11px] mb-1">
                          <span>Velocity</span>
                          <span className="text-white font-mono">{timeSeriesData["m-prod-comp"]?.[idx]?.value || 40} t/wk</span>
                        </div>
                        <div className="w-full bg-card h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-cyan-500 h-full rounded-full"
                            style={{ width: `${((timeSeriesData["m-prod-comp"]?.[idx]?.value || 40) / 50) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-muted-foreground text-[11px] mb-1">
                          <span>DoD Compliance</span>
                          <span className="text-white font-mono">{timeSeriesData["m-dod-compliance"]?.[idx]?.value || 85}%</span>
                        </div>
                        <div className="w-full bg-card h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${timeSeriesData["m-dod-compliance"]?.[idx]?.value || 85}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-muted-foreground text-[11px] mb-1">
                          <span>Workflow SLA</span>
                          <span className="text-white font-mono">{timeSeriesData["m-sla-pipeline"]?.[idx]?.value || 80}%</span>
                        </div>
                        <div className="w-full bg-card h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-violet-500 h-full rounded-full"
                            style={{ width: `${timeSeriesData["m-sla-pipeline"]?.[idx]?.value || 80}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: METRIC CATALOG */}
        {activeTab === "catalog" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-background p-4 rounded-xl border border-border">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search catalog metrics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-foreground border border-border rounded-lg px-3 py-1.5 text-xs text-background w-full"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-semibold uppercase">Category:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-foreground border border-border text-xs rounded-lg px-2.5 py-1 text-background font-semibold"
                >
                  <option value="all">All Categories</option>
                  <option value="productivity">Productivity</option>
                  <option value="quality">Quality</option>
                  <option value="operational">Operational</option>
                  <option value="financial">Financial</option>
                </select>
              </div>
            </div>

            <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-card/80 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Metric Name & Description</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Calculation</th>
                    <th className="py-3 px-4 font-semibold">Current Value</th>
                    <th className="py-3 px-4 font-semibold">Target Value</th>
                    <th className="py-3 px-4 font-semibold">Source Ecosystem Apps</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {filteredMetrics.map((met) => (
                    <tr key={met.id} className="hover:bg-card/40 transition">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{met.name}</div>
                        <div className="text-muted-foreground text-[11px] leading-relaxed">{met.description}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-card text-foreground">
                          {met.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground">{met.calculationMethod}</td>
                      <td className="py-3 px-4 font-bold text-emerald-400 font-mono">
                        {met.currentValue} {met.unit}
                      </td>
                      <td className="py-3 px-4 font-mono text-foreground">
                        {met.targetValue ? `${met.targetValue} ${met.unit}` : "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {met.sourceApps.map((app) => (
                            <span key={app} className="text-[10px] bg-background px-2 py-0.5 rounded font-mono text-muted-foreground border border-border">
                              {app}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CORRELATIONS & TRENDS */}
        {activeTab === "correlations" && (
          <div className="bg-background border border-border rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Cross-Metric Statistical Correlations</h2>
              <p className="text-xs text-muted-foreground">
                Automated statistical regression discovering hidden operational dependencies between apps.
              </p>
            </div>

            <div className="space-y-4">
              {correlations.map((c, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-background border border-border space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white text-sm">{c.metricA}</span>
                      <span className="text-muted-foreground">↔</span>
                      <span className="font-bold text-white text-sm">{c.metricB}</span>
                    </div>

                    <span className="px-3 py-1 rounded-full font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Score: r = {c.correlationScore}
                    </span>
                  </div>

                  <p className="text-foreground leading-relaxed bg-background p-3 rounded-lg border border-border/80">
                    💡 <strong>Operational Insight:</strong> {c.insight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ALERTS MANAGEMENT */}
        {activeTab === "alerts" && (
          <div className="bg-background border border-border rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Configured Threshold Alert Rules</h2>
                <p className="text-xs text-muted-foreground">
                  Real-time monitors triggering warnings when critical SLA or quality thresholds are breached.
                </p>
              </div>

              <button
                onClick={() => setIsNewAlertOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> New Alert Rule
              </button>
            </div>

            <div className="space-y-3">
              {alertRules.map((alt) => (
                <div
                  key={alt.id}
                  className="p-4 rounded-xl bg-card/40 border border-border/60 flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        alt.severity === "critical"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}>
                        {alt.severity}
                      </span>
                      <span className="font-bold text-white text-sm">{alt.metricName}</span>
                    </div>
                    <div className="text-muted-foreground">
                      Condition: Trigger when value is <strong>{alt.condition.replace("_", " ")} {alt.threshold}</strong>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Dispatched to: {alt.notifyChannels.join(", ")}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleAlertRule(alt.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold border ${
                        alt.isActive
                          ? "bg-emerald-950/60 border-emerald-700 text-emerald-300"
                          : "bg-card border-border text-muted-foreground"
                      }`}
                    >
                      {alt.isActive ? "Active Monitoring" : "Muted"}
                    </button>

                    <button
                      onClick={() => deleteAlertRule(alt.id)}
                      className="text-muted-foreground hover:text-rose-400 p-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: REPORT GENERATOR */}
        {activeTab === "report" && (
          <div className="max-w-3xl mx-auto bg-background border border-border rounded-2xl p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400">Executive Brief</span>
                <h2 className="text-xl font-bold text-white mt-1">Ecosystem Operational Snapshot</h2>
                <div className="text-xs text-muted-foreground mt-1">Generated for: PT Nusantara Digital Workspace • Date: 2026-09-24</div>
              </div>

              <button
                onClick={() => alert("Report downloaded as consolidated audit PDF snapshot.")}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export Report
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-white text-sm">Key Metric Benchmarks</h3>
              <div className="grid grid-cols-2 gap-3">
                {metrics.map((m) => (
                  <div key={m.id} className="bg-background p-3 rounded-lg border border-border flex justify-between">
                    <span className="text-foreground">{m.name}:</span>
                    <span className="font-mono font-bold text-emerald-400">{m.currentValue} {m.unit}</span>
                  </div>
                ))}
              </div>

              <h3 className="font-bold text-white text-sm pt-2">Executive Summary</h3>
              <p className="text-foreground leading-relaxed">
                Overall system velocity is trending upward (+21% sprint over sprint). Deliverable definition-of-done compliance has reached 92%, satisfying the minimum required threshold of 85%. Automated regression shows that thorough DoD acceptance reduces subsequent bug reports by 44%.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* New Alert Modal */}
      {isNewAlertOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create Metric Threshold Alert</h3>

            <form onSubmit={handleCreateAlert} className="space-y-4 text-xs">
              <div>
                <label className="block text-foreground mb-1 font-medium">Target Metric</label>
                <select
                  value={alertMetricId}
                  onChange={(e) => setAlertMetricId(e.target.value)}
                  className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                >
                  {metrics.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-foreground mb-1 font-medium">Condition</label>
                  <select
                    value={alertCondition}
                    onChange={(e) => setAlertCondition(e.target.value as AlertCondition)}
                    className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                  >
                    <option value="less_than">Less than</option>
                    <option value="greater_than">Greater than</option>
                  </select>
                </div>

                <div>
                  <label className="block text-foreground mb-1 font-medium">Threshold</label>
                  <input
                    type="number"
                    value={alertThreshold}
                    onChange={(e) => setAlertThreshold(Number(e.target.value))}
                    className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                  />
                </div>
              </div>

              <div>
                <label className="block text-foreground mb-1 font-medium">Severity</label>
                <select
                  value={alertSeverity}
                  onChange={(e) => setAlertSeverity(e.target.value as AlertSeverity)}
                  className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                >
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-foreground mb-1 font-medium">Notify Channel</label>
                <input
                  type="text"
                  value={alertChannel}
                  onChange={(e) => setAlertChannel(e.target.value)}
                  className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsNewAlertOpen(false)}
                  className="px-4 py-2 rounded-lg bg-card hover:bg-card text-foreground font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Create Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
