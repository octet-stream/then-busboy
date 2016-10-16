test = require "ava"
request = require "supertest"
{IncomingMessage, createServer} = require "http"
{Socket} = require "net"

busboy = require "."

test.beforeEach (t) ->
  t.context.reqMock = do ->
    req = new IncomingMessage new Socket({readeble: true})
    req.headers =
      "content-type": "
        multipart/form-data; boundary=----WebKitFormBoundaryoyYHBQpNew47X0cp
      "
    req.method = "POST"
    return req

  t.context.serverMock = createServer (req, res) ->
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

    busboy req, split: on
      .then onFulfilled
      .catch onRejected

test "Should be a function", (t) ->
  t.is typeof busboy, "function"
  await return

test "Should return a promise", (t) ->
  bb = busboy t.context.reqMock
  t.true bb instanceof Promise
  await return

test "
  Should throw an error if request parameter isn't an instance of 
  http.IncomingMessage
", (t) ->
  t.throws busboy({}), "
    Request parameter must be an instance of http.IncomingMessage.
  "
  await return
