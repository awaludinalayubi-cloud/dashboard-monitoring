import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  accentColor?: string;
  warning?: boolean;
}

export default function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  accentColor = '#00e676',
  warning = false,
}: MetricCardProps) {
  return (
    <div className="panel-card panel-card-hover p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
          {label}
        </span>
        <Icon size={16} style={{ color: warning ? '#ef4444' : accentColor }} />
      </div>
      <div className="flex items-baseline gap-1.5">
        <span
          className="text-2xl font-bold tabular-nums"
          style={{ color: warning ? '#ef4444' : '#f1f5f9' }}
        >
          {value}
        </span>
        <span className="text-sm text-slate-500">{unit}</span>
      </div>
    </div>
  );
}
