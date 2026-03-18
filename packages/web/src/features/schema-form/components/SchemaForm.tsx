import { type Component, For } from 'solid-js'
import type { FieldDescriptor } from '../types'
import { FieldRenderer } from './FieldRenderer'

// --- Props ---
export type SchemaFormProps = {
  fields: FieldDescriptor[]
  data: Record<string, unknown>
  onChange: (updated: Record<string, unknown>) => void
  path?: string
}

// --- Root SchemaForm ---
export const SchemaForm: Component<SchemaFormProps> = (props) => {
  return (
    <div class="flex flex-col gap-3 w-full">
      <For each={props.fields}>
        {(field) => (
          <FieldRenderer
            field={field}
            data={props.data}
            onChange={props.onChange}
          />
        )}
      </For>
    </div>
  )
}
