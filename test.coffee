test = require "ava"
{IncomingMessage} = require "http"
Stream =  require "stream"
{Socket} = require "net"

busboy = require "."

test "Should return a plain object", (t) ->
  do t.pass
  await return

test "Should return a promise", (t) ->
  req = request()
  bb = busboy(req)
  t.is bb instanceof Promise, true

request = ()->

  req = new IncomingMessage new Socket({readeble: true})
  req.headers =
    'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryoyYHBQpNew47X0cp'
  req.method = 'POST'
  req




