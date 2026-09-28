import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/podi/AppShell";
import { Eyebrow, Panel } from "@/components/podi/bits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PODI MATRIX — Design the flavor. Ferment the matrix." },
      {
        name: "description",
        content:
          "An intelligent fermentation and flavor-engineering platform for next-generation plant-based foods.",
      },
      { property: "og:title", content: "PODI MATRIX — Design the flavor. Ferment the matrix." },
      {
        property: "og:description",
        content:
          "Convert plant-protein precursor chemistry into targeted savory flavor profiles delivered through a cooking-responsive podi matrix.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const PIPELINE = [
  { label: "Plant Protein", tone: "bg-brand" },
  { label: "Fermentation", tone: "bg-cyan" },
  { label: "Flavor Chemistry", tone: "bg-violet" },
  { label: "Podi Matrix", tone: "bg-amber" },
  { label: "Cooking", tone: "bg-primary" },
  { label: "Sensory Match", tone: "bg-ink" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />

      <section className="mx-auto max-w-[1440px] px-6 pt-14 pb-10">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="animate-rise lg:col-span-7">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-violet/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-violet">
              <span className="size-2 rounded-full bg-violet" /> Fermentation-driven flavor engineering
            </div>
            <h1 className="font-display text-[clamp(2.75rem,7vw,6rem)] font-bold leading-[0.92]">
              Design the flavor.
              <br />
              <span className="text-primary">Ferment</span> the matrix.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
              An intelligent fermentation and flavor-engineering platform for next-generation plant-based foods. PODI
              MATRIX converts plant-protein precursor chemistry into targeted savory profiles, delivered through a
              cooking-responsive podi matrix.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/studio"
                className="rounded-full border-2 border-ink bg-primary px-7 py-4 font-display text-base font-semibold text-primary-foreground shadow-[4px_4px_0_0_var(--ink)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--ink)]"
              >
                Create Flavor Matrix
              </Link>
              <Link
                to="/dashboard"
                className="rounded-full border-2 border-ink px-7 py-4 font-display text-base font-semibold transition hover:bg-ink hover:text-paper"
              >
                Explore Demo
              </Link>
            </div>
            <p className="mt-6 max-w-md text-xs text-ink/50">
              Outputs are designed flavor hypotheses with targeted sensory similarity. Taste parity is never claimed —
              every matrix requires laboratory and sensory validation.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-ink p-6">
              <div className="absolute -top-10 -right-10 size-40 rounded-full bg-brand/30 blur-2xl" />
              <div className="absolute -bottom-12 -left-8 size-44 rounded-full bg-primary/30 blur-2xl" />
              <div className="relative grid h-full place-items-center">
                <div className="relative size-72">
                  <div className="absolute inset-0 rounded-full border border-white/10" />
                  <div className="absolute inset-8 rounded-full border border-white/10" />
                  <div className="absolute inset-16 rounded-full border border-white/10" />
                  <div className="radar-spin absolute inset-0">
                    <span className="absolute top-0 left-1/2 size-3 -translate-x-1/2 rounded-full bg-brand" />
                    <span className="absolute bottom-6 left-4 size-2.5 rounded-full bg-primary" />
                    <span className="absolute top-10 right-2 size-2.5 rounded-full bg-cyan" />
                    <span className="absolute right-8 bottom-10 size-2 rounded-full bg-amber" />
                  </div>
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="text-center">
                      <div className="font-display text-5xl font-bold text-paper">8.4</div>
                      <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-paper/50">Vector score</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 pb-10">
        <Panel tone="paper" className="border-2 border-ink/10">
          <Eyebrow>The matrix pipeline</Eyebrow>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {PIPELINE.map((step, i) => (
              <div key={step.label} className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-2xl border-2 border-ink bg-card px-4 py-3">
                  <span
                    className={`grid size-6 place-items-center rounded-full ${step.tone} text-[11px] font-bold ${
                      step.tone === "bg-ink" ? "text-paper" : "text-ink"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold">{step.label}</span>
                </div>
                {i < PIPELINE.length - 1 ? <span className="font-bold text-ink/30">→</span> : null}
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          <Panel>
            <Eyebrow>Precursor-first</Eyebrow>
            <h2 className="mt-2 font-display text-xl font-bold">Build the pool, then the aroma</h2>
            <p className="mt-2 text-sm text-ink/60">
              Stage 1 bioconversion raises free amino acids, peptides, reducing sugars and lipid-derived precursors while
              lowering plant-derived off-notes.
            </p>
          </Panel>
          <Panel>
            <Eyebrow>Chemistry-led</Eyebrow>
            <h2 className="mt-2 font-display text-xl font-bold">Maillard &amp; Strecker trajectories</h2>
            <p className="mt-2 text-sm text-ink/60">
              Stage 2 converts that pool into pyrazine, furan and aldehyde aroma families through controlled thermal
              activation during cooking.
            </p>
          </Panel>
          <Panel>
            <Eyebrow>Validation-first</Eyebrow>
            <h2 className="mt-2 font-display text-xl font-bold">Hypotheses, not promises</h2>
            <p className="mt-2 text-sm text-ink/60">
              Every chemical association is presented as a possible contributor, with a validation plan attached before
              any sensory claim is made.
            </p>
          </Panel>
        </div>
      </section>
    </div>
  );
}
