{isString} = require "util"

isInteger = require "lodash.isinteger"
isEmpty = require "lodash.isempty"
isPlainObject = require "lodash.isplainobject"

reduce = (arr, args...) -> Array::reduceRight.apply arr, args

reducePath = (prev, next) ->
  unless isString(prev) or isInteger(next)
    throw new TypeError "Key of the filed can be only a string or an integer."

  return "#{next}": prev if isNaN next

  # arr = []
  # arr[Number next] = prev

  return [prev]

###
# [["foo", "bar", 0], 451]
###
objectFromPath = (path, val) -> reduce path, reducePath, val

###
# Create an object from given entries
#
# [
#   [["foo", "bar", 0], 451]
# ]
#
# {
#   foo: {
#     bar: [451]
#   }
# }
###
objectFromEntries = (entries, toObject = false) ->
  res = {}

  for [path, val] in entries
    root = do path.shift

    ###
    # Is "root" key only one in a "path" array?
    #
    # [["foo"], 451]
    #
    # {
    #   foo: 451
    # }
    ###
    if path.length < 1
      res[root] = val
      continue

    obj = objectFromPath path, val

  return res

module.exports = objectFromEntries
