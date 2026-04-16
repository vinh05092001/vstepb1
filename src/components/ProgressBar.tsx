import React from "react";

interface ProgressBarProps {
  progress: number; // 0 to 100
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
      <div 
        className="bg-green-500 h-full transition-all duration-500" 
        style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
      />
    </div>
  );
}
