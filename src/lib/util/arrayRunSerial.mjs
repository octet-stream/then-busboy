/**
 * @api private
 */
function arrayRunSerial(tasks, args) {
  const step = (prev, next) => Promise.resolve(prev).then(() => next(...args))

  if (tasks.length <= 1) {
    return step(undefined, tasks[0])
  }

  return tasks.reduce(step)
}

export default arrayRunSerial
