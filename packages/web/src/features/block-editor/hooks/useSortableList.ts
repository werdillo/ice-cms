import { createSignal, onMount, onCleanup } from 'solid-js'
import {
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import {
  extractClosestEdge,
  type Edge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import type { BlockState } from '../types'

type DragState =
  | { type: 'idle' }
  | { type: 'dragging'; id: string }
  | { type: 'over'; id: string; edge: Edge }

const DRAG_KEY = 'block-id'

export function useSortableList(
  blocks: () => BlockState[],
  onChange: (blocks: BlockState[]) => void
) {
  const [dragState, setDragState] = createSignal<DragState>({ type: 'idle' })

  const reorder = (sourceId: string, targetId: string, edge: Edge) => {
    if (sourceId === targetId) return
    const list = [...blocks()]
    const from = list.findIndex((b) => b.id === sourceId)
    const to = list.findIndex((b) => b.id === targetId)
    if (from === -1 || to === -1) return
    const [moved] = list.splice(from, 1)
    const insertAt =
      edge === 'bottom'
        ? to >= from ? to : to + 1
        : to > from ? to - 1 : to
    list.splice(insertAt, 0, moved)
    onChange(list)
  }

  onMount(() => {
    const cleanup = monitorForElements({
      canMonitor: ({ source }) => DRAG_KEY in source.data,
      onDragStart: ({ source }) =>
        setDragState({ type: 'dragging', id: source.data[DRAG_KEY] as string }),
      onDrop: ({ source, location }) => {
        setDragState({ type: 'idle' })
        const target = location.current.dropTargets[0]
        if (!target) return
        const sourceId = source.data[DRAG_KEY] as string
        const targetId = target.data[DRAG_KEY] as string
        const edge = extractClosestEdge(target.data)
        if (edge) reorder(sourceId, targetId, edge)
      },
    })
    onCleanup(cleanup)
  })

  return { dragState, setDragState, reorder }
}
