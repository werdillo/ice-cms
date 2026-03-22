import { type Component, For, createMemo } from 'solid-js'
import { LANGS } from '@ice-cms/schemas'
import { SchemaForm } from '../../schema-form'
import { CollapsibleSection } from '../../../components/CollapsibleSection'
import { useLayoutEditor } from '../hooks/useLayoutEditor'
import { layoutEditorFields } from '../services/layout-editor.schemas'
import type { LayoutSectionsByLang } from '../hooks/useLayoutEditor'
import type { Lang } from '@ice-cms/schemas'

type LayoutEditorProps = {
  initialData: LayoutSectionsByLang
  onChange: (data: LayoutSectionsByLang) => void
}

// Defined outside to avoid recreation on every parent render
const LangBadge: Component<{ lang: () => Lang }> = (props) => (
  <span class="ml-2 text-xs font-mono uppercase opacity-40">
    {props.lang()}
  </span>
)

export const LayoutEditor: Component<LayoutEditorProps> = (props) => {
  const {
    activeLang,
    setActiveLang,
    localData,
    isValid,
    isDirty,
    handleHeaderChange,
    handleFooterChange,
    handleSidebarChange,
    handleSave,
    handleReset,
  } = useLayoutEditor(props)

  // Granular memos per section — only the changed section re-renders,
  // not the entire form tree
  const headerData = createMemo(
    () => (localData().header[activeLang()] as Record<string, unknown>) ?? {}
  )
  const footerData = createMemo(
    () => (localData().footer[activeLang()] as Record<string, unknown>) ?? {}
  )
  const sidebarData = createMemo(
    () => (localData().sidebar[activeLang()] as Record<string, unknown>) ?? {}
  )

  return (
    <div class="max-w-6xl p-6 bg-base-100 rounded-lg">
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

      <div class="grid grid-cols-1 gap-4">
        <CollapsibleSection
          title={<>Header <LangBadge lang={activeLang} /></>}
          titleClass="text-base font-semibold"
          defaultOpen={true}
        >
          <SchemaForm
            fields={layoutEditorFields.header}
            data={headerData()}
            onChange={handleHeaderChange}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title={<>Footer <LangBadge lang={activeLang} /></>}
          titleClass="text-base font-semibold"
          defaultOpen={true}
        >
          <SchemaForm
            fields={layoutEditorFields.footer}
            data={footerData()}
            onChange={handleFooterChange}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title={<>Sidebar <LangBadge lang={activeLang} /></>}
          titleClass="text-base font-semibold"
          defaultOpen={true}
        >
          <SchemaForm
            fields={layoutEditorFields.sidebar}
            data={sidebarData()}
            onChange={handleSidebarChange}
          />
        </CollapsibleSection>
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

export default LayoutEditor
