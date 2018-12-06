import {join} from "path"

import Busboy from "busboy"

import map from "../util/mapListeners"
import readListeners from "../util/readListeners"

const initializers = readListeners(join(__dirname, "..", "listener"))

/**
 * @api private
 */
const runBusboy = (request, options) => new Promise((resolve, reject) => {
  const entries = []
  const busboy = new Busboy(request, options)

  const fulfill = (err, entry) => err ? reject(err) : entries.push(entry)

  const listeners = map(initializers, fn => fn(options, fulfill))

  const unsubscribe = () => (
    map(listeners, (fn, name) => busboy.removeListener(name, fn))
  )

  function onFinish() {
    unsubscribe()
    resolve(entries)
  }

  function onError(err) {
    unsubscribe()
    reject(err)
  }

  map(listeners, (fn, name) => busboy.on(name, fn))

  busboy
    .once("error", onError)
    .once("finish", onFinish)

  request.pipe(busboy)
})

export default runBusboy
