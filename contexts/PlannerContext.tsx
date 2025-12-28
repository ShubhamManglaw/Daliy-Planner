import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { Task } from '../types';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

interface DailyGoal {
  current: number;
  target: number;
}

interface PlannerContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  clearAllData: () => void;

  categories: string[];
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;

  dailyGoal: DailyGoal;
  updateDailyGoalTarget: (target: number) => void;
  updateDailyGoalCurrent: (current: number) => void;

  getStudyData: (timeframe: string) => { name: string; hours: number }[];
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) throw new Error('usePlanner must be used within a PlannerProvider');
  return context;
};

const DEFAULT_CATEGORIES: string[] = ['Computer Science', 'Mathematics', 'General'];

export const PlannerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>({ current: 0, target: 4 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from Firestore
  useEffect(() => {
    if (user && user.id) {
      const userDocRef = doc(db, 'users', user.id);

      // Real-time listener
      const unsubscribe = onSnapshot(userDocRef, async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTasks(Array.isArray(data.tasks) ? data.tasks : []);
          setCategories(Array.isArray(data.categories) ? data.categories : DEFAULT_CATEGORIES);
          setDailyGoal(data.dailyGoal || { current: 0, target: 4 });
          setIsLoaded(true);
        } else {
          // If doc doesn't exist, check for local storage data to migrate
          const storageKey = `scholarSync_data_${user.id}`;
          const localData = localStorage.getItem(storageKey);

          if (localData) {
            try {
              const parsed = JSON.parse(localData);
              // Migrate to Firestore
              await setDoc(userDocRef, {
                tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
                categories: Array.isArray(parsed.categories) ? parsed.categories : DEFAULT_CATEGORIES,
                dailyGoal: parsed.dailyGoal || { current: 0, target: 4 }
              });
              // Don't set state here, the listener will fire again with the new data
            } catch (e) {
              console.error("Migration failed", e);
              // Fallback defaults
              setTasks([]);
              setCategories(DEFAULT_CATEGORIES);
              setDailyGoal({ current: 0, target: 4 });
              setIsLoaded(true);
            }
          } else {
            // No local data, initialize empty defaults
            setTasks([]);
            setCategories(DEFAULT_CATEGORIES);
            setDailyGoal({ current: 0, target: 4 });
            setIsLoaded(true);
          }
        }
      }, (error) => {
        console.error("Firestore Error:", error);
        setIsLoaded(true); // Ensure app doesn't hang
      });

      return () => unsubscribe();
    } else {
      setTasks([]);
      setIsLoaded(false); // Reset loaded state when logged out
    }
  }, [user]);

  // Save data to Firestore (Debounced)
  useEffect(() => {
    if (user && user.id && isLoaded) {
      const userDocRef = doc(db, 'users', user.id);
      const dataToSave = { tasks, categories, dailyGoal };

      const timeoutId = setTimeout(async () => {
        try {
          await setDoc(userDocRef, dataToSave, { merge: true });
        } catch (error) {
          console.error("Failed to save to Firestore:", error);
        }
      }, 1000); // 1 second debounce

      return () => clearTimeout(timeoutId);
    }
  }, [tasks, categories, dailyGoal, user, isLoaded]);

  const addTask = useCallback((taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
      completedAt: taskData.status === 'Done' ? new Date().toISOString() : undefined,
      duration: taskData.duration || 60,
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks(prev => prev.map(t => {
      if (t.id === updatedTask.id) {
        let completedAt = t.completedAt;
        // Logic to toggle completedAt based on Status change
        if (updatedTask.status === 'Done' && (t.status !== 'Done' || !t.completedAt)) {
          completedAt = new Date().toISOString();
        } else if (updatedTask.status !== 'Done' && t.status === 'Done') {
          completedAt = undefined;
        }
        return {
          ...updatedTask,
          completedAt,
          duration: updatedTask.duration || t.duration || 60
        };
      }
      return t;
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAllData = useCallback(() => {
    if (window.confirm("Are you sure you want to delete all tasks and categories? This cannot be undone.")) {
      setTasks([]);
      setCategories(DEFAULT_CATEGORIES);
      setDailyGoal({ current: 0, target: 4 });
    }
  }, []);

  const addCategory = useCallback((category: string) => {
    setCategories(prev => !prev.includes(category) ? [...prev, category] : prev);
  }, []);

  const removeCategory = useCallback((category: string) => {
    setCategories(prev => prev.filter(c => c !== category));
  }, []);

  const updateDailyGoalTarget = useCallback((target: number) => {
    setDailyGoal(prev => ({ ...prev, target }));
  }, []);

  const updateDailyGoalCurrent = useCallback((current: number) => {
    setDailyGoal(prev => ({ ...prev, current: Math.max(0, current) }));
  }, []);

  // Memoized complex calculation
  const getStudyData = useCallback((timeframe: string) => {
    const completedTasks = tasks.filter(t => t.status === 'Done');

    if (timeframe === 'Daily') {
      const result = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

        const tasksForDay = completedTasks.filter(t => {
          const tDate = t.completedAt ? new Date(t.completedAt) : new Date(t.dueDate);
          return tDate.toISOString().split('T')[0] === dateStr;
        });

        const totalMinutes = tasksForDay.reduce((acc, t) => acc + (t.duration || 60), 0);
        result.push({ name: dayName, hours: parseFloat((totalMinutes / 60).toFixed(1)) });
      }
      return result;
    } else if (timeframe === 'Weekly') {
      const result = [];
      for (let i = 3; i >= 0; i--) {
        const endPeriod = new Date();
        endPeriod.setDate(endPeriod.getDate() - (i * 7));
        endPeriod.setHours(23, 59, 59, 999);

        const startPeriod = new Date(endPeriod);
        startPeriod.setDate(startPeriod.getDate() - 6);
        startPeriod.setHours(0, 0, 0, 0);

        const tasksForWeek = completedTasks.filter(t => {
          const tDate = new Date(t.completedAt || t.dueDate);
          return tDate >= startPeriod && tDate <= endPeriod;
        });

        const totalMinutes = tasksForWeek.reduce((acc, t) => acc + (t.duration || 60), 0);
        const label = i === 0 ? 'This Wk' : i === 1 ? 'Last Wk' : `${i} Wks Ago`;

        result.push({ name: label, hours: parseFloat((totalMinutes / 60).toFixed(1)) });
      }
      return result.reverse();
    } else {
      const result = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthName = d.toLocaleDateString('en-US', { month: 'short' });
        const monthIdx = d.getMonth();
        const year = d.getFullYear();

        const tasksForMonth = completedTasks.filter(t => {
          const tDate = new Date(t.completedAt || t.dueDate);
          return tDate.getMonth() === monthIdx && tDate.getFullYear() === year;
        });

        const totalMinutes = tasksForMonth.reduce((acc, t) => acc + (t.duration || 60), 0);
        result.push({ name: monthName, hours: parseFloat((totalMinutes / 60).toFixed(1)) });
      }
      return result;
    }
  }, [tasks]);

  const contextValue = useMemo(() => ({
    tasks, addTask, updateTask, deleteTask, clearAllData,
    categories, addCategory, removeCategory,
    dailyGoal, updateDailyGoalTarget, updateDailyGoalCurrent,
    getStudyData
  }), [tasks, categories, dailyGoal, addTask, updateTask, deleteTask, clearAllData, addCategory, removeCategory, updateDailyGoalTarget, updateDailyGoalCurrent, getStudyData]);

  return (
    <PlannerContext.Provider value={contextValue}>
      {children}
    </PlannerContext.Provider>
  );
};