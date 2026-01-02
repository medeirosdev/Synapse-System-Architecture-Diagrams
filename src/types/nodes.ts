import type { Node } from '@xyflow/react'

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

/**
 * Available color options for group containers.
 */
export type GroupColor = 'cyan' | 'purple' | 'green' | 'yellow' | 'red'

/**
 * Data structure for group container nodes.
 */
export interface GroupNodeData extends Record<string, unknown> {
    /** Display name shown on the group header */
    label: string
    /** Container border/accent color */
    color: GroupColor
    /** Optional description text */
    description?: string
}

/**
 * Complete group node type.
 */
export type GroupNode = Node<GroupNodeData, 'group'>
