import { type Component } from 'solid-js'
import { SectionCard } from '../../../components/SectionCard'
import { schemaToFields } from '../../schema-form'
import { metaSchema } from '@ice-cms/schemas'
import type { MetaByLang } from '@ice-cms/schemas'
import type { BlockCardMeta } from '../../block-editor/components/BlockCard'
import type { Lang } from '@ice-cms/schemas'

type MetaEditorProps = {
  data: MetaByLang
  onChange: (data: MetaByLang) => void
}

// Compute once at module level — fields never change
const allFields = schemaToFields(metaSchema)

const metaSectionMeta: BlockCardMeta = {
  type: 'meta',
  label: 'Page Metadata',
  description: 'SEO title, description, Open Graph and robots',
}

export const MetaEditor: Component<MetaEditorProps> = (props) => {
  return (
    <SectionCard
      meta={metaSectionMeta}
      fields={allFields}
      data={props.data as Partial<Record<Lang, Record<string, unknown>>>}
      onChange={(data) => props.onChange(data as MetaByLang)}
      defaultOpen
    />
  )
}

export default MetaEditor
