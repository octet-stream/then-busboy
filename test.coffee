test = require "ava"
request = require "supertest"
{IncomingMessage, createServer} = require "http"
{Socket} = require "net"

busboy = require "."

test.beforeEach (t) ->
  multipartHeaderMock = "
    multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
  "

  serverMock = (split = no) -> createServer (req, res) ->
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

    busboy req, {split}
      .then onFulfilled
      .catch onRejected

  reqMock = do ->
    req = new IncomingMessage new Socket({readeble: true})
    req.headers =
      "content-type": "
        multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
      "
    req.method = "POST"
    return req

  t.context = {
    multipartHeaderMock
    serverMock
    reqMock
  }

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

test "Should return a correct string field", (t) ->
  {body} = await request do t.context.serverMock
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .field "someValue", "In Soviet Moon, landscape see binoculars through you."

  t.true "someValue" of body, "Result should contain someValue field"
  t.is typeof body.someValue, "string", "someValue should be a string"
  t.is body.someValue, "In Soviet Moon, landscape see binoculars through you.",
    "someValue should contain a valid message in string"
