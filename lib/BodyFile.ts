import type {FileLike} from "formdata-node"

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
}
