import type {OnField, OnFile} from "./Listeners"
import type {BodyEntryPath} from "../Body"
import type {ParseOptions} from "../parse"

interface InitializerCallback {
  (error: Error | null, result?: [BodyEntryPath, unknown]): void;
}

interface Initializer<T extends OnFile | OnField> {
  (options: ParseOptions, callback: InitializerCallback): T;
}

export type OnFieldInitializer = Initializer<OnField>

export type OnFileInitializer = Initializer<OnFile>

export type NoopInitializer = Initializer<() => void>
