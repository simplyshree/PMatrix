import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePage } from "@/components/podi/WorkspacePage";

export const Route = createFileRoute("/fingerprint")({
  head: () => ({ meta: [{ title: "Flavor Fingerprint — PODI MATRIX" }] }),
  component: FingerprintPage,
});

function FingerprintPage() {
  return (
    <WorkspacePage
      eyebrow="Sensory model"
      title="Flavor Fingerprint"
      description="Compare baseline protein character with a designed flavor profile across savory, roasted, fermented, and off-note axes."
      status="Fingerprint route ready"
      nextStep="Render baseline versus designed vectors"
    />
  );
}
