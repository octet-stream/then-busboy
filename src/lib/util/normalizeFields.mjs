import isFile from "lib/isFile"

const normalizeFields = entries => entries.map(([path, field]) => [
  path, isFile(field) ? field : field.value
])

export default normalizeFields
