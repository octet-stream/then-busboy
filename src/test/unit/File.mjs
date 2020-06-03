import path from "path"

import test from "ava"
import fs from "promise-fs"

import File from "lib/File"

test("Should create a File with given stream and metadata", t => {
  const stream = fs.createReadStream(__filename)

  const filename = path.basename(__filename)

  const ext = path.extname(__filename)
  const base = path.basename(__filename, ext)

  const file = new File({
    stream,
    filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  t.true(file instanceof File)
  t.true(file.stream() instanceof fs.ReadStream)
  t.is(file.mime, "text/javascript")
  t.is(file.enc, "utf-8")
  t.is(file.filename, filename)
  t.is(file.basename, base)
  t.is(file.extname, ext)
})

test("Should return a correct string on inspect call", t => {
  const stream = fs.createReadStream(__filename)

  const filename = path.basename(__filename)

  const file = new File({
    stream,
    filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  t.is(file.inspect(), `[File: ${filename}]`)
})

test("Should return a correct string on toJSON call", t => {
  const stream = fs.createReadStream(__filename)

  const filename = path.basename(__filename)

  const file = new File({
    stream,
    filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  t.is(file.toJSON(), `[File: ${filename}]`)
})

test("Should return a correct string on toString call", t => {
  const stream = fs.createReadStream(__filename)

  const filename = path.basename(__filename)

  const file = new File({
    stream,
    filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  t.is(file.toString(), `[File: ${filename}]`)
})

test("Should return a correct string on String call", t => {
  const stream = fs.createReadStream(__filename)

  const filename = path.basename(__filename)

  const file = new File({
    stream,
    filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  t.is(String(file), `[File: ${filename}]`)
})

test("Should return a correct string on JSON.stringify call", t => {
  const stream = fs.createReadStream(__filename)

  const filename = path.basename(__filename)

  const file = new File({
    stream,
    filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  t.is(JSON.stringify({file}), "{\"file\":\"[File: File.js]\"}")
})

test("Should throw an error when no contents given", t => {
  const trap = () => new File({})

  const err = t.throws(trap)

  t.true(err instanceof Error)
  t.is(err.message, "File contents required.")
})

test("Should throw an error when contents is not a Stream", t => {
  const trap = () => new File({stream: "Winter is coming..."})

  const err = t.throws(trap)

  t.true(err instanceof TypeError)
  t.is(err.message, "Contents should be a ReadStream stream. Received string")
})

test("Should throw an error when no filename given", t => {
  const trap = () => new File({stream: fs.createReadStream(__filename)})

  t.throws(trap, {message: "Filename required."})
})

test("Should throw an error when filename is not a string", t => {
  const trap = () => new File({
    stream: fs.createReadStream(__filename),
    filename: 42
  })

  t.throws(trap, {message: "Filename should be a string. Received number"})
})

test("Should throw an error when no enc given", t => {
  const trap = () => new File({
    stream: fs.createReadStream(__filename),
    filename: path.basename(__filename)
  })

  t.throws(trap, {message: "File encoding required."})
})

test("Should throw an error when enc is not a string", t => {
  const trap = () => new File({
    stream: fs.createReadStream(__filename),
    filename: path.basename(__filename),
    enc: []
  })

  t.throws(trap, {message: "File encoding should be a string. Received array"})
})

test("Should throw an error when no mime given", t => {
  const trap = () => new File({
    stream: fs.createReadStream(__filename),
    filename: path.basename(__filename),
    enc: "utf-8"
  })

  t.throws(trap, {message: "File mime type required."})
})

test("Should throw an error when mime is not a string", t => {
  const trap = () => new File({
    stream: fs.createReadStream(__filename),
    filename: path.basename(__filename),
    enc: "utf-8",
    mime: /.*/
  })

  t.throws(trap, {
    message: "File mime type should be a string. Received RegExp"
  })
})
