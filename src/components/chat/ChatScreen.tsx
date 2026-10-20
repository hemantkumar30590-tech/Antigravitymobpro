import React, { useRef, useEffect } from 'react'
import { ChatSession, AgentKind, GitWorktree } from '../../types'
import { MessageBubble } from './MessageBubble'
import { ChatInputBar } from './ChatInputBar'
import { Zap, RotateCcw, Download, History } from 'lucide-react'

interface ChatScreenProps {
  session: ChatSession
  onSendMessage: (content: string) => void
  activeAgent: AgentKind
  onToggleAgent: () => void
  onOpenModelSelector: () => void
  onApproveTool: (toolId: string) => void
  onDenyTool: (toolId: string) => void
  onAnswerQuestionnaire: (answers: string[]) => void
  onClearChat: () => void
  onCreateCheckpoint: (label: string, summary: string) => void
  onRewindToCheckpoint: (checkpointId: string) => void
  activeWorktree?: GitWorktree
  activeMemoryCount: number
  isStreaming?: boolean
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  session,
  onSendMessage,
  activeAgent,
  onToggleAgent,
  onOpenModelSelector,
  onApproveTool,
  onDenyTool,
  onAnswerQuestionnaire,
  onClearChat,
  onCreateCheckpoint,
  onRewindToCheckpoint,
  activeWorktree,
  activeMemoryCount,
  isStreaming = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [session.messages, isStreaming])

  const handleExport = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(session, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `antigem_chat_${session.id}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0F17] overflow-hidden">
      {/* Chat session sub-header */}
      <div className="px-5 py-2.5 bg-[#0E1420] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="overflow-hidden">
          <div className="font-semibold text-xs text-slate-100 truncate">
            {session.title}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400 tabular-nums mt-0.5">
            <span className="text-cyan-300">{session.model}</span>
            <span aria-hidden="true">·</span>
            <span>
              {activeAgent === 'ANTIGRAVITY'
                ? 'Wire gRPC Hub (127.0.0.1:1235)'
                : 'Claude Code stream-json CLI'}
            </span>
            {activeWorktree && (
              <>
                <span aria-hidden="true">·</span>
                <span>Worktree: {activeWorktree.path}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{activeMemoryCount} Memory Rules Active</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() =>
              onCreateCheckpoint(
                `Chat Snapshot (${session.messages.length} turns)`,
                `Recorded manual snapshot during ${session.title}`
              )
            }
            className="px-2.5 py-1 rounded border border-slate-700 hover:bg-slate-800 text-xs text-slate-200 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            title="Save Durable Checkpoint"
          >
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>Save Snapshot</span>
          </button>
          <button
            onClick={handleExport}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Export Conversation JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClearChat}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
            title="Clear Chat History"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages scroll area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2 max-w-5xl w-full mx-auto">
        {session.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <h3 className="font-semibold text-slate-100 text-base">
              AntiGem Agentic Coding Workspace (Oct 2026)
            </h3>
            <p className="text-xs text-slate-400 max-w-md mt-1 leading-relaxed">
              Direct Gemini 4 Argon or Claude 4 Sonnet to refactor files, spawn isolated Git worktree subagents, or run WebMCP browser diagnostics.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5 max-w-lg w-full text-left">
              {[
                'Spawn subagent to audit LanguageServerService.proto',
                'Create checkpoint and inspect Git worktree diffs',
                'Run Chrome DevTools AI Flamegraph audit on port 3000',
                'Check Termux PTY daemon and Wire gRPC latency',
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(prompt)}
                  className="p-3 rounded-lg border border-slate-800 bg-[#0F1624] hover:bg-slate-800/80 hover:border-cyan-500/40 text-xs text-slate-200 font-mono transition-colors text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          session.messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onApproveTool={onApproveTool}
              onDenyTool={onDenyTool}
              onAnswerQuestionnaire={onAnswerQuestionnaire}
              onRewindToCheckpoint={onRewindToCheckpoint}
            />
          ))
        )}

        {isStreaming && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[#0F1624] border border-cyan-500/30 text-cyan-300 font-mono text-xs">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Synthesizing agent trajectory and verifying memory rules...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <ChatInputBar
        onSendMessage={onSendMessage}
        activeAgent={activeAgent}
        onToggleAgent={onToggleAgent}
        onOpenModelSelector={onOpenModelSelector}
        isStreaming={isStreaming}
      />
    </div>
  )
}
