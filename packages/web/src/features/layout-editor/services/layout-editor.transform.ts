import { LANGS, type Lang } from '@ice-cms/schemas'
import type { PageLayout } from '../types'
import type { LayoutByLang } from './layout-editor.validation'

export type LayoutBySection = {
  header: Partial<Record<Lang, PageLayout['header']>>
  footer: Partial<Record<Lang, PageLayout['footer']>>
  sidebar: Partial<Record<Lang, PageLayout['sidebar']>>
}

export function toLayoutBySection(layouts: LayoutByLang): LayoutBySection {
  return {
    header: Object.fromEntries(
      LANGS.flatMap((lang) =>
        layouts[lang]?.header ? [[lang, layouts[lang]!.header]] : []
      )
    ) as Partial<Record<Lang, PageLayout['header']>>,

    footer: Object.fromEntries(
      LANGS.flatMap((lang) =>
        layouts[lang]?.footer ? [[lang, layouts[lang]!.footer]] : []
      )
    ) as Partial<Record<Lang, PageLayout['footer']>>,

    sidebar: Object.fromEntries(
      LANGS.flatMap((lang) =>
        layouts[lang]?.sidebar ? [[lang, layouts[lang]!.sidebar]] : []
      )
    ) as Partial<Record<Lang, PageLayout['sidebar']>>,
  }
}

export function toLayoutByLang(sections: LayoutBySection): LayoutByLang {
  return Object.fromEntries(
    LANGS.map((lang) => [
      lang,
      {
        ...(sections.header[lang] ? { header: sections.header[lang] } : {}),
        ...(sections.footer[lang] ? { footer: sections.footer[lang] } : {}),
        ...(sections.sidebar[lang] ? { sidebar: sections.sidebar[lang] } : {}),
      },
    ]).filter(([, value]) => Object.keys(value).length > 0)
  ) as LayoutByLang
}
