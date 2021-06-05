import {EventEmitter} from "events"

import type {OnField, OnFile} from "./Listeners"
import type {ParseOptions} from "../parse"

interface Initializer<T extends OnFile | OnField> {
  (options: ParseOptions, emitter: EventEmitter): T
}

export type OnFieldInitializer = Initializer<OnField>

export type OnFileInitializer = Initializer<OnFile>

export type NoopInitializer = Initializer<() => void>
