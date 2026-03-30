import { type Component, Index, createEffect, untrack } from 'solid-js'
import { createStore, reconcile, produce, unwrap } from 'solid-js/store'
import type { FieldDescriptor } from '../types'
import { FieldRenderer } from './FieldRenderer'

export type SchemaFormProps = {
  fields: FieldDescriptor[]
  data: Record<string, unknown>
  onChange: (updated: Record<string, unknown>) => void
}

// Internal store-backed form — updates are granular per field key,
// no full object replacement on every keystroke.
export const SchemaForm: Component<SchemaFormProps> = (props) => {
  const [store, setStore] = createStore<Record<string, unknown>>(
    untrack(() => ({ ...props.data }))
  )

  // Sync incoming data changes (e.g. lang switch, reset) into the store.
  // reconcile() does a structural diff and only patches what actually changed,
  // so existing field DOM nodes are NOT recreated.
  createEffect(() => {
    const incoming = props.data
    setStore(reconcile(incoming, { merge: true }))
  })

  const handleFieldChange = (key: string, value: unknown) => {
    setStore(produce((s) => {
      // Support dotted paths like "logo.href"
      const parts = key.split('.')
      let cur: Record<string, unknown> = s
      for (let i = 0; i < parts.length - 1; i++) {
        const k = parts[i]
        if (!cur[k] || typeof cur[k] !== 'object') cur[k] = {}
        cur = cur[k] as Record<string, unknown>
      }
      cur[parts[parts.length - 1]] = value
    }))
    // Notify parent with a deep plain-object snapshot.
    // { ...store } would give shallow store-proxy references — if the store is
    // later mutated (e.g. by a language switch reconcile), those proxies would
    // reflect the new values and silently corrupt saved state for other langs.
    // unwrap() strips the proxy layer; structuredClone() deep-copies the result.
    props.onChange(structuredClone(unwrap(store)))
  }

  return (
    <div class="flex flex-col gap-3 w-full">
      <Index each={props.fields}>
        {(field) => (
          <FieldRenderer
            field={field()}
            store={store}
            onFieldChange={handleFieldChange}
          />
        )}
      </Index>
    </div>
  )
}
