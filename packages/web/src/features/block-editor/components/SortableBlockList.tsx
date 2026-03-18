import { type Component, For, onMount } from 'solid-js'
import { Portal } from 'solid-js/web'
import { type Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import BlockCard from './BlockCard'
import BlockModal from './BlockModal'
import { useSortableList, useModalState, useDraggableBlock } from '../hooks'
import type { BlockState } from '../types'

type SortableBlockListProps = {
  blocks: BlockState[]
  onChange: (blocks: BlockState[]) => void
}

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

// --- Draggable block component ---
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

export const SortableBlockList: Component<SortableBlockListProps> = (props) => {
  const { dragState, setDragState } = useSortableList(() => props.blocks, props.onChange)
  const {
    activeModalId,
    activeBlock,
    openModal,
    closeModal,
    updateBlock,
  } = useModalState(() => props.blocks, props.onChange)

  return (
    <>
      {/* Block cards */}
      <div class="flex flex-col gap-2">
        <For each={props.blocks}>
          {(block) => (
            <DraggableBlock
              block={block}
              dragState={dragState()}
              onDragStateChange={setDragState}
              onOpenModal={() => openModal(block.id)}
              onToggle={(enabled) => updateBlock(block.id, { enabled })}
            />
          )}
        </For>
      </div>

      {/* Single modal instance — always in DOM, never remounts */}
      <Portal mount={document.body}>
        <BlockModal
          meta={activeBlock()?.meta ?? props.blocks[0]?.meta}
          data={activeBlock()?.data ?? {}}
          open={activeModalId() !== null}
          onClose={closeModal}
          onChange={(data) => {
            const id = activeModalId()
            if (id) updateBlock(id, { data })
          }}
        />
      </Portal>
    </>
  )
}

export default SortableBlockList
