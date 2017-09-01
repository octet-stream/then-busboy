import Stream from "stream"

import {createReadStream} from "fs"
import {basename, extname, join} from "path"
import {tmpdir} from "os"

import test from "ava"

import pq from "proxyquire"
import nanoid from "nanoid"

import {spy} from "sinon"
import {readFile} from "promise-fs"

import File from "lib/File"

test("Should create a File with given stream and metadata", t => {
  t.plan(7)

  const contents = createReadStream(__filename)

  const filename = basename(__filename)

  const ext = extname(__filename)
  const base = basename(__filename, ext)

  const file = new File({
    contents,
    filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  t.true(file instanceof File)
  t.true(file.contents instanceof Stream)
  t.is(file.mime, "text/javascript")
  t.is(file.enc, "utf-8")
  t.is(file.filename, filename)
  t.is(file.basename, base)
  t.is(file.extname, ext)
})

test("Should have a correct default path", t => {
  const spyo = spy(nanoid)
  const spydir = spy(tmpdir)

  const File = pq("../../lib/File", {
    nanoid: spyo,
    os: {
      tmpdir: spydir
    }
  }).default

  const contents = createReadStream(__filename)
  const filename = basename(__filename)

  const file = new File({
    contents,
    filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  const expected = join(
    spydir.lastCall.returnValue, `${spyo.lastCall.returnValue}_${filename}`
  )

  t.is(file.path, expected)
})

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

test("Should throw an error when no contents given", t => {
  t.plan(3)

  const trap = () => new File({})

  const err = t.throws(trap)

  t.true(err instanceof Error)
  t.is(err.message, "File contents required.")
})

test("Should throw an error when contents is not a Stream", t => {
  t.plan(3)

  const trap = () => new File({contents: "Winter is coming..."})

  const err = t.throws(trap)

  t.true(err instanceof TypeError)
  t.is(err.message, "Contents should be a Stream. Received string")
})
