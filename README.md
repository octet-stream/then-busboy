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

## API

### busboy(request[, options]) -> Promise

* http.IncomingMessage **request** – HTTP request object
* object **options**
  - **boolean** restoreTypes – allow to restore type of each value (default – true)
  - more information about busboy options [here](https://github.com/mscdex/busboy#busboy-methods).

### constructor File(options)

  - **object** options – an object that contains the following information about file:
    + **stream.Readable** contents – the content of the file.
    + **string** filename – name of the file (with an extension)
    + **string** env – encoding of the file content
    + **string** mime – file mime type

#### Instance properties

##### contents

##### filename

##### basename

##### extname

##### mime

##### enc

#### Instance methods

##### read() => Promise<Buffer>

Read a file from contents stream.

##### write([path]) => Promise<void>

Write a file content to disk. Optionally you can set a custom path.
By default, file will be saved in system temporary directory `os.tmpdir()`.

## Usage

Just import `then-busboy` and pass `request` object as first argument.

```js
import busboy from "then-busboy"
import {createServer} from "http"

function handler(req, res) {
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

createServer(handler)
  .listen(2319, () => console.log("Server started on http://localhost:2319"))
```

`then-busboy` always returns a Promise, so you can use it with
[asynchronous function](https://github.com/tc39/ecmascript-asyncawait) syntax:

```js
// Some of your awesome code with async workflow...
const data = await busboy(req)
```

## License

[MIT](https://github.com/octet-stream/then-busboy/blob/master/LICENSE)
