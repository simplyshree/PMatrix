import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePage } from "@/components/podi/WorkspacePage";

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [{ title: "Matrix Library — PODI MATRIX" }] }),
  component: LibraryPage,
});

function LibraryPage() {
  return (
    <WorkspacePage
      eyebrow="Saved designs"
      title="Matrix Library"
      description="A home for reusable flavor hypotheses, comparison work, and designs ready for laboratory validation."
      status="Library route ready"
      nextStep="Save and reopen matrix designs"
    />
  );
}
