"use client";

import React, { useEffect, useState } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { Mic, Square, Loader2, Play, Volume2 } from "lucide-react";
import { motion } from "framer-motion";

interface SpeakingRecorderProps {
  targetSentence?: string; 
  onAnalysisComplete?: (results: any) => void;
}

export function SpeakingRecorder({ targetSentence, onAnalysisComplete }: SpeakingRecorderProps) {
  const { isRecording, transcript, startRecording, stopRecording, hasSupport } = useSpeechRecognition();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [localFeedback, setLocalFeedback] = useState<string | null>(null);

  // We stop capturing audio when user stops recording, then send to API.
  const handleStop = async () => {
    stopRecording();
    if (!transcript.trim()) return;

    analyzePronunciationLocally(transcript);

    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/speaking-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, targetSentence }),
      });
      
      const data = await res.json();
      if (onAnalysisComplete) {
         onAnalysisComplete(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzePronunciationLocally = (text: string) => {
     // Do some basic local checks for specific sounds like th, r, l, v, w based on common misspellings when spoken
     const lowerText = text.toLowerCase();
     let feedback = "";
     
     // Very naive heuristic since we don't have phoneme access (Browser API only gives text)
     // But we simulate it by checking commonly misheard transcripts.
     if (targetSentence) {
        if (targetSentence.toLowerCase().includes("three") && lowerText.includes("tree")) {
           feedback = 'Your pronunciation of "three" sounds like "tree". Try placing your tongue between your teeth for the "th" sound.';
        } else if (targetSentence.toLowerCase().includes("very") && lowerText.includes("berry")) {
           feedback = 'Your pronunciation of the "v" sound sounded like "b". Make sure your top teeth touch your bottom lip for "v".';
        } else if (targetSentence.toLowerCase().includes("light") && lowerText.includes("right")) {
           feedback = 'Your "l" sound was interpreted as "r". Keep the tip of your tongue behind your top teeth.';
        }
     }
     if (feedback) setLocalFeedback(feedback);
  };

  if (!hasSupport) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm border-2 border-red-200">
        Your browser doesn't support the web speech API. Try using Chrome.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-4 bg-white p-6 rounded-[20px] border border-gray-100 shadow-[0_8px_20px_rgba(0,0,0,0.06)] relative overflow-hidden">
      
      {targetSentence && (
        <div className="w-full text-center mb-4">
          <p className="text-gray-500 text-sm font-bold uppercase tracking-wide mb-2">Say this phrase:</p>
          <div className="flex items-center justify-center gap-2">
            <Volume2 className="w-5 h-5 text-blue-500" />
            <p className="text-xl font-bold text-gray-800">"{targetSentence}"</p>
          </div>
        </div>
      )}

      {/* Mic Button Wrapper */}
      <div className="relative">
         {isRecording && (
            <motion.div 
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute inset-0 bg-blue-500 rounded-full"
            />
         )}
         <button
            onClick={isRecording ? handleStop : startRecording}
            disabled={isAnalyzing}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isRecording 
                ? "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]" 
                : "bg-blue-500 hover:bg-blue-600 text-white shadow-[0_8px_0_theme(colors.blue.700)] hover:-translate-y-1 hover:shadow-[0_10px_0_theme(colors.blue.700)] active:translate-y-2 active:shadow-none"
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none`}
          >
            {isAnalyzing ? (
              <Loader2 className="w-10 h-10 animate-spin" />
            ) : isRecording ? (
              <Square className="w-8 h-8 fill-current" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </button>
      </div>

      <p className="text-gray-500 font-bold min-h-[24px]">
        {isRecording ? "Listening..." : isAnalyzing ? "Analyzing..." : "Tap to Speak"}
      </p>

      {transcript && (
        <div className="w-full mt-4 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
           <p className="text-gray-600 text-sm mb-1 uppercase tracking-wide font-bold">You said:</p>
           <p className="text-gray-800 text-lg">"{transcript}"</p>
        </div>
      )}

      {localFeedback && (
        <div className="w-full mt-2 p-4 bg-orange-50 text-orange-700 rounded-xl border-2 border-orange-200">
          <p className="font-bold mb-1">Pronunciation Tip 💡</p>
          <p className="text-sm">{localFeedback}</p>
        </div>
      )}
    </div>
  );
}
