import { createFileRoute } from '@tanstack/solid-router'
import { createSignal } from 'solid-js'
import SortableBlockList, {
  type BlockState,
} from '../features/block-editor'
import { faqSectionMeta, solutionSectionMeta, bookCallMeta, benefitsSectionMeta, featureSectionMeta, gallerySectionMeta, mainSectionMeta, contactSectionMeta, servicesSectionMeta } from '@ice-cms/schemas'

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

  return (
    <div class="min-h-screen bg-base-200 p-8">
      <div class="max-w-3xl mx-auto flex flex-col gap-6">

        {/* Page header */}
        <div>
          <h1 class="text-2xl font-bold">Page Editor</h1>
          <p class="text-sm opacity-50 mt-1">
            Drag <span class="font-semibold">⠿</span> to reorder blocks. Click{' '}
            <span class="font-semibold">Edit</span> to open the editor.
          </p>
        </div>

        {/* Blocks */}
        <div class="flex flex-col gap-2">
          <span class="text-xs font-semibold uppercase tracking-widest opacity-40">
            Blocks
          </span>
          <SortableBlockList blocks={blocks()} onChange={setBlocks} />
        </div>

        {/* JSON preview */}
        <div class="collapse collapse-arrow border border-base-content/10 bg-base-100 rounded-box">
          <input type="checkbox" />
          <div class="collapse-title text-sm font-semibold opacity-60">
            JSON Preview
          </div>
          <div class="collapse-content">
            <pre class="text-xs overflow-x-auto bg-base-200 rounded-box p-4">
              {JSON.stringify(
                blocks().map((b) => ({
                  type: b.meta.type,
                  enabled: b.enabled,
                  data: b.data,
                })),
                null,
                2
              )}
            </pre>
          </div>
        </div>

      </div>
    </div>
  )
}
