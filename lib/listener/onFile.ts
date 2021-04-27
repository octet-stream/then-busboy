import {createWriteStream, promises as fs} from "fs"
import {tmpdir} from "os"
import {join} from "path"

import {nanoid} from "nanoid"

import {OnFileInitializer} from "./Initializers"
import {File} from "../File"

import getFieldPath from "../util/getFieldPath"

const {stat} = fs

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

      const {} = await stat(path)

      const file = new File(path, fieldname)

      cb(null, [fieldPath, null])
    } catch (error) {
      cb(error)
    }
  }

  const onLimit = () => {}

  stream
    .on("error", cb)
    .on("limit", onLimit)
    .on("end", onEnd)
    .pipe(createWriteStream(path))
}

export default createOnFile
