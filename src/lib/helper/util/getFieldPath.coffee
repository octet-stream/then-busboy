{isString} = require "util"

allowed = /^([^\[\]\n]+)(\[[^\[\]]+\])*$/

getFieldPath = (field) ->
  unless field or isString field
    throw new TypeError "Field name should be a non-empty string."

  unless allowed.test field
    throw new TypeError "Unallowed field name: #{field}"

  # Extract keys and save to an array
  return ((if k.endsWith "]" then k[...-1] else k) for k in field.split "[")

module.exports = getFieldPath
