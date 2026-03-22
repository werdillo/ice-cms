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

  // Accepts a full partial object and merges it in a single setLocalData call
  const handleChange = (updated: Partial<PageMeta>) => {
    setLocalData((prev) => ({ ...prev, ...updated }))
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
