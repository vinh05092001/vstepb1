"use client";

import { useState, useRef, useEffect } from "react";
import { useGlobalState } from "@/store/GlobalStateContext";
import { ChatMessage } from "@/components/ChatMessage";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import Link from "next/link";
import { ArrowLeft, Send, Mic, MicOff, Settings, Sparkles, Bot, AlertCircle, Square } from "lucide-react";

type Message = { role: "user" | "bot" | "system"; content: string; };

const roles = [
  "Friendly Helper",
  "Restaurant Waiter",
  "Coworker",
  "Job Interviewer",
  "Travel Guide"
];

export default function TutorPage() {
  const { addXp, isHydrated, addGrammarMistake, updateSpeakingScore } = useGlobalState();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [feedbackReport, setFeedbackReport] = useState<any>(null);
  const [role, setRole] = useState(roles[0]);
  const [showRoles, setShowRoles] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const { isRecording, transcript, startRecording, stopRecording, hasSupport } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!isHydrated) return <div className="p-8 text-center text-gray-500 font-bold">Loading...</div>;

  const handleSendMessage = async (e?: React.FormEvent, isRetry = false) => {
    e?.preventDefault();
    if (!input.trim() && !isRetry) return;
    if (loading) return;

    let userMsg: Message | null = null;
    let pendingMessages = messages;

    if (!isRetry) {
      userMsg = { role: "user", content: input };
      pendingMessages = [...messages, userMsg];
      setMessages(pendingMessages);
      setInput("");
    }

    setLoading(true);
    setIsFallback(false);

    try {
      const res = await fetch("/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: pendingMessages.filter(m => m.role !== "system"),
          role
        })
      });

      if (!res.ok) throw new Error("Failed to send message");

      const data = await res.json();
      
      if (data.status === "fallback") {
        setIsFallback(true);
        return; // Halt stream, show Fallback UI
      }
      
      const fullReply = data.reply || "Thinking...";
      
      // Simulated Streaming (Typewriter effect)
      setMessages(prev => [...prev, { role: "bot", content: "" }]);
      
      let typedReply = "";
      const streamInterval = setInterval(() => {
        if (typedReply.length < fullReply.length) {
          const charsToAdd = Math.ceil(fullReply.length / 30); // Adaptive speed
          typedReply = fullReply.substring(0, typedReply.length + charsToAdd);
          
          setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1].content = typedReply;
            return newMsgs;
          });
        } else {
          clearInterval(streamInterval);
        }
      }, 30);
      
      // Award XP occasionally for participating
      if (Math.random() > 0.5) addXp(10);
    } catch (err: any) {
      setIsFallback(true); // Treat network errors as fallback requests too
    } finally {
      setLoading(false);
    }
  };

  const handleEndConversation = async () => {
    if (messages.length < 3) return; // not much to analyze
    setAnalyzing(true);
    try {
      const res = await fetch("/api/conversation-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: messages })
      });
      const report = await res.json();
      setFeedbackReport(report);
      
      // Update global profile hooks
      report.grammarMistakes.forEach((mistake: string) => addGrammarMistake(mistake));
      updateSpeakingScore(report.speakingScore);
      
      addXp(10);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const startConversation = (selectedRole: string) => {
    setRole(selectedRole);
    setShowRoles(false);
    setMessages([{ role: "system", content: `Conversation started with: ${selectedRole}` }]);
    setFeedbackReport(null); // Clear previous feedback
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between border-b-2 border-gray-200 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2 text-blue-500 font-bold text-lg">
             <Sparkles className="w-6 h-6 fill-current text-blue-400" /> AI Tutor
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setShowRoles(!showRoles)} className="flex items-center gap-2 bg-gray-100 text-gray-700 font-bold px-4 py-2 rounded-xl border-2 border-gray-200 hover:bg-gray-200 transition-colors">
            <Settings className="w-5 h-5" /> {role}
          </button>
          
          {showRoles && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden py-2 animate-in slide-in-from-top-2">
              <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Select Role</div>
              {roles.map(r => (
                <button
                  key={r}
                  onClick={() => startConversation(r)}
                  className={`w-full text-left px-4 py-3 font-bold transition-colors ${role === r ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto flex flex-col min-h-full justify-end">
           {messages.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full opacity-50 my-auto text-center cursor-pointer" onClick={() => startConversation(roles[0])}>
               <Sparkles className="w-20 h-20 text-blue-300 mb-4" />
               <h3 className="text-2xl font-bold text-gray-600 mb-2">Practice Real Conversations</h3>
               <p className="max-w-xs text-gray-500">Say hello to start chatting. The tutor will gently correct your mistakes.</p>
             </div>
           ) : (
             <div className="space-y-4 w-full flex flex-col items-stretch">
               {messages.map((m, i) => (
                 <ChatMessage key={i} role={m.role} content={m.content} />
               ))}
               
               {isFallback && (
                 <div className="flex w-full justify-start animate-in slide-in-from-bottom-2">
                   <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-200 max-w-[85%]">
                     <div className="flex items-center gap-2 text-red-600 font-bold mb-2">
                       <AlertCircle className="w-5 h-5 flex-shrink-0" />
                       <span>AI temporarily unavailable</span>
                     </div>
                     <p className="text-red-700 text-sm mb-4">You can continue chatting and the system will explicitly retry sending your history, without dropping your previous message.</p>
                     <button 
                       onClick={(e) => handleSendMessage(e, true)}
                       className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-colors text-sm uppercase tracking-wide"
                     >
                       Continue Response
                     </button>
                   </div>
                 </div>
               )}

               {loading && !isFallback && <ChatMessage role="bot" content="" isTyping={true} />}
               <div ref={bottomRef} />
             </div>
           )}
        </div>
      </div>

      {/* Input Area */}
      {feedbackReport ? (
             <div className="p-6 bg-white border-t-2 border-gray-200 animate-in slide-in-from-bottom-8">
               <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                 <Bot className="w-8 h-8 text-blue-500" />
                 Conversation Analysis
               </h3>
               
               <div className="mb-4 flex items-center gap-4">
                 <div className="p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
                   <div className="text-sm font-bold text-blue-500 uppercase">Speaking Score</div>
                   <div className="text-4xl font-bold text-blue-600">{feedbackReport.speakingScore}/100</div>
                 </div>
                 <p className="flex-1 text-gray-600 font-medium italic">"{feedbackReport.feedback}"</p>
               </div>

               {feedbackReport.grammarMistakes.length > 0 && (
                 <div className="mb-4">
                   <h4 className="font-bold text-red-500 flex items-center gap-2 mb-2"><AlertCircle className="w-5 h-5"/> Grammar to Review</h4>
                   <ul className="list-disc list-inside space-y-1 text-gray-700 font-medium">
                     {feedbackReport.grammarMistakes.map((m: string, i: number) => <li key={i}>{m}</li>)}
                   </ul>
                 </div>
               )}

               {feedbackReport.awkwardPhrasing.length > 0 && (
                 <div className="mb-6">
                   <h4 className="font-bold text-orange-500 flex items-center gap-2 mb-2"><AlertCircle className="w-5 h-5"/> Sound more natural</h4>
                   <ul className="list-disc list-inside space-y-1 text-gray-700 font-medium">
                     {feedbackReport.awkwardPhrasing.map((m: string, i: number) => <li key={i}>{m}</li>)}
                   </ul>
                 </div>
               )}

               <button 
                 onClick={() => { setFeedbackReport(null); setMessages([]); startConversation(role); }}
                 className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white rounded-2xl border-b-4 border-blue-600 font-bold uppercase text-lg"
               >
                 Practice Again
               </button>
             </div>
          ) : (
             <div className="p-4 bg-white border-t-2 border-gray-200">
               <form onSubmit={handleSendMessage} className="flex gap-2 relative">
                 {hasSupport && (
                   <button
                     type="button"
                     onClick={toggleRecording}
                     className={`p-4 rounded-2xl border-gray-200 border-2 transition-colors ${
                       isRecording ? "bg-red-100 text-red-600 border-red-200 animate-pulse" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                     }`}
                   >
                     {isRecording ? <Square className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                   </button>
                 )}
                 <input
                   type="text"
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   placeholder="Type your message or speak..."
                   className="flex-1 p-4 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-blue-400 font-medium text-lg min-w-0"
                   disabled={loading || isRecording}
                 />
                 <button
                   type="submit"
                   disabled={!input.trim() || loading}
                   className="p-4 bg-blue-500 hover:bg-blue-400 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 >
                   <Send className="w-6 h-6" />
                 </button>
               </form>

               {messages.length > 2 && (
                 <button 
                    onClick={handleEndConversation}
                    disabled={analyzing}
                    className="mt-4 w-full py-3 bg-red-50 text-red-500 border-2 border-red-200 hover:bg-red-100 rounded-2xl font-bold uppercase flex items-center justify-center gap-2"
                 >
                    {analyzing ? <span className="animate-pulse">Analyzing...</span> : "End Conversation & Analyze"}
                 </button>
               )}
             </div>
          )}
    </div>
  );
}
