import type { Edge } from '@xyflow/react'

/**
 * Available color options for edges.
 * Colors are defined in lib/utils.ts getEdgeColor function.
 */
export type EdgeColor = 'cyan' | 'purple' | 'green' | 'red' | 'yellow' | 'blue' | 'orange' | 'pink' | 'white'

/**
 * Available path types for edges.
 */
export type EdgeType = 'default' | 'straight' | 'step' | 'smoothstep'

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
    /** Path style of the edge */
    type?: EdgeType
}

/**
 * Complete edge type combining React Flow Edge with SynapseEdgeData.
 */
export type SynapseEdge = Edge<SynapseEdgeData>
