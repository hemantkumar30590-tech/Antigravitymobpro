import React, { useState } from 'react'
import { WorkspaceFile, GitStatusState, GitWorktree } from '../../types'
import { GitSourceControlView } from './GitSourceControlView'
import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  File,
  Plus,
  Trash2,
  Search,
  GitBranch,
} from 'lucide-react'

interface ProjectSidebarProps {
  files: WorkspaceFile[]
  activeFilePath?: string
  onSelectFile: (file: WorkspaceFile) => void
  onCreateFile: (name: string, isFolder: boolean) => void
  onDeleteFile: (id: string) => void
  activeView: 'files' | 'git'
  setActiveView: (view: 'files' | 'git') => void
  gitState: GitStatusState
  onCommitGit: (message: string) => void
  onStageGitFile: (path: string) => void
  onUnstageGitFile: (path: string) => void
  worktrees: GitWorktree[]
  activeWorktreeId: string
  onSelectWorktree: (id: string) => void
}

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  files,
  activeFilePath,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  activeView,
  setActiveView,
  gitState,
  onCommitGit,
  onStageGitFile,
  onUnstageGitFile,
  worktrees,
  activeWorktreeId,
  onSelectWorktree,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'f-bridge': true,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [newFileName, setNewFileName] = useState('')

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newFileName.trim()) {
      onCreateFile(newFileName.trim(), false)
      setNewFileName('')
      setIsCreating(false)
    }
  }

  const getFileIcon = (file: WorkspaceFile) => {
    if (file.type === 'directory') {
      return expandedFolders[file.id] ? (
        <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      ) : (
        <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      )
    }
    if (file.name.endsWith('.go')) return <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
    if (file.name.endsWith('.proto'))
      return <FileCode className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
    if (file.name.endsWith('.md'))
      return <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
    return <File className="w-3.5 h-3.5 text-slate-400 shrink-0" />
  }

  const renderTree = (items: WorkspaceFile[], depth = 0) => {
    return items
      .filter((item) =>
        searchQuery ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
      )
      .map((item) => {
        const isFolder = item.type === 'directory'
        const isExpanded = !!expandedFolders[item.id]
        const isActive = activeFilePath === item.path

        return (
          <div key={item.id} className="select-none">
            <div
              onClick={() => {
                if (isFolder) {
                  toggleFolder(item.id)
                } else {
                  onSelectFile(item)
                }
              }}
              className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer text-xs group transition-colors ${
                isActive
                  ? 'bg-slate-800 text-cyan-300 font-medium'
                  : 'hover:bg-slate-800/50 text-slate-300'
              }`}
              style={{ paddingLeft: `${depth * 12 + 8}px` }}
            >
              <div className="flex items-center space-x-1.5 overflow-hidden">
                {getFileIcon(item)}
                <span className="truncate font-mono text-[11.5px]">{item.name}</span>
              </div>

              {!isFolder && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteFile(item.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition-opacity"
                  title="Delete File"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>

            {isFolder && isExpanded && item.children && (
              <div>{renderTree(item.children, depth + 1)}</div>
            )}
          </div>
        )
      })
  }

  return (
    <div className="w-64 border-r border-slate-800 bg-[#090E1A] flex flex-col h-full shrink-0">
      {/* Worktree Selector Header */}
      <div className="p-2.5 border-b border-slate-800 bg-[#0B111E]">
        <label className="block text-[10px] text-slate-400 font-mono mb-1">
          Active Git Worktree
        </label>
        <select
          value={activeWorktreeId}
          onChange={(e) => onSelectWorktree(e.target.value)}
          className="w-full bg-[#070B13] border border-slate-700 rounded px-2 py-1 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
        >
          {worktrees.map((wt) => (
            <option key={wt.id} value={wt.id}>
              {wt.branch} ({wt.path})
            </option>
          ))}
        </select>
      </div>

      {/* Sidebar Mode Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-mono">
        <button
          onClick={() => setActiveView('files')}
          className={`flex-1 py-2 text-center border-b-2 font-medium transition-colors ${
            activeView === 'files'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Explorer
        </button>
        <button
          onClick={() => setActiveView('git')}
          className={`flex-1 py-2 text-center border-b-2 font-medium flex items-center justify-center gap-1 transition-colors ${
            activeView === 'git'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitBranch className="w-3 h-3" />
          <span>Source Control</span>
        </button>
      </div>

      {activeView === 'files' ? (
        <>
          {/* Header & Quick Action */}
          <div className="px-3 py-2 flex items-center justify-between border-b border-slate-800/80">
            <span className="text-xs font-semibold text-slate-300">Workspace Files</span>
            <button
              onClick={() => setIsCreating(true)}
              className="p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
              title="New File"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Search box */}
          <div className="p-2 border-b border-slate-800/60">
            <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 rounded px-2 py-1">
              <Search className="w-3 h-3 text-slate-400" />
              <input
                type="text"
                placeholder="Filter files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-slate-200 text-xs focus:outline-none w-full font-mono placeholder-slate-500"
              />
            </div>
          </div>

          {/* New file form if open */}
          {isCreating && (
            <form
              onSubmit={handleCreateSubmit}
              className="p-2 border-b border-cyan-500/30 bg-cyan-950/20"
            >
              <input
                type="text"
                placeholder="Filename (e.g. handler.go)..."
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                autoFocus
                className="w-full bg-slate-900 border border-cyan-500/50 rounded px-2 py-1 text-xs font-mono text-cyan-200 focus:outline-none"
              />
              <div className="flex justify-end gap-1 mt-1.5">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-2 py-0.5 text-[10px] text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2 py-0.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-[10px] font-bold rounded"
                >
                  Create
                </button>
              </div>
            </form>
          )}

          {/* File Tree List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5 font-mono">
            {renderTree(files)}
          </div>
        </>
      ) : (
        <GitSourceControlView
          gitState={gitState}
          onCommit={onCommitGit}
          onStageFile={onStageGitFile}
          onUnstageFile={onUnstageGitFile}
        />
      )}
    </div>
  )
}
