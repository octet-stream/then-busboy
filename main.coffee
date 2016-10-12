"use strict"

Promise = require "pinkie-promise"
Busboy = require "busboy"

shortid = require "shortid"
isPlainObject = require "lodash.isplainobject"
assign = Object.assign or require "lodash.assign"
reduce = Array::reduce or (args...) -> require("lodash.reduce")([this, args...])
includes = String::includes or (sub) -> String::indexOf.call(this, sub) > -1
{tmpDir} = require "os"
{extname} = require "path"
{IncomingMessage} = require "http"
{createReadStream, createWriteStream} = require "fs"

###
# @api private
###
mapListeners = (listeners, fn) ->
  fn __name, __handler for __name, __handler of listeners

###
# Trying to rescue field value actual type from string
#
# @param string value
#
# @api private
###
rescueTypes = (value) ->
  return value unless typeof value is "string"
  return null if value is "null"
  return false if value is "false"
  return true if value is "true"
  return Number value if "#{Number value}" isnt "NaN" and value isnt ""
  return value

rescueObjStruct = (obj, target) ->
  [key] = Object.keys obj
  val = obj[key]

  if key of target
    res = if "#{Number key}" is "NaN" then {} else []
    res[key] = rescueObjStruct val, target[key]
    # console.log res
  else
    res = if "#{Number key}" is "NaN" then {} else [target...]
    res[key] = val
    # console.log res

  # return assign {}, target, res
  return res

###
# Extract keys from fieldname
#
# @param string str
#
# @return array
#
# @api private
###
extractKeys = (str) ->
  unless str.includes "["
    return str

  return str.split "["
    .map (v) -> v.replace "]", ""

###
# Just a callback for Array#reduce method
#
# @param any prev
# @param any next
###
reducer = (prev, next) ->
  if "#{Number next}" is "NaN"
    return "#{next}": prev
  else
    arr = []
    arr[Number next] = prev
    return arr

###
# @param object target
# @param string fieldname
# @param any value
#
# @api private
###
getObjFields = (target, fieldname, value) ->
  keys = extractKeys fieldname
  if typeof keys is "string"
    return assign {}, target, {"#{fieldname}": rescueTypes value}

  res = reduce.call (do keys.reverse), reducer, rescueTypes value
  return rescueObjStruct res, target

###
# Promise-based wrapper around Busboy, inspired by async-busboy
#
# @param http.IncomingMessage req
# @param object
#
# @return Promise
#
# @api public
###
thenBusboy = (req, op = {split: no}) -> new Promise (resolve, reject) ->
  unless req instanceof IncomingMessage
    throw new TypeError "
      Request parameter must be an instance of http.IncomingMessage.
    "

  unless isPlainObject op
    throw new TypeError "Options argument must be a plain object."

  fields = {}
  files = {}

  bb = new Busboy assign {}, {headers: req.headers}, op

  onField = (name, value) -> fields = getObjFields fields, name, value

  onFile = (fieldname, stream, filename, enc, mime) ->
    tmpPath = "#{do tmpDir}/#{do shortid}#{extname filename}"
    onFileStreamEnd = ->
      file = createReadStream tmpPath
      file.originalName = filename
      file.enc = enc
      file.mime = mime
      files = getObjFields files, fieldname, file

    stream
      .on "end", onFileStreamEnd
      .pipe createWriteStream tmpPath

  onError = (err) -> reject err

  # Just for automate adding/removing listeners
  listeners =
    error: onError
    field: onField
    file: onFile
    finish: ->
      console.log {fields, files}
      mapListeners listeners, bb.removeListener.bind bb
      resolve if op.split then {fields, files} else assign {}, fields, files

  mapListeners listeners, bb.on.bind bb
  req.pipe bb

module.exports = exports.default = thenBusboy
