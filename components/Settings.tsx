import React, { useState } from 'react';
import { usePlanner } from '../contexts/PlannerContext';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Trash2, Tag, Book, User as UserIcon, Shield, Database, LogOut, Monitor, Bell } from 'lucide-react';

export const Settings: React.FC = () => {
  const { categories, addCategory, removeCategory, clearAllData } = usePlanner();
  const { user, logout } = useAuth();
  const [newCat, setNewCat] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCat.trim()) {
      addCategory(newCat.trim());
      setNewCat('');
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Settings</h1>
        <p className="text-slate-500">Manage your account, preferences, and data.</p>
      </div>

      {/* Profile Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
         <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-3 text-slate-800 font-bold text-lg">
                <UserIcon size={20} className="text-indigo-500" />
                <h2>Profile Information</h2>
            </div>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded border border-indigo-200">Google Account</span>
         </div>
         <div className="p-8 flex flex-col md:flex-row gap-8 items-start">
            <div className="relative">
                <img 
                    src={user?.avatar} 
                    alt={user?.name} 
                    className="w-24 h-24 rounded-full border-4 border-slate-50 shadow-md"
                />
            </div>
            <div className="flex-1 space-y-4 max-w-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Display Name</label>
                        <div className="text-slate-800 font-medium border-b border-slate-200 pb-2">{user?.name}</div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Email Address</label>
                        <div className="text-slate-800 font-medium border-b border-slate-200 pb-2">{user?.email}</div>
                    </div>
                </div>
                <div className="pt-2">
                    <button 
                        onClick={logout} 
                        className="text-red-500 text-sm font-medium hover:text-red-600 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </div>
         </div>
      </section>

      {/* Categories Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
            <Book size={20} className="text-blue-500" />
            <h2>Course Categories</h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">Define the subjects or courses you want to tag your tasks with.</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleAdd} className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                placeholder="Enter new category name (e.g., Physics 101)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus size={18} /> Add
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <div key={cat} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all group bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white text-slate-500 flex items-center justify-center font-bold text-xs group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors shadow-sm border border-slate-100">
                    {cat.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="font-medium text-slate-700 truncate">{cat}</span>
                </div>
                <button 
                  onClick={() => removeCategory(cat)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove category"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          
          {categories.length === 0 && (
            <div className="text-center py-12 rounded-xl border-2 border-dashed border-slate-200">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                    <Book size={24} />
                </div>
              <p className="text-slate-500 font-medium">No courses added yet.</p>
              <p className="text-slate-400 text-sm">Add your subjects above to start organizing tasks.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* App Preferences */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
         <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                <Monitor size={20} className="text-emerald-500" />
                <h2>Preferences</h2>
            </div>
         </div>
         <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <Bell size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-700">Notifications</h3>
                        <p className="text-sm text-slate-500">Get alerts for upcoming assignments and exams</p>
                    </div>
                </div>
                <div className="relative inline-block w-12 h-6 transition-colors duration-200 ease-in-out border-2 border-transparent rounded-full cursor-pointer bg-slate-200">
                     <span className="translate-x-0 inline-block w-5 h-5 transition duration-200 ease-in-out transform bg-white rounded-full shadow pointer-events-none ring-0"></span>
                </div>
            </div>
         </div>
      </section>

      {/* Danger Zone */}
      <section className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
         <div className="p-6 border-b border-red-50 bg-red-50/30">
            <div className="flex items-center gap-2 text-red-700 font-bold text-lg">
                <Database size={20} />
                <h2>Data Management</h2>
            </div>
         </div>
         <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 rounded-xl border border-red-100 bg-red-50/10">
                <div>
                    <h3 className="font-bold text-slate-800">Clear All Data</h3>
                    <p className="text-sm text-slate-500">Permanently delete all tasks, categories, and progress history.</p>
                </div>
                <button 
                    onClick={clearAllData}
                    className="whitespace-nowrap px-4 py-2 bg-white border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"
                >
                    Reset Everything
                </button>
            </div>
         </div>
      </section>

    </div>
  );
};