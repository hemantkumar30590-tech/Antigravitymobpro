import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Brain, Clock } from 'lucide-react'

interface ThinkingAccordionProps {
  thinking: string
  durationSeconds?: number
}

export const ThinkingAccordion: React.FC<ThinkingAccordionProps> = ({
  thinking,
  durationSeconds = 1.8,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="my-2 rounded-lg border border-cyan-500/20 bg-cyan-950/20 overflow-hidden text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 flex items-center justify-between text-cyan-300 hover:bg-cyan-900/30 transition-colors text-left"
      >
        <div className="flex items-center space-x-2">
          <Brain className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold tracking-wide">Thought Process</span>
          <span className="text-cyan-500/70 font-mono text-[11px] flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {durationSeconds.toFixed(1)}s
          </span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
        )}
      </button>

      {isOpen && (
        <div className="px-3 py-2.5 bg-black/40 border-t border-cyan-500/10 text-cyan-200/90 font-mono text-[11.5px] leading-relaxed whitespace-pre-wrap select-text">
          {thinking}
        </div>
      )}
    </div>
  )
}
