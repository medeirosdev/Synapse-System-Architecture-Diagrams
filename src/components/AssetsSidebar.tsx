import { useState, useMemo, useCallback } from 'react'
import { Search, GripVertical, ChevronRight, ChevronDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import * as Icons from 'lucide-react'
import { iconDefinitions, categoryLabels, getCategories } from '../config/icons'
import type { IconCategory, DragData, IconDefinition } from '../types'
import { cn } from '../lib/utils'

export function AssetsSidebar() {
    const [searchQuery, setSearchQuery] = useState('')
    const [expandedCategories, setExpandedCategories] = useState<Set<IconCategory>>(
        new Set(getCategories())
    )

    // Filter icons based on search
    const filteredIcons = useMemo(() => {
        if (!searchQuery.trim()) {
            return iconDefinitions
        }
        const query = searchQuery.toLowerCase()
        return iconDefinitions.filter(
            (icon) =>
                icon.name.toLowerCase().includes(query) ||
                icon.category.toLowerCase().includes(query)
        )
    }, [searchQuery])

    // Group icons by category
    const iconsByCategory = useMemo(() => {
        const grouped = new Map<IconCategory, IconDefinition[]>()

        for (const icon of filteredIcons) {
            const existing = grouped.get(icon.category) || []
            grouped.set(icon.category, [...existing, icon])
        }

        return grouped
    }, [filteredIcons])

    // Toggle category expansion
    const toggleCategory = useCallback((category: IconCategory) => {
        setExpandedCategories((prev) => {
            const next = new Set(prev)
            if (next.has(category)) {
                next.delete(category)
            } else {
                next.add(category)
            }
            return next
        })
    }, [])

    // Handle drag start
    const handleDragStart = useCallback(
        (event: React.DragEvent, icon: IconDefinition | { name: string; type: 'group' }) => {
            const isGroup = 'type' in icon && icon.type === 'group'
            const isTemplate = 'category' in icon && icon.category === 'templates'

            const dragData: DragData = {
                icon: isGroup ? 'Box' : (icon as IconDefinition).icon,
                label: icon.name,
                type: isGroup ? 'group' : isTemplate ? 'template' : 'service',
                templateId: (icon as IconDefinition).templateId
            }
            event.dataTransfer.setData('application/synapse', JSON.stringify(dragData))
            event.dataTransfer.effectAllowed = 'move'

            // Add visual feedback
            const target = event.currentTarget as HTMLElement
            target.style.opacity = '0.5'
            setTimeout(() => {
                target.style.opacity = '1'
            }, 0)
        },
        []
    )

    return (
        <aside
            className="h-full glass flex flex-col border-r border-white/5"
            style={{ width: 300 }}
        >
            {/* Header */}
            <div className="p-4 border-b border-white/5">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-white">Components</h2>
                    <span className="text-xs text-slate-600 bg-slate-800 px-2 py-0.5 rounded">
                        {iconDefinitions.length}
                    </span>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                        type="text"
                        placeholder="Search components..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-glass pl-9"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            {/* Icon List */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {/* Groups Section */}
                <div className="mb-4">
                    <div className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Containers
                    </div>
                    <div className="grid grid-cols-3 gap-2 px-2">
                        <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, { name: 'Group', type: 'group' })}
                            className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-cyan-500/30 cursor-grab active:cursor-grabbing transition-all group"
                        >
                            <div className="p-1.5 rounded-md bg-white/5 group-hover:bg-cyan-500/20 text-slate-400 group-hover:text-cyan-400 transition-colors">
                                <Icons.BoxSelect size={20} />
                            </div>
                            <span className="text-[10px] font-medium text-slate-400 group-hover:text-cyan-100 text-center leading-tight">
                                Group
                            </span>
                        </div>
                    </div>
                </div>

                {getCategories().map((category) => {
                    const icons = iconsByCategory.get(category)
                    if (!icons || icons.length === 0) return null

                    const isExpanded = expandedCategories.has(category)

                    return (
                        <div key={category} className="mb-1">
                            {/* Category Header */}
                            <button
                                onClick={() => toggleCategory(category)}
                                className="w-full flex items-center gap-2 px-2 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors rounded-lg"
                            >
                                {isExpanded ? (
                                    <ChevronDown size={14} className="text-slate-600" />
                                ) : (
                                    <ChevronRight size={14} className="text-slate-600" />
                                )}
                                <span className="flex-1 text-left">{categoryLabels[category]}</span>
                                <span className="text-slate-600 text-[10px] bg-slate-800/50 px-1.5 py-0.5 rounded">
                                    {icons.length}
                                </span>
                            </button>

                            {/* Icons Grid */}
                            {isExpanded && (
                                <div className="grid grid-cols-3 gap-2 mt-2 px-2">
                                    {icons.map((iconDef) => {
                                        const IconComponent = Icons[iconDef.icon as keyof typeof Icons] as LucideIcon
                                        if (!IconComponent) return null

                                        return (
                                            <div
                                                key={iconDef.icon}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, iconDef)}
                                                className={cn(
                                                    'group flex flex-col items-center gap-1.5 p-2',
                                                    'rounded-lg cursor-grab active:cursor-grabbing',
                                                    'hover:bg-white/5 transition-all duration-150',
                                                    'border border-transparent hover:border-cyan-500/30'
                                                )}
                                                title={`Drag to add ${iconDef.name}`}
                                            >
                                                <div className="p-1.5 rounded-md bg-white/5 group-hover:bg-cyan-500/20 text-slate-400 group-hover:text-cyan-400 transition-colors">
                                                    <IconComponent size={20} />
                                                </div>
                                                <span className="text-[10px] font-medium text-slate-400 group-hover:text-cyan-100 text-center leading-tight line-clamp-2 w-full">
                                                    {iconDef.name}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}

                {filteredIcons.length === 0 && (
                    <div className="text-center py-8">
                        <Search size={32} className="mx-auto text-slate-700 mb-2" />
                        <p className="text-slate-500 text-sm">No components found</p>
                        <p className="text-slate-600 text-xs mt-1">Try a different search term</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/5">
                <div
                    className="flex items-center justify-center gap-2 py-2 rounded-lg"
                    style={{
                        background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(168, 85, 247, 0.1))',
                        border: '1px dashed rgba(34, 211, 238, 0.3)',
                    }}
                >
                    <GripVertical size={14} className="text-cyan-500" />
                    <p className="text-xs text-slate-400">
                        Drag components to canvas
                    </p>
                </div>
            </div>
        </aside>
    )
}
