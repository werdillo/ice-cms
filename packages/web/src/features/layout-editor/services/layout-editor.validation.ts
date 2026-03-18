import { LANGS, type Lang } from '@ice-cms/schemas'
import type { PageLayout } from '../types'

export type LayoutByLang = Partial<Record<Lang, Partial<PageLayout>>>

export function isLayoutComplete(layout?: Partial<PageLayout>): boolean {
  if (!layout) return false

  return !!(
    layout.header?.lang &&
    layout.footer?.ariaLabel &&
    layout.footer?.logo?.href &&
    layout.footer?.logo?.ariaLabel &&
    layout.footer?.mainNavigation?.ariaLabel &&
    layout.footer?.newsletter?.emailInputId &&
    layout.footer?.newsletter?.emailPlaceholder &&
    layout.footer?.newsletter?.buttonText &&
    layout.footer?.newsletter?.ariaLabel &&
    layout.footer?.copyright?.siteName &&
    layout.footer?.copyright?.siteUrl &&
    layout.footer?.legalLinks?.ariaLabel &&
    layout.sidebar?.ariaLabel
  )
}

export function isLayoutByLangValid(layouts: LayoutByLang): boolean {
  return LANGS.every((lang) => isLayoutComplete(layouts[lang]))
}
