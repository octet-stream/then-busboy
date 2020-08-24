const toSubPath = path => path.map(key => `[${key}]`).join("")

const pathToFieldname = ([root, ...path]) => `${root}${toSubPath(path)}`

module.exports = pathToFieldname
