import type { Viewport } from '@xyflow/react'
import type { ServiceNode } from './nodes'
import type { SynapseEdge } from './edges'

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
    | 'messaging'
    | 'templates'

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
    /** Optional template ID if this items represents a full architecture */
    templateId?: string
}

/**
 * Data transferred during drag-and-drop from sidebar to canvas.
 */
export interface DragData {
    /** Lucide icon component name */
    icon: string
    /** Default label for the new node */
    label: string
    /** Node type (service or group) */
    type?: 'service' | 'group' | 'template'
    /** Template ID if type is template */
    templateId?: string
}

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
