import { useState, useEffect, useCallback } from "react";

export function useSpeechRecognition() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rcg = new SpeechRecognition();
        rcg.continuous = false;
        rcg.interimResults = true;
        rcg.lang = "en-US";

        rcg.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        rcg.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };

        rcg.onend = () => {
          setIsRecording(false);
        };

        setRecognition(rcg);
      } else {
        console.warn("Speech Recognition API not supported in this browser.");
      }
    }
  }, []);

  const startRecording = useCallback(() => {
    setTranscript("");
    setIsRecording(true);
    if (recognition) {
       try { recognition.start(); } catch (e) { console.error(e); setIsRecording(false); }
    }
  }, [recognition]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (recognition) recognition.stop();
  }, [recognition]);

  return {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
    hasSupport: !!recognition
  };
}
