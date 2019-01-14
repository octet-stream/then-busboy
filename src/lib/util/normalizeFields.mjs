import {isFile} from "lib/File"

const normalizeFields = entries => entries.map(([path, field]) => [
  path, isFile(field) ? field : field.value
])

export default normalizeFields
