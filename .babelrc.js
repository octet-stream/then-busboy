const config = {
  plugins: [
    "@babel/proposal-class-properties",
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

if (!process.env.BABEL_ESM) {
  config.plugins.push(
    "@babel/transform-modules-commonjs",
    "@babel/proposal-export-default-from"
  )
}

module.exports = config
