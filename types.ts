export enum NavView {
  DASHBOARD = 'Dashboard',
  WEEKLY = 'Weekly Plan',
  MONTHLY = 'Monthly View',
  TASKS = 'Task Board',
  SETTINGS = 'Settings'
}

export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'To Do' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  title: string;
  course: string; // This acts as the Category
  dueDate: string; // ISO string YYYY-MM-DD or simple string
  status: Status;
  priority: Priority;
  duration?: number; // Estimated duration in minutes
  completedAt?: string | null; // ISO string when status moved to Done
  tags?: string[];
  progress?: number;
  description?: string;
}

export interface CourseEvent {
  id: string;
  title: string;
  time: string;
  location: string;
  type: 'Lecture' | 'Lab' | 'Seminar' | 'Exam';
  color: string;
}

export interface GradeMetric {
  subject: string;
  grade: number; // Percentage or GPA point
  credits: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}