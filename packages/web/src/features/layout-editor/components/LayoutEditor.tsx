import { type Component, For } from 'solid-js'
import { LANGS } from '@ice-cms/schemas'
import { SchemaForm } from '../../schema-form'
import { useLayoutEditor } from '../hooks/useLayoutEditor'
import { layoutEditorFields } from '../services/layout-editor.schemas'
import type { PageLayout } from '../types'
import type { LayoutByLang } from '../services/layout-editor.validation'

type LayoutEditorProps = {
  initialData: LayoutByLang
  onChange: (data: Partial<Record<(typeof LANGS)[number], PageLayout>>) => void
}

export const LayoutEditor: Component<LayoutEditorProps> = (props) => {
  const {
    activeLang,
    setActiveLang,
    currentData,
    isValid,
    handleHeaderChange,
    handleFooterChange,
    handleSidebarChange,
    handleSave,
    handleReset,
  } = useLayoutEditor(props)

  return (
    <div class="max-w-6xl p-6 bg-base-100 rounded-lg shadow-lg">
      <div class="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 class="text-2xl font-bold">Edit Layout</h2>
          <p class="text-sm opacity-60 mt-1">
            Configure header, footer, and sidebar for each language.
          </p>
        </div>

        <div class="flex gap-1 border border-base-content/10 rounded-lg p-1">
          <For each={LANGS}>
            {(lang) => (
              <button
                type="button"
                class={`px-4 py-2 text-xs font-mono font-semibold uppercase rounded-md transition-colors ${
                  activeLang() === lang
                    ? 'bg-primary text-primary-content'
                    : 'hover:bg-base-200 opacity-70'
                }`}
                onClick={() => setActiveLang(lang)}
              >
                {lang}
              </button>
            )}
          </For>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6">
        <section class="rounded-box border border-base-content/10 p-4">
          <h3 class="text-lg font-semibold mb-4">
            Header
            <span class="ml-2 text-xs font-mono uppercase opacity-40">
              {activeLang()}
            </span>
          </h3>
          <SchemaForm
            fields={layoutEditorFields.header}
            data={(currentData().header as Record<string, unknown>) ?? {}}
            onChange={handleHeaderChange}
          />
        </section>

        <section class="rounded-box border border-base-content/10 p-4">
          <h3 class="text-lg font-semibold mb-4">
            Footer
            <span class="ml-2 text-xs font-mono uppercase opacity-40">
              {activeLang()}
            </span>
          </h3>
          <SchemaForm
            fields={layoutEditorFields.footer}
            data={(currentData().footer as Record<string, unknown>) ?? {}}
            onChange={handleFooterChange}
          />
        </section>

        <section class="rounded-box border border-base-content/10 p-4">
          <h3 class="text-lg font-semibold mb-4">
            Sidebar
            <span class="ml-2 text-xs font-mono uppercase opacity-40">
              {activeLang()}
            </span>
          </h3>
          <SchemaForm
            fields={layoutEditorFields.sidebar}
            data={(currentData().sidebar as Record<string, unknown>) ?? {}}
            onChange={handleSidebarChange}
          />
        </section>
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

export default LayoutEditor
