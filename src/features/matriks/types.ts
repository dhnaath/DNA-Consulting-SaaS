export type QuadrantId = "tl" | "tr" | "bl" | "br";

export interface Item {
  id: string;
  text: string;
}

export interface QuadrantData {
  id: QuadrantId;
  title: string;
  subtitle: string;
  theme?: "emerald" | "blue" | "amber" | "rose" | string;
}
