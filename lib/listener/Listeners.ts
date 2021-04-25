import {Readable} from "stream"

import FieldPath from "../util/FieldPath"
import ParseOptions from "../ParseOptions"

export interface OnField {
  (
    fieldname: string,
    value: unknown,
    fieldnameTruncated: boolean,
    valueTruncated: boolean,
    encoding: string,
    mimetype: string
  ): void
}

export interface OnFile {
  (
    fieldname: string,
    stream: Readable,
    filename: string,
    encoding: string,
    mimetype: string
  ): void
}
