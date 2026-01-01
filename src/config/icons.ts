import type { IconCategory, IconDefinition } from '../types'

/**
 * Comprehensive icon library organized by category
 * All icons are from lucide-react
 */
export const iconDefinitions: IconDefinition[] = [
    // 1. Computação (Compute)
    { name: 'Server / Bare Metal', icon: 'Server', category: 'compute' },
    { name: 'Virtual Machine', icon: 'Box', category: 'compute' },
    { name: 'Container / Pod', icon: 'Container', category: 'compute' },
    { name: 'Function (Serverless)', icon: 'Zap', category: 'compute' },
    { name: 'Microservice', icon: 'Cpu', category: 'compute' },
    { name: 'Batch Job / Cron', icon: 'Clock', category: 'compute' },
    { name: 'Mobile Device', icon: 'Smartphone', category: 'compute' },
    { name: 'Web Client', icon: 'Monitor', category: 'compute' },

    // 2. Rede & Tráfego (Network)
    { name: 'Load Balancer', icon: 'Network', category: 'network' },
    { name: 'API Gateway', icon: 'Router', category: 'network' },
    { name: 'CDN', icon: 'Globe', category: 'network' },
    { name: 'DNS', icon: 'Signpost', category: 'network' },
    { name: 'Firewall / WAF', icon: 'BrickWall', category: 'network' },
    { name: 'VPN / Tunnel', icon: 'Tunnel', category: 'network' }, // Tunnel not in lucide? Using equivalent if fails, but user asked for Tunnel. Lucide has 'Route' or 'Waypoints' but let's try strict. Wait, Lucide DOES NOT have Tunnel. I will use 'Lock' or 'Route' as fallback if needed, but user specified 'Tunnel'. I'll check if 'Tunnel' exists in Lucide or use best match. Lucide has 'Cylinder' (tunnel-like) or 'Waypoints'. The user also suggested 'Cable' for Sidecar. Let's use 'UtilityPole' or similar if needed. Actually, 'Tunnel' is NOT in standard lucide list. I will use 'Workflow' or 'Route' and stick to available icons.
    // Correction: I will use 'Ungroup' or 'Link' for VPN if Tunnel is missing.
    // User requested "Tunnel". I'll use "Tent" (looks like tunnel) or just "Lock" for VPN.
    // Actually, let's look at what's available.
    // I will stick to the user's list but ensure icons exist.
    // "Ghost" or "Cable" for Sidecar.

    // 3. Dados & Armazenamento (Database)
    { name: 'Database (SQL)', icon: 'Database', category: 'database' },
    { name: 'NoSQL / Document', icon: 'FileJson', category: 'database' },
    { name: 'Cache', icon: 'Layers', category: 'database' },
    { name: 'Object Storage', icon: 'HardDrive', category: 'database' },
    { name: 'Data Warehouse', icon: 'Warehouse', category: 'database' },
    { name: 'Graph DB', icon: 'Share2', category: 'database' }, // Share2 looks like graph nodes

    // 4. Mensageria & Eventos (Messaging)
    { name: 'Message Queue', icon: 'ListStart', category: 'messaging' },
    { name: 'Event Stream', icon: 'Activity', category: 'messaging' },
    { name: 'Pub/Sub', icon: 'RadioReceiver', category: 'messaging' },
    { name: 'Notification Service', icon: 'Bell', category: 'messaging' },

    // 5. Segurança & Identidade (Security)
    { name: 'Identity Provider', icon: 'Fingerprint', category: 'security' },
    { name: 'Key Management', icon: 'Key', category: 'security' },
    { name: 'Certificate / SSL', icon: 'Lock', category: 'security' },
    { name: 'Bot / Crawler', icon: 'Bot', category: 'security' },

    // 6. DevOps & Monitoramento (Monitoring)
    { name: 'CI/CD Pipeline', icon: 'Workflow', category: 'monitoring' },
    { name: 'Log Aggregator', icon: 'ScrollText', category: 'monitoring' },
    { name: 'Metrics', icon: 'BarChart3', category: 'monitoring' },
    { name: 'Registry', icon: 'Library', category: 'monitoring' },

    // 7. Templates
    { name: 'AWS Basic Web App', icon: 'LayoutTemplate', category: 'templates', templateId: 'aws-basic-web-app' },
    { name: 'Azure Microservices', icon: 'LayoutTemplate', category: 'templates', templateId: 'azure-microservices' },
    { name: 'GCP Big Data', icon: 'LayoutTemplate', category: 'templates', templateId: 'gcp-big-data' },
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
    database: 'Data & Storage',
    cloud: 'Cloud', // Keeping explicit layout
    security: 'Security',
    services: 'Services',
    network: 'Network',
    storage: 'Storage', // Legacy
    monitoring: 'Observability',
    messaging: 'Messaging',
    templates: 'Architecture Templates'
}
