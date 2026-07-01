export interface ScheduleSlot {
  day: string;
  time: string;
  location: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
}

export interface Schedule {
  slots: ScheduleSlot[];
}
