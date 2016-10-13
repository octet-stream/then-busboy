test = require "ava"
{IncomingMessage} = require "http"
{Socket} = require "net"

busboy = require "."

test "Should return a plain object", (t) ->
  do t.pass
  await return

test "Should return a promise", (t) ->
  t.is busboy(request()) instanceof Promise, true

test "Should throw an error if request parameter isn't an instance of http.IncomingMessage", (t)->
  t.throws(busboy({}), "Request parameter must be an instance of http.IncomingMessage.")

request = ()->
  req = new IncomingMessage new Socket({readeble: true})
  req.headers =
    'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryoyYHBQpNew47X0cp'
  req.method = 'POST'
  req




