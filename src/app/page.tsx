"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { useGlobalState } from "@/store/GlobalStateContext";
import { BookOpen, MessageCircle, BarChart2, Mic, PenLine, Timer, Zap, LayoutTemplate, CheckCircle2, ChevronRight, Sparkles, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

const MOCK_CHART_DATA = [
  { date: 'Mon', speaking: 4, writing: 5 },
  { date: 'Tue', speaking: 5, writing: 4 },
  { date: 'Wed', speaking: 5, writing: 5 },
  { date: 'Thu', speaking: 6, writing: 6 },
  { date: 'Fri', speaking: 5, writing: 7 },
  { date: 'Sat', speaking: 7, writing: 6 },
  { date: 'Sun', speaking: 8, writing: 7 },
];

function GradientCard({ 
  title, 
  desc, 
  icon, 
  href, 
  gradientFrom, 
  gradientTo 
}: { 
  title: string, 
  desc: string, 
  icon: ReactNode, 
  href: string, 
  gradientFrom: string, 
  gradientTo: string 
}) {
  return (
    <Link 
      href={href}
      className={`group ${gradientFrom} ${gradientTo} bg-gradient-to-br p-6 rounded-[20px] transition-all duration-200 hover:-translate-y-1 shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center gap-4 relative overflow-hidden text-white`}
    >
      <div className="absolute inset-0 bg-black/0 group-hover:bg-white/10 transition-colors"></div>
      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm shadow-inner rounded-full flex items-center justify-center relative z-10 transition-transform group-hover:scale-110">
         {icon}
      </div>
      <div className="text-center relative z-10">
         <h3 className="text-2xl font-black mb-1 drop-shadow-sm">{title}</h3>
         <p className="text-sm font-bold text-white/90">{desc}</p>
      </div>
    </Link>
  );
}

// Type for Daily Tasks
type DailyTask = {
  id: number;
  title: string;
  type: string;
  completed: boolean;
  actionUrl: string;
};

export default function Dashboard() {
  const { progress, isHydrated } = useGlobalState();
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  
  // Daily Plan State
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);

  useEffect(() => {
    const examDate = new Date("2026-04-15T00:00:00+07:00");
    const today = new Date();
    
    // Calculate difference in milliseconds
    const diffTime = examDate.getTime() - today.getTime();
    
    // If it's already past the exam
    if (diffTime < 0) {
      setDaysLeft(0);
    } else {
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysLeft(diffDays);
    }
  }, []);

  // Fetch Daily Tasks
  useEffect(() => {
    async function fetchDailyPlan() {
      try {
        const res = await fetch("/api/generate-daily-plan");
        if (res.ok) {
          const data = await res.json();
          if (data.plan && data.plan.tasks) {
            setDailyTasks(data.plan.tasks);
          }
        }
      } catch (err) {
        console.error("Failed to load daily plan:", err);
      } finally {
        setIsLoadingTasks(false);
      }
    }
    fetchDailyPlan();
  }, []);

  const toggleTask = async (taskId: number, currentStatus: boolean) => {
    // Optimistic UI update
    setDailyTasks(prev => 
      prev.map(t => t.id === taskId ? { ...t, completed: !currentStatus } : t)
    );
    
    // Background API call
    try {
      await fetch(`/api/daily-tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentStatus })
      });
    } catch (err) {
      console.error("Failed to update task", err);
      // Revert if failed (simplistic approach)
      setDailyTasks(prev => 
        prev.map(t => t.id === taskId ? { ...t, completed: currentStatus } : t)
      );
    }
  };

  const completedTasksCount = dailyTasks.filter(t => t.completed).length;
  const isDailyGoalMet = dailyTasks.length > 0 && completedTasksCount === dailyTasks.length;

  if (!isHydrated) return (
    <div className="flex items-center justify-center h-screen bg-background">
       <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 md:p-8 font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">VSTEP AI Pro</h1>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-0 space-y-8">
        {/* Countdown Banner */}
        <div className="pt-4 md:pt-0">
          <div className="w-full bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-[2.5rem] shadow-xl flex flex-col md:flex-row items-center gap-6 text-white relative overflow-hidden">
             <div className="absolute -right-10 -top-10 text-white/5 rotate-12">
               <Timer className="w-64 h-64" />
             </div>
             
             <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 shrink-0 z-10 relative">
                <Timer className="w-10 h-10 text-white animate-pulse" />
             </div>
             
             <div className="text-center md:text-left z-10 relative">
                <div className="text-red-400 font-bold tracking-widest uppercase mb-1 drop-shadow-sm">VSTEP EXAM (APR 15)</div>
                <div className="text-5xl font-black drop-shadow-md text-white">
                   {daysLeft !== null ? daysLeft : "..."} <span className="text-2xl font-bold text-gray-300">days left</span>
                </div>
             </div>
          </div>
        </div>

        {/* AI Daily Study Plan */}
        <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-sm">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-purple-600" />
                Daily Study Plan
              </h2>
              {!isLoadingTasks && dailyTasks.length > 0 && (
                <div className="px-4 py-1.5 rounded-full font-bold text-sm bg-[#6366F1]/10 text-[#6366F1]">
                  {completedTasksCount} / {dailyTasks.length} tasks completed
                </div>
              )}
           </div>

           {isLoadingTasks ? (
             <div className="flex flex-col items-center justify-center py-10 text-gray-400">
               <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-3" />
               <p className="font-medium animate-pulse">AI is generating your tailored daily schedule...</p>
             </div>
           ) : isDailyGoalMet ? (
             <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-3xl text-white text-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
                   <CheckCircle2 className="w-48 h-48 opacity-20" />
                </div>
                <div className="relative z-10 flex flex-col items-center gap-3">
                   <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-4xl shadow-inner mb-2">🎉</div>
                   <h3 className="text-3xl font-black drop-shadow-md">Daily goal completed!</h3>
                   <p className="text-emerald-50 font-medium">You've successfully finished all of your structured B1 tasks today. Amazing consistency!</p>
                </div>
             </div>
           ) : dailyTasks.length > 0 ? (
             <div className="space-y-3">
                {dailyTasks.map(task => (
                  <div 
                    key={task.id}
                    className={`flex items-center justify-between p-4 rounded-[16px] border transition-all duration-200 ${
                      task.completed 
                        ? 'bg-gray-50 border-gray-100' 
                        : 'bg-white border-gray-100 hover:border-[#A855F7]/30 hover:shadow-md hover:-translate-y-[2px] cursor-pointer group'
                    }`}
                    onClick={() => !task.completed}
                  >
                     <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={(e) => { e.stopPropagation(); toggleTask(task.id, task.completed); }}>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${
                          task.completed 
                            ? 'bg-[#10B981] border-[#10B981] text-white scale-110' 
                            : 'border-gray-300 group-hover:border-[#A855F7] group-hover:scale-110'
                        }`}>
                           {task.completed && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <span className={`font-semibold text-[15px] md:text-base ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                           {task.title}
                        </span>
                     </div>
                     
                     <Link 
                       href={task.actionUrl} 
                       className={`flex items-center gap-1 font-bold text-sm px-4 py-2 rounded-xl transition-all duration-200 shrink-0 ${
                         task.completed 
                           ? 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600' 
                           : 'bg-[#8B5CF6]/10 text-[#8B5CF6] hover:bg-[#8B5CF6]/20 group-hover:bg-[#8B5CF6] group-hover:text-white group-hover:scale-105'
                       }`}
                     >
                        {task.completed ? "Review" : "Start"} <ChevronRight className="w-4 h-4" />
                     </Link>
                  </div>
                ))}
             </div>
           ) : (
             <div className="text-center py-8 text-slate-500">
               Something went wrong. Could not load daily tasks.
             </div>
           )}
        </div>

        {/* Main Colorful Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <GradientCard 
             title="Speaking" 
             desc="Part 1, 2 & 3 AI Trainer" 
             icon={<Mic className="w-8 h-8" />} 
             href="/speaking" 
             gradientFrom="from-[#3B82F6]" 
             gradientTo="to-[#6366F1]" 
           />
           <GradientCard 
             title="Writing" 
             desc="Formal & Informal Letters" 
             icon={<PenLine className="w-8 h-8" />} 
             href="/writing" 
             gradientFrom="from-[#8B5CF6]" 
             gradientTo="to-[#A855F7]" 
           />
           <GradientCard 
             title="Vocabulary" 
             desc="All 14 VSTEP Topics" 
             icon={<BookOpen className="w-8 h-8" />} 
             href="/vocabulary" 
             gradientFrom="from-[#F97316]" 
             gradientTo="to-[#FB923C]" 
           />
           <GradientCard 
             title="Mock Test" 
             desc="Full 12-Min Simulation" 
             icon={<Timer className="w-8 h-8" />} 
             href="/exam-simulation" 
             gradientFrom="from-[#EF4444]" 
             gradientTo="to-[#F87171]" 
           />
           <GradientCard 
             title="Memorize" 
             desc="VSTEP B1 Core Structures" 
             icon={<LayoutTemplate className="w-8 h-8" />} 
             href="/memorize" 
             gradientFrom="from-[#10B981]" 
             gradientTo="to-[#34D399]" 
           />
           <GradientCard 
             title="Progress" 
             desc="Analytics & Feedback" 
             icon={<BarChart2 className="w-8 h-8" />} 
             href="#progress"  // Anchor or route
             gradientFrom="from-[#F59E0B]" 
             gradientTo="to-[#FBBF24]" 
           />
        </div>

        {/* Analytics Section placed at bottom */}
        <div className="bg-white border border-gray-100 rounded-[20px] p-6 md:p-8 mt-12 shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-transform duration-300">
           <h3 className="font-black text-gray-800 text-2xl mb-1 flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-orange-100 text-[#F59E0B] flex items-center justify-center shrink-0">
                <BarChart2 className="w-5 h-5" />
             </div>
             Recent Performance
           </h3>
           <p className="text-gray-500 mb-8 ml-14 font-medium">Latest practice results</p>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:ml-14">
             {/* Speaking Column */}
             <div className="bg-gray-50/50 p-6 rounded-[16px] border border-gray-100">
               <h4 className="font-black text-lg text-gray-700 mb-5 flex items-center gap-2"><Mic className="w-5 h-5 text-[#3B82F6]"/> Speaking</h4>
               <div className="space-y-4">
                 <div className="flex items-center justify-between">
                   <span className="text-gray-600 font-bold">Part 1</span>
                   <span className="font-black text-[#3B82F6] bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">{progress.speakingPart1?.toFixed(1) || "0.0"}</span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-gray-600 font-bold">Part 2</span>
                   <span className="font-black text-[#3B82F6] bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">{progress.speakingPart2?.toFixed(1) || "0.0"}</span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-gray-600 font-bold">Part 3</span>
                   <span className="font-black text-[#3B82F6] bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">{progress.speakingPart3?.toFixed(1) || "0.0"}</span>
                 </div>
               </div>
             </div>

             {/* Writing Column */}
             <div className="bg-gray-50/50 p-6 rounded-[16px] border border-gray-100">
               <h4 className="font-black text-lg text-gray-700 mb-5 flex items-center gap-2"><PenLine className="w-5 h-5 text-[#8B5CF6]"/> Writing</h4>
               <div className="space-y-4">
                 
                 <div className="flex items-center justify-between">
                   <span className="text-gray-600 font-bold">Task 1</span>
                   <span className="font-black text-[#8B5CF6] bg-purple-50 px-3 py-1 rounded-lg border border-purple-100">{progress.writingTask1?.toFixed(1) || "0.0"}</span>
                 </div>
                 
                 <div className="flex items-center justify-between">
                   <span className="text-gray-600 font-bold">Task 2</span>
                   <span className="font-black text-[#8B5CF6] bg-purple-50 px-3 py-1 rounded-lg border border-purple-100">{progress.writingTask2?.toFixed(1) || "0.0"}</span>
                 </div>

               </div>
             </div>
           </div>

           <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
             <Link href="/insights" className="text-[#F59E0B] hover:text-[#FBBF24] font-black flex items-center gap-2 transition-colors group">
               View detailed analytics <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </Link>
           </div>
        </div>

      </div>
    </div>
  );
}
