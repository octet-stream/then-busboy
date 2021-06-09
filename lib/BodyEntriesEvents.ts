import type TypedEmitter from "typed-emitter"

import type {BodyEntry} from "./Body"

export interface BodyEntriesEventsList {
  finish(): void;
  error(error: Error): void;
  push(entry: BodyEntry): void;
  register(): void;
}

export type BodyEntriesEvents = TypedEmitter<BodyEntriesEventsList>
