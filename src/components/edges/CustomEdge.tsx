import {
    BaseEdge,
    getBezierPath,
    getStraightPath,
    getSmoothStepPath,
    type EdgeProps
} from '@xyflow/react'
import type { SynapseEdgeData } from '../../types'
import { getEdgeColor } from '../../lib/utils'

export function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    selected,
}: EdgeProps) {
    const edgeData = data as SynapseEdgeData | undefined
    const color = getEdgeColor(edgeData?.color || 'cyan')
    const isAnimated = edgeData?.animated !== false

    const edgeType = edgeData?.type || 'default'

    let edgePath = ''
    let labelX = 0
    let labelY = 0

    const params = {
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    }

    switch (edgeType) {
        case 'straight':
            [edgePath, labelX, labelY] = getStraightPath(params)
            break
        case 'step':
            [edgePath, labelX, labelY] = getSmoothStepPath({ ...params, borderRadius: 0 })
            break
        case 'smoothstep':
            [edgePath, labelX, labelY] = getSmoothStepPath(params)
            break
        default:
            [edgePath, labelX, labelY] = getBezierPath(params)
            break
    }

    return (
        <>
            {/* Glow effect quando selecionado */}
            {selected && (
                <path
                    d={edgePath}
                    fill="none"
                    stroke={color}
                    strokeWidth={8}
                    strokeOpacity={0.3}
                    style={{ filter: 'blur(4px)' }}
                />
            )}

            {/* Edge principal */}
            <BaseEdge
                id={id}
                path={edgePath}
                style={{
                    stroke: color,
                    strokeWidth: selected ? 3 : 2,
                    filter: selected ? `drop-shadow(0 0 6px ${color})` : 'none',
                }}
            />

            {/* Animação de fluxo */}
            {isAnimated && (
                <path
                    d={edgePath}
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                    strokeDasharray="8 4"
                    style={{
                        animation: 'flowAnimation 1s linear infinite',
                    }}
                />
            )}

            {/* Label da edge */}
            {edgeData?.label && (
                <text
                    x={labelX}
                    y={labelY}
                    style={{
                        fontSize: 11,
                        fill: '#94a3b8',
                        fontWeight: 500,
                        textAnchor: 'middle',
                        dominantBaseline: 'middle',
                    }}
                >
                    <tspan dy="-15" style={{ fill: '#94a3b8', background: 'rgba(15, 23, 42, 0.8)' }}>
                        {edgeData.label}
                    </tspan>
                </text>
            )}
        </>
    )
}

