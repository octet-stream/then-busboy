const basicTypes = [
  "null",
  "number",
  "object",
  "array",
  "string",
  "function",
  "undefined",
  "boolean"
]

function getType(val) {
  const type = Object.prototype.toString.call(val).slice(8, -1)

  if (basicTypes.includes(type.toLowerCase())) {
    return type.toLowerCase()
  }

  return type
}

export default getType
