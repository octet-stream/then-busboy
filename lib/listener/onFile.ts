import {createWriteStream} from "fs"
import {tmpdir} from "os"
import {join} from "path"

import {nanoid} from "nanoid"

import {OnFileInitializer} from "./Initializers"
import {File} from "../File"

import getFieldPath from "../util/getFieldPath"

const createOnFile: OnFileInitializer = ({limits}, cb) => (
  fieldname,
  stream,
  filename,
  enc,
  mime
) => {
  try {
    const fieldPath = getFieldPath(fieldname)
    const path = join(tmpdir(), `${nanoid()}__${filename}`)

    function onEnd() {
      cb(null, [fieldPath, null])
    }

    const onLimit = () => {}

    stream
      .on("error", cb)
      .on("limit", onLimit)
      .on("end", onEnd)
      .pipe(createWriteStream(path))
  } catch (error) {
    cb(error)
  }
}

export default createOnFile
