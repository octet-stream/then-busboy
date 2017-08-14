Stream = require "stream"

{createReadStream} = require "fs"
{basename} = require "path"

test = require "ava"

co = require "co"
pq = require "proxyquire"

{readFile} = require "promise-fs"

File = pq "../../lib/File",
  fs:
    createWriteStream: ->
      pipe: => this
      on: => this


test "Should create a File with given stream and metadata", (t) ->
  t.plan 5

  stream = createReadStream __filename

  filename = basename __filename

  file = new File {
    contents: stream
    mime: "text/javascript"
    enc: "utf-8"
    filename
  }

  t.true file instanceof File
  t.true file.contents instanceof Stream
  t.is file.mime, "text/javascript"
  t.is file.enc, "utf-8"
  t.is file.filename, filename

test "Should correctly read given file from Stream", co.wrap (t) ->
  t.plan 1

  stream = createReadStream __filename

  filename = basename __filename

  file = new File {
    contents: stream
    mime: "text/javascript"
    enc: "utf-8"
    filename
  }

  expectedContents = yield readFile __filename

  actualContents = yield do file.read

  t.true actualContents.equals expectedContents

test.todo "
  Write a test for File#write method and find a way to mock a write stream
"

test "Should throw an error when given contents is not a Stream", (t) ->
  t.plan 3

  trap = -> new File contents: {}

  err = t.throws trap

  t.true err instanceof TypeError
  t.is err.message, "Contents should be a Stream."
