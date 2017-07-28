Stream = require "stream"
{createReadStream} = require "fs"
{basename} = require "path"

test = require "ava"
co = require "co"

File = require "../../lib/File"

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
