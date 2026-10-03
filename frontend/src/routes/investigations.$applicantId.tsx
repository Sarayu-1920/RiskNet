import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { FieldList, Panel } from "@/components/common/Panel";
import { RiskBadge, RiskScore, StatusBadge } from "@/components/common/Badges";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/DataStates";
import { RelationshipGraph } from "@/components/graph/RelationshipGraph";
import { CreateCaseForm } from "@/components/cases/CreateCaseForm";
import { getAlerts, getApplicant, getGraph } from "@/services/api";
import { formatCurrency, formatDate, humanize, relativeTime } from "@/lib/format";
import type { GraphNode, RiskLevel } from "@/types/risknet";

export const Route = createFileRoute("/investigations/$applicantId")({
  head: () => ({
    meta: [
      { title: "Investigation workspace · RiskNet" },
      {
        name: "description",
        content:
          "Fraud investigation workspace: applicant risk summary, Cytoscape relationship graph and case actions.",
      },
      { property: "og:title", content: "Investigation workspace · RiskNet" },
      {
        property: "og:description",
        content: "Explore shared devices, IP addresses and alerts linked to an applicant.",
      },
    ],
  }),
  component: InvestigationWorkspace,
});

function InvestigationWorkspace() {
  const { applicantId } = useParams({ from: "/investigations/$applicantId" });
  const [selected, setSelected] = useState<GraphNode | null>(null);

  const applicantQuery = useQuery({
    queryKey: ["applicant", applicantId],
    queryFn: () => getApplicant(applicantId),
  });
  const graphQuery = useQuery({
    queryKey: ["graph", applicantId],
    queryFn: () => getGraph(applicantId),
  });
  const alertsQuery = useQuery({ queryKey: ["alerts", {}], queryFn: () => getAlerts() });

  const linkedAlerts = (alertsQuery.data ?? []).filter((a) => a.applicantId === applicantId);
  const topAlert = [...linkedAlerts].sort((a, b) => b.riskScore - a.riskScore)[0];
  const onSelectNode = useCallback((node: GraphNode | null) => setSelected(node), []);

  const counts = {
    devices: (graphQuery.data?.nodes ?? []).filter((n) => n.type === "DEVICE").length,
    ips: (graphQuery.data?.nodes ?? []).filter((n) => n.type === "IP_ADDRESS").length,
    alerts: (graphQuery.data?.nodes ?? []).filter((n) => n.type === "ALERT").length,
  };

  return (
    <AppShell
      title={`Investigation · ${applicantQuery.data?.name ?? applicantId}`}
      subtitle={`GET /api/graph/${applicantId}`}
      actions={
        <Link
          to="/investigations"
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-accent"
        >
          <ArrowLeft className="size-3.5" aria-hidden /> Queue
        </Link>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        {/* Left: applicant / risk summary */}
        <div className="space-y-5">
          <Panel title="Applicant summary">
            {applicantQuery.isPending ? (
              <LoadingState label="Loading…" />
            ) : applicantQuery.isError || !applicantQuery.data ? (
              <ErrorState
                message="Applicant unavailable."
                onRetry={() => applicantQuery.refetch()}
              />
            ) : (
              <FieldList
                columns={1}
                items={[
                  { label: "Applicant ID", value: <span className="mono">{applicantId}</span> },
                  {
                    label: "External ID",
                    value: <span className="mono">{applicantQuery.data.applicantExternalId}</span>,
                  },
                  { label: "Name", value: applicantQuery.data.name },
                  { label: "Email", value: applicantQuery.data.email },
                  { label: "Phone", value: <span className="mono">{applicantQuery.data.phone}</span> },
                  { label: "Date of birth", value: formatDate(applicantQuery.data.dateOfBirth) },
                  { label: "Employment", value: humanize(applicantQuery.data.employmentStatus) },
                  { label: "Housing", value: humanize(applicantQuery.data.housingStatus) },
                  { label: "Income", value: formatCurrency(applicantQuery.data.income) },
                  {
                    label: "Credit risk score",
                    value: <span className="mono">{applicantQuery.data.creditRiskScore}</span>,
                  },
                ]}
              />
            )}
          </Panel>

          <Panel title="Risk summary">
            {topAlert ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <RiskBadge level={topAlert.riskLevel as RiskLevel} />
                  <StatusBadge status={topAlert.status as "OPEN"} />
                </div>
                <RiskScore score={topAlert.riskScore} level={topAlert.riskLevel as RiskLevel} />
                <p className="text-xs text-muted-foreground">
                  Driven by {humanize(topAlert.alertType)} ({topAlert.alertId}).
                </p>
                <dl className="mono grid grid-cols-3 gap-2 border-t border-border pt-3 text-center text-xs">
                  <div>
                    <dt className="label-caps">Devices</dt>
                    <dd className="mt-1 text-foreground">{counts.devices}</dd>
                  </div>
                  <div>
                    <dt className="label-caps">IPs</dt>
                    <dd className="mt-1 text-foreground">{counts.ips}</dd>
                  </div>
                  <div>
                    <dt className="label-caps">Alerts</dt>
                    <dd className="mt-1 text-foreground">{counts.alerts}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <EmptyState title="No linked alerts" description="This applicant has no open signals." />
            )}
          </Panel>
        </div>

        {/* Center: relationship graph */}
        <div className="space-y-5">
          <Panel
            title="Relationship graph"
            description="Applicant → Device, Applicant → IP, Alert → Applicant"
            bodyClassName="p-3"
          >
            {graphQuery.isPending ? (
              <LoadingState label="Loading graph data…" />
            ) : graphQuery.isError || !graphQuery.data ? (
              <ErrorState message="Graph data unavailable." onRetry={() => graphQuery.refetch()} />
            ) : graphQuery.data.nodes.length === 0 ? (
              <EmptyState title="No relationships returned" />
            ) : (
              <RelationshipGraph data={graphQuery.data} onSelectNode={onSelectNode} />
            )}
          </Panel>

           <Panel title="Selected entity" description="Click a node in the graph to inspect it">
            {selected ? (
              selected.type === "DEVICE" ? (
                // Device table contains only device_id — show nothing beyond identity.
                <FieldList
                  items={[
                    { label: "Entity type", value: humanize(selected.type) },
                    { label: "Identifier", value: <span className="mono">{selected.id}</span> },
                    { label: "Label", value: selected.label },
                  ]}
                />
              ) : (
                <FieldList
                  items={[
                    { label: "Entity type", value: humanize(selected.type) },
                    { label: "Identifier", value: <span className="mono">{selected.id}</span> },
                    { label: "Label", value: selected.label },
                    { label: "Risk level", value: selected.riskLevel ?? "—" },
                    ...Object.entries(selected.properties ?? {}).map(([k, v]) => ({
                      label: humanize(k),
                      value: <span className="mono">{String(v)}</span>,
                    })),
                  ]}
                />
              )
            ) : (
              <p className="text-xs text-muted-foreground">
                Nothing selected. Nodes are colour-coded by entity type.
              </p>
            )}
          </Panel>
        </div>

        {/* Right: investigation information */}
        <div className="space-y-5">
          <Panel title="Linked alerts" bodyClassName="p-0">
            {alertsQuery.isPending ? (
              <div className="p-4">
                <LoadingState label="Loading…" />
              </div>
            ) : linkedAlerts.length === 0 ? (
              <div className="p-4">
                <EmptyState title="No alerts for this applicant" />
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {linkedAlerts.map((a) => (
                  <li key={a.alertId}>
                    <Link
                      to="/alerts/$alertId"
                      params={{ alertId: a.alertId }}
                      className="block px-4 py-3 transition-colors hover:bg-accent/40"
                    >
                      <span className="mono text-xs text-primary">{a.alertId}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {humanize(a.alertType)} · {relativeTime(a.generatedAt)}
                      </span>
                      <span className="mt-2 flex items-center gap-2">
                        <RiskBadge level={a.riskLevel as RiskLevel} />
                        <StatusBadge status={a.status as "OPEN"} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Open a case" description="POST /api/cases">
            <CreateCaseForm defaultAlertId={topAlert?.alertId ?? ""} />
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
