import { type Component } from 'solid-js'
import type { StringField } from '../../types'

const StringInput: Component<{
  field: StringField
  value: () => string
  onInput: (v: string) => void
}> = (props) => {
  return (
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text text-xs font-medium opacity-70">{props.field.label}</span>
      </label>
      <input
        type="text"
        class="input input-sm input-bordered w-full"
        value={props.value()}
        onInput={(e) => props.onInput(e.currentTarget.value)}
      />
    </div>
  )
}

export { StringInput }
