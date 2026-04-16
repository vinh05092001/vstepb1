import { VstepTemplate } from "@/data/vstep-templates";

interface Props {
  template: VstepTemplate;
  onComplete: () => void;
}

export function TemplateReview({ template, onComplete }: Props) {
  return (
    <div className="bg-surface-200 p-6 rounded-2xl border border-surface-border">
      <h3 className="text-xl font-bold text-accent-primary mb-6 flex items-center gap-2">
        <span className="text-2xl">📖</span> 
        {template.title}
      </h3>
      
      <div className="space-y-4 mb-8 bg-surface-100 p-6 rounded-xl border border-surface-border">
        {template.content.map((line, idx) => {
          if (line.startsWith("[")) {
            return <div key={idx} className="text-accent-secondary font-bold text-sm tracking-wider uppercase mt-4">{line}</div>;
          }
          if (line.startsWith("(")) {
             return <div key={idx} className="text-gray-400 italic text-sm">{line}</div>;
          }
          if (line === "") return <div key={idx} className="h-2"></div>;
          
          return <div key={idx} className="text-foreground text-lg leading-relaxed">{line}</div>;
        })}
      </div>
      
      <button 
        onClick={onComplete}
        className="w-full py-4 bg-accent-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-colors"
      >
        I Have Memorized This Outline
      </button>
    </div>
  );
}
