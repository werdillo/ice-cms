import { type Component } from 'solid-js'
import type { BlockMeta } from '@ice-cms/schemas'

type BlockCardProps = {
  meta: BlockMeta
  enabled: boolean
  onToggle: (enabled: boolean) => void
  dragHandleRef?: (el: HTMLButtonElement) => void
}

export const BlockCard: Component<BlockCardProps> = (props) => {
  return (
    <>
      {/* Drag handle */}
      <button
        type="button"
        ref={props.dragHandleRef}
        class="cursor-grab active:cursor-grabbing text-base-content/30 hover:text-base-content/60 select-none text-xl touch-none bg-transparent border-none p-0 leading-none transition-colors shrink-0"
        aria-label="Drag to reorder"
        onClick={(e) => e.stopPropagation()}
      >
        ⠿
      </button>

      {/* Info */}
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <span class="badge badge-ghost badge-sm font-mono text-xs">
            {props.meta.type}
          </span>
          <h3 class="font-semibold text-sm truncate">{props.meta.label}</h3>
        </div>
        <p class="text-xs opacity-40 mt-0.5 truncate">{props.meta.description}</p>
      </div>

      {/* Enable toggle */}
      <input
        type="checkbox"
        class="toggle toggle-sm toggle-primary shrink-0"
        checked={props.enabled}
        onChange={(e) => props.onToggle(e.currentTarget.checked)}
        onClick={(e) => e.stopPropagation()}
        title={props.enabled ? 'Disable block' : 'Enable block'}
      />
    </>
  )
}

export default BlockCard
