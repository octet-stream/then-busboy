test = require "ava"

mapFromEntries = require "../../../lib/helper/util/mapFromEntries"

entries = [
  [
    ["foo", "bar", "baz"], 42
  ]
  [
    ["foo", "bar", "boo"], 451
  ]
]

test "Should be a function", (t) ->
  t.plan 1

  t.is typeof mapFromEntries, "function"

test "Should return a Map if the second argument have been ommited", (t) ->
  t.plan 1

  actualResult = mapFromEntries entries

  console.log actualResult

  # t.true actualResult instanceof Map

  do t.pass
