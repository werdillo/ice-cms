import { type Component, createEffect } from 'solid-js'
import type { NumberField } from '../../types'

const NumberInput: Component<{
  field: NumberField
  value: number
  onInput: (v: number) => void
}> = (props) => {
  let ref!: HTMLInputElement

  createEffect(() => {
    const ext = String(props.value ?? props.field.defaultValue ?? '')
    if (ref.value !== ext) ref.value = ext
  })

  return (
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text text-xs font-medium opacity-70">{props.field.label}</span>
      </label>
      <input
        ref={ref}
        type="number"
        class="input input-sm input-bordered w-full"
        onInput={(e) => props.onInput(Number(e.currentTarget.value))}
      />
    </div>
  )
}

export { NumberInput }
