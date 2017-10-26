# then-busboy

Promise-based wrapper around Busboy. Process multipart/form-data content and returns it as a single object.

[![dependencies Status](https://david-dm.org/octet-stream/then-busboy/status.svg)](https://david-dm.org/octet-stream/then-busboy)
[![devDependencies Status](https://david-dm.org/octet-stream/then-busboy/dev-status.svg)](https://david-dm.org/octet-stream/then-busboy?type=dev)
[![Build Status](https://travis-ci.org/octet-stream/then-busboy.svg?branch=master)](https://travis-ci.org/octet-stream/then-busboy)
[![Code Coverage](https://codecov.io/github/octet-stream/then-busboy/coverage.svg?branch=master)](https://codecov.io/github/octet-stream/then-busboy?branch=master)

Note: The current documentation is for 2.x version of then-busboy.
If you're looking for a previous version, check out the [1.x branch](https://github.com/octet-stream/then-busboy/tree/1.x).

## Installation

You can install `then-busboy` from npm:

```
npm install --save then-busboy
```

Or with yarn:

```
yarn add then-busboy
```

## API

### `busboy(request[, options]) -> {Promise<object>}`

+ **http.IncomingMessage** request – HTTP request object
+ **{object}** [options = {}]
  - **{boolean}** restoreTypes – allow to restore type of each value (default – true)
  - more information about busboy options [here](https://github.com/mscdex/busboy#busboy-methods).

### `constructor File(options)`

  - **{object}** options – an object that contains the following information about file:
    + **{stream.Readable}** contents – the content of the file.
    + **{string}** filename – name of the file (with an extension)
    + **{string}** env – encoding of the file content
    + **{string}** mime – file mime type

#### Instance properties

##### `contents`

File contents Readable stream.

##### `stream`

Alias for [File#contents](#contents)

##### `filename`

Full name of the file

##### `basename`

Name of the file without extension

##### `extname`

File extension

##### `mime`

File mime type

##### `enc`

File contents encoding

##### `path`

Default path of the file

#### Instance methods

##### `read() => {Promise<Buffer>}`

Read a file from contents stream.

##### `write([path]) => {Promise<void>}`

Write a file content to disk. Optionally you can set a custom path.

  - **{string}** [path = [File#path](#path)] – a path where File content should be saved. (default – [File#path](#path))

By default, file will be saved in system temporary directory `os.tmpdir()`.
You can take this path from [path](#path) property.

### `isFile(value) -> {boolean}`

Check if given value is a File instance.

  - **{any}** value – a value to verify

## Fields format

then-busboy can restore an object structure from form-data field names
if you will follow the special naming format with bracket notation:

```
# Note that the following example is just a pseudo code
rootField[nestedField] = "I beat Twilight Sparkle and all I got was this lousy t-shirt"
```

then-busboy will return the this object for an example from above:

```js
{
  rootField: {
    nestedField: "I beat Twilight Sparkle and all I got was this lousy t-shirt"
  }
}
```

You can also send an arrays and collections using bracket format:

```
message[sender] = "John Doe"
message[text] = "Some whatever text message."
message[attachments][0][file] = <here is the file content>
message[attachments][0][description] = "Here is a description of the file"
```

then-busboy returns the following object:

```js
{
  message: {
    sender: "John Doe",
    text: "Some whatever text message.",
    attachments: [
      {
        file: File, // this field will be represended as a File instance
        description: "Here is a description of the file"
      }
    ]
  }
}
```

**Note that there is no an implementation for array as *root field* for now!**

## Usage

then-busboy works fine even with a pure Node.js HTTP server.
Let's take a look to the tiny example:

```js
import busboy from "then-busboy"
import {createServer} from "http"

function handler(req, res) {
  // Get result from then-busboy
  function onFulfilled(body) {
    res.writeHead("Content-Type", "application/json")

    // You can also do something with each file and a field.
    res.end(JSON.stringify(body))
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

**Note:** You can use [asynchronous function](https://github.com/tc39/ecmascript-asyncawait) syntax,
because then-busboy always returns a Promise.

So, let's see on a simple middleware example for Koa.js:

```js
import busboy from "then-busboy"

const toLowerCase = string => String.prototype.toLowerCase.call(string)

const multipart = () => async (ctx, next) => {
  if (["post", "put"].includes(toLowerCase(ctx.method)) === false) {
    return await next()
  }

  if (ctx.is("multipart/form-data") === false) {
    return await next()
  }

  ctx.request.body = await busboy(ctx.req)

  await next()
}

export default multipart
```

You can check if some value is an instance of File class using `isFile`.
This function may help you if you're wanted to do something
with received files automatically.

```js
import busboy, {isFile} from "then-busboy"

let body = await busboy(request)

body = await deepMapObject(
  body, async val => (
    isFile(val) // check if current element is a File
      ? await processFile(val) // do somethig with a file
      : val // ...or just return a field
  )
)
```

## License

[MIT](https://github.com/octet-stream/then-busboy/blob/master/LICENSE)
