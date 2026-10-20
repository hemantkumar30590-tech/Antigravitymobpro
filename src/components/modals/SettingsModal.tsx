import React, { useState } from 'react'
import { FlavorKind } from '../../types'
import { Settings, X, Shield, Cpu, Sparkles, Terminal, Check } from 'lucide-react'

interface SettingsModalProps {
  flavor: FlavorKind
  onSelectFlavor: (f: FlavorKind) => void
  agyEnabled: boolean
  onToggleAgy: () => void
  claudeEnabled: boolean
  onToggleClaude: () => void
  onClose: () => void
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  flavor,
  onSelectFlavor,
  agyEnabled,
  onToggleAgy,
  claudeEnabled,
  onToggleClaude,
  onClose,
}) => {
  const [systemPrompt, setSystemPrompt] = useState(
    'You are AntiGem, an advanced agentic coding assistant with full access to native Linux PTY terminal, Go bridge tools, and repo files.'
  )
  const [saved, setSaved] = useState(false)

  const handleSavePrompt = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-[#0c1322] border border-cyan-500/30 rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#10182b] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-100 text-sm">AntiGem Workspace Settings</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto text-xs">
          {/* Agent Backends */}
          <div>
            <h4 className="font-mono font-bold text-slate-300 uppercase text-[11px] mb-2 tracking-wider">
              Agent Backends
            </h4>
            <div className="space-y-2">
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-100 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Antigravity (agy) Core
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Binary Wire gRPC daemon hub mode with subagent trajectories.
                  </div>
                </div>
                <button
                  onClick={onToggleAgy}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    agyEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                      agyEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-100 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-amber-400" />
                    Claude Code CLI
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Anthropic official stream-json NDJSON relay process.
                  </div>
                </div>
                <button
                  onClick={onToggleClaude}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    claudeEnabled ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                      claudeEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Subsystem Flavor */}
          <div>
            <h4 className="font-mono font-bold text-slate-300 uppercase text-[11px] mb-2 tracking-wider">
              Environment Subsystem Mode
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSelectFlavor('termux')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  flavor === 'termux'
                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-100'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <div className="font-bold text-xs">Termux Flavor (Recommended)</div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Built-in standalone Linux environment. Ports: 1234 (bridge), 1235 (hub).
                </div>
              </button>

              <button
                onClick={() => onSelectFlavor('standard')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  flavor === 'standard'
                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-100'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <div className="font-bold text-xs">Standard Flavor</div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Connects to external Termux app via localhost. Ports: 1236, 1237.
                </div>
              </button>
            </div>
          </div>

          {/* Custom System Prompt */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="font-mono font-bold text-slate-300 uppercase text-[11px] tracking-wider">
                Custom System Instructions
              </h4>
              <button
                onClick={handleSavePrompt}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
              >
                {saved ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" /> Saved
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={3}
              className="w-full bg-[#111728] border border-slate-700 rounded-md p-2 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#10182b] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
