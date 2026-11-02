export type ItemCategory = "Makanan" | "Obat" | "Kosmetik" | "Elektronik" | "Lainnya";
export type PurchaseStatus = "pengajuan" | "dipesan" | "diterima";
export type MeasurementUnit = "pcs" | "g" | "kg" | "ml" | "l" | "oz" | "lbs" | "fl_oz" | "gal";

export interface TrackedItem {
  id: string;
  name: string;
  category: ItemCategory;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  notes?: string;
  createdAt: string;

  // Procurement & Purchasing fields
  sku?: string;
  quantity?: number;
  price?: number; // Base unit price
  discount?: number; // Total discount
  purchaseStatus?: PurchaseStatus;

  // Vendor Info
  supplier?: string;
  supplierUrl?: string; // product link or website
  supplierContact?: string; // phone or email

  // Physical & Measurement
  measurementValue?: number;
  measurementUnit?: MeasurementUnit;

  // Storage
  storageLocation?: string;
}

export type ItemStatus = "aman" | "hampir_habis" | "kadaluarsa";
