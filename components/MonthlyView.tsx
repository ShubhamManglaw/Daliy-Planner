import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { usePlanner } from '../contexts/PlannerContext';
import { Task } from '../types';

interface MonthlyViewProps {
  onAddTask: (overrides?: Partial<Task>) => void;
  onEditTask: (task: Task) => void;
}

export const MonthlyView: React.FC<MonthlyViewProps> = ({ onAddTask, onEditTask }) => {
  const { tasks } = usePlanner();
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const handleToday = () => {
      setCurrentDate(new Date());
  };

  const getTasksForDate = (date: Date) => {
     const offset = date.getTimezoneOffset();
     const adjusted = new Date(date.getTime() - (offset * 60 * 1000));
     const dateStr = adjusted.toISOString().split('T')[0];
     return tasks.filter(t => t.dueDate === dateStr);
  };

  // Generate calendar grid
  const days = [];
  // Empty slots for previous month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  // Days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
       {/* Header */}
       <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                {monthNames[month]} {year}
            </h1>
            <p className="text-slate-500 mt-1">Plan your month ahead</p>
        </div>
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
            <button onClick={handlePrevMonth} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-md">
                <ChevronLeft size={18} />
            </button>
            <button onClick={handleToday} className="px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-md">
                Today
            </button>
            <button onClick={handleNextMonth} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-md">
                <ChevronRight size={18} />
            </button>
        </div>
       </div>

       {/* Calendar Grid */}
       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
             {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                 <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {day}
                 </div>
             ))}
          </div>
          
          {/* Days Grid */}
          <div className="grid grid-cols-7 flex-1 auto-rows-fr">
             {days.map((date, index) => {
                 if (!date) return <div key={`empty-${index}`} className="bg-slate-50/30 border-b border-r border-slate-100 min-h-[100px]" />;
                 
                 const dateTasks = getTasksForDate(date);
                 const isToday = new Date().toDateString() === date.toDateString();
                 const offset = date.getTimezoneOffset();
                 const adjusted = new Date(date.getTime() - (offset * 60 * 1000));
                 const dateStr = adjusted.toISOString().split('T')[0];

                 return (
                     <div 
                        key={index} 
                        className={`border-b border-r border-slate-100 p-2 min-h-[100px] relative group transition-colors hover:bg-slate-50 cursor-pointer ${isToday ? 'bg-blue-50/30' : ''}`}
                        onClick={() => onAddTask({ dueDate: dateStr })}
                     >
                        <div className="flex justify-between items-start mb-1">
                            <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-slate-700'}`}>
                                {date.getDate()}
                            </span>
                            <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-600 p-1 transition-opacity">
                                <Plus size={14} />
                            </button>
                        </div>
                        
                        <div className="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                            {dateTasks.map(task => (
                                <div 
                                    key={task.id} 
                                    onClick={(e) => { e.stopPropagation(); onEditTask(task); }}
                                    className={`text-[10px] px-2 py-1 rounded border truncate hover:shadow-sm transition-all ${
                                        task.status === 'Done' ? 'bg-slate-100 text-slate-400 line-through border-slate-200' : 
                                        task.priority === 'High' ? 'bg-red-50 text-red-700 border-red-100' :
                                        task.priority === 'Medium' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                        'bg-white text-slate-700 border-slate-200'
                                    }`}
                                    title={task.title}
                                >
                                    {task.title}
                                </div>
                            ))}
                        </div>
                     </div>
                 );
             })}
          </div>
       </div>
    </div>
  );
};
