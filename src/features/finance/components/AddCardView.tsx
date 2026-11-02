import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Calendar,
  Plus,
  Trash2,
  FileText,
  Palette,
  CalendarClock,
  Receipt,
  CreditCard,
  Clock,
  Landmark,
  Home,
  Car,
  User,
  Smartphone,
  Building,
  Banknote,
  TrendingUp,
  Wallet,
  Users,
  MoreHorizontal,
  Briefcase,
  Coins,
  Pipette,
} from "lucide-react";
import { useDebts, Fee } from "../hooks/useDebts";

const getTypeIcon = (type: string) => {
  switch (type) {
    case "Kartu Kredit":
      return <CreditCard size={18} className="shrink-0" />;
    case "PayLater":
      return <Clock size={18} className="shrink-0" />;
    case "KTA":
      return <Landmark size={18} className="shrink-0" />;
    case "KPR":
      return <Home size={18} className="shrink-0" />;
    case "KKB":
      return <Car size={18} className="shrink-0" />;
    case "Kredit Pegawai":
      return <Briefcase size={18} className="shrink-0" />;
    case "Cash Line":
      return <Coins size={18} className="shrink-0" />;
    case "Pinjaman Pribadi":
      return <User size={18} className="shrink-0" />;
    case "Pinjaman Online":
      return <Smartphone size={18} className="shrink-0" />;
    case "Tabungan Bank":
      return <Building size={18} className="shrink-0" />;
    case "Uang Tunai / Cash":
      return <Banknote size={18} className="shrink-0" />;
    case "Aset Tidak Lancar":
      return <Home size={18} className="shrink-0" />;
    case "Reksa Dana / Portofolio":
      return <TrendingUp size={18} className="shrink-0" />;
    case "Dompet Digital / e-Wallet":
      return <Wallet size={18} className="shrink-0" />;
    case "Piutang":
      return <Users size={18} className="shrink-0" />;
    case "Lainnya":
      return <MoreHorizontal size={18} className="shrink-0" />;
    default:
      return <FileText size={18} className="shrink-0" />;
  }
};
export function AddCardView({
  onBack,
  editDebtId,
}: {
  onBack: () => void;
  editDebtId?: string | null;
}) {
  const { debts, addDebt, updateDebt } = useDebts();
  const [dueDateEnabled, setDueDateEnabled] = useState(false);
  const [installmentsEnabled, setInstallmentsEnabled] = useState(false);
  const [feesEnabled, setFeesEnabled] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "Kartu Kredit",
    amount: "",
    limit: "",
    description: "",
    statementDate: "",
    dueDate: "",
    color: "#1976d2",
    remainingInstallments: "",
    fees: [] as Fee[],
    accountClass: "kredit" as "debit" | "kredit",
    penalty: "",
    penaltyFrequency: "bulanan" as "harian" | "bulanan",
    startDate: "",
    tenor: "",
    principalAmount: "",
    interestRate: "",
    monthlyInstallment: "",
    totalPaid: "",
    status: "aktif" as "aktif" | "lunas" | "menunggak",
  });

  useEffect(() => {
    if (editDebtId) {
      const debt = debts.find((d) => d.id === editDebtId);
      if (debt) {
        setFormData({
          name: debt.name,
          type: debt.type,
          amount: debt.amount.toString(),
          limit: debt.limit ? debt.limit.toString() : "",
          description: debt.description || "",
          statementDate: debt.statementDate || "",
          dueDate: debt.dueDate || "",
          color: debt.color || "#1976d2",
          remainingInstallments: debt.remainingInstallments
            ? debt.remainingInstallments.toString()
            : "",
          fees: debt.fees || [],
          accountClass: debt.accountClass || "kredit",
          penalty: debt.penalty ? debt.penalty.toString() : "",
          penaltyFrequency: debt.penaltyFrequency || "bulanan",
          startDate: debt.startDate || "",
          tenor: debt.tenor ? debt.tenor.toString() : "",
          principalAmount: debt.principalAmount ? debt.principalAmount.toString() : "",
          interestRate: debt.interestRate ? debt.interestRate.toString() : "",
          monthlyInstallment: debt.monthlyInstallment ? debt.monthlyInstallment.toString() : "",
          totalPaid: debt.totalPaid ? debt.totalPaid.toString() : "",
          status: debt.status || "aktif",
        });
        if (debt.statementDate || debt.dueDate) {
          setDueDateEnabled(true);
        }
        if (debt.remainingInstallments) {
          setInstallmentsEnabled(true);
        }
        if (debt.fees && debt.fees.length > 0) {
          setFeesEnabled(true);
        }
      }
    }
  }, [editDebtId, debts]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddFee = () => {
    setFormData({
      ...formData,
      fees: [
        ...formData.fees,
        { id: crypto.randomUUID(), name: "", amount: 0, frequency: "bulanan" },
      ],
    });
  };

  const handleUpdateFee = (id: string, field: keyof Fee, value: string | number) => {
    setFormData({
      ...formData,
      fees: formData.fees.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
    });
  };

  const handleRemoveFee = (id: string) => {
    setFormData({
      ...formData,
      fees: formData.fees.filter((f) => f.id !== id),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;

    if (editDebtId) {
      updateDebt({
        id: editDebtId,
        name: formData.name,
        type: formData.type,
        amount: parseFloat(formData.amount) || 0,
        limit: parseFloat(formData.limit) || 0,
        description: formData.description,
        statementDate: dueDateEnabled ? formData.statementDate : undefined,
        dueDate: dueDateEnabled ? formData.dueDate : undefined,
        remainingInstallments:
          installmentsEnabled && formData.remainingInstallments
            ? parseInt(formData.remainingInstallments)
            : undefined,
        color: formData.color,
        fees: feesEnabled ? formData.fees : [],
        accountClass: formData.accountClass,
        penalty: formData.penalty ? parseFloat(formData.penalty) : undefined,
        penaltyFrequency: formData.penaltyFrequency,
        startDate: formData.startDate || undefined,
        tenor: formData.tenor ? parseInt(formData.tenor) : undefined,
        principalAmount: formData.principalAmount
          ? parseFloat(formData.principalAmount)
          : undefined,
        interestRate: formData.interestRate ? parseFloat(formData.interestRate) : undefined,
        monthlyInstallment: formData.monthlyInstallment
          ? parseFloat(formData.monthlyInstallment)
          : undefined,
        totalPaid: formData.totalPaid ? parseFloat(formData.totalPaid) : undefined,
        status: formData.status,
      });
    } else {
      addDebt({
        name: formData.name,
        type: formData.type,
        amount: parseFloat(formData.amount) || 0,
        limit: parseFloat(formData.limit) || 0,
        description: formData.description,
        statementDate: dueDateEnabled ? formData.statementDate : undefined,
        dueDate: dueDateEnabled ? formData.dueDate : undefined,
        remainingInstallments:
          installmentsEnabled && formData.remainingInstallments
            ? parseInt(formData.remainingInstallments)
            : undefined,
        color: formData.color,
        fees: feesEnabled ? formData.fees : [],
        accountClass: formData.accountClass,
        penalty: formData.penalty ? parseFloat(formData.penalty) : undefined,
        penaltyFrequency: formData.penaltyFrequency,
        startDate: formData.startDate || undefined,
        tenor: formData.tenor ? parseInt(formData.tenor) : undefined,
        principalAmount: formData.principalAmount
          ? parseFloat(formData.principalAmount)
          : undefined,
        interestRate: formData.interestRate ? parseFloat(formData.interestRate) : undefined,
        monthlyInstallment: formData.monthlyInstallment
          ? parseFloat(formData.monthlyInstallment)
          : undefined,
        totalPaid: formData.totalPaid ? parseFloat(formData.totalPaid) : undefined,
        status: formData.status,
      });
    }

    onBack();
  };

  const debtTypes =
    formData.accountClass === "kredit"
      ? [
          "Kartu Kredit",
          "PayLater",
          "KTA",
          "KPR",
          "KKB",
          "Kredit Pegawai",
          "Cash Line",
          "Pinjaman Pribadi",
          "Pinjaman Online",
          "Lainnya",
        ]
      : [
          "Tabungan Bank",
          "Uang Tunai / Cash",
          "Aset Tidak Lancar",
          "Reksa Dana / Portofolio",
          "Dompet Digital / e-Wallet",
          "Piutang",
          "Lainnya",
        ];

  useEffect(() => {
    if (!editDebtId) {
      setFormData((f) => ({
        ...f,
        type: formData.accountClass === "kredit" ? "Kartu Kredit" : "Tabungan Bank",
      }));
    }
  }, [formData.accountClass, editDebtId]);

  const colors = ["#ff0000", "#ff9800", "#ffeb3b", "#22c55e", "#0000ff", "#4b0082", "#9400d3"];

  return (
    <div className="min-h-screen bg-transparent p-4 font-sans text-foreground pb-20">
      <div className="flex items-center gap-2 mb-6 pt-2">
        <button
          onClick={onBack}
          className="p-1 -ml-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={28} strokeWidth={2} />
        </button>
        <h1 className="text-lg font-normal tracking-wide text-foreground">
          {editDebtId ? "Edit Pinjaman / Kredit" : "Tambah Baru"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset className="relative border border-border rounded-2xl px-4 pt-1.5 pb-2 bg-card focus-within:border-border">
          <legend className="text-xs font-medium text-muted-foreground px-1 ml-1 bg-background -mt-0.5">
            Nama Pinjaman
          </legend>
          <input
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            className="px-1 pb-1 w-full bg-transparent outline-none font-medium text-foreground placeholder:text-muted-foreground text-base"
            placeholder="KPR Mandiri"
          />
        </fieldset>

        <fieldset className="relative border border-border rounded-2xl px-4 pt-1.5 pb-2 bg-card focus-within:border-border">
          <legend className="text-xs font-medium text-muted-foreground px-1 ml-1 bg-background -mt-0.5">
            Jenis Kredit
          </legend>
          <div className="flex items-center gap-3 px-1 pb-1">
            <div className="text-muted-foreground">{getTypeIcon(formData.type)}</div>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="px-1 pb-1 w-full bg-transparent outline-none font-medium text-foreground text-base appearance-none cursor-pointer"
            >
              {debtTypes.map((type) => (
                <option key={type} value={type} className="bg-card text-foreground">
                  {type}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <fieldset className="relative border border-border rounded-2xl px-4 pt-1.5 pb-2 bg-card focus-within:border-border">
          <legend className="text-xs font-medium text-muted-foreground px-1 ml-1 bg-background -mt-0.5">
            Tanggal Mulai
          </legend>
          <input
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            type="date"
            className="px-1 pb-1 w-full bg-transparent outline-none font-medium text-foreground text-base"
          />
        </fieldset>

        <div className="grid grid-cols-2 gap-4">
          <fieldset className="relative border border-border rounded-2xl px-4 pt-1.5 pb-2 bg-card focus-within:border-border">
            <legend className="text-xs font-medium text-muted-foreground px-1 ml-1 bg-background -mt-0.5">
              Jumlah Tenor
            </legend>
            <input
              name="tenor"
              value={formData.tenor}
              onChange={handleChange}
              type="number"
              className="px-1 pb-1 w-full bg-transparent outline-none font-medium text-foreground placeholder:text-muted-foreground/70 text-base"
              placeholder="12"
            />
          </fieldset>
          <fieldset className="relative border border-border rounded-2xl px-4 pt-1.5 pb-2 bg-card focus-within:border-border">
            <legend className="text-xs font-medium text-muted-foreground px-1 ml-1 bg-background -mt-0.5">
              Bunga (%)
            </legend>
            <input
              name="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
              type="number"
              step="0.01"
              className="px-1 pb-1 w-full bg-transparent outline-none font-medium text-foreground placeholder:text-muted-foreground/70 text-base"
              placeholder="1.5"
            />
          </fieldset>
        </div>

        <fieldset className="relative border border-border rounded-2xl px-4 pt-1.5 pb-2 bg-card focus-within:border-border">
          <legend className="text-xs font-medium text-muted-foreground px-1 ml-1 bg-background -mt-0.5">
            Pokok Pinjaman (Rp)
          </legend>
          <input
            name="principalAmount"
            value={formData.principalAmount}
            onChange={handleChange}
            type="number"
            step="0.01"
            className="px-1 pb-1 w-full bg-transparent outline-none font-medium text-foreground placeholder:text-muted-foreground/70 text-base"
            placeholder="0"
          />
        </fieldset>

        <fieldset className="relative border border-border rounded-2xl px-4 pt-1.5 pb-2 bg-card focus-within:border-border">
          <legend className="text-xs font-medium text-muted-foreground px-1 ml-1 bg-background -mt-0.5">
            Cicilan Per Tenor (Rp)
          </legend>
          <input
            name="monthlyInstallment"
            value={formData.monthlyInstallment}
            onChange={handleChange}
            type="number"
            step="0.01"
            className="px-1 pb-1 w-full bg-transparent outline-none font-medium text-foreground placeholder:text-muted-foreground/70 text-base"
            placeholder="0"
          />
        </fieldset>

        <fieldset className="relative border border-border rounded-2xl px-4 pt-1.5 pb-2 bg-card focus-within:border-border">
          <legend className="text-xs font-medium text-muted-foreground px-1 ml-1 bg-background -mt-0.5">
            Sisa Pokok (Rp)
          </legend>
          <input
            required
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            type="number"
            step="0.01"
            className="px-1 pb-1 w-full bg-transparent outline-none font-medium text-foreground placeholder:text-muted-foreground/70 text-base"
            placeholder="0"
          />
        </fieldset>

        <fieldset className="relative border border-border rounded-2xl px-4 pt-1.5 pb-2 bg-card focus-within:border-border">
          <legend className="text-xs font-medium text-muted-foreground px-1 ml-1 bg-background -mt-0.5">
            Total Dibayar (Rp)
          </legend>
          <input
            name="totalPaid"
            value={formData.totalPaid}
            onChange={handleChange}
            type="number"
            step="0.01"
            className="px-1 pb-1 w-full bg-transparent outline-none font-medium text-foreground placeholder:text-muted-foreground/70 text-base"
            placeholder="0"
          />
        </fieldset>

        <fieldset className="relative border border-border rounded-2xl px-4 pt-1.5 pb-2 bg-card focus-within:border-border">
          <legend className="text-xs font-medium text-muted-foreground px-1 ml-1 bg-background -mt-0.5">
            Status
          </legend>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="px-1 pb-1 w-full bg-transparent outline-none font-medium text-foreground text-base appearance-none cursor-pointer"
          >
            <option value="aktif" className="bg-card">
              Aktif
            </option>
            <option value="lunas" className="bg-card">
              Lunas
            </option>
            <option value="menunggak" className="bg-card">
              Menunggak
            </option>
          </select>
        </fieldset>

        <fieldset className="relative border border-border rounded-2xl px-4 pt-1.5 pb-2 bg-card focus-within:border-border">
          <legend className="text-xs font-medium text-muted-foreground px-1 ml-1 bg-background -mt-0.5">
            Plafon Kredit - Opsional
          </legend>
          <input
            name="limit"
            value={formData.limit}
            onChange={handleChange}
            type="number"
            step="0.01"
            className="px-1 pb-1 w-full bg-transparent outline-none font-medium text-foreground placeholder:text-muted-foreground/70 text-base"
            placeholder="0"
          />
        </fieldset>

        <fieldset className="relative border border-border rounded-2xl px-4 pt-1.5 pb-2 bg-card focus-within:border-border">
          <legend className="text-xs font-medium text-muted-foreground px-1 ml-1 bg-background -mt-0.5">
            Denda Berjalan - Opsional
          </legend>
          <div className="flex items-center gap-3 px-1 pb-1">
            <input
              name="penalty"
              value={formData.penalty}
              onChange={handleChange}
              type="number"
              step="0.01"
              className="px-1 pb-1 w-full bg-transparent outline-none font-medium text-foreground placeholder:text-muted-foreground/70 text-base"
              placeholder="Nominal Denda (Rp)"
            />
            <select
              name="penaltyFrequency"
              value={formData.penaltyFrequency}
              onChange={handleChange}
              className="bg-[#222] border border-[#333] text-foreground text-sm px-3 py-2 rounded-xl outline-none appearance-none cursor-pointer"
            >
              <option value="harian" className="bg-card">
                Harian
              </option>
              <option value="bulanan" className="bg-card">
                Bulanan
              </option>
            </select>
          </div>
        </fieldset>

        <fieldset className="relative border border-border rounded-2xl px-4 pt-1.5 pb-2 bg-card focus-within:border-border">
          <legend className="text-xs font-medium text-muted-foreground px-1 ml-1 bg-background -mt-0.5">
            Catatan
          </legend>
          <div className="flex items-center gap-3 px-1 pb-1">
            <FileText className="text-muted-foreground shrink-0" size={20} />
            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
              type="text"
              className="px-1 pb-1 w-full bg-transparent outline-none font-medium text-foreground placeholder:text-muted-foreground/70 text-base"
              placeholder="Informasi tambahan"
            />
          </div>
        </fieldset>

        <div className="flex flex-col py-4 px-4 border border-border rounded-2xl bg-card gap-3">
          <div className="flex items-center gap-2">
            <Palette className="text-muted-foreground" size={18} />
            <span className="font-medium text-foreground/80 text-sm">Warna</span>
          </div>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {colors.map((color) => (
              <button
                type="button"
                key={color}
                onClick={() => setFormData({ ...formData, color })}
                className={`relative w-8 h-8 rounded-full shrink-0 flex items-center justify-center border-2 ${formData.color === color ? "border-bg-muted" : "border-transparent"}`}
              >
                <div
                  className="preserve-color w-full h-full rounded-full"
                  style={{ backgroundColor: color }}
                />
              </button>
            ))}
            <div
              className={`relative w-8 h-8 rounded-full shrink-0 border-2 flex items-center justify-center transition-colors ${!colors.includes(formData.color) ? "border-bg-muted" : "border-transparent"}`}
            >
              <div
                className={`absolute inset-0 w-full h-full rounded-full flex items-center justify-center ${!colors.includes(formData.color) ? "preserve-color text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-[#3a3a3a]"}`}
                style={!colors.includes(formData.color) ? { backgroundColor: formData.color } : {}}
              >
                <Pipette size={14} />
              </div>
              <input
                type="color"
                value={!colors.includes(formData.color) ? formData.color : "#ffffff"}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer opacity-0"
              />
            </div>
          </div>
        </div>

        <div className="border border-border rounded-2xl bg-card overflow-hidden">
          <div
            onClick={() => setDueDateEnabled(!dueDateEnabled)}
            className="flex justify-between items-center py-4 px-4 cursor-pointer hover:bg-accent transition-colors border-b border-border"
          >
            <div className="flex items-center gap-3 px-1 pb-1">
              <Calendar className="text-muted-foreground" size={20} />
              <span className="font-medium text-foreground/80 text-base">Jadwal Tagihan</span>
            </div>
            <div
              className={`w-11 h-6 rounded-full flex items-center p-1 transition-colors ${dueDateEnabled ? "bg-[#1976d2] justify-end" : "bg-[#333] justify-start"}`}
            >
              <div className="w-4 h-4 bg-card rounded-full shadow-sm"></div>
            </div>
          </div>
          {dueDateEnabled && (
            <div className="p-4 bg-[#1a1a1a] border-b border-border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Tanggal Cetak Tagihan
                  </p>
                  <div className="flex items-center gap-2 border border-[#333] bg-[#222] px-3 py-2 rounded-xl">
                    <Calendar className="text-muted-foreground" size={18} />
                    <input
                      name="statementDate"
                      value={formData.statementDate}
                      onChange={handleChange}
                      type="number"
                      min="1"
                      max="31"
                      className="px-1 pb-1 w-full bg-transparent outline-none text-foreground text-sm"
                      placeholder="Tgl (1-31)"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Jatuh Tempo</p>
                  <div className="flex items-center gap-2 border border-[#333] bg-[#222] px-3 py-2 rounded-xl">
                    <Calendar className="text-muted-foreground" size={18} />
                    <input
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      type="number"
                      min="1"
                      max="31"
                      className="px-1 pb-1 w-full bg-transparent outline-none text-foreground text-sm"
                      placeholder="Tgl (1-31)"
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs font-normal text-muted-foreground/70 leading-relaxed mt-4">
                Catat tanggal tagihan agar Anda bisa merencanakan arus kas sebelum jatuh tempo.
              </p>
            </div>
          )}

          <div
            onClick={() => setInstallmentsEnabled(!installmentsEnabled)}
            className="flex justify-between items-center py-4 px-4 cursor-pointer hover:bg-accent transition-colors border-b border-border"
          >
            <div className="flex items-center gap-3 px-1 pb-1">
              <CalendarClock className="text-muted-foreground" size={20} />
              <span className="font-medium text-foreground/80 text-base">Jumlah Tenor</span>
            </div>
            <div
              className={`w-11 h-6 rounded-full flex items-center p-1 transition-colors ${installmentsEnabled ? "bg-[#1976d2] justify-end" : "bg-[#333] justify-start"}`}
            >
              <div className="w-4 h-4 bg-card rounded-full shadow-sm"></div>
            </div>
          </div>
          {installmentsEnabled && (
            <div className="p-4 bg-[#1a1a1a] border-b border-border">
              <p className="text-xs font-medium text-muted-foreground mb-2">Sisa Tenor</p>
              <div className="flex items-center border border-[#333] bg-[#222] px-3 py-2 rounded-xl">
                <input
                  name="remainingInstallments"
                  value={formData.remainingInstallments}
                  onChange={handleChange}
                  type="number"
                  min="1"
                  className="px-1 pb-1 w-full bg-transparent outline-none text-foreground text-sm"
                  placeholder="Opsional (12)"
                />
              </div>
            </div>
          )}

          <div
            onClick={() => setFeesEnabled(!feesEnabled)}
            className="flex justify-between items-center py-4 px-4 cursor-pointer hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-3 px-1 pb-1">
              <Receipt className="text-muted-foreground" size={20} />
              <span className="font-medium text-foreground/80 text-base">Biaya Tambahan</span>
            </div>
            <div
              className={`w-11 h-6 rounded-full flex items-center p-1 transition-colors ${feesEnabled ? "bg-[#1976d2] justify-end" : "bg-[#333] justify-start"}`}
            >
              <div className="w-4 h-4 bg-card rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>

        {feesEnabled && (
          <div className="space-y-3 pb-2">
            {formData.fees.map((fee, idx) => (
              <div key={fee.id} className="p-3 border border-border rounded-2xl bg-[#1a1a1a]">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-medium text-muted-foreground tracking-wider">
                    Biaya #{idx + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveFee(fee.id)}
                    className="text-muted-foreground/70 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="space-y-3 w-full">
                  <div className="relative border border-border rounded-xl px-3 py-2 bg-background flex flex-col">
                    <label className="text-xs font-medium text-muted-foreground/70">
                      Nama Biaya
                    </label>
                    <input
                      value={fee.name}
                      onChange={(e) => handleUpdateFee(fee.id, "name", e.target.value)}
                      type="text"
                      className="px-1 pb-1 w-full bg-transparent outline-none text-foreground text-sm mt-1"
                      placeholder="Biaya Admin"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative border border-border rounded-xl px-3 py-2 bg-background flex flex-col">
                      <label className="text-xs font-medium text-muted-foreground/70">
                        Jumlah (Rp)
                      </label>
                      <input
                        value={fee.amount || ""}
                        onChange={(e) =>
                          handleUpdateFee(fee.id, "amount", parseFloat(e.target.value) || 0)
                        }
                        type="number"
                        step="0.01"
                        className="px-1 pb-1 w-full bg-transparent outline-none text-foreground text-sm mt-1"
                        placeholder="0"
                      />
                    </div>
                    <div className="relative border border-border rounded-xl px-3 py-2 bg-background flex flex-col">
                      <label className="text-xs font-medium text-muted-foreground/70">
                        Frekuensi
                      </label>
                      <select
                        value={fee.frequency}
                        onChange={(e) => handleUpdateFee(fee.id, "frequency", e.target.value)}
                        className="px-1 pb-1 w-full bg-transparent outline-none text-foreground text-sm mt-1 appearance-none cursor-pointer"
                      >
                        <option value="sekali" className="bg-background text-foreground">
                          Sekali (Di Awal)
                        </option>
                        <option value="bulanan" className="bg-background text-foreground">
                          Bulanan
                        </option>
                        <option value="tahunan" className="bg-background text-foreground">
                          Tahunan
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddFee}
              className="w-full py-3 flex items-center justify-center gap-2 border border-dashed border-border rounded-2xl text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            >
              <Plus size={16} />
              <span className="text-sm font-medium">Tambah Komponen Biaya</span>
            </button>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-4 bg-[#1976d2] text-foreground font-medium rounded-2xl text-base mt-4 active:scale-95 transition-transform shadow-md"
        >
          Simpan Pinjaman
        </button>
      </form>
    </div>
  );
}
