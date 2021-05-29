import {File} from "formdata-node"

const isFile = (value: unknown): value is File => value instanceof File

export default isFile
