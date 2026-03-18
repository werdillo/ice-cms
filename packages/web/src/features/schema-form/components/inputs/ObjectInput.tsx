import { type Component, For, createMemo } from 'solid-js'
import type { ObjectField } from '../../types'
import { FieldRenderer } from '../FieldRenderer'

const ObjectInput: Component<{
  field: ObjectField
  value: Record<string, unknown>
  onChange: (v: Record<string, unknown>) => void
}> = (props) => {
  const value = createMemo(() => props.value ?? {})

  return (
    <div class="rounded-box border border-base-content/10 bg-base-200/40 p-3 w-full">
      <p class="text-xs font-semibold opacity-50 mb-2 uppercase tracking-wider">
        {props.field.label}
      </p>
      <div class="flex flex-col gap-2">
        <For each={props.field.fields}>
          {(subField) => (
            <FieldRenderer
              field={subField}
              data={value()}
              onChange={(updated) => props.onChange(updated)}
            />
          )}
        </For>
      </div>
    </div>
  )
}

export { ObjectInput }
