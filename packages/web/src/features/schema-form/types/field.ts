export type FieldType = 'string' | 'number' | 'boolean' | 'select' | 'object' | 'array' | 'tuple'

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
  itemFields: FieldDescriptor[]
  length: number
  defaultItems: Record<string, unknown>[]
}
