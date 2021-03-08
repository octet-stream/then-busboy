declare class RequestEntityTooLargeError extends Error {
  status: number
  code: string
  name: string

  constructor(message: string, code?: string)
}

export default RequestEntityTooLargeError
