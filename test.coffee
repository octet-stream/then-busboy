Promise = require "pinkie-promise"
test = require "ava"
request = require "supertest"
assign = require "lodash.assign"
isPlainObject = require "lodash.isplainobject"
fs = require "fs"
{IncomingMessage, createServer} = require "http"
{Socket} = require "net"
{tmpDir} = require "os"

busboy = require "."

test.beforeEach (t) ->
  multipartHeaderMock = "
    multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
  "

  serverMock = (split = no, limits = {}) -> createServer (req, res) ->
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

    busboy req, assign {}, {limits}, {split}
      .then onFulfilled
      .catch onRejected

  reqMock = do ->
    req = new IncomingMessage new Socket readeble: on
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

test "Should return a plain object", (t) ->
  {body} = await request do t.context.serverMock
    .post "/"
    .set "content-type", t.context.multipartHeaderMock

  t.true isPlainObject(body), "Request should always return a plain object"

test "Should return files and fields in two different objects", (t) ->
  {body} = await request t.context.serverMock on
    .post "/"
    .set "content-type", t.context.multipartHeaderMock

  t.deepEqual body, {fields: {}, files: {}}

test "Should return a valid string field", (t) ->
  {body} = await request do t.context.serverMock
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .field "someValue", "In Soviet Moon, landscape see binoculars through you."

  t.true "someValue" of body, "Result should contain someValue field"
  t.is typeof body.someValue, "string", "someValue field should be a string"
  t.is body.someValue, "In Soviet Moon, landscape see binoculars through you.",
    "someValue field should contain a valid message in the string"

test "Should rescue types", (t) ->
  t.plan 4

  {body: {
    nullValue, falseValue,
    trueValue, numberValue
  }} = await request do t.context.serverMock
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .field "nullValue", "null"
    .field "falseValue", "false"
    .field "trueValue", "true"
    .field "numberValue", "42"

  t.is nullValue, null
  t.is falseValue, no
  t.is trueValue, yes
  t.is numberValue, 42

test "Should return an error when fields limit reached", (t) ->
  {error} = await request t.context.serverMock null, fields: 1
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .field "nullValue", "null"
    .field "someExtraField", "Some value"

  t.is error.status, 413, "Status should be 413"
  t.is error.text, "RequestEntityTooLargeException: Fields limit reached",
    "Error text should contain a valid message"

test "Should return error if Top-level field name must be a string", (t) ->
  {error} = await request do t.context.serverMock
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .field "", "foo"

  t.is error.status, 500, "Status should be 500"
  t.is error.text, "TypeError: Top-level field name must be a string",
    "Error text should contatin a valid message"

test "Should create a temp file when file was attached", (t) ->
  { body } = await request do t.context.serverMock
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .attach "foo", "data"

  try
    fs.accessSync body.foo.path
    t.pass()
  catch e
    t.fail()

test "Temp file should be stored in operating system's default directory for temporary files", (t) ->
  { body } = await request do t.context.serverMock
  .post "/"
  .set "content-type", t.context.multipartHeaderMock
  .attach "foo", "data"

  t.is body.foo.path.indexOf(do tmpDir), 0

test "Temp file should have original file contents", (t) ->
  { body } = await request do t.context.serverMock
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .attach "foo", "data"

  t.is fs.readFileSync(body.foo.path, 'utf8'), fs.readFileSync('data', 'utf8')
