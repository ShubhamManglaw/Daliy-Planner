import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { WeeklyPlan } from './components/WeeklyPlan';
import { TaskBoard } from './components/TaskBoard';
import { Settings } from './components/Settings';
import { MonthlyView } from './components/MonthlyView';
import { Login } from './components/Login';
import { NavView, Task } from './types';
import { PlannerProvider, usePlanner } from './contexts/PlannerContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TaskModal } from './components/TaskModal';
import { Menu, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<NavView>(NavView.DASHBOARD);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Partial<Task> | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  if (!user) {
    return <Login />;
  }

  return (
    <PlannerProvider>
      <AuthenticatedLayout 
        currentView={currentView}
        setCurrentView={setCurrentView}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        taskToEdit={taskToEdit}
        setTaskToEdit={setTaskToEdit}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </PlannerProvider>
  );
};

const AuthenticatedLayout: React.FC<{
  currentView: NavView;
  setCurrentView: (v: NavView) => void;
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
  taskToEdit: Partial<Task> | null;
  setTaskToEdit: (t: Partial<Task> | null) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (v: boolean) => void;
}> = ({ currentView, setCurrentView, isModalOpen, setIsModalOpen, taskToEdit, setTaskToEdit, isSidebarOpen, setIsSidebarOpen }) => {
  
  const { addTask, updateTask, categories } = usePlanner();

  const handleOpenNewTask = (overrides?: Partial<Task>) => {
    setTaskToEdit(overrides || null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id'> | Task) => {
    if ('id' in taskData && taskData.id) {
      updateTask(taskData as Task);
    } else {
      addTask(taskData);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case NavView.DASHBOARD:
        return <Dashboard onAddTask={() => handleOpenNewTask()} onNavigate={setCurrentView} />;
      case NavView.WEEKLY:
        return <WeeklyPlan onAddTask={handleOpenNewTask} onEditTask={handleEditTask} />;
      case NavView.TASKS:
        return <TaskBoard onEditTask={handleEditTask} onAddTask={handleOpenNewTask} />;
      case NavView.SETTINGS:
        return <Settings />;
      case NavView.MONTHLY:
        return <MonthlyView onAddTask={handleOpenNewTask} onEditTask={handleEditTask} />;
      default:
        return <Dashboard onAddTask={() => handleOpenNewTask()} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        onAddNew={() => handleOpenNewTask()}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-screen md:ml-64 transition-all duration-300">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
             <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                    <Sparkles size={16} className="text-white" />
                 </div>
                 <span className="font-bold text-slate-800">ScholarSync</span>
             </div>
             <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
             >
                <Menu size={24} />
             </button>
        </header>

        {/* Main Content Scroll Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth">
            {renderContent()}
        </main>
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={taskToEdit}
        categories={categories}
      />
    </div>
  );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;