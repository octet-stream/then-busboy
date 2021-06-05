import {pipeline as cbPipe} from "stream"
import {createWriteStream} from "fs"
import {promisify} from "util"
import {tmpdir} from "os"
import {join} from "path"

import {nanoid} from "nanoid"
import {fileFromPath} from "formdata-node"

import {OnFileInitializer} from "./Initializers"

import {BodyFileDataItem} from "../BodyFileDataItem"

import getFieldPath from "../util/getFieldPath"
import createError from "../util/requestEntityTooLarge"

const pipe = promisify(cbPipe)

const createOnFile: OnFileInitializer = ({limits}, ee) => (
  fieldname,
  stream,
  filename,
  enc,
  mime
) => {
  const path = join(tmpdir(), `${nanoid()}__${filename}`)
  const dest = createWriteStream(path)

  ee.emit("entry:register")

  async function onFulfilled() {
    const fieldPath = getFieldPath(fieldname)
    const file = await fileFromPath(path, filename, {type: mime})

    ee.emit(
      "entry:push",

      [fieldPath, new BodyFileDataItem({file, path, enc})]
    )
  }

  function onLimit() {
    stream.unpipe()

    ee.emit(
      "error",

      createError(
        `File size limit exceeded: Available up to ${
          limits!.fileSize
        } bytes per file.`
      )
    )
  }

  function onRejected(error: Error) {
    stream.unpipe()

    ee.emit("error", error)
  }

  // Hope this will work when using with pipeline
  stream.on("limit", onLimit)

  pipe(stream, dest).then(onFulfilled).catch(onRejected)
}

export default createOnFile
