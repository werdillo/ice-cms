import { type Component, Switch, Match } from 'solid-js'
import type {
  FieldDescriptor,
  StringField,
  NumberField,
  BooleanField,
  SelectField,
  ObjectField,
  ArrayField,
  TupleField,
  ImageField,
  ImageArrayField,
} from '../types'
import { StringInput } from './inputs/StringInput'
import { NumberInput } from './inputs/NumberInput'
import { BooleanInput } from './inputs/BooleanInput'
import { SelectInput } from './inputs/SelectInput'
import { ObjectInput } from './inputs/ObjectInput'
import { ArrayInput } from './inputs/ArrayInput'
import { TupleInput } from './inputs/TupleInput'
import { ImageInput } from './inputs/ImageInput'
import { ImageArrayInput } from './inputs/ImageArrayInput'
import type { ImageValue } from '../../../features/image-upload'

export type FieldRendererProps = {
  field: FieldDescriptor
  // The store (or sub-store object) containing values for this level
  store: Record<string, unknown>
  // Called with the field key and new value — no full object bubbling
  onFieldChange: (key: string, value: unknown) => void
}

export const FieldRenderer: Component<FieldRendererProps> = (props) => {
  const key = () => props.field.key

  return (
    <Switch>
      <Match when={props.field.kind === 'string'}>
        <StringInput
          field={props.field as StringField}
          value={() => (props.store[key()] as string) ?? (props.field as StringField).defaultValue ?? ''}
          onInput={(v) => props.onFieldChange(key(), v)}
        />
      </Match>

      <Match when={props.field.kind === 'number'}>
        <NumberInput
          field={props.field as NumberField}
          value={() => (props.store[key()] as number) ?? (props.field as NumberField).defaultValue ?? 0}
          onInput={(v) => props.onFieldChange(key(), v)}
        />
      </Match>

      <Match when={props.field.kind === 'boolean'}>
        <BooleanInput
          field={props.field as BooleanField}
          value={() => (props.store[key()] as boolean) ?? (props.field as BooleanField).defaultValue ?? false}
          onChange={(v) => props.onFieldChange(key(), v)}
        />
      </Match>

      <Match when={props.field.kind === 'select'}>
        <SelectInput
          field={props.field as SelectField}
          value={() => (props.store[key()] as string) ?? (props.field as SelectField).defaultValue ?? ''}
          onChange={(v) => props.onFieldChange(key(), v)}
        />
      </Match>

      <Match when={props.field.kind === 'object'}>
        <ObjectInput
          field={props.field as ObjectField}
          // Pass the sub-object from the store directly — ObjectInput owns its slice
          store={() => (props.store[key()] as Record<string, unknown>) ?? {}}
          onFieldChange={(subKey, value) => props.onFieldChange(`${key()}.${subKey}`, value)}
        />
      </Match>

      <Match when={props.field.kind === 'array'}>
        <ArrayInput
          field={props.field as ArrayField}
          value={() => (props.store[key()] as Record<string, unknown>[]) ?? []}
          onChange={(v) => props.onFieldChange(key(), v)}
        />
      </Match>

      <Match when={props.field.kind === 'tuple'}>
        <TupleInput
          field={props.field as TupleField}
          value={() => (props.store[key()] as Record<string, unknown>[]) ?? []}
          onChange={(v) => props.onFieldChange(key(), v)}
        />
      </Match>

      <Match when={props.field.kind === 'image'}>
        <ImageInput
          field={props.field as ImageField}
          value={() => (props.store[key()] as ImageValue) ?? { src: '', alt: '' }}
          onChange={(v) => props.onFieldChange(key(), v)}
        />
      </Match>

      <Match when={props.field.kind === 'image-array'}>
        <ImageArrayInput
          field={props.field as ImageArrayField}
          value={() => (props.store[key()] as ImageValue[]) ?? []}
          onChange={(v) => props.onFieldChange(key(), v)}
        />
      </Match>
    </Switch>
  )
}
