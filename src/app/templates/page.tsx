"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, MessageCircle, PenLine, Mic, Square, CheckCircle, Volume2, Loader2, X } from "lucide-react";

const TEMPLATES = [
  {
    title: "Speaking Part 2 (Solution)",
    icon: <MessageCircle className="w-6 h-6" />,
    color: "blue",
    content: `I am going to talk about the situation.

All three options are reasonable but when choosing among three options, I believe that [option] is the best choice because of the following reasons.

Firstly, it is convenient and suitable.
Secondly, this option may bring me a wide range of benefits.
Thirdly, I like this option.
Finally, it is fast / safe / comfortable / interesting.

However, the other options are not as suitable.

Therefore, they are the reasons why I agree with this solution.`
  },
  {
    title: "Speaking Part 3 (Topic)",
    icon: <MessageCircle className="w-6 h-6" />,
    color: "blue",
    content: `It is a fact that [topic] plays an important role in our lives.

Firstly...
Secondly...
For example...
Finally...

I think these ideas are comprehensive.

To sum up, I strongly believe that [topic statement].`
  },
  {
    title: "Informal Letter (Task 1)",
    icon: <PenLine className="w-6 h-6" />,
    color: "purple",
    content: `Dear [Name],

How have you been? I hope everything is going well with you. I am writing this letter to...

[Body Paragraph 1 - Main Reason]
[Body Paragraph 2 - Details]

Anyway, I have to go now. I am looking forward to hearing from you soon.

Best wishes,
[Your Name]`
  },
  {
    title: "Formal Letter (Task 1)",
    icon: <PenLine className="w-6 h-6" />,
    color: "purple",
    content: `Dear Sir/Madam,

I am writing to express my [interest/concern/dissatisfaction] regarding...

I would like to point out that...
Additionally, it is important to note...

I would appreciate it if you could look into this matter at your earliest convenience.

Yours faithfully,
[Your Name]`
  }
];

export default function TemplatesPage() {
  const [activeTemplate, setActiveTemplate] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pronunciationIssues, setPronunciationIssues] = useState<any[] | null>(null);

  const startRecording = () => {
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
    setTranscript("");
    setPronunciationIssues(null);
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsRecording(false);

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

  if (activeTemplate !== null) {
      const tpl = TEMPLATES[activeTemplate];
      return (
        <div className="min-h-screen bg-background flex flex-col pb-10">
          <div className="bg-surface-100 p-4 flex items-center justify-between border-b border-surface-border shadow-sm sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveTemplate(null)} className="text-gray-500 hover:text-gray-800 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2 text-accent-primary font-bold text-lg">
                 Template Practice
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-8 flex flex-col h-full animate-in slide-in-from-right-8 mt-4">
              <div className="bg-surface-200 p-8 rounded-3xl border border-surface-border shadow-lg flex-1">
                 <div className="flex items-center gap-4 mb-6">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${tpl.color}-500/10 text-${tpl.color}-600`}>
                      {tpl.icon}
                   </div>
                   <h2 className="text-2xl font-bold text-foreground">{tpl.title}</h2>
                 </div>

                 <p className="text-gray-500 mb-4 font-bold tracking-wider uppercase text-sm">Read this aloud:</p>
                 <div className="bg-surface-300 p-6 rounded-2xl border border-surface-border mb-8">
                    <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed text-lg font-medium">
                      {tpl.content}
                    </pre>
                 </div>

                 <div className="flex flex-col gap-4">
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`flex items-center justify-center gap-3 py-6 rounded-2xl font-black text-xl transition-all shadow-md ${
                        isRecording 
                          ? "bg-accent-danger/20 text-accent-danger border-2 border-accent-danger animate-pulse" 
                          : "bg-accent-primary text-white hover:bg-blue-600"
                      }`}
                    >
                      {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                      {isRecording ? "Stop Reading" : "Start Practice Aloud"}
                    </button>

                    {transcript && (
                      <div className="bg-surface-100 p-4 rounded-xl border border-surface-border max-h-48 overflow-y-auto mt-4">
                         <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Live Transcript</div>
                         <p className="text-gray-700 leading-relaxed">{transcript}</p>
                      </div>
                    )}

                    {isAnalyzing && (
                       <div className="text-accent-primary font-bold flex items-center justify-center gap-2 animate-pulse py-4 mt-2">
                         <Loader2 className="w-6 h-6 animate-spin" />
                         Analyzing Pronunciation & Fluency...
                       </div>
                    )}

                    {pronunciationIssues && (
                       <div className="bg-surface-100 p-6 rounded-2xl border border-surface-border mt-4">
                          <h4 className="text-lg font-bold text-foreground mb-4 border-b border-surface-border pb-2 flex items-center gap-2">
                             <CheckCircle className="w-5 h-5 text-accent-success" /> AI Evaluation Results
                          </h4>
                          {pronunciationIssues.length === 0 ? (
                             <p className="text-accent-success font-bold text-lg">Perfect pronunciation detected! Awesome job.</p>
                          ) : (
                             <div className="space-y-4">
                               <p className="text-gray-600 font-medium">We found a few areas to improve. Pay attention to sentence stress and intonation.</p>
                               {pronunciationIssues.map((issue, idx) => (
                                  <div key={idx} className="bg-surface-300 p-4 border border-surface-border rounded-xl">
                                     <span className="text-accent-danger font-bold text-lg block mb-1">"{issue.word}"</span>
                                     <span className="text-gray-700 block mb-2">{issue.issue}</span>
                                     <span className="text-accent-success font-bold block text-sm bg-accent-success/10 p-2 rounded-lg">Suggestion: {issue.suggestion}</span>
                                  </div>
                               ))}
                             </div>
                          )}
                       </div>
                    )}
                 </div>
              </div>
          </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-10">
      <div className="bg-surface-100 p-4 flex items-center justify-between border-b border-surface-border shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2 text-accent-primary font-bold text-lg">
             <BookOpen className="w-5 h-5" /> VSTEP Templates Review
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-4">Core Exam Frameworks</h1>
          <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">
            Memorize these strict structures. Using these templates guarantees you will score high on Coherence and Task Achievement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {TEMPLATES.map((tpl, i) => (
             <div key={i} className={`bg-surface-200 border border-surface-border rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}>
                <div className={`absolute top-0 left-0 w-full h-1 bg-${tpl.color}-500/50 group-hover:bg-${tpl.color}-500 transition-colors`}></div>
                <div className="flex items-center gap-4 mb-6">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${tpl.color}-500/10 text-${tpl.color}-600`}>
                      {tpl.icon}
                   </div>
                   <h2 className="text-2xl font-bold text-foreground">{tpl.title}</h2>
                </div>
                <div className="bg-surface-300 p-6 rounded-2xl border border-surface-border">
                   <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-lg">
                     {tpl.content}
                   </pre>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
