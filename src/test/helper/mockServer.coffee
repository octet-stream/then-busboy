{createServer} = require "http"

mockServer = (busboy) -> (options) -> createServer (req, res) ->
  if req.method is "GET"
    res.statusCode = 404
    return res.end "Not Found"

  unless req.method is "POST"
    res.statusCode = 405
    return res.end "Method Not Allowed"

  onFulfilled = (data) ->
    res.statusCode = 200
    res.setHeader "Content-Type", "application/json"
    res.end JSON.stringify data

  onRejected = (err) ->
    res.statusCode = err.status or 500
    res.end String err

  busboy req, op
    .then onFulfilled, onRejected

  return

module.exports = mockServer
