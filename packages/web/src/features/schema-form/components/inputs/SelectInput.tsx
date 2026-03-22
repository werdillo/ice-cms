import { type Component, For } from 'solid-js'
import type { SelectField } from '../../types'

const SelectInput: Component<{
  field: SelectField
  value: () => string
  onChange: (v: string) => void
}> = (props) => (
  <div class="form-control w-full">
    <label class="label">
      <span class="label-text text-xs font-medium opacity-70">{props.field.label}</span>
    </label>
    <select
      class="select select-sm select-bordered w-full"
      value={props.value()}
      onChange={(e) => props.onChange(e.currentTarget.value)}
    >
      <For each={props.field.options}>
        {(opt) => <option value={opt}>{opt}</option>}
      </For>
    </select>
  </div>
)

export { SelectInput }
