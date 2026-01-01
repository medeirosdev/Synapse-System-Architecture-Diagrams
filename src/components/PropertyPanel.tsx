import { useCallback, useMemo, useState } from 'react'
import { Trash2, Plus, X, ChevronDown, Settings2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import * as Icons from 'lucide-react'
import { useSynapseStore } from '../store/useSynapseStore'
import { iconDefinitions, categoryLabels, getCategories } from '../config/icons'
import type { NodeStatus, EdgeColor, GroupColor } from '../types'
import { cn } from '../lib/utils'

const statusOptions: { value: NodeStatus; label: string; color: string }[] = [
    { value: 'active', label: 'Active', color: '#4ade80' },
    { value: 'warning', label: 'Warning', color: '#facc15' },
    { value: 'error', label: 'Error', color: '#f87171' },
    { value: 'idle', label: 'Idle', color: '#64748b' },
]

const edgeColors: { value: EdgeColor; label: string; color: string }[] = [
    { value: 'cyan', label: 'Cyan', color: '#22d3ee' },
    { value: 'purple', label: 'Purple', color: '#a855f7' },
    { value: 'blue', label: 'Blue', color: '#3b82f6' },
    { value: 'green', label: 'Green', color: '#4ade80' },
    { value: 'yellow', label: 'Yellow', color: '#facc15' },
    { value: 'orange', label: 'Orange', color: '#fb923c' },
    { value: 'red', label: 'Red', color: '#f87171' },
    { value: 'pink', label: 'Pink', color: '#f472b6' },
    { value: 'white', label: 'White', color: '#f1f5f9' },
]

const groupColors: { value: GroupColor; label: string; color: string }[] = [
    { value: 'cyan', label: 'Cyan', color: '#22d3ee' },
    { value: 'purple', label: 'Purple', color: '#a855f7' },
    { value: 'green', label: 'Green', color: '#4ade80' },
    { value: 'yellow', label: 'Yellow', color: '#facc15' },
    { value: 'red', label: 'Red', color: '#f87171' },
]

export function PropertyPanel() {
    const selectedNodeId = useSynapseStore((state) => state.selectedNodeId)
    const selectedEdgeId = useSynapseStore((state) => state.selectedEdgeId)
    const nodes = useSynapseStore((state) => state.nodes)
    const edges = useSynapseStore((state) => state.edges)
    const updateNode = useSynapseStore((state) => state.updateNode)
    const updateEdge = useSynapseStore((state) => state.updateEdge)
    const removeNode = useSynapseStore((state) => state.removeNode)
    const removeEdge = useSynapseStore((state) => state.removeEdge)

    const [showIconPicker, setShowIconPicker] = useState(false)
    const [newMetaKey, setNewMetaKey] = useState('')
    const [newMetaValue, setNewMetaValue] = useState('')

    // Get selected node
    const selectedNode = useMemo(
        () => nodes.find((n) => n.id === selectedNodeId),
        [nodes, selectedNodeId]
    )

    // Get selected edge
    const selectedEdge = useMemo(
        () => edges.find((e) => e.id === selectedEdgeId),
        [edges, selectedEdgeId]
    )

    // Handle icon change
    const handleIconChange = useCallback(
        (iconName: string) => {
            if (selectedNodeId) {
                updateNode(selectedNodeId, { icon: iconName })
                setShowIconPicker(false)
            }
        },
        [selectedNodeId, updateNode]
    )

    // Handle adding metadata
    const handleAddMetadata = useCallback(() => {
        if (selectedNodeId && newMetaKey.trim()) {
            const currentMeta = selectedNode?.data.metadata as Record<string, string | number> || {}
            updateNode(selectedNodeId, {
                metadata: {
                    ...currentMeta,
                    [newMetaKey.trim()]: newMetaValue.trim() || '0',
                },
            })
            setNewMetaKey('')
            setNewMetaValue('')
        }
    }, [selectedNodeId, selectedNode, newMetaKey, newMetaValue, updateNode])

    // Handle removing metadata
    const handleRemoveMetadata = useCallback(
        (key: string) => {
            if (selectedNodeId && selectedNode?.data.metadata) {
                const { [key]: _, ...rest } = selectedNode.data.metadata as Record<string, string | number>
                updateNode(selectedNodeId, { metadata: rest })
            }
        },
        [selectedNodeId, selectedNode, updateNode]
    )

    // No selection - empty state
    if (!selectedNode && !selectedEdge) {
        return (
            <aside className="h-full glass flex flex-col border-l border-white/5" style={{ width: 320 }}>
                <div className="p-4 border-b border-white/5">
                    <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Settings2 size={16} className="text-slate-500" />
                        Properties
                    </h2>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center px-6">
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                        style={{
                            background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(168, 85, 247, 0.1))',
                            border: '1px dashed rgba(34, 211, 238, 0.3)',
                        }}
                    >
                        <Settings2 size={28} className="text-slate-600" />
                    </div>
                    <p className="text-sm text-slate-400 text-center font-medium">
                        No selection
                    </p>
                    <p className="text-xs text-slate-600 text-center mt-1">
                        Click on a node or edge to view and edit its properties
                    </p>
                </div>
            </aside>
        )
    }

    // Group Node Selected
    if (selectedNode && selectedNode.type === 'group') {
        const groupData = selectedNode.data as any

        return (
            <aside className="h-full glass flex flex-col border-l border-white/5" style={{ width: 320 }}>
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Icons.BoxSelect size={16} className="text-cyan-400" />
                        Group Properties
                    </h2>
                    <button
                        onClick={() => removeNode(selectedNode.id)}
                        className="btn-icon text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        title="Delete Group"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Label */}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                            Label
                        </label>
                        <input
                            type="text"
                            value={groupData.label || ''}
                            onChange={(e) => updateNode(selectedNode.id, { label: e.target.value })}
                            className="input-glass"
                            placeholder="Group Name"
                        />
                    </div>

                    {/* Color */}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider">
                            Color
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {groupColors.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => updateNode(selectedNode.id, { color: color.value })}
                                    className="relative w-full aspect-square rounded-lg transition-all hover:scale-105"
                                    style={{
                                        background: color.color,
                                        boxShadow: groupData.color === color.value
                                            ? `0 0 0 3px ${color.color}40, 0 0 15px ${color.color}40`
                                            : 'none',
                                        opacity: groupData.color === color.value ? 1 : 0.6,
                                        border: groupData.color === color.value
                                            ? '2px solid white'
                                            : '2px solid transparent',
                                    }}
                                    title={color.label}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                            Description
                        </label>
                        <textarea
                            value={groupData.description || ''}
                            onChange={(e) => updateNode(selectedNode.id, { description: e.target.value })}
                            className="input-glass min-h-25 resize-none"
                            placeholder="Add a description for this group..."
                        />
                    </div>
                </div>
            </aside>
        )
    }

    // Edge selected
    if (selectedEdge) {
        return (
            <aside className="h-full glass flex flex-col border-l border-white/5" style={{ width: 320 }}>
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                        <div className="w-3 h-0.5 bg-purple-500 rounded" />
                        Edge Properties
                    </h2>
                    <button
                        onClick={() => removeEdge(selectedEdge.id)}
                        className="btn-icon text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        title="Delete Edge"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Edge Color */}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider">
                            Color
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {edgeColors.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => {
                                        console.log('Updating edge color to:', color.value)
                                        updateEdge(selectedEdge.id, { color: color.value })
                                    }}
                                    className="relative w-full aspect-square rounded-lg transition-all hover:scale-105"
                                    style={{
                                        background: color.color,
                                        boxShadow: selectedEdge.data?.color === color.value
                                            ? `0 0 0 3px ${color.color}40, 0 0 15px ${color.color}40`
                                            : 'none',
                                        opacity: selectedEdge.data?.color === color.value ? 1 : 0.6,
                                        border: selectedEdge.data?.color === color.value
                                            ? '2px solid white'
                                            : '2px solid transparent',
                                    }}
                                    title={color.label}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Animated */}
                    <div>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div
                                className="relative w-10 h-6 rounded-full transition-colors"
                                style={{
                                    background: selectedEdge.data?.animated !== false
                                        ? 'linear-gradient(135deg, #22d3ee, #a855f7)'
                                        : '#1e293b',
                                }}
                            >
                                <div
                                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform"
                                    style={{
                                        left: selectedEdge.data?.animated !== false ? 20 : 4,
                                    }}
                                />
                            </div>
                            <input
                                type="checkbox"
                                checked={selectedEdge.data?.animated !== false}
                                onChange={(e) =>
                                    updateEdge(selectedEdge.id, { animated: e.target.checked })
                                }
                                className="sr-only"
                            />
                            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                                Animated Flow
                            </span>
                        </label>
                    </div>

                    {/* Label */}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                            Label
                        </label>
                        <input
                            type="text"
                            value={(selectedEdge.data?.label as string) || ''}
                            onChange={(e) => updateEdge(selectedEdge.id, { label: e.target.value })}
                            placeholder="Optional connection label..."
                            className="input-glass"
                        />
                    </div>
                </div>
            </aside>
        )
    }

    // Node selected
    const CurrentIcon = (Icons[selectedNode!.data.icon as keyof typeof Icons] as LucideIcon) || Icons.Box

    return (
        <aside className="h-full glass flex flex-col border-l border-white/5" style={{ width: 320 }}>
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                    <CurrentIcon size={16} className="text-cyan-400" />
                    Node Properties
                </h2>
                <button
                    onClick={() => removeNode(selectedNode!.id)}
                    className="btn-icon text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    title="Delete Node (Del)"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Node Label */}
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                        Label
                    </label>
                    <input
                        type="text"
                        value={(selectedNode!.data.label as string) || ''}
                        onChange={(e) => updateNode(selectedNode!.id, { label: e.target.value })}
                        className="input-glass"
                    />
                </div>

                {/* Node Icon */}
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                        Icon
                    </label>
                    <div className="flex items-center gap-2 relative">
                        <button
                            onClick={() => setShowIconPicker(!showIconPicker)}
                            className="flex-1 flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                        >
                            <div className="p-1 rounded bg-cyan-500/10 text-cyan-400">
                                <CurrentIcon size={18} />
                            </div>
                            <span className="text-sm text-slate-300 flex-1 text-left">
                                {selectedNode!.data.icon as string}
                            </span>
                            <ChevronDown size={14} className="text-slate-500" />
                        </button>

                        {/* Icon Picker Popover */}
                        {showIconPicker && (
                            <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-slate-900 border border-white/10 rounded-xl shadow-xl z-50 animate-fade-in max-h-[300px] overflow-hidden flex flex-col">
                                <div className="flex items-center justify-between mb-2 px-1">
                                    <span className="text-xs font-medium text-slate-400">Select Icon</span>
                                    <button
                                        onClick={() => setShowIconPicker(false)}
                                        className="p-1 hover:bg-white/10 rounded"
                                    >
                                        <X size={12} className="text-slate-400" />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar">
                                    <div className="grid grid-cols-4 gap-1">
                                        {iconDefinitions.map((iconDef) => {
                                            const IconComp = Icons[iconDef.icon as keyof typeof Icons] as LucideIcon
                                            if (!IconComp) return null
                                            return (
                                                <button
                                                    key={iconDef.icon}
                                                    onClick={() => handleIconChange(iconDef.icon)}
                                                    className={cn(
                                                        'p-2 rounded hover:bg-white/10 flex items-center justify-center transition-colors',
                                                        selectedNode!.data.icon === iconDef.icon && 'bg-cyan-500/20 text-cyan-400'
                                                    )}
                                                    title={iconDef.name}
                                                >
                                                    <IconComp size={18} />
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Node Status */}
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                        Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => updateNode(selectedNode!.id, { status: option.value })}
                                className={cn(
                                    'flex items-center gap-2 p-2 rounded-lg border transition-all',
                                    selectedNode!.data.status === option.value
                                        ? 'bg-white/10 border-cyan-500/50'
                                        : 'bg-white/5 border-transparent hover:bg-white/10'
                                )}
                            >
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                        background: option.color,
                                        boxShadow: `0 0 8px ${option.color}`,
                                    }}
                                />
                                <span className="text-sm text-slate-300">{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Node Description */}
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                        Description
                    </label>
                    <textarea
                        value={(selectedNode!.data.description as string) || ''}
                        onChange={(e) => updateNode(selectedNode!.id, { description: e.target.value })}
                        className="input-glass min-h-25 resize-none"
                        placeholder="Add a brief description..."
                    />
                </div>

                {/* Metadata */}
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                        <span>Metadata</span>
                        <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                            {Object.keys(selectedNode!.data.metadata as object || {}).length}
                        </span>
                    </label>

                    <div className="space-y-2 mb-3">
                        {Object.entries(selectedNode!.data.metadata as Record<string, string | number> || {}).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2 p-2 rounded bg-white/5 group">
                                <div className="flex-1 grid grid-cols-2 gap-2 text-sm">
                                    <span className="font-mono text-cyan-400 truncate" title={key}>
                                        {key}
                                    </span>
                                    <span className="text-slate-300 truncate" title={String(value)}>
                                        {value}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleRemoveMetadata(key)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded transition-all"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newMetaKey}
                            onChange={(e) => setNewMetaKey(e.target.value)}
                            placeholder="Key"
                            className="input-glass flex-1 min-w-0"
                        />
                        <input
                            type="text"
                            value={newMetaValue}
                            onChange={(e) => setNewMetaValue(e.target.value)}
                            placeholder="Value"
                            className="input-glass flex-1 min-w-0"
                        />
                        <button
                            onClick={handleAddMetadata}
                            disabled={!newMetaKey.trim()}
                            className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 disabled:opacity-50 hover:bg-cyan-500/30 transition-colors"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    )
}
