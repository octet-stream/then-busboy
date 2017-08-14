"use strict"

{IncomingMessage} = require "http"
{tmpdir} = require "os"
{join} = require "path"

Busboy = require "busboy"

isPlainObject = require "lodash.isplainobject"
shortid = require "shortid"
merge = require "lodash.merge"
rd = require "require-dir"

objectFromEntries = require "./util/objectFromEntries"
setListeners = require "./util/setListeners"

assign = Object.assign

defaults =
  allow: "*/*"

listeners = rd join __dirname, "listener"

###
# Promise-based wrapper around Busboy, inspired by async-busboy
#
# @param {http.IncomingMessage} req
# @param {object} options
#
# @return {Promise<object>}
#
# @throws {TypeError} on invalid arguments
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

  entries = []

  onEnd = -> resolve objectFromEntries entries

  fulfill = (err, entry) -> if err? then reject err else entries.push entry

  # set listeners here
  bb = setListeners bb, listeners, options, fulfill

  bb.on "end", onEnd

  # ...and then, start pipe request stream to Busboy
  req.pipe bb

  return

exports.default = module.exports = thenBusboy
