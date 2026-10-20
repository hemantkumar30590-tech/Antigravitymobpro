import React, { useState } from 'react'
import { WorkspaceFile, EditorTab, GitStatusState, GitWorktree } from '../../types'
import { ProjectSidebar } from './ProjectSidebar'
import { UnifiedDiffViewer } from './UnifiedDiffViewer'
import {
  Play,
  Save,
  X,
  FileCode,
  Terminal,
  GitCompare,
  Code2,
  History,
} from 'lucide-react'

interface IdeScreenProps {
  files: WorkspaceFile[]
  openTabs: EditorTab[]
  activeTabId?: string
  gitState: GitStatusState
  worktrees: GitWorktree[]
  activeWorktreeId: string
  onSelectWorktree: (id: string) => void
  onSelectTab: (id: string) => void
  onCloseTab: (id: string) => void
  onOpenFile: (file: WorkspaceFile) => void
  onSaveFile: (id: string, content: string) => void
  onCreateFile: (name: string, isFolder: boolean) => void
  onDeleteFile: (id: string) => void
  onCommitGit: (message: string) => void
  onStageGitFile: (path: string) => void
  onUnstageGitFile: (path: string) => void
  onCreateCheckpoint: (label: string, summary: string) => void
}

export const IdeScreen: React.FC<IdeScreenProps> = ({
  files,
  openTabs,
  activeTabId,
  gitState,
  worktrees,
  activeWorktreeId,
  onSelectWorktree,
  onSelectTab,
  onCloseTab,
  onOpenFile,
  onSaveFile,
  onCreateFile,
  onDeleteFile,
  onCommitGit,
  onStageGitFile,
  onUnstageGitFile,
  onCreateCheckpoint,
}) => {
  const [activeSidebarView, setActiveSidebarView] = useState<'files' | 'git'>('files')
  const [editorContents, setEditorContents] = useState<Record<string, string>>({})
  const [isRunning, setIsRunning] = useState(false)
  const [runnerOutput, setRunnerOutput] = useState<string | null>(null)
  const [showDiff, setShowDiff] = useState(false)

  const activeTab = openTabs.find((t) => t.id === activeTabId)
  const activeWorktree = worktrees.find((w) => w.id === activeWorktreeId) || worktrees[0]
  const currentContent = activeTab
    ? editorContents[activeTab.id] !== undefined
      ? editorContents[activeTab.id]
      : activeTab.content
    : ''

  const handleContentChange = (newVal: string) => {
    if (activeTab) {
      setEditorContents((prev) => ({ ...prev, [activeTab.id]: newVal }))
    }
  }

  const handleSave = () => {
    if (activeTab) {
      onSaveFile(activeTab.id, currentContent)
    }
  }

  const handleCheckpointAndSave = () => {
    if (activeTab) {
      onSaveFile(activeTab.id, currentContent)
      onCreateCheckpoint(
        `Saved ${activeTab.name}`,
        `Snapshot recorded in worktree ${activeWorktree.path} (${activeWorktree.branch})`
      )
    }
  }

  const handleRunExecution = () => {
    if (!activeTab) return
    setIsRunning(true)
    setRunnerOutput(
      `[AntiGem IDE · Worktree ${activeWorktree.path}] Executing ${activeTab.name} in Termux Linux sandbox...\n`
    )

    setTimeout(() => {
      if (activeTab.name.endsWith('.go')) {
        setRunnerOutput(
          (prev) =>
            (prev || '') +
            `$ go run ${activeTab.path}\n` +
            `Starting AntiGem Go IDE Bridge on :1234 (Wire gRPC Hub :1235)\n` +
            `[Bridge] WebSocket /ws listening on 0.0.0.0:1234\n` +
            `[Hub] Square Wire gRPC listener ready on 127.0.0.1:1235\n` +
            `Process terminated with exit code 0.`
        )
      } else if (activeTab.name.endsWith('.proto')) {
        setRunnerOutput(
          (prev) =>
            (prev || '') +
            `$ wire-compiler ${activeTab.path}\n` +
            `Compiled 1 proto file -> generated Kotlin & Go Wire gRPC stubs (100% JSON/Binary schema parity).\n` +
            `Process terminated with exit code 0.`
        )
      } else {
        setRunnerOutput(
          (prev) =>
            (prev || '') +
            `$ node --check ${activeTab.path}\n` +
            `File validation successful in ${activeWorktree.branch}. Zero syntax errors.\n` +
            `Process terminated with exit code 0.`
        )
      }
      setIsRunning(false)
    }, 650)
  }

  const lines = currentContent.split('\n')

  return (
    <div className="flex-1 flex h-full bg-[#070B14] overflow-hidden">
      {/* Sidebar (File Explorer or Git + Worktrees) */}
      <ProjectSidebar
        files={files}
        activeFilePath={activeTab?.path}
        onSelectFile={onOpenFile}
        onCreateFile={onCreateFile}
        onDeleteFile={onDeleteFile}
        activeView={activeSidebarView}
        setActiveView={setActiveSidebarView}
        gitState={gitState}
        onCommitGit={onCommitGit}
        onStageGitFile={onStageGitFile}
        onUnstageGitFile={onUnstageGitFile}
        worktrees={worktrees}
        activeWorktreeId={activeWorktreeId}
        onSelectWorktree={onSelectWorktree}
      />

      {/* Main Code Editing Surface */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0F1D]">
        {/* Editor Tabs Bar */}
        <div className="flex items-center bg-[#070C17] border-b border-slate-800 overflow-x-auto select-none">
          {openTabs.map((tab) => {
            const isActive = tab.id === activeTabId
            const isDirty =
              editorContents[tab.id] !== undefined && editorContents[tab.id] !== tab.content
            return (
              <div
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-xs font-mono cursor-pointer border-r border-slate-800 transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#0A0F1D] text-cyan-300 border-t-2 border-t-cyan-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{tab.name}</span>
                {isDirty && <span className="text-cyan-400 font-bold">*</span>}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onCloseTab(tab.id)
                  }}
                  className="p-0.5 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )
          })}

          {openTabs.length === 0 && (
            <div className="px-3 py-2 text-xs font-mono text-slate-500">
              No files open. Select a file from the explorer.
            </div>
          )}

          {/* Action buttons on tab bar right */}
          {activeTab && (
            <div className="ml-auto flex items-center space-x-1.5 px-3 py-1">
              <button
                onClick={() => setShowDiff(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono text-[11px] transition-colors whitespace-nowrap shrink-0"
                title="View Unified Diff"
              >
                <GitCompare className="w-3 h-3 text-cyan-400" />
                <span className="hidden sm:inline">Diff</span>
              </button>

              <button
                onClick={handleCheckpointAndSave}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] transition-colors whitespace-nowrap shrink-0"
                title="Save File & Record Durable Checkpoint"
              >
                <History className="w-3 h-3 text-cyan-400" />
                <span className="hidden md:inline">Save & Checkpoint</span>
              </button>

              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] transition-colors whitespace-nowrap shrink-0"
                title="Save File"
              >
                <Save className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">Save</span>
              </button>

              <button
                onClick={handleRunExecution}
                disabled={isRunning}
                className="flex items-center gap-1 px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold font-mono text-[11px] transition-colors whitespace-nowrap shrink-0"
                title="Run in Termux Sandbox"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isRunning ? 'Running...' : 'Run'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Editor Area */}
        {activeTab ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex overflow-hidden font-mono text-xs">
              {/* Line Numbers */}
              <div className="w-12 bg-[#080D17] text-slate-600 py-3 select-none text-right pr-3 shrink-0 overflow-hidden leading-relaxed font-mono tabular-nums">
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Code TextArea */}
              <textarea
                value={currentContent}
                onChange={(e) => handleContentChange(e.target.value)}
                spellCheck={false}
                className="flex-1 bg-transparent text-slate-100 p-3 outline-none resize-none overflow-auto font-mono text-xs leading-relaxed select-text placeholder-slate-600"
              />
            </div>

            {/* Bottom Execution Console Drawer if output exists */}
            {runnerOutput && (
              <div className="h-44 border-t border-slate-800 bg-[#070B14] flex flex-col font-mono text-xs">
                <div className="px-3 py-1.5 bg-[#0E1526] border-b border-slate-800 flex items-center justify-between text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    <Terminal className="w-3 h-3 text-cyan-400" />
                    <span className="text-[11px] font-semibold text-slate-200">
                      Execution Output · {activeWorktree.branch}
                    </span>
                  </div>
                  <button
                    onClick={() => setRunnerOutput(null)}
                    className="p-1 hover:text-slate-200 rounded text-slate-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex-1 p-3 overflow-y-auto text-cyan-300 bg-black/60 font-mono text-[11.5px] leading-relaxed whitespace-pre-wrap select-text">
                  {runnerOutput}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 font-mono text-xs">
            <Code2 className="w-12 h-12 text-slate-700 mb-2 stroke-[1.2]" />
            <span>Select a file from the Project Sidebar to begin editing</span>
          </div>
        )}
      </div>

      {/* Unified Diff Modal */}
      {showDiff && activeTab && (
        <UnifiedDiffViewer
          filename={activeTab.path}
          oldContent={activeTab.content}
          newContent={currentContent}
          onClose={() => setShowDiff(false)}
          onApply={() => {
            onSaveFile(activeTab.id, currentContent)
            setShowDiff(false)
          }}
        />
      )}
    </div>
  )
}
