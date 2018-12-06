import toObject from "object-deep-from-entries"

import isFile from "../isFile"

const normalizeField = ([path, field]) => [
  path, isFile(field) ? field : field.value
]

const createBody = entries => toObject(entries.map(normalizeField))

export default createBody
