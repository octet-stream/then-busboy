import {BusboyFile} from "./File"
import {Field} from "./Field"

export type BusboyEntryPath = string[]

export type BusboyEntryValue = BusboyFile | Field

export type BusboyEntry = [BusboyEntryPath, BusboyEntryValue]

export type BusboyEntries = BusboyEntry[]
