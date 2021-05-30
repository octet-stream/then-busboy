import {File} from "formdata-node"

import {BusboyFile} from "./File"
import {Field} from "./Field"

export type BusboyEntryPath = Array<string | number>

export type BusboyEntryValue = BusboyFile | File | Field

export type BusboyEntry = [BusboyEntryPath, BusboyEntryValue]

export type BusboyEntries = BusboyEntry[]
