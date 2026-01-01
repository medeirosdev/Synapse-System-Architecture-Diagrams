/**
 * Synapse - System Architecture Diagram Designer
 * 
 * Persistence layer for saving and loading diagram data.
 * Handles both IndexedDB storage and file import/export.
 */

import { get, set, del } from 'idb-keyval'
import type { SavedState, ServiceNode, SynapseEdge } from '../types'
import type { Viewport } from '@xyflow/react'

/** IndexedDB key for storing the diagram state */
const STORAGE_KEY = 'synapse-state'

/** Current file format version for .syn files */
const FILE_VERSION = 1

// ============================================
// IndexedDB Operations
// ============================================

/**
 * Save the current diagram state to IndexedDB.
 * Called automatically by the auto-save hook.
 * 
 * @param nodes - Array of nodes to save
 * @param edges - Array of edges to save
 * @param viewport - Current viewport state
 */
export async function saveToIndexedDB(
    nodes: ServiceNode[],
    edges: SynapseEdge[],
    viewport: Viewport
): Promise<void> {
    const state: SavedState = {
        nodes,
        edges,
        viewport,
        version: FILE_VERSION,
        savedAt: new Date().toISOString(),
    }

    try {
        await set(STORAGE_KEY, state)
    } catch (error) {
        console.error('Failed to save to IndexedDB:', error)
        throw error
    }
}

/**
 * Load the diagram state from IndexedDB.
 * Called on application startup to restore the previous session.
 * 
 * @returns The saved state or null if none exists
 */
export async function loadFromIndexedDB(): Promise<SavedState | null> {
    try {
        const state = await get<SavedState>(STORAGE_KEY)
        return state || null
    } catch (error) {
        console.error('Failed to load from IndexedDB:', error)
        return null
    }
}

/**
 * Clear all saved data from IndexedDB.
 * Called when the user clears the canvas.
 */
export async function clearIndexedDB(): Promise<void> {
    try {
        await del(STORAGE_KEY)
    } catch (error) {
        console.error('Failed to clear IndexedDB:', error)
        throw error
    }
}

// ============================================
// File Export/Import
// ============================================

/**
 * Export the current diagram to a downloadable .syn file.
 * Creates a JSON file with all diagram data.
 * 
 * @param nodes - Array of nodes to export
 * @param edges - Array of edges to export
 * @param viewport - Current viewport state
 */
export function exportToFile(
    nodes: ServiceNode[],
    edges: SynapseEdge[],
    viewport: Viewport
): void {
    const state: SavedState = {
        nodes,
        edges,
        viewport,
        version: FILE_VERSION,
        savedAt: new Date().toISOString(),
    }

    const json = JSON.stringify(state, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10)
    const filename = `synapse-diagram-${timestamp}.syn`

    // Create download link and trigger click
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up blob URL
    URL.revokeObjectURL(url)
}

/**
 * Import a diagram from a .syn file.
 * Opens a file picker and parses the selected file.
 * 
 * @returns The parsed state from the file
 * @throws Error if file parsing fails
 */
export function importFromFile(): Promise<SavedState> {
    return new Promise((resolve, reject) => {
        // Create hidden file input
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.syn,.json'

        input.onchange = async (event) => {
            const file = (event.target as HTMLInputElement).files?.[0]
            if (!file) {
                reject(new Error('No file selected'))
                return
            }

            try {
                const text = await file.text()
                const state = JSON.parse(text) as SavedState

                // Validate the file structure
                if (!state.nodes || !state.edges) {
                    throw new Error('Invalid file format')
                }

                resolve(state)
            } catch (error) {
                reject(new Error('Failed to parse file'))
            }
        }

        input.oncancel = () => {
            reject(new Error('File selection cancelled'))
        }

        // Trigger file picker
        input.click()
    })
}
