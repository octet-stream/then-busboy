import {createReadStream} from "fs"
import {basename} from "path"

import test from "ava"

import {readFile} from "promise-fs"

import File from "lib/File"

test("Should correctly read given file from Stream", async t => {
  t.plan(1)

  const contents = createReadStream(__filename)

  const filename = basename(__filename)

  const file = new File({
    contents,
    filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  const expected = await readFile(__filename)

  const actual = await file.read()

  t.true(actual.equals(expected))
})
