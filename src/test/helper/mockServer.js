import {createServer} from "http"

const mockServer = busboy => options => createServer((req, res) => {
  function onFulfilled(data) {
    res.statusCode = 200
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify(data))
  }

  function onRejected(err) {
    res.statusCode = err.status || 500
    res.end(String(err))
  }

  busboy(req, options).then(onFulfilled, onRejected)
})

export default mockServer
