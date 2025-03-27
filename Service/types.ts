export type TimerStatus = 'running' | 'paused' | 'completed';

export interface Timer {
  id: number;
  name: string;
  duration: number;
  remainingTime: number;
  category: string;
  status: TimerStatus;
  progress: number;
  halfwayAlert: boolean;
}

export interface TimerHistory {
  name: string;
  time: Date;
}
