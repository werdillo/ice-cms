import { onCleanup } from 'solid-js'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import type { BlockState } from '../types'

type DragState =
  | { type: 'idle' }
  | { type: 'dragging'; id: string }
  | { type: 'over'; id: string; edge: Edge }

const DRAG_KEY = 'block-id'

export function useDraggableBlock(
  block: BlockState,
  dragState: () => DragState,
  onDragStateChange: (state: DragState) => void
) {
  let rowRef!: HTMLDivElement
  let handleRef!: HTMLButtonElement

  const isDragging = () =>
    dragState().type === 'dragging' && (dragState() as any).id === block.id

  const closestEdge = (): Edge | null => {
    if (
      dragState().type === 'over' &&
      (dragState() as any).id === block.id
    )
      return (dragState() as any).edge
    return null
  }

  const setupDrag = () => {
    const cleanup = combine(
      draggable({
        element: rowRef,
        dragHandle: handleRef,
        getInitialData: () => ({ [DRAG_KEY]: block.id }),
      }),
      dropTargetForElements({
        element: rowRef,
        canDrop: ({ source }) => DRAG_KEY in source.data,
        getData: ({ input }) =>
          attachClosestEdge(
            { [DRAG_KEY]: block.id },
            { element: rowRef, input, allowedEdges: ['top', 'bottom'] }
          ),
        onDragEnter: ({ self }) => {
          const edge = extractClosestEdge(self.data)
          if (edge)
            onDragStateChange({ type: 'over', id: block.id, edge })
        },
        onDrag: ({ self }) => {
          const edge = extractClosestEdge(self.data)
          if (edge)
            onDragStateChange({ type: 'over', id: block.id, edge })
        },
        onDragLeave: () => onDragStateChange({ type: 'idle' }),
        onDrop: () => onDragStateChange({ type: 'idle' }),
      })
    )
    onCleanup(cleanup)
  }

  return {
    rowRef: (el: HTMLDivElement) => (rowRef = el),
    handleRef: (el: HTMLButtonElement) => (handleRef = el),
    isDragging,
    closestEdge,
    setupDrag,
  }
}
