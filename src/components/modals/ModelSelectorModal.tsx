import React from 'react'
import { AVAILABLE_MODELS } from '../../data/initialData'
import { X, Check, Brain, Sliders } from 'lucide-react'

interface ModelSelectorModalProps {
  currentModelId: string
  onSelectModel: (modelId: string) => void
  thinkingBudget: number
  onChangeThinkingBudget: (budget: number) => void
  onClose: () => void
}

export const ModelSelectorModal: React.FC<ModelSelectorModalProps> = ({
  currentModelId,
  onSelectModel,
  thinkingBudget,
  onChangeThinkingBudget,
  onClose,
}) => {
  const BUDGET_OPTIONS = [0, 1024, 4096, 8192, 16384, 32768, 65536]

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-[#0C1322] border border-cyan-500/30 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#10182B] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-100 text-sm">
              Model & Reasoning Configuration (Oct 2026)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Models list */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-2 block">
              Select Agentic Model Engine
            </label>
            <div className="space-y-2">
              {AVAILABLE_MODELS.map((model) => {
                const isSelected = model.id === currentModelId
                return (
                  <div
                    key={model.id}
                    onClick={() => onSelectModel(model.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/30 text-cyan-100'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm font-mono">{model.name}</span>
                        <span className="text-xs font-mono text-slate-400 tabular-nums">
                          · {model.releaseTag} · {model.contextWindow}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-cyan-400 stroke-[3]" />}
                    </div>
                    <div className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {model.description}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Thinking Budget Selector */}
          <div className="border-t border-slate-800 pt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200">
                  Extended Thinking Token Budget
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-cyan-300 tabular-nums">
                {thinkingBudget === 0
                  ? 'Disabled (0 tokens)'
                  : `${thinkingBudget.toLocaleString()} tokens`}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Allocates dedicated reasoning budget for multi-step architectural verification before executing tools.
            </p>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 font-mono tabular-nums">
              {BUDGET_OPTIONS.map((val) => (
                <button
                  key={val}
                  onClick={() => onChangeThinkingBudget(val)}
                  className={`py-1.5 text-center text-[11px] rounded border transition-colors ${
                    thinkingBudget === val
                      ? 'border-cyan-400 bg-cyan-500 text-slate-950 font-bold'
                      : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  {val === 0 ? 'Off' : `${val >= 1024 ? val / 1024 + 'k' : val}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#10182B] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded transition-colors"
          >
            Apply Configuration
          </button>
        </div>
      </div>
    </div>
  )
}
