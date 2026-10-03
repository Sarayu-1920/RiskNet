import { Link } from "@tanstack/react-router";
import {
  Activity,
  BellRing,
  Database,
  FileSearch,
  Gauge,
  Menu,
  Radar,
  ScrollText,
  ShieldAlert,
  Users,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { USING_MOCK_DATA } from "@/services/api";

const navItems = [
  { to: "/", label: "Dashboard", icon: Gauge },
  { to: "/alerts", label: "Alerts", icon: BellRing },
  { to: "/applicants", label: "Applicants", icon: Users },
  { to: "/investigations", label: "Investigations", icon: Radar },
  { to: "/cases", label: "Cases", icon: FileSearch },
  { to: "/audit", label: "Audit", icon: ScrollText },
] as const;

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex items-center gap-2.5 border-b border-sidebar-border px-4 py-4">
        <span className="flex size-8 items-center justify-center rounded-md bg-primary/15 text-primary">
          <ShieldAlert className="size-4" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold tracking-tight text-sidebar-foreground">RiskNet</p>
          <p className="text-[11px] text-muted-foreground">Fraud Investigation</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-3" aria-label="Main">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            activeOptions={{ exact: to === "/" }}
            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            activeProps={{
              className:
                "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-l-2 border-sidebar-primary",
            }}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-sidebar-border px-4 py-3">
        <p className="label-caps">Data source</p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-sidebar-foreground/80">
          <Database className="size-3.5" aria-hidden />
          {USING_MOCK_DATA ? "Mock fixtures" : "Spring Boot API"}
        </p>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-sidebar-border lg:block">
        <SidebarContent />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-background/80"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-60 border-r border-sidebar-border">
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
            <button
              className="rounded-md border border-border p-2 text-muted-foreground lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-base font-semibold text-foreground">{title}</h1>
              {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
            </div>
            {actions}
            <div className="hidden items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5 sm:flex">
              <Activity className="size-3.5 text-risk-low" aria-hidden />
              <span className="text-xs text-muted-foreground">Analyst</span>
              <span className="mono text-xs text-foreground">n.arvidsson</span>
            </div>
          </div>
        </header>

        <main className="px-4 py-5 sm:px-6 sm:py-6">{children}</main>
      </div>
    </div>
  );
}
