"use client";

import Link from "next/link";
import { ArrowLeft, TrendingUp, Mic, PenLine, Target } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useGlobalState } from "@/store/GlobalStateContext";



export default function VstepInsightsPage() {
  const { progress, isHydrated } = useGlobalState();
  const chartData = progress?.scoreHistory?.length > 0 ? progress.scoreHistory : [{ date: 'Today', speaking: 0, writing: 0 }];

  if (!isHydrated) return <div className="p-8 text-center text-gray-500 font-bold bg-gray-50 min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-10">
      <div className="bg-white p-4 flex items-center justify-between border-b border-gray-100 shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2 text-[#F59E0B] font-black text-lg">
             <TrendingUp className="w-5 h-5" /> VSTEP Progress & Analytics
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8">
        
        {/* Top Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-transform duration-300 flex flex-col items-center justify-center group overflow-hidden relative">
             <div className="absolute inset-0 bg-blue-50/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
             <div className="w-14 h-14 bg-[#3B82F6]/10 rounded-full flex items-center justify-center mb-4 relative z-10">
               <Mic className="w-6 h-6 text-[#3B82F6]" />
             </div>
             <div className="text-sm font-black text-gray-500 uppercase tracking-wider mb-2 relative z-10">Avg Speaking</div>
             <div className="text-5xl font-black text-gray-800 relative z-10">{progress.speakingScore || 0}<span className="text-xl text-gray-400">/10</span></div>
             <div className="text-xs text-[#10B981] font-bold mt-4 bg-[#10B981]/10 px-3 py-1.5 rounded-lg border border-[#10B981]/20 relative z-10">B1 Pass Target: 5.0</div>
           </div>
           
           <div className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-transform duration-300 flex flex-col items-center justify-center group overflow-hidden relative">
             <div className="absolute inset-0 bg-purple-50/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
             <div className="w-14 h-14 bg-[#8B5CF6]/10 rounded-full flex items-center justify-center mb-4 relative z-10">
               <PenLine className="w-6 h-6 text-[#8B5CF6]" />
             </div>
             <div className="text-sm font-black text-gray-500 uppercase tracking-wider mb-2 relative z-10">Avg Writing</div>
             <div className="text-5xl font-black text-gray-800 relative z-10">{progress.writingScore || 0}<span className="text-xl text-gray-400">/10</span></div>
             <div className="text-xs text-[#10B981] font-bold mt-4 bg-[#10B981]/10 px-3 py-1.5 rounded-lg border border-[#10B981]/20 relative z-10">B1 Pass Target: 5.0</div>
           </div>

           <div className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-transform duration-300 flex flex-col items-center justify-center group overflow-hidden relative">
             <div className="absolute inset-0 bg-orange-50/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
             <div className="w-14 h-14 bg-[#F97316]/10 rounded-full flex items-center justify-center mb-4 relative z-10">
               <Target className="w-6 h-6 text-[#F97316]" />
             </div>
             <div className="text-sm font-black text-gray-500 uppercase tracking-wider mb-2 relative z-10">Vocabulary</div>
             <div className="text-5xl font-black text-gray-800 relative z-10">{progress.wordsLearned}</div>
             <div className="text-xs text-gray-500 font-bold mt-4 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 relative z-10">B1 Words Mastered</div>
           </div>
        </div>

        {/* Recharts Trajectory */}
        <div className="bg-white p-6 md:p-8 rounded-[20px] border border-gray-100 shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-transform duration-300 mb-8">
           <h2 className="text-2xl font-black text-gray-800 mb-6">Performance Trend (Last 7 Days)</h2>
           <div className="h-[300px] w-full -ml-4">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                 <defs>
                   <linearGradient id="colorSpeaking" x1="0" y1="0" x2="1" y2="0">
                     <stop offset="0%" stopColor="#3B82F6" />
                     <stop offset="100%" stopColor="#6366F1" />
                   </linearGradient>
                   <linearGradient id="colorWriting" x1="0" y1="0" x2="1" y2="0">
                     <stop offset="0%" stopColor="#8B5CF6" />
                     <stop offset="100%" stopColor="#A855F7" />
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                 <XAxis dataKey="date" stroke="#9ca3af" tick={{fill: '#9ca3af', fontSize: 13, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                 <YAxis domain={[0, 10]} stroke="#9ca3af" tick={{fill: '#9ca3af', fontSize: 13, fontWeight: 'bold'}} axisLine={false} tickLine={false} width={40} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '1rem', color: '#111827', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                   itemStyle={{ fontWeight: 'bold' }}
                 />
                 <Legend wrapperStyle={{ fontSize: '14px', fontWeight: 'bold', paddingTop: '20px' }} />
                 <Line type="monotone" dataKey="speaking" stroke="url(#colorSpeaking)" strokeWidth={4} dot={{r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8, fill: '#3b82f6'}} name="Speaking Average" />
                 <Line type="monotone" dataKey="writing" stroke="url(#colorWriting)" strokeWidth={4} dot={{r: 6, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8, fill: '#8b5cf6'}} name="Writing Average" />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Skill Breakdown */}
        <div className="bg-white p-6 md:p-8 rounded-[20px] border border-gray-100 shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-transform duration-300 mb-8">
           <h2 className="text-2xl font-black text-gray-800 mb-6">Skill Breakdown</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             
             {/* Speaking Breakdown */}
             <div>
                <h3 className="text-lg font-black text-gray-700 mb-4 flex items-center gap-2">
                  <Mic className="w-5 h-5 text-[#3B82F6]"/> Speaking Skills
                </h3>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-500 font-bold text-sm">Part 1 (Social Interaction)</span>
                      <span className="text-[#3B82F6] font-black">{progress.speakingPart1?.toFixed(1) || "0.0"}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1] rounded-full transition-all duration-1000" style={{ width: `${((progress.speakingPart1 || 0) / 10) * 100}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-500 font-bold text-sm">Part 2 (Solution Discussion)</span>
                      <span className="text-[#3B82F6] font-black">{progress.speakingPart2?.toFixed(1) || "0.0"}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1] rounded-full transition-all duration-1000" style={{ width: `${((progress.speakingPart2 || 0) / 10) * 100}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-500 font-bold text-sm">Part 3 (Topic Development)</span>
                      <span className="text-[#3B82F6] font-black">{progress.speakingPart3?.toFixed(1) || "0.0"}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1] rounded-full transition-all duration-1000" style={{ width: `${((progress.speakingPart3 || 0) / 10) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
             </div>

             {/* Writing Breakdown */}
             <div>
                <h3 className="text-lg font-black text-gray-700 mb-4 flex items-center gap-2">
                  <PenLine className="w-5 h-5 text-[#8B5CF6]"/> Writing Skills
                </h3>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-500 font-bold text-sm">Task 1 (Email/Letter)</span>
                      <span className="text-[#8B5CF6] font-black">{progress.writingTask1?.toFixed(1) || "0.0"}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] rounded-full transition-all duration-1000" style={{ width: `${((progress.writingTask1 || 0) / 10) * 100}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-500 font-bold text-sm">Task 2 (Essay)</span>
                      <span className="text-[#8B5CF6] font-black">{progress.writingTask2?.toFixed(1) || "0.0"}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] rounded-full transition-all duration-1000" style={{ width: `${((progress.writingTask2 || 0) / 10) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
             </div>

           </div>
        </div>

        {/* Areas for Improvement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white p-6 md:p-8 rounded-[20px] border border-gray-100 shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-xl font-black text-rose-500 mb-6 bg-rose-50 w-fit rounded-[14px] px-4 py-2 border border-rose-100">Focus Topics</h3>
              <p className="text-gray-500 mb-6 font-medium text-lg leading-relaxed">The AI has identified the following VSTEP topics as your weakest areas during recent practices:</p>
              <div className="flex flex-wrap gap-3">
                 <span className="px-4 py-2 bg-rose-100 text-rose-600 rounded-xl font-bold shadow-sm border border-rose-200">Environment</span>
                 <span className="px-4 py-2 bg-rose-100 text-rose-600 rounded-xl font-bold shadow-sm border border-rose-200">Health</span>
                 <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold shadow-sm border border-gray-200">Technology</span>
              </div>
           </div>

           <div className="bg-white p-6 md:p-8 rounded-[20px] border border-gray-100 shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-xl font-black text-amber-500 mb-6 bg-amber-50 w-fit rounded-[14px] px-4 py-2 border border-amber-100">Grammar Weaknesses</h3>
              <ul className="space-y-3 text-gray-600 font-medium">
                 <li className="flex gap-3 items-start">
                   <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0" />
                    Mixing up Past Simple and Present Perfect tenses during Speaking Part 1.
                 </li>
                 <li className="flex gap-3 items-start">
                   <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0" />
                   Missing articles (a/an/the) in formal letter writing.
                 </li>
              </ul>
           </div>
        </div>

      </div>
    </div>
  );
}
