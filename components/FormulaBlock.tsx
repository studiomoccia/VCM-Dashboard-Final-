
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface FormulaBlockProps {
  label: string;
  formula: string;
  calculation: string;
  extraFormula?: string;
  extraCalculation?: string;
}

const FormulaBlock: React.FC<FormulaBlockProps> = ({ 
  label, 
  formula, 
  calculation, 
  extraFormula, 
  extraCalculation 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-4 pt-3 border-t border-white/20 dark:border-white/10 text-xs">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 p-1 rounded transition-colors w-full text-left"
      >
        <ChevronRight 
          size={14} 
          className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} 
        />
        <span className="font-semibold opacity-90">{label}</span>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-48 mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="space-y-2 px-2">
          <div className="font-mono opacity-80 leading-relaxed italic">{formula}</div>
          <div className="font-mono font-medium bg-black/10 dark:bg-white/5 px-2 py-1.5 rounded-md leading-normal">
            {calculation}
          </div>
          
          {extraFormula && (
            <>
              <div className="font-mono opacity-80 leading-relaxed italic mt-3">{extraFormula}</div>
              <div className="font-mono font-medium bg-black/10 dark:bg-white/5 px-2 py-1.5 rounded-md leading-normal">
                {extraCalculation}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormulaBlock;
