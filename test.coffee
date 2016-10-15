test = require "ava"
{IncomingMessage} = require "http"
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
