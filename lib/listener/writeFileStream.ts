import {createWriteStream} from "fs"
import {Readable} from "stream"

const writeFileStream = (path: string, stream: Readable) => new Promise<void>(
  (resolve, reject) => {
    const onLimit = () => {}

    stream
      .on("error", reject)
      .on("limit", onLimit)
      .on("end", resolve)
      .pipe(createWriteStream(path))
  }
)

export default writeFileStream
