export type MetricCategory =
  | "productivity"
  | "quality"
  | "financial"
  | "operational"
  | "custom";

export type CalculationMethod = "sum" | "average" | "count" | "ratio" | "custom";

export type WidgetType =
  | "metric_card"
  | "line_chart"
  | "bar_chart"
  | "table"
  | "pie_chart"
  | "heatmap";

export type TrendDirection = "up" | "down" | "flat";

export type AlertSeverity = "info" | "warning" | "critical";

export type AlertCondition = "greater_than" | "less_than" | "change_greater_than";

export interface Metric {
  id: string;
  name: string;
  description: string;
  category: MetricCategory;
  unit: string; // e.g. "%", "hours", "items", "Rp"
  calculationMethod: CalculationMethod;
  sourceApps: string[];
  targetValue?: number;
  currentValue: number;
  previousValue?: number;
  createdAt: string;
}

export interface MetricTimeSeriesPoint {
  date: string;
  value: number;
}

export interface Widget {
  id: string;
  dashboardId: string;
  title: string;
  type: WidgetType;
  metricIds: string[];
  timeRange: string; // "7d" | "30d" | "90d"
  description?: string;
}

export interface Dashboard {
  id: string;
  title: string;
  description?: string;
  widgets: Widget[];
  isDefault: boolean;
  createdBy: string;
  createdAt: string;
}

export interface AlertRule {
  id: string;
  metricId: string;
  metricName: string;
  condition: AlertCondition;
  threshold: number;
  severity: AlertSeverity;
  notifyChannels: string[];
  lastTriggeredAt?: string;
  isActive: boolean;
}

export interface CorrelationAnalysis {
  metricA: string;
  metricB: string;
  correlationScore: number; // -1.0 to +1.0
  insight: string;
}
