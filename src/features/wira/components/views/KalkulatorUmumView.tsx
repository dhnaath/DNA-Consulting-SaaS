import { useState, useEffect, useMemo } from "react";
import {
  Calculator,
  Percent,
  Scale,
  Calendar,
  Banknote,
  RotateCcw,
  Copy,
  Check,
  History,
  Trash2,
  ArrowRightLeft,
  Info,
  DollarSign,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CalcTab = "standard" | "converter" | "financial" | "date" | "cash";

export function KalkulatorUmumView() {
  const [activeTab, setActiveTab] = useState<CalcTab>("standard");

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full flex flex-col space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Utilities</h1>
              <p className="text-muted-foreground text-xs md:text-sm mt-0.5">
                Alat hitung serbaguna: kalkulator ilmiah, konverter satuan, persentase niaga, dan pecahan kas.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill */}
        <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-2xl border border-border/60 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("standard")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0",
              activeTab === "standard"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Calculator size={14} />
            <span>Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab("converter")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0",
              activeTab === "converter"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Scale size={14} />
            <span>Konverter Satuan</span>
          </button>

          <button
            onClick={() => setActiveTab("financial")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0",
              activeTab === "financial"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Percent size={14} />
            <span>Diskon & Margin</span>
          </button>

          <button
            onClick={() => setActiveTab("date")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0",
              activeTab === "date"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Calendar size={14} />
            <span>Tanggal & Waktu</span>
          </button>

          <button
            onClick={() => setActiveTab("cash")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0",
              activeTab === "cash"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Banknote size={14} />
            <span>Hitung Kas Rupiah</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === "standard" && <StandardCalculatorSection />}
      {activeTab === "converter" && <UnitConverterSection />}
      {activeTab === "financial" && <FinancialUtilitySection />}
      {activeTab === "date" && <DateCalculatorSection />}
      {activeTab === "cash" && <CashDenominationSection />}
    </div>
  );
}

/* ========================================================================= */
/* TAB 1: KALKULATOR STANDAR & ILMIAH                                         */
/* ========================================================================= */

interface CalculationHistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: string;
}

function StandardCalculatorSection() {
  const [expression, setExpression] = useState<string>("");
  const [display, setDisplay] = useState<string>("0");
  const [memory, setMemory] = useState<number>(0);
  const [isScientific, setIsScientific] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<CalculationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("client_os_calc_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("client_os_calc_history", JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  // Handle number click
  const handleDigit = (digit: string) => {
    if (display === "0" || display === "Error") {
      setDisplay(digit);
    } else {
      setDisplay((prev) => prev + digit);
    }
  };

  // Handle operator click
  const handleOperator = (op: string) => {
    if (display === "Error") return;
    setExpression((prev) => (expression ? `${expression} ${display} ${op}` : `${display} ${op}`));
    setDisplay("0");
  };

  // Calculate result safely
  const handleEquals = () => {
    if (!expression && display === "0") return;
    try {
      const fullExpression = `${expression} ${display}`.trim();
      if (!fullExpression) return;

      // Replace symbols for JS eval
      const sanitized = fullExpression
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/\^/g, "**")
        .replace(/π/g, `${Math.PI}`)
        .replace(/e/g, `${Math.E}`);

      // Basic protection check (only allowed math chars)
      if (!/^[\d\s+\-*/().%*MathPIE]+$/.test(sanitized)) {
        throw new Error("Invalid characters");
      }

      // eslint-disable-next-line no-new-func
      const calcResult = Function(`"use strict"; return (${sanitized})`)();
      const formattedResult = Number.isInteger(calcResult)
        ? calcResult.toString()
        : Number(calcResult.toFixed(8)).toString();

      const newHistoryItem: CalculationHistoryItem = {
        id: `h_${Date.now()}`,
        expression: fullExpression,
        result: formattedResult,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };

      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 19)]);
      setDisplay(formattedResult);
      setExpression("");
    } catch (err) {
      setDisplay("Error");
    }
  };

  // Clear display
  const handleClear = () => {
    setDisplay("0");
    setExpression("");
  };

  // Backspace
  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay((prev) => prev.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  // Toggle plus / minus
  const handleToggleSign = () => {
    if (display === "0" || display === "Error") return;
    if (display.startsWith("-")) {
      setDisplay(display.slice(1));
    } else {
      setDisplay("-" + display);
    }
  };

  // Dot decimal
  const handleDot = () => {
    if (!display.includes(".")) {
      setDisplay((prev) => prev + ".");
    }
  };

  // Scientific functions
  const handleScientificOp = (fn: string) => {
    const val = parseFloat(display);
    if (isNaN(val)) return;

    let res = 0;
    switch (fn) {
      case "sqrt":
        res = Math.sqrt(val);
        break;
      case "sq":
        res = Math.pow(val, 2);
        break;
      case "cube":
        res = Math.pow(val, 3);
        break;
      case "sin":
        res = Math.sin((val * Math.PI) / 180);
        break;
      case "cos":
        res = Math.cos((val * Math.PI) / 180);
        break;
      case "tan":
        res = Math.tan((val * Math.PI) / 180);
        break;
      case "log":
        res = Math.log10(val);
        break;
      case "ln":
        res = Math.log(val);
        break;
      case "reciprocal":
        res = 1 / val;
        break;
      case "fact":
        let f = 1;
        for (let i = 2; i <= Math.min(val, 15); i++) f *= i;
        res = f;
        break;
      default:
        return;
    }

    const formatted = Number.isInteger(res) ? res.toString() : Number(res.toFixed(8)).toString();
    setDisplay(formatted);
  };

  // Memory functions
  const handleMemory = (action: "MC" | "MR" | "M+" | "M-") => {
    const val = parseFloat(display) || 0;
    if (action === "MC") setMemory(0);
    if (action === "MR") setDisplay(memory.toString());
    if (action === "M+") setMemory((m) => m + val);
    if (action === "M-") setMemory((m) => m - val);
  };

  // Copy result
  const handleCopyResult = () => {
    navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
      if (e.key >= "0" && e.key <= "9") handleDigit(e.key);
      else if (e.key === ".") handleDot();
      else if (e.key === "+") handleOperator("+");
      else if (e.key === "-") handleOperator("-");
      else if (e.key === "*") handleOperator("×");
      else if (e.key === "/") handleOperator("÷");
      else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleEquals();
      } else if (e.key === "Backspace") handleBackspace();
      else if (e.key === "Escape") handleClear();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calculator Body (2 cols on desktop) */}
      <div className="lg:col-span-2 bg-card border border-border/70 rounded-3xl p-5 md:p-7 shadow-xs flex flex-col justify-between">
        {/* Top bar controls */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsScientific(!isScientific)}
              className={cn(
                "px-2.5 py-1 rounded-lg border font-semibold text-[11px] transition-colors",
                isScientific
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                  : "bg-muted text-muted-foreground border-transparent"
              )}
            >
              Mode Ilmiah (Scientific)
            </button>
            {memory !== 0 && (
              <span className="text-[10px] font-mono font-bold bg-muted px-2 py-0.5 rounded text-foreground">
                M: {memory}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyResult}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted text-xs flex items-center gap-1"
              title="Salin Hasil"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copied ? "Tersalin" : "Salin"}</span>
            </button>
          </div>
        </div>

        {/* Digital LCD Display */}
        <div className="bg-muted/40 border border-border/70 rounded-2xl p-4 md:p-6 mb-5 text-right flex flex-col justify-end min-h-[100px]">
          <div className="text-xs md:text-sm text-muted-foreground font-mono truncate min-h-[20px]">
            {expression || " "}
          </div>
          <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-mono text-foreground tracking-tight truncate select-all">
            {display}
          </div>
        </div>

        {/* Memory Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {(["MC", "MR", "M+", "M-"] as const).map((btn) => (
            <button
              key={btn}
              onClick={() => handleMemory(btn)}
              className="py-1.5 rounded-xl bg-muted/50 hover:bg-muted font-mono font-semibold text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Scientific Functions (Conditional) */}
        {isScientific && (
          <div className="grid grid-cols-5 gap-2 mb-3">
            <button
              onClick={() => handleScientificOp("sin")}
              className="py-2 rounded-xl bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground transition-colors"
            >
              sin
            </button>
            <button
              onClick={() => handleScientificOp("cos")}
              className="py-2 rounded-xl bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground transition-colors"
            >
              cos
            </button>
            <button
              onClick={() => handleScientificOp("tan")}
              className="py-2 rounded-xl bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground transition-colors"
            >
              tan
            </button>
            <button
              onClick={() => handleScientificOp("sqrt")}
              className="py-2 rounded-xl bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground transition-colors font-mono"
            >
              √x
            </button>
            <button
              onClick={() => handleScientificOp("sq")}
              className="py-2 rounded-xl bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground transition-colors font-mono"
            >
              x²
            </button>
            <button
              onClick={() => handleScientificOp("log")}
              className="py-2 rounded-xl bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground transition-colors"
            >
              log
            </button>
            <button
              onClick={() => handleScientificOp("ln")}
              className="py-2 rounded-xl bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground transition-colors"
            >
              ln
            </button>
            <button
              onClick={() => handleScientificOp("reciprocal")}
              className="py-2 rounded-xl bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground transition-colors font-mono"
            >
              1/x
            </button>
            <button
              onClick={() => handleDigit(`${Math.PI}`.slice(0, 8))}
              className="py-2 rounded-xl bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground transition-colors font-serif"
            >
              π
            </button>
            <button
              onClick={() => handleScientificOp("fact")}
              className="py-2 rounded-xl bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground transition-colors font-mono"
            >
              n!
            </button>
          </div>
        )}

        {/* Main Keypad Grid */}
        <div className="grid grid-cols-4 gap-2.5">
          {/* Row 1 */}
          <button
            onClick={handleClear}
            className="py-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 font-bold text-sm transition-colors"
          >
            AC
          </button>
          <button
            onClick={handleBackspace}
            className="py-3.5 rounded-2xl bg-muted hover:bg-muted/80 text-foreground font-semibold text-sm transition-colors"
          >
            ⌫
          </button>
          <button
            onClick={() => handleOperator("%")}
            className="py-3.5 rounded-2xl bg-muted hover:bg-muted/80 text-foreground font-semibold text-sm transition-colors"
          >
            %
          </button>
          <button
            onClick={() => handleOperator("÷")}
            className="py-3.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-400 font-bold text-base transition-colors"
          >
            ÷
          </button>

          {/* Row 2 */}
          <button
            onClick={() => handleDigit("7")}
            className="py-3.5 rounded-2xl bg-card border border-border/70 hover:bg-muted/50 font-bold text-base text-foreground transition-colors shadow-2xs"
          >
            7
          </button>
          <button
            onClick={() => handleDigit("8")}
            className="py-3.5 rounded-2xl bg-card border border-border/70 hover:bg-muted/50 font-bold text-base text-foreground transition-colors shadow-2xs"
          >
            8
          </button>
          <button
            onClick={() => handleDigit("9")}
            className="py-3.5 rounded-2xl bg-card border border-border/70 hover:bg-muted/50 font-bold text-base text-foreground transition-colors shadow-2xs"
          >
            9
          </button>
          <button
            onClick={() => handleOperator("×")}
            className="py-3.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-400 font-bold text-base transition-colors"
          >
            ×
          </button>

          {/* Row 3 */}
          <button
            onClick={() => handleDigit("4")}
            className="py-3.5 rounded-2xl bg-card border border-border/70 hover:bg-muted/50 font-bold text-base text-foreground transition-colors shadow-2xs"
          >
            4
          </button>
          <button
            onClick={() => handleDigit("5")}
            className="py-3.5 rounded-2xl bg-card border border-border/70 hover:bg-muted/50 font-bold text-base text-foreground transition-colors shadow-2xs"
          >
            5
          </button>
          <button
            onClick={() => handleDigit("6")}
            className="py-3.5 rounded-2xl bg-card border border-border/70 hover:bg-muted/50 font-bold text-base text-foreground transition-colors shadow-2xs"
          >
            6
          </button>
          <button
            onClick={() => handleOperator("-")}
            className="py-3.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-400 font-bold text-base transition-colors"
          >
            -
          </button>

          {/* Row 4 */}
          <button
            onClick={() => handleDigit("1")}
            className="py-3.5 rounded-2xl bg-card border border-border/70 hover:bg-muted/50 font-bold text-base text-foreground transition-colors shadow-2xs"
          >
            1
          </button>
          <button
            onClick={() => handleDigit("2")}
            className="py-3.5 rounded-2xl bg-card border border-border/70 hover:bg-muted/50 font-bold text-base text-foreground transition-colors shadow-2xs"
          >
            2
          </button>
          <button
            onClick={() => handleDigit("3")}
            className="py-3.5 rounded-2xl bg-card border border-border/70 hover:bg-muted/50 font-bold text-base text-foreground transition-colors shadow-2xs"
          >
            3
          </button>
          <button
            onClick={() => handleOperator("+")}
            className="py-3.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-400 font-bold text-base transition-colors"
          >
            +
          </button>

          {/* Row 5 */}
          <button
            onClick={handleToggleSign}
            className="py-3.5 rounded-2xl bg-card border border-border/70 hover:bg-muted/50 font-semibold text-sm text-foreground transition-colors shadow-2xs"
          >
            ±
          </button>
          <button
            onClick={() => handleDigit("0")}
            className="py-3.5 rounded-2xl bg-card border border-border/70 hover:bg-muted/50 font-bold text-base text-foreground transition-colors shadow-2xs"
          >
            0
          </button>
          <button
            onClick={handleDot}
            className="py-3.5 rounded-2xl bg-card border border-border/70 hover:bg-muted/50 font-bold text-base text-foreground transition-colors shadow-2xs"
          >
            .
          </button>
          <button
            onClick={handleEquals}
            className="py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-lg shadow-sm shadow-amber-600/20 active:scale-[0.98] transition-all"
          >
            =
          </button>
        </div>
      </div>

      {/* History Side Panel */}
      <div className="bg-card border border-border/70 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <History size={16} className="text-amber-600" />
              <h3 className="font-bold text-sm text-foreground">Riwayat Perhitungan</h3>
            </div>
            {history.length > 0 && (
              <button
                onClick={() => setHistory([])}
                className="text-[11px] text-muted-foreground hover:text-rose-600 flex items-center gap-1 transition-colors"
              >
                <Trash2 size={12} /> Hapus
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground space-y-1">
              <p>Belum ada riwayat perhitungan.</p>
              <p className="text-[11px] opacity-75">Hasil kalkulasi otomatis dicatat di sini.</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setDisplay(item.result)}
                  className="p-2.5 rounded-xl bg-muted/30 hover:bg-muted/60 border border-border/40 transition-colors cursor-pointer text-right group"
                  title="Klik untuk masukkan hasil ke kalkulator"
                >
                  <div className="text-[11px] text-muted-foreground font-mono truncate">{item.expression} =</div>
                  <div className="text-base font-bold text-foreground font-mono flex items-center justify-between mt-0.5">
                    <span className="text-[10px] text-muted-foreground/60 font-sans">{item.timestamp}</span>
                    <span className="text-amber-600 dark:text-amber-400 group-hover:underline">{item.result}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-border/40 text-[11px] text-muted-foreground flex items-center gap-1.5">
          <Info size={13} className="shrink-0 text-amber-500" />
          <span>Mendukung keyboard input (angka, +, -, *, /, Enter, Esc).</span>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* TAB 2: KONVERTER SATUAN LENGKAP                                            */
/* ========================================================================= */

type UnitCategory = "length" | "weight" | "area" | "volume" | "temperature" | "digital";

interface UnitDef {
  id: string;
  name: string;
  factor: number; // Factor to base unit (e.g. meter for length, gram for weight)
}

const UNIT_DATA: Record<UnitCategory, { title: string; base: string; units: UnitDef[] }> = {
  length: {
    title: "Panjang & Jarak",
    base: "Meter (m)",
    units: [
      { id: "km", name: "Kilometer (km)", factor: 1000 },
      { id: "m", name: "Meter (m)", factor: 1 },
      { id: "cm", name: "Centimeter (cm)", factor: 0.01 },
      { id: "mm", name: "Millimeter (mm)", factor: 0.001 },
      { id: "mile", name: "Mil (mile)", factor: 1609.344 },
      { id: "yard", name: "Yard (yd)", factor: 0.9144 },
      { id: "ft", name: "Kaki (foot/ft)", factor: 0.3048 },
      { id: "inch", name: "Inci (inch)", factor: 0.0254 },
    ],
  },
  weight: {
    title: "Berat & Massa",
    base: "Gram (g)",
    units: [
      { id: "ton", name: "Metrik Ton (t)", factor: 1000000 },
      { id: "kuintal", name: "Kuintal (q)", factor: 100000 },
      { id: "kg", name: "Kilogram (kg)", factor: 1000 },
      { id: "g", name: "Gram (g)", factor: 1 },
      { id: "mg", name: "Milligram (mg)", factor: 0.001 },
      { id: "lb", name: "Pon (pound/lb)", factor: 453.59237 },
      { id: "oz", name: "Ons (ounce/oz)", factor: 28.3495 },
    ],
  },
  area: {
    title: "Luas Bidang",
    base: "Meter Persegi (m²)",
    units: [
      { id: "km2", name: "Kilometer Persegi (km²)", factor: 1000000 },
      { id: "ha", name: "Hektar (ha)", factor: 10000 },
      { id: "are", name: "Are (a)", factor: 100 },
      { id: "m2", name: "Meter Persegi (m²)", factor: 1 },
      { id: "acre", name: "Acre (ac)", factor: 4046.856422 },
      { id: "sqft", name: "Kaki Persegi (sq ft)", factor: 0.092903 },
    ],
  },
  volume: {
    title: "Volume & Cairan",
    base: "Liter (L)",
    units: [
      { id: "m3", name: "Meter Kubik (m³)", factor: 1000 },
      { id: "l", name: "Liter (L)", factor: 1 },
      { id: "ml", name: "Milliliter (mL)", factor: 0.001 },
      { id: "gal", name: "Gallon US (gal)", factor: 3.78541 },
      { id: "floz", name: "Fluid Ounce (fl oz)", factor: 0.0295735 },
    ],
  },
  temperature: {
    title: "Suhu & Temperatur",
    base: "Celsius (°C)",
    units: [
      { id: "c", name: "Celsius (°C)", factor: 1 },
      { id: "f", name: "Fahrenheit (°F)", factor: 1 },
      { id: "k", name: "Kelvin (K)", factor: 1 },
      { id: "r", name: "Reamur (°R)", factor: 1 },
    ],
  },
  digital: {
    title: "Data Digital / Storage",
    base: "Byte (B)",
    units: [
      { id: "tb", name: "Terabyte (TB)", factor: 1099511627776 },
      { id: "gb", name: "Gigabyte (GB)", factor: 1073741824 },
      { id: "mb", name: "Megabyte (MB)", factor: 1048576 },
      { id: "kb", name: "Kilobyte (KB)", factor: 1024 },
      { id: "b", name: "Byte (B)", factor: 1 },
    ],
  },
};

function UnitConverterSection() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>("km");
  const [toUnit, setToUnit] = useState<string>("m");

  const currentCategoryData = UNIT_DATA[category];

  // Auto select default units when category changes
  useEffect(() => {
    const units = UNIT_DATA[category].units;
    if (units.length >= 2) {
      setFromUnit(units[0].id);
      setToUnit(units[1].id);
    }
  }, [category]);

  // Calculation logic
  const convertedValue = useMemo(() => {
    if (category === "temperature") {
      // Temperature special conversion
      let cVal = inputValue;
      if (fromUnit === "f") cVal = ((inputValue - 32) * 5) / 9;
      else if (fromUnit === "k") cVal = inputValue - 273.15;
      else if (fromUnit === "r") cVal = (inputValue * 5) / 4;

      if (toUnit === "c") return cVal;
      if (toUnit === "f") return (cVal * 9) / 5 + 32;
      if (toUnit === "k") return cVal + 273.15;
      if (toUnit === "r") return (cVal * 4) / 5;
      return cVal;
    }

    const fromFactor = currentCategoryData.units.find((u) => u.id === fromUnit)?.factor || 1;
    const toFactor = currentCategoryData.units.find((u) => u.id === toUnit)?.factor || 1;
    const baseValue = inputValue * fromFactor;
    return baseValue / toFactor;
  }, [category, inputValue, fromUnit, toUnit, currentCategoryData]);

  // Swap units
  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const formattedOutput = Number.isInteger(convertedValue)
    ? convertedValue.toLocaleString("id-ID")
    : Number(convertedValue.toFixed(6)).toLocaleString("id-ID");

  return (
    <div className="bg-card border border-border/70 rounded-3xl p-5 md:p-8 shadow-xs space-y-6">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(Object.keys(UNIT_DATA) as UnitCategory[]).map((catKey) => {
          const isSelected = category === catKey;
          return (
            <button
              key={catKey}
              onClick={() => setCategory(catKey)}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border shrink-0",
                isSelected
                  ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                  : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60"
              )}
            >
              {UNIT_DATA[catKey].title}
            </button>
          );
        })}
      </div>

      {/* Converter Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center pt-2">
        {/* Input Box */}
        <div className="md:col-span-2 p-5 rounded-2xl bg-muted/20 border border-border/60 space-y-3">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Nilai Awal</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(Number(e.target.value))}
            className="w-full text-2xl md:text-3xl font-extrabold font-mono text-foreground bg-transparent border-b border-border/80 focus:border-amber-500 focus:outline-none pb-1"
          />

          <div className="pt-2">
            <span className="text-[11px] text-muted-foreground block mb-1">Pilih Satuan:</span>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full text-sm font-semibold p-2.5 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {currentCategoryData.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button Center */}
        <div className="flex justify-center md:col-span-1">
          <button
            onClick={handleSwap}
            className="w-12 h-12 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 border border-amber-500/30 flex items-center justify-center transition-transform active:scale-95 shadow-xs"
            title="Tukar Satuan"
          >
            <ArrowRightLeft size={18} />
          </button>
        </div>

        {/* Output Box */}
        <div className="md:col-span-2 p-5 rounded-2xl bg-muted/20 border border-border/60 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              Hasil Konversi
            </label>
            <button
              onClick={() => navigator.clipboard.writeText(convertedValue.toString())}
              className="text-[11px] text-amber-600 hover:underline flex items-center gap-1 font-medium"
            >
              <Copy size={12} /> Salin
            </button>
          </div>

          <div className="text-2xl md:text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400 border-b border-border/80 pb-1 truncate">
            {formattedOutput}
          </div>

          <div className="pt-2">
            <span className="text-[11px] text-muted-foreground block mb-1">Dikonversi Ke:</span>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full text-sm font-semibold p-2.5 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {currentCategoryData.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Formula & Reference Footer */}
      <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Info size={15} className="text-amber-600 shrink-0" />
          <span>
            Kategori <strong>{currentCategoryData.title}</strong> — Satuan patokan standar:{" "}
            <strong>{currentCategoryData.base}</strong>.
          </span>
        </div>
        <div className="font-mono text-foreground font-semibold text-right">
          {inputValue} {fromUnit} = {formattedOutput} {toUnit}
        </div>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* TAB 3: DISKON, MARGIN & PERSENTASE NIAGA                                    */
/* ========================================================================= */

function FinancialUtilitySection() {
  // Tool 1: Diskon & PPN
  const [originalPrice, setOriginalPrice] = useState<number>(500000);
  const [discountPercent, setDiscountPercent] = useState<number>(20);
  const [taxPercent, setTaxPercent] = useState<number>(11); // PPN RI 11%

  // Tool 2: Margin & Markup
  const [costPrice, setCostPrice] = useState<number>(250000);
  const [markupPercent, setMarkupPercent] = useState<number>(40);

  // Tool 3: Split Bill
  const [totalBill, setTotalBill] = useState<number>(750000);
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [splitPeople, setSplitPeople] = useState<number>(4);

  // Calculations: Diskon
  const discountAmount = (originalPrice * discountPercent) / 100;
  const priceAfterDiscount = originalPrice - discountAmount;
  const taxAmount = (priceAfterDiscount * taxPercent) / 100;
  const finalPriceWithTax = priceAfterDiscount + taxAmount;

  // Calculations: Margin & Markup
  const sellingPrice = costPrice * (1 + markupPercent / 100);
  const grossProfit = sellingPrice - costPrice;
  const grossMargin = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;

  // Calculations: Split Bill
  const totalTip = (totalBill * tipPercent) / 100;
  const grandTotalBill = totalBill + totalTip;
  const perPersonPay = splitPeople > 0 ? grandTotalBill / splitPeople : grandTotalBill;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Tool 1: Diskon & PPN */}
      <div className="p-5 md:p-6 rounded-3xl bg-card border border-border/70 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Percent size={18} className="text-amber-600" />
            <h3 className="font-bold text-base text-foreground">Diskon & Pajak (PPN)</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-muted-foreground block mb-1 font-medium">Harga Asli (Rp)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border text-foreground font-mono font-bold text-sm focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-muted-foreground block mb-1 font-medium">Diskon (%)</label>
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full p-2 rounded-xl bg-muted/40 border border-border text-foreground font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="text-muted-foreground block mb-1 font-medium">Pajak PPN (%)</label>
                <input
                  type="number"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value))}
                  className="w-full p-2 rounded-xl bg-muted/40 border border-border text-foreground font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-border/50 space-y-2 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Hemat Diskon:</span>
            <span className="font-mono text-emerald-600 font-semibold">-Rp {discountAmount.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Biaya Pajak:</span>
            <span className="font-mono font-medium">+Rp {taxAmount.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-border/40">
            <span className="font-bold text-foreground">Total Bayar:</span>
            <strong className="text-lg font-mono text-amber-600 dark:text-amber-400">
              Rp {finalPriceWithTax.toLocaleString("id-ID")}
            </strong>
          </div>
        </div>
      </div>

      {/* Tool 2: Markup & Margin Laba */}
      <div className="p-5 md:p-6 rounded-3xl bg-card border border-border/70 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <DollarSign size={18} className="text-emerald-600" />
            <h3 className="font-bold text-base text-foreground">Margin & Markup Jual</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-muted-foreground block mb-1 font-medium">Harga Modal / HPP (Rp)</label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border text-foreground font-mono font-bold text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="text-muted-foreground block mb-1 font-medium">Markup yang Diinginkan (%)</label>
              <input
                type="number"
                value={markupPercent}
                onChange={(e) => setMarkupPercent(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border text-foreground font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-border/50 space-y-2 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Keuntungan Bersih:</span>
            <span className="font-mono text-emerald-600 font-semibold">+Rp {grossProfit.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Margin Kotor:</span>
            <span className="font-mono font-bold text-foreground">{grossMargin.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-border/40">
            <span className="font-bold text-foreground">Harga Jual:</span>
            <strong className="text-lg font-mono text-emerald-600">Rp {sellingPrice.toLocaleString("id-ID")}</strong>
          </div>
        </div>
      </div>

      {/* Tool 3: Split Bill & Patungan */}
      <div className="p-5 md:p-6 rounded-3xl bg-card border border-border/70 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Banknote size={18} className="text-blue-600" />
            <h3 className="font-bold text-base text-foreground">Bagi Tagihan (Split Bill)</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-muted-foreground block mb-1 font-medium">Total Struk Tagihan (Rp)</label>
              <input
                type="number"
                value={totalBill}
                onChange={(e) => setTotalBill(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border text-foreground font-mono font-bold text-sm focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-muted-foreground block mb-1 font-medium">Tip Pelayanan (%)</label>
                <input
                  type="number"
                  value={tipPercent}
                  onChange={(e) => setTipPercent(Number(e.target.value))}
                  className="w-full p-2 rounded-xl bg-muted/40 border border-border text-foreground font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="text-muted-foreground block mb-1 font-medium">Jumlah Orang</label>
                <input
                  type="number"
                  min={1}
                  value={splitPeople}
                  onChange={(e) => setSplitPeople(Math.max(1, Number(e.target.value)))}
                  className="w-full p-2 rounded-xl bg-muted/40 border border-border text-foreground font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-border/50 space-y-2 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Total Tip:</span>
            <span className="font-mono text-muted-foreground font-medium">Rp {totalTip.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Grand Total:</span>
            <span className="font-mono font-medium text-foreground">Rp {grandTotalBill.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-border/40">
            <span className="font-bold text-foreground">Per Orang Bayar:</span>
            <strong className="text-lg font-mono text-blue-600">Rp {Math.round(perPersonPay).toLocaleString("id-ID")}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* TAB 4: KALKULATOR TANGGAL & HARI KERJA                                      */
/* ========================================================================= */

function DateCalculatorSection() {
  // Mode A: Selisih 2 Tanggal
  const [startDate, setStartDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 90);
    return d.toISOString().split("T")[0];
  });

  // Mode B: Tambah / Kurang Hari
  const [baseDate, setBaseDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [addDays, setAddDays] = useState<number>(45);

  // Perhitungan Selisih Tanggal
  const dateDiffStats = useMemo(() => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diffTime = e.getTime() - s.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Hitung hari kerja (weekday: senin - jumat)
    let businessDays = 0;
    const cur = new Date(s);
    while (cur < e) {
      cur.setDate(cur.getDate() + 1);
      const day = cur.getDay();
      if (day !== 0 && day !== 6) businessDays++;
    }

    const weeks = Math.floor(diffDays / 7);
    const remainingDays = diffDays % 7;

    return {
      totalDays: diffDays,
      businessDays,
      weeks,
      remainingDays,
    };
  }, [startDate, endDate]);

  // Perhitungan Tambah Tanggal
  const targetCalculatedDate = useMemo(() => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + Number(addDays || 0));
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [baseDate, addDays]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Sub-tool 1: Selisih Tanggal */}
      <div className="p-6 rounded-3xl bg-card border border-border/70 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-amber-600" />
          <h3 className="font-bold text-base text-foreground">Selisih & Jarak Antara 2 Tanggal</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Gunakan untuk menghitung sisa waktu kontrak proyek, masa garansi, atau tenggat waktu.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="text-xs text-muted-foreground block mb-1 font-medium">Tanggal Mulai</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-muted/40 border border-border text-foreground font-mono text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1 font-medium">Tanggal Selesai</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-muted/40 border border-border text-foreground font-mono text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3">
          <div className="p-3 rounded-2xl bg-muted/30 border border-border/50 text-center">
            <span className="text-[10px] text-muted-foreground block">Total Hari</span>
            <strong className="text-xl font-bold font-mono text-foreground">{dateDiffStats.totalDays}</strong>
          </div>
          <div className="p-3 rounded-2xl bg-muted/30 border border-border/50 text-center">
            <span className="text-[10px] text-muted-foreground block">Hari Kerja</span>
            <strong className="text-xl font-bold font-mono text-amber-600">{dateDiffStats.businessDays}</strong>
          </div>
          <div className="p-3 rounded-2xl bg-muted/30 border border-border/50 text-center">
            <span className="text-[10px] text-muted-foreground block">Minggu</span>
            <strong className="text-xl font-bold font-mono text-foreground">
              {dateDiffStats.weeks}m {dateDiffStats.remainingDays}h
            </strong>
          </div>
        </div>
      </div>

      {/* Sub-tool 2: Proyeksi Jatuh Tempo (+/- Hari) */}
      <div className="p-6 rounded-3xl bg-card border border-border/70 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-indigo-600" />
          <h3 className="font-bold text-base text-foreground">Hitung Tanggal Jatuh Tempo</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Tambahkan atau kurangi sejumlah hari dari tanggal acuan untuk menemukan tanggal tepat.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="text-xs text-muted-foreground block mb-1 font-medium">Tanggal Acuan</label>
            <input
              type="date"
              value={baseDate}
              onChange={(e) => setBaseDate(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-muted/40 border border-border text-foreground font-mono text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1 font-medium">Jumlah Hari Tambah/Kurang</label>
            <input
              type="number"
              value={addDays}
              onChange={(e) => setAddDays(Number(e.target.value))}
              placeholder="e.g. 30 atau -14"
              className="w-full p-2.5 rounded-xl bg-muted/40 border border-border text-foreground font-mono text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mt-3">
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider block">
            Hasil Tanggal Proyeksi
          </span>
          <div className="text-lg md:text-xl font-extrabold text-foreground mt-1">{targetCalculatedDate}</div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* TAB 5: PENGHITUNG PECAHAN UANG TUNAI RUPIAH (CASH COUNTER)                 */
/* ========================================================================= */

interface Denomination {
  value: number;
  label: string;
}

const RUPIAH_DENOMINATIONS: Denomination[] = [
  { value: 100000, label: "Rp 100.000 (Merah)" },
  { value: 50000, label: "Rp 50.000 (Biru)" },
  { value: 20000, label: "Rp 20.000 (Hijau)" },
  { value: 10000, label: "Rp 10.000 (Ungu)" },
  { value: 5000, label: "Rp 5.000 (Kuning / Cokelat)" },
  { value: 2000, label: "Rp 2.000 (Abu-abu)" },
  { value: 1000, label: "Rp 1.000 (Koin / Kertas)" },
  { value: 500, label: "Rp 500 (Koin Logam)" },
];

function CashDenominationSection() {
  const [counts, setCounts] = useState<Record<number, number>>({
    100000: 0,
    50000: 0,
    20000: 0,
    10000: 0,
    5000: 0,
    2000: 0,
    1000: 0,
    500: 0,
  });

  const [copied, setCopied] = useState(false);

  const handleCountChange = (value: number, amount: number) => {
    setCounts((prev) => ({
      ...prev,
      [value]: Math.max(0, amount),
    }));
  };

  const handleReset = () => {
    setCounts({
      100000: 0,
      50000: 0,
      20000: 0,
      10000: 0,
      5000: 0,
      2000: 0,
      1000: 0,
      500: 0,
    });
  };

  const totalCash = useMemo(() => {
    return RUPIAH_DENOMINATIONS.reduce((sum, denom) => {
      const qty = counts[denom.value] || 0;
      return sum + denom.value * qty;
    }, 0);
  }, [counts]);

  const totalLembar = useMemo(() => {
    return Object.values(counts).reduce((sum, q) => sum + q, 0);
  }, [counts]);

  const handleCopySummary = () => {
    const lines = RUPIAH_DENOMINATIONS.filter((d) => (counts[d.value] || 0) > 0).map(
      (d) =>
        `- ${d.label}: ${counts[d.value]} lembar/keping = Rp ${(d.value * counts[d.value]).toLocaleString("id-ID")}`
    );
    const summaryText = `Rincian Kas Fisik:\n${lines.join("\n")}\n\nTotal Fisik: Rp ${totalCash.toLocaleString(
      "id-ID"
    )} (${totalLembar} lembar)`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card border border-border/70 rounded-3xl p-5 md:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">Penghitung Fisik Uang Kas (Petty Cash Counter)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ketikkan jumlah lembar/keping uang untuk menghitung total saldo fisik kas kecil secara instan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <RotateCcw size={13} /> Reset
          </button>
          <button
            onClick={handleCopySummary}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? "Tersalin!" : "Salin Rincian"}</span>
          </button>
        </div>
      </div>

      {/* Grid of Denominations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {RUPIAH_DENOMINATIONS.map((denom) => {
          const count = counts[denom.value] || 0;
          const subtotal = denom.value * count;

          return (
            <div key={denom.value} className="p-3.5 rounded-2xl bg-muted/20 border border-border/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{denom.label}</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={count === 0 ? "" : count}
                  onChange={(e) => handleCountChange(denom.value, Number(e.target.value))}
                  placeholder="0"
                  className="w-24 p-2 rounded-xl bg-card border border-border text-foreground font-mono font-bold text-sm text-center focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <span className="text-xs text-muted-foreground">lbr</span>
              </div>

              <div className="text-right text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">
                Rp {subtotal.toLocaleString("id-ID")}
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Result Bar */}
      <div className="p-5 rounded-2xl bg-muted/40 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider block">
            Total Kas Tunai Dihitung
          </span>
          <span className="text-xs text-muted-foreground">{totalLembar} lembar / keping uang</span>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-3xl md:text-4xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
            Rp {totalCash.toLocaleString("id-ID")}
          </div>
        </div>
      </div>
    </div>
  );
}
