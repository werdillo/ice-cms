import { type Component, Index } from 'solid-js'
import type { TupleField } from '../../types'
import { FieldRenderer } from '../FieldRenderer'

const TupleInput: Component<{
  field: TupleField
  value: () => Record<string, unknown>[]
  onChange: (v: Record<string, unknown>[]) => void
}> = (props) => {
  const items = () => {
    const val = props.value()
    return Array.from({ length: props.field.length }, (_, i) =>
      val[i] ?? structuredClone(props.field.defaultItems[i])
    )
  }

  const updateItem = (index: number, key: string, value: unknown) => {
    const next = items().map((item, i) => {
      if (i !== index) return item
      const copy = { ...item }
      const parts = key.split('.')
      let cur: Record<string, unknown> = copy
      for (let p = 0; p < parts.length - 1; p++) {
        const k = parts[p]
        cur[k] = cur[k] && typeof cur[k] === 'object' ? { ...(cur[k] as Record<string, unknown>) } : {}
        cur = cur[k] as Record<string, unknown>
      }
      cur[parts[parts.length - 1]] = value
      return copy
    })
    props.onChange(next)
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
        <Index each={items()}>
          {(item, index) => (
            <div class="rounded-box border border-base-content/10 bg-base-200/60 p-3">
              <p class="text-xs opacity-40 mb-2">#{index + 1}</p>
              <div class="flex flex-col gap-2">
                <Index each={props.field.itemFields}>
                  {(subField) => (
                    <FieldRenderer
                      field={subField()}
                      store={item()}
                      onFieldChange={(key, value) => updateItem(index, key, value)}
                    />
                  )}
                </Index>
              </div>
            </div>
          )}
        </Index>
      </div>
    </div>
  )
}

export { TupleInput }
