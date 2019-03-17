import stream from "stream"
import path from "path"

import test from "ava"
import sinon from "sinon"
import pq from "proxyquire"
import fs from "promise-fs"

import File from "lib/File"

test("Should create a File with given stream and metadata", t => {
  const contents = fs.createReadStream(__filename)

  const filename = path.basename(__filename)

  const ext = path.extname(__filename)
  const base = path.basename(__filename, ext)

  const file = new File({
    contents,
    filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  t.true(file instanceof File)
  t.true(file.contents instanceof fs.ReadStream)
  t.true(file.stream instanceof fs.ReadStream)
  t.is(file.mime, "text/javascript")
  t.is(file.enc, "utf-8")
  t.is(file.filename, filename)
  t.is(file.basename, base)
  t.is(file.extname, ext)
})

test("Should return a correct string on inspect call", t => {
  const contents = fs.createReadStream(__filename)

  const filename = path.basename(__filename)

  const file = new File({
    contents,
    filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  t.is(file.inspect(), `[File: ${filename}]`)
})

test("Should return a correct string on toJSON call", t => {
  const contents = fs.createReadStream(__filename)

  const filename = path.basename(__filename)

  const file = new File({
    contents,
    filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  t.is(file.toJSON(), `[File: ${filename}]`)
})

test("Should return a correct string on toString call", t => {
  const contents = fs.createReadStream(__filename)

  const filename = path.basename(__filename)

  const file = new File({
    contents,
    filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  t.is(file.toString(), `[File: ${filename}]`)
})

test("Should return a correct string on String call", t => {
  const contents = fs.createReadStream(__filename)

  const filename = path.basename(__filename)

  const file = new File({
    contents,
    filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  t.is(String(file), `[File: ${filename}]`)
})

test("Should return a correct string on JSON.stringify call", t => {
  const contents = fs.createReadStream(__filename)

  const filename = path.basename(__filename)

  const file = new File({
    contents,
    filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  t.is(JSON.stringify({file}), "{\"file\":\"[File: File.js]\"}")
})

test("Should correctly read given file from Stream", async t => {
  const contents = fs.createReadStream(__filename)

  const filename = path.basename(__filename)

  const file = new File({
    contents,
    filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  const expected = await fs.readFile(__filename)

  const actual = await file.read()

  t.true(actual.equals(expected))
})

test("Should write file to disk", async t => {
  const noop = sinon.spy()

  function createWriteStream(filename, options) {
    const bufs = []
    let len = 0

    function write(ch, enc, cb) {
      bufs.push(ch)
      len += ch.length

      noop(filename, Buffer.concat(bufs, len), cb)
    }

    const writable = new stream.Writable({
      ...options, write
    })

    return writable
  }

  const MockedFile = pq("../../lib/File", {
    fs: {
      createWriteStream
    }
  }).default

  const expected = await fs.readFile(__filename)

  const contents = fs.createReadStream(__filename)

  const filename = path.basename(__filename)

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
  const noop = sinon.spy()

  function createWriteStream(filename, options) {
    const write = () => void noop(filename)

    const writable = new stream.Writable({
      ...options, write
    })

    return writable
  }

  const MockedFile = pq("../../lib/File", {
    fs: {
      createWriteStream
    }
  }).default

  const expected = "some/whatever/path"

  const contents = fs.createReadStream(__filename)

  const filename = path.basename(__filename)

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
  const trap = () => new File({contents: fs.createReadStream(__filename)})

  t.throws(trap, "Filename required.")
})

test("Should throw an error when filename is not a string", t => {
  const trap = () => new File({
    contents: fs.createReadStream(__filename),
    filename: 42
  })

  t.throws(trap, "Filename should be a string. Received number")
})

test("Should throw an error when no enc given", t => {
  const trap = () => new File({
    contents: fs.createReadStream(__filename),
    filename: path.basename(__filename)
  })

  t.throws(trap, "File encoding required.")
})

test("Should throw an error when enc is not a string", t => {
  const trap = () => new File({
    contents: fs.createReadStream(__filename),
    filename: path.basename(__filename),
    enc: []
  })

  t.throws(trap, "File encoding should be a string. Received array")
})

test("Should throw an error when no mime given", t => {
  const trap = () => new File({
    contents: fs.createReadStream(__filename),
    filename: path.basename(__filename),
    enc: "utf-8"
  })

  t.throws(trap, "File mime type required.")
})

test("Should throw an error when mime is not a string", t => {
  const trap = () => new File({
    contents: fs.createReadStream(__filename),
    filename: path.basename(__filename),
    enc: "utf-8",
    mime: /.*/
  })

  t.throws(trap, "File mime type should be a string. Received RegExp")
})

test(
  "File#write should throw a TypeError when given path is not a string",
  async t => {
    const contents = fs.createReadStream(__filename)

    const filename = path.basename(__filename)

    const file = new File({
      contents,
      filename,
      mime: "text/javascript",
      enc: "utf-8"
    })

    const err = await t.throwsAsync(file.write(42))

    t.true(err instanceof TypeError)
    t.is(err.message, "Path must be a string.")
  }
)
