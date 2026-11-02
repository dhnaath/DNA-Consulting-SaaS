import { LayoutTemplate } from 'lucide-react';

export function VisualLayoutMockup({ layout }: { layout: any }) {
  // A generic fallback visualizer for the different layout types
  return (
    <div className="w-full bg-accent/20 rounded-xl border border-border p-8 flex flex-col items-center justify-center min-h-[200px]">
      <LayoutTemplate className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
      <div className="text-center">
        <h4 className="text-sm font-semibold text-foreground mb-2">
          {layout.tipe}
        </h4>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-lg">
          {layout.elemen.map((el: string, idx: number) => (
            <span key={idx} className="px-3 py-1.5 bg-background border border-border rounded-md text-xs font-medium text-muted-foreground shadow-sm">
              {el}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
