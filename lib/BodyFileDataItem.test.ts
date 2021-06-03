import {resolve} from "path"
import {promises} from "fs"

import test from "ava"

import {fileFromPath, File} from "formdata-node"

import {BodyFileDataItem} from "./BodyFileDataItem"

const {readFile} = promises

const filePath = resolve("license")

test("Creates a new file data item", async t => {
  const file = new BodyFileDataItem({
    path: filePath,
    file: await fileFromPath(filePath)
  })

  t.true(file instanceof BodyFileDataItem)
})

test("The instance is a spec-compatible File", async t => {
  const file = new BodyFileDataItem({
    path: filePath,
    file: await fileFromPath(filePath)
  })

  t.true(file instanceof File)
})

test("Has correct path property", async t => {
  const file = new BodyFileDataItem({
    path: filePath,
    file: await fileFromPath(filePath)
  })

  t.is(file.path, filePath)
})

test("Has correct enc property", async t => {
  const file = new BodyFileDataItem({
    enc: "7bit",
    path: filePath,
    file: await fileFromPath(filePath)
  })

  t.is(file.enc, "7bit")
})

test("Has correct name property", async t => {
  const file = await fileFromPath(filePath)

  const actual = new BodyFileDataItem({path: filePath, file})

  t.is(actual.name, file.name)
})

test("Has correct size property", async t => {
  const file = await fileFromPath(filePath)

  const actual = new BodyFileDataItem({path: filePath, file})

  t.is(actual.size, file.size)
})

test("Has correct type property", async t => {
  const file = await fileFromPath(filePath)

  const actual = new BodyFileDataItem({path: filePath, file})

  t.is(actual.type, file.type)
})

test("Has correct lastModified property", async t => {
  const file = await fileFromPath(filePath)

  const actual = new BodyFileDataItem({path: filePath, file})

  t.is(actual.lastModified, file.lastModified)
})

test("Can be read as text", async t => {
  const expected = await readFile(filePath, "utf-8")

  const file = new BodyFileDataItem({
    path: filePath,
    file: await fileFromPath(filePath)
  })

  const actual = await file.text()

  t.is(actual, expected)
})

test("Can be read as ArrayBuffer", async t => {
  const expected = await readFile(filePath)

  const file = new BodyFileDataItem({
    path: filePath,
    file: await fileFromPath(filePath)
  })

  const actual = await file.arrayBuffer()

  t.true(actual instanceof ArrayBuffer, "Must be an ArrayBuffer")
  t.true(Buffer.from(actual).equals(expected))
})

test("Can be read as stream", async t => {
  const expected = await readFile(filePath)

  const file = new BodyFileDataItem({
    path: filePath,
    file: await fileFromPath(filePath)
  })

  const chunks: Buffer[] = []
  for await (const chunk of file.stream()) {
    chunks.push(chunk)
  }

  t.true(Buffer.concat(chunks).equals(expected))
})

test("Can be sliced", async t => {
  const file = await fileFromPath(filePath)

  const actual = new BodyFileDataItem({path: filePath, file}).slice(0, 15)

  t.is(await actual.text(), "The MIT License")
})

test("Can be sliced from arbitary start", async t => {
  const file = await fileFromPath(filePath)

  const actual = new BodyFileDataItem({path: filePath, file}).slice(4, 15)

  t.is(await actual.text(), "MIT License")
})

test("Can be sliced to empty file", async t => {
  const file = await fileFromPath(filePath)

  const actual = new BodyFileDataItem({path: filePath, file}).slice(0, 0)

  t.is<number>(actual.size, 0, "Must have 0 size")
  t.is<string>(await actual.text(), "", "Must return empty string")
})
