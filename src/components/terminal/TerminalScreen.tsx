import React, { useState, useRef, useEffect } from 'react'
import { TerminalSession } from '../../types'
import { Terminal, Plus, X, Trash2, CornerDownLeft } from 'lucide-react'

interface TerminalScreenProps {
  sessions: TerminalSession[]
  activeSessionId: string
  onSelectSession: (id: string) => void
  onNewSession: () => void
  onCloseSession: (id: string) => void
  onExecuteCommand: (sessionId: string, cmd: string) => void
  onClearSession: (sessionId: string) => void
}

export const TerminalScreen: React.FC<TerminalScreenProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onCloseSession,
  onExecuteCommand,
  onClearSession,
}) => {
  const [inputCmd, setInputCmd] = useState('')
  const terminalEndRef = useRef<HTMLDivElement>(null)
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0]

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeSession?.entries])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputCmd.trim() || !activeSession) return
    onExecuteCommand(activeSession.id, inputCmd.trim())
    setInputCmd('')
  }

  const runQuickCmd = (cmd: string) => {
    if (!activeSession) return
    onExecuteCommand(activeSession.id, cmd)
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050913] text-slate-200 font-mono text-xs overflow-hidden">
      {/* Session Tabs Bar */}
      <div className="flex items-center bg-[#090F1D] border-b border-slate-800 px-3 py-1.5 select-none overflow-x-auto">
        <div className="flex items-center space-x-1">
          {sessions.map((sess) => {
            const isActive = sess.id === activeSessionId
            return (
              <div
                key={sess.id}
                onClick={() => onSelectSession(sess.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#121A2D] text-cyan-300 font-semibold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{sess.name}</span>
                {sessions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onCloseSession(sess.id)
                    }}
                    className="p-0.5 hover:text-rose-400 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )
          })}

          <button
            onClick={onNewSession}
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors"
            title="Open New Terminal Session"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clear terminal button */}
        <div className="ml-auto flex items-center space-x-3">
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            Termux Native PTY · {activeSession?.workingDir || '~'}
          </span>
          <button
            onClick={() => onClearSession(activeSession?.id || '')}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Clear Terminal Output"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick command buttons */}
      <div className="px-4 py-1.5 bg-[#0B1324] border-b border-slate-800 flex items-center space-x-2 overflow-x-auto text-[11px]">
        <span className="text-slate-400 font-medium shrink-0">Quick Commands:</span>
        {[
          'agy status',
          'agy subagents',
          'agy worktrees',
          'agy checkpoints',
          'git status',
          'ls -la',
          'cat AGENTS.md',
          'clear',
        ].map((cmd) => (
          <button
            key={cmd}
            onClick={() => runQuickCmd(cmd)}
            className="px-2.5 py-0.5 rounded bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-700/60 text-slate-300 transition-colors whitespace-nowrap shrink-0"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[12px] leading-relaxed select-text tabular-nums">
        <div className="text-cyan-400/90 mb-2">
          <div>AntiGem Standalone Subsystem [Termux Native Linux PTY · Oct 2026]</div>
          <div className="text-slate-400 text-[11px]">
            Square Wire binary gRPC Hub active on 127.0.0.1:1235. Type 'help' for commands.
          </div>
        </div>

        {activeSession?.entries.map((entry, idx) => (
          <div key={idx} className="space-y-1">
            {entry.command && (
              <div className="flex items-center space-x-2 text-cyan-300">
                <span className="text-emerald-400 font-bold select-none">
                  antigem@termux:{activeSession.workingDir}$
                </span>
                <span className="font-semibold text-slate-100">{entry.command}</span>
              </div>
            )}
            <div
              className={`whitespace-pre-wrap ${
                entry.isError ? 'text-rose-400' : 'text-slate-300'
              }`}
            >
              {entry.output}
            </div>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Command prompt input */}
      <form
        onSubmit={handleSubmit}
        className="px-4 py-2.5 bg-[#080E1C] border-t border-slate-800 flex items-center space-x-2"
      >
        <span className="text-emerald-400 font-bold select-none">
          antigem@termux:{activeSession?.workingDir || '~'}$
        </span>
        <input
          type="text"
          value={inputCmd}
          onChange={(e) => setInputCmd(e.target.value)}
          placeholder="Enter command (e.g. agy subagents, agy worktrees, agy checkpoints, help)..."
          className="flex-1 bg-transparent text-slate-100 outline-none font-mono text-xs placeholder-slate-600"
          autoFocus
        />
        <button
          type="submit"
          disabled={!inputCmd.trim()}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  )
}
