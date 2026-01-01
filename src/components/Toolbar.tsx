import { useCallback, useEffect, useState } from 'react'
import {
    Save,
    FolderOpen,
    Undo2,
    Redo2,
    Download,
    Trash2,
    Sparkles,
    Keyboard,
    LayoutTemplate,
} from 'lucide-react'
import { useSynapseStore, useTemporalStore } from '../store/useSynapseStore'
import { TemplatesModal } from './TemplatesModal'
import { exportToFile, importFromFile, clearIndexedDB } from '../lib/persistence'
import { cn } from '../lib/utils'

export function Toolbar() {
    const nodes = useSynapseStore((state) => state.nodes)
    const edges = useSynapseStore((state) => state.edges)
    const viewport = useSynapseStore((state) => state.viewport)
    const loadState = useSynapseStore((state) => state.loadState)
    const clearAll = useSynapseStore((state) => state.clearAll)
    const [isTemplatesOpen, setIsTemplatesOpen] = useState(false)

    const { undo, redo, pastStates, futureStates } = useTemporalStore()

    const canUndo = pastStates.length > 0
    const canRedo = futureStates.length > 0

    // Handle export
    const handleExport = useCallback(() => {
        exportToFile(nodes, edges, viewport)
    }, [nodes, edges, viewport])

    // Handle import
    const handleImport = useCallback(async () => {
        try {
            const state = await importFromFile()
            loadState({
                nodes: state.nodes,
                edges: state.edges,
                viewport: state.viewport,
            })
        } catch (error) {
            console.error('Failed to import:', error)
        }
    }, [loadState])

    // Handle clear
    const handleClear = useCallback(async () => {
        if (window.confirm('Are you sure you want to clear all nodes and edges?')) {
            clearAll()
            await clearIndexedDB()
        }
    }, [clearAll])

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl/Cmd + Z = Undo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault()
                if (canUndo) undo()
            }
            // Ctrl/Cmd + Shift + Z OR Ctrl/Cmd + Y = Redo
            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault()
                if (canRedo) redo()
            }
            // Ctrl/Cmd + S = Save/Export
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault()
                handleExport()
            }
            // Ctrl/Cmd + O = Open/Import
            if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
                e.preventDefault()
                handleImport()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [canUndo, canRedo, undo, redo, handleExport, handleImport])

    return (
        <header className="h-14 glass border-b border-white/5 flex items-center justify-between px-4">
            {/* Left - Branding */}
            <div className="flex items-center gap-3">
                <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                        background: 'linear-gradient(135deg, #22d3ee, #a855f7)',
                        boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)',
                    }}
                >
                    <Sparkles size={20} className="text-white" />
                </div>
                <div>
                    <h1 className="text-base font-bold text-white tracking-wide">Synapse</h1>
                    <p className="text-[10px] text-slate-500 -mt-0.5">Architecture Designer</p>
                </div>
            </div>

            {/* Center - Stats */}
            <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: '#22d3ee', boxShadow: '0 0 8px #22d3ee' }}
                    />
                    <span className="text-cyan-400 font-mono font-medium">{nodes.length}</span>
                    <span className="text-slate-500">nodes</span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: '#a855f7', boxShadow: '0 0 8px #a855f7' }}
                    />
                    <span className="text-purple-400 font-mono font-medium">{edges.length}</span>
                    <span className="text-slate-500">connections</span>
                </div>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-1">
                {/* Undo / Redo */}
                <div className="flex items-center gap-1 mr-2">
                    <button
                        onClick={() => undo()}
                        disabled={!canUndo}
                        className={cn(
                            'btn-icon',
                            !canUndo && 'opacity-30 cursor-not-allowed'
                        )}
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo2 size={18} />
                    </button>
                    <button
                        onClick={() => redo()}
                        disabled={!canRedo}
                        className={cn(
                            'btn-icon',
                            !canRedo && 'opacity-30 cursor-not-allowed'
                        )}
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo2 size={18} />
                    </button>
                </div>

                <div className="w-px h-6 bg-white/10 mx-2" />

                {/* Templates */}
                <button
                    onClick={() => setIsTemplatesOpen(true)}
                    className="btn-icon"
                    title="Templates"
                >
                    <LayoutTemplate size={18} />
                </button>

                {/* File Operations */}
                <button
                    onClick={handleImport}
                    className="btn-icon"
                    title="Open File (Ctrl+O)"
                >
                    <FolderOpen size={18} />
                </button>
                <button
                    onClick={handleExport}
                    className="btn-icon"
                    title="Save File (Ctrl+S)"
                >
                    <Save size={18} />
                </button>
                <button
                    onClick={handleExport}
                    className="btn-icon"
                    title="Export as .syn"
                >
                    <Download size={18} />
                </button>

                <div className="w-px h-6 bg-white/10 mx-2" />



                {/* Clear */}
                <button
                    onClick={handleClear}
                    className="btn-icon text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    title="Clear All"
                >
                    <Trash2 size={18} />
                </button>

                {/* Keyboard shortcuts hint */}
                <div className="hidden lg:flex items-center gap-1 ml-3 px-2 py-1 rounded bg-white/5 text-slate-600">
                    <Keyboard size={12} />
                    <span className="text-[10px]">Ctrl+S save</span>
                </div>
            </div>

            <TemplatesModal isOpen={isTemplatesOpen} onClose={() => setIsTemplatesOpen(false)} />
        </header>
    )
}
