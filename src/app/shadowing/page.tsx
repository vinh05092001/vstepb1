"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mic, Square, CheckCircle, Volume2, Loader2, Ear, Repeat } from "lucide-react";

const SHADOWING_SENTENCES = [
  "In my opinion, learning a new language opens up many opportunities.",
  "I strongly believe that public transport should be free for everyone.",
  "One of the main reasons I chose to study here is the excellent facilities.",
  "If I had the chance, I would definitely travel around the world.",
  "Compared to living in the city, the countryside is much more peaceful."
];

export default function ShadowingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pronunciationIssues, setPronunciationIssues] = useState<any[] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const sentence = SHADOWING_SENTENCES[currentIndex];

  const playAI = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.lang = "en-US";
      utterance.rate = 0.85; // slightly slower for shadowing
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      
      // Prevent GC
      // @ts-ignore
      window._latestUtterance = utterance;

      window.speechSynthesis.speak(utterance);
    }
  };

  const startRecording = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }
    window.speechSynthesis.cancel();
    
    // @ts-ignore
    const rec = new window.webkitSpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
      }
      if (finalTranscript) setTranscript(prev => prev + " " + finalTranscript);
    };

    rec.start();
    setRecognition(rec);
    setIsRecording(true);
    setTranscript("");
    setPronunciationIssues(null);
  };

  const stopRecording = () => {
    if (recognition) recognition.stop();
    setIsRecording(false);
    if (transcript.trim().length > 5) {
       analyzePronunciation(transcript);
    }
  };

  const analyzePronunciation = async (text: string) => {
    setIsAnalyzing(true);
    setPronunciationIssues(null);
    try {
       const res = await fetch("/api/pronunciation-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript: text })
       });
       const data = await res.json();
       if (data.issues) setPronunciationIssues(data.issues);
    } catch (e) {
       console.error("Pronunciation API failed", e);
    } finally {
       setIsAnalyzing(false);
    }
  };

  const nextSentence = () => {
     if (currentIndex < SHADOWING_SENTENCES.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setTranscript("");
        setPronunciationIssues(null);
     }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-10">
      <div className="bg-white p-4 flex items-center justify-between border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2 text-[#3B82F6] font-black text-lg">
             <Repeat className="w-5 h-5" /> Shadowing Training
          </div>
        </div>
        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
           Sentence {currentIndex + 1} / {SHADOWING_SENTENCES.length}
        </div>
      </div>

      <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-8 flex flex-col h-full animate-in slide-in-from-right-8 mt-4">
          <div className="bg-white p-8 rounded-[20px] border border-gray-100 shadow-[0_10px_25px_rgba(0,0,0,0.08)] flex-1 overflow-hidden">
             <div className="text-center mb-10">
                <div className="w-16 h-16 bg-[#3B82F6]/10 text-[#3B82F6] rounded-[16px] flex items-center justify-center mx-auto mb-4">
                   <Ear className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-gray-800 mb-2">Listen & Repeat</h2>
                <p className="text-gray-500 font-medium">Listen carefully to the AI's pronunciation, intonation, and rhythm, then shadow it exactly.</p>
             </div>

             <div className="bg-gray-50 p-8 rounded-[16px] border border-gray-100 mb-8 text-center relative overflow-hidden group min-h-[160px] flex items-center justify-center shadow-inner">
                <p className="text-2xl font-bold text-gray-800 leading-relaxed z-10">
                  "{sentence}"
                </p>
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/50"></div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <button
                   onClick={playAI}
                   disabled={isRecording}
                   className={`flex items-center justify-center gap-3 py-5 rounded-[14px] font-bold text-lg transition-all duration-200 hover:-translate-y-1 ${
                     isPlaying ? "bg-blue-50 text-blue-600 border-2 border-[#3B82F6]/50 animate-pulse" : "bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6]/20 shadow-sm"
                   }`}
                >
                   <Volume2 className={`w-6 h-6 ${isPlaying ? 'animate-bounce' : ''}`} />
                   {isPlaying ? "AI is speaking..." : "Play Target Audio"}
                </button>

                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isPlaying}
                  className={`flex items-center justify-center gap-3 py-5 rounded-[14px] font-black text-lg transition-all duration-300 hover:-translate-y-1 ${
                    isRecording 
                      ? "bg-red-50 text-red-500 border-2 border-red-500 animate-pulse hover:shadow-[0_10px_25px_rgba(239,68,68,0.2)]" 
                      : "bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white hover:shadow-[0_10px_25px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:translate-y-0 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
                  }`}
                >
                  {isRecording ? <Square className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  {isRecording ? "Stop Recording" : "Shadow Now"}
                </button>
             </div>

             {transcript && (
               <div className="bg-surface-100 p-4 rounded-xl border border-surface-border mb-4">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Your Attempt</div>
                  <p className="text-gray-700 leading-relaxed font-medium">{transcript}</p>
               </div>
             )}

             {isAnalyzing && (
                <div className="text-accent-primary font-bold flex items-center justify-center gap-2 py-4 border-t border-surface-border">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Comparing your phonemes with Target Audio...
                </div>
             )}

             {pronunciationIssues && (
                <div className="bg-surface-100 p-6 rounded-2xl border border-surface-border mt-4 animate-in slide-in-from-bottom-4">
                   <h4 className="text-lg font-bold text-foreground mb-4 border-b border-surface-border pb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-accent-success" /> Phoneme & Fluency Check
                   </h4>
                   {pronunciationIssues.length === 0 ? (
                      <p className="text-accent-success font-bold text-lg">Incredible! Your shadowing matched the native speaker perfectly.</p>
                   ) : (
                      <div className="space-y-4">
                        <p className="text-gray-600 font-medium pb-2">Here is where your pronunciation deviated from the target:</p>
                        {pronunciationIssues.map((issue, idx) => (
                           <div key={idx} className="bg-surface-300 p-4 border border-surface-border rounded-xl">
                              <span className="text-accent-danger font-bold text-lg block mb-1">"{issue.word}"</span>
                              <span className="text-gray-700 block mb-2">{issue.issue}</span>
                              <span className="text-accent-success font-bold block text-sm bg-accent-success/10 p-2 rounded-lg">Target: {issue.suggestion}</span>
                           </div>
                        ))}
                      </div>
                   )}

                   {currentIndex < SHADOWING_SENTENCES.length - 1 && (
                      <button 
                         onClick={nextSentence}
                         className="w-full mt-6 py-4 bg-accent-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-colors"
                      >
                         Next Sentence
                      </button>
                   )}
                </div>
             )}
          </div>
      </div>
    </div>
  );
}
