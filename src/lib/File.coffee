Stream = require "stream"

{createWriteStream} = require "fs"

defineProperty = Object.defineProperty

###
# @api private
###
class File
  constructor: ({contents, mime, enc, filename} = {}) ->
    unless contents instanceof Stream
      throw new TypeError "Contents should be a string"

    @__filename = filename
    @__contents = contents
    @__mime = mime
    @__enc = enc

    return

  ###
  # Read a file from stream
  #
  # @return {Promise<Buffer>}
  ###
  read: => new Promise (resolve, reject) =>
    data = []

    onData = (ch) -> data.push ch

    onEnd = -> resolve Buffer.concat data

    @contents
      .on "error", reject
      .on "data", onData
      .on "end", onEnd

    return

  ###
  # Write file to given destination path
  #
  # @param {string} path
  ###
  write: (path = @path) => new Promise (resolve, reject) =>
    unless path? or isString path
      return reject new TypeError "Path should be a non-empty string"

    @contents
      .on "error", reject
      .on "end", resolve
      .pipe createWriteStream path

    return

  inspect: -> "[File: #{@filename}]"

defineProperty File.prototype, "filename", get: -> @__filename

defineProperty File.prototype, "contents", get: -> @__contents

defineProperty File.prototype, "mime", get: -> @__mime

defineProperty File.prototype, "enc", get: -> @__enc

module.exports = File
