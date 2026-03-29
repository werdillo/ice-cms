import { type Component, createSignal } from 'solid-js'
import { SectionCard } from '../../../components/SectionCard'
import { layoutEditorFields } from '../services/layout-editor.schemas'
import type { LayoutSectionsByLang } from '../types'
import type { BlockCardMeta } from '../../block-editor/components/BlockCard'
import type { Lang } from '@ice-cms/schemas'

type LayoutEditorProps = {
  initialData: LayoutSectionsByLang
  onChange: (data: LayoutSectionsByLang) => void
}

const headerMeta: BlockCardMeta = {
  type: 'header',
  label: 'Header',
  description: 'Site header links and logo',
}

const footerMeta: BlockCardMeta = {
  type: 'footer',
  label: 'Footer',
  description: 'Site footer links and copyright',
}

const sidebarMeta: BlockCardMeta = {
  type: 'sidebar',
  label: 'Sidebar',
  description: 'Sidebar navigation and widgets',
}

export const LayoutEditor: Component<LayoutEditorProps> = (props) => {
  const [data, setData] = createSignal<LayoutSectionsByLang>(props.initialData)

  const update =
    (section: keyof LayoutSectionsByLang) =>
    (updated: Partial<Record<Lang, Record<string, unknown>>>) => {
      const next = { ...data(), [section]: updated } as LayoutSectionsByLang
      setData(next)
      props.onChange(next)
    }

  return (
    <div class="flex flex-col gap-4">
      <SectionCard
        meta={headerMeta}
        fields={layoutEditorFields.header}
        data={data().header as Partial<Record<Lang, Record<string, unknown>>>}
        onChange={update('header')}
        defaultOpen
      />

      <SectionCard
        meta={footerMeta}
        fields={layoutEditorFields.footer}
        data={data().footer as Partial<Record<Lang, Record<string, unknown>>>}
        onChange={update('footer')}
      />

      <SectionCard
        meta={sidebarMeta}
        fields={layoutEditorFields.sidebar}
        data={data().sidebar as Partial<Record<Lang, Record<string, unknown>>>}
        onChange={update('sidebar')}
      />
    </div>
  )
}

export default LayoutEditor
