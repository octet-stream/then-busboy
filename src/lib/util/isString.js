import getType from "lib/util/getType"

const isString = val => getType(val) === "string"

export default isString
