import React, { useState } from 'react'
import { WebMcpTool } from '../../types'
import { INITIAL_WEBMCP_TOOLS } from '../../data/initialData'
import {
  Globe,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Terminal,
  Play,
  Code2,
  Check,
} from 'lucide-react'

export const BrowserScreen: React.FC = () => {
  const [url, setUrl] = useState('https://santoshkurmi.github.io/antigem/')
  const [currentUrl, setCurrentUrl] = useState('https://santoshkurmi.github.io/antigem/')
  const [showConsole, setShowConsole] = useState(false)
  const [activeTab, setActiveTab] = useState<'preview' | 'webmcp'>('webmcp')
  const [tools, setTools] = useState<WebMcpTool[]>(INITIAL_WEBMCP_TOOLS)
  const [runningToolId, setRunningToolId] = useState<string | null>(null)
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[WebMCP 2026.10] navigator.modelContext initialized with 4 structured agent tools.',
    '[Chrome DevTools Agent API] Performance & Elements AI hooks attached to WebView.',
    '[Google Flow] Storyboard automation recorder ready on port 8765.',
  ])

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault()
    let target = url.trim()
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target
    }
    setCurrentUrl(target)
    setActiveTab('preview')
  }

  const handleInvokeTool = (tool: WebMcpTool) => {
    setRunningToolId(tool.id)
    setTimeout(() => {
      const timestamp = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      const newOutput =
        tool.category === 'webmcp'
          ? `{"timestamp": "${timestamp}", "status": "OK", "contractsDiscovered": 9, "forms": ["commit-form", "subagent-spawn"]}`
          : tool.category === 'chrome_devtools'
          ? `{"timestamp": "${timestamp}", "fps": 60, "longTasks": 0, "mainThreadBlockingMs": 1.4, "verdict": "OPTIMAL"}`
          : `{"timestamp": "${timestamp}", "workflow": "flow_verify_ui", "stepsPassed": 6, "status": "VERIFIED"}`

      setTools((prev) =>
        prev.map((t) =>
          t.id === tool.id
            ? { ...t, callsCount: t.callsCount + 1, lastOutput: newOutput }
            : t
        )
      )
      setConsoleLogs((prev) => [
        ...prev,
        `[${timestamp}] Executed ${tool.name} -> ${newOutput}`,
      ])
      setRunningToolId(null)
    }, 450)
  }

  const handleToggleTool = (id: string) => {
    setTools((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0F17] overflow-hidden text-xs">
      {/* Browser Bar */}
      <div className="px-4 py-2.5 bg-[#0E1420] border-b border-slate-800 flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('preview')}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800"
            title="Back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800"
            title="Forward"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCurrentUrl((prev) => prev)}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800"
            title="Reload"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Address Bar */}
        <form onSubmit={handleNavigate} className="flex-1 min-w-[220px]">
          <div className="flex items-center space-x-2 bg-[#090D16] border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-200 focus-within:border-cyan-500">
            <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL or localhost port..."
              className="w-full bg-transparent outline-none font-mono text-xs text-slate-100"
            />
          </div>
        </form>

        {/* Segmented View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#090D15] border border-slate-800 rounded-lg">
          <button
            onClick={() => setActiveTab('webmcp')}
            className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'webmcp'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>WebMCP & DevTools AI</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'preview'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Live WebView</span>
          </button>
        </div>

        <button
          onClick={() => setShowConsole(!showConsole)}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
            showConsole
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-semibold'
              : 'border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Agent Console</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex flex-col overflow-hidden">
        {activeTab === 'preview' ? (
          <iframe
            src={currentUrl}
            title="AntiGem Web Browser"
            className="w-full h-full border-0 bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        ) : (
          <div className="flex-1 overflow-y-auto p-6 max-w-6xl w-full mx-auto space-y-6">
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                WebMCP Standard & Chrome DevTools AI Agent Inspector (Oct 2026)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Exposes structured DOM contracts, Chrome DevTools flamegraph diagnostics, and fine-grained JS execution controls directly to Antigravity and Claude Code agents.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  className="p-5 rounded-lg border border-slate-800 bg-[#0F1624] flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-mono font-semibold text-sm text-cyan-300">
                          {tool.name}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 font-mono tabular-nums">
                          Category: {tool.category} · Invocations: {tool.callsCount}
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleTool(tool.id)}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                          tool.enabled
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {tool.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {tool.description}
                    </p>

                    <div className="text-[11px] font-mono text-slate-400 bg-[#090D16] p-2.5 rounded border border-slate-800/80">
                      Schema: {tool.schemaSummary}
                    </div>

                    {tool.lastOutput && (
                      <div className="text-[11px] font-mono text-emerald-300 bg-[#070B12] p-2.5 rounded border border-slate-800/80 overflow-x-auto">
                        {tool.lastOutput}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-2 border-t border-slate-800/60">
                    <button
                      onClick={() => handleInvokeTool(tool)}
                      disabled={!tool.enabled || runningToolId === tool.id}
                      className="px-3.5 py-1.5 rounded-md bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                    >
                      {runningToolId === tool.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Running Diagnostics...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Test Agent Tool</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DevTools Console Drawer */}
        {showConsole && (
          <div className="h-48 bg-[#080C14] border-t border-slate-800 p-4 font-mono text-xs text-slate-200 overflow-y-auto z-10">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-slate-400">
              <span className="font-semibold text-cyan-400">
                Chrome DevTools AI Agent Console · WebMCP Bridge
              </span>
              <button
                onClick={() => setShowConsole(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                Close
              </button>
            </div>
            <div className="space-y-1 text-[11.5px] leading-relaxed">
              {consoleLogs.map((log, index) => (
                <div key={index} className="text-slate-300">
                  &gt; {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
