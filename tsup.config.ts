import {defineConfig} from "tsup"

export default defineConfig(() => ({
  format: ["esm", "cjs"],
  entry: ["src/index.ts"],
  outDir: "lib",
  dts: true,
  splitting: false,
  external: ["formdata-node", "busboy"]
}))
