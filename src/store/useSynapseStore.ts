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
import type { SynapseState, ServiceNode, SynapseEdge, ServiceNodeData, SynapseEdgeData } from '../types'
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
            (set) => ({
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
                addNode: (node: ServiceNode) => {
                    set((state) => ({
                        nodes: [...state.nodes, node],
                    }))
                },

                /**
                 * Update an existing node's data.
                 * Merges the provided data with existing data.
                 */
                updateNode: (id: string, data: Partial<ServiceNodeData>) => {
                    set((state) => ({
                        nodes: state.nodes.map((node) =>
                            node.id === id
                                ? { ...node, data: { ...node.data, ...data } }
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
                loadState: (state: { nodes: ServiceNode[]; edges: SynapseEdge[]; viewport: Viewport }) => {
                    set({
                        nodes: state.nodes,
                        edges: state.edges,
                        viewport: state.viewport,
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
