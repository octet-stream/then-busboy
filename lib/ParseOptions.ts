interface ParseOptions extends busboy.BusboyConfig {
  /**
   * Indicates whether then-busboy should cast fields values to their initial type
   */
  castTypes: boolean
}

export default ParseOptions
