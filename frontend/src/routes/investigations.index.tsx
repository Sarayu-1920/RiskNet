import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Radar } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Panel } from "@/components/common/Panel";
import { RiskBadge, StatusBadge } from "@/components/common/Badges";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/DataStates";
import { getAlerts } from "@/services/api";
import { humanize, relativeTime } from "@/lib/format";

export const Route = createFileRoute("/investigations/")({
  head: () => ({
    meta: [
      { title: "Investigations · RiskNet" },
      {
        name: "description",
        content:
          "Start a fraud investigation workspace with the applicant relationship graph and alert context.",
      },
      { property: "og:title", content: "Investigations · RiskNet" },
      {
        property: "og:description",
        content: "Pick an applicant to open the graph-driven investigation workspace.",
      },
    ],
  }),
  component: InvestigationsPage,
});

function InvestigationsPage() {
  const navigate = useNavigate();
  const [applicantId, setApplicantId] = useState("");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["alerts", { status: "ALL", riskLevel: "ALL" }],
    queryFn: () => getAlerts(),
  });

  const queue = [...(data ?? [])]
    .filter((a) => a.status !== "CLOSED")
    .sort((a, b) => b.riskScore - a.riskScore);

  return (
    <AppShell title="Investigations" subtitle="Graph-driven fraud investigation workspaces">
      <div className="space-y-5">
        <Panel title="Open a workspace" description="Investigations are keyed by applicant ID">
          <form
            className="flex flex-wrap gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const id = applicantId.trim();
              if (id) navigate({ to: "/investigations/$applicantId", params: { applicantId: id } });
            }}
          >
            <input
              value={applicantId}
              onChange={(e) => setApplicantId(e.target.value)}
              placeholder="e.g. APP-5512"
              aria-label="Applicant ID"
              className="mono min-w-56 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Radar className="size-3.5" aria-hidden /> Open investigation
            </button>
          </form>
        </Panel>

        <Panel
          title="Investigation queue"
          description="Unresolved alerts ordered by risk score"
          bodyClassName="p-0"
        >
          {isPending ? (
            <div className="p-4">
              <LoadingState />
            </div>
          ) : isError ? (
            <div className="p-4">
              <ErrorState onRetry={() => refetch()} />
            </div>
          ) : queue.length === 0 ? (
            <div className="p-4">
              <EmptyState title="Nothing awaiting investigation" />
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {queue.map((alert) => (
                <li key={alert.alertId}>
                  <Link
                    to="/investigations/$applicantId"
                    params={{ applicantId: alert.applicantId }}
                    className="flex flex-wrap items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/40"
                  >
                    <span className="mono w-24 text-xs text-primary">{alert.applicantId}</span>
                    <span className="min-w-0 flex-1">
                      <span className="mono block truncate text-sm text-foreground">
                        {alert.applicantId}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {alert.alertId} · {humanize(alert.alertType)} ·{" "}
                        {relativeTime(alert.generatedAt)}
                      </span>
                    </span>
                    <RiskBadge level={alert.riskLevel} />
                    <StatusBadge status={alert.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
