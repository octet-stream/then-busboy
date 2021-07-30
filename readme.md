# then-busboy

Promise-based wrapper around Busboy. Processes multipart/form-data request body and returns it in a single object.

[![Code Coverage](https://codecov.io/github/octet-stream/then-busboy/coverage.svg?branch=master)](https://codecov.io/github/octet-stream/then-busboy?branch=master)
[![CI](https://github.com/octet-stream/then-busboy/workflows/CI/badge.svg)](https://github.com/octet-stream/then-busboy/actions/workflows/ci.yml)
[![ESLint](https://github.com/octet-stream/then-busboy/workflows/ESLint/badge.svg)](https://github.com/octet-stream/then-busboy/actions/workflows/eslint.yml)

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

then-busboy is framework agnostic module, which means you can use it with different HTTP frameworks, or you can choose to use it pure Node.js HTTP server to hanlde `multipart/form-data` requests.

Let's take a look at the example with `http` module from Node.js.
We'll write a simple server that will parse form-data request, read files content and then send them back as JSON:

```js
import {createServer} from "http"
import {parse} from "then-busboy"

const handler = (req, res) => parse(req)
  .then(async body => {
    const result = []

    for (const [path, value] of body) {
      result.push([path, isFile(value) ? await value.text() : value])
    }

    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify(Body.json(result)))
  })
  .catch(error => {
    res.statusCode = error.status || 500
    res.end(error.message)
  })

createServer(handler)
  .listen(2319, () => console.log("Server started on http://localhost:2319"))
```

**Note:** You can use [asynchronous function](https://github.com/tc39/ecmascript-asyncawait) syntax,
because then-busboy always returns a Promise.

So, let's see on a simple middleware example for [Koa.js](https://koajs.com):

```js
import {parse} from "then-busboy"

const toLowerCase = string => String.prototype.toLowerCase.call(string)

async function multipart(ctx, next) {
  if (["post", "put"].includes(toLowerCase(ctx.method)) === false) {
    return next()
  }

  if (ctx.is("multipart/form-data") === false) {
    return next()
  }

  const body = await parse(ctx.req)

  ctx.request.body = body.json()

  return next()
}

export default multipart
```

## API

### `parse(request[, options]) -> {Promise<Body>}`

+ **http.IncomingMessage** request – HTTP request object
+ **{object}** [options = {}]
  - **{boolean}** castTypes – allow to restore type of each value (default – true)
  - more information about busboy options [here](https://github.com/mscdex/busboy#busboy-methods).

### `class Body`

##### `constructor(entries) -> {Body}`

Create an object that allows to manipulate FormData fields taken `then-busboy`

#### Static methods

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

##### `length -> {number}`

Return an amount of entries and files in current Body instance

#### Instance methods

##### `fields() -> {Body}`

Return a new Body that contains **fields** only

##### `files() -> {Body}`

Return a new Body that contains **files** only

##### `json() -> {object}`

Return an object with data taken the current Body instance

##### `formData() -> {FormData}`

Return a FormData with data taken the current Body instance

##### `entries() -> {Array<[string[], any]>}`

Return an array of entries in current Body instance

##### `values() -> {Iterator}`

Return an iterator allows to go through the Body values

##### `keys() -> {Iterator}`

Return an iterator allows to go through the Body fields path

### `interface BodyFile`

This interface reflects internal representation of a File. It is not meant to be constructed manually, but since it's compatible with files from the browsers, you can use these in Body if you need to.

#### Instance properties

##### `name`

Contains original name of file taken from the filename property within the form-data.

##### `type`

File MIME type

##### `enc`

Contains a value from transfer encoding header

##### `path`

Path to the file on disk

#### Instance methods

##### `stream() -> {Readable}`

Returns a Readable stream allowing to consume file's content

### `class BodyField`

BodyField class in the internal representation of a regular FormData value.

##### `constructor(value: unknown, name: string[, options]) -> {BodyField}`

Creates a new instance of the BodyField class.

#### Instance properties

##### `name`

Returns the name of the field.

##### `fieldnameTruncated`

Indicates whether the fieldname was truncated.

##### `valueTruncated`

Indicates whether the value was truncated.

##### `enc`

Returns a value from Content-Transfer-Encoding header.

##### `type`

Returns a value from Content-Type header.

#### Instance methods

##### `valueOf() -> {unknown}`

Returns the value of the BodyField.

##### `toString() -> {string}`

Returns string representation of the BodyField value.

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

When`limits` options are set, `then-busboy` may reject with HTTP 413 error if specified limit(s) exceeded. That will be a regular error from object [`http-errors`](https://npmjs.com/http-errors) package.

## Related links

* [formdata-node](https://github.com/octet-stream/form-data) is an async-iterator and steam based [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) implementation for Node.js
* [@octetstream/object-to-form-data](https://github.com/octet-stream/object-to-form-data) converts JavaScript object to FormData.

## License

[MIT](https://github.com/octet-stream/then-busboy/blob/master/LICENSE)
