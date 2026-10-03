import { cn } from "@/lib/utils";
import { humanize } from "@/lib/format";
import type {
  AlertStatus,
  CasePriority,
  CaseStatus,
  Decision,
  RiskLevel,
} from "@/types/risknet";

const riskStyles: Record<RiskLevel, string> = {
  LOW: "border-risk-low/40 bg-risk-low/12 text-risk-low",
  MEDIUM: "border-risk-medium/40 bg-risk-medium/12 text-risk-medium",
  HIGH: "border-risk-high/40 bg-risk-high/12 text-risk-high",
  CRITICAL: "border-risk-critical/50 bg-risk-critical/15 text-risk-critical",
};

const chip =
  "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider";

export function RiskBadge({ level, className }: { level: string; className?: string }) {
  return (
    <span className={cn(chip, riskStyles[level as RiskLevel] ?? riskStyles.LOW, className)}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {level}
    </span>
  );
}

const statusStyles: Record<AlertStatus | CaseStatus, string> = {
  OPEN: "border-primary/40 bg-primary/12 text-primary",
  IN_PROGRESS: "border-risk-medium/40 bg-risk-medium/12 text-risk-medium",
  ESCALATED: "border-risk-critical/45 bg-risk-critical/12 text-risk-critical",
  CLOSED: "border-border bg-secondary text-muted-foreground",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        chip,
        statusStyles[status as AlertStatus | CaseStatus] ?? statusStyles.CLOSED,
        className,
      )}
    >
      {humanize(status)}
    </span>
  );
}

const priorityStyles: Record<CasePriority, string> = {
  LOW: "border-border bg-secondary text-muted-foreground",
  MEDIUM: "border-risk-low/40 bg-risk-low/12 text-risk-low",
  HIGH: "border-risk-high/40 bg-risk-high/12 text-risk-high",
  URGENT: "border-risk-critical/50 bg-risk-critical/15 text-risk-critical",
};

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={cn(chip, priorityStyles[priority as CasePriority] ?? priorityStyles.LOW)}>
      {priority}
    </span>
  );
}

const decisionStyles: Record<Decision, string> = {
  CLEAR: "border-risk-low/40 bg-risk-low/12 text-risk-low",
  ESCALATE: "border-risk-high/40 bg-risk-high/12 text-risk-high",
  REPORT_SUSPICIOUS: "border-risk-critical/50 bg-risk-critical/15 text-risk-critical",
  FALSE_POSITIVE: "border-border bg-secondary text-muted-foreground",
};

export function DecisionBadge({ decision }: { decision?: Decision | null }) {
  if (!decision) {
    return <span className="text-xs text-muted-foreground">Pending decision</span>;
  }
  return <span className={cn(chip, decisionStyles[decision])}>{humanize(decision)}</span>;
}

export function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 85) return "CRITICAL";
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

const barColor: Record<RiskLevel, string> = {
  LOW: "bg-risk-low",
  MEDIUM: "bg-risk-medium",
  HIGH: "bg-risk-high",
  CRITICAL: "bg-risk-critical",
};

export function RiskScore({
  score,
  level,
  className,
}: {
  score: number;
  level?: string;
  className?: string;
}) {
  const resolved = (level as RiskLevel | undefined) ?? riskLevelFromScore(score);
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="mono w-8 text-sm font-semibold text-foreground">{score}</span>
      <span className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary" aria-hidden>
        <span
          className={cn("block h-full rounded-full", barColor[resolved])}
          style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
        />
      </span>
    </div>
  );
}
