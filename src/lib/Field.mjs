/**
 * @api private
 */
class Field {
  constructor(params) {
    this.fieldname = params.fieldname
    this.value = params.value
    this.fieldnameTruncated = params.fieldnameTruncated
    this.valueTruncated = params.valueTruncated
    this.enc = params.enc
    this.mime = params.mime
  }
}

export default Field
