# then-busboy

Promise-based wrapper around Busboy. Processes multipart/form-data content and returns it as a single object.

[![Build Status](https://travis-ci.org/octet-stream/then-busboy.svg?branch=master)](https://travis-ci.org/octet-stream/then-busboy)
[![Code Coverage](https://codecov.io/github/octet-stream/then-busboy/coverage.svg?branch=master)](https://codecov.io/github/octet-stream/then-busboy?branch=master)
[![dependencies Status](https://david-dm.org/octet-stream/then-busboy/status.svg)](https://david-dm.org/octet-stream/then-busboy)
[![devDependencies Status](https://david-dm.org/octet-stream/then-busboy/dev-status.svg)](https://david-dm.org/octet-stream/then-busboy?type=dev)

## Installation

You can install `then-busboy` from npm:

```
npm install --save then-busboy
```

Or with yarn:

```
yarn add then-busboy
```

## Usage

then-busboy works fine even with a pure Node.js HTTP server.
Let's take a look to the tiny example:

```js
import parse from "then-busboy"

import {createServer} from "http"

function handler(req, res) {
  // Get result from then-busboy
  function onFulfilled(body) {
    res.writeHead("Content-Type", "application/json")

    // You can also do something with each file and a field.
    res.end(JSON.stringify(body.json()))
  }

  // Handle errors
  function onRejected(err) {
    res.statusCode = err.status || 500
    res.end(String(err))
  }

  // Call `then-busboy` with `req`
  parse(req).then(onFulfilled, onRejected)
}

createServer(handler)
  .listen(2319, () => console.log("Server started on http://localhost:2319"))
```

**Note:** You can use [asynchronous function](https://github.com/tc39/ecmascript-asyncawait) syntax,
because then-busboy always returns a Promise.

So, let's see on a simple middleware example for [Koa.js](https://koajs.com):

```js
import {promises as fs} from "fs"

import {parse} from "then-busboy"

const toLowerCase = string => String.prototype.toLowerCase.call(string)

const unlinkFile = ({path}) => fs.unlink(path)

async function multipart(ctx, next) {
  if (["post", "put"].includes(toLowerCase(ctx.method)) === false) {
    return next()
  }

  if (ctx.is("multipart/form-data") === false) {
    return next()
  }

  const body = await parse(ctx.req)

  ctx.request.body = body.json()

  await next()

  // Cleanup files
  return Promise.all(Array.from(body.files().values()).map(unlinkFile))
    .catch(err => err.code !== "ENOENT" && Promise.reject(err))
}

export default multipart
```

## API

**Breaking change**: Since 4.x version then-busboy returns a Body object instead of raw data.
For more information check out the [Usage](https://github.com/octet-stream/then-busboy#usage) section of documentation
and take a look at [Body](https://github.com/octet-stream/then-busboy#constructor-bodyentries) class in API section.

### `parse(request[, options]) -> {Promise<Body>}`

+ **http.IncomingMessage** request – HTTP request object
+ **{object}** [options = {}]
  - **{boolean}** restoreTypes – allow to restore type of each value (default – true)
  - more information about busboy options [here](https://github.com/mscdex/busboy#busboy-methods).

### `constructor Body(entries)`

Create an object that allows to manipulate FormData fields taken `then-busboy`

#### Static methods

##### `isBody(value) -> {boolean}`

Check if given value is instance of Body

  - **{any}** value – a value to verify

##### `from(entries) -> {Body}`

Create a new Body from given entries. An alias of `new Body(entries)`

  - **{Array<[string[], any]>}** entries – an array of Body initial path-value pairs taken from `then-busboy`

##### `json(value) -> {object}`

Return an object with data taken from given entries or Body

  - **{Body | Array<[string[], any]>}** – return an object from given Body or entries

##### `formData(value) -> {FormData}`

Return a FormData instance with data taken from given entries or Body

  - **{Body | Array<[string[], any]>}** – return an FormData from given Body or entries

#### Instance properties

##### `get length() -> {number}`

Return an amount of entries and files in current Body instance

##### `get fields() -> {Body}`

Return a new Body that contains **fields** only

##### `get files() -> {Body}`

Return a new Body that contains **files** only

#### Instance methods

##### `json() -> {object}`

Return an object with data taken the current Body instance

##### `formData() -> {FormData}`

Return a FormData with data taken the current Body instance

##### `map(callback[, ctx]) -> {Body}`

Create a new Body with the results of calling a provided function on every entry in the calling Body

  - **{function}** callback – Function to execute for each entry. It accepts four arguments:
    + **{any}** value – A value(s) of the current entry.
    + **{string}** name – Name of the current entry.
    + **{string[]}** path – Path of the current entry.
    + **{Array<[string[], any]>}** entries – An array of entries of the current Body instance
  - **{any}** [ctx = null] – Value to use as **this** context when executing the given **callback**

##### `filter(predicate[, ctx]) -> {Body}`

Create a new Body with all entries that pass the test implemented in given function

  - **{function}** predicate – Function is a predicate, to test each entry of the Body. Return `true` to keep the entry, `false` otherwise. It accepts four arguments:
    + **{any}** value – A value(s) of the current entry.
    + **{string}** name – Name of the current entry.
    + **{string[]}** path – Path of the current entry.
    + **{Array<[string[], any]>}** entries – An array of entries of the current Body instance
  - **{any}** [ctx = null] – Value to use as **this** context when executing the given **callback**

##### `forEach(callback[, ctx]) -> {Body}`

Execute a given callback for each entry of the Body instance

  - **{function}** callback – Function to execute for each entry, taking four arguments:
    + **{any}** value – A value(s) of the current entry.
    + **{string}** name – Name of the current entry.
    + **{string[]}** path – Path of the current entry.
    + **{Array<[string[], any]>}** entries – An array of entries of the current Body instance
  - **{any}** [ctx = null] – Value to use as **this** context when executing the given **callback**

##### `entries() -> {Array<[string[], any]>}`

Return an array of entries in current Body instance

##### `values() -> {Iterator}`

Return an iterator allows to go through the Body values

##### `names() -> {Iterator}`

Return an iterator allows to go through the Body fields name

##### `paths() -> {Iterator}`

Return an iterator allows to go through the Body fields path

### `constructor File(options)`

  - **{object}** options – an object that contains the following information about file:
    + **{stream.Readable}** contents – the content of the file.
    + **{string}** filename – name of the file (with an extension)
    + **{string}** env – encoding of the file content
    + **{string}** mime – file mime type

#### Static methods

##### `isFile(value) -> {boolean}`

Check if given value is a File instance.

  - **{any}** value – a value to verify

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

## Fields format

then-busboy can restore an object structure from form-data field names
if you will follow the naming formats with dots or square brackets:

### Dot notation

This notation looks similarly to JS object properties accessiong syntax:

```
# Flat objects looks the same in both notations
# Note that the following notation examples is just a pseudo code
name = "John Doe"
age = 25
```

then-busboy will return the this object for an example from above:

```json5
{
  name: "John Doe",

  // By default, non-string values will be converted to their initial type.
  // So, "25" -> 25, "null" -> null, "false" -> false etc.
  age: 25
}
```

For deep objects or collections, use dot or brackets as a separator.
**But don't mix them.**

```
  rootField.nestedField = "Some text here"
```

```json5
 {
  rootField: {
    nestedField: "Some text here"
  }
 }
```

### Bracket notation

```
rootField[nestedField] = "I beat Twilight Sparkle and all I got was this lousy t-shirt"
```

Becomes

```json5
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

```json5
{
  message: {
    sender: "John Doe",
    text: "Some whatever text message.",
    attachments: [
      {
        "file": File, // this field will be represended as a File instance
        "description": "Here is a description of the file"
      }
    ]
  }
}
```

Collections allowed too:

```
[0][firstName] = "John"
[0][lastName] = "Doe"
[0][dob][day] = "1"
[0][dob][month] = "Jan."
[0][dob][year] = "1989"
[0][skills][0] = "Node.js"
[0][skills][1] = "CoffeeScript"
[0][skills][2] = "JavaScript"
[0][skills][3] = "Babel"
[1][firstName] = "Max"
[1][lastName] = "Doe"
[1][dob][day] = "12"
[1][dob][month] = "Mar."
[1][dob][year] = "1992"
[1][skills][0] = "Python"
[1][skills][1] = "Flask"
[1][skills][2] = "JavaScript"
[1][skills][3] = "Babel"
[1][skills][4] = "React"
[1][skills][5] = "Redux"
```

Then you will receive:

```json5
[
  {
    firstName: "John",
    lastName: "Doe",
    dob: {
      day: 1,
      month: "Jan.",
      year: 1989
    },
    skills: ["Node.js", "CoffeeScript", "JavaScript", "Babel"]
  }, {
    firstName: "Max",
    lastName: "Doe",
    dob: {
      day: 12,
      month: "Mar.",
      year: 1992
    },
    skills: ["Python", "Flask", "JavaScript", "Babel", "React", "Redux"]
  }
]
```

## Limits

On limits (if some of them set) `then-busboy` will throw an error,
there are exposed classes that you can use to handle each kind of limit errors:

- FieldSizeLimitError - on field size limit reached
- FieldsLimitError - on fields limit reached
- FileSizeLimitError - on file size limit reached
- FilesLimitError - on files limit reached
- PartsLimitError - on parts (both files and fields) limit reached

## Related links

* [formdata-node](https://github.com/octet-stream/form-data) is an async-iterator and steam based [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) implementation for Node.js
* [@octetstream/object-to-form-data](https://github.com/octet-stream/object-to-form-data) converts JavaScript object to FormData.

## License

[MIT](https://github.com/octet-stream/then-busboy/blob/master/LICENSE)
