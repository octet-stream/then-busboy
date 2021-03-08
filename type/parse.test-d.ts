import {IncomingMessage} from "http"
import {Socket} from "net"

import {expectType} from "tsd"

import parse from "./parse";
import Body from "./Body"

const req = new IncomingMessage(new Socket())

interface User {
  name: string
  age: 27
}

expectType<Promise<Body>>(parse(req))
expectType<Promise<Body<User>>>(parse<User>(req))
