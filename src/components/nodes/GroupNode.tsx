/**
 * GroupNode - Container component for grouping nodes.
 * Useful for representing VPCs, clusters, namespaces, etc.
 */

import { memo, useCallback } from 'react'
import { Handle, Position, NodeResizer, type NodeProps } from '@xyflow/react'
import { Box, Trash2 } from 'lucide-react'
import { useSynapseStore } from '../../store/useSynapseStore'

export interface GroupNodeData extends Record<string, unknown> {
    label: string
    color: 'cyan' | 'purple' | 'green' | 'yellow' | 'red'
    description?: string
}

const colorMap = {
    cyan: { border: '#22d3ee', bg: 'rgba(34, 211, 238, 0.05)' },
    purple: { border: '#a855f7', bg: 'rgba(168, 85, 247, 0.05)' },
    green: { border: '#4ade80', bg: 'rgba(74, 222, 128, 0.05)' },
    yellow: { border: '#facc15', bg: 'rgba(250, 204, 21, 0.05)' },
    red: { border: '#f87171', bg: 'rgba(248, 113, 113, 0.05)' },
}

export const GroupNode = memo(function GroupNode({
    id,
    data,
    selected,
}: NodeProps) {
    const nodeData = data as GroupNodeData
    const removeNode = useSynapseStore((state) => state.removeNode)
    const colors = colorMap[nodeData.color || 'cyan']

    const handleDelete = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation()
            removeNode(id)
        },
        [id, removeNode]
    )

    return (
        <>
            {/* Resizer */}
            <NodeResizer
                minWidth={200}
                minHeight={150}
                handleStyle={{
                    width: 10,
                    height: 10,
                    background: colors.border,
                    borderRadius: 3,
                    border: '2px solid #0f172a',
                }}
                lineStyle={{
                    borderColor: colors.border,
                    borderWidth: 2,
                    borderStyle: 'dashed',
                }}
                isVisible={selected}
            />

            {/* Delete Button */}
            {selected && (
                <button
                    onClick={handleDelete}
                    style={{
                        position: 'absolute',
                        top: -12,
                        right: -12,
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: '#ef4444',
                        border: '2px solid #0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10,
                    }}
                    title="Delete group"
                >
                    <Trash2 size={14} color="#fff" />
                </button>
            )}

            {/* Connection Handles */}
            <Handle type="target" position={Position.Top} id="top-target" />
            <Handle type="source" position={Position.Top} id="top-source" />
            <Handle type="target" position={Position.Bottom} id="bottom-target" />
            <Handle type="source" position={Position.Bottom} id="bottom-source" />
            <Handle type="target" position={Position.Left} id="left-target" />
            <Handle type="source" position={Position.Left} id="left-source" />
            <Handle type="target" position={Position.Right} id="right-target" />
            <Handle type="source" position={Position.Right} id="right-source" />

            {/* Container */}
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    minWidth: 200,
                    minHeight: 150,
                    background: colors.bg,
                    border: `2px dashed ${colors.border}`,
                    borderRadius: 12,
                    padding: 0,
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 12px',
                        borderBottom: `1px dashed ${colors.border}40`,
                        background: `${colors.bg}`,
                        borderRadius: '10px 10px 0 0',
                    }}
                >
                    <Box size={16} style={{ color: colors.border }} />
                    <span
                        style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: colors.border,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                        }}
                    >
                        {nodeData.label || 'Group'}
                    </span>
                </div>

                {/* Content area - where child nodes go */}
                <div
                    style={{
                        flex: 1,
                        minHeight: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {nodeData.description && (
                        <span style={{ fontSize: 11, color: '#64748b' }}>
                            {nodeData.description}
                        </span>
                    )}
                </div>
            </div>
        </>
    )
})
