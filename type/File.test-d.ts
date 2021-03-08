import {Readable} from "stream"

import {expectType} from "tsd"

import File from "./File"

const file = new File({
  path: "./File.test-d.ts",
  originalFilename: "File.test-d.ts",
  mime: "text/plain",
  enc: ""
})

expectType<string>(file.originalFilename)
expectType<string>(file.filename)
expectType<string>(file.basename)
expectType<string>(file.extname)
expectType<string>(file.path)
expectType<string>(file.enc)
expectType<string>(file.mime)
expectType<Function>(file.stream)
expectType<Readable>(file.stream())
