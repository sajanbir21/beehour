export type GoalType = 'fitness' | 'career' | 'personal' | 'mixed';
export type Importance = 'high' | 'medium' | 'low';
export type GoalStatus = 'active' | 'shelved';
export type ABCDERank = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Goal {
  id: string;
  name: string;
  type: GoalType;
  importance: Importance;
  deadline?: string;
  status: GoalStatus;
  createdAt: string;
}

export interface Task {
  id: string;
  goalId: string;
  name: string;
  deadline?: string;
  urgent: boolean;
  abcde: ABCDERank;
  isFrog: boolean;
  timeBlock?: string;
  completedDates: string[];
}

export interface Habit {
  id: string;
  name: string;
  goalId?: string;
  frequency: 'daily' | 'weekly';
  completedDates: string[];
  createdAt: string;
}
