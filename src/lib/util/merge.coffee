isPlainObject = require "lodash.isplainobject"

isArray = Array.isArray
entries = Object.entries

merge = (target, obj) ->
  # Well... That's would be not pretty code x)
  unless target
    if isPlainObject obj
      target = {}

      [[key, val]] = entries obj

      target[key] = merge null, val

      return target

    if isArray obj
      target = []

      [idx, val] = obj

      target[idx] = merge null, val

      return target

    return obj

  [idx, val] = obj

  target[idx] = merge null, val

  return target

module.exports = merge
