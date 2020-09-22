const test = require("ava")

const toFieldname = require("../../../lib/util/pathToFieldname")

test("Should return path with one element as-is", t => {
  t.is(toFieldname(["name"]), "name")
})

test("Should return correct fieldname for deep path", t => {
  t.is(toFieldname(["a", "deep", 0, "fieldname"]), "a[deep][0][fieldname]")
})
