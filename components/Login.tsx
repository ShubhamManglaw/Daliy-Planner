import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, CheckCircle2 } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full relative z-10 border border-slate-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
            <BookOpen className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">ScholarSync</h1>
          <p className="text-slate-500">Your personal academic planner.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
             <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                <span>Track assignments & due dates</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                <span>Manage weekly schedules</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                <span>Private data for every student</span>
             </div>
          </div>

          <button 
            onClick={login}
            className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:shadow-md group"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
            <span>Continue with Google</span>
          </button>
          
          <p className="text-xs text-center text-slate-400 mt-6">
            By clicking continue, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
      
      <div className="mt-8 text-slate-400 text-sm">
        © 2024 ScholarSync. Built for students.
      </div>
    </div>
  );
};