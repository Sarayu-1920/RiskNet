import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Panel } from "@/components/common/Panel";
import { RiskBadge, RiskScore, StatusBadge } from "@/components/common/Badges";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/DataStates";
import { getAlerts } from "@/services/api";
import { formatDateTime, humanize } from "@/lib/format";
import type { AlertStatus, RiskLevel } from "@/types/risknet";

export const Route = createFileRoute("/alerts/")({
  head: () => ({
    meta: [
      { title: "Alerts · RiskNet" },
      {
        name: "description",
        content: "Triage fraud alerts by status, risk level and alert type in the RiskNet queue.",
      },
      { property: "og:title", content: "Alerts · RiskNet" },
      {
        property: "og:description",
        content: "Filterable fraud alert queue with risk scores and investigation status.",
      },
    ],
  }),
  component: AlertsPage,
});

const statusOptions: Array<AlertStatus | "ALL"> = [
  "ALL",
  "OPEN",
  "IN_PROGRESS",
  "ESCALATED",
  "CLOSED",
];
const riskOptions: Array<RiskLevel | "ALL"> = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

const selectClass =
  "rounded-md border border-input bg-surface px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function AlertsPage() {
  const [status, setStatus] = useState<AlertStatus | "ALL">("ALL");
  const [riskLevel, setRiskLevel] = useState<RiskLevel | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["alerts", { status, riskLevel }],
    queryFn: () => getAlerts({ status, riskLevel }),
  });

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data ?? [];
    return (data ?? []).filter((a) =>
      [a.alertId, a.applicantId, a.alertType].some((v) =>
        v.toLowerCase().includes(term),
      ),
    );
  }, [data, search]);

  return (
    <AppShell title="Alerts" subtitle="Fraud alert queue from GET /api/alerts">
      <Panel
        title={`${rows.length} alert${rows.length === 1 ? "" : "s"}`}
        description="Filters map directly to the status and riskLevel query parameters"
        bodyClassName="p-0"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search alert, applicant, type"
                aria-label="Search alerts"
                className="w-56 rounded-md border border-input bg-surface py-1.5 pl-8 pr-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <select
              aria-label="Filter by status"
              className={selectClass}
              value={status}
              onChange={(e) => setStatus(e.target.value as AlertStatus | "ALL")}
            >
              {statusOptions.map((o) => (
                <option key={o} value={o}>
                  {o === "ALL" ? "All statuses" : humanize(o)}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter by risk level"
              className={selectClass}
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value as RiskLevel | "ALL")}
            >
              {riskOptions.map((o) => (
                <option key={o} value={o}>
                  {o === "ALL" ? "All risk levels" : o}
                </option>
              ))}
            </select>
          </div>
        }
      >
        {isPending ? (
          <div className="p-4">
            <LoadingState label="Loading alerts…" />
          </div>
        ) : isError ? (
          <div className="p-4">
            <ErrorState onRetry={() => refetch()} />
          </div>
        ) : rows.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title="No alerts match these filters"
              description="Clear the search term or widen the status and risk level filters."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Alert ID",
                    "Applicant",
                    "Risk score",
                    "Risk level",
                    "Alert type",
                    "Status",
                    "Generated",
                  ].map((h) => (
                    <th key={h} className="label-caps px-4 py-2.5 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((alert) => (
                  <tr key={alert.alertId} className="transition-colors hover:bg-accent/40">
                    <td className="px-4 py-2.5">
                      <Link
                        to="/alerts/$alertId"
                        params={{ alertId: alert.alertId }}
                        className="mono text-xs font-medium text-primary hover:underline"
                      >
                        {alert.alertId}
                      </Link>
                    </td>
                    <td className="mono px-4 py-2.5 text-xs text-foreground">
                      {alert.applicantId}
                    </td>
                    <td className="px-4 py-2.5">
                      <RiskScore score={alert.riskScore} level={alert.riskLevel} />
                    </td>
                    <td className="px-4 py-2.5">
                      <RiskBadge level={alert.riskLevel} />
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">
                      {humanize(alert.alertType)}
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={alert.status} />
                    </td>
                    <td className="mono px-4 py-2.5 text-xs text-muted-foreground">
                      {formatDateTime(alert.generatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </AppShell>
  );
}
