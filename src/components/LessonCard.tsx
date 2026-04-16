import React from "react";
import Link from "next/link";
import { Star, Lock } from "lucide-react";

interface LessonCardProps {
  topic: string;
  isLocked: boolean;
  colorTheme: "green" | "blue" | "purple";
}

export function LessonCard({ topic, isLocked, colorTheme }: LessonCardProps) {
  const getColors = () => {
    switch(colorTheme) {
      case "green": return "bg-green-500 border-green-600 hover:bg-green-400";
      case "blue": return "bg-blue-500 border-blue-600 hover:bg-blue-400";
      case "purple": return "bg-purple-500 border-purple-600 hover:bg-purple-400";
      default: return "bg-gray-400 border-gray-500";
    }
  };

  const content = (
    <div className="flex flex-col items-center group relative">
      <div className={`
        w-20 h-20 rounded-full flex items-center justify-center
        border-b-[6px] transition-all
        ${isLocked ? "bg-gray-300 border-gray-400 cursor-not-allowed" : `${getColors()} active:border-b-0 active:translate-y-[6px] cursor-pointer`}
      `}>
        {isLocked ? (
          <Lock className="w-8 h-8 text-white opacity-90" />
        ) : (
          <Star className="w-8 h-8 text-white fill-current opacity-90 group-hover:scale-110 transition-transform" />
        )}
      </div>
      <span className={`mt-3 font-bold text-center tracking-wide ${isLocked ? "text-gray-400" : "text-gray-700"}`}>
        {topic}
      </span>
    </div>
  );

  if (isLocked) {
    return <div>{content}</div>;
  }

  return (
    <Link href={`/lesson/${encodeURIComponent(topic)}`}>
      {content}
    </Link>
  );
}
