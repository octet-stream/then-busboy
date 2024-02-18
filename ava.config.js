export default {
  failFast: true,
  workerThreads: false, // Disable to make tsx work
  extensions: {
    ts: "module"
  },
  files: [
    "src/**/*.test.ts"
  ]
}
