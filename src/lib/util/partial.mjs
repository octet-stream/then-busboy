const partial = (fn, args = []) => (...others) => fn(...args, ...others)

export default partial
