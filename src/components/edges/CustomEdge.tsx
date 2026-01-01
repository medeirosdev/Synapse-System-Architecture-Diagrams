import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'
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

    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    })

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
                <text>
                    <textPath
                        href={`#${id}`}
                        startOffset="50%"
                        textAnchor="middle"
                        style={{
                            fontSize: 11,
                            fill: '#94a3b8',
                            fontWeight: 500,
                        }}
                    >
                        {edgeData.label}
                    </textPath>
                </text>
            )}
        </>
    )
}
