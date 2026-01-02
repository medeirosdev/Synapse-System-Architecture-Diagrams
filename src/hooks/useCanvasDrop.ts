import { useCallback } from 'react'
import { useSynapseStore } from '../store/useSynapseStore'
import { generateId } from '../lib/utils'
import type { DragData, GroupNode, ServiceNode } from '../types'

export function useCanvasDrop(
    reactFlowWrapper: React.RefObject<HTMLDivElement | null>
) {
    const addNode = useSynapseStore((state) => state.addNode)
    const addEdges = useSynapseStore((state) => state.addEdges)
    const setSelectedNodeId = useSynapseStore((state) => state.setSelectedNodeId)
    const viewport = useSynapseStore((state) => state.viewport)

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }, [])

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
                const newGroup: GroupNode = {
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
                addNode(newGroup)
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
                        addEdges(newEdges as any)
                    }
                })
            } else {
                const newNode: ServiceNode = {
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
        [addNode, addEdges, viewport, setSelectedNodeId, reactFlowWrapper]
    )

    return { onDragOver, onDrop }
}
