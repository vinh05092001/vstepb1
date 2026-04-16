import React from "react";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "bot" | "system";
  content: string;
  isTyping?: boolean;
}

export function ChatMessage({ role, content, isTyping }: ChatMessageProps) {
  if (role === "system") {
    return (
      <div className="w-full flex justify-center my-4">
         <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide">
           {content}
         </span>
      </div>
    );
  }

  const isUser = role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-4`}>
       <div className={`flex max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"} items-end gap-2`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? "bg-blue-500 text-white" : "bg-green-500 text-white"}`}>
            {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
          </div>
          
          <div className={`px-5 py-3 rounded-2xl text-lg ${
            isUser ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none border-2 border-transparent"
          }`}>
            {isTyping ? (
               <div className="flex gap-1 items-center h-6">
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
               </div>
            ) : (
              <div className="whitespace-pre-wrap">{content}</div>
            )}
          </div>
       </div>
    </div>
  );
}
