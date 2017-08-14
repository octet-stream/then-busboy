test = require "ava"

objectFromEntries = require "../../../lib/util/objectFromEntries"

entries = [
  [
    ["foo", "bar", "baz"], 42
  ]
  [
    ["foo", "bar", "boo"], 451
  ]
]

test "Should create a simple flat object", (t) ->
  t.plan 1

  obj = objectFromEntries [
    [
      ["key"], "value"
    ]
  ]

  t.deepEqual obj, key: "value"

test "Should create a complex flat object", (t) ->
  t.plan 1

  obj = objectFromEntries [
    [
      ["earthPony"], "Apple Bloom"
    ]
    [
      ["unicorn"], "Sweetie Belle"
    ]
    [
      ["pegasus"], "Scootaloo"
    ]
    [
      ["alicorn"], "Nyx"
    ]
    [
      ["ultimateAnswer"], 42
    ]
    [
      ["someNullValue"], null
    ]
  ]

  t.deepEqual obj,
    earthPony: "Apple Bloom"
    unicorn: "Sweetie Belle"
    pegasus: "Scootaloo"
    alicorn: "Nyx"
    ultimateAnswer: 42
    someNullValue: null

test "Should correctly create an array", (t) ->
  t.plan 1

  expected =
    foo: [
      42
      "bar"
      bar: "baz"
    ]
    bar:
      baz: "boo"
    field: "some whatever value"
    lvl0:
      lvl1: [
        lvl2:
          lvlN: 451
      ]

  actual = objectFromEntries [
    [
      ["foo", 0], 42
    ]
    [
      ["foo", 1], "bar"
    ]
    [
      ["foo", 2, "bar"], "baz"
    ]
    [
      ["bar", "baz"], "boo"
    ]
    [
      ["field"], "some whatever value"
    ]
    [
      ["lvl0", "lvl1", 0, "lvl2", "lvlN"], 451
    ]
  ]

  # console.log ""
  # console.log JSON.stringify actual, null, 2

  t.deepEqual actual, expected
