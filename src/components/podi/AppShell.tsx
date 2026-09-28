import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Disclaimer } from "./bits";

type NavItem = { to: string; label: string; dot: string };

export const NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", dot: "bg-brand" },
  { to: "/studio", label: "Flavor Studio", dot: "bg-primary" },
  { to: "/library", label: "Matrix Library", dot: "bg-violet" },
  { to: "/lab", label: "Fermentation Lab", dot: "bg-cyan" },
  { to: "/fingerprint", label: "Flavor Fingerprint", dot: "bg-amber" },
  { to: "/validation", label: "Validation", dot: "bg-ink/30" },
  { to: "/optimization", label: "Optimization", dot: "bg-ink/30" },
  { to: "/research", label: "Research", dot: "bg-ink/30" },
  { to: "/ideathon", label: "Ideathon Mode", dot: "bg-ink/30" },
  { to: "/settings", label: "Settings", dot: "bg-ink/30" },
];

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-brand font-display text-lg font-bold text-ink">
            P
          </span>
          <span className="font-display text-lg font-bold tracking-tight">PODI MATRIX</span>
        </Link>
        <nav className="hidden items-center gap-1 overflow-x-auto text-[13px] font-medium text-ink/60 xl:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-3 py-1.5 hover:bg-ink/5"
              activeProps={{ className: "rounded-full px-3 py-1.5 bg-ink text-paper" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/dashboard"
            className="hidden rounded-full border-2 border-ink px-4 py-2 text-sm font-semibold transition hover:bg-ink hover:text-paper sm:inline-flex"
          >
            Explore Demo
          </Link>
          <Link
            to="/studio"
            className="rounded-full border-2 border-ink bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[3px_3px_0_0_var(--ink)] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_var(--ink)]"
          >
            Create Flavor Matrix
          </Link>
        </div>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar />
      <section className="mx-auto max-w-[1440px] px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="sticky top-24 rounded-3xl border-2 border-ink bg-card p-4">
              <div className="px-2 pb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/40">
                Workspace
              </div>
              <div className="flex flex-col gap-1 text-sm font-medium">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 hover:bg-ink/5"
                    activeProps={{
                      className: "flex items-center gap-3 rounded-2xl px-3 py-2.5 bg-brand font-semibold text-ink",
                    }}
                  >
                    <span className={`size-2 rounded-full ${item.dot}`} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
          <main className="animate-rise lg:col-span-9">
            {children}
            <Disclaimer />
          </main>
        </div>
      </section>
    </div>
  );
}
