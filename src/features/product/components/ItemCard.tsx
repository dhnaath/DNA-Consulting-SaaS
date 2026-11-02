import { useState } from "react";
import { TrackedItem } from "../types";
import { Card, Badge, Button } from "./ui";
import {
  calculateProgress,
  calculateStatus,
  formatDaysRemaining,
  formatCurrency,
  calculateTotalCost,
  calculateAmortization,
} from "../utils";
import {
  Apple,
  Pill,
  Sparkles,
  Laptop,
  Package,
  Trash2,
  Tag,
  Store,
  MapPin,
  Link2,
  Phone,
  Scale,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

interface ItemCardProps {
  item: TrackedItem;
  onDelete: (id: string) => void;
}

const CategoryIcon = ({ category, className }: { category: string; className?: string }) => {
  switch (category) {
    case "Makanan":
      return <Apple className={className} />;
    case "Obat":
      return <Pill className={className} />;
    case "Kosmetik":
      return <Sparkles className={className} />;
    case "Elektronik":
      return <Laptop className={className} />;
    default:
      return <Package className={className} />;
  }
};

export function ItemCard({ item, onDelete }: ItemCardProps) {
  const [expanded, setExpanded] = useState(false);
  const status = calculateStatus(item.endDate);
  const progress = calculateProgress(item.startDate, item.endDate);
  const timeRemaining = formatDaysRemaining(item.endDate);

  const getStatusBadge = () => {
    switch (status) {
      case "aman":
        return <Badge variant="success">Aman</Badge>;
      case "hampir_habis":
        return <Badge variant="warning">Hampir Habis</Badge>;
      case "kadaluarsa":
        return <Badge variant="danger">Kadaluarsa</Badge>;
    }
  };

  const getProgressColor = () => {
    if (status === "kadaluarsa") return "bg-rose-500";
    if (status === "hampir_habis") return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getPurchaseStatusBadge = (pStatus?: string) => {
    if (!pStatus) return null;
    switch (pStatus) {
      case "pengajuan":
        return (
          <span className="text-blue-700 bg-blue-500/12 px-2 py-0.5 rounded text-[10px] font-semibold">
            Pengajuan
          </span>
        );
      case "dipesan":
        return (
          <span className="text-amber-700 bg-amber-500/12 px-2 py-0.5 rounded text-[10px] font-semibold">
            Dipesan
          </span>
        );
      case "diterima":
        return (
          <span className="text-emerald-700 bg-emerald-500/12 px-2 py-0.5 rounded text-[10px] font-semibold">
            Diterima
          </span>
        );
      default:
        return null;
    }
  };

  const formattedStart = format(parseISO(item.startDate), "d MMM yyyy", { locale: id });
  const formattedEnd = format(parseISO(item.endDate), "d MMM yyyy", { locale: id });

  // Calculations
  const totalCost = calculateTotalCost(item.price, item.quantity, item.discount);
  const amort = calculateAmortization(totalCost, item.startDate, item.endDate);
  const totalMeasurement = (item.measurementValue || 0) * (item.quantity || 1);
  const unitCost = totalMeasurement > 0 ? totalCost / totalMeasurement : 0;

  return (
    <Card className="flex flex-col group hover:shadow-md transition-shadow relative">
      <div className="flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-muted-foreground">
            <CategoryIcon category={item.category} className="w-5 h-5" />
          </div>
          <div className="flex flex-col items-end gap-1">
            {getStatusBadge()}
            {getPurchaseStatusBadge(item.purchaseStatus)}
          </div>
        </div>

        <h3 className="font-semibold text-foreground leading-tight mb-1 truncate">{item.name}</h3>
        <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5 flex-wrap">
          <span>{item.category}</span>
          {item.sku && <span className="opacity-50">•</span>}
          {item.sku && <span>{item.sku}</span>}
          {item.storageLocation && <span className="opacity-50">•</span>}
          {item.storageLocation && (
            <span className="flex items-center text-foreground bg-accent px-1.5 py-0.5 rounded">
              <MapPin className="w-3 h-3 mr-1" />
              {item.storageLocation}
            </span>
          )}
        </p>

        {/* Progress Bar Area */}
        <div className="space-y-3 mb-4">
          <div>
            <div className="flex justify-between text-[11px] mb-1 font-semibold">
              <span className="text-muted-foreground">Sisa Umur Pakai</span>
              <span
                className={
                  status === "kadaluarsa"
                    ? "text-rose-600"
                    : status === "hampir_habis"
                      ? "text-amber-600"
                      : "text-emerald-600"
                }
              >
                {Math.round(100 - progress)}%
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${getProgressColor()}`}
                style={{ width: `${100 - progress}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-muted-foreground">Exp: {formattedEnd}</span>
            <span
              className={`font-semibold ${
                status === "kadaluarsa"
                  ? "text-rose-600"
                  : status === "hampir_habis"
                    ? "text-amber-600"
                    : "text-foreground"
              }`}
            >
              {timeRemaining}
            </span>
          </div>
        </div>

        {/* Collapsible Details */}
        <div className="border-t border-border pt-3 mt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Detail Finansial & Vendor</span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expanded && (
            <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Core Financials */}
              <div className="bg-muted/50 rounded-xl p-3 grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <p className="text-muted-foreground mb-0.5">Total Harga</p>
                  <p className="font-semibold text-foreground">{formatCurrency(totalCost)}</p>
                  {item.discount ? (
                    <p className="text-[9px] text-emerald-600">
                      Hemat {formatCurrency(item.discount)}
                    </p>
                  ) : null}
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">Beban per Bulan</p>
                  <p className="font-semibold text-foreground">
                    {formatCurrency(amort.perMonth)}
                    <span className="font-normal text-muted-foreground">/bln</span>
                  </p>
                  <p className="text-[9px] text-muted-foreground">
                    {formatCurrency(amort.perDay)}/hari
                  </p>
                </div>
              </div>

              {/* Specs & Measurement */}
              <div className="flex items-center justify-between text-[11px] text-foreground px-1">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Qty: {item.quantity || 1}</span>
                </div>
                {item.measurementValue ? (
                  <div className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>
                      {totalMeasurement} {item.measurementUnit}
                      {unitCost > 0 && ` (${formatCurrency(unitCost)}/${item.measurementUnit})`}
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Vendor Info */}
              {(item.supplier || item.supplierUrl || item.supplierContact) && (
                <div className="border-t border-border pt-3 text-[11px]">
                  <p className="font-semibold text-foreground mb-2 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-muted-foreground" />
                    Penjual / Vendor
                  </p>
                  <div className="space-y-1.5 pl-5">
                    {item.supplier && (
                      <p className="text-foreground font-medium">{item.supplier}</p>
                    )}
                    {item.supplierUrl && (
                      <a
                        href={item.supplierUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        <Link2 className="w-3 h-3" /> Buka Tautan Produk
                      </a>
                    )}
                    {item.supplierContact && (
                      <p className="text-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3 text-muted-foreground" /> {item.supplierContact}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {item.notes && (
                <p className="text-[11px] text-muted-foreground bg-card p-2.5 rounded-lg border border-border">
                  {item.notes}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-border flex justify-between items-center">
        <span className="text-[10px] text-muted-foreground">Mulai: {formattedStart}</span>
        <Button
          variant="ghost"
          onClick={() => onDelete(item.id)}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 px-3 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Hapus"
        >
          <Trash2 className="w-4 h-4 mr-1.5" />
          <span className="text-xs">Hapus</span>
        </Button>
      </div>
    </Card>
  );
}
