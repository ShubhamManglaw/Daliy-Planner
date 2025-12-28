import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag, BookOpen, AlertCircle, Clock } from 'lucide-react';
import { Task, Priority, Status } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'> | Task) => void;
  initialTask?: Partial<Task> | null;
  categories: string[];
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, initialTask, categories }) => {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [status, setStatus] = useState<Status>('To Do');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState<number>(60);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTask?.title || '');
      setCourse(initialTask?.course || categories[0] || '');
      setDueDate(initialTask?.dueDate || new Date().toISOString().split('T')[0]);
      setPriority(initialTask?.priority || 'Medium');
      setStatus(initialTask?.status || 'To Do');
      setDescription(initialTask?.description || '');
      setDuration(initialTask?.duration || 60);
    }
  }, [initialTask, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !course) return;

    const taskData: any = {
      title: title.trim(),
      course,
      dueDate,
      priority,
      status,
      description: description.trim(),
      duration: Math.max(5, Number(duration)), // Ensure minimum 5 mins
      tags: [],
    };

    if (initialTask?.id) {
      taskData.id = initialTask.id;
      taskData.completedAt = initialTask.completedAt;
    }

    onSave(taskData);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  };

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-300"
        onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-800">{initialTask?.id ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Task Title <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete Lab Report"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                <BookOpen size={12} /> Category
              </label>
              <select 
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Calendar size={12} /> Due Date
              </label>
              <input 
                type="date" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Clock size={12} /> Duration (mins)
              </label>
              <input 
                type="number" 
                min="5"
                step="5"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                <AlertCircle size={12} /> Status
              </label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>

          <div>
             <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Flag size={12} /> Priority
              </label>
              <div className="flex bg-slate-100 rounded-lg p-1">
                {(['Low', 'Medium', 'High'] as Priority[]).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${
                      priority === p 
                        ? p === 'High' ? 'bg-red-500 text-white shadow-sm' : p === 'Medium' ? 'bg-blue-500 text-white shadow-sm' : 'bg-slate-500 text-white shadow-sm'
                        : 'text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add details..."
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
            />
          </div>
        </form>

        <div className="flex gap-3 p-6 border-t border-slate-100 flex-shrink-0 bg-white">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors"
            >
              {initialTask?.id ? 'Save Changes' : 'Create Task'}
            </button>
        </div>
      </div>
    </div>
  );
};