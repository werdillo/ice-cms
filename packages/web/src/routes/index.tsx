import { createFileRoute, redirect } from '@tanstack/solid-router'
import { LANGS } from '@ice-cms/schemas'
import { createSignal, onMount, Show } from 'solid-js'
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
import { MetaEditor, type MetaByLang } from '../features/meta-editor'
import { LayoutEditor } from '../features/layout-editor/components/LayoutEditor'
import type { LayoutSectionsByLang } from '../features/layout-editor/types'
import { apiFetch } from '../lib/api-fetch'
import { authStore } from '../features/auth/auth.store'

const API_BASE = 'http://localhost:8000/api/content'
const PUBLISH_URL = `${API_BASE}/publish`

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    if (!authStore.isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: App,
})

const DEFAULT_META: MetaByLang = {
  lv: { title: 'Page Title', description: 'Page description', keywords: 'keyword', ogTitle: '', ogDescription: '', ogImage: '', canonicalUrl: '', robots: '' },
  en: { title: 'Page Title', description: 'Page description', keywords: 'keyword', ogTitle: '', ogDescription: '', ogImage: '', canonicalUrl: '', robots: '' },
}

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
    },
    enabled: true,
  }
}

function App() {
  const [isLoading, setIsLoading] = createSignal(true)
  const [isPublishing, setIsPublishing] = createSignal(false)
  const [blocks, setBlocks] = createSignal<BlockState[]>([])
  const [metaData, setMetaData] = createSignal<MetaByLang>(DEFAULT_META)
  const [layoutData, setLayoutData] = createSignal<LayoutSectionsByLang>(
    toLayoutBySection(makeDefaultLayouts())
  )

  onMount(async () => {
    try {
      const response = await apiFetch(`${API_BASE}/index`)
      const result = await response.json()

      if (response.ok && result.success && result.data.data) {
        const remoteData = result.data.data as PageData

        // 1. Meta — stored per-lang
        setMetaData(remoteData.meta as MetaByLang)

        // 2. Layout
        setLayoutData(remoteData.layout as LayoutSectionsByLang)

        // 3. Blocks
        const blockStates: BlockState[] = remoteData.blocks.map((b) => {
          const meta =
            [
              mainSectionMeta,
              benefitsSectionMeta,
              solutionSectionMeta,
              bookCallMeta,
              servicesSectionMeta,
              featureSectionMeta,
              gallerySectionMeta,
              contactSectionMeta,
              faqSectionMeta,
            ].find((m) => m.type === b.type) || mainSectionMeta

          // Strip old/unknown fields by parsing each lang's data through the schema.
          // safeParse strips unknown keys (e.g. old image1Src/image1Alt) and
          // fills in defaults for new fields (e.g. image1: { src:'', alt:'' }).
          const cleanData: BlockState['data'] = {}
          for (const lang of LANGS) {
            const raw = (b.data as Record<string, unknown>)[lang]
            if (raw && typeof raw === 'object') {
              const parsed = meta.schema.safeParse(raw)
              cleanData[lang] = parsed.success
                ? (parsed.data as Record<string, unknown>)
                : (raw as Record<string, unknown>)
            }
          }

          return {
            id: b.id,
            meta,
            data: cleanData,
            enabled: b.enabled,
          }
        })
        setBlocks(blockStates)
      } else {
        // Fallback to defaults
        setBlocks([
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
        setMetaData(DEFAULT_META)
      }
    } catch (err) {
      console.error('Failed to load content:', err)
    } finally {
      setIsLoading(false)
    }
  })

  const pageData = (): PageData => ({
    meta: metaData() as PageData['meta'],
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
      const response = await apiFetch(PUBLISH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: 'index',
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
      <Show
        when={!isLoading()}
        fallback={
          <div class="flex items-center justify-center min-h-[50vh]">
            <span class="loading loading-spinner loading-lg text-primary"></span>
          </div>
        }
      >
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
                'Publish'
              )}
            </button>
          </div>

          <CollapsibleSection title="Meta">
            <MetaEditor
              data={metaData()}
              onChange={setMetaData}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Blocks" defaultOpen>
            <SortableBlockList blocks={blocks()} onChange={setBlocks} />
          </CollapsibleSection>

          <CollapsibleSection title="Layout">
            <LayoutEditor
              initialData={layoutData()}
              onChange={setLayoutData}
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
      </Show>
    </div>
  )
}
