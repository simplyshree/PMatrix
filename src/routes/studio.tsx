import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePage } from "@/components/podi/WorkspacePage";

export const Route = createFileRoute("/studio")({
  head: () => ({ meta: [{ title: "Flavor Studio — PODI MATRIX" }] }),
  component: StudioPage,
});

function StudioPage() {
  return (
    <WorkspacePage
      eyebrow="Flavor engineering"
      title="Flavor Studio"
      description="Design a protein-to-flavor hypothesis from precursor chemistry, fermentation route, and cooking context."
      status="Builder coming next"
      nextStep="Choose a protein base and target flavor"
    />
  );
}
