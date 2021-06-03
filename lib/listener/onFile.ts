import {createWriteStream} from "fs"
import {tmpdir} from "os"
import {join} from "path"

import {nanoid} from "nanoid"
import {fileFromPath} from "formdata-node"

import {OnFileInitializer} from "./Initializers"

import {BodyFileDataItem} from "../BodyFileDataItem"

import getFieldPath from "../util/getFieldPath"
import createError from "../util/requestEntityTooLarge"

const createOnFile: OnFileInitializer = ({limits}, cb) => (
  fieldname,
  stream,
  filename,
  enc,
  mime
) => {
  const path = join(tmpdir(), `${nanoid()}__${filename}`)
  const dest = createWriteStream(path)

  async function onEnd() {
    try {
      const fieldPath = getFieldPath(fieldname)
      const file = await fileFromPath(path, {type: mime})

      cb(null, [fieldPath, new BodyFileDataItem({file, path, enc})])
    } catch (error) {
      cb(error)
    }
  }

  const onLimit = () => cb(
    createError(
      `Limit reached: Available up to ${limits!.fileSize} bytes per file.`
    )
  )

  stream
    .on("error", cb)
    .on("limit", onLimit)
    .on("end", onEnd)
    .pipe(dest)
}

export default createOnFile
