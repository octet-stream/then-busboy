import {IncomingMessage} from "http"
import {join} from "path"

import invariant from "@octetstream/invariant"
import isPlainObject from "lodash.isplainobject"
import rd from "require-dir"
import Busboy from "busboy"

import each from "lib/util/eachListener"
import getType from "lib/util/getType"
import objectFromEntries from "lib/util/objectFromEntries"

const listeners = rd(join(__dirname, "listener"))

/**
 * Promise-based wrapper around Busboy. Inspired by async-busboy.
 * You'll get exactly what you've sent from your client app.
 * All files and other fields in a single object/collection.
 *
 * @param {http.IncomingMessage} request – HTTP request object
 * @param {object} options - then-busboy options
 *
 * @return {Promise<object|any[]>}
 */
const thenBusboy = (request, options = {}) => new Promise((resolve, reject) => {
  invariant(
    !(request instanceof IncomingMessage), TypeError,
    "Request should be an instanceof http.IncomingMessage. Received %s",
    getType(request)
  )

  invariant(
    !isPlainObject(options), TypeError,
    "Options should be an object. Received %s", getType(options)
  )

  const headers = request.headers

  const busboy = new Busboy(request, {
    ...options, headers
  })

  const entries = []

  const fulfill = (err, entry) => err ? reject(err) : entries.push(entry)

  // Set listeners before starting
  each(busboy, listeners, (bb, name, fn) => bb.on(name, fn(options, fulfill)))

  function onFinish() {
    // Cleanup listeners
    each(busboy, listeners, (bb, name) => bb.removeListener(name))

    try {
      return resolve(objectFromEntries(entries))
    } catch (err) {
      return reject(err)
    }
  }

  busboy
    .on("error", reject)
    .on("finish", onFinish)

  request.pipe(busboy)
})

export default thenBusboy
