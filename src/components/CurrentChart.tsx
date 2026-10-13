import type { ChartPoint } from '@/types/motor';

interface CurrentChartProps {
  data: ChartPoint[];
}

export default function CurrentChart({ data }: CurrentChartProps) {
  const W = 800;
  const H = 260;
  const padding = { top: 20, right: 20, bottom: 30, left: 45 };
  const chartW = W - padding.left - padding.right;
  const chartH = H - padding.top - padding.bottom;
  const maxY = 100;

  const xFor = (i: number) =>
    padding.left + (data.length <= 1 ? 0 : (i / (data.length - 1)) * chartW);
  const yFor = (v: number) => padding.top + chartH - (v / maxY) * chartH;

  const phases: { key: 'R' | 'S' | 'T'; color: string; label: string }[] = [
    { key: 'R', color: '#00e676', label: 'Fasa R' },
    { key: 'S', color: '#60a5fa', label: 'Fasa S' },
    { key: 'T', color: '#fbbf24', label: 'Fasa T' },
  ];

  const gridLines = Array.from({ length: 6 }, (_, i) => {
    const y = padding.top + (i / 5) * chartH;
    const val = maxY - (i / 5) * maxY;
    return { y, val };
  });

  return (
    <div className="panel-card p-4">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Grafik Arus Fasa R, S, T
        </h3>
        <div className="flex items-center gap-4">
          {phases.map((p) => (
            <div key={p.key} className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: p.color, boxShadow: `0 0 6px ${p.color}` }}
              />
              <span className="text-xs text-slate-400">{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 500 }}>
          {gridLines.map((g, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={g.y}
                x2={W - padding.right}
                y2={g.y}
                stroke="#1e2d3d"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <text x={padding.left - 8} y={g.y + 4} fill="#475569" fontSize="10" textAnchor="end">
                {g.val.toFixed(0)}
              </text>
            </g>
          ))}

          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={H - padding.bottom}
            stroke="#2a4a5e"
            strokeWidth="1"
          />
          <line
            x1={padding.left}
            y1={H - padding.bottom}
            x2={W - padding.right}
            y2={H - padding.bottom}
            stroke="#2a4a5e"
            strokeWidth="1"
          />

          <text x={14} y={H / 2} fill="#475569" fontSize="10" textAnchor="middle" transform={`rotate(-90 14 ${H / 2})`}>
            Arus (A)
          </text>

          {phases.map((phase) => {
            if (data.length < 2) return null;
            const points = data
              .map((d, i) => `${xFor(i)},${yFor(d[phase.key])}`)
              .join(' ');
            const areaPoints = `${xFor(0)},${yFor(0)} ${points} ${xFor(data.length - 1)},${yFor(0)}`;

            return (
              <g key={phase.key}>
                <polygon
                  points={areaPoints}
                  fill={phase.color}
                  opacity={0.06}
                />
                <polyline
                  points={points}
                  fill="none"
                  stroke={phase.color}
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 2px ${phase.color}80)` }}
                />
                {data.map((d, i) => (
                  <circle
                    key={i}
                    cx={xFor(i)}
                    cy={yFor(d[phase.key])}
                    r={i === data.length - 1 ? 4 : 0}
                    fill={phase.color}
                    className={i === data.length - 1 ? 'led-pulse' : ''}
                  />
                ))}
              </g>
            );
          })}

          {data.length > 0 && (
            <text
              x={W - padding.right}
              y={H - 8}
              fill="#475569"
              fontSize="9"
              textAnchor="end"
            >
              {new Date(data[data.length - 1].time).toLocaleTimeString('id-ID')}
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}
