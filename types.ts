
export interface Category {
  id: string;
  name: string;
  color: string; // e.g. 'emerald', 'blue'
  is_default: boolean;
  user_id?: string;
}

export interface Habit {
  id: string;
  title: string;
  category_id: string; // Links to Category.id
  completedDates: string[]; // ISO Date strings "YYYY-MM-DD"
  streak: number;
  createdAt: string;
}

export interface DayStatus {
  date: string; // YYYY-MM-DD
  completedCount: number;
  totalHabits: number;
}

export interface AIHabitSuggestion {
  habitName: string;
  category: string;
  reason: string;
}
