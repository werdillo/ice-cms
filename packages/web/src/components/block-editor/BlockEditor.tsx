import { type Component, createSignal, createMemo, For } from 'solid-js'
import type { BlockMeta } from '@ice-cms/schemas'
import { LANGS, type Lang } from '@ice-cms/schemas'
import { schemaToFields } from '../../lib/schema-to-fields'
import SchemaForm from './SchemaForm'
import type { z } from 'zod'

type BlockEditorProps = {
  meta: BlockMeta
  data: Partial<Record<Lang, Record<string, unknown>>>
  enabled: boolean
  order: number
  onChange: (data: Partial<Record<Lang, Record<string, unknown>>>) => void
  onToggle: (enabled: boolean) => void
}

const BlockEditor: Component<BlockEditorProps> = (props) => {
  const [open, setOpen] = createSignal(false)
  const [activeLang, setActiveLang] = createSignal<Lang>('lv')

  const fields = createMemo(() =>
    schemaToFields(props.meta.schema as z.ZodTypeAny)
  )

  const currentData = createMemo(
    () =>
      (props.data[activeLang()] as Record<string, unknown>) ??
      (props.meta.defaultData() as Record<string, unknown>)
  )

  const handleChange = (updated: Record<string, unknown>) => {
    props.onChange({
      ...props.data,
      [activeLang()]: updated,
    })
  }

  return (
    <>
      {/* Block card */}
      <div
        class={`card card-border bg-base-100 transition-opacity ${
          props.enabled ? 'opacity-100' : 'opacity-40'
        }`}
      >
        <div class="card-body flex-row items-center gap-4 p-4">
          {/* Drag handle */}
          <span class="cursor-grab text-base-content/30 select-none text-lg">
            ⠿
          </span>

          {/* Info */}
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="badge badge-ghost badge-sm font-mono">
                {props.meta.type}
              </span>
              <h3 class="font-semibold text-sm truncate">{props.meta.label}</h3>
            </div>
            <p class="text-xs opacity-50 mt-0.5 truncate">
              {props.meta.description}
            </p>
          </div>

          {/* Actions */}
          <div class="flex items-center gap-2 shrink-0">
            <input
              type="checkbox"
              class="toggle toggle-sm toggle-primary"
              checked={props.enabled}
              onChange={(e) => props.onToggle(e.currentTarget.checked)}
              title={props.enabled ? 'Disable block' : 'Enable block'}
            />
            <button
              class="btn btn-sm btn-outline"
              onClick={() => setOpen(true)}
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <dialog class={`modal ${open() ? 'modal-open' : ''}`}>
        <div class="modal-box w-11/12 max-w-3xl flex flex-col gap-0 p-0 overflow-hidden">
          {/* Modal header */}
          <div class="flex items-center justify-between px-5 py-4 border-b border-base-content/10">
            <div>
              <h3 class="font-bold text-base">{props.meta.label}</h3>
              <p class="text-xs opacity-50">{props.meta.type}</p>
            </div>
            <button
              class="btn btn-sm btn-ghost btn-circle"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Lang tabs */}
          <div class="tabs tabs-border px-5 pt-3 border-b border-base-content/10">
            <For each={LANGS}>
              {(lang) => (
                <button
                  class={`tab tab-sm uppercase font-mono ${
                    activeLang() === lang ? 'tab-active' : ''
                  }`}
                  onClick={() => setActiveLang(lang)}
                >
                  {lang}
                </button>
              )}
            </For>
          </div>

          {/* Form body */}
          <div class="overflow-y-auto p-5 flex-1 max-h-[65vh]">
            <SchemaForm
              fields={fields()}
              data={currentData()}
              onChange={handleChange}
            />
          </div>

          {/* Modal footer */}
          <div class="flex justify-end gap-2 px-5 py-4 border-t border-base-content/10">
            <button class="btn btn-sm btn-ghost" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button
              class="btn btn-sm btn-primary"
              onClick={() => setOpen(false)}
            >
              Save
            </button>
          </div>
        </div>

        {/* Backdrop */}
        <div class="modal-backdrop" onClick={() => setOpen(false)} />
      </dialog>
    </>
  )
}

export default BlockEditor
