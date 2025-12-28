import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Clock, Trash2, Edit2, Plus, Check, AlertTriangle } from 'lucide-react';
import { usePlanner } from '../contexts/PlannerContext';
import { Task } from '../types';

interface WeeklyPlanProps {
  onAddTask: (overrides?: Partial<Task>) => void;
  onEditTask: (task: Task) => void;
}

export const WeeklyPlan: React.FC<WeeklyPlanProps> = ({ onAddTask, onEditTask }) => {
  const { tasks, deleteTask, updateTask } = usePlanner();
  const [referenceDate, setReferenceDate] = useState(new Date());
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  
  // Helper to format date as YYYY-MM-DD using local time
  const toLocalISO = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const adjusted = new Date(date.getTime() - (offset * 60 * 1000));
    return adjusted.toISOString().split('T')[0];
  };

  const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
    const newDate = new Date(referenceDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (direction === 'next') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setTime(new Date().getTime());
    }
    setReferenceDate(newDate);
  };

  const today = new Date();
  
  // Calculate start of week (Monday) based on referenceDate
  const currentDayOfWeek = referenceDate.getDay(); // 0 (Sun) - 6 (Sat)
  const diffToMon = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const monday = new Date(referenceDate);
  monday.setDate(referenceDate.getDate() + diffToMon);

  const days = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = toLocalISO(d);
    
    return {
      num: d.getDate(),
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateStr: dateStr,
      isToday: toLocalISO(today) === dateStr
    };
  });

  // Filter tasks to only those present in the current week (Mon-Fri)
  const currentWeekDateStrings = days.map(d => d.dateStr);
  const weekTasks = tasks.filter(t => currentWeekDateStrings.includes(t.dueDate));

  const getDayTasks = (dateStr: string) => {
    return tasks.filter(t => t.dueDate === dateStr);
  };

  const initiateDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setTaskToDelete(id);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  const handleToggleStatus = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    const newStatus = task.status === 'Done' ? 'To Do' : 'Done';
    updateTask({ ...task, status: newStatus });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col relative">
      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setTaskToDelete(null)}>
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full border border-slate-100" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <AlertTriangle size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 text-center mb-2">Delete Task?</h3>
                <p className="text-slate-500 text-center text-sm mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setTaskToDelete(null)}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmDelete}
                        className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-200 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            Week Overview
            <span className="text-slate-300 cursor-pointer hover:text-slate-500">✎</span>
          </h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <span className="inline-block w-4 h-4 bg-slate-200 rounded text-center leading-4 text-xs">📅</span>
            {days[0].name}, {days[0].num} - {days[4].name}, {days[4].num}
          </p>
        </div>
        
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
          <button 
            onClick={() => handleNavigate('prev')}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-md"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={() => handleNavigate('today')}
            className="px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-md"
          >
            This Week
          </button>
          <button 
            onClick={() => handleNavigate('next')}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-md"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Goal Progress */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-8 flex items-center gap-6">
         <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <RotateCcw size={24} />
         </div>
         <div className="flex-1">
            <div className="flex justify-between text-sm mb-2">
               <span className="font-bold text-slate-700 tracking-wide uppercase text-xs">Weekly Tasks Completion</span>
               <span className="font-bold text-blue-600">
                   {weekTasks.length > 0 ? Math.round((weekTasks.filter(t => t.status === 'Done').length / weekTasks.length) * 100) : 0}%
               </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full">
               <div className="h-full bg-blue-600 rounded-full" style={{ width: `${weekTasks.length > 0 ? (weekTasks.filter(t => t.status === 'Done').length / weekTasks.length) * 100 : 0}%` }}></div>
            </div>
         </div>
         <div className="flex gap-8 text-center px-4 border-l border-slate-100">
            <div>
               <span className="block text-2xl font-bold text-slate-800">{weekTasks.filter(t => t.status === 'Done').length}</span>
               <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Done</span>
            </div>
            <div>
               <span className="block text-2xl font-bold text-slate-400">{weekTasks.filter(t => t.status !== 'Done').length}</span>
               <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Left</span>
            </div>
         </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-[1000px] grid grid-cols-5 gap-6 h-full">
          {days.map((day) => (
            <div key={day.name} className={`flex flex-col h-full rounded-2xl ${day.isToday ? 'bg-blue-50/50 ring-1 ring-blue-100' : 'bg-transparent'}`}>
              
              {/* Day Header */}
              <div className="flex justify-between items-center p-4 border-b border-transparent">
                 <div className={`text-center rounded-xl px-3 py-2 ${day.isToday ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-800 border border-slate-200'}`}>
                    <span className="block text-[10px] uppercase font-bold tracking-wider opacity-80">{day.name}</span>
                    <span className="block text-xl font-bold">{day.num}</span>
                 </div>
                 <button 
                  onClick={() => onAddTask({ dueDate: day.dateStr })}
                  className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-slate-100"
                  title="Add task for this day"
                 >
                    <Plus size={20} />
                 </button>
              </div>

              {/* Day Content */}
              <div className="p-4 space-y-3">
                 
                 {getDayTasks(day.dateStr).length === 0 ? (
                    <div 
                      onClick={() => onAddTask({ dueDate: day.dateStr })}
                      className="h-32 rounded-xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 text-sm hover:border-blue-200 hover:text-blue-400 hover:bg-blue-50/20 cursor-pointer transition-all"
                    >
                       <Plus size={20} className="mb-1 opacity-50" />
                       Add Task
                    </div>
                 ) : (
                    getDayTasks(day.dateStr).map(task => (
                        <div 
                          key={task.id} 
                          onClick={() => onEditTask(task)}
                          className={`bg-white p-4 rounded-xl border shadow-sm group hover:border-blue-300 transition-all cursor-pointer relative ${
                            task.status === 'Done' ? 'opacity-60 bg-slate-50' : 'opacity-100'
                          } ${
                            task.priority === 'High' ? 'border-l-4 border-l-red-400' : 
                            task.priority === 'Medium' ? 'border-l-4 border-l-blue-400' : 
                            'border-slate-200'
                          }`}
                        >
                            <div className="flex items-start gap-3">
                                {/* Interactive Checkbox */}
                                <div 
                                  onClick={(e) => handleToggleStatus(e, task)}
                                  className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer hover:scale-110 transition-all flex-shrink-0 ${
                                    task.status === 'Done' 
                                      ? 'bg-green-500 border-green-500' 
                                      : 'border-slate-300 hover:border-blue-400 bg-white'
                                  }`}
                                >
                                  {task.status === 'Done' && <Check size={12} className="text-white" strokeWidth={3} />}
                                </div>

                                <div className="w-full">
                                    <h4 className={`text-sm font-semibold ${task.status === 'Done' ? 'text-slate-400 line-through' : 'text-slate-700'} leading-tight pr-4`}>{task.title}</h4>
                                    <p className="text-xs text-slate-400 mt-1">{task.course}</p>
                                    
                                    <div className="flex justify-between items-center mt-3">
                                      <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                        task.priority === 'High' ? 'bg-red-50 text-red-600' : 
                                        task.priority === 'Medium' ? 'bg-blue-50 text-blue-600' : 
                                        'bg-slate-50 text-slate-500'
                                      }`}>
                                          <span>{task.priority}</span>
                                      </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Actions overlay - Explicit z-index and no opacity to ensure clickability on all devices */}
                            <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
                              <button 
                                onClick={(e) => initiateDelete(e, task.id)}
                                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors bg-white/50 hover:bg-white shadow-sm border border-transparent hover:border-slate-100"
                                title="Delete Task"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                        </div>
                    ))
                 )}

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};