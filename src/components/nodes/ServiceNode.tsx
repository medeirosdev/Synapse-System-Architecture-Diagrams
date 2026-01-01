import { memo } from 'react'
import { Handle, Position, NodeResizer, type NodeProps } from '@xyflow/react'
import type { LucideIcon } from 'lucide-react'
import * as Icons from 'lucide-react'
import { Trash2 } from 'lucide-react'
import type { ServiceNodeData } from '../../types'
import { cn, getStatusClass } from '../../lib/utils'
import { useSynapseStore } from '../../store/useSynapseStore'

function ServiceNodeComponent({ id, data, selected }: NodeProps) {
    const nodeData = data as ServiceNodeData
    const { label, icon, description, status, metadata } = nodeData
    const removeNode = useSynapseStore((state) => state.removeNode)

    // Dynamically get the icon component
    const IconComponent = (Icons[icon as keyof typeof Icons] as LucideIcon) || Icons.Box

    const statusClass = getStatusClass(status)

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        removeNode(id)
    }

    return (
        <>
            {/* NodeResizer */}
            <NodeResizer
                minWidth={260}
                minHeight={180}
                handleStyle={{
                    width: 12,
                    height: 12,
                    backgroundColor: '#22d3ee',
                    borderRadius: 3,
                    border: '2px solid #0f172a',
                }}
                lineStyle={{
                    borderColor: 'rgba(34, 211, 238, 0.5)',
                    borderWidth: 2,
                }}
                isVisible={selected}
            />

            {/* Delete Button - aparece quando selecionado */}
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
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        transition: 'transform 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                    }}
                    title="Delete node (Del)"
                >
                    <Trash2 size={14} color="#fff" />
                </button>
            )}

            {/* Connection Handles - cada posição tem source E target para conexões livres */}
            {/* Top */}
            <Handle type="target" position={Position.Top} id="top-target" />
            <Handle type="source" position={Position.Top} id="top-source" />

            {/* Bottom */}
            <Handle type="target" position={Position.Bottom} id="bottom-target" />
            <Handle type="source" position={Position.Bottom} id="bottom-source" />

            {/* Left */}
            <Handle type="target" position={Position.Left} id="left-target" />
            <Handle type="source" position={Position.Left} id="left-source" />

            {/* Right */}
            <Handle type="target" position={Position.Right} id="right-target" />
            <Handle type="source" position={Position.Right} id="right-source" />



            {/* Node Card */}
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
                    backdropFilter: 'blur(24px)',
                    borderRadius: 12,
                    border: selected ? '2px solid #22d3ee' : '2px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: selected
                        ? '0 0 30px rgba(34, 211, 238, 0.3)'
                        : '0 10px 40px rgba(0, 0, 0, 0.3)',
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                {/* Top accent line */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: 'linear-gradient(90deg, #22d3ee, #a855f7, #22d3ee)',
                        opacity: selected ? 1 : 0.7,
                    }}
                />

                {/* Inner content */}
                <div
                    style={{
                        padding: 24,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                        {/* Icon Container */}
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 12,
                                background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(168, 85, 247, 0.2))',
                                border: '1px solid rgba(34, 211, 238, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <IconComponent size={24} color="#22d3ee" />
                        </div>

                        {/* Title & Status */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h3
                                style={{
                                    fontSize: 16,
                                    fontWeight: 600,
                                    color: '#ffffff',
                                    margin: 0,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {label || 'Untitled Node'}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                                <div className={cn('status-indicator', statusClass)} />
                                <span
                                    style={{
                                        fontSize: 13,
                                        color: '#94a3b8',
                                        textTransform: 'capitalize',
                                        fontWeight: 500,
                                    }}
                                >
                                    {status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {description && (
                        <div style={{ marginTop: 16, flex: 1, overflow: 'hidden' }}>
                            <p
                                style={{
                                    fontSize: 14,
                                    color: '#cbd5e1',
                                    lineHeight: 1.6,
                                    margin: 0,
                                }}
                            >
                                {description}
                            </p>
                        </div>
                    )}

                    {/* Metadata */}
                    {metadata && Object.keys(metadata).length > 0 && (
                        <div
                            style={{
                                marginTop: 16,
                                paddingTop: 16,
                                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            {Object.entries(metadata).slice(0, 4).map(([key, value]) => (
                                <div
                                    key={key}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: 8,
                                    }}
                                >
                                    <span style={{ fontSize: 13, color: '#64748b' }}>{key}</span>
                                    <span
                                        style={{
                                            fontSize: 13,
                                            color: '#22d3ee',
                                            fontFamily: 'monospace',
                                            fontWeight: 500,
                                            background: 'rgba(34, 211, 238, 0.1)',
                                            padding: '4px 12px',
                                            borderRadius: 6,
                                        }}
                                    >
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {!description && (!metadata || Object.keys(metadata).length === 0) && (
                        <div
                            style={{
                                marginTop: 16,
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px dashed rgba(255, 255, 255, 0.1)',
                                borderRadius: 8,
                            }}
                        >
                            <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>
                                Select to edit
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export const ServiceNode = memo(ServiceNodeComponent)
