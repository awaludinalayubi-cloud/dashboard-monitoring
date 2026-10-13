import { useEffect, useState } from 'react';
import { Wifi, WifiOff, Activity, Clock, Cpu } from 'lucide-react';
import type { ConnectionState } from '@/types/motor';

interface StatusBarProps {
  connection: ConnectionState;
}

export default function StatusBar({ connection }: StatusBarProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const lastUpdatedStr = connection.lastUpdated
    ? new Date(connection.lastUpdated).toLocaleTimeString('id-ID')
    : '--:--:--';

  const isSimulation = connection.source === 'simulation';

  return (
    <div className="panel-card p-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
      <div className="flex items-center gap-2">
        {connection.connected ? (
          <Wifi size={14} className="text-green-400" />
        ) : (
          <WifiOff size={14} className="text-red-400" />
        )}
        <span className={connection.connected ? 'text-green-400' : 'text-red-400'}>
          {connection.connected ? 'Terhubung' : 'Terputus'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Cpu size={14} className="text-slate-500" />
        <span className="text-slate-400">
          {isSimulation ? 'Sumber: SIMULASI' : `Sumber: ${connection.deviceName ?? 'Perangkat'}`}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Activity size={14} className={connection.connected ? 'text-green-400 led-pulse' : 'text-slate-600'} />
        <span className="text-slate-400">Pembaruan: {lastUpdatedStr}</span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Clock size={14} className="text-slate-500" />
        <span className="text-slate-400 tabular-nums">
          {now.toLocaleTimeString('id-ID')}
        </span>
      </div>
    </div>
  );
}
