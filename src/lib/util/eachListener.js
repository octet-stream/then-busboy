import leadToLowerCase from "lib/util/leadToLowerCase"

const entries = Object.entries

function eachListener(target, listeners, callee) {
  for (const [key, fn] of entries(listeners)) {
    const name = key.startsWith("on") ? leadToLowerCase(key.slice(2)) : key

    if (!(["error", "end"].includes(name))) {
      callee(target, name, fn)
    }
  }
}

export default eachListener
