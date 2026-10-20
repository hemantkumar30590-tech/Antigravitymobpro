import React, { useState } from 'react'
import {
  SubagentTask,
  GitWorktree,
  CheckpointSnapshot,
  MemoryRule,
  AgentKind,
} from '../../types'
import { AVAILABLE_MODELS } from '../../data/initialData'
import {
  GitBranch,
  History,
  BookOpen,
  Cpu,
  Play,
  Pause,
  Plus,
  RotateCcw,
  GitMerge,
  Check,
  Trash2,
} from 'lucide-react'

interface AgentOrchestratorScreenProps {
  subagents: SubagentTask[]
  worktrees: GitWorktree[]
  checkpoints: CheckpointSnapshot[]
  memoryRules: MemoryRule[]
  activeWorktreeId: string
  onSpawnSubagent: (name: string, objective: string, model: string, agent: AgentKind) => void
  onToggleSubagentStatus: (id: string) => void
  onMergeWorktree: (worktreeId: string) => void
  onSelectWorktree: (worktreeId: string) => void
  onCreateWorktree: (name: string, branch: string) => void
  onCreateCheckpoint: (label: string, summary: string) => void
  onRestoreCheckpoint: (checkpoint: CheckpointSnapshot) => void
  onAddMemoryRule: (title: string, content: string, scope: 'project' | 'protocol' | 'session') => void
  onToggleMemoryRule: (id: string) => void
  onDeleteMemoryRule: (id: string) => void
}

export const AgentOrchestratorScreen: React.FC<AgentOrchestratorScreenProps> = ({
  subagents,
  worktrees,
  checkpoints,
  memoryRules,
  activeWorktreeId,
  onSpawnSubagent,
  onToggleSubagentStatus,
  onMergeWorktree,
  onSelectWorktree,
  onCreateWorktree,
  onCreateCheckpoint,
  onRestoreCheckpoint,
  onAddMemoryRule,
  onToggleMemoryRule,
  onDeleteMemoryRule,
}) => {
  const [activeSection, setActiveSection] = useState<
    'subagents' | 'worktrees' | 'checkpoints' | 'memory'
  >('subagents')

  // Subagent form state
  const [showSpawnForm, setShowSpawnForm] = useState(false)
  const [subName, setSubName] = useState('')
  const [subObjective, setSubObjective] = useState('')
  const [subModel, setSubModel] = useState('gemini-4-argon')
  const [subAgentKind, setSubAgentKind] = useState<AgentKind>('ANTIGRAVITY')

  // Worktree form state
  const [showWorktreeForm, setShowWorktreeForm] = useState(false)
  const [wtName, setWtName] = useState('')
  const [wtBranch, setWtBranch] = useState('')

  // Checkpoint form state
  const [checkpointLabel, setCheckpointLabel] = useState('')
  const [restoredId, setRestoredId] = useState<string | null>(null)

  // Memory rule form state
  const [ruleTitle, setRuleTitle] = useState('')
  const [ruleContent, setRuleContent] = useState('')
  const [ruleScope, setRuleScope] = useState<'project' | 'protocol' | 'session'>('project')

  const handleSpawnSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subName.trim() || !subObjective.trim()) return
    onSpawnSubagent(subName.trim(), subObjective.trim(), subModel, subAgentKind)
    setSubName('')
    setSubObjective('')
    setShowSpawnForm(false)
  }

  const handleCreateWtSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!wtName.trim() || !wtBranch.trim()) return
    onCreateWorktree(wtName.trim(), wtBranch.trim())
    setWtName('')
    setWtBranch('')
    setShowWorktreeForm(false)
  }

  const handleCreateCheckpointSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkpointLabel.trim()) return
    onCreateCheckpoint(
      checkpointLabel.trim(),
      'Manual developer snapshot of workspace and agent trajectory'
    )
    setCheckpointLabel('')
  }

  const handleRewindClick = (cp: CheckpointSnapshot) => {
    onRestoreCheckpoint(cp)
    setRestoredId(cp.id)
    setTimeout(() => setRestoredId(null), 2500)
  }

  const handleAddRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ruleTitle.trim() || !ruleContent.trim()) return
    onAddMemoryRule(ruleTitle.trim(), ruleContent.trim(), ruleScope)
    setRuleTitle('')
    setRuleContent('')
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0F17] text-slate-100 overflow-hidden">
      {/* Sub-navigation bar */}
      <div className="px-6 py-3 bg-[#0E1420] border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">
            Antigravity 2.0 Agent Orchestrator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Parallel background subagents · Isolated Git worktrees · Durable state checkpoints · Persistent memory bank
          </p>
        </div>

        {/* Interactive segmented filter tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#090D15] border border-slate-800 rounded-lg">
          <button
            onClick={() => setActiveSection('subagents')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeSection === 'subagents'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Subagents ({subagents.length})</span>
          </button>
          <button
            onClick={() => setActiveSection('worktrees')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeSection === 'worktrees'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Worktrees ({worktrees.length})</span>
          </button>
          <button
            onClick={() => setActiveSection('checkpoints')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeSection === 'checkpoints'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Checkpoints ({checkpoints.length})</span>
          </button>
          <button
            onClick={() => setActiveSection('memory')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeSection === 'memory'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Memory Rules ({memoryRules.filter((r) => r.enabled).length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 max-w-6xl w-full mx-auto space-y-6">
        {/* 1. SUBAGENTS FLEET */}
        {activeSection === 'subagents' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-100">
                  01. Parallel Background Subagents
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Delegate specialized tasks to autonomous subagents with dedicated context windows and isolated Git worktrees.
                </p>
              </div>
              <button
                onClick={() => setShowSpawnForm(!showSpawnForm)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Spawn Subagent</span>
              </button>
            </div>

            {showSpawnForm && (
              <form
                onSubmit={handleSpawnSubmit}
                className="p-5 rounded-lg border border-slate-800 bg-[#0F1624] space-y-4"
              >
                <div className="text-xs font-semibold text-slate-200">
                  Configure Autonomous Background Subagent
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Subagent Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Security & Dependency Auditor"
                      value={subName}
                      onChange={(e) => setSubName(e.target.value)}
                      className="w-full bg-[#090D16] border border-slate-700 rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Model Engine</label>
                    <select
                      value={subModel}
                      onChange={(e) => setSubModel(e.target.value)}
                      className="w-full bg-[#090D16] border border-slate-700 rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    >
                      {AVAILABLE_MODELS.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.releaseTag})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Protocol Backend</label>
                    <select
                      value={subAgentKind}
                      onChange={(e) => setSubAgentKind(e.target.value as AgentKind)}
                      className="w-full bg-[#090D16] border border-slate-700 rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="ANTIGRAVITY">Antigravity (Wire gRPC Hub)</option>
                      <option value="CLAUDE_CODE">Claude Code (stream-json CLI)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Task Objective & Verification Criteria
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Audit all gRPC endpoints in agy_ide_bridge and generate unit tests in an isolated worktree"
                    value={subObjective}
                    onChange={(e) => setSubObjective(e.target.value)}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSpawnForm(false)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-md transition-colors"
                  >
                    Launch in Isolated Worktree
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {subagents.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 rounded-lg border border-slate-800 bg-[#0F1624] space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100">{sub.name}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1 font-mono tabular-nums">
                        <span>{sub.model}</span>
                        <span aria-hidden="true">·</span>
                        <span>{sub.worktreePath}</span>
                        <span aria-hidden="true">·</span>
                        <span>{sub.tokensUsed.toLocaleString()} tokens</span>
                        <span aria-hidden="true">·</span>
                        <span>Started {sub.startedAt}</span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={
                            sub.status === 'completed'
                              ? 'text-emerald-400 font-medium'
                              : sub.status === 'running'
                              ? 'text-cyan-400 font-medium'
                              : 'text-amber-400 font-medium'
                          }
                        >
                          Status: {sub.status} ({sub.progress}%)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {sub.status !== 'completed' && (
                        <button
                          onClick={() => onToggleSubagentStatus(sub.id)}
                          className="px-3 py-1.5 rounded-md border border-slate-700 hover:bg-slate-800 text-xs text-slate-200 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                        >
                          {sub.status === 'running' ? (
                            <>
                              <Pause className="w-3 h-3" />
                              <span>Pause</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3" />
                              <span>Resume</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{sub.objective}</p>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        sub.status === 'completed'
                          ? 'bg-emerald-500'
                          : sub.status === 'running'
                          ? 'bg-cyan-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${sub.progress}%` }}
                    />
                  </div>

                  {/* Trajectory Log Lines */}
                  <div className="pt-2 border-t border-slate-800/80 font-mono text-[11px] text-slate-400 space-y-1">
                    {sub.logs.map((line, i) => (
                      <div key={i} className="truncate">
                        {i + 1}. {line}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. GIT WORKTREES MANAGER */}
        {activeSection === 'worktrees' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-100">
                  02. Isolated Git Worktrees
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Run multiple AI coding agents in parallel directories sharing the same Git history without file lock collisions.
                </p>
              </div>
              <button
                onClick={() => setShowWorktreeForm(!showWorktreeForm)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Worktree</span>
              </button>
            </div>

            {showWorktreeForm && (
              <form
                onSubmit={handleCreateWtSubmit}
                className="p-5 rounded-lg border border-slate-800 bg-[#0F1624] space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Worktree Label</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Termux Audio Streaming Fix"
                      value={wtName}
                      onChange={(e) => setWtName(e.target.value)}
                      className="w-full bg-[#090D16] border border-slate-700 rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Branch Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. feat/audio- opus-stream"
                      value={wtBranch}
                      onChange={(e) => setWtBranch(e.target.value)}
                      className="w-full bg-[#090D16] border border-slate-700 rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowWorktreeForm(false)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-md transition-colors"
                  >
                    Mount Worktree
                  </button>
                </div>
              </form>
            )}

            <div className="border border-slate-800 rounded-lg overflow-hidden bg-[#0F1624]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#0A0F1A] text-slate-400 font-medium">
                    <th className="py-3 px-4">Worktree & Path</th>
                    <th className="py-3 px-4">Branch</th>
                    <th className="py-3 px-4">Assigned Subagent</th>
                    <th className="py-3 px-4 text-right">Modified Files</th>
                    <th className="py-3 px-4 text-right">Commits Ahead</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {worktrees.map((wt) => {
                    const isCurrent = wt.id === activeWorktreeId
                    return (
                      <tr key={wt.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-100">{wt.name}</div>
                          <div className="font-mono text-[11px] text-slate-400">{wt.path}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-cyan-300">{wt.branch}</td>
                        <td className="py-3 px-4 text-slate-300">
                          {wt.assignedSubagent || 'Interactive Developer'}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-200">
                          {wt.modifiedFiles}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-400">
                          +{wt.aheadCount}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onSelectWorktree(wt.id)}
                              className={`px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                                isCurrent
                                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                              }`}
                            >
                              {isCurrent ? 'Active in IDE' : 'Switch Worktree'}
                            </button>
                            {wt.path !== '/workspace' && wt.aheadCount > 0 && (
                              <button
                                onClick={() => onMergeWorktree(wt.id)}
                                className="px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
                              >
                                <GitMerge className="w-3 h-3" />
                                <span>Merge to main</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. DURABLE CHECKPOINTS & REWIND */}
        {activeSection === 'checkpoints' && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-slate-100">
                  03. Durable Execution Checkpoints & Time-Travel Rewind
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Restore workspace files and agent conversation state to any verified pre-tool snapshot.
                </p>
              </div>

              <form onSubmit={handleCreateCheckpointSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Snapshot label (e.g. Before gRPC refactor)..."
                  value={checkpointLabel}
                  onChange={(e) => setCheckpointLabel(e.target.value)}
                  className="bg-[#0F1624] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 w-64"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Save Checkpoint
                </button>
              </form>
            </div>

            <div className="space-y-3">
              {checkpoints.map((cp) => (
                <div
                  key={cp.id}
                  className="p-4 rounded-lg border border-slate-800 bg-[#0F1624] flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-100">{cp.label}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono tabular-nums">
                      <span className="text-cyan-300">commit {cp.gitHash}</span>
                      <span aria-hidden="true">·</span>
                      <span>Saved at {cp.timestamp}</span>
                      <span aria-hidden="true">·</span>
                      <span>Turn #{cp.turnIndex}</span>
                      <span aria-hidden="true">·</span>
                      <span>{cp.filesModified.length} files tracked</span>
                    </div>
                    <p className="text-xs text-slate-300 pt-1">{cp.summary}</p>
                  </div>

                  <button
                    onClick={() => handleRewindClick(cp)}
                    className="px-3.5 py-2 rounded-lg border border-slate-700 hover:border-cyan-500/60 hover:bg-slate-800 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                  >
                    {restoredId === cp.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Workspace Rewound</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Rewind to Snapshot</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. PERSISTENT PROJECT MEMORY & AGENTS.MD RULES */}
        {activeSection === 'memory' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                04. Persistent Project Memory & AGENTS.md Rules Bank
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Architectural invariants and developer preferences automatically injected into Antigravity and Claude Code sessions.
              </p>
            </div>

            <form
              onSubmit={handleAddRuleSubmit}
              className="p-4 rounded-lg border border-slate-800 bg-[#0F1624] grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
            >
              <div>
                <label className="block text-xs text-slate-400 mb-1">Rule Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zero External Mock Data"
                  value={ruleTitle}
                  onChange={(e) => setRuleTitle(e.target.value)}
                  className="w-full bg-[#090D16] border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Memory Instruction</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Always bind local services to 127.0.0.1 and verify protobuf wire compatibility"
                  value={ruleContent}
                  onChange={(e) => setRuleContent(e.target.value)}
                  className="w-full bg-[#090D16] border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={ruleScope}
                  onChange={(e) =>
                    setRuleScope(e.target.value as 'project' | 'protocol' | 'session')
                  }
                  className="bg-[#090D16] border border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="project">Project</option>
                  <option value="protocol">Protocol</option>
                  <option value="session">Session</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-md transition-colors whitespace-nowrap shrink-0"
                >
                  Add Rule
                </button>
              </div>
            </form>

            <div className="space-y-2.5">
              {memoryRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-4 rounded-lg border border-slate-800 bg-[#0F1624] flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-100">{rule.title}</span>
                      <span className="text-xs text-slate-400 font-mono">
                        · Scope: {rule.scope} · Updated {rule.updatedAt}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{rule.content}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => onToggleMemoryRule(rule.id)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        rule.enabled
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {rule.enabled ? 'Active' : 'Muted'}
                    </button>
                    <button
                      onClick={() => onDeleteMemoryRule(rule.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors"
                      title="Delete Memory Rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
