{isString} = require "util"

isInteger = require "lodash.isinteger"
isEmpty = require "lodash.isempty"

# mergeMaps = require "./mergeMaps"

reduce = (arr, args...) -> Array::reduceRight.apply arr, args

mapKeys = (val, key) ->
  unless isString(key)
    throw new TypeError "Key of the filed can be only a string or an integer."

  return new Map [[key, val]]

mapFromPath = (keys, val) -> reduce keys, mapKeys, val

# [["foo", "bar", 42], 451]
mapFromEntries = (entries, toObject = false) ->
  # res = if toObject is on then {} else new Map

  res = []

  for [path, value] in entries
    # key = do path.shift

    # res.set key, if isEmpty path then val else mapFromPath path, value

    res.push mapFromPath path, value

  return res

module.exports = mapFromEntries
