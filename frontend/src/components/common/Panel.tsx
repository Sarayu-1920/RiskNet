import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("panel overflow-hidden", className)}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            {title && <h2 className="text-sm font-semibold text-foreground">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "primary" | "high" | "critical";
}) {
  const toneRing: Record<string, string> = {
    default: "border-border",
    primary: "border-primary/35",
    high: "border-risk-high/35",
    critical: "border-risk-critical/40",
  };
  const toneText: Record<string, string> = {
    default: "text-foreground",
    primary: "text-primary",
    high: "text-risk-high",
    critical: "text-risk-critical",
  };
  return (
    <div className={cn("panel px-4 py-3.5", toneRing[tone])}>
      <p className="label-caps">{label}</p>
      <p className={cn("mono mt-2 text-2xl font-semibold", toneText[tone])}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function FieldList({
  items,
  columns = 2,
}: {
  items: Array<{ label: string; value: ReactNode }>;
  columns?: 1 | 2;
}) {
  return (
    <dl className={cn("grid gap-x-6 gap-y-3.5", columns === 2 ? "sm:grid-cols-2" : "")}>
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="label-caps">{item.label}</dt>
          <dd className="mt-1 truncate text-sm text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
