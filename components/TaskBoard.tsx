import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, MoreHorizontal, Plus, Calendar, Paperclip, CheckSquare, Clock, FileText, Pencil, Trash2, Check, X, AlertTriangle, GripVertical } from 'lucide-react';
import { usePlanner } from '../contexts/PlannerContext';
import { Task, Status } from '../types';

interface TaskBoardProps {
    onEditTask: (task: Task) => void;
    onAddTask: (overrides?: Partial<Task>) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ onEditTask, onAddTask }) => {
  const { tasks, deleteTask, updateTask } = usePlanner();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState('');
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(filter.toLowerCase()) || t.course.toLowerCase().includes(filter.toLowerCase()));

  const initiateDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setTaskToDelete(id);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
        deleteTask(taskToDelete);
        if (selectedTask?.id === taskToDelete) {
            setSelectedTask(null);
        }
        setTaskToDelete(null);
    }
  };
  
  const handleToggleStatus = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    const toggleStatus = task.status === 'Done' ? 'To Do' : 'Done';
    updateTask({ ...task, status: toggleStatus });
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Helper to render a column of tasks
  const renderColumn = (title: string, columnTasks: Task[], color: string, status: Status) => (
    <div className="flex-1 min-w-[300px] flex flex-col h-full bg-slate-50/50 rounded-2xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${color} shadow-sm`}></div>
          <h3 className="font-bold text-slate-700">{title}</h3>
          <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full font-bold">{columnTasks.length}</span>
        </div>
        <button 
            onClick={() => onAddTask({ status })}
            className="text-slate-400 hover:text-blue-600 transition-colors p-1.5 hover:bg-slate-100 rounded-lg"
            title={`Add to ${title}`}
        >
            <Plus size={18} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {columnTasks.length === 0 ? (
            <div className="h-32 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl m-2">
                <p className="text-sm font-medium">No tasks</p>
                <button onClick={() => onAddTask({ status })} className="text-xs text-blue-500 font-bold mt-1 hover:underline">Add one</button>
            </div>
        ) : (
            columnTasks.map(task => (
            <div 
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`bg-white p-4 rounded-xl border shadow-sm cursor-pointer transition-all hover:shadow-md group relative ${selectedTask?.id === task.id ? 'ring-2 ring-blue-500 border-transparent' : 'border-slate-200'}`}
            >
                <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                        </span>
                        <span className="bg-slate-50 text-slate-500 border border-slate-100 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                            {task.course}
                        </span>
                    </div>
                    {/* Delete Button */}
                    <button 
                    onClick={(e) => initiateDelete(e, task.id)}
                    className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-all p-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete Task"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
                
                <div className="flex items-start gap-3 mt-3">
                    {/* Interactive Checkbox */}
                    <div 
                        onClick={(e) => handleToggleStatus(e, task)}
                        className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer hover:scale-110 transition-all flex-shrink-0 ${
                        task.status === 'Done' 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-slate-300 hover:border-blue-400 bg-white'
                        }`}
                    >
                        {task.status === 'Done' && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                    <h4 className={`font-bold text-slate-800 text-sm leading-tight ${task.status === 'Done' ? 'text-slate-400 line-through' : ''}`}>{task.title}</h4>
                </div>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50 ml-8">
                <div className={`flex items-center gap-1 text-xs text-slate-400`}>
                    <Calendar size={12} />
                    <span>{task.dueDate}</span>
                </div>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-full w-full overflow-hidden relative">
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

      {/* Main Board Area */}
      <div className="flex-1 flex flex-col p-4 md:p-8 overflow-hidden h-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-1">Task Board</h1>
                <p className="text-slate-500">Manage your workflow efficiently.</p>
            </div>
            
            {/* Toolbar */}
            <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                    type="text" 
                    placeholder="Search tasks..." 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm"
                    />
                </div>
                <button className="flex items-center justify-center gap-2 p-2 md:px-4 md:py-2 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 text-sm">
                    <Filter size={18} /> <span className="hidden md:inline">Filter</span>
                </button>
            </div>
        </div>

        {/* Board Columns Container */}
        <div className="flex gap-6 overflow-x-auto pb-4 flex-1 items-start snap-x">
          {renderColumn("To Do", filteredTasks.filter(t => t.status === 'To Do'), "bg-slate-300", "To Do")}
          {renderColumn("In Progress", filteredTasks.filter(t => t.status === 'In Progress'), "bg-blue-500", "In Progress")}
          {renderColumn("Done", filteredTasks.filter(t => t.status === 'Done'), "bg-green-500", "Done")}
        </div>
      </div>

      {/* Right Detail Panel */}
      {selectedTask && (
        <div className="w-full md:w-[400px] bg-white border-l border-slate-200 p-8 overflow-y-auto absolute md:static inset-0 z-20 md:z-auto shadow-2xl md:shadow-none animate-in slide-in-from-right duration-300">
           <div className="flex justify-between items-start mb-8">
              <h2 className="font-bold text-xl text-slate-800">Task Details</h2>
              <div className="flex gap-2">
                <button onClick={() => onEditTask(selectedTask)} className="text-slate-400 hover:text-blue-600 p-2 hover:bg-slate-50 rounded-lg transition-colors" title="Edit Task">
                    <Pencil size={20} />
                </button>
                <button 
                    onClick={(e) => initiateDelete(e, selectedTask.id)} 
                    className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors" 
                    title="Delete Task"
                >
                    <Trash2 size={20} />
                </button>
                <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <X size={20} />
                </button>
              </div>
           </div>

           <div className="space-y-6">
              <div>
                 <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide mb-3 ${getPriorityColor(selectedTask.priority)}`}>
                    {selectedTask.priority} Priority
                 </span>
                 <h3 className="text-2xl font-bold text-slate-800 leading-snug mb-2">{selectedTask.title}</h3>
                 <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <span className="font-medium bg-slate-100 px-2 py-0.5 rounded text-xs">{selectedTask.course}</span>
                    <span>•</span>
                    <span className="text-xs">{selectedTask.status}</span>
                 </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 border border-slate-100">
                {selectedTask.description || <span className="text-slate-400 italic">No description provided.</span>}
              </div>

              <div className="grid grid-cols-1 gap-4">
                 <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-blue-200 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                        <Calendar size={20} />
                    </div>
                    <div>
                       <span className="block text-xs text-slate-400 uppercase font-bold">Due Date</span>
                       <span className="text-slate-700 font-bold">{selectedTask.dueDate}</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-blue-200 transition-colors">
                     <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
                        <Clock size={20} />
                    </div>
                    <div>
                       <span className="block text-xs text-slate-400 uppercase font-bold">Duration</span>
                       <span className="text-slate-700 font-bold">{selectedTask.duration || 60} minutes</span>
                    </div>
                 </div>
              </div>

              <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold shadow-lg shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                 <Clock size={20} />
                 Start Focus Session
              </button>
           </div>
        </div>
      )}
    </div>
  );
};