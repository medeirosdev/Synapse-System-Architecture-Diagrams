/**
 * Synapse - System Architecture Diagram Designer
 * 
 * Auto-save hook for automatic persistence to IndexedDB.
 * Debounces saves to prevent excessive writes.
 */

import { useEffect, useRef } from 'react'
import { useSynapseStore } from '../store/useSynapseStore'
import { saveToIndexedDB, loadFromIndexedDB } from '../lib/persistence'
import { debounce } from '../lib/utils'

/** Auto-save interval in milliseconds */
const SAVE_DELAY = 1000

/**
 * Hook that handles automatic saving of the diagram state.
 * 
 * Features:
 * - Loads saved state on mount (application startup)
 * - Debounces saves to prevent excessive IndexedDB writes
 * - Saves whenever nodes, edges, or viewport change
 * 
 * @example
 * function App() {
 *   useAutoSave() // Initialize auto-save
 *   return <Canvas />
 * }
 */
export function useAutoSave() {
    const isInitialized = useRef(false)

    // Load saved state on mount
    useEffect(() => {
        async function loadSavedState() {
            const savedState = await loadFromIndexedDB()

            if (savedState) {
                useSynapseStore.getState().loadState({
                    nodes: savedState.nodes,
                    edges: savedState.edges,
                    viewport: savedState.viewport,
                })
            }

            isInitialized.current = true
        }

        loadSavedState()
    }, [])

    // Subscribe to changes and save
    useEffect(() => {
        // Create debounced save function
        const debouncedSave = debounce(
            (nodes: any, edges: any, viewport: any) => {
                if (isInitialized.current) {
                    saveToIndexedDB(nodes, edges, viewport)
                }
            },
            SAVE_DELAY
        )

        // Subscribe to store changes
        const unsubscribe = useSynapseStore.subscribe(
            (state) => ({
                nodes: state.nodes,
                edges: state.edges,
                viewport: state.viewport,
            }),
            ({ nodes, edges, viewport }) => {
                debouncedSave(nodes, edges, viewport)
            },
            { equalityFn: (a, b) => a === b }
        )

        return unsubscribe
    }, [])
}
