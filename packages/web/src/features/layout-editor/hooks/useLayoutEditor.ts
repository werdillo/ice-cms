import { createSignal, createMemo } from 'solid-js'
import { type Lang } from '@ice-cms/schemas'
import type { PageLayout } from '../types'

export type LayoutSectionsByLang = {
  header: Partial<Record<Lang, PageLayout['header']>>
  footer: Partial<Record<Lang, PageLayout['footer']>>
  sidebar: Partial<Record<Lang, PageLayout['sidebar']>>
}

type UseLayoutEditorProps = {
  initialData: LayoutSectionsByLang
  onChange: (data: LayoutSectionsByLang) => void
}

function isCompleteObject(value: unknown): boolean {
  return !!value && typeof value === 'object'
}

function isLayoutValid(data: LayoutSectionsByLang): boolean {
  return (['lv', 'en'] as Lang[]).every((lang) => {
    const header = data.header[lang]
    const footer = data.footer[lang]
    const sidebar = data.sidebar[lang]

    return !!(
      header?.lang &&
      header?.buttonText &&
      header?.buttonHref &&
      footer?.ariaLabel &&
      footer?.logo?.href &&
      footer?.logo?.ariaLabel &&
      footer?.mainNavigation?.ariaLabel &&
      footer?.newsletter?.emailInputId &&
      footer?.newsletter?.emailPlaceholder &&
      footer?.newsletter?.buttonText &&
      footer?.newsletter?.ariaLabel &&
      footer?.copyright?.siteName &&
      footer?.copyright?.siteUrl &&
      footer?.legalLinks?.ariaLabel &&
      sidebar?.ariaLabel &&
      Array.isArray(sidebar?.links)
    )
  })
}

export function useLayoutEditor(props: UseLayoutEditorProps) {
  const [activeLang, setActiveLang] = createSignal<Lang>('lv')
  const [isDirty, setIsDirty] = createSignal(false)
  const [localData, setLocalData] = createSignal<LayoutSectionsByLang>({
    header: { ...props.initialData.header },
    footer: { ...props.initialData.footer },
    sidebar: { ...props.initialData.sidebar },
  })

  const currentData = createMemo<Partial<PageLayout>>(() => ({
    header: localData().header[activeLang()],
    footer: localData().footer[activeLang()],
    sidebar: localData().sidebar[activeLang()],
  }))

  const isValid = createMemo(() => isLayoutValid(localData()))

  const handleHeaderChange = (updated: Record<string, unknown>) => {
    if (!isCompleteObject(updated)) return
    setLocalData((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        [activeLang()]: updated as PageLayout['header'],
      },
    }))
    setIsDirty(true)
  }

  const handleFooterChange = (updated: Record<string, unknown>) => {
    if (!isCompleteObject(updated)) return
    setLocalData((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        [activeLang()]: updated as PageLayout['footer'],
      },
    }))
    setIsDirty(true)
  }

  const handleSidebarChange = (updated: Record<string, unknown>) => {
    if (!isCompleteObject(updated)) return
    setLocalData((prev) => ({
      ...prev,
      sidebar: {
        ...prev.sidebar,
        [activeLang()]: updated as PageLayout['sidebar'],
      },
    }))
    setIsDirty(true)
  }

  const handleSave = () => {
    if (isValid()) {
      props.onChange(localData())
      setIsDirty(false)
    }
  }

  const handleReset = () => {
    setLocalData({
      header: { ...props.initialData.header },
      footer: { ...props.initialData.footer },
      sidebar: { ...props.initialData.sidebar },
    })
    setIsDirty(false)
  }

  return {
    activeLang,
    setActiveLang,
    localData,
    currentData,
    isValid,
    isDirty,
    handleHeaderChange,
    handleFooterChange,
    handleSidebarChange,
    handleSave,
    handleReset,
  }
}
