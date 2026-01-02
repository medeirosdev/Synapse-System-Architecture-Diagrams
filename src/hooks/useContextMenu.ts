import { useCallback, useState } from 'react'
import type { Node } from '@xyflow/react'

export interface ContextMenuState {
    visible: boolean
    x: number
    y: number
    targetId: string | null
    type: 'node' | 'pane' | null
}

export function useContextMenu() {
    const [menu, setMenu] = useState<ContextMenuState | null>(null)

    const onNodeContextMenu = useCallback(
        (event: React.MouseEvent, node: Node) => {
            event.preventDefault()
            setMenu({
                visible: true,
                x: event.clientX,
                y: event.clientY,
                targetId: node.id,
                type: 'node',
            })
        },
        []
    )

    const onPaneContextMenu = useCallback((event: React.MouseEvent | MouseEvent) => {
        event.preventDefault()
        setMenu({
            visible: true,
            x: (event as React.MouseEvent).clientX,
            y: (event as React.MouseEvent).clientY,
            targetId: null,
            type: 'pane',
        })
    }, [])

    const closeMenu = useCallback(() => setMenu(null), [])

    return {
        menu,
        onNodeContextMenu,
        onPaneContextMenu,
        closeMenu,
    }
}
