/**
 * Synapse - System Architecture Diagram Designer
 * 
 * Type definitions for the application.
 * This file contains all TypeScript interfaces and type aliases used throughout
 * the application for type safety and documentation.
 */

import type { Node, Edge, Viewport } from '@xyflow/react'

// ============================================
// Node Types
// ============================================

/**
 * Available status options for nodes.
 * Each status has a corresponding visual indicator.
 */
export type NodeStatus = 'active' | 'warning' | 'error' | 'idle'

/**
 * Data structure for service nodes.
 * Contains all the customizable properties that can be edited in the property panel.
 */
export interface ServiceNodeData extends Record<string, unknown> {
    /** Display name shown on the node */
    label: string
    /** Icon name from lucide-react library */
    icon: string
    /** Optional description text */
    description?: string
    /** Current status with visual indicator */
    status: NodeStatus
    /** Key-value pairs for custom metadata */
    metadata?: Record<string, string | number>
}

/**
 * Complete node type combining React Flow Node with ServiceNodeData.
 */
export type ServiceNode = Node<ServiceNodeData, 'service'>

// ============================================
// Edge Types
// ============================================

/**
 * Available color options for edges.
 * Colors are defined in lib/utils.ts getEdgeColor function.
 */
export type EdgeColor = 'cyan' | 'purple' | 'green' | 'red' | 'yellow' | 'blue' | 'orange' | 'pink' | 'white'

/**
 * Data structure for edge connections.
 * Contains properties for customizing edge appearance.
 */
export interface SynapseEdgeData extends Record<string, unknown> {
    /** Edge stroke color */
    color?: EdgeColor
    /** Whether to show flow animation */
    animated?: boolean
    /** Optional text label on the edge */
    label?: string
}

/**
 * Complete edge type combining React Flow Edge with SynapseEdgeData.
 */
export type SynapseEdge = Edge<SynapseEdgeData>

// ============================================
// Icon Configuration
// ============================================

/**
 * Categories for organizing icons in the sidebar.
 */
export type IconCategory =
    | 'compute'
    | 'database'
    | 'cloud'
    | 'security'
    | 'services'
    | 'network'
    | 'storage'
    | 'monitoring'

/**
 * Definition for an icon in the asset library.
 */
export interface IconDefinition {
    /** Human-readable name */
    name: string
    /** Lucide icon component name */
    icon: string
    /** Category for grouping */
    category: IconCategory
}

// ============================================
// Store State
// ============================================

/**
 * Complete state shape for the Zustand store.
 * Includes all data and action functions.
 */
export interface SynapseState {
    // Data
    nodes: ServiceNode[]
    edges: SynapseEdge[]
    viewport: Viewport

    // Selection
    selectedNodeId: string | null
    selectedEdgeId: string | null

    // Actions - Nodes
    addNode: (node: ServiceNode) => void
    updateNode: (id: string, data: Partial<ServiceNodeData>) => void
    removeNode: (id: string) => void

    // Actions - Edges
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
    loadState: (state: { nodes: ServiceNode[]; edges: SynapseEdge[]; viewport: Viewport }) => void
    clearAll: () => void
}

// ============================================
// Persistence
// ============================================

/**
 * Structure for saved diagram files (.syn format).
 */
export interface SavedState {
    nodes: ServiceNode[]
    edges: SynapseEdge[]
    viewport: Viewport
    /** File format version for future compatibility */
    version: number
    /** ISO timestamp of when the file was saved */
    savedAt: string
}

// ============================================
// Drag & Drop
// ============================================

/**
 * Data transferred during drag-and-drop from sidebar to canvas.
 */
export interface DragData {
    /** Lucide icon component name */
    icon: string
    /** Default label for the new node */
    label: string
}
