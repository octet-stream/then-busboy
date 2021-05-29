import {BusboyEntryPath} from "../BusboyEntries"

const toSubPath = (path: string[]) => path.map(key => `[${key}]`).join("")

const pathToFieldname = ([root, ...path]: BusboyEntryPath) => (
  `${root}${toSubPath(path)}`
)

export default pathToFieldname
