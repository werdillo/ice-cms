import { type Component, For, createMemo, createSignal, untrack } from 'solid-js'
import { LANGS, type Lang } from '@ice-cms/schemas'
import type { BlockMeta } from '@ice-cms/schemas'
import type { z } from 'zod'
import { SchemaForm, schemaToFields } from '../../schema-form'

type BlockFormProps = {
  meta: BlockMeta
  data: Partial<Record<Lang, Record<string, unknown>>>
  onChange: (data: Partial<Record<Lang, Record<string, unknown>>>) => void
}

export const BlockForm: Component<BlockFormProps> = (props) => {
  const [activeLang, setActiveLang] = createSignal<Lang>('lv')
  // Initialize once with untrack — never re-sync from props.data automatically
  const [localData, setLocalData] = createSignal<Partial<Record<Lang, Record<string, unknown>>>>(
    untrack(() => structuredClone(props.data) as Partial<Record<Lang, Record<string, unknown>>>)
  )
  const [isDirty, setIsDirty] = createSignal(false)

  const fields = createMemo(() =>
    schemaToFields(props.meta.schema as z.ZodTypeAny)
  )

  const currentData = createMemo(
    () =>
      (localData()[activeLang()] as Record<string, unknown>) ??
      (props.meta.defaultData() as Record<string, unknown> | undefined) ??
      {}
  )

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
    <div>
      {/* Lang tabs */}
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

      {/* Form */}
      <SchemaForm
        fields={fields()}
        data={currentData()}
        onChange={handleChange}
      />

      {/* Save / Cancel */}
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
  )
}

export default BlockForm
