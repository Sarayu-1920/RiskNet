import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { createCase } from "@/services/api";

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

/** POST /api/cases — opens an investigation case. Accepts alertId + assignedAnalyst only. */
export function CreateCaseForm({ defaultAlertId = "" }: { defaultAlertId?: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [alertId, setAlertId] = useState(defaultAlertId);
  const [assignedAnalyst, setAssignedAnalyst] = useState("n.arvidsson");

  const mutation = useMutation({
    mutationFn: () => createCase({ alertId, assignedAnalyst }),
    onSuccess: (created) => {
      toast.success(`Case ${created.caseId} opened`);
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      navigate({ to: "/cases/$caseId", params: { caseId: created.caseId } });
    },
    onError: () => toast.error("Case creation failed. The API rejected the request."),
  });

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!alertId.trim()) {
          toast.error("Alert ID is required.");
          return;
        }
        mutation.mutate();
      }}
    >
      <label className="block">
        <span className="label-caps">Alert ID</span>
        <input
          className={`mono mt-1 ${inputClass}`}
          value={alertId}
          onChange={(e) => setAlertId(e.target.value)}
          placeholder="ALR-10241"
          required
        />
      </label>
      <label className="block">
        <span className="label-caps">Assigned analyst</span>
        <input
          className={`mono mt-1 ${inputClass}`}
          value={assignedAnalyst}
          onChange={(e) => setAssignedAnalyst(e.target.value)}
          required
        />
      </label>
      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {mutation.isPending ? "Creating case…" : "Create investigation case"}
      </button>
    </form>
  );
}
