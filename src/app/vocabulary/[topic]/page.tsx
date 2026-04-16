"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Volume2, MessageSquareText, ChevronDown, ChevronRight, Sparkles, Loader2, Map, ListTree, Lightbulb, CheckCircle2, AlertTriangle, CheckSquare } from "lucide-react";
import { INITIAL_VOCABULARY } from "@/data/vocabulary";

// Hydration-safe node component defined outside
// This prevents Next.js / React from redefining the component on every render
const MindmapNode = ({ 
  item, 
  isMain, 
  isExpanded, 
  isSelected, 
  toggleNode, 
  toggleSelection, 
  playTTS 
}: { 
  item: typeof INITIAL_VOCABULARY[0];
  isMain: boolean;
  isExpanded: boolean;
  isSelected: boolean;
  toggleNode: (id: string, e?: React.MouseEvent) => void;
  toggleSelection: (e: React.MouseEvent, id: string) => void;
  playTTS: (e: React.MouseEvent, text: string) => void;
}) => {
  return (
    <div className={`flex flex-col mb-3 transition-all ${isMain ? 'mt-4' : 'ml-6 border-l-2 border-gray-100 pl-4'}`}>
      {/* Node Header Row */}
      <div 
        onClick={(e) => toggleNode(item.id, e)}
        className={`group flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer shadow-sm
          ${isMain ? 'bg-white border-gray-100 hover:border-[#F97316]/30' : 'bg-gray-50 border-transparent hover:bg-white hover:border-gray-100'}
          ${isExpanded && isMain ? 'border-b-0 rounded-b-none bg-gray-50' : ''}
        `}
      >
        {/* Collapse Indicator */}
        <div className="mt-1 flex-shrink-0 text-gray-400">
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </div>

        {/* Node Text & Details Context */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className={`font-black text-base md:text-lg leading-tight ${isSelected ? 'text-[#F97316]' : 'text-gray-800'}`}>
               {item.word}
            </span>
          </div>
        </div>

        {/* Checkbox for Building Anwer */}
        <div 
          className="flex-shrink-0 p-1 hover:bg-orange-50 rounded-lg transition-colors"
          onClick={(e) => toggleSelection(e, item.id)}
        >
           <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all 
              ${isSelected ? 'bg-[#F97316] border-[#F97316]' : 'border-gray-300 group-hover:border-gray-400'}`}
           >
              {isSelected && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
           </div>
        </div>
      </div>

      {/* Node Detail Panel (Meaning & Example) */}
      {isExpanded && (
        <div className={`p-4 bg-gray-50 text-sm animate-in fade-in slide-in-from-top-1 
          ${isMain ? 'border border-t-0 border-gray-100 rounded-b-xl mb-2' : 'rounded-lg mb-2 mt-1'}
        `}>
           
           {/* Meaning block */}
           <div className="mb-4">
              <span className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" /> Meaning
              </span>
              <span className="text-amber-600 font-medium text-[15px]">{item.meaning_vi}</span>
           </div>
           
           {/* Example block */}
           <div className="relative bg-white rounded-[14px] p-3 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-xs uppercase tracking-wider font-bold">Speaking Sentence</span>
                <button 
                  onClick={(e) => playTTS(e, item.speaking_sentence || item.example_en)}
                  className="flex items-center gap-1.5 text-[#F97316] hover:text-white bg-orange-50 hover:bg-[#F97316] px-2.5 py-1 rounded-full text-xs font-bold transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Listen
                </button>
              </div>
              <p className="text-gray-700 font-medium leading-relaxed">
                "{item.speaking_sentence || item.example_en}"
              </p>
           </div>
        </div>
      )}
    </div>
  );
};

export default function TopicMindmapPage() {
  const params = useParams();
  const rawTopic = (params?.topic as string) || "";
  const topic = decodeURIComponent(rawTopic);
  
  // States
  const [mounted, setMounted] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
  const [selectedIdeas, setSelectedIdeas] = useState<string[]>([]);
  const [isBuildingAnswer, setIsBuildingAnswer] = useState(false);
  const [builtAnswer, setBuiltAnswer] = useState<string | null>(null);

  // Hydration safety: only show interactive content after mount
  useEffect(() => {
    setMounted(true);
    const topicVocab = INITIAL_VOCABULARY.filter(v => v.topic === topic);
    const uniqueCats = Array.from(new Set(topicVocab.map(v => v.category || "General")));
    setExpandedCategories(uniqueCats);
  }, [topic]);

  // Group vocabulary by mindmap structure
  const mindmapTree = useMemo(() => {
    const topicVocab = INITIAL_VOCABULARY.filter(v => v.topic === topic);
    const groups: Record<string, { main: typeof INITIAL_VOCABULARY[0], supports: typeof INITIAL_VOCABULARY }[]> = {};
    
    // Find all categories first
    topicVocab.forEach(item => {
      const cat = item.category || "General";
      if (!groups[cat]) groups[cat] = [];
    });

    // Heuristic Grouping
    for (const cat in groups) {
      const catItems = topicVocab.filter(v => (v.category || "General") === cat);
      let currentMain: { main: typeof INITIAL_VOCABULARY[0], supports: typeof INITIAL_VOCABULARY } | null = null;
      
      catItems.forEach((item, index) => {
        const w = item.word.toLowerCase();
        
        // Define heuristic matching the user's mindmap logic intent for VSTEP
        const isMainIdea = 
          index === 0 || 
          w.includes(" life ") || w.startsWith("life ") || w.endsWith(" life") ||
          w.includes("cost of living") ||
          w.includes("environment is") ||
          w.includes("people are") ||
          w.includes("infrastructure is") ||
          w.includes("transport systems are") ||
          (w.includes(" is ") && !w.includes("traffic") && !w.includes("air ")) || 
          (w.includes(" are ") && !w.includes("roads")) || 
          w.startsWith("be ") ||
          w.includes("dangerous") ||
          w.includes("convenient") ||
          w.includes("interesting");
        
        if (isMainIdea) {
          currentMain = { main: item, supports: [] };
          groups[cat].push(currentMain);
        } else {
          if (currentMain) {
             currentMain.supports.push(item);
          } else {
             // Fallback
             currentMain = { main: item, supports: [] };
             groups[cat].push(currentMain);
          }
        }
      });
    }
    
    return groups;
  }, [topic]);

  // Toggles
  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const toggleNode = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedNodes(prev => prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]);
  };

  const toggleSelection = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIdeas(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const playTTS = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleBuildAnswer = async () => {
    if (selectedIdeas.length === 0) return;
    
    setIsBuildingAnswer(true);
    setBuiltAnswer(null);
    
    try {
      const selectedVocab = INITIAL_VOCABULARY.filter(v => selectedIdeas.includes(v.id));
      const ideasString = selectedVocab.map(v => v.word).join(", ");
      
      const response = await fetch("/api/build-speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, ideas: ideasString }),
      });
      
      if (!response.ok) throw new Error("Failed to build answer");
      const data = await response.json();
      setBuiltAnswer(data.answer);
    } catch (err: any) {
      setBuiltAnswer("Sorry, I couldn't build the answer at the moment. Please try again.");
    } finally {
      setIsBuildingAnswer(false);
      setSelectedIdeas([]);
    }
  };

  const getCategoryTheme = (catName: string) => {
    const name = catName.toLowerCase();
    if (name.includes("place") || name.includes("scenery")) return { icon: <Map className="w-5 h-5" />, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" };
    if (name.includes("advantage") || name.includes("benefit") || name.includes("good")) return { icon: <CheckCircle2 className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" };
    if (name.includes("disadvantage") || name.includes("drawback") || name.includes("bad")) return { icon: <AlertTriangle className="w-5 h-5" />, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" };
    if (name.includes("activit") || name.includes("hobby")) return { icon: <Sparkles className="w-5 h-5" />, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
    return { icon: <ListTree className="w-5 h-5" />, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" };
  };

  if (!mounted) {
    return <div className="min-h-screen bg-white"></div>; // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-32">
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/vocabulary" className="text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2 text-gray-800 font-black text-lg uppercase">
             <MessageSquareText className="w-5 h-5 text-[#F97316]" /> {topic.replace("_", " ")} Mindmap
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 mt-2">
        
        {/* Helper Instructions */}
        <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-[20px] flex items-start gap-3 shadow-sm">
          <CheckSquare className="w-6 h-6 text-[#F97316] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[#F97316] font-black mb-1">How to use the Mindmap</h3>
            <p className="text-orange-500/80 text-sm leading-relaxed font-bold">
              Click on any idea to expand its details and supporting points. Select a few checkboxes and click "Build Speaking Answer" at the bottom to merge them into a fluent answer paragraph!
            </p>
          </div>
        </div>

        {/* Mindmap Groups */}
        <div className="space-y-6">
          {Object.entries(mindmapTree).map(([categoryName, items]) => {
            const theme = getCategoryTheme(categoryName);
            const isCatExpanded = expandedCategories.includes(categoryName);
            
            return (
              <div key={categoryName} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Category Header */}
                <div 
                  onClick={() => toggleCategory(categoryName)}
                  className={`p-4 ${theme.bg} cursor-pointer flex items-center justify-between border-b border-transparent transition-colors hover:bg-opacity-80
                    ${isCatExpanded ? theme.border : ''}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-white rounded-lg shadow-sm ${theme.color}`}>
                      {theme.icon}
                    </div>
                    <h2 className={`font-bold text-lg tracking-wide ${theme.color}`}>
                      {categoryName.toUpperCase()}
                    </h2>
                  </div>
                  <div className={`p-1 rounded-full bg-white/50 ${theme.color}`}>
                    {isCatExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </div>

                {/* Category Content */}
                {isCatExpanded && (
                  <div className="p-4 md:p-6">
                    {items.map((group, idx) => (
                      <div key={group.main.id} className="mb-4 last:mb-0">
                         {/* Main Idea */}
                         <MindmapNode
                           item={group.main}
                           isMain={true}
                           isExpanded={expandedNodes.includes(group.main.id)}
                           isSelected={selectedIdeas.includes(group.main.id)}
                           toggleNode={toggleNode}
                           toggleSelection={toggleSelection}
                           playTTS={playTTS}
                         />
                         
                         {/* Supporting Ideas */}
                         {expandedNodes.includes(group.main.id) && group.supports.length > 0 && (
                           <div className="ml-6 border-l-2 border-blue-100 pl-2">
                             {group.supports.map(support => (
                               <MindmapNode
                                 key={support.id}
                                 item={support}
                                 isMain={false}
                                 isExpanded={expandedNodes.includes(support.id)}
                                 isSelected={selectedIdeas.includes(support.id)}
                                 toggleNode={toggleNode}
                                 toggleSelection={toggleSelection}
                                 playTTS={playTTS}
                               />
                             ))}
                           </div>
                         )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          
          {Object.keys(mindmapTree).length === 0 && (
             <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 text-slate-500">
                <p>No vocabulary data found for this topic yet.</p>
             </div>
          )}
        </div>
      </div>

      {/* Floating Build Action Bar */}
      {selectedIdeas.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40 animate-in slide-in-from-bottom-5">
           <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                 <div className="bg-orange-100 text-[#F97316] font-black px-3 py-1 rounded-full text-sm">
                    {selectedIdeas.length} idea{selectedIdeas.length > 1 ? 's' : ''} selected
                 </div>
                 <span className="text-gray-500 font-bold text-sm hidden md:inline">
                   Ready to structure your speaking answer?
                 </span>
              </div>
              <button 
                onClick={handleBuildAnswer}
                disabled={isBuildingAnswer}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#F97316] to-[#FB923C] text-white px-6 py-3 rounded-[14px] font-black transition-all shadow-[0_10px_25px_rgba(249,115,22,0.3)] hover:-translate-y-1 disabled:translate-y-0 disabled:shadow-none disabled:opacity-70"
              >
                {isBuildingAnswer ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {isBuildingAnswer ? "Building Answer..." : "Build Speaking Answer"}
              </button>
           </div>
        </div>
      )}

      {/* Built Answer Modal / Result */}
      {builtAnswer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white w-full max-w-2xl rounded-t-[20px] md:rounded-[24px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 md:zoom-in-95 border border-gray-100">
             <div className="bg-gradient-to-r from-[#F97316] to-[#FB923C] p-6 flex justify-between items-center text-white">
                <div>
                  <h3 className="font-black text-xl flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-200" />
                    Your AI Answer
                  </h3>
                  <p className="text-orange-50 font-bold text-sm mt-1 opacity-90">Combined from {selectedIdeas.length} ideas</p>
                </div>
                <button 
                  onClick={() => setBuiltAnswer(null)}
                  className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  ✕
                </button>
             </div>
             <div className="p-6 md:p-8">
                <div className="prose prose-slate prose-p:leading-relaxed prose-p:text-gray-700 prose-p:font-bold">
                  {builtAnswer.split('\n').map((paragraph, idx) => (
                    paragraph.trim() && <p key={idx} className="mb-4 last:mb-0 text-lg">{paragraph}</p>
                  ))}
                </div>
                
                <div className="mt-8 flex gap-3">
                  <button 
                    onClick={(e) => playTTS(e, builtAnswer)}
                    className="flex-1 flex items-center justify-center gap-2 bg-orange-50 hover:bg-[#F97316] hover:text-white hover:shadow-lg hover:-translate-y-1 text-[#F97316] py-4 rounded-[14px] font-black transition-all border border-orange-200"
                  >
                    <Volume2 className="w-6 h-6" /> Listen to Answer
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}
