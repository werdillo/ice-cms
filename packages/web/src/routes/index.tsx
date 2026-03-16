import { createFileRoute } from '@tanstack/solid-router'
import { createSignal } from 'solid-js'
import BlockEditor from '../components/block-editor/BlockEditor'
import { faqSectionMeta } from '@ice-cms/schemas'
import type { Lang } from '@ice-cms/schemas'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [data, setData] = createSignal<Partial<Record<Lang, Record<string, unknown>>>>({
    lv: faqSectionMeta.defaultData() as unknown as Record<string, unknown>,
    en: faqSectionMeta.defaultData() as unknown as Record<string, unknown>,
    ru: faqSectionMeta.defaultData() as unknown as Record<string, unknown>,
  })
  const [enabled, setEnabled] = createSignal(true)

  return (
    <div class="min-h-screen bg-base-200 p-8">
      <div class="max-w-3xl mx-auto flex flex-col gap-6">

        {/* Page header */}
        <div>
          <h1 class="text-2xl font-bold">Page Editor</h1>
          <p class="text-sm opacity-50 mt-1">
            Click <span class="font-semibold">Edit</span> to open the block editor. Switch languages with the tabs inside.
          </p>
        </div>

        {/* Blocks list */}
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-widest opacity-40">
              Blocks
            </span>
          </div>

          <BlockEditor
            meta={faqSectionMeta}
            data={data()}
            enabled={enabled()}
            order={0}
            onChange={setData}
            onToggle={setEnabled}
          />
        </div>

        {/* JSON preview */}
        <div class="collapse collapse-arrow border border-base-content/10 bg-base-100 rounded-box">
          <input type="checkbox" />
          <div class="collapse-title text-sm font-semibold opacity-60">
            JSON Preview
          </div>
          <div class="collapse-content">
            <pre class="text-xs overflow-x-auto bg-base-200 rounded-box p-4">
              {JSON.stringify({ enabled: enabled(), data: data() }, null, 2)}
            </pre>
          </div>
        </div>

      </div>
    </div>
  )
}
