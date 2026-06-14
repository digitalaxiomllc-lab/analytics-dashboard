'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, RotateCcw } from 'lucide-react'
import KPICard from '@/components/KPICard'
import type { KPI } from '@/lib/data'

const LS_KEY = 'prism_kpi_order_v1'

function SortableKPIItem({ kpi, originalIndex, displayIndex }: { kpi: KPI; originalIndex: number; displayIndex: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(originalIndex) })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
        zIndex: isDragging ? 10 : undefined,
      }}
      className="group relative"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        aria-label={`Drag to reorder ${kpi.label}`}
        className="
          absolute top-2.5 right-2.5 z-10
          w-6 h-6 flex items-center justify-center
          rounded-md text-slate-600
          opacity-0 group-hover:opacity-100
          hover:text-teal-400 hover:bg-slate-700/60
          transition-opacity cursor-grab active:cursor-grabbing
          focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-teal-400 focus-visible:outline-none
        "
      >
        <GripVertical size={13} />
      </button>

      <KPICard {...kpi} index={displayIndex} />
    </div>
  )
}

interface Props {
  kpis: KPI[]
}

export default function SortableKPIGrid({ kpis }: Props) {
  const defaultOrder = kpis.map((_, i) => i)
  const [order, setOrder] = useState<number[]>(defaultOrder)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as number[]
        // Validate: must be a permutation of 0..kpis.length-1
        if (
          Array.isArray(parsed) &&
          parsed.length === kpis.length &&
          parsed.every(n => typeof n === 'number' && n >= 0 && n < kpis.length)
        ) {
          setOrder(parsed)
        }
      }
    } catch {
      // ignore malformed localStorage
    }
    setReady(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setOrder(prev => {
      const oldIdx = prev.indexOf(Number(active.id))
      const newIdx = prev.indexOf(Number(over.id))
      const next = arrayMove(prev, oldIdx, newIdx)
      localStorage.setItem(LS_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setOrder(defaultOrder)
    localStorage.removeItem(LS_KEY)
  }, [defaultOrder])

  if (!ready) {
    // SSR / hydration guard — render default order without drag context
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => <KPICard key={kpi.label} {...kpi} index={i} />)}
      </div>
    )
  }

  const isCustom = order.some((v, i) => v !== i)

  return (
    <div className="space-y-2">
      {isCustom && (
        <div className="flex justify-end">
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
          >
            <RotateCcw size={11} />
            Reset layout
          </button>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order.map(String)} strategy={rectSortingStrategy}>
          <div data-tour="kpi-cards" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {order.map((originalIdx, displayIdx) => (
              <SortableKPIItem
                key={String(originalIdx)}
                kpi={kpis[originalIdx]}
                originalIndex={originalIdx}
                displayIndex={displayIdx}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
