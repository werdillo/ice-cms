import { z } from 'zod'

// --- Field types ---
export type FieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'select'
  | 'object'
  | 'array'
  | 'tuple'

export type FieldDescriptor =
  | StringField
  | NumberField
  | BooleanField
  | SelectField
  | ObjectField
  | ArrayField
  | TupleField

export type StringField = {
  kind: 'string'
  key: string
  label: string
  defaultValue: string
}

export type NumberField = {
  kind: 'number'
  key: string
  label: string
  defaultValue: number
}

export type BooleanField = {
  kind: 'boolean'
  key: string
  label: string
  defaultValue: boolean
}

export type SelectField = {
  kind: 'select'
  key: string
  label: string
  options: string[]
  defaultValue: string
}

export type ObjectField = {
  kind: 'object'
  key: string
  label: string
  fields: FieldDescriptor[]
}

export type ArrayField = {
  kind: 'array'
  key: string
  label: string
  itemFields: FieldDescriptor[]
  defaultItem: Record<string, unknown>
}

export type TupleField = {
  kind: 'tuple'
  key: string
  label: string
  itemFields: FieldDescriptor[]  // fields of each item (all items share same shape)
  length: number                 // fixed length
  defaultItems: Record<string, unknown>[]
}

// --- Label helper ---
function keyToLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim()
}

// --- Unwrap optional/nullable/default wrappers ---
function unwrap(schema: z.ZodTypeAny): z.ZodTypeAny {
  if (
    schema instanceof z.ZodOptional ||
    schema instanceof z.ZodNullable ||
    schema instanceof z.ZodDefault
  ) {
    return unwrap(schema._def.innerType)
  }
  return schema
}

// --- Get default value from a ZodDefault ---
function getDefault(schema: z.ZodTypeAny): unknown {
  if (schema instanceof z.ZodDefault) {
    return schema._def.defaultValue()
  }
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return getDefault(schema._def.innerType)
  }
  return undefined
}

// --- Build default item for array ---
export function buildDefaultItem(
  fields: FieldDescriptor[]
): Record<string, unknown> {
  const obj: Record<string, unknown> = {}
  for (const field of fields) {
    if (field.kind === 'string') obj[field.key] = field.defaultValue
    else if (field.kind === 'number') obj[field.key] = field.defaultValue
    else if (field.kind === 'boolean') obj[field.key] = field.defaultValue
    else if (field.kind === 'select') obj[field.key] = field.defaultValue
    else if (field.kind === 'object')
      obj[field.key] = buildDefaultItem(field.fields)
    else if (field.kind === 'array') obj[field.key] = []
    else if (field.kind === 'tuple') obj[field.key] = field.defaultItems
  }
  return obj
}

// --- Main introspection ---
export function schemaToFields(
  schema: z.ZodTypeAny,
  parentKey = ''
): FieldDescriptor[] {
  const inner = unwrap(schema)

  if (!(inner instanceof z.ZodObject)) return []

  const shape = inner.shape as Record<string, z.ZodTypeAny>

  return Object.entries(shape).map(([key, rawField]) => {
    const fullKey = parentKey ? `${parentKey}.${key}` : key
    const label = keyToLabel(key)
    const defaultVal = getDefault(rawField)
    const field = unwrap(rawField)

    // --- Enum → select ---
    if (field instanceof z.ZodEnum) {
      return {
        kind: 'select',
        key,
        label,
        options: field._def.values as string[],
        defaultValue:
          typeof defaultVal === 'string'
            ? defaultVal
            : (field._def.values[0] as string),
      } satisfies SelectField
    }

    // --- Boolean ---
    if (field instanceof z.ZodBoolean) {
      return {
        kind: 'boolean',
        key,
        label,
        defaultValue: typeof defaultVal === 'boolean' ? defaultVal : false,
      } satisfies BooleanField
    }

    // --- Number ---
    if (field instanceof z.ZodNumber) {
      return {
        kind: 'number',
        key,
        label,
        defaultValue: typeof defaultVal === 'number' ? defaultVal : 0,
      } satisfies NumberField
    }

    // --- String ---
    if (field instanceof z.ZodString) {
      return {
        kind: 'string',
        key,
        label,
        defaultValue: typeof defaultVal === 'string' ? defaultVal : '',
      } satisfies StringField
    }

    // --- Array ---
    if (field instanceof z.ZodArray) {
      const itemFields = schemaToFields(field._def.type, fullKey)
      return {
        kind: 'array',
        key,
        label,
        itemFields,
        defaultItem: buildDefaultItem(itemFields),
      } satisfies ArrayField
    }

    // --- Tuple (fixed-length array) ---
    if (field instanceof z.ZodTuple) {
      const items = field._def.items as z.ZodTypeAny[]
      // All items share the same shape — use first item for field descriptors
      const itemFields = items.length > 0 ? schemaToFields(items[0], fullKey) : []
      const defaultItem = buildDefaultItem(itemFields)
      return {
        kind: 'tuple',
        key,
        label,
        itemFields,
        length: items.length,
        defaultItems: Array.from({ length: items.length }, () =>
          structuredClone(defaultItem)
        ),
      } satisfies TupleField
    }

    // --- Object ---
    if (field instanceof z.ZodObject) {
      return {
        kind: 'object',
        key,
        label,
        fields: schemaToFields(field, fullKey),
      } satisfies ObjectField
    }

    // --- Fallback: treat as string ---
    return {
      kind: 'string',
      key,
      label,
      defaultValue: typeof defaultVal === 'string' ? defaultVal : '',
    } satisfies StringField
  })
}
