import { type Component } from 'solid-js'
import type { NumberField } from '../../types'

const NumberInput: Component<{
  field: NumberField
  value: () => number
  onInput: (v: number) => void
}> = (props) => {
  return (
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text text-xs font-medium opacity-70">{props.field.label}</span>
      </label>
      <input
        type="number"
        class="input input-sm input-bordered w-full"
        value={props.value()}
        onInput={(e) => props.onInput(Number(e.currentTarget.value))}
      />
    </div>
  )
}

export { NumberInput }
