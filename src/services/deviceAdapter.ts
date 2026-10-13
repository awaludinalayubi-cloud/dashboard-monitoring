import type { MotorData } from '@/types/motor';

export interface DeviceConfig {
  endpoint: string;
  apiKey?: string;
  pollIntervalMs: number;
}

export interface DeviceAdapter {
  connect(config: DeviceConfig): Promise<void>;
  disconnect(): void;
  isConnected(): boolean;
  read(): Promise<MotorData>;
}

const DUMMY_MAP: Record<string, number> = {
  currentR: 0,
  currentS: 1,
  currentT: 2,
  voltage: 3,
  power: 4,
  powerFactor: 5,
  frequency: 6,
  energy: 7,
  motorRunning: 8,
  alarm: 9,
};

export class ESP32HttpAdapter implements DeviceAdapter {
  private config: DeviceConfig | null = null;
  private connected = false;

  async connect(config: DeviceConfig): Promise<void> {
    this.config = config;
    try {
      const resp = await fetch(`${config.endpoint}/health`, {
        headers: config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {},
        signal: AbortSignal.timeout(5000),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      this.connected = true;
    } catch (err) {
      this.connected = false;
      throw new Error(
        `Gagal terhubung ke perangkat: ${err instanceof Error ? err.message : 'unknown error'}`,
      );
    }
  }

  disconnect(): void {
    this.connected = false;
    this.config = null;
  }

  isConnected(): boolean {
    return this.connected;
  }

  async read(): Promise<MotorData> {
    if (!this.config) throw new Error('Adapter belum dihubungkan');
    const resp = await fetch(`${this.config.endpoint}/data`, {
      headers: this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {},
      signal: AbortSignal.timeout(this.config.pollIntervalMs),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const raw = await resp.json();
    return {
      motorRunning: Boolean(raw.motorRunning ?? raw[DUMMY_MAP.motorRunning]),
      current: {
        R: Number(raw.currentR ?? raw[DUMMY_MAP.currentR] ?? 0),
        S: Number(raw.currentS ?? raw[DUMMY_MAP.currentS] ?? 0),
        T: Number(raw.currentT ?? raw[DUMMY_MAP.currentT] ?? 0),
      },
      voltage: Number(raw.voltage ?? raw[DUMMY_MAP.voltage] ?? 0),
      power: Number(raw.power ?? raw[DUMMY_MAP.power] ?? 0),
      powerFactor: Number(raw.powerFactor ?? raw[DUMMY_MAP.powerFactor] ?? 0),
      frequency: Number(raw.frequency ?? raw[DUMMY_MAP.frequency] ?? 0),
      energy: Number(raw.energy ?? raw[DUMMY_MAP.energy] ?? 0),
      alarm: Boolean(raw.alarm ?? raw[DUMMY_MAP.alarm] ?? false),
      alarmMessage: String(raw.alarmMessage ?? (raw.alarm ? 'FAULT' : 'NORMAL')),
      timestamp: Date.now(),
    };
  }
}

export const deviceAdapter: DeviceAdapter = new ESP32HttpAdapter();
