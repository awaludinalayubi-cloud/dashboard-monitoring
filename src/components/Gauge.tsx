interface GaugeProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  color: string;
}

export default function Gauge({ label, value, min, max, unit, color }: GaugeProps) {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const angle = -120 + pct * 240;

  const cx = 70;
  const cy = 70;
  const r = 56;
  const needleLength = 48;

  const needleX = cx + needleLength * Math.cos((angle * Math.PI) / 180);
  const needleY = cy + needleLength * Math.sin((angle * Math.PI) / 180);

  const startAngle = -120;
  const endAngle = 120;
  const arcStartX = cx + r * Math.cos((startAngle * Math.PI) / 180);
  const arcStartY = cy + r * Math.sin((startAngle * Math.PI) / 180);
  const arcEndX = cx + r * Math.cos((endAngle * Math.PI) / 180);
  const arcEndY = cy + r * Math.sin((endAngle * Math.PI) / 180);

  const valueAngle = -120 + pct * 240;
  const valueArcX = cx + r * Math.cos((valueAngle * Math.PI) / 180);
  const valueArcY = cy + r * Math.sin((valueAngle * Math.PI) / 180);

  const largeArcValue = pct > 0.5 ? 1 : 0;
  const largeArcFull = 1;

  const ticks = Array.from({ length: 11 }, (_, i) => {
    const tickAngle = -120 + (i / 10) * 240;
    const innerR = r - 6;
    const outerR = r + 2;
    return {
      x1: cx + innerR * Math.cos((tickAngle * Math.PI) / 180),
      y1: cy + innerR * Math.sin((tickAngle * Math.PI) / 180),
      x2: cx + outerR * Math.cos((tickAngle * Math.PI) / 180),
      y2: cy + outerR * Math.sin((tickAngle * Math.PI) / 180),
      label: Math.round(min + (i / 10) * (max - min)),
      labelX: cx + (r - 18) * Math.cos((tickAngle * Math.PI) / 180),
      labelY: cy + (r - 18) * Math.sin((tickAngle * Math.PI) / 180) + 3,
    };
  });

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 140 140" className="w-full max-w-[170px]">
        <defs>
          <linearGradient id={`grad-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="60%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        <path
          d={`M ${arcStartX} ${arcStartY} A ${r} ${r} 0 ${largeArcFull} 1 ${arcEndX} ${arcEndY}`}
          fill="none"
          stroke="#1e2d3d"
          strokeWidth="8"
          strokeLinecap="round"
        />

        <path
          d={`M ${arcStartX} ${arcStartY} A ${r} ${r} 0 ${largeArcValue} 1 ${valueArcX} ${valueArcY}`}
          fill="none"
          stroke={`url(#grad-${label})`}
          strokeWidth="8"
          strokeLinecap="round"
          style={{ transition: 'all 0.6s ease-out' }}
        />

        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke="#3a4a5a"
              strokeWidth="1.5"
            />
            <text
              x={t.labelX}
              y={t.labelY}
              fill="#64748b"
              fontSize="7"
              textAnchor="middle"
            >
              {t.label}
            </text>
          </g>
        ))}

        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          style={{ transition: 'all 0.6s ease-out', filter: `drop-shadow(0 0 3px ${color})` }}
        />
        <circle cx={cx} cy={cy} r="5" fill={color} />
        <circle cx={cx} cy={cy} r="2.5" fill="#0a0f14" />

        <text
          x={cx}
          y={112}
          fill={color}
          fontSize="16"
          fontWeight="bold"
          textAnchor="middle"
          style={{ transition: 'fill 0.3s ease' }}
        >
          {value.toFixed(1)}
        </text>
        <text x={cx} y={124} fill="#64748b" fontSize="9" textAnchor="middle">
          {unit}
        </text>
      </svg>
      <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase -mt-1">
        {label}
      </span>
    </div>
  );
}
