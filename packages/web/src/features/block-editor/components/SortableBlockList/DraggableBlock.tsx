import { type Component, onMount } from 'solid-js'
import { type Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import BlockCard from '../BlockCard'
import { useDraggableBlock } from '../../hooks'
import type { BlockState } from '../../types'

type DragState =
  | { type: 'idle' }
  | { type: 'dragging'; id: string }
  | { type: 'over'; id: string; edge: Edge }

type DraggableBlockProps = {
  block: BlockState
  dragState: DragState
  onDragStateChange: (s: DragState) => void
  onOpenModal: () => void
  onToggle: (enabled: boolean) => void
}

const DraggableBlock: Component<DraggableBlockProps> = (props) => {
  const { rowRef, handleRef, isDragging, closestEdge, setupDrag } = useDraggableBlock(
    props.block,
    () => props.dragState,
    props.onDragStateChange
  )

  onMount(setupDrag)

  return (
    <div class="relative" ref={rowRef}>
      {/* Top drop indicator */}
      {closestEdge() === 'top' && (
        <div class="absolute -top-px left-0 right-0 h-0.5 rounded-full bg-primary z-10 pointer-events-none" />
      )}

      <div class={`transition-opacity duration-150 ${isDragging() ? 'opacity-30' : 'opacity-100'}`}>
        <BlockCard
          meta={props.block.meta}
          enabled={props.block.enabled}
          onOpenModal={props.onOpenModal}
          onToggle={props.onToggle}
          dragHandleRef={handleRef}
        />
      </div>

      {/* Bottom drop indicator */}
      {closestEdge() === 'bottom' && (
        <div class="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-primary z-10 pointer-events-none" />
      )}
    </div>
  )
}

export { DraggableBlock }
