import { type Component, Show } from 'solid-js'

export type BlockCardMeta = {
  type: string
  label: string
  description?: string
}

type BlockCardProps = {
  meta: BlockCardMeta
  dragHandleRef?: (el: HTMLButtonElement) => void
  enabled?: boolean
  onToggle?: (enabled: boolean) => void
}

export const BlockCard: Component<BlockCardProps> = (props) => {
  return (
    <>
      {/* Drag handle — only rendered when a ref is provided */}
      <Show when={props.dragHandleRef}>
        <button
          type="button"
          ref={props.dragHandleRef}
          class="cursor-grab active:cursor-grabbing text-base-content/30 hover:text-base-content/60 select-none text-xl touch-none bg-transparent border-none p-0 leading-none transition-colors shrink-0"
          aria-label="Drag to reorder"
          onClick={(e) => e.stopPropagation()}
        >
          ⠿
        </button>
      </Show>

      {/* Info */}
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <span class="badge badge-ghost badge-sm font-mono text-xs">
            {props.meta.type}
          </span>
          <h3 class="font-semibold text-sm truncate">{props.meta.label}</h3>
        </div>
        <Show when={props.meta.description}>
          <p class="text-xs opacity-40 mt-0.5 truncate">{props.meta.description}</p>
        </Show>
      </div>

      {/* Enable toggle — only rendered when onToggle is provided */}
      <Show when={props.onToggle}>
        <input
          type="checkbox"
          class="toggle toggle-sm toggle-primary shrink-0"
          checked={props.enabled ?? true}
          onChange={(e) => props.onToggle!(e.currentTarget.checked)}
          onClick={(e) => e.stopPropagation()}
          title={props.enabled ? 'Disable block' : 'Enable block'}
        />
      </Show>
    </>
  )
}

export default BlockCard
