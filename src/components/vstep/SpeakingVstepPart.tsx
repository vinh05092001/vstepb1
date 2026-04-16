"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Square, CheckCircle, Volume2, Timer } from "lucide-react";

interface Props {
  part: 1 | 2 | 3;
  prompt: string;
  onComplete: (transcript: string) => void;
  prepTime?: number; // in seconds, e.g., 60 for Part 2
  speakTime?: number; // in seconds, e.g., 120 for Part 2
}

export function SpeakingVstepPart({ part, prompt, onComplete, prepTime = 0, speakTime = 0 }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);
  const [isReadingQuestion, setIsReadingQuestion] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timerPhase, setTimerPhase] = useState<"idle" | "prep" | "speak">("idle");
  const [pronunciationIssues, setPronunciationIssues] = useState<any[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Stop reading if component unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer Tick
  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      if (timerPhase === "prep") {
         // Auto transition to speak phase
         startRecording();
      } else if (timerPhase === "speak") {
         // Auto stop recording
         stopRecording();
      }
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timeLeft, timerPhase]);

  const readQuestion = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(prompt);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      
      utterance.onstart = () => setIsReadingQuestion(true);
      utterance.onend = () => {
         setIsReadingQuestion(false);
         // If there is prep time, start the prep timer after reading
         if (prepTime > 0) {
           setTimerPhase("prep");
           setTimeLeft(prepTime);
         } else if (speakTime > 0) {
           startRecording();
         }
      };
      
      // Store utterance to prevent garbage collection which drops the onend event in Chrome
      // @ts-ignore
      window._latestUtterance = utterance;

      window.speechSynthesis.speak(utterance);
    }
  };

  const startRecording = () => {
    window.speechSynthesis.cancel(); // Stop TTS if student just hits record
    
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition. Please use Chrome.");
      return;
    }
    
    // @ts-ignore
    const rec = new window.webkitSpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(prev => prev + " " + finalTranscript);
      }
    };

    rec.start();
    setRecognition(rec);
    setIsRecording(true);
    setTimerPhase("speak");
    if (speakTime > 0) setTimeLeft(speakTime);
  };
  
  const toggleRecording = () => {
     if (isRecording) {
        stopRecording();
     } else {
        // If they click record during prep time, we skip prep and start now
        startRecording();
     }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsRecording(false);
    setTimerPhase("idle");
    setTimeLeft(null);

    // Auto-analyze pronunciation when stopping
    if (transcript.length > 10) {
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
       if (data.issues) {
          setPronunciationIssues(data.issues);
       }
    } catch (e) {
       console.error("Pronunciation API failed", e);
    } finally {
       setIsAnalyzing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    onComplete(transcript.trim());
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-[20px] border border-gray-100 flex flex-col h-full shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between mb-2">
         <div className="text-[#3B82F6] font-black text-sm tracking-wider uppercase">
           Speaking Part {part} Examiner
         </div>
         {timeLeft !== null && (
           <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold font-mono text-lg animate-in zoom-in ${
             timerPhase === "prep" ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-500"
           }`}>
             <Timer className="w-5 h-5" />
             {timerPhase === "prep" ? "PREP: " : "SPEAK: "} {formatTime(timeLeft)}
           </div>
         )}
      </div>

      <div className="bg-gray-50 p-6 md:p-8 rounded-[16px] border border-gray-100 mb-6 flex-1 flex flex-col justify-center shadow-inner">
        <p className="text-gray-800 text-xl md:text-2xl leading-relaxed whitespace-pre-wrap font-bold text-center">
          {prompt}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Play AI Voice Button */}
        <button
           onClick={readQuestion}
           disabled={isRecording || timerPhase === "prep"}
           className="flex items-center justify-center gap-2 py-4 rounded-[14px] font-black transition-all duration-200 bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 hover:-translate-y-1 shadow-sm hover:shadow-md disabled:opacity-50 disabled:translate-y-0 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-transparent disabled:shadow-none uppercase tracking-wider text-sm md:text-base"
        >
           <Volume2 className={`w-6 h-6 ${isReadingQuestion ? 'animate-pulse text-blue-500' : ''}`} />
           {isReadingQuestion ? "Examiner is speaking..." : "Read Question Aloud (Examiner)"}
        </button>

        {/* Huge Record Button for Mobile */}
        <button
          onClick={toggleRecording}
          disabled={isReadingQuestion && timerPhase !== "prep"}
          className={`flex items-center justify-center gap-3 py-6 md:py-8 rounded-[16px] font-black text-xl md:text-2xl transition-all duration-300 shadow-md hover:-translate-y-1 ${
            isRecording 
              ? "bg-red-50 text-red-500 border-2 border-red-500 animate-pulse hover:shadow-[0_10px_25px_rgba(239,68,68,0.2)]" 
              : "bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white hover:shadow-[0_10px_25px_rgba(59,130,246,0.3)] disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-500 disabled:translate-y-0 disabled:shadow-none"
          }`}
        >
          {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          {isRecording ? "Finish Recording" : timerPhase === "prep" ? "Skip Prep & Strike Now" : "Start Speaking"}
        </button>

        {transcript && (
          <div className="bg-blue-50/50 p-4 md:p-6 rounded-[16px] border border-blue-100 max-h-48 overflow-y-auto">
             <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2 flex justify-between">
                <span>Live Transcript</span>
                {transcript.split(" ").length} words
             </div>
             <p className="text-gray-700 leading-relaxed font-medium">{transcript}</p>
          </div>
        )}

        {isAnalyzing && (
           <div className="text-accent-secondary text-sm font-bold flex items-center justify-center gap-2 animate-pulse py-2">
             <div className="w-4 h-4 rounded-full border-2 border-accent-secondary border-t-transparent animate-spin"></div>
             Analyzing Pronunciation & Fluency...
           </div>
        )}

        {pronunciationIssues && pronunciationIssues.length > 0 && !isRecording && (
           <div className="bg-surface-100 p-4 rounded-xl border border-surface-border">
              <h4 className="text-sm font-bold text-accent-danger uppercase tracking-wider mb-3">Pronunciation Alerts</h4>
              <div className="space-y-3">
                 {pronunciationIssues.map((issue, idx) => (
                    <div key={idx} className="flex flex-col">
                       <span className="text-red-400 font-bold">"{issue.word}"</span>
                       <span className="text-gray-400 text-sm">{issue.issue}</span>
                       <span className="text-green-400 text-sm mt-1">Suggestion: {issue.suggestion}</span>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {transcript.length > 5 && !isRecording && !isAnalyzing && (
          <button 
            onClick={handleSubmit}
            className="w-full py-5 mt-2 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white font-bold text-lg rounded-[16px] hover:shadow-[0_10px_25px_rgba(16,185,129,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
          >
            <CheckCircle className="w-6 h-6" /> Submit Response
          </button>
        )}
      </div>
    </div>
  );
}
