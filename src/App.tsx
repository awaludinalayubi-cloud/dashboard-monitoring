import { Zap, Gauge as GaugeIcon, Power, Activity, Radio, Battery } from 'lucide-react';
import Header from '@/components/Header';
import StatusBar from '@/components/StatusBar';
import LedIndicator from '@/components/LedIndicator';
import Gauge from '@/components/Gauge';
import MetricCard from '@/components/MetricCard';
import CurrentChart from '@/components/CurrentChart';
import AlarmBanner from '@/components/AlarmBanner';
import ControlPanel from '@/components/ControlPanel';
import { useMotorData } from '@/hooks/useMotorData';

function App() {
  const {
    data,
    chartData,
    connection,
    setMotorRunning,
    injectFault,
    clearAlarm,
  } = useMotorData();

  const voltageWarning = data.voltage < 360 || data.voltage > 400;
  const pfWarning = data.powerFactor < 0.8 && data.motorRunning;

  return (
    <div className="min-h-screen bg-[#0a0f14] text-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-4 sm:py-6">
        <Header />
        <StatusBar connection={connection} />

        {/* Simulation disclaimer banner */}
        <div className="mt-3 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
          <Radio size={14} className="text-amber-400 flex-shrink-0" />
          <p className="text-xs text-amber-300/80 leading-snug">
            <span className="font-semibold">MODE SIMULASI:</span>{' '}
            Data yang ditampilkan adalah data contoh yang dihasilkan secara otomatis,
            bukan dari panel listrik nyata. Integrasi ESP32 dapat ditambahkan kemudian.
          </p>
        </div>

        {/* Top row: motor status + alarm */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="panel-card p-4 flex flex-col justify-center gap-3">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Status Motor
            </h3>
            <LedIndicator on={data.motorRunning} label={data.motorRunning ? 'MOTOR BERJALAN (ON)' : 'MOTOR BERHENTI (OFF)'} size="lg" />
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1 border-t border-slate-800">
              <Power size={12} />
              <span>{data.motorRunning ? 'Daya aktif tersalurkan' : 'Tidak ada daya'}</span>
            </div>
          </div>

          <div className="lg:col-span-2">
            <AlarmBanner alarm={data.alarm} message={data.alarmMessage} />
          </div>
        </div>

        {/* Gauge row */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="panel-card p-4 flex justify-center">
            <Gauge label="Arus Fasa R" value={data.current.R} min={0} max={100} unit="A" color="#00e676" />
          </div>
          <div className="panel-card p-4 flex justify-center">
            <Gauge label="Arus Fasa S" value={data.current.S} min={0} max={100} unit="A" color="#60a5fa" />
          </div>
          <div className="panel-card p-4 flex justify-center">
            <Gauge label="Arus Fasa T" value={data.current.T} min={0} max={100} unit="A" color="#fbbf24" />
          </div>
        </div>

        {/* Metric cards */}
        <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            label="Tegangan"
            value={data.voltage.toFixed(1)}
            unit="V"
            icon={Zap}
            accentColor="#60a5fa"
            warning={voltageWarning}
          />
          <MetricCard
            label="Daya"
            value={data.power.toFixed(2)}
            unit="kW"
            icon={GaugeIcon}
            accentColor="#00e676"
          />
          <MetricCard
            label="Faktor Daya"
            value={data.powerFactor.toFixed(2)}
            unit="cos φ"
            icon={Activity}
            accentColor="#fbbf24"
            warning={pfWarning}
          />
          <MetricCard
            label="Frekuensi"
            value={data.frequency.toFixed(1)}
            unit="Hz"
            icon={Radio}
            accentColor="#a78bfa"
          />
        </div>

        {/* Energy + Control */}
        <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="panel-card p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/15 flex items-center justify-center">
              <Battery size={24} className="text-green-400" />
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Total Energi
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-100 tabular-nums">
                  {data.energy.toFixed(3)}
                </span>
                <span className="text-sm text-slate-500">kWh</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <ControlPanel
              motorRunning={data.motorRunning}
              onToggleMotor={setMotorRunning}
              onInjectFault={injectFault}
              onClearAlarm={clearAlarm}
              hasAlarm={data.alarm}
            />
          </div>
        </div>

        {/* Chart */}
        <div className="mt-3">
          <CurrentChart data={chartData} />
        </div>

        {/* Footer */}
        <footer className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <span>MONITORING PANEL DOL 3 FASA — Dashboard Industri</span>
          <span>Mode: SIMULASI | Integrasi ESP32/Blynk: Siap</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
