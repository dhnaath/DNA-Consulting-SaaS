export interface PricePoint {
  date: string;
  price: number;
}

export interface Commodity {
  id: string;
  symbol: string;
  name: string;
  unit: string;
  currentPrice: number;
  change24h: number;
  changePercent24h: number;
  history: PricePoint[];
  weight?: number;
  baseCommodity?: string;
  currentBasePrice?: number;
  isIndex?: boolean;
}
