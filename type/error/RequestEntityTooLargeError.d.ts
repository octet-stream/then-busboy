declare class RequestEntityTooLargeError extends Error {
  status: number
  code: string
  name: string
}

export default RequestEntityTooLargeError
