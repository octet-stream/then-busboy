module.exports = {
  plugins: [
    "@babel/proposal-class-properties",
    "@babel/proposal-export-default-from",
    ["@babel/transform-modules-commonjs", {
      mjsStrictNamespace: false
    }],
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
