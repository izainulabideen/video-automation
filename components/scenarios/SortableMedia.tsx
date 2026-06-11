'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { reorderGraphics, bulkDeleteGraphics, setCoverGraphic, deleteGraphic } from '@/actions/graphics'
import { Film, Star, GripVertical, Trash2, CheckSquare, Square, Loader2 } from 'lucide-react'

type Graphic = {
  id: string
  file_url: string
  file_name: string
  media_type?: string
  sort_order: number
}

interface Props {
  scenarioId: string
  items: Graphic[]
  coverGraphicId: string | null
}

function SortableItem({
  g,
  selected,
  isCover,
  onSelect,
  onSetCover,
  onDelete,
}: {
  g: Graphic
  selected: boolean
  isCover: boolean
  onSelect: () => void
  onSetCover: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: g.id })
  const isClip = g.media_type === 'clip' || g.file_name?.match(/\.(mp4|mov|webm|avi)$/i)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  }

  return (
    <div ref={setNodeRef} style={style}
      className={`relative group rounded-xl overflow-hidden border transition-all ${
        selected ? 'border-accent/50 ring-1 ring-accent/30' :
        isCover ? 'border-amber-400/40' :
        'border-white/[0.07] hover:border-white/[0.15]'
      }`}>

      {/* Media */}
      <div className="aspect-square bg-[#0D1117] relative">
        {isClip ? (
          <>
            <video src={g.file_url} className="w-full h-full object-cover opacity-70" muted />
            <div className="absolute inset-0 flex items-center justify-center">
              <Film size={18} className="text-white/50" />
            </div>
          </>
        ) : (
          <Image src={g.file_url} alt={g.file_name} fill sizes="(max-width: 768px) 50vw, 200px"
            className="object-cover" />
        )}

        {/* Cover badge */}
        {isCover && (
          <div className="absolute top-1.5 left-1.5 bg-amber-400/90 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-md">
            COVER
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
          {/* Drag handle */}
          <div {...attributes} {...listeners}
            className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors touch-none">
            <GripVertical size={14} className="text-white/70" />
          </div>
          <div className="flex gap-1.5">
            <button onClick={onSetCover} title={isCover ? 'Remove cover' : 'Set as cover'}
              className={`p-1.5 rounded-lg transition-colors ${isCover ? 'bg-amber-400/30 text-amber-400' : 'bg-white/10 text-white/70 hover:bg-amber-400/20 hover:text-amber-400'}`}>
              <Star size={12} fill={isCover ? 'currentColor' : 'none'} />
            </button>
            <button onClick={onDelete} title="Delete"
              className="p-1.5 rounded-lg bg-white/10 text-white/70 hover:bg-danger/20 hover:text-danger transition-colors">
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Select checkbox */}
      <button onClick={onSelect}
        className="absolute top-1.5 right-1.5 transition-opacity opacity-0 group-hover:opacity-100">
        {selected
          ? <CheckSquare size={16} className="text-accent drop-shadow" />
          : <Square size={16} className="text-white/50 drop-shadow" />
        }
      </button>

      {/* Filename */}
      <div className="px-2 py-1.5 bg-[#0A0E18]">
        <p className="text-[10px] text-brand-500 truncate">{g.file_name}</p>
      </div>
    </div>
  )
}

export function SortableMedia({ scenarioId, items: initial, coverGraphicId: initialCover }: Props) {
  const router = useRouter()
  const [items, setItems] = useState(initial)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [cover, setCover] = useState<string | null>(initialCover)
  const [, startTransition] = useTransition()
  const [bulkDeleting, setBulkDeleting] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex(i => i.id === active.id)
    const newIndex = items.findIndex(i => i.id === over.id)
    const newItems = arrayMove(items, oldIndex, newIndex)
    setItems(newItems)
    startTransition(async () => {
      await reorderGraphics(scenarioId, newItems.map(i => i.id))
      router.refresh()
    })
  }

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleSetCover(id: string) {
    const next = cover === id ? null : id
    setCover(next)
    startTransition(async () => {
      await setCoverGraphic(scenarioId, next)
      router.refresh()
    })
  }

  function handleDelete(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
    setSelected(prev => { const next = new Set(prev); next.delete(id); return next })
    startTransition(async () => {
      await deleteGraphic(id, scenarioId)
      router.refresh()
    })
  }

  async function handleBulkDelete() {
    const ids = Array.from(selected)
    setBulkDeleting(true)
    setItems(prev => prev.filter(i => !selected.has(i.id)))
    setSelected(new Set())
    await bulkDeleteGraphics(ids, scenarioId)
    setBulkDeleting(false)
    router.refresh()
  }

  const images = items.filter(g => g.media_type !== 'clip' && !g.file_name?.match(/\.(mp4|mov|webm|avi)$/i))
  const clips  = items.filter(g => g.media_type === 'clip'  || g.file_name?.match(/\.(mp4|mov|webm|avi)$/i))

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-3 py-2 mb-3 rounded-lg bg-accent/[0.08] border border-accent/20">
          <span className="text-xs text-accent font-medium">{selected.size} selected</span>
          <button onClick={() => setSelected(new Set())} className="text-[11px] text-brand-500 hover:text-brand-300 transition-colors">
            Deselect all
          </button>
          <button onClick={handleBulkDelete} disabled={bulkDeleting}
            className="ml-auto flex items-center gap-1.5 text-[11px] text-danger hover:text-red-400 border border-danger/20 hover:border-danger/40 px-2.5 py-1 rounded-lg transition-all disabled:opacity-40">
            {bulkDeleting ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
            Delete {selected.size}
          </button>
        </div>
      )}

      <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
        {images.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] text-brand-500 uppercase tracking-wider mb-2">Images ({images.length}) — drag to reorder</p>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {images.map(g => (
                <SortableItem key={g.id} g={g}
                  selected={selected.has(g.id)}
                  isCover={cover === g.id}
                  onSelect={() => toggleSelect(g.id)}
                  onSetCover={() => handleSetCover(g.id)}
                  onDelete={() => handleDelete(g.id)}
                />
              ))}
            </div>
          </div>
        )}
        {clips.length > 0 && (
          <div>
            <p className="text-[10px] text-brand-500 uppercase tracking-wider mb-2">Clips ({clips.length})</p>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {clips.map(g => (
                <SortableItem key={g.id} g={g}
                  selected={selected.has(g.id)}
                  isCover={false}
                  onSelect={() => toggleSelect(g.id)}
                  onSetCover={() => {}}
                  onDelete={() => handleDelete(g.id)}
                />
              ))}
            </div>
          </div>
        )}
      </SortableContext>
    </DndContext>
  )
}
