test = require "ava"

mapFromPath = require "../../../lib/helper/util/mapFromPath"

test "Should return an expected Map", (t) ->
  t.plan 1

  expectedMap = new Map [
    [
      "key", new Map [
        [
          "subkey", 451
        ]
      ]
    ]
  ]

  actualMap = mapFromPath ["key", "subkey"], 451

  t.deepEqual actualMap, expectedMap

test "Should throw a TypeError when key is not a string or an integer", (t) ->
  t.plan 3

  trap = -> mapFromPath ["six", 6, ->], 451

  err = t.throws trap

  t.true err instanceof TypeError
  t.is err.message, "Key of the filed can be only a string or an integer."
