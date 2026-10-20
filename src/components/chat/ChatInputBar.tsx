import React, { useState, useRef, useEffect } from 'react'
import { AgentKind } from '../../types'
import { Send, Mic, MicOff, Paperclip, Sparkles, Terminal, SlidersHorizontal, HelpCircle } from 'lucide-react'

interface ChatInputBarProps {
  onSendMessage: (text: string) => void
  activeAgent: AgentKind
  onToggleAgent: () => void
  onOpenModelSelector: () => void
  isStreaming?: boolean
}

const SLASH_COMMANDS = [
  { cmd: '/help', desc: 'Display available slash commands and agent actions' },
  { cmd: '/model', desc: 'Switch active LLM model and thinking budget' },
  { cmd: '/compact', desc: 'Compact active context window to save tokens' },
  { cmd: '/doctor', desc: 'Run diagnostics on Go Bridge & Wire gRPC hub' },
  { cmd: '/clear', desc: 'Clear current conversation messages' },
]

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSendMessage,
  activeAgent,
  onToggleAgent,
  onOpenModelSelector,
  isStreaming = false,
}) => {
  const [text, setText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (text.startsWith('/')) {
      setShowSlashMenu(true)
    } else {
      setShowSlashMenu(false)
    }
  }, [text])

  const handleSend = () => {
    if (!text.trim() || isStreaming) return
    onSendMessage(text.trim())
    setText('')
    setShowSlashMenu(false)
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSelectCommand = (cmd: string) => {
    setText(cmd + ' ')
    setShowSlashMenu(false)
    inputRef.current?.focus()
  }

  const handleToggleVoice = () => {
    if (!isRecording) {
      setIsRecording(true)
      // Voice dictation simulation
      setTimeout(() => {
        setText((prev) => (prev ? prev + ' ' : '') + 'List all modified files in the git workspace')
        setIsRecording(false)
      }, 2500)
    } else {
      setIsRecording(false)
    }
  }

  return (
    <div className="relative border-t border-slate-800 bg-[#0a0f1d] p-3">
      {/* Slash command autocomplete overlay */}
      {showSlashMenu && (
        <div className="absolute bottom-full left-4 mb-2 w-80 bg-[#121929] border border-cyan-500/30 rounded-lg shadow-2xl p-2 z-20">
          <div className="text-[10px] uppercase font-mono font-semibold text-cyan-400 px-2 py-1 flex items-center gap-1 border-b border-slate-800">
            <Terminal className="w-3 h-3" /> Quick Slash Commands
          </div>
          <div className="mt-1 space-y-1">
            {SLASH_COMMANDS.map((item) => (
              <button
                key={item.cmd}
                onClick={() => handleSelectCommand(item.cmd)}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-cyan-950/50 flex flex-col text-xs transition-colors"
              >
                <span className="font-mono font-bold text-cyan-300">{item.cmd}</span>
                <span className="text-[11px] text-slate-400">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Control bar above input */}
      <div className="flex items-center justify-between mb-2 px-1 text-xs">
        <div className="flex items-center space-x-2">
          {/* Agent switch button */}
          <button
            onClick={onToggleAgent}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold border transition-all ${
              activeAgent === 'ANTIGRAVITY'
                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40 hover:bg-cyan-900/60'
                : 'bg-amber-950/60 text-amber-300 border-amber-500/40 hover:bg-amber-900/60'
            }`}
            title="Click to toggle between Antigravity (agy) and Claude Code"
          >
            <Sparkles className="w-3 h-3" />
            {activeAgent === 'ANTIGRAVITY' ? 'Antigravity (Wire gRPC)' : 'Claude Code (stream-json)'}
          </button>

          {/* Model selection trigger */}
          <button
            onClick={onOpenModelSelector}
            className="flex items-center gap-1 px-2 py-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 font-mono text-[11px] transition-colors"
          >
            <SlidersHorizontal className="w-3 h-3" />
            Model & Thinking
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
            Press Enter to send, Shift+Enter for newline
          </span>
        </div>
      </div>

      {/* Text area and action buttons */}
      <div className="flex items-end gap-2 bg-[#121826] border border-slate-700/80 rounded-xl p-2 focus-within:border-cyan-500/70 transition-all shadow-inner">
        <button
          onClick={() => alert('Attachments: Workspace file browser or screenshot attachment')}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          title="Attach Workspace File"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            e.target.style.height = 'auto'
            e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            activeAgent === 'ANTIGRAVITY'
              ? 'Message Antigravity or type / for commands...'
              : 'Message Claude Code or type / for commands...'
          }
          rows={1}
          className="flex-1 bg-transparent text-slate-100 text-sm placeholder-slate-500 focus:outline-none resize-none max-h-36 py-1 leading-relaxed"
        />

        {/* Voice dictation */}
        <button
          onClick={handleToggleVoice}
          className={`p-1.5 rounded-lg transition-colors ${
            isRecording
              ? 'bg-rose-500/20 text-rose-400 animate-pulse'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title={isRecording ? 'Listening...' : 'Voice Dictation'}
        >
          {isRecording ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!text.trim() || isStreaming}
          className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
