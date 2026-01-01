import { useCallback, useRef, useState } from 'react'
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    BackgroundVariant,
    Panel,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useSynapseStore } from '../store/useSynapseStore'
import { ServiceNode } from './nodes/ServiceNode'
import { GroupNode } from './nodes/GroupNode'
import { CustomEdge } from './edges/CustomEdge'
import type { ServiceNode as ServiceNodeType, GroupNode as GroupNodeType, DragData } from '../types'
import { generateId } from '../lib/utils'
import { MousePointer2, Move3D } from 'lucide-react'
import { ContextMenu } from './ContextMenu'

const nodeTypes = {
    service: ServiceNode,
    group: GroupNode,
}

const edgeTypes = {
    custom: CustomEdge,
}

const defaultEdgeOptions = {
    type: 'custom',
    animated: true,
}

const proOptions = { hideAttribution: true }

export function Canvas() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null)

    const nodes = useSynapseStore((state) => state.nodes)
    const edges = useSynapseStore((state) => state.edges)
    const viewport = useSynapseStore((state) => state.viewport)
    const onNodesChange = useSynapseStore((state) => state.onNodesChange)
    const onEdgesChange = useSynapseStore((state) => state.onEdgesChange)
    const onConnect = useSynapseStore((state) => state.onConnect)
    const onViewportChange = useSynapseStore((state) => state.onViewportChange)
    const addNode = useSynapseStore((state) => state.addNode)
    const setSelectedNodeId = useSynapseStore((state) => state.setSelectedNodeId)
    const setSelectedEdgeId = useSynapseStore((state) => state.setSelectedEdgeId)

    // Context Menu State
    const [menu, setMenu] = useState<{
        visible: boolean
        x: number
        y: number
        targetId: string | null
        type: 'node' | 'pane' | null
    } | null>(null)

    const onNodeContextMenu = useCallback(
        (event: React.MouseEvent, node: ServiceNodeType | GroupNodeType) => {
            event.preventDefault()
            setMenu({
                visible: true,
                x: event.clientX,
                y: event.clientY,
                targetId: node.id,
                type: 'node',
            })
        },
        []
    )

    const onPaneContextMenu = useCallback((event: React.MouseEvent | MouseEvent) => {
        event.preventDefault()
        setMenu({
            visible: true,
            x: (event as React.MouseEvent).clientX,
            y: (event as React.MouseEvent).clientY,
            targetId: null,
            type: 'pane',
        })
    }, [])

    const closeMenu = useCallback(() => setMenu(null), [])

    // Handle drag over
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }, [])

    // Handle drop - create new node
    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault()

            const data = event.dataTransfer.getData('application/synapse')
            if (!data) return

            const dragData: DragData = JSON.parse(data)

            // Get the bounding rect of the wrapper
            const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
            if (!reactFlowBounds) return

            // Calculate position considering viewport
            const position = {
                x: (event.clientX - reactFlowBounds.left - viewport.x) / viewport.zoom,
                y: (event.clientY - reactFlowBounds.top - viewport.y) / viewport.zoom,
            }

            // Snap to grid (16px)
            const snappedPosition = {
                x: Math.round(position.x / 16) * 16,
                y: Math.round(position.y / 16) * 16,
            }

            // Check if it's a group node
            if (dragData.type === 'group') {
                const newGroup: GroupNodeType = {
                    id: generateId(),
                    type: 'group',
                    position: snappedPosition,
                    style: { width: 400, height: 300 },
                    data: {
                        label: dragData.label,
                        color: 'cyan',
                        description: '',
                    },
                }
                addNode(newGroup as any)
                setSelectedNodeId(newGroup.id)
            } else if (dragData.type === 'template' && dragData.templateId) {
                // Import templates dynamically to avoid circular dependencies if any
                import('../config/templates').then(({ templates }) => {
                    const template = templates.find(t => t.id === dragData.templateId)

                    if (template) {
                        const { nodes: tmplNodes, edges: tmplEdges } = template.data

                        // Find bounds to center/offset
                        const minX = Math.min(...tmplNodes.map(n => n.position.x))
                        const minY = Math.min(...tmplNodes.map(n => n.position.y))

                        const offsetX = snappedPosition.x - minX
                        const offsetY = snappedPosition.y - minY

                        const idMap = new Map<string, string>()
                        tmplNodes.forEach(n => idMap.set(n.id, generateId()))

                        const newNodes = tmplNodes.map(node => ({
                            ...node,
                            id: idMap.get(node.id)!,
                            position: {
                                x: node.position.x + offsetX,
                                y: node.position.y + offsetY
                            },
                            // Ensure data structure is correct
                            data: { ...node.data }
                        }))

                        const newEdges = tmplEdges.map(edge => ({
                            ...edge,
                            id: generateId(),
                            source: idMap.get(edge.source) || edge.source,
                            target: idMap.get(edge.target) || edge.target
                        }))

                        // Batch add nodes
                        newNodes.forEach(n => addNode(n as any))

                        // Batch add edges
                        const addEdges = useSynapseStore.getState().addEdges
                        addEdges(newEdges as any)
                    }
                })
            } else {
                const newNode: ServiceNodeType = {
                    id: generateId(),
                    type: 'service',
                    position: snappedPosition,
                    style: { width: 280, height: 180 },
                    data: {
                        label: dragData.label,
                        icon: dragData.icon || 'Box',
                        status: 'idle',
                        description: '',
                        metadata: {},
                    },
                }
                addNode(newNode)
                setSelectedNodeId(newNode.id)
            }
        },
        [addNode, viewport, setSelectedNodeId]
    )

    // Handle node selection
    const onNodeClick = useCallback(
        (_: React.MouseEvent, node: ServiceNodeType) => {
            setSelectedNodeId(node.id)
        },
        [setSelectedNodeId]
    )

    // Handle edge selection
    const onEdgeClick = useCallback(
        (_: React.MouseEvent, edge: any) => {
            setSelectedEdgeId(edge.id)
        },
        [setSelectedEdgeId]
    )

    // Handle pane click (deselect)
    const onPaneClick = useCallback(() => {
        setSelectedNodeId(null)
        setSelectedEdgeId(null)
        closeMenu()
    }, [setSelectedNodeId, setSelectedEdgeId, closeMenu])

    // Memoize minimap node color
    const minimapNodeColor = useCallback(() => '#22d3ee', [])

    return (
        <div ref={reactFlowWrapper} className="flex-1 h-full relative">
            <ReactFlow
                nodes={nodes as any}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onEdgeClick={onEdgeClick}
                onPaneClick={onPaneClick}
                onNodeContextMenu={onNodeContextMenu as any}
                onPaneContextMenu={onPaneContextMenu}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onViewportChange={onViewportChange}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                defaultEdgeOptions={defaultEdgeOptions}
                defaultViewport={viewport}
                snapToGrid
                snapGrid={[16, 16]}
                fitView={false}
                proOptions={proOptions}
                deleteKeyCode={['Backspace', 'Delete']}
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={16}
                    size={1}
                    color="#334155"
                />
                <Controls
                    showInteractive={false}
                    position="bottom-left"
                />
                <MiniMap
                    nodeColor={minimapNodeColor}
                    maskColor="rgba(2, 6, 23, 0.7)"
                    position="bottom-right"
                    pannable
                    zoomable
                />

                {/* Empty state hint */}
                {nodes.length === 0 && (
                    <Panel position="top-center">
                        <div
                            className="mt-20 px-6 py-4 rounded-xl text-center"
                            style={{
                                background: 'rgba(15, 23, 42, 0.8)',
                                backdropFilter: 'blur(16px)',
                                border: '1px dashed rgba(34, 211, 238, 0.3)',
                            }}
                        >
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <MousePointer2 size={20} className="text-cyan-400" />
                                <Move3D size={20} className="text-purple-400" />
                            </div>
                            <p className="text-sm text-slate-300 font-medium">
                                Drag components from the sidebar
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                Or use keyboard shortcuts: Ctrl+S to save, Delete to remove
                            </p>
                        </div>
                    </Panel>
                )}

                {/* Zoom indicator */}
                <Panel position="top-right">
                    <div
                        className="px-3 py-1.5 rounded-lg text-xs font-mono"
                        style={{
                            background: 'rgba(15, 23, 42, 0.7)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <span className="text-slate-500">Zoom: </span>
                        <span className="text-cyan-400">{Math.round(viewport.zoom * 100)}%</span>
                    </div>
                </Panel>
            </ReactFlow>

            {/* Context Menu - Rendered outside ReactFlow to avoid transform issues */}
            {menu?.visible && (
                <ContextMenu
                    x={menu.x}
                    y={menu.y}
                    targetId={menu.targetId}
                    type={menu.type}
                    onClose={closeMenu}
                />
            )}
        </div>
    )
}
