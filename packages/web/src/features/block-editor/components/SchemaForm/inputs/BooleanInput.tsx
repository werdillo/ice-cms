import { type Component } from 'solid-js'
import type { BooleanField } from '../../../types'

const BooleanInput: Component<{
  field: BooleanField
  value: boolean
  onChange: (v: boolean) => void
}> = (props) => (
  <div class="form-control">
    <label class="label cursor-pointer gap-3 justify-start">
      <input
        type="checkbox"
        class="toggle toggle-sm toggle-primary"
        checked={props.value ?? props.field.defaultValue}
        onChange={(e) => props.onChange(e.currentTarget.checked)}
      />
      <span class="label-text text-xs font-medium opacity-70">{props.field.label}</span>
    </label>
  </div>
)

export { BooleanInput }
