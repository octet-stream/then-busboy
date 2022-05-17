import create from "http-errors"

const requestEntityTooLarge = (message: string) => create(413, message)

export default requestEntityTooLarge
