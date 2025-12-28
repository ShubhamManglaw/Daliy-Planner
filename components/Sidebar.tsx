import React from 'react';
import { NavView } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  CalendarDays, 
  CalendarRange, 
  CheckSquare, 
  Settings, 
  Plus,
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  currentView: NavView;
  onChangeView: (view: NavView) => void;
  onAddNew: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onAddNew, isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: NavView.DASHBOARD },
    { icon: CalendarRange, label: NavView.WEEKLY },
    { icon: CalendarDays, label: NavView.MONTHLY },
    { icon: CheckSquare, label: NavView.TASKS },
    { icon: Settings, label: NavView.SETTINGS },
  ];

  const handleNavClick = (view: NavView) => {
    onChangeView(view);
    onClose(); // Close sidebar on mobile when item clicked
  };

  const SidebarContent = () => (
    <>
        {/* Mobile Header with Close Button */}
        <div className="md:hidden flex justify-end p-4">
            <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
                <X size={24} />
            </button>
        </div>

        {/* User Profile */}
        <div className="p-6 flex items-center gap-3 mb-2">
            <div className="relative">
                <img 
                    src={user?.avatar || "https://ui-avatars.com/api/?name=User&background=random"} 
                    alt="User" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-100"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="overflow-hidden">
                <h3 className="font-bold text-slate-800 text-sm truncate">{user?.name || 'Student'}</h3>
                <p className="text-xs text-slate-500 truncate">{user?.email || 'Student Account'}</p>
            </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
            <button
                key={item.label}
                onClick={() => handleNavClick(item.label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentView === item.label
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
            >
                <item.icon size={20} />
                {item.label}
            </button>
            ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-100 mt-auto">
            <button 
                onClick={() => { onAddNew(); onClose(); }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors shadow-lg shadow-blue-200 active:scale-95 transform"
            >
                <Plus size={20} />
                <span>New Task</span>
            </button>
            
            <button 
                onClick={logout}
                className="w-full mt-4 flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors justify-center"
            >
                <LogOut size={18} />
                <span>Log Out</span>
            </button>
        </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-surface h-screen fixed left-0 top-0 border-r border-slate-200 flex-col z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
            className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={onClose}
        ></div>
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`md:hidden fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>
    </>
  );
};