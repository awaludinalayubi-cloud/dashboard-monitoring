interface LedIndicatorProps {
  on: boolean;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LedIndicator({ on, label, size = 'md' }: LedIndicatorProps) {
  const dotSize = size === 'lg' ? 'w-5 h-5' : size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5';

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${dotSize} rounded-full ${
          on
            ? 'bg-green-400 led-pulse glow-green'
            : 'bg-slate-700 shadow-inner'
        }`}
        style={
          on
            ? undefined
            : { boxShadow: 'inset 0 0 4px rgba(0,0,0,0.5)' }
        }
      />
      <span className="text-sm font-medium tracking-wide">{label}</span>
    </div>
  );
}
