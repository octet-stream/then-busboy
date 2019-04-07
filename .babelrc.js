const config = {
  plugins: [
    "@babel/proposal-class-properties",
    "@babel/proposal-export-default-from",
    ["@babel/proposal-object-rest-spread", {
      useBuiltIns: true
    }],
    ["@babel/proposal-decorators", {
      legacy: true
    }],
    ["module-resolver", {
      root: ["src"],
    }]
  ]
}

if (!("BABEL_ESM" in process.env)) {
  config.plugins.push("@babel/transform-modules-commonjs")
}

module.exports = config
