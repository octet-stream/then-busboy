{isString} = require "util"

isInteger = require "lodash.isinteger"

reduce = (arr, args...) -> Array::reduceRight.apply arr, args

mapKeys = (val, key) ->
  unless isString(key)
    throw new TypeError "Key of the filed can be only a string or an integer."

  return new Map [[key, val]]

mapFromPath = (keys, val) -> reduce keys, mapKeys, val

module.exports = mapFromPath
