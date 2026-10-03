import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Panel } from "@/components/common/Panel";

export const Route = createFileRoute("/applicants/")({
  head: () => ({
    meta: [
      { title: "Applicants · RiskNet" },
      {
        name: "description",
        content: "Look up an applicant by ID in RiskNet.",
      },
      { property: "og:title", content: "Applicants · RiskNet" },
      {
        property: "og:description",
        content: "Applicant lookup by identifier.",
      },
    ],
  }),
  component: ApplicantsPage,
});

function ApplicantsPage() {
  const navigate = useNavigate();
  const [applicantId, setApplicantId] = useState("");

  return (
    <AppShell title="Applicants" subtitle="GET /api/applicants/{applicantId}">
      <Panel
        title="Applicant lookup"
        description="The API resolves applicants by ID, so enter the identifier to open a profile"
      >
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const id = applicantId.trim();
            if (id) navigate({ to: "/applicants/$applicantId", params: { applicantId: id } });
          }}
        >
          <label className="relative min-w-56 flex-1">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              value={applicantId}
              onChange={(e) => setApplicantId(e.target.value)}
              placeholder="e.g. APP-5512"
              aria-label="Applicant ID"
              className="mono w-full rounded-md border border-input bg-background py-2 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Open profile
          </button>
        </form>
      </Panel>
    </AppShell>
  );
}
