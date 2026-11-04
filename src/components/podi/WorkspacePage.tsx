import { Link } from "@tanstack/react-router";
import { AppShell } from "./AppShell";
import { PageHeader, Panel } from "./bits";

export function WorkspacePage({
  eyebrow,
  title,
  description,
  status,
  nextStep,
}: {
  eyebrow: string;
  title: string;
  description: string;
  status: string;
  nextStep: string;
}) {
  return (
    <AppShell>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        subtitle={description}
        action={
          <Link
            to="/studio"
            className="inline-flex items-center justify-center rounded-full border-2 border-ink bg-primary px-6 py-3 font-display text-sm font-semibold text-primary-foreground shadow-[4px_4px_0_0_var(--ink)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--ink)]"
          >
            Create Flavor Matrix
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Panel tone="ink">
          <div className="text-xs font-semibold uppercase tracking-[0.15em] text-paper/45">Current status</div>
          <h2 className="mt-3 font-display text-2xl font-bold">{status}</h2>
          <p className="mt-3 text-sm leading-relaxed text-paper/65">
            This workspace is part of the PODI MATRIX product surface. The next implementation step is tracked in
            the project roadmap so every output remains explicit about what is modeled and what still needs validation.
          </p>
        </Panel>

        <Panel>
          <div className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/45">Next step</div>
          <h2 className="mt-3 font-display text-2xl font-bold">{nextStep}</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/60">
            Start with a flavor matrix hypothesis, then move from model output to an experiment plan and sensory
            validation.
          </p>
        </Panel>
      </div>

      <Panel className="mt-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/45">Product navigation</div>
            <p className="mt-2 text-sm text-ink/60">Use the workspace links to move between the current product areas.</p>
          </div>
          <Link
            to="/"
            className="rounded-full border-2 border-ink px-5 py-2.5 text-sm font-semibold transition hover:bg-ink hover:text-paper"
          >
            Back to overview
          </Link>
        </div>
      </Panel>
    </AppShell>
  );
}
