import React, { useState } from 'react'
import { GitStatusState } from '../../types'
import { GitBranch, GitCommit, Check, RefreshCw, Plus, Minus, ArrowUp, ArrowDown } from 'lucide-react'

interface GitSourceControlViewProps {
  gitState: GitStatusState
  onCommit: (message: string) => void
  onStageFile: (path: string) => void
  onUnstageFile: (path: string) => void
}

export const GitSourceControlView: React.FC<GitSourceControlViewProps> = ({
  gitState,
  onCommit,
  onStageFile,
  onUnstageFile,
}) => {
  const [commitMessage, setCommitMessage] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)

  const handleCommitSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commitMessage.trim()) return
    onCommit(commitMessage.trim())
    setCommitMessage('')
  }

  const handleSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
    }, 1200)
  }

  return (
    <div className="flex-1 flex flex-col p-3 overflow-y-auto text-xs font-mono">
      {/* Branch & Sync header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
          <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
          <span>{gitState.branch}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSync}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
            title="Fetch and Push changes"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Commit Input Box */}
      <form onSubmit={handleCommitSubmit} className="my-3">
        <textarea
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          placeholder="Commit message (e.g. feat: add gRPC hub client)..."
          rows={2}
          className="w-full bg-[#111728] border border-slate-700 rounded-md p-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 resize-none font-mono placeholder-slate-500"
        />
        <button
          type="submit"
          disabled={!commitMessage.trim() || gitState.staged.length === 0}
          className="w-full mt-1.5 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <GitCommit className="w-3.5 h-3.5" />
          Commit to {gitState.branch}
        </button>
      </form>

      {/* Staged Changes Section */}
      <div className="mt-2">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Staged Changes ({gitState.staged.length})</span>
        </div>
        {gitState.staged.length === 0 ? (
          <div className="text-[11px] text-slate-500 italic p-1">No staged changes</div>
        ) : (
          <div className="space-y-1">
            {gitState.staged.map((file) => (
              <div
                key={file}
                className="flex items-center justify-between p-1.5 rounded bg-slate-900/60 border border-slate-800 text-emerald-300 text-[11px]"
              >
                <span className="truncate">{file}</span>
                <button
                  onClick={() => onUnstageFile(file)}
                  className="p-1 hover:text-rose-400 transition-colors"
                  title="Unstage"
                >
                  <Minus className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Unstaged Changes Section */}
      <div className="mt-4">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Changes ({gitState.unstaged.length})</span>
        </div>
        {gitState.unstaged.length === 0 ? (
          <div className="text-[11px] text-slate-500 italic p-1">No unstaged changes</div>
        ) : (
          <div className="space-y-1">
            {gitState.unstaged.map((file) => (
              <div
                key={file}
                className="flex items-center justify-between p-1.5 rounded bg-slate-900/60 border border-slate-800 text-amber-300 text-[11px]"
              >
                <span className="truncate">{file}</span>
                <button
                  onClick={() => onStageFile(file)}
                  className="p-1 hover:text-emerald-400 transition-colors"
                  title="Stage change"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
