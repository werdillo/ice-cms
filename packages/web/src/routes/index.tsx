import { createFileRoute } from '@tanstack/solid-router'
import { createSignal } from 'solid-js'
import {
  SortableBlockList,
  type BlockState,
} from '../features/block-editor'
import {
  faqSectionMeta,
  solutionSectionMeta,
  bookCallMeta,
  benefitsSectionMeta,
  featureSectionMeta,
  gallerySectionMeta,
  mainSectionMeta,
  contactSectionMeta,
  servicesSectionMeta,
  type Lang,
  type PageData,
  type Layout,
  type RegisteredBlockType,
} from '@ice-cms/schemas'
import { makeDefaultLayouts } from '../features/layout-editor/services'
import { MetaEditor } from '../features/meta-editor/components'
import { type PageMeta } from '../features/meta-editor'
import { LayoutEditor } from '../features/layout-editor/components/LayoutEditor'

export const Route = createFileRoute('/')({ component: App })

function makeBlock(
  meta: BlockState['meta'],
  index: number
): BlockState {
  return {
    id: `${meta.type}-${index}`,
    meta,
    data: {
      lv: meta.defaultData() as unknown as Record<string, unknown>,
      en: meta.defaultData() as unknown as Record<string, unknown>,
      ru: meta.defaultData() as unknown as Record<string, unknown>,
    },
    enabled: true,
  }
}



function App() {
  const [blocks, setBlocks] = createSignal<BlockState[]>([
    makeBlock(mainSectionMeta, 0),
    makeBlock(benefitsSectionMeta, 1),
    makeBlock(solutionSectionMeta, 2),
    makeBlock(bookCallMeta, 3),
    makeBlock(servicesSectionMeta, 4),
    makeBlock(featureSectionMeta, 5),
    makeBlock(gallerySectionMeta, 6),
    makeBlock(contactSectionMeta, 7),
    makeBlock(faqSectionMeta, 8),
  ])

  const [metaData, setMetaData] = createSignal<Partial<PageMeta>>({
    title: 'Page Title',
    description: 'Page description',
    keywords: 'keyword',
  })

  const [layoutData, setLayoutData] = createSignal<Partial<Record<Lang, Layout>>>(
    makeDefaultLayouts()
  )

  const handleMetaChange = (newMeta: PageMeta) => {
    setMetaData(newMeta)
  }

  const handleLayoutChange = (newLayout: Partial<Record<Lang, Layout>>) => {
    setLayoutData((prev) => ({
      ...prev,
      ...newLayout,
    }))
  }

  const pageData = (): PageData => ({
    meta: {
      lv: metaData() as Record<string, string>,
      en: metaData() as Record<string, string>,
      ru: metaData() as Record<string, string>,
    },
    layout: layoutData() as Partial<Record<Lang, Record<string, unknown>>>,
    blocks: blocks().map((block, index) => ({
      id: block.id,
      type: block.meta.type as RegisteredBlockType,
      order: index,
      enabled: block.enabled,
      data: block.data,
    })),
  })

  return (
    <div class="min-h-screen bg-base-200 p-8">
      <div class="max-w-6xl mx-auto flex flex-col gap-6">
        <div>
          <h1 class="text-2xl font-bold">Page Editor</h1>
          <p class="text-sm opacity-50 mt-1">
            Drag <span class="font-semibold">⠿</span> to reorder blocks. Click{' '}
            <span class="font-semibold">Edit</span> to open the editor.
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-xs font-semibold uppercase tracking-widest opacity-40">
            Meta
          </span>
          <MetaEditor
            initialData={metaData()}
            onChange={handleMetaChange}
          />
        </div>



        <div class="flex flex-col gap-2">
          <span class="text-xs font-semibold uppercase tracking-widest opacity-40">
            Blocks
          </span>
          <SortableBlockList blocks={blocks()} onChange={setBlocks} />
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xs font-semibold uppercase tracking-widest opacity-40">
            Layout
          </span>

          <LayoutEditor
            initialData={layoutData()}
            onChange={handleLayoutChange}
          />
        </div>

        <div class="collapse collapse-arrow border border-base-content/10 bg-base-100 rounded-box">
          <input type="checkbox" />
          <div class="collapse-title text-sm font-semibold opacity-60">
            JSON Preview
          </div>
          <div class="collapse-content">
            <pre class="text-xs overflow-x-auto bg-base-200 rounded-box p-4">
              {JSON.stringify(pageData(), null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
