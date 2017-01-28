# then-busboy

Promise-based wrapper around Busboy, inspired by [async-busboy](https://github.com/m4nuC/async-busboy)

[![dependencies Status](https://david-dm.org/octet-stream/then-busboy/status.svg)](https://david-dm.org/octet-stream/then-busboy)
[![devDependencies Status](https://david-dm.org/octet-stream/then-busboy/dev-status.svg)](https://david-dm.org/octet-stream/then-busboy?type=dev)
[![Build Status](https://travis-ci.org/octet-stream/then-busboy.svg?branch=master)](https://travis-ci.org/octet-stream/then-busboy)
[![Code Coverage](https://codecov.io/github/octet-stream/then-busboy/coverage.svg?branch=master)](https://codecov.io/github/octet-stream/then-busboy?branch=master)

## Installation

Use can install `then-busboy` from npm:

```bash
npm install --save then-busboy
```

Or with yarn

```bash
yarn add then-busboy
```

## Usage

### busboy(request[, options]) -> Promise

* http.IncomingMessage **request** – HTTP request object
* object **options**
  - boolean **split** – If set as `true`, the `data`
      object will be split into two other objects: `fields` and `files`.
  - object **mimes** – list of allowed mime-types. This object contain two keys:
      * boolean **ignoreUnallowed** – if set as true, `then-busboy` will skip
          files with unmached mime-type (default = false, will throw an `UnallowedMime` exception);
      * object **allowed** – object of allowed mime-types:
        + string **group**
        + string|array **type**
  - more information about busboy options [here](https://github.com/mscdex/busboy#busboy-methods).

Just import `then-busboy` and pass `request` object as first argument.

For example:

```js
const busboy = require("then-busboy")
const createServer = require("http").createServer

function callback(req, res) {
  if (req.method === "GET") {
    res.statusCode = 404
    return res.end("Not Found")
  }

  if (req.method !== "POST") {
    res.statusCode = 405
    return res.end("Method Not Allowed")
  }

  // Get result from then-busboy
  function onFulfilled(data) {
    res.writeHead("Content-Type", "application/json")
    res.end(JSON.stringify(data))
  }

  // Handle errors
  function onRejected(err) {
    res.statusCode = err.status || 500
    res.end(String(err))
  }

  // Call `then-busboy` with `req`
  busboy(req).then(onFulfilled, onRejected)
}

createServer(callback)
  .listen(2319, () => console.log("Server started on http://localhost:2319"))
```

`then-busboy` always returns a Promise, so you can use it with
[asynchronous function](https://github.com/tc39/ecmascript-asyncawait) syntax:

```js
// Some of your awesome code with async workflow...
var data = await busboy(req)
```

And the same code, but with `split: true` option:

```js
var {fields, files} = await busboy(req, {split: true})
```

## License

[MIT](https://github.com/octet-stream/then-busboy/blob/master/LICENSE)
