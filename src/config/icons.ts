import type { IconCategory, IconDefinition } from '../types'

/**
 * Comprehensive icon library organized by category
 * All icons are from lucide-react
 */
export const iconDefinitions: IconDefinition[] = [
    // Compute
    { name: 'Server', icon: 'Server', category: 'compute' },
    { name: 'CPU', icon: 'Cpu', category: 'compute' },
    { name: 'Container', icon: 'Container', category: 'compute' },
    { name: 'Box', icon: 'Box', category: 'compute' },
    { name: 'Layers', icon: 'Layers', category: 'compute' },
    { name: 'Terminal', icon: 'Terminal', category: 'compute' },
    { name: 'Code', icon: 'Code', category: 'compute' },
    { name: 'Cog', icon: 'Cog', category: 'compute' },

    // Database
    { name: 'Database', icon: 'Database', category: 'database' },
    { name: 'HardDrive', icon: 'HardDrive', category: 'database' },
    { name: 'Table', icon: 'Table2', category: 'database' },
    { name: 'FileJson', icon: 'FileJson', category: 'database' },
    { name: 'Archive', icon: 'Archive', category: 'database' },
    { name: 'Cylinder', icon: 'Cylinder', category: 'database' },

    // Cloud
    { name: 'Cloud', icon: 'Cloud', category: 'cloud' },
    { name: 'CloudCog', icon: 'CloudCog', category: 'cloud' },
    { name: 'CloudUpload', icon: 'CloudUpload', category: 'cloud' },
    { name: 'CloudDownload', icon: 'CloudDownload', category: 'cloud' },
    { name: 'Globe', icon: 'Globe', category: 'cloud' },
    { name: 'Satellite', icon: 'Satellite', category: 'cloud' },

    // Security
    { name: 'Shield', icon: 'Shield', category: 'security' },
    { name: 'ShieldCheck', icon: 'ShieldCheck', category: 'security' },
    { name: 'Lock', icon: 'Lock', category: 'security' },
    { name: 'Key', icon: 'Key', category: 'security' },
    { name: 'Fingerprint', icon: 'Fingerprint', category: 'security' },
    { name: 'UserCheck', icon: 'UserCheck', category: 'security' },
    { name: 'KeyRound', icon: 'KeyRound', category: 'security' },

    // Services
    { name: 'Zap', icon: 'Zap', category: 'services' },
    { name: 'MessageSquare', icon: 'MessageSquare', category: 'services' },
    { name: 'Mail', icon: 'Mail', category: 'services' },
    { name: 'Bell', icon: 'Bell', category: 'services' },
    { name: 'Calendar', icon: 'Calendar', category: 'services' },
    { name: 'Clock', icon: 'Clock', category: 'services' },
    { name: 'FileText', icon: 'FileText', category: 'services' },
    { name: 'Image', icon: 'Image', category: 'services' },
    { name: 'Video', icon: 'Video', category: 'services' },
    { name: 'Music', icon: 'Music', category: 'services' },
    { name: 'Search', icon: 'Search', category: 'services' },
    { name: 'Bot', icon: 'Bot', category: 'services' },
    { name: 'Brain', icon: 'Brain', category: 'services' },

    // Network
    { name: 'Network', icon: 'Network', category: 'network' },
    { name: 'Wifi', icon: 'Wifi', category: 'network' },
    { name: 'Router', icon: 'Router', category: 'network' },
    { name: 'Cable', icon: 'Cable', category: 'network' },
    { name: 'Radio', icon: 'Radio', category: 'network' },
    { name: 'Webhook', icon: 'Webhook', category: 'network' },
    { name: 'Link', icon: 'Link', category: 'network' },
    { name: 'Share2', icon: 'Share2', category: 'network' },

    // Storage
    { name: 'Folder', icon: 'Folder', category: 'storage' },
    { name: 'FolderOpen', icon: 'FolderOpen', category: 'storage' },
    { name: 'File', icon: 'File', category: 'storage' },
    { name: 'Files', icon: 'Files', category: 'storage' },
    { name: 'Package', icon: 'Package', category: 'storage' },
    { name: 'Boxes', icon: 'Boxes', category: 'storage' },

    // Monitoring
    { name: 'Activity', icon: 'Activity', category: 'monitoring' },
    { name: 'BarChart', icon: 'BarChart3', category: 'monitoring' },
    { name: 'LineChart', icon: 'LineChart', category: 'monitoring' },
    { name: 'PieChart', icon: 'PieChart', category: 'monitoring' },
    { name: 'Gauge', icon: 'Gauge', category: 'monitoring' },
    { name: 'Eye', icon: 'Eye', category: 'monitoring' },
    { name: 'AlertTriangle', icon: 'AlertTriangle', category: 'monitoring' },
    { name: 'AlertCircle', icon: 'AlertCircle', category: 'monitoring' },
]

/**
 * Get icons by category
 */
export function getIconsByCategory(category: IconCategory): IconDefinition[] {
    return iconDefinitions.filter(icon => icon.category === category)
}

/**
 * Get all unique categories
 */
export function getCategories(): IconCategory[] {
    return [...new Set(iconDefinitions.map(icon => icon.category))]
}

/**
 * Search icons by name
 */
export function searchIcons(query: string): IconDefinition[] {
    const lowerQuery = query.toLowerCase()
    return iconDefinitions.filter(icon =>
        icon.name.toLowerCase().includes(lowerQuery) ||
        icon.category.toLowerCase().includes(lowerQuery)
    )
}

/**
 * Get icon definition by icon name
 */
export function getIconByName(iconName: string): IconDefinition | undefined {
    return iconDefinitions.find(icon => icon.icon === iconName)
}

/**
 * Category display names
 */
export const categoryLabels: Record<IconCategory, string> = {
    compute: 'Compute',
    database: 'Database',
    cloud: 'Cloud',
    security: 'Security',
    services: 'Services',
    network: 'Network',
    storage: 'Storage',
    monitoring: 'Monitoring',
}
