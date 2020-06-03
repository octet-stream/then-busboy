import test from "ava"
import sinon from "sinon"

import waterfall from "lib/util/arrayRunWaterfall"

test("Should always return a Promise", async t => {
  const actual = waterfall([
    () => Promise.resolve(0)
  ])

  t.true(actual instanceof Promise)

  await actual
})

test(
  "Should correctly resolve values even if tasks aren't return Promise",
  async t => {
    await t.notThrowsAsync(waterfall([() => 0]))

    t.is(await waterfall([() => 0]), 0)
  }
)

test("Should pass a result of previous task to the next", async t => {
  const taskOne = sinon.spy(() => "Hello")

  const taskTwo = sinon.spy(res => `${res}, world!`)

  await waterfall([taskOne, taskTwo])

  const [actual] = taskTwo.lastCall.args

  const expected = taskOne.lastCall.returnValue

  t.is(actual, expected)
})

test("Should resolve a correct value", async t => {
  const actual = await waterfall([
    () => "Hello",
    prev => `${prev}, world!`
  ])

  t.is(actual, "Hello, world!")
})

test("Should throw a TypeError when tasks list is not an array", async t => {
  const err = await t.throwsAsync(waterfall({}))

  t.true(err instanceof TypeError)
  t.is(err.message, "Tasks must be passed as an array.")
})

test("Should throw an error given task is not a function", async t => {
  await Promise.all([
    t.throwsAsync(waterfall([451])),

    t.throwsAsync(waterfall([() => 0, 451]))
  ])
})
