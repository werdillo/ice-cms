import { type Component, Index } from 'solid-js'
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
// Using Index instead of For so that field components are NOT recreated
// when only the data changes — only the data accessor is updated in place.
export const SchemaForm: Component<SchemaFormProps> = (props) => {
  return (
    <div class="flex flex-col gap-3 w-full">
      <Index each={props.fields}>
        {(field) => (
          <FieldRenderer
            field={field()}
            data={props.data}
            onChange={props.onChange}
          />
        )}
      </Index>
    </div>
  )
}
