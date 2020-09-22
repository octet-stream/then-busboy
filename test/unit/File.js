const path = require("path")

const test = require("ava")
const fs = require("promise-fs")

const File = require("../../lib/File")

test("Should create a File with given stream and metadata", t => {
  const ext = path.extname(__filename)
  const base = path.basename(__filename, ext)

  const file = new File({
    originalFilename: __filename,
    path: __filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  t.true(file instanceof File)
  t.true(file.stream() instanceof fs.ReadStream)
  t.is(file.mime, "text/javascript")
  t.is(file.enc, "utf-8")
  t.is(file.filename, path.basename(__filename))
  t.is(file.basename, base)
  t.is(file.extname, ext)
})

test("Should return a correct string on inspect call", t => {
  const filename = path.basename(__filename)

  const file = new File({
    originalFilename: __filename,
    path: __filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  t.is(file.inspect(), `[File: ${filename}]`)
})

test("Should return a correct string on toJSON call", t => {
  const file = new File({
    originalFilename: __filename,
    path: __filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  t.is(file.toJSON(), `[File: ${path.basename(__filename)}]`)
})

test("Should return a correct string on toString call", t => {
  const file = new File({
    originalFilename: __filename,
    path: __filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  t.is(file.toString(), `[File: ${path.basename(__filename)}]`)
})

test("Should return a correct string on String call", t => {
  const file = new File({
    originalFilename: __filename,
    path: __filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  t.is(String(file), `[File: ${path.basename(__filename)}]`)
})

test("Should return a correct string on JSON.stringify call", t => {
  const file = new File({
    originalFilename: __filename,
    path: __filename,
    mime: "text/javascript",
    enc: "utf-8"
  })

  t.is(JSON.stringify({file}), "{\"file\":\"[File: File.js]\"}")
})
