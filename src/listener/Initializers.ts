import type busboy from "busboy"

import type {BodyEntries} from "../BodyEntries.js"

import type {ParseOptions} from "../parse.js"

type OnFile = busboy.BusboyEvents["file"]
type OnField = busboy.BusboyEvents["field"]

interface Initializer<T extends OnFile | OnField> {
  (options: ParseOptions, entries: BodyEntries): T
}

export type OnFieldInitializer = Initializer<OnField>

export type OnFileInitializer = Initializer<OnFile>

export type NoopInitializer = Initializer<() => void>
