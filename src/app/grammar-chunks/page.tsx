"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Brain, List, Beaker, Volume2 } from "lucide-react";
import { useGlobalState } from "@/store/GlobalStateContext";
import { VOCAB_CHUNKS, GRAMMAR_PATTERNS } from "@/data/grammar-chunks";
import { FlashcardRunner } from "@/components/grammar/FlashcardRunner";
import { DailyTestRunner } from "@/components/grammar/DailyTestRunner";

function HighlightText({text, highlight}: {text: string, highlight: string}) {
    if(!text || !highlight) return <>{text}</>;
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedHighlight})`, 'gi'));
    return <span>{parts.map((p, i) => p.toLowerCase() === highlight.toLowerCase() ? <strong key={i} className="text-gray-900 font-extrabold bg-amber-100 px-1 py-0.5 mx-0.5 rounded">{p}</strong> : p)}</span>;
}

const TOPIC_ICONS: Record<string, string> = {
  "Daily Life": "🌅", "Home & Household": "🏠", "Personal Habits": "🧘‍♂️", "Time & Schedules": "📅",
  "Food & Cooking": "🍳", "Shopping": "🛍️", "Transportation": "🚌", "Health & Fitness": "💪",
  "Travel": "✈️", "Weather": "🌤️", "Family & Relationships": "👨‍👩‍👧‍👦", "Friends & Social Life": "🍻",
  "Emotions & Feelings": "❤️", "Communication": "💬", "Entertainment": "🍿", "Education": "🎓",
  "Technology (basic)": "💻", "Media & Internet": "🌐", "Work & Career": "💼", "Business Communication": "🤝"
};

const GRAMMAR_ICONS: Record<string, { icon: string; desc: string; tint: string }> = {
  "Core Grammar":                    { icon: "📐", desc: "Ngữ pháp nền tảng",          tint: "bg-blue-50 border-blue-100" },
  "Opinions & Discussion":           { icon: "🗣️", desc: "Bày tỏ ý kiến & thảo luận",   tint: "bg-violet-50 border-violet-100" },
  "Agreement & Disagreement":        { icon: "⚖️", desc: "Đồng ý & phản đối",           tint: "bg-emerald-50 border-emerald-100" },
  "Suggestions & Advice":            { icon: "💡", desc: "Gợi ý & lời khuyên",          tint: "bg-amber-50 border-amber-100" },
  "Requests & Offers":               { icon: "📩", desc: "Yêu cầu & đề nghị",            tint: "bg-rose-50 border-rose-100" },
  "Cause & Effect":                  { icon: "🔗", desc: "Nguyên nhân & kết quả",       tint: "bg-cyan-50 border-cyan-100" },
  "Problem Solving":                 { icon: "🧩", desc: "Giải quyết vấn đề",           tint: "bg-orange-50 border-orange-100" },
  "Meetings & Work Communication":   { icon: "📋", desc: "Họp & giao tiếp công việc",   tint: "bg-indigo-50 border-indigo-100" },
  "Connectors":                      { icon: "🔀", desc: "Từ nối & liên kết",            tint: "bg-teal-50 border-teal-100" },
};

type Tab = "chunks" | "grammar" | "flashcards" | "test";

export default function GrammarChunksPage() {
   const [activeTab, setActiveTab] = useState<Tab>("chunks");
   const [selectedTopic, setSelectedTopic] = useState("Family");
   const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
   const [selectedGrammarCategory, setSelectedGrammarCategory] = useState<string | null>(null);
   const { progress } = useGlobalState();
   const [isLoaded, setIsLoaded] = useState(false);

   useEffect(() => {
      setIsLoaded(true);
   }, []);

   if (!isLoaded) return null;

   const dueChunks = progress.chunkProgress.filter(c => c.nextReviewDate <= Date.now());
   const dueGrammar = progress.grammarProgress.filter(g => g.nextReviewDate <= Date.now());

   const newChunksAvailable = progress.chunkProgress.length === 0 ? 10 : 0;
   const newGrammarAvailable = progress.grammarProgress.length === 0 ? 5 : 0;

   const totalDue = dueChunks.length + dueGrammar.length + newChunksAvailable + newGrammarAvailable;
   const learningCount = progress.chunkProgress.length + progress.grammarProgress.length;
   const masteredCount = progress.chunkProgress.filter(c => c.status === "mastered").length + progress.grammarProgress.filter(g => g.status === "mastered").length;

   return (
      <div className="min-h-screen bg-gray-50 flex flex-col pb-20 md:pb-10 font-sans">
         {/* PART 1 - HEADER REDESIGN: Compact Header */}
         <div className="bg-white px-4 md:px-6 pt-4 md:pt-6 pb-0 border-b border-gray-200 shadow-sm sticky top-0 z-10 transition-all duration-300">
            <div className="max-w-6xl mx-auto">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
                  <div className="flex items-center gap-4">
                     <Link href="/" className="text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 p-2.5 rounded-full hover:bg-gray-100">
                        <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                     </Link>
                     <div className="flex flex-col">
                        <div className="flex items-center gap-2.5 text-indigo-900 font-black text-xl md:text-2xl tracking-tight">
                           <BookOpen className="w-6 h-6 text-indigo-600" /> Grammar & Chunks
                        </div>
                        <span className="text-sm text-gray-500 font-medium mt-0.5">Master collocations and structures</span>
                     </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[13px] font-medium text-gray-500">
                     <span>{VOCAB_CHUNKS?.length || 0} chunks</span>&bull;
                     <span>{GRAMMAR_PATTERNS?.length || 0} grammar</span>&bull;
                     <span><strong className="text-indigo-600">{learningCount}</strong> learning</span>&bull;
                     <span><strong className="text-green-600">{masteredCount}</strong> mastered</span>
                  </div>
               </div>

               {/* Navigation Tabs inline underneath */}
               <div className="flex overflow-x-auto hide-scrollbar gap-8">
                  <button onClick={() => setActiveTab("chunks")} className={`whitespace-nowrap pb-3 border-b-[3px] flex items-center gap-2 font-bold text-[15px] transition-colors ${activeTab === "chunks" ? "border-indigo-600 text-indigo-700" : "border-transparent text-gray-500 hover:text-gray-800"}`}>Topics</button>
                  <button onClick={() => setActiveTab("grammar")} className={`whitespace-nowrap pb-3 border-b-[3px] flex items-center gap-2 font-bold text-[15px] transition-colors ${activeTab === "grammar" ? "border-indigo-600 text-indigo-700" : "border-transparent text-gray-500 hover:text-gray-800"}`}>Structures</button>
                  <button onClick={() => setActiveTab("flashcards")} className={`whitespace-nowrap pb-3 border-b-[3px] flex items-center gap-2 font-bold text-[15px] transition-colors ${activeTab === "flashcards" ? "border-indigo-600 text-indigo-700" : "border-transparent text-gray-500 hover:text-gray-800"}`}>Flashcards {totalDue > 0 && <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[11px] ml-1.5 shadow-sm">{totalDue} Due</span>}</button>
                  <button onClick={() => setActiveTab("test")} className={`whitespace-nowrap pb-3 border-b-[3px] flex items-center gap-2 font-bold text-[15px] transition-colors ${activeTab === "test" ? "border-indigo-600 text-indigo-700" : "border-transparent text-gray-500 hover:text-gray-800"}`}>Daily Test</button>
               </div>
            </div>
         </div>

         <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col pt-6 md:pt-8 px-4 md:px-0">
            <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
               {activeTab === "chunks" && (
                  <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-[75vh]">
                     {/* PART 6 - TOPIC SIDEBAR */}
                     <div className="w-full md:w-72 bg-gray-50 border-r border-gray-200 p-4 h-full md:overflow-y-auto custom-scrollbar">
                        <div className="space-y-1">
                           {Array.from(new Set(VOCAB_CHUNKS.map((c: any) => c.topic))).map(topic => (
                              <button
                                 key={topic as string}
                                 onClick={() => {
                                    setSelectedTopic(topic as string);
                                    setSelectedSubcategory(null);
                                 }}
                                 className={`w-full text-left px-4 py-3 rounded-xl font-bold text-[15px] transition-all flex items-center gap-3 ${selectedTopic === topic ? 'bg-indigo-100/50 text-indigo-800 shadow-sm border border-indigo-200' : 'text-gray-600 hover:bg-gray-100/80 border border-transparent'}`}
                              >
                                 <span className="text-[20px]">{TOPIC_ICONS[topic as string] || "📚"}</span>
                                 {topic as string}
                              </button>
                           ))}
                        </div>
                     </div>
                     <div className="flex-1 min-w-0 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-white">
                        <div className="mb-8">
                           <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
                              <span className="text-4xl">{TOPIC_ICONS[selectedTopic as string] || "📚"}</span> {selectedTopic}
                           </h2>

                           {/* PART 7 - SUBTOPIC FILTERS */}
                           <div className="overflow-x-auto -mx-6 md:-mx-8 px-6 md:px-8 mb-4 custom-scrollbar-x" style={{ WebkitOverflowScrolling: 'touch' as any }}>
                              <div className="flex gap-2 w-max pb-3">
                                 <button
                                    onClick={() => setSelectedSubcategory(null)}
                                    className={`whitespace-nowrap px-4 py-[7px] rounded-full text-[13px] font-semibold border transition-all duration-150 ${!selectedSubcategory ? 'bg-gray-900 text-white border-gray-900 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}
                                 >
                                    All Chunks
                                 </button>
                                 {Array.from(new Set(VOCAB_CHUNKS.filter((c: any) => c.topic === selectedTopic).map((c: any) => c.subcategory))).map(sub => (
                                    <button
                                       key={sub as string}
                                       onClick={() => setSelectedSubcategory(sub as string)}
                                       className={`whitespace-nowrap px-4 py-[7px] rounded-full text-[13px] font-semibold border transition-all duration-150 ${selectedSubcategory === sub ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200'}`}
                                    >
                                       {sub as string}
                                    </button>
                                 ))}
                              </div>
                           </div>
                        </div>

                        {VOCAB_CHUNKS && VOCAB_CHUNKS.length > 0 ? (
                           <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 md:gap-6">
                              {/* PART 5 - GRID LAYOUT */}
                              {VOCAB_CHUNKS.filter((c: any) => c.topic === selectedTopic && (!selectedSubcategory || c.subcategory === selectedSubcategory)).map((chunk: any, i: number) => (
                                 <div key={i} className="flex flex-col p-5 md:p-6 bg-white rounded-[20px] shadow-sm hover:shadow-md transition-shadow border border-gray-200 group relative">
                                    {/* PART 2 - VOCABULARY CARD LAYOUT */}
                                    <div className="flex justify-between items-start mb-1">
                                       <div className="text-[26px] font-black text-gray-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                                          {chunk.phrase}
                                       </div>
                                       <button
                                          title="Play Pronunciation"
                                          onClick={() => {
                                             const utterance = new SpeechSynthesisUtterance(chunk.phrase);
                                             utterance.lang = "en-US";
                                             window.speechSynthesis.speak(utterance);
                                          }}
                                          className="p-2 rounded-full text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 transition-colors cursor-pointer bg-gray-50 border border-gray-100"
                                       >
                                          <Volume2 className="w-5 h-5" />
                                       </button>
                                    </div>

                                    <div className="text-[17px] font-bold text-gray-700 mb-4">
                                       {chunk.meaning_vi}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 mb-6">
                                       <span className="text-gray-600 font-medium text-[13px] bg-gray-100 px-2.5 py-1 rounded-md">{chunk.ipa}</span>
                                       <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest border border-gray-200 px-2.5 py-1 rounded-md">{chunk.type.replace('_', ' ')}</span>
                                       <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">{chunk.level}</span>
                                    </div>

                                    <div className="space-y-1.5 mb-5 flex-1">
                                       <div className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Example</div>
                                       {/* PART 3 - EXAMPLE HIGHLIGHTING */}
                                       <div className="text-[16px] font-medium text-gray-800 leading-relaxed italic bg-[#F8FAFC] p-3 rounded-lg border-l-4 border-indigo-300">
                                          "<HighlightText text={chunk.example_en} highlight={chunk.phrase} />"
                                       </div>
                                       {chunk.example_vi && (
                                          <div className="text-[14px] text-gray-500 pt-1 px-1">
                                             {chunk.example_vi}
                                          </div>
                                       )}
                                    </div>

                                    {chunk.explanation_vi && (
                                       <div className="mt-auto pt-4 border-t border-gray-100">
                                          <div className="text-[11px] font-black uppercase text-gray-400 tracking-widest mb-2">Usage</div>
                                          <div className="text-[14px] text-gray-600 leading-relaxed">{chunk.explanation_vi}</div>
                                       </div>
                                    )}
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="text-center p-10">
                              <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                           </div>
                        )}
                     </div>
                  </div>
               )}

               {activeTab === "grammar" && (
                  <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden h-[75vh] flex flex-col">
                     <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-white">
                        {GRAMMAR_PATTERNS && GRAMMAR_PATTERNS.length > 0 ? (
                           selectedGrammarCategory ? (
                              <div className="max-w-5xl mx-auto">
                                 <button onClick={() => setSelectedGrammarCategory(null)} className="mb-6 flex items-center gap-2 text-gray-500 font-bold hover:text-gray-900 transition-colors text-[15px] bg-gray-50 px-4 py-2 w-fit rounded-full">
                                    <ArrowLeft className="w-5 h-5" /> Back to Sections
                                 </button>
                                 <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                    <span className="text-4xl">📝</span> {selectedGrammarCategory}
                                    <span className="text-gray-400 text-xl font-medium px-3 hidden md:inline">|</span>
                                    <span className="text-gray-500 text-xl font-bold hidden md:inline">{GRAMMAR_PATTERNS.find((g: any) => g.category === selectedGrammarCategory)?.category_vi}</span>
                                 </h2>
                                 
                                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 md:gap-6">
                                    {GRAMMAR_PATTERNS.filter((g: any) => g.category === selectedGrammarCategory).map((pattern: any, i: number) => (
                                       <div key={i} className="p-5 md:p-6 bg-white rounded-[20px] shadow-sm hover:shadow-md transition-shadow border border-gray-200 group flex flex-col h-full">
                                          {/* PART 8 - GRAMMAR CARD LAYOUT */}
                                          {/* STRUCTURE */}
                                          <div className="text-[11px] font-black uppercase text-gray-400 tracking-widest mb-1">Structure</div>
                                          <div className="text-[22px] font-black text-gray-900 mb-3 tracking-tight leading-tight">
                                             {pattern.pattern}
                                          </div>

                                          {/* MEANING */}
                                          <div className="text-[11px] font-black uppercase text-gray-400 tracking-widest mb-1 mt-1">Meaning</div>
                                          <div className="text-[17px] font-bold text-gray-700 mb-5">
                                             {pattern.explanation_vi?.split('.')?.[0] || pattern.category_vi}
                                          </div>

                                          <div className="flex items-center gap-3 mb-6">
                                             <span className="text-[12px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Level {pattern.level}</span>
                                          </div>

                                          {/* EXAMPLE */}
                                          <div className="space-y-1.5 mb-5 flex-1">
                                             <div className="text-[11px] font-black uppercase text-gray-400 tracking-widest mb-2">Example</div>
                                             <div className="text-[16px] font-medium text-gray-800 leading-relaxed italic bg-[#F8FAFC] p-3 rounded-lg border-l-4 border-amber-400">
                                                "{pattern.example}"
                                             </div>
                                             {/* TRANSLATION */}
                                             {pattern.example_vi && (
                                                <div className="text-[14px] text-gray-500 pt-1 px-1">
                                                   {pattern.example_vi}
                                                </div>
                                             )}
                                             
                                             {pattern.speakingExample && (
                                                <div className="mt-4 pt-4 border-t border-gray-100 border-dashed">
                                                   <div className="text-[11px] font-black text-indigo-400 uppercase tracking-widest mb-2">VSTEP Use Case</div>
                                                   <div className="text-gray-800 font-medium italic text-[15px] leading-relaxed bg-indigo-50 p-3 rounded-lg">
                                                      "{pattern.speakingExample}"
                                                   </div>
                                                </div>
                                             )}
                                          </div>

                                          {/* USAGE */}
                                          {pattern.explanation_vi && (
                                             <div className="mt-auto pt-4 border-t border-gray-100">
                                                <div className="text-[11px] font-black uppercase text-gray-400 tracking-widest mb-2">Usage</div>
                                                <div className="text-[14px] text-gray-600 leading-relaxed">{pattern.explanation_vi}</div>
                                             </div>
                                          )}
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto">
                                 {Array.from(new Set(GRAMMAR_PATTERNS.map((g: any) => g.category))).map(category => {
                                    const count = GRAMMAR_PATTERNS.filter((g: any) => g.category === category).length;
                                    const meta = GRAMMAR_ICONS[category as string];
                                    return (
                                       <button
                                          key={category as string}
                                          onClick={() => setSelectedGrammarCategory(category as string)}
                                          className="p-6 md:p-7 bg-white rounded-[24px] border border-gray-200/80 hover:border-indigo-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group h-full cursor-pointer"
                                       >
                                          <div className={`w-16 h-16 rounded-[18px] border flex items-center justify-center text-[32px] mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300 bg-gray-50 border-gray-100`}>
                                             {meta?.icon || "📝"}
                                          </div>
                                          <h3 className="text-[17px] font-black text-gray-900 leading-snug group-hover:text-indigo-600 transition-colors mb-2">{category as string}</h3>
                                          <p className="text-[14px] font-medium text-gray-500 leading-snug mb-5">{meta?.desc || ''}</p>
                                          <div className="mt-auto flex items-center gap-1.5 justify-center bg-gray-50 px-3.5 py-1.5 rounded-full border border-gray-100">
                                             <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                                             <span className="text-[12px] text-gray-600 font-bold">{count} patterns</span>
                                          </div>
                                       </button>
                                    );
                                 })}
                              </div>
                           )
                        ) : (
                           <div className="text-center p-10">
                              <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                           </div>
                        )}
                     </div>
                  </div>
               )}

               {activeTab === "flashcards" && (
                  <FlashcardRunner onClose={() => setActiveTab("chunks")} />
               )}

               {activeTab === "test" && (
                  <DailyTestRunner onClose={() => setActiveTab("chunks")} />
               )}
            </div>
         </div>
      </div>
   );
}
