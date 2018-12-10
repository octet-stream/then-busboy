const toSubPath = path => path.map(key => `[${key}]`)

const pathToFieldname = ([root, ...path]) => `${root}${toSubPath(path)}`

export default pathToFieldname
