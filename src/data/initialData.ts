import {
  ModelOption,
  WorkspaceFile,
  ChatSession,
  DaemonLog,
  GitStatusState,
  SubagentTask,
  GitWorktree,
  CheckpointSnapshot,
  MemoryRule,
  WebMcpTool,
} from '../types'

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'gemini-4-argon',
    name: 'Gemini 4 Argon',
    provider: 'google',
    releaseTag: 'Oct 2026 Flagship',
    contextWindow: '2,000,000 tokens',
    supportsThinking: true,
    description:
      'Next-generation Oct 2026 Antigravity model engineered for autonomous multi-file refactoring, deep architecture verification, and parallel subagent orchestration.',
  },
  {
    id: 'gemini-3-5-pro',
    name: 'Gemini 3.5 Pro',
    provider: 'google',
    releaseTag: 'Managed Agents API',
    contextWindow: '2,000,000 tokens',
    supportsThinking: true,
    description:
      'Production workhorse with native Square Wire binary gRPC streaming and sandboxed tool execution.',
  },
  {
    id: 'gemini-3-5-flash',
    name: 'Gemini 3.5 Flash',
    provider: 'google',
    releaseTag: 'Low-Latency Worker',
    contextWindow: '1,000,000 tokens',
    supportsThinking: true,
    description:
      'Sub-second trajectory execution tailored for background subagents, Git worktree validation, and instant linting.',
  },
  {
    id: 'claude-4-sonnet',
    name: 'Claude 4 Sonnet',
    provider: 'anthropic',
    releaseTag: 'Stream-JSON CLI',
    contextWindow: '500,000 tokens',
    supportsThinking: true,
    description:
      'High-precision code synthesis and diff generation running over persistent bidirectional NDJSON relay.',
  },
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'anthropic',
    releaseTag: 'Hybrid Reasoning',
    contextWindow: '200,000 tokens',
    supportsThinking: true,
    description:
      'Hybrid reasoning and rapid file patching via local Termux Claude CLI process.',
  },
]

export const INITIAL_FILES: WorkspaceFile[] = [
  {
    id: 'f-readme',
    name: 'README.md',
    path: '/README.md',
    type: 'file',
    language: 'markdown',
    content: `# AntiGem v2.4 (Oct 2026 Agentic Edition)\n\n**Agentic AI Coding Workspace, Parallel Worktree Orchestrator & Native Termux IDE Hub**\n\n- **Gemini 4 Argon & Managed Subagents**: Spawn isolated background agents on dedicated Git worktrees.\n- **Antigravity (agy) v2.0**: Direct Square Wire binary gRPC hub protocol on port 1235.\n- **Claude Code CLI Relay**: Bidirectional stream-json protocol with live checkpoint rewind.\n- **WebMCP & Chrome DevTools Agent API**: Structured DOM tool discovery and automated flamegraph diagnostics.`,
  },
  {
    id: 'f-agents-md',
    name: 'AGENTS.md',
    path: '/AGENTS.md',
    type: 'file',
    language: 'markdown',
    content: `# AntiGem Project Memory & Agent Rules\n\n1. **Format Parity**: Both JSON and binary gRPC return the exact same protobuf schema and fields from the daemon.\n2. **Process Guard**: Always verify running tasks before spawning duplicate build or bridge processes.\n3. **Worktree Isolation**: Background subagents must execute inside isolated Git worktrees (/worktrees/*) before merging to main.\n4. **Termux Target**: Default local builds target termuxBuild on ports 1234 (Bridge) and 1235 (Hub).`,
  },
  {
    id: 'f-bridge',
    name: 'agy_ide_bridge',
    path: '/agy_ide_bridge',
    type: 'directory',
    children: [
      {
        id: 'f-main-go',
        name: 'main.go',
        path: '/agy_ide_bridge/main.go',
        type: 'file',
        language: 'go',
        content: `package main\n\nimport (\n\t"flag"\n\t"log"\n\t"net/http"\n\t"agy_ide_bridge/pkg/ws"\n)\n\nfunc main() {\n\tport := flag.String("port", "1234", "Bridge listen port")\n\thubPort := flag.String("hub", "1235", "Antigravity Wire gRPC hub port")\n\tflag.Parse()\n\tlog.Printf("Starting AntiGem Go IDE Bridge on :%s (Wire gRPC Hub :%s)", *port, *hubPort)\n\thub := ws.NewHub()\n\tgo hub.Run()\n\thttp.HandleFunc("/ws", hub.ServeWS)\n\thttp.HandleFunc("/checkpoints", hub.HandleCheckpoints)\n\tlog.Fatal(http.ListenAndServe(":"+*port, nil))\n}`,
      },
      {
        id: 'f-rewind-go',
        name: 'rewind.go',
        path: '/agy_ide_bridge/pkg/claude/rewind.go',
        type: 'file',
        language: 'go',
        content: `package claude\n\nimport "fmt"\n\n// RestoreCheckpoint rewinds workspace files and agent trajectory to a verified snapshot\nfunc RestoreCheckpoint(checkpointID string, worktreePath string) error {\n\tfmt.Printf("Rewinding worktree %s to checkpoint %s\\n", worktreePath, checkpointID)\n\treturn nil\n}`,
      },
    ],
  },
  {
    id: 'f-proto',
    name: 'LanguageServerService.proto',
    path: '/app/src/main/proto/LanguageServerService.proto',
    type: 'file',
    language: 'protobuf',
    content: `syntax = "proto3";\npackage antigravity.v2;\n\nservice LanguageServerService {\n  rpc StreamChat (ChatRequest) returns (stream ChatResponse);\n  rpc SpawnSubagent (SubagentSpec) returns (SubagentHandle);\n  rpc CreateCheckpoint (CheckpointRequest) returns (CheckpointMetadata);\n  rpc RewindToCheckpoint (RewindRequest) returns (RewindStatus);\n  rpc InspectDaemon (DaemonQuery) returns (DaemonStatus);\n}`,
  },
  {
    id: 'f-webmcp',
    name: 'webmcp-bridge.mjs',
    path: '/app/src/main/assets/browser-runtime/webmcp-bridge.mjs',
    type: 'file',
    language: 'javascript',
    content: `// Oct 2026 WebMCP Open Standard Bridge for Browser Agents\nexport function registerWebMcpTools(windowContext) {\n  return {\n    protocolVersion: '2026.10',\n    tools: [\n      'webmcp.exposeStructuredDom',\n      'devtools.performanceFlamegraphAudit',\n      'devtools.jsExecutionStepper'\n    ]\n  };\n}`,
  },
  {
    id: 'f-version-json',
    name: 'version.json',
    path: '/version.json',
    type: 'file',
    language: 'json',
    content: `{\n  "version_code": 113,\n  "version_name": "2.0.0",\n  "min_supported_version_code": 1,\n  "changelog": [\n    "Oct 2026 Antigravity 2.0 Upgrade: Added Gemini 4 Argon, Gemini 3.5 Pro/Flash, and Claude 4 Sonnet model engines",\n    "Added Parallel Background Subagent Orchestrator with isolated context windows and live trajectory logs",\n    "Added Git Worktrees Manager for conflict-free multi-agent parallel execution and 1-click merge to main",\n    "Added Durable Execution Checkpoints and Time-Travel Rewind snapshots across IDE and Chat",\n    "Added Persistent Project Memory and AGENTS.md Rules Bank with project, protocol, and session scopes",\n    "Added Oct 2026 WebMCP Standard and Chrome DevTools AI Agent Inspector (Flamegraph & JS Stepper)"\n  ],\n  "is_critical": false\n}`,
  },
]

export const INITIAL_CHAT_SESSION: ChatSession = {
  id: 'session-main',
  title: 'Antigravity 2.0 Architecture & Worktree Sync',
  agent: 'ANTIGRAVITY',
  model: 'gemini-4-argon',
  createdAt: '21:48',
  messages: [
    {
      id: 'msg-1',
      role: 'user',
      content:
        'Verify the Go IDE Bridge status, create a pre-edit checkpoint, and check if our background subagents have finished auditing the Wire gRPC schema.',
      timestamp: '21:48',
      agent: 'ANTIGRAVITY',
    },
    {
      id: 'msg-2',
      role: 'assistant',
      content:
        'The Go IDE Bridge is online on port 1234 with binary Wire gRPC connected to hub port 1235. I created Checkpoint #cp-3 (`c704f8a`) prior to running diagnostics. Subagent `gRPC Protobuf Schema Auditor` has completed its verification in `/worktrees/proto-sync` with 100% schema parity between JSON and binary Wire gRPC.',
      timestamp: '21:49',
      agent: 'ANTIGRAVITY',
      modelUsed: 'gemini-4-argon',
      checkpointId: 'cp-3',
      thinking:
        '1. Checked daemon socket at 127.0.0.1:1235 via Square Wire gRPC.\n2. Recorded durable execution checkpoint cp-3 (hash c704f8a).\n3. Queried Managed Agents pool: proto-sync worktree has 0 conflicts and passes format parity rules from AGENTS.md.',
      thinkingDurationSeconds: 1.9,
      toolCalls: [
        {
          id: 'tc-1',
          toolName: 'create_checkpoint',
          args: { label: 'Pre-audit workspace state', worktree: '/workspace' },
          output:
            '{"checkpoint_id": "cp-3", "git_hash": "c704f8a", "files_tracked": 5, "status": "SAVED"}',
          status: 'success',
          timestamp: '21:48',
        },
        {
          id: 'tc-2',
          toolName: 'inspect_subagent_worktree',
          args: { worktree: '/worktrees/proto-sync', subagent: 'gRPC Protobuf Schema Auditor' },
          output:
            '{"status": "READY_TO_MERGE", "schema_parity": "VERIFIED", "ahead_commits": 2}',
          status: 'success',
          timestamp: '21:49',
        },
      ],
      questionnaire: {
        question: 'Which workflow action should we trigger next?',
        options: [
          '(Recommended) Merge /worktrees/proto-sync into main workspace',
          'Spawn a parallel subagent to write WebMCP integration tests',
          'Run Chrome DevTools AI Flamegraph audit on localhost:3000',
        ],
        selected: ['(Recommended) Merge /worktrees/proto-sync into main workspace'],
      },
    },
  ],
}

export const INITIAL_SUBAGENTS: SubagentTask[] = [
  {
    id: 'sub-1',
    name: 'gRPC Protobuf Schema Auditor',
    objective: 'Verify binary Wire gRPC and JSON payload parity across LanguageServerService.proto',
    agent: 'ANTIGRAVITY',
    model: 'gemini-3-5-flash',
    worktreePath: '/worktrees/proto-sync',
    status: 'completed',
    progress: 100,
    tokensUsed: 18420,
    startedAt: '4m ago',
    logs: [
      'Cloned isolated Git worktree at /worktrees/proto-sync',
      'Parsed 42 message definitions in LanguageServerService.proto',
      'Verified 100% field parity between JSON serializer and Square Wire binary codec',
      'Ready to merge 2 commits into main',
    ],
  },
  {
    id: 'sub-2',
    name: 'WebMCP DOM Bridge Generator',
    objective: 'Expose structured HTML forms and JS hooks for Oct 2026 WebMCP browser agents',
    agent: 'ANTIGRAVITY',
    model: 'gemini-4-argon',
    worktreePath: '/worktrees/webmcp-host',
    status: 'running',
    progress: 68,
    tokensUsed: 31250,
    startedAt: '2m ago',
    logs: [
      'Checked out branch feat/webmcp-standard-2026 in /worktrees/webmcp-host',
      'Injected navigator.modelContext tool descriptors',
      'Running automated headless WebView assertions (11/16 passed)...',
    ],
  },
  {
    id: 'sub-3',
    name: 'Claude Stream-JSON Rewind Verifier',
    objective: 'Test non-destructive checkpoint restore across active Termux PTY descriptors',
    agent: 'CLAUDE_CODE',
    model: 'claude-4-sonnet',
    worktreePath: '/worktrees/rewind-test',
    status: 'paused',
    progress: 45,
    tokensUsed: 12900,
    startedAt: '9m ago',
    logs: [
      'Initialized stream-json NDJSON relay session',
      'Validated snapshot diff calculation in agy_ide_bridge/pkg/claude/rewind.go',
      'Paused awaiting developer approval for PTY reset test',
    ],
  },
]

export const INITIAL_WORKTREES: GitWorktree[] = [
  {
    id: 'wt-main',
    name: 'Primary Workspace',
    branch: 'main',
    path: '/workspace',
    modifiedFiles: 1,
    aheadCount: 0,
    status: 'active',
  },
  {
    id: 'wt-proto',
    name: 'Proto Sync Worktree',
    branch: 'chore/wire-grpc-parity',
    path: '/worktrees/proto-sync',
    assignedSubagent: 'gRPC Protobuf Schema Auditor',
    modifiedFiles: 2,
    aheadCount: 2,
    status: 'ready_to_merge',
  },
  {
    id: 'wt-webmcp',
    name: 'WebMCP Host Worktree',
    branch: 'feat/webmcp-standard-2026',
    path: '/worktrees/webmcp-host',
    assignedSubagent: 'WebMCP DOM Bridge Generator',
    modifiedFiles: 3,
    aheadCount: 1,
    status: 'isolated',
  },
]

export const INITIAL_CHECKPOINTS: CheckpointSnapshot[] = [
  {
    id: 'cp-3',
    label: 'WebMCP & Subagent Worktree Hook',
    timestamp: '21:48:30',
    turnIndex: 2,
    filesModified: ['/README.md', '/app/src/main/proto/LanguageServerService.proto'],
    gitHash: 'c704f8a',
    summary: 'Added SpawnSubagent and RewindToCheckpoint RPCs to LanguageServerService.proto',
  },
  {
    id: 'cp-2',
    label: 'Wire gRPC & Claude Stream-JSON Parity',
    timestamp: '21:35:12',
    turnIndex: 1,
    filesModified: ['/agy_ide_bridge/main.go', '/agy_ide_bridge/pkg/claude/rewind.go'],
    gitHash: '4b92e1d',
    summary: 'Registered /checkpoints endpoint and NDJSON stream relay handler',
  },
  {
    id: 'cp-1',
    label: 'Baseline Workspace Initialization',
    timestamp: '21:28:00',
    turnIndex: 0,
    filesModified: ['/README.md'],
    gitHash: '8f31a0c',
    summary: 'Initial clean repository state on branch main',
  },
]

export const INITIAL_MEMORY_RULES: MemoryRule[] = [
  {
    id: 'mem-1',
    scope: 'protocol',
    title: 'Protobuf & JSON Schema Parity',
    content:
      'Both JSON and binary gRPC return the exact same protobuf schema and fields from the daemon; never assume divergent keys.',
    enabled: true,
    updatedAt: 'Oct 2026',
  },
  {
    id: 'mem-2',
    scope: 'project',
    title: 'Termux Standalone Build Target',
    content:
      'Default all local Android/Linux subsystem tasks to termuxBuild (ports 1234/1235) rather than standard build.',
    enabled: true,
    updatedAt: 'Oct 2026',
  },
  {
    id: 'mem-3',
    scope: 'session',
    title: 'Process Deduplication Guard',
    content:
      'Always inspect active background tasks before spawning a new build or daemon process to prevent port collisions.',
    enabled: true,
    updatedAt: 'Oct 2026',
  },
  {
    id: 'mem-4',
    scope: 'project',
    title: 'Git Worktree Subagent Isolation',
    content:
      'Parallel subagents must write changes inside /worktrees/<branch> and pass diff review before merging into /workspace.',
    enabled: true,
    updatedAt: 'Oct 2026',
  },
]

export const INITIAL_WEBMCP_TOOLS: WebMcpTool[] = [
  {
    id: 'wm-1',
    name: 'webmcp.exposeStructuredDom',
    category: 'webmcp',
    description:
      'Oct 2026 W3C/Google I/O WebMCP standard: exposes semantic form actions and callable JS contracts to browser agents.',
    schemaSummary: '{ selector?: string, includeInteractiveOnly: boolean } -> WebMcpContractTree',
    enabled: true,
    callsCount: 14,
    lastOutput:
      '{"protocol": "WebMCP/1.0", "exposedActions": 8, "interactiveElements": ["button#run-agent", "form#commit-form"]}',
  },
  {
    id: 'wm-2',
    name: 'devtools.performanceFlamegraphAudit',
    category: 'chrome_devtools',
    description:
      'Oct 2026 Chrome DevTools AI Agent API: captures main-thread layout shifts, long tasks, and React render bottlenecks.',
    schemaSummary: '{ durationMs: number, thresholdMs: number } -> FlamegraphAuditReport',
    enabled: true,
    callsCount: 6,
    lastOutput:
      '{"fps": 60, "longTasksCount": 0, "cls": 0.00, "recommendation": "All compositor animations running within 16.6ms frame budget."}',
  },
  {
    id: 'wm-3',
    name: 'devtools.jsExecutionStepper',
    category: 'chrome_devtools',
    description:
      'Allows Antigravity agent to set conditional breakpoints, inspect closure scopes, and step over async promises.',
    schemaSummary: '{ scriptUrl: string, lineNumber: number, condition?: string } -> ScopeSnapshot',
    enabled: true,
    callsCount: 4,
    lastOutput:
      '{"paused": false, "verifiedBreakpoints": 2, "activeCallStack": "ws.NewHub -> ServeWS"}',
  },
  {
    id: 'wm-4',
    name: 'flow.autonomousStoryboardReplay',
    category: 'google_flow',
    description:
      'Replays multi-step user journeys across mobile WebView tabs and verifies visual and network invariants.',
    schemaSummary: '{ workflowId: string, assertNetwork200: boolean } -> FlowReplayResult',
    enabled: true,
    callsCount: 9,
    lastOutput:
      '{"stepsCompleted": 5, "networkErrors": 0, "status": "PASSED"}',
  },
]

export const INITIAL_LOGS: DaemonLog[] = [
  {
    id: 'l-1',
    timestamp: '21:45:12',
    level: 'INFO',
    component: 'agy_bridge',
    message: 'Go IDE Bridge v2.4 initialized on 0.0.0.0:1234 (Termux standalone flavor).',
  },
  {
    id: 'l-2',
    timestamp: '21:45:14',
    level: 'INFO',
    component: 'grpc_hub',
    message: 'Square Wire binary gRPC socket connected to Antigravity 2.0 daemon on port 1235.',
  },
  {
    id: 'l-3',
    timestamp: '21:46:02',
    level: 'INFO',
    component: 'worktree_mgr',
    message: 'Mounted 2 isolated Git worktrees (/worktrees/proto-sync, /worktrees/webmcp-host).',
  },
  {
    id: 'l-4',
    timestamp: '21:48:30',
    level: 'INFO',
    component: 'checkpoint_engine',
    message: 'Saved durable state checkpoint #cp-3 (git ref c704f8a).',
  },
]

export const INITIAL_GIT: GitStatusState = {
  branch: 'main',
  ahead: 0,
  behind: 0,
  staged: ['/README.md'],
  unstaged: ['/agy_ide_bridge/main.go'],
  untracked: ['/app/src/main/assets/browser-runtime/webmcp-bridge.mjs'],
}
