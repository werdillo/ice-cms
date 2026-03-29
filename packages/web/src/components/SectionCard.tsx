import { type Component, For, Show, createSignal, createMemo, untrack } from 'solid-js'
import { LANGS, type Lang } from '@ice-cms/schemas'
import { SchemaForm } from '../features/schema-form'
import { BlockCard, type BlockCardMeta } from '../features/block-editor/components/BlockCard'
import type { FieldDescriptor } from '../features/schema-form/types'

type SectionCardProps = {
  meta: BlockCardMeta
  fields: FieldDescriptor[]
  data: Partial<Record<Lang, Record<string, unknown>>>
  onChange: (data: Partial<Record<Lang, Record<string, unknown>>>) => void
  defaultOpen?: boolean
}

export const SectionCard: Component<SectionCardProps> = (props) => {
  const [open, setOpen] = createSignal(props.defaultOpen ?? false)
  const [activeLang, setActiveLang] = createSignal<Lang>('lv')

  // Initialize once — same pattern as BlockForm
  const [localData, setLocalData] = createSignal<Partial<Record<Lang, Record<string, unknown>>>>(
    untrack(() => structuredClone(props.data) as Partial<Record<Lang, Record<string, unknown>>>)
  )
  const [isDirty, setIsDirty] = createSignal(false)

  const currentData = createMemo(() => localData()[activeLang()] ?? {})

  const handleChange = (updated: Record<string, unknown>) => {
    setLocalData((prev) => ({ ...prev, [activeLang()]: updated }))
    setIsDirty(true)
  }

  const handleSave = () => {
    props.onChange(localData())
    setIsDirty(false)
  }

  const handleCancel = () => {
    setLocalData(structuredClone(props.data) as Partial<Record<Lang, Record<string, unknown>>>)
    setIsDirty(false)
  }

  return (
    <div class="border border-base-content/10 rounded-box bg-base-100">
      {/* Header row — same structure as DraggableBlock, no drag handle, no toggle */}
      <div class="flex items-center gap-4 px-4 py-3">
        <BlockCard meta={props.meta} />

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

      {/* Expandable content — same structure as DraggableBlock's form panel */}
      <Show when={open()}>
        <div class="px-4 pb-4 pt-3 border-t border-base-content/10">
          {/* Lang tabs — same style as BlockForm */}
          <div class="flex gap-1 border-b border-base-content/10 mb-4">
            <For each={LANGS}>
              {(lang) => (
                <button
                  type="button"
                  class={`px-4 py-1.5 text-xs font-mono font-semibold uppercase rounded-t-lg border-b-2 transition-colors ${
                    activeLang() === lang
                      ? 'border-primary text-primary'
                      : 'border-transparent opacity-40 hover:opacity-70'
                  }`}
                  onClick={() => setActiveLang(lang)}
                >
                  {lang}
                </button>
              )}
            </For>
          </div>

          <SchemaForm
            fields={props.fields}
            data={currentData()}
            onChange={handleChange}
          />

          {/* Save / Cancel — same style as BlockForm */}
          <div class="flex gap-2 mt-4 pt-4 border-t border-base-content/10">
            <button
              type="button"
              class="btn btn-sm btn-primary"
              disabled={!isDirty()}
              onClick={handleSave}
            >
              Save Changes
            </button>
            <button
              type="button"
              class="btn btn-sm btn-ghost"
              disabled={!isDirty()}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </Show>
    </div>
  )
}

export default SectionCard
