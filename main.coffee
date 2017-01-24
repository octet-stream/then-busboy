"use strict"

Busboy = require "busboy"
shortid = require "shortid"
{extname} = require "path"
{tmpdir, tmpDir} = require "os"
{IncomingMessage} = require "http"
{createReadStream, createWriteStream} = require "fs"
isPlainObject = require "lodash.isplainobject"

{
  PartsLimitException
  FieldsLimitException
  FilesLimitException
  UnallowedMime
} = require "./errors"

isArray = Array.isArray
assign = Object.assign
merge = require "lodash.merge"
isEmpty = require "lodash.isempty"

reduceRight = (arr, args...) -> Array::reduceRight.apply arr, args

tmpdir or= tmpDir

defaults =
  split: no
  mimes:
    ignoreUnallowed: no
    allowed: null

###
# @api private
###
mapListeners = (listeners, fn, ctx = null) ->
  fn.call ctx, name, handler for name, handler of listeners; return

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
  return Number value if value isnt "" and not isNaN value
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
    if isArray target
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
# Just a callback for Array#reduceRight method
#
# @param any prev
# @param any next
#
# @api private
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

  res = reduceRight keys, reducer, rescueTypes value
  target = rescueObjStruct res, target
  return target

###
# Check if current mime is allowed
#
# @param string current
# @param object
###
checkMime = (current, allowed) ->
  return yes if isEmpty allowed

  [group, type] = current.split "/"

  if isPlainObject allowed
    for k, v of allowed
      return group is k and v.includes type

  return no

###
# Promise-based wrapper around Busboy, inspired by async-busboy
#
# @param http.IncomingMessage req
# @param boolean|object
#
# @return Promise
#
# @api public
###
thenBusboy = (req, op = {}) -> new Promise (resolve, reject) ->
  unless req instanceof IncomingMessage
    throw new TypeError "
      Request parameter must be an instance of http.IncomingMessage.
    "

  unless isPlainObject op
    throw new TypeError "Options argument must be a plain object."

  op = assign {}, defaults, op

  fields = {}
  files = {}

  bb = new Busboy assign {}, {headers: req.headers}, op

  onField = (name, value) ->
    try
      fields = getObjFields fields, name, value
    catch err
      return reject err

  onFile = (fieldname, stream, filename, enc, mime) ->
    {mimes} = op

    unless isPlainObject mimes
      mimes = assign defaults.mimes, allowed: mimes

    unless "ignoreUnallowed" of mimes and "allowed" of mimes
      mimes = assign defaults.mimes, allowed: mimes

    {ignoreUnallowed, allowed} = mimes
    isAllowed = checkMime mime, allowed

    if ignoreUnallowed is off and isAllowed is no
      return onError new UnallowedMime "Unknown mime type: #{mime}"

    return stream.emit "end" unless isAllowed

    tmpPath = "#{do tmpdir}/#{do shortid}#{extname filename}"

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
      resolve if op.split then {fields, files} else merge {}, fields, files

  mapListeners listeners, bb.on, bb
  req.pipe bb
  return

module.exports = exports.default = thenBusboy
