import React from 'react'
import { X, Check } from 'lucide-react'

interface UnifiedDiffViewerProps {
  filename: string
  oldContent: string
  newContent: string
  onClose: () => void
  onApply?: () => void
}

export const UnifiedDiffViewer: React.FC<UnifiedDiffViewerProps> = ({
  filename,
  oldContent,
  newContent,
  onClose,
  onApply,
}) => {
  const oldLines = oldContent.split('\n')
  const newLines = newContent.split('\n')

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="w-full max-w-4xl bg-[#0C1220] border border-slate-700 rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-[#11192B] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold text-cyan-300 text-sm">Unified Diff:</span>
            <span className="font-mono text-xs text-slate-300">{filename}</span>
          </div>
          <div className="flex items-center space-x-2">
            {onApply && (
              <button
                onClick={onApply}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded flex items-center gap-1 transition-colors"
              >
                <Check className="w-3.5 h-3.5" /> Accept Changes
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Diff content comparison */}
        <div className="flex-1 overflow-auto p-4 font-mono text-xs space-y-0.5 bg-[#080D17] tabular-nums">
          {newLines.map((line, idx) => {
            const isAdded = !oldLines.includes(line)
            return (
              <div
                key={idx}
                className={`flex px-2 py-0.5 rounded ${
                  isAdded
                    ? 'bg-emerald-950/50 text-emerald-300'
                    : 'text-slate-300 hover:bg-slate-900/60'
                }`}
              >
                <span className="w-8 text-slate-600 select-none">{idx + 1}</span>
                <span className="w-4 select-none font-bold text-emerald-400">
                  {isAdded ? '+' : ' '}
                </span>
                <span className="whitespace-pre overflow-x-auto">{line}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
