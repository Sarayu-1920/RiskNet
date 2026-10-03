import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, ScrollText } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { FieldList, Panel } from "@/components/common/Panel";
import { PriorityBadge, StatusBadge } from "@/components/common/Badges";
import { ErrorState, LoadingState } from "@/components/common/DataStates";
import { getCase, submitCaseDecision } from "@/services/api";
import { formatDateTime, humanize } from "@/lib/format";
import type { Decision } from "@/types/risknet";

export const Route = createFileRoute("/cases/$caseId")({
  head: () => ({
    meta: [
      { title: "Case detail · RiskNet" },
      {
        name: "description",
        content: "Case status, priority, assigned analyst, remarks and the recorded analyst decision.",
      },
      { property: "og:title", content: "Case detail · RiskNet" },
      {
        property: "og:description",
        content: "Record a fraud investigation decision and review case history.",
      },
    ],
  }),
  component: CaseDetailPage,
});

const decisions: Decision[] = ["CLEAR", "ESCALATE", "REPORT_SUSPICIOUS", "FALSE_POSITIVE"];

function CaseDetailPage() {
  const { caseId } = useParams({ from: "/cases/$caseId" });
  const queryClient = useQueryClient();
  const [decision, setDecision] = useState<Decision>("CLEAR");
  const [remarks, setRemarks] = useState("");

  const caseQuery = useQuery({ queryKey: ["case", caseId], queryFn: () => getCase(caseId) });

  const mutation = useMutation({
    mutationFn: () =>
      submitCaseDecision(caseId, remarks.trim() ? { decision, remarks: remarks.trim() } : { decision }),
    onSuccess: () => {
      toast.success(`Decision ${humanize(decision)} recorded for ${caseId}`);
      setRemarks("");
      queryClient.invalidateQueries({ queryKey: ["case", caseId] });
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: ["audit", caseId] });
    },
    onError: () => toast.error("Decision could not be recorded."),
  });

  const data = caseQuery.data;

  return (
    <AppShell
      title={`Case ${caseId}`}
      subtitle={`GET /api/cases/${caseId}`}
      actions={
        <div className="flex gap-2">
          <Link
            to="/cases"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-accent"
          >
            <ArrowLeft className="size-3.5" aria-hidden /> Cases
          </Link>
          <Link
            to="/audit/$caseId"
            params={{ caseId }}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-accent"
          >
            <ScrollText className="size-3.5" aria-hidden /> Audit history
          </Link>
        </div>
      }
    >
      {caseQuery.isPending ? (
        <LoadingState label="Loading case…" />
      ) : caseQuery.isError || !data ? (
        <ErrorState message={`Case ${caseId} could not be loaded.`} onRetry={() => caseQuery.refetch()} />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-5">
            <Panel title="Case information">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <StatusBadge status={data.status} />
                <PriorityBadge priority={data.priority} />
              </div>
              <FieldList
                items={[
                  { label: "Case ID", value: <span className="mono">{data.caseId}</span> },
                  { label: "Alert ID", value: <span className="mono">{data.alertId}</span> },
                  { label: "Assigned analyst", value: <span className="mono">{data.assignedAnalyst}</span> },
                  { label: "Opened", value: formatDateTime(data.openedAt) },
                  { label: "Closed", value: formatDateTime(data.closedAt ?? null) },
                ]}
              />
              {data.remarks && (
                <div className="mt-4">
                  <p className="label-caps">Remarks</p>
                  <p className="mt-1 rounded-md border border-border bg-background/60 px-3 py-2.5 text-xs text-muted-foreground">
                    {data.remarks}
                  </p>
                </div>
              )}
            </Panel>
          </div>

          <Panel title="Analyst decision" description="PUT /api/cases/{caseId}/decision">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                mutation.mutate();
              }}
            >
              <label className="block">
                <span className="label-caps">Decision</span>
                <select
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  value={decision}
                  onChange={(e) => setDecision(e.target.value as Decision)}
                >
                  {decisions.map((d) => (
                    <option key={d} value={d}>
                      {humanize(d)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="label-caps">Decision remarks</span>
                <textarea
                  className="mt-1 min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Rationale recorded in the audit trail…"
                />
              </label>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {mutation.isPending ? "Recording…" : "Record decision"}
              </button>
            </form>
          </Panel>
        </div>
      )}
    </AppShell>
  );
}
