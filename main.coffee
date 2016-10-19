"use strict"

Promise = require "pinkie-promise"
Busboy = require "busboy"

shortid = require "shortid"
{tmpDir} = require "os"
{extname} = require "path"
{IncomingMessage} = require "http"
{Readable} = require "stream"
{createReadStream, createWriteStream} = require "fs"

{
  PartsLimitException, FieldsLimitException, FilesLimitException
} = require "./errors"

isPlainObject = require "lodash.isplainobject"
assign = Object.assign or require "lodash.assign"
merge = require "lodash.merge"

reduceRight = Array::reduceRight or (args...) ->
  require("lodash.reduceRight")(this, args...)

includes = String::includes or (sub) ->
  String::indexOf.call(this, sub) > -1

###
# @api private
###
mapListeners = (listeners, fn) ->
  fn __name, __handler for own __name, __handler of listeners
  return

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

###
# Rescue target object structure
#
# @param object obj
# @param object target
#
# @return object
#
# @api private
###
rescueObjStruct = (obj, target) ->
  [key] = Object.keys obj
  val = obj[key]

  res = if "#{Number key}" is "NaN" then {} else []
  if isPlainObject(target) and key of target
    res[key] = rescueObjStruct val, target[key]
  else
    if Array.isArray target
      res = [target...]
      if not res[key] or Number key
        if isPlainObject val
          res[key] = rescueObjStruct val, res[key]
        else
          res[key] = val
      else
        if isPlainObject val
          res = rescueObjStruct val, res[key]
        else
          res.push val
    else
      res[key] = val

  return merge target, res

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
    unless "#{Number keys}" is "NaN"
      throw new TypeError "Top-level field name must be a string"

    target[fieldname] = rescueTypes value
    return target

  res = reduceRight.call keys, reducer, rescueTypes value
  target = rescueObjStruct res, target
  return target

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

  onField = (name, value) ->
    try
      fields = getObjFields fields, name, value
    catch err
      return reject err

  onFile = (fieldname, stream, filename, enc, mime) ->
    tmpPath = "#{do tmpDir}/#{do shortid}#{extname filename}"
    onFileStreamEnd = ->
      file = createReadStream tmpPath
      file.originalName = filename
      file.enc = enc
      file.mime = mime
      try
        files = getObjFields files, fieldname, file
      catch err
        return reject err

    stream
      .on "end", onFileStreamEnd
      .pipe createWriteStream tmpPath

  onError = (err) -> reject err

  onPartsLimit = -> onError new PartsLimitException "Parts limit reached"

  onFieldsLimit = -> onError new FieldsLimitException "Fields limit reached"

  onFilesLimit = -> onError new FilesLimitException "Files limit reached"

  # Just for automate adding/removing listeners
  listeners =
    error: onError
    field: onField
    file: onFile
    partsLimit: onPartsLimit
    filesLimit: onFilesLimit
    fieldsLimit: onFieldsLimit
    finish: ->
      mapListeners listeners, bb.removeListener.bind bb
      resolve if op.split then {fields, files} else merge fields, files

  mapListeners listeners, bb.on.bind bb
  req.pipe bb

module.exports = exports.default = thenBusboy
