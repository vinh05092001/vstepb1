"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Layers } from "lucide-react";
import { VSTEP_TOPICS } from "@/data/vocabulary";

// Helper function to map VSTEP topics to an icon and color profile
const getTopicMeta = (topic: string) => {
  const meta: Record<string, { icon: string, color: string }> = {
    transport: { icon: "🚆", color: "from-blue-400/20 to-blue-500/10" },
    city: { icon: "🏙️", color: "from-purple-400/20 to-purple-500/10" },
    countryside: { icon: "🏞️", color: "from-green-400/20 to-green-500/10" },
    health: { icon: "🏥", color: "from-red-400/20 to-red-500/10" },
    environment: { icon: "🌍", color: "from-emerald-400/20 to-emerald-500/10" },
    hobbies: { icon: "🎨", color: "from-orange-400/20 to-orange-500/10" },
    job_study: { icon: "💼", color: "from-indigo-400/20 to-indigo-500/10" },
    food: { icon: "🍔", color: "from-yellow-400/20 to-yellow-500/10" },
    technology: { icon: "💻", color: "from-cyan-400/20 to-cyan-500/10" },
    house_flat: { icon: "🏠", color: "from-rose-400/20 to-rose-500/10" },
    languages: { icon: "🗣️", color: "from-fuchsia-400/20 to-fuchsia-500/10" },
    person: { icon: "🧑", color: "from-sky-400/20 to-sky-500/10" },
    holiday: { icon: "🌴", color: "from-teal-400/20 to-teal-500/10" },
  };
  
  return meta[topic] || { icon: "📚", color: "from-gray-400/20 to-gray-500/10" };
};

const formatTopicName = (topic: string) => {
  return topic.replace("_", " ").toUpperCase();
};

export default function VocabularyTopicsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-10">
      <div className="bg-white p-4 flex items-center justify-between border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2 text-[#F97316] font-black text-lg">
             <BookOpen className="w-5 h-5" /> VSTEP Speaking Ideas
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 flex flex-col h-full mt-4 animate-in slide-in-from-bottom-8">
        
        <div className="bg-white p-6 md:p-10 rounded-[20px] border border-gray-100 shadow-[0_8px_20px_rgba(0,0,0,0.06)] mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
           <div>
             <h1 className="text-3xl font-black text-gray-800 mb-2">Speaking Idea Mindmaps</h1>
             <p className="text-gray-500 text-lg font-medium">
               Build your speaking answers intuitively. Select a topic to explore ideas, collocations, and example sentences grouped by categories.
             </p>
           </div>
           <div className="bg-gradient-to-br from-[#F97316] to-[#FB923C] text-white p-4 rounded-[16px] shadow-md">
             <Layers className="w-10 h-10" />
           </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
           {VSTEP_TOPICS.map((topic, idx) => {
             const meta = getTopicMeta(topic);
             return (
               <Link 
                 key={idx}
                 href={`/vocabulary/${topic}`}
                 className={`group bg-white border border-gray-100 p-6 rounded-[20px] transition-all duration-200 shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:border-[#F97316]/30 flex flex-col items-center justify-center gap-4 hover:-translate-y-1 relative overflow-hidden`}
               >
                 <div className={`w-20 h-20 bg-gradient-to-br ${meta.color} rounded-[18px] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm border-0`}>
                    <div className="text-4xl">{meta.icon}</div>
                 </div>
                 <div className="text-center font-black text-gray-800 text-[15px] sm:text-base uppercase tracking-wider group-hover:text-[#F97316] transition-colors">
                   {formatTopicName(topic)}
                 </div>
               </Link>
             );
           })}
        </div>

      </div>
    </div>
  );
}
