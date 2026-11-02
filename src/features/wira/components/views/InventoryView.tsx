import { Archive, Plus } from "lucide-react";
import { ShellHeader } from "@/app/shell-header";

export function InventoryView() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto w-full h-full flex flex-col">
      <ShellHeader>
        <button
          title="Add Item"
          aria-label="Add Item"
          className="p-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs flex items-center justify-center shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </ShellHeader>
      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl bg-card/50 p-8">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <Archive size={32} className="text-blue-500" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Inventory empty</h3>
        <p className="text-muted-foreground mt-2 max-w-md text-center">
          Start cataloging your items.
        </p>
      </div>
    </div>
  );
}
