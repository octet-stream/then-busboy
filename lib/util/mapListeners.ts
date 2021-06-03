const toLowerCase = (str: string) => String.prototype.toLowerCase.call(str)

const leadToLowerCase = (str: string) => (
  `${toLowerCase(str.charAt(0))}${str.slice(1)}`
)

interface MapListenersCallback {
  (value: any, name: string, object: object): any
}

function mapListeners(listeners: object, fn: MapListenersCallback): object {
  const result: Record<string, any> = {}

  for (const [key, value] of Object.entries(listeners)) {
    const name = key.startsWith("on") ? leadToLowerCase(key.slice(2)) : key

    result[name] = fn(value, name, listeners)
  }

  return result
}

export default mapListeners
