export type AgentKind = 'ANTIGRAVITY' | 'CLAUDE_CODE'

export type FlavorKind = 'termux' | 'standard'

export interface ModelOption {
  id: string
  name: string
  provider: 'google' | 'anthropic'
  releaseTag: string
  contextWindow: string
  supportsThinking: boolean
  description: string
}

export interface ToolCall {
  id: string
  toolName: string
  args: Record<string, any>
  output?: string
  status: 'pending' | 'running' | 'success' | 'error' | 'approval_required'
  timestamp: string
}

export interface ChoiceQuestion {
  question: string
  options: string[]
  isMultiSelect?: boolean
  selected?: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  thinking?: string
  thinkingDurationSeconds?: number
  toolCalls?: ToolCall[]
  questionnaire?: ChoiceQuestion
  status?: 'streaming' | 'completed' | 'error'
  agent: AgentKind
  modelUsed?: string
  checkpointId?: string
}

export interface ChatSession {
  id: string
  title: string
  agent: AgentKind
  model: string
  createdAt: string
  messages: ChatMessage[]
}

export interface WorkspaceFile {
  id: string
  name: string
  path: string
  type: 'file' | 'directory'
  content?: string
  language?: string
  children?: WorkspaceFile[]
}

export interface EditorTab {
  id: string
  name: string
  path: string
  content: string
  language: string
  isDirty?: boolean
}

export interface TerminalEntry {
  command?: string
  output: string
  isError?: boolean
  timestamp: string
}

export interface TerminalSession {
  id: string
  name: string
  entries: TerminalEntry[]
  workingDir: string
}

export interface DaemonLog {
  id: string
  timestamp: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  component: string
  message: string
}

export interface GitStatusState {
  branch: string
  ahead: number
  behind: number
  staged: string[]
  unstaged: string[]
  untracked: string[]
}

// --- Oct 2026 Antigravity 2.0 Upgrades ---

export interface SubagentTask {
  id: string
  name: string
  objective: string
  agent: AgentKind
  model: string
  worktreePath: string
  status: 'running' | 'completed' | 'paused' | 'failed'
  progress: number
  tokensUsed: number
  startedAt: string
  logs: string[]
}

export interface GitWorktree {
  id: string
  name: string
  branch: string
  path: string
  assignedSubagent?: string
  modifiedFiles: number
  aheadCount: number
  status: 'active' | 'isolated' | 'ready_to_merge'
}

export interface CheckpointSnapshot {
  id: string
  label: string
  timestamp: string
  turnIndex: number
  filesModified: string[]
  gitHash: string
  summary: string
  fileBackup?: Record<string, string>
}

export interface MemoryRule {
  id: string
  scope: 'project' | 'protocol' | 'session'
  title: string
  content: string
  enabled: boolean
  updatedAt: string
}

export interface WebMcpTool {
  id: string
  name: string
  category: 'webmcp' | 'chrome_devtools' | 'google_flow'
  description: string
  schemaSummary: string
  enabled: boolean
  callsCount: number
  lastOutput?: string
}
