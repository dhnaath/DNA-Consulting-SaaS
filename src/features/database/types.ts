export type FieldType =
  | "text"
  | "long_text"
  | "number"
  | "currency"
  | "date"
  | "boolean"
  | "select"
  | "multi_select"
  | "relation"
  | "lookup"
  | "rollup"
  | "formula"
  | "attachment"
  | "url"
  | "email"
  | "phone"
  | "user"
  | "created_time"
  | "last_edited_time";

export type ViewType = "grid" | "kanban" | "calendar" | "gallery" | "form";

export type AggregationType = "sum" | "count" | "avg" | "min" | "max" | "count_distinct";

export interface FieldConfig {
  options?: { id: string; label: string; color?: string }[]; // select, multi_select
  relatedTableId?: string; // relation
  relationFieldId?: string; // lookup, rollup
  targetFieldId?: string; // lookup, rollup
  aggregation?: AggregationType; // rollup
  formulaExpression?: string; // formula
  resultType?: "number" | "text" | "boolean" | "date";
  currencySymbol?: string;
  minValue?: number;
  maxValue?: number;
}

export interface DatabaseField {
  id: string;
  tableId: string;
  name: string;
  type: FieldType;
  config?: FieldConfig;
  isRequired?: boolean;
  order: number;
}

export interface DatabaseRecord {
  id: string;
  tableId: string;
  values: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface DatabaseRelation {
  id: string;
  fieldId: string;
  fromTableId: string;
  toTableId: string;
  cardinality: "one_to_many" | "many_to_many" | "one_to_one";
  symmetricFieldId?: string;
}

export interface SortRule {
  fieldId: string;
  direction: "asc" | "desc";
}

export interface FilterCondition {
  fieldId: string;
  operator: "equals" | "contains" | "gt" | "lt" | "gte" | "lte" | "is_empty" | "is_not_empty";
  value: any;
}

export interface DatabaseView {
  id: string;
  tableId: string;
  name: string;
  type: ViewType;
  filters: FilterCondition[];
  sortRules: SortRule[];
  visibleFieldIds: string[];
  groupByFieldId?: string; // for Kanban
  dateFieldId?: string; // for Calendar
}

export interface DatabaseTable {
  id: string;
  name: string;
  description?: string;
  primaryFieldId: string;
  icon?: string;
  color?: string;
  createdAt: string;
}

export interface DatabaseData {
  tables: DatabaseTable[];
  fields: DatabaseField[];
  records: DatabaseRecord[];
  relations: DatabaseRelation[];
  views: DatabaseView[];
}
