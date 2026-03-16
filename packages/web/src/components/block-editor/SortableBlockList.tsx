import {
  type Component,
  createSignal,
  For,
  onMount,
  onCleanup,
} from 'solid-js'
import { Portal } from 'solid-js/web'
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import BlockEditor, { BlockModal } from './BlockEditor'
import type { Lang, BlockMeta } from '@ice-cms/schemas'

export type BlockState = {
  id: string
  meta: BlockMeta
  data: Partial<Record<Lang, Record<string, unknown>>>
  enabled: boolean
}

type SortableBlockListProps = {
  blocks: BlockState[]
  onChange: (blocks: BlockState[]) => void
}

type DragState =
  | { type: 'idle' }
  | { type: 'dragging'; id: string }
  | { type: 'over'; id: string; edge: Edge }

const DRAG_KEY = 'block-id'

const SortableBlockList: Component<SortableBlockListProps> = (props) => {
  const [dragState, setDragState] = createSignal<DragState>({ type: 'idle' })
  // ID of the block whose modal is open — null means closed
  const [activeModalId, setActiveModalId] = createSignal<string | null>(null)

  const activeBlock = () =>
    props.blocks.find((b) => b.id === activeModalId()) ?? null

  const openModal = (id: string) => setActiveModalId(id)
  const closeModal = () => setActiveModalId(null)

  const updateBlock = (
    id: string,
    patch: Partial<Omit<BlockState, 'id' | 'meta'>>
  ) => {
    props.onChange(
      props.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b))
    )
  }

  const reorder = (sourceId: string, targetId: string, edge: Edge) => {
    if (sourceId === targetId) return
    const list = [...props.blocks]
    const from = list.findIndex((b) => b.id === sourceId)
    const to = list.findIndex((b) => b.id === targetId)
    if (from === -1 || to === -1) return
    const [moved] = list.splice(from, 1)
    const insertAt =
      edge === 'bottom'
        ? to >= from ? to : to + 1
        : to > from ? to - 1 : to
    list.splice(insertAt, 0, moved)
    props.onChange(list)
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

// --- Single draggable block card ---

type DraggableBlockProps = {
  block: BlockState
  dragState: DragState
  onDragStateChange: (s: DragState) => void
  onOpenModal: () => void
  onToggle: (enabled: boolean) => void
}

const DraggableBlock: Component<DraggableBlockProps> = (props) => {
  let rowRef!: HTMLDivElement
  let handleRef!: HTMLButtonElement

  const isDragging = () =>
    props.dragState.type === 'dragging' && props.dragState.id === props.block.id

  const closestEdge = (): Edge | null => {
    if (
      props.dragState.type === 'over' &&
      props.dragState.id === props.block.id
    )
      return props.dragState.edge
    return null
  }

  onMount(() => {
    const cleanup = combine(
      draggable({
        element: rowRef,
        dragHandle: handleRef,
        getInitialData: () => ({ [DRAG_KEY]: props.block.id }),
      }),
      dropTargetForElements({
        element: rowRef,
        canDrop: ({ source }) => DRAG_KEY in source.data,
        getData: ({ input }) =>
          attachClosestEdge(
            { [DRAG_KEY]: props.block.id },
            { element: rowRef, input, allowedEdges: ['top', 'bottom'] }
          ),
        onDragEnter: ({ self }) => {
          const edge = extractClosestEdge(self.data)
          if (edge)
            props.onDragStateChange({ type: 'over', id: props.block.id, edge })
        },
        onDrag: ({ self }) => {
          const edge = extractClosestEdge(self.data)
          if (edge)
            props.onDragStateChange({ type: 'over', id: props.block.id, edge })
        },
        onDragLeave: () => props.onDragStateChange({ type: 'idle' }),
        onDrop: () => props.onDragStateChange({ type: 'idle' }),
      })
    )
    onCleanup(cleanup)
  })

  return (
    <div class="relative" ref={rowRef!}>
      {/* Top drop indicator */}
      {closestEdge() === 'top' && (
        <div class="absolute -top-px left-0 right-0 h-0.5 rounded-full bg-primary z-10 pointer-events-none" />
      )}

      <div class={`transition-opacity duration-150 ${isDragging() ? 'opacity-30' : 'opacity-100'}`}>
        <BlockEditor
          meta={props.block.meta}
          enabled={props.block.enabled}
          onOpenModal={props.onOpenModal}
          onToggle={props.onToggle}
          dragHandleRef={(el) => (handleRef = el)}
        />
      </div>

      {/* Bottom drop indicator */}
      {closestEdge() === 'bottom' && (
        <div class="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-primary z-10 pointer-events-none" />
      )}
    </div>
  )
}

export default SortableBlockList
