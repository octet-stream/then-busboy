import FormData from "formdata-node"

type Scalar = string | number | boolean

type Entries = [string[], Scalar]

declare class Body<T extends Record<string, any>> {
   /**
   * Check if given value is Body instance
   *
   * @param value
   */
  static isBody(value: any): boolean

  /**
   * Create a new Body from given entries.
   * An alias of `new Body(entries)`
   *
   * @param entries
   */
  static from(entries: Entries): Body<T>

  /**
   * Return an object with data taken from given entries or Body
   *
   * @param value
   */
  static json(value: Body | Entries): T

  /**
   * Return a FormData instance with data taken from given entries or Body
   *
   * @param value
   */
  static formData(value: Body | Entries): FormData

  /**
   * Create a new Body from given entries
   *
   * @param entries
   */
  constructor(entries: Entries)

  /**
   * Return an amount of entries in current Body instance
   *
   */
  length: number

  /**
   * Return a new Body that contains fields only
   */
  fields(): Body<T>

  /**
   * Return a new Body that contains files only
   */
  filed(): Body<T>

  [Symbol.iterator](): IterableIterator<Scalar>

  /**
   * Return an iterator allowing to go through the Body fields path
   */
  paths(): IterableIterator<string[]>

  /**
   * Return an iterator allowing to go through the Body fields name
   */
  names(): IterableIterator<string>

  /**
   * Return an iterator allowing to go through the Body values
   */
  values(): IterableIterator<Scalar>

  /**
   * Return an array of entries in current Body instance
   */
  entries(): Entries

  /**
   * Create a new Body with the results of calling a provided function
   * on every entry in the calling Body
   *
   * @param callbackFn Function to execute for each entry.
   *
   * @param thisArg
   */
  map(callbackFn: (value: any, index: number, array: any[]) => unknown, thisArg: any): unknown[]

  /**
   * Execute a given callback for each entry of the Body instance
   *
   * @param callbackFn Function to execute for each element..
   *
   * @param thisArg
   */
  filter(callbackFn: (value: any, index: number, array: any[]) => boolean, thisArg: any): unknown[]

  /**
   * Return an object with data taken the current Body instance
   */
  json(): T

  /**
   * Return a FormData with data taken the current Body instance
   */
  formData(): FormData
}

export default Body
