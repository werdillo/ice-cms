import { createFileRoute } from '@tanstack/solid-router'
import { createSignal } from 'solid-js'
import { CollapsibleSection } from '../components/CollapsibleSection'
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
  type PageData,
  type RegisteredBlockType,
} from '@ice-cms/schemas'
import {
  makeDefaultLayouts,
  toLayoutBySection,
} from '../features/layout-editor/services'
import { MetaEditor } from '../features/meta-editor/components'
import { type PageMeta } from '../features/meta-editor'
import { LayoutEditor } from '../features/layout-editor/components/LayoutEditor'
import type { LayoutSectionsByLang } from '../features/layout-editor/hooks/useLayoutEditor'

const API_URL = 'http://localhost:8000/api/content/publish'

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
  const [isPublishing, setIsPublishing] = createSignal(false)
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

  const [layoutData, setLayoutData] = createSignal<LayoutSectionsByLang>(
    toLayoutBySection(makeDefaultLayouts())
  )

  const handleMetaChange = (newMeta: PageMeta) => {
    setMetaData(newMeta)
  }

  const handleLayoutChange = (newLayout: LayoutSectionsByLang) => {
    setLayoutData(newLayout)
  }

  const pageData = (): PageData => ({
    meta: {
      lv: metaData() as Record<string, string>,
      en: metaData() as Record<string, string>,
      ru: metaData() as Record<string, string>,
    },
    layout: layoutData() as PageData['layout'],
    blocks: blocks().map((block, index) => ({
      id: block.id,
      type: block.meta.type as RegisteredBlockType,
      order: index,
      enabled: block.enabled,
      data: block.data,
    })),
  })

  const handlePublish = async () => {
    if (!confirm('Are you sure you want to publish these changes to GitHub?')) return

    setIsPublishing(true)
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: 'index', // Hardcoded for now, could be dynamic
          content: pageData(),
          commitMessage: `content: update index page at ${new Date().toISOString()}`,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        alert('Published successfully!')
      } else {
        throw new Error(result.error || 'Failed to publish')
      }
    } catch (err) {
      console.error('Publish error:', err)
      alert(`Error publishing: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div class="min-h-screen bg-base-200 p-8">
      <div class="max-w-6xl mx-auto flex flex-col gap-6">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-2xl font-bold">Page Editor</h1>
          <p class="text-sm opacity-50 mt-1">
            Drag <span class="font-semibold">⠿</span> to reorder blocks. Click{' '}
            <span class="font-semibold">Edit</span> to open the editor.
          </p>
          </div>
          <button
            type="button"
            class="btn btn-primary"
            onClick={handlePublish}
            disabled={isPublishing()}
          >
            {isPublishing() ? (
              <>
                <span class="loading loading-spinner loading-xs"></span>
                Publishing...
              </>
            ) : (
              'Publish to GitHub'
            )}
          </button>
        </div>

        <CollapsibleSection title="Meta">
          <MetaEditor
            initialData={metaData()}
            onChange={handleMetaChange}
          />
        </CollapsibleSection>

        <CollapsibleSection title="Blocks" defaultOpen>
          <SortableBlockList blocks={blocks()} onChange={setBlocks} />
        </CollapsibleSection>

        <CollapsibleSection title="Layout">
          <LayoutEditor
            initialData={layoutData()}
            onChange={handleLayoutChange}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="JSON Preview"
          titleClass="text-sm font-semibold opacity-60 normal-case tracking-normal"
        >
          <pre class="text-xs overflow-x-auto bg-base-200 rounded-box p-4">
            {JSON.stringify(pageData(), null, 2)}
          </pre>
        </CollapsibleSection>
      </div>
    </div>
  )
}
