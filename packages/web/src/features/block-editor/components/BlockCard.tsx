import { type Component } from 'solid-js'
import type { BlockMeta } from '@ice-cms/schemas'

type BlockCardProps = {
  meta: BlockMeta
  enabled: boolean
  onOpenModal: () => void
  onToggle: (enabled: boolean) => void
  dragHandleRef?: (el: HTMLButtonElement) => void
}

const BlockCard: Component<BlockCardProps> = (props) => {
  return (
    <div
      class={`card card-border bg-base-100 transition-opacity ${
        props.enabled ? 'opacity-100' : 'opacity-50'
      }`}
    >
      <div class="card-body flex-row items-center gap-4 p-4">
        {/* Drag handle */}
        <button
          type="button"
          ref={props.dragHandleRef}
          class="cursor-grab active:cursor-grabbing text-base-content/30 hover:text-base-content/60 select-none text-xl touch-none bg-transparent border-none p-0 leading-none transition-colors"
          aria-label="Drag to reorder"
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

        {/* Actions */}
        <div class="flex items-center gap-3 shrink-0">
          <input
            type="checkbox"
            class="toggle toggle-sm toggle-primary"
            checked={props.enabled}
            onChange={(e) => props.onToggle(e.currentTarget.checked)}
            title={props.enabled ? 'Disable block' : 'Enable block'}
          />
          <button
            type="button"
            class="btn btn-sm btn-outline"
            onClick={props.onOpenModal}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}

export default BlockCard
