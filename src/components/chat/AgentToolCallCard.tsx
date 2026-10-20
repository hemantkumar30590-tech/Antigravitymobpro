import React, { useState } from 'react'
import { ToolCall } from '../../types'
import { Terminal, CheckCircle2, AlertCircle, Clock, ChevronDown, ChevronRight, Play } from 'lucide-react'

interface AgentToolCallCardProps {
  toolCall: ToolCall
  onApprove?: (id: string) => void
  onDeny?: (id: string) => void
}

export const AgentToolCallCard: React.FC<AgentToolCallCardProps> = ({
  toolCall,
  onApprove,
  onDeny,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusBadge = () => {
    switch (toolCall.status) {
      case 'success':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3" />
            COMPLETED
          </span>
        )
      case 'error':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-rose-400 bg-rose-950/40 border border-rose-500/30 px-2 py-0.5 rounded">
            <AlertCircle className="w-3 h-3" />
            FAILED
          </span>
        )
      case 'approval_required':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded animate-pulse">
            <Clock className="w-3 h-3" />
            APPROVAL REQUIRED
          </span>
        )
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded">
            <Play className="w-3 h-3 animate-spin" />
            RUNNING
          </span>
        )
    }
  }

  return (
    <div className="my-2.5 rounded-lg border border-slate-700/70 bg-[#0d131f] overflow-hidden text-xs shadow-md">
      {/* Header bar */}
      <div className="px-3 py-2 bg-slate-900/90 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono font-semibold text-slate-200">
            {toolCall.toolName}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge()}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Tool Call Arguments */}
      <div className="px-3 py-2 font-mono text-[11px] text-slate-400 bg-slate-950/50 border-b border-slate-800/50">
        <div className="text-slate-500 text-[10px] uppercase font-semibold mb-1">Parameters</div>
        <pre className="text-cyan-300 overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(toolCall.args, null, 2)}
        </pre>
      </div>

      {/* Approval buttons if required */}
      {toolCall.status === 'approval_required' && (
        <div className="px-3 py-2.5 bg-amber-950/20 border-b border-amber-500/20 flex items-center justify-between">
          <span className="text-amber-200 text-xs">Allow agent to execute this tool?</span>
          <div className="flex gap-2">
            <button
              onClick={() => onDeny?.(toolCall.id)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium rounded transition-colors"
            >
              Deny
            </button>
            <button
              onClick={() => onApprove?.(toolCall.id)}
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-[11px] rounded transition-colors"
            >
              Approve & Run
            </button>
          </div>
        </div>
      )}

      {/* Expandable Output */}
      {isExpanded && toolCall.output && (
        <div className="px-3 py-2.5 bg-[#05080f] font-mono text-[11px] text-slate-300">
          <div className="text-slate-500 text-[10px] uppercase font-semibold mb-1">Tool Output</div>
          <pre className="overflow-x-auto whitespace-pre-wrap select-text leading-relaxed text-slate-200">
            {toolCall.output}
          </pre>
        </div>
      )}
    </div>
  )
}
