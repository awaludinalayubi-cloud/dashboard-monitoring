import type { MotorData } from '@/types/motor';

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function round(v: number, decimals = 1): number {
  const f = Math.pow(10, decimals);
  return Math.round(v * f) / f;
}

function randomWalk(prev: number, min: number, max: number, volatility: number): number {
  const delta = (Math.random() - 0.5) * volatility;
  return clamp(prev + delta, min, max);
}

export class MotorSimulator {
  private state: MotorData;
  private energyAccumulator: number;

  constructor() {
    this.state = this.initialState();
    this.energyAccumulator = 0;
  }

  private initialState(): MotorData {
    return {
      motorRunning: true,
      current: { R: 45.2, S: 43.8, T: 44.5 },
      voltage: 380,
      power: 28.5,
      powerFactor: 0.86,
      frequency: 50,
      energy: 0,
      alarm: false,
      alarmMessage: 'NORMAL',
      timestamp: Date.now(),
    };
  }

  setMotorRunning(running: boolean): void {
    this.state = {
      ...this.state,
      motorRunning: running,
      alarm: false,
      alarmMessage: 'NORMAL',
      timestamp: Date.now(),
    };
  }

  injectFault(): void {
    const faultType = Math.random();
    if (faultType < 0.4) {
      this.state = {
        ...this.state,
        current: {
          R: round(clamp(this.state.current.R + 35, 0, 100)),
          S: this.state.current.S,
          T: this.state.current.T,
        },
        power: round(this.state.power * 1.3, 1),
        powerFactor: round(clamp(this.state.powerFactor - 0.15, 0, 1), 2),
        alarm: true,
        alarmMessage: 'OVERLOAD FASA R',
        timestamp: Date.now(),
      };
    } else if (faultType < 0.7) {
      this.state = {
        ...this.state,
        voltage: round(clamp(this.state.voltage - 60, 0, 500)),
        alarm: true,
        alarmMessage: 'UNDERVOLTAGE',
        timestamp: Date.now(),
      };
    } else {
      this.state = {
        ...this.state,
        current: {
          R: round(clamp(this.state.current.R - 30, 0, 100)),
          S: round(clamp(this.state.current.S + 25, 0, 100)),
          T: this.state.current.T,
        },
        alarm: true,
        alarmMessage: 'KETIDAKSEIMBANGAN ARUS',
        timestamp: Date.now(),
      };
    }
  }

  clearAlarm(): void {
    this.state = {
      ...this.state,
      alarm: false,
      alarmMessage: 'NORMAL',
      timestamp: Date.now(),
    };
  }

  tick(): MotorData {
    const now = Date.now();

    if (this.state.motorRunning && !this.state.alarm) {
      const prevEnergy = this.energyAccumulator;
      this.energyAccumulator += this.state.power / 3600;

      this.state = {
        motorRunning: true,
        current: {
          R: round(randomWalk(this.state.current.R, 30, 70, 3)),
          S: round(randomWalk(this.state.current.S, 30, 70, 3)),
          T: round(randomWalk(this.state.current.T, 30, 70, 3)),
        },
        voltage: round(randomWalk(this.state.voltage, 370, 400, 2)),
        power: round(randomWalk(this.state.power, 25, 35, 1)),
        powerFactor: round(randomWalk(this.state.powerFactor, 0.8, 0.95, 0.02), 2),
        frequency: round(randomWalk(this.state.frequency, 49.5, 50.5, 0.2), 1),
        energy: Math.floor(prevEnergy * 1000) / 1000,
        alarm: false,
        alarmMessage: 'NORMAL',
        timestamp: now,
      };
    } else if (!this.state.motorRunning) {
      this.state = {
        ...this.state,
        current: { R: 0, S: 0, T: 0 },
        power: 0,
        powerFactor: 0,
        timestamp: now,
      };
    } else {
      this.state = { ...this.state, timestamp: now };
    }

    return { ...this.state };
  }

  getState(): MotorData {
    return { ...this.state };
  }
}
