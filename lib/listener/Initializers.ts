import ParseOptions from "../ParseOptions"
import FieldPath from "../util/FieldPath"

import {OnField, OnFile} from "./Listeners"

interface InitializerCallback {
  (error: Error | null, result?: [FieldPath, unknown]): void;
}

interface Initializer<T extends OnFile | OnField> {
  (options: ParseOptions, callback: InitializerCallback): T;
}

export type OnFieldInitializer = Initializer<OnField>

export type OnFileInitializer = Initializer<OnFile>
