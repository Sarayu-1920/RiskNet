import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Panel } from "@/components/common/Panel";
import { PriorityBadge, StatusBadge } from "@/components/common/Badges";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/DataStates";
import { CreateCaseForm } from "@/components/cases/CreateCaseForm";
import { listKnownCases } from "@/services/api";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/cases/")({
  head: () => ({
    meta: [
      { title: "Cases · RiskNet" },
      {
        name: "description",
        content:
          "Open investigation cases, track status, priority, assigned analyst and analyst decisions.",
      },
      { property: "og:title", content: "Cases · RiskNet" },
      {
        property: "og:description",
        content: "Create and review RiskNet fraud investigation cases.",
      },
    ],
  }),
  component: CasesPage,
});

function CasesPage() {
  const navigate = useNavigate();
  const [caseId, setCaseId] = useState("");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["cases"],
    queryFn: () => listKnownCases(),
  });

  const cases = data ?? [];

  return (
    <AppShell title="Cases" subtitle="POST /api/cases · GET /api/cases/{caseId}">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <Panel title="Case lookup" description="Cases are retrieved by ID from the API">
            <form
              className="flex flex-wrap gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const id = caseId.trim();
                if (id) navigate({ to: "/cases/$caseId", params: { caseId: id } });
              }}
            >
              <input
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                placeholder="e.g. CASE-3301"
                aria-label="Case ID"
                className="mono min-w-56 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Open case
              </button>
            </form>
          </Panel>

          <Panel
            title="Cases in this session"
            description="Assembled from cases created or fetched during this session"
            bodyClassName="p-0"
          >
            {isPending ? (
              <div className="p-4">
                <LoadingState label="Loading cases…" />
              </div>
            ) : isError ? (
              <div className="p-4">
                <ErrorState onRetry={() => refetch()} />
              </div>
            ) : cases.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  title="No cases loaded"
                  description="Create a case from an investigation, or look one up by its ID."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Case ID", "Alert ID", "Status", "Priority", "Analyst", "Opened"].map(
                        (h) => (
                          <th key={h} className="label-caps px-4 py-2.5 font-semibold">
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {cases.map((c) => (
                      <tr key={c.caseId} className="transition-colors hover:bg-accent/40">
                        <td className="px-4 py-2.5">
                          <Link
                            to="/cases/$caseId"
                            params={{ caseId: c.caseId }}
                            className="mono text-xs font-medium text-primary hover:underline"
                          >
                            {c.caseId}
                          </Link>
                        </td>
                        <td className="mono px-4 py-2.5 text-xs text-muted-foreground">
                          {c.alertId}
                        </td>
                        <td className="px-4 py-2.5">
                          <StatusBadge status={c.status} />
                        </td>
                        <td className="px-4 py-2.5">
                          <PriorityBadge priority={c.priority} />
                        </td>
                        <td className="mono px-4 py-2.5 text-xs text-foreground">
                          {c.assignedAnalyst}
                        </td>
                        <td className="mono px-4 py-2.5 text-xs text-muted-foreground">
                          {formatDateTime(c.openedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </div>

        <Panel title="Create investigation case" description="POST /api/cases">
          <CreateCaseForm />
        </Panel>
      </div>
    </AppShell>
  );
}
