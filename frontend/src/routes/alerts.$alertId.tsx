import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Radar } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { FieldList, Panel } from "@/components/common/Panel";
import { RiskBadge, RiskScore, StatusBadge } from "@/components/common/Badges";
import { ErrorState, LoadingState } from "@/components/common/DataStates";
import { getAlert, getApplicant, updateAlertStatus } from "@/services/api";
import { formatCurrency, formatDateTime, humanize } from "@/lib/format";
import type { AlertStatus } from "@/types/risknet";

export const Route = createFileRoute("/alerts/$alertId")({
  head: () => ({
    meta: [
      { title: "Alert details · RiskNet" },
      {
        name: "description",
        content: "Inspect a single fraud alert, its applicant context and investigation actions.",
      },
      { property: "og:title", content: "Alert details · RiskNet" },
      {
        property: "og:description",
        content: "Alert risk score, type, status and linked applicant investigation.",
      },
    ],
  }),
  component: AlertDetailsPage,
});

const nextStatuses: AlertStatus[] = ["OPEN", "IN_PROGRESS", "ESCALATED", "CLOSED"];

function AlertDetailsPage() {
  const { alertId } = useParams({ from: "/alerts/$alertId" });
  const queryClient = useQueryClient();

  const alertQuery = useQuery({ queryKey: ["alert", alertId], queryFn: () => getAlert(alertId) });
  const applicantId = alertQuery.data?.applicantId;
  const applicantQuery = useQuery({
    queryKey: ["applicant", applicantId],
    queryFn: () => getApplicant(applicantId!),
    enabled: Boolean(applicantId),
  });

  const statusMutation = useMutation({
    mutationFn: (status: AlertStatus) => updateAlertStatus(alertId, status),
    onSuccess: (_data, status) => {
      toast.success(`Alert ${alertId} set to ${humanize(status)}`);
      queryClient.invalidateQueries({ queryKey: ["alert", alertId] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
    onError: () => toast.error("Status update failed. The API rejected the request."),
  });

  const alert = alertQuery.data;

  return (
    <AppShell
      title={`Alert ${alertId}`}
      subtitle="GET /api/alerts/{alertId}"
      actions={
        <Link
          to="/alerts"
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-accent"
        >
          <ArrowLeft className="size-3.5" aria-hidden /> Back to alerts
        </Link>
      }
    >
      {alertQuery.isPending ? (
        <LoadingState label="Loading alert…" />
      ) : alertQuery.isError || !alert ? (
        <ErrorState
          message={`Alert ${alertId} could not be loaded.`}
          onRetry={() => alertQuery.refetch()}
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-5">
            <Panel title="Alert information">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <RiskBadge level={alert.riskLevel} />
                <StatusBadge status={alert.status} />
                <RiskScore score={alert.riskScore} level={alert.riskLevel} />
              </div>
              <FieldList
                items={[
                  { label: "Alert ID", value: <span className="mono">{alert.alertId}</span> },
                  { label: "Alert type", value: humanize(alert.alertType) },
                  { label: "Risk score", value: <span className="mono">{alert.riskScore}</span> },
                  { label: "Risk level", value: alert.riskLevel },
                  { label: "Status", value: humanize(alert.status) },
                  { label: "Generated", value: formatDateTime(alert.generatedAt) },
                  { label: "False positive", value: alert.isFalsePositive ? "Yes" : "No" },
                ]}
              />
            </Panel>

            <Panel
              title="Applicant information"
              description={applicantId ?? "Linked applicant"}
              actions={
                applicantId && (
                  <Link
                    to="/applicants/$applicantId"
                    params={{ applicantId }}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Full applicant profile
                  </Link>
                )
              }
            >
              {applicantQuery.isPending ? (
                <LoadingState label="Loading applicant…" />
              ) : applicantQuery.isError || !applicantQuery.data ? (
                <ErrorState
                  message="Applicant record unavailable."
                  onRetry={() => applicantQuery.refetch()}
                />
              ) : (
                <FieldList
                  items={[
                    { label: "Name", value: applicantQuery.data.name },
                    {
                      label: "External ID",
                      value: <span className="mono">{applicantQuery.data.applicantExternalId}</span>,
                    },
                    { label: "Email", value: applicantQuery.data.email },
                    { label: "Phone", value: <span className="mono">{applicantQuery.data.phone}</span> },
                    { label: "Employment", value: humanize(applicantQuery.data.employmentStatus) },
                    { label: "Income", value: formatCurrency(applicantQuery.data.income) },
                  ]}
                />
              )}
            </Panel>
          </div>

          <div className="space-y-5">
            <Panel title="Investigation action" description="PUT /api/alerts/{alertId}/status">
              <div className="space-y-2">
                {nextStatuses.map((status) => (
                  <button
                    key={status}
                    disabled={statusMutation.isPending || alert.status === status}
                    onClick={() => statusMutation.mutate(status)}
                    className="flex w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <span>Set status to {humanize(status)}</span>
                    {alert.status === status && (
                      <span className="text-[11px] text-muted-foreground">current</span>
                    )}
                  </button>
                ))}
              </div>
            </Panel>

            <Panel title="Next step">
              <p className="text-xs text-muted-foreground">
                Open the investigation workspace to explore shared devices, IP addresses and linked
                alerts for this applicant.
              </p>
              {applicantId && (
                <Link
                  to="/investigations/$applicantId"
                  params={{ applicantId }}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Radar className="size-3.5" aria-hidden /> Investigate applicant
                </Link>
              )}
            </Panel>
          </div>
        </div>
      )}
    </AppShell>
  );
}
