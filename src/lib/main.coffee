"use strict"

{IncomingMessage} = require "http"
{tmpdir} = require "os"
{join} = require "path"

Busboy = require "busboy"

isPlainObject = require "lodash.isplainobject"
shortid = require "shortid"
merge = require "lodash.merge"
rd = require "require-dir"

mapFromPath = require "./helper/util/mapFromPath"
setListeners = require "./helper/util/setListeners"

assign = Object.assign

defaults = {}

listeners = rd join __dirname, "listeners"

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
thenBusboy = (req, options = {}) -> new Promise (resolve, reject) ->
  unless req instanceof IncomingMessage
    throw new TypeError "
      Request parameter must be an instance of http.IncomingMessage.
    "

  unless isPlainObject options
    throw new TypeError "Options should be a plain JavaScript object."

  options = merge {}, defaults, options

  headers = req.headers

  bb = new Busboy assign {}, options, {headers}

  onFinish = -> resolve {}

  onError = (err) -> reject err

  # set listeners here
  bb = setListeners bb, listeners, assign {}, options

  # ...and then, start pipe request stream to Busboy
  req.pipe bb
  return

exports.default = module.exports = thenBusboy
