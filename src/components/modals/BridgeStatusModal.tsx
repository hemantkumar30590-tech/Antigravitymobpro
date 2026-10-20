import React, { useState } from 'react'
import { DaemonLog, FlavorKind } from '../../types'
import { Server, Activity, ShieldCheck, X, RefreshCw, Copy, Check } from 'lucide-react'

interface BridgeStatusModalProps {
  logs: DaemonLog[]
  flavor: FlavorKind
  bridgePort: number
  hubPort: number
  onToggleFlavor: () => void
  onClose: () => void
}

export const BridgeStatusModal: React.FC<BridgeStatusModalProps> = ({
  logs,
  flavor,
  bridgePort,
  hubPort,
  onToggleFlavor,
  onClose,
}) => {
  const [filterLevel, setFilterLevel] = useState<string>('ALL')
  const [copied, setCopied] = useState(false)

  const filteredLogs = logs.filter((log) => {
    if (filterLevel === 'ALL') return true
    return log.level === filterLevel
  })

  const handleCopyLogs = () => {
    const text = logs
      .map((l) => `[${l.timestamp}] [${l.level}] [${l.component}] ${l.message}`)
      .join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-[#0b1222] border border-cyan-500/30 rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#101a2e] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-100 text-sm">
              AntiGem Go IDE Bridge & gRPC Hub Monitor
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status HUD Banner */}
        <div className="p-4 bg-[#070d19] border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Daemon Status</div>
            <div className="text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE (1.2ms)
            </div>
          </div>

          <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">App Flavor</div>
            <div className="text-cyan-300 font-bold mt-0.5">
              {flavor.toUpperCase()} (standalone)
            </div>
          </div>

          <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Bridge Port</div>
            <div className="text-slate-200 font-bold mt-0.5">:{bridgePort} (WS /ws)</div>
          </div>

          <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Wire gRPC Hub</div>
            <div className="text-indigo-400 font-bold mt-0.5">:{hubPort} (Binary)</div>
          </div>
        </div>

        {/* Logs Controls */}
        <div className="px-4 py-2 bg-[#0e1628] border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-slate-400 text-[11px]">Filter:</span>
            {['ALL', 'INFO', 'DEBUG', 'WARN', 'ERROR'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2 py-0.5 rounded font-mono text-[10px] transition-colors ${
                  filterLevel === lvl
                    ? 'bg-cyan-600 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyLogs}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copy Logs
              </>
            )}
          </button>
        </div>

        {/* Logs Feed */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#050912] font-mono text-[11.5px] leading-relaxed select-text space-y-1">
          {filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start space-x-2">
              <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
              <span
                className={`px-1 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                  log.level === 'INFO'
                    ? 'bg-cyan-950 text-cyan-400'
                    : log.level === 'DEBUG'
                    ? 'bg-slate-800 text-slate-400'
                    : log.level === 'WARN'
                    ? 'bg-amber-950 text-amber-400'
                    : 'bg-rose-950 text-rose-400'
                }`}
              >
                {log.level}
              </span>
              <span className="text-indigo-300 shrink-0">[{log.component}]</span>
              <span className="text-slate-200">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
