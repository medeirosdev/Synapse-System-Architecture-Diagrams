/**
 * Synapse - System Architecture Diagram Designer
 * 
 * Zustand store for global state management.
 * Uses Zundo middleware for undo/redo functionality.
 */

import { create } from 'zustand'
import { temporal } from 'zundo'
import { subscribeWithSelector } from 'zustand/middleware'
import {
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    type Viewport,
} from '@xyflow/react'
import type { SynapseState, ServiceNode, GroupNode, SynapseEdge, ServiceNodeData, SynapseEdgeData } from '../types'
import { generateId } from '../lib/utils'

/** Default viewport state - centered with 100% zoom */
const initialViewport: Viewport = {
    x: 0,
    y: 0,
    zoom: 1,
}

/**
 * Main application store.
 * 
 * Uses Zustand for state management with:
 * - subscribeWithSelector: Allows selective subscriptions for performance
 * - temporal (Zundo): Provides undo/redo functionality
 * 
 * @example
 * // Subscribe to nodes
 * const nodes = useSynapseStore(state => state.nodes)
 * 
 * // Call actions
 * const addNode = useSynapseStore(state => state.addNode)
 * addNode(newNode)
 */
export const useSynapseStore = create<SynapseState>()(
    subscribeWithSelector(
        temporal(
            (set, get) => ({
                // ============================================
                // Initial State
                // ============================================
                nodes: [],
                edges: [],
                viewport: initialViewport,
                selectedNodeId: null,
                selectedEdgeId: null,

                // ============================================
                // Node Actions
                // ============================================

                /**
                 * Add a new node to the canvas.
                 */
                addNode: (node: ServiceNode | GroupNode) => {
                    const isGroup = node.type === 'group'
                    // Groups go to back (-1), others to front (default or 10)
                    const nodeWithZ = {
                        ...node,
                        zIndex: isGroup ? -1 : 10,
                    }

                    set((state) => ({
                        // If group, prepend to array (render first). If service, append (render last).
                        nodes: isGroup
                            ? [nodeWithZ, ...state.nodes]
                            : [...state.nodes, nodeWithZ],
                    }))
                },

                /**
                 * Update an existing node's data.
                 * Merges the provided data with existing data.
                 */
                updateNode: (id: string, data: Record<string, any>) => {
                    set((state) => ({
                        nodes: state.nodes.map((node) =>
                            node.id === id
                                ? ({ ...node, data: { ...node.data, ...data } } as any)
                                : node
                        ),
                    }))
                },

                /**
                 * Remove a node and all connected edges.
                 */
                removeNode: (id: string) => {
                    set((state) => ({
                        nodes: state.nodes.filter((node) => node.id !== id),
                        edges: state.edges.filter(
                            (edge) => edge.source !== id && edge.target !== id
                        ),
                        selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
                    }))
                },

                /**
                 * Duplicate a node.
                 */
                duplicateNode: (id: string) => {
                    const state = get()
                    const nodeToClone = state.nodes.find((n) => n.id === id)
                    if (!nodeToClone) return

                    const newId = generateId()
                    const offset = 20

                    // Clone data properly
                    const newData = JSON.parse(JSON.stringify(nodeToClone.data))

                    // Create new node with offset
                    const newNode = {
                        ...nodeToClone,
                        id: newId,
                        position: {
                            x: nodeToClone.position.x + offset,
                            y: nodeToClone.position.y + offset,
                        },
                        data: {
                            ...newData,
                            label: `${newData.label} (Copy)`,
                        },
                        selected: true,
                    }

                    // Deselect original, select copy
                    set((state) => ({
                        nodes: [...state.nodes.map(n => ({ ...n, selected: false })), newNode],
                        selectedNodeId: newId
                    }))
                },

                /**
                 * Bring node to front (z-index).
                 */
                bringToFront: (id: string) => {
                    set((state) => {
                        const maxZ = Math.max(...state.nodes.map((n) => n.zIndex || 0), 0)
                        return {
                            nodes: state.nodes.map((n) =>
                                n.id === id ? { ...n, zIndex: maxZ + 1 } : n
                            ),
                        }
                    })
                },

                /**
                 * Send node to back (z-index).
                 */
                sendToBack: (id: string) => {
                    set((state) => ({
                        nodes: state.nodes.map((n) =>
                            n.id === id ? { ...n, zIndex: -5 } : n
                        ),
                    }))
                },

                // ============================================
                // Edge Actions
                // ============================================

                /**
                 * Update an existing edge's data.
                 * Merges the provided data with existing data.
                 */
                updateEdge: (id: string, data: Partial<SynapseEdgeData>) => {
                    set((state) => ({
                        edges: state.edges.map((edge) =>
                            edge.id === id
                                ? { ...edge, data: { ...edge.data, ...data } }
                                : edge
                        ),
                    }))
                },

                /**
                 * Remove an edge connection.
                 */
                removeEdge: (id: string) => {
                    set((state) => ({
                        edges: state.edges.filter((edge) => edge.id !== id),
                        selectedEdgeId: state.selectedEdgeId === id ? null : state.selectedEdgeId,
                    }))
                },

                // ============================================
                // React Flow Callbacks
                // ============================================

                /**
                 * Handle node changes from React Flow.
                 * Includes position changes, selections, and deletions.
                 */
                onNodesChange: (changes: any) => {
                    set((state) => ({
                        nodes: applyNodeChanges(changes, state.nodes) as ServiceNode[],
                    }))
                },

                /**
                 * Handle edge changes from React Flow.
                 * Includes selections and deletions.
                 */
                onEdgesChange: (changes: any) => {
                    set((state) => ({
                        edges: applyEdgeChanges(changes, state.edges) as SynapseEdge[],
                    }))
                },

                /**
                 * Handle new connections between nodes.
                 * Creates a new edge with default styling.
                 */
                onConnect: (connection: any) => {
                    const newEdge: SynapseEdge = {
                        id: generateId(),
                        source: connection.source!,
                        target: connection.target!,
                        sourceHandle: connection.sourceHandle,
                        targetHandle: connection.targetHandle,
                        type: 'custom',
                        data: {
                            color: 'cyan',
                            animated: true,
                        },
                    }
                    set((state) => ({
                        edges: addEdge(newEdge, state.edges) as SynapseEdge[],
                    }))
                },

                /**
                 * Handle viewport changes (pan, zoom).
                 */
                onViewportChange: (viewport: Viewport) => {
                    set({ viewport })
                },

                // ============================================
                // Selection Actions
                // ============================================

                /**
                 * Select a node and deselect any selected edge.
                 */
                setSelectedNodeId: (id: string | null) => {
                    set({ selectedNodeId: id, selectedEdgeId: null })
                },

                /**
                 * Select an edge and deselect any selected node.
                 */
                setSelectedEdgeId: (id: string | null) => {
                    set({ selectedEdgeId: id, selectedNodeId: null })
                },

                // ============================================
                // Persistence Actions
                // ============================================

                /**
                 * Load a complete state (from file or IndexedDB).
                 */
                loadState: (state: { nodes: (ServiceNode | GroupNode)[]; edges: SynapseEdge[]; viewport: Viewport }) => {
                    // Process nodes to ensure correct z-index
                    const processedNodes = (state.nodes || []).map(node => ({
                        ...node,
                        zIndex: node.type === 'group' ? -1 : 10
                    })).sort((a, b) => {
                        // Ensure groups are first in the array as a fallback
                        if (a.type === 'group' && b.type !== 'group') return -1
                        if (a.type !== 'group' && b.type === 'group') return 1
                        return 0
                    })

                    set({
                        nodes: processedNodes,
                        edges: state.edges || [],
                        viewport: state.viewport || initialViewport,
                        selectedNodeId: null,
                        selectedEdgeId: null,
                    })
                },

                /**
                 * Clear all nodes and edges from the canvas.
                 */
                clearAll: () => {
                    set({
                        nodes: [],
                        edges: [],
                        selectedNodeId: null,
                        selectedEdgeId: null,
                    })
                },
            }),
            {
                // Zundo configuration for undo/redo
                limit: 50, // Keep last 50 states in history
                partialize: (state) => ({
                    // Only track nodes and edges for undo/redo
                    nodes: state.nodes,
                    edges: state.edges,
                }),
            }
        )
    )
)

/**
 * Hook to access the temporal (undo/redo) store.
 * 
 * @example
 * const { undo, redo, pastStates } = useTemporalStore()
 */
export const useTemporalStore = () => useSynapseStore.temporal.getState()
