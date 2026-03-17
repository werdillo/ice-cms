import type { Lang, BlockMeta } from '@ice-cms/schemas'

export type BlockState = {
  id: string
  meta: BlockMeta
  data: Partial<Record<Lang, Record<string, unknown>>>
  enabled: boolean
}
