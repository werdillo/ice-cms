import { type Component, For } from 'solid-js'
import type { BlockMeta } from '@ice-cms/schemas'
import { LANGS, type Lang } from '@ice-cms/schemas'
import SchemaForm from './SchemaForm'
import { useBlockModal } from '../hooks'

type BlockModalProps = {
  meta: BlockMeta | undefined
  data: Partial<Record<Lang, Record<string, unknown>>>
  open: boolean
  onClose: () => void
  onChange: (data: Partial<Record<Lang, Record<string, unknown>>>) => void
}

export const BlockModal: Component<BlockModalProps> = (props) => {
  const {
    activeLang,
    setActiveLang,
    fields,
    currentData,
    handleChange,
    handleSave,
    handleCancel,
  } = useBlockModal(props)

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
        onClick={handleCancel}
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
            <h3 class="font-bold text-base">{props.meta?.label}</h3>
            <p class="text-xs opacity-40 font-mono">{props.meta?.type}</p>
          </div>
          <button
            type="button"
            class="btn btn-sm btn-ghost btn-circle"
            onClick={handleCancel}
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
          <button type="button" class="btn btn-sm btn-ghost" onClick={handleCancel}>
            Cancel
          </button>
          <button type="button" class="btn btn-sm btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </>
  )
}

export default BlockModal
