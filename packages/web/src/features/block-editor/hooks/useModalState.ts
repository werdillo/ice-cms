import { createSignal } from 'solid-js'
import type { BlockState } from '../types'

export function useModalState(
  blocks: () => BlockState[],
  onChange: (blocks: BlockState[]) => void
) {
  const [activeModalId, setActiveModalId] = createSignal<string | null>(null)

  const activeBlock = () =>
    blocks().find((b) => b.id === activeModalId()) ?? null

  const openModal = (id: string) => setActiveModalId(id)
  const closeModal = () => setActiveModalId(null)

  const updateBlock = (
    id: string,
    patch: Partial<Omit<BlockState, 'id' | 'meta'>>
  ) => {
    onChange(
      blocks().map((b) => (b.id === id ? { ...b, ...patch } : b))
    )
  }

  return {
    activeModalId,
    activeBlock,
    openModal,
    closeModal,
    updateBlock,
  }
}
