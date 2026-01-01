/**
 * Synapse - System Architecture Diagram Designer
 * 
 * Utility functions used throughout the application.
 * This file contains helper functions for common operations.
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes with clsx.
 * Handles conditional classes and resolves Tailwind conflicts automatically.
 * 
 * @param inputs - Class values to merge (strings, objects, arrays)
 * @returns Merged class string with conflicts resolved
 * 
 * @example
 * cn('px-2 py-1', isActive && 'bg-blue-500', 'px-4')
 * // Returns 'py-1 bg-blue-500 px-4' (px-4 overrides px-2)
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Generate a unique ID for nodes and edges.
 * Combines timestamp with random string for uniqueness.
 * 
 * @returns Unique identifier string
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Create a debounced version of a function.
 * The function will only be called after the specified delay has passed
 * since the last invocation.
 * 
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 * 
 * @example
 * const debouncedSave = debounce(saveData, 1000)
 * // saveData will only be called 1 second after the last call to debouncedSave
 */
export function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    return (...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}

/**
 * Get the CSS color value for an edge color name.
 * Maps color names to their hex values.
 * 
 * @param color - Color name (cyan, purple, green, etc.)
 * @returns Hex color value, defaults to cyan if not found
 */
export function getEdgeColor(color: string): string {
    const colors: Record<string, string> = {
        cyan: '#22d3ee',
        purple: '#a855f7',
        green: '#4ade80',
        red: '#f87171',
        yellow: '#facc15',
        blue: '#3b82f6',
        orange: '#fb923c',
        pink: '#f472b6',
        white: '#f1f5f9',
    }
    return colors[color] || colors.cyan
}

/**
 * Get the CSS class name for a node status.
 * Maps status values to their corresponding CSS classes.
 * 
 * @param status - Status value (active, warning, error, idle)
 * @returns CSS class name for the status indicator
 */
export function getStatusClass(status: string): string {
    const classes: Record<string, string> = {
        active: 'status-active',
        warning: 'status-warning',
        error: 'status-error',
        idle: 'status-idle',
    }
    return classes[status] || classes.idle
}
