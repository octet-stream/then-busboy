{isString} = require "util"

isInteger = require "lodash.isinteger"
isEmpty = require "lodash.isempty"
isPlainObject = require "lodash.isplainobject"

merge = require "./merge"

reduce = (arr, args...) -> Array::reduceRight.apply arr, args

reducePath = (prev, next) ->
  unless isString(prev) or isInteger(next)
    throw new TypeError "Key of the filed can be only a string or an integer."

  # Return an object property as is
  return "#{next}": prev if isNaN next

  # Rescue this later from an array
  return [
    Number next
    prev
  ]

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

    res[root] = merge res[root], obj

  return res

module.exports = objectFromEntries
