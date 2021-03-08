interface FieldConfig<T = any> {
  fieldname: string
  value: T
  fieldnameTruncated: boolean
  valueTruncated: boolean
  enc: string
  mime: string
}

declare class Field<T = any> {
  fieldname: string
  value: T
  fieldnameTruncated: boolean
  valueTruncated: boolean
  enc: string
  mime: string

  constructor(config: FieldConfig<T>)
}

export default Field
