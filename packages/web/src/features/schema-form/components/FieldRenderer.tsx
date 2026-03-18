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
} from '../types'
import { StringInput } from './inputs/StringInput'
import { NumberInput } from './inputs/NumberInput'
import { BooleanInput } from './inputs/BooleanInput'
import { SelectInput } from './inputs/SelectInput'
import { ObjectInput } from './inputs/ObjectInput'
import { ArrayInput } from './inputs/ArrayInput'
import { TupleInput } from './inputs/TupleInput'

// --- Path helpers ---
function getByPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && !Array.isArray(acc)) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

function setByPath(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  const keys = path.split('.')
  const result = structuredClone(obj)
  let cur: Record<string, unknown> = result
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]
    if (!cur[k] || typeof cur[k] !== 'object') cur[k] = {}
    cur = cur[k] as Record<string, unknown>
  }
  cur[keys[keys.length - 1]] = value
  return result
}

export const FieldRenderer: Component<{
  field: FieldDescriptor
  data: Record<string, unknown>
  onChange: (updated: Record<string, unknown>) => void
}> = (props) => {
  const update = (key: string, value: unknown) => {
    props.onChange(setByPath(props.data, key, value))
  }

  return (
    <Switch>
      <Match when={props.field.kind === 'string'}>
        <StringInput
          field={props.field as StringField}
          value={getByPath(props.data, props.field.key) as string}
          onInput={(v) => update(props.field.key, v)}
        />
      </Match>
      <Match when={props.field.kind === 'number'}>
        <NumberInput
          field={props.field as NumberField}
          value={getByPath(props.data, props.field.key) as number}
          onInput={(v) => update(props.field.key, v)}
        />
      </Match>
      <Match when={props.field.kind === 'boolean'}>
        <BooleanInput
          field={props.field as BooleanField}
          value={getByPath(props.data, props.field.key) as boolean}
          onChange={(v) => update(props.field.key, v)}
        />
      </Match>
      <Match when={props.field.kind === 'select'}>
        <SelectInput
          field={props.field as SelectField}
          value={getByPath(props.data, props.field.key) as string}
          onChange={(v) => update(props.field.key, v)}
        />
      </Match>
      <Match when={props.field.kind === 'object'}>
        <ObjectInput
          field={props.field as ObjectField}
          value={getByPath(props.data, props.field.key) as Record<string, unknown>}
          onChange={(v) => update(props.field.key, v)}
        />
      </Match>
      <Match when={props.field.kind === 'array'}>
        <ArrayInput
          field={props.field as ArrayField}
          value={getByPath(props.data, props.field.key) as Record<string, unknown>[]}
          onChange={(v) => update(props.field.key, v)}
        />
      </Match>
      <Match when={props.field.kind === 'tuple'}>
        <TupleInput
          field={props.field as TupleField}
          value={getByPath(props.data, props.field.key) as Record<string, unknown>[]}
          onChange={(v) => update(props.field.key, v)}
        />
      </Match>
    </Switch>
  )
}
