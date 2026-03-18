import {
  headerPropsSchema,
  footerConfigSchema,
  sidebarConfigSchema,
} from '@ice-cms/schemas'
import { schemaToFields } from '../../schema-form'

export const layoutEditorSchemas = {
  header: headerPropsSchema,
  footer: footerConfigSchema,
  sidebar: sidebarConfigSchema,
} as const

export const layoutEditorFields = {
  header: schemaToFields(layoutEditorSchemas.header),
  footer: schemaToFields(layoutEditorSchemas.footer),
  sidebar: schemaToFields(layoutEditorSchemas.sidebar),
} as const
