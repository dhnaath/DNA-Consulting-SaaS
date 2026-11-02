import { cn } from "@/lib/utils";
import React, { type ReactNode } from "react";

const nadaStatus: Record<string, string> = {
  aktif: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  prospek: "bg-amber-500/12 text-amber-700 dark:text-amber-400",
  selesai: "bg-muted text-muted-foreground dark:text-muted-foreground/50",
  berjalan: "bg-primary/12 text-primary",
  perencanaan: "bg-violet-500/12 text-violet-700 dark:text-violet-400",
  tertahan: "bg-rose-500/12 text-rose-700 dark:text-rose-400",
  todo: "bg-muted text-muted-foreground dark:text-muted-foreground/50",
  review: "bg-sky-500/12 text-sky-700 dark:text-sky-400",
  draft: "bg-muted text-muted-foreground dark:text-muted-foreground/50",
  disetujui: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  tinggi: "bg-rose-500/12 text-rose-700 dark:text-rose-400",
  sedang: "bg-amber-500/12 text-amber-700 dark:text-amber-400",
  rendah: "bg-muted text-muted-foreground dark:text-muted-foreground/50",
};

export function Pill({ value, label }: { value: string; label?: string | undefined }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        nadaStatus[value] ?? "bg-muted text-muted-foreground",
      )}
    >
      {label ?? value}
    </span>
  );
}

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  aksi?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Panel({
  title,
  aksi,
  children,
  className,
  ...props
}: PanelProps) {
  return (
    <section
      className={cn("rounded-2xl border border-border bg-card text-card-foreground shadow-xs", className)}
      {...props}
    >
      {title ? (
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
          <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
          {aksi}
        </div>
      ) : null}
      <div className={title ? "p-5" : ""}>{children}</div>
    </section>
  );
}

export function Bar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function Kosong({ pesan }: { pesan: string }) {
  return <p className="py-8 text-center text-sm text-muted-foreground">{pesan}</p>;
}
