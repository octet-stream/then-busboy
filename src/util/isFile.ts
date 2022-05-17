import {File} from "formdata-node"

import {BodyFile} from "../BodyFile.js"

const isFile = (value: unknown): value is BodyFile => (
  !!value && value instanceof File
)

export default isFile
