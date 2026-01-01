import { useEffect, useRef } from 'react'
import { Copy, Trash2, Layers, ArrowUp, ArrowDown } from 'lucide-react'
import { useSynapseStore } from '../store/useSynapseStore'

interface ContextMenuProps {
    x: number
    y: number
    targetId: string | null
    type: 'node' | 'pane' | null
    onClose: () => void
}

export function ContextMenu({ x, y, targetId, type, onClose }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null)
    const duplicateNode = useSynapseStore((state) => state.duplicateNode)
    const removeNode = useSynapseStore((state) => state.removeNode)
    const bringToFront = useSynapseStore((state) => state.bringToFront)
    const sendToBack = useSynapseStore((state) => state.sendToBack)

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [onClose])

    if (!type) return null

    const handleAction = (action: () => void) => {
        action()
        onClose()
    }

    return (
        <div
            ref={menuRef}
            className="fixed z-50 min-w-[180px] bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden animate-fade-in"
            style={{ top: y, left: x }}
        >
            {type === 'node' && targetId && (
                <div className="py-1">
                    <button
                        onClick={() => handleAction(() => duplicateNode(targetId))}
                        className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                    >
                        <Copy size={14} />
                        Duplicate
                    </button>

                    <div className="h-px bg-slate-800 my-1" />

                    <button
                        onClick={() => handleAction(() => bringToFront(targetId))}
                        className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                    >
                        <ArrowUp size={14} />
                        Bring to Front
                    </button>
                    <button
                        onClick={() => handleAction(() => sendToBack(targetId))}
                        className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                    >
                        <ArrowDown size={14} />
                        Send to Back
                    </button>

                    <div className="h-px bg-slate-800 my-1" />

                    <button
                        onClick={() => handleAction(() => removeNode(targetId))}
                        className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                    >
                        <Trash2 size={14} />
                        Delete
                    </button>
                </div>
            )}
        </div>
    )
}
