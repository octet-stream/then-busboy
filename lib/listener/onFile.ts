import {createWriteStream} from "fs"
import {tmpdir} from "os"
import {join} from "path"

import {nanoid} from "nanoid"
import {fileFromPath} from "formdata-node"

import {OnFileInitializer} from "./Initializers"
import {FileSizeLimitError} from "../error"
import {BusboyFile} from "../File"

import getFieldPath from "../util/getFieldPath"

const createOnFile: OnFileInitializer = ({limits}, cb) => (
  fieldname,
  stream,
  filename,
  enc,
  mime
) => {
  const path = join(tmpdir(), `${nanoid()}__${filename}`)

  async function onEnd() {
    try {
      const fieldPath = getFieldPath(fieldname)
      const file = await fileFromPath(path, {type: mime})

      cb(null, [
        fieldPath,

        new BusboyFile([file], path, filename, {enc, type: file.type})
      ])
    } catch (error) {
      cb(error)
    }
  }

  const onLimit = () => cb(
    new FileSizeLimitError(
      `Limit reached: Available up to ${limits!.fileSize} bytes per file.`
    )
  )

  stream
    .on("error", cb)
    .on("limit", onLimit)
    .on("end", onEnd)
    .pipe(createWriteStream(path))
}

export default createOnFile
