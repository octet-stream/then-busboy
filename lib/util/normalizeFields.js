const File = require("../File")

const normalizeFields = entries => entries.map(([path, field]) => [
  path, field instanceof File ? field : field.value
])

module.exports = normalizeFields
