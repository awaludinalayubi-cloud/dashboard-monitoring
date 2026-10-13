export interface PhaseCurrent {
  R: number;
  S: number;
  T: number;
}

export interface MotorData {
  motorRunning: boolean;
  current: PhaseCurrent;
  voltage: number;
  power: number;
  powerFactor: number;
  frequency: number;
  energy: number;
  alarm: boolean;
  alarmMessage: string;
  timestamp: number;
}

export interface ChartPoint {
  time: number;
  R: number;
  S: number;
  T: number;
}

export type DataSource = 'simulation' | 'device';

export interface ConnectionState {
  source: DataSource;
  connected: boolean;
  deviceName: string | null;
  lastUpdated: number | null;
}
