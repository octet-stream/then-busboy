import {Field} from "../Field"

const isField = (value: unknown): value is Field => (
  !!value && value instanceof Field
)

export default isField
