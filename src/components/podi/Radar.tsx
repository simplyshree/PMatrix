import { AXES, type Fingerprint } from "@/lib/podi-engine";

function points(values: number[], size: number, pad: number) {
  const r = size / 2 - pad;
  const cx = size / 2;
  const cy = size / 2;
  return values
    .map((v, i) => {
      const a = (Math.PI * 2 * i) / values.length - Math.PI / 2;
      const rad = (Math.max(0, Math.min(10, v)) / 10) * r;
      return `${cx + Math.cos(a) * rad},${cy + Math.sin(a) * rad}`;
    })
    .join(" ");
}

export function RadarChart({
  designed,
  baseline,
  size = 320,
  showLabels = true,
}: {
  designed: Fingerprint;
  baseline?: Fingerprint;
  size?: number;
  showLabels?: boolean;
}) {
  const pad = showLabels ? 58 : 16;
  const r = size / 2 - pad;
  const cx = size / 2;
  const values = AXES.map((a) => designed[a]);
  const base = baseline ? AXES.map((a) => baseline[a]) : null;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-auto w-full" role="img" aria-label="Flavor fingerprint radar chart">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <circle key={f} cx={cx} cy={cx} r={r * f} fill="none" stroke="currentColor" className="text-paper/15" strokeWidth={1} />
      ))}
      {AXES.map((axis, i) => {
        const a = (Math.PI * 2 * i) / AXES.length - Math.PI / 2;
        const x = cx + Math.cos(a) * r;
        const y = cx + Math.sin(a) * r;
        const lx = cx + Math.cos(a) * (r + 22);
        const ly = cx + Math.sin(a) * (r + 22);
        return (
          <g key={axis}>
            <line x1={cx} y1={cx} x2={x} y2={y} stroke="currentColor" className="text-paper/10" strokeWidth={1} />
            {showLabels ? (
              <text
                x={lx}
                y={ly}
                fontSize={10}
                fontWeight={600}
                textAnchor={Math.abs(lx - cx) < 6 ? "middle" : lx > cx ? "start" : "end"}
                dominantBaseline="middle"
                fill="currentColor"
                className="text-paper/60"
              >
                {axis}
              </text>
            ) : null}
          </g>
        );
      })}
      {base ? (
        <polygon
          points={points(base, size, pad)}
          fill="var(--rose)"
          fillOpacity={0.14}
          stroke="var(--rose)"
          strokeOpacity={0.7}
          strokeDasharray="4 4"
          strokeWidth={2}
        />
      ) : null}
      <polygon
        points={points(values, size, pad)}
        fill="var(--brand)"
        fillOpacity={0.25}
        stroke="var(--brand)"
        strokeWidth={2.5}
      />
      {values.map((v, i) => {
        const a = (Math.PI * 2 * i) / values.length - Math.PI / 2;
        const rad = (v / 10) * r;
        return <circle key={i} cx={cx + Math.cos(a) * rad} cy={cx + Math.sin(a) * rad} r={3} fill="var(--brand)" />;
      })}
    </svg>
  );
}
