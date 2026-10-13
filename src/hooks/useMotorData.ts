import { useEffect, useRef, useState, useCallback } from 'react';
import type { MotorData, ChartPoint, ConnectionState, DataSource } from '@/types/motor';
import { MotorSimulator } from '@/services/motorSimulator';
import { deviceAdapter, type DeviceConfig } from '@/services/deviceAdapter';

const MAX_CHART_POINTS = 60;
const TICK_INTERVAL_MS = 2000;

export function useMotorData() {
  const simulatorRef = useRef<MotorSimulator | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const deviceConfigRef = useRef<DeviceConfig | null>(null);

  const [data, setData] = useState<MotorData>(() => {
    const sim = new MotorSimulator();
    return sim.getState();
  });

  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [connection, setConnection] = useState<ConnectionState>({
    source: 'simulation',
    connected: true,
    deviceName: null,
    lastUpdated: Date.now(),
  });

  const getSimulator = useCallback(() => {
    if (!simulatorRef.current) {
      simulatorRef.current = new MotorSimulator();
    }
    return simulatorRef.current;
  }, []);

  const startSimulation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const sim = getSimulator();
    setConnection({
      source: 'simulation',
      connected: true,
      deviceName: null,
      lastUpdated: Date.now(),
    });

    intervalRef.current = setInterval(() => {
      const newData = sim.tick();
      setData(newData);
      setConnection((prev) => ({ ...prev, lastUpdated: Date.now() }));
      setChartData((prev) => {
        const point: ChartPoint = {
          time: newData.timestamp,
          R: newData.current.R,
          S: newData.current.S,
          T: newData.current.T,
        };
        const next = [...prev, point];
        if (next.length > MAX_CHART_POINTS) next.shift();
        return next;
      });
    }, TICK_INTERVAL_MS);
  }, [getSimulator]);

  const startDevice = useCallback(async (config: DeviceConfig) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    try {
      await deviceAdapter.connect(config);
      deviceConfigRef.current = config;
      setConnection({
        source: 'device',
        connected: true,
        deviceName: config.endpoint,
        lastUpdated: Date.now(),
      });

      intervalRef.current = setInterval(async () => {
        try {
          const newData = await deviceAdapter.read();
          setData(newData);
          setConnection((prev) => ({ ...prev, lastUpdated: Date.now() }));
          setChartData((prev) => {
            const point: ChartPoint = {
              time: newData.timestamp,
              R: newData.current.R,
              S: newData.current.S,
              T: newData.current.T,
            };
            const next = [...prev, point];
            if (next.length > MAX_CHART_POINTS) next.shift();
            return next;
          });
        } catch {
          setConnection((prev) => ({ ...prev, connected: false }));
        }
      }, config.pollIntervalMs);
    } catch (err) {
      setConnection({
        source: 'device',
        connected: false,
        deviceName: config.endpoint,
        lastUpdated: null,
      });
      throw err;
    }
  }, []);

  const switchSource = useCallback(
    async (source: DataSource, config?: DeviceConfig) => {
      if (source === 'simulation') {
        if (intervalRef.current) clearInterval(intervalRef.current);
        deviceAdapter.disconnect();
        startSimulation();
      } else if (source === 'device' && config) {
        await startDevice(config);
      }
    },
    [startSimulation, startDevice],
  );

  const setMotorRunning = useCallback((running: boolean) => {
    getSimulator().setMotorRunning(running);
    const newData = getSimulator().getState();
    setData(newData);
  }, [getSimulator]);

  const injectFault = useCallback(() => {
    getSimulator().injectFault();
    const newData = getSimulator().getState();
    setData(newData);
  }, [getSimulator]);

  const clearAlarm = useCallback(() => {
    getSimulator().clearAlarm();
    const newData = getSimulator().getState();
    setData(newData);
  }, [getSimulator]);

  useEffect(() => {
    startSimulation();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    chartData,
    connection,
    setMotorRunning,
    injectFault,
    clearAlarm,
    switchSource,
  };
}
