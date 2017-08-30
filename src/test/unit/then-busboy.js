import test from "ava"

import busboy from "lib/then-busboy"

import mockHeader from "test/helper/mockHeader"
import mockRequest from "test/helper/mockRequest"
import mockServer from "test/helper/mockServer"

test("Should throw an error when no request object given", async t => {
  t.plan(3)

  const err = await t.throws(busboy())

  t.true(err instanceof TypeError)
  t.is(
    err.message,
    "Request should be an instanceof http.IncomingMessage. Received undefined"
  )
})

test(
  "Should throw an error when request object is not an http.IncomingMessage",
  async t => {
    t.plan(3)

    const err = await t.throws(busboy({}))

    t.true(err instanceof TypeError)
    t.is(
      err.message,
      "Request should be an instanceof http.IncomingMessage. Received object"
    )
  }
)

test(
  "Should throw an error when given options is not a plain object",
  async t => {
    t.plan(3)

    const err = await t.throws(
      busboy(mockRequest, "totally not a plain object")
    )

    t.true(err instanceof TypeError)
    t.is(err.message, "Options should be an object. Received string")
  }
)
