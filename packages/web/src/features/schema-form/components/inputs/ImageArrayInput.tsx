import { type Component, Index } from 'solid-js'
import type { ImageArrayField } from '../../types'
import type { ImageValue } from '../../../image-upload'
import { ImageUpload } from '../../../image-upload'

const ImageArrayInput: Component<{
  field: ImageArrayField
  value: () => ImageValue[]
  onChange: (v: ImageValue[]) => void
}> = (props) => {
  const items = () => props.value() ?? []

  const addItem = () => {
    props.onChange([...items(), { src: '', alt: '' }])
  }

  const removeItem = (index: number) => {
    props.onChange(items().filter((_, i) => i !== index))
  }

  const updateItem = (index: number, updated: ImageValue) => {
    props.onChange(items().map((item, i) => (i === index ? updated : item)))
  }

  return (
    <div class="w-full">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-semibold opacity-50 uppercase tracking-wider">
          {props.field.label}
        </span>
        <button type="button" class="btn btn-xs btn-outline btn-primary" onClick={addItem}>
          + Add image
        </button>
      </div>

      <div class="flex flex-col gap-3">
        <Index each={items()}>
          {(item, index) => (
            <div class="rounded-box border border-base-content/10 bg-base-200/60 p-3 relative">
              <button
                type="button"
                class="btn btn-xs btn-ghost btn-circle absolute top-2 right-2 text-error"
                onClick={() => removeItem(index)}
                title="Remove"
              >
                ✕
              </button>
              <p class="text-xs opacity-40 mb-2">#{index + 1}</p>
              <ImageUpload
                value={item()}
                onChange={(updated) => updateItem(index, updated)}
              />
            </div>
          )}
        </Index>
      </div>
    </div>
  )
}

export { ImageArrayInput }
