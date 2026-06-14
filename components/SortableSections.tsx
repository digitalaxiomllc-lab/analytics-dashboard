'use client'

import { useState, useEffect, useCallback, type ReactNode } from 'react'
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
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, RotateCcw } from 'lucide-react'

const LS_KEY = 'prism_section_order_v1'

export interface SectionDef {
  id: string
  label: string
  children: ReactNode
}

function SortableSection({ id, label, children }: SectionDef) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 10 : undefined,
        position: 'relative',
      }}
      className="group"
    >
      {/* Drag handle — top-right, hover-reveal */}
      <button
        {...attributes}
        {...listeners}
        aria-label={`Drag to reorder ${label}`}
        className="
          absolute top-3 right-3 z-10
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

      {children}
    </div>
  )
}

interface Props {
  sections: SectionDef[]
}

export default function SortableSections({ sections }: Props) {
  const defaultOrder = sections.map(s => s.id)
  const [order, setOrder] = useState<string[]>(defaultOrder)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as string[]
        if (
          Array.isArray(parsed) &&
          parsed.length === sections.length &&
          parsed.every(id => sections.some(s => s.id === id))
        ) {
          setOrder(parsed)
        }
      }
    } catch {
      // ignore
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
      const oldIdx = prev.indexOf(String(active.id))
      const newIdx = prev.indexOf(String(over.id))
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
    return (
      <>
        {sections.map(s => (
          <div key={s.id}>{s.children}</div>
        ))}
      </>
    )
  }

  const isCustom = order.some((id, i) => id !== defaultOrder[i])
  const sectionMap = Object.fromEntries(sections.map(s => [s.id, s]))

  return (
    <div className="space-y-5 md:space-y-6">
      {isCustom && (
        <div className="flex justify-end">
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
          >
            <RotateCcw size={11} />
            Reset section order
          </button>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          {order.map(id => {
            const s = sectionMap[id]
            return <SortableSection key={id} {...s} />
          })}
        </SortableContext>
      </DndContext>
    </div>
  )
}
