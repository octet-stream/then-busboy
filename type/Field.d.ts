declare class Field<T = any> {
  fieldname: string
  value: T
  fieldnameTruncated: string
  valueTruncated: boolean
  enc: string
  mime: string
}

export default Field
