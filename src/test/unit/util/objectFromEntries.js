import test from "ava"

import isPlainObject from "lodash.isplainobject"

import objectFromEntries from "lib/util/objectFromEntries"

test("Should always return a plain object when array given", t => {
  t.plan(1)

  const actual = objectFromEntries([])

  t.true(isPlainObject(actual))
})

test("Should correctly resolve simple (flat) object", t => {
  t.plan(1)

  const expected = {
    name: "John Doe",
    age: 25,
    gender: "Male"
  }

  const actual = objectFromEntries([
    [
      ["name"], "John Doe"
    ],
    [
      ["age"], 25
    ],
    [
      ["gender"], "Male"
    ]
  ])

  t.deepEqual(actual, expected)
})

test("Should correctly create an array", t => {
  t.plan(1)

  const expected = {
    foo: [
      42, "bar", {
        bar: "baz"
      }
    ],
    bar: {
      baz: "boo"
    },
    field: "some whatever value",
    lvl0: {
      lvl1: [
        {
          lvl2: {
            lvlN: 451
          }
        }
      ]
    }
  }

  const actual = objectFromEntries([
    [
      ["foo", 0], 42
    ],
    [
      ["foo", 1], "bar"
    ],
    [
      ["foo", 2, "bar"], "baz"
    ],
    [
      ["bar", "baz"], "boo"
    ],
    [
      ["field"], "some whatever value"
    ],
    [
      ["lvl0", "lvl1", 0, "lvl2", "lvlN"], 451
    ]
  ])

  t.deepEqual(actual, expected)
})

test("Should resolve a complex object", t => {
  t.plan(1)

  const expected = {
    subjects: [
      {
        firstName: "John",
        lastName: "Doe",
        dob: {
          day: 1,
          month: "Jan.",
          year: 1989
        },
        skills: ["Node.js", "CoffeeScript", "JavaScript", "Babel"]
      }, {
        firstName: "Max",
        lastName: "Doe",
        dob: {
          day: 12,
          month: "Mar.",
          year: 1992
        },
        skills: ["Python", "Flask", "JavaScript", "Babel", "React", "Redux"]
      }
    ]
  }

  const actual = objectFromEntries([
    [
      ["subjects", 0, "firstName"], "John"
    ],
    [
      ["subjects", 0, "lastName"], "Doe"
    ],
    [
      ["subjects", 0, "dob", "day"], 1
    ],
    [
      ["subjects", 0, "dob", "month"], "Jan."
    ],
    [
      ["subjects", 0, "dob", "year"], 1989
    ],
    [
      ["subjects", 0, "skills", 0], "Node.js"
    ],
    [
      ["subjects", 0, "skills", 1], "CoffeeScript"
    ],
    [
      ["subjects", 0, "skills", 2], "JavaScript"
    ],
    [
      ["subjects", 0, "skills", 3], "Babel"
    ],

    [
      ["subjects", 1, "firstName"], "Max"
    ],
    [
      ["subjects", 1, "lastName"], "Doe"
    ],
    [
      ["subjects", 1, "dob", "day"], 12
    ],
    [
      ["subjects", 1, "dob", "month"], "Mar."
    ],
    [
      ["subjects", 1, "dob", "year"], 1992
    ],
    [
      ["subjects", 1, "skills", 0], "Python"
    ],
    [
      ["subjects", 1, "skills", 1], "Flask"
    ],
    [
      ["subjects", 1, "skills", 2], "JavaScript"
    ],
    [
      ["subjects", 1, "skills", 3], "Babel"
    ],
    [
      ["subjects", 1, "skills", 4], "React"
    ],
    [
      ["subjects", 1, "skills", 5], "Redux"
    ]
  ])

  t.deepEqual(actual, expected)
})
