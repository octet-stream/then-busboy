import test from "ava"

import toFieldname from "../../../lib/util/pathToFieldname"

test("Should return path with one element as-is", t => {
  t.plan(1)

  t.is(toFieldname(["name"]), "name")
})

test("Should return correct fieldname for deep path", t => {
  t.plan(1)

  t.is(toFieldname(["a", "deep", 0, "fieldname"]), "a[deep][0][fieldname]")
})
