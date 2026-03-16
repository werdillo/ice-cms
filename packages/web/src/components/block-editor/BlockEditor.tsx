import { type Component, createSignal, createMemo, For } from 'solid-js'
import type { BlockMeta } from '@ice-cms/schemas'
import { LANGS, type Lang } from '@ice-cms/schemas'
import { schemaToFields } from '../../lib/schema-to-fields'
import SchemaForm from './SchemaForm'
import type { z } from 'zod'

// ------------------------------------------------------------------ Modal ---
// Rendered once at app level, never remounts. Controlled via open/close fns.

type BlockModalProps = {
  meta: BlockMeta
  data: Partial<Record<Lang, Record<string, unknown>>>
  open: boolean
  onClose: () => void
  onChange: (data: Partial<Record<Lang, Record<string, unknown>>>) => void
}

export const BlockModal: Component<BlockModalProps> = (props) => {
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
    props.onChange({ ...props.data, [activeLang()]: updated })
  }

  const stopProp = (e: MouseEvent) => e.stopPropagation()

  return (
    <>
      {/* Backdrop */}
      <div
        class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
        style={{
          opacity: props.open ? '1' : '0',
          'pointer-events': props.open ? 'auto' : 'none',
        }}
        onClick={props.onClose}
      />

      {/* Box */}
      <div
        class="fixed z-50 flex flex-col bg-base-100 rounded-2xl shadow-2xl overflow-hidden transition-all duration-200"
        style={{
          width: 'min(720px, 92vw)',
          'max-height': '88vh',
          top: '50%',
          left: '50%',
          transform: props.open
            ? 'translate(-50%, -50%) scale(1)'
            : 'translate(-50%, -50%) scale(0.96)',
          opacity: props.open ? '1' : '0',
          'pointer-events': props.open ? 'auto' : 'none',
        }}
        onClick={stopProp}
      >
        {/* Header */}
        <div class="flex items-center justify-between px-5 py-4 border-b border-base-content/10 shrink-0">
          <div>
            <h3 class="font-bold text-base">{props.meta.label}</h3>
            <p class="text-xs opacity-40 font-mono">{props.meta.type}</p>
          </div>
          <button
            type="button"
            class="btn btn-sm btn-ghost btn-circle"
            onClick={props.onClose}
          >
            ✕
          </button>
        </div>

        {/* Lang tabs */}
        <div class="flex gap-1 px-5 pt-3 pb-0 border-b border-base-content/10 shrink-0">
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
        <div class="overflow-y-auto p-5 flex-1">
          <SchemaForm
            fields={fields()}
            data={currentData()}
            onChange={handleChange}
          />
        </div>

        {/* Footer */}
        <div class="flex justify-end gap-2 px-5 py-4 border-t border-base-content/10 shrink-0">
          <button type="button" class="btn btn-sm btn-ghost" onClick={props.onClose}>
            Cancel
          </button>
          <button type="button" class="btn btn-sm btn-primary" onClick={props.onClose}>
            Save
          </button>
        </div>
      </div>
    </>
  )
}

// ------------------------------------------------------------------- Card ---

type BlockEditorProps = {
  meta: BlockMeta
  enabled: boolean
  onOpenModal: () => void
  onToggle: (enabled: boolean) => void
  dragHandleRef?: (el: HTMLButtonElement) => void
}

const BlockEditor: Component<BlockEditorProps> = (props) => {
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

export default BlockEditor
