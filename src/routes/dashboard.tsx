import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePage } from "@/components/podi/WorkspacePage";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — PODI MATRIX" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <WorkspacePage
      eyebrow="Workspace overview"
      title="Dashboard"
      description="A clear starting point for recent matrices, model activity, and the next experiment to run."
      status="Route ready"
      nextStep="Connect recent matrix activity"
    />
  );
}
