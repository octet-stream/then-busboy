import type {FileLike, Blob} from "formdata-node"

/**
 * BodyFile interface represents a File look-a-like object with two additional properties: path and enc.
 */
export interface BodyFile extends FileLike {
  /**
   * Returns a full path to file on disk
   */
  readonly path: string

  /**
   * Returns Content-Transfer-Encoding value
   */
  readonly enc?: string

  /**
   * Returns a Promise that resolves with the contents of the blob as binary data contained in an [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).
   */
  arrayBuffer(): Promise<ArrayBuffer>

  /**
   * Returns a Promise that resolves with string containing the contents of the File
   */
  text(): Promise<string>

  /**
   * Creates and returns a new [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) object which contains data from a subset of the blob on which it's called.
   *
   * @param start An index into the Blob indicating the first byte to include in the new Blob. If you specify a negative value, it's treated as an offset from the end of the Blob toward the beginning. For example, -10 would be the 10th from last byte in the Blob. The default value is 0. If you specify a value for start that is larger than the size of the source Blob, the returned Blob has size 0 and contains no data.
   * @param end An index into the Blob indicating the first byte that will *not* be included in the new Blob (i.e. the byte exactly at this index is not included). If you specify a negative value, it's treated as an offset from the end of the Blob toward the beginning. For example, -10 would be the 10th from last byte in the Blob. The default value is size.
   * @param contentType The content type to assign to the new Blob; this will be the value of its type property. The default value is an empty string.
   */
  slice(start?: number, end?: number, contentType?: string): Blob
}
