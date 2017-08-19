const builtinTypes = [
  "null",
  "number",
  "object",
  "string",
  "function",
  "undefined"
]

function getType(val) {
  const type = Object.prototype.toString.call(val).slice(8, -1)

  if (builtinTypes.includes(type.toLowerCase())) {
    return type.toLowerCase()
  }

  return type
}

export default getType
