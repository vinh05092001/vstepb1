"use client";

import Link from "next/link";
import { MessageCircle, Mic, Timer } from "lucide-react";
import { ReactNode } from "react";

function ModuleCard({ title, desc, icon, href, isDanger = false }: { title: string, desc: string, icon: ReactNode, href: string, isDanger?: boolean }) {
  const bgIcon = isDanger ? 'bg-red-50' : 'bg-[#3B82F6]/10';
  const textIcon = isDanger ? 'text-red-500' : 'text-[#3B82F6]';
  const hoverBorder = isDanger ? 'group-hover:border-red-300' : 'group-hover:border-[#3B82F6]/30';
  
  return (
    <Link 
      href={href}
      className={`group bg-white border border-gray-100 ${hoverBorder} p-6 rounded-[20px] transition-all duration-200 shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center gap-4 hover:-translate-y-1 relative overflow-hidden`}
    >
      <div className={`w-20 h-20 ${bgIcon} rounded-[18px] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
         <div className={textIcon}>{icon}</div>
      </div>
      <div className="text-center">
         <h3 className="text-xl font-black text-gray-800 mb-1">{title}</h3>
         <p className="text-sm border-t border-gray-100 pt-3 mt-2 text-gray-500 font-bold">{desc}</p>
      </div>
    </Link>
  );
}

export default function SpeakingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:p-8 pb-20">
      <div className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-0">
        
        {/* Header section */}
        <div className="bg-white p-6 md:p-10 rounded-[20px] border border-gray-100 shadow-[0_8px_20px_rgba(0,0,0,0.06)] mb-8 mt-4 md:mt-0">
           <div className="flex items-center gap-4 mb-4">
               <div className="p-4 bg-gradient-to-br from-[#3B82F6] to-[#6366F1] text-white rounded-[16px] shadow-md"><Mic className="w-8 h-8" /></div>
               <div>
                 <h1 className="text-3xl font-black text-gray-800">Speaking Practice</h1>
                 <p className="text-[#3B82F6] font-bold text-sm tracking-widest uppercase mt-1">Part 1, 2 & 3 AI Trainer</p>
               </div>
           </div>
           <p className="text-gray-500 text-lg max-w-2xl font-medium mt-4">
             Select a VSTEP Speaking part to practice or take a full mock exam.
           </p>
        </div>
          
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <ModuleCard title="Part 1" desc="Social Interaction" icon={<MessageCircle className="w-10 h-10" />} href="/speaking/part1" />
          <ModuleCard title="Part 2" desc="Solution Discussion" icon={<MessageCircle className="w-10 h-10" />} href="/speaking/part2" />
          <ModuleCard title="Part 3" desc="Topic Development" icon={<MessageCircle className="w-10 h-10" />} href="/speaking/part3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ModuleCard title="Shadowing" desc="Listen & Repeat" icon={<Mic className="w-10 h-10" />} href="/shadowing" />
          <ModuleCard title="Full Test" desc="12-Min Simulation" icon={<Timer className="w-10 h-10" />} href="/exam-simulation" isDanger={true} />
        </div>
      </div>
    </div>
  );
}
