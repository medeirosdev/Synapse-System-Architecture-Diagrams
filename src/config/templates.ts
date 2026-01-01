/**
 * Pre-built architecture templates.
 */

import { generateId } from '../lib/utils'
import type { SavedState } from '../types'

export interface Template {
    id: string
    name: string
    description: string
    thumbnail: string // We can use CSS gradients or placeholders for now
    data: SavedState
}

function createTemplate(name: string, description: string, nodes: any[], edges: any[]): Template {
    return {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        description,
        thumbnail: '', // Will be handled in UI
        data: {
            nodes,
            edges,
            viewport: { x: 0, y: 0, zoom: 1 },
            version: 1,
            savedAt: new Date().toISOString(),
        } as SavedState
    }
}

export const templates: Template[] = [
    createTemplate(
        'AWS Basic Web App',
        'Standard 3-tier web application with ELB, EC2, and RDS',
        [
            { id: 'vpc', type: 'group', position: { x: 50, y: 50 }, data: { label: 'VPC', color: 'cyan', description: 'Production Environment' }, style: { width: 600, height: 400 } },
            { id: 'elb', type: 'service', position: { x: 100, y: 200 }, data: { label: 'Load Balancer', icon: 'Network', status: 'active' } },
            { id: 'web1', type: 'service', position: { x: 300, y: 150 }, data: { label: 'Web Server 1', icon: 'Server', status: 'active' } },
            { id: 'web2', type: 'service', position: { x: 300, y: 250 }, data: { label: 'Web Server 2', icon: 'Server', status: 'active' } },
            { id: 'db', type: 'service', position: { x: 500, y: 200 }, data: { label: 'Primary DB', icon: 'Database', status: 'active' } },
        ],
        [
            // Updated to use custom type and corrected handle references assuming defaults
            { id: 'e1', source: 'elb', target: 'web1', type: 'custom', animated: true, data: { color: 'cyan' } },
            { id: 'e2', source: 'elb', target: 'web2', type: 'custom', animated: true, data: { color: 'cyan' } },
            { id: 'e3', source: 'web1', target: 'db', type: 'custom', animated: true, data: { color: 'purple' } },
            { id: 'e4', source: 'web2', target: 'db', type: 'custom', animated: true, data: { color: 'purple' } },
        ]
    ),
    createTemplate(
        'Azure Microservices',
        'Kubernetes cluster with AKS, CosmosDB, and Azure Redis',
        [
            { id: 'k8s', type: 'group', position: { x: 50, y: 50 }, data: { label: 'AKS Cluster', color: 'blue', description: 'K8s Managed Service' }, style: { width: 500, height: 400 } },
            { id: 'ingress', type: 'service', position: { x: 100, y: 200 }, data: { label: 'Ingress', icon: 'Globe', status: 'active' } },
            { id: 'api', type: 'service', position: { x: 250, y: 150 }, data: { label: 'API Service', icon: 'Cpu', status: 'active' } },
            { id: 'worker', type: 'service', position: { x: 250, y: 250 }, data: { label: 'Worker', icon: 'Cpu', status: 'idle' } },
            { id: 'cosmos', type: 'service', position: { x: 450, y: 150 }, data: { label: 'CosmosDB', icon: 'Database', status: 'active' } },
            { id: 'redis', type: 'service', position: { x: 450, y: 250 }, data: { label: 'Cache', icon: 'Layers', status: 'active' } },
        ],
        [
            { id: 't1', source: 'ingress', target: 'api', type: 'custom', animated: true, data: { color: 'blue' } },
            { id: 't2', source: 'api', target: 'cosmos', type: 'custom', animated: true, data: { color: 'cyan' } },
            { id: 't3', source: 'api', target: 'redis', type: 'custom', animated: true, data: { color: 'yellow' } },
            { id: 't4', source: 'api', target: 'worker', type: 'custom', animated: true, data: { color: 'white' } },
        ]
    ),
    createTemplate(
        'GCP Big Data',
        'Data processing pipeline with Pub/Sub, Dataflow, and BigQuery',
        [
            { id: 'ingest', type: 'service', position: { x: 50, y: 200 }, data: { label: 'Pub/Sub', icon: 'Radio', status: 'active' } },
            { id: 'process', type: 'service', position: { x: 250, y: 200 }, data: { label: 'Dataflow', icon: 'Workflow', status: 'active' } },
            { id: 'store', type: 'service', position: { x: 450, y: 200 }, data: { label: 'BigQuery', icon: 'Database', status: 'active' } },
            { id: 'analytics', type: 'service', position: { x: 650, y: 200 }, data: { label: 'Looker', icon: 'BarChart', status: 'active' } },
            { id: 'monitor', type: 'service', position: { x: 450, y: 50 }, data: { label: 'Monitoring', icon: 'Activity', status: 'active' } },
        ],
        [
            { id: 'g1', source: 'ingest', target: 'process', type: 'custom', animated: true, data: { color: 'yellow' } },
            { id: 'g2', source: 'process', target: 'store', type: 'custom', animated: true, data: { color: 'green' } },
            { id: 'g3', source: 'store', target: 'analytics', type: 'custom', animated: true, data: { color: 'blue' } },
            { id: 'g4', source: 'process', target: 'monitor', type: 'custom', animated: false, data: { color: 'red' } },
        ]
    )
]
