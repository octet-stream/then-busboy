import {Server} from "http"

import {Encoder} from "form-data-encoder"
import {FormData} from "formdata-node"

import supertest from "supertest"

/**
 * Sends custom encoded `multipart/form-data` request to given server using `supertest`
 *
 * @param server A server to use in supertest request
 * @param body Request body. Must be a FormData instance.
 *
 * @returns Server response
 */
async function createRequest(server: Server, body: FormData) {
  const encoder = new Encoder(body)

  const request = supertest(server).post("/").set(encoder.headers)

  for await (const chunk of encoder) {
    // This conversion is only necessary to meet type checking restrictions at `request.write`
    request.write(Buffer.from(chunk))
  }

  return request
}

export default createRequest
