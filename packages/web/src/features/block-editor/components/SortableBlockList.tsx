import { type Component, For, Show, createSignal, onMount } from 'solid-js'
import { type Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import BlockCard from './BlockCard'
import BlockForm from './BlockForm'
import { useSortableList, useDraggableBlock } from '../hooks'
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
  onToggle: (enabled: boolean) => void
  onDataChange: (data: BlockState['data']) => void
}

// --- Draggable block component ---
const DraggableBlock: Component<DraggableBlockProps> = (props) => {
  const [open, setOpen] = createSignal(false)

  const { rowRef, handleRef, isDragging, closestEdge, setupDrag } = useDraggableBlock(
    props.block,
    () => props.dragState,
    props.onDragStateChange
  )

  onMount(setupDrag)

  const opacityClass = () =>
    isDragging() ? 'opacity-30' : !props.block.enabled ? 'opacity-60' : 'opacity-100'

  return (
    <div class="relative" ref={rowRef}>
      {/* Top drop indicator */}
      {closestEdge() === 'top' && (
        <div class="absolute -top-px left-0 right-0 h-0.5 rounded-full bg-primary z-10 pointer-events-none" />
      )}

      <div
        class={`border border-base-content/10 rounded-box bg-base-100 transition-opacity duration-150 ${opacityClass()}`}
      >
        {/* Header row */}
        <div class="flex items-center gap-4 px-4 py-3">
          <BlockCard
            meta={props.block.meta}
            enabled={props.block.enabled}
            onToggle={props.onToggle}
            dragHandleRef={handleRef}
          />

          {/* Arrow toggle — only this triggers open/close */}
          <button
            type="button"
            class="shrink-0 text-base-content/40 hover:text-base-content/70 transition-transform duration-200"
            style={{ transform: open() ? 'rotate(180deg)' : 'rotate(0deg)' }}
            onClick={() => setOpen((o) => !o)}
            aria-label={open() ? 'Collapse' : 'Expand'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        {/* Expandable form */}
        <Show when={open()}>
          <div class="px-4 pb-4 pt-3 border-t border-base-content/10">
            <BlockForm
              meta={props.block.meta}
              data={props.block.data}
              onChange={props.onDataChange}
            />
          </div>
        </Show>
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

  const updateBlock = (
    id: string,
    patch: Partial<Omit<BlockState, 'id' | 'meta'>>
  ) => {
    props.onChange(
      props.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b))
    )
  }

  return (
    <div class="flex flex-col gap-2">
      <For each={props.blocks}>
        {(block) => (
          <DraggableBlock
            block={block}
            dragState={dragState()}
            onDragStateChange={setDragState}
            onToggle={(enabled) => updateBlock(block.id, { enabled })}
            onDataChange={(data) => updateBlock(block.id, { data })}
          />
        )}
      </For>
    </div>
  )
}

export default SortableBlockList
