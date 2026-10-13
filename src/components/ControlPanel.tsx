import { useState } from 'react';
import { Play, Square, Zap, Bell, XCircle, Settings } from 'lucide-react';

interface ControlPanelProps {
  motorRunning: boolean;
  onToggleMotor: (running: boolean) => void;
  onInjectFault: () => void;
  onClearAlarm: () => void;
  hasAlarm: boolean;
}

export default function ControlPanel({
  motorRunning,
  onToggleMotor,
  onInjectFault,
  onClearAlarm,
  hasAlarm,
}: ControlPanelProps) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="panel-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Kontrol Motor
        </h3>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-slate-500 hover:text-slate-300 transition-colors"
          title="Informasi"
        >
          <Settings size={16} />
        </button>
      </div>

      {showInfo && (
        <div className="mb-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700 text-xs text-slate-400 leading-relaxed">
          Mode SIMULASI aktif. Data ditampilkan bukan dari perangkat nyata.
          Integrasi ESP32 dapat ditambahkan melalui modul <code className="text-green-400">deviceAdapter</code>.
          Tombol di bawah mensimulasikan kontrol motor dan kondisi gangguan untuk keperluan pengujian dashboard.
        </div>
      )}

      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => onToggleMotor(!motorRunning)}
          disabled={motorRunning}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all ${
            motorRunning
              ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
              : 'bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25'
          }`}
        >
          <Play size={16} />
          Start Motor
        </button>
        <button
          onClick={() => onToggleMotor(false)}
          disabled={!motorRunning}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all ${
            !motorRunning
              ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
              : 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25'
          }`}
        >
          <Square size={16} />
          Stop Motor
        </button>
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        <button
          onClick={onInjectFault}
          className="flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
        >
          <Zap size={14} />
          Simulasi Gangguan
        </button>
        <button
          onClick={onClearAlarm}
          disabled={!hasAlarm}
          className={`flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-xs transition-all ${
            !hasAlarm
              ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
              : 'bg-slate-700/50 text-slate-300 border border-slate-600 hover:bg-slate-700'
          }`}
        >
          <XCircle size={14} />
          Reset Alarm
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-500">
        <Bell size={12} />
        <span>Kontrol ini hanya untuk SIMULASI data</span>
      </div>
    </div>
  );
}
