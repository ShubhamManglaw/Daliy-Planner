import React, { useState, useEffect } from 'react';
import { Bell, MoreHorizontal, Clock, MapPin, Calendar, Play, Pause, RotateCcw, X, List, Plus, Sparkles, CheckCircle2, TrendingUp, BookOpen, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, YAxis, CartesianGrid } from 'recharts';
import { usePlanner } from '../contexts/PlannerContext';
import { NavView } from '../types';

interface DashboardProps {
  onAddTask: () => void;
  onNavigate: (view: NavView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onAddTask, onNavigate }) => {
  const { getStudyData, tasks } = usePlanner();
  
  const [activeTimeframe, setActiveTimeframe] = useState('Daily');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  // Interaction States
  const [showAlerts, setShowAlerts] = useState(false);
  const [showTaskMenu, setShowTaskMenu] = useState(false);
  const [showFocusTimer, setShowFocusTimer] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [focusTaskTitle, setFocusTaskTitle] = useState('');

  const chartData = getStudyData(activeTimeframe);

  // Get tasks sorted by date
  const sortedTasks = tasks
    .filter(t => t.status !== 'Done')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    
  const upcomingTasks = sortedTasks.slice(0, 4);
  const nextTask = sortedTasks[0];

  // Dynamic Alert Logic
  const todayStr = new Date().toISOString().split('T')[0];
  
  const overdueTasks = tasks.filter(t => t.status !== 'Done' && t.dueDate < todayStr);
  const dueTodayTasks = tasks.filter(t => t.status !== 'Done' && t.dueDate === todayStr);
  
  const alerts = [
      ...overdueTasks.map(t => ({ 
          id: t.id, 
          type: 'overdue', 
          message: `Overdue: ${t.title} (${t.course})`, 
          time: new Date(t.dueDate).toLocaleDateString()
      })),
      ...dueTodayTasks.map(t => ({ 
          id: t.id, 
          type: 'due', 
          message: `Due Today: ${t.title}`, 
          time: 'Due by 11:59 PM' 
      }))
  ];

  if (tasks.length === 0) {
      alerts.push({ id: 'welcome', type: 'info', message: 'Welcome! Add your first task to get started.', time: 'Just now' });
  }

  // Timer Logic
  useEffect(() => {
    let interval: number;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      // Play sound or alert here
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const startFocusSession = (taskTitle: string) => {
    setFocusTaskTitle(taskTitle);
    setShowFocusTimer(true);
    setTimerActive(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const calculateTimeLeft = (dueDateStr: string) => {
    const due = new Date(dueDateStr);
    const now = new Date();
    const diffMs = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days left`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto relative space-y-8">
      {/* Focus Timer Modal Overlay */}
      {showFocusTimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center relative">
              <button 
                onClick={() => { setShowFocusTimer(false); setTimerActive(false); }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
              
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={32} />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Focus Session</h2>
              <p className="text-slate-500 mb-8 truncate">{focusTaskTitle || 'Study Session'}</p>
              
              <div className="text-6xl font-mono font-bold text-slate-800 mb-8 tracking-wider">
                {formatTime(timeLeft)}
              </div>
              
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => setTimerActive(!timerActive)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    timerActive 
                      ? 'bg-orange-100 text-orange-500 hover:bg-orange-200' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                  }`}
                >
                  {timerActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1"/>}
                </button>
                
                <button 
                  onClick={() => { setTimerActive(false); setTimeLeft(25 * 60); }}
                  className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
                >
                  <RotateCcw size={24} />
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1 font-medium">
            <Calendar size={14} />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Overview</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setShowAlerts(!showAlerts)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${showAlerts ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <Bell size={18} />
              <span className="hidden sm:inline">Alerts</span>
              {alerts.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{alerts.length}</span>
              )}
            </button>
            
            {/* Alerts Dropdown */}
            {showAlerts && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">Notifications</h3>
                  <span className="text-xs text-slate-400">{alerts.length} New</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {alerts.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-sm">No new notifications</div>
                  ) : (
                      alerts.map((alert, idx) => (
                          <div key={idx} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${alert.type === 'overdue' ? 'bg-red-50/50' : ''}`}>
                             <div className={`mt-0.5 ${alert.type === 'overdue' ? 'text-red-500' : alert.type === 'due' ? 'text-orange-500' : 'text-blue-500'}`}>
                                {alert.type === 'overdue' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                             </div>
                             <div>
                                <p className={`text-sm ${alert.type === 'overdue' ? 'text-red-700 font-medium' : 'text-slate-600'}`}>{alert.message}</p>
                                <p className="text-xs text-slate-400 mt-1">{alert.time}</p>
                             </div>
                          </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={onAddTask}
            className="bg-slate-900 text-white px-5 py-2 rounded-xl font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-200"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>
      </header>

      {/* Hero Section - Full Width */}
      <section>
        {tasks.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
            <div className="relative z-10 max-w-lg mx-auto">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <Sparkles size={40} />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-3">Welcome to ScholarSync!</h2>
                <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                    Your academic command center is ready. Add your assignments, exams, and study goals to start tracking your progress.
                </p>
                <button 
                    onClick={onAddTask} 
                    className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-xl shadow-blue-200 flex items-center gap-2 mx-auto"
                >
                    <Plus size={20} /> Create Your First Task
                </button>
            </div>
            
            {/* Background Decorations */}
            <div className="absolute top-10 left-10 opacity-10 rotate-12">
                <BookOpen size={100} />
            </div>
            <div className="absolute bottom-10 right-10 opacity-10 -rotate-12">
                <TrendingUp size={100} />
            </div>
          </div>
        ) : nextTask ? (
          // Active Task Hero
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                        nextTask.priority === 'High' ? 'bg-red-500/20 border-red-500/30 text-red-200' : 
                        nextTask.priority === 'Medium' ? 'bg-blue-500/20 border-blue-500/30 text-blue-200' :
                        'bg-slate-500/20 border-slate-500/30 text-slate-200'
                    }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${nextTask.priority === 'High' ? 'bg-red-400' : 'bg-blue-400'}`}></div>
                        {nextTask.priority} Priority
                    </span>
                    <span className="text-slate-400 text-sm font-medium tracking-wide uppercase">{nextTask.course}</span>
                </div>
                
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2">{nextTask.title}</h2>
                  <p className="text-slate-300 text-lg line-clamp-2">
                    {nextTask.description || `Upcoming task for ${nextTask.course}. Stay focused and keep up the good work!`}
                  </p>
                </div>
                
                <div className="pt-2">
                    <button 
                    onClick={() => startFocusSession(nextTask.title)}
                    className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-lg flex items-center gap-2"
                    >
                    <Play size={18} fill="currentColor" />
                    Start Session
                    </button>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 min-w-[160px] text-center border border-white/10 flex-shrink-0">
                <span className="block text-xs text-slate-300 uppercase tracking-wider mb-2 font-bold">Due Date</span>
                <span className="block text-2xl font-bold mb-1">
                    {new Date(nextTask.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <div className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded font-bold ${
                    calculateTimeLeft(nextTask.dueDate).includes('Overdue') ? 'bg-red-500 text-white' : 'bg-emerald-500/20 text-emerald-100'
                }`}>
                  <Clock size={12} />
                  <span>{calculateTimeLeft(nextTask.dueDate)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // All Done State
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-10 text-white text-center shadow-xl">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <CheckCircle2 size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">All Caught Up!</h2>
            <p className="text-emerald-100 text-lg mb-8">You have no pending tasks. Great job staying organized!</p>
            <button 
                onClick={onAddTask}
                className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg"
            >
                Plan Ahead
            </button>
          </div>
        )}
      </section>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <TrendingUp size={20} className="text-blue-500"/>
                    Activity Overview
                </h3>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                {['Daily', 'Weekly', 'Monthly'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setActiveTimeframe(tf)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                      activeTimeframe === tf 
                        ? 'bg-white text-slate-800 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 w-full mt-auto">
              {chartData.every(d => d.hours === 0) ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <BarChart size={32} className="mb-2 opacity-50" />
                      <p className="text-sm">No activity recorded for this period.</p>
                      <p className="text-xs mt-1">Complete tasks to see your progress!</p>
                  </div>
              ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barSize={40}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                      />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                      />
                      <Bar dataKey="hours" radius={[8, 8, 8, 8]}>
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={activeTimeframe === 'Weekly' && index === 3 ? '#3b82f6' : '#cbd5e1'} 
                            className="transition-all duration-300 hover:opacity-80"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
              )}
            </div>
        </div>

        {/* Upcoming Tasks List */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <List size={20} className="text-indigo-500" />
                Up Next
              </h3>
              <button 
                onClick={() => onNavigate(NavView.TASKS)}
                className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
              >
                View All
              </button>
            </div>

            <div className="flex-1 space-y-4">
              {upcomingTasks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 min-h-[200px]">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                        <Calendar size={20} className="text-slate-300" />
                    </div>
                    <p className="text-slate-400 text-sm">No upcoming tasks.</p>
                </div>
              ) : (
                upcomingTasks.map((task, index) => (
                    <div key={task.id} className="group relative pl-4 transition-all hover:bg-slate-50 rounded-xl p-2 -ml-2 cursor-pointer" onClick={() => onNavigate(NavView.TASKS)}>
                        <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${index === 0 ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
                        
                        <div className="flex justify-between items-start mb-1">
                            <h4 className={`font-bold text-sm ${task.status === 'Done' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task.title}</h4>
                            {index === 0 && <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-1.5 py-0.5 rounded">SOON</span>}
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                             <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">{task.course}</span>
                             <span className={`text-[10px] font-bold ${
                                 calculateTimeLeft(task.dueDate) === 'Overdue' ? 'text-red-500' : 'text-slate-400'
                             }`}>
                                {new Date(task.dueDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                             </span>
                        </div>
                    </div>
                ))
              )}
            </div>
            
            {upcomingTasks.length > 0 && (
                <button 
                  onClick={onAddTask}
                  className="w-full mt-4 py-2 border border-dashed border-slate-300 rounded-xl text-slate-500 text-xs font-bold hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={14} /> Add New Task
                </button>
            )}
        </div>

      </div>
    </div>
  );
};