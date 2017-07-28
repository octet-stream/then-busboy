File = require "../File"

getFieldPath = require "../util/getFieldPath"

onFile = (options, cb) -> (fieldname, contents, filename, enc, mime) ->
  file = new File {
    contents
    filename
    mime
    enc
  }

  path = getFieldPath fieldname

  cb null, [
    path,
    file
  ]

module.exports = onFile
