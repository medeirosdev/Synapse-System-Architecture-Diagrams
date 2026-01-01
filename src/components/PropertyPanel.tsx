import { useCallback, useMemo, useState } from 'react'
import { Trash2, Plus, X, ChevronDown, Settings2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import * as Icons from 'lucide-react'
import { useSynapseStore } from '../store/useSynapseStore'
import { iconDefinitions, categoryLabels, getCategories } from '../config/icons'
import type { NodeStatus, EdgeColor } from '../types'
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
            const currentMeta = selectedNode?.data.metadata || {}
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
                const { [key]: _, ...rest } = selectedNode.data.metadata
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
                            value={selectedEdge.data?.label || ''}
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
                {/* Icon Selector */}
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                        Icon
                    </label>
                    <button
                        onClick={() => setShowIconPicker(!showIconPicker)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-white/10 hover:border-cyan-400/30 transition-all group"
                    >
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{
                                background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(168, 85, 247, 0.2))',
                                border: '1px solid rgba(34, 211, 238, 0.3)',
                            }}
                        >
                            <CurrentIcon size={24} className="text-cyan-400" />
                        </div>
                        <div className="flex-1 text-left">
                            <span className="text-sm text-white font-medium">{selectedNode!.data.icon}</span>
                            <p className="text-[10px] text-slate-500">Click to change</p>
                        </div>
                        <ChevronDown
                            size={16}
                            className={cn(
                                "text-slate-500 transition-transform",
                                showIconPicker && "rotate-180"
                            )}
                        />
                    </button>

                    {/* Icon Picker */}
                    {showIconPicker && (
                        <div
                            className="mt-2 max-h-[240px] overflow-y-auto rounded-xl p-3"
                            style={{
                                background: 'rgba(15, 23, 42, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            {getCategories().map((category) => (
                                <div key={category} className="mb-3">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider px-1 mb-2">
                                        {categoryLabels[category]}
                                    </p>
                                    <div className="grid grid-cols-6 gap-1">
                                        {iconDefinitions
                                            .filter((i) => i.category === category)
                                            .map((iconDef) => {
                                                const IconComp = Icons[iconDef.icon as keyof typeof Icons] as LucideIcon
                                                if (!IconComp) return null
                                                const isSelected = selectedNode!.data.icon === iconDef.icon
                                                return (
                                                    <button
                                                        key={iconDef.icon}
                                                        onClick={() => handleIconChange(iconDef.icon)}
                                                        className="p-2 rounded-lg transition-all"
                                                        style={{
                                                            background: isSelected ? 'rgba(34, 211, 238, 0.2)' : 'transparent',
                                                            border: isSelected ? '1px solid rgba(34, 211, 238, 0.5)' : '1px solid transparent',
                                                        }}
                                                        title={iconDef.name}
                                                    >
                                                        <IconComp
                                                            size={16}
                                                            className={isSelected ? "text-cyan-400" : "text-slate-400 hover:text-white"}
                                                        />
                                                    </button>
                                                )
                                            })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Label */}
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                        Label
                    </label>
                    <input
                        type="text"
                        value={selectedNode!.data.label}
                        onChange={(e) => updateNode(selectedNode!.id, { label: e.target.value })}
                        placeholder="Node name..."
                        className="input-glass text-base font-medium"
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider">
                        Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {statusOptions.map((status) => {
                            const isSelected = selectedNode!.data.status === status.value
                            return (
                                <button
                                    key={status.value}
                                    onClick={() => updateNode(selectedNode!.id, { status: status.value })}
                                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all"
                                    style={{
                                        background: isSelected ? `${status.color}15` : 'rgba(30, 41, 59, 0.5)',
                                        border: isSelected ? `1px solid ${status.color}50` : '1px solid rgba(255, 255, 255, 0.1)',
                                    }}
                                >
                                    <div
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{
                                            background: status.color,
                                            boxShadow: isSelected ? `0 0 8px ${status.color}` : 'none',
                                        }}
                                    />
                                    <span className="text-xs text-slate-300 font-medium">{status.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                        Description
                    </label>
                    <textarea
                        value={selectedNode!.data.description || ''}
                        onChange={(e) => updateNode(selectedNode!.id, { description: e.target.value })}
                        placeholder="Add a description for this node..."
                        rows={3}
                        className="input-glass resize-none"
                    />
                </div>

                {/* Metadata */}
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider">
                        Metadata
                    </label>

                    {/* Existing metadata */}
                    <div className="space-y-2 mb-3">
                        {selectedNode!.data.metadata &&
                            Object.entries(selectedNode!.data.metadata).map(([key, value]) => (
                                <div
                                    key={key}
                                    className="flex items-center gap-2 p-2.5 rounded-lg"
                                    style={{
                                        background: 'rgba(30, 41, 59, 0.5)',
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                    }}
                                >
                                    <span className="text-xs text-slate-400 flex-1">{key}</span>
                                    <span
                                        className="text-xs font-mono px-2 py-0.5 rounded"
                                        style={{
                                            color: '#22d3ee',
                                            background: 'rgba(34, 211, 238, 0.1)',
                                        }}
                                    >
                                        {value}
                                    </span>
                                    <button
                                        onClick={() => handleRemoveMetadata(key)}
                                        className="text-slate-500 hover:text-red-400 transition-colors p-1"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                    </div>

                    {/* Add new metadata */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newMetaKey}
                            onChange={(e) => setNewMetaKey(e.target.value)}
                            placeholder="Key"
                            className="input-glass text-xs flex-1"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddMetadata()
                            }}
                        />
                        <input
                            type="text"
                            value={newMetaValue}
                            onChange={(e) => setNewMetaValue(e.target.value)}
                            placeholder="Value"
                            className="input-glass text-xs flex-1"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddMetadata()
                            }}
                        />
                        <button
                            onClick={handleAddMetadata}
                            disabled={!newMetaKey.trim()}
                            className="p-2 rounded-lg transition-all disabled:opacity-30"
                            style={{
                                background: newMetaKey.trim() ? 'rgba(34, 211, 238, 0.2)' : 'rgba(30, 41, 59, 0.5)',
                                border: '1px solid rgba(34, 211, 238, 0.3)',
                            }}
                        >
                            <Plus size={16} className="text-cyan-400" />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    )
}
