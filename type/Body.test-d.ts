import {expectType} from "tsd"

import FormData from "formdata-node"

import Body from "./Body"

interface User {
  name: string
  age: 27
}

expectType<User>(new Body<User>([["name", "John Doe"], ["age", 27]]).json())
expectType<User>(Body.json<User>([["name", "John Doe"], ["age", 27]]))

expectType<FormData>(new Body([["key", "value"]]).formData())
expectType<FormData>(Body.formData([["key", "value"]]))

expectType<boolean>(Body.isBody(new Body([["key", "value"]])))
expectType<Body<User>>(Body.from<User>([["name", "John Doe"], ["age", 27]]))

expectType<number>(new Body([["key", "value"]]).length)

expectType<Body>(new Body([["key", "value"]]).fields())
expectType<Body>(new Body([["key", "value"]]).files())


expectType<Body>(new Body([["key", "value"]]).map(() => {}))
expectType<Body>(new Body([["key", "value"]]).filter(() => false))

expectType<IterableIterator<string[]>>(new Body([["key", "value"]]).paths())
expectType<IterableIterator<string>>(new Body([["key", "value"]]).names())
expectType<IterableIterator<string | boolean | number>>(new Body([["key", "value"]]).values())
