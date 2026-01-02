import type { Viewport } from '@xyflow/react'
import type { ServiceNode, GroupNode } from './nodes'
import type { SynapseEdge, SynapseEdgeData } from './edges'

/**
 * Complete state shape for the Zustand store.
 * Includes all data and action functions.
 */
export interface SynapseState {
    // Data
    nodes: (ServiceNode | GroupNode)[]
    edges: SynapseEdge[]
    viewport: Viewport

    // Selection
    selectedNodeId: string | null
    selectedEdgeId: string | null

    // Actions - Nodes
    addNode: (node: ServiceNode | GroupNode) => void
    updateNode: (id: string, data: Record<string, any>) => void
    removeNode: (id: string) => void
    duplicateNode: (id: string) => void
    bringToFront: (id: string) => void
    sendToBack: (id: string) => void

    // Actions - Edges
    addEdge: (edge: SynapseEdge) => void
    addEdges: (edges: SynapseEdge[]) => void
    updateEdge: (id: string, data: Partial<SynapseEdgeData>) => void
    removeEdge: (id: string) => void

    // Actions - React Flow callbacks
    onNodesChange: (changes: any) => void
    onEdgesChange: (changes: any) => void
    onConnect: (connection: any) => void
    onViewportChange: (viewport: Viewport) => void

    // Actions - Selection
    setSelectedNodeId: (id: string | null) => void
    setSelectedEdgeId: (id: string | null) => void

    // Actions - Persistence
    loadState: (state: { nodes: (ServiceNode | GroupNode)[]; edges: SynapseEdge[]; viewport: Viewport }) => void
    clearAll: () => void
}
