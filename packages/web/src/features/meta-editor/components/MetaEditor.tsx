import { type Component } from 'solid-js'
import { SchemaForm, schemaToFields } from '../../schema-form'
import { metaSchema } from '@ice-cms/schemas'
import { useMetaEditor } from '../hooks/useMetaEditor'
import type { PageMeta } from '../types'

type MetaEditorProps = {
  initialData: Partial<PageMeta>
  onChange: (data: PageMeta) => void
}

export const MetaEditor: Component<MetaEditorProps> = (props) => {
  const { localData, isValid, handleChange, handleSave, handleReset } = useMetaEditor({
    initialData: props.initialData,
    onChange: props.onChange,
  })

  const basicFields = schemaToFields(metaSchema).filter(field =>
    ['title', 'description', 'keywords'].includes(field.key)
  )

  const advancedFields = schemaToFields(metaSchema).filter(field =>
    ['ogTitle', 'ogDescription', 'ogImage', 'canonicalUrl', 'robots'].includes(field.key)
  )

  return (
    <div class="max-w-5xl p-6 bg-base-100 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6">Edit Page Metadata</h2>

      <div class="grid grid-cols-1 w-full md:grid-cols-2 gap-6">
        {/* Basic Fields */}
        <div>
          <h3 class="text-lg font-semibold mb-4">Basic</h3>
          <SchemaForm
            fields={basicFields}
            data={localData()}
            onChange={(updated) => {
              Object.entries(updated).forEach(([key, value]) => {
                handleChange(key as keyof PageMeta, value)
              })
            }}
          />
        </div>

        {/* Advanced Fields */}
        <div>
          <h3 class="text-lg font-semibold mb-4">Advanced</h3>
          <SchemaForm
            fields={advancedFields}
            data={localData()}
            onChange={(updated) => {
              Object.entries(updated).forEach(([key, value]) => {
                handleChange(key as keyof PageMeta, value)
              })
            }}
          />
        </div>
      </div>

      <div class="flex gap-4 mt-6">
        <button
          type="button"
          class="btn btn-primary"
          disabled={!isValid()}
          onClick={handleSave}
        >
          Save Changes
        </button>
        <button
          type="button"
          class="btn btn-ghost"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default MetaEditor
