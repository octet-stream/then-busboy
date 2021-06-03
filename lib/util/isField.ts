import {BodyField} from "../BodyField"

const isField = (value: unknown): value is BodyField => (
  !!value && value instanceof BodyField
)

export default isField
