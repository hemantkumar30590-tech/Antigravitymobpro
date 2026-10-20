import React from 'react'
import { ChatMessage } from '../../types'
import { ThinkingAccordion } from './ThinkingAccordion'
import { AgentToolCallCard } from './AgentToolCallCard'
import { ChoiceQuestionnaireCard } from './ChoiceQuestionnaireCard'
import { Copy, Check, RotateCcw } from 'lucide-react'

interface MessageBubbleProps {
  message: ChatMessage
  onApproveTool?: (id: string) => void
  onDenyTool?: (id: string) => void
  onAnswerQuestionnaire?: (answers: string[]) => void
  onRewindToCheckpoint?: (checkpointId: string) => void
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onApproveTool,
  onDenyTool,
  onAnswerQuestionnaire,
  onRewindToCheckpoint,
}) => {
  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`flex flex-col my-3.5 ${isUser ? 'items-end' : 'items-start'}`}>
      {/* Unboxed clean metadata line */}
      <div className="flex flex-wrap items-center gap-2 mb-1 px-1 text-[11px] text-slate-400 font-mono tabular-nums">
        {isAssistant ? (
          <>
            <span className="font-semibold text-cyan-400">
              {message.agent === 'ANTIGRAVITY' ? 'Antigravity (agy)' : 'Claude Code'}
            </span>
            {message.modelUsed && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">{message.modelUsed}</span>
              </>
            )}
            {message.checkpointId && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">Snapshot #{message.checkpointId}</span>
              </>
            )}
          </>
        ) : (
          <span className="text-slate-300 font-medium">Developer</span>
        )}
        <span aria-hidden="true">·</span>
        <span className="text-slate-500">{message.timestamp}</span>
      </div>

      <div
        className={`max-w-[90%] md:max-w-[82%] rounded-xl px-4 py-3 ${
          isUser
            ? 'bg-cyan-600 text-slate-950 font-medium rounded-br-xs'
            : 'bg-[#0F1624] border border-slate-800 text-slate-100 rounded-bl-xs'
        }`}
      >
        {/* Thinking block if present */}
        {message.thinking && (
          <ThinkingAccordion
            thinking={message.thinking}
            durationSeconds={message.thinkingDurationSeconds}
          />
        )}

        {/* Message body */}
        <div className="text-[13.5px] leading-relaxed whitespace-pre-wrap select-text">
          {message.content}
        </div>

        {/* Tool calls if any */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="mt-3 space-y-1">
            <div className="text-[11px] font-mono font-medium text-slate-400">
              Tool Trajectory ({message.toolCalls.length})
            </div>
            {message.toolCalls.map((tc) => (
              <AgentToolCallCard
                key={tc.id}
                toolCall={tc}
                onApprove={onApproveTool}
                onDeny={onDenyTool}
              />
            ))}
          </div>
        )}

        {/* Choice questionnaire if any */}
        {message.questionnaire && (
          <ChoiceQuestionnaireCard
            questionnaire={message.questionnaire}
            onAnswer={(ans) => onAnswerQuestionnaire?.(ans)}
          />
        )}

        {/* Action bar */}
        <div
          className={`mt-2 pt-1.5 border-t flex items-center justify-end gap-4 ${
            isUser ? 'border-slate-950/15' : 'border-slate-800/70'
          }`}
        >
          {isAssistant && message.checkpointId && onRewindToCheckpoint && (
            <button
              onClick={() => onRewindToCheckpoint(message.checkpointId!)}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 transition-colors"
              title="Rewind workspace to this turn's checkpoint"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Rewind to #{message.checkpointId}</span>
            </button>
          )}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 text-[11px] transition-colors ${
              isUser
                ? 'text-slate-900/75 hover:text-slate-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Copy message text"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
