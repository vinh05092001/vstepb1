"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Timer, Award } from "lucide-react";
import { SpeakingVstepPart } from "@/components/vstep/SpeakingVstepPart";
import { useGlobalState } from "@/store/GlobalStateContext";

type ExamPhase = "intro" | "part1" | "part2" | "part3" | "scoring" | "results";

const PART1_TOPICS = {
  hometown: ["What is your hometown like?", "How long have you lived there?", "What do you like most about your hometown?"],
  "daily life": ["What do you usually do in your free time?", "How often do you listen to music?", "Do you think learning English is important?"],
  family: ["How many people are there in your family?", "What do you usually do with your family?", "Why is family important to you?"],
  food: ["What is your favorite food?", "Do you prefer home cooking or eating out?", "Do you think people should eat healthy food?"],
  music: ["How often do you listen to music?", "What kind of music do you like?", "Do you play any musical instruments?"],
  sports: ["Do you often play sports?", "What is your favorite sport?", "Do you think playing sports is good for health?"],
  education: ["What is your major?", "Why did you choose to study that subject?", "What do you like most about your school?"],
  travel: ["Do you like traveling?", "What is the most beautiful place you have visited?", "Do you prefer traveling alone or with friends?"]
};

const PART2_SITUATIONS = [
  { situation: "Your family is planning a trip from Danang to Hanoi.", options: ["taking the train", "flying by plane", "going by coach"] },
  { situation: "You are going to travel abroad for the first time. You need to choose a destination.", options: ["a modern city", "a historic town", "a tropical beach"] },
  { situation: "Your best friend is getting married. You want to buy a wedding gift.", options: ["a set of kitchen appliances", "a painting", "cash"] },
  { situation: "You want to take up a new hobby to relax after work.", options: ["learning to play the guitar", "joining a photography club", "practicing yoga"] },
  { situation: "You are organizing a farewell party for a colleague.", options: ["a seafood restaurant", "a vegetarian buffet", "a local pub"] },
  { situation: "You are looking for a quiet place to study for the final exams.", options: ["the university library", "a coffee shop", "your bedroom"] }
];

const PART3_TOPICS = [
  { topic: "Education plays an important role in our lives.", questions: ["Do you think reading is important for teenagers?", "How has the internet affected modern education?", "What are the qualities of a good teacher?"] },
  { topic: "Protecting the environment is everyone's responsibility.", questions: ["What can individuals do to protect the environment?", "Do you think public transport helps reduce pollution?", "How does climate change affect our daily lives?"] },
  { topic: "Technology has changed the way we communicate.", questions: ["Do you prefer texting or calling?", "How has social media impacted real-life relationships?", "What are the disadvantages of spending too much time online?"] },
  { topic: "Maintaining a healthy lifestyle is crucial for success.", questions: ["How important is regular exercise?", "What is a healthy diet in your opinion?", "How does stress affect physical health?"] }
];

export default function ExamSimulationPage() {
  const { updateSpeakingScore } = useGlobalState();
  const [phase, setPhase] = useState<ExamPhase>("intro");
  
  // State for sequencing through questions
  const [part1Idx, setPart1Idx] = useState(0);
  const [part3Idx, setPart3Idx] = useState(0);
  
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [isScoring, setIsScoring] = useState(false);
  const [results, setResults] = useState<any>(null);

  const [examPrompts, setExamPrompts] = useState<any>(null);

  useEffect(() => {
    const fetchExam = async () => {
       try {
          const res = await fetch("/api/generate-exam-topics");
          const data = await res.json();
          if (data.status === "fallback" || data.error) {
              setupHardcodedFallback();
              return;
          }

          const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
          const p1 = data.part1;
          const formattedPrompt = `Situation 1: ${capitalize(p1[0].topic)}
1. ${p1[0].questions[0]}
2. ${p1[0].questions[1]}
3. ${p1[0].questions[2]}

Situation 2: ${capitalize(p1[1].topic)}
4. ${p1[1].questions[0]}
5. ${p1[1].questions[1]}
6. ${p1[1].questions[2]}`;

          setExamPrompts({
             part1: [formattedPrompt],
             part2: data.part2,
             part3: data.part3
          });
       } catch (err) {
          setupHardcodedFallback();
       }
    };

    const setupHardcodedFallback = () => {
      const topics = Object.keys(PART1_TOPICS);
      topics.sort(() => 0.5 - Math.random());
      const selectedTopics = topics.slice(0, 2);
      
      const situation1Topic = selectedTopics[0];
      const situation2Topic = selectedTopics[1];

      const sit1Questions = PART1_TOPICS[situation1Topic as keyof typeof PART1_TOPICS];
      const sit2Questions = PART1_TOPICS[situation2Topic as keyof typeof PART1_TOPICS];

      const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

      const formattedPrompt = `Situation 1: ${capitalize(situation1Topic)}
1. ${sit1Questions[0]}
2. ${sit1Questions[1]}
3. ${sit1Questions[2]}

Situation 2: ${capitalize(situation2Topic)}
4. ${sit2Questions[0]}
5. ${sit2Questions[1]}
6. ${sit2Questions[2]}`;

      setExamPrompts({
        part1: [formattedPrompt],
        part2: PART2_SITUATIONS[Math.floor(Math.random() * PART2_SITUATIONS.length)],
        part3: PART3_TOPICS[Math.floor(Math.random() * PART3_TOPICS.length)]
      });
    };

    fetchExam();
  }, []);

  const startExam = () => setPhase("part1");

  const submitToAPI = async (finalTranscripts: string[]) => {
     setPhase("scoring");
     setIsScoring(true);

     // Consolidate the exam text
     const promptText = `
       PART 1 (5 Questions):
       ${examPrompts.part1.map((q: string, i: number) => `Q: ${q}\nA: ${finalTranscripts[i] || "No response"}`).join("\n")}
       
       PART 2 (Situation):
       Q: ${examPrompts.part2.situation}
       A: ${finalTranscripts[5] || "No response"}
       
       PART 3 (Discussion):
       Q: ${examPrompts.part3.topic}
       ${examPrompts.part3.questions.map((q: string, i: number) => `SubQ: ${q}\nA: ${finalTranscripts[6+i] || "No response"}`).join("\n")}
     `;

     try {
       const res = await fetch("/api/speaking-feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: "Evaluate entire simulated VSTEP speaking exam covering Part 1, Part 2, and Part 3.", 
            transcript: promptText 
          })
       });
       const data = await res.json();
       
       if (data.status === "fallback") {
         setResults({ 
            score: null, 
            genericFeedback: "The AI Examiner service is temporarily unavailable due to server capacity limits. Your exam transcript was recorded successfully, but scoring is paused.", 
            detailedFeedback: "Please try again later when AI limits reset." 
         });
       } else {
         setResults(data);
         if (data.score) updateSpeakingScore(data.score);
       }
     } catch(e) {
       console.error("Exam scoring failed", e);
       setResults({ score: null, genericFeedback: "Network Error: Could not score exam.", detailedFeedback: "An unexpected error occurred." });
     } finally {
       setIsScoring(false);
       setPhase("results");
     }
  };

  const handleNextPart1 = (transcript: string) => {
    const nextArr = [...transcripts, transcript];
    setTranscripts(nextArr);
    if (part1Idx < examPrompts.part1.length - 1) {
       setPart1Idx(prev => prev + 1);
    } else {
       setPhase("part2");
    }
  };

  const handleNextPart2 = (transcript: string) => {
    setTranscripts([...transcripts, transcript]);
    setPhase("part3");
  };

  const handleNextPart3 = (transcript: string) => {
    const nextArr = [...transcripts, transcript];
    setTranscripts(nextArr);
    if (part3Idx < examPrompts.part3.questions.length - 1) {
      setPart3Idx(prev => prev + 1);
    } else {
      // Test is finished
      submitToAPI(nextArr);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-10">
      <div className="bg-white p-4 flex items-center justify-between border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2 text-[#EF4444] font-black text-lg">
             <Timer className="w-6 h-6" /> LIVE EXAM SIMULATION
          </div>
        </div>
        {phase !== "intro" && phase !== "results" && phase !== "scoring" && (
           <div className="px-3 py-1 bg-red-50 rounded-full text-xs font-bold text-[#EF4444] uppercase tracking-wider">
             Test in Progress
           </div>
        )}
      </div>

      <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-8 flex flex-col">
        {phase === "intro" && (
           <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 mt-[-40px]">
             <div className="w-28 h-28 bg-red-50 rounded-full flex items-center justify-center mb-8 border-4 border-red-100 shadow-xl shadow-red-500/10">
               <span className="text-5xl text-[#EF4444]">🚨</span>
             </div>
             <h1 className="text-4xl font-black text-gray-800 mb-4">Speaking Exam Room</h1>
             <p className="text-gray-500 text-lg mb-10 max-w-md font-medium">
               This will simulate a full, uninterrupted VSTEP Speaking Test with an AI Examiner. 
               Ensure you are in a quiet place.
             </p>
             
             <div className="w-full max-w-md space-y-4 mb-10 text-left bg-white p-8 rounded-[20px] border border-gray-100 shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
                <div className="text-gray-700 font-bold flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Part 1: Social Interaction (3 mins)</div>
                <div className="text-gray-700 font-bold flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-[#8B5CF6]"></div> Part 2: Solution Discussion (1m prep, 2m speak)</div>
                <div className="text-gray-700 font-bold flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-[#10B981]"></div> Part 3: Topic Development (1m prep, 3m speak)</div>
             </div>

             <button onClick={startExam} disabled={!examPrompts} className="w-full max-w-md py-5 bg-gradient-to-r from-[#EF4444] to-[#F87171] hover:shadow-[0_10px_25px_rgba(239,68,68,0.3)] text-white font-black text-xl rounded-[16px] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none uppercase tracking-widest">
               <Play className="w-6 h-6 fill-current" /> {examPrompts ? "Enter Exam Room" : "Loading Exam..."}
             </button>
           </div>
        )}

        {phase === "part1" && (
           <div className="flex-1 animate-in slide-in-from-right-8 flex flex-col h-full">
             <div className="mb-4 text-slate-500 font-bold uppercase tracking-wider text-sm flex justify-between items-center">
                <span className="text-blue-500">Part 1: Social Interaction</span>
                <span className="bg-white px-3 py-1 rounded-lg text-slate-600 border border-slate-200 shadow-sm">Question {part1Idx + 1} / {examPrompts.part1.length}</span>
             </div>
             <SpeakingVstepPart 
                key={`p1-${part1Idx}`}
                part={1} 
                prompt={examPrompts.part1[part1Idx]} 
                onComplete={handleNextPart1} 
                speakTime={180} // 3 mins total for 6 questions
             />
           </div>
        )}

        {phase === "part2" && (
           <div className="flex-1 animate-in slide-in-from-right-8 flex flex-col h-full">
             <div className="mb-4 text-purple-500 font-bold uppercase tracking-wider text-sm">
                Part 2: Solution Discussion
             </div>
             <SpeakingVstepPart 
                key="p2"
                part={2} 
                prompt={`Situation:\n${examPrompts.part2.situation}\n\nOptions:\n- ${examPrompts.part2.options.join("\n- ")}`} 
                onComplete={handleNextPart2} 
                prepTime={30} // 30s strict prep
                speakTime={60} // 60s strict speaking
             />
           </div>
        )}

        {phase === "part3" && (
           <div className="flex-1 animate-in slide-in-from-right-8 flex flex-col h-full">
             <div className="mb-4 text-emerald-500 font-bold uppercase tracking-wider text-sm flex justify-between items-center">
                <span>Part 3: Topic Development</span>
                <span className="bg-white px-3 py-1 rounded-lg text-slate-600 border border-slate-200 shadow-sm">Discussion {part3Idx + 1} / {examPrompts.part3.questions.length}</span>
             </div>
             <SpeakingVstepPart 
                key={`p3-${part3Idx}`}
                part={3} 
                prompt={`Theme: ${examPrompts.part3.topic}\n\nExaminer: ${examPrompts.part3.questions[part3Idx]}`} 
                onComplete={handleNextPart3} 
                speakTime={80} // 4 mins / 3 questions = 80s
             />
           </div>
        )}

        {phase === "scoring" && (
           <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95">
             <div className="w-20 h-20 border-4 border-red-100 border-t-[#EF4444] rounded-full animate-spin mb-8 shadow-sm"></div>
             <h2 className="text-3xl font-black text-gray-800 mb-4">Evaluating Answers...</h2>
             <p className="text-gray-500 max-w-md text-center">
               The AI Examiner is analyzing your pronunciation, fluency, and vocabulary usage across the entire exam.
             </p>
           </div>
        )}

        {phase === "results" && (
           <div className="animate-in slide-in-from-bottom-8 space-y-6">
              <div className="text-center mb-10 bg-white p-8 rounded-[20px] border border-gray-100 shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
                 <h2 className="text-3xl font-black text-gray-800 mb-6 uppercase tracking-wider">Overall Speaking Band</h2>
                 <div className="flex items-baseline justify-center gap-2">
                   <span className="text-8xl font-black text-[#EF4444]">{results?.score ?? "?"}</span>
                   <span className="text-2xl text-gray-400 font-bold">/ 10</span>
                 </div>
                 {results?.score >= 5 ? 
                    <div className="mt-6 inline-flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-full font-bold uppercase tracking-wider"><Award className="w-5 h-5" /> B1 Target Achieved</div> 
                    : results?.score !== null ?
                    <div className="mt-6 inline-flex items-center gap-2 bg-red-100 text-red-600 px-6 py-3 rounded-full font-bold uppercase tracking-wider">Below B1 Target</div>
                    : <div className="mt-6 inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-6 py-3 rounded-full font-bold uppercase tracking-wider">Scoring Unavailable</div>
                 }
              </div>

              <div className="bg-white p-8 rounded-[20px] border border-gray-100 shadow-[0_10px_25px_rgba(0,0,0,0.08)] mb-6">
                 <h3 className="text-2xl font-black text-gray-800 mb-6 border-b border-gray-100 pb-4">Examiner Feedback</h3>
                 <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg bg-red-50/50 p-6 rounded-[16px] italic border border-red-100">
                   "{results?.genericFeedback || "No feedback text available."}"
                 </div>
                 {results?.detailedFeedback && (
                   <div className="mt-6 text-gray-600 whitespace-pre-wrap leading-relaxed text-[15px] bg-gray-50 p-6 rounded-[16px] border border-gray-200">
                     <h4 className="font-bold text-gray-800 mb-2">Detailed Notes:</h4>
                     {results.detailedFeedback}
                   </div>
                 )}
              </div>

              <Link href="/" className="w-full py-5 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm text-gray-700 font-bold text-lg rounded-[16px] transition-all duration-200 flex items-center justify-center uppercase tracking-wider hover:-translate-y-1">
                 Return to Dashboard
              </Link>
           </div>
        )}
      </div>
    </div>
  );
}
