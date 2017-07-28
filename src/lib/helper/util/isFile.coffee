File = require "../../File"

###
# Check if given value is an internal then-busboy File
#
# @param any value
#
# @return boolean
###
isFile = (value) -> value instanceof File

module.exports = isFile
module.exports.default = isFile
