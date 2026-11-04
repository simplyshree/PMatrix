import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePage } from "@/components/podi/WorkspacePage";

export const Route = createFileRoute("/lab")({
  head: () => ({ meta: [{ title: "Fermentation Lab — PODI MATRIX" }] }),
  component: LabPage,
});

function LabPage() {
  return (
    <WorkspacePage
      eyebrow="Bioconversion planning"
      title="Fermentation Lab"
      description="Translate a flavor target into a controlled fermentation route with parameters, capabilities, and cautions."
      status="Lab route ready"
      nextStep="Compare fermentation routes"
    />
  );
}
