import React, { useState } from 'react'
import { ChoiceQuestion } from '../../types'
import { HelpCircle, Check, Send } from 'lucide-react'

interface ChoiceQuestionnaireCardProps {
  questionnaire: ChoiceQuestion
  onAnswer: (answers: string[]) => void
}

export const ChoiceQuestionnaireCard: React.FC<ChoiceQuestionnaireCardProps> = ({
  questionnaire,
  onAnswer,
}) => {
  const [selected, setSelected] = useState<string[]>(questionnaire.selected || [])
  const isMulti = questionnaire.isMultiSelect || false

  const handleToggle = (option: string) => {
    if (isMulti) {
      if (selected.includes(option)) {
        setSelected(selected.filter((item) => item !== option))
      } else {
        setSelected([...selected, option])
      }
    } else {
      setSelected([option])
    }
  }

  const handleSubmit = () => {
    if (selected.length > 0) {
      onAnswer(selected)
    }
  }

  return (
    <div className="my-3 rounded-lg border border-indigo-500/30 bg-[#0e1222] p-3.5 text-xs shadow-lg">
      <div className="flex items-start space-x-2.5 mb-2.5">
        <HelpCircle className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
        <div>
          <div className="font-semibold text-slate-100 text-sm">
            {questionnaire.question}
          </div>
          <div className="text-[11px] text-slate-400">
            {isMulti ? 'Select all options that apply' : 'Select an option to guide the agent'}
          </div>
        </div>
      </div>

      <div className="space-y-1.5 mt-2">
        {questionnaire.options.map((option, idx) => {
          const isSelected = selected.includes(option)
          return (
            <button
              key={idx}
              onClick={() => handleToggle(option)}
              className={`w-full text-left px-3 py-2 rounded-md border flex items-center justify-between transition-all ${
                isSelected
                  ? 'border-indigo-400/80 bg-indigo-950/60 text-indigo-100 shadow-sm'
                  : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <span className="font-mono text-[12px]">{option}</span>
              <div
                className={`w-4 h-4 rounded ${
                  isMulti ? 'rounded' : 'rounded-full'
                } border flex items-center justify-center ${
                  isSelected
                    ? 'border-indigo-400 bg-indigo-500 text-slate-950'
                    : 'border-slate-600 bg-transparent'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={selected.length === 0}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-xs transition-colors"
        >
          <Send className="w-3 h-3" />
          Confirm & Proceed
        </button>
      </div>
    </div>
  )
}
