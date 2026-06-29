export type GoalType = 'fitness' | 'career' | 'personal' | 'mixed';
export type Importance = 'high' | 'medium' | 'low';
export type GoalStatus = 'active' | 'shelved';

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
  completedDates: string[];
}
