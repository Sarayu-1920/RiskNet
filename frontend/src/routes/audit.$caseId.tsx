import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Panel } from "@/components/common/Panel";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/DataStates";
import { getAudit } from "@/services/api";
import { formatDateTime, humanize, relativeTime } from "@/lib/format";

export const Route = createFileRoute("/audit/$caseId")({
  head: () => ({
    meta: [
      { title: "Case audit trail · RiskNet" },
      {
        name: "description",
        content: "Chronological audit history for a case: action, performed by, timestamp and details.",
      },
      { property: "og:title", content: "Case audit trail · RiskNet" },
      { property: "og:description", content: "Every recorded action on a fraud investigation case." },
    ],
  }),
  component: AuditTrailPage,
});

function AuditTrailPage() {
  const { caseId } = useParams({ from: "/audit/$caseId" });
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["audit", caseId],
    queryFn: () => getAudit(caseId),
  });

  const entries = [...(data ?? [])].sort(
    (a, b) => +new Date(b.actionTimestamp) - +new Date(a.actionTimestamp),
  );

  return (
    <AppShell
      title={`Audit · ${caseId}`}
      subtitle={`GET /api/audit/${caseId}`}
      actions={
        <div className="flex gap-2">
          <Link
            to="/audit"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-accent"
          >
            <ArrowLeft className="size-3.5" aria-hidden /> Audit
          </Link>
          <Link
            to="/cases/$caseId"
            params={{ caseId }}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-accent"
          >
            Open case
          </Link>
        </div>
      }
    >
      <Panel title="Audit history" description={`${entries.length} recorded action(s)`} bodyClassName="p-0">
        {isPending ? (
          <div className="p-4">
            <LoadingState label="Loading audit trail…" />
          </div>
        ) : isError ? (
          <div className="p-4">
            <ErrorState message={`Audit history for ${caseId} is unavailable.`} onRetry={() => refetch()} />
          </div>
        ) : entries.length === 0 ? (
          <div className="p-4">
            <EmptyState title="No audit entries" description="This case has no recorded actions yet." />
          </div>
        ) : (
          <ol className="divide-y divide-border">
            {entries.map((entry) => (
              <li key={entry.auditId} className="flex gap-3 px-4 py-3.5">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-hidden />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{humanize(entry.action)}</p>
                  <p className="mono mt-0.5 text-[11px] text-muted-foreground">
                    {entry.performedBy} · {formatDateTime(entry.actionTimestamp)} ·{" "}
                    {relativeTime(entry.actionTimestamp)}
                  </p>
                  {entry.details && (
                    <p className="mt-1.5 text-xs text-muted-foreground">{entry.details}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </Panel>
    </AppShell>
  );
}
