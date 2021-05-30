import {IncomingMessage} from "http"

import Busboy from "busboy"
import merge from "lodash.merge"

import isPlainObject from "./util/isPlainObject"
import ParseOptions from "./ParseOptions"

import onFile from "./listener/onFile"
import onField from "./listener/onField"
import onFilesLimit from "./listener/onFilesLimit"
import onFieldsLimit from "./listener/onFieldsLimit"
import onPartsLimit from "./listener/onPartsLimit"

import {Body} from "./Body"

const initializers = {
  onFile,
  onField,
  onFilesLimit,
  onFieldsLimit,
  onPartsLimit
}

const defaults: ParseOptions = {
  castTypes: true
}

export const parse = (
  request: IncomingMessage,
  options?: ParseOptions
) => new Promise((resolve, reject) => {
  if (!(request instanceof IncomingMessage)) {
    throw new TypeError(
      "Expected request argument to be an instance of http.IncomingMessage"
    )
  }

  if (!isPlainObject(options)) {
    throw new TypeError("Options expected to be an object")
  }

  const opts = merge({}, defaults, options, {headers: request.headers})

  const entries = []
  const busboy = new Busboy(opts)

  const onEntry = (err: Error, entry: unknown) => (
    err ? reject(err) : entries.push(entry)
  )
})
