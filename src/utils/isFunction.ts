export type AnyFunction = (...args: any[]) => any

export const isFunction = (
  value: unknown
): value is AnyFunction => typeof value === "function"
