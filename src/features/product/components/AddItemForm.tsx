import React, { useState } from "react";
import { TrackedItem, ItemCategory, PurchaseStatus, MeasurementUnit } from "../types";
import { Button, Input, Select, Label, Card } from "./ui";
import { X } from "lucide-react";
import { format, addMonths } from "date-fns";

interface AddItemFormProps {
  onAdd: (item: Omit<TrackedItem, "id" | "createdAt">) => void;
  onCancel: () => void;
}

const CATEGORIES: ItemCategory[] = ["Makanan", "Obat", "Kosmetik", "Elektronik", "Lainnya"];
const PURCHASE_STATUSES: { label: string; value: PurchaseStatus }[] = [
  { label: "Pengajuan (Requested)", value: "pengajuan" },
  { label: "Dipesan (Ordered)", value: "dipesan" },
  { label: "Diterima (Received)", value: "diterima" },
];
const MEASUREMENT_UNITS: { label: string; value: MeasurementUnit }[] = [
  { label: "Pcs (Pieces)", value: "pcs" },
  { label: "Gram (g)", value: "g" },
  { label: "Kilogram (kg)", value: "kg" },
  { label: "Mililiter (ml)", value: "ml" },
  { label: "Liter (L)", value: "l" },
  { label: "Ounce (oz)", value: "oz" },
  { label: "Pound (lbs)", value: "lbs" },
  { label: "Fluid Ounce (fl oz)", value: "fl_oz" },
  { label: "Gallon (gal)", value: "gal" },
];

export function AddItemForm({ onAdd, onCancel }: AddItemFormProps) {
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const futureStr = format(addMonths(new Date(), 6), "yyyy-MM-dd");

  // Basic Info
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ItemCategory>("Makanan");
  const [sku, setSku] = useState("");
  const [storageLocation, setStorageLocation] = useState("");

  // Lifespan
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(futureStr);

  // Specification
  const [quantity, setQuantity] = useState(1);
  const [measurementValue, setMeasurementValue] = useState<number | "">("");
  const [measurementUnit, setMeasurementUnit] = useState<MeasurementUnit>("pcs");

  // Financials
  const [price, setPrice] = useState<number | "">("");
  const [discount, setDiscount] = useState<number | "">("");
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus>("diterima");

  // Vendor
  const [supplier, setSupplier] = useState("");
  const [supplierUrl, setSupplierUrl] = useState("");
  const [supplierContact, setSupplierContact] = useState("");

  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate || !endDate) return;

    onAdd({
      name,
      category,
      sku,
      storageLocation,
      startDate,
      endDate,
      quantity,
      measurementValue: measurementValue === "" ? undefined : Number(measurementValue),
      measurementUnit,
      price: price === "" ? undefined : Number(price),
      discount: discount === "" ? undefined : Number(discount),
      purchaseStatus,
      supplier,
      supplierUrl,
      supplierContact,
      notes,
    });
  };

  return (
    <Card className="p-8 mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">Tambah Barang Baru</h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground transition-colors bg-muted p-2 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Info */}
        <div>
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
            Informasi Dasar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Nama Barang *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Susu UHT, Kertas A4"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Kategori *</Label>
              <Select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="sku">SKU / Nomor Seri</Label>
              <Input
                id="sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Contoh: PRD-001"
              />
            </div>
            <div>
              <Label htmlFor="storageLocation">Lokasi Penyimpanan</Label>
              <Input
                id="storageLocation"
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                placeholder="Contoh: Rak Gudang B"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Lifespan & Measurement */}
        <div>
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
            Masa Pakai & Spesifikasi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="startDate">Tanggal Beli / Mulai *</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">Tanggal Kadaluarsa / Habis *</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="quantity">Kuantitas Pembelian *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="measurementValue">Ukuran (per qty)</Label>
                <Input
                  id="measurementValue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={measurementValue}
                  onChange={(e) =>
                    setMeasurementValue(e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="Misal: 100"
                />
              </div>
              <div>
                <Label htmlFor="measurementUnit">Satuan</Label>
                <Select
                  id="measurementUnit"
                  value={measurementUnit}
                  onChange={(e) => setMeasurementUnit(e.target.value as MeasurementUnit)}
                >
                  {MEASUREMENT_UNITS.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Financials */}
        <div>
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
            Finansial & Pembelian
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="price">Harga Satuan (Rp)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="discount">Diskon Total (Rp)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value ? Number(e.target.value) : "")}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="purchaseStatus">Status Pembelian</Label>
              <Select
                id="purchaseStatus"
                value={purchaseStatus}
                onChange={(e) => setPurchaseStatus(e.target.value as PurchaseStatus)}
              >
                {PURCHASE_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Section 4: Vendor */}
        <div>
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
            Informasi Penjual
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="supplier">Nama Toko / Vendor</Label>
              <Input
                id="supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="Contoh: PT. Makmur"
              />
            </div>
            <div>
              <Label htmlFor="supplierUrl">Link Toko / Produk</Label>
              <Input
                id="supplierUrl"
                type="url"
                value={supplierUrl}
                onChange={(e) => setSupplierUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="supplierContact">No. HP / Kontak</Label>
              <Input
                id="supplierContact"
                type="tel"
                value={supplierContact}
                onChange={(e) => setSupplierContact(e.target.value)}
                placeholder="0812..."
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Catatan Tambahan</Label>
          <Input
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Simpan di tempat sejuk"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-border">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit">Simpan Barang</Button>
        </div>
      </form>
    </Card>
  );
}
