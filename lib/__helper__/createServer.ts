import {createServer, Server} from "http"

import type {HttpError} from "http-errors"

import {Body, BodyRawEntries} from "../Body"
import type {parse, ParseOptions} from "../parse"

import isFile from "../util/isFile"

const createTestServer = (
  parser: typeof parse,
  options?: ParseOptions
): Server => createServer((req, res) => {
  parser(req, options)
    .then(async body => {
      const result: BodyRawEntries = []

      for (const [path, value] of body) {
        result.push([path, isFile(value) ? await value.text() : value])
      }

      res.setHeader("Content-Type", "application/json")
      res.end(JSON.stringify(Body.json(result)))
    })
    .catch((error: HttpError) => {
      res.statusCode = error.status || 500
      res.end(error.message)
    })
})

export default createTestServer
