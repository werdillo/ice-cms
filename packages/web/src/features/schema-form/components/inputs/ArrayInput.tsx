import { type Component, For, createMemo } from 'solid-js'
import type { ArrayField } from '../../types'
import { FieldRenderer } from '../FieldRenderer'

const ArrayInput: Component<{
  field: ArrayField
  value: Record<string, unknown>[]
  onChange: (v: Record<string, unknown>[]) => void
}> = (props) => {
  const items = createMemo(() =>
    Array.isArray(props.value) ? props.value : []
  )

  const addItem = () => {
    props.onChange([...items(), structuredClone(props.field.defaultItem)])
  }

  const removeItem = (index: number) => {
    props.onChange(items().filter((_, i) => i !== index))
  }

  const updateItem = (index: number, updated: Record<string, unknown>) => {
    const next = items().map((item, i) => (i === index ? updated : item))
    props.onChange(next)
  }

  return (
    <div class="w-full">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-semibold opacity-50 uppercase tracking-wider">
          {props.field.label}
        </span>
        <button type="button" class="btn btn-xs btn-outline btn-primary" onClick={addItem}>
          + Add
        </button>
      </div>

      <div class="flex flex-col gap-3">
        <For each={items()}>
          {(item, index) => (
            <div class="rounded-box border border-base-content/10 bg-base-200/60 p-3 relative">
              <button
                type="button"
                class="btn btn-xs btn-ghost btn-circle absolute top-2 right-2 text-error"
                onClick={() => removeItem(index())}
                title="Remove"
              >
                ✕
              </button>
              <p class="text-xs opacity-40 mb-2">#{index() + 1}</p>
              <div class="flex flex-col gap-2">
                <For each={props.field.itemFields}>
                  {(subField) => (
                    <FieldRenderer
                      field={subField}
                      data={item as Record<string, unknown>}
                      onChange={(updated) => updateItem(index(), updated)}
                    />
                  )}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}

export { ArrayInput }
