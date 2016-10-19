Promise = require "pinkie-promise"
proxyquire = require "proxyquire"
sinon = require "sinon"
shortid = require "shortid"
test = require "ava"
request = require "supertest"
assign = require "lodash.assign"
isPlainObject = require "lodash.isplainobject"
{basename, extname} = require "path"
fs = require "fs"
{IncomingMessage, createServer} = require "http"
{Socket} = require "net"
{tmpDir} = require "os"
{readFile, access} = require "promise-fs"

shortidSpy = sinon.spy(shortid)

busboy = proxyquire ".",
  shortid: shortidSpy

#require "."

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

test "Should throw an error if non-object value passed as 2nd argument", (t) ->
  t.throws busboy(t.context.reqMock, "not object"),
    "Options argument must be a plain object."
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

test "Should return an error when parts limit reached", (t) ->
  {error} = await request t.context.serverMock null, parts: 1
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .field "someKey", "Some value"
    .attach "license", "LICENSE"

  t.is error.status, 413, "Status should be 413"
  t.is error.text, "RequestEntityTooLargeException: Parts limit reached",
    "Error text should contain a valid message"

test "Should return an error when files limit reached", (t) ->
  {error, body} = await request t.context.serverMock null, files: 1
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .attach "readme", "README.md"
    .attach "license", "LICENSE"

  t.is error.status, 413, "Status should be 413"
  t.is error.text, "RequestEntityTooLargeException: Files limit reached",
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
  {body: {license}} = await request do t.context.serverMock
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .attach "license", "LICENSE"

  try
    await access license.path
    do t.pass
  catch err
    do t.fail

test "
  Temp file should be stored in operating system's 
  default directory for temporary files
", (t) ->

  {body: {license}} = await request do t.context.serverMock
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .attach "license", "LICENSE"

  t.true license.path.startsWith do tmpDir

test "
  Temp file should contain generated shortId
  and should end with original extension
", (t) ->

  {body: {file}} = await request do t.context.serverMock
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .attach "file", "README.md"

  shortId = basename file.path, '.md'
  extension = extname file.path

  t.true shortidSpy.returned shortId 
  t.is extension, ".md"

test "Temp file should have original file contents", (t) ->
  {body: {license}} = await request do t.context.serverMock
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .attach "license", "LICENSE"

  tmpFileContents = await readFile license.path, 'utf8'
  licenseContents = await readFile 'LICENSE', 'utf8'
  t.is tmpFileContents, licenseContents
