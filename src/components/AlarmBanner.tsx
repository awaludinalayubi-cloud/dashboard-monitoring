import { Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AlarmBannerProps {
  alarm: boolean;
  message: string;
}

export default function AlarmBanner({ alarm, message }: AlarmBannerProps) {
  if (alarm) {
    return (
      <div className="panel-card p-4 flex items-center gap-3 border-red-500/40" style={{ borderColor: 'rgba(239,68,68,0.4)' }}>
        <div className="w-11 h-11 rounded-xl bg-red-500/15 flex items-center justify-center glow-red">
          <AlertTriangle size={22} className="text-red-400" />
        </div>
        <div className="flex-1">
          <div className="text-xs text-red-400 font-semibold uppercase tracking-wider">Alarm Aktif</div>
          <div className="text-lg font-bold text-red-300">{message}</div>
        </div>
        <ShieldCheck size={20} className="text-slate-600" />
      </div>
    );
  }

  return (
    <div className="panel-card p-4 flex items-center gap-3">
      <div className="w-11 h-11 rounded-xl bg-green-500/15 flex items-center justify-center glow-green">
        <Activity size={22} className="text-green-400" />
      </div>
      <div className="flex-1">
        <div className="text-xs text-green-400 font-semibold uppercase tracking-wider">Status Sistem</div>
        <div className="text-lg font-bold text-green-300">{message}</div>
      </div>
      <ShieldCheck size={20} className="text-green-400" />
    </div>
  );
}
