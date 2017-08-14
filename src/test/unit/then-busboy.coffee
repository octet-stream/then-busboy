test = require "ava"

request = require "supertest"
co = require "co"

busboy = require "../../lib/then-busboy"

mockRequest = require "../helper/mockRequest"

test "Should throw an error when no HTTP request object given", co.wrap (t) ->
  t.plan 3

  err = yield t.throws do busboy

  t.true err instanceof TypeError
  t.is err.message,
    "Request parameter must be an instance of http.IncomingMessage."

test "
  Should throw an error when given HTTP request argument is not an
  http.IncomingMessage instance
",
co.wrap (t) ->
  t.plan 3

  err = yield t.throws busboy {}

  t.true err instanceof TypeError
  t.is err.message,
    "Request parameter must be an instance of http.IncomingMessage."

test "Should throw an error when given options is not an object", co.wrap (t) ->
  t.plan 3

  err = yield t.throws busboy mockRequest, ["totally not an object"]

  t.true err instanceof TypeError
  t.is err.message, "Options should be a plain JavaScript object."
