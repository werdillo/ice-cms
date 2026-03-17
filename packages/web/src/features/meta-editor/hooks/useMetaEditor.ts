import { createSignal, createMemo } from 'solid-js'
import type { PageMeta } from '../types'

type UseMetaEditorProps = {
  initialData: Partial<PageMeta>
  onChange: (data: PageMeta) => void
}

export function useMetaEditor(props: UseMetaEditorProps) {
  const [localData, setLocalData] = createSignal<Partial<PageMeta>>({ ...props.initialData })

  const isValid = createMemo(() => {
    const data = localData()
    return !!(data.title && data.description && data.keywords?.length)
  })

  const handleChange = (field: keyof PageMeta, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (isValid()) {
      props.onChange(localData() as PageMeta)
    }
  }

  const handleReset = () => {
    setLocalData({ ...props.initialData })
  }

  return {
    localData,
    isValid,
    handleChange,
    handleSave,
    handleReset,
  }
}
