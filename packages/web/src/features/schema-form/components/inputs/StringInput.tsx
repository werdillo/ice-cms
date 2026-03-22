import { type Component, createEffect } from 'solid-js'
import type { StringField } from '../../types'

const StringInput: Component<{
  field: StringField
  value: string
  onInput: (v: string) => void
}> = (props) => {
  let ref!: HTMLInputElement

  createEffect(() => {
    const ext = props.value ?? props.field.defaultValue ?? ''
    if (ref.value !== ext) ref.value = ext
  })

  return (
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text text-xs font-medium opacity-70">{props.field.label}</span>
      </label>
      <input
        ref={ref}
        type="text"
        class="input input-sm input-bordered w-full"
        onInput={(e) => props.onInput(e.currentTarget.value)}
      />
    </div>
  )
}

export { StringInput }
