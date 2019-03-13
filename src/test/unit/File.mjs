import {Writable} from "stream"
import {basename, extname} from "path"
import {createReadStream, ReadStream} from "fs"

import test from "ava"

import pq from "proxyquire"

import {spy} from "sinon"
import {readFile} from "promise-fs"

import File from "lib/File"

test("Should create a File with given stream and metadata", t => {
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
  t.true(file.contents instanceof ReadStream)
  t.true(file.stream instanceof ReadStream)
  t.is(file.mime, "text/javascript")
  t.is(file.enc, "utf-8")
  t.is(file.filename, filename)
  t.is(file.basename, base)
  t.is(file.extname, ext)
})

test("Should return a correct string on inspect call", t => {
  const contents = createReadStream(__filename)

  const filename = basename(__filename)

  const file = new File({
    contents,
    filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  t.is(file.inspect(), `[File: ${filename}]`)
})

test("Should return a correct string on toJSON call", t => {
  const contents = createReadStream(__filename)

  const filename = basename(__filename)

  const file = new File({
    contents,
    filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  t.is(file.toJSON(), `[File: ${filename}]`)
})

test("Should return a correct string on toString call", t => {
  const contents = createReadStream(__filename)

  const filename = basename(__filename)

  const file = new File({
    contents,
    filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  t.is(file.toString(), `[File: ${filename}]`)
})

test("Should return a correct string on String call", t => {
  const contents = createReadStream(__filename)

  const filename = basename(__filename)

  const file = new File({
    contents,
    filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  t.is(String(file), `[File: ${filename}]`)
})

test("Should return a correct string on JSON.stringify call", t => {
  const contents = createReadStream(__filename)

  const filename = basename(__filename)

  const file = new File({
    contents,
    filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  t.is(JSON.stringify({file}), "{\"file\":\"[File: File.js]\"}")
})

test("Should correctly read given file from Stream", async t => {
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

test("Should write file to disk", async t => {
  const noop = spy()

  function createWriteStream(path, options) {
    const bufs = []
    let len = 0

    function write(ch, enc, cb) {
      bufs.push(ch)
      len += ch.length

      noop(path, Buffer.concat(bufs, len), cb)
    }

    const stream = new Writable({
      ...options, write
    })

    return stream
  }

  const MockedFile = pq("../../lib/File", {
    fs: {
      createWriteStream
    }
  }).default

  const expected = await readFile(__filename)

  const contents = createReadStream(__filename)

  const filename = basename(__filename)

  const file = new MockedFile({
    contents,
    filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  await file.write()

  const actual = noop.lastCall.args[1]

  t.true(actual.equals(expected))
})

test("Should write file to given path", async t => {
  const noop = spy()

  function createWriteStream(path, options) {
    const write = () => void noop(path)

    const stream = new Writable({
      ...options, write
    })

    return stream
  }

  const MockedFile = pq("../../lib/File", {
    fs: {
      createWriteStream
    }
  }).default

  const expected = "some/whatever/path"

  const contents = createReadStream(__filename)

  const filename = basename(__filename)

  const file = new MockedFile({
    contents,
    filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  await file.write(expected)

  const [actual] = noop.lastCall.args

  t.is(actual, expected)
})

test("Should throw an error when no contents given", t => {
  const trap = () => new File({})

  const err = t.throws(trap)

  t.true(err instanceof Error)
  t.is(err.message, "File contents required.")
})

test("Should throw an error when contents is not a Stream", t => {
  const trap = () => new File({contents: "Winter is coming..."})

  const err = t.throws(trap)

  t.true(err instanceof TypeError)
  t.is(err.message, "Contents should be a ReadStream stream. Received string")
})

test("Should throw an error when no filename given", t => {
  const trap = () => new File({contents: createReadStream(__filename)})

  t.throws(trap, "Filename required.")
})

test("Should throw an error when filename is not a string", t => {
  const trap = () => new File({
    contents: createReadStream(__filename),
    filename: 42
  })

  t.throws(trap, "Filename should be a string. Received number")
})

test("Should throw an error when no enc given", t => {
  const trap = () => new File({
    contents: createReadStream(__filename),
    filename: basename(__filename)
  })

  t.throws(trap, "File encoding required.")
})

test("Should throw an error when enc is not a string", t => {
  const trap = () => new File({
    contents: createReadStream(__filename),
    filename: basename(__filename),
    enc: []
  })

  t.throws(trap, "File encoding should be a string. Received array")
})

test("Should throw an error when no mime given", t => {
  const trap = () => new File({
    contents: createReadStream(__filename),
    filename: basename(__filename),
    enc: "utf-8"
  })

  t.throws(trap, "File mime type required.")
})

test("Should throw an error when mime is not a string", t => {
  const trap = () => new File({
    contents: createReadStream(__filename),
    filename: basename(__filename),
    enc: "utf-8",
    mime: /.*/
  })

  t.throws(trap, "File mime type should be a string. Received RegExp")
})

test(
  "File#write should throw a TypeError when given path is not a string",
  async t => {
    const contents = createReadStream(__filename)

    const filename = basename(__filename)

    const file = new File({
      contents,
      filename,
      mime: "text/javascript",
      enc: "utf-8"
    })

    const err = await t.throws(file.write(42))

    t.true(err instanceof TypeError)
    t.is(err.message, "Path must be a string.")
  }
)
