import {Readable} from "stream"

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
