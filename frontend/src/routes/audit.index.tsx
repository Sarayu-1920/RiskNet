import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ScrollText } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Panel } from "@/components/common/Panel";

export const Route = createFileRoute("/audit/")({
  head: () => ({
    meta: [
      { title: "Audit · RiskNet" },
      {
        name: "description",
        content: "Review the audit trail for a RiskNet investigation case: actions, actors and timestamps.",
      },
      { property: "og:title", content: "Audit · RiskNet" },
      { property: "og:description", content: "Case-level audit history for fraud investigations." },
    ],
  }),
  component: AuditPage,
});

function AuditPage() {
  const navigate = useNavigate();
  const [caseId, setCaseId] = useState("");

  return (
    <AppShell title="Audit" subtitle="GET /api/audit/{caseId}">
      <Panel
        title="Audit history lookup"
        description="Audit entries are scoped to a single investigation case"
      >
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const id = caseId.trim();
            if (id) navigate({ to: "/audit/$caseId", params: { caseId: id } });
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
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ScrollText className="size-3.5" aria-hidden /> View audit trail
          </button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">
          The API exposes audit history per case only, so no global audit feed is requested.
        </p>
      </Panel>
    </AppShell>
  );
}
