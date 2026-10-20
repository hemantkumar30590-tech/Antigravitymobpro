import React, { useState } from 'react'
import {
  AgentKind,
  FlavorKind,
  WorkspaceFile,
  EditorTab,
  ChatSession,
  ChatMessage,
  TerminalSession,
  DaemonLog,
  GitStatusState,
  SubagentTask,
  GitWorktree,
  CheckpointSnapshot,
  MemoryRule,
} from './types'
import {
  INITIAL_FILES,
  INITIAL_CHAT_SESSION,
  INITIAL_LOGS,
  INITIAL_GIT,
  INITIAL_SUBAGENTS,
  INITIAL_WORKTREES,
  INITIAL_CHECKPOINTS,
  INITIAL_MEMORY_RULES,
} from './data/initialData'
import { ChatScreen } from './components/chat/ChatScreen'
import { AgentOrchestratorScreen } from './components/agents/AgentOrchestratorScreen'
import { IdeScreen } from './components/ide/IdeScreen'
import { TerminalScreen } from './components/terminal/TerminalScreen'
import { BrowserScreen } from './components/browser/BrowserScreen'
import { ModelSelectorModal } from './components/modals/ModelSelectorModal'
import { BridgeStatusModal } from './components/modals/BridgeStatusModal'
import { SettingsModal } from './components/modals/SettingsModal'

export const App: React.FC = () => {
  // Primary Workspace Navigation
  const [activeTab, setActiveTab] = useState<
    'chat' | 'orchestrator' | 'ide' | 'terminal' | 'browser'
  >('chat')

  // Agents & Models (Defaulting to Oct 2026 Gemini 4 Argon)
  const [activeAgent, setActiveAgent] = useState<AgentKind>('ANTIGRAVITY')
  const [activeModelId, setActiveModelId] = useState<string>('gemini-4-argon')
  const [thinkingBudget, setThinkingBudget] = useState<number>(8192)
  const [agyEnabled, setAgyEnabled] = useState(true)
  const [claudeEnabled, setClaudeEnabled] = useState(true)

  // Subsystem flavor
  const [flavor, setFlavor] = useState<FlavorKind>('termux')
  const bridgePort = flavor === 'termux' ? 1234 : 1236
  const hubPort = flavor === 'termux' ? 1235 : 1237

  // Modals
  const [showModelModal, setShowModelModal] = useState(false)
  const [showBridgeModal, setShowBridgeModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  // Oct 2026 Antigravity 2.0 State
  const [subagents, setSubagents] = useState<SubagentTask[]>(INITIAL_SUBAGENTS)
  const [worktrees, setWorktrees] = useState<GitWorktree[]>(INITIAL_WORKTREES)
  const [activeWorktreeId, setActiveWorktreeId] = useState<string>('wt-main')
  const [checkpoints, setCheckpoints] = useState<CheckpointSnapshot[]>(INITIAL_CHECKPOINTS)
  const [memoryRules, setMemoryRules] = useState<MemoryRule[]>(INITIAL_MEMORY_RULES)

  // Chat State
  const [chatSession, setChatSession] = useState<ChatSession>(INITIAL_CHAT_SESSION)
  const [isStreaming, setIsStreaming] = useState(false)

  // Files & IDE State
  const [files, setFiles] = useState<WorkspaceFile[]>(INITIAL_FILES)
  const [openTabs, setOpenTabs] = useState<EditorTab[]>([
    {
      id: 'tab-1',
      name: 'README.md',
      path: '/README.md',
      content: INITIAL_FILES[0].content || '',
      language: 'markdown',
    },
    {
      id: 'tab-2',
      name: 'AGENTS.md',
      path: '/AGENTS.md',
      content: INITIAL_FILES[1].content || '',
      language: 'markdown',
    },
  ])
  const [activeTabId, setActiveTabId] = useState<string>('tab-1')

  // Git State
  const [gitState, setGitState] = useState<GitStatusState>(INITIAL_GIT)

  // Terminal State
  const [terminalSessions, setTerminalSessions] = useState<TerminalSession[]>([
    {
      id: 'term-1',
      name: 'bash (pty1)',
      workingDir: '~',
      entries: [
        {
          output:
            'AntiGem v2.4 Linux Subsystem initialized (Oct 2026).\nKernel: Linux 6.6-termux-android aarch64\nConnected to Go IDE Bridge on 0.0.0.0:' +
            bridgePort +
            ' · Wire gRPC Hub :' +
            hubPort,
          timestamp: '21:45',
        },
      ],
    },
    {
      id: 'term-2',
      name: 'agy daemon',
      workingDir: '~/antigravity',
      entries: [
        {
          command: 'agy daemon --hub-port ' + hubPort + ' --worktrees-enabled',
          output:
            '[agy 2.0] Antigravity Language Server listening on 127.0.0.1:' +
            hubPort +
            '\n[agy 2.0] Binary Wire gRPC channel + Managed Subagent Pool ready.',
          timestamp: '21:46',
        },
      ],
    },
  ])
  const [activeTerminalId, setActiveTerminalId] = useState<string>('term-1')

  // Daemon Logs
  const [logs, setLogs] = useState<DaemonLog[]>(INITIAL_LOGS)

  const activeWorktree =
    worktrees.find((w) => w.id === activeWorktreeId) || worktrees[0]
  const activeMemoryCount = memoryRules.filter((r) => r.enabled).length

  // --- Handlers ---

  const handleToggleAgent = () => {
    setActiveAgent((prev) => (prev === 'ANTIGRAVITY' ? 'CLAUDE_CODE' : 'ANTIGRAVITY'))
  }

  const handleCreateCheckpoint = (label: string, summary: string): string => {
    const newHash = Math.random().toString(16).substring(2, 9)
    const cpId = `cp-${checkpoints.length + 1}`
    const snapshot: CheckpointSnapshot = {
      id: cpId,
      label,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      turnIndex: chatSession.messages.length,
      filesModified: openTabs.map((t) => t.path),
      gitHash: newHash,
      summary,
    }
    setCheckpoints((prev) => [snapshot, ...prev])
    setLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}`,
        timestamp: snapshot.timestamp,
        level: 'INFO',
        component: 'checkpoint_engine',
        message: `Saved durable checkpoint #${cpId} (${newHash}): ${label}`,
      },
    ])
    return cpId
  }

  const handleRestoreCheckpoint = (cp: CheckpointSnapshot) => {
    setLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        level: 'INFO',
        component: 'rewind_engine',
        message: `Rewound workspace and trajectory to checkpoint #${cp.id} (commit ${cp.gitHash}).`,
      },
    ])
  }

  const handleRewindById = (checkpointId: string) => {
    const found = checkpoints.find((c) => c.id === checkpointId)
    if (found) {
      handleRestoreCheckpoint(found)
      setActiveTab('orchestrator')
    }
  }

  const handleSpawnSubagent = (
    name: string,
    objective: string,
    model: string,
    agent: AgentKind
  ) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    const wtPath = `/worktrees/${slug || 'subagent'}`
    const newWt: GitWorktree = {
      id: `wt-${Date.now()}`,
      name: `${name} Worktree`,
      branch: `agent/${slug || 'task'}`,
      path: wtPath,
      assignedSubagent: name,
      modifiedFiles: 1,
      aheadCount: 1,
      status: 'isolated',
    }
    const newSub: SubagentTask = {
      id: `sub-${Date.now()}`,
      name,
      objective,
      agent,
      model,
      worktreePath: wtPath,
      status: 'running',
      progress: 35,
      tokensUsed: 4120,
      startedAt: 'Just now',
      logs: [
        `Created isolated Git worktree at ${wtPath}`,
        `Injected ${activeMemoryCount} project memory rules from AGENTS.md`,
        `Executing autonomous trajectory on ${model}...`,
      ],
    }
    setWorktrees((prev) => [...prev, newWt])
    setSubagents((prev) => [newSub, ...prev])
  }

  const handleToggleSubagentStatus = (id: string) => {
    setSubagents((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s
        const nextStatus = s.status === 'running' ? 'paused' : 'running'
        const nextProgress =
          nextStatus === 'running' ? Math.min(100, s.progress + 30) : s.progress
        return {
          ...s,
          status: nextProgress === 100 ? 'completed' : nextStatus,
          progress: nextProgress,
        }
      })
    )
  }

  const handleCreateWorktree = (name: string, branch: string) => {
    const slug = branch.replace(/[^a-z0-9-_]/gi, '-')
    const newWt: GitWorktree = {
      id: `wt-${Date.now()}`,
      name,
      branch,
      path: `/worktrees/${slug}`,
      modifiedFiles: 0,
      aheadCount: 0,
      status: 'isolated',
    }
    setWorktrees((prev) => [...prev, newWt])
  }

  const handleMergeWorktree = (worktreeId: string) => {
    const target = worktrees.find((w) => w.id === worktreeId)
    if (!target) return
    setGitState((prev) => ({
      ...prev,
      ahead: prev.ahead + target.aheadCount,
    }))
    setWorktrees((prev) =>
      prev.map((w) =>
        w.id === worktreeId ? { ...w, aheadCount: 0, status: 'active' } : w
      )
    )
    handleCreateCheckpoint(
      `Merged worktree ${target.branch}`,
      `Fast-forward merged ${target.aheadCount} commits from ${target.path} into main`
    )
  }

  const handleAddMemoryRule = (
    title: string,
    content: string,
    scope: 'project' | 'protocol' | 'session'
  ) => {
    const rule: MemoryRule = {
      id: `mem-${Date.now()}`,
      title,
      content,
      scope,
      enabled: true,
      updatedAt: 'Just now',
    }
    setMemoryRules((prev) => [rule, ...prev])
  }

  const handleToggleMemoryRule = (id: string) => {
    setMemoryRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    )
  }

  const handleDeleteMemoryRule = (id: string) => {
    setMemoryRules((prev) => prev.filter((r) => r.id !== id))
  }

  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agent: activeAgent,
    }

    setChatSession((prev) => ({
      ...prev,
      model: activeModelId,
      messages: [...prev.messages, userMsg],
    }))

    setIsStreaming(true)

    setTimeout(() => {
      const cpId = handleCreateCheckpoint(
        `Pre-execution turn: ${text.slice(0, 28)}`,
        `Auto-checkpoint saved on worktree ${activeWorktree.path}`
      )
      const isClaude = activeAgent === 'CLAUDE_CODE'
      const assistantMsg: ChatMessage = {
        id: `msg-resp-${Date.now()}`,
        role: 'assistant',
        content: isClaude
          ? `[Claude Code stream-json · ${activeModelId}]\nExecuted task "${text}" inside worktree \`${activeWorktree.path}\` (${activeWorktree.branch}). Created durable snapshot #${cpId} and verified all ${activeMemoryCount} active project memory rules.`
          : `[Antigravity 2.0 · ${activeModelId}]\nProcessed "${text}" over Square Wire binary gRPC hub (port ${hubPort}) in worktree \`${activeWorktree.path}\`. Saved checkpoint #${cpId} for instant time-travel rewind.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agent: activeAgent,
        modelUsed: activeModelId,
        checkpointId: cpId,
        thinking: `1. Verified worktree isolation at ${activeWorktree.path} (${activeWorktree.branch}).\n2. Enforced ${activeMemoryCount} persistent memory rules from AGENTS.md.\n3. Saved durable state checkpoint #${cpId} before running tool calls.\n4. Dispatched RPC over port ${hubPort} with thinking budget ${thinkingBudget} tokens.`,
        thinkingDurationSeconds: 1.6,
        toolCalls: [
          {
            id: `tc-${Date.now()}-1`,
            toolName: isClaude ? 'claude_worktree_exec' : 'agy_managed_subagent_dispatch',
            args: {
              instruction: text,
              worktree: activeWorktree.path,
              checkpointId: cpId,
              model: activeModelId,
            },
            output: `{"status": "COMPLETED", "worktree": "${activeWorktree.path}", "checkpoint": "${cpId}", "schemaParity": "VERIFIED"}`,
            status: 'success',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      }

      setChatSession((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMsg],
      }))

      setIsStreaming(false)
    }, 900)
  }

  const handleApproveTool = (toolId: string) => {
    setChatSession((prev) => ({
      ...prev,
      messages: prev.messages.map((m) => {
        if (!m.toolCalls) return m
        return {
          ...m,
          toolCalls: m.toolCalls.map((tc) =>
            tc.id === toolId
              ? { ...tc, status: 'success', output: 'Tool approved and executed.' }
              : tc
          ),
        }
      }),
    }))
  }

  const handleDenyTool = (toolId: string) => {
    setChatSession((prev) => ({
      ...prev,
      messages: prev.messages.map((m) => {
        if (!m.toolCalls) return m
        return {
          ...m,
          toolCalls: m.toolCalls.map((tc) =>
            tc.id === toolId
              ? { ...tc, status: 'error', output: 'Execution denied by developer.' }
              : tc
          ),
        }
      }),
    }))
  }

  const handleAnswerQuestionnaire = (answers: string[]) => {
    handleSendMessage(`Proceed with: ${answers.join(', ')}`)
  }

  const handleOpenFile = (file: WorkspaceFile) => {
    const existing = openTabs.find((t) => t.path === file.path)
    if (existing) {
      setActiveTabId(existing.id)
    } else {
      const newTab: EditorTab = {
        id: `tab-${Date.now()}`,
        name: file.name,
        path: file.path,
        content: file.content || '',
        language: file.language || 'text',
      }
      setOpenTabs((prev) => [...prev, newTab])
      setActiveTabId(newTab.id)
    }
    setActiveTab('ide')
  }

  const handleCloseTab = (tabId: string) => {
    const remaining = openTabs.filter((t) => t.id !== tabId)
    setOpenTabs(remaining)
    if (activeTabId === tabId && remaining.length > 0) {
      setActiveTabId(remaining[remaining.length - 1].id)
    }
  }

  const handleSaveFile = (tabId: string, content: string) => {
    setOpenTabs((prev) =>
      prev.map((t) => (t.id === tabId ? { ...t, content, isDirty: false } : t))
    )
    const tab = openTabs.find((t) => t.id === tabId)
    if (tab) {
      setGitState((prev) => ({
        ...prev,
        unstaged: Array.from(new Set([...prev.unstaged, tab.path])),
      }))
    }
  }

  const handleCreateFile = (name: string, isFolder: boolean) => {
    const newFile: WorkspaceFile = {
      id: `file-${Date.now()}`,
      name,
      path: `/${name}`,
      type: isFolder ? 'directory' : 'file',
      content: isFolder ? undefined : `// ${name}\n`,
      children: isFolder ? [] : undefined,
    }
    setFiles((prev) => [...prev, newFile])
    if (!isFolder) {
      handleOpenFile(newFile)
    }
  }

  const handleDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleCommitGit = (message: string) => {
    setGitState((prev) => ({
      ...prev,
      staged: [],
      ahead: prev.ahead + 1,
    }))
    handleCreateCheckpoint(`Git Commit: ${message}`, `Committed staged changes to ${gitState.branch}`)
  }

  const handleStageFile = (path: string) => {
    setGitState((prev) => ({
      ...prev,
      unstaged: prev.unstaged.filter((f) => f !== path),
      staged: Array.from(new Set([...prev.staged, path])),
    }))
  }

  const handleUnstageFile = (path: string) => {
    setGitState((prev) => ({
      ...prev,
      staged: prev.staged.filter((f) => f !== path),
      unstaged: Array.from(new Set([...prev.unstaged, path])),
    }))
  }

  const handleExecuteTerminal = (sessionId: string, cmd: string) => {
    let output = ''
    if (cmd === 'clear') {
      setTerminalSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, entries: [] } : s))
      )
      return
    } else if (cmd === 'agy status' || cmd === 'agy') {
      output = `Antigravity Language Server (agy) v2.4 (Oct 2026)\nActive Model: ${activeModelId}\nHub Port: ${hubPort} (Binary Square Wire gRPC)\nActive Worktree: ${activeWorktree.path} (${activeWorktree.branch})\nSubagents Running: ${subagents.filter((s) => s.status === 'running').length}\nCheckpoints Stored: ${checkpoints.length}`
    } else if (cmd === 'agy subagents') {
      output = subagents
        .map((s) => `[${s.status.toUpperCase()}] ${s.name} (${s.model}) -> ${s.worktreePath} [${s.progress}%]`)
        .join('\n')
    } else if (cmd === 'agy worktrees') {
      output = worktrees
        .map((w) => `${w.id === activeWorktreeId ? '*' : ' '} ${w.path} (${w.branch}) [+${w.aheadCount} commits]`)
        .join('\n')
    } else if (cmd === 'agy checkpoints') {
      output = checkpoints
        .map((c) => `#${c.id} (${c.gitHash}) @ ${c.timestamp} - ${c.label}`)
        .join('\n')
    } else if (cmd === 'git status') {
      output = `On branch ${activeWorktree.branch} (${activeWorktree.path})\nStaged files: ${gitState.staged.length}\nUnstaged changes: ${gitState.unstaged.length}`
    } else if (cmd === 'ls' || cmd === 'ls -la') {
      output = `drwxr-xr-x 5 antigem antigem 4096 Oct 19 21:55 .\n-rw-r--r-- 1 antigem antigem 1420 README.md\n-rw-r--r-- 1 antigem antigem  890 AGENTS.md\ndrwxr-xr-x 3 antigem antigem 4096 Oct 19 21:50 agy_ide_bridge\ndrwxr-xr-x 3 antigem antigem 4096 Oct 19 21:52 worktrees`
    } else if (cmd === 'ps aux' || cmd === 'ps') {
      output = `USER       PID %CPU %MEM COMMAND\nantigem      1  0.0  0.1 /system/bin/init\nantigem     14  0.2  0.8 agy_ide_bridge -port ${bridgePort} -hub ${hubPort}\nantigem     18  0.5  1.4 agy daemon --model ${activeModelId} --worktrees\nantigem     24  0.3  0.9 claude --output-format stream-json`
    } else if (cmd.startsWith('cat ')) {
      const filename = cmd.replace('cat ', '').trim()
      const found = files.find((f) => f.name === filename || f.path.endsWith(filename))
      output = found?.content || `cat: ${filename}: No such file or directory`
    } else if (cmd === 'help') {
      output = `AntiGem Oct 2026 Shell Commands:\n  agy status       - Check Antigravity 2.0 daemon & Wire gRPC hub\n  agy subagents    - List parallel background subagents\n  agy worktrees    - List isolated Git worktrees\n  agy checkpoints  - List durable state snapshots\n  git status       - Show repository status\n  ls -la           - List workspace files\n  cat <file>       - Print file contents\n  clear            - Clear terminal screen`
    } else {
      output = `bash: ${cmd}: executed in Termux sandbox (${activeWorktree.path}) -> exit code 0`
    }

    setTerminalSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s
        return {
          ...s,
          entries: [
            ...s.entries,
            {
              command: cmd,
              output,
              timestamp: new Date().toLocaleTimeString(),
            },
          ],
        }
      })
    )
  }

  const handleClearTerminal = (sessionId: string) => {
    setTerminalSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, entries: [] } : s))
    )
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0B0F17] text-slate-100 overflow-hidden">
      {/* Strict 3-Zone Top Navigation Header */}
      <header className="h-13 bg-[#090D16] border-b border-slate-800 px-6 flex items-center justify-between gap-8 shrink-0 select-none">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#chat"
          onClick={(e) => {
            e.preventDefault()
            setActiveTab('chat')
          }}
          className="text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          AntiGem
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="flex items-center gap-6 text-xs font-medium text-slate-400 overflow-x-auto">
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'chat'
                ? 'text-cyan-400 underline underline-offset-8 decoration-2'
                : 'hover:text-slate-100'
            }`}
          >
            Agent Chat
          </button>
          <button
            onClick={() => setActiveTab('orchestrator')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'orchestrator'
                ? 'text-cyan-400 underline underline-offset-8 decoration-2'
                : 'hover:text-slate-100'
            }`}
          >
            Orchestrator
          </button>
          <button
            onClick={() => setActiveTab('ide')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'ide'
                ? 'text-cyan-400 underline underline-offset-8 decoration-2'
                : 'hover:text-slate-100'
            }`}
          >
            Code Editor
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'terminal'
                ? 'text-cyan-400 underline underline-offset-8 decoration-2'
                : 'hover:text-slate-100'
            }`}
          >
            Terminal
          </button>
          <button
            onClick={() => setActiveTab('browser')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'browser'
                ? 'text-cyan-400 underline underline-offset-8 decoration-2'
                : 'hover:text-slate-100'
            }`}
          >
            WebMCP Browser
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => setShowBridgeModal(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 font-mono tabular-nums"
          >
            Bridge :{bridgePort}
          </button>
        </div>
      </header>

      {/* Secondary Workspace Context Toolbar */}
      <div className="px-6 py-1.5 bg-[#0D1320] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 font-mono tabular-nums shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-200 font-medium">
            {activeAgent === 'ANTIGRAVITY' ? 'Antigravity 2.0' : 'Claude Code CLI'}
          </span>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => setShowModelModal(true)}
            className="text-cyan-300 hover:underline whitespace-nowrap shrink-0"
          >
            {activeModelId} (Thinking: {thinkingBudget / 1024}k)
          </button>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => setActiveTab('orchestrator')}
            className="hover:text-slate-200 whitespace-nowrap shrink-0"
          >
            Worktree: {activeWorktree.branch}
          </button>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => setActiveTab('orchestrator')}
            className="hover:text-slate-200 whitespace-nowrap shrink-0"
          >
            Subagents: {subagents.filter((s) => s.status === 'running').length} running
          </button>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => setActiveTab('orchestrator')}
            className="hover:text-slate-200 whitespace-nowrap shrink-0"
          >
            Checkpoints: {checkpoints.length}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="text-xs text-slate-300 hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0"
          >
            Workspace Settings
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'chat' && (
          <ChatScreen
            session={chatSession}
            onSendMessage={handleSendMessage}
            activeAgent={activeAgent}
            onToggleAgent={handleToggleAgent}
            onOpenModelSelector={() => setShowModelModal(true)}
            onApproveTool={handleApproveTool}
            onDenyTool={handleDenyTool}
            onAnswerQuestionnaire={handleAnswerQuestionnaire}
            onClearChat={() => setChatSession((prev) => ({ ...prev, messages: [] }))}
            onCreateCheckpoint={handleCreateCheckpoint}
            onRewindToCheckpoint={handleRewindById}
            activeWorktree={activeWorktree}
            activeMemoryCount={activeMemoryCount}
            isStreaming={isStreaming}
          />
        )}

        {activeTab === 'orchestrator' && (
          <AgentOrchestratorScreen
            subagents={subagents}
            worktrees={worktrees}
            checkpoints={checkpoints}
            memoryRules={memoryRules}
            activeWorktreeId={activeWorktreeId}
            onSpawnSubagent={handleSpawnSubagent}
            onToggleSubagentStatus={handleToggleSubagentStatus}
            onMergeWorktree={handleMergeWorktree}
            onSelectWorktree={setActiveWorktreeId}
            onCreateWorktree={handleCreateWorktree}
            onCreateCheckpoint={handleCreateCheckpoint}
            onRestoreCheckpoint={handleRestoreCheckpoint}
            onAddMemoryRule={handleAddMemoryRule}
            onToggleMemoryRule={handleToggleMemoryRule}
            onDeleteMemoryRule={handleDeleteMemoryRule}
          />
        )}

        {activeTab === 'ide' && (
          <IdeScreen
            files={files}
            openTabs={openTabs}
            activeTabId={activeTabId}
            gitState={gitState}
            worktrees={worktrees}
            activeWorktreeId={activeWorktreeId}
            onSelectWorktree={setActiveWorktreeId}
            onSelectTab={setActiveTabId}
            onCloseTab={handleCloseTab}
            onOpenFile={handleOpenFile}
            onSaveFile={handleSaveFile}
            onCreateFile={handleCreateFile}
            onDeleteFile={handleDeleteFile}
            onCommitGit={handleCommitGit}
            onStageGitFile={handleStageFile}
            onUnstageGitFile={handleUnstageFile}
            onCreateCheckpoint={handleCreateCheckpoint}
          />
        )}

        {activeTab === 'terminal' && (
          <TerminalScreen
            sessions={terminalSessions}
            activeSessionId={activeTerminalId}
            onSelectSession={setActiveTerminalId}
            onNewSession={() => {
              const newSess: TerminalSession = {
                id: `term-${Date.now()}`,
                name: `session ${terminalSessions.length + 1}`,
                workingDir: activeWorktree.path,
                entries: [
                  {
                    output: `AntiGem Termux session ${terminalSessions.length + 1} mounted at ${activeWorktree.path}.`,
                    timestamp: new Date().toLocaleTimeString(),
                  },
                ],
              }
              setTerminalSessions((prev) => [...prev, newSess])
              setActiveTerminalId(newSess.id)
            }}
            onCloseSession={(id) => {
              const remaining = terminalSessions.filter((s) => s.id !== id)
              setTerminalSessions(remaining)
              if (activeTerminalId === id && remaining.length > 0) {
                setActiveTerminalId(remaining[0].id)
              }
            }}
            onExecuteCommand={handleExecuteTerminal}
            onClearSession={handleClearTerminal}
          />
        )}

        {activeTab === 'browser' && <BrowserScreen />}
      </main>

      {/* Modals */}
      {showModelModal && (
        <ModelSelectorModal
          currentModelId={activeModelId}
          onSelectModel={(id) => setActiveModelId(id)}
          thinkingBudget={thinkingBudget}
          onChangeThinkingBudget={(b) => setThinkingBudget(b)}
          onClose={() => setShowModelModal(false)}
        />
      )}

      {showBridgeModal && (
        <BridgeStatusModal
          logs={logs}
          flavor={flavor}
          bridgePort={bridgePort}
          hubPort={hubPort}
          onToggleFlavor={() =>
            setFlavor((prev) => (prev === 'termux' ? 'standard' : 'termux'))
          }
          onClose={() => setShowBridgeModal(false)}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          flavor={flavor}
          onSelectFlavor={setFlavor}
          agyEnabled={agyEnabled}
          onToggleAgy={() => setAgyEnabled(!agyEnabled)}
          claudeEnabled={claudeEnabled}
          onToggleClaude={() => setClaudeEnabled(!claudeEnabled)}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  )
}
export default App
