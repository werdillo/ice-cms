import { type Component, For, createMemo } from 'solid-js'
import type { TupleField } from '../../../types'
import { FieldRenderer } from '../FieldRenderer'

const TupleInput: Component<{
  field: TupleField
  value: Record<string, unknown>[]
  onChange: (v: Record<string, unknown>[]) => void
}> = (props) => {
  const items = createMemo(() => {
    const val = Array.isArray(props.value) ? props.value : []
    // Ensure correct length using defaultItems as fallback
    return Array.from({ length: props.field.length }, (_, i) =>
      val[i] ?? structuredClone(props.field.defaultItems[i])
    )
  })

  const updateItem = (index: number, updated: Record<string, unknown>) => {
    props.onChange(items().map((item, i) => (i === index ? updated : item)))
  }

  return (
    <div class="w-full">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-semibold opacity-50 uppercase tracking-wider">
          {props.field.label}
        </span>
        <span class="badge badge-ghost badge-xs font-mono">
          fixed {props.field.length}
        </span>
      </div>

      <div class="flex flex-col gap-3">
        <For each={items()}>
          {(item, index) => (
            <div class="rounded-box border border-base-content/10 bg-base-200/60 p-3">
              <p class="text-xs opacity-40 mb-2">#{index() + 1}</p>
              <div class="flex flex-col gap-2">
                <For each={props.field.itemFields}>
                  {(subField) => (
                    <FieldRenderer
                      field={subField}
                      data={item}
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

export { TupleInput }
