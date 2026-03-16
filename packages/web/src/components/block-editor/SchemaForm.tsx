import { type Component, For, Switch, Match, createMemo } from 'solid-js'
import type {
  FieldDescriptor,
  StringField,
  NumberField,
  BooleanField,
  SelectField,
  ObjectField,
  ArrayField,
  TupleField,
} from '../../lib/schema-to-fields'


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

// --- Props ---
type SchemaFormProps = {
  fields: FieldDescriptor[]
  data: Record<string, unknown>
  onChange: (updated: Record<string, unknown>) => void
  path?: string
}

// --- Individual field renderers ---

const StringInput: Component<{
  field: StringField
  value: string
  onInput: (v: string) => void
}> = (props) => (
  <div class="form-control w-full">
    <label class="label">
      <span class="label-text text-xs font-medium opacity-70">{props.field.label}</span>
    </label>
    <input
      type="text"
      class="input input-sm input-bordered w-full"
      value={props.value ?? props.field.defaultValue}
      onInput={(e) => props.onInput(e.currentTarget.value)}
    />
  </div>
)

const NumberInput: Component<{
  field: NumberField
  value: number
  onInput: (v: number) => void
}> = (props) => (
  <div class="form-control w-full">
    <label class="label">
      <span class="label-text text-xs font-medium opacity-70">{props.field.label}</span>
    </label>
    <input
      type="number"
      class="input input-sm input-bordered w-full"
      value={props.value ?? props.field.defaultValue}
      onInput={(e) => props.onInput(Number(e.currentTarget.value))}
    />
  </div>
)

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

const SelectInput: Component<{
  field: SelectField
  value: string
  onChange: (v: string) => void
}> = (props) => (
  <div class="form-control w-full">
    <label class="label">
      <span class="label-text text-xs font-medium opacity-70">{props.field.label}</span>
    </label>
    <select
      class="select select-sm select-bordered w-full"
      value={props.value ?? props.field.defaultValue}
      onChange={(e) => props.onChange(e.currentTarget.value)}
    >
      <For each={props.field.options}>
        {(opt) => <option value={opt}>{opt}</option>}
      </For>
    </select>
  </div>
)

// --- Object field ---
const ObjectInput: Component<{
  field: ObjectField
  value: Record<string, unknown>
  onChange: (v: Record<string, unknown>) => void
}> = (props) => {
  const value = createMemo(() => props.value ?? {})

  return (
    <div class="rounded-box border border-base-content/10 bg-base-200/40 p-3 w-full">
      <p class="text-xs font-semibold opacity-50 mb-2 uppercase tracking-wider">
        {props.field.label}
      </p>
      <div class="flex flex-col gap-2">
        <For each={props.field.fields}>
          {(subField) => (
            <FieldRenderer
              field={subField}
              data={value()}
              onChange={(updated) => props.onChange(updated)}
            />
          )}
        </For>
      </div>
    </div>
  )
}

// --- Array field ---
const ArrayInput: Component<{
  field: ArrayField
  value: Record<string, unknown>[]
  onChange: (v: Record<string, unknown>[]) => void
}> = (props) => {
  const items = createMemo(() =>
    Array.isArray(props.value) ? props.value : []
  )

  const addItem = () => {
    props.onChange([...items(), structuredClone(props.field.defaultItem)])
  }

  const removeItem = (index: number) => {
    props.onChange(items().filter((_, i) => i !== index))
  }

  const updateItem = (index: number, updated: Record<string, unknown>) => {
    const next = items().map((item, i) => (i === index ? updated : item))
    props.onChange(next)
  }

  return (
    <div class="w-full">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-semibold opacity-50 uppercase tracking-wider">
          {props.field.label}
        </span>
        <button type="button" class="btn btn-xs btn-outline btn-primary" onClick={addItem}>
          + Add
        </button>
      </div>

      <div class="flex flex-col gap-3">
        <For each={items()}>
          {(item, index) => (
            <div class="rounded-box border border-base-content/10 bg-base-200/60 p-3 relative">
              <button
                type="button"
                class="btn btn-xs btn-ghost btn-circle absolute top-2 right-2 text-error"
                onClick={() => removeItem(index())}
                title="Remove"
              >
                ✕
              </button>
              <p class="text-xs opacity-40 mb-2">#{index() + 1}</p>
              <div class="flex flex-col gap-2">
                <For each={props.field.itemFields}>
                  {(subField) => (
                    <FieldRenderer
                      field={subField}
                      data={item as Record<string, unknown>}
                      onChange={(updated) => updateItem(index(), updated)}
                    />
                  )}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}

// --- Tuple field (fixed-length, no add/remove) ---
const TupleInput: Component<{
  field: TupleField
  value: Record<string, unknown>[]
  onChange: (v: Record<string, unknown>[]) => void
}> = (props) => {
  const items = createMemo(() => {
    const val = Array.isArray(props.value) ? props.value : []
    // Ensure correct length using defaultItems as fallback
    return Array.from({ length: props.field.length }, (_, i) =>
      val[i] ?? structuredClone(props.field.defaultItems[i])
    )
  })

  const updateItem = (index: number, updated: Record<string, unknown>) => {
    props.onChange(items().map((item, i) => (i === index ? updated : item)))
  }

  return (
    <div class="w-full">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-semibold opacity-50 uppercase tracking-wider">
          {props.field.label}
        </span>
        <span class="badge badge-ghost badge-xs font-mono">
          fixed {props.field.length}
        </span>
      </div>

      <div class="flex flex-col gap-3">
        <For each={items()}>
          {(item, index) => (
            <div class="rounded-box border border-base-content/10 bg-base-200/60 p-3">
              <p class="text-xs opacity-40 mb-2">#{index() + 1}</p>
              <div class="flex flex-col gap-2">
                <For each={props.field.itemFields}>
                  {(subField) => (
                    <FieldRenderer
                      field={subField}
                      data={item}
                      onChange={(updated) => updateItem(index(), updated)}
                    />
                  )}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}

// --- Field dispatcher ---
const FieldRenderer: Component<{
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

// --- Root SchemaForm ---
const SchemaForm: Component<SchemaFormProps> = (props) => {
  return (
    <div class="flex flex-col gap-3 w-full">
      <For each={props.fields}>
        {(field) => (
          <FieldRenderer
            field={field}
            data={props.data}
            onChange={props.onChange}
          />
        )}
      </For>
    </div>
  )
}

export default SchemaForm
