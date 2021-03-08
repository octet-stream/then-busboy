import {expectType} from "tsd"

import Field from "./Field"

const config = {
  fieldname: "field",
  value: "some string",
  fieldnameTruncated: false,
  valueTruncated: false,
  enc: "enc",
  mime: "text/plain"
}

interface Shape {
  key: string
}

expectType<any>(new Field(config).value)

// Accepts a type for field's value
expectType<Shape>(new Field<Shape>({...config, value: {key: "value"}}).value)

const field = new Field<string>(config)

expectType<string>(field.fieldname)
expectType<string>(field.enc)
expectType<string>(field.mime)
expectType<boolean>(field.valueTruncated)
expectType<boolean>(field.fieldnameTruncated)
expectType<string>(field.value)
