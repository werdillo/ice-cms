import { createSignal, createMemo } from 'solid-js'
import { type Lang } from '@ice-cms/schemas'
import type { PageLayout } from '../types'
import type { LayoutByLang } from '../services/layout-editor.validation'
import { isLayoutByLangValid } from '../services/layout-editor.validation'

type UseLayoutEditorProps = {
  initialData: LayoutByLang
  onChange: (data: Partial<Record<Lang, PageLayout>>) => void
}

export function useLayoutEditor(props: UseLayoutEditorProps) {
  const [activeLang, setActiveLang] = createSignal<Lang>('lv')
  const [localData, setLocalData] = createSignal<LayoutByLang>({
    ...props.initialData,
  })

  const currentData = createMemo<Partial<PageLayout>>(
    () => localData()[activeLang()] ?? {}
  )

  const isValid = createMemo(() => isLayoutByLangValid(localData()))

  const handleSectionChange = <K extends keyof PageLayout>(
    section: K,
    value: PageLayout[K]
  ) => {
    setLocalData((prev) => ({
      ...prev,
      [activeLang()]: {
        ...(prev[activeLang()] ?? {}),
        [section]: value,
      },
    }))
  }

  const handleHeaderChange = (updated: Record<string, unknown>) => {
    handleSectionChange('header', updated as PageLayout['header'])
  }

  const handleFooterChange = (updated: Record<string, unknown>) => {
    handleSectionChange('footer', updated as PageLayout['footer'])
  }

  const handleSidebarChange = (updated: Record<string, unknown>) => {
    handleSectionChange('sidebar', updated as PageLayout['sidebar'])
  }

  const handleSave = () => {
    if (isValid()) {
      props.onChange(localData() as Partial<Record<Lang, PageLayout>>)
    }
  }

  const handleReset = () => {
    setLocalData({ ...props.initialData })
  }

  return {
    activeLang,
    setActiveLang,
    localData,
    currentData,
    isValid,
    handleHeaderChange,
    handleFooterChange,
    handleSidebarChange,
    handleSave,
    handleReset,
  }
}
