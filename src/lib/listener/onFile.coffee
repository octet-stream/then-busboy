File = require "vinyl"

getFieldPath = require "../util/getFieldPath"

onFile = (options, cb) -> (fieldname, stream, filename, enc, mime) ->
  file = new File contents: stream

  extra = {
    filename
    mime
    enc
  }

  file[name] = prop for own name, prop of extra when not name of file

  cb null, [fieldname, file]

module.exports = onFile
