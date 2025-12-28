import React from 'react';
import { Award, Code2, Database, TrendingUp, Calendar, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const YearlyProgress: React.FC = () => {
  const credits = 52;
  const totalCredits = 120;
  
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
               Yearly Overview <span className="text-slate-300 cursor-pointer text-xl">✎</span>
            </h1>
            <p className="text-slate-500 mt-1">Track your milestones for Academic Year 2023 - 2024</p>
         </div>
         <div className="flex gap-3">
             <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-slate-600 font-medium text-sm flex items-center gap-2">
               <Calendar size={16} /> May 24, 2024
             </button>
             <span className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border border-green-100">
               <div className="w-2 h-2 rounded-full bg-green-500"></div> Spring Semester Active
             </span>
         </div>
      </div>

      {/* Main Trajectory Card */}
      <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
         <div className="flex justify-between items-end mb-4">
            <div>
               <h2 className="text-xl font-bold text-slate-800">Degree Trajectory</h2>
               <p className="text-sm text-slate-500">Bachelor of Computer Science (4 Years)</p>
            </div>
            <div className="text-right">
               <span className="text-4xl font-bold text-blue-600">42%</span>
               <span className="text-slate-400 font-medium ml-2">Complete</span>
            </div>
         </div>
         
         <div className="relative pt-6 pb-2">
            <div className="flex justify-between text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 px-1">
               <span>Year 1</span>
               <span>Year 2</span>
               <span className="text-slate-300">Year 3</span>
               <span className="text-slate-300">Year 4</span>
            </div>
            <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden flex">
               <div className="w-[25%] bg-blue-500 h-full border-r border-white/20"></div>
               <div className="w-[17%] bg-blue-400 h-full border-r border-white/20"></div>
               <div className="w-[25%] bg-slate-100 h-full border-r border-white"></div>
               <div className="w-[33%] bg-slate-100 h-full"></div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {/* Credits Card */}
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
               <Award size={80} className="text-blue-500" />
            </div>
            <div className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded w-fit mb-4">
               +12 this sem
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Credits Earned</p>
            <div className="flex items-baseline gap-2">
               <span className="text-4xl font-bold text-slate-800">{credits}</span>
               <span className="text-slate-400">/ {totalCredits}</span>
            </div>
         </div>

         {/* GPA Card */}
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
               <TrendingUp size={80} className="text-orange-500" />
            </div>
             <div className="bg-orange-50 text-orange-700 text-xs font-bold px-2 py-1 rounded w-fit mb-4">
               Top 10%
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current GPA</p>
            <div className="flex items-baseline gap-2">
               <span className="text-4xl font-bold text-slate-800">3.8</span>
               <span className="text-slate-400">/ 4.0</span>
            </div>
         </div>

         {/* Focus Areas */}
         <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-xl shadow-blue-200">
            <h3 className="font-bold text-lg mb-1">Focus Areas</h3>
            <p className="text-blue-200 text-xs mb-6">Time distribution this year</p>
            
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                     <span>Computer Science</span>
                     <span>60%</span>
                  </div>
                  <div className="w-full bg-blue-900/30 rounded-full h-1.5">
                     <div className="bg-white h-full rounded-full w-[60%]"></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                     <span>Mathematics</span>
                     <span>25%</span>
                  </div>
                  <div className="w-full bg-blue-900/30 rounded-full h-1.5">
                     <div className="bg-white h-full rounded-full w-[25%]"></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                     <span>Electives</span>
                     <span>15%</span>
                  </div>
                  <div className="w-full bg-blue-900/30 rounded-full h-1.5">
                     <div className="bg-white h-full rounded-full w-[15%]"></div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
         <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-800 text-lg">Academic Timeline</h3>
            <div className="flex gap-2">
               <span className="text-xs text-slate-400 font-medium self-center mr-2">Sort by:</span>
               <button className="bg-slate-50 px-3 py-1 rounded text-xs font-bold text-slate-700">Newest First</button>
            </div>
         </div>

         <div className="relative border-l-2 border-slate-100 ml-4 space-y-12">
            
            {/* Semester 2 */}
            <div className="relative pl-8">
               <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm"></div>
               <div className="flex justify-between items-start mb-6">
                  <div>
                     <h4 className="font-bold text-slate-800 text-lg">Semester 2 (Spring)</h4>
                     <p className="text-sm text-slate-500">Jan 2024 - May 2024</p>
                  </div>
                  <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">IN PROGRESS</span>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-4 group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                     <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                        <Code2 size={20} />
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between mb-1">
                           <span className="font-bold text-slate-700 text-sm">Algorithms</span>
                           <span className="font-bold text-indigo-600 text-sm">70%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                           <div className="bg-indigo-500 h-full w-[70%]"></div>
                        </div>
                     </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-4 group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                     <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center">
                        <Database size={20} />
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between mb-1">
                           <span className="font-bold text-slate-700 text-sm">Databases</span>
                           <span className="font-bold text-rose-600 text-sm">45%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                           <div className="bg-rose-500 h-full w-[45%]"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Semester 1 */}
            <div className="relative pl-8 opacity-70 hover:opacity-100 transition-opacity">
               <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300 border-4 border-white"></div>
               <div className="mb-6">
                  <h4 className="font-bold text-slate-800 text-lg">Semester 1 (Fall)</h4>
                  <p className="text-sm text-slate-500">Sep 2023 - Dec 2023</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-slate-200 p-4 rounded-xl flex justify-between items-center">
                     <div>
                        <div className="w-1 h-8 bg-green-500 rounded-full absolute left-0 top-0"></div>
                        <h5 className="font-bold text-slate-700 text-sm">Data Structures</h5>
                        <p className="text-xs text-slate-400">CS 201</p>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">A</div>
                  </div>
                   <div className="bg-white border border-slate-200 p-4 rounded-xl flex justify-between items-center">
                     <div>
                        <h5 className="font-bold text-slate-700 text-sm">Linear Algebra</h5>
                        <p className="text-xs text-slate-400">MATH 201</p>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold text-sm">A-</div>
                  </div>
               </div>
            </div>

         </div>
      </div>

    </div>
  );
};