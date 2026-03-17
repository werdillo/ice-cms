import { createSignal, createMemo, createEffect } from 'solid-js'
import type { BlockMeta } from '@ice-cms/schemas'
import { type Lang } from '@ice-cms/schemas'
import type { z } from 'zod'
import { schemaToFields } from '../services/schema-to-fields'

type UseBlockModalProps = {
  meta: BlockMeta | undefined
  data: Partial<Record<Lang, Record<string, unknown>>>
  open: boolean
  onClose: () => void
  onChange: (data: Partial<Record<Lang, Record<string, unknown>>>) => void
}

export function useBlockModal(props: UseBlockModalProps) {
  const [activeLang, setActiveLang] = createSignal<Lang>('lv')

  // Local copy — edits happen here, parent only gets updated on Save
  const [localData, setLocalData] = createSignal<Partial<Record<Lang, Record<string, unknown>>>>({})

  // When modal opens — copy current props.data into local
  createEffect(() => {
    if (props.open) {
      setLocalData(structuredClone(props.data) as Partial<Record<Lang, Record<string, unknown>>>)
    }
  })

  const fields = createMemo(() =>
    props.meta ? schemaToFields(props.meta.schema as z.ZodTypeAny) : []
  )

  const currentData = createMemo(
    () =>
      (localData()[activeLang()] as Record<string, unknown>) ??
      (props.meta?.defaultData() as Record<string, unknown> | undefined) ??
      {}
  )

  const handleChange = (updated: Record<string, unknown>) => {
    setLocalData((prev) => ({ ...prev, [activeLang()]: updated }))
  }

  const handleSave = () => {
    props.onChange(localData())
    props.onClose()
  }

  const handleCancel = () => {
    props.onClose()
  }

  return {
    activeLang,
    setActiveLang,
    localData,
    fields,
    currentData,
    handleChange,
    handleSave,
    handleCancel,
  }
}
