import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWorkspaceStorage } from "../../core/persistStorage";
import {
  Metric,
  Dashboard,
  Widget,
  AlertRule,
  CorrelationAnalysis,
  MetricTimeSeriesPoint,
} from "./types";

interface StatisticsStore {
  metrics: Metric[];
  dashboards: Dashboard[];
  selectedDashboardId: string | null;
  alertRules: AlertRule[];
  correlations: CorrelationAnalysis[];
  timeSeriesData: Record<string, MetricTimeSeriesPoint[]>;

  setSelectedDashboardId: (id: string | null) => void;

  // Dashboards
  createDashboard: (title: string, description?: string) => string;
  addWidgetToDashboard: (dashboardId: string, widget: Omit<Widget, "id" | "dashboardId">) => void;
  removeWidget: (dashboardId: string, widgetId: string) => void;

  // Metrics
  updateMetricValue: (metricId: string, newValue: number) => void;

  // Alerts
  createAlertRule: (rule: Omit<AlertRule, "id" | "isActive">) => void;
  toggleAlertRule: (ruleId: string) => void;
  deleteAlertRule: (ruleId: string) => void;
}

const INITIAL_METRICS: Metric[] = [
  {
    id: "m-prod-comp",
    name: "Task Completion Velocity",
    description: "Total tasks completed across all active projects per sprint cycle.",
    category: "productivity",
    unit: "tasks/wk",
    calculationMethod: "count",
    sourceApps: ["task_manager"],
    targetValue: 40,
    currentValue: 46,
    previousValue: 38,
    createdAt: "2026-09-01",
  },
  {
    id: "m-dod-compliance",
    name: "DoD Acceptance Compliance Rate",
    description: "Percentage of mandatory definition-of-done requirements verified prior to submission.",
    category: "quality",
    unit: "%",
    calculationMethod: "ratio",
    sourceApps: ["deliverable_manager"],
    targetValue: 95,
    currentValue: 92,
    previousValue: 88,
    createdAt: "2026-09-01",
  },
  {
    id: "m-sla-pipeline",
    name: "Workflow Stage SLA Adherence",
    description: "Percentage of pipeline instances transitioned within configured stage SLA limits.",
    category: "operational",
    unit: "%",
    calculationMethod: "ratio",
    sourceApps: ["workflow_manager"],
    targetValue: 90,
    currentValue: 84,
    previousValue: 82,
    createdAt: "2026-09-01",
  },
  {
    id: "m-meeting-roi",
    name: "Meeting Action Item Resolution",
    description: "Ratio of action items created during meetings completed within 7 business days.",
    category: "productivity",
    unit: "%",
    calculationMethod: "ratio",
    sourceApps: ["meeting_manager"],
    targetValue: 80,
    currentValue: 78,
    previousValue: 65,
    createdAt: "2026-09-05",
  },
  {
    id: "m-form-conversion",
    name: "Form Response Forwarding Success",
    description: "Percentage of submitted form responses successfully dispatched via ActionMapping.",
    category: "operational",
    unit: "%",
    calculationMethod: "ratio",
    sourceApps: ["forms"],
    targetValue: 99,
    currentValue: 98.4,
    previousValue: 97.1,
    createdAt: "2026-09-10",
  },
];

const INITIAL_TIME_SERIES: Record<string, MetricTimeSeriesPoint[]> = {
  "m-prod-comp": [
    { date: "09-01", value: 32 },
    { date: "09-08", value: 38 },
    { date: "09-15", value: 41 },
    { date: "09-22", value: 46 },
  ],
  "m-dod-compliance": [
    { date: "09-01", value: 85 },
    { date: "09-08", value: 88 },
    { date: "09-15", value: 89 },
    { date: "09-22", value: 92 },
  ],
  "m-sla-pipeline": [
    { date: "09-01", value: 78 },
    { date: "09-08", value: 82 },
    { date: "09-15", value: 80 },
    { date: "09-22", value: 84 },
  ],
};

const INITIAL_DASHBOARDS: Dashboard[] = [
  {
    id: "dash-exec",
    title: "Executive Cross-App Productivity Cockpit",
    description: "High-level overview aggregating deliverable quality, workflow SLA, and team velocity.",
    isDefault: true,
    createdBy: "Andi Pratama",
    createdAt: "2026-09-15",
    widgets: [
      {
        id: "w-1",
        dashboardId: "dash-exec",
        title: "Sprint Velocity",
        type: "metric_card",
        metricIds: ["m-prod-comp"],
        timeRange: "30d",
        description: "Completed tasks trend",
      },
      {
        id: "w-2",
        dashboardId: "dash-exec",
        title: "DoD Compliance Rate",
        type: "metric_card",
        metricIds: ["m-dod-compliance"],
        timeRange: "30d",
        description: "Deliverables passing quality check",
      },
      {
        id: "w-3",
        dashboardId: "dash-exec",
        title: "Workflow SLA Adherence",
        type: "metric_card",
        metricIds: ["m-sla-pipeline"],
        timeRange: "30d",
        description: "Process pipelines compliant with SLA",
      },
      {
        id: "w-4",
        dashboardId: "dash-exec",
        title: "Ecosystem Health & Operational Trajectory",
        type: "line_chart",
        metricIds: ["m-prod-comp", "m-dod-compliance", "m-sla-pipeline"],
        timeRange: "30d",
        description: "Weekly aggregated progress",
      },
    ],
  },
];

const INITIAL_ALERTS: AlertRule[] = [
  {
    id: "alt-1",
    metricId: "m-sla-pipeline",
    metricName: "Workflow Stage SLA Adherence",
    condition: "less_than",
    threshold: 80,
    severity: "warning",
    notifyChannels: ["#engineering-leads", "email:andi@company.com"],
    lastTriggeredAt: "2026-09-19",
    isActive: true,
  },
  {
    id: "alt-2",
    metricId: "m-dod-compliance",
    metricName: "DoD Acceptance Compliance Rate",
    condition: "less_than",
    threshold: 85,
    severity: "critical",
    notifyChannels: ["#quality-assurance", "slack:leads"],
    isActive: true,
  },
];

const INITIAL_CORRELATIONS: CorrelationAnalysis[] = [
  {
    metricA: "DoD Acceptance Compliance Rate",
    metricB: "Task Completion Velocity",
    correlationScore: 0.82,
    insight: "Strong positive correlation: Clear definition of done criteria correlates with 32% faster task turnaround.",
  },
  {
    metricA: "Meeting Action Item Resolution",
    metricB: "Workflow Stage SLA Adherence",
    correlationScore: 0.74,
    insight: "Moderate positive correlation: Resolving meeting action items timely reduces review stage bottleneck hours.",
  },
];

export const useStatisticsStore = create<StatisticsStore>()(
  persist(
    (set) => ({
      metrics: INITIAL_METRICS,
      dashboards: INITIAL_DASHBOARDS,
      selectedDashboardId: "dash-exec",
      alertRules: INITIAL_ALERTS,
      correlations: INITIAL_CORRELATIONS,
      timeSeriesData: INITIAL_TIME_SERIES,

      setSelectedDashboardId: (id) => set({ selectedDashboardId: id }),

      createDashboard: (title, description) => {
        const id = `dash-${Date.now()}`;
        const newDash: Dashboard = {
          id,
          title,
          description,
          widgets: [],
          isDefault: false,
          createdBy: "Andi Pratama",
          createdAt: new Date().toISOString().split("T")[0],
        };
        set((state) => ({
          dashboards: [...state.dashboards, newDash],
          selectedDashboardId: id,
        }));
        return id;
      },

      addWidgetToDashboard: (dashboardId, widgetData) => {
        const newWidget: Widget = {
          ...widgetData,
          id: `w-${Date.now()}`,
          dashboardId,
        };
        set((state) => ({
          dashboards: state.dashboards.map((d) =>
            d.id === dashboardId ? { ...d, widgets: [...d.widgets, newWidget] } : d
          ),
        }));
      },

      removeWidget: (dashboardId, widgetId) => {
        set((state) => ({
          dashboards: state.dashboards.map((d) =>
            d.id === dashboardId ? { ...d, widgets: d.widgets.filter((w) => w.id !== widgetId) } : d
          ),
        }));
      },

      updateMetricValue: (metricId, newValue) => {
        set((state) => ({
          metrics: state.metrics.map((m) =>
            m.id === metricId
              ? { ...m, previousValue: m.currentValue, currentValue: newValue }
              : m
          ),
        }));
      },

      createAlertRule: (ruleData) => {
        const newRule: AlertRule = {
          ...ruleData,
          id: `alt-${Date.now()}`,
          isActive: true,
        };
        set((state) => ({ alertRules: [...state.alertRules, newRule] }));
      },

      toggleAlertRule: (ruleId) => {
        set((state) => ({
          alertRules: state.alertRules.map((a) =>
            a.id === ruleId ? { ...a, isActive: !a.isActive } : a
          ),
        }));
      },

      deleteAlertRule: (ruleId) => {
        set((state) => ({
          alertRules: state.alertRules.filter((a) => a.id !== ruleId),
        }));
      },
    }),
    {
      name: "ecosystem-statistics-storage",
      storage: createWorkspaceStorage(),
    }
  )
);
