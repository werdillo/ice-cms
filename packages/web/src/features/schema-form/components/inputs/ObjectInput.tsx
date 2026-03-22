import { type Component, Index } from 'solid-js'
import type { ObjectField } from '../../types'
import { FieldRenderer } from '../FieldRenderer'

const ObjectInput: Component<{
  field: ObjectField
  store: () => Record<string, unknown>
  onFieldChange: (key: string, value: unknown) => void
}> = (props) => {
  return (
    <div class="rounded-box border border-base-content/10 bg-base-200/40 p-3 w-full">
      <p class="text-xs font-semibold opacity-50 mb-2 uppercase tracking-wider">
        {props.field.label}
      </p>
      <div class="flex flex-col gap-2">
        <Index each={props.field.fields}>
          {(subField) => (
            <FieldRenderer
              field={subField()}
              store={props.store()}
              onFieldChange={props.onFieldChange}
            />
          )}
        </Index>
      </div>
    </div>
  )
}

export { ObjectInput }
