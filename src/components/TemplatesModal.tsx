/**
 * Modal to display and load pre-built architecture templates.
 */

import { X, LayoutTemplate } from 'lucide-react'
import { templates, type Template } from '../config/templates'
import { useSynapseStore } from '../store/useSynapseStore'

interface TemplatesModalProps {
    isOpen: boolean
    onClose: () => void
}

export function TemplatesModal({ isOpen, onClose }: TemplatesModalProps) {
    const loadState = useSynapseStore((state) => state.loadState)

    if (!isOpen) return null

    const handleLoadTemplate = (template: Template) => {
        if (window.confirm('This will replace your current diagram. Are you sure?')) {
            loadState(template.data) // Type assertion might be needed if types mismatch slightly
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="w-[800px] bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden glass">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <LayoutTemplate size={20} className="text-cyan-400" />
                        Choose a Template
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {templates.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => handleLoadTemplate(template)}
                            className="flex flex-col text-left p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-cyan-500/50 transition-all group"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                                    <LayoutTemplate size={24} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                                        {template.name}
                                    </h3>
                                    <span className="text-xs text-slate-500">
                                        {template.data.nodes.length} nodes • {template.data.edges.length} connections
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                                {template.description}
                            </p>
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-950/30 border-t border-white/5 text-xs text-center text-slate-500">
                    Select a template to start with a pre-configured architecture.
                </div>
            </div>
        </div>
    )
}
