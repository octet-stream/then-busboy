test = require "ava"

getFieldPath = require "../../../lib/util/getFieldPath"

test "Should pass a simple field key", (t) ->
  t.plan 1

  expectedPath = ["moonstuck"]

  actualPath = getFieldPath "moonstuck"

  t.deepEqual actualPath, expectedPath

test "Should pass a complex field name", (t) ->
  t.plan 1

  expectedPath = [
    "user"
    "files"
    "451"
  ]

  actualPath = getFieldPath "user[files][451]"

  t.deepEqual actualPath, expectedPath

test "Should throw TypeError when field name is empty", (t) ->
  t.plan 3

  trap = -> do getFieldPath

  err = t.throws trap

  t.true err instanceof TypeError

  t.is err.message, "Field name should be a non-empty string."

test "Should throw a TypeError on unallowed field name format", (t) ->
  t.plan 3

  field = "some[totally[]][wrong]format"

  trap = -> do getFieldPath field

  err = t.throws trap

  t.true err instanceof TypeError

  t.is err.message, "Unallowed field name: some[totally[]][wrong]format"
