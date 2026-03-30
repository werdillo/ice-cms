import { type Component } from 'solid-js'
import { ImageUpload, type ImageValue } from '../../../../features/image-upload'
import type { ImageField } from '../../types'

type ImageInputProps = {
  field: ImageField
  value: () => ImageValue
  onChange: (v: ImageValue) => void
}

export const ImageInput: Component<ImageInputProps> = (props) => {
  return (
    <ImageUpload
      label={props.field.label}
      value={props.value()}
      onChange={props.onChange}
    />
  )
}

export default ImageInput
