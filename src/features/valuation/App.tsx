import { useState } from "react";
import { Building, Briefcase } from "lucide-react";
import ValuationTools from "./components/ValuationTools";

export default function App_Component() {
  const [activeTab, setActiveTab] = useState<"property" | "business">("property");

  return (
    <div className="w-full bg-transparent text-foreground font-sans">
      {/* Tab controls */}
      <div className="px-6 sm:px-8 pt-4 pb-4 flex items-center justify-end border-b border-border/40">
        <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg">
          <button
            onClick={() => setActiveTab("property")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all ${activeTab === "property" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Building size={16} />
            <span>Properti</span>
          </button>
          <button
            onClick={() => setActiveTab("business")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all ${activeTab === "business" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Briefcase size={16} />
            <span>Bisnis</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full p-6 sm:p-8">
        <ValuationTools activeTab={activeTab} />
      </div>
    </div>
  );
}
