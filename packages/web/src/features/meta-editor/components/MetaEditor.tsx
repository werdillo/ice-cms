import { type Component } from 'solid-js'
import { SchemaForm, schemaToFields } from '../../schema-form'
import { metaSchema } from '@ice-cms/schemas'
import { useMetaEditor } from '../hooks/useMetaEditor'
import type { PageMeta } from '../types'

type MetaEditorProps = {
  initialData: Partial<PageMeta>
  onChange: (data: PageMeta) => void
}

// Compute fields once at module level — they never change
const allFields = schemaToFields(metaSchema)
const basicFields = allFields.filter((field) =>
  ['title', 'description', 'keywords'].includes(field.key)
)
const advancedFields = allFields.filter((field) =>
  ['ogTitle', 'ogDescription', 'ogImage', 'canonicalUrl', 'robots'].includes(field.key)
)

export const MetaEditor: Component<MetaEditorProps> = (props) => {
  const { localData, isDirty, isValid, handleChange, handleSave, handleReset } = useMetaEditor({
    initialData: props.initialData,
    onChange: props.onChange,
  })

  // Merge the whole updated object in one setLocalData call instead of
  // iterating Object.entries and calling handleChange per key
  const handleBasicChange = (updated: Record<string, unknown>) => {
    handleChange(updated as Partial<PageMeta>)
  }

  const handleAdvancedChange = (updated: Record<string, unknown>) => {
    handleChange(updated as Partial<PageMeta>)
  }

  return (
    <div class="max-w-5xl p-6 bg-base-100 rounded-lg">
      <h2 class="text-2xl font-bold mb-6">Edit Page Metadata</h2>

      <div class="grid grid-cols-1 w-full md:grid-cols-2 gap-6">
        {/* Basic Fields */}
        <div>
          <h3 class="text-lg font-semibold mb-4">Basic</h3>
          <SchemaForm
            fields={basicFields}
            data={localData()}
            onChange={handleBasicChange}
          />
        </div>

        {/* Advanced Fields */}
        <div>
          <h3 class="text-lg font-semibold mb-4">Advanced</h3>
          <SchemaForm
            fields={advancedFields}
            data={localData()}
            onChange={handleAdvancedChange}
          />
        </div>
      </div>

      <div class="flex gap-4 mt-6">
        <button
          type="button"
          class="btn btn-primary"
          disabled={!isDirty() || !isValid()}
          onClick={handleSave}
        >
          Save Changes
        </button>
        <button
          type="button"
          class="btn btn-ghost"
          disabled={!isDirty()}
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default MetaEditor
