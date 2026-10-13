import { Gauge as GaugeIcon } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center justify-between gap-4 mb-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-green-500/15 border border-green-500/30 flex items-center justify-center glow-green">
          <GaugeIcon size={24} className="text-green-400" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight leading-tight">
            MONITORING PANEL DOL 3 FASA
          </h1>
          <p className="text-[11px] text-slate-500 tracking-wider uppercase">
            Sistem Monitoring Motor Listrik 3 Fasa
          </p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
        <span className="w-2 h-2 rounded-full bg-green-400 led-pulse" />
        <span className="text-xs font-medium text-green-400">ONLINE</span>
      </div>
    </header>
  );
}
