test = require "ava"

objectFromEntries = require "../../../lib/helper/util/objectFromEntries"

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
