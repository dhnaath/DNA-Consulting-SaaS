import React from "react";
import { cn } from "../utils";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5", className)} {...props}>
      {children}
    </div>
  );
}

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  const base =
    "inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    ghost: "shadow-none hover:bg-accent hover:text-accent-foreground",
  };

  return <button className={cn(base, variants[variant], className)} {...props} />;
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("block text-sm font-medium text-foreground mb-1.5", className)}
      {...props}
    />
  );
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning" | "danger";
}) {
  const variants = {
    default: "bg-muted text-muted-foreground",
    success: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
    warning: "bg-amber-500/12 text-amber-700 dark:text-amber-400",
    danger: "bg-rose-500/12 text-rose-700 dark:text-rose-400",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
