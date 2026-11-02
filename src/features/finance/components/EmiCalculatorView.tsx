import { useState } from "react";
import { ChevronLeft } from "lucide-react";

export function EmiCalculatorView({ onBack }: { onBack: () => void }) {
  const [emiType, setEmiType] = useState("arrears");

  return (
    <div className="min-h-screen bg-transparent p-4 font-sans text-foreground flex flex-col pb-10">
      <div className="flex items-center gap-2 mb-6 pt-2">
        <button
          onClick={onBack}
          className="p-1 -ml-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={28} strokeWidth={2} />
        </button>
        <h1 className="text-lg font-normal tracking-wide text-foreground">EMI Calculator</h1>
      </div>

      <div className="space-y-4 flex-1">
        {/* Your Amount */}
        <div className="flex gap-2">
          <div className="flex-1 border border-border rounded-2xl px-4 py-3 bg-card">
            <input
              type="text"
              className="w-full bg-transparent outline-none font-medium text-foreground placeholder:text-muted-foreground/70 text-base"
              placeholder="Your Amount"
            />
          </div>
          <button className="bg-[#2a2a2a] text-foreground font-medium rounded-2xl px-6 border border-border">
            IDR
          </button>
        </div>

        {/* Interest Rate */}
        <div className="flex gap-2">
          <div className="flex-1 border border-border rounded-2xl px-4 py-3 bg-card">
            <input
              type="text"
              className="w-full bg-transparent outline-none font-medium text-foreground placeholder:text-muted-foreground/70 text-sm"
              placeholder="Interest Rate Per Year"
            />
          </div>
          <button className="bg-[#2a2a2a] text-foreground font-medium rounded-2xl px-[18px] border border-border">
            Reduce
          </button>
          <button className="bg-[#1976d2] text-foreground font-medium rounded-2xl px-[22px]">
            Flat
          </button>
        </div>

        {/* Tenure */}
        <div className="flex gap-2">
          <div className="flex-1 border border-border rounded-2xl px-4 py-3 bg-card">
            <input
              type="text"
              className="w-full bg-transparent outline-none font-medium text-foreground placeholder:text-muted-foreground/70 text-base"
              placeholder="Tenure in Month"
            />
          </div>
          <button className="bg-[#2a2a2a] text-foreground font-medium rounded-2xl px-5 border border-border">
            Year
          </button>
          <button className="bg-[#4caf50] text-foreground font-medium rounded-2xl px-4">
            Month
          </button>
        </div>

        {/* Processing Fees */}
        <div className="flex gap-2 relative mt-4">
          <fieldset className="flex-1 border border-border rounded-2xl px-4 py-2 bg-card focus-within:border-border pt-1.5">
            <legend className="text-xs font-medium text-muted-foreground px-1 ml-1 bg-background -mt-0.5">
              Processing Fees
            </legend>
            <input
              type="text"
              className="w-full bg-transparent outline-none font-medium text-foreground text-lg px-1 pb-1"
              defaultValue="0"
            />
          </fieldset>
          <div className="flex items-end gap-2 shrink-0">
            <button className="bg-[#2a2a2a] text-foreground font-medium rounded-2xl px-[18px] h-[52px] border border-border">
              Rate
            </button>
            <button className="bg-[#ff9800] text-foreground font-medium rounded-2xl px-[18px] h-[52px]">
              IDR
            </button>
          </div>
        </div>

        {/* GST On Interest */}
        <div className="relative mt-2">
          <fieldset className="relative border border-border rounded-2xl px-4 pt-1.5 pb-2 bg-card focus-within:border-border">
            <legend className="text-xs font-medium text-muted-foreground px-1 ml-1 bg-background -mt-0.5">
              GST On Interest
            </legend>
            <input
              type="text"
              className="w-full bg-transparent outline-none font-medium text-foreground text-lg px-1 pb-1"
              defaultValue="0"
            />
          </fieldset>
        </div>

        {/* Toggle Types */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <button
            onClick={() => setEmiType("arrears")}
            className={`rounded-2xl py-4 text-sm font-medium transition-colors border ${emiType === "arrears" ? "bg-[#1976d2] border-[#1976d2] text-foreground" : "bg-card border-border text-muted-foreground hover:bg-accent"}`}
          >
            EMI in Arrears
          </button>
          <button
            onClick={() => setEmiType("advance")}
            className={`rounded-2xl py-4 text-sm font-medium transition-colors border ${emiType === "advance" ? "bg-[#1976d2] border-[#1976d2] text-foreground" : "bg-card border-border text-muted-foreground hover:bg-accent"}`}
          >
            EMI in Advance
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2 mt-8">
        <button className="bg-[#4caf50] text-foreground font-medium rounded-full py-[14px] px-2 shadow-md active:scale-95 transition-transform text-sm">
          Calculate
        </button>
        <button className="bg-[#2a2a2a] text-foreground border border-border font-medium rounded-full py-[14px] px-2 active:scale-95 transition-transform text-sm">
          Reset
        </button>
        <button className="bg-[#2a2a2a] text-foreground border border-border font-medium rounded-full py-[14px] px-2 active:scale-95 transition-transform text-sm">
          History
        </button>
      </div>
    </div>
  );
}
