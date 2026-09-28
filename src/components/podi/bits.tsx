import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  children,
  className,
  tone = "card",
}: {
  children: ReactNode;
  className?: string;
  tone?: "card" | "paper" | "ink";
}) {
  return (
    <div
      className={cn(
        "rounded-3xl p-5",
        tone === "card" && "border-2 border-ink bg-card",
        tone === "paper" && "border-2 border-ink/10 bg-paper",
        tone === "ink" && "bg-ink text-paper",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children, invert }: { children: ReactNode; invert?: boolean }) {
  return (
    <div
      className={cn(
        "text-[11px] font-semibold uppercase tracking-[0.15em]",
        invert ? "text-paper/45" : "text-ink/45",
      )}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h1 className="mt-1 font-display text-3xl font-bold">{title}</h1>
        {subtitle ? <p className="mt-1 max-w-2xl text-sm text-ink/55">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Stat({
  label,
  value,
  note,
  noteTone = "muted",
}: {
  label: string;
  value: string;
  note?: string;
  noteTone?: "muted" | "brand" | "accent";
}) {
  return (
    <Panel>
      <Eyebrow>{label}</Eyebrow>
      <div className="mt-2 font-display text-4xl font-bold">{value}</div>
      {note ? (
        <div
          className={cn(
            "mt-1 text-xs font-semibold",
            noteTone === "muted" && "font-normal text-ink/50",
            noteTone === "brand" && "text-brand",
            noteTone === "accent" && "text-primary",
          )}
        >
          {note}
        </div>
      ) : null}
    </Panel>
  );
}

export function Chip({
  children,
  selected,
  onClick,
  tone = "brand",
}: {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  tone?: "brand" | "violet" | "cyan" | "amber" | "accent";
}) {
  const selectedTone = {
    brand: "bg-brand text-ink border-ink",
    violet: "bg-violet text-white border-ink",
    cyan: "bg-cyan text-ink border-ink",
    amber: "bg-amber text-ink border-ink",
    accent: "bg-primary text-primary-foreground border-ink",
  }[tone];

  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
        selected ? selectedTone : "border-ink/20 bg-transparent font-medium text-ink/70 hover:border-ink/50",
      )}
    >
      {children}
    </Comp>
  );
}

export function PopButton({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ink";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-display text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40",
        variant === "primary" &&
          "border-2 border-ink bg-primary px-6 py-3 text-primary-foreground shadow-[4px_4px_0_0_var(--ink)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--ink)]",
        variant === "outline" && "border-2 border-ink px-6 py-3 hover:bg-ink hover:text-paper",
        variant === "ink" && "border-2 border-ink bg-ink px-6 py-3 text-paper hover:bg-ink/85",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Meter({ value, tone = "brand" }: { value: number; tone?: "brand" | "accent" | "cyan" | "violet" | "amber" }) {
  const bg = {
    brand: "bg-brand",
    accent: "bg-primary",
    cyan: "bg-cyan",
    violet: "bg-violet",
    amber: "bg-amber",
  }[tone];
  return (
    <div className="h-2 overflow-hidden rounded-full bg-ink/10">
      <div className={cn("h-full rounded-full transition-all", bg)} style={{ width: `${Math.max(2, Math.min(100, value))}%` }} />
    </div>
  );
}

export function Disclaimer({ children }: { children?: ReactNode }) {
  return (
    <p className="mt-6 text-center text-xs text-ink/40">
      {children ??
        "PODI MATRIX outputs are designed flavor hypotheses, not guarantees of taste parity. Every matrix requires laboratory and sensory validation."}
    </p>
  );
}
