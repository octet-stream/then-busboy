import type TypedEmitter from "typed-emitter"

import {BodyEntry} from "./Body"

export interface BodyEntriesEventsList {
  finish(): void;
  error(error: Error): void;
  "entry:push"(entry: BodyEntry): void;
  "entry:register"(): void;
}

export type BodyEntriesEvents = TypedEmitter<BodyEntriesEventsList>
