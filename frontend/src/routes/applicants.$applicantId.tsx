import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Radar } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { FieldList, Panel, StatCard } from "@/components/common/Panel";
import { ErrorState, LoadingState } from "@/components/common/DataStates";
import { getApplicant } from "@/services/api";
import { formatCurrency, formatDate, formatDateTime, humanize } from "@/lib/format";

export const Route = createFileRoute("/applicants/$applicantId")({
  head: () => ({
    meta: [
      { title: "Applicant profile · RiskNet" },
      {
        name: "description",
        content:
          "Applicant identity, employment, housing, income and credit risk detail for fraud review.",
      },
      { property: "og:title", content: "Applicant profile · RiskNet" },
      {
        property: "og:description",
        content: "Full applicant record used during fraud investigation.",
      },
    ],
  }),
  component: ApplicantDetailsPage,
});

function ApplicantDetailsPage() {
  const { applicantId } = useParams({ from: "/applicants/$applicantId" });
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["applicant", applicantId],
    queryFn: () => getApplicant(applicantId),
  });

  return (
    <AppShell
      title={data?.name ?? `Applicant ${applicantId}`}
      subtitle={`GET /api/applicants/${applicantId}`}
      actions={
        <div className="flex gap-2">
          <Link
            to="/applicants"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-accent"
          >
            <ArrowLeft className="size-3.5" aria-hidden /> Applicants
          </Link>
          <Link
            to="/investigations/$applicantId"
            params={{ applicantId }}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Radar className="size-3.5" aria-hidden /> Investigate
          </Link>
        </div>
      }
    >
      {isPending ? (
        <LoadingState label="Loading applicant record…" />
      ) : isError || !data ? (
        <ErrorState message={`Applicant ${applicantId} could not be loaded.`} onRetry={() => refetch()} />
      ) : (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Credit risk score" value={data.creditRiskScore} tone="primary" />
            <StatCard label="Customer age" value={`${data.customerAge} yrs`} />
            <StatCard label="Declared income" value={formatCurrency(data.income)} />
            <StatCard label="Account created" value={formatDate(data.accountCreatedAt)} />
          </div>

          <Panel title="Identity" description="Applicant record as returned by the API">
            <FieldList
              items={[
                { label: "Applicant ID", value: <span className="mono">{data.applicantId}</span> },
                { label: "External ID", value: <span className="mono">{data.applicantExternalId}</span> },
                { label: "Name", value: data.name },
                { label: "Email", value: data.email },
                { label: "Phone", value: <span className="mono">{data.phone}</span> },
                { label: "Date of birth", value: formatDate(data.dateOfBirth) },
              ]}
            />
          </Panel>

          <Panel title="Profile & risk">
            <FieldList
              items={[
                { label: "Customer age", value: `${data.customerAge} years` },
                { label: "Employment status", value: humanize(data.employmentStatus) },
                { label: "Housing status", value: humanize(data.housingStatus) },
                { label: "Income", value: formatCurrency(data.income) },
                {
                  label: "Credit risk score",
                  value: <span className="mono">{data.creditRiskScore}</span>,
                },
                { label: "Account created", value: formatDateTime(data.accountCreatedAt) },
              ]}
            />
          </Panel>
        </div>
      )}
    </AppShell>
  );
}
