import type {BodyEntryPath} from "../Body"

const toSubPath = (path: BodyEntryPath) => path.map(key => `[${key}]`).join("")

const pathToFieldname = ([root, ...path]: BodyEntryPath) => (
  `${root}${toSubPath(path)}`
)

export default pathToFieldname
