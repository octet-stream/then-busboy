import {defineBuildConfig} from "unbuild"

const formats = ["esm", "cjs"] as const

export default defineBuildConfig({
  clean: false,
  entries: formats.map(format => ({
    format,
    builder: "mkdist",
    input: "src",
    outDir: "lib",
    ext: format === "esm" ? "js" : "cjs",
    declaration: format === "esm",
    pattern: [
      "**/*.ts",
      "!**/*.test.ts",
      "!**/__helper__",
      "!**/__macro__",
      "!**/__fixture__",
      "!**/__helpers__",
      "!**/__macros__",
      "!**/__fixtures__"
    ]
  }))
})
