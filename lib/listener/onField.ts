import {OnFieldInitializer} from "./Initializers"

const createOnField: OnFieldInitializer = ({castTypes}, cb) => (
  name,
  value,
  fieldnameTruncated,
  valueTruncated,
  enc,
  mime
): void => {}

export default createOnField
