import { type Component, For } from 'solid-js'
import { Portal } from 'solid-js/web'
import BlockModal from '../BlockModal'
import { DraggableBlock } from './DraggableBlock'
import { useSortableList, useModalState } from '../../hooks'
import type { BlockState } from '../../types'

type SortableBlockListProps = {
  blocks: BlockState[]
  onChange: (blocks: BlockState[]) => void
}

const SortableBlockList: Component<SortableBlockListProps> = (props) => {
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
