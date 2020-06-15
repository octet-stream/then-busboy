import http from "http"
import fs from "fs"

import toObject from "object-deep-from-entries"

const mockServer = busboy => options => http.createServer((req, res) => {
  async function transform(body) {
    const files = await Promise.all(body.files.entries().map(
      ([path, file]) => fs.promises.readFile(file.path).then(content => [
        path, String(content)
      ])
    ))

    return toObject([
      ...body.fields.entries().map(([path, {value}]) => [path, value]),
      ...files
    ])
  }

  function onFulfilled(data) {
    res.statusCode = 200
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify(data))
  }

  function onRejected(err) {
    res.statusCode = err.status || 500
    res.end(String(err))
  }

  busboy(req, options).then(transform).then(onFulfilled, onRejected)
})

export default mockServer
