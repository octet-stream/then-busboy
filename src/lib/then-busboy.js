import {IncomingMessage} from "http"
import {join} from "path"

import invariant from "@octetstream/invariant"
import isPlainObject from "lodash.isplainobject"
import merge from "lodash.merge"
import Busboy from "busboy"

import map from "lib/util/mapListeners"
import getType from "lib/util/getType"
import readListeners from "lib/util/readListeners"
import objectFromEntries from "lib/util/objectFromEntries"

const initializers = readListeners(join(__dirname, "listener"))

const defaultOptions = {
  restoreTypes: true
}

/**
 * Promise-based wrapper around Busboy. Inspired by async-busboy.
 * You'll get exactly what you've sent from your client app.
 * All files and other fields in a single object.
 *
 * @param {http.IncomingMessage} request – HTTP request object
 * @param {object} options - then-busboy options
 *
 * @return {Promise<Object>}
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

  options = merge({}, defaultOptions, options)

  const headers = request.headers

  const busboy = new Busboy(request, {
    ...options, headers
  })

  const entries = []

  const fulfill = (err, entry) => void (err ? reject(err) : entries.push(entry))

  const listeners = map(initializers, fn => fn(options, fulfill))

  // Set listeners before starting
  void map(listeners, (fn, name) => busboy.on(name, fn))

  function onFinish() {
    // Cleanup listeners
    void map(listeners, (fn, name) => busboy.removeListener(name, fn))

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
