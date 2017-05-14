test = require "ava"
co = require "co"

proxyquire = require "proxyquire"
sinon = require "sinon"
shortid = require "shortid"
request = require "supertest"
isPlainObject = require "lodash.isplainobject"
{basename, extname} = require "path"
{IncomingMessage, createServer} = require "http"
{Socket} = require "net"
{tmpDir, tmpdir} = require "os"
{readFile, access} = require "promise-fs"

errors = require "./errors"

tmpdir ?= tmpDir
shortidSpy = sinon.spy shortid
busboy = proxyquire ".", shortid: shortidSpy

test.beforeEach (t) ->
  multipartHeaderMock = "
    multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
  "

  serverMock = (op) -> createServer (req, res) ->
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
      .then onFulfilled
      .catch onRejected

  reqMock = do ->
    req = new IncomingMessage new Socket readeble: on
    req.headers =
      "content-type": multipartHeaderMock
    req.method = "POST"
    return req

  t.context = {
    multipartHeaderMock
    serverMock
    reqMock
  }

# Error classes tests
test "
  HttpException should have default error message and code if they not passed
",
(t) ->
  t.plan 2

  err = new errors.HttpException

  t.is err.message, "Internal Server Error"
  t.is err.code, "EHTTP_INTERNAL_SERVER_ERROR"

test "
  RequestEntityTooLargeException should have default error message and code
  if they not passed
",
(t) ->
  t.plan 2

  err = new errors.RequestEntityTooLargeException

  t.is err.message, "Request Entity Too Large"
  t.is err.code, "EHTTP_REQUEST_ENTITY_TOO_LARGE"

# then-busboy tests
test "Should be a function", (t) ->
  t.plan 1

  t.is typeof busboy, "function"

test "Should return a promise", (t) ->
  t.plan 1

  bb = busboy t.context.reqMock
  t.is bb.constructor.name, "Promise"

  t.context.reqMock.emit "end"

test "Should throw an error if non-object value passed as 2nd argument", (t) ->
  t.plan 1

  t.throws busboy(t.context.reqMock, "not object"),
    "Options argument must be a plain object."

  t.context.reqMock.emit "end"

  yield return

test "
  Should throw an error if request parameter isn't an instance of
  http.IncomingMessage
",
co.wrap (t) ->
  t.plan 1

  yield t.throws busboy({}), "
    Request parameter must be an instance of http.IncomingMessage.
  "

test "Should return a plain object", co.wrap (t) ->
  t.plan 1

  {body} = yield request do t.context.serverMock
    .post "/"
    .set "content-type", t.context.multipartHeaderMock

  t.true isPlainObject(body), "Request should always return a plain object"

test "Should return files and fields in two different objects", co.wrap (t) ->
  t.plan 1

  {body} = yield request t.context.serverMock on
    .post "/"
    .set "content-type", t.context.multipartHeaderMock

  t.deepEqual body, {fields: {}, files: {}}

test "Should return a valid string field", co.wrap (t) ->
  t.plan 3

  {body} = yield request do t.context.serverMock
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .field "someValue", "In Soviet Moon, landscape see binoculars through you."

  t.true "someValue" of body, "Result should contain someValue field"
  t.is typeof body.someValue, "string", "someValue field should be a string"
  t.is body.someValue, "In Soviet Moon, landscape see binoculars through you.",
    "someValue field should contain a valid message in the string"

test "Should rescue types", co.wrap (t) ->
  t.plan 4

  {body: {
    nullValue, falseValue,
    trueValue, numberValue
  }} = yield request do t.context.serverMock
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

test "Should return a valid object", co.wrap (t) ->
  t.plan 1

  {body} = yield request do t.context.serverMock
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .field "subject[firstName]", "John"
    .field "subject[lastName]", "Doe"
    .field "subject[dob][day]", "1"
    .field "subject[dob][month]", "Jan."
    .field "subject[dob][year]", "1970"
    .field "subject[skills][]", "Node.js"
    .field "subject[skills][]", "CoffeeScript"
    .field "subject[skills][]", "JavaScript"
    .field "subject[skills][]", "Babel"

  t.deepEqual body, subject:
    firstName: "John"
    lastName: "Doe"
    dob:
      day: 1
      month: "Jan."
      year: 1970
    skills: [
      "Node.js"
      "CoffeeScript"
      "JavaScript"
      "Babel"
    ]

test "Should return a valid collection", co.wrap (t) ->
  t.plan 1

  {body} = yield request do t.context.serverMock
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .field "subjects[0][firstName]", "John"
    .field "subjects[0][lastName]", "Doe"
    .field "subjects[0][dob][day]", "1"
    .field "subjects[0][dob][month]", "Jan."
    .field "subjects[0][dob][year]", "1989"
    .field "subjects[0][skills][]", "Node.js"
    .field "subjects[0][skills][]", "CoffeeScript"
    .field "subjects[0][skills][]", "JavaScript"
    .field "subjects[0][skills][]", "Babel"
    .field "subjects[1][firstName]", "Max"
    .field "subjects[1][lastName]", "Doe"
    .field "subjects[1][dob][day]", "12"
    .field "subjects[1][dob][month]", "Mar."
    .field "subjects[1][dob][year]", "1992"
    .field "subjects[1][skills][]", "Python"
    .field "subjects[1][skills][]", "Flask"
    .field "subjects[1][skills][]", "JavaScript"
    .field "subjects[1][skills][]", "Babel"
    .field "subjects[1][skills][]", "React"
    .field "subjects[1][skills][]", "Redux"

  t.deepEqual body, subjects: [
    {
      firstName: "John"
      lastName: "Doe"
      dob:
        day: 1
        month: "Jan."
        year: 1989
      skills: [
        "Node.js"
        "CoffeeScript"
        "JavaScript"
        "Babel"
      ]
    }
    {
      firstName: "Max"
      lastName: "Doe"
      dob:
        day: 12
        month: "Mar."
        year: 1992
      skills: [
        "Python"
        "Flask"
        "JavaScript"
        "Babel"
        "React"
        "Redux"
      ]
    }
  ]

test "Should return an error when fields limit reached", co.wrap (t) ->
  t.plan 2

  {error} = yield request t.context.serverMock limits: fields: 1
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .field "nullValue", "null"
    .field "someExtraField", "Some value"

  t.is error.status, 413, "Status should be 413"
  t.is error.text, "RequestEntityTooLargeException: Fields limit reached",
    "Error text should contain a valid message"

test "Should return an error when parts limit reached", co.wrap (t) ->
  t.plan 2

  {error} = yield request t.context.serverMock limits: parts: 1
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .field "someKey", "Some value"
    .attach "license", "LICENSE"

  t.is error.status, 413, "Status should be 413"
  t.is error.text, "RequestEntityTooLargeException: Parts limit reached",
    "Error text should contain a valid message"

test "Should return an error when files limit reached", co.wrap (t) ->
  t.plan 2

  {error} = yield request t.context.serverMock limits: files: 1
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .attach "readme", "README.md"
    .attach "license", "LICENSE"

  t.is error.status, 413, "Status should be 413"
  t.is error.text, "RequestEntityTooLargeException: Files limit reached",
    "Error text should contain a valid message"

test "Should return error if Top-level field name is not a string",
co.wrap (t) ->
  t.plan 2

  {error} = yield request do t.context.serverMock
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .field "", "You shall not pass!"

  t.is error.status, 500, "Status should be 500"
  t.is error.text, "TypeError: Top-level field name must be a string",
    "Error text should contain a valid message"

test "
  Should return error if Top-level field name of file is not a string
",
co.wrap (t) ->
  t.plan 2

  {error} = yield request do t.context.serverMock
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .attach "", "LICENSE"

  t.is error.status, 500, "Status should be 500"
  t.is error.text, "TypeError: Top-level field name must be a string",
    "Error text should contain a valid message"

test "Should create a temp file when file was attached", co.wrap (t) ->
  t.plan 1

  {body: {license}} = yield request do t.context.serverMock
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .attach "license", "LICENSE"

  try
    yield access license.path
    do t.pass
  catch err
    do t.fail

test "
  Temp file should be stored in operating system's
  default directory for temporary files
",
co.wrap (t) ->
  t.plan 1

  {body: {license}} = yield request do t.context.serverMock
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .attach "license", "LICENSE"

  t.true license.path.startsWith do tmpdir

test "
  Temp file should contain generated shortId
  and should end with original extension
",
co.wrap (t) ->
  t.plan 2

  {body: {file}} = yield request do t.context.serverMock
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .attach "file", "README.md"

  shortId = basename file.path, '.md'
  extension = extname file.path

  t.true shortidSpy.returned shortId
  t.is extension, ".md"

test "Temp file should have original file contents", co.wrap (t) ->
  t.plan 1

  {body: {license}} = yield request do t.context.serverMock
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .attach "license", "LICENSE"

  tmpFileContents = yield readFile license.path, 'utf8'
  licenseContents = yield readFile 'LICENSE', 'utf8'
  t.is tmpFileContents, licenseContents

# then-busboy mime-types validation
test "Should process only allowed mimes", co.wrap (t) ->
  t.plan 1

  op =
    mimes:
      ignoreUnallowed: yes
      allowed:
        text: ["x-markdown"]

  {serverMock} = t.context

  {body} = yield request serverMock op
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .attach "license", "LICENSE"
    .attach "readme", "README.md"

  t.deepEqual Object.keys(body), ["readme"],
    "Should response only README.md file"

test "
  Should return an error on unallowed type when ignoreUnallowed is not set
",
co.wrap (t) ->
  t.plan 2

  op = mimes: text: ["x-markdown"]

  {serverMock} = t.context

  {error} = yield request serverMock op
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .attach "license", "LICENSE"
    .attach "readme", "README.md"

  t.is error.status, 400, "Should have status 400 (Bad request)"
  t.is error.text,
    "Unallowed Mime: Unknown mime type: application/octet-stream",
    "Error text should contain a valid message"

test "Should validate given mime-type even if it is not an array",
co.wrap (t) ->
  t.plan 2

  op = mimes: text: "x-markdown"

  {serverMock} = t.context

  {body, status} = yield request serverMock op
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .attach "readme", "README.md"

  t.is status, 200, "Should have have 200 (OK)"

  t.deepEqual Object.keys(body), ["readme"],
    "Should response README.md file"

test "Should validate given mime-type by an array of patterns",
co.wrap (t) ->
  t.plan 2

  serverMock = t.context.serverMock

  {body, status} = yield request serverMock mimes: allowed: ["text/*"]
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .attach "readme", "README.md"

  t.is status, 200, "Should have have 200 (OK)"

  t.deepEqual Object.keys(body), ["readme"],
    "Should response README.md file"

test "Should validate mime when pattern passed as string", co.wrap (t) ->
  t.plan 2

  serverMock = t.context.serverMock

  {body, status} = yield request serverMock mimes: "text/*"
    .post "/"
    .set "content-type", t.context.multipartHeaderMock
    .attach "readme", "README.md"

  t.is status, 200, "Should have have 200 (OK)"

  t.deepEqual Object.keys(body), ["readme"],
    "Should response README.md file"

test "Should throw a TypeError when mimes option is not a valid type", (t) ->
  t.plan 1

  t.throws busboy(t.context.reqMock, mimes: 42), "
    The \"mimes\" parameter should be a plain object.
  "

  t.context.reqMock.emit "end"
